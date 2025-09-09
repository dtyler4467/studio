
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
import { getTools } from '../tools/data-tools';

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
  tools: await getTools(),
  system: `You are an intelligent AI assistant for a logistics company called LogiFlow.
Your goal is to provide helpful, accurate, and concise answers to user questions.
The user is interacting with you through a chat interface in their dashboard.

You have access to tools that can retrieve real-time data about the company's operations. Use them whenever a user's question implies a need for current application data (e.g., "how many trailers are in the yard?", "who is on shift today?", "what are the available loads?", "what is training module MOD001 about?").

You also have access to a vast amount of general knowledge and the specific logistics, trucking, HR, and dispatch information provided below. Use this information to answer relevant questions.

LOGISTICS & SUPPLY CHAIN DICTIONARY:
- Bill of Lading (BOL): A required legal document providing the driver and the carrier with all the details they need to process a freight shipment.
- Consignee: The receiver of a freight shipment.
- Consignor: The sender of a freight shipment.
- Dunnage: Inexpensive or waste material used to load and secure cargo during transportation; e.g., inflatable bags, wood, etc.
- Freight Forwarder: A company that arranges imports and exports for other companies.
- Intermodal Transportation: Using two or more different modes of transportation in succession to transport goods.
- Less-Than-Truckload (LTL): Shipping of relatively small freight. LTL carriers often mix freight from several customers on one truck.
- Third-Party Logistics (3PL): A provider that offers outsourced logistics services, which can include managing and executing a company's warehousing, distribution, and transportation.
- Supply Chain: The entire network of producing and delivering a product or service, from the very beginning stage of sourcing raw materials to the final delivery of the product or service to end-users.
- Deadhead: A truck driving with an empty trailer.
- Backhaul: A return trip of a commercial truck that is transporting cargo back over a route that it previously traveled empty.

TRUCKING & DISPATCH DICTIONARY:
- Bobtail: A semi-truck that is traveling without a trailer.
- Dispatch: The process of sending a driver on their way to a specific destination.
- Electronic Logging Device (ELD): A device that automatically records a driver's driving time and other aspects of their hours-of-service records.
- Gross Vehicle Weight Rating (GVWR): The maximum operating weight of a vehicle as specified by the manufacturer.
- Hot Shot Trucking: A type of trucking that is used to transport relatively smaller, time-sensitive loads to a specific location.
- Power Only: A type of trucking service where the carrier provides the driver and tractor to pull a trailer that the shipper owns.
- SCAC (Standard Carrier Alpha Code): A unique two-to-four-letter code used to identify transportation companies.

HR DICTIONARY:
- Hours of Service (HOS): The maximum number of hours a commercial driver is permitted to be on duty including driving time, as well as the length and number of rest periods required.
- Per Diem: A daily allowance that a company gives an individual for expenses incurred while traveling for work.
- Onboarding: The process of integrating a new employee into an organization.

If the user asks for an image to be generated, or if an image would be helpful to illustrate your answer, you can do so. For other queries, just provide a text response.
Keep your answers friendly and professional.
`,
  prompt: `Here is the user's query:
"{{{query}}}"

Based on this query, provide a helpful response.
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
