// Dependencies
const gulp = require('gulp'),
    fs = require('fs'),
    gulp_tslint = require('gulp-tslint');
    process = require('process');

'use strict';
var config = JSON.parse(fs.readFileSync('./gulp_config.json'));
var gutil = require('gulp-util');
var spawn = require('child_process').spawn;
var tsc = require("gulp-typescript");
// var sourcemaps = require('gulp-sourcemaps');
// const stream = require('stream');
// const path = require('path');
var npid = require('npid');

try {
    var pid = npid.create('./run/gulp.pid');
    pid.removeOnExit();
  } catch (err) {
    console.log("Error, previous run did not exit cleanly.");
    npid.remove('./run/gulp.pid')
    var pid = npid.create('./run/gulp.pid');
    pid.removeOnExit();
    // process.exit(1);
}

var rsync = require('gulp-rsync');
// const webpack_stream = require('webpack-stream')
// const webpack_config = require('./webpack.config.js');

// var node;

const paths = {
    run: './run/',
    build: './node/server/bld/',
    remoteDevelopment: '/var/realityflow/development/'
};

gulp.task('tslint', function() {
    return gulp.src(['src/**/*.ts', '!**/*.d.ts'])
        .pipe(gulp_tslint({}))
        .pipe(gulp_tslint.report());
});

var tsProject = tsc.createProject("./tsconfig.json");

// var tsTestProject = tsc.createProject("./tsconfig.json");

// gulp.task("build-test", function () {
//     return gulp.src([
//         "src/**/*.test.ts",
//     ])
//         .pipe(tsc(tsTestProject))
//         .js.pipe(gulp.dest("test/"));
// });

function buildApp() {
    console.log("Building app...")
    return gulp.src(['src/**/*.ts','!src/**/*.test.ts'])
        .pipe(tsProject(tsc.reporter.longReporter()))
        .pipe(gulp.dest(paths.build))
}

function runNodeServer() {
    if(server != null)
        server.kill();
    server = spawn('node',[`${paths.build}/server.js`], {stdio: 'inherit'});
    
    if (server.pid) {
        fs.writeFileSync(`${paths.run}/server.pid`, server.pid)
    }

    server.on("error", function(err) {
        console.error(err);
    })

    server.on('close', function() {
        fs.unlink(`${paths.run}/server.pid`, function (err) {});
        gutil.log("Server crashing");
        runNodeServer();
    });
}

// New deploy to development server
function deployDev () {
  return gulp.src('.')
      .pipe(rsync({
          hostname: 'plato.mrl.ai',
          username: 'realityflow_daemon',
          recursive: true,
          exclude: ['.gitignore', 'package-lock.json', '.github','.vscode','node_modules','.git', 'Client-HL', 'Client-ML','Client-Mobile', 'database','Client-Web', 'UnityPlugin'],
          destination: paths.remoteDevelopment,
          chmod: "ugo=rwX",
          progress: true,
          archive: true,
          silent: false,
          compress: true,
          command: true,
      }));
}

var server;


function watch() {
  return gulp.watch('./src/**/*.ts', 
    { ignoreInitial: false }, 
    gulp.series(buildApp, runNodeServer))
}

exports.default = gulp.series(watch);
exports.build = buildApp
exports.deployDev = deployDev

var env = gutil.env.e || "development"
