/** ชุดภาษาไทย: ข้อความล้วน ๆ ซ้อนทับบนเนื้อหาภาษาอังกฤษ (ตรรกะเกมอยู่ที่เดียว) */
import type { LocalePack } from '../../engine/i18n';
import type { Strings } from '../en/strings';
import { core } from './events/infancy/core';
import { extras } from './events/infancy/extras';
import { milestones } from './events/infancy/milestones';
import { narrative } from './narrative';
import { reactions } from './reactions';
import { stages } from './stages';
import { strings } from './strings';
import { vars } from './vars';

export const thPack: LocalePack<Strings> = {
  locale: 'th',
  events: { ...core, ...milestones, ...extras },
  reactions,
  stages,
  narrative,
  vars,
  strings,
};
