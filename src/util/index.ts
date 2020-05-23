import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { compile } from 'ejs';
import { throws } from 'assert';

const TEMPLATE_PATH = join(__dirname, '../../public/template');

export interface INameSerialization {
  path: string; // 路径名，例如 user、user.role
  name: string; // 序列化后的名称，例如 user、userRole
  nameHump: string; // 序列化后的大驼峰命名，例如 User、UserRole
}

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
    compile(readFileSync(templatePath).toString(), null)(templateData),
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

// 名称序列化
export function serializePathName(moduleName: string): INameSerialization {
  const data: INameSerialization = { path: moduleName, name: moduleName, nameHump: '' };
  if (/.*?[-.]$/.test(moduleName)) {
    throw new Error('错误模块名');
  }
  // 可能存在含有短横线的名称
  if (moduleName.includes('-')) {
    // user-role => user.role
    data.path = moduleName.replace(/-/g, '.');

    // user-role => userRole
    data.name = moduleName.replace(/-(\w)?/g, (p1, p2) => p2.toUpperCase());
  }

  data.nameHump = toHumpString(data.name);

  return data;
}

// 字符串转大驼峰
export function toHumpString(s: string): string {
  return s === '' ? '' : s.replace(s[ 0 ], s[ 0 ].toUpperCase());
}

