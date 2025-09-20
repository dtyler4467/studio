
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useSchedule, JobPosting } from '@/hooks/use-schedule';
import { useToast } from '@/hooks/use-toast';
import { DocumentUpload } from '@/components/dashboard/document-upload';
import { User, Briefcase, GraduationCap, Sparkles, PlusCircle, Trash2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';

const workHistorySchema = z.object({
  jobTitle: z.string().min(1, "Job title is required."),
  company: z.string().min(1, "Company name is required."),
  startDate: z.string().min(1, "Start date is required."),
  endDate: z.string().optional(),
  responsibilities: z.string().optional(),
});

const educationSchema = z.object({
  institution: z.string().min(1, "Institution is required."),
  degree: z.string().min(1, "Degree is required."),
  fieldOfStudy: z.string().optional(),
  graduationYear: z.string().optional(),
});

const applicationFormSchema = z.object({
  jobId: z.string().min(1, 'You must select a job to apply for.'),
  fullName: z.string().min(2, 'Full name is required.'),
  email: z.string().email('Please enter a valid email.'),
  phone: z.string().min(10, 'Please enter a valid phone number.'),
  resumeUri: z.string().nullable().optional(),
  workHistory: z.array(workHistorySchema).optional(),
  education: z.array(educationSchema).optional(),
  skills: z.string().optional(),
  coverLetter: z.string().optional(),
});

type ApplicationFormValues = z.infer<typeof applicationFormSchema>;

const Section = ({ icon, title, description, children }: { icon: React.ElementType, title: string, description: string, children: React.ReactNode }) => (
    <div className="space-y-4 rounded-lg border p-6">
        <div className="flex items-start gap-4">
            <div className="bg-muted p-3 rounded-full">
                {React.createElement(icon, { className: "h-5 w-5 text-primary" })}
            </div>
            <div>
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
        </div>
        <div className="pl-12 space-y-4">
            {children}
        </div>
    </div>
);

export default function ApplicationsPage() {
    const { jobPostings, addApplicant } = useSchedule();
    const { toast } = useToast();
    const router = useRouter();

    const openJobs = useMemo(() => jobPostings.filter(j => j.status === 'Open'), [jobPostings]);

    const form = useForm<ApplicationFormValues>({
        resolver: zodResolver(applicationFormSchema),
        defaultValues: {
            jobId: '',
            fullName: '',
            email: '',
            phone: '',
            resumeUri: null,
            workHistory: [{ jobTitle: '', company: '', startDate: '', endDate: '', responsibilities: '' }],
            education: [{ institution: '', degree: '', fieldOfStudy: '', graduationYear: '' }],
            skills: '',
            coverLetter: '',
        },
    });

    const { fields: workFields, append: appendWork, remove: removeWork } = useFieldArray({
        control: form.control,
        name: 'workHistory',
    });

    const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({
        control: form.control,
        name: 'education',
    });

    const onSubmit = (data: ApplicationFormValues) => {
        addApplicant({
            name: data.fullName,
            email: data.email,
            phone: data.phone,
            applyingFor: data.jobId,
            resumeUri: data.resumeUri,
            status: 'Applied',
            notes: `Cover Letter: ${data.coverLetter || 'N/A'}\nSkills: ${data.skills || 'N/A'}`
        });

        toast({
            title: "Application Submitted!",
            description: "Your application has been received. We will be in touch shortly.",
        });

        form.reset();
        router.push('/dashboard/recruitment-hub');
    };

    return (
        <div className="flex flex-col w-full">
        <Header pageTitle="Job Application" />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <Card className="max-w-4xl mx-auto w-full">
                <CardHeader>
                    <CardTitle className="font-headline text-3xl">Apply for a Position</CardTitle>
                    <CardDescription>
                        Complete the form below to apply for an open position at LogiFlow.
                    </CardDescription>
                </CardHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <CardContent className="space-y-6">
                            <FormField
                                control={form.control}
                                name="jobId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Position Applying For</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a job opening..." />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {openJobs.map(job => (
                                                    <SelectItem key={job.id} value={job.id}>{job.title} - {job.location}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Section icon={User} title="Personal Information" description="How we can contact you.">
                                <div className="grid sm:grid-cols-2 gap-4">
                                     <FormField control={form.control} name="fullName" render={({ field }) => (
                                        <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                     )}/>
                                      <FormField control={form.control} name="email" render={({ field }) => (
                                        <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                                     )}/>
                                </div>
                                <FormField control={form.control} name="phone" render={({ field }) => (
                                    <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                            </Section>

                            <Section icon={Briefcase} title="Work History" description="Your previous employment experience.">
                                <div className="space-y-4">
                                    {workFields.map((field, index) => (
                                        <div key={field.id} className="p-4 border rounded-md space-y-2 relative">
                                            <div className="grid grid-cols-2 gap-4">
                                                <FormField control={form.control} name={`workHistory.${index}.jobTitle`} render={({ field }) => (
                                                    <FormItem><FormLabel>Job Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                                )}/>
                                                <FormField control={form.control} name={`workHistory.${index}.company`} render={({ field }) => (
                                                    <FormItem><FormLabel>Company</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                                )}/>
                                            </div>
                                             <div className="grid grid-cols-2 gap-4">
                                                 <FormField control={form.control} name={`workHistory.${index}.startDate`} render={({ field }) => (
                                                    <FormItem><FormLabel>Start Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                                                )}/>
                                                 <FormField control={form.control} name={`workHistory.${index}.endDate`} render={({ field }) => (
                                                    <FormItem><FormLabel>End Date (Optional)</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                                                )}/>
                                            </div>
                                            <FormField control={form.control} name={`workHistory.${index}.responsibilities`} render={({ field }) => (
                                                <FormItem><FormLabel>Responsibilities</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                                            )}/>
                                            {workFields.length > 1 && <Button type="button" variant="ghost" size="icon" className="absolute top-1 right-1" onClick={() => removeWork(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>}
                                        </div>
                                    ))}
                                    <Button type="button" variant="outline" size="sm" onClick={() => appendWork({ jobTitle: '', company: '', startDate: '' })}><PlusCircle className="mr-2"/>Add Work Experience</Button>
                                </div>
                            </Section>

                             <Section icon={GraduationCap} title="Education" description="Your educational background.">
                                <div className="space-y-4">
                                    {eduFields.map((field, index) => (
                                         <div key={field.id} className="p-4 border rounded-md space-y-2 relative">
                                             <FormField control={form.control} name={`education.${index}.institution`} render={({ field }) => (
                                                <FormItem><FormLabel>Institution</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                            )}/>
                                            <div className="grid grid-cols-3 gap-4">
                                                 <FormField control={form.control} name={`education.${index}.degree`} render={({ field }) => (
                                                    <FormItem><FormLabel>Degree</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                                )}/>
                                                 <FormField control={form.control} name={`education.${index}.fieldOfStudy`} render={({ field }) => (
                                                    <FormItem><FormLabel>Field of Study</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                                )}/>
                                                 <FormField control={form.control} name={`education.${index}.graduationYear`} render={({ field }) => (
                                                    <FormItem><FormLabel>Grad. Year</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                                )}/>
                                            </div>
                                            {eduFields.length > 1 && <Button type="button" variant="ghost" size="icon" className="absolute top-1 right-1" onClick={() => removeEdu(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>}
                                        </div>
                                    ))}
                                    <Button type="button" variant="outline" size="sm" onClick={() => appendEdu({ institution: '', degree: '' })}><PlusCircle className="mr-2"/>Add Education</Button>
                                </div>
                            </Section>

                            <Section icon={Sparkles} title="Skills & Supporting Documents" description="Highlight your qualifications.">
                                 <FormField control={form.control} name="skills" render={({ field }) => (
                                    <FormItem><FormLabel>Relevant Skills</FormLabel><FormControl><Textarea placeholder="List skills separated by commas..." {...field} /></FormControl><FormMessage /></FormItem>
                                 )}/>
                                  <FormField control={form.control} name="resumeUri" render={({ field }) => (
                                     <FormItem><FormLabel>Resume/CV</FormLabel><FormControl><DocumentUpload onDocumentChange={field.onChange} currentDocument={field.value} /></FormControl><FormMessage /></FormItem>
                                 )}/>
                                  <FormField control={form.control} name="coverLetter" render={({ field }) => (
                                     <FormItem><FormLabel>Cover Letter (Optional)</FormLabel><FormControl><Textarea className="h-32" {...field} /></FormControl><FormMessage /></FormItem>
                                 )}/>
                            </Section>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" size="lg">Submit Application</Button>
                        </CardFooter>
                    </form>
                </Form>
            </Card>
        </main>
        </div>
    );
}
