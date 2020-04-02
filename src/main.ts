#!/usr/bin/env node

import { command, version, parse } from 'commander';
import { serveNew } from "./nest-serve-new";
import { serveGenerate } from "./nest-serve-generate";

const packageJson = require('../package');

version(packageJson.version).usage('<command> [options]');

command('new <app-name> [repository-path]')
  .option('--http', '创建HTTP 服务')
  .option('--micro', '创建微服务，默认gRPC')
  .description('创建新的项目,如果输入为"."，则为当前目录')
  .action((name, repositoryPath, cmd) => {
    serveNew(name, repositoryPath, cmd);
  });

// schematic
command('generate <name>')
  .alias('g')
  .description(
    '在当前项目下创建服务，包括controller,service,module，并添加到AppModule'
  )
  .action((name, cmd) => {
    serveGenerate(name, cmd);
  });

parse(process.argv);
