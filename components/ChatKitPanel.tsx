"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChatKit, useChatKit } from "@openai/chatkit-react";
import {
  STARTER_PROMPTS,
  PLACEHOLDER_INPUT,
  GREETING,
  CREATE_SESSION_ENDPOINT,
  WORKFLOW_ID,
  getThemeConfig,
} from "@/lib/config";
import { ErrorOverlay } from "./ErrorOverlay";
import { VoiceInputButton } from "./VoiceInputButton";
import type { ColorScheme } from "@/hooks/useColorScheme";
import { useFontSize } from "@/contexts/FontSizeContext";
import { correctMedicalTerms } from "@/lib/medicalTermsCorrection";

export type FactAction = {
  type: "save";
  factId: string;
  factText: string;
};

type ChatKitPanelProps = {
  theme: ColorScheme;
  onWidgetAction: (action: FactAction) => Promise<void>;
  onResponseEnd: () => void;
  onThemeRequest: (scheme: ColorScheme) => void;
  onOpenResourcePanel: () => void;
};

type ErrorState = {
  script: string | null;
  session: string | null;
  integration: string | null;
  retryable: boolean;
};

const isBrowser = typeof window !== "undefined";
const isDev = process.env.NODE_ENV !== "production";

const createInitialErrors = (): ErrorState => ({
  script: null,
  session: null,
  integration: null,
  retryable: false,
});

export function ChatKitPanel({
  theme,
  onWidgetAction,
  onResponseEnd,
  onThemeRequest,
  onOpenResourcePanel,
}: ChatKitPanelProps) {
  const { fontSize } = useFontSize();
  const processedFacts = useRef(new Set<string>());
  const [errors, setErrors] = useState<ErrorState>(() => createInitialErrors());
  const [isInitializingSession, setIsInitializingSession] = useState(true);
  const isMountedRef = useRef(true);
  const [scriptStatus, setScriptStatus] = useState<
    "pending" | "ready" | "error"
  >(() =>
    isBrowser && window.customElements?.get("openai-chatkit")
      ? "ready"
      : "pending"
  );
  const [widgetInstanceKey, setWidgetInstanceKey] = useState(0);

  const setErrorState = useCallback((updates: Partial<ErrorState>) => {
    setErrors((current) => ({ ...current, ...updates }));
  }, []);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!isBrowser) {
      return;
    }

    let timeoutId: number | undefined;

    const handleLoaded = () => {
      if (!isMountedRef.current) {
        return;
      }
      setScriptStatus("ready");
      setErrorState({ script: null });
    };

    const handleError = (event: Event) => {
      console.error("Failed to load chatkit.js for some reason", event);
      if (!isMountedRef.current) {
        return;
      }
      setScriptStatus("error");
      const detail = (event as CustomEvent<unknown>)?.detail ?? "unknown error";
      setErrorState({ script: `Error: ${detail}`, retryable: false });
      setIsInitializingSession(false);
    };

    window.addEventListener("chatkit-script-loaded", handleLoaded);
    window.addEventListener(
      "chatkit-script-error",
      handleError as EventListener
    );

    if (window.customElements?.get("openai-chatkit")) {
      handleLoaded();
    } else if (scriptStatus === "pending") {
      timeoutId = window.setTimeout(() => {
        if (!window.customElements?.get("openai-chatkit")) {
          handleError(
            new CustomEvent("chatkit-script-error", {
              detail:
                "ChatKit web component is unavailable. Verify that the script URL is reachable.",
            })
          );
        }
      }, 5000);
    }

    return () => {
      window.removeEventListener("chatkit-script-loaded", handleLoaded);
      window.removeEventListener(
        "chatkit-script-error",
        handleError as EventListener
      );
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [scriptStatus, setErrorState]);

  const isWorkflowConfigured = Boolean(
    WORKFLOW_ID && !WORKFLOW_ID.startsWith("wf_replace")
  );

  useEffect(() => {
    if (!isWorkflowConfigured && isMountedRef.current) {
      setErrorState({
        session: "Set NEXT_PUBLIC_CHATKIT_WORKFLOW_ID in your .env.local file.",
        retryable: false,
      });
      setIsInitializingSession(false);
    }
  }, [isWorkflowConfigured, setErrorState]);

  const handleResetChat = useCallback(() => {
    processedFacts.current.clear();
    if (isBrowser) {
      setScriptStatus(
        window.customElements?.get("openai-chatkit") ? "ready" : "pending"
      );
    }
    setIsInitializingSession(true);
    setErrors(createInitialErrors());
    setWidgetInstanceKey((prev) => prev + 1);
  }, []);

  const getClientSecret = useCallback(
    async (currentSecret: string | null) => {
      if (isDev) {
        console.info("[ChatKitPanel] getClientSecret invoked", {
          currentSecretPresent: Boolean(currentSecret),
          workflowId: WORKFLOW_ID,
          endpoint: CREATE_SESSION_ENDPOINT,
        });
      }

      if (!isWorkflowConfigured) {
        const detail =
          "Set NEXT_PUBLIC_CHATKIT_WORKFLOW_ID in your .env.local file.";
        if (isMountedRef.current) {
          setErrorState({ session: detail, retryable: false });
          setIsInitializingSession(false);
        }
        throw new Error(detail);
      }

      if (isMountedRef.current) {
        if (!currentSecret) {
          setIsInitializingSession(true);
        }
        setErrorState({ session: null, integration: null, retryable: false });
      }

      try {
        const response = await fetch(CREATE_SESSION_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            workflow: { id: WORKFLOW_ID },
            chatkit_configuration: {
              // enable attachments
              file_upload: {
                enabled: true,
              },
            },
          }),
        });

        const raw = await response.text();
        console.log("[ChatKitPanel] createSession raw body:", raw);

        if (isDev) {
          console.info("[ChatKitPanel] createSession response", {
            status: response.status,
            ok: response.ok,
            bodyPreview: raw.slice(0, 1600),
          });
        }

        let data: Record<string, unknown> = {};
        if (raw) {
          try {
            data = JSON.parse(raw) as Record<string, unknown>;
          } catch (parseError) {
            console.error(
              "Failed to parse create-session response",
              parseError
            );
          }
        }

        if (!response.ok) {
          const detail = extractErrorDetail(data, response.statusText);
          console.error("Create session request failed", {
            status: response.status,
            body: data,
          });
          throw new Error(detail);
        }

        const clientSecret = data?.client_secret as string | undefined;
        if (!clientSecret) {
          throw new Error("Missing client secret in response");
        }

        if (isMountedRef.current) {
          setErrorState({ session: null, integration: null });
        }

        return clientSecret;
      } catch (error) {
        console.error("Failed to create ChatKit session", error);
        const detail =
          error instanceof Error
            ? error.message
            : "Unable to start ChatKit session.";
        if (isMountedRef.current) {
          setErrorState({ session: detail, retryable: false });
        }
        throw error instanceof Error ? error : new Error(detail);
      } finally {
        console.log("[ChatKitPanel] getClientSecret completed");
        console.log({ isMounted: isMountedRef.current, currentSecret });
        if (isMountedRef.current && !currentSecret) {
          setIsInitializingSession(false);
        }
        console.log("[ChatKitPanel] isInitializingSession set to false");
      }
    },
    [isWorkflowConfigured, setErrorState]
  );

  const baseSize = fontSize === "small" ? 14 : fontSize === "large" ? 18 : 16;
  
  const chatkit = useChatKit({
    api: { getClientSecret },
    theme: {
      colorScheme: theme,
      ...getThemeConfig(theme, baseSize),
    },
    startScreen: {
      greeting: GREETING,
      prompts: STARTER_PROMPTS,
    },
    composer: {
      placeholder: PLACEHOLDER_INPUT,
      attachments: {
        // Enable attachments
        enabled: true,
      },
    },
    threadItemActions: {
      feedback: false,
    },
    widgets: {
      onAction: async (action: { type: string; [key: string]: unknown }) => {
        if (isDev) {
          console.info("[ChatKitPanel] widget action received:", action);
        }

        // Handle MOCA test action
        if (action.type === "moca.start") {
          if (isDev) {
            console.debug("[ChatKitPanel] opening resource panel for MOCA test");
          }
          onOpenResourcePanel();
          return;
        }

        // Handle weather refresh action
        if (action.type === "refresh_weather") {
          try {
            const location = action.location || "San Francisco";
            if (isDev) {
              console.debug("[ChatKitPanel] refreshing weather for:", location);
            }

            const response = await fetch("/api/tools", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                toolName: "get_weather",
                params: { location },
              }),
            });

            const data = await response.json();

            // Note: Cannot access chatkit.control here, so we can't send actions back
            if (data.success) {
              console.debug("[ChatKitPanel] weather data refreshed:", data);
            }
          } catch (error) {
            console.error("[ChatKitPanel] weather refresh error:", error);
          }
          return;
        }

        // Handle legacy save action (backward compatibility)
        if (action.type === "save") {
          const factAction = action as FactAction;
          await onWidgetAction(factAction);
          return;
        }

        // Warn about unhandled action types
        console.warn("[ChatKitPanel] unhandled widget action type:", action.type);
      },
    },
    onClientTool: async (invocation: {
      name: string;
      params: Record<string, unknown>;
    }) => {
      if (invocation.name === "switch_theme") {
        const requested = invocation.params.theme;
        if (requested === "light" || requested === "dark") {
          if (isDev) {
            console.debug("[ChatKitPanel] switch_theme", requested);
          }
          onThemeRequest(requested);
          return { success: true };
        }
        return { success: false };
      }

      if (invocation.name === "record_fact") {
        const id = String(invocation.params.fact_id ?? "");
        const text = String(invocation.params.fact_text ?? "");
        if (!id || processedFacts.current.has(id)) {
          return { success: true };
        }
        processedFacts.current.add(id);
        void onWidgetAction({
          type: "save",
          factId: id,
          factText: text.replace(/\s+/g, " ").trim(),
        });
        return { success: true };
      }

      if (invocation.name === "get_weather") {
        try {
          if (isDev) {
            console.debug("[ChatKitPanel] get_weather", invocation.params);
          }
          
          // 调用服务器端API route
          const response = await fetch("/api/tools", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              toolName: "get_weather",
              params: invocation.params,
            }),
          });

          const data = await response.json();
          
          // Return widget data - Agent Builder will handle the conversational text
          if (data.success) {
            return {
              success: true,
              widget: {
                name: "weatherForecast",
                state: {
                  background: data.background,
                  conditionImage: data.conditionImage,
                  lowTemperature: data.lowTemperature,
                  highTemperature: data.highTemperature,
                  location: data.location,
                  conditionDescription: data.conditionDescription,
                  forecast: data.forecast
                }
              }
            };
          }
          
          return data;
        } catch (error) {
          console.error("[ChatKitPanel] get_weather error", error);
          return { success: false, error: "Failed to fetch weather data" };
        }
      }

      // Supabase tools
      if (invocation.name === "get_user_profile") {
        try {
          if (isDev) {
            console.debug("[ChatKitPanel] get_user_profile", invocation.params);
          }
          
          const response = await fetch("/api/tools", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              toolName: "get_user_profile",
              params: invocation.params,
            }),
          });

          const data = await response.json();
          return data;
        } catch (error) {
          console.error("[ChatKitPanel] get_user_profile error", error);
          return { success: false, error: "Failed to get user profile" };
        }
      }

      if (invocation.name === "save_user_profile") {
        try {
          if (isDev) {
            console.debug("[ChatKitPanel] save_user_profile", invocation.params);
          }
          
          const response = await fetch("/api/tools", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              toolName: "save_user_profile",
              params: invocation.params,
            }),
          });

          const data = await response.json();
          return data;
        } catch (error) {
          console.error("[ChatKitPanel] save_user_profile error", error);
          return { success: false, error: "Failed to save user profile" };
        }
      }

      if (invocation.name === "get_trial_interests") {
        try {
          if (isDev) {
            console.debug("[ChatKitPanel] get_trial_interests", invocation.params);
          }
          
          const response = await fetch("/api/tools", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              toolName: "get_trial_interests",
              params: invocation.params,
            }),
          });

          const data = await response.json();
          return data;
        } catch (error) {
          console.error("[ChatKitPanel] get_trial_interests error", error);
          return { success: false, error: "Failed to get trial interests" };
        }
      }

      if (invocation.name === "save_trial_interest") {
        try {
          if (isDev) {
            console.debug("[ChatKitPanel] save_trial_interest", invocation.params);
          }
          
          const response = await fetch("/api/tools", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              toolName: "save_trial_interest",
              params: invocation.params,
            }),
          });

          const data = await response.json();
          return data;
        } catch (error) {
          console.error("[ChatKitPanel] save_trial_interest error", error);
          return { success: false, error: "Failed to save trial interest" };
        }
      }

      // Clinical trials search
      if (invocation.name === "get_trials") {
        try {
          if (isDev) {
            console.debug("[ChatKitPanel] get_trials", invocation.params);
          }
          
          const response = await fetch("/api/tools", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              toolName: "get_trials",
              params: invocation.params,
            }),
          });

          const data = await response.json();
          return data;
        } catch (error) {
          console.error("[ChatKitPanel] get_trials error", error);
          return { success: false, error: "Failed to search clinical trials" };
        }
      }

      return { success: false };
    },
    onResponseEnd: () => {
      onResponseEnd();
    },
    onResponseStart: () => {
      setErrorState({ integration: null, retryable: false });
    },
    onThreadChange: () => {
      processedFacts.current.clear();
    },
    onError: ({ error }: { error: unknown }) => {
      // Note that Chatkit UI handles errors for your users.
      // Thus, your app code doesn't need to display errors on UI.
      console.error("ChatKit error", error);
    },
  });

  const activeError = errors.session ?? errors.integration;
  const blockingError = errors.script ?? activeError;

  if (isDev) {
    console.debug("[ChatKitPanel] render state", {
      isInitializingSession,
      hasControl: Boolean(chatkit.control),
      scriptStatus,
      hasError: Boolean(blockingError),
      workflowId: WORKFLOW_ID,
    });
  }

  useEffect(() => {
    if (chatkit.control && isInitializingSession) {
      console.log("[ChatKitPanel] ChatKit ready → stop loading");
      setIsInitializingSession(false);
    }
  }, [chatkit.control, isInitializingSession]);

  // Handle voice input transcript
  const handleVoiceTranscript = useCallback((transcript: string) => {
    const correctedText = correctMedicalTerms(transcript);
    
    if (isDev) {
      console.log("[VoiceInput] Original:", transcript);
      console.log("[VoiceInput] Corrected:", correctedText);
      console.log("[VoiceInput] ChatKit control available:", Boolean(chatkit.control));
      console.log("[VoiceInput] ChatKit ref available:", Boolean(chatkit.ref?.current));
      console.log("[VoiceInput] Is initializing:", isInitializingSession);
    }

    if (!correctedText.trim()) {
      return;
    }

    // Wait for ChatKit to be fully ready
    if (!chatkit.control || isInitializingSession) {
      console.warn('[VoiceInput] ⚠️ ChatKit not ready yet, waiting...');
      // Retry after a short delay
      setTimeout(() => {
        if (chatkit.control && !isInitializingSession) {
          handleVoiceTranscript(transcript);
        } else {
          console.error('[VoiceInput] ❌ ChatKit still not ready after delay');
        }
      }, 500);
      return;
    }

    // Use ChatKit's official setComposerValue API
    try {
      // Try using the ref.current instance directly
      if (chatkit.ref?.current) {
        chatkit.ref.current.setComposerValue({ text: correctedText });
        chatkit.ref.current.focusComposer();
        if (isDev) {
          console.log('[VoiceInput] ✅ Text set via ref.current.setComposerValue');
        }
      } else {
        // Fallback to direct method call
        chatkit.setComposerValue({ text: correctedText });
        chatkit.focusComposer?.();
        if (isDev) {
          console.log('[VoiceInput] ✅ Text set via chatkit.setComposerValue');
        }
      }
    } catch (err) {
      console.error('[VoiceInput] ❌ Failed to set composer value:', err);
    }
  }, [chatkit, isInitializingSession]);
  
  return (
    <div className="chatkit-panel-container relative pb-8 flex h-[90vh] w-full rounded-2xl flex-col overflow-hidden bg-white shadow-sm transition-colors dark:bg-slate-900 z-0">
      <ChatKit
        key={widgetInstanceKey}
        control={chatkit.control}
        className={
          blockingError || isInitializingSession
            ? "pointer-events-none opacity-0"
            : "block h-full w-full"
        }
      />
      
      {/* Voice Input Button - positioned at same level as ChatKit */}
      {!blockingError && !isInitializingSession && (
        <div 
          className="absolute bottom-11 md:bottom-13 left-1/2 -translate-x-1/2 w-[calc(100%-24px)] md:w-[calc(100%-40px)] max-w-[771px] flex items-center justify-end"
          style={{ height: '56px', border: '0px solid red' }}
        >
          <VoiceInputButton onTranscript={handleVoiceTranscript} className="mr-14" />
        </div>
      )}
      
      <ErrorOverlay
        error={blockingError}
        fallbackMessage={
          blockingError || !isInitializingSession
            ? null
            : "Loading assistant session..."
        }
        onRetry={blockingError && errors.retryable ? handleResetChat : null}
        retryLabel="Restart chat"
      />
    </div>
  );
}

function extractErrorDetail(
  payload: Record<string, unknown> | undefined,
  fallback: string
): string {
  if (!payload) {
    return fallback;
  }

  const error = payload.error;
  if (typeof error === "string") {
    return error;
  }

  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof (error as { message?: unknown }).message === "string"
  ) {
    return (error as { message: string }).message;
  }

  const details = payload.details;
  if (typeof details === "string") {
    return details;
  }

  if (details && typeof details === "object" && "error" in details) {
    const nestedError = (details as { error?: unknown }).error;
    if (typeof nestedError === "string") {
      return nestedError;
    }
    if (
      nestedError &&
      typeof nestedError === "object" &&
      "message" in nestedError &&
      typeof (nestedError as { message?: unknown }).message === "string"
    ) {
      return (nestedError as { message: string }).message;
    }
  }

  if (typeof payload.message === "string") {
    return payload.message;
  }

  return fallback;
}
