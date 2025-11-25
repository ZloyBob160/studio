'use client';

import { useActionState, useEffect, useRef, useState, useMemo, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';
import { exportDocumentsToConfluenceAction, generateDocumentsAction } from '@/lib/actions';
import type { Message, ChatCompletion, Conversation } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import { Bot, Copy, ExternalLink, LoaderCircle, Sparkles, User, FileText, Send, ChevronsRight, Milestone, Star, CaseSensitive } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '../ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useFirebase } from '@/firebase';
import { collection, doc, addDoc, serverTimestamp } from 'firebase/firestore';
import { setDocumentNonBlocking, addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useRouter } from 'next/navigation';

const botQuestions = [
  "Hello! I'm AnalystAI. To start, what business process or feature are we looking to define today?",
  "Great. What is the primary goal or objective of this initiative?",
  "Understood. Could you provide a more detailed description of what you envision?",
  "What would you consider to be in scope and out of scope for this project?",
  "Are there any specific business rules, policies, or constraints we need to consider?",
  "How will we measure success? What are the Key Performance Indicators (KPIs)?",
  "Thank you. This is a great start. I have enough information to generate the initial documents. Click 'Finalize Requirements' when you're ready.",
];

const initialState = {
  message: '',
  documents: undefined,
  error: '',
};

function FinalizeButton({ isFinished }: { isFinished: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending || !isFinished} size="lg">
      {pending ? (
        <LoaderCircle className="animate-spin" />
      ) : (
        <Sparkles />
      )}
      Finalize Requirements
    </Button>
  );
}

export function ChatPanel({ conversation: initialConversation }: { conversation?: WithId<Conversation> }) {
  const [messages, setMessages] = useState<Message[]>(initialConversation?.messages || [
    { role: 'assistant', content: botQuestions[0] },
  ]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(initialConversation ? botQuestions.length : 1);
  const [inputValue, setInputValue] = useState('');
  const [isFinalized, setIsFinalized] = useState(!!initialConversation?.isFinalized);
  
  const [state, formAction] = useActionState(generateDocumentsAction, initialState);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { user, firestore } = useFirebase();
  const router = useRouter();


  const userAvatar = useMemo(() => PlaceHolderImages.find(img => img.id === 'user-avatar'), []);

  useEffect(() => {
    if (state?.error) {
      toast({ variant: 'destructive', title: 'Error', description: state.error });
    }
    if (state?.message === 'success' && state.documents) {
        setIsFinalized(true);
        if (user && firestore && !initialConversation) {
          const conversationsRef = collection(firestore, 'users', user.uid, 'conversations');
          addDocumentNonBlocking(conversationsRef, {
            title: messages.find(m => m.role === 'user')?.content.substring(0, 30) || 'New Conversation',
            messages,
            startTime: serverTimestamp(),
            isFinalized: true,
            documents: state.documents,
          }).then((docRef) => {
            if (docRef) {
              router.push(`/chat/${docRef.id}`);
            }
          });
        }
    }
  }, [state, toast, user, firestore, messages, initialConversation, router]);
  
  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages, state]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || currentQuestionIndex > botQuestions.length -1) return;

    const newUserMessage: Message = { role: 'user', content: inputValue };
    const newBotMessage: Message = { role: 'assistant', content: botQuestions[currentQuestionIndex]};
    
    setMessages(prev => [...prev, newUserMessage, newBotMessage]);
    setCurrentQuestionIndex(prev => prev + 1);
    setInputValue('');
  };

  const conversationText = messages.map(m => `${m.role === 'user' ? 'User' : 'AnalystAI'}: ${m.content}`).join('\n');
  const isConversationFinished = currentQuestionIndex > botQuestions.length -1;


  if (isFinalized && (state.documents || initialConversation?.documents)) {
    const documents = state.documents || initialConversation?.documents;
    if (!documents) return null;

    const derivedTitle = initialConversation?.title || deriveConversationTitle(messages);

    return (
      <DocumentViewer
        documents={documents}
        conversationTitle={derivedTitle}
        onReset={() => {
          router.push('/chat');
        }}
      />
    );
  }

  return (
    <Card className="flex flex-col h-[75vh]">
        <CardContent className="p-0 flex-1 flex flex-col">
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                <div className="space-y-6">
                {messages.map((message, index) => (
                    <div key={index} className={cn('flex items-start gap-3', message.role === 'user' ? 'justify-end' : '')}>
                    {message.role === 'assistant' && <Avatar className="w-8 h-8 border-2 border-primary"><AvatarFallback className="bg-primary text-primary-foreground"><Bot size={18}/></AvatarFallback></Avatar>}
                    <div className={cn("max-w-md p-3 rounded-lg", message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                        <p className="text-sm">{message.content}</p>
                    </div>
                    {message.role === 'user' && userAvatar && <Avatar className="w-8 h-8"><AvatarImage src={userAvatar.imageUrl} alt="User" /><AvatarFallback><User size={18} /></AvatarFallback></Avatar>}
                    </div>
                ))}
                </div>
            </ScrollArea>
            <div className="p-4 border-t">
            {isConversationFinished && !state.documents ? (
                <form action={formAction} className="flex flex-col items-center gap-4">
                    <input type="hidden" name="conversationText" value={conversationText} />
                    <p className="text-sm text-center text-muted-foreground">The guided conversation is complete. You can now generate the business documents.</p>
                    <FinalizeButton isFinished={isConversationFinished} />
                </form>
            ) : (
                <form onSubmit={handleSendMessage} className="flex gap-2">
                    <Input value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Type your answer..." autoComplete="off" disabled={!!initialConversation} />
                    <Button type="submit" size="icon" disabled={!inputValue.trim() || !!initialConversation}><Send/></Button>
                </form>
            )}
            </div>
        </CardContent>
    </Card>
  );
}

function DocumentViewer({
    documents,
    onReset,
    conversationTitle,
}: {
    documents: ChatCompletion,
    onReset: () => void,
    conversationTitle?: string,
}) {
    const { requirements, artifacts } = documents;
    const { toast } = useToast();
    const [confluenceUrl, setConfluenceUrl] = useState<string | null>(null);
    const [exportError, setExportError] = useState<string | null>(null);
    const [isExporting, startExport] = useTransition();
    const fallbackTitle = useMemo(() => `AnalystAI Requirements - ${new Date().toLocaleString()}`, []);
    const effectiveTitle = conversationTitle?.trim() || fallbackTitle;

    const copyToClipboard = (text: string, title: string) => {
        navigator.clipboard.writeText(text);
        toast({ title: 'Copied to Clipboard', description: `${title} has been copied.` });
    }

    const handleExport = () => {
        setExportError(null);
        startExport(async () => {
            const result = await exportDocumentsToConfluenceAction({
                documents,
                conversationTitle: effectiveTitle,
            });

            if (result.success) {
                setConfluenceUrl(result.url);
                toast({
                    title: 'Exported to Confluence',
                    description: `Page ${result.action === 'created' ? 'created' : 'updated'} successfully.`,
                });
            } else {
                setConfluenceUrl(null);
                setExportError(result.error);
                toast({
                    variant: 'destructive',
                    title: 'Export failed',
                    description: result.error,
                });
            }
        })
    }

    const exportButtonLabel = confluenceUrl ? 'Update Confluence Page' : 'Export to Confluence';

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold font-headline">Generated Documents</h2>
                    <p className="text-muted-foreground">Review the AI-generated requirements and artifacts.</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={onReset} variant="outline">Start New Chat</Button>
                    <Button onClick={handleExport} disabled={isExporting} variant="secondary">
                        {isExporting ? <LoaderCircle className="animate-spin" /> : <ExternalLink />}
                        {exportButtonLabel}
                    </Button>
                </div>
            </div>

            {confluenceUrl && (
                <Alert>
                    <AlertTitle>Synced with Confluence</AlertTitle>
                    <AlertDescription>
                        View the page{' '}
                        <Link href={confluenceUrl} target="_blank" rel="noreferrer" className="underline">
                            in Confluence
                        </Link>.
                    </AlertDescription>
                </Alert>
            )}

            {exportError && (
                <Alert variant="destructive">
                    <AlertTitle>Confluence export failed</AlertTitle>
                    <AlertDescription>{exportError}</AlertDescription>
                </Alert>
            )}
            
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2"><FileText /> Business Requirements Document</CardTitle>
                    <CardDescription>Key business requirements extracted from the conversation.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <ArtifactSection icon={<ChevronsRight />} title="Goal" content={requirements.goal} onCopy={copyToClipboard} />
                    <ArtifactSection icon={<Milestone />} title="Description" content={requirements.description} onCopy={copyToClipboard} />
                    <ArtifactSection icon={<CaseSensitive />} title="Scope" content={requirements.scope} onCopy={copyToClipboard} />
                    <ArtifactSection icon={<Milestone transform='rotate(90)'/>} title="Business Rules" content={requirements.businessRules} onCopy={copyToClipboard} />
                    <ArtifactSection icon={<Star />} title="KPIs" content={requirements.kpis} onCopy={copyToClipboard} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2"><Sparkles /> Analytical Artifacts</CardTitle>
                    <CardDescription>Supporting analytical artifacts generated by the AI.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <ArtifactSection title="Use Cases" content={artifacts.useCases} onCopy={copyToClipboard} />
                    <ArtifactSection title="User Stories" content={artifacts.userStories} onCopy={copyToClipboard} />
                    <ArtifactSection title="Process Diagrams (as text)" content={artifacts.processDiagrams} onCopy={copyToClipboard} />
                    <ArtifactSection title="Leading Indicators" content={artifacts.leadingIndicators} onCopy={copyToClipboard} />
                </CardContent>
            </Card>
        </div>
    )
}

function ArtifactSection({ title, content, onCopy, icon }: { title: string, content: string, onCopy: (text: string, title: string) => void, icon?: React.ReactNode }) {
    const formattedContent = content.split('\n').map(line => line.trim()).filter(line => line).map((line, index) => (
        <p key={index} className="mb-2">{line}</p>
    ));

    return (
        <div className="space-y-2 relative group">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2">{icon}{title}</h3>
                <Button variant="ghost" size="icon" className="w-7 h-7 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => onCopy(content, title)}>
                    <Copy size={16} />
                </Button>
            </div>
            <div className="p-3 rounded-md bg-muted/50 border text-sm text-foreground/80 whitespace-pre-wrap">
                {formattedContent.length > 0 ? formattedContent : <p>No content generated.</p>}
            </div>
        </div>
    )
}

function deriveConversationTitle(messages: Message[]): string | undefined {
    const firstUserMessage = messages.find(message => message.role === 'user');
    if (!firstUserMessage) return undefined;
    const content = firstUserMessage.content.trim();
    if (!content) return undefined;
    return content.length > 80 ? `${content.slice(0, 77)}...` : content;
}

type WithId<T> = T & { id: string };
