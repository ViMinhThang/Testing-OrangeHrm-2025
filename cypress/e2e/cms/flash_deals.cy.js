/**
 * Author: Nguyen Ngoc Thinh - 22130270
 * Module: Flash Deals - CMS AnhTester
 * Lab: 7
 */
describe("FLASH DEALS MODULE AUTOMATION TEST", () => {

    // 1. Bỏ qua các lỗi JS của trang Demo để test không bị dừng oan
    Cypress.on('uncaught:exception', (err, runnable) => {
        return false;
    });

    beforeEach(() => {
        cy.visit("https://cms.anhtester.com/login");
        cy.get('input[name="email"]').clear().type("admin@example.com");
        cy.get('input[name="password"]').clear().type("123456");
        cy.get('button[type="submit"]').click();

        // Đảm bảo Sidebar mở (cho màn hình nhỏ)
        cy.get("body").then(($body) => {
            if ($body.find(".aiz-mobile-toggler").is(":visible")) {
                cy.get(".aiz-mobile-toggler").click();
            }
        });

        cy.contains("span", "Marketing").click({ force: true });
        cy.contains("span", "Flash deals").click({ force: true });
    });

    // --- TEST CASE 1 ---
    it("FLASH_DEALS_01 - Tạo mới Flash Deal thành công với đầy đủ thông tin hợp lệ", () => {

        cy.contains("Create New Flash Deal").click({ force: true });
        cy.contains("Flash Deal Information", { timeout: 10000 }).should("be.visible");

        // Title: Nhập tên lần đầu
        cy.get('input[name="title"]').clear().type("Black Friday Sale 2025");

        // Background Color: #FF0000 (Đỏ)
        cy.get('input[name="background_color"]').clear().type("#FF0000");

        // Text Color
        cy.get('button[data-id="text_color"]').click();
        cy.contains(".dropdown-menu.show .dropdown-item", "White").click();

        // Banner
        const fileName = 'banner-test.jpg';
        cy.contains('.input-group-text', 'Browse').click();
        cy.wait(1000);
        cy.get('body').then(($body) => {
            if ($body.find('.card-file[title="banner-test.jpg"]').length > 0) {
                cy.get('.card-file[title="banner-test.jpg"]').first().click();
            } else {
                cy.contains('a', 'Upload New').click();
                cy.wait(1000);
                cy.get('.uppy-Dashboard-input').selectFile('cypress/fixtures/' + fileName, { force: true });
                cy.wait(3000);
                cy.contains('a', 'Select File').click();
                cy.wait(1000);
                cy.get('.card-file[title="banner-test.jpg"]').first().click();
            }
        });
        cy.contains('button', 'Add Files').click();
        cy.wait(1000);

        // Date
        cy.get('input[name="date_range"]')
            .clear()
            .type("11-12-2025 00:00:00 to 15-12-2025 23:59:00");
        cy.get('input[name="date_range"]').type('{enter}').trigger("change");

        // Products
        cy.get('button[data-id="products"]').click({ force: true });
        cy.get('.dropdown-menu.show input[type="search"], .dropdown-menu.show input[type="text"]', { timeout: 5000 })
            .should("be.visible")
            .as("productSearchInput");

        cy.wait(500);
        cy.get("@productSearchInput").type("Dell", { delay: 100 }).type("{enter}");
        cy.wait(1000);

        cy.get("body").then(($body) => {
            if ($body.find(".dropdown-menu.show").length > 0) {
                cy.get('body').type('{esc}');
            }
        });
        cy.get('button[data-id="products"]').should('contain.text', 'Dell');

        // Save
        cy.wait(1000);
        cy.get('button[type="submit"].btn-primary')
            .scrollIntoView()
            .should('be.visible')
            .click({ force: true });

        // Verify Success
        cy.url().should("include", "/admin/flash_deals");

        // Xử lý Popup
        cy.wait(2000);
        cy.get("body").then(($body) => {
            if ($body.find(".modal-content .close").length > 0) cy.get(".modal-content .close").click({ force: true });
            if ($body.find(".modal-backdrop").length > 0) cy.get("body").click(10, 10, { force: true });
            if ($body.find("button:contains('Ok, I Understood')").length > 0) cy.get("button:contains('Ok, I Understood')").click({ force: true });
        });

        cy.contains("Black Friday Sale 2025", { timeout: 10000 }).should("be.visible");
    });

    // --- TEST CASE 2 (MỚI THÊM VÀO) ---
    it("FLASH_DEALS_02 - Tạo Flash Deal với Title đã tồn tại trong hệ thống", () => {

        cy.contains("Create New Flash Deal").click({ force: true });
        cy.contains("Flash Deal Information", { timeout: 10000 }).should("be.visible");

        // Title: NHẬP TRÙNG VỚI TC 1
        cy.get('input[name="title"]').clear().type("Black Friday Sale 2025");

        // Background Color: Thay đổi thành #FFFFFF theo yêu cầu trong ảnh
        cy.get('input[name="background_color"]').clear().type("#FFFFFF");

        // Text Color
        cy.get('button[data-id="text_color"]').click();
        cy.contains(".dropdown-menu.show .dropdown-item", "White").click();

        // Banner (Giữ nguyên)
        const fileName = 'banner-test.jpg';
        cy.contains('.input-group-text', 'Browse').click();
        cy.wait(1000);
        cy.get('body').then(($body) => {
            if ($body.find('.card-file[title="banner-test.jpg"]').length > 0) {
                cy.get('.card-file[title="banner-test.jpg"]').first().click();
            } else {
                // Nếu chưa có thì upload, logic như cũ
                cy.contains('a', 'Select File').click();
                cy.wait(500);
                cy.get('.card-file[title="banner-test.jpg"]').first().click();
            }
        });
        cy.contains('button', 'Add Files').click();
        cy.wait(1000);

        // Date (Giữ nguyên hoặc đổi ngày khác tùy ý, ở đây giữ nguyên cho đúng test trùng lặp)
        cy.get('input[name="date_range"]')
            .clear()
            .type("11-12-2025 00:00:00 to 15-12-2025 23:59:00");
        cy.get('input[name="date_range"]').type('{enter}').trigger("change");

        // Products
        cy.get('button[data-id="products"]').click({ force: true });
        cy.get('.dropdown-menu.show input[type="search"], .dropdown-menu.show input[type="text"]', { timeout: 5000 })
            .should("be.visible")
            .as("productSearchInput2");

        cy.wait(500);
        cy.get("@productSearchInput2").type("Dell", { delay: 100 }).type("{enter}");
        cy.wait(1000);

        cy.get("body").then(($body) => {
            if ($body.find(".dropdown-menu.show").length > 0) {
                cy.get('body').type('{esc}');
            }
        });

        // Save
        cy.wait(1000);
        cy.get('button[type="submit"].btn-primary')
            .scrollIntoView()
            .should('be.visible')
            .click({ force: true });

        // Verify Success (Hệ thống cho phép trùng tên nhưng khác Slug/ID)
        cy.url().should("include", "/admin/flash_deals");

        // Xử lý Popup
        cy.wait(2000);
        cy.get("body").then(($body) => {
            if ($body.find(".modal-content .close").length > 0) cy.get(".modal-content .close").click({ force: true });
            if ($body.find(".modal-backdrop").length > 0) cy.get("body").click(10, 10, { force: true });
            if ($body.find("button:contains('Ok, I Understood')").length > 0) cy.get("button:contains('Ok, I Understood')").click({ force: true });
        });

        // Kiểm tra thông báo thành công
        cy.contains("successfully", { matchCase: false }).should("be.visible");

        // Kiểm tra trong list lúc này sẽ hiện Title đó (có thể xuất hiện 2 dòng cùng tên)
        cy.contains("Black Friday Sale 2025").should("be.visible");
    });

    it("FLASH_DEALS_03 - Tạo Flash Deal khi bỏ trống các trường bắt buộc", () => {

        // Step 1-3: Mở trang Create Flash Deal
        cy.contains("Create New Flash Deal").click({ force: true });
        cy.contains("Flash Deal Information", { timeout: 10000 }).should("be.visible");

        // Step 4-7: BỎ TRỐNG TẤT CẢ FIELD
        // Title → Xóa trắng
        cy.get('input[name="title"]').clear();

        // Background Color → Xóa trắng
        cy.get('input[name="background_color"]').clear();

        // Date → Xóa trắng
        cy.get('input[name="date_range"]').clear();

        // Step 8: Click Save
        cy.get('button[type="submit"].btn-primary')
            .scrollIntoView()
            .should('be.visible')
            .click({ force: true });

        // --- EXPECTED OUTPUT (ĐÃ FIX CÁCH VERIFY) ---

        // 1. Kiểm tra HTML5 Validation: Input Title phải có thuộc tính 'required'
        // Đây là lý do trình duyệt hiện popup "Please fill out this field"
        cy.get('input[name="title"]').should('have.attr', 'required');

        // 2. Kiểm tra trạng thái hợp lệ của input (Native Validation)
        // Khi bấm Save mà để trống, trình duyệt sẽ đánh dấu input này là Invalid
        cy.get('input[name="title"]').then(($input) => {
            expect($input[0].checkValidity()).to.be.false; // Phải trả về false
            // Tùy chọn: Kiểm tra message của trình duyệt (Browser specific)
            // expect($input[0].validationMessage).to.exist; 
        });

        cy.url().should("include", "/admin/flash_deals/create");
        cy.url().should("not.include", "/admin/flash_deals/all"); // Hoặc url list gốc
    });

    // --- TEST CASE 4 ---
    it("FLASH_DEALS_04 - Tạo Flash Deal với ngày kết thúc sớm hơn ngày bắt đầu", () => {

        cy.contains("Create New Flash Deal").click({ force: true });
        cy.contains("Flash Deal Information", { timeout: 10000 }).should("be.visible");

        // 1. Title: "Test Invalid Date"
        cy.get('input[name="title"]').clear().type("Test Invalid Date");

        // 2. Background Color: "#FFFFFF"
        cy.get('input[name="background_color"]').clear().type("#FFFFFF");

        // 3. Text Color (Chọn đại 1 màu)
        cy.get('button[data-id="text_color"]').click();
        cy.contains(".dropdown-menu.show .dropdown-item", "White").click();

        // 4. Banner (Logic cũ)
        const fileName = 'banner-test.jpg';
        cy.contains('.input-group-text', 'Browse').click();
        cy.wait(1000);
        cy.get('body').then(($body) => {
            if ($body.find('.card-file[title="banner-test.jpg"]').length > 0) {
                cy.get('.card-file[title="banner-test.jpg"]').first().click();
            } else {
                cy.contains('a', 'Select File').click();
                cy.wait(500);
                cy.get('.card-file[title="banner-test.jpg"]').first().click();
            }
        });
        cy.contains('button', 'Add Files').click();
        cy.wait(1000);

        // 5. Date Range KHÔNG HỢP LỆ (End Date < Start Date)
        // Start: 30-11-2025 | End: 28-11-2025
        cy.get('input[name="date_range"]')
            .clear()
            .type("30-11-2025 00:00:00 to 28-11-2025 23:59:00");

        // Nhấn Enter để confirm input
        cy.get('input[name="date_range"]').type('{enter}').trigger("change");

        // 6. Products
        cy.get('button[data-id="products"]').click({ force: true });
        cy.get('.dropdown-menu.show input[type="search"]', { timeout: 5000 }).should("be.visible").as("search");
        cy.wait(500);
        cy.get("@search").type("Dell", { delay: 100 }).type("{enter}");
        cy.wait(1000);
        cy.get("body").then(($body) => {
            if ($body.find(".dropdown-menu.show").length > 0) cy.get('body').type('{esc}');
        });

        // 7. Click Save
        cy.wait(1000);
        cy.get('button[type="submit"].btn-primary')
            .scrollIntoView()
            .should('be.visible')
            .click({ force: true });

        // --- EXPECTED OUTPUT ---

        // 1. Hệ thống KHÔNG chuyển trang (Vẫn ở trang create)
        // URL vẫn phải chứa "/create"
        cy.url().should("include", "/admin/flash_deals/create");

        // 2. (Quan trọng) Kiểm tra hệ thống không tạo Flash Deal mới
        // Bằng cách về trang danh sách và tìm title "Test Invalid Date" -> Phải KHÔNG tồn tại
        cy.visit("/admin/flash_deals");
        cy.contains("Test Invalid Date").should("not.exist");
    });


    // --- TEST CASE 5 ---
    it("FLASH_DEALS_05 - Tìm kiếm Flash Deal theo tên", () => {

        // 1. Vào trang danh sách (Dùng link tuyệt đối để tránh lỗi 404)
        cy.visit("https://cms.anhtester.com/admin/flash_deals");

        // Kiểm tra đã vào đúng trang chưa
        cy.contains("All Flash Deals", { timeout: 10000 }).should("be.visible");

        // 2. Tìm ô search và nhập từ khóa "test"
        cy.get('input[placeholder="Type name & Enter"]', { timeout: 5000 })
            .should("be.visible")
            .clear()
            .type("test{enter}");

        cy.wait(1000); // Chờ load kết quả

        // --- FIX VERIFY ---

        // 1. Verify URL: Phải chứa từ khóa "test" (không phải Black Friday)
        cy.url().should("include", "search=test");

        // 2. Verify Kết quả trong bảng:
        // Kiểm tra trong bảng (table) có ít nhất 1 dòng dữ liệu
        cy.get('table.aiz-table tbody tr').should('have.length.at.least', 1);

        // Kiểm tra dòng đầu tiên chứa chữ "test" hoặc "Test" (Dùng matchCase: false để không phân biệt hoa thường)
        cy.get('table.aiz-table tbody tr')
            .first()
            .contains("test", { matchCase: false })
            .should("be.visible");
    });

    // --- TEST CASE 6 ---
    // --- TEST CASE 6 (ĐÃ FIX VERIFY) ---
    it("FLASH_DEALS_06 - Chỉnh sửa thông tin Flash Deal đã tồn tại", () => {

        // 1. Vào trang danh sách
        cy.visit("https://cms.anhtester.com/admin/flash_deals");
        cy.contains("All Flash Deals", { timeout: 10000 }).should("be.visible");

        // 2. Click icon Edit
        cy.get('a[title="Edit"]').first().click({ force: true });

        // 3. Edit Title & Color
        cy.contains("Flash Deal Information", { timeout: 10000 }).should("be.visible");
        cy.get('input[name="title"]').clear().type("Updated Title");
        cy.get('input[name="background_color"]').clear().type("#00FF00");

        // 4. Save
        cy.wait(500);
        cy.get('button[type="submit"].btn-primary')
            .scrollIntoView()
            .should('be.visible')
            .click({ force: true });

        // 5. Verify thông báo thành công (Dựa trên hình ảnh trước của bạn)
        cy.contains("Flash Deal has been updated successfully", { timeout: 10000 })
            .should("be.visible");

        // --- FIX BUG Ở ĐÂY ---
        // Vì trang web không tự redirect, ta phải tự quay về trang danh sách để kiểm tra
        cy.visit("https://cms.anhtester.com/admin/flash_deals");

        // Chờ bảng tải xong
        cy.contains("All Flash Deals", { timeout: 10000 }).should("be.visible");

        // 6. Verify "Updated Title" đã xuất hiện trong bảng
        cy.contains("Updated Title").should("be.visible");
    });


    // --- TEST CASE 7 ---
    it("FLASH_DEALS_07 - Xóa một Flash Deal khỏi danh sách", () => {

        cy.visit("https://cms.anhtester.com/admin/flash_deals");
        cy.contains("All Flash Deals", { timeout: 10000 }).should("be.visible");
        cy.get('a[title="Delete"]')
            .first()
            .click({ force: true });

        cy.get('.modal-content').should('be.visible');
        cy.contains("Delete Confirmation").should('be.visible');
        cy.contains("Are you sure to delete this?").should('be.visible');


        cy.get('#delete-link').click({ force: true });

        // --- VERIFY SAU KHI XÓA ---

        cy.contains("successfully", { matchCase: false, timeout: 10000 }).should("be.visible");

        cy.url().should("include", "/admin/flash_deals");


        cy.get('table.aiz-table tbody tr').should('be.visible');
    });

    // --- TEST CASE 8 ---
    it("FLASH_DEALS_08 - Bật/tắt trạng thái hiển thị của Flash Deal", () => {

        cy.visit("https://cms.anhtester.com/admin/flash_deals");
        cy.contains("All Flash Deals", { timeout: 10000 }).should("be.visible");


        cy.get('table.aiz-table tbody tr')
            .first()
            .find('.footable-toggle')
            .should("be.visible")
            .click();

        cy.get('input[onchange*="update_flash_deal_status"]')
            .first()
            .as('statusCheckbox');


        cy.get('@statusCheckbox').invoke('prop', 'checked').then((initialState) => {

            cy.get('@statusCheckbox').next('.slider').click({ force: true });

            cy.contains("updated successfully", { matchCase: false }).should("be.visible");

            cy.reload();

            cy.get('table.aiz-table tbody tr').first().find('.footable-toggle').click();

            cy.get('input[onchange*="update_flash_deal_status"]')
                .first()
                .should('have.prop', 'checked', !initialState);
        });
    });


    // --- TEST CASE 9 ---

    it("FLASH_DEALS_09 - Đánh dấu/bỏ đánh dấu Flash Deal là Featured", () => {

        cy.visit("https://cms.anhtester.com/admin/flash_deals");
        cy.contains("All Flash Deals", { timeout: 10000 }).should("be.visible");

        cy.get('table.aiz-table tbody tr')
            .first()
            .find('.footable-toggle')
            .should("be.visible")
            .click();

        cy.get('input[onchange*="update_flash_deal_feature"]')
            .first()
            .as('featuredCheckbox');

        cy.get('@featuredCheckbox').invoke('prop', 'checked').then((initialState) => {

            cy.get('@featuredCheckbox').next('.slider').click({ force: true });

            cy.contains("updated successfully", { matchCase: false }).should("be.visible");

            cy.reload();

            cy.contains("All Flash Deals", { timeout: 10000 }).should("be.visible");
            cy.get('table.aiz-table tbody tr').first().find('.footable-toggle').click();

            cy.get('input[onchange*="update_flash_deal_feature"]')
                .first()
                .should('have.prop', 'checked', !initialState);
        });
    });


    // --- TEST CASE 10 ---
    it("FLASH_DEALS_10 - Kiểm tra liên kết (Page Link) của Flash Deal hoạt động", () => {

        // 1. Vào trang danh sách
        cy.visit("https://cms.anhtester.com/admin/flash_deals");
        cy.contains("All Flash Deals", { timeout: 10000 }).should("be.visible");

        // 2. Mở rộng dòng đầu tiên để lộ ra các cột bị ẩn (trong đó có Page Link)
        cy.get('table.aiz-table tbody tr')
            .first()
            .find('.footable-toggle')
            .should("be.visible")
            .click();

        // 3. Tìm dòng chứa text "Page Link" trong phần chi tiết
        // Lưu ý: Cấu trúc Footable khi mở rộng sẽ tạo ra một row mới class="footable-detail-row"
        cy.get('table.aiz-table tbody tr.footable-detail-row')
            .first()
            .within(() => {
                // Tìm phần tử chứa Link (Thường nằm trong thẻ td hoặc th)
                // Dựa vào HTML bảng, Page Link nằm ở cột thứ 8 (index 7) hoặc tìm theo text label
                cy.contains("Page Link").next().then(($cell) => {
                    const url = $cell.text().trim();

                    // Log ra để xem
                    cy.log("Flash Deal URL: " + url);

                    // 4. Verify cấu trúc URL
                    expect(url).to.include("https://cms.anhtester.com/flash-deal/"); // Phải chứa domain và path
                    expect(url).to.not.be.empty; // Không được rỗng
                });
            });

        // 5. (Nâng cao) Kiểm tra link có "sống" không bằng cách request thử
        // Lấy URL từ cột ẩn (dựa vào HTML bạn cung cấp: td thứ 8)
        cy.get('table.aiz-table tbody tr').first().find('td').eq(7).invoke('text').then((url) => {
            const cleanUrl = url.trim();
            if (cleanUrl.startsWith('http')) {
                cy.request(cleanUrl).then((response) => {
                    expect(response.status).to.eq(200); // Trang web phải truy cập được
                });
            }
        });
    });
});
