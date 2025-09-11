
'use server';
/**
 * @fileOverview An AI flow to edit and enhance receipt images, similar to a document scanner app.
 *
 * It exports:
 * - `editReceiptImage` - An asynchronous function to apply enhancements to a receipt image.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const EditReceiptImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a receipt, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  enhancements: z.array(z.string()).describe('A list of enhancements to apply to the image.'),
});
type EditReceiptImageInput = z.infer<typeof EditReceiptImageInputSchema>;

const EditReceiptImageOutputSchema = z.object({
    editedPhotoDataUri: z.string().describe('The edited photo of the receipt as a data URI.'),
});
type EditReceiptImageOutput = z.infer<typeof EditReceiptImageOutputSchema>;


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
    
    const promptText = `Act as a document scanner application like CamScanner. Your task is to edit the following receipt image.
Apply these enhancements diligently: ${enhancements.join(', ')}.

If 'Self-Cropping' is requested, you must perform the following steps:
1. Identify the receipt document from any background in the image.
2. Find the four corners of the receipt, even if it's at an angle.
3. Perform a perspective warp to make the receipt appear as a flat, top-down scan.
4. Crop the image to show *only* the flattened receipt, removing all background completely.

Return only the fully edited image. Do not return any text or commentary.`;

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
