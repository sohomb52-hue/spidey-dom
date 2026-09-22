import { SpiderCharacter, ArcadeGame } from '../types';

export const spiderCharactersList: SpiderCharacter[] = [
  {
    id: 'peter-616',
    alias: 'THE AMAZING SPIDER-MAN',
    realName: 'Peter Benjamin Parker',
    earth: 'Earth-616',
    earthTag: 'PRIME CONTINUITY',
    image: 'https://images.unsplash.com/photo-1635863138275-d9b33299680b?w=700&auto=format&fit=crop&q=80',
    suitDescription: 'Classic Red & Royal Blue spandex with black web pattern, twin mechanical wrist web-shooters, and expressive white lenses.',
    signaturePower: 'Proportional strength of a spider, Wall-crawling, Precognitive Spider-Sense, Web-fluid shooter engineering genius.',
    firstAppearance: 'Amazing Fantasy #15 (August 1962)',
    quote: 'With great power there must also come — great responsibility!',
    clues: [
      'Grew up in Forest Hills, Queens, raised by his beloved Aunt May and Uncle Ben.',
      'Crafted his own chemical web-fluid and mechanical web-shooters in a high school chemistry lab.',
      'Worked as a freelance photojournalist for J. Jonah Jameson at the Daily Bugle.'
    ],
    options: ['Peter Parker (Earth-616)', 'Ben Reilly (Scarlet Spider)', 'Peter B. Parker (Earth-616B)', 'Miguel O\'Hara (2099)'],
    loreSnippet: 'The definitive hero of Earth-616! Bitten by a radioactive spider at a science exhibition, Peter learned the bitter cost of selfishness when Uncle Ben was killed by a burglar he refused to stop.'
  },
  {
    id: 'miles-1610',
    alias: 'SPIDER-MAN (BROOKLYN)',
    realName: 'Miles Gonzalo Morales',
    earth: 'Earth-1610',
    earthTag: 'ULTIMATE UNIVERSE',
    image: 'https://images.unsplash.com/photo-1604200213928-ba3cf4fc8436?w=700&auto=format&fit=crop&q=80',
    suitDescription: 'Sleek matte black suit with spray-painted red spider emblem and red web striping, often worn with Nike Air Jordan 1s.',
    signaturePower: 'Venom Strike (Bio-electric stuns), Camouflage / Invisibility, Wall-crawling, Mega-Venom blast.',
    firstAppearance: 'Ultimate Fallout #4 (August 2011)',
    quote: 'Anyone can wear the mask. You can wear the mask. If you didn\'t know that before, I hope you do now.',
    clues: [
      'Bitten by the genetically engineered Oz formula spider Specimen 42 smuggled in his uncle\'s duffle bag.',
      'Can turn completely invisible using active camouflage and discharge high-voltage bio-electricity.',
      'His father Jefferson Davis is an NYPD officer and his uncle Aaron Davis was secretly the villainous Prowler.'
    ],
    options: ['Miles Morales (Earth-1610)', 'Pavitr Prabhakar (Earth-50101)', 'Hobie Brown (Earth-138)', 'Peter Parker (Earth-616)'],
    loreSnippet: 'After Peter Parker tragically died protecting his family in the Ultimate Universe, 13-year-old Miles stepped up to carry the mantle, eventually migrating into the main Marvel continuity!'
  },
  {
    id: 'gwen-65',
    alias: 'GHOST-SPIDER / SPIDER-WOMAN',
    realName: 'Gwendolyne Maxine Stacy',
    earth: 'Earth-65',
    earthTag: 'NEO-PUNK EARTH',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=700&auto=format&fit=crop&q=80',
    suitDescription: 'Hooded white suit with vivid magenta/cyan interior webbing, sleek black torso, and turquoise ballet slippers.',
    signaturePower: 'Acrobatic agility, Dimensional travel watch, Wall-crawling, Organic drumming rhythm in combat.',
    firstAppearance: 'Edge of Spider-Verse #2 (September 2014)',
    quote: 'Where I come from, the spider bit me instead. But the rhythm of the city is always in my head.',
    clues: [
      'Plays drums in a rock band called "The Mary Janes" alongside Mary Jane Watson and Glory Grant.',
      'Her father Captain George Stacy was assigned by the police department to hunt down Spider-Woman.',
      'In her world, Peter Parker became The Lizard out of insecurity and died in her arms during prom night.'
    ],
    options: ['Gwen Stacy (Ghost-Spider, Earth-65)', 'Jessica Drew (Spider-Woman)', 'May "Mayday" Parker (Spider-Girl)', 'Anya Corazon (Araña)'],
    loreSnippet: 'Created by Jason Latour and Robbi Rodriguez, Earth-65 Gwen Stacy became an instant global icon with her striking hooded costume design and indie punk aesthetic!'
  },
  {
    id: 'miguel-928',
    alias: 'SPIDER-MAN 2099',
    realName: 'Miguel O\'Hara',
    earth: 'Earth-928',
    earthTag: 'CYBERPUNK FUTURE',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=700&auto=format&fit=crop&q=80',
    suitDescription: 'Unstable molecule dark blue/red suit made of Day of the Dead motifs, retractable arm talons, and a light-byte cape.',
    signaturePower: 'Retractable talons on fingers/toes, Venomous fangs with paralyzing toxins, Accelerated vision, Spider-Sense replaced by hyper-reflexes.',
    firstAppearance: 'Amazing Spider-Man #365 (August 1992)',
    quote: 'I am the Spider-Man of the year 2099. And Nueva York needs someone who isn\'t owned by Alchemax.',
    clues: [
      'Brilliant geneticist employed by the corrupt mega-corporation Alchemax in future Nueva York.',
      'Has venomous canine fangs that secrete non-lethal paralytic venom and razor talons that rip through metal.',
      'Lacks a traditional Spider-Sense, compensating with telepathic acceleration and optical zooms.'
    ],
    options: ['Miguel O\'Hara (Spider-Man 2099)', 'Kaine Parker (Scarlet Spider)', 'Otto Octavius (Superior Spider-Man)', 'Ezekiel Sims'],
    loreSnippet: 'After his ruthless supervisor poisoned him with the addictive drug Rapture, Miguel attempted to reset his DNA to a clean state, only for a saboteur to cross his genetic code with that of a spider!'
  },
  {
    id: 'noir-90214',
    alias: 'SPIDER-MAN NOIR',
    realName: 'Peter Parker (1933)',
    earth: 'Earth-90214',
    earthTag: 'DEPRESSION ERA',
    image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=700&auto=format&fit=crop&q=80',
    suitDescription: 'WWI pilot leather trench coat, fedora hat, aviator goggles stitched onto a balaclava, and dual revolvers.',
    signaturePower: 'Shadow stealth, Organic black web nets from wrists, Hard-boiled combat instincts, High pain tolerance.',
    firstAppearance: 'Spider-Man Noir #1 (February 2009)',
    quote: 'Wherever I go, the wind follows. And the wind, it smells like rain... and cheap cigars.',
    clues: [
      'Operates in 1933 New York City during the depths of the Great Depression.',
      'Investigates the corrupt crime cartel run by Norman Osborn, known as "The Goblin".',
      'Wears a dark fedora, trench coat, pilot goggles, and solves Rubik\'s cubes in monochrome.'
    ],
    options: ['Spider-Man Noir (Earth-90214)', 'Spider-Knight (Earth-311)', 'Peter Parker (Earth-616)', 'Punisher Spider (Earth-71912)'],
    loreSnippet: 'Bitten by an exotic arachnid released from a shattered mystical spider-idol in a warehouse, Noir Peter fights criminal syndicates with gritty detective methods and dark trenchcoat stealth.'
  },
  {
    id: 'punk-138',
    alias: 'SPIDER-PUNK',
    realName: 'Hobart "Hobie" Brown',
    earth: 'Earth-138',
    earthTag: 'ANARCHIC ROCK',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=700&auto=format&fit=crop&q=80',
    suitDescription: 'Denim battle vest covered in band patches and safety pins, spiked mohawk studs atop the mask, and a customized electric guitar.',
    signaturePower: 'Sonic blast feedback amplified by 15,000 watts of raw punk rock, Riot combat, Wall-crawling, Spiked skull bashes.',
    firstAppearance: 'The Amazing Spider-Man Vol. 3 #10 (January 2015)',
    quote: 'I don\'t believe in comedy. Just taking down totalitarian fascists with a distortion pedal.',
    clues: [
      'Uses a customized electric guitar to defeat President Norman Osborn\'s V.E.N.O.M. police state.',
      'Believes in mutual aid, anti-establishment activism, and does not believe in standard rules.',
      'Wears a battle vest with metal studs forming a punk mohawk on his mask.'
    ],
    options: ['Hobie Brown / Spider-Punk (Earth-138)', 'Miles Morales (Earth-1610)', 'Pavitr Prabhakar (Earth-50101)', 'Peter Parker (Earth-616)'],
    loreSnippet: 'Radioactive waste dumping created this rebellious hero. Armed with three chords and the truth, Hobie leads the Spider-Army\'s underground music counterculture!'
  },
  {
    id: 'pavitr-50101',
    alias: 'SPIDER-MAN INDIA',
    realName: 'Pavitr Prabhakar',
    earth: 'Earth-50101',
    earthTag: 'MUMBATTAN',
    image: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=700&auto=format&fit=crop&q=80',
    suitDescription: 'Traditional dhoti bottoms styled with red and blue spider silks, ornate gold wrist gauntlets, and curly flowing locks.',
    signaturePower: 'Mystic spider yoga agility, Thread weaving, Kalaripayattu martial arts, Intuitive danger sense.',
    firstAppearance: 'Spider-Man: India #1 (November 2004)',
    quote: 'Being Spider-Man is so easy! All you need is great hair, chai tea, and saving Mumbai on the way to school!',
    clues: [
      'Gained his miraculous powers from an ancient yogi mystic in a sacred temple rather than a science lab.',
      'Battles Nalin Kober (the demon-possessed equivalent of the Green Goblin) in Mumbai.',
      'Lives with his Uncle Bhim and Aunt Maya, and is deeply in love with Meera Jain.'
    ],
    options: ['Pavitr Prabhakar (Earth-50101)', 'Takuya Yamashiro (Earth-51778)', 'Miles Morales (Earth-1610)', 'Hobie Brown (Earth-138)'],
    loreSnippet: 'Created by Gotham Entertainment Group in collaboration with Marvel, Pavitr blends classic Peter Parker tropes with rich Indian mythology, acrobatics, and vibrant storytelling.'
  },
  {
    id: 'peni-14512',
    alias: 'PENI PARKER & SP//dr',
    realName: 'Peni Parker',
    earth: 'Earth-14512',
    earthTag: 'CYBER ANIME MECHA',
    image: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=700&auto=format&fit=crop&q=80',
    suitDescription: 'Japanese high school sailor uniform alongside a towering red and white biomorphic mecha suit with round glowing optic dome.',
    signaturePower: 'Piloting the SP//dr mecha via psychic spider-neural link, High-speed thrusters, Mechanical web-cables.',
    firstAppearance: 'Edge of Spider-Verse #5 (October 2014)',
    quote: 'The suit is ready. Sync ratio: ninety-nine percent. Let\'s go, SP//dr!',
    clues: [
      'Pilots a massive mechanical robot mecha built by her late father.',
      'Shares a direct psychic link with a radioactive spider that lives inside the central cockpit core.',
      'Raised by her technical engineering guardians Aunt May and Uncle Ben in an anime-inspired futuristic New York.'
    ],
    options: ['Peni Parker & SP//dr (Earth-14512)', 'Gwen Stacy (Earth-65)', 'Anya Corazon (Araña)', 'May Parker (Earth-982)'],
    loreSnippet: 'Conceived by Gerard Way and Jake Wyatt as a love letter to Neon Genesis Evangelion and Tokyo anime aesthetics, Peni was bitten intentionally to synchronize with her father\'s battle mecha!'
  }
];

export const arcadeGamesList: ArcadeGame[] = [
  {
    id: 'web_thrower',
    number: '01',
    title: 'WEB THROWER 3D',
    tagline: 'ROOFTOP TARGET SHOOTER',
    category: 'ACTION ARCADE',
    icon: '🎯',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    page: 'web_thrower',
    difficulty: 'MEDIUM',
    features: ['3D crosshair aiming', 'Moving villain gliders', 'Combos & web ammo', 'Dynamic sound FX']
  },
  {
    id: 'spider_id',
    number: '02',
    title: 'MULTIVERSE IDENTI-MATCH',
    tagline: 'IDENTIFY SPIDER-MAN CHARACTERS',
    category: 'CHARACTER DETECTIVE',
    icon: '👥',
    coverImage: 'https://images.unsplash.com/photo-1635863138275-d9b33299680b?w=600&auto=format&fit=crop&q=80',
    page: 'spider_id',
    difficulty: 'HARD',
    features: ['10+ Multiverse Spider-Variants', '3D inspection flips', 'Costume & origin clues', 'Universe Earth badges']
  },
  {
    id: 'fact_attack',
    number: '03',
    title: 'FACT ATTACK: TRUE OR FICTION',
    tagline: 'RAPID COMIC TRIVIA',
    category: 'TRIVIA ENGINE',
    icon: '⚡',
    coverImage: 'https://images.unsplash.com/photo-1604200213928-ba3cf4fc8436?w=600&auto=format&fit=crop&q=80',
    page: 'trivia',
    triviaSubMode: 'tf',
    difficulty: 'EASY',
    features: ['Authentic comic lore', 'Streak multipliers', 'Real Story reveals', 'Stan Lee era secrets']
  },
  {
    id: 'web_knowledge',
    number: '04',
    title: 'WEB OF KNOWLEDGE (MCQ)',
    tagline: 'DEEP CONTINUITY TEST',
    category: 'MULTIPLE CHOICE',
    icon: '🕸️',
    coverImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
    page: 'trivia',
    triviaSubMode: 'mcq',
    difficulty: 'MEDIUM',
    features: ['4-option comic panels', 'Canon milestones', 'Issue annotations', 'High score tracking']
  },
  {
    id: 'who_said_it',
    number: '05',
    title: 'WHO SAID IT? COMIC QUOTES',
    tagline: 'SPEECH BALLOON MYSTERY',
    category: 'DIALOGUE DETECTIVE',
    icon: '💬',
    coverImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    page: 'trivia',
    triviaSubMode: 'who_said_it',
    difficulty: 'MEDIUM',
    features: ['Authentic dialogue', 'Mystery speaker art', 'Contextual lore drops', 'Character voice tags']
  },
  {
    id: 'spider_sense',
    number: '06',
    title: 'SPIDER-SENSE SPEED REFLEX',
    tagline: 'LIGHTNING QUICK-TIME TEST',
    category: 'REACTION SPEED',
    icon: '⏱️',
    coverImage: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=600&auto=format&fit=crop&q=80',
    page: 'trivia',
    triviaSubMode: 'speed',
    difficulty: 'EXTREME',
    features: ['10-second adrenaline clock', 'Reflex rating bonuses', 'Spider-Sense aura', 'High-pressure stakes']
  }
];
