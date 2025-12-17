import { ColorScheme, StartScreenPrompt, ThemeOption } from "@openai/chatkit";

export const WORKFLOW_ID =
  process.env.NEXT_PUBLIC_CHATKIT_WORKFLOW_ID?.trim() ?? "";

export const CREATE_SESSION_ENDPOINT = "/api/create-session";

export const STARTER_PROMPTS: StartScreenPrompt[] = [
  {
    label: "What is ADRD?",
    prompt: "Can you explain what ADRD is and why clinical trials are important?",
    icon: "circle-question",
  },
  {
    label: "Find trials for me",
    prompt: "How can I find clinical trials that might be right for me?",
    icon: "search",
  },
  {
    label: "Trial participation",
    prompt: "What should I expect when participating in a clinical trial?",
    icon: "notebook",
  },
];

export const PLACEHOLDER_INPUT = "Ask about clinical trials, ADRD, or get personalized guidance...";

export const GREETING = "Welcome to TrialChat! I'm here to help you navigate ADRD clinical trials. How can I assist you today?";

export const getThemeConfig = (
  theme: ColorScheme,
  baseSize?: 14 | 15 | 16 | 17 | 18
): ThemeOption => ({
  color: {
    grayscale: {
      hue: 215,  // 蓝色调的灰度，更符合医疗科技感
      tint: 5,
      shade: theme === "dark" ? -1 : -3,
    },
    accent: {
      primary: theme === "dark" ? "#60a5fa" : "#2563eb",  // 蓝色主题色，匹配 TrialChat
      level: 2,  // 稍微增强对比度
    },
  },
  radius: "round",  // 圆润的边角，友好亲和
  density: "normal",  // 正常间距，适合老年人阅读
  ...(baseSize && {
    typography: {
      baseSize,
    },
  }),
  // chatkit.studio/playground to explore config options
});
