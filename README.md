# Open Content Generator

Generate AI-powered content for LinkedIn, Reddit, and X (Twitter)

## Features

- Generate content for X (Twitter), LinkedIn, and Reddit
- Post configurations are there to generate more specific posts
- Support for OpenAI and Google Gemini models
- Encrypted API key storage in local
- Professional UI with dark/light theme support

## API Key Encryption

This application includes a simple encryption system for storing API keys securely in localStorage:

### Setup

1. Create a `.env` file in the root directory
2. Add your encryption key:
   ```
   NEXT_PUBLIC_ENCRYPTION_KEY=your-secure-32-character-encryption-key-here
   ```

### How it works

- API keys are encrypted wiht Encryption Key on the client-side before being stored in localStorage
- When content generation is requested, the encrypted API key is sent to the server
- The server decrypts the API key using the same Encryption Key before using it with AI models
- The Encryption Key is nothing but NEXT_PUBLIC_ENCRYPTION_KEY env variable

## Getting Started

#### 1. Clone the repository

```bash
git clone https://github.com/habeebmoosa/OpenContentGenerator.git
```
#### 2. Install dependencies

```bash
npm install
```
#### 3. Set up your environment variables

```bash
NEXT_PUBLIC_ENCRYPTION_KEY=your-secure-32-character-encryption-key-here
```
#### 4. Run the development server

```bash
npm run dev
```
#### 5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Click "API Keys" to configure your OpenAI and Google Gemini API keys
2. Enter your content prompt
3. Configure the post generation style if any
4. Select the platforms you want to generate content for
5. Click "Generate" to create your content
6. Copy or share your generated posts directly to social media platforms
