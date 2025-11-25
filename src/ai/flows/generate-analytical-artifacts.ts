'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating analytical artifacts based on user input.
 *
 * The flow takes user input and generates analytical artifacts such as Use Cases, process diagrams, user stories, and leading indicators.
 *
 * @exports generateAnalyticalArtifacts - An async function that triggers the analytical artifact generation flow.
 * @exports GenerateAnalyticalArtifactsInput - The input type for the generateAnalyticalArtifacts function.
 * @exports GenerateAnalyticalArtifactsOutput - The output type for the generateAnalyticalArtifacts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAnalyticalArtifactsInputSchema = z.object({
  userInput: z.string().describe('The user input describing the business situation.'),
});
export type GenerateAnalyticalArtifactsInput = z.infer<typeof GenerateAnalyticalArtifactsInputSchema>;

const GenerateAnalyticalArtifactsOutputSchema = z.object({
  useCases: z.string().describe('Generated Use Cases based on the user input.'),
  processDiagrams: z.string().describe('Generated process diagrams based on the user input.'),
  userStories: z.string().describe('Generated user stories based on the user input.'),
  leadingIndicators: z.string().describe('Generated leading indicators based on the user input.'),
});
export type GenerateAnalyticalArtifactsOutput = z.infer<typeof GenerateAnalyticalArtifactsOutputSchema>;

export async function generateAnalyticalArtifacts(input: GenerateAnalyticalArtifactsInput): Promise<GenerateAnalyticalArtifactsOutput> {
  return generateAnalyticalArtifactsFlow(input);
}

const generateAnalyticalArtifactsPrompt = ai.definePrompt({
  name: 'generateAnalyticalArtifactsPrompt',
  input: {schema: GenerateAnalyticalArtifactsInputSchema},
  output: {schema: GenerateAnalyticalArtifactsOutputSchema},
  prompt: `You are an expert business analyst. Based on the user input, generate analytical artifacts including Use Cases, process diagrams, user stories, and leading indicators.\n\nUser Input: {{{userInput}}}\n\nOutput the result in a structured format, clearly labeling each artifact type.\n\nUse Cases:\nUser Stories:\nProcess Diagrams:\nLeading Indicators:`,
});

const generateAnalyticalArtifactsFlow = ai.defineFlow(
  {
    name: 'generateAnalyticalArtifactsFlow',
    inputSchema: GenerateAnalyticalArtifactsInputSchema,
    outputSchema: GenerateAnalyticalArtifactsOutputSchema,
  },
  async input => {
    const {output} = await generateAnalyticalArtifactsPrompt(input);
    return output!;
  }
);
