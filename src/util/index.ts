import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { compile } from 'ejs';

export interface INameSerialization {
  path: string;
  name?: string;
  nameHump?: string;
}

export enum ECompileType {
  CONTROLLER = 'controller',
  DTO = 'dto',
  MODULE = 'module',
  SERVICE = 'service',
}

/**
 * handlebars 模板解析
 * @param {*} sourcePath 原始文件路径
 * @param {*} sourceData 模板变量
 * @param {*} targetPath 生成文件路径
 */
export function compileSourceToTarget(sourcePath: string, sourceData: INameSerialization, targetPath: string = sourcePath): void {
  writeFileSync(
    targetPath,
    compile(readFileSync(sourcePath).toString(), null)(sourceData),
    {
      flag: 'w+',
    }
  );
}

/**
 * 根据不同类型，编译不同模板
 * @param type
 * @param sourceData
 * @param targetDirPath
 */
export function compileByType(type: ECompileType, sourceData: INameSerialization, targetDirPath: string): void {
  if (!existsSync(targetDirPath)) {
    mkdirSync(targetDirPath, { recursive: true });
  }

  compileSourceToTarget(
    join(__dirname, `../../public/template/${ type }.ts`),
    sourceData,
    join(targetDirPath, `${ sourceData.path }.${ type }.ts`)
  );
}

/**
 * 序列化输入的模块名称，返回 模块模块内部文件名，文件引用名，文件类型名，例如
 * test => path: test         name: test        nameHump: Test
 * test-detail => path: test.detail  name: testDetail  nameHump: TestDetail
 */
export function serializePathName(name: string): INameSerialization {
  const data: INameSerialization = { path: name, name, nameHump: '' };

  if (name.includes('-')) {
    // 可能存在含有短横线的名称 -
    data.path = name.replace(/-/g, '.');
    data.name = name.replace(/-(\w)?/g, (p1, p2) => p2 ? p2.toUpperCase() : '');
  }
  data.nameHump = data.name[ 0 ].toUpperCase() + data.name.substring(1);

  return data;
}

