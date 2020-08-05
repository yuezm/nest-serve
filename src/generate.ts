#!/usr/env/bind node

import { success } from 'log-symbols';
import *as chalk from 'chalk';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { Command } from 'commander';
import { join } from 'path';

import { effectCompile, ETemplateType, ICompileArgs, serializePathName } from './helper';

const APP_MODULE_PATH = './src/app/app.module.ts';

export interface IGeneratorOptions {
  appPath: string;
  templateList: ETemplateType[];
  moduleName: string;
  isGRpc: boolean;
}

function effectGenerator(options: IGeneratorOptions) {
  const sourceData: ICompileArgs = Object.assign(serializePathName(options.moduleName), { isGRpc: options.isGRpc });

  options.templateList.map(type => effectCompile(type, sourceData, join(options.appPath, options.moduleName)));

  if (existsSync(APP_MODULE_PATH)) {
    // 将该Module加入app.module.ts
  }
}

export function serveGenerate(name: string, cmd: Command) {
  try {
    let templateList: ETemplateType[] = [];

    // 选择模板
    if (cmd.module) templateList.push(ETemplateType.MODULE);
    if (cmd.controller) templateList.push(ETemplateType.CONTROLLER);
    if (cmd.service) templateList.push(ETemplateType.SERVICE);
    if (cmd.dto) templateList.push(ETemplateType.DTO);
    if (cmd.static) templateList.push(ETemplateType.STATIC);

    // 无选择模板即为所有模板
    if (templateList.length < 1) {
      templateList = [ ETemplateType.MODULE, ETemplateType.CONTROLLER, ETemplateType.SERVICE, ETemplateType.DTO, ETemplateType.STATIC, ETemplateType.SPEC ];
    }

    effectGenerator({
      moduleName: name,
      appPath: cmd.path ?? 'src/app',
      templateList,
      isGRpc: Boolean(cmd.grpc),
    });

    console.log(success, chalk.default.green('already created'));
  } catch (e) {
    console.error(chalk.default.red(e.message));
  }
}

