'use server';
/**
 * @fileOverview This file defines a Genkit flow for AI-powered procurement alerts.
 *
 * - aiProcurementAlerts - A function that triggers the procurement alert flow.
 * - AiProcurementAlertsInput - The input type for the aiProcurementAlerts function.
 * - AiProcurementAlertsOutput - The return type for the aiProcurementAlerts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiProcurementAlertsInputSchema = z.object({
  query: z
    .string()
    .describe(
      'A query describing the parts, receiving, shipping, procurement, and materials to check for delays.'
    ),
});
export type AiProcurementAlertsInput = z.infer<typeof AiProcurementAlertsInputSchema>;

const AiProcurementAlertsOutputSchema = z.object({
  alert: z
    .string()
    .describe(
      'An alert message indicating potential delays in parts receiving, shipping, procurement, and materials due to weather, news, politics news, traffic, and riots.'
    ),
});
export type AiProcurementAlertsOutput = z.infer<typeof AiProcurementAlertsOutputSchema>;

export async function aiProcurementAlerts(input: AiProcurementAlertsInput): Promise<AiProcurementAlertsOutput> {
  return aiProcurementAlertsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiProcurementAlertsPrompt',
  input: {schema: AiProcurementAlertsInputSchema},
  output: {schema: AiProcurementAlertsOutputSchema},
  prompt: `You are an AI assistant designed to provide alerts for potential delays in procurement or shipments.
  Based on the query provided, analyze weather, traffic, political news, and other relevant information to identify potential disruptions.
  Generate an alert message if any potential delays are detected.
  Query: {{{query}}}`,
});

const aiProcurementAlertsFlow = ai.defineFlow(
  {
    name: 'aiProcurementAlertsFlow',
    inputSchema: AiProcurementAlertsInputSchema,
    outputSchema: AiProcurementAlertsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
