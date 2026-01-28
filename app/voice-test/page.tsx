"use client";

import { useState, useEffect } from "react";
import { VoiceInputButton } from "@/components/VoiceInputButton";

export default function VoiceTestPage() {
  const [transcript, setTranscript] = useState("");
  const [isSecureContext, setIsSecureContext] = useState(false);
  const [protocol, setProtocol] = useState("");
  const [hasSpeechAPI, setHasSpeechAPI] = useState(false);
  const [userAgent, setUserAgent] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsSecureContext(window.isSecureContext);
    setProtocol(window.location.protocol);
    setHasSpeechAPI('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
    setUserAgent(navigator.userAgent);
    setIsMobile(/Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
    
    console.log('[VoiceTest] User Agent:', navigator.userAgent);
    console.log('[VoiceTest] Is Secure Context:', window.isSecureContext);
    console.log('[VoiceTest] SpeechRecognition available:', 'SpeechRecognition' in window);
    console.log('[VoiceTest] webkitSpeechRecognition available:', 'webkitSpeechRecognition' in window);
  }, []);

  const handleTranscript = (text: string) => {
    console.log("[VoiceTestPage] Received transcript:", text);
    setTranscript((prev) => prev + " " + text);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          Voice Input Test
        </h1>

        {/* Diagnostic Info */}
        <div className="mb-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
          <h3 className="text-sm font-semibold text-yellow-900 dark:text-yellow-300 mb-2">
            🔍 Environment Check
          </h3>
          <ul className="text-xs text-yellow-800 dark:text-yellow-400 space-y-1 font-mono">
            <li>Protocol: {protocol || "loading..."}</li>
            <li>Secure Context: {isSecureContext ? "✅ Yes" : "❌ No"}</li>
            <li>Speech API Available: {hasSpeechAPI ? "✅ Yes" : "❌ No"}</li>
            <li>Device: {isMobile ? "📱 Mobile" : "💻 Desktop"}</li>
            <li>Hostname: {typeof window !== 'undefined' ? window.location.hostname : "loading..."}</li>
            <li className="break-all">User Agent: {userAgent || "loading..."}</li>
          </ul>
          {!isSecureContext && (
            <p className="mt-3 text-sm text-yellow-900 dark:text-yellow-300 font-semibold">
              ⚠️ Not a secure context! Voice input requires HTTPS on mobile.
            </p>
          )}
          {isMobile && !hasSpeechAPI && isSecureContext && (
            <p className="mt-3 text-sm text-red-900 dark:text-red-300 font-semibold">
              ❌ Web Speech API not available on this mobile browser/version!
              <br />Try using Chrome (Android) or Safari (iOS 14.5+).
            </p>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Transcript
          </label>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            className="w-full h-40 p-4 border border-gray-300 dark:border-gray-600 rounded-lg resize-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            placeholder="Voice input will appear here..."
          />
          <button
            onClick={() => setTranscript("")}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Clear
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Voice Button
          </h2>
          <div className="flex justify-center items-center h-32 relative">
            <VoiceInputButton onTranscript={handleTranscript} />
          </div>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
            Click the microphone button and speak. Check browser console for debug logs.
          </p>
        </div>

        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
            🛠️ Setup HTTPS for Mobile Testing
          </h3>
          <div className="text-xs text-blue-800 dark:text-blue-400 space-y-2">
            <p className="font-semibold">Option 1: Using ngrok (easiest)</p>
            <pre className="bg-blue-100 dark:bg-blue-950 p-2 rounded overflow-x-auto">
              brew install ngrok{'\n'}
              ngrok http 3000
            </pre>
            <p className="font-semibold mt-3">Option 2: Local HTTPS</p>
            <pre className="bg-blue-100 dark:bg-blue-950 p-2 rounded overflow-x-auto">
              npm install --save-dev mkcert{'\n'}
              npx mkcert create-ca{'\n'}
              npx mkcert create-cert
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
