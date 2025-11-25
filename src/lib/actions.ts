// src/lib/actions.ts
'use server';

import {
  generateAnalyticalArtifacts,
  GenerateAnalyticalArtifactsOutput,
} from '@/ai/flows/generate-analytical-artifacts';
import {
  generateRequirementsDocument,
  GenerateRequirementsDocumentOutput,
} from '@/ai/flows/generate-requirements-document';
import { suggestImprovements } from '@/ai/flows/suggest-improvements';
import { publishDocumentsToConfluence } from '@/lib/confluence';
import { z } from 'zod';
import type { ChatCompletion, Suggestions } from './types';

const SuggestionSchema = z.object({
  performanceData: z
    .string()
    .min(10, { message: 'Please provide more detailed performance data.' }),
});

const DocumentSchema = z.object({
  conversationText: z
    .string()
    .min(50, { message: 'The conversation is too short to generate a document.' }),
});

export async function getImprovementSuggestionsAction(
  prevState: {
    message?: string;
    suggestions?: string;
    error?: string;
  },
  formData: FormData
): Promise<{ message?: string; suggestions?: string; error?: string; }> {
  const validatedFields = SuggestionSchema.safeParse({
    performanceData: formData.get('performanceData'),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors.performanceData?.[0],
    };
  }

  try {
    const result = await suggestImprovements({
      currentPerformanceData: validatedFields.data.performanceData,
    });
    return { message: 'success', suggestions: result.suggestions };
  } catch (e) {
    return { error: 'Failed to generate suggestions. Please try again.' };
  }
}

export async function generateDocumentsAction(
  prevState: {
    message?: string;
    documents?: ChatCompletion;
    error?: string;
  },
  formData: FormData
): Promise<{ message?: string; documents?: ChatCompletion, error?: string; }> {
  const validatedFields = DocumentSchema.safeParse({
    conversationText: formData.get('conversationText'),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors.conversationText?.[0],
    };
  }

  try {
    const [requirements, artifacts] = await Promise.all([
      generateRequirementsDocument({ interactionText: validatedFields.data.conversationText }),
      generateAnalyticalArtifacts({ userInput: validatedFields.data.conversationText }),
    ]);

    return {
      message: 'success',
      documents: { requirements, artifacts },
    };
  } catch (e) {
    return { error: 'Failed to generate documents. Please try again.' };
  }
}

export async function exportDocumentsToConfluenceAction(payload: {
  documents: ChatCompletion;
  conversationTitle: string;
}): Promise<
  | { success: true; url: string; action: 'created' | 'updated'; title: string }
  | { success: false; error: string }
> {
  if (!payload?.documents) {
    return { success: false, error: 'Missing generated documents to export.' };
  }

  try {
    const result = await publishDocumentsToConfluence({
      documents: payload.documents,
      conversationTitle: payload.conversationTitle,
    });
    return { success: true, ...result };
  } catch (error) {
    console.error('Confluence export failed', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Unable to export documents to Confluence.',
    };
  }
}
