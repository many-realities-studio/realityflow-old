// Dependencies
const gulp = require('gulp'),
        fs = require('fs');

'use strict';
var config = JSON.parse(fs.readFileSync('./gulp_config.json'));
var local_config = JSON.parse(fs.readFileSync('./local_config.json'));
var notify = require('gulp-notify');
var connect = require('gulp-connect');
var gutil = require('gulp-util');
var spawn = require('child_process').spawn;
const stream = require('stream');
const path = require('path');
const commands = require('./server/bld/common/commands');

var exec = require('child_process').exec;
var mkdirs = require('mkdirs');
var node;

gulp.task('default', ['server', 'watch']);

var runCommand = function (command) {
    exec(command, function (err, stdout, stderr) {
        console.log("Running " + command);
        console.log(stdout);
        console.log(stderr);
        if (err !== null) {
            console.log('exec error: ' + err);
        }
    });
}

// Task
// use a Writable stream
var customStream = new stream.Writable();
customStream._write = function (data) {
    console.log("CUSTOM: " + data.toString());
};

gulp.task('server', function (cb) {
    if (node) node.kill()
    node = spawn('node', ['server/bld/server.js'], { stdio: ['inherit', 'inherit', 'inherit', 'ipc'] })
    node.on('close', function (code) {
        if (code === 8) {
            gulp.log('Error detected, waiting for changes...');
        }
    });
    node.on('message', function (msg) {
        cmd = JSON.parse(msg);
        if (cmd.msg == 'Hello') {
            console.log(msg);
        } else {
            console.log(msg);
        }
    })
    cb();
});

gulp.task('editor', function () {
    return gulp.src([
        './server/static/index.html'
    ])
        .pipe(connect.reload())
        .pipe(notify('Reloading Flow Editor, please wait...'));
})

gulp.task('monitor', function () {
    return gulp.src([
        './server/static/monitor.html', './server/static/monitor.js', './server/static/flow_common.js'
    ])
    .pipe(connect.reload())
    .pipe(notify('Reloading Flow Monitor, please wait...'));
})

var buffer;
var client_id;
var timer;
var delay = 2000;

gulp.task('extension-update', function () {
    gutil.log("Extension updated");
    var cmd = { command: commands.UPDATE_EXTENSIONS, value: 0 };
    if (node != null)
        node.send(JSON.stringify(cmd));
})

gulp.task('module-update', function () {
    gutil.log("Module updated");
    var cmd = { command: commands.UPDATE_MODULES, value: 0 };
    if (node != null)
        node.send(JSON.stringify(cmd));
    return gulp.src(['./server/static/modules/**/*.html', './server/static/modules/**/*.js']);
})

gulp.task('api-update', function () {
    gutil.log("API updated");
    var cmd = { command: commands.UPDATE_API, value: 0 };
    if (node != null)
        node.send(JSON.stringify(cmd));
    return gulp.src(['./server/bld/commands/*.js']);
})

gulp.task('watch', function () {
    gutil.log("Starting livereload server");
    try {
        connect.server({
            livereload: true,
            root: 'public',
            debug: false,
            port: 8888
        });
    } catch (e) {
        gutil.log(e);
    }
    //gulp.watch('./server/static/css/*.css', connect.reload);
    // Watch HTML and livereload
    //gulp.watch(['./server/static/index.html', './server/static/js/flow.js', './server/static/js/client_interface.js',
    //    './server/static/js/flow_common.js'], ['editor']);
    //gulp.watch(['./server/static/flow-extensions/*.html', './server/static/flow-extensions/*.js'], ['extension-update']);
    //gulp.watch(['./server/static/modules/**/*.html', './server/static/modules/**/ *.js'], ['module-update']);
    //gulp.watch(['./server/bld/commands/*.js'], ['api-update']);
    gulp.watch(['./server/bld/**/*.js'], ['server']);
});

var env = gutil.env.e || "development"