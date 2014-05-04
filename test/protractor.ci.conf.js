exports.config = {

  sauceUser: process.env.SAUCE_USERNAME,
  sauceKey: process.env.SAUCE_ACCESS_KEY,

  specs: [
    'e2e/*.js',
  ],

  exclude: [],

  capabilities: {
      'name': 'Declutter End-to-End Tests',
      'browserName': 'chrome',
      'chromeOptions': {
        'args': ['--unlimited-storage'],
        'extensions': []
      },
      'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
      'build': process.env.TRAVIS_BUILD_NUMBER
    },

  baseUrl: 'http://localhost:' + (process.env.HTTP_PORT || '9000'),

  framework: 'jasmine'
};