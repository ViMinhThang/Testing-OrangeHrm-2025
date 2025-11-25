describe("OrangeHRM - Employee Management Test Suite", () => {
  // Thông tin đăng nhập mặc định của trang demo
  const username = "Admin";
  const password = "admin123";

  // Hàm dùng chung để đăng nhập trước mỗi Test Case
  beforeEach(() => {
    // --- THÊM 2 DÒNG NÀY ---
    // Xóa session cũ để đảm bảo hệ thống không tự redirect vào Dashboard
    cy.clearCookies();
    cy.clearAllSessionStorage();
    // -----------------------

    cy.visit(
      "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login"
    );

    // Bây giờ chắc chắn sẽ ở trang login, assert này sẽ pass
    cy.get('input[name="username"]').should("be.visible");

    // Thực hiện login
    cy.get('input[name="username"]').type(username);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();

    // Đảm bảo đã vào dashboard
    cy.url().should("include", "/dashboard");
  });

  // --- MODULE: ADD EMPLOYEE ---
  describe("Module: Add Employee (TC_AE)", () => {
    beforeEach(() => {
      // Điều hướng vào trang Add Employee trước mỗi test case trong nhóm này
      cy.contains("span", "PIM").click();
      cy.contains("a", "Add Employee").click();
      cy.get(".orangehrm-card-container").should("be.visible");
    });

    it("TC_AE_01: Verify Add Employee page is displayed correctly", () => {
      cy.contains("h6", "Add Employee").should("be.visible");
      cy.get('input[name="firstName"]').should("be.visible");
      cy.get('input[name="middleName"]').should("be.visible");
      cy.get('input[name="lastName"]').should("be.visible");
      // Kiểm tra input upload ảnh
      cy.get('input[type="file"]').should("exist");
    });

    it("TC_AE_02: Verify validation when First Name is empty", () => {
      // Để trống First Name, chỉ nhập Last Name để tránh lỗi khác
      cy.get('input[name="lastName"]').type("Doe");
      cy.get('button[type="submit"]').click();

      // Mong đợi lỗi "Required" dưới trường First Name
      cy.get('input[name="firstName"]')
        .parents(".oxd-input-group")
        .should("contain", "Required");
    });

    it("TC_AE_03: Verify validation when Last Name is empty", () => {
      cy.get('input[name="firstName"]').type("John");
      // Để trống Last Name
      cy.get('button[type="submit"]').click();

      // Mong đợi lỗi "Required" dưới trường Last Name
      cy.get('input[name="lastName"]')
        .parents(".oxd-input-group")
        .should("contain", "Required");
    });

    it("TC_AE_04: Verify system does not accept special characters in name fields", () => {
      /* LƯU Ý: Trên thực tế OrangeHRM demo có thể cho phép ký tự đặc biệt. 
       Test này được viết dựa trên "Expected Output" trong file Excel của bạn.
      */
      cy.get('input[name="firstName"]').type("@@Test");
      cy.get('input[name="lastName"]').type("John###");
      cy.get('button[type="submit"]').click();

      // Kiểm tra xem hệ thống có hiển thị lỗi hoặc ngăn chặn save không
      // Giả định class lỗi là .oxd-input-field-error-message
      cy.get(".oxd-input-field-error-message").should("exist");
    });

    it("TC_AE_05: Verify system validates invalid photo file types", () => {
      cy.get('input[name="firstName"]').type("Test");
      cy.get('input[name="lastName"]').type("PhotoType");

      // Upload file .txt (giả định bạn đã tạo file này trong fixtures)
      cy.get('input[type="file"]').selectFile(
        "cypress/fixtures/invalid_type.txt",
        { force: true }
      );

      // Kiểm tra thông báo lỗi
      cy.contains("File type not allowed").should("be.visible");
    });

    it("TC_AE_06: Verify system validates photo size limit", () => {
      cy.get('input[name="firstName"]').type("Test");
      cy.get('input[name="lastName"]').type("PhotoSize");

      // Upload file > 1MB
      cy.get('input[type="file"]').selectFile(
        "cypress/fixtures/large_photo.jpg",
        { force: true }
      );

      // Kiểm tra thông báo lỗi (Text lỗi có thể khác nhau tùy phiên bản, cần điều chỉnh nếu cần)
      cy.contains("Attachment Size Exceeded").should("be.visible");
    });

    it("TC_AE_07: Verify new employee appears in Employee List after saving", () => {
      const uniqueId = Date.now().toString(); // Tạo ID để tránh trùng lặp
      const firstName = "Auto";
      const lastName = "User" + uniqueId;

      cy.get('input[name="firstName"]').type(firstName);
      cy.get('input[name="lastName"]').type(lastName);
      cy.get('button[type="submit"]').click();

      // Đợi thông báo thành công (Toast message)
      cy.contains("Successfully Saved").should("be.visible");

      // Quay lại danh sách nhân viên
      cy.contains("a", "Employee List").click();

      // Tìm kiếm nhân viên vừa tạo
      cy.get('input[placeholder="Type for hints..."]').first().type(firstName);
      cy.get('button[type="submit"]').click();

      // Xác nhận nhân viên xuất hiện trong bảng
      cy.get(".oxd-table-card")
        .should("contain", firstName)
        .and("contain", lastName);
    });
  });

  // --- MODULE: EDIT EMPLOYEE ---
  describe("Module: Edit Employee (TC_EE)", () => {
    // Biến lưu thông tin nhân viên dùng để test sửa
    let testEmployeeName = "EditTest";
    let testEmployeeLast = "User" + Date.now();

    // Tạo sẵn một nhân viên để sửa trước khi chạy các test edit
    before(() => {
      cy.visit(
        "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login"
      );
      cy.get('input[name="username"]').type(username);
      cy.get('input[name="password"]').type(password);
      cy.get('button[type="submit"]').click();

      // Tạo nhân viên
      cy.contains("span", "PIM").click();
      cy.contains("a", "Add Employee").click();
      cy.get('input[name="firstName"]').type(testEmployeeName);
      cy.get('input[name="lastName"]').type(testEmployeeLast);
      cy.get('button[type="submit"]').click();
      cy.contains("Successfully Saved").should("be.visible");
    });

    // Quy trình vào trang Edit cho mỗi test case
    beforeEach(() => {
      cy.contains("span", "PIM").click();
      cy.contains("a", "Employee List").click();

      // Tìm nhân viên đã tạo
      cy.get('input[placeholder="Type for hints..."]')
        .first()
        .type(testEmployeeName);
      cy.get('button[type="submit"]').click();

      // Click vào nút "Pencil" (Edit) ở dòng kết quả đầu tiên
      // Cần wait nhỏ để bảng load xong nếu mạng chậm
      cy.wait(1000);
      cy.get(".oxd-table-cell-actions button .bi-pencil-fill")
        .first()
        .click({ force: true });

      // Chờ form load xong (kiểm tra thấy tên đúng)
      cy.get('input[name="firstName"]').should("have.value", testEmployeeName);
    });

    it("TC_EE_01: Verify Edit Employee page displays correct employee data", () => {
      // Đã verify ở bước beforeEach, nhưng check kỹ hơn ở đây
      cy.get('input[name="lastName"]').should("have.value", testEmployeeLast);
    });

    it("TC_EE_02: Update employee with valid information", () => {
      const newFirstName = "UpdatedName";
      cy.get('input[name="firstName"]').clear().type(newFirstName);
      cy.get('button[type="submit"]').first().click(); // Nút save đầu tiên (Personal Details)

      cy.contains("Successfully Updated").should("be.visible");

      // Cập nhật lại biến global để các test sau (nếu có) dùng tên mới,
      // hoặc reload lại biến testEmployeeName nếu cần.
      testEmployeeName = newFirstName;
    });

    it("TC_EE_03: Verify validation when First Name is empty during edit", () => {
      cy.get('input[name="firstName"]').clear(); // Xóa rỗng
      cy.get('button[type="submit"]').first().click();

      cy.get('input[name="firstName"]')
        .parents(".oxd-input-group")
        .should("contain", "Required");
    });

    it("TC_EE_04: Verify validation when Last Name is empty during edit", () => {
      cy.get('input[name="lastName"]').clear(); // Xóa rỗng
      cy.get('button[type="submit"]').first().click();

      cy.get('input[name="lastName"]')
        .parents(".oxd-input-group")
        .should("contain", "Required");
    });

    it("TC_EE_05: Click Save without making any changes", () => {
      cy.get('button[type="submit"]').first().click();
      cy.contains("Successfully Updated").should("be.visible");
    });

    it("TC_EE_06: Upload a valid profile photo", () => {
      // Click vào ảnh đại diện để upload (trong trang Edit, thường click vào hình avatar)
      cy.get(".employee-image").click();

      // Chuyển sang trang Change Profile Picture
      cy.get('input[type="file"]').selectFile(
        "cypress/fixtures/valid_photo.jpg",
        { force: true }
      );
      cy.get('button[type="submit"]').click();

      cy.contains("Successfully Updated").should("be.visible");
    });
  });
});
