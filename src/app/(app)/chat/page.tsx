import { ChatPanel } from '@/components/chat/chat-panel';

export default function ChatPage() {
  return (
    <div>
        <header className="mb-6">
            <h1 className="text-3xl font-bold font-headline">Chat Analyst</h1>
            <p className="text-muted-foreground">
                Interact with the AI to formalize your business requirements.
            </p>
        </header>
        <ChatPanel />
    </div>
  );
}
