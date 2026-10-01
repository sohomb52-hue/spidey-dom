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

// Helper to retrieve the active Gemini API key from environment variables
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
        'User-Agent': 'spiderverse-fact-attack/1.0.0',
      },
    },
  });
}

const SPIDEY_SYSTEM_INSTRUCTION = `
You are SPIDEY, an AI companion inside the SPIDER-VERSE FACT ATTACK website.

You are inspired by the witty, playful and sarcastic personality associated with Spider-Man, but you are an AI assistant and should not claim to literally be the fictional character.

Your job is to have natural, engaging conversations with users about Spider-Man lore, trivia, the website, and general topics.

You can discuss:
- Spider-Man comics (Earth-616, Ultimate Universe Earth-1610, Earth-6160, Earth-65 Spider-Gwen, 2099, Noir, Spider-Punk, Spider-Ham, etc.)
- Characters, rogues gallery (Green Goblin, Doc Ock, Venom, Carnage, Kingpin, Kraven, Mysterio, etc.)
- Storylines, canon, crossovers (Secret Wars, Spider-Verse, Clone Saga, Kraven's Last Hunt, Maximum Carnage)
- Movies (Raimi trilogy, Webb films, MCU Spider-Man, Spider-Verse animated films)
- Video games (Insomniac Earth-1048, classic arcade)
- Alternate universes and multiverse lore
- The SPIDER-VERSE FACT ATTACK website, its Arcade games, and Canon Archives
- User progress, streaks, XP, and badges when provided in context
- General knowledge questions (math, science, everyday questions, jokes) with your signature witty comic flair

PERSONALITY & TONE:
- Witty, friendly, clever, playful, conversational, and occasionally sarcastic.
- Helpful and enthusiastic about comic lore.
- Concise when appropriate (1–3 paragraphs), detailed when the user asks for in-depth explanation.
- Do NOT force a Spider-Man pun into every sentence; use humor naturally.

CONVERSATION & FOLLOW-UP CONTINUITY:
- Maintain context across follow-up questions (e.g. if the user asked about Venom and follows up with "What about Eddie?", understand that they mean Eddie Brock and his bond with the symbiote).
- Understand single-word queries ("Why?", "Explain", "Who?", "Really?") by analyzing previous messages.
- Respond naturally to general queries:
  * "Hey" / "Hello" -> Greet warmly with a friendly neighborhood greeting.
  * "What is 2+2?" -> "4! Even without spider-powers, the math checks out."
  * "Tell me something funny" -> Share a witty quip or amusing comic book moment.
  * "I'm bored" -> Suggest a challenge in the Arcade (Web Swing or Spider-Sense Reaction) or Canon Archives.
  * "Give me a difficult Spider-Man question" -> Present a genuine, deep-cut comic trivia question.

CANON DISCIPLINE:
- Distinguish clearly between Marvel Comics 616 continuity, movie continuities, and alternate universes.
- If a detail is continuity-specific or disputed, mention which universe or run it comes from.
- Never invent fake issue numbers or non-existent storylines.
`;

// Helper: Call Gemini with robust multi-model fallback and retry cascade
async function generateSpideyResponse(
  contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }>,
  systemInstruction: string
): Promise<string> {
  const client = getGeminiClient();
  if (!client) {
    throw new Error('GEMINI_API_KEY is not configured on the server.');
  }

  // Model cascade: try fast and widely available Gemini models
  const modelsToTry = [
    'gemini-2.5-flash',
    'gemini-3.7-flash',
    'gemini-3.1-flash-lite',
    'gemini-2.5-pro',
    'gemini-flash-latest',
  ];
  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      const response = await client.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction,
          temperature: 0.75,
          topP: 0.95,
        },
      });

      const text = response.text;
      if (text && typeof text === 'string' && text.trim()) {
        return text.trim();
      }
    } catch (err: any) {
      console.warn(`[Gemini API] Model ${model} failed, attempting next model in cascade:`, err?.message || err);
      lastError = err;
      await new Promise((r) => setTimeout(r, 150));
    }
  }

  throw lastError || new Error('All Gemini model candidates failed to return a response.');
}

// Spidey Chat API Endpoint: Pure dynamic Gemini AI conversation
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history, userStats } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'A non-empty message string is required.' });
    }

    const apiKey = getGeminiApiKey();
    if (!apiKey) {
      console.error('[Spidey API] GEMINI_API_KEY is missing from environment variables.');
      return res.status(503).json({
        error: 'Gemini AI service is not configured. GEMINI_API_KEY environment variable is missing on the server.',
        code: 'API_KEY_MISSING',
      });
    }

    // Sanitize and build conversational turn history (alternating user/model)
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    if (Array.isArray(history)) {
      for (const item of history.slice(-16)) {
        if (item && item.role && item.parts && Array.isArray(item.parts) && item.parts[0]?.text) {
          const role = item.role === 'user' ? 'user' : 'model';
          const text = String(item.parts[0].text).trim();
          if (text) {
            // Avoid duplicate consecutive roles
            if (contents.length > 0 && contents[contents.length - 1].role === role) {
              contents[contents.length - 1].parts[0].text += `\n${text}`;
            } else {
              contents.push({ role, parts: [{ text }] });
            }
          }
        } else if (item && item.sender && item.text) {
          const role = item.sender === 'user' ? 'user' : 'model';
          const text = String(item.text).trim();
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
      contents[contents.length - 1].parts[0].text += `\n${message.trim()}`;
    } else {
      contents.push({
        role: 'user',
        parts: [{ text: message.trim() }],
      });
    }

    // Append user stats to system instruction if provided
    let dynamicSystemInstruction = SPIDEY_SYSTEM_INSTRUCTION;
    if (userStats && typeof userStats === 'object') {
      dynamicSystemInstruction += `\n\nCURRENT USER STATS & PROGRESS ON THE SITE:\n${JSON.stringify(userStats, null, 2)}`;
    }

    // Generate real open-ended AI response via Gemini API
    const reply = await generateSpideyResponse(contents, dynamicSystemInstruction);

    return res.json({
      reply,
      source: 'gemini',
    });
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
