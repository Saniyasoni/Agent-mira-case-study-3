import ChatBot from "../components/ChatBot";

function Chat({ savedIds, onSave, compareIds, onCompare }) {
  return (
    <div className="chat-page">
      <ChatBot
        savedIds={savedIds}
        onSave={onSave}
        compareIds={compareIds}
        onCompare={onCompare}
      />
    </div>
  );
}

export default Chat;
