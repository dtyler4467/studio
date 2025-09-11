
"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { useSchedule, Employee } from '@/hooks/use-schedule';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Check, CheckCheck, ArrowLeft, MoreVertical, Paperclip, Mic } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

type MessageStatus = 'sent' | 'delivered' | 'read';

type Message = {
    id: string;
    senderId: string;
    text: string;
    timestamp: Date;
    status: MessageStatus;
};

const mockMessages: Record<string, Message[]> = {
    'USR002': [
        { id: 'msg1', senderId: 'USR002', text: 'Hey, just checking on the status of load LD123.', timestamp: new Date(Date.now() - 10 * 60000), status: 'read' },
        { id: 'msg2', senderId: 'USR001', text: 'Hi Jane, it\'s on track. Just passed the weigh station.', timestamp: new Date(Date.now() - 8 * 60000), status: 'read' },
        { id: 'msg3', senderId: 'USR002', text: 'Great, thanks for the update!', timestamp: new Date(Date.now() - 7 * 60000), status: 'read' },
        { id: 'msg4', senderId: 'USR001', text: 'Sure, I can take that load.', timestamp: new Date(Date.now() - 5 * 60000), status: 'sent' },
    ],
    'USR003': [
        { id: 'msg5', senderId: 'USR003', text: 'Running about 15 minutes late.', timestamp: new Date(Date.now() - 2 * 3600000), status: 'read' }
    ]
};

const MessageStatusIcon = ({ status }: { status: MessageStatus }) => {
    switch (status) {
        case 'sent':
            return <Check className="w-4 h-4" />;
        case 'delivered':
            return <CheckCheck className="w-4 h-4" />;
        case 'read':
            return <CheckCheck className="w-4 h-4 text-blue-500" />;
    }
};

export function ConversationView({ user, onBack }: { user: Employee, onBack: () => void }) {
    const { currentUser } = useSchedule();
    const [messages, setMessages] = useState<Message[]>(mockMessages[user.id] || []);
    const [newMessage, setNewMessage] = useState('');
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const [isRecording, setIsRecording] = useState(false);
    const recognitionRef = useRef<any>(null);
    const { toast } = useToast();

    useEffect(() => {
        setMessages(mockMessages[user.id] || []);
    }, [user]);

    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight });
        }
    }, [messages]);
    
    useEffect(() => {
        const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
                }
            }
            if (finalTranscript) {
                setNewMessage(prev => prev + finalTranscript);
            }
        };
        
        recognition.onend = () => {
            setIsRecording(false);
        }

        recognition.onerror = (event: any) => {
            toast({
                variant: "destructive",
                title: "Speech Recognition Error",
                description: `An error occurred: ${event.error}`,
            });
            setIsRecording(false);
        }
        
        recognitionRef.current = recognition;

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        }
    }, [toast]);


    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !currentUser) return;

        const message: Message = {
            id: `msg${Date.now()}`,
            senderId: currentUser.id,
            text: newMessage,
            timestamp: new Date(),
            status: 'sent',
        };

        setMessages(prev => [...prev, message]);
        setNewMessage('');
    };
    
    const handleMicClick = () => {
        if (!recognitionRef.current) {
            toast({
                variant: "destructive",
                title: "Unsupported Browser",
                description: "Your browser does not support voice recognition.",
            });
            return;
        }

        if (isRecording) {
            recognitionRef.current?.stop();
        } else {
            recognitionRef.current?.start();
        }
        setIsRecording(!isRecording);
    };

    return (
        <div className="flex flex-col h-full">
            <header className="p-4 border-b flex items-center gap-4">
                <Button variant="ghost" size="icon" className="md:hidden" onClick={onBack}>
                    <ArrowLeft />
                </Button>
                <Avatar>
                    <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-xs text-green-500">Online</p>
                </div>
                 <div className="ml-auto">
                    <Button variant="ghost" size="icon">
                        <MoreVertical />
                    </Button>
                </div>
            </header>
            <ScrollArea className="flex-1 bg-muted/30 p-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                    {messages.map(msg => (
                        <div key={msg.id} className={cn("flex", msg.senderId === currentUser?.id ? 'justify-end' : 'justify-start')}>
                             <div className={cn(
                                "max-w-xs lg:max-w-md p-3 rounded-lg",
                                msg.senderId === currentUser?.id 
                                    ? 'bg-primary text-primary-foreground' 
                                    : 'bg-background'
                             )}>
                                <p>{msg.text}</p>
                                <div className={cn("text-xs mt-1 flex items-center gap-1", msg.senderId === currentUser?.id ? 'text-primary-foreground/70 justify-end' : 'text-muted-foreground justify-start')}>
                                    <span>{format(msg.timestamp, 'p')}</span>
                                    {msg.senderId === currentUser?.id && <MessageStatusIcon status={msg.status} />}
                                </div>
                             </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
             <footer className="p-4 border-t">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" type="button"><Paperclip /></Button>
                    <Input 
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        autoComplete="off"
                    />
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={handleMicClick}
                        className={cn(isRecording && "bg-destructive text-destructive-foreground hover:bg-destructive/90")}
                    >
                        <Mic />
                        <span className="sr-only">{isRecording ? 'Stop Recording' : 'Start Recording'}</span>
                    </Button>
                    <Button type="submit">
                        <Send />
                        <span className="sr-only">Send</span>
                    </Button>
                </form>
            </footer>
        </div>
    );
}
