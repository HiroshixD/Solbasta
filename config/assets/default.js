'use strict';

module.exports = {
  client: {
    lib: {
      css: [
        // bower:css
        'public/lib/bootstrap/dist/css/bootstrap.css',
        'public/lib/bootstrap/dist/css/bootstrap-theme.css',
        'http://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700',
        'public/assets/plugins/jquery-ui/themes/base/minified/jquery-ui.min.css',
        'public/assets/plugins/font-awesome/css/font-awesome.min.css',
        'public/assets/css/animate.min.css',
        'public/assets/css/style.min.css',
        'public/assets/css/style-responsive.min.css',
        'public/assets/css/theme/default.css',
        'public/assets/plugins/jquery-jvectormap/jquery-jvectormap-1.2.2.css',
        'public/assets/plugins/bootstrap-calendar/css/bootstrap_calendar.css',
        'public/assets/plugins/gritter/css/jquery.gritter.css',
        'public/assets/plugins/morris/morris.css',
        'public/assets/plugins/parsley/src/parsley.css',
        'public/assets/plugins/isotope/isotope.css',
        'public/assets/plugins/lightbox/css/lightbox.css',
        'http://code.jquery.com/ui/1.8.21/themes/base/jquery-ui.css',
        'public/lib/jquery-timepicker-wvega/jquery.timepicker.css',
        'public/lib/ng-alertify/dist/ng-alertify.css'
        // endbower
      ],
      js: [
        // bower:js
        'https://integ-pago.culqi.com/js/v1',
        'public/assets/plugins/pace/pace.min.js',
        'public/assets/plugins/jquery/jquery-1.9.1.min.js',
        'public/assets/plugins/jquery/jquery-migrate-1.1.0.min.js',
        'public/assets/plugins/jquery-ui/ui/minified/jquery-ui.min.js',
        'public/assets/plugins/bootstrap/js/bootstrap.min.js',
        'public/assets/plugins/slimscroll/jquery.slimscroll.min.js',
        'public/assets/plugins/jquery-cookie/jquery.cookie.js',
        'public/assets/plugins/morris/raphael.min.js',
        'public/assets/plugins/morris/morris.js',
        'public/assets/plugins/jquery-jvectormap/jquery-jvectormap-1.2.2.min.js',
        'public/assets/plugins/jquery-jvectormap/jquery-jvectormap-world-merc-en.js',
        'public/assets/plugins/bootstrap-calendar/js/bootstrap_calendar.min.js',
        'public/assets/plugins/gritter/js/jquery.gritter.js',
        'public/assets/js/dashboard-v2.min.js',
        'public/assets/plugins/parsley/dist/parsley.js',
        'public/assets/plugins/isotope/jquery.isotope.min.js',
        'public/assets/plugins/lightbox/js/lightbox-2.6.min.js',
        'public/assets/js/gallery.demo.min.js',
        'public/assets/js/apps.min.js',
        'public/lib/angular/angular.js',
        'public/lib/moment/moment.js',
        'public/lib/angular-resource/angular-resource.js',
        'public/lib/angular-animate/angular-animate.js',
        'public/lib/angular-messages/angular-messages.js',
        'public/lib/angular-ui-router/release/angular-ui-router.js',
        'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
        'public/lib/angular-file-upload/dist/angular-file-upload.js',
        'public/lib/owasp-password-strength-test/owasp-password-strength-test.js',
        'https://cdn.rawgit.com/alertifyjs/alertify.js/v1.0.10/dist/js/alertify.js',
        'public/lib/jquery-timepicker-wvega/jquery.timepicker.js',
        'public/lib/ng-alertify/dist/ng-alertify.js',
        'public/assets/js/jquery.jscrollpane.js',
        'public/assets/js/jquery.mousewheel.js'
        // endbower
      ],
      tests: ['public/lib/angular-mocks/angular-mocks.js']
    },
    css: [
      'modules/*/client/css/*.css'
    ],
    less: [
      'modules/*/client/less/*.less'
    ],
    sass: [
      'modules/*/client/scss/*.scss'
    ],
    js: [
      'modules/core/client/app/config.js',
      'modules/core/client/app/init.js',
      'modules/admin/client/app/config.js',
      'modules/admin/client/app/init.js',
      'modules/*/client/*.js',
      'modules/*/client/**/*.js',
      'modules/*/client/filters/*.js'
    ],
    img: [
      'modules/**/*/img/**/*.jpg',
      'modules/**/*/img/**/*.png',
      'modules/**/*/img/**/*.gif',
      'modules/**/*/img/**/*.svg'
    ],
    views: ['modules/*/client/views/**/*.html'],
    templates: ['build/templates.js']
  },
  server: {
    gruntConfig: ['gruntfile.js'],
    gulpConfig: ['gulpfile.js'],
    allJS: ['server.js', 'config/**/*.js', 'modules/*/server/**/*.js'],
    models: 'modules/*/server/models/**/*.js',
    routes: ['modules/!(core)/server/routes/**/*.js', 'modules/core/server/routes/**/*.js'],
    sockets: 'modules/*/server/sockets/**/*.js',
    config: ['modules/*/server/config/*.js'],
    policies: 'modules/*/server/policies/*.js',
    views: ['modules/*/server/views/*.html']
  }
};
