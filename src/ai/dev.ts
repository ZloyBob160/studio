import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-improvements.ts';
import '@/ai/flows/generate-requirements-document.ts';
import '@/ai/flows/summarize-requirements.ts';
import '@/ai/flows/generate-analytical-artifacts.ts';