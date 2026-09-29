import type { TextVars } from '../../engine/content';

export const vars: TextVars = {
  pronoun: {
    boy: { he: 'he', him: 'him', his: 'his', kid: 'boy' },
    girl: { he: 'she', him: 'her', his: 'her', kid: 'girl' },
  },
  caregiverPerson: {
    mom: { name: 'Mom', he: 'she', him: 'her', his: 'her' },
    dad: { name: 'Dad', he: 'he', him: 'him', his: 'his' },
    grandma: { name: 'Grandma', he: 'she', him: 'her', his: 'her' },
    grandpa: { name: 'Grandpa', he: 'he', him: 'him', his: 'his' },
    aunt: { name: 'Auntie', he: 'she', him: 'her', his: 'her' },
    uncle: { name: 'Uncle', he: 'he', him: 'him', his: 'his' },
  },
  caregivers: {
    bothParents: 'Mom and Dad',
    singleMother: 'Mom',
    singleFather: 'Dad',
    grandparents: 'Grandma and Grandpa',
    relatives: 'Auntie and Uncle',
  },
  olderSibling: { brother: 'your big brother', sister: 'your big sister' },
  youngerSibling: { brother: 'your baby brother', sister: 'your baby sister' },
  noSibling: 'the other child',
};
