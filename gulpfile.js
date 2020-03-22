// Dependencies
const gulp = require('gulp'),
    fs = require('fs'),
    gulp_tslint = require('gulp-tslint');

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
const commands = require('./static/js/commands');
var prompt = require('gulp-prompt');
var gulpif = require('gulp-if');

var exec = require('child_process').exec;
var rsync = require('gulp-rsync');
const webpack_stream = require('webpack-stream')
const webpack_config = require('./webpack.config.js');

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

var tsProject = tsc.createProject("./src/tsconfig.json");

gulp.task('webpack', () => {
    return webpack_stream(webpack_config)
        .pipe(gulp.dest(`${paths.build}`));
});

gulp.task("build-app", function () {
    console.log("Rebulding app");
    return gulp.src('src/**/**/*.ts')
        .pipe(tsProject(tsc.reporter.longReporter()))
        .pipe(gulp.dest("node/server/bld/"))
});
gulp.task("build-client", function () {
    console.log("Rebulding app");
    return gulp.src('src/**/*.ts')
        .pipe(tsProject(tsc.reporter.longReporter()))
        .pipe(gulp.dest("static/bld/"))
});
var tsTestProject = tsc.createProject("./src/tsconfig.json");

gulp.task("build-test", function () {
    return gulp.src([
        "test/**/*.ts",
        "typings/main.d.ts/",
        "server/source/interfaces/interfaces.d.ts"
    ])
        .pipe(tsc(tsTestProject))
        .js.pipe(gulp.dest("test/"));
});

//gulp.task('default', ['docker-compose','watch']);
//gulp.task('default', ['build-app', 'watch']);
function runNodeServer() {
    if(server != null)
        server.kill();
    server = spawn('node',['node/server/bld/server.js'], {stdio: 'inherit'});
    server.on('close', function() {
        gutil.log("Server crashing");
        runNodeServer();
    });
    return server;
}

gulp.task("run-server", function(cb) {
    gutil.log("Running server...");
    runNodeServer();
});
gulp.task("run-stable", ['run-server', 'webpack', 'watch-stable']);

gulp.task('default', ['build-app', 'monitor', 'watch', 'run-server', 'webpack']);

// New deploy to development server
gulp.task('deploy_dev', function () {
    return gulp.src('.')
        .pipe(rsync({
            hostname: 'plato.mrl.ai',
            username: 'realityflow_daemon',
            recursive: true,
            exclude: ['client','node_modules','.git','.vscode','Client-HL', 'Client-HL - Copy', 'Client-HL - Copy - Copy', 'Client-ML','AR Demo', 'object creation test', 'ObjCreationTest'],
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

/*        docker = spawn('docker-compose', ['up'],
            { stdio: ['ignore', process.stdout, process.stderr] });*/
        /*
        docker.stdout.on('data', function (data) {
            var newline = true;
            var output = data.toString();
            var myRegexp = /.*\|\s*(.*)$/mg;
            var match = myRegexp.exec(output);
            while (match = myRegexp.exec(output)) {
                if(match[1].length>0)
                    gutil.log(match[1]);
            }
        });
        docker.stderr.on('data', function (data) {
            var output = data.toString().substr(data.toString().indexOf("|") + 2);
            if(output.length > 0)
                gutil.log(output);
        });
        docker.on('exit', function (code) {
            console.log('child process exited with code ' + code.toString());
        });*/
    }

}

gulp.task('editor', function () {
    return gulp.src([
        './static/index.html'
    ])
        .pipe(connect.reload())
        .pipe(notify('Reloading Flow Editor, please wait...'));
})

gulp.task('monitor', function () {
    return gulp.src([
        './static/monitor.html', './static/monitor.js', './static/flow_common.js'
    ])
        .pipe(connect.reload())
        .pipe(notify('Reloading Flow Monitor, please wait...'));
})

var buffer;
var client_id;
var timer;
var delay = 2000;
var server;

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
    return gulp.src(['./static/modules/**/*.html', './static/modules/**/*.js']);
})

gulp.task('api-update', function () {
    gutil.log("API updated");
    var cmd = { command: commands.UPDATE_API, value: 0 };
    if (node != null)
        node.send(JSON.stringify(cmd));
    return gulp.src(['./node/editor/server/bld/commands/*.js']);
})

gulp.task('watch-stable', function() {
    gulp.watch(['./node/server/bld/server.js'], ['run-server']);
});
gulp.task('watch', ['build-app'], function () {
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
    gulp.watch('./static/css/*.css', connect.reload);
    // Watch HTML and livereload
    gulp.watch(['./static/index.html', './static/js/flow.js', './static/js/client_interface.js',
        './static/js/flow_common.js'], ['editor']);
    gulp.watch(['./src/**/**/*.ts'], ['build-app']);
    gulp.watch(['./node/server/bld/server.js'], ['run-server']);
    //gulp.watch(['./server/static/flow-extensions/*.html', './server/static/flow-extensions/*.js'], ['extension-update']);
    //gulp.watch(['./server/static/modules/**/*.html', './server/static/modules/**/ *.js'], ['module-update']);
    //gulp.watch(['./server/bld/commands/*.js'], ['api-update']);
});

var env = gutil.env.e || "development"
