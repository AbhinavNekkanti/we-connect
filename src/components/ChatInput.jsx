import { useEffect, useRef, useState } from "react";
import { Paperclip, Send, Smile } from "lucide-react";

const emojis = [
  "😀", "😃", "😄", "😁", "😆",
  "😅", "😂", "🤣", "😊", "😍",
  "🥰", "😎", "🤩", "😘", "😜",
  "🤔", "😢", "😭", "😡", "❤️"
];

function ChatInput({ onSend, onTyping }) {
  const [text, setText] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const pickerRef = useRef(null);

  useEffect(() => {
    const closePicker = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowEmojis(false);
      }
    };

    document.addEventListener("mousedown", closePicker);
    return () => document.removeEventListener("mousedown", closePicker);
  }, []);

  const sendMessage = () => {
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
    setShowEmojis(false);
  };

  const addEmoji = (emoji) => {
    setText((value) => value + emoji);
  };

  const handleChange = (event) => {
    setText(event.target.value);
    onTyping();
  };

  return (
    <div className="input-container">
      <div className="input-area">
        <div className="emoji-area" ref={pickerRef}>
          <button
            className="tool-button"
            onClick={() => setShowEmojis((value) => !value)}
            aria-label="Emoji"
          >
            <Smile size={21} />
          </button>

          {showEmojis && (
            <div className="emoji-picker">
              <div className="emoji-title">Choose an emoji</div>
              <div className="emoji-grid">
                {emojis.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => addEmoji(emoji)}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <button className="tool-button" aria-label="Attach">
          <Paperclip size={20} />
        </button>

        <input
          value={text}
          onChange={handleChange}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Write a message..."
        />

        <button className="send-button" onClick={sendMessage}>
          <Send size={19} />
        </button>
      </div>
    </div>
  );
}

export default ChatInput;