#!/usr/env/bind node
import { success } from 'log-symbols';
import *as chalk from 'chalk';
import { existsSync, readFileSync, writeFileSync } from 'fs';

import { compileByType, serializePathName, INameSerialization, ECompileType } from './util';


const APP_IMPORT_REG = /import.*?(?=\n@Global)/s;
const APP_MODULE_IMPORTS_REG = /@Module.*?imports.*?(?=])/s;
const APP_PATH = './src/app/app.module.ts';

function generator(name: string, options?: any) {
  const sourceData: INameSerialization = serializePathName(name);
  ([ 'module', 'controller', 'service', 'dto' ] as ECompileType[]).map((type: ECompileType) =>
    compileByType(type, sourceData, `./src/app/${ name }`));

  if (existsSync(APP_PATH)) {
    // 将该Module加入app.module.ts
    let appStr: string = readFileSync(APP_PATH).toString();

    // 替换 import
    appStr = appStr.replace(APP_IMPORT_REG, (p: string) => {
      return p + `import { ${ sourceData.nameHump }Module } from '@App/test/${ sourceData.path }.module';\n`;
    });

    // 替换imports属性
    appStr = appStr.replace(APP_MODULE_IMPORTS_REG, (p: string) => {
      return p + `  ${ sourceData.nameHump }Module\n`;
    });

    writeFileSync(APP_PATH, appStr);
  }
}

export function serveGenerate(name: string, options: any) {
  try {
    generator(name, options);
    console.log(success, chalk.default.green('already created'));
  } catch (e) {
    console.error(chalk.default.red(e));
    process.exit();
  }
}

