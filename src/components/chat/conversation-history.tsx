'use client';

import { useCollection, useFirebase, useMemoFirebase } from '@/firebase';
import type { Conversation } from '@/lib/types';
import { collection } from 'firebase/firestore';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { cn } from '@/lib/utils';

export function ConversationHistory() {
  const { user, firestore } = useFirebase();
  const pathname = usePathname();

  const conversationsRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, 'users', user.uid, 'conversations');
  }, [user, firestore]);

  const { data: conversations, isLoading } = useCollection<Conversation>(conversationsRef);

  return (
    <Card>
      <CardContent className="p-2">
        <div className="flex flex-col gap-2">
            <Button asChild variant={pathname === '/chat' ? 'secondary' : 'ghost'}>
                <Link href="/chat">New Conversation</Link>
            </Button>
            {isLoading && <p className='text-sm text-muted-foreground p-2'>Loading history...</p>}
            {conversations?.map((convo) => (
                <Button asChild key={convo.id} variant={pathname === `/chat/${convo.id}` ? 'secondary' : 'ghost'} className='justify-start'>
                    <Link href={`/chat/${convo.id}`} className='truncate'>
                        {convo.title}
                    </Link>
                </Button>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
