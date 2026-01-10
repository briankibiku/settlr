import { useState, useEffect, useRef } from "react";
import Sidebar from "../components/layout/Sidebar";
import { useAuth } from "../context/AuthContext";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Call the real API
  const analyzeCaseAPI = async (injuries) => {
    try {
      const response = await fetch("https://settlr-backend-bto2.onrender.com/analyze-case", {
      // const response = await fetch("http://localhost:8000/analyze-case", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          injuries: injuries,
          case_description: "road traffic accident",
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  };

  // Format the API response into a readable message
  const formatAIResponse = (apiData) => {
    const { damages_estimate, similar_cases } = apiData;

    let response = `📊 **Damages Estimate Analysis**\n\n`;

    // Damages Range
    response += `💰 **Estimated Range:**\n`;
    response += `• Low Estimate: KES ${damages_estimate.low_estimate.toLocaleString()}\n`;
    response += `• High Estimate: KES ${damages_estimate.high_estimate.toLocaleString()}\n`;
    response += `• Midpoint: KES ${damages_estimate.midpoint_estimate.toLocaleString()}\n\n`;

    // Confidence Level
    const confidenceEmoji = {
      HIGH: "🟢",
      MEDIUM: "🟡",
      LOW: "🔴",
    };
    response += `${
      confidenceEmoji[damages_estimate.confidence] || "⚪"
    } **Confidence Level:** ${damages_estimate.confidence}\n\n`;

    // Key Factors
    if (
      damages_estimate.key_factors &&
      damages_estimate.key_factors.length > 0
    ) {
      response += `🔑 **Key Factors:**\n`;
      damages_estimate.key_factors.forEach((factor) => {
        response += `• ${factor}\n`;
      });
      response += "\n";
    }

    // Reasoning
    response += `📝 **Analysis:**\n${damages_estimate.reasoning}\n\n`;

    // Similar Cases
    if (similar_cases && similar_cases.length > 0) {
      response += `⚖️ **Comparable Cases (${similar_cases.length}):**\n\n`;
      similar_cases.forEach((caseItem, index) => {
        response += `${index + 1}. **${caseItem.case_name}**\n`;
        response += `   • Court: ${caseItem.court || "N/A"}\n`;
        response += `   • Year: ${caseItem.year || "N/A"}\n`;
        response += `   • Award: KES ${
          caseItem.damages_awarded?.toLocaleString() || "N/A"
        }\n`;
        if (
          caseItem.injuries_mentioned &&
          caseItem.injuries_mentioned.length > 0
        ) {
          response += `   • Injuries: ${caseItem.injuries_mentioned.join(
            ", "
          )}\n`;
        }
        response += `   • URL: ${caseItem.url}\n\n`;
      });
    }

    return response;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!inputMessage.trim() || isLoading) return;

    // Add user message
    const userMsg = {
      id: Date.now(),
      type: "user",
      text: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentInput = inputMessage;
    setInputMessage("");
    setIsLoading(true);

    try {
      // Call real API
      const apiResponse = await analyzeCaseAPI(currentInput);

      // Format the response
      const aiResponseText = formatAIResponse(apiResponse);

      // Add AI message with formatted response
      const aiMsg = {
        id: Date.now() + 1,
        type: "ai",
        text: aiResponseText,
        timestamp: new Date(),
        apiData: apiResponse, // Store raw data for potential future use
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      // Add error message
      const errorMsg = {
        id: Date.now() + 1,
        type: "ai",
        text: `❌ **Error**\n\nI encountered an error while analyzing your case: ${error.message}\n\nPlease try again or contact support if the issue persists.`,
        timestamp: new Date(),
        isError: true,
      };

      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Render formatted message with markdown-like styling
  const renderMessage = (text) => {
    return text.split("\n").map((line, index) => {
      // Bold text
      if (line.includes("**")) {
        const parts = line.split("**");
        return (
          <p key={index} className="mb-1">
            {parts.map((part, i) =>
              i % 2 === 1 ? (
                <strong key={i}>{part}</strong>
              ) : (
                <span key={i}>{part}</span>
              )
            )}
          </p>
        );
      }

      // Links
      if (line.includes("http")) {
        const urlMatch = line.match(/(https?:\/\/[^\s]+)/);
        if (urlMatch) {
          const url = urlMatch[1];
          const beforeUrl = line.substring(0, line.indexOf(url));
          const afterUrl = line.substring(line.indexOf(url) + url.length);
          return (
            <p key={index} className="mb-1">
              {beforeUrl}
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                {url}
              </a>
              {afterUrl}
            </p>
          );
        }
      }

      // Empty lines
      if (line.trim() === "") {
        return <br key={index} />;
      }

      // Regular lines
      return (
        <p key={index} className="mb-1">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Settlr AI Assistant
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Kenyan Legal Damages Estimator
            </p>
          </div>

          {/* API Status Indicator */}
          <div className="flex items-center gap-2 px-3 py-1 bg-green-50 border border-green-200 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-green-700">
              API Connected
            </span>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-4xl mx-auto space-y-4">
            {/* Welcome Message */}
            {messages.length === 0 && (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 mb-6">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Welcome to Settlr AI
                </h2>
                <p className="text-gray-600 max-w-md mx-auto">
                  Describe your road traffic accident case and injuries to get
                  an estimated damages range based on Kenyan legal precedents.
                </p>

                {/* Example prompts */}
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
                  <button
                    onClick={() =>
                      setInputMessage(
                        "Fractured femur and broken ribs from motorcycle accident"
                      )
                    }
                    className="p-4 bg-white rounded-lg border-2 border-purple-200 hover:border-purple-400 transition-all text-left group"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">🏍️</span>
                      <div>
                        <p className="font-medium text-gray-800 group-hover:text-purple-600">
                          Motorcycle Accident
                        </p>
                        <p className="text-sm text-gray-500">
                          Fractured femur and broken ribs
                        </p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() =>
                      setInputMessage(
                        "Head injury and spinal damage from car collision"
                      )
                    }
                    className="p-4 bg-white rounded-lg border-2 border-blue-200 hover:border-blue-400 transition-all text-left group"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">🚗</span>
                      <div>
                        <p className="font-medium text-gray-800 group-hover:text-blue-600">
                          Car Collision
                        </p>
                        <p className="text-sm text-gray-500">
                          Head injury and spinal damage
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Chat Messages */}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex gap-3 max-w-3xl ${
                    message.type === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      message.type === "user"
                        ? "bg-gradient-to-br from-purple-500 to-pink-500"
                        : message.isError
                        ? "bg-gradient-to-br from-red-500 to-orange-500"
                        : "bg-gradient-to-br from-blue-500 to-cyan-500"
                    }`}
                  >
                    {message.type === "user" ? (
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    ) : message.isError ? (
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                      </svg>
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`px-5 py-3 rounded-2xl ${
                      message.type === "user"
                        ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                        : message.isError
                        ? "bg-red-50 text-red-800 border border-red-200"
                        : "bg-white text-gray-800 shadow-md"
                    }`}
                  >
                    <div className="text-sm sm:text-base leading-relaxed">
                      {message.type === "user" ? (
                        <p className="whitespace-pre-wrap">{message.text}</p>
                      ) : (
                        renderMessage(message.text)
                      )}
                    </div>
                    <p
                      className={`text-xs mt-2 ${
                        message.type === "user"
                          ? "text-purple-200"
                          : message.isError
                          ? "text-red-600"
                          : "text-gray-500"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex gap-3 max-w-3xl">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>
                  <div className="px-5 py-3 bg-white rounded-2xl shadow-md">
                    <div className="flex gap-1 mb-2">
                      <div
                        className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500">
                      Analyzing case and fetching judgments...
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white/80 backdrop-blur-sm border-t border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="relative">
              <div className="flex items-end gap-2">
                <div className="flex-1 relative">
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Describe the injuries from the road traffic accident..."
                    rows="1"
                    disabled={isLoading}
                    className="w-full px-4 py-3 pr-12 rounded-2xl border-2 border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-500 resize-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    style={{ minHeight: "52px", maxHeight: "150px" }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isLoading}
                  className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white flex items-center justify-center transition-all transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
                >
                  {isLoading ? (
                    <svg
                      className="w-6 h-6 animate-spin"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  )}
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-2">
                Press Enter to send, Shift + Enter for new line
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;