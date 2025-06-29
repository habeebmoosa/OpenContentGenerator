import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "./ui/badge";
import { Copy, Linkedin, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";
import { GeneratedPost } from "@/lib/types";

interface ContentAreaProps {
  generatedPosts: GeneratedPost[];
  setSelectedPost: (post: GeneratedPost) => void;
  copyToClipboard: (content: string) => void;
  setPrompt: (prompt: string) => void;
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

export const ContentArea = ({
  generatedPosts,
  setSelectedPost,
  copyToClipboard,
  setPrompt
}: ContentAreaProps) => {
  return (
    <div className="flex-1 overflow-hidden">
      <ScrollArea className="h-full">
        <div className="p-6 pb-34">
          {generatedPosts.length === 0 ? (
            <div className="flex items-center justify-center min-h-[70vh] text-gray-500 dark:text-gray-400">
              <div className="w-full max-w-xl mx-auto">
                {/* <Sparkles className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" /> */}
                <h2 className="text-3xl font-semibold mb-2">Generate Content with AI</h2>
                <p className="text-sm mb-4">Click a prompt below to get started, or enter your own!</p>
                <div className="grid gap-3 mb-6">
                  {[
                    {
                      prompt: 'Share 3 tips for boosting productivity at work.',
                      platform: 'linkedin',
                    },
                    {
                      prompt: 'What is a recent tech innovation that excites you?',
                      platform: 'reddit',
                    },
                    {
                      prompt: 'Summarize today\'s trending news in 2 sentences.',
                      platform: 'twitter',
                    },
                    {
                      prompt: 'Give a motivational quote for professionals.',
                      platform: 'linkedin',
                    },
                  ].map(({ prompt, platform }, idx) => {
                    const Icon = platformIcons[platform as keyof typeof platformIcons];
                    return (
                      <button
                        key={idx}
                        className={`flex items-center w-full text-left px-4 py-3 rounded-lg dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 transition cursor-pointer`}
                        onClick={() => setPrompt(prompt)}
                        type="button"
                      >
                        <span className="mr-3">
                          <Icon className="w-4 h-4" />
                        </span>
                        <span className="text-base text-gray-800 dark:text-gray-200">{prompt}</span>
                      </button>
                    );
                  })}
                </div>
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
  )
}