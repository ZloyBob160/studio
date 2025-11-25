// src/ai/flows/suggest-improvements.ts
'use server';
/**
 * @fileOverview A flow that suggests improvements to business processes and workload reduction based on performance monitoring.
 *
 * - suggestImprovements - A function that suggests improvements.
 * - SuggestImprovementsInput - The input type for the suggestImprovements function.
 * - SuggestImprovementsOutput - The return type for the suggestImprovements function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestImprovementsInputSchema = z.object({
  currentPerformanceData: z
    .string()
    .describe('The current performance data of the business analyst team.'),
});
export type SuggestImprovementsInput = z.infer<typeof SuggestImprovementsInputSchema>;

const SuggestImprovementsOutputSchema = z.object({
  suggestions: z
    .string()
    .describe(
      'A list of suggestions to improve business processes and reduce workload.'
    ),
});
export type SuggestImprovementsOutput = z.infer<typeof SuggestImprovementsOutputSchema>;

export async function suggestImprovements(
  input: SuggestImprovementsInput
): Promise<SuggestImprovementsOutput> {
  return suggestImprovementsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestImprovementsPrompt',
  input: {schema: SuggestImprovementsInputSchema},
  output: {schema: SuggestImprovementsOutputSchema},
  prompt: `You are an expert business process improvement consultant.

  Based on the current performance data of the business analyst team, suggest concrete ways to improve their business processes and reduce their workload.

  Current Performance Data: {{{currentPerformanceData}}}`,
});

const suggestImprovementsFlow = ai.defineFlow(
  {
    name: 'suggestImprovementsFlow',
    inputSchema: SuggestImprovementsInputSchema,
    outputSchema: SuggestImprovementsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
