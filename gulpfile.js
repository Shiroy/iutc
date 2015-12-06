var gulp = require("gulp");
var ts = require("gulp-typescript");
var gulpify = require("gulpify");
var rename = require("gulp-rename");
var jade = require('gulp-jade');

var tsProject = ts.createProject('server/tsconfig.json')

var tsProjectClient = ts.createProject('client/tsconfig.json')

gulp.task('server', function(){
    var tsResult = tsProject.src().pipe(ts(tsProject));

    return tsResult.js.pipe(gulp.dest('dist'));
})

gulp.task("client-typescript", function(){
    var tsResult = tsProjectClient.src().pipe(ts(tsProjectClient));

    return tsResult.js.pipe(gulp.dest('./client'));
})

gulp.task("browserify", ["client-typescript"], function(){
    return gulp.src("client/iutc-app.js").pipe(gulpify("iutc.js")).pipe(gulp.dest("dist/public"));
})

gulp.task('public_files', function(){
    return gulp.src('public/**/*').pipe(gulp.dest("dist/public"));
});

gulp.task('jade', function(){
    gulp.src("templates/*.jade")
    .pipe(jade({
        pretty: true
    }))
    .pipe(gulp.dest("./dist/public/"));
});

gulp.task('bootstrap-css', function(){
    return gulp.src("node_modules/bootstrap/dist/css/*.css")
    .pipe(gulp.dest('dist/public/css'));
});

gulp.task('bootstrap-js', function(){
    return gulp.src("node_modules/bootstrap/dist/js/*.js")
    .pipe(gulp.dest('dist/public/js'));
});

gulp.task('bootstrap', ['bootstrap-js', 'bootstrap-css']);

gulp.task("client", ["public_files", "browserify", "jade", "bootstrap"], function(){});

gulp.task("watch", function(){
    gulp.watch("templates/*.jade", ["jade"]);
    gulp.watch("client/**/*.ts", ["browserify"]);
})

gulp.task('default', ['server', 'client', 'watch'], function() {

})
