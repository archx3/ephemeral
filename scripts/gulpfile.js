let gulp = require('gulp');
let rename = require('gulp-rename');
let postcss = require('gulp-postcss');
let autoprefixer = require('autoprefixer');
let cssnano = require('cssnano');
var concat = require('gulp-concat');
var closureCompiler = require('gulp-closure-compiler');
const closureCompilerPath = '/home/kobina/Downloads/Apps/closure-compiler-v20170626.jar';

//
gulp.task('concat-base-css', function ()
{
   return gulp.src(['../public/css/sh/flyout-toolbox.css',
                    '../public/css/sh/sharehouse.css',
                    '../public/css/sh/bumble-bee.css',
                    '../public/fonts/font-awesome.css',
                    '../public/css/vendor/form.css',
                    '../public/css/vendor/menu.css',
                    '../public/css/vendor/root.css'])/*, 'assets/src/module*.src'*/
              .pipe(concat('sojdswew.css')) ///SUPER CRYPTIC NAME
              .pipe(gulp.dest('../public/css'));

});

gulp.task('minify-base-css', function ()
{
   let plugins = [
      autoprefixer({ browsers : ['last 1 version'] }),
      cssnano()];
   return gulp.src('../public/css/sojdswew.css')
              .pipe(postcss(plugins))
              .pipe(rename(function (path)
                           {
                              path.dirname += ""; //a new sub dir under the dest dir
                              path.basename += ".min";
                              path.extname = ".css"; //file extension to use
                           }))
              .pipe(gulp.dest('../public/css'));
});

gulp.task('minify-base-js', function ()
{
   return gulp.src(['../public/js/Ajax.js',])
              .pipe(closureCompiler({
                                       compilerPath : closureCompilerPath,
                                       fileName     : 'Ajax.js.min.js'
                                    }))
              .pipe(gulp.dest('../public/js/dist'));

});

gulp.task('minify-base2-js', function ()
{
   return gulp.src(['../public/js/Dom.js'])
              .pipe(closureCompiler({
                                       compilerPath : closureCompilerPath,
                                       fileName     : 'Dom.min.js'
                                    }))
              .pipe(gulp.dest('../public/js/dist'));

});


gulp.task('minify-base3-js', function ()
{
   return gulp.src(['../public/js/event.js',])
              .pipe(closureCompiler({
                                       compilerPath : closureCompilerPath,
                                       fileName     : 'event.min.js'
                                    }))
              .pipe(gulp.dest('../public/js/dist'));

});

//
gulp.task('concat-core-js', function ()
{
   return gulp.src([
      '../public/js/base.min.js',
      '../public/js/dist/Dom.min.js',
      '../public/js/dist/event.min.js',
      '../public/js/dist/Ajax.min.js',
                    ])
              .pipe(concat('bee-base.min.js'))
              .pipe(gulp.dest('../public/js'));

});



