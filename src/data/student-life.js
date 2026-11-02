// Student life at LNMIIT. Reviewed 2 November 2026; see SOURCES.md for each source.
// Student names and phone numbers on the source pages are left out on purpose: they
// change every year and are personal data. Each entry links to its official page instead.
export const gymkhanaSite = 'https://studentsgymkhana.lnmiit.ac.in';
export const gymkhanaPage = 'https://lnmiit.ac.in/recreation-wellness/';
export const brochure2015 =
  'https://lnmiit.ac.in/uploaded_files/Institute_Brochure_2015-16.pdf';

export const gymkhana = {
  philosophy: 'By the students, for the students, of the students.',
  purpose:
    'A forum for students, managed by students, through which they carry out extra-curricular activities that support their academic pursuits.',
  structure: [
    {
      title: 'General Body',
      text: 'Every registered student of the institute is a member. The Director is the Patron of the Gymkhana.',
    },
    {
      title: 'Executive',
      text: 'The President and the General Secretaries of the councils are elected directly by the General Body. The Convener of the Senate is elected by the Senate.',
    },
    {
      title: 'Senate',
      text: 'The elected representatives of each batch, and the students’ central representative, legislative and supervisory body. Its meetings are open to students as observers.',
    },
    {
      title: 'Standing committees',
      text: 'The Nominations Committee, the Committee of Students for Hostel Affairs (COSHA), the Students’ Placement Committee and the Finance Committee.',
    },
    {
      title: 'Annual elections',
      text: 'The constitution sets the annual Gymkhana election for around 20 January each year.',
    },
    {
      title: 'Faculty support',
      text: 'The Patron appoints a Chief Counselor from the faculty, and clubs have faculty mentors.',
    },
  ],
  contacts: [
    ['President', 'gym.president@lnmiit.ac.in'],
    ['Vice President', 'gym.vicepresident@lnmiit.ac.in'],
    ['Cultural Council', 'gsec.cultural@lnmiit.ac.in'],
    ['Science & Technology Council', 'gsec.science@lnmiit.ac.in'],
    ['Sports Council', 'gsec.sports@lnmiit.ac.in'],
    ['COSHA', 'cosha@lnmiit.ac.in'],
  ],
};

export const councils = [
  {
    id: 'cultural',
    name: 'Cultural Council',
    slug: 'cultural-council',
    text: 'A platform to learn, enjoy and showcase talent in dance, drama, music, fashion, arts and social initiatives.',
  },
  {
    id: 'sci-tech',
    name: 'Sci-Tech Council',
    slug: 'sci-tech-council',
    text: 'Stimulates the technical mindset of students through its clubs, projects and competitions.',
  },
  {
    id: 'sports',
    name: 'Sports Council',
    slug: 'sports-council',
    text: 'Organises and promotes sport on campus, and encourages students to compete at state and national level.',
  },
];

const UNDESCRIBED =
  'The official list names this club but does not describe it.';
const sport = (name) => `${name} on campus, under the Sports Council.`;

// The current list, in the order of the Student Gymkhana website. `focus` is only stated
// where a source supports it; add a line here when a club's activity is confirmed.
export const clubs = [
  {
    id: 'imagination',
    name: 'Imagination',
    council: 'cultural',
    mentor: 'Dr. Vikas Bajpai',
    focus:
      'Photography. Vivacity’s Kalakriti event exhibits the photographs of its members.',
    tags: 'photography film camera',
  },
  {
    id: 'capriccio',
    name: 'Capriccio',
    council: 'cultural',
    mentor: 'Dr. Joyeeta Singha',
    focus: UNDESCRIBED,
  },
  {
    id: 'fundoo',
    name: 'Fundoo',
    council: 'cultural',
    mentor: 'Dr. Mohit Makkar',
    focus: UNDESCRIBED,
  },
  {
    id: 'rendition',
    name: 'Rendition',
    council: 'cultural',
    mentor: 'Dr. Payel Pal',
    focus: UNDESCRIBED,
  },
  {
    id: 'vignette',
    name: 'Vignette',
    council: 'cultural',
    mentor: 'Dr. Joyeeta Singha',
    focus: UNDESCRIBED,
  },
  {
    id: 'aaveg',
    name: 'AAVEG',
    council: 'cultural',
    mentor: 'Dr. Mohit Makkar',
    focus: UNDESCRIBED,
  },
  {
    id: 'insignia',
    name: 'Insignia',
    council: 'cultural',
    mentor: 'Dr. Joyeeta Singha',
    focus: UNDESCRIBED,
  },
  {
    id: 'media-cell',
    name: 'Media Cell',
    council: 'cultural',
    mentor: 'Dr. Payel Pal',
    focus: 'Listed under the Cultural Council.',
    tags: 'media',
  },
  {
    id: 'sankalp',
    name: 'Sankalp',
    council: 'cultural',
    mentor: 'Dr. Amit Neogi',
    focus:
      'Social welfare and self-transformation: serving the poor and the needy to improve their quality of life and education.',
    tags: 'social service welfare volunteering',
  },
  {
    id: 'literary-committee',
    name: 'Literary Committee',
    council: 'cultural',
    mentor: 'Dr. Manju Dhariwal',
    focus:
      'A forum for views on current issues, through debates, elocution, extempore speeches and essay competitions.',
    tags: 'debate writing speaking reading magazine',
  },
  {
    id: 'phoenix',
    name: 'Phoenix',
    council: 'sci-tech',
    mentor: 'Dr. Atul Mishra',
    focus:
      'Electronics, robotics and related technologies, with divisions described as Robotics, Electronics, Embedded Systems and Quarks.',
    tags: 'robotics electronics embedded hardware',
  },
  {
    id: 'astronomy',
    name: 'Astronomy',
    council: 'sci-tech',
    mentor: 'Prof. Anupam Singh',
    focus:
      'Helps students learn about astronomy and fosters their interest in the subject.',
    tags: 'space stars science',
  },
  {
    id: 'cipher',
    name: 'Cipher',
    council: 'sci-tech',
    mentor: 'Dr. Mohit Gupta',
    focus: UNDESCRIBED,
  },
  {
    id: 'quizzinga',
    name: 'Quizzinga',
    council: 'sci-tech',
    mentor: 'Dr. Payel Pal',
    focus:
      'The quiz club. LNMIIT’s news pages report podium finishes at inter-college quizzes.',
    tags: 'quiz quizzing trivia',
  },
  {
    id: 'cybros',
    name: 'Cybros',
    council: 'sci-tech',
    mentor: 'Subrat K Dash',
    focus:
      'Computing and competitive programming, including the Enigma contest during Plinth.',
    tags: 'coding programming computing competitive',
  },
  {
    id: 'e-cell',
    name: 'E-Cell',
    council: 'sci-tech',
    mentor: 'Dr. Sheenu Jain',
    focus:
      'The Entrepreneurship Cell: startup culture, pitching, financial literacy and mentorship. It runs E-Summit.',
    tags: 'entrepreneurship startup business e-summit esummit shark tank',
  },
  {
    id: 'zenith',
    name: 'Zenith',
    council: 'sports',
    mentor: 'Nabyendu Das',
    focus: UNDESCRIBED,
  },
  ...[
    ['cricket', 'Cricket'],
    ['football', 'Football'],
    ['basketball', 'Basketball'],
    ['volleyball', 'Volleyball'],
    ['badminton', 'Badminton'],
    ['tennis', 'Tennis'],
    ['table-tennis', 'Table Tennis'],
    ['squash', 'Squash'],
    ['kabaddi', 'Kabaddi'],
    ['chess', 'Chess'],
    ['carrom', 'Carrom'],
  ].map(([id, name]) => ({
    id,
    name,
    council: 'sports',
    focus: sport(name),
    tags: 'sport game',
  })),
];

// `href` is the body's own official page.
export const studentBodies = [
  {
    name: 'GDG on Campus LNMIIT',
    kind: 'Student body',
    text: 'The campus chapter of Google Developer Groups. It also develops the Gymkhana, Vivacity, Plinth and Desportivos websites.',
    href: `${gymkhanaSite}/student-bodies/gdg-on-campus`,
  },
  {
    name: 'ACM LNMIIT Student Chapter',
    kind: 'Student body',
    text: 'The student chapter of the Association for Computing Machinery.',
    href: `${gymkhanaSite}/student-bodies/acm`,
  },
  {
    name: 'Alumni Association',
    kind: 'Student body',
    text: 'Connects current students with LNMIIT’s graduates.',
    href: `${gymkhanaSite}/student-bodies/alumni-association`,
  },
  {
    name: 'The Counselling Cell',
    kind: 'Student body',
    text: 'Supports student wellbeing and mental health.',
    href: `${gymkhanaSite}/student-bodies/the-counselling-cell`,
  },
  {
    name: 'IEEE Student Branch',
    kind: 'Professional chapter',
    text: 'Workshops, hackathons and expert talks since 2017, with an Antennas & Propagation Society chapter and a Robotics & Automation Society chapter.',
    href: 'https://ieee.lnmiit.ac.in/',
  },
  {
    name: 'ASME LNMIIT',
    kind: 'Professional chapter',
    text: 'The American Society of Mechanical Engineers student section, focused on the practical uses of what is taught in class.',
    href: 'https://asme.lnmiit.ac.in/',
  },
  {
    name: 'SAEINDIA LNMIIT',
    kind: 'Professional chapter',
    text: 'The Society of Automotive Engineers collegiate chapter, established in October 2015, with members from almost all departments.',
    href: 'https://saeindia.lnmiit.ac.in/',
  },
  {
    name: 'National Service Scheme',
    kind: 'Service',
    text: 'LNMIIT’s public self-disclosure lists a core committee for the NSS.',
    href: 'https://lnmiit.ac.in/uploaded_files/Core-Committe-constituted-NSS.pdf',
  },
];

// Named in the 2015–16 Institute Brochure or other official pages, but absent from the
// current Student Gymkhana list.
export const earlierActivities = [
  'Nirog Club (hygiene and healthy lifestyles)',
  'Innovation Club',
  'Movie Club',
  'Fitness Club',
  'ALMANAC technical journal',
  'Nth Degree annual magazine',
];
export const campusEvents = [
  ['Rubaroo', 'Freshers’ night'],
  ['Dance Premier League', 'Inter-house dance competition'],
  ['Gusto', 'Inter-house drama and fashion competition'],
  ['Mellownge', 'Inter-house music competition and war of DJs'],
  ['Nostalgia', 'Farewell for graduating students'],
];

export const eCellSite = 'https://ecell-lnmiit.vercel.app/';
export const eCellLinkedIn =
  'https://www.linkedin.com/company/entrepreneurship-cell-the-lnmiit';
export const eSummitOfficial =
  'https://lnmiit.ac.in/events/e-summit24-is-finally-here-at-lnmiit-jaipur/';
export const lceUrl = 'https://lnmiit.ac.in/coe/lce/';

export const eSummit = {
  intro:
    'E-Summit is the flagship annual event of LNMIIT’s Entrepreneurship Cell, planned and run by students. Student founders, investors and industry leaders share one stage, and the best ideas face real questions.',
  why: 'Most student ideas stay ideas. E-Summit puts them in front of people who can test, fund and mentor them, brings founders back to campus to share how they did it, and gives local and rural startups a crowd and direct access to investors.',
  program: [
    {
      title: 'Shark Tank LNM',
      text: 'The finale. Startups pitch live to a panel of investors, with a real ask and hard questions on the spot.',
    },
    {
      title: 'Ideathon',
      text: 'Teams take a real problem and defend their solution.',
    },
    {
      title: 'Startup Expo',
      text: 'Startups show their work to students, visitors and investors.',
    },
    {
      title: 'Biz Quiz',
      text: 'A business quiz that tests knowledge and quick thinking.',
    },
    {
      title: 'Speaker talks',
      text: 'Founders and industry leaders share what it took to build something.',
    },
    {
      title: 'Panel discussion',
      text: 'Business leaders in conversation on stage.',
    },
    {
      title: 'Workshops',
      text: 'Hands-on sessions on subjects such as Bitcoin and stock trading.',
    },
  ],
  // As reported by E-Cell; the source does not name the edition for these figures.
  stats: [
    ['10', 'startups pitched live at Shark Tank LNM'],
    ['₹5 cr+', 'funding reported from that pitching round'],
    ['5', 'investors on the panel'],
    ['950+', 'peak footfall at an E-Cell event'],
  ],
  investors: 'LVX, Anicut Capital, RVCF, Indicorn Angels and Wiingy',
  editions: [
    {
      year: '2027',
      title: 'E-Summit’27',
      status: 'Coming soon',
      text: 'E-Cell is planning the next edition and has invited startups to apply for Shark Tank LNMIIT 2027. Dates are not announced.',
    },
    {
      year: '2026',
      title: 'E-Summit’26',
      status: 'January 2026',
      text: 'Guest talks by Rishabh Jain (23 January), Ishan Sharma and Shark Tank India’s Shaily Mehrotra; a panel with Parveen Kumar Gupta, Dr. Sheenu Jhawar and Anirudh Kala; and Shark Tank LNM.',
    },
    {
      year: '2025',
      title: 'E-Summit’25',
      status: '15–16 February 2025',
      text: 'Talks by Sandeep Jain of GeeksforGeeks, CA Arpit Mittal and Dr. Vijender Chauhan, with an Ideathon, Startup Expo, Talkshow, Biz Quiz and Shark Tank LNM.',
    },
    {
      year: '2024',
      title: 'E-Summit’24',
      status: '2–4 February 2024',
      text: 'Announced on LNMIIT’s official events page, with Shark Tank, Biz Quiz, Startup Expo and Ideathon.',
    },
    {
      year: '2023',
      title: 'E-Summit',
      status: '2023',
      text: 'Held alongside sessions with other campus clubs, including GDSC LNMIIT.',
    },
  ],
  venueNote:
    'E-Cell’s website describes a three-day event at the Bhamashah Techno Hub, RIC Jaipur, while its posts for 2025 and 2026 place E-Summit at LNMIIT. Check the venue for each edition with E-Cell.',
};

export const eCellEvents = [
  {
    title: 'Market Moguls',
    text: 'A four-day simulated trading league with StockGro, for 300+ student traders.',
  },
  {
    title: 'Pitch Perfect',
    text: 'A competition where three random words become a pitch in a few minutes.',
  },
  {
    title: 'Vyaapar Catalyst',
    text: 'Members pair with real shop owners, then present their findings to judges.',
  },
  {
    title: 'Bitcoin India Tour',
    text: 'A session on Bitcoin and blockchain with Bitcoin Bharat, for 100+ attendees.',
  },
  {
    title: 'Sell with E-Cell',
    text: 'Student-run stalls in the Open Air Theatre, with more than 1,000 visitors.',
  },
];

// The five major events, in display order. E-Summit is the flagship.
// The brief named the fourth event "Dashboard". No LNMIIT source mentions one: LNMIIT's own
// site search finds nothing, and its event menu lists Vivacity, Plinth, Desportivos, MUN,
// LNM Hacks and TedX. Desportivos is the likely meaning, so confirm it; see SOURCES.md.
export const majorEvents = [
  {
    id: 'e-summit',
    flagship: true,
    name: 'E-Summit',
    kind: 'Flagship entrepreneurship summit',
    image: '/media/official/esummit-2026.webp',
    alt: 'The E-Summit’26 team and participants grouped in front of an E-Summit LNMIIT backdrop on campus',
    edition: 'Latest: E-Summit’26, January 2026. Next: E-Summit’27',
    summary:
      'LNMIIT’s startup culture meets real investors here. Planned and run by students of the Entrepreneurship Cell, E-Summit puts student founders, investors and industry leaders on one stage, where the best ideas face hard questions.',
    highlights: [
      'Shark Tank LNM',
      'Ideathon',
      'Startup Expo',
      'Speaker talks',
      'Panel discussion',
    ],
    about: [eSummit.intro, eSummit.why],
    stats: eSummit.stats,
    statsNote: `Figures as reported by E-Cell, which does not tie them to one edition. Investors named: ${eSummit.investors}.`,
    groups: [
      { title: 'What happens at E-Summit', items: eSummit.program },
      { title: 'More from E-Cell, all year', items: eCellEvents },
    ],
    editions: eSummit.editions,
    note: eSummit.venueNote,
    gallery: [
      {
        src: '/media/official/esummit-pitch.webp',
        alt: 'A presenter pitching to a seated audience in front of a projected slide',
        caption: 'A pitch at Shark Tank LNM, E-Summit’26.',
      },
      {
        src: '/media/official/esummit-ideathon.webp',
        alt: 'A presenter holding a microphone beside a blackboard reading Idea-thon',
        caption: 'The Ideathon at E-Summit’26.',
      },
    ],
    credit: 'Photographs from E-Cell’s website.',
    links: [
      { label: 'E-Cell website', href: eCellSite },
      { label: 'E-Cell on LinkedIn', href: eCellLinkedIn },
      { label: 'E-Summit’24 on lnmiit.ac.in', href: eSummitOfficial },
      { label: 'LNMIIT Centre for Entrepreneurship', href: lceUrl },
      { label: 'ecell@lnmiit.ac.in', href: 'mailto:ecell@lnmiit.ac.in' },
    ],
  },
  {
    id: 'vivacity',
    name: 'Vivacity',
    kind: 'Annual cultural fest',
    image: '/media/official/vivacity.webp',
    alt: 'A Vivacity’18 banner hanging beside a sponsor banner between the sandstone columns of an academic building',
    edition: 'Vivacity 2026: 6–8 February',
    summary:
      'The annual cultural fest of LNMIIT: music, dance, drama and exhibitions, staged in 2026 under the theme Anachronic Mélange.',
    highlights: ['Dance', 'Music', 'Drama', 'Speaking arts', 'Art'],
    about: [
      'Vivacity is the annual cultural fest of LNMIIT, a mix of music, dance, performances and exhibitions organised by students.',
      'Its 2026 theme, Anachronic Mélange, drew on Indian maximalism, truck art, retro Bollywood and folk traditions. In the words of its website, LNMIIT became a living stage where culture isn’t preserved, it’s performed.',
      'Past artists named on the Vivacity website include Amit Trivedi, Raftaar, Jubin Nautiyal, Darshan Raval, Mohit Chauhan and Asees Kaur.',
    ],
    groups: [
      {
        title: 'What happens at Vivacity',
        items: [
          {
            title: 'Dance',
            text: 'Razzmatazz, Taal Tarang, Street Dance, Let’s Tangle, Mudra and Pump It Up.',
          },
          {
            title: 'Music',
            text: 'Battle of Bands, Gully War, Bandish, Aaroh and Malhar.',
          },
          {
            title: 'Drama',
            text: 'Rangshala, Hunkaar street theatre, Mukhauta mime and Paddhati.',
          },
          {
            title: 'Speaking arts',
            text: 'Afreen poetry night, Dare to Spell, Duologue, Family Feud, Potpourii and the Spotlight open mic.',
          },
          {
            title: 'Photography and film',
            text: 'Image Hunt, Film Making, Kalakriti, Perspective, Photobooth and Pixels.',
          },
          {
            title: 'Art',
            text: 'Contrasto, Photoframeia, Splash, Tattoo Tales and Eclectic.',
          },
        ],
      },
    ],
    editions: [
      {
        year: '2026',
        title: 'Anachronic Mélange',
        status: '6–8 February 2026',
        text: 'The most recent edition, on the LNMIIT campus.',
      },
      {
        year: '2018',
        title: 'A 90s Affair',
        status: '2018',
        text: 'The theme shown on the Vivacity’18 banner in the photograph above.',
      },
    ],
    credit: 'Photograph from LNMIIT’s about page.',
    links: [
      { label: 'Vivacity website', href: 'https://vivacity.lnmiit.ac.in/' },
      {
        label: 'All Vivacity events',
        href: 'https://vivacity.lnmiit.ac.in/events',
      },
    ],
  },
  {
    id: 'plinth',
    name: 'Plinth',
    kind: 'Techno-management fest',
    image: '/media/official/plinth.webp',
    alt: 'Students in a packed room during a Plinth session, one filming on a tripod',
    edition: 'Plinth 2026: 23–25 January',
    summary:
      'LNMIIT’s annual techno-management convergence: 72 hours of AI, robotics and cybersecurity hackathons, plus a MUN and a talk series.',
    highlights: ['LNM Hacks', 'RoboWars', 'IUPC', 'Tech Expo', 'MUN'],
    about: [
      'Plinth is the premier annual techno-management convergence of LNMIIT, a place to build, compete and meet industry leaders.',
      'The 2026 edition, themed Cosmic Cassini, ran for 72 hours and went deep into AI, robotics and cybersecurity through hackathons, alongside a Model United Nations and a talk series. Campus clubs run its competitions.',
    ],
    groups: [
      {
        title: 'What happens at Plinth',
        items: [
          {
            title: 'Robotics, with Phoenix',
            text: 'RoboWars, RoboCup, RoboRace, Nitro Racing, Moto Boat, Robo Transporter, RC Plane, Drone Racing, Micro Mouse, Maze Solver and Tech Expo.',
          },
          {
            title: 'Programming, with Cybros',
            text: 'The inter-university programming contest IUPC, CP Duels, Coding Cascade, Enigma and Alice, Bob, Go!',
          },
          {
            title: 'Astronomy',
            text: 'Astromemia, StarPix and Brahmand.',
          },
          {
            title: 'Entrepreneurship, with E-Cell',
            text: 'Shark Tank and Ideathon.',
          },
          {
            title: 'Quizzing, with Quizzinga',
            text: 'IPL Auction, Cryptex and Brand Wagon.',
          },
          {
            title: 'Debate and diplomacy',
            text: 'Model United Nations, Change My Mind and Graffiti Wall.',
          },
        ],
      },
    ],
    editions: [
      {
        year: '2026',
        title: 'Cosmic Cassini',
        status: '23–25 January 2026',
        text: 'A 72-hour edition covering AI, robotics and cybersecurity.',
      },
      {
        year: '2018',
        title: 'Plinth’18',
        status: '19–21 January 2018',
        text: 'A three-day techno-management and literary fest, with an inter-university programming contest.',
      },
    ],
    credit: 'Photograph from LNMIIT’s about page.',
    links: [
      { label: 'Plinth website', href: 'https://plinth.lnmiit.ac.in/' },
      { label: 'plinth@lnmiit.ac.in', href: 'mailto:plinth@lnmiit.ac.in' },
    ],
  },
  {
    id: 'desportivos',
    name: 'Desportivos',
    kind: 'Annual sports fest',
    image: '/media/official/desportivos-basketball.webp',
    alt: 'Players jumping for a rebound during a floodlit Desportivos basketball match, with spectators behind',
    edition: 'Desportivos 2026: 30 January – 1 February',
    summary:
      'A three-day sports fest with athletes from across the country, plus LAN e-sports, music nights and a food festival.',
    highlights: ['Sports', 'E-sports', 'ProNite', 'Food festival'],
    about: [
      'Desportivos brings athletes from across the country to LNMIIT for three days of competition in sports and e-sports, with concerts and food stalls around the matches.',
      'Past ProNite artists named on its website include Seedhe Maut, Darshan Raval and Sartek.',
    ],
    groups: [
      {
        title: 'What happens at Desportivos',
        items: [
          {
            title: 'Sports',
            text: 'Its website names cricket, football, tennis and badminton. Its gallery also shows basketball, volleyball, kabaddi, chess, squash and table tennis.',
          },
          {
            title: 'E-sports',
            text: 'BGMI, FIFA and Smash Karts on LAN setups.',
          },
          {
            title: 'ProNite',
            text: 'Live concerts on the stage when the day’s matches end.',
          },
          {
            title: 'Food festival',
            text: 'Food stalls with a range of brands and cuisines.',
          },
        ],
      },
    ],
    editions: [
      {
        year: '2026',
        title: 'Desportivos 2026',
        status: '30 January – 1 February 2026',
        text: 'The most recent edition.',
      },
    ],
    gallery: [
      {
        src: '/media/official/desportivos-kabaddi.webp',
        alt: 'Kabaddi players tackling a raider on a blue and red court',
        caption: 'Kabaddi at Desportivos.',
      },
    ],
    credit: 'Photographs from the Desportivos gallery, marked by Imagination.',
    links: [
      {
        label: 'Desportivos website',
        href: 'https://desportivos.lnmiit.ac.in/',
      },
      { label: 'Rulebook', href: 'https://desportivos.lnmiit.ac.in/rulebook' },
      { label: 'Gallery', href: 'https://desportivos.lnmiit.ac.in/gallery' },
    ],
  },
  {
    id: 'tedx',
    name: 'TEDxLNMIIT',
    kind: 'Independently organised TED event',
    image: '/media/official/tedx-stage.webp',
    alt: 'A speaker on the red circle at TEDxLNMIIT, in front of a large TEDxLNMIIT screen',
    edition: 'Next: 10 January 2027, as listed on ted.com',
    summary:
      'A student-organised TEDx event that brings community leaders, innovators and changemakers to LNMIIT to share their ideas.',
    highlights: ['Live talks', 'Annual theme', 'Talks on YouTube'],
    about: [
      'TEDxLNMIIT is a student-organised event, listed on TED’s website as a university event in Jaipur, that brings together community leaders, innovators and changemakers to share their ideas.',
      'TEDx is TED’s program of local, self-organised events. This independent TEDx event is operated under license from TED.',
    ],
    groups: [
      {
        title: 'Speakers named on its websites',
        items: [
          {
            title: 'Forging the Future',
            text: 'Paritosh Anand, Arihant Jain, Sangeet Kumar, Mehek Malhotra, Samta Sudiksha, Mehtab Ali Niazi, Aishwarya Sridhar and Ash Akshay Goel.',
          },
          {
            title: 'Navigating the New',
            text: 'Anand Megalingam, Aabha Hanjura, Preksha Kaparwan, Shelly Jyoti, Dr. Lopa Mudraa, Dr. Kamna Chhibber and Dr. Ajay Data.',
          },
          {
            title: 'Bending the Basics',
            text: 'Dr. Tanu Jain, Riya Upreti, Krishnan Sunderarajan, Palakh Khanna, Chinmay Gaur, Deepak Pareek, Tejas Patil, Gunjan Saini and Sakshi Mandhyan.',
          },
        ],
      },
    ],
    editions: [
      {
        year: '2027',
        title: 'TEDxLNMIIT',
        status: '10 January 2027',
        text: 'Listed on TED’s website as an upcoming event, open to the public. No theme is listed yet.',
      },
      {
        year: '2026',
        title: 'Forging the Future',
        status: '11 January 2026',
        text: 'On shaping what comes next rather than adjusting to what already exists.',
      },
      {
        year: '2025',
        title: 'Navigating the New',
        status: '2025',
        text: 'On innovation, resilience and adapting to change.',
      },
      {
        year: '2024',
        title: 'Bending the Basics',
        status: '13 January 2024',
        text: 'On challenging what we assume to be true.',
      },
    ],
    gallery: [
      {
        src: '/media/official/tedx-foyer.webp',
        alt: 'Speaker banners lining a red carpet under draped fabric at TEDxLNMIIT',
        caption: 'Speaker banners from the Navigating the New edition.',
      },
    ],
    credit: 'Photographs from the TEDxLNMIIT gallery.',
    links: [
      { label: 'TEDxLNMIIT website', href: 'https://www.tedxlnmiit.in/' },
      {
        label: 'Upcoming event on ted.com',
        href: 'https://www.ted.com/tedx/events/71075',
      },
      {
        label: 'Talks on YouTube',
        href: 'https://www.youtube.com/@tedxlnmiit',
      },
      {
        label: 'tedxlnmiit@lnmiit.ac.in',
        href: 'mailto:tedxlnmiit@lnmiit.ac.in',
      },
    ],
  },
];
