import { GeneratedPost } from "@/lib/types";

export const DummyPosts: GeneratedPost[] = [
    {
        id: "1",
        platform: "linkedin",
        content: "That's an interesting project! To create a you'd be looking to replicate a chat application that likely uses the T3 Stack. The T3 Stack is a popular collection of technologies for building full-stack applications. Here's a breakdown of what that typically entails and what you'd need to consider: Understanding the T3 Stack The core components of the T3 Stack are: - Next.js: A React framework for building web applications. It handles server-side rendering (SSR), static site generation (SSG), and API routes. - TypeScript: A superset of JavaScript that adds static typing. This helps catch errors during development and improves code maintainability. - tRPC: A type-safe API layer that allows you to write end-to-end type-safe APIs without needing code generation. It makes communication between your frontend and backend feel like calling local functions. - Tailwind CSS: A utility-first CSS framework for rapidly styling your application. - NextAuth.js: A complete authentication solution for Next.js applications, supporting various providers (Google, GitHub, email, etc.). - Prisma: An ORM (Object-Relational Mapper) that makes it easy to interact with your database using a type-safe API. Key Features of a Chat Application To build a chat application, you'll need to implement: 1. User Authentication: Users need to be able to sign up, log in, and log out. NextAuth.js is perfect for this. 2. Real-time Messaging: Messages need to appear instantly for all participants. This is the trickiest part. You'll likely need: - WebSockets: The standard for real-time, bi-directional communication between a client and a server. Libraries like socket.io or Pusher/Ably can simplify this. - Database: To store messages, user information, and chat room data. Prisma will help you interact with your chosen database (PostgreSQL, MySQL, etc.). 3. Chat Rooms/Conversations: Users should be able to create or join different chat rooms. 4. Message History: Users should be able to see past messages in a conversation. 5. User Presence (Optional): Showing who is currently online or typing. Steps to Build a T3 Chat Clone Here's a general roadmap:",
        hashtags: ["#startup", "#launch", "#innovation"],
        title: "Product Launch Announcement"
    },
    {
        id: "2",
        platform: "twitter",
        content: `Want to build your own full-stack web app? 🚀  Here's a simplified roadmap:
  
  1️⃣ **Frontend (what users see):** HTML, CSS, JavaScript (consider frameworks like React, Vue, or Angular).
  2️⃣ **Backend (the brains):** Choose a language (Python, Node.js, Ruby on Rails etc.) and a database (SQL or NoSQL).
  3️⃣ **API:** Connect your frontend & backend using RESTful APIs.
  4️⃣ **Deployment:** Host your app on platforms like Netlify, Heroku, or AWS.
  
  What's YOUR biggest challenge in full-stack development? #FullStackDev #WebDev #Programming #100DaysOfCode #webdeveloper`,
        hashtags: ["#coding", "#developerlife"]
    },
    {
        id: "3",
        platform: "reddit",
        content: "What are some underrated productivity hacks that actually work?",
        title: "Underrated Productivity Hacks"
    },
    {
        id: "4",
        platform: "linkedin",
        content: "Just wrapped up a great meeting with potential partners.",
        hashtags: ["#networking", "#business"]
    },
    {
        id: "5",
        platform: "twitter",
        content: "Friday deploys… what could go wrong? 😅",
        hashtags: ["#devlife", "#startuplife"]
    },
    {
        id: "6",
        platform: "reddit",
        content: "Can someone explain why TypeScript is better than plain JS?",
        title: "Why Choose TypeScript?"
    },
    {
        id: "7",
        platform: "linkedin",
        content: "5 lessons I learned from my first startup failure.",
        hashtags: ["#entrepreneurship", "#lessonslearned"],
        title: "Lessons from Startup Failure"
    },
    {
        id: "8",
        platform: "twitter",
        content: "New blog post: Mastering useEffect in React ⚛️🔥",
        hashtags: ["#reactjs", "#webdev"]
    },
    {
        id: "9",
        platform: "linkedin",
        content: "5 lessons I learned from my first startup failure.",
        hashtags: ["#entrepreneurship", "#lessonslearned"],
        title: "Lessons from Startup Failure"
    },
    {
        id: "10",
        platform: "twitter",
        content: "New blog post: Mastering useEffect in React ⚛️🔥",
        hashtags: ["#reactjs", "#webdev"]
    }
]