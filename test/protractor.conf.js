// A reference configuration file.
exports.config = {

  // Spec patterns are relative to the location of this config.
  specs: [
    'e2e/*.js',
  ],

  // Patterns to exclude.
  exclude: [],

  seleniumAddress: 'http://localhost:4444/wd/hub',

  // ----- Capabilities to be passed to the webdriver instance ----
  //
  // For a full list of available capabilities, see
  // https://code.google.com/p/selenium/wiki/DesiredCapabilities
  // and
  // https://code.google.com/p/selenium/source/browse/javascript/webdriver/capabilities.js
  capabilities: {
      'browserName': 'chrome',
      'chromeOptions': {
        'args': ['--unlimited-storage'],
        'extensions': []
      }
    },

  // ----- More information for your tests ----
  //
  // A base URL for your application under test. Calls to protractor.get()
  // with relative paths will be prepended with this.
  baseUrl: 'http://localhost:' + (process.env.HTTP_PORT || '9000'),

  // ----- The test framework -----
  //
  // Jasmine and Cucumber are fully supported as a test and assertion framework.
  // Mocha has limited beta support. You will need to include your own
  // assertion framework if working with mocha.
  framework: 'jasmine'
};