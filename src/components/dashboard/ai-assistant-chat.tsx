
"use client";

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getAssistantResponse } from '@/ai/flows/assistant-flow';
import { Send, User, Sparkles, Mic } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { Logo } from '../icons/logo';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useSearchParams, useRouter } from 'next/navigation';

const formSchema = z.object({
  prompt: z.string().min(1, { message: "Prompt cannot be empty." }),
});

type Message = {
  role: 'user' | 'assistant';
  content: string;
  imageUrl?: string;
  videoUrl?: string;
};

export function AiAssistantChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
    },
  });

  useEffect(() => {
    const promptFromUrl = searchParams.get('prompt');
    if (promptFromUrl) {
      form.setValue('prompt', decodeURIComponent(promptFromUrl));
    }
  }, [searchParams, form]);

  useEffect(() => {
    // Check for SpeechRecognition API only on the client
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
    if (!SpeechRecognition) {
      // API not supported
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
         form.setValue('prompt', form.getValues('prompt') + finalTranscript);
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
  }, [form, toast]);


  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const userMessage: Message = { role: 'user', content: values.prompt };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    form.reset();

    try {
      const response = await getAssistantResponse({ query: values.prompt });
      
      if (response.navigateTo) {
          router.push(response.navigateTo);
          return;
      }

      const assistantMessage: Message = { 
          role: 'assistant', 
          content: response.answer,
          imageUrl: response.imageUrl,
          videoUrl: response.videoUrl,
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
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
    <div className="flex flex-col h-[600px]">
      <ScrollArea className="flex-1 p-4 border rounded-md mb-4 bg-muted/50">
        <div className="space-y-6">
          {messages.map((message, index) => (
            <div key={index} className={`flex items-start gap-4 ${message.role === 'user' ? 'justify-end' : ''}`}>
              {message.role === 'assistant' && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground"><Logo className="w-5 h-5"/></AvatarFallback>
                </Avatar>
              )}
              <div className={`rounded-lg p-3 max-w-lg ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-background'}`}>
                <p className="text-sm">{message.content}</p>
                {message.imageUrl && (
                    <div className="mt-2">
                        <Image src={message.imageUrl} alt="AI generated image" width={400} height={300} className="rounded-md" />
                    </div>
                )}
                {message.videoUrl && (
                    <div className="mt-2">
                        <video src={message.videoUrl} controls className="w-full rounded-md" />
                    </div>
                )}
              </div>
               {message.role === 'user' && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback><User className="w-4 h-4" /></AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-4">
               <Avatar className="h-8 w-8">
                   <AvatarFallback className="bg-primary text-primary-foreground"><Logo className="w-5 h-5"/></AvatarFallback>
                </Avatar>
                <div className="rounded-lg p-3 max-w-lg bg-background space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-32" />
                </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-2">
          <FormField
            control={form.control}
            name="prompt"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input placeholder="Ask about shipments, yard status, or anything else..." {...field} autoComplete="off" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading}>
            <Send className="mr-2" />
            Send
          </Button>
           <Button 
            type="button" 
            variant="outline" 
            size="icon" 
            disabled={isLoading}
            onClick={handleMicClick}
            className={cn(isRecording && "bg-destructive text-destructive-foreground hover:bg-destructive/90")}
           >
            <Mic />
            <span className="sr-only">{isRecording ? 'Stop Recording' : 'Use Microphone'}</span>
          </Button>
        </form>
      </Form>
    </div>
  );
}
