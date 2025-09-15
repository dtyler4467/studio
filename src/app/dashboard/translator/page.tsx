
"use client";

import { Header } from '@/components/layout/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Translator } from '@/components/dashboard/translator';

export default function TranslatorPage() {
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
                    <CardContent>
                         <Translator />
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
