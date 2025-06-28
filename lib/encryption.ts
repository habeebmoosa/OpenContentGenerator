const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY!;

// Simple XOR encryption
export function encryptApiKey(apiKey: string): string {
  if (!apiKey) return '';
  
  try {
    let encrypted = '';
    for (let i = 0; i < apiKey.length; i++) {
      const charCode = apiKey.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length);
      encrypted += String.fromCharCode(charCode);
    }
    
    // Add prefix to indicate this is encrypted
    return 'encrypted:' + btoa(encrypted);
  } catch (error) {
    console.error('API key Encryption error:', error);
    return '';
  }
}

// Decrypt API key
export function decryptApiKey(encryptedApiKey: string): string {
  if (!encryptedApiKey) return '';
  
  try {
    if (!encryptedApiKey.startsWith('encrypted:')) {
      return encryptedApiKey;
    }
    
    const actualEncrypted = encryptedApiKey.substring(10);
    const decoded = Buffer.from(actualEncrypted, 'base64').toString('utf8');
    
    // Simple XOR decryption
    let decrypted = '';
    for (let i = 0; i < decoded.length; i++) {
      const charCode = decoded.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length);
      decrypted += String.fromCharCode(charCode);
    }
    
    return decrypted;
  } catch (error) {
    console.error('API decryption error:', error);
    return '';
  }
}

// Encrypt API keys object
export function encryptApiKeys(apiKeys: { openai: string; gemini: string }): { openai: string; gemini: string } {
  return {
    openai: encryptApiKey(apiKeys.openai),
    gemini: encryptApiKey(apiKeys.gemini)
  };
}

// Decrypt API keys object
export function decryptApiKeys(encryptedApiKeys: { openai: string; gemini: string }): { openai: string; gemini: string } {
  return {
    openai: decryptApiKey(encryptedApiKeys.openai),
    gemini: decryptApiKey(encryptedApiKeys.gemini)
  };
} 