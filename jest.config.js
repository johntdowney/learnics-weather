module.exports = {
    preset: "@vue/cli-plugin-unit-jest",
    collectCoverage: true,
    coverageReporters: ["lcov", "text"], // use "text-summary" for a less verbose output
    collectCoverageFrom: ["src/**/*.{js,vue}"],
    testMatch: [
        "**/**.spec.js", "**/**/**.spec.js", "tests/**/**.spec.js", "tests/**/**/**.spec.js"
    ],
    setupFiles: [
      "./jest-setup.js",
      "trace-unhandled/register"
    ],
    transform: { '^.*\\.js$': 'babel-jest' },
    transformIgnorePatterns: ['node_modules/(?!vue-router|@babel|vuetify)']
};
