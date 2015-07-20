var gulp = require('gulp'),
    eslint = require('gulp-eslint');

gulp.task('lint', function () {
    return gulp.src([
      'mvlist-single-bio.js',
      'mvlist-bio.js',
      'ktii/*.js',
      'helpers/*.js',
      'kt-detay/*.js',
      'meclis/*.js'
    ])
    .pipe(eslint({
      envs: ['node']
    }))
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('default', ['lint'], function () {
    // This will only run if the lint task is successful...
});
