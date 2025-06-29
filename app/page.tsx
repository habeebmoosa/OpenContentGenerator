"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FloatingInputArea } from "@/components/input-area/FloatingInputArea"
import { HeaderArea } from "@/components/HeaderArea"
import { ContentArea } from "@/components/ContentArea"
import {
  Copy,
  ExternalLink,
  Linkedin,
  MessageCircle,
} from "lucide-react"
import { toast } from "sonner"
import { useTheme } from "next-themes"
import { FooterArea } from "@/components/FooterArea";
import { getAvailableModels, type LLMModel } from "@/lib/models";
import { decryptApiKeys } from "@/lib/encryption"
import { ApiKeys, GeneratedPost, UserConfig } from "@/lib/types";

const platformIcons = {
  linkedin: Linkedin,
  reddit: MessageCircle,
  twitter: () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
}

const platformNames = {
  linkedin: "LinkedIn",
  reddit: "Reddit",
  twitter: "X",
}

export default function SocialMediaGenerator() {
  const modelOptions = getAvailableModels();

  const [prompt, setPrompt] = useState("")
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["linkedin"])
  const [selectedModel, setSelectedModel] = useState<LLMModel>(modelOptions[0])
  const [generatedPosts, setGeneratedPosts] = useState<GeneratedPost[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [apiKeysOpen, setApiKeysOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState<GeneratedPost | null>(null)
  const { theme, setTheme } = useTheme()

  const [openAIBaseURL, setOpenAIBaseURL] = useState("");

  const [userConfig, setUserConfig] = useState<UserConfig>({
    knowledgeBase: "",
    topic: "",
    tone: "professional",
    targetAudience: "",
    postLength: "medium",
    postsPerPlatform: {
      linkedin: 3,
      reddit: 3,
      twitter: 3,
    },
  })

  const [apiKeys, setApiKeys] = useState<ApiKeys>({
    openai: "",
    gemini: "",
  })

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Load API keys from localStorage on mount
  useEffect(() => {
    const savedKeys = localStorage.getItem("ai-api-keys");
    const openaiBaseURL = localStorage.getItem("openai-base-url");
    const savedConfigs = localStorage.getItem("post-config");

    console.log(openaiBaseURL)
    setOpenAIBaseURL(openaiBaseURL ?? "")

    if (savedConfigs) {
      try {
        setUserConfig(JSON.parse(savedConfigs))
      } catch (error) {
        console.error("Error loading Post configs:", error)
      }
    }

    if (savedKeys) {
      try {
        const encryptedKeys = JSON.parse(savedKeys)

        const decryptedKeys = decryptApiKeys(encryptedKeys)
        setApiKeys(decryptedKeys)
      } catch (error) {
        console.error("Error loading API keys:", error)

        try {
          const plainKeys = JSON.parse(savedKeys)
          setApiKeys(plainKeys)
        } catch (e) {
          console.error("Failed to load API keys:", e)
        }
      }
    }
  }, [])

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms((prev) => (prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]))
  }

  const generateContent = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt to generate content.")
      return
    }

    if (selectedPlatforms.length === 0) {
      toast.warning("Please select at least one platform.")
      return
    }

    const currentApiKey = selectedModel.provider === "OpenAI" ? apiKeys.openai : apiKeys.gemini
    if (!currentApiKey) {
      toast.error(`Please add your ${selectedModel.provider === "OpenAI" ? "OpenAI" : "Google"} API key.`)
      return
    }

    setIsGenerating(true)

    try {
      const response = await fetch("/api/generate-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          platforms: selectedPlatforms,
          config: userConfig,
          model: selectedModel.id,
          provider: selectedModel.provider,
          apiKey: currentApiKey,
          openAIBaseURL: openAIBaseURL
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate content")
      }

      const data = await response.json()
      setGeneratedPosts((prev) => [...prev, ...data.posts])
      setPrompt("")

      toast.success(`Generated ${data.posts.length} posts successfully.`)
    } catch (error) {
      toast.error(`Failed to generate content: ${error}. Please try again.`)
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content)
    toast.success("Content copied to clipboard.")
  }

  const openSocialMedia = (platform: string, content: string, title: string) => {
    const urls = {
      linkedin: "https://www.linkedin.com/sharing/share-offsite/",
      reddit: `https://www.reddit.com/submit?title=${title}&text=${content}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(content)}`,
    }

    window.open(urls[platform as keyof typeof urls], "_blank")
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Fixed Header */}
      <div className="flex-shrink-0">
        <HeaderArea
          theme={theme || "light"}
          setTheme={setTheme}
          apiKeysOpen={apiKeysOpen}
          setApiKeysOpen={setApiKeysOpen}
          apiKeys={apiKeys}
          setApiKeys={setApiKeys}
          setOpenAIBaseURL={setOpenAIBaseURL}
          openAIBaseURL={openAIBaseURL}
        />
      </div>

      {/* Scrollable Content Area */}
      <ContentArea
        generatedPosts={generatedPosts}
        setSelectedPost={setSelectedPost}
        copyToClipboard={copyToClipboard}
        setPrompt={setPrompt}
      />


      {/* Fixed Floating Input Area */}
      <div className="flex-shrink-0 fixed bottom-5 left-1/2 transform -translate-x-1/2 z-50 px-6 w-full max-w-2xl">
        <div className="relative">
          <FloatingInputArea
            textareaRef={textareaRef}
            prompt={prompt}
            setPrompt={setPrompt}
            generateContent={generateContent}
            selectedPlatforms={selectedPlatforms}
            togglePlatform={togglePlatform}
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
            isGenerating={isGenerating}
            userConfig={userConfig}
            setUserConfig={setUserConfig}
          />
        </div>
      </div>

      {/* Footer Area */}
      <FooterArea />

      {/* Post Detail Dialog */}
      <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] dark:bg-gray-800">
          {selectedPost && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 dark:text-white">
                  {(() => {
                    const IconComponent = platformIcons[selectedPost.platform]
                    return <IconComponent className="w-5 h-5" />
                  })()}
                  {platformNames[selectedPost.platform]} Post
                </DialogTitle>
              </DialogHeader>
              <ScrollArea className="max-h-[60vh]">
                <div className="space-y-4 pr-4">
                  {selectedPost.title && (
                    <div>
                      <Label className="text-sm font-medium dark:text-gray-200">Title</Label>
                      <p className="mt-1 p-3 bg-gray-50 dark:bg-gray-700 rounded-md dark:text-white">
                        {selectedPost.title}
                      </p>
                    </div>
                  )}
                  <div>
                    <Label className="text-sm font-medium dark:text-gray-200">Content</Label>
                    <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-700 rounded-md whitespace-pre-wrap dark:text-white">
                      {selectedPost.content}
                    </div>
                  </div>
                  {selectedPost.hashtags && selectedPost.hashtags.length > 0 && (
                    <div>
                      <Label className="text-sm font-medium dark:text-gray-200">Hashtags</Label>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {selectedPost.hashtags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="dark:bg-gray-600 dark:text-gray-200">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => copyToClipboard(selectedPost.content)} className="flex-1">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Content
                </Button>
                <Button
                  onClick={() => openSocialMedia(selectedPost.platform, selectedPost.content, selectedPost.title ?? "")}
                  className="flex-1"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Post to {platformNames[selectedPost.platform]}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
