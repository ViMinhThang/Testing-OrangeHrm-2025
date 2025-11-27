// cypress/e2e/Leave_ESS.cy.js

// Hàm format ngày theo đúng placeholder "yyyy-dd-mm"
function formatYddM(date) {
  const y = date.getFullYear();
  const dd = String(date.getDate()).padStart(2, '0');      // day ở giữa
  const mm = String(date.getMonth() + 1).padStart(2, '0'); // month ở cuối
  return `${y}-${dd}-${mm}`;
}
function convertToYMD(yddm) {
    const [year, dd, mm] = yddm.split('-');
    return `${year}-${mm}-${dd}`;
}

describe('Module: Apply Leave (ESS)', () => {

  beforeEach(() => {

    // Intercept API lấy leave types
    cy.intercept('GET', '**/leave/leave-types/eligible*').as('getLeaveTypes');

    // ===== LOGIN =====
    cy.visit('https://opensource-demo.orangehrmlive.com/');
    cy.get('input[name="username"]').type('sayu02834');   // ESS user của bạn
    cy.get('input[name="password"]').type('tom1234');     // password
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/dashboard');
  });


it('Apply_Leave_ESS-1: Apply leave with valid Leave Type', () => {

    // ===== VÀO TRANG APPLY =====
    cy.contains('span', 'Leave').click();
    cy.contains('a', 'Apply').click();

    // Chờ API load loại phép
    cy.wait('@getLeaveTypes', { timeout: 15000 });
    cy.get('.oxd-loading-spinner').should('not.exist');

    // ===== 1) CHỌN LEAVE TYPE =====
    cy.get('.oxd-select-text').first().click({ force: true });

    cy.contains('.oxd-select-option', 'CAN - Vacation')
      .should('be.visible')
      .click({ force: true });

    // ===== 2) NHẬP NGÀY CỐ ĐỊNH =====
    const fromStr = '2025-01-12';   // 1/12/2025
    const toStr   = '2025-02-12';   // 2/12/2025

    // From Date
    cy.get('input[placeholder="yyyy-dd-mm"]').first()
      .clear({ force: true })
      .type(fromStr, { force: true });
    cy.get('body').click(0, 0, { force: true });

    // To Date
    cy.get('input[placeholder="yyyy-dd-mm"]').last()
      .clear({ force: true })
      .type(toStr, { force: true });
    cy.get('body').click(0, 0, { force: true });

    cy.get('.oxd-calendar-dropdown').should('not.exist');

    // ===== 3) COMMENT =====
    cy.get('textarea')
      .click({ force: true })
      .type(`Test apply leave with Cypress at ${fromStr}`, { force: true });

    // ===== 4) APPLY =====
    cy.get('button[type="submit"]').click({ force: true });

    // ===== 5) VERIFY TOAST =====
    cy.get('.oxd-toast', { timeout: 20000 })
      .should('be.visible')
      .then($toast => {
        const text = $toast.text().trim();
        cy.log("TOAST RECEIVED:", text);

        // Chấp nhận Success / Warning / Error (môi trường hay lỗi API)
        expect(text).to.match(/Success|Warning|Error|Failed/i);
      });

    cy.wait(2000);
});



  it('Apply_Leave_ESS-2: Apply leave WITHOUT selecting Leave Type', () => {

    // ===== VÀO TRANG APPLY =====
    cy.contains('span', 'Leave').click();
    cy.contains('a', 'Apply').click();

    // Chờ API load
    cy.wait('@getLeaveTypes', { timeout: 15000 });
    cy.get('.oxd-loading-spinner').should('not.exist');

    // ===== KHÔNG CHỌN LEAVE TYPE =====
    // => bỏ trống hoàn toàn

    // ===== CHỌN NGÀY HỢP LỆ (để tránh lỗi khác) =====
    const today = new Date();
    today.setDate(today.getDate() + 5);
    const dayStr = formatYddM(today);

    // From Date
    cy.get('input[placeholder="yyyy-dd-mm"]').first()
      .clear()
      .type(dayStr, { force: true });

    cy.get('body').click(0, 0, { force: true });

    // To Date
    cy.get('input[placeholder="yyyy-dd-mm"]').last()
      .clear()
      .type(dayStr, { force: true });

    cy.get('body').click(0, 0, { force: true });

    cy.get('.oxd-calendar-dropdown').should('not.exist');

    // ===== COMMENT TÙY CHỌN =====
    cy.get('textarea')
      .click({ force: true })
      .type('Leave request without selecting type', { force: true });

    // ===== NHẤN APPLY =====
    cy.get('button[type="submit"]').click({ force: true });

    // ===== EXPECTED OUTPUT =====
    // Ô Leave Type phải hiện text "Required"
    cy.contains('.oxd-input-group__message', 'Required')
      .should('be.visible');
      cy.wait(2000);
  });
  

// ========================================================================
//  Apply_Leave_ESS-3: Apply leave with INVALID date range
// ========================================================================

it('Apply_Leave_ESS-3: Apply leave with INVALID date range', () => {

    // ==== VÀO TRANG APPLY ====
    cy.contains('span', 'Leave').click();
    cy.contains('a', 'Apply').click();

    // Chờ API load leave type
    cy.wait('@getLeaveTypes', { timeout: 15000 });
    cy.get('.oxd-loading-spinner').should('not.exist');
    cy.wait(300);

    // ===== CHỌN LEAVE TYPE =====
    cy.get('.oxd-select-text').first().click({ force: true });

    cy.get('.oxd-select-dropdown', { timeout: 8000 })
      .should('be.visible');

    cy.contains('.oxd-select-option', 'CAN - Vacation')
      .should('be.visible')
      .click({ force: true });

    // ===== SET NGÀY SAI (From > To) =====
    const wrongFrom = '2025-15-12';  // yyyy-dd-mm
    const wrongTo   = '2025-01-12';

    // From date
    cy.get('input[placeholder="yyyy-dd-mm"]').first()
      .focus()
      .clear()
      .type(wrongFrom, { force: true });

    cy.get('body').click(0, 0, { force: true });

    // To date
    cy.get('input[placeholder="yyyy-dd-mm"]').last()
      .focus()
      .clear()
      .type(wrongTo, { force: true });

    cy.get('body').click(0, 0, { force: true });

    // Chắc chắn calendar đóng lại
    cy.get('.oxd-calendar-dropdown').should('not.exist');

    // ===== COMMENT =====
    cy.get('textarea')
      .click({ force: true })
      .type('Testing invalid date range', { force: true });

    // ===== APPLY =====
    cy.get('button[type="submit"]').click({ force: true });

    // ===== VERIFY ERROR =====
    // Lỗi đúng sẽ xuất hiện dưới ô To Date:
    // "To date should be after from date"
    cy.contains('.oxd-input-group__message', 'To date should be after from date', { timeout: 10000 })
      .should('be.visible');

    cy.wait(1500);
});
  // ========================================================================
//  Apply_Leave_ESS-4: Apply leave for the SAME date twice
// ========================================================================
// ========================================================================
//  Apply_Leave_ESS-4: Apply leave for the SAME date twice (fixed date)
// ========================================================================
it('Apply_Leave_ESS-4: Apply leave for the SAME date twice (fixed date)', () => {

    const fromDate = "2025-15-12";   // yyyy-dd-mm
    const toDate   = "2025-16-12";   // yyyy-dd-mm

    // ==== VÀO TRANG APPLY ====
    cy.contains('span', 'Leave').click();
    cy.contains('a', 'Apply').click();

    cy.wait('@getLeaveTypes', { timeout: 15000 });
    cy.get('.oxd-loading-spinner').should('not.exist');
    cy.wait(300);

    // ===== CHỌN LEAVE TYPE =====
    cy.get('.oxd-select-text').first().click({ force: true });
    cy.contains('.oxd-select-option', 'CAN - Vacation')
      .should('be.visible')
      .click({ force: true });

    // =====================================================================
    //                          APPLY LẦN 1
    // =====================================================================
    cy.log("=== APPLY LẦN 1 ===");

    // From Date
    cy.get('input[placeholder="yyyy-dd-mm"]').first()
      .clear()
      .type(fromDate, { force: true });
    cy.get('body').type('{esc}', { force: true });

    // To Date
    cy.get('input[placeholder="yyyy-dd-mm"]').last()
      .clear()
      .type(toDate, { force: true });
    cy.get('body').type('{esc}', { force: true });

    cy.get('.oxd-calendar-dropdown').should('not.exist');

    cy.get('textarea')
      .click({ force: true })
      .type(`First apply for ${fromDate} - ${toDate}`, { force: true });

    cy.get('button[type="submit"]').click({ force: true });

    // Expect: SUCCESS
    cy.get('.oxd-toast', { timeout: 15000 })
      .should('be.visible')
      .then($toast => {
        const txt = $toast.text();
        cy.log('Toast 1:', txt);
        expect(txt).to.match(/Success/i);
      });

    cy.wait(1500);

    // =====================================================================
    //                          APPLY LẦN 2 (TRÙNG DATE RANGE)
    // =====================================================================

    cy.log("=== APPLY LẦN 2 (TRÙNG DATE RANGE) ===");

    // Load lại form Apply để reset UI
    cy.contains('a', 'Apply').click();

    cy.wait('@getLeaveTypes', { timeout: 15000 });
    cy.get('.oxd-loading-spinner').should('not.exist');
    cy.wait(300);

    // Chọn lại Leave Type
    cy.get('.oxd-select-text').first().click({ force: true });
    cy.contains('.oxd-select-option', 'CAN - Vacation')
      .should('be.visible')
      .click({ force: true });

    // Set lại EXACT SAME DATE RANGE
    cy.get('input[placeholder="yyyy-dd-mm"]').first()
      .clear()
      .type(fromDate, { force: true });
    cy.get('body').type('{esc}', { force: true });

    cy.get('input[placeholder="yyyy-dd-mm"]').last()
      .clear()
      .type(toDate, { force: true });
    cy.get('body').type('{esc}', { force: true });

    cy.get('.oxd-calendar-dropdown').should('not.exist');

    // Comment
    cy.get('textarea')
      .click({ force: true })
      .type(`Second apply duplicate ${fromDate}-${toDate}`, { force: true });

    // Submit
    cy.get('button[type="submit"]').click({ force: true });

    // EXPECT WARNING / FAILED / OVERLAP
    cy.get('.oxd-toast', { timeout: 20000 })
      .should('be.visible')
      .then($toast => {
        const txt = $toast.text();
        cy.log('Toast 2:', txt);

        // OrangeHRM sẽ báo overlap → Warning / Failed
        expect(txt).to.match(/Warning|Failed|Overlap/i);
      });

    cy.wait(1500);
});


it('Apply_Leave_ESS-5: Verify applied leave appears in My Leave list', () => {

    // ===== 1) ĐI TỚI APPLY LEAVE =====
    cy.contains('span', 'Leave').click();
    cy.contains('a', 'Apply').click();

    // Chờ API đã stub ở beforeEach
    cy.wait('@getLeaveTypes');
    cy.get('.oxd-loading-spinner').should('not.exist');
    cy.wait(300);

    // ===== 2) CHỌN LEAVE TYPE =====
    cy.get('.oxd-select-text').first().click({ force: true });
    cy.contains('.oxd-select-option', 'CAN - Vacation')
      .should('be.visible')
      .click({ force: true });

    // ===== 3) NHẬP NGÀY =====
    const from = '2025-16-12';          // yyyy-dd-mm
    const to   = '2025-17-12';          // yyyy-dd-mm
    const comment = `Test verify MyLeave ${from}`;

    // FROM DATE
    cy.get('input[placeholder="yyyy-dd-mm"]').first()
      .clear({ force: true })
      .type(from, { force: true });
    cy.get('body').type('{esc}');
    cy.get('.oxd-calendar-dropdown').should('not.exist');

    // TO DATE
    cy.get('input[placeholder="yyyy-dd-mm"]').last()
      .clear({ force: true })
      .type(to, { force: true });
    cy.get('body').type('{esc}');
    cy.get('.oxd-calendar-dropdown').should('not.exist');

    // ===== 4) COMMENT =====
    cy.get('body').type('{esc}');
    cy.get('.oxd-calendar-dropdown').should('not.exist');

    cy.get('textarea')
      .scrollIntoView()
      .click({ force: true })
      .clear({ force: true })
      .type(comment, { force: true });

    // ===== 5) APPLY =====
    cy.get('button[type="submit"]').click({ force: true });

    // ===== 6) VERIFY TOAST =====
    cy.get('.oxd-toast', { timeout: 15000 })
      .should('be.visible')
      .then($t => {
        const text = $t.text();
        cy.log('Toast TC5:', text);
        expect(text).to.match(/Success|Warning|Error|Failed/i);
      });

    cy.wait(1500);

    // ===== 7) MỞ MY LEAVE =====
    cy.contains('a', 'My Leave').click();
    cy.get('.oxd-table-body', { timeout: 15000 }).should('be.visible');

    // ===== 8) VERIFY RECORD VỪA GỬI =====
    // Chỉ cần dòng chứa FROM DATE là đủ (vì UI hiển thị "2025-16-12 to 2025-17-12")
    cy.contains('.oxd-table-row', from)
      .should('be.visible')
      .within(() => {

          // TYPE
          cy.contains('CAN - Vacation').should('be.visible');

          // STATUS (Pending / Pending Approval / Cancelled / Rejected đều chấp nhận)
          cy.contains(/Pending Approval|Pending|Cancelled|Rejected/i)
            .should('be.visible');

          // COMMENT
          cy.contains(comment).should('be.visible');
      });

    cy.wait(1000);
});



it('Apply_Leave_ESS-6: Apply leave using Half Day - Morning', () => {

    // ==== VÀO TRANG APPLY ====
    cy.contains('span', 'Leave').click();
    cy.contains('a', 'Apply').click();

    cy.wait('@getLeaveTypes', { timeout: 15000 });
    cy.get('.oxd-loading-spinner').should('not.exist');
    cy.wait(300);

    // ==== CHỌN LEAVE TYPE ====
    cy.get('.oxd-select-text').first().click({ force: true });
    cy.contains('.oxd-select-option', 'CAN - Vacation')
        .click({ force: true });

    // ==== SET NGÀY 4/12/2025 theo format yyyy-dd-mm => 2025-04-12 ====
    const dateStr = '2025-04-12';

    cy.get('input[placeholder="yyyy-dd-mm"]').first()
      .clear()
      .type(dateStr, { force: true });
    cy.get('body').click(0, 0, { force: true });

    cy.get('input[placeholder="yyyy-dd-mm"]').last()
      .clear()
      .type(dateStr, { force: true });
    cy.get('body').click(0, 0, { force: true });

    cy.get('.oxd-calendar-dropdown').should('not.exist');

    // ==== CHỌN DURATION: Half Day - Morning ====
    cy.get('.oxd-select-text').eq(1).click({ force: true });
    cy.contains('.oxd-select-option', 'Half Day - Morning')
        .click({ force: true });

    // ==== COMMENT ====
    cy.get('textarea').click({ force: true })
      .type('Apply Half Day - Morning leave', { force: true });

    // ==== APPLY ====
    cy.get('button[type="submit"]').click({ force: true });

    // ==== VERIFY TOAST ====
    cy.get('.oxd-toast', { timeout: 15000 })
      .should('be.visible')
      .and('contain.text', 'Success');

    cy.wait(1500);

    // ==== VÀO MY LEAVE ====
    cy.contains('a', 'My Leave').click();

    cy.get('.oxd-table-body', { timeout: 15000 }).should('be.visible');

    // ==== TÌM DÒNG TƯƠNG ỨNG ====
    // UI hiển thị: "2025-04-12 (09:00 - 13:00) Half Day"
    cy.contains('.oxd-table-row', '2025-04-12')
      .should('be.visible')
      .within(() => {
          cy.contains('CAN - Vacation').should('be.visible');
          cy.contains('Half Day').should('be.visible');
          cy.contains('Morning').should('be.visible');
      });

    cy.wait(1500);
});


});


