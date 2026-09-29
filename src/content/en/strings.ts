/** Every UI string. Event text lives in events/; narrative phrases in narrative.ts. */
export const strings = {
  appTitle: 'Life Sim',
  tagline: 'One life. Many small choices.',
  newGame: 'New life',
  continue: 'Continue',
  compare: 'Previous lives',
  settings: 'Settings',
  back: 'Back',
  close: 'Close',

  nameTitle: 'What is this child\'s name?',
  namePlaceholder: 'Name',
  nameHint: 'Everything else about this life will be decided by chance.',
  begin: 'Begin',

  noticeTitle: 'Before you begin',
  noticeBody: 'This game may contain sensitive content such as loss, illness, family conflict, or neglect.',
  noticeSettingsHint: 'You can choose when to be warned in Settings.',
  noticeContinue: 'Continue',
  noticeExit: 'Exit',

  birthTitle: 'A life begins',
  next: 'Continue',
  bridgeTitle: 'Time passes',

  warnTitle: 'A sensitive moment',
  warnBody: {
    mild: 'The next moment touches on something that may be uncomfortable.',
    moderate: 'The next moment touches on something difficult, such as illness or fear.',
    heavy: 'The next moment deals with something heavy, such as loss or serious harm.',
  },
  readOn: 'Read on',
  skipEvent: 'Skip this moment',
  skipped: 'Skipped',

  lockedLabel: 'Not now',

  ageLabel: (months: number) => {
    if (months < 1) return 'Newborn';
    if (months < 24) return `${months} month${months === 1 ? '' : 's'}`;
    const y = Math.floor(months / 12);
    return `${y} years`;
  },

  stageCompleteTitle: 'Stage complete',
  chartTraits: 'Who they are becoming',
  chartOther: 'Stress and leanings',
  stressLabel: 'Stress',
  continueSoon: 'Continue (coming soon)',
  replay: 'Live another life',
  toTitle: 'Back to title',
  moments: 'Moments',

  compareTitle: 'Previous lives',
  compareEmpty: 'Finished lives will appear here, so you can compare them.',
  compareHint: 'Tap a life to show or hide it on the chart (up to 3).',
  clearLives: 'Forget all previous lives',
  clearLivesConfirm: 'Forget all previous lives? This cannot be undone.',

  settingsTitle: 'Settings',
  warningLevelLabel: 'Sensitive content warnings',
  warningLevels: { every: 'Warn every time', heavyOnly: 'Warn for heavy only', never: 'Never warn' },
  themeLabel: 'Theme',
  themes: { auto: 'Match device', light: 'Light', dark: 'Dark' },
  abandonLife: 'Abandon current life',
  abandonConfirm: 'Abandon this life? It cannot be recovered.',

  corruptSave: 'Your saved life could not be read, so it was cleared. You can start a new one.',
  confirmNewGame: 'Starting a new life will end the current one. Continue?',

  traitNames: {
    confidence: 'Confidence',
    curiosity: 'Curiosity',
    empathy: 'Empathy',
    discipline: 'Discipline',
    courage: 'Courage',
    trust: 'Trust',
    sociability: 'Sociability',
    creativity: 'Creativity',
  },
  inclinationNames: {
    artsLanguage: 'Arts & language',
    scienceMath: 'Science & math',
    physicalSports: 'Physical & sports',
    peopleHelping: 'Helping people',
    handsOnBusiness: 'Hands-on & business',
  },
  birthSummary: {
    wealth: { poor: 'Poor', middle: 'Middle', rich: 'Rich' },
    caregiver: {
      bothParents: 'Both parents',
      singleMother: 'Single mother',
      singleFather: 'Single father',
      grandparents: 'Grandparents',
      relatives: 'Relatives',
    },
    parenting: {
      indulgent: 'Indulgent',
      strict: 'Strict',
      neglectful: 'Stretched thin',
      freeRange: 'Free-range',
      warmBalanced: 'Warm',
    },
    environment: { city: 'City', rural: 'Village', suburb: 'Suburb', market: 'Market', farm: 'Farm' },
  },
  debugTitle: 'Debug (hidden values)',
};

export type Strings = typeof strings;
