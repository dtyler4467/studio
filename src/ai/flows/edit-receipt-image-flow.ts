'use server';
/**
 * @fileOverview An AI flow to edit and enhance receipt images.
 *
 * It exports:
 * - `editReceiptImage` - An asynchronous function to apply enhancements to a receipt image.
 * - `EditReceiptImageInput` - The input type for the `editReceiptImage` function.
 * - `EditReceiptImageOutput` - The output type for the `editReceiptImage` function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

export const EditReceiptImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a receipt, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  enhancements: z.array(z.string()).describe('A list of enhancements to apply to the image.'),
});
export type EditReceiptImageInput = z.infer<typeof EditReceiptImageInputSchema>;

export const EditReceiptImageOutputSchema = z.object({
    editedPhotoDataUri: z.string().describe('The edited photo of the receipt as a data URI.'),
});
export type EditReceiptImageOutput = z.infer<typeof EditReceiptImageOutputSchema>;


export async function editReceiptImage(input: EditReceiptImageInput): Promise<EditReceiptImageOutput> {
  return editReceiptImageFlow(input);
}

const editReceiptImageFlow = ai.defineFlow(
  {
    name: 'editReceiptImageFlow',
    inputSchema: EditReceiptImageInputSchema,
    outputSchema: EditReceiptImageOutputSchema,
  },
  async ({ photoDataUri, enhancements }) => {
    
    const promptText = `Please edit the following receipt image. Apply these enhancements: ${enhancements.join(', ')}. Return only the edited image.`;

    const { media } = await ai.generate({
        model: 'googleai/gemini-2.5-flash-image-preview',
        prompt: [
            { media: { url: photoDataUri } },
            { text: promptText },
        ],
        config: {
            responseModalities: ['TEXT', 'IMAGE'],
        },
    });

    if (!media?.url) {
        throw new Error('Failed to edit the receipt image.');
    }

    return { editedPhotoDataUri: media.url };
  }
);
