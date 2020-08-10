import { Command } from 'commander';
import { existsSync, readdirSync, readFileSync, mkdirSync, copyFileSync } from 'fs';
import { join } from 'path';
import { spawnSync } from 'child_process';

import { serveGenerate } from './generate';

const TEST_PATH = 'test-generate';
const INTERIM_APP_PATH = './src/app';
const INTERIM_APP_MODULE_PATH = join(INTERIM_APP_PATH, 'app.module.ts');

class TestCommand extends Command {
  path: string;
  module: boolean;
  controller: boolean;
  service: boolean;
  dto: boolean;
  static: boolean;
  grpc: boolean;

  constructor({ path = '', module = false, controller = false, service = false, dto = false, sta = false, grpc = false } = {}) {
    super();
    this.path = path;
    this.module = module;
    this.controller = controller;
    this.service = service;
    this.dto = dto;
    this.static = sta;
    this.grpc = grpc;
  }
}


describe('Test generate.ts', function() {

  afterAll(() => {
    spawnSync('rm', [ '-r', INTERIM_APP_PATH ]);
    spawnSync('rm', [ '-r', TEST_PATH ]);
  });

  it('serveGenerate should has all module', function() {
    serveGenerate('test', new TestCommand({ path: TEST_PATH }));
    const modulePath = join(TEST_PATH, 'test');

    expect(existsSync(TEST_PATH)).toBeTruthy();
    expect(existsSync(modulePath)).toBeTruthy();
    expect(readdirSync(modulePath).length).toBe(6);

    spawnSync('rm', [ '-r', TEST_PATH ]);
  });

  it('serveGenerate should has only *module.ts', function() {
    serveGenerate('test', new TestCommand({ path: TEST_PATH, module: true }));

    expect(existsSync(join(TEST_PATH, 'test', 'test.module.ts'))).toBeTruthy();

    spawnSync('rm', [ '-r', TEST_PATH ]);
  });

  it('serveGenerate should has only *controller.ts', function() {
    serveGenerate('test', new TestCommand({ path: TEST_PATH, controller: true }));

    expect(existsSync(join(TEST_PATH, 'test', 'test.controller.ts'))).toBeTruthy();

    spawnSync('rm', [ '-r', TEST_PATH ]);
  });

  it('serveGenerate should has only *service.ts', function() {
    serveGenerate('test', new TestCommand({ path: TEST_PATH, service: true }));

    expect(existsSync(join(TEST_PATH, 'test', 'test.service.ts'))).toBeTruthy();

    spawnSync('rm', [ '-r', TEST_PATH ]);
  });

  it('serveGenerate should has only *dto.ts', function() {
    serveGenerate('test', new TestCommand({ path: TEST_PATH, dto: true }));

    expect(existsSync(join(TEST_PATH, 'test', 'test.dto.ts'))).toBeTruthy();

    spawnSync('rm', [ '-r', TEST_PATH ]);
  });

  it('serveGenerate should has only *static.ts', function() {
    serveGenerate('test', new TestCommand({ path: TEST_PATH, sta: true }));

    expect(existsSync(join(TEST_PATH, 'test', 'test.static.ts'))).toBeTruthy();

    spawnSync('rm', [ '-r', TEST_PATH ]);
  });

  it('serveGenerate gRPC client', function() {
    serveGenerate('test', new TestCommand({ path: TEST_PATH, grpc: true }));

    expect(existsSync(join(TEST_PATH, 'test', 'test.service.ts'))).toBeTruthy();
    expect(readFileSync(join(TEST_PATH, 'test', 'test.service.ts')).toString().includes('testRpcService')).toBeTruthy();
    spawnSync('rm', [ '-r', TEST_PATH ]);
  });

  it('serveGenerate APP_MODULE_PATH', function() {
    const INTERIM_APP_MODULE_PATH = join(INTERIM_APP_PATH, 'app.module.ts');
    mkdirSync(INTERIM_APP_PATH);
    copyFileSync('./example/src/app/app.module.ts', INTERIM_APP_MODULE_PATH);

    serveGenerate('test', new TestCommand({ path: './src/app' }));
    expect(readFileSync(INTERIM_APP_MODULE_PATH).includes('TestModule')).toBeTruthy();
  });

  it('serveGenerate APP_MODULE_PATH repeat', function() {
    // 再次测试重复添加
    serveGenerate('test', new TestCommand());
    expect(readFileSync(INTERIM_APP_MODULE_PATH).toString().match(/TestModule/g)?.length).toBe(2);

    spawnSync('rm', [ '-r', INTERIM_APP_PATH ]);
  });
});
