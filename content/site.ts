// Everything the site says lives in this file. Edit text, numbers and links here;
// the components only decide how it looks. See README.md for how to add a chapter.

export type Link = { label: string; href: string };

export type Stat = {
  value: number;
  /** Shown after the counted number, e.g. "K+" or "+". */
  suffix?: string;
  /** Shown before the counted number, e.g. "$". */
  prefix?: string;
  label: string;
};

/** A photo or a short looping video shown with a chapter. Files live in public/media/. */
export type Media = {
  kind: "photo" | "video";
  src: string;
  /** Still frame shown before a video plays. */
  poster?: string;
  alt: string;
  caption?: string;
  /** The video has a soundtrack: it still autoplays muted, with a button to turn sound on. */
  sound?: boolean;
};

/** A post from X, shown as a card with its video playing inline. */
export type Post = {
  author: string;
  handle: string;
  avatar: string;
  verified?: boolean;
  text: string;
  url: string;
  /** ISO date the post went up. */
  date: string;
  /** Counts as they were when added to the site. */
  views: number;
  replies: number;
  reposts: number;
  likes: number;
  video: Media;
  /** Credit line shown under the card. */
  credit: string;
};

export type Chapter = {
  /** Used in the URL (#launch) and by the split timer. */
  id: string;
  /** Short name shown in the split timer. */
  split: string;
  /** When this part of the run happened, shown on the timer. */
  when: string;
  title: string;
  /** One paragraph per string. */
  story: string[];
  /** Short facts shown beside the story. */
  facts?: string[];
  stats?: Stat[];
  links?: Link[];
  /** Photos and clips for this chapter; the first one is shown largest. */
  media?: Media[];
  /** "carousel" shows the media as a moving strip you can drag, instead of a grid. */
  mediaLayout?: "grid" | "carousel";
  /** A post from X shown under the story. */
  post?: Post;
  /** Speedrun "gold split": a part of the run with a 1st-place finish. */
  gold?: boolean;
  /** Renders the chapter as the dark, full-width climax. Use for one chapter only. */
  feature?: boolean;
};

/** My projects' X accounts. Mentions of these names in the story and project list link here, with the logo. */
export type Brand = { name: string; x: string; logo: string };
export const brands: Brand[] = [
  { name: "Cryptara Conquest", x: "https://x.com/CryptaraConq", logo: "/media/logo-cryptara.jpg" },
  { name: "IntoTheVerse", x: "https://x.com/IntoTheVerse_", logo: "/media/logo-intotheverse.jpg" },
  { name: "Intrant Inferis", x: "https://x.com/IntrantInferis", logo: "/media/logo-intrant-inferis.jpg" },
  { name: "MetaMeadow Boomtown", x: "https://x.com/MetaBoomtown", logo: "/media/logo-metameadow.jpg" },
  { name: "Sushi Nads", x: "https://x.com/sushinads", logo: "/media/logo-sushinads.jpg" },
  { name: "Terrace", x: "https://x.com/terrace_social", logo: "/media/logo-terrace.jpg" },
];

export const profile = {
  name: "Elio Jordan Lopes",
  role: "Software engineer and game studio co-founder",
  location: "Dubai, UAE",
  intro:
    "I build games and the software around them. Since 2018 that has meant a computer science degree, a Web3 game studio, a launch that reached 13,000 players in six weeks, open-source tooling, and now a product I'm building on my own.",
  email: "lopeselio@gmail.com",
  github: "https://github.com/lopeselio",
  /** Shown with icons in the footer. */
  socials: [
    { label: "LinkedIn", href: "https://linkedin.com/in/lopeselio" },
    { label: "Instagram", href: "https://www.instagram.com/lopeselio_" },
  ] as Link[],
  cv: "/Elio_Jordan_Lopes_CV.pdf",
  portrait: { src: "/media/elio-portrait.jpg", alt: "Elio smiling beside a studio microphone." },
  links: [
    { label: "GitHub", href: "https://github.com/lopeselio" },
    { label: "LinkedIn", href: "https://linkedin.com/in/lopeselio" },
    { label: "X", href: "https://x.com/ElioCodes" },
  ] as Link[],
};

export const chapters: Chapter[] = [
  {
    id: "university",
    split: "University",
    when: "2018",
    title: "Computer science, and building outside class",
    story: [
      "I studied computer science at Vellore Institute of Technology and spent a lot of that time building outside class. I led web projects on the ACM-VIT board, won a Facebook SparkAR scholarship in 2020, and wrote three research papers.",
      "One of them came straight out of a hackathon project: a live-streaming service where viewers pay by the second, on Ethereum and IPFS. Springer published it in Wireless Networks.",
    ],
    facts: [
      "B.Tech, Computer Science and Engineering, CGPA 8.84",
      "Web Projects Lead, ACM-VIT board, 2018 to 2021",
      "3 published papers",
    ],
    links: [
      { label: "Springer paper", href: "https://doi.org/10.1007/s11276-022-03009-6" },
      { label: "JETIR paper", href: "https://www.jetir.org/papers/JETIR2110348.pdf" },
      { label: "IRJET paper", href: "https://www.irjet.net/archives/V8/i10/IRJET-V8I1086.pdf" },
    ],
  },
  {
    id: "hackathons",
    split: "Hackathons",
    when: "2021",
    title: "The year of freelance work and hackathons",
    story: [
      "In 2021 I started taking paid work and entering hackathons, often at the same time. I built React Native dashboards for Vidrona in the UK and wrote smart contract tests for Footium, a football management game on Arbitrum.",
      "Two hackathon projects from that year won prizes. NiftySubs, the pay-by-the-second streaming platform, won a Protocol Labs prize at ETHGlobal HackMoney. DAOInsure, crop insurance run by a DAO with a weather oracle I wrote, won Chainlink, Filecoin and Superfluid prizes at ETHIndia.",
    ],
    facts: ["Celo India Fellowship", "Protocol Labs developer grants"],
  },
  {
    id: "studio",
    split: "The studio",
    when: "Sep 2021",
    title: "Starting IntoTheVerse",
    story: [
      "In September 2021 I co-founded IntoTheVerse with Ramesh Sachan, my batchmate and friend from university: a game studio building on public blockchains. We were one of 6 teams picked out of 30 for Celo Camp Batch 4, raised from Flori Ventures and angel investors, and incorporated in Delaware in January 2022.",
      "I was CEO and CTO, which meant product, engineering and hiring. The team grew to 16 people working remotely, and we shipped games on Solana, Eclipse, Monad, Aptos, Algorand and Celo.",
    ],
    post: {
      author: "Indies On Solana",
      handle: "indiesonsolana",
      avatar: "/media/indies-on-solana-avatar.jpg",
      verified: true,
      text: "The best duo is bringing a game of skill to Solana @CryptaraConq",
      url: "https://x.com/indiesonsolana/status/1959964154275770734",
      date: "2025-08-25T13:00:43Z",
      views: 7715,
      replies: 14,
      reposts: 12,
      likes: 66,
      video: {
        kind: "video",
        src: "/media/indies-on-solana-story.mp4",
        poster: "/media/indies-on-solana-story-poster.jpg",
        alt: "Indies On Solana's short film about Elio and Ramesh: from university batchmates to building IntoTheVerse and Cryptara Conquest.",
        sound: true,
      },
      credit: "Film by Indies On Solana (@indiesonsolana), shot at the Indies On Solana villa, Vietnam, 2025.",
    },
    media: [
      {
        kind: "photo",
        src: "/media/celo-camp-demo-day.jpg",
        alt: "A live demo of our pixel-art game world on a video call, with a dialog asking the player to donate 2 cUSD to Impact Market.",
        caption: "Demoing our game at Celo Camp Batch 4 demo day, 2021",
      },
      {
        kind: "photo",
        src: "/media/flori-retreat.jpg",
        alt: "Elio and other founders talking in a circle at a retreat.",
        caption: "Flori founders' retreat, Mas Cabanyes, Catalonia, 2022",
      },
      {
        kind: "photo",
        src: "/media/flori-family.jpg",
        alt: "A large group photo of founders on a lawn in front of a Spanish estate.",
        caption: "The Flori founder family in Spain, 2022",
      },
      {
        kind: "photo",
        src: "/media/fil-singapore-2022.jpg",
        alt: "Elio standing in front of the FIL-Singapore 2022 backdrop, with Filecoin and Protocol Labs logos.",
        caption: "FIL-Singapore, September 2022",
      },
    ],
    facts: [
      "Celo Camp Batch 4, top 6 of 30",
      "Gitcoin Kernel Fellow, 2022",
      "SolanaU Web3 Accelerator, 2022",
      "Celo Foundation technical moderator for a 15K+ developer community",
    ],
  },
  {
    id: "wins",
    split: "Winning",
    when: "2023",
    title: "Shipping games in public, and winning with them",
    gold: true,
    story: [
      "IntoTheVerse took 1st place in the games track at Aptos Hack Singapore, where I presented the studio on stage. Cryptara Conquest took 1st place in the games track at the Solana Speedrun Game Jam. Intrant Inferis, our story-driven dungeon RPG for mobile, took 1st in the games track at the Solana Bonkathon, organised by Radiants DAO.",
      "We showed Intrant Inferis as a pre-alpha at Solana Breakpoint 2023 in Amsterdam, ran live playtests there, and launched it on mainnet in June 2024. MetaMeadow Boomtown, a town builder where caring for trees retires real carbon credits, won a Celo Foundation grant.",
      "Across more than 15 hackathon wins and grants, the studio raised over $250K without giving up any equity.",
    ],
    stats: [
      { value: 30, prefix: "$", suffix: "K", label: "1st place, Aptos Hack Singapore" },
      { value: 26, prefix: "$", suffix: "K", label: "1st place, Solana Speedrun Game Jam" },
      { value: 25, prefix: "$", suffix: "K", label: "1st place, Solana Bonkathon" },
      { value: 250, prefix: "$", suffix: "K+", label: "equity-free funding from 15+ wins and grants" },
    ],
    mediaLayout: "carousel",
    media: [
      {
        kind: "photo",
        src: "/media/aptos-hack-singapore-stage.jpg",
        alt: "Elio on stage presenting IntoTheVerse and its team on a big screen, with sponsor logos on either side.",
        caption: "Presenting IntoTheVerse at Aptos Hack Singapore, 2023",
      },
      {
        kind: "photo",
        src: "/media/aptos-hack-singapore-venue.jpg",
        alt: "Teams at laptops in a large dark hall under a glowing Hack Singapore sign.",
        caption: "The hall at Aptos Hack Singapore, 2023",
      },
      {
        kind: "photo",
        src: "/media/pitching-intrant-inferis.jpg",
        alt: "Elio at his desk with the Intrant Inferis logo on the monitor behind him.",
        caption: "Pitching Intrant Inferis",
      },
      {
        kind: "photo",
        src: "/media/team-zaanse-schans.jpg",
        alt: "Elio and two teammates waving in front of a windmill.",
        caption: "IntoTheVerse team trip, Zaanse Schans, 2023",
      },
      {
        kind: "photo",
        src: "/media/breakpoint-team.jpg",
        alt: "The IntoTheVerse team with other builders under the lights at Solana Breakpoint.",
        caption: "With the team at Solana Breakpoint, Amsterdam, 2023",
      },
      {
        kind: "photo",
        src: "/media/breakpoint-panel.jpg",
        alt: "Elio speaking on stage at Solana Breakpoint.",
        caption: "On a builders' panel at Breakpoint 2023",
      },
      {
        kind: "photo",
        src: "/media/intrant-inferis-breakpoint-booth.jpg",
        alt: "The Intrant Inferis booth: a banner, game T-shirts, stickers, a tablet feedback form and a laptop showing the game's logo.",
        caption: "Our Intrant Inferis booth at the Breakpoint 2023 community basecamp, getting feedback from players in person",
      },
      {
        kind: "photo",
        src: "/media/web3-gaming-week.jpg",
        alt: "Elio standing next to a Web3 Gaming Week banner with another builder.",
        caption: "Web3 Gaming Week, 2023",
      },
    ],
    links: [
      { label: "Breakpoint showcase on X", href: "https://x.com/IntrantInferis/status/1722908523082682508" },
      { label: "Intrant Inferis demo", href: "https://x.com/IntrantInferis/status/1800423242961662334" },
      { label: "MetaMeadow contracts", href: "https://github.com/IntoTheVerse/IntoTheVerse-Celo-Contracts" },
    ],
  },
  {
    id: "launch",
    split: "Launch",
    when: "Jan 2025",
    title: "Cryptara Conquest goes live",
    feature: true,
    gold: true,
    story: [
      "In January 2025 we launched Cryptara Conquest in the browser on Eclipse mainnet. It's a survival shooter that runs fully on-chain: a Unity client, Rust programs written with Anchor, and MagicBlock Ephemeral Rollups so the game can keep up in real time. I led the Unity client and the game design.",
      "These are the numbers from its first six weeks.",
    ],
    stats: [
      { value: 13, suffix: "K+", label: "unique players" },
      { value: 65, suffix: "K+", label: "game sessions" },
      { value: 500, suffix: "K+", label: "collectibles minted" },
      { value: 2, suffix: "M+", label: "on-chain transactions" },
      { value: 80, prefix: "$", suffix: "K", label: "revenue" },
    ],
    media: [
      {
        kind: "video",
        src: "/media/cryptara-gameplay.mp4",
        poster: "/media/cryptara-gameplay-poster.jpg",
        alt: "Cryptara Conquest gameplay: a pixel-art hero fights through a dungeon on a phone.",
        caption: "Cryptara Conquest gameplay",
      },
      {
        kind: "photo",
        src: "/media/cryptara-cover.jpg",
        alt: "Cryptara Conquest cover art: three pixel-art fighters with guns walk toward a glowing doorway under the game's logo.",
      },
      {
        kind: "photo",
        src: "/media/da-nang-booth.jpg",
        alt: "A visitor looks at the Cryptara Conquest booth, with the game on screen.",
        caption: "Our booth at Solana Summit, Da Nang, 2025",
      },
    ],
  },
  {
    id: "mobile",
    split: "Mobile and open source",
    when: "2026",
    title: "Taking it to phones, and fixing what was underneath",
    story: [
      "In June 2026 Cryptara Conquest came to Android through the Solana dApp Store for Seeker. Getting there meant fixing problems below the game, so I did it in the open: four merged contributions to MagicBlock's Solana.Unity-SDK, which brought the Solana Mobile Stack natively into Unity and put me 4th among the repository's contributors.",
      "On the game itself, I fixed a mainnet bug that had corrupted 94% of legacy session accounts, restored the leaderboard entries it damaged, and formally verified the program's safety rules with more than 100 theorems.",
      "The studio also shipped Sushi Nads that year, a cooking game on Monad where every delivery is scored on-chain. I wrote its contracts, its gasless backend and its Unity web3 layer.",
    ],
    stats: [
      { value: 1000, suffix: "+", label: "players on Seeker" },
      { value: 13000, suffix: "+", label: "hours played" },
      { value: 367, suffix: "K+", label: "on-chain transactions" },
    ],
    mediaLayout: "carousel",
    media: [
      {
        kind: "photo",
        src: "/media/building-cryptara-tavern.jpg",
        alt: "A hand holding a phone showing the Cryptara Conquest tavern, with the Unity editor on the monitor behind.",
        caption: "Building the game",
      },
      {
        kind: "video",
        src: "/media/sushi-nads-trailer.mp4",
        poster: "/media/sushi-nads-trailer-poster.jpg",
        alt: "Sushi Nads trailer: cartoon chefs, a mouse, a pig, a monkey and a purple character, cook sushi in a busy kitchen.",
        caption: "Sushi Nads, live at sushinads.fun",
      },
      {
        kind: "photo",
        src: "/media/fan-playing-cryptara.jpg",
        alt: "A phone running Cryptara Conquest beside a burger in a takeaway box.",
        caption: "A player's lunch break with Cryptara Conquest",
      },
      {
        kind: "photo",
        src: "/media/fan-playing-cryptara-dog.jpg",
        alt: "A phone running Cryptara Conquest on a bed, with a fluffy white dog lying beside it.",
        caption: "Cryptara Conquest, with company",
      },
      {
        kind: "video",
        src: "/media/seeker-pass.mp4",
        poster: "/media/seeker-pass-poster.jpg",
        alt: "The glowing Cryptara Conquest Seeker Pass card turning in the dark.",
        caption: "The Cryptara Conquest Seeker Pass",
      },
    ],
    links: [
      { label: "SDK contributions on X", href: "https://x.com/ElioCodes/status/2046933417737203760" },
      { label: "Play Sushi Nads", href: "https://sushinads.fun" },
    ],
  },
  {
    id: "terrace",
    split: "Terrace",
    when: "Apr 2026",
    title: "Terrace, built on my own",
    story: [
      "Terrace is a football prediction app for friends. You post a take in a match chat, and it becomes a bet your mates can back or fade, alongside 1v1 challenges, parlays and private leagues. I'm building all of it myself, from the Solidity contracts and Chainlink settlement to the app.",
      "I also published terrace-mcp, an open-source server that lets two people's AI assistants bet each other on a match, straight from the terminal.",
    ],
    stats: [
      { value: 340, suffix: "+", label: "markets created in the first 2 weeks" },
      { value: 1650, suffix: "+", label: "on-chain transactions" },
      { value: 7, label: "private leagues" },
    ],
    mediaLayout: "carousel",
    media: [
      {
        kind: "video",
        src: "/media/terrace-called-it.mp4",
        poster: "/media/terrace-called-it-poster.jpg",
        alt: "A match chat where one friend's call comes true, and Terrace turns it into a win.",
        caption: "Called it",
        sound: true,
      },
      {
        kind: "video",
        src: "/media/terrace-claude-v-claude.mp4",
        poster: "/media/terrace-claude-v-claude-poster.jpg",
        alt: "Two Claude chats betting each other on a football match through terrace-mcp.",
        caption: "Claude v Claude: AI assistants betting each other with terrace-mcp",
        sound: true,
      },
      {
        kind: "video",
        src: "/media/terrace-points.mp4",
        poster: "/media/terrace-points-poster.jpg",
        alt: "Terrace Points explained: rewards for playing, points for posting takes, and double points.",
        caption: "Terrace Points",
        sound: true,
      },
      {
        kind: "video",
        src: "/media/terrace-app-tour.mp4",
        poster: "/media/terrace-app-tour-poster.jpg",
        alt: "A tour of the Terrace app: passkey sign-in, backing a price, following fans, 1v1 challenges, private leagues and Chainlink settlement.",
        caption: "A quick tour of the app",
      },
      {
        kind: "video",
        src: "/media/terrace-any-take.mp4",
        poster: "/media/terrace-any-take-poster.jpg",
        alt: "An animation showing a chat message turning into a market that friends back or fade, settled by Chainlink.",
        caption: "How a take becomes a market",
      },
    ],
    links: [
      { label: "Play Terrace", href: "https://play.terrace.social" },
      { label: "Terrace demo", href: "https://x.com/ElioCodes/status/2112883327279796585" },
      { label: "terrace-mcp on npm", href: "https://www.npmjs.com/package/terrace-mcp" },
      { label: "terrace-mcp on GitHub", href: "https://github.com/lopeselio/terrace-mcp" },
    ],
  },
];

export type Work = { name: string; what: string; year: string; links: Link[] };

/** The full index of projects, shown after the story. Newest first. */
export const work: Work[] = [
  {
    name: "Terrace",
    what: "Football prediction app for friends, with on-chain settlement through Chainlink",
    year: "2026",
    links: [
      { label: "Play", href: "https://play.terrace.social" },
      { label: "Demo", href: "https://x.com/ElioCodes/status/2112883327279796585" },
      { label: "X", href: "https://x.com/terrace_social" },
    ],
  },
  {
    name: "terrace-mcp",
    what: "MCP server that lets AI assistants bet each other on football",
    year: "2026",
    links: [
      { label: "npm", href: "https://www.npmjs.com/package/terrace-mcp" },
      { label: "GitHub", href: "https://github.com/lopeselio/terrace-mcp" },
    ],
  },
  {
    name: "Solana.Unity-SDK",
    what: "Open-source contributions bringing the Solana Mobile Stack into Unity",
    year: "2026",
    links: [{ label: "Thread", href: "https://x.com/ElioCodes/status/2046933417737203760" }],
  },
  {
    name: "Sushi Nads",
    what: "Cooking game on Monad with gasless play and on-chain scoring",
    year: "2026",
    links: [
      { label: "Play", href: "https://sushinads.fun" },
      { label: "X", href: "https://x.com/sushinads" },
    ],
  },
  {
    name: "Cryptara Conquest",
    what: "Fully on-chain survival shooter on Solana and Eclipse",
    year: "2025",
    links: [
      { label: "X", href: "https://x.com/CryptaraConq" },
    ],
  },
  {
    name: "Alpha Streams and BlockStory",
    what: "Pay-per-answer crypto research with x402 on Solana, then Base",
    year: "2025",
    links: [
      { label: "Demo", href: "https://x.com/ElioCodes/status/1988504036996510063" },
      { label: "GitHub", href: "https://github.com/lopeselio/mallory/tree/alpha-streams-mallory-x402" },
      { label: "BlockStory", href: "https://github.com/lopeselio/blockstory-pay" },
    ],
  },
  {
    name: "Sigil",
    what: "On-chain gaming platform for Aptos: leaderboards, achievements, quests and gasless play, with a TypeScript SDK",
    year: "2025",
    links: [
      { label: "Console", href: "https://sigil-aptos-web-petra.vercel.app" },
      { label: "GitHub", href: "https://github.com/lopeselio/aptos-sigil" },
    ],
  },
  {
    name: "Intrant Inferis",
    what: "Story-driven dungeon RPG for mobile on Solana",
    year: "2024",
    links: [
      { label: "Demo", href: "https://x.com/IntrantInferis/status/1800423242961662334" },
      { label: "Backend", href: "https://github.com/IntoTheVerse/Intrant-Inferis-NodeJS" },
      { label: "X", href: "https://x.com/IntrantInferis" },
    ],
  },
  {
    name: "MetaMeadow Boomtown",
    what: "Town builder on Celo that retires real carbon credits",
    year: "2024",
    links: [
      { label: "Contracts", href: "https://github.com/IntoTheVerse/IntoTheVerse-Celo-Contracts" },
      { label: "X", href: "https://x.com/MetaBoomtown" },
    ],
  },
  {
    name: "LightningCELO",
    what: "Pay-by-the-second salary and subscription streams on Celo",
    year: "2022",
    links: [
      { label: "GitHub", href: "https://github.com/lopeselio/LightningCELO-EthCC" },
      { label: "Demo", href: "https://youtu.be/R0f7ebKkzVw" },
    ],
  },
  {
    name: "NiftySubs",
    what: "Pay-as-you-watch live streaming with Superfluid money streams, built at ETHGlobal HackMoney",
    year: "2021",
    links: [{ label: "Paper", href: "https://doi.org/10.1007/s11276-022-03009-6" }],
  },
  {
    name: "DAOInsure",
    what: "Crop insurance run by a DAO, with a custom Chainlink weather oracle",
    year: "2021",
    links: [],
  },
];

/** Photos from outside work, shown in the 3D ring before the contact section. */
export const moments: Media[] = [
  { kind: "photo", src: "/media/travel-amalfi.jpg", alt: "Elio taking a selfie above the colourful houses of Positano and the sea.", caption: "Amalfi Coast, Italy" },
  { kind: "photo", src: "/media/travel-rome.jpg", alt: "Elio in sunglasses and a beanie in front of the Colosseum.", caption: "Rome, 2023" },
  { kind: "photo", src: "/media/travel-jordaan.jpg", alt: "Elio standing by bikes on a canal bridge in Amsterdam.", caption: "The Jordaan, Amsterdam, 2023" },
  { kind: "photo", src: "/media/travel-dubai-desert.jpg", alt: "Elio silhouetted on a sand dune at sunset.", caption: "Desert safari, Dubai, 2024" },
  { kind: "photo", src: "/media/travel-netherlands.jpg", alt: "Elio by a lake in front of Dutch windmills.", caption: "The Netherlands, 2024" },
  { kind: "photo", src: "/media/travel-kazan-cathedral.jpg", alt: "Elio in front of a domed colonnade at dusk.", caption: "St Petersburg" },
  { kind: "photo", src: "/media/travel-hermitage.jpg", alt: "Elio on a white and gold palace staircase.", caption: "St Petersburg" },
  { kind: "photo", src: "/media/travel-tea-gardens.jpg", alt: "Elio crossing a rope bridge in front of green tea gardens.", caption: "Among the tea gardens" },
  { kind: "photo", src: "/media/riding-goa.jpg", alt: "Elio on a motorbike on an old iron bridge surrounded by palm trees.", caption: "Riding in Goa" },
  { kind: "photo", src: "/media/workshop-goa.jpg", alt: "Elio teaching with a microphone in front of a projected smart contract.", caption: "Teaching a smart contract workshop at The King's School, Goa" },
  { kind: "photo", src: "/media/gym.jpg", alt: "Elio loading weight plates onto a bar in the gym.", caption: "Fitness" },
  { kind: "photo", src: "/media/web3-gaming-week.jpg", alt: "Elio next to a Web3 Gaming Week banner.", caption: "Web3 Gaming Week, 2023" },
  { kind: "photo", src: "/media/breakpoint-team.jpg", alt: "A group of builders at Solana Breakpoint.", caption: "Breakpoint, 2023" },
  { kind: "photo", src: "/media/flori-retreat.jpg", alt: "Founders talking at a retreat.", caption: "Catalonia, 2022" },
];

/** Shown in the closing section. */
export const community = [
  "Member of Superteam India",
  "Chainlink Developer Expert, and hands-on workshops at BITS Pilani Goa, IIT Goa, Goa College of Engineering and Padre Conceição College of Engineering",
  "Technical moderator for the Celo Foundation's developer community",
];

export const closing = {
  title: "The run isn't finished",
  body: "If you're hiring, investing, or building something nearby, I'd like to hear from you.",
};
