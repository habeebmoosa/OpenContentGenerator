"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FloatingInputArea } from "@/components/FloatingInputArea"
import { HeaderArea } from "@/components/HeaderArea"
import {
  Settings,
  Copy,
  ExternalLink,
  Linkedin,
  MessageCircle,
  Key,
  Sparkles,
  Moon,
  Sun,
  ChevronDown,
  ArrowUp,
} from "lucide-react"
import { toast } from "sonner"
import { useTheme } from "next-themes"
import { FooterArea } from "@/components/FooterArea";
import { getAvailableModels, type LLMModel } from "@/lib/models";
import { DummyPosts } from "@/lib/dummy";

export interface GeneratedPost {
  id: string
  platform: "linkedin" | "reddit" | "twitter"
  content: string
  hashtags?: string[]
  title?: string
}

interface UserConfig {
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

interface ApiKeys {
  openai: string
  gemini: string
}

const platformIcons = {
  linkedin: Linkedin,
  reddit: MessageCircle,
  twitter: () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
}

const platformColors = {
  linkedin: "bg-blue-600 hover:bg-blue-700 text-white",
  reddit: "bg-orange-600 hover:bg-orange-700 text-white",
  twitter: "bg-black hover:bg-gray-800 text-white dark:bg-white dark:text-black dark:hover:bg-gray-200",
}

const platformNames = {
  linkedin: "LinkedIn",
  reddit: "Reddit",
  twitter: "X",
}

const modelOptions = [
  { value: "openai", label: "GPT-4" },
  { value: "gemini", label: "Gemini" },
]

export default function SocialMediaGenerator() {
  const modelOptions = getAvailableModels();

  const [prompt, setPrompt] = useState("")
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["linkedin"])
  const [selectedModel, setSelectedModel] = useState<LLMModel>(modelOptions[0])
  const [generatedPosts, setGeneratedPosts] = useState<GeneratedPost[]>(DummyPosts ?? [])
  const [isGenerating, setIsGenerating] = useState(false)
  const [configOpen, setConfigOpen] = useState(false)
  const [apiKeysOpen, setApiKeysOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState<GeneratedPost | null>(null)
  const { theme, setTheme } = useTheme()

  const [userConfig, setUserConfig] = useState<UserConfig>({
    knowledgeBase: "",
    topic: "",
    tone: "professional",
    targetAudience: "",
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
    const savedKeys = localStorage.getItem("ai-api-keys")
    if (savedKeys) {
      setApiKeys(JSON.parse(savedKeys))
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
      toast.error("Failed to generate content. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content)
    toast.success("Content copied to clipboard.")
  }

  const openSocialMedia = (platform: string, content: string) => {
    const urls = {
      linkedin: "https://www.linkedin.com/sharing/share-offsite/",
      reddit: "https://www.reddit.com/submit",
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(content)}`,
    }

    window.open(urls[platform as keyof typeof urls], "_blank")
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Fixed Header */}
      <div className="flex-shrink-0 shadow-sm">
        <HeaderArea
          theme={theme || "light"}
          setTheme={setTheme}
          apiKeysOpen={apiKeysOpen}
          setApiKeysOpen={setApiKeysOpen}
          apiKeys={apiKeys}
          setApiKeys={setApiKeys}
        />
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-6 pb-20">
            {generatedPosts.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <Sparkles className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                  <p className="text-lg mb-2">Ready to generate amazing content!</p>
                  <p className="text-sm">Enter your prompt below and select your platforms to get started.</p>
                </div>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
                {generatedPosts.map((post) => {
                  const IconComponent = platformIcons[post.platform]
                  return (
                    <Card
                      key={post.id}
                      className="cursor-pointer hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <Badge className={platformColors[post.platform]}>
                            <IconComponent className="w-3 h-3 mr-1" />
                            {platformNames[post.platform]}
                          </Badge>
                        </div>
                        {post.title && (
                          <CardTitle className="text-sm font-medium line-clamp-2 dark:text-white">{post.title}</CardTitle>
                        )}
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-3">{post.content}</p>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => copyToClipboard(post.content)}>
                            <Copy className="w-3 h-3 mr-1" />
                            Copy
                          </Button>
                          <Button size="sm" onClick={() => setSelectedPost(post)}>
                            View
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Fixed Floating Input Area */}
      <div className="flex-shrink-0 px-6">
        <div className="relative">
          {/* Shadow overlay to create depth effect */}
          <div className="absolute inset-x-0 -top-6 h-6 bg-gradient-to-t from-gray-50 dark:from-gray-900 via-gray-50/50 dark:via-gray-900/50 to-transparent pointer-events-none"></div>
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
      </div>

      <FooterArea />

      {/* Post Detail Dialog */}
      <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
        <DialogContent className="max-w-2xl dark:bg-gray-800">
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
              <div className="space-y-4">
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
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" onClick={() => copyToClipboard(selectedPost.content)} className="flex-1">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Content
                  </Button>
                  <Button
                    onClick={() => openSocialMedia(selectedPost.platform, selectedPost.content)}
                    className="flex-1"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Post to {platformNames[selectedPost.platform]}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
