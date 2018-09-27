const gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    plumber = require('gulp-plumber'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    stylus = require('gulp-stylus'),
    imageminJpegRecompress = require('imagemin-jpeg-recompress'),
    pngquant = require('imagemin-pngquant'),
    cache = require('gulp-cache'),
    browserSync = require('browser-sync').create();

const styleSrc = 'src/styl/**/*.styl',
    scriptSrc = 'src/js/*.js';

gulp.task('imgProd', function() {
    gulp.src('src/img/*')
        .pipe(plumber())
        .pipe(cache(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.jpegtran({progressive: true}),
            imageminJpegRecompress({
              loops: 5,
              min: 65,
              max: 70,
              quality:'medium'
            }),
            imagemin.svgo(),
            imagemin.optipng({optimizationLevel: 3}),
            pngquant({quality: '65-70', speed: 5})
        ],{
            verbose: true
        })))
        .pipe(gulp.dest('dist/img'));
});

gulp.task('images', () => {
    gulp.src('src/img/*')
        .pipe(plumber())
        .pipe(gulp.dest('dist/img'))
})

gulp.task('scripts', function() {
    gulp.src('src/js/*.js')
        .pipe(plumber())
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

gulp.task('styl', function() {
    gulp.src('src/styl/**/*.styl')
    .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(stylus({compress: true}))
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/css'));
});

gulp.task('watch', function(){
    browserSync.init({
        server: {
            baseDir: "./dist"
        },
        notify: false
    });
    gulp.watch(styleSrc,['styl']);
    gulp.watch(scriptSrc,['scripts']);
    gulp.watch('src/img/*', ['images'])
    gulp.watch(['dist/index.html', 'dist/css/style.css', 'dist/app.js']).on('change', browserSync.reload);
});

gulp.task('default', ['styl', 'scripts', 'images', 'watch'], function () {});