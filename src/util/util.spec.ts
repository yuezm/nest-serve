import { compileByType, compileSourceToTarget, ECompileType, serializePathName } from "./index";
import { join } from "path";
import { existsSync, unlinkSync, mkdirSync, rmdirSync, copyFileSync, readFileSync } from "fs";

describe('Test Util', () => {
  const sourceData = {
    path: 'test',
    name: 'test',
    nameHump: 'Test'
  };
  const targetDir = './test';
  const targetPath = join(targetDir, 'test.controller.ts');

  beforeAll(() => {
    if (!existsSync(targetDir)) {
      mkdirSync(targetDir);
    }
  });

  afterAll(() => {
    if (existsSync(targetDir)) {
      rmdirSync(targetDir);
    }
  });

  it('test compileSourceToTarget has no targetPath', () => {
    const sourceDirPath = join('./', 'public/template');
    const sourcePath = join('./test', `${ sourceData.path }.controller.ts`);

    copyFileSync(join(sourceDirPath, 'controller.ts'), sourcePath);

    compileSourceToTarget(sourcePath, sourceData);
    expect(existsSync(sourcePath)).toBe(true);
    expect(readFileSync(sourcePath).toString().replace(/\n+/g, '').trim()).toBe('import { Controller } from \'@nestjs/common\';import { TestService } from \'./service/test.service\';@Controller(\'/v1/test\')export class TestController {  constructor(private readonly testService: TestService) {  }}');
    unlinkSync(sourcePath);
  });

  it('test compileSourceToTarget', () => {
    compileSourceToTarget(
      join('./', 'public/template/controller.ts'),
      sourceData,
      targetPath
    );
    expect(existsSync(targetPath)).toBe(true);
    unlinkSync(targetPath);
  });

  it('test compileByType targetDir is empty', () => {
    if (existsSync(targetDir)) {
      rmdirSync(targetDir);
    }
    compileByType(
      ECompileType.CONTROLLER,
      sourceData,
      targetDir,
    );
    expect(existsSync(targetPath)).toBe(true);
    unlinkSync(targetPath);
  });

  it('test compileByType', () => {
    compileByType(
      ECompileType.CONTROLLER,
      sourceData,
      targetDir,
    );
    expect(existsSync(targetPath)).toBe(true);
    unlinkSync(targetPath);
  });

  it('test serializePathName', () => {
    expect(serializePathName('test')).toMatchObject(sourceData);
  });

  it('test serializePathName has -', () => {
    expect(serializePathName('test-detail')).toMatchObject({
      path: 'test.detail',
      name: 'testDetail',
      nameHump: 'TestDetail'
    });
  })
});
