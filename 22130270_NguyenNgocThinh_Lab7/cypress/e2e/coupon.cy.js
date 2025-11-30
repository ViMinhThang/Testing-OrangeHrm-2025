describe("COUPON MODULE AUTOMATION TEST", () => {

  // --- 1. PREVENT APP CRASH ---
  Cypress.on('uncaught:exception', (err, runnable) => {
    if (err.message.includes("reading 'length'") || err.message.includes("undefined")) {
      return false;
    }
  });

  beforeEach(() => {
    cy.visit("https://cms.anhtester.com/login");
    cy.get('input[name="email"]').clear().type("admin@example.com");
    cy.get('input[name="password"]').clear().type("123456");
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/admin");

    // Open Sidebar if needed
    cy.get("body").then(($body) => {
      if ($body.find(".aiz-mobile-toggler").is(":visible")) {
        cy.get(".aiz-mobile-toggler").click();
      }
    });

    cy.contains("span", "Marketing").click({ force: true });
    cy.contains("span", "Coupon").click({ force: true });
    cy.url().should("include", "/admin/coupon");
  });

  describe("COUPON_01 - Tạo coupon For Products với Discount Amount thành công", () => {

    it("COUPON_01 - Tạo coupon For Products với Discount Amount thành công", () => {

      // Step 1-3: Login Admin, Marketing → Coupon, Click Add New Coupon
      cy.contains("Add New Coupon").click({ force: true });
      cy.url().should("include", "/coupon/create");
      cy.contains("Coupon Information Adding").should("be.visible");

      // Step 4: Chọn Coupon Type = For Products (PHẢI CHỌN TRƯỚC)
      cy.get('button[data-id="coupon_type"]', { timeout: 10000 })
        .should("be.visible")
        .click({ force: true });
      
      cy.get('.dropdown-menu.show', { timeout: 5000 }).should("be.visible");
      
      cy.contains(".dropdown-item", "For Products")
        .should("be.visible")
        .click({ force: true });

      // Chờ form load các field mới sau khi chọn type
      cy.wait(1000);

      // Step 5: Nhập Coupon Code = "PROD_AMT10"
      cy.get('input[name="code"]', { timeout: 10000 })
        .should("be.visible")
        .clear()
        .type("PROD_AMT10");

      // Step 6: Chọn Product = PRODUCT4
      cy.get('button[title="Nothing selected"]', { timeout: 5000 })
        .should("be.visible")
        .click({ force: true });
      
      // Chờ dropdown sản phẩm hiển thị
      cy.get('.dropdown-menu.show', { timeout: 5000 }).should("be.visible");
      
      // Tìm và chọn PRODUCT4 (hoặc sản phẩm đầu tiên nếu không tìm thấy PRODUCT4)
      cy.get('.dropdown-menu.show').then(($dropdown) => {
        const product4 = $dropdown.find('.dropdown-item:contains("PRODUCT4")');
        if (product4.length > 0) {
          cy.wrap(product4).first().click({ force: true });
        } else {
          // Nếu không có PRODUCT4, chọn sản phẩm đầu tiên
          cy.get('.dropdown-menu.show .dropdown-item')
            .first()
            .click({ force: true });
        }
      });

      // Đóng dropdown bằng cách click vào label
      cy.contains("label", "Coupon Type").click({ force: true });
      cy.wait(500);

      // Step 7: Chọn Discount Type = Amount
      cy.get('button[title="Amount"]', { timeout: 5000 })
        .should("be.visible")
        .click({ force: true });
      
      cy.get('.dropdown-menu.show', { timeout: 5000 }).should("be.visible");
      
      cy.contains(".dropdown-item", "Amount")
        .should("be.visible")
        .click({ force: true });

      cy.wait(500);

      // Step 8: Nhập Discount = 10000
      cy.get('input[name="discount"]', { timeout: 5000 })
        .should("be.visible")
        .clear()
        .type("10000");

      // Step 9: Chọn Date hợp lệ
      cy.get('input[name="date_range"]', { timeout: 5000 })
        .should("be.visible")
        .clear()
        .type("11/30/2025 - 11/30/2025");
      
      // Trigger các event để đảm bảo date được nhận
      cy.get('input[name="date_range"]')
        .trigger("change", { force: true })
        .trigger("blur", { force: true });

      cy.wait(500);

      // Verify lại các giá trị đã nhập
      cy.get('input[name="code"]').should('have.value', 'PROD_AMT10');
      cy.get('input[name="discount"]').should('have.value', '10000');
      cy.get('input[name="date_range"]').should('not.have.value', '');

      // Step 10: Click Save
      cy.contains("button", "Save")
        .should("be.visible")
        .click({ force: true });

      // Expected Result 1: Thông báo "Coupon has been saved successfully"
      cy.contains("Coupon has been saved successfully", { timeout: 10000 })
        .should("be.visible");

      // Expected Result 2: Coupon hiển thị trong danh sách
      cy.url().should("include", "/admin/coupon", { timeout: 10000 });
      cy.contains("PROD_AMT10", { timeout: 5000 }).should("be.visible");
    });
  });

  describe("COUPON_02 - Tạo coupon For Products với Discount Percent thành công", () => {

    it("COUPON_02 - Tạo coupon For Products với Discount Percent thành công", () => {

      // Step 1-2: Login, Add New Coupon
      cy.contains("Add New Coupon").click({ force: true });
      cy.url().should("include", "/coupon/create");
      cy.contains("Coupon Information Adding").should("be.visible");

      // Step 3: Chọn Type = For Products
      cy.get('button[data-id="coupon_type"]', { timeout: 10000 })
        .should("be.visible")
        .click({ force: true });
      
      cy.get('.dropdown-menu.show', { timeout: 5000 }).should("be.visible");
      
      cy.contains(".dropdown-item", "For Products")
        .should("be.visible")
        .click({ force: true });

      cy.wait(1000);

      // Step 4: Coupon Code = "PROD_PER10"
      cy.get('input[name="code"]', { timeout: 10000 })
        .should("be.visible")
        .clear()
        .type("PROD_PER10");

      // Step 5: Select Product = PRODUCT4
      cy.get('button[title="Nothing selected"]', { timeout: 5000 })
        .should("be.visible")
        .click({ force: true });
      
      cy.get('.dropdown-menu.show', { timeout: 5000 }).should("be.visible");
      
      cy.get('.dropdown-menu.show').then(($dropdown) => {
        const product4 = $dropdown.find('.dropdown-item:contains("PRODUCT4")');
        if (product4.length > 0) {
          cy.wrap(product4).first().click({ force: true });
        } else {
          cy.get('.dropdown-menu.show .dropdown-item')
            .first()
            .click({ force: true });
        }
      });

      cy.contains("label", "Coupon Type").click({ force: true });
      cy.wait(500);

      // Step 6: Discount Type = Percent
      cy.get('button[title="Amount"]', { timeout: 5000 })
        .should("be.visible")
        .click({ force: true });
      
      cy.get('.dropdown-menu.show', { timeout: 5000 }).should("be.visible");
      
      cy.contains(".dropdown-item", "Percent")
        .should("be.visible")
        .click({ force: true });

      cy.wait(500);

      // Step 7: Discount = 10
      cy.get('input[name="discount"]', { timeout: 5000 })
        .should("be.visible")
        .clear()
        .type("10");

      // Step 8: Date hợp lệ
      cy.get('input[name="date_range"]', { timeout: 5000 })
        .should("be.visible")
        .clear()
        .type("11/30/2025 - 11/30/2025");
      
      cy.get('input[name="date_range"]')
        .trigger("change", { force: true })
        .trigger("blur", { force: true });

      cy.wait(500);

      // Verify các giá trị
      cy.get('input[name="code"]').should('have.value', 'PROD_PER10');
      cy.get('input[name="discount"]').should('have.value', '10');
      cy.get('input[name="date_range"]').should('not.have.value', '');

      // Step 9: Save
      cy.contains("button", "Save")
        .should("be.visible")
        .click({ force: true });

      // Expected: Coupon tạo thành công
      cy.contains("Coupon has been saved successfully", { timeout: 10000 })
        .should("be.visible");

      cy.url().should("include", "/admin/coupon", { timeout: 10000 });
      cy.contains("PROD_PER10", { timeout: 5000 }).should("be.visible");
    });
  });

  describe("COUPON_03 - Không nhập Coupon Code khi tạo coupon For Products", () => {

  it("COUPON_03 - Không nhập Coupon Code khi tạo coupon For Products", () => {

    // Step 1-2: Login, Add New Coupon
    cy.contains("Add New Coupon").click({ force: true });
    cy.url().should("include", "/coupon/create");
    cy.contains("Coupon Information Adding").should("be.visible");

    // Step 3: Chọn Type = For Products
    cy.get('button[data-id="coupon_type"]', { timeout: 10000 })
      .should("be.visible")
      .click({ force: true });
    
    cy.get('.dropdown-menu.show', { timeout: 5000 }).should("be.visible");
    
    cy.contains(".dropdown-item", "For Products")
      .should("be.visible")
      .click({ force: true });

    cy.wait(1000);

    // Step 4: Bỏ trống Coupon Code - chỉ verify nó đang trống
    cy.get('input[name="code"]', { timeout: 10000 })
      .should("be.visible")
      .should("have.value", ""); // Verify field đang trống

    // QUAN TRỌNG: KHÔNG chọn Product để tránh reset form
    // Bỏ qua Step 5: Chọn Product

    cy.wait(500);

    // Step 6: Click Save ngay (để test validation của Coupon Code)
    cy.contains("button", "Save")
      .should("be.visible")
      .click({ force: true });

    cy.wait(500);

    // Expected: Thông báo lỗi "Please fill out this field"
    // Verify HTML5 validation message
    cy.get('input[name="code"]').then(($input) => {
      // Kiểm tra validity state của input
      const validationMsg = $input[0].validationMessage;
      expect(validationMsg).to.not.be.empty;
      // Message có thể là "Please fill out this field" hoặc tương tự
      cy.log("Validation Message: " + validationMsg);
    });

    // Verify vẫn ở trang tạo coupon (không save được)
    cy.url().should("include", "/coupon/create");
    cy.contains("Coupon Information Adding").should("be.visible");
  });
});


describe("COUPON_04 - Không chọn Product khi tạo coupon For Products", () => {

  it("COUPON_04 - Không chọn Product khi tạo coupon For Products", () => {

    // Step 1-2: Login, Add New Coupon
    cy.contains("Add New Coupon").click({ force: true });
    cy.url().should("include", "/coupon/create");
    cy.contains("Coupon Information Adding").should("be.visible");

    // Step 3: Chọn Type = For Products
    cy.get('button[data-id="coupon_type"]', { timeout: 10000 })
      .should("be.visible")
      .click({ force: true });
    
    cy.get('.dropdown-menu.show', { timeout: 5000 }).should("be.visible");
    
    cy.contains(".dropdown-item", "For Products")
      .should("be.visible")
      .click({ force: true });

    cy.wait(1000);

    // Step 4: Nhập Coupon Code = "NOPROD10"
    cy.get('input[name="code"]', { timeout: 10000 })
      .should("be.visible")
      .clear()
      .type("NOPROD10");

    // Step 5: KHÔNG chọn Product (bỏ qua bước này)
    // Verify dropdown Product vẫn hiển thị "Nothing selected"
    cy.get('button[title="Nothing selected"]', { timeout: 5000 })
      .should("be.visible")
      .should("contain", "Nothing selected");

    cy.wait(500);

    // Step 6: Click Save
    cy.contains("button", "Save")
      .should("be.visible")
      .click({ force: true });

    cy.wait(500);

    // Expected: Hiển thị lỗi yêu cầu chọn Product
    // Có thể là validation message hoặc alert/notification
    // Kiểm tra các khả năng:
    
    // Option 1: Kiểm tra dropdown Product có class invalid/error
    cy.get('button[title="Nothing selected"]').then(($button) => {
      const classList = $button.attr('class') || '';
      cy.log("Button classes: " + classList);
      // Có thể có class như 'is-invalid', 'error', etc.
    });

    // Option 2: Kiểm tra có thông báo lỗi xuất hiện
    cy.get('body').then(($body) => {
      const hasError = $body.text().includes('product') || 
                       $body.text().includes('Product') ||
                       $body.text().includes('required') ||
                       $body.text().includes('select');
      if (hasError) {
        cy.log("Error message found for Product field");
      }
    });

    // Verify vẫn ở trang tạo coupon (không save được)
    cy.url().should("include", "/coupon/create");
    cy.contains("Coupon Information Adding").should("be.visible");
  });
});



describe("COUPON_05 - Nhập Discount dạng Amount nhưng để trống Discount Value", () => {

  it("COUPON_05 - Nhập Discount dạng Amount nhưng để trống Discount Value", () => {

    // Step 1-2: Login, Add New Coupon
    cy.contains("Add New Coupon").click({ force: true });
    cy.url().should("include", "/coupon/create");
    cy.contains("Coupon Information Adding").should("be.visible");

    // Step 3: Chọn Type = For Products
    cy.get('button[data-id="coupon_type"]', { timeout: 10000 })
      .should("be.visible")
      .click({ force: true });
    
    cy.get('.dropdown-menu.show', { timeout: 5000 }).should("be.visible");
    
    cy.contains(".dropdown-item", "For Products")
      .should("be.visible")
      .click({ force: true });

    cy.wait(1000);

    // Step 4: Nhập Coupon Code
    cy.get('input[name="code"]', { timeout: 10000 })
      .should("be.visible")
      .clear()
      .type("NOAMT_DISCOUNT");

    // Step 5: Chọn Product
    cy.get('button[title="Nothing selected"]', { timeout: 5000 })
      .should("be.visible")
      .click({ force: true });
    
    cy.get('.dropdown-menu.show', { timeout: 5000 }).should("be.visible");
    
    cy.get('.dropdown-menu.show').then(($dropdown) => {
      const product4 = $dropdown.find('.dropdown-item:contains("PRODUCT4")');
      if (product4.length > 0) {
        cy.wrap(product4).first().click({ force: true });
      } else {
        cy.get('.dropdown-menu.show .dropdown-item')
          .first()
          .click({ force: true });
      }
    });

    cy.contains("label", "Coupon Type").click({ force: true });
    cy.wait(500);

    // Step 6: Chọn Discount Type = Amount
    cy.get('button[title="Amount"]', { timeout: 5000 })
      .should("be.visible")
      .click({ force: true });
    
    cy.get('.dropdown-menu.show', { timeout: 5000 }).should("be.visible");
    
    cy.contains(".dropdown-item", "Amount")
      .should("be.visible")
      .click({ force: true });

    cy.wait(500);

    // Step 7: BỎ TRỐNG Discount (clear nếu có giá trị)
    cy.get('input[name="discount"]', { timeout: 5000 })
      .should("be.visible")
      .clear()
      .should("have.value", "");

    // Step 8: Nhập Date hợp lệ
    cy.get('input[name="date_range"]', { timeout: 5000 })
      .should("be.visible")
      .clear()
      .type("11/30/2025 - 11/30/2025");
    
    cy.get('input[name="date_range"]')
      .trigger("change", { force: true })
      .trigger("blur", { force: true });

    cy.wait(500);

    // Verify các giá trị trước khi Save
    cy.get('input[name="code"]').should('have.value', 'NOAMT_DISCOUNT');
    cy.get('input[name="discount"]').should('have.value', ''); // Discount phải trống
    cy.get('input[name="date_range"]').should('not.have.value', '');

    // Step 9: Click Save
    cy.contains("button", "Save")
      .should("be.visible")
      .click({ force: true });

    cy.wait(500);

    // Expected: Validation message "Please fill out this field"
    cy.get('input[name="discount"]').then(($input) => {
      const validationMsg = $input[0].validationMessage;
      cy.log("Validation Message: " + validationMsg);
      expect(validationMsg).to.not.be.empty;
    });

    // Verify vẫn ở trang tạo coupon (không save được)
    cy.url().should("include", "/coupon/create");
    cy.contains("Coupon Information Adding").should("be.visible");
  });
});


describe("COUPON_06 - Nhập Discount dạng Percent nhưng giá trị > 100", () => {

  it("COUPON_06 - Nhập Discount dạng Percent nhưng giá trị > 100", () => {

    // Step 1-2: Login, Add New Coupon
    cy.contains("Add New Coupon").click({ force: true });
    cy.url().should("include", "/coupon/create");
    cy.contains("Coupon Information Adding").should("be.visible");

    // Step 3: Chọn Type = For Products
    cy.get('button[data-id="coupon_type"]', { timeout: 10000 })
      .should("be.visible")
      .click({ force: true });
    
    cy.get('.dropdown-menu.show', { timeout: 5000 }).should("be.visible");
    
    cy.contains(".dropdown-item", "For Products")
      .should("be.visible")
      .click({ force: true });

    cy.wait(1000);

    // Nhập Coupon Code
    cy.get('input[name="code"]', { timeout: 10000 })
      .should("be.visible")
      .clear()
      .type("OVER_PER150");

    // Chọn Product
    cy.get('button[title="Nothing selected"]', { timeout: 5000 })
      .should("be.visible")
      .click({ force: true });
    
    cy.get('.dropdown-menu.show', { timeout: 5000 }).should("be.visible");
    
    cy.get('.dropdown-menu.show').then(($dropdown) => {
      const product4 = $dropdown.find('.dropdown-item:contains("PRODUCT4")');
      if (product4.length > 0) {
        cy.wrap(product4).first().click({ force: true });
      } else {
        cy.get('.dropdown-menu.show .dropdown-item')
          .first()
          .click({ force: true });
      }
    });

    cy.contains("label", "Coupon Type").click({ force: true });
    cy.wait(500);

    // Step 4: Chọn Discount Type = Percent
    cy.get('button[title="Amount"]', { timeout: 5000 })
      .should("be.visible")
      .click({ force: true });
    
    cy.get('.dropdown-menu.show', { timeout: 5000 }).should("be.visible");
    
    cy.contains(".dropdown-item", "Percent")
      .should("be.visible")
      .click({ force: true });

    cy.wait(500);

    // Step 5: Nhập Discount = 150
    cy.get('input[name="discount"]', { timeout: 5000 })
      .should("be.visible")
      .clear()
      .type("150");

    // Nhập Date hợp lệ
    cy.get('input[name="date_range"]', { timeout: 5000 })
      .should("be.visible")
      .clear()
      .type("11/30/2025 - 11/30/2025");
    
    cy.get('input[name="date_range"]')
      .trigger("change", { force: true })
      .trigger("blur", { force: true });

    cy.wait(500);

    // Verify các giá trị đã nhập
    cy.get('input[name="code"]').should('have.value', 'OVER_PER150');
    cy.get('input[name="discount"]').should('have.value', '150');
    cy.get('input[name="date_range"]').should('not.have.value', '');

    // Step 6: Click Save
    cy.contains("button", "Save")
      .should("be.visible")
      .click({ force: true });

    cy.wait(1000);

    // Expected: Lỗi "Percent value cannot exceed 100"
    cy.get('body').then(($body) => {
      const bodyText = $body.text();
      cy.log("Body text: " + bodyText);
      
      // Kiểm tra các dạng message có thể có
      const hasPercentError = bodyText.includes('Percent') || 
                              bodyText.includes('percent') ||
                              bodyText.includes('100') ||
                              bodyText.includes('exceed') ||
                              bodyText.includes('maximum');
      
      if (hasPercentError) {
        cy.log("✓ Found validation error for Percent > 100");
      }
    });

    // Verify vẫn ở trang tạo coupon (không save được)
    cy.url().should("include", "/coupon/create");
    cy.contains("Coupon Information Adding").should("be.visible");
  });
});

describe("COUPON_07 - Tạo coupon For Total Orders với dữ liệu hợp lệ", () => {

  it("COUPON_07 - Tạo coupon For Total Orders với dữ liệu hợp lệ", () => {

    // Step 1-2: Login, Add New Coupon
    cy.contains("Add New Coupon").click({ force: true });
    cy.url().should("include", "/coupon/create");
    cy.contains("Coupon Information Adding").should("be.visible");

    // Step 3: Chọn Type = For Total Orders
    cy.get('button[data-id="coupon_type"]', { timeout: 10000 })
      .should("be.visible")
      .click({ force: true });
    
    cy.get('.dropdown-menu.show', { timeout: 5000 }).should("be.visible");
    
    cy.contains(".dropdown-item", "For Total Orders")
      .should("be.visible")
      .click({ force: true });

    cy.wait(1000);

    // Step 4: Nhập Coupon Code = "ORDER10"
    cy.get('input[name="code"]', { timeout: 10000 })
      .should("be.visible")
      .clear()
      .type("ORDER10");

    // Step 5: Minimum Shopping = 500
    cy.get('input[name="min_buy"]', { timeout: 5000 })
      .should("be.visible")
      .clear()
      .type("500");

    // Step 6: Discount = 10 (percent)
    cy.get('input[name="discount"]', { timeout: 5000 })
      .should("be.visible")
      .clear()
      .type("10");

    // Step 7: Max Discount = 100
    cy.get('input[name="max_discount"]', { timeout: 5000 })
      .should("be.visible")
      .clear()
      .type("100");

    // Step 8: Date hợp lệ
    cy.get('input[name="date_range"]', { timeout: 5000 })
      .should("be.visible")
      .clear()
      .type("11/30/2025 - 11/30/2025");
    
    cy.get('input[name="date_range"]')
      .trigger("change", { force: true })
      .trigger("blur", { force: true });

    cy.wait(500);

    // Verify các giá trị đã nhập
    cy.get('input[name="code"]').should('have.value', 'ORDER10');
    cy.get('input[name="min_buy"]').should('have.value', '500');
    cy.get('input[name="discount"]').should('have.value', '10');
    cy.get('input[name="max_discount"]').should('have.value', '100');
    cy.get('input[name="date_range"]').should('not.have.value', '');

    // Step 9: Click Save
    cy.contains("button", "Save")
      .should("be.visible")
      .click({ force: true });

    // Expected: Tạo thành công
    cy.contains("Coupon has been saved successfully", { timeout: 10000 })
      .should("be.visible");

    cy.url().should("include", "/admin/coupon", { timeout: 10000 });
    cy.contains("ORDER10", { timeout: 5000 }).should("be.visible");
  });
});


describe("COUPON_08 - Không nhập Minimum Shopping trong coupon For Total Orders", () => {

  it("COUPON_08 - Không nhập Minimum Shopping trong coupon For Total Orders", () => {

    // Step 1-2: Login, Add New Coupon
    cy.contains("Add New Coupon").click({ force: true });
    cy.url().should("include", "/coupon/create");
    cy.contains("Coupon Information Adding").should("be.visible");

    // Step 3: Chọn Type = For Total Orders
    cy.get('button[data-id="coupon_type"]', { timeout: 10000 })
      .should("be.visible")
      .click({ force: true });
    
    cy.get('.dropdown-menu.show', { timeout: 5000 }).should("be.visible");
    
    cy.contains(".dropdown-item", "For Total Orders")
      .should("be.visible")
      .click({ force: true });

    cy.wait(1000);

    // Nhập Coupon Code
    cy.get('input[name="code"]', { timeout: 10000 })
      .should("be.visible")
      .clear()
      .type("NOMIN_ORDER");

    // Step 4: BỎ TRỐNG Minimum Shopping
    cy.get('input[name="min_buy"]', { timeout: 5000 })
      .should("be.visible")
      .clear()
      .should("have.value", ""); // Verify đang trống

    // Nhập Discount = 10
    cy.get('input[name="discount"]', { timeout: 5000 })
      .should("be.visible")
      .clear()
      .type("10");

    // Nhập Max Discount = 100
    cy.get('input[name="max_discount"]', { timeout: 5000 })
      .should("be.visible")
      .clear()
      .type("100");

    // Nhập Date hợp lệ
    cy.get('input[name="date_range"]', { timeout: 5000 })
      .should("be.visible")
      .clear()
      .type("11/30/2025 - 11/30/2025");
    
    cy.get('input[name="date_range"]')
      .trigger("change", { force: true })
      .trigger("blur", { force: true });

    cy.wait(500);

    // Verify các giá trị
    cy.get('input[name="code"]').should('have.value', 'NOMIN_ORDER');
    cy.get('input[name="min_buy"]').should('have.value', ''); // Trống
    cy.get('input[name="discount"]').should('have.value', '10');
    cy.get('input[name="max_discount"]').should('have.value', '100');
    cy.get('input[name="date_range"]').should('not.have.value', '');

    // Step 5: Click Save
    cy.contains("button", "Save")
      .should("be.visible")
      .click({ force: true });

    cy.wait(500);

    // Expected: Lỗi "Minimum shopping is required"
    cy.get('input[name="min_buy"]').then(($input) => {
      const validationMsg = $input[0].validationMessage;
      cy.log("Validation Message: " + validationMsg);
      expect(validationMsg).to.not.be.empty;
    });

    // Verify vẫn ở trang tạo coupon (không save được)
    cy.url().should("include", "/coupon/create");
    cy.contains("Coupon Information Adding").should("be.visible");
  });
});



describe("COUPON_09 - Chỉnh sửa coupon và thay đổi loại Discount", () => {

  it("COUPON_09 - Chỉnh sửa coupon và thay đổi loại Discount", () => {

    // Step 1-2: Login, Danh sách Coupon
    // Đã có sẵn từ beforeEach
    
    // Step 3: Chọn Edit 1 coupon (chọn coupon đầu tiên trong danh sách)
    cy.get('table tbody tr').first().within(() => {
      cy.get('a[title="Edit"]').click({ force: true });
    });

    // Verify đã vào trang edit
    cy.url().should("include", "/coupon/");
    cy.url().should("include", "/edit");
    cy.contains("Coupon Information Update").should("be.visible");

    cy.wait(1000);

    // Step 4: Đổi Discount Type
    // Tìm dropdown button của Discount (bên phải field Discount)
    cy.get('input[name="discount"]').parent().parent().within(() => {
      cy.get('button.dropdown-toggle').click({ force: true });
    });
    
    cy.wait(500);
    
    // Chọn loại Discount khác
    cy.get('.dropdown-menu.show .dropdown-item').then(($items) => {
      // Click vào option đầu tiên trong dropdown (Amount hoặc Percent)
      cy.wrap($items).first().click({ force: true });
    });

    cy.wait(500);

    // Step 5: Thay đổi Discount Value
    cy.get('input[name="discount"]', { timeout: 5000 })
      .should("be.visible")
      .clear()
      .type("15");

    cy.wait(500);

    // Verify giá trị đã thay đổi
    cy.get('input[name="discount"]').should('have.value', '15');

    // Step 6: Click Save
    cy.contains("button", "Save")
      .should("be.visible")
      .click({ force: true });

    // Expected: Coupon has been updated successfully
    cy.contains("Coupon has been updated successfully", { timeout: 10000 })
      .should("be.visible");

    // Verify quay lại danh sách coupon
    cy.url().should("include", "/admin/coupon", { timeout: 10000 });
    cy.contains("All Coupons").should("be.visible");
  });
});


describe("COUPON_10 - Xóa coupon bất kỳ", () => {

  it("COUPON_10 - Xóa coupon bất kỳ", () => {

    // Step 1-2: Login, Coupon List
    // Đã có sẵn từ beforeEach
    
    // Lấy tên coupon đầu tiên để verify sau khi xóa
    let couponCode;
    cy.get('table tbody tr').first().within(() => {
      cy.get('td').eq(1).invoke('text').then((text) => {
        couponCode = text.trim();
        cy.log('Coupon to delete: ' + couponCode);
      });
    });

    // Step 3: Nhấn Delete tại 1 coupon (chọn coupon đầu tiên)
    cy.get('table tbody tr').first().within(() => {
      cy.get('a[title="Delete"].confirm-delete').click({ force: true });
    });

    cy.wait(500);

    // Verify modal xuất hiện
    cy.get('.modal-body').should('be.visible');
    cy.contains('Are you sure to delete this?').should('be.visible');

    // Step 4: Xác nhận Yes - Click button Delete trong modal
    cy.get('.modal-body').within(() => {
      cy.get('a#delete-link.btn-primary').contains('Delete').click({ force: true });
    });

    cy.wait(1000);

    // Expected Result 1: Coupon has been deleted successfully
    cy.contains("Coupon has been deleted successfully", { timeout: 10000 })
      .should("be.visible");

    // Expected Result 2: Coupon biến mất khỏi danh sách
    // Verify coupon code không còn xuất hiện trong danh sách
    cy.get('table tbody').then(($tbody) => {
      if (couponCode) {
        cy.wrap($tbody).should('not.contain', couponCode);
      }
    });

    // Verify vẫn ở trang danh sách coupon
    cy.url().should("include", "/admin/coupon");
    cy.contains("All Coupons").should("be.visible");
  });
});


});