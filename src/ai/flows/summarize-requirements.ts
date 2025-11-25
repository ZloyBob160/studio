'use server';

/**
 * @fileOverview This file defines a Genkit flow for summarizing business requirements elicited from user interactions.
 *
 * The flow takes the raw requirements as input and returns a concise summary.
 *
 * @param {SummarizeRequirementsInput} input - The input to the flow, containing the raw requirements.
 * @returns {Promise<SummarizeRequirementsOutput>} - A promise that resolves to the summary of the requirements.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeRequirementsInputSchema = z.object({
  requirements: z
    .string()
    .describe('The raw business requirements elicited from user interactions.'),
});
export type SummarizeRequirementsInput = z.infer<
  typeof SummarizeRequirementsInputSchema
>;

const SummarizeRequirementsOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the business requirements.'),
});
export type SummarizeRequirementsOutput = z.infer<
  typeof SummarizeRequirementsOutputSchema
>;

/**
 * Summarizes the given business requirements.
 * @param input The input containing the raw requirements.
 * @returns A promise that resolves to the summary of the requirements.
 */
export async function summarizeRequirements(
  input: SummarizeRequirementsInput
): Promise<SummarizeRequirementsOutput> {
  return summarizeRequirementsFlow(input);
}

const summarizeRequirementsPrompt = ai.definePrompt({
  name: 'summarizeRequirementsPrompt',
  input: {schema: SummarizeRequirementsInputSchema},
  output: {schema: SummarizeRequirementsOutputSchema},
  prompt: `You are a business analyst. Please provide a concise summary of the following business requirements:\n\n{{{requirements}}}`,
});

const summarizeRequirementsFlow = ai.defineFlow(
  {
    name: 'summarizeRequirementsFlow',
    inputSchema: SummarizeRequirementsInputSchema,
    outputSchema: SummarizeRequirementsOutputSchema,
  },
  async input => {
    const {output} = await summarizeRequirementsPrompt(input);
    return output!;
  }
);
