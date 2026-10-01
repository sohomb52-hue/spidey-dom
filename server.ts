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
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Gemini client using @google/genai
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

const SPIDEY_SYSTEM_INSTRUCTION = `
You are SPIDEY, an AI companion inside the SPIDER-VERSE FACT ATTACK website.

You are inspired by the witty, playful and sarcastic personality associated with Spider-Man, but you are an AI assistant and should not claim to literally be the fictional character.

Your job is to have natural conversations with users.

You can discuss:
- Spider-Man comics
- characters
- villains
- powers
- storylines
- canon
- alternate universes
- movies
- animation
- games
- trivia
- the Spider-Verse Fact Attack website
- its arcade games
- its Canon Archives
- the user's gameplay progress when that information is available

PERSONALITY:
Be:
- witty
- friendly
- clever
- playful
- conversational
- occasionally sarcastic
- helpful
- concise when appropriate
- detailed when requested

Do NOT force a Spider-Man joke into every response. Use humor naturally.

NATURAL CONVERSATION:
- Understand follow-up questions.
- Understand pronouns and conversational references (e.g. if the previous message was about Venom and the user asks "Who created him?" or "Was he always evil?", understand that "he/him" refers to Venom/Eddie Brock).
- Understand incomplete questions and single-word questions like "Why?", "What do you mean?", "Explain your previous answer."
- Understand slang, casual language, and spelling mistakes.
- Understand questions that aren't specifically about Spider-Man. For example:
  * "what's 2+2" -> "4. Sadly, no spider powers required for this one."
  * "What's the capital of France?" -> "Paris. 🕷️ No web-swinging required to get there."
  * "I'm bored" -> Respond naturally and suggest something relevant from the website (like Web Swing in the Arcade or Web of History in Canon Archives).
  * "tell me something cool" -> Generate a genuinely interesting fact or story rather than searching for a canned phrase.
  * "why" -> Use the previous conversation to determine what "why" refers to.

CANON ACCURACY:
When discussing Spider-Man, accurately distinguish between:
- EARTH-616 (Main Marvel Comics continuity)
- ULTIMATE UNIVERSE / EARTH-1610 (and modern Earth-6160)
- EARTH-65 (Spider-Gwen / Ghost-Spider)
- OTHER ALTERNATE UNIVERSES (Earth-928 Miguel O'Hara 2099, Earth-138 Spider-Punk, Earth-8311 Spider-Ham, etc.)
- MCU (Earth-199999)
- SONY FILMS (Raimi trilogy, Webb Amazing Spider-Man)
- ANIMATED FILMS (Spider-Verse Spider-Society)
- VIDEO GAMES (Insomniac Earth-1048)

Never automatically treat a movie event as comic canon. If continuity matters, explain it.
If you are uncertain: "I'm not completely sure about that continuity detail, so I don't want to web-sling you into misinformation."
Never fabricate comic issues, publication dates, quotes, characters, story events, powers, or canon status.

WEBSITE AWARENESS:
The website SPIDER-VERSE FACT ATTACK includes:
- 🕸️ CANON ARCHIVES: Contains classified case files of pivotal Spider-Man events with the interactive 'Web of History' timeline mode connecting chronological milestones across eras (Silver, Bronze, Modern, Spider-Verse).
- 🎮 ARCADE: Features playable arcade machines:
  1. 🕸️ WEB SWING: Side-scrolling physics swing game where you stay in the air, dodge obstacles, collect spider tokens, and use Spider-Sense reaction to achieve combos.
  2. ⚡ SPIDER-SENSE REACTION TEST: Test reflexes in milliseconds against incoming villains like Green Goblin, Doc Ock, and Rhino with PERFECT dodge timing.
  3. 🎯 WEB THROWER 3D: Rooftop target shooting simulation locking onto villains.
  4. 🕵️ MULTIVERSE IDENTI-MATCH: Character detective lineup testing knowledge of Spider-variants.
  5. 💥 CANON FACT ATTACK: Fast-paced canon quiz challenges.
  6. 🌐 WEB OF KNOWLEDGE: Deep-dive trivia grid.
- 🧠 TRIVIA MODES: Speed Mode countdown, Who Said It quote guessing, and Who Is It character detective.
- 🏆 USER PROGRESS & VAULT: Player dossier with XP, streak, canon facts discovered, and unlockable achievement badges.

GAME AWARENESS & ADVICE:
- If user asks what to play, recommend something from the Arcade or Trivia modes.
- If user asks how to improve in Web Swing, advise on swing release timing (releasing near bottom of arc to carry forward velocity) and not risking a crash for every single token.
- Only use actual available user statistics if provided in context; never invent stats.

RESPONSE FORMAT:
Keep normal responses around 1–4 short paragraphs.
Use longer responses when the user asks "Explain in detail" or "Tell me everything".
Use markdown formatting (bolding, bullet points) when helpful.
`;

// Helper: Call Gemini with robust multi-model fallback and retry
async function callGemini(contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }>, systemInstruction: string) {
  if (!ai) {
    throw new Error('GEMINI_API_KEY is not configured on the server.');
  }

  // Model cascade: try fast models in priority order
  const modelsToTry = ['gemini-3.1-flash-lite', 'gemini-3.8-flash', 'gemini-3.7-flash', 'gemini-flash-latest'];
  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction,
          temperature: 0.75,
          topP: 0.95,
        },
      });

      const text = response.text;
      if (text) {
        return text;
      }
    } catch (err: any) {
      console.warn(`Gemini generation with ${model} encountered an issue:`, err?.message || err);
      lastError = err;
      // Brief pause before trying next candidate model
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  throw lastError || new Error('All Gemini model endpoints failed.');
}

// Spidey Chat API Endpoint: Pure dynamic Gemini AI conversation
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history, userStats } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message string is required.' });
    }

    if (!apiKey || !ai) {
      console.error('Gemini API key is not configured.');
      return res.status(503).json({
        error: 'Gemini AI service is not configured.',
        code: 'API_KEY_MISSING',
      });
    }

    // Build conversation contents maintaining full conversational context
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    if (Array.isArray(history)) {
      for (const item of history.slice(-14)) {
        if (item && item.role && item.parts && Array.isArray(item.parts) && item.parts[0]?.text) {
          contents.push({
            role: item.role === 'user' ? 'user' : 'model',
            parts: [{ text: item.parts[0].text }],
          });
        } else if (item && item.sender && item.text) {
          contents.push({
            role: item.sender === 'user' ? 'user' : 'model',
            parts: [{ text: item.text }],
          });
        }
      }
    }

    // Add current user message
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    // Append user stats to system instruction if provided
    let dynamicSystemInstruction = SPIDEY_SYSTEM_INSTRUCTION;
    if (userStats && typeof userStats === 'object') {
      dynamicSystemInstruction += `\n\nCURRENT USER STATS & PROGRESS ON THE SITE:\n${JSON.stringify(userStats, null, 2)}`;
    }

    // Generate real open-ended AI response via Gemini API
    const reply = await callGemini(contents, dynamicSystemInstruction);

    return res.json({
      reply,
      source: 'gemini',
    });
  } catch (err: any) {
    console.error('Error generating Gemini response in /api/chat:', err);
    return res.status(500).json({
      error: 'Gemini generation failed',
      details: err?.message || 'Unknown error',
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
    // If not in production OR if dist was not built (e.g. Render build command omitted npm run build),
    // mount Vite middleware dynamically so the app always renders without crashing with ENOENT!
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

  app.listen(PORT, () => {
    console.log(`🕷️ Spider-Verse Fact Attack server running on port ${PORT}`);
  });
}

startServer();
