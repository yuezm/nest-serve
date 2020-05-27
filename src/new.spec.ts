import { Command } from 'commander';
import { join } from 'path';
import { existsSync, readdirSync, readFileSync, mkdirSync, copyFileSync } from 'fs';
import { spawnSync } from 'child_process';

import { serveNew } from './new';

const TEST_PATH = 'test-new';

describe('Test new.ts', function() {
  it('Test new full', async () => {
    await serveNew(TEST_PATH, 'github:yuezm/nest-template#master');
    expect(existsSync(TEST_PATH)).toBeTruthy();
    spawnSync('rm', [ '-r', TEST_PATH ]);
  });

  it('Test new full no template path', async () => {
    await serveNew(TEST_PATH);
    expect(existsSync(TEST_PATH)).toBeTruthy();
    spawnSync('rm', [ '-r', TEST_PATH ]);
  });

  it('Test new full no name', async () => {
    await serveNew('');
    expect(existsSync(TEST_PATH)).toBeFalsy();
  });

  it('Test new path .', function() {
    serveNew('').then(() => {
      expect(existsSync(TEST_PATH)).toBeFalsy();
    });
  });
});
