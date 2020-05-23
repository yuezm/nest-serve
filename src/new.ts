#!/usr/env/bind node

import * as chalk from 'chalk';
import * as ora from 'ora';
import { success } from 'log-symbols';
import { basename } from 'path';
import { effectCompileTemplate, INameSerialization, serializePathName } from "./util";


const download = require('download-git-repo');

let spinner;

export interface ICreateOptions {
  repository: string;
}

function create(name: string, options: ICreateOptions): void {
  spinner = ora(`downloading template... from ${ options.repository }`);
  spinner.start();

  download(options.repository, name, { clone: false }, async err => {
    if (err) {
      throw err;
    }
    spinner.succeed();

    spinner = ora('compile template...');
    spinner.start();

    const sourceData: INameSerialization = serializePathName(name);
    effectCompileTemplate(`${ name }/package.json`, sourceData);
    effectCompileTemplate(`${ name }/startup.json`, sourceData);
    spinner.succeed();

    console.log(success, chalk.default.green('all finish...'));
    console.log('run');
    console.log(chalk.default.green(`  cd ${ name } && npm install`));
    console.log(chalk.default('  npm run dev'));
  });
}

export function serveNew(name: string, repositoryPath: string, options?: any): void {
  try {
    if (!name) {
      console.error(chalk.default.red('app-name should be not empty'));
      return;
    }

    if (name === '.') {
      name = basename(process.cwd());
    }

    create(name, { repository: repositoryPath || 'github:yuezm/nest-template#master' });
  } catch (e) {
    console.error(chalk.default.red(e));
    spinner && spinner.fail();
  }
}
