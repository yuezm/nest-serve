#!/usr/env/bind node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require("chalk");
const ora_1 = require("ora");
const log_symbols_1 = require("log-symbols");
const path_1 = require("path");
const util_1 = require("./util");
const download = require('download-git-repo');
function effectDownloading(options) {
    let spinner;
    return new Promise((resolve, reject) => {
        spinner = ora_1.default(`downloading template... from ${options.repository}`);
        spinner.start();
        download(options.repository, options.projectName, { clone: false }, err => {
            if (err) {
                spinner.fail();
                reject(err);
            }
            spinner.succeed();
            resolve();
        });
    });
}
function effectCreate(projectName) {
    const spinner = ora_1.default('compile template...');
    spinner.start();
    const sourceData = util_1.serializePathName(projectName);
    util_1.effectCompileTemplate(`${projectName}/package.json`, sourceData);
    util_1.effectCompileTemplate(`${projectName}/startup.json`, sourceData);
    spinner.succeed();
}
async function serveNew(name, repositoryPath, cmd) {
    if (!name) {
        console.error(chalk.default.red('app-name should be not empty'));
        return;
    }
    if (name === '.') {
        name = path_1.basename(process.cwd());
    }
    await effectDownloading({ projectName: name, repository: repositoryPath || 'github:yuezm/nest-template#master' });
    effectCreate(name);
    console.log(log_symbols_1.success, chalk.default.green('all finish...'));
    console.log('run');
    console.log(chalk.default.green(`  cd ${name} && npm install`));
    console.log(chalk.default('  npm run dev'));
}
exports.serveNew = serveNew;
