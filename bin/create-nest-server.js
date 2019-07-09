#!/usr/bin/env node
'use strict';

const commander = require('commander');
const inquirer = require('inquirer');
const download = require('download-git-repo');
const ora = require('ora');
const chalk = require('chalk');
const symbols = require('log-symbols');
const handlebars = require('handlebars');
const fs = require('fs');
const childProcess = require('child_process');
const packageJson = require('../package');

let projectName;

commander
  .version(packageJson.version, '-v, --version, -V')
  .arguments('<project-directory>')
  .usage(`${chalk.green('<project-directory>')}`)
  .action(name => {
    projectName = name;
  })
  .on('--help', () => {
    console.log();
    console.log(`Only ${chalk.green('<project-directory>')} is required.`);
  })
  .parse(process.argv);

if (projectName === undefined || projectName === '') {
  console.error('Please specify the project name:');
  console.log(`  ${chalk.cyan(packageJson.name)} ${chalk.green('<project-directory>')}`);
  console.log();
  console.log('For example:');
  console.log(`  ${chalk.cyan(packageJson.name)} ${chalk.green('nest-demo')}`);
  console.log();
  console.log(`Run ${chalk.cyan(`${packageJson.name} --help`)} to see all options.`);
  process.exit(1);
}

createNestServer();


async function createNestServer() {
  if (fs.existsSync(projectName)) {
    const { onOff } = await inquirer.prompt([
      {
        type: 'input',
        name: 'onOff',
        message: 'The project already exists. Is it covered? Yes is y, else not',
      }
    ]);
    if (onOff !== 'y') {
      process.exit(1);
    }
  }

  const spinner = ora('downloading template......');
  spinner.start();
  download('github:yuezm/nest-template#master', projectName, { clone: false }, async err => {
    if (err) {
      spinner.fail();
      console.log(symbols.error, chalk.red(err));
    } else {
      spinner.succeed();
      try {
        const author = await getGitConfigName();
        compileFile(
          [ `${projectName}/package.json`, `${projectName}/package-lock.json` ],
          {
            projectName,
            author,
          }
        );
        console.log(symbols.success, chalk.green('finish......'));
        console.log();
        console.log('run');
        console.log(chalk.green(`  cd ${projectName} && npm install`));
        console.log(chalk.green('  npm run start:dev'));
      } catch (err) {
        console.log(symbols.error, chalk.red(err));
      }
    }
  });
}

function compileFile(filepath, sourceData) {
  if (Array.isArray(filepath)) {
    filepath.forEach(path => {
      compileFile(path, sourceData);
    });
    return;
  }
  fs.writeFileSync(filepath, handlebars.compile(fs.readFileSync(filepath).toString())(sourceData));
}

function getGitConfigName() {
  return new Promise((resolve, reject) => {
    const cp = childProcess.exec('git config --get user.name');

    cp.stdout.on('data', data => {
      resolve(data.toString().replace(/\n*\r*\t*/g, ''));
    });

    cp.stderr.on('data', err => {
      reject(err);
    });
  })
}
