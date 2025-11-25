describe("OrangeHRM - Employee Management Test Suite", () => {
  const username = "Admin";
  const password = "admin123";

  beforeEach(() => {
    cy.clearCookies();
    cy.clearAllSessionStorage();

    cy.visit(
      "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login"
    );

    cy.get('input[name="username"]').should("be.visible");
    cy.get('input[name="username"]').type(username);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();

    cy.url().should("include", "/dashboard");
  });

  // --- MODULE: ADD EMPLOYEE ---
  describe("Module: Add Employee", () => {
    beforeEach(() => {
      cy.contains("span", "PIM").click();
      cy.contains("a", "Add Employee").click();
      cy.get(".orangehrm-card-container").should("be.visible");
    });

    it("AddEmployee_01_UI_Layout: Verify Add Employee page is displayed correctly", () => {
      cy.contains("h6", "Add Employee").should("be.visible");
      cy.get('input[name="firstName"]').should("be.visible");
      cy.get('input[name="middleName"]').should("be.visible");
      cy.get('input[name="lastName"]').should("be.visible");
      cy.get('input[type="file"]').should("exist");
    });

    it("AddEmployee_02_Validation_EmptyFirstName: Verify error when First Name is empty", () => {
      cy.get('input[name="lastName"]').type("Doe");
      cy.get('button[type="submit"]').click();

      cy.get('input[name="firstName"]')
        .parents(".oxd-input-group")
        .should("contain", "Required");
    });

    it("AddEmployee_03_Validation_EmptyLastName: Verify error when Last Name is empty", () => {
      cy.get('input[name="firstName"]').type("John");
      cy.get('button[type="submit"]').click();

      cy.get('input[name="lastName"]')
        .parents(".oxd-input-group")
        .should("contain", "Required");
    });

    it("AddEmployee_04_Validation_SpecialChars: Verify system rejects special characters in name", () => {
      /* LƯU Ý: Test này có thể fail trên demo site (deflect test) */
      cy.get('input[name="firstName"]').type("@@Test");
      cy.get('input[name="lastName"]').type("John###");
      cy.get('button[type="submit"]').click();

      cy.get(".oxd-input-field-error-message").should("exist");
    });

    it("AddEmployee_05_Validation_FileType: Verify system rejects invalid photo file types", () => {
      /* LƯU Ý: Test này có thể fail trên demo site (deflect test) */
      cy.get('input[name="firstName"]').type("Test");
      cy.get('input[name="lastName"]').type("PhotoType");

      cy.get('input[type="file"]').selectFile(
        "cypress/fixtures/invalid_type.txt",
        { force: true }
      );

      cy.contains("File type not allowed").should("be.visible");
    });

    it("AddEmployee_06_Validation_FileSize: Verify system rejects photos larger than 1MB", () => {
      cy.get('input[name="firstName"]').type("Test");
      cy.get('input[name="lastName"]').type("PhotoSize");

      cy.get('input[type="file"]').selectFile(
        "cypress/fixtures/large_photo.png",
        { force: true }
      );

      cy.contains("Attachment Size Exceeded").should("be.visible");
    });

    it("AddEmployee_07_Success_CreateNew: Verify new employee appears in list after saving", () => {
      const uniqueId = Date.now().toString();
      const firstName = "Auto";
      const lastName = "User" + uniqueId;

      cy.get('input[name="firstName"]').type(firstName);
      cy.get('input[name="lastName"]').type(lastName);
      cy.get('button[type="submit"]').click();

      cy.contains("Successfully Saved").should("be.visible");

      cy.contains("a", "Employee List").click();

      cy.get('input[placeholder="Type for hints..."]').first().type(firstName);
      cy.get('button[type="submit"]').click();

      cy.get(".oxd-table-card")
        .should("contain", firstName)
        .and("contain", lastName);
    });
  });

  // --- MODULE: EDIT EMPLOYEE ---
  describe("Module: Edit Employee", () => {
    let testEmployeeName = "EditTest";
    let testEmployeeLast = "User" + Date.now();

    before(() => {
      cy.visit(
        "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login"
      );
      cy.get('input[name="username"]').type(username);
      cy.get('input[name="password"]').type(password);
      cy.get('button[type="submit"]').click();

      // Tạo nhân viên để test edit
      cy.contains("span", "PIM").click();
      cy.contains("a", "Add Employee").click();
      cy.get('input[name="firstName"]').type(testEmployeeName);
      cy.get('input[name="lastName"]').type(testEmployeeLast);
      cy.get('button[type="submit"]').click();
      cy.contains("Successfully Saved").should("be.visible");
    });

    beforeEach(() => {
      cy.contains("span", "PIM").click();
      cy.contains("a", "Employee List").click();

      cy.get('input[placeholder="Type for hints..."]')
        .first()
        .type(testEmployeeName);
      cy.get('button[type="submit"]').click();

      cy.wait(1000);
      cy.get(".oxd-table-cell-actions button .bi-pencil-fill")
        .first()
        .click({ force: true });

      cy.get('input[name="firstName"]').should("have.value", testEmployeeName);
    });

    it("EditEmployee_01_UI_CheckData: Verify Edit page displays correct existing data", () => {
      cy.get('input[name="lastName"]').should("have.value", testEmployeeLast);
    });

    it("EditEmployee_02_Success_UpdateName: Verify update employee with valid information", () => {
      const newFirstName = "UpdatedName";
      cy.get('input[name="firstName"]').clear().type(newFirstName);
      cy.get('button[type="submit"]').first().click();

      cy.contains("Successfully Updated").should("be.visible");

      testEmployeeName = newFirstName; // Update biến local để các test sau dùng đúng tên
    });

    it("EditEmployee_03_Validation_EmptyFirstName: Verify error when First Name is empty during edit", () => {
      cy.get('input[name="firstName"]').clear();
      cy.get('button[type="submit"]').first().click();

      cy.get('input[name="firstName"]')
        .parents(".oxd-input-group")
        .should("contain", "Required");
    });

    it("EditEmployee_04_Validation_EmptyLastName: Verify error when Last Name is empty during edit", () => {
      cy.get('input[name="lastName"]').clear();
      cy.get('button[type="submit"]').first().click();

      cy.get('input[name="lastName"]')
        .parents(".oxd-input-group")
        .should("contain", "Required");
    });

    it("EditEmployee_05_Success_NoChanges: Verify save functionality without changes", () => {
      cy.get('button[type="submit"]').first().click();
      cy.contains("Successfully Updated").should("be.visible");
    });

    it("EditEmployee_06_Success_UploadPhoto: Verify uploading a valid profile photo", () => {
      cy.get(".employee-image").click();

      cy.get('input[type="file"]').selectFile(
        "cypress/fixtures/valid_photo.jpg",
        { force: true }
      );
      cy.get('button[type="submit"]').click();

      cy.contains("Successfully Updated").should("be.visible");
    });
  });
});
