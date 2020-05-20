import { effectCompile, effectCompileTemplate, ETemplateType, serializePathName, toHumpString } from './index';
import { join } from 'path';
import { existsSync, unlinkSync, mkdirSync, rmdirSync, copyFileSync, readFileSync } from 'fs';

describe('Test Util', () => {
  const sourceData = serializePathName('test');
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

  it('test effectCompileTemplate full arguments', () => {
    effectCompileTemplate(
      join('./', 'public/template/controller.ts'),
      sourceData,
      targetPath,
    );
    expect(existsSync(targetPath)).toBe(true);
    unlinkSync(targetPath);
  });

  it('test effectCompileTemplate has no targetPath', () => {
    const sourceDirPath = join('./', 'public/template');
    const sourcePath = join('./test', `${ sourceData.path }.controller.ts`);

    copyFileSync(join(sourceDirPath, 'controller.ts'), sourcePath);

    effectCompileTemplate(sourcePath, sourceData);
    expect(existsSync(sourcePath)).toBe(true);
    expect(readFileSync(sourcePath).toString().replace(/\n+/g, '').trim()).toBe('import { Controller } from \'@nestjs/common\';import { TestService } from \'./test.service\';@Controller(\'/v1/test\')export class TestController {  constructor(private readonly testService: TestService) {  }}');
    unlinkSync(sourcePath);
  });

  it('test effectCompile', () => {
    effectCompile(
      ETemplateType.CONTROLLER,
      sourceData,
      targetDir,
    );
    expect(existsSync(targetPath)).toBe(true);
    unlinkSync(targetPath);
  });

  it('test effectCompile targetDir is empty', () => {
    if (existsSync(targetDir)) {
      rmdirSync(targetDir);
    }
    effectCompile(
      ETemplateType.CONTROLLER,
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
      nameHump: 'TestDetail',
    });
  });

  it('test toHumpString', function() {
    expect(toHumpString('')).toBe('');
    expect('test').toBe('Test');
  });
});
