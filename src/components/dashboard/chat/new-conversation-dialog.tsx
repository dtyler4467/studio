
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { PlusCircle } from 'lucide-react';
import { useSchedule } from '@/hooks/use-schedule';

type NewConversationDialogProps = {
    onSelectConversation: (id: string) => void;
}

export function NewConversationDialog({ onSelectConversation }: NewConversationDialogProps) {
  const { employees, currentUser } = useSchedule();
  const [isOpen, setIsOpen] = useState(false);

  const otherUsers = employees.filter(e => e.id !== currentUser?.id);

  const handleSelect = (userId: string) => {
    onSelectConversation(userId);
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <PlusCircle />
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0">
        <Command>
            <CommandInput placeholder="Search for personnel..." />
            <CommandList>
                <CommandEmpty>No personnel found.</CommandEmpty>
                <CommandGroup heading="Personnel">
                {otherUsers.map(user => (
                    <CommandItem 
                        key={user.id}
                        onSelect={() => handleSelect(user.id)}
                        className="cursor-pointer"
                    >
                        {user.name}
                    </CommandItem>
                ))}
                </CommandGroup>
            </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
