import {
  ART_CANON_01,
  ART_CANON_02,
  ART_CANON_03,
  ART_CANON_04,
  ART_CANON_05,
  ART_CANON_06,
  ART_CANON_07,
  ART_CANON_08,
  ART_CANON_09,
  ART_CANON_10,
  ART_CANON_11
} from './canonEventArt';
import {
  CHAR_PETER_616,
  CHAR_MILES_1610,
  CHAR_GWEN_65,
  CHAR_MIGUEL_928,
  CHAR_UNCLE_BEN,
  CHAR_MARY_JANE,
  VILLAIN_GREEN_GOBLIN,
  VILLAIN_DOC_OCK,
  VILLAIN_VENOM,
  GAME_THUMB_SPIDER_ID
} from './spiderArtAssets';

export type CanonCategory =
  | 'ALL'
  | 'ORIGIN'
  | 'VILLAINS'
  | 'ALLIES'
  | 'LOSS'
  | 'MULTIVERSE'
  | 'MAJOR_EVENTS'
  | 'LEGACY';

export interface CanonEventCaseFile {
  id: string;
  eventNumber: string;
  title: string;
  comicStoryline: string;
  keyIssue: string;
  publicationEra: string;
  year: number;
  importanceRank: number; // 1 = highest importance
  universe: 'Earth-616' | 'Earth-1610' | 'Earth-65' | 'Earth-928' | 'Earth-199999';
  universeTag: string;
  isMainCanon: boolean;
  statusBadge: 'CANON_CONFIRMED' | 'ALTERNATE_UNIVERSE';
  categories: CanonCategory[];
  coverImageUrl: string;
  panelImageUrl: string;
  whatHappened: string;
  canonFact: string;
  whyItMatters: string;
  importantCharacters: string[];
  villainAntagonist?: string;
  soundEffect: string; // e.g., "THWIP!", "BAM!", "WHOOSH!", "CRACK!"
  speechQuote: {
    text: string;
    speaker: string;
    caption: string;
  };
  editorialSecret: string;
  verifiedBy: string;
}

export const CANON_EVENTS: CanonEventCaseFile[] = [
  {
    id: 'canon-01',
    eventNumber: '01',
    title: 'THE SPIDER BITE',
    comicStoryline: 'Origin of Spider-Man',
    keyIssue: 'Amazing Fantasy #15 (August 1962)',
    publicationEra: '1962 • Silver Age',
    year: 1962,
    importanceRank: 1,
    universe: 'Earth-616',
    universeTag: 'PRIME CONTINUITY',
    isMainCanon: true,
    statusBadge: 'CANON_CONFIRMED',
    categories: ['ORIGIN', 'LEGACY'],
    coverImageUrl: ART_CANON_01,
    panelImageUrl: ART_CANON_01,
    whatHappened:
      'Bookish high school outcast Peter Parker attends a public science exhibition on radioactivity. An ordinary house spider unwittingly drifts into a particle accelerator beam, absorbing fatal gamma radiation before biting Peter on the hand seconds before dying.',
    canonFact:
      'In original comic canon, Peter did NOT receive organic web-shooters from the spider bite. His high school chemistry genius allowed him to invent the twin wrist-mounted mechanical web-shooters and pressurized polymer web fluid in his bedroom laboratory!',
    whyItMatters:
      'This single radioactive arachnid established the archetype of the relatable, vulnerable teenage superhero who had to invent his own gear while juggling homework and bullies.',
    importantCharacters: ['Peter Parker', 'Aunt May', 'Uncle Ben', 'Flash Thompson'],
    soundEffect: 'ZZZAP!',
    speechQuote: {
      text: "Like an electric shock, his bite... It feels like... pure energy coursing through my veins!",
      speaker: 'Peter Parker',
      caption: 'Midtown Science Hall Exhibition'
    },
    editorialSecret:
      'Publisher Martin Goodman initially rejected Stan Lee’s Spider-Man pitch, claiming teenagers could only be sidekicks, people hated spiders, and a hero could not have personal financial problems. Lee snuck the story into the dying cancellation issue Amazing Fantasy #15, which became Marvel’s biggest bestseller of 1962!',
    verifiedBy: 'Archivist Stan Lee & Steve Ditko'
  },
  {
    id: 'canon-02',
    eventNumber: '02',
    title: 'WITH GREAT POWER COMES GREAT RESPONSIBILITY',
    comicStoryline: 'The Birth of a Heroic Creed',
    keyIssue: 'Amazing Fantasy #15 (August 1962)',
    publicationEra: '1962 • Silver Age',
    year: 1962,
    importanceRank: 2,
    universe: 'Earth-616',
    universeTag: 'PRIME CONTINUITY',
    isMainCanon: true,
    statusBadge: 'CANON_CONFIRMED',
    categories: ['ORIGIN', 'LEGACY'],
    coverImageUrl: ART_CANON_02,
    panelImageUrl: ART_CANON_02,
    whatHappened:
      'Intoxicated by television fame and showbusiness royalties as "The Amazing Spider-Man", Peter refuses to trip a fleeing thief running toward an elevator, dismissively telling the studio security guard that stopping criminals is not his problem.',
    canonFact:
      'Uncle Ben NEVER uttered the exact sentence "With great power comes great responsibility" to Peter in Amazing Fantasy #15! The words were written strictly as a closing third-person narrator caption by Stan Lee in the final panel. Later retcons and movies placed the words into Ben’s dialogue.',
    whyItMatters:
      'It stripped away comic-book escapism to install a moral engine powered by personal guilt. Spider-Man fights not because it is fun, but because inaction has catastrophic consequences.',
    importantCharacters: ['Peter Parker', 'TV Studio Guard', 'The Burglar'],
    soundEffect: 'SLAM!',
    speechQuote: {
      text: "From now on I just look out for Number One — that means me!",
      speaker: 'Peter Parker',
      caption: 'Moments before the fateful elevator door closes'
    },
    editorialSecret:
      'Steve Ditko’s moody, shadow-drenched inks in the final three panels created a stark contrast with the bright superhero comics of the era, ending on a solitary boy weeping in an alley instead of a triumphant parade.',
    verifiedBy: 'Marvel Continuity Registry #616-AF15'
  },
  {
    id: 'canon-03',
    eventNumber: '03',
    title: 'THE DEATH OF UNCLE BEN',
    comicStoryline: 'The Catalyst of the Web-Slinger',
    keyIssue: 'Amazing Fantasy #15 (August 1962)',
    publicationEra: '1962 • Silver Age',
    year: 1962,
    importanceRank: 3,
    universe: 'Earth-616',
    universeTag: 'PRIME CONTINUITY',
    isMainCanon: true,
    statusBadge: 'CANON_CONFIRMED',
    categories: ['LOSS', 'ORIGIN', 'LEGACY'],
    coverImageUrl: ART_CANON_03,
    panelImageUrl: ART_CANON_03,
    whatHappened:
      'Returning home from an exhibition, Peter discovers police sirens outside his Forest Hills home. Uncle Ben has been shot dead by an intruder. Furiously tracking the murderer to the abandoned Acme warehouse, Peter hoists him into the moonlight—only to recognize the thief he let go.',
    canonFact:
      'The killer had broken into the Parker residence specifically searching for Dutch Schultz’s hidden Prohibition mob fortune allegedly buried inside the walls—a treasure Aunt May and Uncle Ben never knew existed.',
    whyItMatters:
      'Uncle Ben’s murder transforms Peter’s superhero life from a thrilling hobby into a lifelong penance. Peter realizes every crime he ignores can destroy an innocent family.',
    importantCharacters: ['Peter Parker', 'Uncle Ben Parker', 'Aunt May Parker', 'Officer Frank'],
    villainAntagonist: 'The Burglar (Dennis Carradine)',
    soundEffect: 'BAM!',
    speechQuote: {
      text: "It's him! The man who murdered Uncle Ben... is the man I let escape!",
      speaker: 'Spider-Man',
      caption: 'The Abandoned Warehouse on the Waterfront'
    },
    editorialSecret:
      'Dennis Carradine was not formally named in the comic until 1996 in The Sensational Spider-Man #0. For over three decades, he was simply known to generations of readers as "The Burglar".',
    verifiedBy: 'NYPD 108th Precinct Case File #44-B'
  },
  {
    id: 'canon-04',
    eventNumber: '04',
    title: 'SPIDER-MAN ENTERS THE DAILY BUGLE',
    comicStoryline: 'The Camera & The Crusader',
    keyIssue: 'The Amazing Spider-Man #1 (March 1963)',
    publicationEra: '1963 • Silver Age',
    year: 1963,
    importanceRank: 5,
    universe: 'Earth-616',
    universeTag: 'PRIME CONTINUITY',
    isMainCanon: true,
    statusBadge: 'CANON_CONFIRMED',
    categories: ['ALLIES', 'ORIGIN'],
    coverImageUrl: ART_CANON_04,
    panelImageUrl: ART_CANON_04,
    whatHappened:
      'Facing eviction and Aunt May’s mounting medical bills, Peter webs his automatic camera to brick cornices to snap high-flying action photos of himself, selling the exclusive prints to thunderous newspaper publisher J. Jonah Jameson.',
    canonFact:
      'Peter repeatedly sold photos of himself to Jameson that directly fed the Bugle’s smear campaigns branding Spider-Man a "Menace", effectively financing his aunt’s groceries with anti-Spider-Man propaganda!',
    whyItMatters:
      'It established Peter Parker’s civilian career, introduced essential supporting cast members (Betty Brant, Robbie Robertson, Ned Leeds), and created the legendary comedy-drama tension between Peter and J. Jonah Jameson.',
    importantCharacters: ['Peter Parker', 'J. Jonah Jameson', 'Betty Brant', 'Joe Robertson'],
    soundEffect: 'CLICK-WHIRRR!',
    speechQuote: {
      text: "Parker! These photos of the Wall-Crawler are fantastic! I'll give you ten bucks for each, and I'm losing money on the deal!",
      speaker: 'J. Jonah Jameson',
      caption: 'Daily Bugle Editorial Office'
    },
    editorialSecret:
      'Stan Lee modeled J. Jonah Jameson directly after himself during a bad mood—loud, impatient, cheap, but with an underlying stubborn integrity that refused to fold to mob intimidation.',
    verifiedBy: 'Daily Bugle Archives & City Desk'
  },
  {
    id: 'canon-05',
    eventNumber: '05',
    title: 'THE GREEN GOBLIN REVEALED',
    comicStoryline: 'How Green Was My Goblin!',
    keyIssue: 'The Amazing Spider-Man #39-40 (August-September 1966)',
    publicationEra: '1966 • Silver Age',
    year: 1966,
    importanceRank: 4,
    universe: 'Earth-616',
    universeTag: 'PRIME CONTINUITY',
    isMainCanon: true,
    statusBadge: 'CANON_CONFIRMED',
    categories: ['VILLAINS', 'MAJOR_EVENTS'],
    coverImageUrl: ART_CANON_05,
    panelImageUrl: VILLAIN_GREEN_GOBLIN,
    whatHappened:
      'The Green Goblin douses Spider-Man with a micro-gas that neutralizes his Spider-Sense, tracks him down an alley, witnesses Peter unmasking, captures him with a steel net, and brings him to a secret hideout where he unmasks himself as Norman Osborn—father of Peter’s best college friend Harry.',
    canonFact:
      'This marked the very first time in superhero comic history that a superhero and his archnemesis learned each other’s civilian identities simultaneously, turning their battle into an intimate family feud.',
    whyItMatters:
      'Norman Osborn was elevated into Peter’s permanent supreme nemesis, intertwining Spider-Man’s heroic burdens directly with Harry Osborn’s fragile mental health.',
    importantCharacters: ['Peter Parker', 'Norman Osborn', 'Harry Osborn'],
    villainAntagonist: 'The Green Goblin (Norman Osborn)',
    soundEffect: 'CACKLE!',
    speechQuote: {
      text: "Take a good look, Parker! Norman Osborn! The father of your dearest friend Harry... is your executioner!",
      speaker: 'Norman Osborn',
      caption: 'Sub-Basement Chemical Lab, Midtown'
    },
    editorialSecret:
      'Legend has it Steve Ditko left the comic partly over a dispute with Stan Lee about the Goblin’s identity; Ditko wanted the Goblin to be an ordinary stranger from the crowd, while Stan argued dramatic storytelling required him to be an established cast member.',
    verifiedBy: 'Oscorp Security Dossier #GOBLIN-01'
  },
  {
    id: 'canon-06',
    eventNumber: '06',
    title: 'THE NIGHT GWEN STACY DIED',
    comicStoryline: 'The Turning Point of Comics',
    keyIssue: 'The Amazing Spider-Man #121-122 (June-July 1973)',
    publicationEra: '1973 • Bronze Age',
    year: 1973,
    importanceRank: 1,
    universe: 'Earth-616',
    universeTag: 'PRIME CONTINUITY',
    isMainCanon: true,
    statusBadge: 'CANON_CONFIRMED',
    categories: ['LOSS', 'VILLAINS', 'MAJOR_EVENTS'],
    coverImageUrl: ART_CANON_06,
    panelImageUrl: ART_CANON_06,
    whatHappened:
      'A relapsed Green Goblin kidnaps Gwen Stacy and hurls her from the top of the George Washington Bridge (drawn as Brooklyn Bridge). Spider-Man snatches her ankle with a desperate web line, but the sudden whiplash snaps her cervical vertebrae. Norman Osborn is subsequently impaled by his own remote glider in the ensuing battle.',
    canonFact:
      'Marvel letter columns and coroner reports confirmed the fatal cause: the sudden deceleration caused by Peter’s tensile web snapping her fall broke Gwen’s neck before she hit the water, putting the horrifying burden of her physical death on Peter’s own rescue attempt.',
    whyItMatters:
      'Comic historians widely recognize Gwen Stacy’s death as the definitive end of the innocent Silver Age of comic books and the birth of the gritty Bronze Age, proving superheroes could fail with irreversible consequences.',
    importantCharacters: ['Peter Parker', 'Gwen Stacy', 'Norman Osborn', 'Mary Jane Watson'],
    villainAntagonist: 'The Green Goblin',
    soundEffect: 'SNAP!',
    speechQuote: {
      text: "I saved her! I caught her in time! Gwen, wake up... Please, Gwen, you can't be dead...",
      speaker: 'Spider-Man',
      caption: 'Beneath the Bridge Tower'
    },
    editorialSecret:
      'Writer Gerry Conway, penciler Gil Kane, and editor Roy Thomas decided to kill Gwen because they felt her pure relationship with Peter had reached an impasse where marriage would age him too quickly, and Mary Jane possessed more dramatic edge.',
    verifiedBy: 'Manhattan Medical Examiner Report #ASM-121'
  },
  {
    id: 'canon-07',
    eventNumber: '07',
    title: 'THE SYMBIOTE ARRIVES',
    comicStoryline: 'The Alien Costume Saga',
    keyIssue: 'Secret Wars #8 (December 1984) / ASM #252 (May 1984)',
    publicationEra: '1984 • Copper Age',
    year: 1984,
    importanceRank: 4,
    universe: 'Earth-616',
    universeTag: 'PRIME CONTINUITY',
    isMainCanon: true,
    statusBadge: 'CANON_CONFIRMED',
    categories: ['MAJOR_EVENTS', 'VILLAINS'],
    coverImageUrl: ART_CANON_07,
    panelImageUrl: ART_CANON_07,
    whatHappened:
      'While trapped on the Beyonder’s Battleworld during Secret Wars, Peter’s original red-and-blue suit is shredded in battle. Seeking a fabric machine, he activates an alien prison sphere that deposits a sleek, ink-black blob onto his hand, instantly morphing into a black suit with infinite organic webbing and shape-shifting powers.',
    canonFact:
      'The concept of Spider-Man’s black suit was originally conceived by a 22-year-old comic fan named Randy Schueller from Norridge, Illinois. Marvel Editor-in-Chief Jim Shooter purchased the fan’s design submission for $220.00 and offered him a shot at writing the script!',
    whyItMatters:
      'The black suit completely revitalized Spider-Man’s visual mythology, became one of the most celebrated costume changes in pop culture history, and set up the birth of Venom.',
    importantCharacters: ['Peter Parker', 'The Beyonder', 'Reed Richards', 'The Symbiote'],
    soundEffect: 'THWIP-SLICK!',
    speechQuote: {
      text: "It reads my thoughts! It responds to mental commands! It's like wearing a second skin!",
      speaker: 'Spider-Man',
      caption: 'Alien Citadel, Battleworld'
    },
    editorialSecret:
      'Due to publication schedules, Amazing Spider-Man #252 debuted the black costume in stores seven months before Secret Wars #8 actually explained where Peter found it!',
    verifiedBy: 'Baxter Building Laboratory Analysis Log #84'
  },
  {
    id: 'canon-08',
    eventNumber: '08',
    title: 'VENOM IS BORN',
    comicStoryline: 'The Symbiote’s Revenge',
    keyIssue: 'The Amazing Spider-Man #299-300 (April-May 1988)',
    publicationEra: '1988 • Modern Age',
    year: 1988,
    importanceRank: 3,
    universe: 'Earth-616',
    universeTag: 'PRIME CONTINUITY',
    isMainCanon: true,
    statusBadge: 'CANON_CONFIRMED',
    categories: ['VILLAINS', 'MAJOR_EVENTS'],
    coverImageUrl: ART_CANON_08,
    panelImageUrl: VILLAIN_VENOM,
    whatHappened:
      'After Peter purges the living symbiote using the deafening sonic bells of Our Lady of Saints Church, the creature slides into the church rafters and bonds with disgraced journalist Eddie Brock, whose career was ruined when Spider-Man unmasked the real Sin-Eater.',
    canonFact:
      'Venom possesses every single power of Spider-Man, plus complete immunity to Peter’s Spider-Sense! Because the symbiote lived on Peter’s body for months, his nervous system registers the creature as self rather than danger.',
    whyItMatters:
      'Venom transformed Spider-Man’s rogues gallery for the next 40 years, spawning Carnage, the Symbiote Hive (Knull), Anti-Venom, and cementing Todd McFarlane as a superstar penciler.',
    importantCharacters: ['Peter Parker', 'Eddie Brock', 'Mary Jane Watson-Parker'],
    villainAntagonist: 'Venom (Eddie Brock & The Symbiote)',
    soundEffect: 'ROOOAAAR!',
    speechQuote: {
      text: "We are Venom! And we have come to rip the heart from Peter Parker!",
      speaker: 'Venom',
      caption: 'Our Lady of Saints Belfry'
    },
    editorialSecret:
      'David Michelinie originally planned for Venom to be a woman who miscarried after being struck by a taxi cab whose driver was distracted by Spider-Man fighting a villain, but editor Jim Salicrup felt a hulking physical match for Peter would sell better.',
    verifiedBy: 'Symbiote Database Record #KLYNTAR-001'
  },
  {
    id: 'canon-09',
    eventNumber: '09',
    title: 'KRAVEN’S LAST HUNT',
    comicStoryline: 'Fearful Symmetry',
    keyIssue: 'Web of Spider-Man #31 / ASM #293-294 (October-November 1987)',
    publicationEra: '1987 • Copper Age',
    year: 1987,
    importanceRank: 5,
    universe: 'Earth-616',
    universeTag: 'PRIME CONTINUITY',
    isMainCanon: true,
    statusBadge: 'CANON_CONFIRMED',
    categories: ['VILLAINS', 'MAJOR_EVENTS'],
    coverImageUrl: ART_CANON_09,
    panelImageUrl: ART_CANON_09,
    whatHappened:
      'Aging big-game hunter Sergei Kravinoff shoots Spider-Man with a tranquilizer dart that puts him into a comatose state mimicking death. Kraven buries Peter alive in a cemetery vault, dons his costume, and prowls New York as a brutal Spider-Man to prove his absolute superiority before committing suicide.',
    canonFact:
      'Peter Parker remained buried alive six feet under soil for two full weeks. His undying love for his newly married wife Mary Jane was the psychological anchor that allowed him to fight through hallucinations and claw his way to the surface.',
    whyItMatters:
      'Regarded by critics as one of the greatest comic book storylines ever written, J.M. DeMatteis and Mike Zeck elevated a B-list villain into a tragic, Shakespearean figure and explored mortality with unprecedented literary depth.',
    importantCharacters: ['Peter Parker', 'Sergei Kravinoff (Kraven)', 'Mary Jane Watson', 'Vermin'],
    villainAntagonist: 'Kraven the Hunter',
    soundEffect: 'THUMP-THUMP...',
    speechQuote: {
      text: "They think I am a dead thing in the dirt. But they don't know who I love. They don't know who is waiting for me!",
      speaker: 'Spider-Man',
      caption: 'Clawing out of Kraven’s Grave'
    },
    editorialSecret:
      'Writer J.M. DeMatteis originally pitched the story for Wonder Man, then for Batman with the Joker as the hunter. Both DC and Marvel passed before DeMatteis tweaked the hunter into Kraven and paired him with the recently wedded Spider-Man.',
    verifiedBy: 'Kravinoff Estate Dossier & Police Report'
  },
  {
    id: 'canon-10',
    eventNumber: '10',
    title: 'THE CLONE SAGA',
    comicStoryline: 'The Web of Ben Reilly',
    keyIssue: 'Web of Spider-Man #117 / ASM #400 (October 1994 - December 1996)',
    publicationEra: '1994 • Modern Age',
    year: 1994,
    importanceRank: 6,
    universe: 'Earth-616',
    universeTag: 'PRIME CONTINUITY',
    isMainCanon: true,
    statusBadge: 'CANON_CONFIRMED',
    categories: ['LEGACY', 'MAJOR_EVENTS'],
    coverImageUrl: ART_CANON_10,
    panelImageUrl: ART_CANON_10,
    whatHappened:
      'Ben Reilly, the clone of Peter Parker created by Professor Miles Warren (The Jackal) in the 1970s, returns to New York after five years in exile. Deceptive lab tests orchestrated by Norman Osborn falsely convince Peter that he is actually the clone and Ben Reilly is the original Peter Parker.',
    canonFact:
      'Ben Reilly took his alias from Uncle Ben’s first name and Aunt May’s maiden name (Reilly). As the Scarlet Spider, he debuted the iconic sleeveless blue hoodie costume and impact web-shooters.',
    whyItMatters:
      'Despite editorial turmoil and sprawling tie-ins, the Clone Saga introduced beloved characters (Ben Reilly, Kaine Parker) and tested Peter Parker’s core identity more than any other story arc.',
    importantCharacters: ['Peter Parker', 'Ben Reilly (Scarlet Spider)', 'Kaine Parker', 'The Jackal', 'Mary Jane'],
    villainAntagonist: 'The Jackal (Miles Warren) & Norman Osborn',
    soundEffect: 'THWIP-SNAP!',
    speechQuote: {
      text: "Even if I'm not the original... the blood in my veins still remembers Uncle Ben!",
      speaker: 'Ben Reilly',
      caption: 'Roofs of Lower Manhattan'
    },
    editorialSecret:
      'The storyline was originally intended to conclude within six months by restoring Peter and handing the mantle to Ben so Peter could raise a family. However, runaway comic sales led Marvel executives to demand endless extensions for over two years!',
    verifiedBy: 'Jackal Genetics Laboratory Specimen #002'
  },
  {
    id: 'canon-11',
    eventNumber: '11',
    title: 'THE SPIDER-ISLAND EVENT',
    comicStoryline: 'Infestation in Manhattan',
    keyIssue: 'The Amazing Spider-Man #666-673 (August-November 2011)',
    publicationEra: '2011 • Modern Age',
    year: 2011,
    importanceRank: 7,
    universe: 'Earth-616',
    universeTag: 'PRIME CONTINUITY',
    isMainCanon: true,
    statusBadge: 'CANON_CONFIRMED',
    categories: ['MAJOR_EVENTS', 'ALLIES'],
    coverImageUrl: ART_CANON_11,
    panelImageUrl: ART_CANON_11,
    whatHappened:
      'The Jackal and the Spider-Queen release genetically altered bedbugs throughout Manhattan, gifting several million ordinary citizens—including Mary Jane, J. Jonah Jameson, and high schoolers—the exact superpowers of Spider-Man, before the mutation turns them into giant arachnids.',
    canonFact:
      'Because every citizen possessed spider-powers, Peter could not stand out with superpowers alone. Instead, he led the defense using his high-level chemistry intellect, martial arts (Way of the Spider), and leadership skills to cure the entire city.',
    whyItMatters:
      'It proved that what truly makes Peter Parker a hero is not wall-crawling or superhuman strength, but his indomitable heart, selflessness, and strategic genius under pressure.',
    importantCharacters: ['Peter Parker', 'Mary Jane Watson', 'Kaine', 'Spider-Queen', 'Agent Venom (Flash Thompson)'],
    villainAntagonist: 'The Spider-Queen (Adriana Soria) & The Jackal',
    soundEffect: 'WHOOSH-THWIP!',
    speechQuote: {
      text: "Everyone in New York has spider-powers today. Which means I finally don't have to hold back!",
      speaker: 'Spider-Man',
      caption: 'Times Square Quarantine Zone'
    },
    editorialSecret:
      'Dan Slott came up with the premise when pondering what would happen if J. Jonah Jameson had to swing on a web to save his own life—giving Jameson hilarious full-costumed spider-powers during the crisis!',
    verifiedBy: 'Horizon Labs Diagnostic Quarantine #616-ISLAND'
  },
  {
    id: 'canon-12',
    eventNumber: '12',
    title: 'DEATH OF CAPTAIN GEORGE STACY',
    comicStoryline: 'And Death Shall Come!',
    keyIssue: 'The Amazing Spider-Man #90 (November 1970)',
    publicationEra: '1970 • Bronze Age',
    year: 1970,
    importanceRank: 5,
    universe: 'Earth-616',
    universeTag: 'PRIME CONTINUITY',
    isMainCanon: true,
    statusBadge: 'CANON_CONFIRMED',
    categories: ['LOSS', 'ALLIES'],
    coverImageUrl: CHAR_UNCLE_BEN,
    panelImageUrl: CHAR_UNCLE_BEN,
    whatHappened:
      'During a roof collapse triggered by Spider-Man’s battle with Doctor Octopus, retired police captain George Stacy dives across a sidewalk to push a small child out of the path of falling masonry, suffering crushing fatal injuries.',
    canonFact:
      'In his dying moments in Peter’s arms, Captain Stacy whispers: "Be good to her, son! She loves you so very much... Peter." He had deduced Peter’s secret identity months earlier through detective observation!',
    whyItMatters:
      'Captain Stacy’s dying wish burdened Peter with the sworn duty to protect Gwen Stacy, making her subsequent death three years later in issue #121 twice as devastating to Peter’s conscience.',
    importantCharacters: ['Peter Parker', 'Captain George Stacy', 'Gwen Stacy'],
    villainAntagonist: 'Doctor Octopus (Otto Octavius)',
    soundEffect: 'CRUMBLE-CRASH!',
    speechQuote: {
      text: "Take care of my Gwen, Peter... She loves you... more than you will ever know...",
      speaker: 'Captain George Stacy',
      caption: '42nd Street Sidewalk'
    },
    editorialSecret:
      'Stan Lee initially did not want to kill Captain Stacy, but writer Gerry Conway and artists John Romita Sr. felt the comic needed real emotional stakes that police procedurals possessed.',
    verifiedBy: 'NYPD Memorial Commendation #STACY-1970'
  },
  {
    id: 'canon-13',
    eventNumber: '13',
    title: 'SPIDER-MAN: NO MORE!',
    comicStoryline: 'The Burden of the Mask',
    keyIssue: 'The Amazing Spider-Man #50 (July 1967)',
    publicationEra: '1967 • Silver Age',
    year: 1967,
    importanceRank: 6,
    universe: 'Earth-616',
    universeTag: 'PRIME CONTINUITY',
    isMainCanon: true,
    statusBadge: 'CANON_CONFIRMED',
    categories: ['MAJOR_EVENTS', 'ORIGIN'],
    coverImageUrl: CHAR_PETER_616,
    panelImageUrl: CHAR_PETER_616,
    whatHappened:
      'Exhausted by failing college grades at ESU, Aunt May’s medical bills, and constant libel from the Daily Bugle, Peter dumps his costume into a rainy alley trash can, walking away into the night to live an ordinary civilian life.',
    canonFact:
      'The iconic splash cover of Peter walking away while Spider-Man’s face looms in the sky is one of the top five most homaged and parodied comic book covers in history, famously adapted by Sam Raimi in Spider-Man 2 (2004).',
    whyItMatters:
      'When an elderly night watchman is attacked by hoodlums, Peter instinctively steps in to help. He realizes the costume is not what makes him Spider-Man; his moral instinct will never allow him to turn away.',
    importantCharacters: ['Peter Parker', 'Aunt May', 'J. Jonah Jameson', 'Kingpin (Wilson Fisk)'],
    villainAntagonist: 'Kingpin (First Appearance in this Issue!)',
    soundEffect: 'SPLASH...',
    speechQuote: {
      text: "Spider-Man is no more! I want a life of my own, free from the web!",
      speaker: 'Peter Parker',
      caption: 'Rainy Alley behind Midtown Manhattan'
    },
    editorialSecret:
      'This landmark issue marked the very first appearance of Wilson Fisk, The Kingpin of Crime, created by Stan Lee and John Romita Sr. as an imposing physical powerhouse modeled after actor Sydney Greenstreet.',
    verifiedBy: 'Marvel Masterworks Archive Issue #50'
  },
  {
    id: 'canon-14',
    eventNumber: '14',
    title: 'THE WEDDING OF PETER AND MARY JANE',
    comicStoryline: 'Till Death Do Us Part',
    keyIssue: 'The Amazing Spider-Man Annual #21 (June 1987)',
    publicationEra: '1987 • Copper Age',
    year: 1987,
    importanceRank: 4,
    universe: 'Earth-616',
    universeTag: 'PRIME CONTINUITY',
    isMainCanon: true,
    statusBadge: 'CANON_CONFIRMED',
    categories: ['ALLIES', 'LEGACY'],
    coverImageUrl: CHAR_MARY_JANE,
    panelImageUrl: CHAR_MARY_JANE,
    whatHappened:
      'After years of on-and-off friendship and mutual secrets, Mary Jane Watson reveals she has known Peter is Spider-Man since the night Uncle Ben died. Convinced their souls are bonded, the two tie the knot at City Hall surrounded by family and friends.',
    canonFact:
      'To celebrate the comic event, Marvel held a real-life public mock wedding ceremony at Shea Stadium in New York City with live actors in front of 45,000 baseball fans, officiated by Stan Lee himself!',
    whyItMatters:
      'The marriage redefined Peter Parker from an isolated, perpetually stressed bachelor into an emotionally supported husband, grounding the comic in a mature, beloved relationship that lasted twenty real-world years.',
    importantCharacters: ['Peter Parker', 'Mary Jane Watson', 'Aunt May', 'Anna Watson', 'Flash Thompson'],
    soundEffect: 'CHIME-RING!',
    speechQuote: {
      text: "Face it, Tiger... you just hit the jackpot for the rest of your life.",
      speaker: 'Mary Jane Watson-Parker',
      caption: 'City Hall Wedding Steps'
    },
    editorialSecret:
      'Renowned fashion designer Willi Smith custom designed Mary Jane’s iconic off-the-shoulder wedding gown both for the real-life Shea Stadium ceremony and the illustrated comic pages drawn by Paul Ryan.',
    verifiedBy: 'New York City Department of Records Marriage Registry'
  },
  {
    id: 'canon-15',
    eventNumber: '15',
    title: 'MAXIMUM CARNAGE',
    comicStoryline: 'Symbiote Bloodbath',
    keyIssue: 'Spider-Man Unlimited #1 / 14-Part Crossover (May-August 1993)',
    publicationEra: '1993 • Modern Age',
    year: 1993,
    importanceRank: 6,
    universe: 'Earth-616',
    universeTag: 'PRIME CONTINUITY',
    isMainCanon: true,
    statusBadge: 'CANON_CONFIRMED',
    categories: ['VILLAINS', 'MAJOR_EVENTS'],
    coverImageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=700&auto=format&fit=crop&q=80',
    panelImageUrl: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=700&auto=format&fit=crop&q=80',
    whatHappened:
      'Deranged serial killer Cletus Kasady bonds with the offspring of the Venom symbiote, becoming the crimson monstrosity Carnage. Escaping Ravencroft Asylum, he unites a psychotic "family" (Shriek, Doppelganger, Demogoblin, Carrion) to paint Manhattan red, forcing Spider-Man into a desperate truce with his hated enemy Venom.',
    canonFact:
      'Carnage’s symbiote is bonded to Cletus Kasady’s bloodstream at a cellular level, making the alien red because it incorporates Kasady’s actual hemoglobin. It is virtually impossible to separate them without lethal trauma.',
    whyItMatters:
      'The blockbuster 14-part crossover became a definitive 1990s comic milestone, adapted into a legendary 16-bit video game with a red cartridge, and tested Spider-Man’s code against lethal force.',
    importantCharacters: ['Peter Parker', 'Eddie Brock (Venom)', 'Black Cat', 'Cloak & Dagger', 'Captain America'],
    villainAntagonist: 'Carnage (Cletus Kasady)',
    soundEffect: 'SHRRREEEIK!',
    speechQuote: {
      text: "Chaos is the only true law of the universe! And I am the master of chaos!",
      speaker: 'Carnage',
      caption: 'Overlooking Madison Square Massacre'
    },
    editorialSecret:
      'LJN manufactured the Super Nintendo and Sega Genesis video game adaptation in an all-red plastic cartridge, a marketing sensation that sold millions of copies and solidified Carnage in gaming folklore.',
    verifiedBy: 'Ravencroft Institute Maximum Security Wing Breach Report'
  },
  {
    id: 'canon-16',
    eventNumber: '16',
    title: 'THE DEATH OF ULTIMATE SPIDER-MAN',
    comicStoryline: 'The Death of Spider-Man (Earth-1610)',
    keyIssue: 'Ultimate Spider-Man #160 (June 2011)',
    publicationEra: '2011 • Modern Age',
    year: 2011,
    importanceRank: 2,
    universe: 'Earth-1610',
    universeTag: 'EARTH-1610 (ULTIMATE)',
    isMainCanon: false,
    statusBadge: 'ALTERNATE_UNIVERSE',
    categories: ['LOSS', 'MULTIVERSE', 'LEGACY'],
    coverImageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=700&auto=format&fit=crop&q=80',
    panelImageUrl: 'https://images.unsplash.com/photo-1604200213928-ba3cf4fc8436?w=700&auto=format&fit=crop&q=80',
    whatHappened:
      'After taking a sniper bullet meant for Captain America, a bleeding 16-year-old Peter Parker rushes to Queens to protect his home from the Sinister Six. He uses his bare hands to crush a burning diesel truck down onto Norman Osborn before succumbing to his wounds in Aunt May’s arms.',
    canonFact:
      'This event strictly occurred on Earth-1610 (The Ultimate Universe) and did NOT kill main-timeline Earth-616 Peter Parker. Peter’s death was permanent for the Ultimate line, clearing the path for the birth of a brand new hero.',
    whyItMatters:
      'Peter died with a peaceful smile, whispering to Aunt May that while he couldn’t save Uncle Ben, he managed to save her. His heroic sacrifice directly inspired young Miles Morales to step out of the shadows.',
    importantCharacters: ['Peter Parker (1610)', 'Aunt May', 'Gwen Stacy', 'Mary Jane Watson', 'Miles Morales (Spectator)'],
    villainAntagonist: 'Norman Osborn (Ultimate Green Goblin)',
    soundEffect: 'KABOOOM!',
    speechQuote: {
      text: "It's okay... Aunt May... I couldn't save Uncle Ben... but I saved you. I got it right this time...",
      speaker: 'Peter Parker (Earth-1610)',
      caption: 'Lawn of the Parker Residence, Queens'
    },
    editorialSecret:
      'Brian Michael Bendis and Mark Bagley reunited for this heart-wrenching finale. Bags was sealed in polybags so the death would not leak before Wednesday morning delivery to comic shops.',
    verifiedBy: 'Earth-1610 Multiverse Observers Record #DEATH-160'
  },
  {
    id: 'canon-17',
    eventNumber: '17',
    title: 'MILES MORALES SUCCEEDS PETER PARKER',
    comicStoryline: 'A New Spider-Man Rises',
    keyIssue: 'Ultimate Fallout #4 (August 2011)',
    publicationEra: '2011 • Modern Age',
    year: 2011,
    importanceRank: 1,
    universe: 'Earth-1610',
    universeTag: 'EARTH-1610 & EARTH-616',
    isMainCanon: true,
    statusBadge: 'CANON_CONFIRMED',
    categories: ['ORIGIN', 'MULTIVERSE', 'LEGACY'],
    coverImageUrl: 'https://images.unsplash.com/photo-1604200213928-ba3cf4fc8436?w=700&auto=format&fit=crop&q=80',
    panelImageUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=700&auto=format&fit=crop&q=80',
    whatHappened:
      'Bitten by an escaped Oscorp genetically enhanced Oz spider (Specimen 42) smuggled in his uncle Aaron’s bag, Brooklyn middle-schooler Miles Morales witnesses Peter Parker’s death and is racked with guilt for not intervening. He dons a Halloween costume to save people before Nick Fury grants him his iconic red-and-black suit.',
    canonFact:
      'During 2015’s Secret Wars multiversal collapse, Miles handed a preserved three-week-old cheeseburger to the omnipotent Molecule Man. In gratitude, Molecule Man rebuilt the universe and migrated Miles, his mother Rio, and father Jefferson directly into core Earth-616 continuity!',
    whyItMatters:
      'Miles became a cultural phenomenon, introducing bio-electric Venom Blasts and camouflage invisibility, demonstrating that anyone regardless of background can embody Spider-Man.',
    importantCharacters: ['Miles Morales', 'Ganke Lee', 'Jefferson Davis', 'Rio Morales', 'Peter Parker (Mentor)'],
    villainAntagonist: 'The Prowler (Uncle Aaron Davis)',
    soundEffect: 'BZZZZT-ZAP!',
    speechQuote: {
      text: "I didn't ask for this power. But Peter died protecting people. I can't just hide anymore.",
      speaker: 'Miles Morales',
      caption: 'Brooklyn Rooftops'
    },
    editorialSecret:
      'Created by Brian Michael Bendis and Italian artist Sara Pichelli. Pichelli’s dynamic fluid pencil art and modern streetwear aesthetic turned Miles into an overnight cultural icon.',
    verifiedBy: 'S.H.I.E.L.D. Special Operative File #SPIDER-MILES-42'
  },
  {
    id: 'canon-18',
    eventNumber: '18',
    title: 'SPIDER-GWEN: RADIOACTIVE BITE ON EARTH-65',
    comicStoryline: 'Gwen Stacy: Spider-Woman',
    keyIssue: 'Edge of Spider-Verse #2 (September 2014)',
    publicationEra: '2014 • Modern Age',
    year: 2014,
    importanceRank: 3,
    universe: 'Earth-65',
    universeTag: 'EARTH-65 (GHOST-SPIDER)',
    isMainCanon: false,
    statusBadge: 'ALTERNATE_UNIVERSE',
    categories: ['ORIGIN', 'MULTIVERSE', 'ALLIES'],
    coverImageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=700&auto=format&fit=crop&q=80',
    panelImageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=700&auto=format&fit=crop&q=80',
    whatHappened:
      'In a reality where Gwen Stacy was bitten by the radioactive arachnid instead of Peter, high school drummer Gwen becomes Spider-Woman. Tragic irony strikes when an insecure Peter Parker uses genetic chemicals to turn into The Lizard to defend himself, dying in Gwen’s arms during a school dance battle.',
    canonFact:
      'On Earth-65, Gwen’s father Captain George Stacy leads the NYPD manhunt assigned to arrest Spider-Woman, believing she killed Peter Parker! Gwen was forced to unmask to her own father at gunpoint to prove her innocence.',
    whyItMatters:
      'Robbi Rodriguez’s hooded white, cyan, and magenta suit design ignited a global cosplay and merchandise craze, spinning out into a permanent solo comic series, animated movies, and band merchandise for The Mary Janes.',
    importantCharacters: ['Gwen Stacy (Ghost-Spider)', 'Captain George Stacy', 'Peter Parker (The Lizard)', 'Mary Jane Watson'],
    villainAntagonist: 'Peter Parker (Earth-65 Lizard) & Matt Murdock (Kingpin’s Lawyer)',
    soundEffect: 'THWIP-TAP-BEAT!',
    speechQuote: {
      text: "The mask isn't to hide who I am. It's to remind me of who I promised to protect.",
      speaker: 'Gwen Stacy (Earth-65)',
      caption: 'Subway Rafters, Earth-65'
    },
    editorialSecret:
      'Edge of Spider-Verse #2 went through five rapid reprints within two months due to unprecedented demand. Marvel quickly commissioned a full ongoing series by Jason Latour and Robbi Rodriguez.',
    verifiedBy: 'Web of Life & Destiny Earth-65 Strand #GWEN'
  },
  {
    id: 'canon-19',
    eventNumber: '19',
    title: 'SUPERIOR SPIDER-MAN: OTTO’S REDEMPTION',
    comicStoryline: 'Dying Wish & The Superior Reign',
    keyIssue: 'Amazing Spider-Man #700 / Superior Spider-Man #1-31 (2012-2014)',
    publicationEra: '2013 • Modern Age',
    year: 2013,
    importanceRank: 3,
    universe: 'Earth-616',
    universeTag: 'PRIME CONTINUITY',
    isMainCanon: true,
    statusBadge: 'CANON_CONFIRMED',
    categories: ['VILLAINS', 'LEGACY', 'MAJOR_EVENTS'],
    coverImageUrl: 'https://images.unsplash.com/photo-1635863138275-d9b33299680b?w=700&auto=format&fit=crop&q=80',
    panelImageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=700&auto=format&fit=crop&q=80',
    whatHappened:
      'Dying of terminal cancer, Doctor Octopus uses an Octo-bot to swap consciousnesses with Peter Parker. But as Peter dies in Otto’s broken body, he floods Otto’s mind with all his memories of love, loss, and responsibility. Overwhelmed, Otto vows to honor Peter’s legacy as a "Superior" Spider-Man with spider-bots and brutal efficiency.',
    canonFact:
      'During his reign as Spider-Man, Otto earned Peter Parker his long-delayed doctorate degree from Empire State University and founded Parker Industries, a multibillion-dollar global tech conglomerate!',
    whyItMatters:
      'When the Green Goblin took Otto’s love Anna Maria Marconi hostage, Otto admitted his tactical arrogance was inferior to Peter’s genuine heroic heart, willingly erasing his own consciousness so Peter Parker could return.',
    importantCharacters: ['Doctor Octopus (Otto Octavius)', 'Peter Parker', 'Anna Maria Marconi', 'Green Goblin'],
    villainAntagonist: 'Doctor Octopus / Goblin Underground',
    soundEffect: 'CLANK-THWIP!',
    speechQuote: {
      text: "You are the Superior Spider-Man, Peter. You always were. Now save the woman I love.",
      speaker: 'Otto Octavius',
      caption: 'Inside Peter Parker’s Mindscape'
    },
    editorialSecret:
      'Writer Dan Slott received actual death threats from angry fans when Amazing Spider-Man #700 came out, but by the time Otto sacrificed himself in Superior Spider-Man #31, fans were weeping and demanding Otto’s return!',
    verifiedBy: 'Parker Industries Neural Backup Log #OCTAVIUS'
  },
  {
    id: 'canon-20',
    eventNumber: '20',
    title: 'SPIDER-VERSE: THE GREAT WEB CONVERGENCE',
    comicStoryline: 'Gathering of Every Spider-Totem',
    keyIssue: 'Amazing Spider-Man Vol. 3 #9-15 (November 2014 - February 2015)',
    publicationEra: '2014 • Modern Age',
    year: 2014,
    importanceRank: 2,
    universe: 'Earth-616',
    universeTag: 'MULTIVERSE CORE',
    isMainCanon: true,
    statusBadge: 'CANON_CONFIRMED',
    categories: ['MULTIVERSE', 'MAJOR_EVENTS', 'LEGACY'],
    coverImageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=700&auto=format&fit=crop&q=80',
    panelImageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=700&auto=format&fit=crop&q=80',
    whatHappened:
      'The vampiric family known as The Inheritors, led by Morlun and Lord Solus, hunt and feast upon Spider-Totems across all dimensions. Guided by Madame Web and Master Weaver along the Web of Life and Destiny, Earth-616 Peter Parker is chosen as the supreme field commander to unite hundreds of alternate Spider-Men to survive extinction.',
    canonFact:
      'Spider-Verse introduced dozens of brand-new characters who became worldwide icons, including Spider-Punk (Hobie Brown), Peni Parker & SP//dr, and Spider-UK (Billy Braddock), inspiring Sony’s Oscar-winning animated film Into the Spider-Verse!',
    whyItMatters:
      'It established the mystical Web of Life and Destiny as the cosmic backbone connecting all Spider-Heroes across all dimensions, with Earth-616 Peter acknowledged by all variations as the greatest among them.',
    importantCharacters: ['Peter Parker (616)', 'Miles Morales', 'Spider-Gwen', 'Miguel O\'Hara', 'Spider-Ham', 'Hobie Brown'],
    villainAntagonist: 'Morlun & The Inheritors (Solus, Daemos, Jennix, Brix)',
    soundEffect: 'THWIP-MULTIVERSE!',
    speechQuote: {
      text: "Every universe. Every timeline. Every Spider-Man who ever swung a web... We stand together, or we die alone!",
      speaker: 'Peter Parker (Earth-616 Commander)',
      caption: 'Loomworld Final Stand'
    },
    editorialSecret:
      'Marvel had to obtain special permissions to feature obscure alternate versions, including the Japanese Toei TV series Spider-Man (Takuya Yamashiro) and his giant flying robot Leopardon!',
    verifiedBy: 'Master Weaver Cosmic Loom Tapestry #ALL-SPIDERS'
  },
  {
    id: 'canon-21',
    eventNumber: '21',
    title: 'SPIDER-MAN 2099: NUEVA YORK’S GUARDIAN',
    comicStoryline: 'Midnight in the Cyberpunk Future',
    keyIssue: 'Spider-Man 2099 #1 (November 1992)',
    publicationEra: '1992 • Modern Age',
    year: 1992,
    importanceRank: 4,
    universe: 'Earth-928',
    universeTag: 'EARTH-928 (2099)',
    isMainCanon: false,
    statusBadge: 'ALTERNATE_UNIVERSE',
    categories: ['ORIGIN', 'MULTIVERSE'],
    coverImageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=700&auto=format&fit=crop&q=80',
    panelImageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=700&auto=format&fit=crop&q=80',
    whatHappened:
      'In dystopian Nueva York in the year 2099, brilliant Alchemax geneticist Miguel O\'Hara is covertly hooked on an addictive corporate narcotic by his boss Tyler Stone. When Miguel tries to rewrite his DNA to cure himself, a jealous rival sabotages the machine, splicing 50% spider genetic code into his system.',
    canonFact:
      'Unlike Peter Parker, Miguel O’Hara does not possess a Spider-Sense! Instead, he compensates with accelerated optical vision, organic talons on his fingers and toes, and venomous fangs that secrete paralyzing venom.',
    whyItMatters:
      'Miguel launched the entire Marvel 2099 line and later became the multiverse’s stoic protector, anchoring the Spider-Society and monitoring canon events to prevent timeline collapses.',
    importantCharacters: ['Miguel O\'Hara (2099)', 'Lyla (Holographic AI)', 'Tyler Stone', 'Gabriel O\'Hara'],
    villainAntagonist: 'Tyler Stone & The Alchemax Mega-Corporation',
    soundEffect: 'TALON-SLASH!',
    speechQuote: {
      text: "Nueva York doesn't need another cop owned by Alchemax. It needs a Spider-Man.",
      speaker: 'Miguel O\'Hara',
      caption: 'Alchemax Tower Spire, Nueva York'
    },
    editorialSecret:
      'Writer Peter David and artist Rick Leonardi based Miguel’s dark blue and red costume on a traditional Day of the Dead festival skull design that Miguel originally bought for an annual party.',
    verifiedBy: 'Alchemax Genetic Modification Records #928-OHARA'
  },
  {
    id: 'canon-22',
    eventNumber: '22',
    title: 'ONE MORE DAY: THE MEPHISTO SACRIFICE',
    comicStoryline: 'The Cost of a Life',
    keyIssue: 'The Amazing Spider-Man #544-545 (November-December 2007)',
    publicationEra: '2007 • Modern Age',
    year: 2007,
    importanceRank: 5,
    universe: 'Earth-616',
    universeTag: 'PRIME CONTINUITY',
    isMainCanon: true,
    statusBadge: 'CANON_CONFIRMED',
    categories: ['LOSS', 'MAJOR_EVENTS'],
    coverImageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=700&auto=format&fit=crop&q=80',
    panelImageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=700&auto=format&fit=crop&q=80',
    whatHappened:
      'After Peter publicly unmasks during the Superhero Civil War, an assassin hired by the Kingpin shoots Aunt May. Facing her imminent death in the ICU, Peter and Mary Jane are approached by the demon lord Mephisto, who offers to heal Aunt May in exchange for erasing their marriage from history.',
    canonFact:
      'Mephisto refused Peter’s soul, stating that pure souls offered to him are ordinary; instead, he wanted their sacred love because destroying the greatest marriage in the universe would let him mock God for all eternity.',
    whyItMatters:
      'It remains one of the most hotly debated storylines in comic book history, resetting Peter Parker into a single bachelor and wiping his secret identity from the memory of the world.',
    importantCharacters: ['Peter Parker', 'Mary Jane Watson', 'Aunt May', 'Mephisto'],
    villainAntagonist: 'Mephisto (Lord of Lies)',
    soundEffect: 'FLAME-ROAR!',
    speechQuote: {
      text: "You will always be my husband, Peter. Even if the whole world forgets.",
      speaker: 'Mary Jane Watson',
      caption: 'Mephisto’s Realm of Shadows'
    },
    editorialSecret:
      'Marvel Editor-in-Chief Joe Quesada felt strongly that a married Peter Parker was unrelatable to younger readers and aged the character, leading to the controversial editorial decision to sever the marriage through supernatural means.',
    verifiedBy: 'Sanctum Sanctorum Multiverse Mystical Ledger #MEPHISTO-545'
  }
];
