import { Key, Moon, Sparkles, Sun } from "lucide-react"
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { encryptApiKeys } from "@/lib/encryption";

interface HeaderAreaProps {
    theme: string;
    setTheme: (theme: string) => void;
    apiKeysOpen: boolean;
    setApiKeysOpen: (open: boolean) => void;
    apiKeys: {
        openai: string;
        gemini: string;
    };
    setApiKeys: (keys: { openai: string; gemini: string }) => void;
}

export const HeaderArea = ({
    theme,
    setTheme,
    apiKeysOpen,
    setApiKeysOpen,
    apiKeys,
    setApiKeys
}: HeaderAreaProps) => {
    const saveApiKeys = () => {
        // Encrypt API keys before storing in localStorage
        const encryptedKeys = encryptApiKeys(apiKeys);
        localStorage.setItem("ai-api-keys", JSON.stringify(encryptedKeys))
        setApiKeysOpen(false)
        toast.success("Your API keys have been encrypted and saved securely.")
    }

    return (
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Open Content Generator</h1>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                        {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </Button>
                    <Dialog open={apiKeysOpen} onOpenChange={setApiKeysOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                                <Key className="w-4 h-4 mr-2" />
                                API Keys
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="dark:bg-gray-800">
                            <DialogHeader>
                                <DialogTitle className="dark:text-white">API Keys Configuration</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="openai-key" className="dark:text-gray-200">
                                        OpenAI API Key
                                    </Label>
                                    <Input
                                        id="openai-key"
                                        type="password"
                                        placeholder="sk-..."
                                        value={apiKeys.openai}
                                        onChange={(e) => setApiKeys({ ...apiKeys, openai: e.target.value })}
                                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="gemini-key" className="dark:text-gray-200">
                                        Google API Key
                                    </Label>
                                    <Input
                                        id="gemini-key"
                                        type="password"
                                        placeholder="AI..."
                                        value={apiKeys.gemini}
                                        onChange={(e) => setApiKeys({ ...apiKeys, gemini: e.target.value })}
                                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    />
                                </div>
                                <Button onClick={saveApiKeys} className="w-full">
                                    Save API Keys
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </header>
    )
}