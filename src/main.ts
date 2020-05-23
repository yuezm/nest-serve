#!/usr/bin/env node

import { command, version, parse, help, Command } from 'commander';

const packageJson = require('../package');

import { serveNew } from './new';
import { serveGenerate } from './generate';

// 版本
version(packageJson.version).usage('<command> [options]');


// new 命令
command('new <app-name> [repository-path]')
  .alias('n')
  .option('--http', '创建HTTP 服务')
  .option('--micro', '创建微服务，默认gRPC')
  .description('创建新的项目,如果输入为"."，则为当前目录')
  .action((name, repositoryPath, cmd) => {
    serveNew(name, repositoryPath, cmd);
  });

// generate命令
command('generate <name>')
  .alias('g')
  .option('-m,--module', '只创建 *.module.ts')
  .option('-c,--controller', '只创建 *.controller.ts')
  .option('-s,--service', '只创建 *.service.ts')
  .option('-o,--dto', '只创建 *.dto.ts')
  .option('-t,--static', '只创建 *.static.ts')
  .option('-p,--path <value>', '选择创建模块路径，默认为 src/app')
  .option('-g,--grpc', 'service 是否添加 gRPC client')
  .description(
    '在当前项目创建模块，包括module、controller、service...，并添加到AppModule',
  )
  .action((name, cmd) => {
    serveGenerate(name, cmd);
  });


if (parse(process.argv).args.length < 1) {
  help();
}
