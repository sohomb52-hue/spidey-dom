/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface WebSwingLevelConfig {
  id: number;
  name: string;
  subtitle: string;
  location: string;
  targetDistance: number;
  timeLimitSeconds?: number;
  tokenTarget: number;
  targetScore: number;
  baseSpeed: number;
  maxSpeed: number;
  gravity: number;
  gapMin: number;
  gapMax: number;
  buildingHeightMin: number;
  buildingHeightMax: number;
  obstacleFrequency: number;
  allowedObstacles: ('drone' | 'pumpkin_bomb' | 'electric_tower' | 'falling_debris')[];
  theme: 'day' | 'sunset' | 'night' | 'cyberpunk' | 'multiverse';
  skyColors: [string, string, string];
  buildingColors: string[];
  ambientColor: string;
  xpReward: number;
  description: string;
  unlockedByDefault?: boolean;
}

export interface SpiderSenseLevelConfig {
  id: number;
  name: string;
  subtitle: string;
  location: string;
  threatCount: number;
  baseReactionWindow: number; // in seconds
  spawnIntervalMin: number;
  spawnIntervalMax: number;
  allowedThreatTypes: ('car' | 'debris' | 'projectile' | 'enemy' | 'electric' | 'web_trap' | 'laser')[];
  multiThreatChance: number; // 0 to 1
  targetScore: number;
  perfectDodgeTarget: number;
  xpReward: number;
  bossWave?: {
    name: string;
    boss: 'Green Goblin' | 'Doc Ock' | 'Venom' | 'Electro';
    threats: number;
  };
  description: string;
  unlockedByDefault?: boolean;
}

export interface DailyChallengeMission {
  dateKey: string;
  title: string;
  gameId: 'web_swing' | 'spider_sense_reaction';
  objective: string;
  condition: string;
  targetValue: number;
  targetUnit: string;
  xpReward: number;
  scoreBonus: number;
  modifierText: string;
  badgeName: string;
}

export interface WebThrowerLevelConfig {
  id: number;
  name: string;
  subtitle: string;
  location: string;
  targetCount: number;
  timeLimitSeconds: number;
  targetScore: number;
  accuracyTarget: number; // percentage e.g. 75
  speedMultiplier: number;
  allowedTargetTypes: ('goblin' | 'vulture' | 'docock' | 'mysterio' | 'drone' | 'bonus' | 'pumpkin_bomb')[];
  theme: 'day' | 'sunset' | 'night' | 'cyberpunk' | 'multiverse';
  skyColors: [string, string, string];
  xpReward: number;
  description: string;
  unlockedByDefault?: boolean;
}

export const WEB_THROWER_LEVELS: WebThrowerLevelConfig[] = [
  {
    id: 1,
    name: 'TARGET PRACTICE',
    subtitle: 'QUEENS ROOFTOPS',
    location: 'Queens Rooftops & Water Tanks',
    targetCount: 15,
    timeLimitSeconds: 45,
    targetScore: 3500,
    accuracyTarget: 70,
    speedMultiplier: 1.0,
    allowedTargetTypes: ['vulture', 'drone', 'bonus'],
    theme: 'day',
    skyColors: ['#0369a1', '#0284c7', '#38bdf8'],
    xpReward: 150,
    description: 'Calibrate your web-thrower muzzle velocity and lead aiming across training drones and gliding targets.',
    unlockedByDefault: true,
  },
  {
    id: 2,
    name: 'ROOFTOP FLIGHT',
    subtitle: 'MIDTOWN SKYLINE',
    location: 'Flatiron & Midtown Crossings',
    targetCount: 22,
    timeLimitSeconds: 45,
    targetScore: 6500,
    accuracyTarget: 75,
    speedMultiplier: 1.3,
    allowedTargetTypes: ['vulture', 'drone', 'mysterio', 'bonus'],
    theme: 'sunset',
    skyColors: ['#1e1b4b', '#b91c1c', '#f59e0b'],
    xpReward: 250,
    description: 'Fast-moving Vulture flight arcs and evasive drones flying between high-rise glass towers.',
  },
  {
    id: 3,
    name: 'GLIDER CHASE',
    subtitle: 'FINANCIAL DISTRICT',
    location: 'Wall Street Canyon',
    targetCount: 28,
    timeLimitSeconds: 50,
    targetScore: 10000,
    accuracyTarget: 80,
    speedMultiplier: 1.6,
    allowedTargetTypes: ['goblin', 'pumpkin_bomb', 'drone', 'bonus'],
    theme: 'night',
    skyColors: ['#090a10', '#17142b', '#2e1065'],
    xpReward: 400,
    description: 'Green Goblin sweeps across the sky throwing interceptable pumpkin bombs that score massive combo points.',
  },
  {
    id: 4,
    name: 'TENTACLE SIEGE',
    subtitle: 'OSCORP TOWER',
    location: 'Oscorp Laboratories Spire',
    targetCount: 34,
    timeLimitSeconds: 50,
    targetScore: 15000,
    accuracyTarget: 82,
    speedMultiplier: 1.9,
    allowedTargetTypes: ['docock', 'drone', 'pumpkin_bomb', 'bonus'],
    theme: 'cyberpunk',
    skyColors: ['#180b2a', '#701a75', '#06b6d4'],
    xpReward: 600,
    description: 'Doc Ock tentacle targets strike with rapid lunges requiring quick parabolic web snaps.',
  },
  {
    id: 5,
    name: 'MYSTERIO ILLUSION',
    subtitle: 'TIMES SQUARE',
    location: 'Broadway Holographic Grid',
    targetCount: 40,
    timeLimitSeconds: 55,
    targetScore: 21000,
    accuracyTarget: 85,
    speedMultiplier: 2.2,
    allowedTargetTypes: ['mysterio', 'goblin', 'vulture', 'bonus'],
    theme: 'multiverse',
    skyColors: ['#050814', '#1e1b4b', '#06b6d4'],
    xpReward: 900,
    description: 'Holographic illusion decoys test your ability to spot authentic targets with Spider-Sense lock-on.',
  },
  {
    id: 6,
    name: 'SINISTER SIX GAUNTLET',
    subtitle: 'DAILY BUGLE SUMMIT',
    location: 'Daily Bugle Globe Rooftop',
    targetCount: 50,
    timeLimitSeconds: 60,
    targetScore: 30000,
    accuracyTarget: 88,
    speedMultiplier: 2.6,
    allowedTargetTypes: ['goblin', 'vulture', 'docock', 'mysterio', 'drone', 'pumpkin_bomb', 'bonus'],
    theme: 'night',
    skyColors: ['#180b2a', '#991b1b', '#facc15'],
    xpReward: 1500,
    description: 'The ultimate sniper trial. Multi-wave boss barrage with relentless aerial threats and high-value golden coins.',
  },
];

export const WEB_SWING_LEVELS: WebSwingLevelConfig[] = [
  {
    id: 1,
    name: 'FIRST SWING',
    subtitle: 'QUEENS ROOFTOPS',
    location: 'Forest Hills, Queens',
    targetDistance: 400,
    tokenTarget: 8,
    targetScore: 2500,
    baseSpeed: 5.0,
    maxSpeed: 8.5,
    gravity: 0.38,
    gapMin: 60,
    gapMax: 130,
    buildingHeightMin: 180,
    buildingHeightMax: 260,
    obstacleFrequency: 0.08,
    allowedObstacles: ['drone'],
    theme: 'sunset',
    skyColors: ['#1e1b4b', '#b91c1c', '#f59e0b'],
    buildingColors: ['#1e1b2e', '#2a2238', '#181424'],
    ambientColor: '#f97316',
    xpReward: 150,
    description: 'Learn the fundamentals of pendulum momentum, web release apex, and token collection across wide Queens rooftops.',
    unlockedByDefault: true,
  },
  {
    id: 2,
    name: 'CITY RUN',
    subtitle: 'MIDTOWN MANHATTAN',
    location: '5th Avenue & Flatiron District',
    targetDistance: 750,
    tokenTarget: 15,
    targetScore: 5000,
    baseSpeed: 6.2,
    maxSpeed: 10.0,
    gravity: 0.42,
    gapMin: 80,
    gapMax: 170,
    buildingHeightMin: 220,
    buildingHeightMax: 320,
    obstacleFrequency: 0.2,
    allowedObstacles: ['drone', 'falling_debris'],
    theme: 'day',
    skyColors: ['#0369a1', '#0284c7', '#38bdf8'],
    buildingColors: ['#1e293b', '#334155', '#0f172a'],
    ambientColor: '#38bdf8',
    xpReward: 250,
    description: 'Taller skyscrapers and wider alley gaps. Watch out for construction cranes and falling bricks!',
  },
  {
    id: 3,
    name: 'ROOFTOP RUSH',
    subtitle: 'FINANCIAL DISTRICT',
    location: 'Wall Street & Spire Spires',
    targetDistance: 1100,
    timeLimitSeconds: 70,
    tokenTarget: 22,
    targetScore: 8500,
    baseSpeed: 7.0,
    maxSpeed: 11.5,
    gravity: 0.44,
    gapMin: 100,
    gapMax: 210,
    buildingHeightMin: 260,
    buildingHeightMax: 380,
    obstacleFrequency: 0.32,
    allowedObstacles: ['drone', 'pumpkin_bomb'],
    theme: 'night',
    skyColors: ['#090a10', '#17142b', '#2e1065'],
    buildingColors: ['#0f1016', '#1a1926', '#11121d'],
    ambientColor: '#a855f7',
    xpReward: 400,
    description: 'Narrow skyscraper spires with Green Goblin pumpkin bomb gliders darting across the sky.',
  },
  {
    id: 4,
    name: 'TRAFFIC CHAOS',
    subtitle: 'TIMES SQUARE',
    location: 'Broadway & 42nd Street',
    targetDistance: 1500,
    tokenTarget: 30,
    targetScore: 12000,
    baseSpeed: 7.8,
    maxSpeed: 12.8,
    gravity: 0.46,
    gapMin: 110,
    gapMax: 230,
    buildingHeightMin: 200,
    buildingHeightMax: 340,
    obstacleFrequency: 0.42,
    allowedObstacles: ['drone', 'pumpkin_bomb', 'electric_tower', 'falling_debris'],
    theme: 'cyberpunk',
    skyColors: ['#180b2a', '#701a75', '#06b6d4'],
    buildingColors: ['#160c24', '#28113f', '#0c0615'],
    ambientColor: '#f43f5e',
    xpReward: 600,
    description: 'Neon billboards, buzzing high-voltage transformers, and heavy flying traffic require razor-sharp swing timing.',
  },
  {
    id: 5,
    name: 'SPIDER-SENSE SURGE',
    subtitle: 'BROOKLYN BRIDGE & OSCORP',
    location: 'East River Suspension Cables',
    targetDistance: 2000,
    tokenTarget: 40,
    targetScore: 18000,
    baseSpeed: 8.5,
    maxSpeed: 14.0,
    gravity: 0.48,
    gapMin: 130,
    gapMax: 260,
    buildingHeightMin: 280,
    buildingHeightMax: 420,
    obstacleFrequency: 0.55,
    allowedObstacles: ['drone', 'pumpkin_bomb', 'electric_tower', 'falling_debris'],
    theme: 'sunset',
    skyColors: ['#31103f', '#991b1b', '#facc15'],
    buildingColors: ['#200d2b', '#2b1219', '#14081c'],
    ambientColor: '#eab308',
    xpReward: 900,
    description: 'High-velocity test of your Spider-Sense Slow-Mo gauge. Build maximum combos to overcome relentless drone swarms.',
  },
  {
    id: 6,
    name: 'MULTIVERSE RUN',
    subtitle: 'DIMENSIONAL GLITCHWAY',
    location: 'Earth-616 to Nueva York 2099',
    targetDistance: 2600,
    tokenTarget: 50,
    targetScore: 25000,
    baseSpeed: 9.2,
    maxSpeed: 15.5,
    gravity: 0.5,
    gapMin: 140,
    gapMax: 290,
    buildingHeightMin: 240,
    buildingHeightMax: 440,
    obstacleFrequency: 0.7,
    allowedObstacles: ['drone', 'pumpkin_bomb', 'electric_tower', 'falling_debris'],
    theme: 'multiverse',
    skyColors: ['#050814', '#1e1b4b', '#06b6d4'],
    buildingColors: ['#090d1f', '#19153a', '#060a17'],
    ambientColor: '#06b6d4',
    xpReward: 1500,
    description: 'The ultimate spider-master challenge. Dynamic glitch portals alter gravity and speed as you swing between dimensions.',
  },
];

// 6 Handcrafted Spider-Sense Reflex Levels
export const SPIDER_SENSE_LEVELS: SpiderSenseLevelConfig[] = [
  {
    id: 1,
    name: 'TINGLING',
    subtitle: 'BASIC REFLEX TRAINING',
    location: 'Peter Parker\'s Queens Back-Alley',
    threatCount: 10,
    baseReactionWindow: 1.25,
    spawnIntervalMin: 1800,
    spawnIntervalMax: 2400,
    allowedThreatTypes: ['car', 'debris'],
    multiThreatChance: 0.0,
    targetScore: 2000,
    perfectDodgeTarget: 4,
    xpReward: 150,
    description: 'Calibrate your Spider-Sense with single-direction incoming hazards.',
    unlockedByDefault: true,
  },
  {
    id: 2,
    name: 'DANGER CLOSE',
    subtitle: 'FOUR-WAY RADAR',
    location: 'Midtown Intersection Crosswalk',
    threatCount: 16,
    baseReactionWindow: 0.95,
    spawnIntervalMin: 1400,
    spawnIntervalMax: 1900,
    allowedThreatTypes: ['car', 'debris', 'projectile', 'electric'],
    multiThreatChance: 0.15,
    targetScore: 4500,
    perfectDodgeTarget: 8,
    xpReward: 250,
    description: 'Hazards arrive from Left, Right, Above, and Below with faster approach vectors.',
  },
  {
    id: 3,
    name: 'AMBUSH',
    subtitle: 'PUMPKIN BOMB VOLLEY',
    location: 'Oscorp Chemical Laboratory Roof',
    threatCount: 22,
    baseReactionWindow: 0.8,
    spawnIntervalMin: 1100,
    spawnIntervalMax: 1600,
    allowedThreatTypes: ['projectile', 'enemy', 'web_trap', 'laser'],
    multiThreatChance: 0.28,
    targetScore: 7500,
    perfectDodgeTarget: 12,
    xpReward: 400,
    description: 'Green Goblin gliders throw sudden curveballs and mid-air web-traps requiring quick counters.',
  },
  {
    id: 4,
    name: 'OVERLOAD',
    subtitle: 'SIMULTANEOUS STRIKES',
    location: 'Daily Bugle Printing Press',
    threatCount: 28,
    baseReactionWindow: 0.68,
    spawnIntervalMin: 900,
    spawnIntervalMax: 1300,
    allowedThreatTypes: ['car', 'debris', 'projectile', 'enemy', 'electric', 'web_trap'],
    multiThreatChance: 0.45,
    targetScore: 11000,
    perfectDodgeTarget: 16,
    xpReward: 600,
    description: 'Multiple simultaneous threats test your ability to chain dodges into massive score multipliers.',
  },
  {
    id: 5,
    name: 'PRECISION',
    subtitle: 'SUB-SECOND SURVIVAL',
    location: 'Times Square High-Voltage Grid',
    threatCount: 34,
    baseReactionWindow: 0.54,
    spawnIntervalMin: 750,
    spawnIntervalMax: 1100,
    allowedThreatTypes: ['projectile', 'enemy', 'electric', 'laser', 'web_trap'],
    multiThreatChance: 0.6,
    targetScore: 16000,
    perfectDodgeTarget: 22,
    xpReward: 900,
    description: 'Lightning-fast electric arcs and laser sweeps with reaction windows under half a second.',
  },
  {
    id: 6,
    name: 'SPIDER-SENSE MASTER',
    subtitle: 'SINISTER SIX CLIMAX',
    location: 'Rooftop Summit Climax',
    threatCount: 42,
    baseReactionWindow: 0.42,
    spawnIntervalMin: 600,
    spawnIntervalMax: 950,
    allowedThreatTypes: ['car', 'debris', 'projectile', 'enemy', 'electric', 'web_trap', 'laser'],
    multiThreatChance: 0.75,
    targetScore: 24000,
    perfectDodgeTarget: 30,
    bossWave: {
      name: 'Sinister Syndicate Wave',
      boss: 'Green Goblin',
      threats: 12,
    },
    xpReward: 1500,
    description: 'The pinnacle of reflex mastery. Relentless multi-directional boss barrages that require active Spider-Sense slow-mo timing.',
  },
];

export type ArcadeDifficulty = 'EASY' | 'NORMAL' | 'HARD' | 'SPIDER_SENSE';

export const DIFFICULTY_MULTIPLIERS: Record<ArcadeDifficulty, { windowScale: number; speedScale: number; scoreMult: number; label: string }> = {
  EASY: { windowScale: 1.25, speedScale: 0.85, scoreMult: 1.0, label: 'EASY (1.0x)' },
  NORMAL: { windowScale: 1.0, speedScale: 1.0, scoreMult: 1.5, label: 'NORMAL (1.5x)' },
  HARD: { windowScale: 0.8, speedScale: 1.25, scoreMult: 2.2, label: 'HARD (2.2x)' },
  SPIDER_SENSE: { windowScale: 0.65, speedScale: 1.5, scoreMult: 3.5, label: 'SPIDER-SENSE (3.5x)' },
};

// Deterministic Daily Challenge Generator (Seed based on YYYY-MM-DD)
export function getDailyChallenge(date = new Date()): DailyChallengeMission {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const dateKey = `${yyyy}-${mm}-${dd}`;

  // Simple deterministic integer hash
  let hash = 0;
  for (let i = 0; i < dateKey.length; i++) {
    hash = (hash << 5) - hash + dateKey.charCodeAt(i);
    hash |= 0;
  }
  const seed = Math.abs(hash);

  const challenges: Omit<DailyChallengeMission, 'dateKey'>[] = [
    {
      title: 'SKYLINE MARATHON',
      gameId: 'web_swing',
      objective: 'Swing through New York rooftops and reach the distant Brooklyn horizon.',
      condition: 'Reach distance in a single run',
      targetValue: 1200,
      targetUnit: 'meters',
      xpReward: 500,
      scoreBonus: 3500,
      modifierText: 'Token spawn rate increased by +35%',
      badgeName: 'DAILY WEBHEAD',
    },
    {
      title: 'LIGHTNING REFLEX TEST',
      gameId: 'spider_sense_reaction',
      objective: 'Dodge incoming glider attacks with sub-second precision without taking critical damage.',
      condition: 'Execute perfect dodges in one session',
      targetValue: 12,
      targetUnit: 'perfect dodges',
      xpReward: 500,
      scoreBonus: 4000,
      modifierText: 'Spider-Sense energy builds +50% faster',
      badgeName: 'RADAR SPECIALIST',
    },
    {
      title: 'TOKEN HOARDER',
      gameId: 'web_swing',
      objective: 'Collect floating golden Spider Tokens while maintaining high pendulum speed.',
      condition: 'Collect tokens in a single run',
      targetValue: 25,
      targetUnit: 'Spider Tokens',
      xpReward: 600,
      scoreBonus: 4500,
      modifierText: 'Token pickup radius expanded',
      badgeName: 'GOLDEN SPINNER',
    },
    {
      title: 'MAXIMUM COMBO MASTER',
      gameId: 'spider_sense_reaction',
      objective: 'Maintain a continuous chain of successful dodges without a single miss.',
      condition: 'Reach maximum combo streak',
      targetValue: 15,
      targetUnit: 'x Combo Streak',
      xpReward: 700,
      scoreBonus: 5000,
      modifierText: 'Combo multipliers grant double bonus points',
      badgeName: 'COMBO CRUSHER',
    },
    {
      title: 'NIGHTMARE GAUNTLET',
      gameId: 'web_swing',
      objective: 'Survive in high-velocity rooftop airspace avoiding drones and electric towers.',
      condition: 'Reach distance in Spider-Sense tier',
      targetValue: 1600,
      targetUnit: 'meters',
      xpReward: 850,
      scoreBonus: 6000,
      modifierText: 'Extreme wind velocity physics active',
      badgeName: 'MULTIVERSE SURVIVOR',
    },
  ];

  const selected = challenges[seed % challenges.length];
  return {
    ...selected,
    dateKey,
  };
}
