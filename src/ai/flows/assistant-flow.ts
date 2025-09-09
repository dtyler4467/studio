
'use server';
/**
 * @fileOverview This file defines a Genkit flow for a general-purpose AI assistant.
 *
 * - getAssistantResponse - A function that handles generating a response to a user query.
 * - AssistantInput - The input type for the getAssistantResponse function.
 * - AssistantOutput - The return type for the getAssistantResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AssistantInputSchema = z.object({
  query: z.string().describe('The user\'s question or prompt.'),
});
export type AssistantInput = z.infer<typeof AssistantInputSchema>;

const AssistantOutputSchema = z.object({
  answer: z.string().describe('The AI-generated response to the user\'s query.'),
});
export type AssistantOutput = z.infer<typeof AssistantOutputSchema>;

export async function getAssistantResponse(input: AssistantInput): Promise<AssistantOutput> {
  return assistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'assistantPrompt',
  input: {schema: AssistantInputSchema},
  output: {schema: AssistantOutputSchema},
  prompt: `You are an intelligent AI assistant for a logistics company called LogiFlow.
  Your goal is to provide helpful, accurate, and concise answers to user questions.
  The user is interacting with you through a chat interface in their dashboard.
  You have access to a vast amount of information from the web to answer general knowledge questions.

  Here is the user's query:
  "{{{query}}}"

  Based on this query, provide a helpful response.
  If the query is about application data (e.g., "how many trailers are in the yard?"), you can say that you are not yet able to access live data but that functionality is coming soon.
  Keep your answers friendly and professional.
  `,
});

const assistantFlow = ai.defineFlow(
  {
    name: 'assistantFlow',
    inputSchema: AssistantInputSchema,
    outputSchema: AssistantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

