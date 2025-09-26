import React, { useState, useRef, useEffect } from "react";

// Create API utility function using fetch
const api = {
  async post(endpoint, data) {
    const response = await fetch(`http://localhost:5000/api${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return { data: await response.json() };
  },

  async get(endpoint) {
    const response = await fetch(`http://localhost:5000/api${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return { data: await response.json() };
  },
};

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [chatMode, setChatMode] = useState("general");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 1,
          text: "Hello! I'm your AI educational assistant powered by Gemini. I can help with math problems, explanations, homework, and general learning. What would you like to know?",
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageToSend = inputMessage;
    setInputMessage("");
    setIsLoading(true);

    try {
      let endpoint = "/chat/message";
      let data = {
        message: messageToSend,
        userId: "user123",
        type: chatMode,
      };

      // Special handling for different modes
      if (chatMode === "explain") {
        endpoint = "/chat/explain";
        data = { concept: messageToSend, userId: "user123" };
      } else if (chatMode === "homework") {
        endpoint = "/chat/homework-help";
        data = {
          topic: detectTopicFromMessage(messageToSend),
          problem: messageToSend,
          userId: "user123",
        };
      } else if (chatMode === "math") {
        endpoint = "/chat/solve-math";
        data = { equation: messageToSend, userId: "user123" };
      }

      console.log(`Sending to ${endpoint}:`, data);

      const response = await api.post(endpoint, data);

      const botMessage = {
        id: Date.now() + 1,
        text:
          response.data.response ||
          "I didn't receive a proper response. Could you try again?",
        isUser: false,
        timestamp: new Date(),
        isAI: true,
        detectedTopic: response.data.detectedTopic,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      let errorText = "Sorry, I'm having some technical difficulties. ";

      if (error.response?.data?.fallback) {
        errorText = error.response.data.fallback;
      } else if (error.response?.status === 500) {
        errorText +=
          "The server is experiencing issues. Please try again in a moment.";
      } else if (error.code === "NETWORK_ERROR") {
        errorText += "Please check your internet connection.";
      } else {
        errorText += "Please try again in a moment.";
      }

      const errorMessage = {
        id: Date.now() + 1,
        text: errorText,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to detect topic from message
  const detectTopicFromMessage = (message) => {
    const msg = message.toLowerCase();

    if (
      msg.includes("solve") ||
      msg.includes("equation") ||
      msg.includes("x =") ||
      msg.match(/\d+x/) ||
      msg.includes("algebra") ||
      msg.includes("math")
    ) {
      return "mathematics";
    }

    if (
      msg.includes("physics") ||
      msg.includes("chemistry") ||
      msg.includes("biology") ||
      msg.includes("science")
    ) {
      return "science";
    }

    if (
      msg.includes("history") ||
      msg.includes("renaissance") ||
      msg.includes("war") ||
      msg.includes("ancient")
    ) {
      return "history";
    }

    return "general";
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Clear chat history
  const clearChat = () => {
    setMessages([
      {
        id: 1,
        text: "Hello! I'm your AI educational assistant powered by Gemini. I can help with math problems, explanations, homework, and general learning. What would you like to know?",
        isUser: false,
        timestamp: new Date(),
      },
    ]);
  };

  // Quick action handler
  const handleQuickAction = (action) => {
    setChatMode(action.mode);
    setInputMessage(action.prompt);
    // Optional: Auto-send the message
    setTimeout(() => {
      if (action.autoSend) {
        const event = { target: { value: action.prompt } };
        setInputMessage(action.prompt);
        // Trigger send after a brief delay to ensure state is updated
        setTimeout(() => sendMessage(), 100);
      }
    }, 50);
  };

  const quickActions = [
    {
      label: "Explain concept",
      mode: "explain",
      prompt: "quantum physics",
      autoSend: false,
    },
    {
      label: "Solve Math",
      mode: "math", // Changed to use math mode
      prompt: "2x + 5 = 15",
      autoSend: true, // Auto-send math problems
    },
    {
      label: "Science help",
      mode: "general",
      prompt: "How does photosynthesis work?",
      autoSend: false,
    },
    {
      label: "History help",
      mode: "general",
      prompt: "Tell me about the Renaissance",
      autoSend: false,
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-green-600 hover:bg-green-700 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl transition-all duration-300 hover:scale-110"
      >
        🎓
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 h-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col">
          {/* Header */}
          <div className="bg-green-600 text-white p-3 rounded-t-lg flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-sm">AI Study Assistant</h3>
              <span className="text-xs opacity-80">Powered by Gemini</span>
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={chatMode}
                onChange={(e) => setChatMode(e.target.value)}
                className="bg-green-700 text-white text-xs px-2 py-1 rounded border-none focus:ring-0"
              >
                <option value="general">General Help</option>
                <option value="explain">Explain Concept</option>
                <option value="homework">Homework Help</option>
                <option value="math">Math Solver</option>
              </select>
              <div className="flex space-x-1">
                <button
                  onClick={clearChat}
                  className="text-white hover:text-gray-200 text-sm"
                  title="Clear chat"
                >
                  ↻
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-gray-200 text-lg font-bold"
                >
                  ×
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.isUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                    message.isUser
                      ? "bg-green-500 text-white rounded-br-none"
                      : "bg-gray-100 text-gray-800 rounded-bl-none border-l-2 border-green-500"
                  }`}
                >
                  <div className="text-sm whitespace-pre-wrap">
                    {message.text}
                  </div>
                  <div className="text-xs opacity-70 mt-1 flex items-center justify-between">
                    <span>
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <div className="flex items-center space-x-1">
                      {message.detectedTopic && (
                        <span className="bg-blue-500 text-white text-xs px-1 rounded">
                          {message.detectedTopic}
                        </span>
                      )}
                      {message.isAI && (
                        <span className="bg-green-500 text-white text-xs px-1 rounded">
                          AI
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 px-3 py-2 rounded-lg rounded-bl-none border-l-2 border-green-500">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">AI is thinking</span>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="px-3 py-2 border-t border-gray-200 bg-gray-50">
            <div className="flex space-x-2 overflow-x-auto pb-1">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action)}
                  className="bg-white hover:bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded whitespace-nowrap transition-colors border border-gray-300"
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="p-3 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  chatMode === "explain"
                    ? "Ask me to explain any concept..."
                    : chatMode === "homework"
                    ? "Describe your homework problem..."
                    : chatMode === "math"
                    ? "Enter your math equation..."
                    : "Ask about any subject..."
                }
                disabled={isLoading}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Send
              </button>
            </div>
            <div className="text-xs text-gray-500 mt-1 text-center">
              Mode: <span className="font-medium capitalize">{chatMode}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
