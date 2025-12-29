// ***********************************************
// Custom Cypress commands for reusable test logic
// ***********************************************

// OrangeHRM Login Command
Cypress.Commands.add('loginOrangeHRM', (username = 'Admin', password = 'admin123') => {
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    cy.get('input[name="username"]', { timeout: 30000 }).should('be.visible');
    cy.get('input[name="username"]').type(username);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
});

// OrangeHRM Logout Command
Cypress.Commands.add('logoutOrangeHRM', () => {
    cy.get('.oxd-userdropdown-name').click();
    cy.contains('Logout').click();
});

// CMS Login Command
Cypress.Commands.add('loginCMS', (email = 'admin@example.com', password = '123456') => {
    cy.visit('https://cms.anhtester.com/login');
    cy.get('input[name="email"]').clear().type(email);
    cy.get('input[name="password"]').clear().type(password);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/admin');
});

// Navigate to PIM module
Cypress.Commands.add('navigateToPIM', () => {
    cy.contains('span', 'PIM').click();
});

// Navigate to Recruitment module
Cypress.Commands.add('navigateToRecruitment', () => {
    cy.contains('span', 'Recruitment').click();
});

// Navigate to Leave module
Cypress.Commands.add('navigateToLeave', () => {
    cy.contains('.oxd-main-menu-item', 'Leave').click();
});

// Wait for page to load (spinner to disappear)
Cypress.Commands.add('waitForPageLoad', () => {
    cy.get('.oxd-loading-spinner').should('not.exist');
});

// Fill employee basic info
Cypress.Commands.add('fillEmployeeBasicInfo', (firstName, lastName, middleName = '') => {
    cy.get('input[name="firstName"]').type(firstName);
    if (middleName) {
        cy.get('input[name="middleName"]').type(middleName);
    }
    cy.get('input[name="lastName"]').type(lastName);
});
