import { Separator } from "@/components/ui/separator";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Settings } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { UserConfig } from "./FloatingInputArea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ContentConfigProps {
    configOpen: boolean;
    setConfigOpen: (config: boolean) => void;
    userConfig: UserConfig;
    setUserConfig: (config: UserConfig | ((prev: UserConfig) => UserConfig)) => void;
    platformNames: any;
}

export const ContentConfig = ({
    configOpen,
    setConfigOpen,
    userConfig,
    setUserConfig,
    platformNames
}: ContentConfigProps) => {
    return (
        <Dialog open={configOpen} onOpenChange={setConfigOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 px-2">
                    <Settings className="w-4 h-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto dark:bg-gray-800">
                <DialogHeader>
                    <DialogTitle className="dark:text-white">Content Configuration</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                    <div>
                        <Label htmlFor="knowledge-base" className="dark:text-gray-200">
                            Knowledge Base
                        </Label>
                        <Textarea
                            id="knowledge-base"
                            placeholder="Tell the AI about yourself, your brand, your expertise, and what kind of content you typically share..."
                            value={userConfig.knowledgeBase}
                            onChange={(e) => setUserConfig((prev) => ({ ...prev, knowledgeBase: e.target.value }))}
                            className="mt-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
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
                        <div>
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
                    </div>

                    <div>
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

                    <Separator className="dark:bg-gray-600" />

                    <div>
                        <Label className="text-base font-medium dark:text-gray-200">Posts per Platform</Label>
                        <div className="grid grid-cols-3 gap-4 mt-3">
                            {(["linkedin", "reddit", "twitter"] as const).map((platform) => (
                                <div key={platform}>
                                    <Label htmlFor={`${platform}-count`} className="text-sm dark:text-gray-300">
                                        {platformNames[platform]}
                                    </Label>
                                    <Select
                                        value={userConfig.postsPerPlatform[platform].toString()}
                                        onValueChange={(value) =>
                                            setUserConfig((prev) => ({
                                                ...prev,
                                                postsPerPlatform: {
                                                    ...prev.postsPerPlatform,
                                                    [platform]: Number.parseInt(value),
                                                },
                                            }))
                                        }
                                    >
                                        <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                                            <SelectItem value="1">1</SelectItem>
                                            <SelectItem value="3">3</SelectItem>
                                            <SelectItem value="5">5</SelectItem>
                                            <SelectItem value="7">7</SelectItem>
                                            <SelectItem value="10">10</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Button onClick={() => setConfigOpen(false)} className="w-full cursor-pointer">
                        Save Configuration
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}