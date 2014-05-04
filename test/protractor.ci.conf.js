exports.config = {

  sauceUser: process.env.SAUCE_USERNAME,
  sauceKey: process.env.SAUCE_ACCESS_KEY,

  specs: [
    'e2e/*.js',
  ],

  exclude: [],

  seleniumAddress: 'http://localhost:4445/wd/hub',

  capabilities: {
      'browserName': 'chrome',
      'chromeOptions': {
        'args': ['--unlimited-storage'],
        'extensions': []
      }
    },

  baseUrl: 'http://localhost:' + (process.env.HTTP_PORT || '9000'),

  framework: 'jasmine'
};