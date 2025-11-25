import type { GenerateAnalyticalArtifactsOutput } from "@/ai/flows/generate-analytical-artifacts";
import type { GenerateRequirementsDocumentOutput } from "@/ai/flows/generate-requirements-document";
import { Timestamp } from "firebase/firestore";


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

export type Conversation = {
    title: string;
    messages: Message[];
    startTime: Timestamp;
    isFinalized: boolean;
    documents?: ChatCompletion;
};
