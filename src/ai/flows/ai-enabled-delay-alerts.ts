'use server';
/**
 * @fileOverview This file defines an AI-enabled alert system for tracking potential delays in various business processes.
 *
 * It exports:
 * - `getDelayAlerts` - An asynchronous function to generate delay alerts based on current events.
 * - `DelayAlertInput` - The input type for the `getDelayAlerts` function.
 * - `DelayAlertOutput` - The output type for the `getDelayAlerts` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DelayAlertInputSchema = z.object({
  query: z
    .string()
    .describe(
      'A query describing the parts receiving, shipping, procurement, and materials to track for potential delays.'
    ),
});
export type DelayAlertInput = z.infer<typeof DelayAlertInputSchema>;

const DelayAlertOutputSchema = z.object({
  alerts: z
    .array(z.string())
    .describe(
      'A list of alerts indicating potential delays due to weather, news, political events, traffic, or riots.'
    ),
});
export type DelayAlertOutput = z.infer<typeof DelayAlertOutputSchema>;

export async function getDelayAlerts(input: DelayAlertInput): Promise<DelayAlertOutput> {
  return delayAlertsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'delayAlertsPrompt',
  input: {schema: DelayAlertInputSchema},
  output: {schema: DelayAlertOutputSchema},
  prompt: `You are an AI assistant tasked with identifying potential delays in business processes.

  Based on the query provided, analyze current weather, news, political events, traffic, and riots to identify potential disruptions.

  Query: {{{query}}}

  Provide a list of alerts indicating potential delays. Be specific about the cause of the delay and the affected process.
  `,
});

const delayAlertsFlow = ai.defineFlow(
  {
    name: 'delayAlertsFlow',
    inputSchema: DelayAlertInputSchema,
    outputSchema: DelayAlertOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
