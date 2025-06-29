import { Separator } from "@/components/ui/separator";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Settings } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { UserConfig } from "./FloatingInputArea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "../ui/scroll-area";
import { toast } from "sonner";

interface ContentConfigProps {
    configOpen: boolean;
    setConfigOpen: (config: boolean) => void;
    userConfig: UserConfig;
    setUserConfig: (config: UserConfig | ((prev: UserConfig) => UserConfig)) => void;
    platformNames: Record<"linkedin" | "reddit" | "twitter", string>;
}

export const ContentConfig = ({
    configOpen,
    setConfigOpen,
    userConfig,
    setUserConfig,
    platformNames
}: ContentConfigProps) => {

    const handleSaveConfig = () => {
        localStorage.setItem("post-config", JSON.stringify(userConfig))
        setConfigOpen(false);
        toast.success("Your post configurations saved successfully.")
    }

    return (
        <Dialog open={configOpen} onOpenChange={setConfigOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 px-2">
                    <Settings className="w-4 h-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto dark:bg-gray-800">
                <DialogHeader>
                    <DialogTitle className="dark:text-white">Content Configuration</DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-[60vh]">
                    <div className="flex flex-col space-y-4 px-4">
                        {/* Left Column - Knowledge Base */}
                        <div className="space-y-1">
                            <Label htmlFor="knowledge-base" className="dark:text-gray-200 text-base font-medium">
                                Knowledge Base
                            </Label>
                            <Textarea
                                id="knowledge-base"
                                placeholder="Tell the AI about yourself, your brand, your expertise, and what kind of content you typically share..."
                                value={userConfig.knowledgeBase}
                                onChange={(e) => setUserConfig((prev) => ({ ...prev, knowledgeBase: e.target.value }))}
                                className="h-48 resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                        </div>

                        {/* Right Column - Other Settings */}
                        <div className="space-y-6">
                            {/* Basic Settings */}
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <Label htmlFor="topic" className="dark:text-gray-200">
                                        Topic Focus
                                    </Label>
                                    <Input
                                        id="topic"
                                        placeholder="e.g., Technology, Marketing, Finance"
                                        value={userConfig.topic}
                                        onChange={(e) => setUserConfig((prev) => ({ ...prev, topic: e.target.value }))}
                                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <Label htmlFor="tone" className="dark:text-gray-200">
                                            Tone
                                        </Label>
                                        <Select
                                            value={userConfig.tone}
                                            onValueChange={(value) => setUserConfig((prev) => ({ ...prev, tone: value }))}
                                        >
                                            <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                                                <SelectItem value="professional">Professional</SelectItem>
                                                <SelectItem value="casual">Casual</SelectItem>
                                                <SelectItem value="friendly">Friendly</SelectItem>
                                                <SelectItem value="authoritative">Authoritative</SelectItem>
                                                <SelectItem value="humorous">Humorous</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="post-length" className="dark:text-gray-200">
                                            Post Length
                                        </Label>
                                        <Select
                                            value={userConfig.postLength}
                                            onValueChange={(value) => setUserConfig((prev) => ({ ...prev, postLength: value }))}
                                        >
                                            <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                                                <SelectItem value="low">Low (50-100 words)</SelectItem>
                                                <SelectItem value="medium">Medium (100-200 words)</SelectItem>
                                                <SelectItem value="high">High (200-300 words)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <Label htmlFor="target-audience" className="dark:text-gray-200">
                                        Target Audience
                                    </Label>
                                    <Input
                                        id="target-audience"
                                        placeholder="e.g., Software developers, Small business owners, Students"
                                        value={userConfig.targetAudience}
                                        onChange={(e) => setUserConfig((prev) => ({ ...prev, targetAudience: e.target.value }))}
                                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    />
                                </div>
                            </div>

                            <Separator className="dark:bg-gray-600" />

                            {/* Posts per Platform with Sliders */}
                            <div>
                                <Label className="text-base font-medium dark:text-gray-200">Posts per Platform</Label>
                                <div className="space-y-4 mt-3">
                                    {(["linkedin", "reddit", "twitter"] as const).map((platform) => (
                                        <div key={platform} className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <Label className="text-sm dark:text-gray-300">
                                                    {platformNames[platform]}
                                                </Label>
                                                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                                    {userConfig.postsPerPlatform[platform]} posts
                                                </span>
                                            </div>
                                            <Slider
                                                value={[userConfig.postsPerPlatform[platform]]}
                                                onValueChange={(value) =>
                                                    setUserConfig((prev) => ({
                                                        ...prev,
                                                        postsPerPlatform: {
                                                            ...prev.postsPerPlatform,
                                                            [platform]: value[0],
                                                        },
                                                    }))
                                                }
                                                max={10}
                                                min={1}
                                                step={1}
                                                className="w-full"
                                            />
                                            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                                                <span>1</span>
                                                <span>10</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Save Button - Centered at bottom */}
                    <div className="flex justify-center pt-6">
                        <Button onClick={handleSaveConfig} className="w-48 cursor-pointer">
                            Save Configuration
                        </Button>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}