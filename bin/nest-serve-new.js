#!/usr/env/bind node

'use strict';

const chalk = require('chalk');
const ora = require('ora');
const download = require('download-git-repo');
const symbols = require('log-symbols');
const path = require('path');

const { compile } = require('../util/util');

let spinner, h, m;

function create(name, options = {}) {
  spinner = ora('正在下载模板...');
  spinner.start();
  download('github:yuezm/nest-template#master', name, { clone: false }, async err => {
    if (err) {
      throw err;
    }

    spinner.succeed();

    compile(`${name}/package.json`, { name });
    console.log(symbols.success, chalk.green('finish......'));
    console.log('run');
    console.log(chalk.green(`  cd ${name} && npm install`));
    console.log(chalk.green('  npm run dev'));
  });
}

module.exports = function (name, cmd) {
  try {
    h = cmd.http;
    m = cmd.micro;

    if (name === '.') {
      name = path.basename(process.cwd());
    }

    create(name);
  } catch (e) {
    console.error(chalk.red(e));

    spinner && spinner.fail();

    process.exit();
  }
};


