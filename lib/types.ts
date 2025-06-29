// Interface for posts
export interface GeneratedPost {
    id: string
    platform: "linkedin" | "reddit" | "twitter"
    content: string
    hashtags?: string[]
    title?: string
}

// Interface for User defined post configurations
export interface UserConfig {
    knowledgeBase: string
    topic: string
    tone: string
    targetAudience: string
    postLength: string
    postsPerPlatform: {
        linkedin: number
        reddit: number
        twitter: number
    }
}

// Interface for API key providers
export interface ApiKeys {
    openai: string
    gemini: string
}