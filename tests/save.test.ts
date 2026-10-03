import { describe, expect, it } from 'vitest';
import { Game } from '../src/engine/game';
import { addLife, loadLives, toRecord } from '../src/save/lifeArchive';
import { migrate, SAVE_VERSION } from '../src/save/migrations';
import { exportSave, importSave, SaveManager } from '../src/save/saveManager';
import { MemorySaveStorage } from '../src/save/SaveStorage';
import { loadSettings } from '../src/save/settings';
import { content } from './helpers';

describe('save system', () => {
  it('round-trips a game state exactly', () => {
    const g = Game.create(content, { name: 'Round', seed: 'rt' });
    g.advance();
    const res = importSave(exportSave(g.state));
    expect(res).toEqual({ status: 'ok', state: JSON.parse(JSON.stringify(g.state)) });
  });

  it('resumes the exact pending event and continues identically', () => {
    const storage = new MemorySaveStorage();
    const saves = new SaveManager(storage);
    const a = Game.create(content, { name: 'Resume', seed: 'resume' });
    a.advance();
    a.choose(a.visibleChoices()[0]!.id);
    saves.save(a.state);

    const loaded = saves.load();
    if (loaded.status !== 'ok') throw new Error('load failed');
    const b = new Game(content, loaded.state);
    expect(b.state.phase).toEqual(a.state.phase);
    a.advance();
    b.advance();
    expect(b.state).toEqual(JSON.parse(JSON.stringify(a.state)));
  });

  it('reports missing and corrupted saves without throwing', () => {
    const storage = new MemorySaveStorage();
    const saves = new SaveManager(storage);
    expect(saves.load()).toEqual({ status: 'none' });
    storage.write('lifesim.save', '{not json');
    expect(saves.load().status).toBe('corrupt');
    storage.write('lifesim.save', JSON.stringify({ version: SAVE_VERSION, state: { hello: 1 } }));
    expect(saves.load().status).toBe('corrupt');
    storage.write('lifesim.save', JSON.stringify({ version: 999, state: {} }));
    expect(saves.load()).toMatchObject({ status: 'corrupt', reason: expect.stringContaining('999') });
  });

  it('migrate passes current versions through and rejects unknown ones', () => {
    const save = { version: SAVE_VERSION, savedAt: '', state: {} };
    expect(migrate(save)).toBe(save);
    expect(migrate({ ...save, version: 0 })).toBeNull();
  });

  it('migrates a v1 save (English-only stored text) to per-locale texts', () => {
    const g = Game.create(content, { name: 'Old', seed: 'v1' });
    g.advance();
    g.choose(g.visibleChoices()[0]!.id);
    const v2 = JSON.parse(JSON.stringify(g.state));
    const { texts, ...phase } = v2.phase;
    const v1 = { version: 1, savedAt: '', state: { ...v2, phase: { ...phase, text: texts.en } } };
    const res = importSave(JSON.stringify(v1));
    expect(res.status).toBe('ok');
    if (res.status === 'ok') expect(res.state.phase).toEqual(v2.phase);
  });

  it('keeps a capped, newest-first archive of lives and ignores junk', () => {
    const storage = new MemorySaveStorage();
    const g = Game.create(content, { name: 'L', seed: 'life' });
    for (let i = 0; i < 5; i++) addLife(storage, { ...toRecord(g.state), id: `id${i}` }, 3);
    const lives = loadLives(storage);
    expect(lives.map((l) => l.id)).toEqual(['id4', 'id3', 'id2']);
    storage.write('lifesim.lives', '[{"bad":true}]');
    expect(loadLives(storage)).toEqual([]);
  });

  it('falls back to default settings on bad data', () => {
    const storage = new MemorySaveStorage();
    storage.write('lifesim.settings', '{"warningLevel":"sometimes","theme":"dark"}');
    expect(loadSettings(storage)).toEqual({ warningLevel: 'heavyOnly', theme: 'dark', language: 'th' });
    storage.write('lifesim.settings', '{"language":"en"}');
    expect(loadSettings(storage).language).toBe('en');
    storage.write('lifesim.settings', '{"language":"fr"}');
    expect(loadSettings(storage).language).toBe('th');
  });
});
