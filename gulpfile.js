// Dependencies
const gulp = require('gulp'),
    fs = require('fs'),
    gulp_tslint = require('gulp-tslint');

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

// var node;

const paths = {
    src: './node/server/bld/',
    build: './static/'
};

gulp.task('tslint', function() {
    return gulp.src(['src/**/*.ts', '!**/*.d.ts'])
        .pipe(gulp_tslint({}))
        .pipe(gulp_tslint.report());
});

var tsProject = tsc.createProject("./tsconfig.json");

  var tsTestProject = tsc.createProject("./tsconfig.json");

  gulp.task("build-test", function () {
      return gulp.src([
          "src/**/*.test.ts",
      ])
          .pipe(tsc(tsTestProject))
          .js.pipe(gulp.dest("test/"));
  });

function buildApp() {
    console.log("Building app...")
    return gulp.src(['src/**/*.ts','!src/**/*.test.ts'])
        .pipe(tsProject(tsc.reporter.longReporter()))
        .pipe(gulp.dest("node/server/bld/"))
}

function runNodeServer(cb) {
    if(server != null)
        server.kill();
    server = spawn('node',['node/server/bld/server.js'], {stdio: 'inherit'});
    server.on('close', function() {
        gutil.log("Server crashing");
    });
    fs.writeFileSync('./run/server.pid', server.pid)
    cb();
}

// New deploy to development server
function deployDev () {
  return gulp.src('.')
      .pipe(rsync({
          hostname: 'plato.mrl.ai',
          username: 'realityflow_daemon',
          recursive: true,
          exclude: ['.github','.vscode','node_modules','.git', 'Client-HL', 'Client-ML','Client-Mobile', 'database','Client-Web', 'UnityPlugin'],
          destination: '/var/realityflow/development/',
          chmod: "ugo=rwX",
          progress: true,
          archive: true,
          silent: false,
          compress: true,
          command: true,
      }));
}

var server;

gulp.task('watch-stable', function() {
    gulp.watch(['./node/server/bld/server.js'], ['run-server']);
});

function watch() {
  return gulp.watch('./src/**/*.ts', { ignoreInitial: false }, gulp.series(buildApp, runNodeServer))
}

const defaultTasks = gulp.series(watch);

  var env = gutil.env.e || "development"

exports.default = defaultTasks
exports.deployDev = deployDev