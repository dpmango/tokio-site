var gulp = require('gulp')
var config = require('../config')

gulp.task('copy:media', function() {
  return gulp
    .src(config.src.media + '/*.*')
    .pipe(gulp.dest(config.dest.media))
});