import { join } from 'path';
import { spawnSync } from 'child_process';
import { existsSync } from 'fs';

describe('test cli', () => {
  const testPathDir = './test-new';

  afterAll(() => {
    if (existsSync(testPathDir)) {
      spawnSync('rm', [ '-r', testPathDir ]);
    }
  });

  it('test all command help', () => {
    const c = spawnSync("node", [ 'bin/main.js', '--help' ]);
    return expect(c.stdout.toString().replace(/\s+/g, ' ')).toBe('Usage: main <command> [options] Options: -V, --version output the version number -h, --help output usage information Commands: new [options] <app-name> [repository-path] 创建新的项目,如果输入为"."，则为当前目录 generate|g <name> 在当前项目下创建服务，包括controller,service,module，并添加到AppModule ')
  });

  it('test new command error', () => {
    const c = spawnSync("node", [ 'bin/main.js', 'new' ]);
    expect(c.stderr.toString()).toBe('error: missing required argument `app-name\'\n');
  });

  it('test new command success', () => {
    const c = spawnSync("node", [ 'bin/main.js', 'new', testPathDir ]);
    expect(c.status).toBe(0);
    expect(existsSync(testPathDir));
  });

  it('test g command error', () => {
    const c = spawnSync("node", [ 'bin/main.js', 'g' ]);
    expect(c.stderr.toString()).toBe('error: missing required argument `name\'\n');
  });

  it('test g command success', () => {
    const c = spawnSync("node", [ '../bin/main.js', 'g', 'test' ], {
      cwd: testPathDir,
    });
    expect(c.status).toBe(0);
    const targetDir = join(testPathDir, 'src/app/test');
    expect(existsSync(targetDir));
    expect(existsSync(join(targetDir, 'test.controller.ts')));
    expect(existsSync(join(targetDir, 'test.dto.ts')));
    expect(existsSync(join(targetDir, 'test.module.ts')));
    expect(existsSync(join(targetDir, 'test.service.ts')));
  });
});
