#! /usr/bin/env node
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var chokidar = _interopRequire(require("chokidar"));

var osenv = _interopRequire(require("osenv"));

var docopt = require("docopt").docopt;

var fs = _interopRequire(require("fs-extra"));

var path = _interopRequire(require("path"));

var log = console.log.bind(console);

var usage = "\nWatch, Flatten, and Copy.\n\nUsage:\n  wtcp <source> <target> --match=<glob> [--ignore=<glob>]\n  wtcp -h | --help | --version\n\nOptions:\n  -h,--help                     Show this screen.\n  --version                     Show version.\n  -m <glob>, --match=<glob>     Match Glob Pattern. Ex: **/*.jar\n  -i <glob>, --ignore=<glob>    Ignore Glob Pattern. Ex: **/org.osgi*.jar\n";

var opts = docopt(usage, { version: "0.1.0" });

var srcdir = fs.realpathSync(opts["<source>"]);
var targdir = fs.realpathSync(opts["<target>"]);

if (srcdir === targdir) {
  console.error("ERROR: source: " + srcdir + " is same as target!");
  process.exit(1);
}

fs.ensureDirSync(targdir);

log("Watching source dir:" + srcdir);

var watcher = chokidar.watch(srcdir, {
  ignoreInitial: true
});

watcher.on("add", function (srcpath) {
  copyToTarget(srcpath);
}).on("change", function (srcpath) {
  copyToTarget(srcpath);
});

function copyToTarget(srcpath) {
  "use strict";
  var filename = path.basename(srcpath);
  var targetpath = path.resolve(targdir, filename);
  fs.copy(srcpath, targetpath, function (err) {
    if (err) return console.error(err);
    console.log("Copied: " + srcpath + " to: " + targdir);
  });
}