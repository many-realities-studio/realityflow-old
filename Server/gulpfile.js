// Dependencies
const {watch, parallel, series, task, src, dest  } = require('gulp'),
    fs = require('fs'),
    exec = require('gulp-exec'),
    gulp_tslint = require('gulp-tslint');
    process = require('process');

var server;

'use strict';
var config = JSON.parse(fs.readFileSync('./gulp_config.json'));
var gutil = require('gulp-util');
var {spawn} = require('child_process');
var tsc = require("gulp-typescript");
// var sourcemaps = require('gulp-sourcemaps');
// const stream = require('stream');
// const path = require('path');
var npid = require('npid');

const paths = {
    run: './run',
    build: './node/server/bld/',
    remoteDevelopment: '/var/realityflow/development/'
};

if(fs.existsSync(`${paths.run}/server.pid`)) {
  console.log("Zombie server found; kill it.")
  // kill(fs.readFileSync(`${paths.run}/server.pid`))
  // fs.unlink(`${paths.run}/server.pid`, function (err) {});
}

let pid
try {
  pid = npid.create(`${paths.run}/gulp.pid`);
} catch (err) {
  console.log("Error, previous run did not exit cleanly.");
  npid.remove(`${paths.run}/gulp.pid`)
  pid = npid.create(`${paths.run}/gulp.pid`);
  // process.exit(1);
}
pid.removeOnExit();

var rsync = require('gulp-rsync');
// const webpack_stream = require('webpack-stream')
// const webpack_config = require('./webpack.config.js');

// var node;


function tslint() {
    return src(['src/**/*.ts', '!**/*.d.ts'])
        .pipe(gulp_tslint({}))
        .pipe(gulp_tslint.report());
}

var tsProject = tsc.createProject("./tsconfig.json");

function buildApp() {
    console.log("Building app...")
    return src(['src/**/*.ts','!src/**/*.test.ts'])
        .pipe(tsProject(tsc.reporter.longReporter()))
        .pipe(dest(paths.build))
}

function runNodeServer(cb) {
  console.log("Running server...")
    if(server != null) {
        fs.unlink(`${paths.run}/server.pid`, function (err) {});
        server.kill();
    }
    server = spawn('node',[`${paths.build}/server.js`], {stdio: 'inherit'});
    
    if (server.pid) {
        fs.writeFileSync(`${paths.run}/server.pid`, server.pid)
    }

    server.on("error", function(err) {
        console.error(err);
    })

    server.on('close', function() {
        gutil.log("Server crashing");
        // runNodeServer();
    });
    // We've set up the server and therefore have completed this task:
    cb()
}
function deployToDev () {
  return src('.')
    .pipe(rsync({
          hostname: 'plato.mrl.ai',
          username: 'realityflow_daemon',
          recursive: true,
          exclude: ['.gitignore', 'run', 'package-lock.json', '.github','.vscode', 'node', 'node_modules','.git', 'Client-HL', 'Client-ML','Client-Mobile', 'database','Client-Web', 'UnityPlugin'],
          destination: paths.remoteDevelopment,
          delete: 'true',
          chmod: "ugo=rwX",
          progress: true,
          archive: true,
          silent: false,
          compress: true,
          command: true,
      }))
}
// New deploy to development server
exports.deployDev = series(
    deployToDev,
      (cb) => {exec('ssh realityflow_daemon@plato.mrl.ai "cd development && npm install"'); cb()})

function watchEverything(cb) {
  console.log("Watching for file changes...")
  return series(
    buildApp,
    runNodeServer,
    parallel(
    () => watch('src/**/*.ts', 
      { ignoreInitial: true }, 
      buildApp),
    () => watch('node/**/*.js', 
      { ignoreInitial: true, delay: 500}, 
      runNodeServer)))(cb)
}

var env = gutil.env.e || "development"

process.on('SIGINT', function() {
  console.log('Interrupt signal detected; terminating node server...');
  npid.remove('./run/gulp.pid')
  if(server != undefined) {
    server.kill();
    fs.unlink(`${paths.run}/server.pid`, function (err) {});
  }
  process.exit();
});

process.on('exit', function () {
  npid.remove('./run/gulp.pid')
  if(server != undefined) {
    console.log("Server going down...")
    server.kill();
    fs.unlink(`${paths.run}/server.pid`, function (err) {});
  }
});


exports.default = watchEverything;
exports.runNodeServer = runNodeServer;
exports.build = buildApp