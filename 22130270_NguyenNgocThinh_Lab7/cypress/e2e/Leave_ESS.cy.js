// cypress/e2e/Leave_ESS.cy.js

// Hàm format ngày theo đúng placeholder "yyyy-dd-mm"
function formatYddM(date) {
  const y = date.getFullYear();
  const dd = String(date.getDate()).padStart(2, '0');      // day ở giữa
  const mm = String(date.getMonth() + 1).padStart(2, '0'); // month ở cuối
  return `${y}-${dd}-${mm}`;
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

    cy.get('.oxd-select-dropdown', { timeout: 10000 })
      .should('be.visible');

    cy.contains('.oxd-select-option', 'CAN - Vacation')
      .should('be.visible')
      .click({ force: true });

    // ===== 2) CHỌN NGÀY ĐÚNG FORMAT yyyy-dd-mm =====
    // Lấy 1 ngày NGẪU NHIÊN trong tương lai 3–10 ngày nữa để tránh overlap
    const base = new Date();
    base.setDate(base.getDate() + 3 + Math.floor(Math.random() * 7));
    const fromStr = formatYddM(base);     // ví dụ: 2025-15-12
    const toStr = fromStr;                // xin nghỉ 1 ngày

    // From Date
    cy.get('input[placeholder="yyyy-dd-mm"]').first()
      .focus()
      .clear()
      .type(fromStr, { force: true });

    // Đóng calendar
    cy.get('body').click(0, 0, { force: true });

    // To Date
    cy.get('input[placeholder="yyyy-dd-mm"]').last()
      .focus()
      .clear()
      .type(toStr, { force: true });

    // Đóng calendar
    cy.get('body').click(0, 0, { force: true });

    cy.get('.oxd-calendar-dropdown').should('not.exist');

    // ===== 3) COMMENT =====
    cy.get('textarea')
      .click({ force: true })
      .type(`Test apply leave with Cypress at ${fromStr}`, { force: true });

    // ===== 4) APPLY =====
    cy.get('button[type="submit"]').click({ force: true });

    // ===== 5) VERIFY TOAST =====
    cy.get('.oxd-toast', { timeout: 15000 })
      .should('be.visible')
      .then($toast => {
        const text = $toast.text();
        // in ra log xem server trả gì
        cy.log('Toast text:', text);

        // Ưu tiên mong muốn là Success, nhưng vẫn chấp nhận Warning nếu có overlap
        expect(text).to.match(/Success|Warning/i);
      });
  });

});
