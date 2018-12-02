const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const plumber = require('gulp-plumber');
const browserify = require('gulp-browserify');
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const cssmin = require('gulp-cssmin');
const rename = require('gulp-rename');
const del = require('del');
const replace = require('gulp-batch-replace');
const through = require('through2');
const runSequence = require('run-sequence'); // 同步(要保证task中return了一个Promise，否则无效)
const rev = require('gulp-rev'); // 生成md5文件以及生成md的映射文件
const revCollector = require('gulp-rev-collector'); // 替换html中引入的文件名(css，js，images)。替换css中引入的文件名(images)。也就是说此包可以用来替换被引入文件的路径以及文件名。
const sourcemaps = require('gulp-sourcemaps');
const entryPath = `./public/static/src`;
const outputPath = `./public/static/dist`;
const outputPathTemporary = `./public/static/dist-temporary`;
const dirReplacementsDev = { // 对css和html中的进行路径替换
    'css/': '/static/dist/css/',
    'js/': '/static/dist/js/',
    'images/': '/static/dist/images/',
};
const dirReplacementsBuild = { // 对css和html中的进行路径替换
    'css/': '/static/dist/css/',
    'js/': '/static/dist/js/',
    'images/': '/static/dist/images/',
};

gulp.task('dev-views', () => {
    return gulp.src(`${entryPath}/views/**/*.*`)
        .pipe(plumber())
        .pipe(revCollector({
            replaceReved: true,
            dirReplacements: dirReplacementsDev,
        }))
        .pipe(gulp.dest(`${outputPath}/views/`));
});

gulp.task('build-views', () => {
    return gulp.src(`${entryPath}/views/**/*.*`)
        .pipe(plumber())
        .pipe(htmlmin({
            collapseWhitespace: true, // 压缩HTML
            removeComments: true, // 清除HTML注释
            collapseBooleanAttributes: true, // 省略布尔属性的值 <input checked="true"/> ==> <input />
            removeScriptTypeAttributes: true, // 删除<script>的type="text/javascript"
            removeStyleLinkTypeAttributes: true, // 删除<style>和<link>的type="text/css"
            minifyJS: true, //压缩页面JS
            minifyCSS: true, //压缩页面CSS
        }))
        .pipe(gulp.dest(`${outputPathTemporary}/views/`));
});

gulp.task('dev-js', function () {
    return gulp.src(`${entryPath}/js/**/*.js`)
        .pipe(plumber())
        .pipe(babel({
            presets: ['@babel/env'],
        }))
        .pipe(browserify())
        .pipe(gulp.dest(`${outputPath}/js/`));
});

gulp.task('build-js', function () {
    return gulp.src(`${entryPath}/js/**/*.js`)
        .pipe(babel({
            presets: ['@babel/env'],
        }))
        .pipe(browserify())
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest(`${outputPath}/js/`))
        .pipe(rev.manifest())
        .pipe(gulp.dest(`${outputPathTemporary}/js/`));
});

gulp.task('dev-scss', function () {
    return gulp.src(`${entryPath}/scss/**/*.scss`)
        .pipe(plumber())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false,
        }))
        .pipe(sass().on('error', sass.logError))
        .pipe(revCollector({
            replaceReved: true,
            dirReplacements: dirReplacementsDev,
        }))
        .pipe(gulp.dest(`${outputPath}/css/`));
});

gulp.task('build-scss', function () {
    return gulp.src(`${entryPath}/scss/**/*.scss`)
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false,
        }))
        .pipe(sass().on('error', sass.logError))
        .pipe(cssmin())
        .pipe(rev())
        .pipe(gulp.dest(`${outputPathTemporary}/css/`))
        .pipe(rev.manifest())
        .pipe(gulp.dest(`${outputPathTemporary}/css/`));
});

gulp.task('dev-images', function () {
    return gulp.src(`${entryPath}/images/**/*.*`)
        .pipe(plumber())
        .pipe(gulp.dest(`${outputPath}/images/`));
});

gulp.task('build-images', function () {
    return gulp.src(`${entryPath}/images/**/*.*`)
        .pipe(imagemin())
        .pipe(rev())
        .pipe(gulp.dest(`${outputPath}/images/`))
        .pipe(rev.manifest())
        .pipe(gulp.dest(`${outputPathTemporary}/images/`));
});

gulp.task('build-rev-views', function () {
    return gulp.src([`${outputPathTemporary}/**/*.json`, `${outputPathTemporary}/views/**/*.*`])
        .pipe(revCollector({
            replaceReved: true,
            dirReplacements: dirReplacementsBuild,
        }))
        .pipe(gulp.dest(`${outputPath}/views/`));
});

gulp.task('build-rev-css', function () {
    return gulp.src([`${outputPathTemporary}/**/*.json`, `${outputPathTemporary}/css/**/*.css`])
        .pipe(revCollector({
            replaceReved: true,
            dirReplacements: dirReplacementsBuild,
        }))
        .pipe(gulp.dest(`${outputPath}/css/`));
});

gulp.task('del-dist', function () {
    return del([outputPath]);
});

gulp.task('del-dist-temporary', function () {
    return del([outputPathTemporary]);
});

gulp.task('dev-watch', function () {
    gulp.watch([`${entryPath}/views/**/*.*`], ['dev-views']);
    gulp.watch([`${entryPath}/js/**/*.js`], ['dev-js']);
    gulp.watch([`${entryPath}/scss/**/*.scss`], ['dev-scss']);
    gulp.watch([`${entryPath}/images/**/*.*`], ['dev-images']);
});

gulp.task('dev', ['dev-views', 'dev-js', 'dev-scss', 'dev-images', 'dev-watch']);

gulp.task('build', function (done) {
    runSequence(['del-dist'], ['build-views', 'build-js', 'build-scss', 'build-images'], ['build-rev-views', 'build-rev-css'], ['del-dist-temporary'], done);
});
