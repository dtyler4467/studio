
"use client";

import { useState }from 'react';
import { cn } from '@/lib/utils';
import { ConversationList } from './conversation-list';
import { ConversationView } from './conversation-view';
import { NewConversationDialog } from './new-conversation-dialog';
import { useSchedule } from '@/hooks/use-schedule';

export function ChatLayout() {
    const { employees, currentUser } = useSchedule();
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>('USR002');
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);

    const otherUsers = employees.filter(e => e.id !== currentUser?.id);

    const selectedConversation = otherUsers.find(e => e.id === selectedConversationId);

    return (
        <div className="flex h-full">
            <aside className={cn(
                "w-full md:w-80 lg:w-96 border-r bg-background flex-shrink-0 transition-all duration-300",
                isSidebarVisible ? 'block' : 'hidden',
                !selectedConversation && 'w-full md:w-full'
            )}>
                <ConversationList 
                    onSelectConversation={(id) => {
                        setSelectedConversationId(id);
                        setIsSidebarVisible(false);
                    }}
                    selectedConversationId={selectedConversationId}
                />
            </aside>
            <div className={cn("flex-1", !selectedConversation && 'hidden md:block', !isSidebarVisible && 'block')}>
                {selectedConversation ? (
                    <ConversationView 
                        user={selectedConversation}
                        onBack={() => setIsSidebarVisible(true)}
                    />
                ) : (
                    <div className="h-full flex items-center justify-center bg-muted">
                        <div className="text-center">
                            <p className="text-lg font-semibold">Select a conversation</p>
                            <p className="text-muted-foreground">Or start a new one to begin chatting.</p>
                            <NewConversationDialog onSelectConversation={setSelectedConversationId} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
