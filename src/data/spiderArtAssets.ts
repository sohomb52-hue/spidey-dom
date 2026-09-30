/**
 * Spider-Verse Authentic Comic Art Assets
 * Pristine, vector-drawn comic illustrations with halftone textures,
 * accurate character costumes, dynamic action poses, and game-specific thumbnails.
 */

// Helper to encode SVG safely as data URI
const svgToDataUri = (svgString: string): string => {
  const cleaned = svgString.replace(/\n\s*/g, ' ').trim();
  return `data:image/svg+xml;utf8,${encodeURIComponent(cleaned)}`;
};

/* ==========================================================================
   1. ARCADE GAME THUMBNAILS (Accurate Game-Specific Visuals)
   ========================================================================== */

/**
 * 01: WEB THROWER 3D - Rooftop Target Shooter
 * Features: 3D perspective crosshair shooting pressurized web fluid at Green Goblin glider over NYC skyline
 */
export const GAME_THUMB_WEB_THROWER = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 380" width="600" height="380">
  <defs>
    <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1e1035"/>
      <stop offset="50%" stop-color="#701a2b"/>
      <stop offset="85%" stop-color="#dc2626"/>
      <stop offset="100%" stop-color="#f97316"/>
    </linearGradient>
    <pattern id="htDots" width="10" height="10" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.5" fill="#000" opacity="0.15"/>
    </pattern>
    <radialGradient id="gliderGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#fde047" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#dc2626" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Sky & Halftone -->
  <rect width="600" height="380" fill="url(#skyGrad)"/>
  <rect width="600" height="380" fill="url(#htDots)"/>

  <!-- City Skyline Silhouette -->
  <path d="M0 380 L0 260 L40 260 L40 230 L80 230 L80 280 L130 280 L130 210 L160 210 L160 170 L180 140 L190 170 L190 280 L230 280 L230 240 L280 240 L280 380 Z" fill="#0f0919"/>
  <path d="M260 380 L260 250 L310 250 L310 180 L350 180 L350 270 L400 270 L400 220 L440 220 L440 160 L460 120 L470 160 L470 290 L520 290 L520 230 L600 230 L600 380 Z" fill="#1b112c"/>

  <!-- Glowing Yellow Windows in Buildings -->
  <g fill="#facc15" opacity="0.6">
    <rect x="50" y="240" width="6" height="8"/><rect x="65" y="240" width="6" height="8"/>
    <rect x="140" y="220" width="6" height="8"/><rect x="140" y="240" width="6" height="8"/>
    <rect x="320" y="195" width="6" height="8"/><rect x="335" y="195" width="6" height="8"/>
    <rect x="450" y="190" width="6" height="8"/><rect x="450" y="210" width="6" height="8"/>
  </g>

  <!-- Rooftop Foreground Edge with Water Tower -->
  <rect x="0" y="310" width="600" height="70" fill="#1b1b20"/>
  <path d="M0 310 L600 310" stroke="#dc2626" stroke-width="4"/>
  <rect x="25" y="250" width="55" height="60" fill="#261a15" stroke="#1b1b20" stroke-width="3"/>
  <polygon points="20,250 52,225 85,250" fill="#78350f" stroke="#1b1b20" stroke-width="3"/>

  <!-- Flying Green Goblin Silhouette on Bat Glider with Pumpkin Bomb Flame -->
  <g transform="translate(360, 95) scale(0.95)">
    <circle cx="30" cy="30" r="45" fill="url(#gliderGlow)"/>
    <!-- Glider Wings -->
    <path d="M-50 40 Q30 20 110 40 Q60 55 30 65 Q0 55 -50 40 Z" fill="#94a3b8" stroke="#0f172a" stroke-width="3"/>
    <!-- Glider Thruster Flame -->
    <polygon points="25,60 30,85 35,60" fill="#f97316"/>
    <polygon points="27,60 30,75 33,60" fill="#facc15"/>
    <!-- Goblin Figure -->
    <path d="M15 25 Q30 5 45 25 L40 45 L20 45 Z" fill="#15803d" stroke="#052e16" stroke-width="2"/>
    <!-- Purple Hood & Ears -->
    <polygon points="12,18 20,8 24,18" fill="#7e22ce"/>
    <polygon points="36,18 40,8 48,18" fill="#7e22ce"/>
    <circle cx="30" cy="20" r="10" fill="#15803d"/>
    <!-- Pumpkin Bomb in Hand with Spark -->
    <circle cx="58" cy="25" r="8" fill="#ea580c" stroke="#1b1b20" stroke-width="2"/>
    <circle cx="62" cy="18" r="3" fill="#facc15"/>
  </g>

  <!-- Giant 3D High-Tech Web Shooter Crosshair Target -->
  <g transform="translate(360, 115)">
    <circle cx="30" cy="30" r="50" fill="none" stroke="#22d3ee" stroke-width="3" stroke-dasharray="6,4" opacity="0.9"/>
    <circle cx="30" cy="30" r="28" fill="none" stroke="#dc2626" stroke-width="3"/>
    <circle cx="30" cy="30" r="6" fill="#facc15" stroke="#1b1b20" stroke-width="2"/>
    <line x1="-30" y1="30" x2="10" y2="30" stroke="#dc2626" stroke-width="3"/>
    <line x1="50" y1="30" x2="90" y2="30" stroke="#dc2626" stroke-width="3"/>
    <line x1="30" y1="-30" x2="30" y2="10" stroke="#dc2626" stroke-width="3"/>
    <line x1="30" y1="50" x2="30" y2="90" stroke="#dc2626" stroke-width="3"/>
    <text x="30" y="-38" text-anchor="middle" font-family="monospace" font-weight="900" font-size="12" fill="#22d3ee" letter-spacing="2">LOCK ON // 100%</text>
  </g>

  <!-- Spider-Man Web Shooter Firing Stream from Bottom-Left -->
  <g transform="translate(80, 360)">
    <!-- Red Glove Arm with Black Web Pattern -->
    <path d="M-60 20 L50 -40 L90 -25 L-20 60 Z" fill="#dc2626" stroke="#1b1b20" stroke-width="4"/>
    <path d="M-30 0 L-10 40 M-10 -15 L15 25 M10 -30 L40 10" stroke="#1b1b20" stroke-width="2"/>
    <!-- Silver Wrist Web Shooter Cartridge -->
    <rect x="52" y="-45" width="18" height="12" rx="2" fill="#cbd5e1" stroke="#1b1b20" stroke-width="3"/>
    <!-- Web Stream Projectile Shooting Across to Target -->
    <path d="M68 -40 Q180 80 370 140" fill="none" stroke="#ffffff" stroke-width="6" stroke-linecap="round"/>
    <path d="M68 -40 Q180 80 370 140" fill="none" stroke="#93c5fd" stroke-width="3" stroke-linecap="round"/>
    <!-- Expanding Web Splat Net at Glider -->
    <g transform="translate(370, 140) scale(0.6)">
      <polygon points="0,-40 30,-20 40,20 10,40 -30,30 -40,-10" fill="none" stroke="#fff" stroke-width="4"/>
      <line x1="0" y1="0" x2="0" y2="-40" stroke="#fff" stroke-width="3"/>
      <line x1="0" y1="0" x2="30" y2="-20" stroke="#fff" stroke-width="3"/>
      <line x1="0" y1="0" x2="40" y2="20" stroke="#fff" stroke-width="3"/>
      <line x1="0" y1="0" x2="10" y2="40" stroke="#fff" stroke-width="3"/>
      <line x1="0" y1="0" x2="-30" y2="30" stroke="#fff" stroke-width="3"/>
      <line x1="0" y1="0" x2="-40" y2="-10" stroke="#fff" stroke-width="3"/>
    </g>
  </g>

  <!-- Comic Action Sound Banner "THWIP!" -->
  <g transform="translate(140, 240) rotate(-12)">
    <polygon points="-10,-5 90,-20 130,20 40,35 -20,15" fill="#facc15" stroke="#1b1b20" stroke-width="3"/>
    <text x="50" y="16" text-anchor="middle" font-family="'Impact', 'Arial Black', sans-serif" font-style="italic" font-weight="900" font-size="28" fill="#dc2626" stroke="#1b1b20" stroke-width="1.5">THWIP!</text>
  </g>

  <!-- Top Banner Badge -->
  <rect x="20" y="18" width="165" height="26" fill="#1b1b20" stroke="#fff" stroke-width="2"/>
  <text x="102" y="35" text-anchor="middle" font-family="'Impact', sans-serif" font-size="14" fill="#fff" letter-spacing="1">3D TARGET ACTION</text>
</svg>
`);

/**
 * 02: MULTIVERSE IDENTI-MATCH - Spider-Hero Detective Lineup
 * Features: Iconic split multi-panel lineup showing Peter Parker (616), Miles Morales (1610), Ghost-Spider (65), and 2099
 */
export const GAME_THUMB_SPIDER_ID = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 380" width="600" height="380">
  <defs>
    <pattern id="idHalftone" width="8" height="8" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.2" fill="#000" opacity="0.12"/>
    </pattern>
  </defs>

  <!-- Background Canvas -->
  <rect width="600" height="380" fill="#1e1b4b"/>
  <rect width="600" height="380" fill="url(#idHalftone)"/>

  <!-- 4 Dynamic Vertical Comic Panels -->
  <!-- Panel 1: Earth-616 Classic Peter Parker (Red & Blue) -->
  <g transform="translate(20, 20)">
    <rect width="130" height="340" fill="#dc2626" stroke="#1b1b20" stroke-width="4"/>
    <!-- Web Pattern -->
    <path d="M65 40 L65 240 M10 120 L120 120 M20 60 Q65 100 110 60 M15 180 Q65 140 115 180" stroke="#1b1b20" stroke-width="2.5" fill="none"/>
    <!-- Classic Spider Mask Lenses -->
    <path d="M30 110 Q50 90 60 115 Q55 135 32 130 Z" fill="#ffffff" stroke="#1b1b20" stroke-width="4"/>
    <path d="M100 110 Q80 90 70 115 Q75 135 98 130 Z" fill="#ffffff" stroke="#1b1b20" stroke-width="4"/>
    <!-- Earth Label Badge -->
    <rect x="10" y="295" width="110" height="32" fill="#1b1b20" stroke="#fff" stroke-width="2"/>
    <text x="65" y="316" text-anchor="middle" font-family="'Impact', sans-serif" font-size="12" fill="#facc15">EARTH-616</text>
  </g>

  <!-- Panel 2: Earth-1610 Miles Morales (Matte Black & Spray Red) -->
  <g transform="translate(160, 20)">
    <rect width="130" height="340" fill="#09090b" stroke="#1b1b20" stroke-width="4"/>
    <!-- Spray-Paint Red Spider Logo -->
    <path d="M65 80 L65 170 M45 100 L85 100 M35 125 L95 125" stroke="#ef4444" stroke-width="4"/>
    <circle cx="65" cy="115" r="14" fill="#ef4444"/>
    <!-- Bio-Electric Spark Venom Strike -->
    <path d="M65 180 L75 200 L60 215 L78 245" stroke="#facc15" stroke-width="3" fill="none"/>
    <!-- Lenses -->
    <path d="M32 105 Q50 90 60 110 Q55 125 34 120 Z" fill="#ffffff" stroke="#ef4444" stroke-width="3"/>
    <path d="M98 105 Q80 90 70 110 Q75 125 96 120 Z" fill="#ffffff" stroke="#ef4444" stroke-width="3"/>
    <!-- Label -->
    <rect x="10" y="295" width="110" height="32" fill="#dc2626" stroke="#fff" stroke-width="2"/>
    <text x="65" y="316" text-anchor="middle" font-family="'Impact', sans-serif" font-size="12" fill="#fff">EARTH-1610</text>
  </g>

  <!-- Panel 3: Earth-65 Ghost-Spider (Hooded White, Magenta & Cyan) -->
  <g transform="translate(300, 20)">
    <rect width="130" height="340" fill="#f8fafc" stroke="#1b1b20" stroke-width="4"/>
    <!-- Hood Outline -->
    <path d="M20 50 Q65 15 110 50 L115 200 Q65 240 15 200 Z" fill="#f1f5f9" stroke="#1b1b20" stroke-width="3"/>
    <!-- Magenta & Cyan Web Interior -->
    <path d="M35 80 Q65 60 95 80 Q65 160 35 80 Z" fill="#d946ef" opacity="0.85"/>
    <path d="M40 90 Q65 75 90 90 Q65 145 40 90 Z" fill="#06b6d4" opacity="0.9"/>
    <!-- White Mask Face with Cyan Rim -->
    <circle cx="65" cy="120" r="28" fill="#ffffff" stroke="#06b6d4" stroke-width="3"/>
    <!-- Label -->
    <rect x="10" y="295" width="110" height="32" fill="#c026d3" stroke="#fff" stroke-width="2"/>
    <text x="65" y="316" text-anchor="middle" font-family="'Impact', sans-serif" font-size="12" fill="#fff">EARTH-65</text>
  </g>

  <!-- Panel 4: Earth-928 Spider-Man 2099 (Cyberpunk Skull) -->
  <g transform="translate(440, 20)">
    <rect width="140" height="340" fill="#0f172a" stroke="#1b1b20" stroke-width="4"/>
    <!-- Neon Cyber Grid lines -->
    <line x1="20" y1="50" x2="120" y2="50" stroke="#0284c7" stroke-width="1.5" stroke-dasharray="4,4"/>
    <line x1="20" y1="120" x2="120" y2="120" stroke="#0284c7" stroke-width="1.5" stroke-dasharray="4,4"/>
    <!-- Red Day of the Dead Skull Spider Emblem -->
    <path d="M70 70 L50 95 L60 120 L70 105 L80 120 L90 95 Z" fill="#dc2626" stroke="#991b1b" stroke-width="2"/>
    <path d="M50 100 L30 140 M90 100 L110 140" stroke="#dc2626" stroke-width="4"/>
    <!-- Razor Forearm Talons -->
    <polygon points="25,200 15,180 28,190" fill="#dc2626"/>
    <polygon points="25,215 15,195 28,205" fill="#dc2626"/>
    <!-- Label -->
    <rect x="15" y="295" width="110" height="32" fill="#0284c7" stroke="#fff" stroke-width="2"/>
    <text x="70" y="316" text-anchor="middle" font-family="'Impact', sans-serif" font-size="12" fill="#fff">EARTH-928</text>
  </g>

  <!-- Central Detective Magnifying Glass Badge Overlap -->
  <g transform="translate(240, 110)">
    <circle cx="60" cy="60" r="55" fill="none" stroke="#facc15" stroke-width="6"/>
    <line x1="100" y1="100" x2="140" y2="140" stroke="#facc15" stroke-width="10" stroke-linecap="round"/>
    <rect x="0" y="45" width="120" height="30" fill="#1b1b20" stroke="#facc15" stroke-width="2"/>
    <text x="60" y="66" text-anchor="middle" font-family="'Impact', sans-serif" font-size="16" fill="#ffffff" letter-spacing="1">IDENTI-MATCH</text>
  </g>
</svg>
`);

/**
 * 03: FACT ATTACK: TRUE OR FICTION - Rapid Comic Trivia
 * Features: Dynamic comic book explosion battle with TRUE (Green Web Shield) vs FALSE (Red Villain Claws)
 */
export const GAME_THUMB_FACT_ATTACK = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 380" width="600" height="380">
  <defs>
    <radialGradient id="sunburstGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="60%" stop-color="#f97316"/>
      <stop offset="100%" stop-color="#dc2626"/>
    </radialGradient>
  </defs>

  <!-- Sunburst Background -->
  <rect width="600" height="380" fill="url(#sunburstGrad)"/>

  <!-- Comic Sunburst Rays -->
  <g fill="#ea580c" opacity="0.35">
    <polygon points="300,190 0,0 60,0"/>
    <polygon points="300,190 180,0 240,0"/>
    <polygon points="300,190 360,0 420,0"/>
    <polygon points="300,190 540,0 600,0"/>
    <polygon points="300,190 600,100 600,160"/>
    <polygon points="300,190 600,240 600,300"/>
    <polygon points="300,190 600,380 520,380"/>
    <polygon points="300,190 380,380 300,380"/>
    <polygon points="300,190 180,380 100,380"/>
    <polygon points="300,190 0,340 0,260"/>
    <polygon points="300,190 0,160 0,80"/>
  </g>

  <!-- Giant Comic Blast Starburst in Center -->
  <polygon points="300,40 340,110 420,80 410,150 490,160 440,220 500,270 420,280 430,350 360,320 310,370 270,310 200,350 210,270 140,250 190,190 130,140 210,120 220,50 280,100" fill="#ffffff" stroke="#1b1b20" stroke-width="6"/>

  <!-- Left: Green "TRUE" Comic Badge with Checkmark -->
  <g transform="translate(60, 160) rotate(-8)">
    <rect width="180" height="85" fill="#16a34a" stroke="#1b1b20" stroke-width="5" rx="6"/>
    <text x="90" y="55" text-anchor="middle" font-family="'Impact', 'Arial Black', sans-serif" font-size="44" fill="#ffffff" stroke="#1b1b20" stroke-width="2">✓ TRUE</text>
    <rect x="-10" y="-12" width="90" height="24" fill="#facc15" stroke="#1b1b20" stroke-width="2"/>
    <text x="35" y="4" text-anchor="middle" font-family="'Impact', sans-serif" font-size="12" fill="#1b1b20">STAN LEE CANON</text>
  </g>

  <!-- Right: Red "FALSE" Comic Badge with Cross -->
  <g transform="translate(360, 160) rotate(8)">
    <rect width="180" height="85" fill="#dc2626" stroke="#1b1b20" stroke-width="5" rx="6"/>
    <text x="90" y="55" text-anchor="middle" font-family="'Impact', 'Arial Black', sans-serif" font-size="44" fill="#ffffff" stroke="#1b1b20" stroke-width="2">✗ FALSE</text>
    <rect x="90" y="-12" width="100" height="24" fill="#1b1b20" stroke="#fff" stroke-width="2"/>
    <text x="140" y="4" text-anchor="middle" font-family="'Impact', sans-serif" font-size="12" fill="#fff">MYSTERIO HOAX</text>
  </g>

  <!-- Center Title Banner "FACT ATTACK!" -->
  <g transform="translate(300, 105)">
    <rect x="-170" y="-35" width="340" height="70" fill="#facc15" stroke="#1b1b20" stroke-width="5"/>
    <text x="0" y="14" text-anchor="middle" font-family="'Impact', 'Arial Black', sans-serif" font-size="46" fill="#1b1b20" letter-spacing="1">FACT ATTACK!</text>
  </g>

  <!-- Bottom Lightning Sparks -->
  <path d="M250 280 L290 320 L275 330 L320 370" stroke="#facc15" stroke-width="5" fill="none"/>
  <path d="M350 280 L320 320 L335 330 L300 370" stroke="#facc15" stroke-width="5" fill="none"/>
</svg>
`);

/**
 * 04: WEB OF KNOWLEDGE (MCQ) - Multiple Choice Comic Panels
 * Features: Spider-web network connecting 4 lettered comic answer panels [A], [B], [C], [D]
 */
export const GAME_THUMB_WEB_KNOWLEDGE = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 380" width="600" height="380">
  <defs>
    <linearGradient id="blueGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0284c7"/>
      <stop offset="50%" stop-color="#1e3a8a"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
  </defs>

  <rect width="600" height="380" fill="url(#blueGrad)"/>

  <!-- Background Giant Spider Web Net -->
  <g stroke="#38bdf8" stroke-width="2" opacity="0.3" fill="none">
    <circle cx="300" cy="190" r="50"/>
    <circle cx="300" cy="190" r="100"/>
    <circle cx="300" cy="190" r="150"/>
    <circle cx="300" cy="190" r="210"/>
    <line x1="0" y1="0" x2="600" y2="380"/>
    <line x1="600" y1="0" x2="0" y2="380"/>
    <line x1="300" y1="0" x2="300" y2="380"/>
    <line x1="0" y1="190" x2="600" y2="190"/>
  </g>

  <!-- Central Question Banner -->
  <g transform="translate(300, 70)">
    <rect x="-240" y="-30" width="480" height="60" fill="#ffffff" stroke="#1b1b20" stroke-width="4"/>
    <rect x="-240" y="-30" width="10" height="60" fill="#dc2626"/>
    <text x="-215" y="-12" font-family="'Impact', sans-serif" font-size="11" fill="#dc2626" letter-spacing="1">AMAZING SPIDER-MAN ARCHIVE QUESTION</text>
    <text x="-215" y="14" font-family="'Impact', sans-serif" font-size="20" fill="#1b1b20">WHAT CHEMICAL FORMULA CREATED THE WEB-FLUID?</text>
  </g>

  <!-- 4 Multiple Choice Comic Option Panels -->
  <!-- Option A -->
  <g transform="translate(60, 140)">
    <rect width="220" height="85" fill="#f8fafc" stroke="#1b1b20" stroke-width="3"/>
    <rect x="0" y="0" width="36" height="85" fill="#dc2626"/>
    <text x="18" y="52" text-anchor="middle" font-family="'Impact', sans-serif" font-size="28" fill="#ffffff">A</text>
    <text x="50" y="38" font-family="'Impact', sans-serif" font-size="15" fill="#1b1b20">SHEAR-THINNING</text>
    <text x="50" y="60" font-family="sans-serif" font-weight="bold" font-size="12" fill="#64748b">ADHESIVE POLYMER</text>
  </g>

  <!-- Option B (Correct Highlight) -->
  <g transform="translate(320, 140)">
    <rect width="220" height="85" fill="#dcfce7" stroke="#16a34a" stroke-width="4"/>
    <rect x="0" y="0" width="36" height="85" fill="#16a34a"/>
    <text x="18" y="52" text-anchor="middle" font-family="'Impact', sans-serif" font-size="28" fill="#ffffff">B</text>
    <text x="50" y="38" font-family="'Impact', sans-serif" font-size="15" fill="#14532d">MIDTOWN LAB NYLON</text>
    <text x="50" y="60" font-family="sans-serif" font-weight="bold" font-size="12" fill="#16a34a">✓ CANON ANSWER</text>
  </g>

  <!-- Option C -->
  <g transform="translate(60, 250)">
    <rect width="220" height="85" fill="#f8fafc" stroke="#1b1b20" stroke-width="3"/>
    <rect x="0" y="0" width="36" height="85" fill="#1b1b20"/>
    <text x="18" y="52" text-anchor="middle" font-family="'Impact', sans-serif" font-size="28" fill="#ffffff">C</text>
    <text x="50" y="38" font-family="'Impact', sans-serif" font-size="15" fill="#1b1b20">OSCORP OZ FORMULA</text>
    <text x="50" y="60" font-family="sans-serif" font-weight="bold" font-size="12" fill="#64748b">GENETIC MUTATION</text>
  </g>

  <!-- Option D -->
  <g transform="translate(320, 250)">
    <rect width="220" height="85" fill="#f8fafc" stroke="#1b1b20" stroke-width="3"/>
    <rect x="0" y="0" width="36" height="85" fill="#1b1b20"/>
    <text x="18" y="52" text-anchor="middle" font-family="'Impact', sans-serif" font-size="28" fill="#ffffff">D</text>
    <text x="50" y="38" font-family="'Impact', sans-serif" font-size="15" fill="#1b1b20">STARK NANOTECH</text>
    <text x="50" y="60" font-family="sans-serif" font-weight="bold" font-size="12" fill="#64748b">ORGANIC SILK DUCTS</text>
  </g>
</svg>
`);

/**
 * 05: WHO SAID IT? COMIC QUOTES - Speech Balloon Dialogue Detective
 * Features: Iconic speech bubbles with character silhouettes and comic dialogue
 */
export const GAME_THUMB_WHO_SAID_IT = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 380" width="600" height="380">
  <defs>
    <linearGradient id="warmGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#fbbf24"/>
      <stop offset="50%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#b45309"/>
    </linearGradient>
  </defs>

  <rect width="600" height="380" fill="url(#warmGrad)"/>

  <!-- Comic Halftone Pattern -->
  <g fill="#000" opacity="0.1">
    <circle cx="20" cy="20" r="3"/><circle cx="50" cy="20" r="3"/><circle cx="80" cy="20" r="3"/>
    <circle cx="20" cy="60" r="3"/><circle cx="50" cy="60" r="3"/><circle cx="80" cy="60" r="3"/>
    <circle cx="540" cy="320" r="3"/><circle cx="570" cy="320" r="3"/><circle cx="540" cy="350" r="3"/>
  </g>

  <!-- Big Comic Speech Bubble 1: Uncle Ben -->
  <g transform="translate(60, 40) rotate(-2)">
    <rect width="480" height="110" rx="16" fill="#ffffff" stroke="#1b1b20" stroke-width="5"/>
    <!-- Speech bubble pointer -->
    <polygon points="120,110 140,140 160,110" fill="#ffffff" stroke="#1b1b20" stroke-width="5"/>
    <rect x="125" y="105" width="30" height="10" fill="#ffffff"/>
    <text x="240" y="45" text-anchor="middle" font-family="'Impact', 'Arial Black', sans-serif" font-style="italic" font-size="24" fill="#dc2626">“WITH GREAT POWER COMES</text>
    <text x="240" y="80" text-anchor="middle" font-family="'Impact', 'Arial Black', sans-serif" font-style="italic" font-size="28" fill="#1b1b20">GREAT RESPONSIBILITY!”</text>
  </g>

  <!-- Speech Bubble 2: Mary Jane Watson -->
  <g transform="translate(40, 195) rotate(3)">
    <rect width="320" height="80" rx="14" fill="#fef08a" stroke="#1b1b20" stroke-width="4"/>
    <polygon points="260,80 280,105 295,80" fill="#fef08a" stroke="#1b1b20" stroke-width="4"/>
    <rect x="265" y="76" width="25" height="8" fill="#fef08a"/>
    <text x="160" y="38" text-anchor="middle" font-family="'Impact', sans-serif" font-style="italic" font-size="20" fill="#713f12">“FACE IT, TIGER...</text>
    <text x="160" y="62" text-anchor="middle" font-family="'Impact', sans-serif" font-style="italic" font-size="20" fill="#b91c1c">YOU JUST HIT THE JACKPOT!”</text>
  </g>

  <!-- Speech Bubble 3: J. Jonah Jameson -->
  <g transform="translate(320, 260) rotate(-3)">
    <rect width="250" height="80" rx="12" fill="#ffffff" stroke="#dc2626" stroke-width="4"/>
    <text x="125" y="36" text-anchor="middle" font-family="'Impact', sans-serif" font-size="18" fill="#dc2626">“HE'S A MENACE!</text>
    <text x="125" y="60" text-anchor="middle" font-family="'Impact', sans-serif" font-size="18" fill="#1b1b20">GET ME PICTURES!”</text>
  </g>

  <!-- Mystery Silhouette Detective Stamp -->
  <g transform="translate(420, 170)">
    <circle cx="45" cy="45" r="40" fill="#1b1b20" stroke="#ffffff" stroke-width="3"/>
    <text x="45" y="58" text-anchor="middle" font-family="'Impact', sans-serif" font-size="44" fill="#facc15">?</text>
  </g>
</svg>
`);

/**
 * 06: SPIDER-SENSE SPEED REFLEX - Lightning Quick-Time Reflex
 * Features: Close-up of Spider-Man's mask lenses with glowing Ditko radar vibration lines and 10-second timer
 */
export const GAME_THUMB_SPIDER_SENSE = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 380" width="600" height="380">
  <defs>
    <radialGradient id="electricGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="40%" stop-color="#f59e0b"/>
      <stop offset="70%" stop-color="#dc2626"/>
      <stop offset="100%" stop-color="#450a0a"/>
    </radialGradient>
  </defs>

  <rect width="600" height="380" fill="url(#electricGrad)"/>

  <!-- Ditko Vibrating Spider-Sense Lightning Aura Waves -->
  <g stroke="#facc15" stroke-width="4" fill="none" opacity="0.95">
    <path d="M150 90 L180 40 L210 90 L240 30 L270 90"/>
    <path d="M330 90 L360 30 L390 90 L420 40 L450 90"/>
    <path d="M80 180 L20 150 L80 120 L10 90 L80 60"/>
    <path d="M520 180 L580 150 L520 120 L590 90 L520 60"/>
    <path d="M220 20 Q300 -10 380 20" stroke-width="6" stroke-dasharray="8,6"/>
    <path d="M180 50 Q300 15 420 50" stroke-width="5" stroke-dasharray="6,4"/>
  </g>

  <!-- Large Stylized Spider-Man Mask Foreground (Centered Eyes) -->
  <g transform="translate(300, 230)">
    <!-- Crimson Head Curve -->
    <path d="M-180 60 C-180 -100 180 -100 180 60 Z" fill="#dc2626" stroke="#1b1b20" stroke-width="6"/>
    <!-- Black Web Lines Radiating from Nose Bridge -->
    <g stroke="#1b1b20" stroke-width="3" fill="none">
      <line x1="0" y1="-20" x2="0" y2="-100"/>
      <line x1="0" y1="-20" x2="-60" y2="-90"/>
      <line x1="0" y1="-20" x2="60" y2="-90"/>
      <line x1="0" y1="-20" x2="-120" y2="-60"/>
      <line x1="0" y1="-20" x2="120" y2="-60"/>
      <path d="M-120 -40 Q0 -60 120 -40"/>
      <path d="M-150 0 Q0 -30 150 0"/>
    </g>

    <!-- Left Expressive Angular Comic Lens -->
    <path d="M-130 -10 Q-60 -50 -15 -10 Q-30 40 -115 25 Z" fill="#ffffff" stroke="#1b1b20" stroke-width="8"/>
    <!-- Right Expressive Angular Comic Lens -->
    <path d="M130 -10 Q60 -50 15 -10 Q30 40 115 25 Z" fill="#ffffff" stroke="#1b1b20" stroke-width="8"/>
  </g>

  <!-- Urgent Digital Countdown Stopwatch Badge (10 SECONDS) -->
  <g transform="translate(50, 45)">
    <rect width="180" height="60" fill="#1b1b20" stroke="#facc15" stroke-width="4"/>
    <text x="20" y="42" font-family="monospace" font-weight="900" font-size="34" fill="#ef4444">09:82</text>
    <rect x="135" y="15" width="32" height="30" fill="#dc2626"/>
    <text x="151" y="36" text-anchor="middle" font-family="'Impact', sans-serif" font-size="14" fill="#fff">SEC</text>
  </g>

  <!-- Sound Badge "BZZZZT!" -->
  <g transform="translate(410, 45) rotate(6)">
    <polygon points="0,0 140,-15 130,45 10,40" fill="#facc15" stroke="#1b1b20" stroke-width="3"/>
    <text x="70" y="28" text-anchor="middle" font-family="'Impact', sans-serif" font-size="24" fill="#1b1b20">SPIDER-SENSE!</text>
  </g>
</svg>
`);

/**
 * 07: WEB SWING - Endless Rooftop Swinger
 * Features: Spider-Man swinging on dynamic web line between skyscrapers with speed lines, golden spider tokens, and "WHOOSH!" burst
 */
export const GAME_THUMB_WEB_SWING = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 380" width="600" height="380">
  <defs>
    <linearGradient id="swingSky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#180b2a"/>
      <stop offset="40%" stop-color="#581c87"/>
      <stop offset="75%" stop-color="#dc2626"/>
      <stop offset="100%" stop-color="#fb923c"/>
    </linearGradient>
    <radialGradient id="tokenGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="60%" stop-color="#eab308"/>
      <stop offset="100%" stop-color="#ca8a04" stop-opacity="0"/>
    </radialGradient>
    <pattern id="htDotsSwing" width="10" height="10" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.5" fill="#000" opacity="0.14"/>
    </pattern>
  </defs>

  <!-- Sky & Halftone -->
  <rect width="600" height="380" fill="url(#swingSky)"/>
  <rect width="600" height="380" fill="url(#htDotsSwing)"/>

  <!-- Background Skyscrapers Silhouettes -->
  <path d="M0 380 L0 180 L40 180 L40 220 L90 220 L90 140 L130 140 L130 250 L180 250 L180 120 L210 120 L210 90 L220 90 L220 120 L240 120 L240 380 Z" fill="#090514"/>
  <path d="M240 380 L240 170 L280 170 L280 130 L320 130 L320 230 L370 230 L370 110 L410 110 L410 240 L460 240 L460 160 L510 160 L510 380 Z" fill="#130b24"/>
  <path d="M480 380 L480 200 L530 200 L530 140 L570 140 L570 100 L580 80 L590 100 L600 100 L600 380 Z" fill="#201138"/>

  <!-- Glowing Yellow Windows in City Towers -->
  <g fill="#fde047" opacity="0.75">
    <rect x="50" y="235" width="5" height="8"/><rect x="65" y="235" width="5" height="8"/>
    <rect x="100" y="160" width="5" height="8"/><rect x="115" y="160" width="5" height="8"/>
    <rect x="190" y="140" width="5" height="8"/><rect x="200" y="140" width="5" height="8"/>
    <rect x="335" y="150" width="6" height="9"/><rect x="350" y="150" width="6" height="9"/>
    <rect x="425" y="130" width="6" height="9"/><rect x="440" y="130" width="6" height="9"/>
    <rect x="540" y="160" width="5" height="8"/><rect x="555" y="160" width="5" height="8"/>
  </g>

  <!-- Speed Lines / Air Motion Streaks -->
  <g stroke="#ffffff" stroke-width="2" opacity="0.4" stroke-dasharray="16,8">
    <line x1="50" y1="120" x2="280" y2="170"/>
    <line x1="30" y1="210" x2="320" y2="250"/>
    <line x1="80" y1="70" x2="350" y2="130"/>
    <line x1="120" y1="290" x2="400" y2="310"/>
  </g>

  <!-- High Skyscraper Spire Anchor Point (Top Right) -->
  <line x1="490" y1="0" x2="490" y2="70" stroke="#facc15" stroke-width="4"/>
  <circle cx="490" cy="40" r="10" fill="#dc2626" stroke="#1b1b20" stroke-width="3"/>
  <circle cx="490" cy="40" r="4" fill="#ffffff"/>

  <!-- Taut Web Line Shooting from Spider-Man's Wrist to Anchor -->
  <path d="M260 210 Q370 120 490 40" fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round"/>
  <path d="M260 210 Q370 120 490 40" fill="none" stroke="#93c5fd" stroke-width="2" stroke-linecap="round"/>

  <!-- Golden Collectible Spider Tokens Floating in Arc -->
  <g transform="translate(160, 110)">
    <circle cx="0" cy="0" r="22" fill="url(#tokenGlow)"/>
    <circle cx="0" cy="0" r="14" fill="#facc15" stroke="#1b1b20" stroke-width="2.5"/>
    <ellipse cx="0" cy="0" rx="3.5" ry="5" fill="#1b1b20"/>
    <path d="M-6 -4 L-2 -1 M-7 0 L-2 0 M-6 4 L-2 1 M6 -4 L2 -1 M7 0 L2 0 M6 4 L2 1" stroke="#1b1b20" stroke-width="1.8"/>
  </g>
  <g transform="translate(230, 80)">
    <circle cx="0" cy="0" r="20" fill="url(#tokenGlow)"/>
    <circle cx="0" cy="0" r="12" fill="#facc15" stroke="#1b1b20" stroke-width="2"/>
    <ellipse cx="0" cy="0" rx="3" ry="4.5" fill="#1b1b20"/>
  </g>

  <!-- Spider-Man in Full Dynamic Swinging Pose -->
  <g transform="translate(210, 180) rotate(-18)">
    <g opacity="0.3" transform="translate(-18, -10)">
      <ellipse cx="40" cy="30" rx="20" ry="14" fill="#dc2626"/>
    </g>
    <path d="M20 20 Q45 10 70 25 L65 55 Q42 62 18 50 Z" fill="#dc2626" stroke="#1b1b20" stroke-width="3"/>
    <path d="M22 25 L32 50 L18 50 Z" fill="#1d4ed8"/>
    <path d="M68 25 L58 52 L65 55 Z" fill="#1d4ed8"/>
    <path d="M42 28 L42 45 M36 33 L48 33 M34 40 L50 40" stroke="#1b1b20" stroke-width="2.5"/>
    <circle cx="42" cy="36" r="3.5" fill="#1b1b20"/>
    <path d="M20 24 L-15 10 L-25 18" fill="none" stroke="#dc2626" stroke-width="8" stroke-linecap="round"/>
    <path d="M20 24 L-15 10 L-25 18" fill="none" stroke="#1b1b20" stroke-width="2" stroke-linecap="round"/>
    <path d="M65 20 L95 -5 L105 -18" fill="none" stroke="#dc2626" stroke-width="9" stroke-linecap="round"/>
    <path d="M65 20 L95 -5 L105 -18" fill="none" stroke="#1b1b20" stroke-width="2" stroke-linecap="round"/>
    <circle cx="106" cy="-20" r="7" fill="#dc2626" stroke="#1b1b20" stroke-width="2.5"/>
    <ellipse cx="48" cy="12" rx="14" ry="18" fill="#dc2626" stroke="#1b1b20" stroke-width="3.5"/>
    <path d="M38 10 Q45 6 46 12 Q44 17 38 15 Z" fill="#ffffff" stroke="#1b1b20" stroke-width="2"/>
    <path d="M58 10 Q51 6 50 12 Q52 17 58 15 Z" fill="#ffffff" stroke="#1b1b20" stroke-width="2"/>
    <path d="M25 52 L5 85 L25 110" fill="none" stroke="#1d4ed8" stroke-width="9" stroke-linecap="round"/>
    <path d="M25 110 L35 115" stroke="#dc2626" stroke-width="9" stroke-linecap="round"/>
    <path d="M55 55 L75 90 L105 95" fill="none" stroke="#1d4ed8" stroke-width="9" stroke-linecap="round"/>
    <path d="M105 95 L118 95" stroke="#dc2626" stroke-width="9" stroke-linecap="round"/>
  </g>

  <!-- Comic Action Sound Burst: "WHOOSH!" -->
  <g transform="translate(100, 275) rotate(-10)">
    <polygon points="-10,-10 110,-25 150,15 50,40 -20,20" fill="#facc15" stroke="#1b1b20" stroke-width="3.5"/>
    <text x="65" y="16" text-anchor="middle" font-family="'Impact', 'Arial Black', sans-serif" font-style="italic" font-weight="900" font-size="28" fill="#dc2626" stroke="#1b1b20" stroke-width="1.2">WHOOSH!</text>
  </g>

  <!-- Tagline Banner -->
  <g transform="translate(30, 325)">
    <rect x="0" y="0" width="310" height="34" fill="#1b1b20" stroke="#facc15" stroke-width="2.5"/>
    <text x="155" y="23" text-anchor="middle" font-family="'Impact', sans-serif" font-size="16" fill="#ffffff" letter-spacing="2">SWING. DODGE. SURVIVE.</text>
  </g>
</svg>
`);

/**
 * 08: SPIDER-SENSE - Real-Time Reflex Reaction Game
 * Features: Spider-Man in combat stance with glowing spider-sense lightning tingling arcs, dodging incoming taxi, falling bricks, and pumpkin bomb
 */
export const GAME_THUMB_SPIDER_SENSE_ACTION = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 380" width="600" height="380">
  <defs>
    <radialGradient id="senseCenterGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#fef08a" stop-opacity="0.9"/>
      <stop offset="35%" stop-color="#f59e0b" stop-opacity="0.6"/>
      <stop offset="70%" stop-color="#dc2626" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#180b2a" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="nightStreetGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0f0919"/>
      <stop offset="50%" stop-color="#24113a"/>
      <stop offset="85%" stop-color="#3b0764"/>
      <stop offset="100%" stop-color="#1e1b4b"/>
    </linearGradient>
  </defs>

  <rect width="600" height="380" fill="url(#nightStreetGrad)"/>
  <circle cx="300" cy="210" r="160" fill="url(#senseCenterGlow)"/>

  <!-- Golden Spider-Sense Danger Shockwave Radiating Lines -->
  <g stroke="#facc15" stroke-width="3" fill="none">
    <path d="M260 140 Q250 110 230 100 Q245 90 235 60"/>
    <path d="M275 130 Q270 95 260 70 Q280 65 270 40"/>
    <path d="M300 120 Q300 90 295 65 Q310 50 300 25"/>
    <path d="M325 130 Q330 95 340 70 Q320 65 330 40"/>
    <path d="M340 140 Q350 110 370 100 Q355 90 365 60"/>
  </g>
  <g stroke="#ef4444" stroke-width="2.5" fill="none">
    <path d="M245 155 Q210 130 190 125"/>
    <path d="M355 155 Q390 130 410 125"/>
    <path d="M280 125 Q285 80 280 50"/>
    <path d="M320 125 Q315 80 320 50"/>
  </g>

  <!-- Incoming Danger #1: Charging Yellow NYC Taxi Cab (Left) -->
  <g transform="translate(15, 220)">
    <path d="M10 50 L40 25 L120 25 L160 50 L170 85 L0 85 Z" fill="#eab308" stroke="#1b1b20" stroke-width="3.5"/>
    <polygon points="45,28 115,28 105,48 35,48" fill="#38bdf8" stroke="#1b1b20" stroke-width="2"/>
    <rect x="0" y="55" width="165" height="10" fill="#1b1b20"/>
    <g fill="#ffffff">
      <rect x="5" y="55" width="12" height="10"/><rect x="35" y="55" width="12" height="10"/>
      <rect x="65" y="55" width="12" height="10"/><rect x="95" y="55" width="12" height="10"/>
      <rect x="125" y="55" width="12" height="10"/><rect x="155" y="10" width="10" height="10"/>
    </g>
    <polygon points="170,55 240,40 250,85 170,80" fill="#fef08a" opacity="0.35"/>
    <circle cx="168" cy="65" r="9" fill="#fef08a" stroke="#1b1b20" stroke-width="2"/>
    <circle cx="130" cy="85" r="18" fill="#1b1b20"/>
    <circle cx="130" cy="85" r="8" fill="#94a3b8"/>
    <rect x="25" y="-5" width="85" height="22" fill="#dc2626" stroke="#1b1b20" stroke-width="2"/>
    <text x="67" y="11" text-anchor="middle" font-family="'Impact', sans-serif" font-size="12" fill="#ffffff">JUMP! (UP)</text>
  </g>

  <!-- Incoming Danger #2: Falling Heavy Masonry Bricks (Top Center) -->
  <g transform="translate(255, 30)">
    <rect x="10" y="10" width="38" height="22" fill="#991b1b" stroke="#1b1b20" stroke-width="2.5"/>
    <rect x="42" y="24" width="35" height="20" fill="#7f1d1d" stroke="#1b1b20" stroke-width="2.5"/>
    <rect x="15" y="38" width="30" height="18" fill="#b91c1c" stroke="#1b1b20" stroke-width="2.5"/>
    <circle cx="20" cy="60" r="5" fill="#a8a29e" opacity="0.8"/>
    <circle cx="65" cy="50" r="7" fill="#a8a29e" opacity="0.8"/>
    <line x1="28" y1="0" x2="28" y2="10" stroke="#facc15" stroke-width="3"/>
    <line x1="58" y1="5" x2="58" y2="22" stroke="#facc15" stroke-width="3"/>
    <rect x="0" y="65" width="90" height="20" fill="#dc2626" stroke="#1b1b20" stroke-width="2"/>
    <text x="45" y="79" text-anchor="middle" font-family="'Impact', sans-serif" font-size="11" fill="#ffffff">DODGE! (L/R)</text>
  </g>

  <!-- Incoming Danger #3: Gliding Green Goblin Pumpkin Bomb (Right) -->
  <g transform="translate(450, 180)">
    <circle cx="45" cy="45" r="24" fill="#ea580c" stroke="#1b1b20" stroke-width="3.5"/>
    <polygon points="34,38 42,46 32,46" fill="#fef08a"/>
    <polygon points="56,38 48,46 58,46" fill="#fef08a"/>
    <polygon points="36,54 45,58 54,54 45,50" fill="#fef08a"/>
    <path d="M70 45 Q110 30 140 45 Q120 60 70 52 Z" fill="#84cc16" opacity="0.75" stroke="#1b1b20" stroke-width="2"/>
    <polygon points="45,21 52,10 58,21" fill="#facc15"/>
    <rect x="0" y="-12" width="95" height="22" fill="#dc2626" stroke="#1b1b20" stroke-width="2"/>
    <text x="47" y="4" text-anchor="middle" font-family="'Impact', sans-serif" font-size="12" fill="#ffffff">WEB! (SPACE)</text>
  </g>

  <!-- Center: Spider-Man in Dynamic Ready Evasion Pose -->
  <g transform="translate(260, 170)">
    <ellipse cx="40" cy="55" rx="26" ry="20" fill="#dc2626" stroke="#1b1b20" stroke-width="3.5"/>
    <path d="M20 48 Q40 40 60 48 L56 68 Q40 74 24 68 Z" fill="#1d4ed8" stroke="#1b1b20" stroke-width="2.5"/>
    <circle cx="40" cy="56" r="4.5" fill="#1b1b20"/>
    <path d="M18 50 L-8 65 L-12 85" fill="none" stroke="#dc2626" stroke-width="8" stroke-linecap="round"/>
    <path d="M18 50 L-8 65 L-12 85" fill="none" stroke="#1b1b20" stroke-width="2" stroke-linecap="round"/>
    <circle cx="-12" cy="85" r="5" fill="#dc2626" stroke="#1b1b20" stroke-width="2"/>
    <path d="M62 50 L88 42 L102 30" fill="none" stroke="#dc2626" stroke-width="8" stroke-linecap="round"/>
    <path d="M62 50 L88 42 L102 30" fill="none" stroke="#1b1b20" stroke-width="2" stroke-linecap="round"/>
    <circle cx="102" cy="30" r="5" fill="#dc2626" stroke="#1b1b20" stroke-width="2"/>
    <ellipse cx="40" cy="30" rx="17" ry="20" fill="#dc2626" stroke="#1b1b20" stroke-width="4"/>
    <path d="M28 26 Q36 20 38 29 Q36 36 27 33 Z" fill="#ffffff" stroke="#1b1b20" stroke-width="2.5"/>
    <path d="M52 26 Q44 20 42 29 Q44 36 53 33 Z" fill="#ffffff" stroke="#1b1b20" stroke-width="2.5"/>
    <path d="M22 68 L5 90 L-10 110" fill="none" stroke="#1d4ed8" stroke-width="9" stroke-linecap="round"/>
    <path d="M-10 110 L-20 112" stroke="#dc2626" stroke-width="9" stroke-linecap="round"/>
    <path d="M58 68 L80 92 L98 108" fill="none" stroke="#1d4ed8" stroke-width="9" stroke-linecap="round"/>
    <path d="M98 108 L110 108" stroke="#dc2626" stroke-width="9" stroke-linecap="round"/>
  </g>

  <!-- Comic Danger Alert Banner Top-Left -->
  <g transform="translate(25, 25) rotate(-3)">
    <rect x="0" y="0" width="190" height="38" fill="#dc2626" stroke="#1b1b20" stroke-width="3"/>
    <text x="95" y="26" text-anchor="middle" font-family="'Impact', sans-serif" font-size="20" fill="#ffffff" letter-spacing="1">⚠️ DANGER! REACT!</text>
  </g>

  <!-- Tagline Banner Bottom-Right -->
  <g transform="translate(270, 325)">
    <rect x="0" y="0" width="310" height="34" fill="#1b1b20" stroke="#facc15" stroke-width="2.5"/>
    <text x="155" y="23" text-anchor="middle" font-family="'Impact', sans-serif" font-size="15" fill="#ffffff" letter-spacing="2">REACT BEFORE IT'S TOO LATE.</text>
  </g>
</svg>
`);

/* ==========================================================================
   2. PROPER CHARACTER IMAGES (Canonical Marvel Multiverse Designs)
   ========================================================================== */

/**
 * Peter Parker (Earth-616) - Classic Red & Blue Suit with Web Pattern
 */
export const CHAR_PETER_616 = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
  <defs>
    <radialGradient id="p616Glow" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#ef4444"/>
      <stop offset="70%" stop-color="#b91c1c"/>
      <stop offset="100%" stop-color="#1e1b4b"/>
    </radialGradient>
  </defs>
  <rect width="500" height="500" fill="url(#p616Glow)"/>

  <!-- Web Network in Background -->
  <g stroke="#ffffff" stroke-width="1.5" opacity="0.25" fill="none">
    <circle cx="250" cy="220" r="70"/><circle cx="250" cy="220" r="140"/><circle cx="250" cy="220" r="210"/>
    <line x1="250" y1="220" x2="0" y2="0"/><line x1="250" y1="220" x2="500" y2="0"/>
    <line x1="250" y1="220" x2="0" y2="500"/><line x1="250" y1="220" x2="500" y2="500"/>
  </g>

  <!-- Shoulders & Torso: Classic Red & Royal Blue Suit -->
  <path d="M80 500 C90 380 180 340 250 340 C320 340 410 380 420 500 Z" fill="#dc2626" stroke="#1b1b20" stroke-width="6"/>
  <!-- Royal Blue Side Flanks -->
  <path d="M80 500 C110 420 150 370 180 360 L140 500 Z" fill="#1d4ed8" stroke="#1b1b20" stroke-width="4"/>
  <path d="M420 500 C390 420 350 370 320 360 L360 500 Z" fill="#1d4ed8" stroke="#1b1b20" stroke-width="4"/>
  <!-- Black Spider Chest Emblem -->
  <path d="M250 370 L250 430 M240 385 L260 385 M235 405 L265 405" stroke="#1b1b20" stroke-width="5"/>
  <circle cx="250" cy="395" r="10" fill="#1b1b20"/>
  <path d="M250 395 Q220 370 210 400 M250 395 Q280 370 290 400" stroke="#1b1b20" stroke-width="4" fill="none"/>

  <!-- Head / Mask -->
  <ellipse cx="250" cy="220" rx="110" ry="140" fill="#dc2626" stroke="#1b1b20" stroke-width="6"/>
  <!-- Classic Webbing on Mask -->
  <g stroke="#1b1b20" stroke-width="3" fill="none">
    <line x1="250" y1="80" x2="250" y2="360"/>
    <line x1="140" y1="220" x2="360" y2="220"/>
    <path d="M160 140 Q250 170 340 140"/>
    <path d="M150 280 Q250 250 350 280"/>
    <path d="M180 110 Q250 140 320 110"/>
  </g>

  <!-- Big Comic White Lenses with Thick Black Rims -->
  <path d="M155 190 Q220 160 235 210 Q225 255 165 240 Z" fill="#ffffff" stroke="#1b1b20" stroke-width="8"/>
  <path d="M345 190 Q280 160 265 210 Q275 255 335 240 Z" fill="#ffffff" stroke="#1b1b20" stroke-width="8"/>

  <!-- Bottom Hero Name Banner -->
  <rect x="50" y="445" width="400" height="42" fill="#1b1b20" stroke="#facc15" stroke-width="3"/>
  <text x="250" y="473" text-anchor="middle" font-family="'Impact', sans-serif" font-size="20" fill="#ffffff" letter-spacing="2">PETER PARKER • EARTH-616</text>
</svg>
`);

/**
 * Miles Morales (Earth-1610) - Matte Black, Spray-Paint Crimson Spider & Venom Strike Sparks
 */
export const CHAR_MILES_1610 = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
  <defs>
    <radialGradient id="m1610Glow" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#1e1b4b"/>
      <stop offset="60%" stop-color="#09090b"/>
      <stop offset="100%" stop-color="#020617"/>
    </radialGradient>
  </defs>
  <rect width="500" height="500" fill="url(#m1610Glow)"/>

  <!-- Bio-Electric Golden Sparks in Background -->
  <path d="M80 120 L110 160 L95 175 L130 220" stroke="#facc15" stroke-width="4" fill="none"/>
  <path d="M420 100 L390 140 L405 155 L370 200" stroke="#facc15" stroke-width="4" fill="none"/>
  <circle cx="100" cy="140" r="3" fill="#fde047"/>
  <circle cx="410" cy="120" r="3" fill="#fde047"/>

  <!-- Shoulders & Torso: Matte Black Suit with Red Web Lines -->
  <path d="M80 500 C90 380 180 340 250 340 C320 340 410 380 420 500 Z" fill="#18181b" stroke="#09090b" stroke-width="6"/>
  <!-- Spray Painted Red Spider Emblem -->
  <path d="M250 365 L250 440 M230 380 L270 380 M220 405 L280 405" stroke="#ef4444" stroke-width="6" stroke-linecap="round"/>
  <circle cx="250" cy="395" r="14" fill="#ef4444"/>
  <!-- Paint drips -->
  <line x1="245" y1="440" x2="245" y2="455" stroke="#ef4444" stroke-width="3" stroke-linecap="round"/>
  <line x1="255" y1="440" x2="255" y2="465" stroke="#ef4444" stroke-width="3" stroke-linecap="round"/>

  <!-- Head / Mask (Matte Black with Red Webbing) -->
  <ellipse cx="250" cy="220" rx="108" ry="138" fill="#18181b" stroke="#09090b" stroke-width="6"/>
  <!-- Red Webbing on Mask -->
  <g stroke="#ef4444" stroke-width="2.5" fill="none">
    <line x1="250" y1="82" x2="250" y2="358"/>
    <path d="M165 140 Q250 170 335 140"/>
    <path d="M155 280 Q250 250 345 280"/>
  </g>

  <!-- Lenses: Crisp White with Crimson Red Outer Borders -->
  <path d="M158 190 Q220 160 235 210 Q225 250 168 238 Z" fill="#ffffff" stroke="#ef4444" stroke-width="7"/>
  <path d="M342 190 Q280 160 265 210 Q275 250 332 238 Z" fill="#ffffff" stroke="#ef4444" stroke-width="7"/>

  <!-- Name Banner -->
  <rect x="50" y="445" width="400" height="42" fill="#ef4444" stroke="#1b1b20" stroke-width="3"/>
  <text x="250" y="473" text-anchor="middle" font-family="'Impact', sans-serif" font-size="20" fill="#ffffff" letter-spacing="2">MILES MORALES • EARTH-1610</text>
</svg>
`);

/**
 * Gwen Stacy / Ghost-Spider (Earth-65) - Hooded White Suit, Magenta & Cyan Webbing
 */
export const CHAR_GWEN_65 = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
  <defs>
    <radialGradient id="g65Glow" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#fdf4ff"/>
      <stop offset="60%" stop-color="#fae8ff"/>
      <stop offset="100%" stop-color="#c026d3"/>
    </radialGradient>
  </defs>
  <rect width="500" height="500" fill="url(#g65Glow)"/>

  <!-- Neo-Punk Drum Sticks & City Skyline in Background -->
  <line x1="60" y1="40" x2="160" y2="200" stroke="#06b6d4" stroke-width="5" stroke-linecap="round"/>
  <line x1="440" y1="40" x2="340" y2="200" stroke="#d946ef" stroke-width="5" stroke-linecap="round"/>

  <!-- Torso: Sleek Black Bodysuit with Cyan Ballet Details -->
  <path d="M100 500 C110 390 180 350 250 350 C320 350 390 390 400 500 Z" fill="#0f172a" stroke="#1b1b20" stroke-width="5"/>
  <polygon points="250,350 220,430 280,430" fill="#ffffff"/>

  <!-- Hood: Flowing White Fabric Framing Face -->
  <path d="M110 130 Q250 40 390 130 C410 240 390 350 250 370 C110 350 90 240 110 130 Z" fill="#ffffff" stroke="#1b1b20" stroke-width="5"/>
  <!-- Magenta and Cyan Web Lining inside Hood -->
  <path d="M140 170 Q250 110 360 170 C380 270 330 330 250 340 C170 330 120 270 140 170 Z" fill="#d946ef" opacity="0.9"/>
  <path d="M150 180 Q250 130 350 180 C360 260 320 310 250 320 C180 310 140 260 150 180 Z" fill="#06b6d4" opacity="0.95"/>

  <!-- White Mask Inside Hood -->
  <ellipse cx="250" cy="235" rx="85" ry="105" fill="#ffffff" stroke="#1b1b20" stroke-width="4"/>

  <!-- Striking Cyan & Magenta Lenses -->
  <path d="M185 210 Q230 185 240 225 Q230 255 190 245 Z" fill="#06b6d4" stroke="#d946ef" stroke-width="5"/>
  <path d="M315 210 Q270 185 260 225 Q270 255 310 245 Z" fill="#06b6d4" stroke="#d946ef" stroke-width="5"/>

  <!-- Name Banner -->
  <rect x="50" y="445" width="400" height="42" fill="#c026d3" stroke="#1b1b20" stroke-width="3"/>
  <text x="250" y="473" text-anchor="middle" font-family="'Impact', sans-serif" font-size="20" fill="#ffffff" letter-spacing="2">GHOST-SPIDER (GWEN) • EARTH-65</text>
</svg>
`);

/**
 * Miguel O'Hara (Earth-928) - Spider-Man 2099 Cyberpunk Skull Suit
 */
export const CHAR_MIGUEL_928 = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
  <defs>
    <linearGradient id="m928Grad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0284c7"/>
      <stop offset="60%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>
  </defs>
  <rect width="500" height="500" fill="url(#m928Grad)"/>

  <!-- Cyberpunk Nueva York Grid -->
  <g stroke="#0369a1" stroke-width="1.5" stroke-dasharray="4,4" opacity="0.35">
    <line x1="50" y1="0" x2="50" y2="500"/><line x1="150" y1="0" x2="150" y2="500"/>
    <line x1="350" y1="0" x2="350" y2="500"/><line x1="450" y1="0" x2="450" y2="500"/>
    <line x1="0" y1="100" x2="500" y2="100"/><line x1="0" y1="200" x2="500" y2="200"/>
  </g>

  <!-- Metallic Blue Shoulders & Razor Arm Talons -->
  <path d="M80 500 C90 380 180 340 250 340 C320 340 410 380 420 500 Z" fill="#0f274a" stroke="#0284c7" stroke-width="5"/>
  <!-- Spiked Forearm Talons -->
  <polygon points="90,440 60,400 95,415" fill="#dc2626"/>
  <polygon points="90,470 60,430 95,445" fill="#dc2626"/>
  <polygon points="410,440 440,400 405,415" fill="#dc2626"/>
  <polygon points="410,470 440,430 405,445" fill="#dc2626"/>

  <!-- Head / Mask (Deep Blue with Red Skull Markings) -->
  <ellipse cx="250" cy="220" rx="105" ry="135" fill="#0b1b36" stroke="#0284c7" stroke-width="5"/>

  <!-- Iconic Day of the Dead Red Skull / Spider Face Crest -->
  <path d="M250 140 L210 180 L230 220 L250 200 L270 220 L290 180 Z" fill="#dc2626" stroke="#991b1b" stroke-width="2"/>
  <path d="M210 180 L160 240 L190 255 M290 180 L340 240 L310 255" stroke="#dc2626" stroke-width="5" stroke-linecap="round" fill="none"/>
  <path d="M230 220 L200 310 L220 325 M270 220 L300 310 L280 325" stroke="#dc2626" stroke-width="5" stroke-linecap="round" fill="none"/>

  <!-- Menacing Slit Eyes -->
  <polygon points="180,215 220,200 215,225" fill="#ef4444"/>
  <polygon points="320,215 280,200 285,225" fill="#ef4444"/>

  <!-- Name Banner -->
  <rect x="50" y="445" width="400" height="42" fill="#0f172a" stroke="#0284c7" stroke-width="3"/>
  <text x="250" y="473" text-anchor="middle" font-family="'Impact', sans-serif" font-size="20" fill="#38bdf8" letter-spacing="2">MIGUEL O'HARA • EARTH-928 (2099)</text>
</svg>
`);

/**
 * Spider-Man Noir (Earth-90214) - Trench Coat, Fedora, Aviator Goggles, Monochrome Rain
 */
export const CHAR_NOIR_90214 = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
  <defs>
    <linearGradient id="noirGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#3f3f46"/>
      <stop offset="60%" stop-color="#18181b"/>
      <stop offset="100%" stop-color="#09090b"/>
    </linearGradient>
  </defs>
  <rect width="500" height="500" fill="url(#noirGrad)"/>

  <!-- Slanted 1930s Rain Lines -->
  <g stroke="#ffffff" stroke-width="1.5" opacity="0.25">
    <line x1="50" y1="0" x2="10" y2="200"/><line x1="150" y1="0" x2="110" y2="200"/>
    <line x1="250" y1="0" x2="210" y2="200"/><line x1="350" y1="0" x2="310" y2="200"/>
    <line x1="450" y1="0" x2="410" y2="200"/><line x1="550" y1="0" x2="510" y2="200"/>
  </g>

  <!-- Heavy WWI Leather Trench Coat Collar -->
  <path d="M80 500 L160 360 L210 420 L250 360 L290 420 L340 360 L420 500 Z" fill="#27272a" stroke="#09090b" stroke-width="6"/>

  <!-- Balaclava Mask -->
  <ellipse cx="250" cy="240" rx="95" ry="120" fill="#18181b" stroke="#09090b" stroke-width="5"/>

  <!-- Stitched Aviator Goggles with Brass Rim -->
  <g transform="translate(250, 230)">
    <!-- Left Goggle -->
    <circle cx="-50" cy="0" r="38" fill="#52525b" stroke="#a1a1aa" stroke-width="5"/>
    <circle cx="-50" cy="0" r="28" fill="#e4e4e7"/>
    <!-- Right Goggle -->
    <circle cx="50" cy="0" r="38" fill="#52525b" stroke="#a1a1aa" stroke-width="5"/>
    <circle cx="50" cy="0" r="28" fill="#e4e4e7"/>
    <!-- Leather Bridge -->
    <rect x="-16" y="-8" width="32" height="16" fill="#3f3f46" stroke="#09090b" stroke-width="3"/>
  </g>

  <!-- Fedora Hat on Head -->
  <g transform="translate(250, 130)">
    <!-- Brim -->
    <ellipse cx="0" cy="20" rx="160" ry="25" fill="#27272a" stroke="#09090b" stroke-width="5"/>
    <!-- Crown -->
    <path d="M-80 20 L-65 -60 Q0 -80 65 -60 L80 20 Z" fill="#3f3f46" stroke="#09090b" stroke-width="5"/>
    <!-- Ribbon -->
    <rect x="-75" y="0" width="150" height="20" fill="#09090b"/>
  </g>

  <!-- Name Banner -->
  <rect x="50" y="445" width="400" height="42" fill="#18181b" stroke="#a1a1aa" stroke-width="3"/>
  <text x="250" y="473" text-anchor="middle" font-family="'Impact', sans-serif" font-size="20" fill="#ffffff" letter-spacing="2">SPIDER-MAN NOIR • EARTH-90214</text>
</svg>
`);

/**
 * Spider-Punk (Earth-138) - Spiked Mohawk, Denim Vest, Electric Guitar
 */
export const CHAR_SPIDER_PUNK = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
  <defs>
    <radialGradient id="punkGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#dc2626"/>
      <stop offset="50%" stop-color="#1e1b4b"/>
      <stop offset="100%" stop-color="#020617"/>
    </radialGradient>
  </defs>
  <rect width="500" height="500" fill="url(#punkGrad)"/>

  <!-- Distortion Sound Waves & Safety Pins in Background -->
  <path d="M50 80 Q100 50 150 80 T250 80 T350 80 T450 80" stroke="#facc15" stroke-width="4" fill="none" opacity="0.6"/>

  <!-- Denim Battle Vest with Band Patches -->
  <path d="M90 500 C100 390 180 350 250 350 C320 350 400 390 410 500 Z" fill="#1e3a8a" stroke="#1b1b20" stroke-width="5"/>
  <!-- Anarchy 'A' Patch on Vest -->
  <circle cx="160" cy="420" r="22" fill="#dc2626" stroke="#fff" stroke-width="2"/>
  <text x="160" y="428" text-anchor="middle" font-family="'Impact', sans-serif" font-size="22" fill="#fff">A</text>
  <!-- Studs on Collar -->
  <circle cx="210" cy="375" r="4" fill="#cbd5e1"/>
  <circle cx="230" cy="370" r="4" fill="#cbd5e1"/>
  <circle cx="270" cy="370" r="4" fill="#cbd5e1"/>
  <circle cx="290" cy="375" r="4" fill="#cbd5e1"/>

  <!-- Head / Mask (Red Spidey with Chrome Mohawk Spikes) -->
  <ellipse cx="250" cy="235" rx="100" ry="125" fill="#dc2626" stroke="#1b1b20" stroke-width="5"/>
  <!-- Chrome Punk Mohawk Spikes atop mask -->
  <g fill="#e2e8f0" stroke="#1b1b20" stroke-width="3">
    <polygon points="250,110 240,60 260,60"/>
    <polygon points="230,120 215,75 235,80"/>
    <polygon points="270,120 285,75 265,80"/>
    <polygon points="212,138 190,100 210,105"/>
    <polygon points="288,138 310,100 290,105"/>
  </g>

  <!-- Comic Lenses with Punk Eyeliner -->
  <path d="M165 210 Q225 180 235 225 Q225 265 170 255 Z" fill="#ffffff" stroke="#1b1b20" stroke-width="8"/>
  <path d="M335 210 Q275 180 265 225 Q275 265 330 255 Z" fill="#ffffff" stroke="#1b1b20" stroke-width="8"/>

  <!-- Name Banner -->
  <rect x="50" y="445" width="400" height="42" fill="#1e3a8a" stroke="#facc15" stroke-width="3"/>
  <text x="250" y="473" text-anchor="middle" font-family="'Impact', sans-serif" font-size="20" fill="#ffffff" letter-spacing="2">SPIDER-PUNK (HOBIE) • EARTH-138</text>
</svg>
`);

/**
 * Pavitr Prabhakar (Earth-50101) - Spider-Man India, Silk Dhoti, Gold Gauntlets, Lotus Web
 */
export const CHAR_PAVITR_50101 = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
  <defs>
    <radialGradient id="pavGrad" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="50%" stop-color="#ea580c"/>
      <stop offset="100%" stop-color="#7c2d12"/>
    </radialGradient>
  </defs>
  <rect width="500" height="500" fill="url(#pavGrad)"/>

  <!-- Ornate Indian Mandala Patterns in Background -->
  <circle cx="250" cy="220" r="160" fill="none" stroke="#fde047" stroke-width="3" stroke-dasharray="8,6" opacity="0.4"/>
  <circle cx="250" cy="220" r="190" fill="none" stroke="#fde047" stroke-width="2" opacity="0.3"/>

  <!-- Shoulders & Torso: Classic Red Silk with Gold Ornaments & Blue Dhoti wrap -->
  <path d="M90 500 C100 390 180 350 250 350 C320 350 400 390 410 500 Z" fill="#dc2626" stroke="#1b1b20" stroke-width="5"/>
  <!-- Gold Ornate Gauntlet & Collar Necklace -->
  <path d="M190 355 Q250 390 310 355 L320 375 Q250 415 180 375 Z" fill="#facc15" stroke="#854d0e" stroke-width="3"/>

  <!-- Mask with Flowing Dark Curls at top -->
  <ellipse cx="250" cy="235" rx="100" ry="125" fill="#dc2626" stroke="#1b1b20" stroke-width="5"/>
  <!-- Hair Curls popping from top of mask -->
  <path d="M170 140 Q210 90 250 120 Q290 90 330 140 Q250 100 170 140 Z" fill="#1b1b20"/>

  <!-- Ornate Golden-Thread Webbing -->
  <g stroke="#fef08a" stroke-width="2.5" fill="none">
    <line x1="250" y1="130" x2="250" y2="355"/>
    <path d="M170 170 Q250 195 330 170"/>
    <path d="M165 290 Q250 265 335 290"/>
  </g>

  <!-- Lenses with Gold Linework -->
  <path d="M165 210 Q225 180 235 225 Q225 265 170 255 Z" fill="#ffffff" stroke="#facc15" stroke-width="7"/>
  <path d="M335 210 Q275 180 265 225 Q275 265 330 255 Z" fill="#ffffff" stroke="#facc15" stroke-width="7"/>

  <!-- Name Banner -->
  <rect x="50" y="445" width="400" height="42" fill="#ca8a04" stroke="#1b1b20" stroke-width="3"/>
  <text x="250" y="473" text-anchor="middle" font-family="'Impact', sans-serif" font-size="20" fill="#1b1b20" letter-spacing="2">PAVITR PRABHAKAR • EARTH-50101</text>
</svg>
`);

/**
 * Peni Parker & SP//dr (Earth-14512) - Anime Mecha Pilot & Glowing Optic Mecha
 */
export const CHAR_PENI_14512 = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
  <defs>
    <radialGradient id="peniGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="60%" stop-color="#1e1b4b"/>
      <stop offset="100%" stop-color="#020617"/>
    </radialGradient>
  </defs>
  <rect width="500" height="500" fill="url(#peniGrad)"/>

  <!-- SP//dr Giant Biomorphic Mecha Head in Background -->
  <g transform="translate(250, 190)">
    <!-- Round White Armored Sphere -->
    <circle cx="0" cy="0" r="170" fill="#f8fafc" stroke="#1b1b20" stroke-width="8"/>
    <!-- Red Accent Markings on Armor -->
    <path d="M-170 0 C-100 -120 100 -120 170 0 C120 -80 -120 -80 -170 0 Z" fill="#dc2626"/>
    <!-- Glowing Visor Face / Digital Spider Eyes -->
    <ellipse cx="-60" cy="-20" rx="35" ry="25" fill="#38bdf8" stroke="#0284c7" stroke-width="4"/>
    <ellipse cx="60" cy="-20" rx="35" ry="25" fill="#38bdf8" stroke="#0284c7" stroke-width="4"/>
    <circle cx="-60" cy="-20" r="12" fill="#ffffff"/>
    <circle cx="60" cy="-20" r="12" fill="#ffffff"/>
  </g>

  <!-- Peni Parker (Anime High School Pilot in Foreground) -->
  <g transform="translate(250, 340)">
    <!-- Anime Hair & Sailor Uniform -->
    <path d="M-60 160 C-60 90 60 90 60 160 Z" fill="#1e3a8a"/>
    <polygon points="-25,120 0,150 25,120" fill="#dc2626"/>
    <!-- Head -->
    <circle cx="0" cy="40" r="45" fill="#fed7aa" stroke="#1b1b20" stroke-width="3"/>
    <!-- Black Anime Hair Curls & Hairpins -->
    <path d="M-55 35 Q-20 -15 0 25 Q20 -15 55 35 Q30 -10 -55 35 Z" fill="#1e1b4b"/>
    <line x1="-30" y1="10" x2="-20" y2="10" stroke="#ef4444" stroke-width="4"/>
    <!-- Big Anime Eyes -->
    <ellipse cx="-16" cy="42" rx="9" ry="12" fill="#1e1b4b"/>
    <circle cx="-14" cy="38" r="4" fill="#ffffff"/>
    <ellipse cx="16" cy="42" rx="9" ry="12" fill="#1e1b4b"/>
    <circle cx="18" cy="38" r="4" fill="#ffffff"/>
  </g>

  <!-- Name Banner -->
  <rect x="50" y="445" width="400" height="42" fill="#dc2626" stroke="#fff" stroke-width="3"/>
  <text x="250" y="473" text-anchor="middle" font-family="'Impact', sans-serif" font-size="20" fill="#ffffff" letter-spacing="2">PENI PARKER &amp; SP//dr • EARTH-14512</text>
</svg>
`);

/* ==========================================================================
   3. ROGUE DOSSIERS (Villains: Green Goblin, Doctor Octopus, Venom)
   ========================================================================== */

/**
 * Green Goblin (Norman Osborn) - Bat Glider, Purple Cowl Hood, Flaming Pumpkin Bomb
 */
export const VILLAIN_GREEN_GOBLIN = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
  <defs>
    <radialGradient id="goblinGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#fde047"/>
      <stop offset="50%" stop-color="#ea580c"/>
      <stop offset="100%" stop-color="#14532d"/>
    </radialGradient>
  </defs>
  <rect width="500" height="500" fill="url(#goblinGlow)"/>

  <!-- Emerald Green Scaly Goblin Face with Cackling Grin -->
  <g transform="translate(250, 210)">
    <!-- Pointed Purple Hood -->
    <path d="M-110 30 Q0 -130 110 30 L90 120 L-90 120 Z" fill="#7e22ce" stroke="#1b1b20" stroke-width="6"/>
    <polygon points="0,-120 30,-180 -10,-130" fill="#7e22ce" stroke="#1b1b20" stroke-width="4"/>

    <!-- Green Goblin Head -->
    <ellipse cx="0" cy="40" rx="85" ry="95" fill="#16a34a" stroke="#1b1b20" stroke-width="5"/>
    <!-- Long Pointed Ears -->
    <polygon points="-80,20 -150,-10 -75,60" fill="#16a34a" stroke="#1b1b20" stroke-width="5"/>
    <polygon points="80,20 150,-10 75,60" fill="#16a34a" stroke="#1b1b20" stroke-width="5"/>

    <!-- Crazy Yellow Goblin Eyes with Red Pupils -->
    <ellipse cx="-35" cy="20" rx="22" ry="16" fill="#facc15" stroke="#1b1b20" stroke-width="4"/>
    <circle cx="-35" cy="20" r="7" fill="#dc2626"/>
    <ellipse cx="35" cy="20" rx="22" ry="16" fill="#facc15" stroke="#1b1b20" stroke-width="4"/>
    <circle cx="35" cy="20" r="7" fill="#dc2626"/>

    <!-- Psychopathic Cackling Mouth with Sharp Teeth -->
    <path d="M-55 70 Q0 120 55 70 Q0 85 -55 70 Z" fill="#450a0a" stroke="#1b1b20" stroke-width="4"/>
    <polygon points="-40,75 -35,88 -30,75" fill="#fff"/>
    <polygon points="-20,78 -15,92 -10,78" fill="#fff"/>
    <polygon points="0,80 5,95 10,80" fill="#fff"/>
    <polygon points="20,78 25,92 30,78" fill="#fff"/>
    <polygon points="35,75 40,88 45,75" fill="#fff"/>
  </g>

  <!-- Glowing Spiked Pumpkin Bomb in Foreground -->
  <g transform="translate(130, 370)">
    <circle cx="0" cy="0" r="50" fill="#ea580c" stroke="#1b1b20" stroke-width="5"/>
    <!-- Jack-O'-Lantern Face Glowing with White-Hot Flame -->
    <polygon points="-20,-10 -10,-10 -15,-25" fill="#facc15"/>
    <polygon points="20,-10 10,-10 15,-25" fill="#facc15"/>
    <path d="M-25 15 Q0 35 25 15 Q0 20 -25 15 Z" fill="#fde047"/>
    <!-- Fuse Flame -->
    <polygon points="0,-50 15,-75 -5,-65" fill="#facc15"/>
  </g>

  <!-- Name Banner -->
  <rect x="50" y="445" width="400" height="42" fill="#16a34a" stroke="#7e22ce" stroke-width="4"/>
  <text x="250" y="473" text-anchor="middle" font-family="'Impact', sans-serif" font-size="22" fill="#ffffff" letter-spacing="2">THE GREEN GOBLIN • NORMAN OSBORN</text>
</svg>
`);

/**
 * Doctor Octopus (Otto Octavius) - 4 Titanium Tentacles, Amber Goggles, Bowl Haircut
 */
export const VILLAIN_DOC_OCK = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
  <defs>
    <radialGradient id="ockGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#475569"/>
      <stop offset="60%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#052e16"/>
    </radialGradient>
  </defs>
  <rect width="500" height="500" fill="url(#ockGlow)"/>

  <!-- 4 Articulated Titanium Mechanical Tentacles Reaching in from Edges -->
  <g stroke="#94a3b8" stroke-width="24" stroke-linecap="round" fill="none">
    <path d="M0 80 Q140 100 160 220" stroke="#64748b"/>
    <path d="M500 80 Q360 100 340 220" stroke="#64748b"/>
    <path d="M0 420 Q120 380 170 320" stroke="#64748b"/>
    <path d="M500 420 Q380 380 330 320" stroke="#64748b"/>
  </g>
  <!-- Mechanical Claws on Tentacles -->
  <polygon points="40,80 10,60 15,100" fill="#ef4444" stroke="#1b1b20" stroke-width="3"/>
  <polygon points="460,80 490,60 485,100" fill="#ef4444" stroke="#1b1b20" stroke-width="3"/>

  <!-- Otto Octavius Figure (Green Trench Coat, Bowl Cut) -->
  <g transform="translate(250, 230)">
    <!-- Green Collared Coat -->
    <path d="M-90 270 L-60 130 L60 130 L90 270 Z" fill="#15803d" stroke="#1b1b20" stroke-width="5"/>
    <rect x="-20" y="140" width="40" height="60" fill="#f59e0b"/>

    <!-- Head -->
    <ellipse cx="0" cy="40" rx="75" ry="85" fill="#fcd34d" stroke="#1b1b20" stroke-width="5"/>
    <!-- Classic Bowl Haircut -->
    <path d="M-80 35 C-80 -40 80 -40 80 35 C60 0 -60 0 -80 35 Z" fill="#451a03" stroke="#1b1b20" stroke-width="5"/>

    <!-- Heavy Amber Round Goggles Connected by Bar -->
    <circle cx="-32" cy="35" r="26" fill="#f59e0b" stroke="#1b1b20" stroke-width="5"/>
    <circle cx="-32" cy="35" r="16" fill="#fef08a"/>
    <circle cx="32" cy="35" r="26" fill="#f59e0b" stroke="#1b1b20" stroke-width="5"/>
    <circle cx="32" cy="35" r="16" fill="#fef08a"/>
    <rect x="-10" y="30" width="20" height="10" fill="#1b1b20"/>

    <!-- Grimacing Mouth -->
    <line x1="-30" y1="90" x2="30" y2="90" stroke="#1b1b20" stroke-width="5"/>
  </g>

  <!-- Name Banner -->
  <rect x="50" y="445" width="400" height="42" fill="#15803d" stroke="#94a3b8" stroke-width="3"/>
  <text x="250" y="473" text-anchor="middle" font-family="'Impact', sans-serif" font-size="22" fill="#ffffff" letter-spacing="2">DOCTOR OCTOPUS • OTTO OCTAVIUS</text>
</svg>
`);

/**
 * Venom (Eddie Brock) - Massive White Chest Spider, Razor Teeth, Serpentine Tongue
 */
export const VILLAIN_VENOM = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
  <defs>
    <radialGradient id="venomGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#1e1b4b"/>
      <stop offset="50%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#020617"/>
    </radialGradient>
  </defs>
  <rect width="500" height="500" fill="url(#venomGlow)"/>

  <!-- Symbiote Tentacles Splashing from Sides -->
  <path d="M0 100 Q80 180 50 280" stroke="#1e1b4b" stroke-width="18" fill="none"/>
  <path d="M500 100 Q420 180 450 280" stroke="#1e1b4b" stroke-width="18" fill="none"/>

  <!-- Hulking Shoulders with Giant White Venom Spider Emblem -->
  <path d="M60 500 C70 340 180 300 250 300 C320 300 430 340 440 500 Z" fill="#09090b" stroke="#1b1b20" stroke-width="6"/>
  <!-- Giant White Spider Legs Spanning Shoulders -->
  <path d="M250 340 L120 380 M250 360 L100 440 M250 340 L380 380 M250 360 L400 440" stroke="#ffffff" stroke-width="12" stroke-linecap="round"/>

  <!-- Venom Monstrous Head -->
  <g transform="translate(250, 180)">
    <ellipse cx="0" cy="0" rx="115" ry="135" fill="#09090b" stroke="#1b1b20" stroke-width="6"/>

    <!-- Distorted Angular Symbiote Lenses -->
    <path d="M-95 -40 Q-30 -90 -10 -30 Q-40 20 -85 0 Z" fill="#ffffff" stroke="#1b1b20" stroke-width="6"/>
    <path d="M95 -40 Q30 -90 10 -30 Q40 20 85 0 Z" fill="#ffffff" stroke="#1b1b20" stroke-width="6"/>

    <!-- Gaping Tooth-Filled Maw -->
    <path d="M-80 40 Q0 150 80 40 Q0 60 -80 40 Z" fill="#450a0a" stroke="#1b1b20" stroke-width="5"/>
    <!-- Razor Needle Teeth -->
    <polygon points="-70,45 -65,65 -60,48" fill="#fff"/>
    <polygon points="-55,50 -50,75 -45,52" fill="#fff"/>
    <polygon points="-40,55 -35,80 -30,58" fill="#fff"/>
    <polygon points="-25,60 -20,85 -15,62" fill="#fff"/>
    <polygon points="-10,65 -5,90 0,65" fill="#fff"/>
    <polygon points="10,65 5,90 0,65" fill="#fff"/>
    <polygon points="25,60 20,85 15,62" fill="#fff"/>
    <polygon points="40,55 35,80 30,58" fill="#fff"/>
    <polygon points="55,50 50,75 45,52" fill="#fff"/>
    <polygon points="70,45 65,65 60,48" fill="#fff"/>

    <!-- Slithering Green-Acid Venom Tongue -->
    <path d="M0 65 Q40 110 -20 150 Q10 180 30 210" stroke="#ec4899" stroke-width="16" fill="none" stroke-linecap="round"/>
    <path d="M0 65 Q40 110 -20 150 Q10 180 30 210" stroke="#84cc16" stroke-width="6" fill="none" stroke-linecap="round"/>
  </g>

  <!-- Name Banner -->
  <rect x="50" y="445" width="400" height="42" fill="#09090b" stroke="#ffffff" stroke-width="3"/>
  <text x="250" y="473" text-anchor="middle" font-family="'Impact', sans-serif" font-size="22" fill="#ffffff" letter-spacing="2">VENOM • EDDIE BROCK</text>
</svg>
`);

/* ==========================================================================
   4. QUOTE CHARACTERS (Uncle Ben, Mary Jane, J. Jonah Jameson)
   ========================================================================== */

/**
 * Uncle Ben (Benjamin Parker) - Kind Elderly Man with Warm Smile & Wisdom
 */
export const CHAR_UNCLE_BEN = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
  <defs>
    <radialGradient id="benGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#fef3c7"/>
      <stop offset="60%" stop-color="#fde68a"/>
      <stop offset="100%" stop-color="#d97706"/>
    </radialGradient>
  </defs>
  <rect width="500" height="500" fill="url(#benGrad)"/>

  <!-- Warm Wooden Porch / Living Room Backdrop -->
  <line x1="80" y1="0" x2="80" y2="500" stroke="#b45309" stroke-width="2" opacity="0.3"/>
  <line x1="420" y1="0" x2="420" y2="500" stroke="#b45309" stroke-width="2" opacity="0.3"/>

  <!-- Brown Cardigan & Blue Collared Shirt -->
  <path d="M100 500 C110 380 180 340 250 340 C320 340 390 380 400 500 Z" fill="#78350f" stroke="#1b1b20" stroke-width="5"/>
  <polygon points="250,340 220,420 280,420" fill="#3b82f6" stroke="#1b1b20" stroke-width="3"/>

  <!-- Kind Elderly Head -->
  <g transform="translate(250, 220)">
    <ellipse cx="0" cy="10" rx="85" ry="105" fill="#fcd34d" stroke="#1b1b20" stroke-width="4"/>

    <!-- Distinguished White Hair with Receding Temples -->
    <path d="M-85 10 C-85 -80 85 -80 85 10 C65 -30 -65 -30 -85 10 Z" fill="#f1f5f9" stroke="#1b1b20" stroke-width="4"/>

    <!-- Wire-Rimmed Reading Glasses -->
    <circle cx="-35" cy="0" r="24" fill="#ffffff" fill-opacity="0.5" stroke="#78350f" stroke-width="4"/>
    <circle cx="35" cy="0" r="24" fill="#ffffff" fill-opacity="0.5" stroke="#78350f" stroke-width="4"/>
    <line x1="-11" y1="0" x2="11" y2="0" stroke="#78350f" stroke-width="4"/>

    <!-- Warm Smiling Eyes behind glasses -->
    <circle cx="-35" cy="0" r="5" fill="#1b1b20"/>
    <circle cx="35" cy="0" r="5" fill="#1b1b20"/>
    <path d="M-55 -15 Q-35 -25 -15 -15" stroke="#94a3b8" stroke-width="3" fill="none"/>
    <path d="M15 -15 Q35 -25 55 -15" stroke="#94a3b8" stroke-width="3" fill="none"/>

    <!-- Gentle Smiling Mouth -->
    <path d="M-25 60 Q0 80 25 60" stroke="#1b1b20" stroke-width="4" fill="none"/>
  </g>

  <!-- Name Banner -->
  <rect x="50" y="445" width="400" height="42" fill="#78350f" stroke="#facc15" stroke-width="3"/>
  <text x="250" y="473" text-anchor="middle" font-family="'Impact', sans-serif" font-size="20" fill="#ffffff" letter-spacing="2">UNCLE BEN • BENJAMIN PARKER</text>
</svg>
`);

/**
 * Mary Jane Watson - Vibrant Flowing Red Hair, Doorway Jackpot Smile
 */
export const CHAR_MARY_JANE = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
  <defs>
    <radialGradient id="mjGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#fbcfe8"/>
      <stop offset="60%" stop-color="#f472b6"/>
      <stop offset="100%" stop-color="#be185d"/>
    </radialGradient>
  </defs>
  <rect width="500" height="500" fill="url(#mjGrad)"/>

  <!-- Doorframe of Peter's Aunt May's House (ASM #42) -->
  <rect x="50" y="40" width="400" height="420" fill="none" stroke="#1b1b20" stroke-width="8"/>

  <!-- Vibrant Flowing Red Hair Framing Face -->
  <path d="M120 140 C80 280 140 440 180 500 L320 500 C360 440 420 280 380 140 C340 40 160 40 120 140 Z" fill="#b91c1c" stroke="#1b1b20" stroke-width="5"/>
  <path d="M150 160 C120 260 160 380 200 460" stroke="#ef4444" stroke-width="8" stroke-linecap="round" fill="none"/>
  <path d="M350 160 C380 260 340 380 300 460" stroke="#ef4444" stroke-width="8" stroke-linecap="round" fill="none"/>

  <!-- Face & Radiant Playful Smile -->
  <g transform="translate(250, 220)">
    <ellipse cx="0" cy="10" rx="70" ry="90" fill="#fed7aa" stroke="#1b1b20" stroke-width="4"/>

    <!-- Green Eyes with Long Eyelashes -->
    <ellipse cx="-28" cy="0" rx="14" ry="10" fill="#15803d"/>
    <circle cx="-25" cy="-2" r="4" fill="#ffffff"/>
    <ellipse cx="28" cy="0" rx="14" ry="10" fill="#15803d"/>
    <circle cx="31" cy="-2" r="4" fill="#ffffff"/>
    <path d="M-45 -10 Q-28 -20 -10 -10" stroke="#1b1b20" stroke-width="3" fill="none"/>
    <path d="M10 -10 Q28 -20 45 -10" stroke="#1b1b20" stroke-width="3" fill="none"/>

    <!-- Bright Crimson Lipstick Smile -->
    <path d="M-28 45 Q0 75 28 45 Q0 55 -28 45 Z" fill="#dc2626" stroke="#1b1b20" stroke-width="3"/>
  </g>

  <!-- Name Banner -->
  <rect x="50" y="445" width="400" height="42" fill="#be185d" stroke="#facc15" stroke-width="3"/>
  <text x="250" y="473" text-anchor="middle" font-family="'Impact', sans-serif" font-size="20" fill="#ffffff" letter-spacing="2">MARY JANE WATSON • JACKPOT</text>
</svg>
`);

/**
 * J. Jonah Jameson - Daily Bugle Flat-Top Hair, Pencil Mustache, Cigar, Shouting
 */
export const CHAR_JJ_JAMESON = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
  <defs>
    <radialGradient id="jjjGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#fed7aa"/>
      <stop offset="60%" stop-color="#ea580c"/>
      <stop offset="100%" stop-color="#450a0a"/>
    </radialGradient>
  </defs>
  <rect width="500" height="500" fill="url(#jjjGrad)"/>

  <!-- Daily Bugle Headline Newspaper in Background -->
  <rect x="40" y="40" width="420" height="100" fill="#f8fafc" stroke="#1b1b20" stroke-width="4"/>
  <text x="250" y="75" text-anchor="middle" font-family="'Impact', sans-serif" font-size="28" fill="#1b1b20">THE DAILY BUGLE</text>
  <text x="250" y="115" text-anchor="middle" font-family="'Impact', sans-serif" font-size="22" fill="#dc2626">SPIDER-MAN: THREAT OR MENACE?!</text>

  <!-- Rolled-Up Sleeves White Shirt & Black Tie -->
  <path d="M100 500 C110 380 180 340 250 340 C320 340 390 380 400 500 Z" fill="#ffffff" stroke="#1b1b20" stroke-width="5"/>
  <polygon points="250,340 240,480 260,480" fill="#1b1b20"/>

  <!-- Furious Shouting Head -->
  <g transform="translate(250, 240)">
    <ellipse cx="0" cy="10" rx="80" ry="100" fill="#fed7aa" stroke="#1b1b20" stroke-width="4"/>

    <!-- Flat-Top Gray-Templed Haircut -->
    <path d="M-80 -10 L-70 -70 L70 -70 L80 -10 Z" fill="#18181b" stroke="#1b1b20" stroke-width="4"/>
    <polygon points="-75,-10 -65,-50 -60,-10" fill="#cbd5e1"/>
    <polygon points="75,-10 65,-50 60,-10" fill="#cbd5e1"/>

    <!-- Angry Eyebrows & Glaring Eyes -->
    <line x1="-45" y1="-10" x2="-10" y2="5" stroke="#1b1b20" stroke-width="5"/>
    <line x1="45" y1="-10" x2="10" y2="5" stroke="#1b1b20" stroke-width="5"/>
    <circle cx="-25" cy="8" r="5" fill="#1b1b20"/>
    <circle cx="25" cy="8" r="5" fill="#1b1b20"/>

    <!-- Iconic Toothbrush Pencil Mustache -->
    <rect x="-16" y="32" width="32" height="12" fill="#1b1b20"/>

    <!-- Shouting Open Mouth with Cigar Clenched in Corner -->
    <path d="M-30 52 Q0 85 30 52 Z" fill="#450a0a" stroke="#1b1b20" stroke-width="4"/>
    <!-- Cigar Clenched in Jaw with Smoke -->
    <rect x="22" y="42" width="45" height="12" rx="2" fill="#78350f" stroke="#1b1b20" stroke-width="2" transform="rotate(-15, 22, 42)"/>
    <circle cx="68" cy="30" r="4" fill="#ea580c"/>
    <path d="M72 26 Q85 15 80 0" stroke="#cbd5e1" stroke-width="3" stroke-linecap="round" fill="none"/>
  </g>

  <!-- Name Banner -->
  <rect x="50" y="445" width="400" height="42" fill="#1b1b20" stroke="#dc2626" stroke-width="3"/>
  <text x="250" y="473" text-anchor="middle" font-family="'Impact', sans-serif" font-size="20" fill="#ffffff" letter-spacing="2">J. JONAH JAMESON • DAILY BUGLE</text>
</svg>
`);
