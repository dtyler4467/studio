
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRightLeft, Volume2, Mic } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { translateText } from '@/ai/flows/translate-text-flow';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ru', name: 'Russian' },
    { code: 'ar', name: 'Arabic' },
    { code: 'hi', name: 'Hindi' },
];

export default function TranslatorPage() {
    const [inputText, setInputText] = useState('');
    const [outputText, setOutputText] = useState('');
    const [sourceLang, setSourceLang] = useState('en');
    const [targetLang, setTargetLang] = useState('es');
    const [isLoading, setIsLoading] = useState(false);
    const [isRecording, setIsRecording] = useState<'source' | 'target' | null>(null);
    const recognitionRef = useRef<any>(null);
    const { toast } = useToast();
    
    const handleSpeak = (text: string, lang: string) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = lang;
            window.speechSynthesis.speak(utterance);
        } else {
            toast({ variant: 'destructive', title: 'Not Supported', description: 'Your browser does not support text-to-speech.' });
        }
    };

    const handleTranslate = async (text: string, source: string, target: string, setTextCallback: (text: string) => void, speakResult: boolean = false) => {
        if (!text.trim()) {
            return;
        }
        setIsLoading(true);
        setTextCallback('');
        try {
            const result = await translateText({ text, targetLang: languages.find(l => l.code === target)?.name || 'Spanish' });
            setTextCallback(result.translatedText);
            if (speakResult) {
                handleSpeak(result.translatedText, target);
            }
        } catch (error) {
            console.error("Translation error:", error);
            toast({ variant: 'destructive', title: 'Translation Failed', description: 'Could not translate the text. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };
    
    const setupRecognition = useCallback((lang: string, onResult: (transcript: string) => void) => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            return null;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = lang;

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            onResult(transcript);
        };
        
        recognition.onend = () => {
            setIsRecording(null);
        }

        recognition.onerror = (event: any) => {
             toast({
                variant: "destructive",
                title: "Speech Recognition Error",
                description: `An error occurred: ${event.error}`,
            });
            setIsRecording(null);
        }
        
        return recognition;
    }, [toast]);


    const handleMicClick = (side: 'source' | 'target') => {
        if (isRecording) {
            recognitionRef.current?.stop();
            setIsRecording(null);
            return;
        }
        
        const lang = side === 'source' ? sourceLang : targetLang;
        const onResult = (transcript: string) => {
            if (side === 'source') {
                setInputText(transcript);
                handleTranslate(transcript, sourceLang, targetLang, setOutputText, true);
            } else {
                setOutputText(transcript);
                handleTranslate(transcript, targetLang, sourceLang, setInputText, true);
            }
        };

        const recognition = setupRecognition(lang, onResult);
        if (recognition) {
            recognitionRef.current = recognition;
            recognition.start();
            setIsRecording(side);
        } else {
             toast({
                variant: "destructive",
                title: "Unsupported Browser",
                description: "Your browser does not support voice recognition.",
            });
        }
    };

    const handleSwapLanguages = () => {
        const tempLang = sourceLang;
        setSourceLang(targetLang);
        setTargetLang(tempLang);
        
        const tempText = inputText;
        setInputText(outputText);
        setOutputText(tempText);
    };

    return (
        <div className="flex flex-col w-full">
            <Header pageTitle="Translator" />
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Language Translator</CardTitle>
                        <CardDescription>
                            Translate text and speech between different languages. Powered by AI.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-4">
                            <Select value={sourceLang} onValueChange={setSourceLang}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {languages.map(lang => <SelectItem key={lang.code} value={lang.code}>{lang.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <Button variant="ghost" size="icon" onClick={handleSwapLanguages}>
                                <ArrowRightLeft className="h-5 w-5 text-muted-foreground" />
                            </Button>
                            <Select value={targetLang} onValueChange={setTargetLang}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                     {languages.map(lang => <SelectItem key={lang.code} value={lang.code}>{lang.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <Textarea
                                    placeholder={`Enter or speak text in ${languages.find(l => l.code === sourceLang)?.name}...`}
                                    value={inputText}
                                    onChange={(e) => {
                                        setInputText(e.target.value);
                                        if (e.target.value === "") {
                                            setOutputText("");
                                        }
                                    }}
                                    className="h-48 resize-none"
                                />
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={() => handleSpeak(inputText, sourceLang)} disabled={!inputText}>
                                        <Volume2 className="mr-2" />
                                        Listen
                                    </Button>
                                    <Button 
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleMicClick('source')}
                                        className={cn(isRecording === 'source' && "bg-destructive text-destructive-foreground hover:bg-destructive/90")}
                                    >
                                        <Mic className="mr-2" />
                                        {isRecording === 'source' ? 'Stop' : 'Speak'}
                                    </Button>
                                    <Button size="sm" onClick={() => handleTranslate(inputText, sourceLang, targetLang, setOutputText)} disabled={isLoading || !inputText}>
                                        Translate
                                    </Button>
                                </div>
                            </div>
                           <div className="space-y-2">
                                {isLoading ? (
                                    <div className="h-48 rounded-md bg-muted p-3 space-y-2">
                                        <Skeleton className="h-4 w-3/4" />
                                        <Skeleton className="h-4 w-1/2" />
                                    </div>
                                ) : (
                                    <Textarea
                                        placeholder='Translation...'
                                        value={outputText}
                                        readOnly
                                        onChange={(e) => {
                                            setOutputText(e.target.value);
                                            if (e.target.value === "") {
                                                setInputText("");
                                            }
                                        }}
                                        className="h-48 resize-none bg-muted"
                                    />
                                )}
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={() => handleSpeak(outputText, targetLang)} disabled={!outputText}>
                                        <Volume2 className="mr-2" />
                                        Listen
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleMicClick('target')}
                                        className={cn(isRecording === 'target' && "bg-destructive text-destructive-foreground hover:bg-destructive/90")}
                                    >
                                        <Mic className="mr-2" />
                                        {isRecording === 'target' ? 'Stop' : 'Speak'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
