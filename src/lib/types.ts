import type { GenerateAnalyticalArtifactsOutput } from "@/ai/flows/generate-analytical-artifacts";
import type { GenerateRequirementsDocumentOutput } from "@/ai/flows/generate-requirements-document";


export type Message = {
    role: 'user' | 'assistant';
    content: string;
};

export type ChatCompletion = {
    requirements: GenerateRequirementsDocumentOutput;
    artifacts: GenerateAnalyticalArtifactsOutput;
}

export type Suggestions = {
    suggestions: string;
}
