
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
  imageUrl: z.string().optional().describe('An optional URL to an image relevant to the answer.'),
  videoUrl: z.string().optional().describe('An optional URL to a video relevant to the answer.'),
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
  If the user asks for an image to be generated, or if an image would be helpful to illustrate your answer, you can do so. For other queries, just provide a text response.

  Here is the user's query:
  "{{{query}}}"

  Based on this query, provide a helpful response.
  If the query is about application data (e.g., "how many trailers are in the yard?"), you can say that you are not yet able to access live data but that functionality is coming soon.
  Keep your answers friendly and professional.
  `,
});

const imageGenPrompt = ai.definePrompt({
  name: 'imageGenPrompt',
  input: { schema: z.object({ query: z.string() }) },
  output: { schema: z.object({ shouldGenerate: z.boolean(), subject: z.string() }) },
  prompt: `You are an expert at determining if a user wants to generate an image based on a query.
    If the user is asking for an image, or to "show" them something, or to "draw" something, they want an image.
    The user is a logistics professional. Only generate images related to logistics, transportation, trucks, shipping, etc.
    Do not generate images for other topics.

    Query: {{{query}}}
    
    Based on the query, should I generate an image? And what is the subject of the image?
  `
});

const assistantFlow = ai.defineFlow(
  {
    name: 'assistantFlow',
    inputSchema: AssistantInputSchema,
    outputSchema: AssistantOutputSchema,
  },
  async input => {
    const shouldGenerateImage = await imageGenPrompt({ query: input.query });

    let imagePromise: Promise<{ media: { url: string; }; }> | undefined;
    if (shouldGenerateImage.output?.shouldGenerate) {
      imagePromise = ai.generate({
        model: 'googleai/imagen-4.0-fast-generate-001',
        prompt: `A photorealistic image of ${shouldGenerateImage.output.subject}`,
      });
    }

    const [llmResponse, imageResponse] = await Promise.all([
      prompt(input),
      imagePromise,
    ]);

    const output = llmResponse.output || { answer: "I'm sorry, I couldn't generate a response." };
    if (imageResponse) {
      output.imageUrl = imageResponse.media.url;
    }
    
    return output;
  }
);
