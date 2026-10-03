import type { TextVars } from '../../engine/content';

/**
 * คำที่ใช้แทนตัวแปรในข้อความ ภาษาไทยมักเรียกซ้ำด้วยคำเรียกญาติแทนสรรพนาม
 * ดังนั้น {cg_he} {cg_him} {cg_his} จึงเป็นคำเดียวกับ {caregiver}
 * ตัวละครหลักในเนื้อเรื่องเรียกว่า "หนู" (เขียนตรง ๆ ในข้อความ ไม่ใช่ตัวแปร)
 */
export const vars: TextVars = {
  pronoun: {
    boy: { he: 'เขา', him: 'เขา', his: 'เขา', kid: 'เด็กผู้ชาย' },
    girl: { he: 'เธอ', him: 'เธอ', his: 'เธอ', kid: 'เด็กผู้หญิง' },
  },
  caregiverPerson: {
    mom: { name: 'แม่', he: 'แม่', him: 'แม่', his: 'แม่' },
    dad: { name: 'พ่อ', he: 'พ่อ', him: 'พ่อ', his: 'พ่อ' },
    grandma: { name: 'ยาย', he: 'ยาย', him: 'ยาย', his: 'ยาย' },
    grandpa: { name: 'ตา', he: 'ตา', him: 'ตา', his: 'ตา' },
    aunt: { name: 'ป้า', he: 'ป้า', him: 'ป้า', his: 'ป้า' },
    uncle: { name: 'ลุง', he: 'ลุง', him: 'ลุง', his: 'ลุง' },
  },
  caregivers: {
    bothParents: 'พ่อกับแม่',
    singleMother: 'แม่',
    singleFather: 'พ่อ',
    grandparents: 'ตากับยาย',
    relatives: 'ป้ากับลุง',
  },
  olderSibling: { brother: 'พี่ชาย', sister: 'พี่สาว' },
  youngerSibling: { brother: 'น้องชาย', sister: 'น้องสาว' },
  noSibling: 'เด็กอีกคน',
};
