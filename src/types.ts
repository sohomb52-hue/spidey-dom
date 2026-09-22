export type WebPageId =
  | 'cover'
  | 'arcade'
  | 'web_thrower'
  | 'spider_id'
  | 'trivia'
  | 'canon'
  | 'vault'
  | 'profile';

export type GameMode =
  | 'cover'
  | 'tf'
  | 'mcq'
  | 'clues'
  | 'who_said_it'
  | 'speed'
  | 'canon'
  | 'badges'
  | 'profile'
  | 'web_thrower'
  | 'spider_id';

export interface SpiderCharacter {
  id: string;
  alias: string;
  realName: string;
  earth: string;
  earthTag: string;
  image: string;
  suitDescription: string;
  signaturePower: string;
  firstAppearance: string;
  quote: string;
  clues: [string, string, string];
  options: string[];
  loreSnippet: string;
}

export interface ArcadeGame {
  id: string;
  number: string;
  title: string;
  tagline: string;
  category: string;
  icon: string;
  coverImage: string;
  page: WebPageId;
  triviaSubMode?: GameMode;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'EXTREME';
  features: string[];
}

export interface TFQuestion {
  id: number;
  statement: string;
  isTrue: boolean;
  issueRef: string;
  difficulty: 'Novice Webslinger' | 'Wall-Crawler' | 'Multiverse Veteran';
  storyTitle: string;
  storyBody: string;
  spideyHint: string;
}

export interface MCQQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  archiveRef: string;
  storyTitle: string;
  storyBody: string;
  spideyHint: string;
}

export interface RogueDossier {
  id: string;
  alias: string;
  realName: string;
  image: string;
  clues: [string, string, string];
  options: { id: string; name: string }[];
  storyTitle: string;
  storyBody: string;
  spideyHint: string;
}

export interface WhoSaidItQuestion {
  id: number;
  quote: string;
  character: string;
  characterImage: string;
  options: string[];
  correctIndex: number;
  comicContext: string;
  issueRef: string;
}

export interface SpeedQuestion {
  id: number;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanationTitle: string;
  explanationBody: string;
}

export interface CanonEntry {
  id: string;
  universe: '616' | '1610' | '65' | '928' | '199999';
  universeLabel: string;
  year: string;
  title: string;
  description: string;
  keyIssue: string;
  imageUrl: string;
  iconType: 'book' | 'bolt' | 'music' | 'shield' | 'spider';
}

export interface BadgeItem {
  id: string;
  name: string;
  description: string;
  emoji: string;
  unlocked: boolean;
  colorBg: string;
}

