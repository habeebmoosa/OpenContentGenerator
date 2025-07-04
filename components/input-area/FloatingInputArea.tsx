import { useState } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "../ui/textarea";
import { getAvailableModels, type LLMModel } from "@/lib/models";
import { ContentConfig } from "./ContentConfig";
import { UserConfig } from "@/lib/types";

interface FloatingInputAreaProps {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  prompt: string;
  setPrompt: (value: string) => void;
  generateContent: () => void;
  selectedPlatforms: string[];
  togglePlatform: (platform: string) => void;
  selectedModel: LLMModel;
  setSelectedModel: (value: LLMModel) => void;
  isGenerating: boolean;
  userConfig: UserConfig;
  setUserConfig: (config: UserConfig | ((prev: UserConfig) => UserConfig)) => void;
}

const platformIcons = {
  linkedin: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  reddit: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
    </svg>
  ),
  twitter: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
};

const platformColors = {
  linkedin: "bg-blue-600 hover:bg-blue-700 text-white",
  reddit: "bg-orange-600 hover:bg-orange-700 text-white",
  twitter: "bg-black hover:bg-gray-800 text-white dark:bg-white dark:text-black dark:hover:bg-gray-200",
};

const platformNames = {
  linkedin: "LinkedIn",
  reddit: "Reddit",
  twitter: "Twitter",
};

export const FloatingInputArea = ({
  textareaRef,
  prompt,
  setPrompt,
  generateContent,
  selectedPlatforms,
  togglePlatform,
  selectedModel,
  setSelectedModel,
  isGenerating,
  userConfig,
  setUserConfig,
}: FloatingInputAreaProps) => {
  const [configOpen, setConfigOpen] = useState(false);
  const modelOptions = getAvailableModels();

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      generateContent();
    }
  };

  const handleModelChange = (modelId: string) => {
    const model = modelOptions.find(m => m.id === modelId);
    if (model) {
      setSelectedModel(model);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-2">
        {/* Textarea */}
        <Textarea
          ref={textareaRef}
          placeholder="What content would you like to generate for your social media platforms?"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyPress={handleKeyPress}
          className="min-h-[60px] border-0 resize-none focus-visible:ring-0 text-base placeholder:text-gray-500 dark:placeholder:text-gray-400 dark:bg-gray-800 dark:text-white"
        />

        {/* Controls Row */}
        <div className="flex items-center justify-between mt-4">
          {/* Left Side - Config and Platform Buttons */}
          <div className="flex items-center gap-2">

            {/* Config Button */}
            <ContentConfig 
              configOpen={configOpen}
              setConfigOpen={setConfigOpen}
              userConfig={userConfig}
              setUserConfig={setUserConfig}
              platformNames={platformNames}
            />

            {/* Platform Selection Buttons */}
            {(["linkedin", "reddit", "twitter"] as const).map((platform) => {
              const IconComponent = platformIcons[platform];
              const isSelected = selectedPlatforms.includes(platform);
              return (
                <Button
                  key={platform}
                  variant={isSelected ? "default" : "ghost"}
                  size="sm"
                  onClick={() => togglePlatform(platform)}
                  className={`h-8 px-3 ${isSelected ? platformColors[platform] : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                >
                  <IconComponent className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">{platformNames[platform]}</span>
                </Button>
              );
            })}

          </div>

          {/* Right Side - Model Selection and Send Button */}
          <div className="flex items-center gap-2">
            {/* Model Selection */}
            <Select value={selectedModel.id} onValueChange={handleModelChange}>
              <SelectTrigger className="w-32 h-8 border-0 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                {modelOptions.map((model: LLMModel) => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Send Button */}
            <Button
              onClick={generateContent}
              disabled={isGenerating}
              size="sm"
              className="h-8 w-8 p-0 rounded-full"
            >
              {isGenerating ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <ArrowUp className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};