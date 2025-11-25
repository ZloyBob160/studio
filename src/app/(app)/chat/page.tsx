import { ChatPanel } from '@/components/chat/chat-panel';
import { ConversationHistory } from '@/components/chat/conversation-history';

export default function ChatPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
      <div>
        <header className="mb-6">
          <h1 className="text-3xl font-bold font-headline">Chat Analyst</h1>
          <p className="text-muted-foreground">
            Start a new conversation or select a previous one.
          </p>
        </header>
        <ConversationHistory />
      </div>
      <ChatPanel />
    </div>
  );
}
