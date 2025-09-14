
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { PenSquare, Lightbulb, Workflow, Users } from 'lucide-react';

const StickyNote = ({ children, className, position }: { children: React.ReactNode, className: string, position: string }) => (
    <div className={`absolute w-32 h-32 p-3 shadow-lg rounded-md flex items-center justify-center text-center text-sm font-medium ${className} ${position}`}>
        {children}
    </div>
);

export default function ProjectWhiteboardPage() {
  return (
    <div className="flex flex-col w-full">
      <Header pageTitle="Project Whiteboard" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <PenSquare />
                    Collaborative Whiteboard
                </CardTitle>
                <CardDescription>
                    Brainstorm ideas, map out workflows, and collaborate with your team in real-time.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="relative w-full h-[600px] rounded-lg border bg-muted/30 overflow-hidden">
                    {/* Mock-up of whiteboard elements */}
                    <div className="absolute top-10 left-10 transform -rotate-3">
                         <StickyNote className="bg-yellow-200 text-yellow-800" position="top-10 left-10">
                            Q3 Marketing Push
                        </StickyNote>
                    </div>
                     <div className="absolute top-48 left-64 transform rotate-2">
                        <StickyNote className="bg-blue-200 text-blue-800" position="top-48 left-64">
                            New Website Wireframe
                        </StickyNote>
                    </div>
                     <div className="absolute bottom-20 right-32 transform -rotate-1">
                        <StickyNote className="bg-green-200 text-green-800" position="bottom-20 right-32">
                            Finalize Budget
                        </StickyNote>
                    </div>

                    {/* Mock-up arrows and lines */}
                    <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <path d="M 180 120 Q 250 180 280 250" stroke="hsl(var(--foreground))" fill="none" strokeWidth="2" strokeDasharray="5,5" markerEnd="url(#arrowhead)" />
                        <defs>
                            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                                <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--foreground))" />
                            </marker>
                        </defs>
                    </svg>
                    
                    {/* Overlay to indicate it's a placeholder */}
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-4">
                        <div className="p-10 rounded-lg bg-background/70 shadow-xl">
                            <Lightbulb className="w-12 h-12 mx-auto text-primary" />
                            <h3 className="mt-4 text-2xl font-bold font-headline">Real-Time Collaboration Coming Soon</h3>
                            <p className="mt-2 text-muted-foreground max-w-md">
                                This space will transform into a fully interactive whiteboard for your team to brainstorm, plan, and create together.
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
