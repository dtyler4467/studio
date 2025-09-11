
"use client";

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useSchedule } from '@/hooks/use-schedule';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { NewConversationDialog } from './new-conversation-dialog';

type ConversationListProps = {
    onSelectConversation: (id: string) => void;
    selectedConversationId: string | null;
}

// Mocked conversations for prototype purposes
const mockConversations = [
    { userId: 'USR002', lastMessage: 'Sure, I can take that load.', timestamp: new Date(Date.now() - 5 * 60000), unread: 0 },
    { userId: 'USR003', lastMessage: 'Running about 15 minutes late.', timestamp: new Date(Date.now() - 2 * 3600000), unread: 2 },
    { userId: 'USR004', lastMessage: 'See you at the meeting.', timestamp: new Date(Date.now() - 24 * 3600000), unread: 0 },
];

export function ConversationList({ onSelectConversation, selectedConversationId }: ConversationListProps) {
    const { employees, currentUser } = useSchedule();
    const [searchQuery, setSearchQuery] = useState('');

    const conversations = useMemo(() => {
        return mockConversations
            .map(convo => {
                const user = employees.find(e => e.id === convo.userId);
                return user ? { ...convo, user } : null;
            })
            .filter(Boolean)
            .filter(convo => 
                convo.user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                convo.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }, [employees, searchQuery]);


    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b">
                <div className="flex justify-between items-center mb-4">
                     <h2 className="text-xl font-bold font-headline">Conversations</h2>
                     <NewConversationDialog onSelectConversation={onSelectConversation}/>
                </div>
                <Input 
                    placeholder="Search conversations..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <ScrollArea className="flex-1">
                {conversations.map(convo => (
                    <button 
                        key={convo.userId}
                        onClick={() => onSelectConversation(convo.userId)}
                        className={cn(
                            "w-full text-left p-4 border-b flex items-center gap-4 transition-colors",
                            selectedConversationId === convo.userId ? "bg-muted" : "hover:bg-muted/50"
                        )}
                    >
                        <Avatar>
                            <AvatarFallback>{convo.user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 overflow-hidden">
                            <div className="flex justify-between items-center">
                                <p className="font-semibold truncate">{convo.user.name}</p>
                                <p className="text-xs text-muted-foreground whitespace-nowrap">
                                    {formatDistanceToNow(convo.timestamp, { addSuffix: true })}
                                </p>
                            </div>
                             <div className="flex justify-between items-start">
                                <p className="text-sm text-muted-foreground truncate">{convo.lastMessage}</p>
                                {convo.unread > 0 && (
                                    <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center flex-shrink-0">
                                        {convo.unread}
                                    </div>
                                )}
                            </div>
                        </div>
                    </button>
                ))}
            </ScrollArea>
        </div>
    )
}
