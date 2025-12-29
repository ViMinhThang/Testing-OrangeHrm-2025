// ***********************************************
// This support file is processed and loaded automatically
// before your test files.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************

// Import commands
import './commands';

// Prevent uncaught exceptions from failing tests
Cypress.on('uncaught:exception', (err, runnable) => {
    // Return false to prevent the error from failing this test
    if (err.message.includes("reading 'length'") ||
        err.message.includes("undefined") ||
        err.message.includes("Cannot read properties")) {
        return false;
    }
    return false; // For demo sites, ignore all uncaught exceptions
});

// Log test start/end
Cypress.on('test:before:run', (test) => {
    console.log(`Starting test: ${test.title}`);
});

Cypress.on('test:after:run', (test, runnable) => {
    console.log(`Finished test: ${test.title} - ${test.state}`);
});
