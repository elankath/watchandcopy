#! /usr/bin/env node
import chokidar from 'chokidar';
import osenv from 'osenv';
import {docopt} from 'docopt';
import fs from 'fs-extra';
import path from 'path';

const log = console.log.bind(console);

const usage = `
Watch, Flatten, and Copy.

Usage:
  wtcp <source> <target> --match=<glob> [--ignore=<glob>]
  wtcp -h | --help | --version

Options:
  -h,--help                     Show this screen.
  --version                     Show version.
  -m <glob>, --match=<glob>     Match Glob Pattern. Ex: **/*.jar
  -i <glob>, --ignore=<glob>    Ignore Glob Pattern. Ex: **/org.osgi*.jar
`;

let opts = docopt(usage, {version: '0.1.0'});

let srcdir = fs.realpathSync(opts["<source>"]);
let targdir =fs.realpathSync(opts["<target>"]);

if (srcdir === targdir) {
  console.error("ERROR: source: " + srcdir +  " is same as target!");
  process.exit(1);
}

fs.ensureDirSync(targdir)

log("Watching source dir:" + srcdir);

let watcher = chokidar.watch(srcdir, {
  ignoreInitial: true
});

watcher
  .on('add', function(srcpath) {
    copyToTarget(srcpath);
  })
  .on('change', function(srcpath) {
    copyToTarget(srcpath);
  })

function copyToTarget(srcpath) {
  "use strict";
  let filename = path.basename(srcpath);
  let targetpath = path.resolve(targdir, filename);
  fs.copy(srcpath, targetpath, function(err) {
    if (err) return console.error(err)
    console.log("Copied: " + srcpath + " to: " + targdir);
  })
}


