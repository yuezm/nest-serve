#!/usr/env/bind node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require("chalk");
const ora = require("ora");
const log_symbols_1 = require("log-symbols");
const path_1 = require("path");
const util_1 = require("./util");
const download = require('download-git-repo');
let spinner;
function create(name, options) {
    spinner = ora(`downloading template... from ${options.repository}`);
    spinner.start();
    download(options.repository, name, { clone: false }, async (err) => {
        if (err) {
            throw err;
        }
        spinner.succeed();
        spinner = ora('compile template...');
        spinner.start();
        const sourceData = util_1.serializePathName(name);
        util_1.effectCompileTemplate(`${name}/package.json`, sourceData);
        util_1.effectCompileTemplate(`${name}/startup.json`, sourceData);
        spinner.succeed();
        console.log(log_symbols_1.success, chalk.default.green('all finish...'));
        console.log('run');
        console.log(chalk.default.green(`  cd ${name} && npm install`));
        console.log(chalk.default('  npm run dev'));
    });
}
function serveNew(name, repositoryPath, options) {
    try {
        if (!name) {
            console.error(chalk.default.red('app-name should be not empty'));
            return;
        }
        if (name === '.') {
            name = path_1.basename(process.cwd());
        }
        create(name, { repository: repositoryPath || 'github:yuezm/nest-template#master' });
    }
    catch (e) {
        console.error(chalk.default.red(e));
        spinner && spinner.fail();
    }
}
exports.serveNew = serveNew;
