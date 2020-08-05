import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { compile } from 'ejs';
import { join } from 'path';

import { INameSerialization } from './index';

const TEMPLATE_PATH = join(__dirname, '../../public/template');

export interface ICompileArgs extends INameSerialization {
  isGRpc?: boolean;
}

// 文件类型枚举
export const enum ETemplateType {
  CONTROLLER = 'controller',
  DTO = 'dto',
  MODULE = 'module',
  SERVICE = 'service',
  STATIC = 'static',
  SPEC = 'spec',
}

/**
 * handlebars 模板解析
 * @param {*} templatePath 原始文件路径
 * @param {*} templateData 模板变量传参
 * @param {*} targetPath 生成文件路径
 */
export function effectCompileTemplate(templatePath: string, templateData: ICompileArgs, targetPath: string = templatePath): void {
  writeFileSync(
    targetPath,
    compile(readFileSync(templatePath).toString())(templateData),
    {
      flag: 'w+',
    },
  );
}


// 根据不同类型，编译不同模板
export function effectCompile(type: ETemplateType, templateData: ICompileArgs, targetDirPath: string): void {

  if (!existsSync(targetDirPath)) {
    mkdirSync(targetDirPath, { recursive: true });
  }

  effectCompileTemplate(
    join(TEMPLATE_PATH, `${ type }.txt`),
    templateData,
    join(targetDirPath, `${ templateData.path }.${ type }.ts`),
  );
}