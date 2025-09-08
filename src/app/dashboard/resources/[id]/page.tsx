
"use client";

import { useParams, notFound, useRouter } from "next/navigation";
import { useSchedule, TrainingModule } from "@/hooks/use-schedule";
import { useEffect, useState } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Video, GraduationCap, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";


function DocumentViewer({ content }: { content: string }) {
    // In a real app, you might use a library like 'react-markdown'
    return <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }} />;
}

function VideoPlayer({ url }: { url: string }) {
    return (
        <div className="aspect-video w-full">
            <iframe
                className="w-full h-full rounded-md"
                src={url}
                title="Training Video Player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            ></iframe>
        </div>
    )
}


export default function TrainingModulePage() {
    const params = useParams();
    const router = useRouter();
    const { getTrainingModuleById } = useSchedule();
    const { id } = params;
    const [module, setModule] = useState<TrainingModule | null | undefined>(undefined);

    useEffect(() => {
        if (typeof id === 'string') {
            const foundModule = getTrainingModuleById(id);
            setModule(foundModule);
        }
    }, [id, getTrainingModuleById]);


    if (module === undefined) {
        return (
            <div className="flex flex-col w-full">
                <Header pageTitle="Loading Module..." />
                <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                     <Card>
                        <CardHeader>
                            <Skeleton className="h-8 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </CardHeader>
                        <CardContent>
                           <Skeleton className="w-full h-96" />
                        </CardContent>
                     </Card>
                </main>
            </div>
        )
    }

    if (module === null) {
        notFound();
    }

    return (
        <div className="flex flex-col w-full">
            <Header pageTitle={module.title} />
             <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h1 className="text-xl font-semibold text-muted-foreground">Back to Training Programs</h1>
                </div>
                 <Card>
                    <CardHeader>
                        <div className="flex items-start gap-4">
                            <div className="bg-primary/10 p-3 rounded-md">
                                {module.type === 'video' ? <Video className="h-6 w-6 text-primary" /> : <FileText className="h-6 w-6 text-primary" />}
                            </div>
                            <div>
                                <CardTitle className="font-headline">{module.title}</CardTitle>
                                <CardDescription>{module.description}</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {module.type === 'video' ? <VideoPlayer url={module.content} /> : <DocumentViewer content={module.content} />}
                    </CardContent>
                    {module.exam && (
                        <CardFooter>
                            <Button asChild className="w-full">
                                <Link href={`/dashboard/resources/${module.id}/exam`}>
                                    <GraduationCap className="mr-2" />
                                    Proceed to Exam
                                </Link>
                            </Button>
                        </CardFooter>
                    )}
                 </Card>
            </main>
        </div>
    )
}
