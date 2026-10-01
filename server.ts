import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Enable CORS and Preflight for all origins and hosting platforms
app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  if (_req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// Helper to retrieve the active Gemini API key from environment variables (backend only)
function getGeminiApiKey(): string | undefined {
  return process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.API_KEY;
}

// Helper to obtain an authenticated GoogleGenAI client instance
function getGeminiClient(): GoogleGenAI | null {
  const key = getGeminiApiKey();
  if (!key || !key.trim()) {
    return null;
  }
  return new GoogleGenAI({
    apiKey: key.trim(),
    httpOptions: {
      headers: {
        'User-Agent': 'spiderverse-fact-attack/2.0.0',
      },
    },
  });
}

const DEFAULT_SPIDEY_SYSTEM_INSTRUCTION = `
You are SPIDEY, an expert Spider-Verse AI companion and assistant with live Google Search Grounding capabilities inside the SPIDER-VERSE FACT ATTACK web application.

You are inspired by the witty, playful, and sharp personality associated with Spider-Man, but you are a capable AI assistant with real-time web knowledge.

CAPABILITIES:
1. Live Web Grounding: You have access to real-time Google Search to look up current information, breaking news, box office data, latest comic releases, MCU updates, weather, and real-world facts.
2. Spider-Man & Comic Lore: Earth-616, Ultimate Universe (Earth-1610 / Earth-6160), Earth-65 (Ghost-Spider), Spider-Man 2099, Spider-Noir, Spider-Punk, Rogues Gallery, and crossover events.
3. Spider-Verse Fact Attack Website: Help users navigate Arcade games (Web Swing, Spider-Sense Reaction, Web Thrower), Canon Archives, Badges Vault, and Trivia modes.
4. General Knowledge: Answer science, technology, pop culture, math, and everyday queries accurately with high-precision information and your signature witty comic flair.

TONE & CITATION BEHAVIOR:
- Witty, friendly, enthusiastic, and helpful.
- Accurate and grounded: when answering questions about current events, latest media, or specific trivia, synthesize search results seamlessly.
- Concise by default (1–3 paragraphs), detailed when the user requests in-depth analysis.
`;

export interface GroundingSource {
  title: string;
  url: string;
}

export interface GeminiChatResponse {
  reply: string;
  sources: GroundingSource[];
  searchQueries: string[];
  source: 'gemini';
}

// Helper: Call Gemini with Google Search Grounding and multi-model fallback cascade
async function generateGroundedResponse(
  contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }>,
  systemInstruction: string
): Promise<GeminiChatResponse> {
  const client = getGeminiClient();
  if (!client) {
    throw new Error('GEMINI_API_KEY is not configured on the server.');
  }

  // Primary model is gemini-2.5-flash with search grounding; fallbacks in cascade
  const modelsToTry = [
    'gemini-2.5-flash',
    'gemini-3.7-flash',
    'gemini-flash-latest',
    'gemini-3.1-flash-lite',
  ];
  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      const response = await client.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
          topP: 0.95,
          tools: [{ googleSearch: {} }],
        },
      });

      const text = response.text;
      if (text && typeof text === 'string' && text.trim()) {
        const candidate = response.candidates?.[0];
        const groundingMetadata = candidate?.groundingMetadata;

        const searchQueries: string[] = groundingMetadata?.webSearchQueries || [];
        const sources: GroundingSource[] = [];
        const seenUrls = new Set<string>();

        if (groundingMetadata?.groundingChunks && Array.isArray(groundingMetadata.groundingChunks)) {
          for (const chunk of groundingMetadata.groundingChunks) {
            const web = chunk.web;
            if (web && web.uri) {
              const url = String(web.uri).trim();
              if (url && !seenUrls.has(url)) {
                seenUrls.add(url);
                sources.push({
                  title: (web.title && String(web.title).trim()) || url,
                  url,
                });
              }
            }
          }
        }

        return {
          reply: text.trim(),
          sources,
          searchQueries,
          source: 'gemini',
        };
      }
    } catch (err: any) {
      console.warn(`[Gemini API] Model ${model} with Google Search Grounding encountered an issue, trying next in cascade:`, err?.message || err);
      lastError = err;
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  throw lastError || new Error('All Gemini model candidates failed to return a response.');
}

// Full-Stack AI Chatbot API Endpoint with Live Google Search Grounding
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history, systemInstruction, userStats } = req.body;

    // 1. Input Validation & Sanitization
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'A non-empty message string is required.' });
    }

    const trimmedMessage = message.trim();
    if (trimmedMessage.length > 4000) {
      return res.status(400).json({ error: 'Message exceeds the 4,000 character maximum limit.' });
    }

    const apiKey = getGeminiApiKey();
    if (!apiKey) {
      console.error('[Spidey API] GEMINI_API_KEY is missing from environment variables.');
      return res.status(503).json({
        error: 'Gemini AI service is not configured. GEMINI_API_KEY environment variable is missing on the server.',
        code: 'API_KEY_MISSING',
      });
    }

    // 2. Sanitize and build conversational turn history (alternating user/model)
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    if (Array.isArray(history)) {
      for (const item of history.slice(-16)) {
        if (item && item.role && item.parts && Array.isArray(item.parts) && item.parts[0]?.text) {
          const role = item.role === 'user' ? 'user' : 'model';
          const text = String(item.parts[0].text).trim();
          if (text) {
            if (contents.length > 0 && contents[contents.length - 1].role === role) {
              contents[contents.length - 1].parts[0].text += `\n${text}`;
            } else {
              contents.push({ role, parts: [{ text }] });
            }
          }
        } else if (item && (item.role || item.sender) && (item.text || item.content)) {
          const role = (item.role === 'user' || item.sender === 'user') ? 'user' : 'model';
          const text = String(item.text || item.content || '').trim();
          if (text) {
            if (contents.length > 0 && contents[contents.length - 1].role === role) {
              contents[contents.length - 1].parts[0].text += `\n${text}`;
            } else {
              contents.push({ role, parts: [{ text }] });
            }
          }
        }
      }
    }

    // Ensure the latest message is added as a user turn
    if (contents.length > 0 && contents[contents.length - 1].role === 'user') {
      contents[contents.length - 1].parts[0].text += `\n${trimmedMessage}`;
    } else {
      contents.push({
        role: 'user',
        parts: [{ text: trimmedMessage }],
      });
    }

    // 3. Assemble Dynamic System Instruction
    let finalSystemInstruction = systemInstruction && typeof systemInstruction === 'string'
      ? `${systemInstruction}\n\n${DEFAULT_SPIDEY_SYSTEM_INSTRUCTION}`
      : DEFAULT_SPIDEY_SYSTEM_INSTRUCTION;

    if (userStats && typeof userStats === 'object') {
      finalSystemInstruction += `\n\nCURRENT USER STATS & PROGRESS ON THE SITE:\n${JSON.stringify(userStats, null, 2)}`;
    }

    // 4. Generate real AI response with live Google Search Grounding
    const result = await generateGroundedResponse(contents, finalSystemInstruction);

    return res.json(result);
  } catch (err: any) {
    console.error('[Spidey API] Error generating Gemini response in /api/chat:', err);
    return res.status(500).json({
      error: 'Gemini generation failed',
      details: err?.message || 'Internal server error',
    });
  }
});

// Vite Middleware for development & Static file serving for production
async function startServer() {
  const distPath = path.resolve(__dirname, 'dist');
  const indexPath = path.resolve(distPath, 'index.html');
  const hasDist = fs.existsSync(indexPath);
  const isProd = process.env.NODE_ENV === 'production';

  if (isProd && hasDist) {
    console.log(`📦 Serving production static build from: ${distPath}`);
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(indexPath);
    });
  } else {
    if (isProd) {
      console.warn(
        '⚠️ Warning: dist/index.html was not found in production mode. ' +
        'Mounting Vite middleware dynamically to serve the app on the fly. ' +
        'To optimize for production on Render, set Build Command to: "npm install && npm run build".'
      );
    } else {
      console.log('🚀 Running in development mode with Vite middleware...');
    }

    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        allowedHosts: true,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🕷️ Spider-Verse Fact Attack server running on port ${PORT}`);
  });
}

startServer();
