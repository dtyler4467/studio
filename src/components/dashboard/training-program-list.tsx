
"use client";

import { useSchedule, TrainingProgram, TrainingModule } from "@/hooks/use-schedule";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Video, ChevronRight } from "lucide-react";
import Link from "next/link";

export function TrainingProgramList() {
    const { trainingPrograms } = useSchedule();

    // In a real app, you would filter programs assigned to the current user
    const assignedPrograms = trainingPrograms;

    return (
        <div>
            {assignedPrograms.length > 0 ? (
                <Accordion type="single" collapsible className="w-full" defaultValue="PROG001">
                    {assignedPrograms.map((program) => (
                        <AccordionItem value={program.id} key={program.id}>
                            <AccordionTrigger>
                                <div className="flex-1 text-left">
                                    <h3 className="font-semibold text-lg">{program.title}</h3>
                                    <p className="text-sm text-muted-foreground">{program.description}</p>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="space-y-3 pl-4 border-l-2 ml-2">
                                    {program.modules.map((module) => (
                                        <Link href={`/dashboard/resources/${module.id}`} key={module.id}>
                                            <div className="flex items-center justify-between p-4 rounded-md border hover:bg-muted/50 transition-colors cursor-pointer">
                                                <div className="flex items-center gap-4">
                                                    {module.type === 'video' ? 
                                                        <Video className="h-6 w-6 text-primary" /> : 
                                                        <FileText className="h-6 w-6 text-primary" />}
                                                    <div>
                                                        <h4 className="font-semibold">{module.title}</h4>
                                                        <p className="text-sm text-muted-foreground">{module.description}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <Badge variant="secondary">Not Started</Badge>
                                                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            ) : (
                 <div className="flex items-center justify-center rounded-md border border-dashed h-96">
                    <p className="text-muted-foreground">No training programs assigned.</p>
                </div>
            )}
        </div>
    )
}
