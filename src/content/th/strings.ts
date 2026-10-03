import type { Strings } from '../en/strings';

/** ข้อความในหน้าจอทั้งหมด (ภาษาไทย). รูปแบบต้องตรงกับ en/strings.ts */
export const strings: Strings = {
  appTitle: 'Life Sim',
  tagline: 'หนึ่งชีวิต กับทางเลือกเล็ก ๆ อีกมากมาย',
  newGame: 'เริ่มชีวิตใหม่',
  continue: 'เล่นต่อ',
  compare: 'ชีวิตที่ผ่านมา',
  settings: 'ตั้งค่า',
  back: 'ย้อนกลับ',
  close: 'ปิด',

  nameTitle: 'เด็กคนนี้ชื่ออะไร',
  namePlaceholder: 'ชื่อ',
  nameHint: 'ส่วนอื่น ๆ ของชีวิตนี้ โชคชะตาจะเป็นผู้กำหนด',
  begin: 'เริ่มต้น',

  noticeTitle: 'ก่อนเริ่มเล่น',
  noticeBody: 'เกมนี้อาจมีเนื้อหาที่ละเอียดอ่อน เช่น การสูญเสีย ความเจ็บป่วย ความขัดแย้งในครอบครัว หรือการถูกละเลย',
  noticeSettingsHint: 'เลือกได้ว่าจะให้เตือนเมื่อไรในหน้าตั้งค่า',
  noticeContinue: 'ไปต่อ',
  noticeExit: 'ออก',

  birthTitle: 'ชีวิตหนึ่งเริ่มต้นขึ้น',
  next: 'ต่อไป',
  bridgeTitle: 'เวลาผ่านไป',

  warnTitle: 'ช่วงเวลาที่ละเอียดอ่อน',
  warnBody: {
    mild: 'ช่วงต่อไปมีเรื่องที่อาจทำให้รู้สึกไม่สบายใจเล็กน้อย',
    moderate: 'ช่วงต่อไปมีเรื่องที่ยาก เช่น ความเจ็บป่วยหรือความกลัว',
    heavy: 'ช่วงต่อไปมีเรื่องหนัก เช่น การสูญเสียหรืออันตรายร้ายแรง',
  },
  readOn: 'อ่านต่อ',
  skipEvent: 'ข้ามช่วงนี้',
  skipped: 'ข้ามแล้ว',

  lockedLabel: 'ยังไม่ใช่ตอนนี้',

  ageLabel: (months: number) => {
    if (months < 1) return 'แรกเกิด';
    if (months < 24) return `${months} เดือน`;
    return `${Math.floor(months / 12)} ขวบ`;
  },

  stageCompleteTitle: 'จบช่วงชีวิตนี้แล้ว',
  chartTraits: 'ตัวตนที่กำลังก่อร่าง',
  chartOther: 'ความเครียดและความสนใจ',
  stressLabel: 'ความเครียด',
  continueSoon: 'เล่นต่อ (เร็ว ๆ นี้)',
  replay: 'ใช้ชีวิตใหม่อีกครั้ง',
  toTitle: 'กลับหน้าแรก',
  moments: 'ช่วงเวลาสำคัญ',
  showTable: 'แสดงเป็นตาราง',

  compareTitle: 'ชีวิตที่ผ่านมา',
  compareEmpty: 'ชีวิตที่เล่นจบแล้วจะแสดงที่นี่ เพื่อให้เปรียบเทียบกันได้',
  compareHint: 'แตะชื่อเพื่อแสดงหรือซ่อนบนกราฟ (สูงสุด 3 คน)',
  clearLives: 'ลบชีวิตที่ผ่านมาทั้งหมด',
  clearLivesConfirm: 'ลบชีวิตที่ผ่านมาทั้งหมดใช่ไหม ย้อนกลับไม่ได้นะ',

  settingsTitle: 'ตั้งค่า',
  languageLabel: 'ภาษา',
  languages: { th: 'ไทย', en: 'English' },
  warningLevelLabel: 'การเตือนเนื้อหาละเอียดอ่อน',
  warningLevels: { every: 'เตือนทุกครั้ง', heavyOnly: 'เตือนเฉพาะเรื่องหนัก', never: 'ไม่ต้องเตือน' },
  themeLabel: 'ธีม',
  themes: { auto: 'ตามเครื่อง', light: 'สว่าง', dark: 'มืด' },
  abandonLife: 'ทิ้งชีวิตนี้',
  abandonConfirm: 'ทิ้งชีวิตนี้ใช่ไหม จะกู้คืนไม่ได้',

  corruptSave: 'อ่านข้อมูลที่บันทึกไว้ไม่ได้ จึงล้างทิ้งแล้ว เริ่มชีวิตใหม่ได้เลย',
  confirmNewGame: 'การเริ่มชีวิตใหม่จะจบชีวิตที่กำลังเล่นอยู่ ต้องการไปต่อไหม',

  traitNames: {
    confidence: 'ความมั่นใจ',
    curiosity: 'ความอยากรู้',
    empathy: 'ความเห็นใจ',
    discipline: 'ความมีวินัย',
    courage: 'ความกล้า',
    trust: 'ความไว้วางใจ',
    sociability: 'การเข้าสังคม',
    creativity: 'ความสร้างสรรค์',
  },
  inclinationNames: {
    artsLanguage: 'ศิลปะและภาษา',
    scienceMath: 'วิทย์และคณิต',
    physicalSports: 'กีฬาและการเคลื่อนไหว',
    peopleHelping: 'การช่วยเหลือผู้คน',
    handsOnBusiness: 'งานมือและค้าขาย',
  },
  birthSummary: {
    wealth: { poor: 'ยากจน', middle: 'ปานกลาง', rich: 'ร่ำรวย' },
    caregiver: {
      bothParents: 'พ่อแม่',
      singleMother: 'แม่เลี้ยงเดี่ยว',
      singleFather: 'พ่อเลี้ยงเดี่ยว',
      grandparents: 'ตายาย',
      relatives: 'ญาติ',
    },
    parenting: {
      indulgent: 'ตามใจ',
      strict: 'เข้มงวด',
      neglectful: 'เหนื่อยล้า',
      freeRange: 'ปล่อยให้เรียนรู้เอง',
      warmBalanced: 'อบอุ่น',
    },
    environment: { city: 'เมือง', rural: 'หมู่บ้าน', suburb: 'ชานเมือง', market: 'ตลาด', farm: 'ไร่นา' },
  },
  debugTitle: 'ดีบัก (ค่าที่ซ่อนอยู่)',
};
