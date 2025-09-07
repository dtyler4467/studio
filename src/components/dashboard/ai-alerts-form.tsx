"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  aiProcurementAlerts,
  AiProcurementAlertsOutput,
} from "@/ai/flows/ai-procurement-alerts";
import {
  getDelayAlerts,
  DelayAlertOutput,
} from "@/ai/flows/ai-enabled-delay-alerts";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

const formSchema = z.object({
  query: z.string().min(10, {
    message: "Query must be at least 10 characters.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export function AiAlertsForm() {
  const [loading, setLoading] = useState(false);
  const [procurementAlert, setProcurementAlert] =
    useState<AiProcurementAlertsOutput | null>(null);
  const [delayAlerts, setDelayAlerts] = useState<DelayAlertOutput | null>(
    null
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query:
        "Check for potential delays for electronic components shipping from Taiwan to the Port of Los Angeles.",
    },
  });

  async function onSubmit(data: FormValues) {
    setLoading(true);
    setProcurementAlert(null);
    setDelayAlerts(null);

    try {
      const [procurementRes, delayRes] = await Promise.all([
        aiProcurementAlerts(data),
        getDelayAlerts(data),
      ]);
      setProcurementAlert(procurementRes);
      setDelayAlerts(delayRes);
    } catch (error) {
      console.error("Error fetching AI alerts:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="query"
            render={({ field }) => (
              <FormItem>
                <FormLabel>AI Alert Query</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe parts, routes, and materials to check for delays..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Generating Alerts..." : "Generate Alerts"}
          </Button>
        </form>
      </Form>

      {loading && (
         <div className="flex items-center justify-center rounded-md border border-dashed p-8 text-center animate-pulse">
            <p className="text-muted-foreground">AI is analyzing potential disruptions...</p>
        </div>
      )}

      <div className="space-y-4">
        {procurementAlert && (
          <Alert>
            <Terminal className="h-4 w-4" />
            <AlertTitle className="font-headline">Procurement Alert</AlertTitle>
            <AlertDescription>{procurementAlert.alert}</AlertDescription>
          </Alert>
        )}

        {delayAlerts && delayAlerts.alerts.length > 0 && (
          <Alert>
            <Terminal className="h-4 w-4" />
            <AlertTitle className="font-headline">Potential Delay Factors</AlertTitle>
            <AlertDescription>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                {delayAlerts.alerts.map((alert, index) => (
                  <li key={index}>{alert}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
