const { defineConfig } = require("cypress");

module.exports = defineConfig({
    e2e: {
        // Timeouts
        defaultCommandTimeout: 10000,
        pageLoadTimeout: 120000,
        requestTimeout: 10000,
        responseTimeout: 30000,

        // Viewport
        viewportWidth: 1280,
        viewportHeight: 720,

        // Video & Screenshots
        video: true,
        screenshotOnRunFailure: true,

        // Retries for flaky tests
        retries: {
            runMode: 1,
            openMode: 0
        },

        // Spec pattern - where to find test files
        specPattern: 'cypress/e2e/**/*.cy.js',

        setupNodeEvents(on, config) {
            // Node event listeners
            on('task', {
                log(message) {
                    console.log(message);
                    return null;
                }
            });
        },
    },
});
