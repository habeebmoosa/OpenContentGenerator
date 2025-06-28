import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { createOpenAI, openai } from "@ai-sdk/openai"
import { createGoogleGenerativeAI, google } from "@ai-sdk/google"
import { decryptApiKey } from "@/lib/encryption"

interface GenerateRequest {
  prompt: string
  platforms: string[]
  config: {
    knowledgeBase: string
    topic: string
    tone: string
    targetAudience: string
    postsPerPlatform: {
      linkedin: number
      reddit: number
      twitter: number
    }
  }
  model: string
  provider: string
  apiKey: string
}

const platformPrompts = {
  linkedin: {
    instructions: `Create professional LinkedIn content that:
    - Uses a professional yet engaging tone
    - Includes industry insights and thought leadership
    - Encourages professional networking and engagement
    - Uses relevant professional hashtags
    - Has a clear call-to-action for professional growth
    - Follows LinkedIn best practices for visibility and engagement`,
    format: "Professional post with insights and hashtags",
  },
  reddit: {
    instructions: `Create Reddit content that:
    - Matches the conversational, authentic tone of Reddit
    - Provides genuine value and insights
    - Encourages discussion and community engagement
    - Avoids overly promotional language
    - Includes relevant context and background
    - Follows Reddit etiquette and community guidelines`,
    format: "Discussion-focused post with context and engagement hooks",
  },
  twitter: {
    instructions: `Create Twitter/X content that:
    - Is concise and impactful (under 280 characters when possible)
    - Uses trending hashtags and mentions when relevant
    - Includes engaging hooks and calls-to-action
    - Encourages retweets and replies
    - Uses thread format for longer content
    - Optimized for Twitter's algorithm and engagement`,
    format: "Concise, engaging tweet or thread",
  },
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json()
    const { prompt, platforms, config, model, provider, apiKey } = body

    if (!platforms || !prompt || !model || !provider || !apiKey) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Decrypt the API key before using it
    const decryptedApiKey = decryptApiKey(apiKey)
    if (!decryptedApiKey) {
      return NextResponse.json({ error: "Invalid or corrupted API key" }, { status: 400 })
    }

    // Configure the AI model
    let aiModel
    if (provider === "OpenAI") {
      const openai = createOpenAI({
        apiKey: decryptedApiKey,
      })
      aiModel = openai
    } else if (provider === "Google") {
      const gemini = createGoogleGenerativeAI({
        apiKey: decryptedApiKey
      })
      aiModel = gemini
    } else {
      return NextResponse.json({ error: "Invalid provider selected" }, { status: 400 })
    }

    let generatedPosts: any = []

    // Generate content for each selected platform
    for (const platform of platforms) {
      const platformConfig = platformPrompts[platform as keyof typeof platformPrompts]
      const postsToGenerate = config.postsPerPlatform[platform as keyof typeof config.postsPerPlatform]

      const systemPrompt = `You are an expert social media content creator specializing in ${platform}. 

        User Context:
        ${config.knowledgeBase ? `Knowledge Base: ${config.knowledgeBase}` : ""}
        ${config.topic ? `Topic Focus: ${config.topic}` : ""}
        ${config.targetAudience ? `Target Audience: ${config.targetAudience}` : ""}
        Tone: ${config.tone}

        Platform Instructions:
        ${platformConfig.instructions}

        Generate ${postsToGenerate} unique, high-quality posts that will perform well on ${platform}. Each post should be optimized for maximum engagement and reach on this specific platform.

        Return the response as a JSON array with this exact structure:
        [
          {
            "content": "The main post content",
            "title": "Optional title for the post (if applicable)",
            "hashtags": ["hashtag1", "hashtag2", "hashtag3"]
          }
        ]

        Make sure each post is unique, valuable, and tailored specifically for ${platform}'s audience and algorithm.`

      const userPrompt = `Create ${postsToGenerate} ${platform} posts about: ${prompt}

        Format: ${platformConfig.format}

        Remember to make each post unique and optimized for ${platform} specifically.`

      try {
        const { text } = await generateText({
          model: aiModel(model),
          system: systemPrompt,
          prompt: userPrompt,
          temperature: 0.8,
        })

        // Parse the JSON response
        let parsedPosts
        try {
          // Clean the response to extract JSON
          const jsonMatch = text.match(/\[[\s\S]*\]/)
          if (jsonMatch) {
            parsedPosts = JSON.parse(jsonMatch[0])
          } else {
            // Fallback: try to parse the entire response
            parsedPosts = JSON.parse(text)
          }
        } catch (parseError) {
          // Fallback: create a single post from the text
          parsedPosts = [
            {
              content: text,
              title: null,
              hashtags: [],
            },
          ]
        }

        // Add platform info and unique IDs to each post
        parsedPosts.forEach((post: any) => {
          generatedPosts.push({
            id: `${platform}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            platform,
            content: post.content,
            title: post.title,
            hashtags: post.hashtags || [],
          })
        })
      } catch (error) {
        console.error(`Error generating content for ${platform}:`, error)
        // Continue with other platforms even if one fails
      }
    }

    if (generatedPosts.length === 0) {
      return NextResponse.json({ error: "Failed to generate any content" }, { status: 500 })
    }

    return NextResponse.json({ posts: generatedPosts })
  } catch (error) {
    console.error("Error in generate-content API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}