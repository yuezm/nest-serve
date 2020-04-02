#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const nest_serve_new_1 = require("./nest-serve-new");
const nest_serve_generate_1 = require("./nest-serve-generate");
const packageJson = require('../package');
commander_1.version(packageJson.version).usage('<command> [options]');
commander_1.command('new <app-name> [repository-path]')
    .option('--http', '创建HTTP 服务')
    .option('--micro', '创建微服务，默认gRPC')
    .description('创建新的项目,如果输入为"."，则为当前目录')
    .action((name, repositoryPath, cmd) => {
    nest_serve_new_1.serveNew(name, repositoryPath, cmd);
});
commander_1.command('generate <name>')
    .alias('g')
    .description('在当前项目下创建服务，包括controller,service,module，并添加到AppModule')
    .action((name, cmd) => {
    nest_serve_generate_1.serveGenerate(name, cmd);
});
commander_1.parse(process.argv);
