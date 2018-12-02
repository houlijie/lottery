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
const revCollector = require('gulp-rev-collector'); // 替换html中引入的内容(css，js，images)。替换css中引入的内容(images)。也可以用来替换路径。
const sourcemaps = require('gulp-sourcemaps');
const entryPath = `./public/static/src`;
const outputPath = `./public/static/dist`;
const outputPathTemporary = `./public/static/dist-temporary`;
const dirReplacements = { // 对css和html中的进行路径替换
    'css/': '/static/dist/css/',
    'js/': '/static/dist/js/',
    'images/': '/static/dist/images/',
};

gulp.task('views-dev', () => {
    return gulp.src(`${entryPath}/views/**/*.*`)
        .pipe(plumber())
        .pipe(gulp.dest(`${outputPathTemporary}/views/`));
});

gulp.task('views-build', () => {
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

gulp.task('js-dev', function () {
    return gulp.src(`${entryPath}/js/**/*.js`)
        .pipe(plumber())
        .pipe(babel({
            presets: ['@babel/env'],
        }))
        .pipe(browserify())
        .pipe(gulp.dest(`${outputPathTemporary}/js/`));
});

gulp.task('js-build', function () {
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

gulp.task('scss-dev', function () {
    return gulp.src(`${entryPath}/scss/**/*.scss`)
        .pipe(plumber())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false,
        }))
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(`${outputPathTemporary}/css/`));
});

gulp.task('scss-build', function () {
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

gulp.task('images-dev', function () {
    return gulp.src(`${entryPath}/images/**/*.*`)
        .pipe(plumber())
        .pipe(gulp.dest(`${outputPathTemporary}/images/`));
});

gulp.task('images-build', function () {
    return gulp.src(`${entryPath}/images/**/*.*`)
        .pipe(imagemin())
        .pipe(rev())
        .pipe(gulp.dest(`${outputPath}/images/`))
        .pipe(rev.manifest())
        .pipe(gulp.dest(`${outputPathTemporary}/images/`));
});

gulp.task('rev-views-dev', function () {
    return gulp.src(`${outputPathTemporary}/views/**/*.*`)
        .pipe(plumber())
        .pipe(revCollector({
            replaceReved: true,
            dirReplacements: dirReplacements,
        }))
        .pipe(gulp.dest(`${outputPath}/views/`));
});

gulp.task('rev-views-build', function () {
    return gulp.src([`${outputPathTemporary}/**/*.json`, `${outputPathTemporary}/views/**/*.*`])
        .pipe(revCollector({
            replaceReved: true,
            dirReplacements: dirReplacements,
        }))
        .pipe(gulp.dest(`${outputPath}/views/`));
});

gulp.task('rev-css-dev', function () {
    return gulp.src(`${outputPathTemporary}/css/**/*.css`)
        .pipe(plumber())
        .pipe(revCollector({
            replaceReved: true,
            dirReplacements: dirReplacements,
        }))
        .pipe(gulp.dest(`${outputPath}/css/`));
});

gulp.task('rev-css-build', function () {
    return gulp.src([`${outputPathTemporary}/**/*.json`, `${outputPathTemporary}/css/**/*.css`])
        .pipe(revCollector({
            replaceReved: true,
            dirReplacements: dirReplacements,
        }))
        .pipe(gulp.dest(`${outputPath}/css/`));
});

gulp.task('del-dist', function () {
    return del([outputPath]);
});

gulp.task('del-dist-temporary', function () {
    return del([outputPathTemporary]);
});

gulp.task('watch', function () {
    gulp.watch([`${entryPath}/views/**/*.*`], ['views']);
    gulp.watch([`${entryPath}/js/**/*.js`], ['js']);
    gulp.watch([`${entryPath}/scss/**/*.scss`], ['scss']);
    gulp.watch([`${entryPath}/images/**/*.*`], ['images']);
});

gulp.task('dev', function (done) {
    runSequence(['del-dist'], ['views-dev', 'js-dev', 'scss-dev', 'images-dev'], ['rev-views-dev', 'rev-css-dev'], ['del-dist-temporary', 'watch'], done);
});

gulp.task('build', function (done) {
    runSequence(['del-dist'], ['views-build', 'js-build', 'scss-build', 'images-build'], ['rev-views-build', 'rev-css-build'], ['del-dist-temporary'], done);
});
