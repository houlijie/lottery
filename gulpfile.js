const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const plumber = require('gulp-plumber'); // 报错就中断？使用这个处理一下即可。
const browserify = require('gulp-browserify');
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const cssmin = require('gulp-cssmin');
const rename = require('gulp-rename');
const del = require('del');
const replace = require('gulp-batch-replace'); // 内容替换(这个没问题，上个包出的问题，这个包没出类似的问题)
const runSequence = require('run-sequence'); // 同步
const entryPath = `./public/static/src`;
const outputPath = `./public/static/dist`;

gulp.task('views', () => {
    gulp.src(`${entryPath}/views/**/*.*`)
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
        .pipe(gulp.dest(`${outputPath}/views/`));
});

gulp.task('js', function () {
    gulp.src(`${entryPath}/js/**/*.js`)
        .pipe(plumber())
        .pipe(babel({
            presets: ['@babel/env'],
        }))
        .pipe(browserify())
        .pipe(uglify())
        .pipe(gulp.dest(`${outputPath}/js/`));
});

gulp.task('scss', function () {
    gulp.src(`${entryPath}/scss/**/*.scss`)
        .pipe(plumber())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false,
        }))
        .pipe(sass().on('error', sass.logError))
        .pipe(cssmin())
        .pipe(gulp.dest(`${outputPath}/css/`));
});

gulp.task('images', function () {
    gulp.src(`${entryPath}/images/**/*.*`)
        .pipe(plumber())
        .pipe(imagemin())
        .pipe(gulp.dest(`${outputPath}/images/`));
});

gulp.task('watch', function () {
    gulp.watch([`${entryPath}/views/**/*.*`], ['views']);
    gulp.watch([`${entryPath}/js/**/*.js`], ['js']);
    gulp.watch([`${entryPath}/scss/**/*.scss`], ['scss']);
    gulp.watch([`${entryPath}/images/**/*.*`], ['images']);
});

gulp.task('dev', ['views', 'js', 'scss', 'images', 'watch']);
