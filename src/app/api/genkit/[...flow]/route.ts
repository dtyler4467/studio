// IMPORTANT: This file is required for Genkit to work in a Next.js app.
// It is a Next.js route handler that re-exports the Genkit flow handler.
// Do not modify this file unless you know what you are doing.

import {nextHandler} from '@genkit-ai/next';
import '@/ai/dev';

export const POST = nextHandler();
