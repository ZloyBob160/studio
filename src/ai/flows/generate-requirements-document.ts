'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a business requirements document.
 *
 * The flow takes user input from a chatbot interaction and generates a structured document
 * containing the goal, description, scope, business rules, and KPIs.
 *
 * @exported
 * - `generateRequirementsDocument`: The main function to trigger the document generation flow.
 * - `GenerateRequirementsDocumentInput`: The TypeScript type for the input schema.
 * - `GenerateRequirementsDocumentOutput`: The TypeScript type for the output schema.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRequirementsDocumentInputSchema = z.object({
  interactionText: z
    .string()
    .describe(
      'The complete interaction text from the chatbot conversation with the bank employee.'
    ),
});
export type GenerateRequirementsDocumentInput = z.infer<
  typeof GenerateRequirementsDocumentInputSchema
>;

const GenerateRequirementsDocumentOutputSchema = z.object({
  goal: z.string().describe('The primary goal of the business requirement.'),
  description: z.string().describe('A detailed description of the requirement.'),
  scope: z.string().describe('The scope of the business requirement.'),
  businessRules: z.string().describe('The business rules associated with the requirement.'),
  kpis: z.string().describe('The Key Performance Indicators (KPIs) for the requirement.'),
});
export type GenerateRequirementsDocumentOutput = z.infer<
  typeof GenerateRequirementsDocumentOutputSchema
>;

export async function generateRequirementsDocument(
  input: GenerateRequirementsDocumentInput
): Promise<GenerateRequirementsDocumentOutput> {
  return generateRequirementsDocumentFlow(input);
}

const generateRequirementsDocumentPrompt = ai.definePrompt({
  name: 'generateRequirementsDocumentPrompt',
  input: {schema: GenerateRequirementsDocumentInputSchema},
  output: {schema: GenerateRequirementsDocumentOutputSchema},
  prompt: `You are an AI Business Analyst responsible for generating a business requirements document based on a conversation with a bank employee.

  Analyze the following interaction text and extract the necessary information to populate the document.

  Interaction Text: {{{interactionText}}}

  Generate the following sections for the business requirements document:

  - Goal: The primary objective of this business requirement.
  - Description: A detailed explanation of the business requirement.
  - Scope: The boundaries and limitations of the business requirement.
  - Business Rules: The rules and policies that govern the business requirement.
  - KPIs: The Key Performance Indicators to measure the success of the business requirement.

  Ensure that the generated document is clear, concise, and well-structured.
  Adhere to the schema descriptions when populating each output field.
  `,
});

const generateRequirementsDocumentFlow = ai.defineFlow(
  {
    name: 'generateRequirementsDocumentFlow',
    inputSchema: GenerateRequirementsDocumentInputSchema,
    outputSchema: GenerateRequirementsDocumentOutputSchema,
  },
  async input => {
    const {output} = await generateRequirementsDocumentPrompt(input);
    return output!;
  }
);
