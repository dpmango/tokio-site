var gulp   = require('gulp');
var server = require('browser-sync').create();
var util   = require('gulp-util');
var config = require('../config');

// in CL 'gulp server --open' to open current project in browser
// in CL 'gulp server --tunnel siteName' to make project available over http://siteName.localtunnel.me

gulp.task('server', function() {
  server.init({
    server: {
      baseDir: !config.production ? [config.dest.root, config.src.root] : config.dest.root,
      directory: false,
      serveStaticOptions: {
        extensions: ['html']
      }
    },
    files: [
      config.dest.html + '/*.html',
      config.dest.css + '/*.css',
      config.dest.css + '/*.map',
      config.dest.js + '/*.js',
      config.dest.img + '/**/*'
    ],
    port: util.env.port || 3000,
    logLevel: 'info', // 'debug', 'info', 'silent', 'warn'
    logConnections: false,
    logFileChanges: true,
    open: Boolean(util.env.open || true),
    notify: false,
    ghostMode: false,
    online: true,
    tunnel: util.env.tunnel || null
  });
});

module.exports = server;
