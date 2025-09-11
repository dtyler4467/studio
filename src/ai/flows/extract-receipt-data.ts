
'use server';
/**
 * @fileOverview An AI flow to extract structured data from a receipt image.
 *
 * It exports:
 * - `extractReceiptData` - An asynchronous function to analyze a receipt image and return structured data.
 * - `ReceiptData` - The output type for the `extractReceiptData` function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ReceiptDataSchema = z.object({
  vendor: z.string().describe('The name of the vendor or store.'),
  date: z.string().describe('The date of the transaction in YYYY-MM-DD format.'),
  amount: z.string().describe('The total amount of the transaction as a string of numbers.'),
  category: z.enum(['Fuel', 'Food', 'Maintenance', 'Lodging', 'Other']).describe('The category of the expense.'),
  notes: z.string().optional().describe('Any brief, relevant notes about the transaction.'),
});
export type ReceiptData = z.infer<typeof ReceiptDataSchema>;

const ExtractReceiptInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a receipt, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractReceiptInput = z.infer<typeof ExtractReceiptInputSchema>;


export async function extractReceiptData(input: ExtractReceiptInput): Promise<ReceiptData> {
  return extractReceiptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractReceiptPrompt',
  input: { schema: ExtractReceiptInputSchema },
  output: { schema: ReceiptDataSchema },
  prompt: `You are an expert at extracting information from receipt images.
Analyze the provided receipt image and extract the following information:
- Vendor/Store Name
- Transaction Date (in YYYY-MM-DD format)
- Total Amount
- Category of expense (must be one of: Fuel, Food, Maintenance, Lodging, Other)

If the receipt is for a gas station, classify it as 'Fuel'.
If it's a restaurant or grocery store, classify it as 'Food'.
If it's for auto parts or service, classify it as 'Maintenance'.
If it's a hotel or motel, classify it as 'Lodging'.
Otherwise, classify it as 'Other'.

Do not add any commentary. Only return the extracted data.

Receipt Image: {{media url=photoDataUri}}`,
});

const extractReceiptFlow = ai.defineFlow(
  {
    name: 'extractReceiptFlow',
    inputSchema: ExtractReceiptInputSchema,
    outputSchema: ReceiptDataSchema,
  },
  async input => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to extract data from the receipt.');
    }
    return output;
  }
);

    