#!/usr/env/bind node

import * as chalk from 'chalk';
import ora, { Ora } from 'ora';
import { success } from 'log-symbols';
import { basename } from 'path';
import { Command } from 'commander';

import { effectCompileTemplate, INameSerialization, serializePathName } from './util';


const download = require('download-git-repo');

export interface ICreateOptions {
  projectName: string;
  repository: string;
}

function effectDownloading(options: ICreateOptions): Promise<void> {
  let spinner: Ora;
  return new Promise((resolve, reject) => {
    spinner = ora(`downloading template... from ${ options.repository }`);
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

function effectCreate(projectName: string): void {
  const spinner = ora('compile template...');
  spinner.start();

  const sourceData: INameSerialization = serializePathName(projectName);
  effectCompileTemplate(`${ projectName }/package.json`, sourceData);
  effectCompileTemplate(`${ projectName }/startup.json`, sourceData);

  spinner.succeed();
}

export async function serveNew(name: string, repositoryPath?: string, cmd?: Command): Promise<any> {
  if (!name) {
    console.error(chalk.default.red('app-name should be not empty'));
    return;
  }

  if (name === '.') {
    name = basename(process.cwd());
  }

  await effectDownloading({ projectName: name, repository: repositoryPath || 'github:yuezm/nest-template#master' });
  effectCreate(name);

  console.log(success, chalk.default.green('all finish...'));
  console.log('run');
  console.log(chalk.default.green(`  cd ${ name } && npm install`));
  console.log(chalk.default('  npm run dev'));
}
