#!/usr/bin/env node

const yParser = require('yargs-parser');
const { existsSync } = require('fs');
const { join } = require('path');
const semver = require('semver');
const chalk = require('chalk');
const mkdirp = require('mkdirp');
const clipboardy = require('clipboardy');

const args = yParser(process.argv.slice(2));

if (args._.length) {
  mkdirp.sync(args._[0]);
  process.chdir(args._[0]);
}

let Generator = require('../lib/MiniGenerator');
const generator = new Generator(process.argv.slice(2), {
  name: 'basic',
  env: {
    cwd: process.cwd(),
  },
  resolved: __dirname,
});
generator.run(() => {
  if (args._[0]) {
    clipboardy.writeSync(`cd ${args._[0]}`);
  }
  console.log('Congratulations on the task completion !! ');
});
