#!/usr/env/bind node

'use strict';

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');
const download = require('download-git-repo');
const symbols = require('log-symbols');

const { compileByType } = require('../util/util');

let spinner;


function generator(schematic, name, options) {
  const sourceData = { name, nameHump: name[ 0 ].toUpperCase() + name.substring(1) };
  [ 'module', 'controller', 'service', 'dto' ].map(type => {
    compileByType(type, sourceData, `./core/${type}`);
  })
}

module.exports = function (schematic, name, options) {
  console.log(schematic, name);
  try {
    generator(schematic, name, options);
  } catch (e) {
    console.error(chalk.red(e));

    spinner && spinner.fail();

    process.exit();
  }
};

