// Dependencies
const gulp = require('gulp'),
    fs = require('fs'),
    gulp_tslint = require('gulp-tslint');
    process = require('process');

'use strict';
var config = JSON.parse(fs.readFileSync('./gulp_config.json'));
var local_config = JSON.parse(fs.readFileSync('./local_config.json'));
var nodemon = require('gulp-nodemon');
var notify = require('gulp-notify');
var connect = require('gulp-connect');
var gutil = require('gulp-util');
var spawn = require('child_process').spawn;
var tsc = require("gulp-typescript");
var sourcemaps = require('gulp-sourcemaps');
const stream = require('stream');
const path = require('path');
var prompt = require('gulp-prompt');
var gulpif = require('gulp-if');

var exec = require('child_process').exec;
var rsync = require('gulp-rsync');
// const webpack_stream = require('webpack-stream')
// const webpack_config = require('./webpack.config.js');

var mkdirs = require('mkdirs');
var node;

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

// gulp.task('webpack', () => {
//     return webpack_stream(webpack_config)
//         .pipe(gulp.dest(`${paths.build}`));
// });

gulp.task("build-app", function () {
    console.log("Rebulding app");
    return gulp.src(['src/**/*.ts','!src/**/*.test.ts'])
        .pipe(tsProject(tsc.reporter.longReporter()))
        .pipe(gulp.dest("node/server/bld/"))
});

gulp.task("restart-remote-server", function () {
    console.log("Rebulding app");
    return gulp.src(['src/**/*.ts','!src/**/*.test.ts'])
        .pipe(tsProject(tsc.reporter.longReporter()))
        .pipe(gulp.dest("node/server/bld/"))
});

var tsTestProject = tsc.createProject("./tsconfig.json");

gulp.task("build-test", function () {
    return gulp.src([
        "src/**/*.test.ts",
    ])
        .pipe(tsc(tsTestProject))
        .js.pipe(gulp.dest("test/"));
});

function runNodeServer() {
    if(server != null)
        server.kill();
    server = spawn('node',['node/server/bld/server.js'], {stdio: 'inherit'});
    
    if (server.pid) {
        pidFile = fs.createWriteStream("./server.pid");
        pidFile.write(server.pid.toString());
        pidFile.end();
    }

    server.on("error", function(err) {
        console.error(err);
    })

    server.on('close', function() {
        fs.unlink("./server.pid", function (err) {});
        gutil.log("Server crashing");
        // runNodeServer();
    });
    return server;
}

gulp.task("run-server", ['build-app'], function() {
    gutil.log("Running server...");
    runNodeServer();
});
gulp.task("run-stable", ['run-server', 'watch-stable']);

gulp.task('default', ['watch', 'run-server']);

// New deploy to development server
gulp.task('deploy-dev', function () {
    return gulp.src('.')
        .pipe(rsync({
            hostname: 'plato.mrl.ai',
            username: 'pbettler',
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
});

var running = false;

var runCommand = function (command, cb) {
    if (!running) {
        running = true;
    }

}

var buffer;
var client_id;
var timer;
var delay = 2000;
var server;

gulp.task('watch-stable', function() {
    gulp.watch(['./node/server/bld/server.js'], ['run-server']);
});

gulp.task('watch', function () {
    gutil.log("Starting livereload server");
    // try {
    //     connect.server({
    //         livereload: true,
    //         root: 'public',
    //         debug: false,
    //         port: 8888
    //     });
    // } catch (e) {
    //     gutil.log(e);
    // }
    // gulp.watch('./static/css/*.css', connect.reload);
    // Watch HTML and livereload
    // gulp.watch(['./static/index.html', './static/js/flow.js', './static/js/client_interface.js',
    //     './static/js/flow_common.js'], ['editor']);
    gulp.watch('./src/**/*.ts', { ignoreInitial: false }, function() {
        gulp.start('run-server');
    })
    // gulp.watch(['./node/server/bld/server.js'], ['run-server']);
});

var env = gutil.env.e || "development"
if (process.pid) {
    pidFile = fs.createWriteStream("./gulp.pid");
    pidFile.write(process.pid.toString());
    pidFile.end();
}

process.on('exit', function() {
    fs.unlink("./gulp.pid", function (err) {});
})