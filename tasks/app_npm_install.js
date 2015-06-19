'use strict';

var childProcess = require('child_process');
var jetpack = require('fs-jetpack');
var argv = require('yargs').argv;

var utils = require('./utils');

var electronVersion = utils.getElectronVersion();

var nodeModulesDir = jetpack.cwd(__dirname + '/../app/node_modules')
var dependenciesCompiledAgainst = nodeModulesDir.read('electron_version');

if (electronVersion !== dependenciesCompiledAgainst) {
    nodeModulesDir.dir('.', { empty: true });
    nodeModulesDir.write('electron_version', electronVersion);
}

process.env.npm_config_disturl = "https://atom.io/download/atom-shell";
process.env.npm_config_target = electronVersion;

var params = ['install'];
// Maybe there was name of package user wants to install passed as a parameter.
if (argv._.length > 0) {
    params.push(argv._[0]);
    params.push('--save');
}


var installCommand = null;

if (process.platform === 'win32') {
  installCommand = 'npm.cmd'
} else {
  installCommand = 'npm'
}

var install = childProcess.spawn(installCommand, params, {
    cwd: __dirname + '/../app',
    env: process.env,
    stdio: 'inherit'
});
