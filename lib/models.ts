/**
 * Configuration for available LLM models in the chat application
 */

export interface LLMModel {
    id: string;
    name: string;
    provider: string;
    available: boolean;
}

/**
 * List of all configured LLM models
 * To add new models: Add them here and ensure they're supported by OpenRouter
 */

export const AVAILABLE_MODELS: LLMModel[] = [
    {
        id: "gemini-1.5-flash",
        name: "Gemini 1.5 Flash",
        provider: "Google",
        available: true,
    },
    {
        id: "gemini-2.5-flash-preview-04-17",
        name: "Gemini 2.5 Flash",
        provider: "Google",
        available: true,
    },
    {
        id: "gemini-2.0-flash-001",
        name: "Gemini 2.0 Flash",
        provider: "Google",
        available: true,
    },
    {
        id: "gpt-4o",
        name: "GPT-4o",
        provider: "OpenAI",
        available: true,
    },
    {
        id: "gpt-4o-mini",
        name: "GPT-4o Mini",
        provider: "OpenAI",
        available: true,
    },
    {
        id: "gpt-4.1",
        name: "GPT-4.1",
        provider: "OpenAI",
        available: true,
    },
    {
        id: "gpt-4o-2024-11-20",
        name: "GPT-4o (Nov 2024)",
        provider: "OpenAI",
        available: true,
    },
    {
        id: "o4-mini",
        name: "GPT o4-mini",
        provider: "OpenAI",
        available: true,
    },
]

/**
 * Get a specific model by its ID
 */

export function getModelById(modelId: string): LLMModel | undefined {
    return AVAILABLE_MODELS.find((model) => model.id === modelId);
}


/**
 * Get only the models that are currently available/enabled
 */

export function getAvailableModels(): LLMModel[] {
    return AVAILABLE_MODELS.filter((model) => model.available);
}