import { useState, useRef, useEffect } from "react";
import { IoSend } from "react-icons/io5";
import { chatWithNLP } from "../services/api";
import PropertyCard from "./PropertyCard";
import "./ChatBot.css";

function ChatBot({ savedIds, onSave, compareIds, onCompare }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Start conversation on mount
  useEffect(() => {
    addBotMessage(
      "Hi! I'm Mira, your smart real estate assistant. You can talk to me naturally! For example, try saying: 'Show me 3 bedroom homes in Miami under 500k'."
    );
  }, []);

  // Add a bot message with optional delay for typing effect
  function addBotMessage(text, options, results) {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { type: "bot", text, options: options || null, results: results || null },
      ]);
    }, 800);
  }

  // Add user message
  function addUserMessage(text) {
    setMessages((prev) => [...prev, { type: "user", text }]);
  }

  // Handle Free Text Send (Phase 4 NLP)
  async function handleSend() {
    if (!input.trim()) return;

    const text = input.trim();
    addUserMessage(text);
    setInput("");

    if (text.toLowerCase().includes("start over") || text.toLowerCase().includes("reset")) {
       addBotMessage("Starting fresh! What kind of home are you looking for?");
       return;
    }

    setIsTyping(true);
    try {
      const res = await chatWithNLP(text);
      setIsTyping(false);
      
      const propertiesFound = res.data.length > 0;
      
      addBotMessage(
        res.reply,
        propertiesFound ? ["Search something else"] : ["Start Over", "Show all homes"],
        propertiesFound ? res.data : null
      );
    } catch (error) {
      setIsTyping(false);
      addBotMessage("Oops! My AI brain is having trouble connecting to the server. Is the backend running?");
    }
  }

  function handleOptionClick(opt) {
    addUserMessage(opt);
    if (opt === "Search something else" || opt === "Start Over") {
       addBotMessage("What else are you looking for?");
    } else if (opt === "Show all homes") {
       // fallback search
       setInput("Show me all homes");
       setTimeout(() => handleSend(), 100);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleSend();
  }

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-message ${msg.type}`}>
            <div className="message-avatar">
              {msg.type === "bot" ? "🤖" : "👤"}
            </div>
            <div className={msg.results ? "chat-results-wrapper" : ""}>
              <div className="message-content">
                {msg.text}
              </div>

              {/* Option buttons */}
              {msg.options && (
                <div className="chat-options">
                  {msg.options.map((opt, j) => (
                    <button
                      key={j}
                      className="chat-option-btn"
                      onClick={() => handleOptionClick(opt)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {/* Property results */}
              {msg.results && (
                <div className="chat-results-grid">
                  {msg.results.map((prop) => (
                    <PropertyCard
                      key={prop.id}
                      property={prop}
                      isSaved={savedIds.includes(prop.id)}
                      isComparing={compareIds.includes(prop.id)}
                      onSave={onSave}
                      onCompare={onCompare}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="chat-message bot">
            <div className="message-avatar">🤖</div>
            <div className="message-content typing-indicator">
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="chat-input-area">
        <div className="chat-input-wrapper">
          <input
            className="chat-input"
            type="text"
            placeholder="E.g., 'Find me a 4 bed house in Dallas under 700k'"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="chat-send-btn" onClick={handleSend} disabled={!input.trim()}>
            <IoSend /> Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatBot;
