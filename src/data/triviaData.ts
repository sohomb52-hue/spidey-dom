import { TFQuestion, MCQQuestion, RogueDossier, SpeedQuestion, CanonEntry, BadgeItem, WhoSaidItQuestion } from '../types';

export const tfQuestions: TFQuestion[] = [
  {
    id: 1,
    statement: "Spider-Man once temporarily grew SIX ARMS after concocting a biochemical formula to cure his powers!",
    isTrue: true,
    issueRef: "AMAZING SPIDER-MAN #100",
    difficulty: "Novice Webslinger",
    storyTitle: "THE SIX ARMS SAGA! (AMAZING SPIDER-MAN #100-102)",
    storyBody: "In 1971, Stan Lee wrote the milestone 100th issue. Peter concocted an untested chemical potion meant to eliminate his spider powers so he could live normally with Gwen Stacy. Instead, it accelerated his spider-DNA mutations—causing him to sprout four additional arms! He had to team up with Curt Connors (The Lizard) to fight Morbius the Living Vampire to reverse the formula!",
    spideyHint: "Think about my 100th anniversary issue! I wanted to quit the hero life, and let's just say biology fought back!"
  },
  {
    id: 2,
    statement: "Peter Parker's original spider bite gave him biological web-shooters from his wrists in the 1962 comics!",
    isTrue: false,
    issueRef: "AMAZING FANTASY #15",
    difficulty: "Novice Webslinger",
    storyTitle: "PETER BUILT THEM HIMSELF! (AMAZING FANTASY #15)",
    storyBody: "In original comic canon, Peter's genius-level intellect allowed him to invent twin mechanical web-shooters and his legendary pressurized web fluid from scratch in high school! Organic web-shooters were introduced in the 2002 Sam Raimi movie and only briefly visited in Marvel comics around 'The Other' storyline.",
    spideyHint: "I didn't just get superpowers, Webhead—I used Midtown High's chemistry lab to invent my favorite gadget!"
  },
  {
    id: 3,
    statement: "Miles Morales' original comic universe was Earth-1610 (The Ultimate Universe) before merging into Earth-616!",
    isTrue: true,
    issueRef: "ULTIMATE COMICS SPIDER-MAN #1",
    difficulty: "Novice Webslinger",
    storyTitle: "THE ULTIMATE SUCCESSION (EARTH-1610)",
    storyBody: "Created by Brian Michael Bendis and Sara Pichelli in 2011, Miles stepped up following the tragic death of Earth-1610's Peter Parker. During 2015's Secret Wars crossover, Miles gave a three-week-old cheeseburger to Molecule Man, who rewarded him by restoring Miles and his loved ones into the core Marvel 616 reality!",
    spideyHint: "Look out for the number 42 and the Ultimate Marvel imprint created in the early 2000s!"
  },
  {
    id: 4,
    statement: "The famous motto 'With great power comes great responsibility' was spoken directly to Peter by Uncle Ben in Amazing Fantasy #15!",
    isTrue: false,
    issueRef: "AMAZING FANTASY #15",
    difficulty: "Wall-Crawler",
    storyTitle: "THE NARRATOR'S MORAL PROVERB!",
    storyBody: "Believe it or not, Uncle Ben never says this phrase to Peter in his 1962 debut! In Amazing Fantasy #15, the timeless words appear purely as a concluding narrative caption box written by Stan Lee: '...and a lean, silent figure slowly fades in the gathering darkness, aware at last that in this world, with great power there must also come -- great responsibility!' Later comics and films retconned Ben uttering it aloud.",
    spideyHint: "Check the captions, Tiger! Uncle Ben only had a few panels before tragedy struck."
  },
  {
    id: 5,
    statement: "Spider-Ham (Peter Porker) was originally a spider who was bitten by an irradiated pig!",
    isTrue: true,
    issueRef: "MARVEL TAILS #1 (1983)",
    difficulty: "Wall-Crawler",
    storyTitle: "THE ORIGIN OF PETER PORKER (EARTH-8311)",
    storyBody: "Created by Tom DeFalco and Mark Armstrong, Peter was initially an ordinary anthropomorphic spider living in May Porker's basement. Aunt May was experimenting with an atomic hair dryer and, in a fit of radiation-induced delirium, bit Peter—transforming him into a pig with spider-powers!",
    spideyHint: "It's the exact reverse of my origin! Aunt May's atomic hair dryer had an appetite."
  },
  {
    id: 6,
    statement: "Otto Octavius (Doctor Octopus) successfully swapped consciousness with Peter Parker and served as the 'Superior Spider-Man'!",
    isTrue: true,
    issueRef: "AMAZING SPIDER-MAN #700",
    difficulty: "Multiverse Veteran",
    storyTitle: "THE SUPERIOR SPIDER-MAN SAGA (2013)",
    storyBody: "In Amazing Spider-Man #700, a dying Doc Ock swapped bodies with Peter using an Octo-bot. Peter perished in Otto's deteriorating body, but bestowed his memories upon Otto. Vowing to be a better hero than Peter ever was, Otto operated as the brutal, tech-heavy 'Superior Spider-Man' for over 30 issues until relinquishing control back to Peter!",
    spideyHint: "Doc Ock proved he had the brains, but did he have the spider-heart to keep Peter down forever?"
  },
  {
    id: 7,
    statement: "Spider-Man was an original founding member of the Avengers in 1963 alongside Thor and Iron Man!",
    isTrue: false,
    issueRef: "AVENGERS #1 (1963)",
    difficulty: "Novice Webslinger",
    storyTitle: "SOLO WALL-CRAWLER FOR DECADES!",
    storyBody: "Spider-Man was famously rejected or kept as a reserve member for decades. The original founding Avengers were Iron Man, Thor, Hulk, Ant-Man, and Wasp. Spidey did not officially join a core ongoing Avengers roster until Brian Michael Bendis launched 'New Avengers' in 2005!",
    spideyHint: "Peter's always been Queens' friendly neighborhood loner—rent was too high for Stark Tower membership fees!"
  }
];

export const mcqQuestions: MCQQuestion[] = [
  {
    id: 1,
    question: "What was Peter Parker's original wrestling ring name when he first tested his powers?",
    options: ["The Arachnid Avenger", "The Human Spider", "Spider-Kid of Queens", "The Masked Marvel"],
    correctIndex: 1,
    archiveRef: "AMAZING FANTASY #15 (1962)",
    storyTitle: "THE HUMAN SPIDER ENTERS THE RING!",
    storyBody: "In Amazing Fantasy #15, Peter entered the ring against Crusher Hogan under the title 'The Human Spider'. The ring announcer introduced him as 'The Spider-Man', but Peter's hand-written poster and costume were all built around The Human Spider!",
    spideyHint: "Sam Raimi's movie gave a fun nod to this when Bruce Campbell mispronounced my stage name!"
  },
  {
    id: 2,
    question: "Which dimension does Miguel O'Hara, the high-tech Spider-Man 2099, protect?",
    options: ["Earth-65", "Earth-8311", "Earth-928", "Earth-1610"],
    correctIndex: 2,
    archiveRef: "SPIDER-MAN 2099 #1 (1992)",
    storyTitle: "NEO-NEW YORK'S CYBERPUNK WEBSLINGER!",
    storyBody: "Miguel O'Hara lives in the year 2099 in Nueva York on Earth-928! Working for the sinister megacorporation Alchemax, an attempt to purge a genetic addiction rewrote 50% of his DNA with spider genetics, giving him talons, fangs, and accelerated vision.",
    spideyHint: "Nueva York in the year 2099 sits in the 900s designation!"
  },
  {
    id: 3,
    question: "What color was the symbiote costume originally sketched by Marvel fan Randy Schueller before Secret Wars?",
    options: ["Pure Gold & Black", "All-Red with Webbing", "Red and Black with White Spider", "Neon Purple"],
    correctIndex: 2,
    archiveRef: "MARVEL FAN SUBMISSION (1982)",
    storyTitle: "THE 220-DOLLAR SYMBIOTE IDEA!",
    storyBody: "In 1982, fan Randy Schueller pitched a stealth suit made of unstable molecules that was red and black with a white spider symbol. Marvel editor Jim Shooter bought the concept for $220. Mike Zeck and Rick Leonardi later converted it into the slick all-black symbiote suit in Secret Wars #8!",
    spideyHint: "The fan wanted stealth with red and black stealth plating before it went full black alien!"
  },
  {
    id: 4,
    question: "Which villain learned Peter Parker's secret identity first in the original Silver Age comics?",
    options: ["Doctor Octopus", "Green Goblin (Norman Osborn)", "The Chameleon", "The Jackal"],
    correctIndex: 1,
    archiveRef: "AMAZING SPIDER-MAN #39 (1966)",
    storyTitle: "HOW GREEN WAS MY GOBLIN!",
    storyBody: "In Amazing Spider-Man #39, Norman Osborn sprayed Spider-Man with a gas that dulled his spider-sense, trailed him to an alleyway, and watched him unmask as high-school graduate Peter Parker!",
    spideyHint: "He used a special gas to blind my Spider-Sense before following me back to Aunt May's neighborhood!"
  }
];

export const rogueDossiers: RogueDossier[] = [
  {
    id: 'goblin',
    alias: 'Green Goblin',
    realName: 'Norman Osborn',
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80',
    clues: [
      "Flies on a high-tech bat-shaped glider and hurls explosive pumpkin bombs!",
      "Billionaire industrialist CEO of Oscorp and father to Peter's friend Harry!",
      "Driven to psychopathic madness by the physical-enhancing Goblin Formula!"
    ],
    options: [
      { id: 'doc_ock', name: 'Dr. Otto Octavius' },
      { id: 'goblin', name: 'Norman Osborn (Green Goblin)' },
      { id: 'vulture', name: 'Adrian Toomes (Vulture)' }
    ],
    storyTitle: "THE ARCH-NEMESIS OF THE SPIDER!",
    storyBody: "First appearing in Amazing Spider-Man #14 (1964), Norman Osborn discovered Peter's identity, murdered Gwen Stacy on the George Washington Bridge, and remains Peter's most deeply personal antagonist across the multiverse!",
    spideyHint: "Look out for pumpkin bombs, cackling laughter, and green goblin armor!"
  },
  {
    id: 'doc_ock',
    alias: 'Doctor Octopus',
    realName: 'Otto Octavius',
    image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=600&auto=format&fit=crop&q=80',
    clues: [
      "Brilliant nuclear physicist fused with four titanium-steel mechanical tentacles!",
      "Mastermind founder and recurring leader of the notorious Sinister Six!",
      "Once nearly married Peter's beloved guardian Aunt May to steal a Canadian nuclear island!"
    ],
    options: [
      { id: 'electro', name: 'Max Dillon (Electro)' },
      { id: 'mysterio', name: 'Quentin Beck (Mysterio)' },
      { id: 'doc_ock', name: 'Dr. Otto Octavius (Doc Ock)' }
    ],
    storyTitle: "THE TENTACLED TERROR!",
    storyBody: "Debuting in Amazing Spider-Man #3 (1963), Otto Octavius was the first supervillain to ever soundly defeat Spider-Man in combat, nearly causing Peter to hang up the tights!",
    spideyHint: "Four mechanical arms, bowl cut haircut, and a genius IQ that rivals Reed Richards!"
  },
  {
    id: 'venom',
    alias: 'Venom',
    realName: 'Eddie Brock',
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
    clues: [
      "Disgraced Daily Globe journalist who blamed Spider-Man for ruining his career!",
      "Bonded with an alien Klyntar symbiote that Peter rejected with church bells!",
      "Possesses full immunity to Peter's spider-sense because of their prior bond!"
    ],
    options: [
      { id: 'carnage', name: 'Cletus Kasady (Carnage)' },
      { id: 'venom', name: 'Eddie Brock (Venom)' },
      { id: 'scorpion', name: 'Mac Gargan (Scorpion)' }
    ],
    storyTitle: "WE ARE VENOM!",
    storyBody: "Born in Amazing Spider-Man #300 (1988), Eddie Brock and the symbiote combined their mutual hatred of Spider-Man into the lethal protector Venom!",
    spideyHint: "Big white eyes, razor-sharp fangs, and he doesn't trip my Spider-Sense at all!"
  }
];

export const whoSaidItQuestions: WhoSaidItQuestion[] = [
  {
    id: 1,
    quote: "With great power there must also come — great responsibility!",
    character: "Uncle Ben (Narrator / Benjamin Parker)",
    characterImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80",
    options: ["Uncle Ben (Narrator)", "J. Jonah Jameson", "Tony Stark", "Doctor Strange"],
    correctIndex: 0,
    comicContext: "Often misattributed solely to Ben Parker's dialogue in movies, the famous line first appeared in the narrative caption of Amazing Fantasy #15 written by Stan Lee!",
    issueRef: "AMAZING FANTASY #15 (1962)"
  },
  {
    id: 2,
    quote: "Face it, Tiger... you just hit the jackpot!",
    character: "Mary Jane Watson",
    characterImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
    options: ["Gwen Stacy", "Mary Jane Watson", "Black Cat (Felicia Hardy)", "Betty Brant"],
    correctIndex: 1,
    comicContext: "After months of Peter dodging Aunt May's blind dates expecting an uncool girl, Mary Jane Watson made her legendary door appearance in Amazing Spider-Man #42!",
    issueRef: "AMAZING SPIDER-MAN #42 (1966)"
  },
  {
    id: 3,
    quote: "Anyone can wear the mask. You could wear the mask. If you didn't know that before, I hope you do now.",
    character: "Miles Morales",
    characterImage: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80",
    options: ["Peter B. Parker", "Miles Morales", "Miguel O'Hara", "Spider-Ham"],
    correctIndex: 1,
    comicContext: "The crowning thematic statement of Into the Spider-Verse, emphasizing that heroism is not defined by heritage or luck, but by courage and compassion!",
    issueRef: "SPIDER-MAN: INTO THE SPIDER-VERSE"
  },
  {
    id: 4,
    quote: "He doesn't want to be famous? Then why does he wear a mask?! He's a menace! PARKER, GET ME PICTURES!",
    character: "J. Jonah Jameson",
    characterImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80",
    options: ["Robbie Robertson", "J. Jonah Jameson", "Norman Osborn", "George Stacy"],
    correctIndex: 1,
    comicContext: "The cigar-chomping publisher of The Daily Bugle who constantly brands Spider-Man a public menace while buying front-page photos exclusively from Peter Parker!",
    issueRef: "AMAZING SPIDER-MAN #1 (1963)"
  }
];

export const speedQuestions: SpeedQuestion[] = [
  {
    id: 1,
    prompt: "Which Spider-Hero hails from the punk-rock dimension of Earth-65?",
    options: ["Miles Morales", "Spider-Gwen (Gwen Stacy)", "Miguel O'Hara (2099)"],
    correctIndex: 1,
    explanationTitle: "EARTH-65 DEFENDER!",
    explanationBody: "Gwen Stacy was bitten by the radioactive spider in Earth-65, playing drums for The Mary Janes while swinging through NYC in her iconic hooded suit!"
  },
  {
    id: 2,
    prompt: "What is the name of Peter Parker's clone who took on the mantle of the Scarlet Spider?",
    options: ["Ben Reilly", "Kaine Parker", "Kane Vance"],
    correctIndex: 0,
    explanationTitle: "THE SCARLET SPIDER!",
    explanationBody: "Ben Reilly (named after Uncle Ben and Aunt May's maiden name Reilly) debuted in 1975 and wore the classic blue sleeveless hoodie costume!"
  },
  {
    id: 3,
    prompt: "What is the signature bio-electric power wielded by Miles Morales?",
    options: ["Web Blast", "Venom Strike", "Spider-Taser"],
    correctIndex: 1,
    explanationTitle: "VENOM STRIKE BIO-ELECTRICITY!",
    explanationBody: "Miles can channel an electric charge through his hands to stun enemies and disrupt electronic systems!"
  },
  {
    id: 4,
    prompt: "Who designed Spider-Man's high-tech mechanical Iron Spider armor in Civil War?",
    options: ["Reed Richards", "Tony Stark", "Hank Pym"],
    correctIndex: 1,
    explanationTitle: "STARK TECH INNOVATION!",
    explanationBody: "Tony Stark gifted Peter the crimson and gold Iron Spider armor with mechanical waldoes right before the superhero Civil War!"
  }
];

export const canonEntries: CanonEntry[] = [
  {
    id: 'c1',
    universe: '616',
    universeLabel: 'EARTH-616',
    year: '1962',
    title: 'The Symbiote Suit Secret',
    description: "Peter first donned the sleek black alien suit in Secret Wars #8 thinking it was self-repairing alien cloth before realizing it was a living Klyntar parasite.",
    keyIssue: 'SECRET WARS #8 (1984)',
    imageUrl: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=600&auto=format&fit=crop&q=80',
    iconType: 'book'
  },
  {
    id: 'c2',
    universe: '1610',
    universeLabel: 'EARTH-1610',
    year: '2011',
    title: "Miles Morales' Genetic Oz Spider",
    description: "Bitten by Oscorp's genetically modified Oz spider #42, Miles developed the unique Venom Strike and optical camouflage before joining Earth-616.",
    keyIssue: 'ULTIMATE FALLOUT #4',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
    iconType: 'bolt'
  },
  {
    id: 'c3',
    universe: '65',
    universeLabel: 'EARTH-65',
    year: '2014',
    title: 'Spider-Woman of The Mary Janes',
    description: "In Earth-65, Gwen Stacy is the web-slinger while Peter Parker tragically transformed into the Lizard trying to gain powers to protect himself.",
    keyIssue: 'EDGE OF SPIDER-VERSE #2',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    iconType: 'music'
  },
  {
    id: 'c4',
    universe: '928',
    universeLabel: 'EARTH-928',
    year: '1992',
    title: "Miguel O'Hara & Nueva York 2099",
    description: "Geneticist Miguel O'Hara uses accelerated decoys and organic talons to battle the corrupt Alchemax mega-corporation in a cyberpunk future.",
    keyIssue: 'SPIDER-MAN 2099 #1',
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    iconType: 'spider'
  },
  {
    id: 'c5',
    universe: '199999',
    universeLabel: 'EARTH-199999 (MCU)',
    year: '2016',
    title: 'The Queens Kid & Stark Technology',
    description: "Recruited in Germany by Tony Stark, Peter Parker upgraded from home-sewn sweatpants to web-wings, instant kill mode, and nanotech armor.",
    keyIssue: 'CAPTAIN AMERICA: CIVIL WAR',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80',
    iconType: 'shield'
  }
];

export const badgeList: BadgeItem[] = [
  {
    id: 'b1',
    name: 'WALL CRAWLER',
    description: 'Answered 5 Trivia Questions Correctly',
    emoji: '🕷️',
    unlocked: true,
    colorBg: 'bg-primary/20'
  },
  {
    id: 'b2',
    name: 'WEB HEAD',
    description: 'Achieved a 3x or higher Combo Multiplier',
    emoji: '🕸️',
    unlocked: true,
    colorBg: 'bg-secondary-fixed'
  },
  {
    id: 'b3',
    name: 'SPIDER-SENSE',
    description: 'Completed a Speed Challenge with fast reflexes',
    emoji: '⚡',
    unlocked: true,
    colorBg: 'bg-tertiary-fixed'
  },
  {
    id: 'b4',
    name: 'CANON SCHOLAR',
    description: 'Explored Earth-616 & Multiverse lore archives',
    emoji: '📚',
    unlocked: true,
    colorBg: 'bg-surface-container-highest'
  },
  {
    id: 'b5',
    name: 'HERO OF QUEENS',
    description: 'Mastered all trivia modes in Issue #01',
    emoji: '🏙️',
    unlocked: true,
    colorBg: 'bg-tertiary-fixed-dim'
  }
];

export const spideyQuotes = [
  "I've faced Green Goblin, Doctor Octopus, and rent day! Don't let this question wrap you up in webs!",
  "Great job, Tiger! Your Spider-Sense is buzzing louder than J. Jonah Jameson shouting for photos!",
  "Careful! Mysterio loves spreading fake news, but Stan Lee wrote the real gospel!",
  "With great trivia power comes great combo multipliers! Keep that streak alive!",
  "Did somebody say chimichangas? Oops, wrong hero! I meant pizza time!"
];
