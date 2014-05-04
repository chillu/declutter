module.exports = function(config){

  if (!process.env.SAUCE_USERNAME || !process.env.SAUCE_ACCESS_KEY) {
    console.log('Make sure the SAUCE_USERNAME and SAUCE_ACCESS_KEY environment variables are set.');
    process.exit(1);
  }

  // Browsers to run on Sauce Labs
  var customLaunchers = {
    'SL_Chrome': {
      base: 'SauceLabs',
      browserName: 'chrome'
    }
  };

  config.set({
    basePath : '../',
    files : [
      'app/bower_components/angular/angular.js',
      'app/bower_components/angular-resource/angular-resource.js',
      'app/bower_components/angular-cookies/angular-cookies.js',
      'app/bower_components/angular-sanitize/angular-sanitize.js',
      'app/bower_components/angular-route/angular-route.js',
      'app/bower_components/angular-animate/angular-animate.js',
      'app/bower_components/angular-ui-router/release/angular-ui-router.js',
      'app/bower_components/ionic/release/js/ionic.js',
      'app/bower_components/ionic/release/js/ionic-angular.js',
      'app/bower_components/ngstorage/ngStorage.js',
      'app/bower_components/moment/moment.js',
      'app/bower_components/angular-moment/angular-moment.js',
      'app/bower_components/angular-filesystem/src/filesystem.js',
      'app/bower_components/angular-mocks/angular-mocks.js',
      'app/scripts/**/*.js',
      'test/unit/**/*.js'
    ],
    frameworks: ['jasmine'],
    reporters: ['dots'],
    colors: true,
    logLevel: config.LOG_DEBUG,
    sauceLabs: {
      startConnect: false,
      testName: 'Declutter Unit Tests'
    },
    captureTimeout: 120000,
    customLaunchers: customLaunchers,
    browsers: Object.keys(customLaunchers),
    singleRun: true
  });
};