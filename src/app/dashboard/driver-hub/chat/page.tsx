
"use client";

import { Header } from '@/components/layout/header';
import { ChatLayout } from '@/components/dashboard/chat/chat-layout';

export default function ChatPage() {
  return (
    <div className="flex flex-col w-full h-screen">
      <Header pageTitle="Chat" />
      <main className="flex-1 overflow-hidden">
        <ChatLayout />
      </main>
    </div>
  );
}
