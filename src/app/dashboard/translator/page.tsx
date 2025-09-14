
"use client";

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRightLeft, Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { translateText } from '@/ai/flows/translate-text-flow';

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
    const { toast } = useToast();

    const handleTranslate = async () => {
        if (!inputText.trim()) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please enter text to translate.' });
            return;
        }
        setIsLoading(true);
        setOutputText('');
        try {
            const result = await translateText({ text: inputText, targetLang: languages.find(l => l.code === targetLang)?.name || 'Spanish' });
            setOutputText(result.translatedText);
        } catch (error) {
            console.error("Translation error:", error);
            toast({ variant: 'destructive', title: 'Translation Failed', description: 'Could not translate the text. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSwapLanguages = () => {
        const temp = sourceLang;
        setSourceLang(targetLang);
        setTargetLang(temp);
    };
    
    const handleSpeak = (text: string, lang: string) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = lang;
            window.speechSynthesis.speak(utterance);
        } else {
            toast({ variant: 'destructive', title: 'Not Supported', description: 'Your browser does not support text-to-speech.' });
        }
    };


    return (
        <div className="flex flex-col w-full">
            <Header pageTitle="Translator" />
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Language Translator</CardTitle>
                        <CardDescription>
                            Translate text between different languages. Powered by AI.
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
                                    placeholder={`Enter text in ${languages.find(l => l.code === sourceLang)?.name}...`}
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    className="h-48 resize-none"
                                />
                                <Button variant="outline" size="sm" onClick={() => handleSpeak(inputText, sourceLang)} disabled={!inputText}>
                                    <Volume2 className="mr-2" />
                                    Listen
                                </Button>
                            </div>
                            <div className="space-y-2">
                                <Textarea
                                    placeholder={isLoading ? 'Translating...' : 'Translation...'}
                                    value={outputText}
                                    readOnly
                                    className="h-48 resize-none bg-muted"
                                />
                                <Button variant="outline" size="sm" onClick={() => handleSpeak(outputText, targetLang)} disabled={!outputText}>
                                     <Volume2 className="mr-2" />
                                     Listen
                                </Button>
                            </div>
                        </div>
                        <div>
                             <Button onClick={handleTranslate} disabled={isLoading}>
                                {isLoading ? 'Translating...' : 'Translate'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
