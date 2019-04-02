// Karma configuration
// Generated on Tue Dec 22 2015 18:29:31 GMT+0100 (CET)

/*
  To configurate test run. Possible values: travis, coverage
 */
const TYPE = process.argv[4]

module.exports = (config) => {
  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',
    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine', 'karma-typescript'],
    // list of files / patterns to load in the browser
    files: [
      'src/misc/polyfills.browser.ts',
      'src/**/*.ts',
      'src/proto/index.js',
      'test/util/helper.ts',
      'test/functional/*.test.ts',
    ],
    // 'test/functional/manyMembers.test.ts'
    // list of files to exclude
    exclude: ['**/*.node.ts', '**/*Bot*', '*doc*'],
    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'test/**/*.ts': ['karma-typescript'],
      'src/**/*.+(js|ts)': ['karma-typescript'],
    },
    karmaTypescriptConfig: {
      compilerOptions: {
        lib: ['es2017', 'dom'],
        moduleResolution: 'node',
        downlevelIteration: true,
        types: ['node', 'text-encoding'],
        allowJs: true,
      },
      bundlerOptions: {
        exclude: ['wrtc', 'text-encoding', 'uws', 'url', 'crypto'],
        noParse: ['webrtc-adapter/out/adapter_no_edge_no_global.js'],
        addNodeGlobals: false,
      },
      include: ['src/**/*', 'test/**/*'],
      coverageOptions: { exclude: [/src\/proto\/index\.js/i, /test\/.*/i, /.*polyfills*/i] },
      reports: { html: {}, 'text-summary': '' },
    },
    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['spec', 'karma-typescript'],
    // web server port
    port: 9876,
    // enable / disable colors in the output (reporters and logs)
    colors: true,
    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,
    failOnEmptyTestSuite: false,
    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome', 'Firefox'],
    customLaunchers: { FirefoxHeadless: { base: 'Firefox', flags: ['-headless'] } },
    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,
    // Concurrency level
    // how many browser should be started simultanous
    concurrency: Infinity,
    browserNoActivityTimeout: 200000,
  })

  if (process.env.TRAVIS || TYPE === 'travis') {
    config.browsers = ['ChromeHeadless', 'FirefoxHeadless']
    config.autoWatch = false
    config.singleRun = true
    config.browserNoActivityTimeout = 120000
    config.karmaTypescriptConfig.reports = {
      lcovonly: {
        subdirectory: 'lcov',
        filename: 'lcov.info',
      },
      'text-summary': '',
    }
  } else if (TYPE === 'debug') {
    config.autoWatch = true
    config.singleRun = false
  } else if (TYPE === 'precommit-githook') {
    config.browsers = ['ChromeHeadless', 'FirefoxHeadless']
    config.autoWatch = false
    config.singleRun = true
    config.karmaTypescriptConfig.reports = { 'text-summary': '' }
  }
}
