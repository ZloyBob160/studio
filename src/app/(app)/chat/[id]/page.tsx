'use client'

import { ChatPanel } from '@/components/chat/chat-panel';
import { ConversationHistory } from '@/components/chat/conversation-history';
import { useDoc, useFirebase, useMemoFirebase } from '@/firebase';
import type { Conversation } from '@/lib/types';
import { doc, collection } from 'firebase/firestore';

export default function ChatWithIdPage({ params }: { params: { id: string } }) {
  const { user, firestore } = useFirebase();

  const conversationRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(collection(firestore, 'users', user.uid, 'conversations'), params.id);
  }, [user, firestore, params.id]);

  const { data: conversation, isLoading } = useDoc<Conversation>(conversationRef);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
      <div>
        <header className="mb-6">
          <h1 className="text-3xl font-bold font-headline">Chat Analyst</h1>
          <p className="text-muted-foreground">
            Viewing a previous conversation.
          </p>
        </header>
        <ConversationHistory />
      </div>
      {isLoading && <div className="flex items-center justify-center h-[75vh]"><p>Loading conversation...</p></div>}
      {conversation && <ChatPanel conversation={conversation} />}
    </div>
  );
}
