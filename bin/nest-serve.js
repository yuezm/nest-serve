#!/usr/bin/env node

'use strict';

const commander = require('commander');
const packageJson = require('../package');


let cmdName, value;

commander
  .version(packageJson.version)
  .usage('<command> [options]');


commander
  .command('new <app-name>')
  .option('-h, --http', '创建HTTP 服务')
  .option('-m, --micro', '创建微服务，默认gRPC')
  .description('创建新的项目,如果输入为"."，则为当前目录')
  .action((name, cmd) => {
    require('./nest-serve-new')(name, cmd);
  });

commander
  .command('generate <schematic> <name>')
  .alias('g')
  .description('在当前项目下创建服务，包括controller,service,module，并添加到AppModule')
  .action((schematic, name, cmd) => {
    require('./nest-serve-generate')(schematic, name, cmd);
  });

commander.parse(process.argv);
