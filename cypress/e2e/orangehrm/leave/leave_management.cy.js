/**
 * Author: Nguyen Ngoc Thinh - 22130270
 * Module: Admin Leave Management - OrangeHRM
 * Lab: 9
 */
describe('Function D: Admin Leave Management (Leave List)', () => {

    Cypress.on('uncaught:exception', (err, runnable) => { return false })

    let testUser = {
        firstName: 'AutoTest',
        lastName: 'User' + Math.floor(Math.random() * 10000),
        username: 'ess_user_' + Math.floor(Math.random() * 10000),
        password: 'Password123!',
        empID: ''
    };

    // =================================================================
    // SETUP DỮ LIỆU: TẠO USER -> NẠP TIỀN -> TẠO 5 ĐƠN
    // =================================================================
    before(() => {
        // 1. ADMIN TẠO USER
        cy.visit('https://opensource-demo.orangehrmlive.com/')
        cy.get('input[name="username"]').type('Admin')
        cy.get('input[name="password"]').type('admin123')
        cy.get('button[type="submit"]').click()

        cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/pim/addEmployee')
        cy.get('input[name="firstName"]').type(testUser.firstName)
        cy.get('input[name="lastName"]').type(testUser.lastName)

        cy.get('.oxd-switch-input').first().click({ force: true })
        cy.contains('label', 'Username').should('be.visible')
        cy.contains('label', 'Username').parent().next().find('input').type(testUser.username)
        cy.contains('label', 'Password').parent().next().find('input').type(testUser.password)
        cy.contains('label', 'Confirm Password').parent().next().find('input').type(testUser.password)
        cy.get('button[type="submit"]').click()
        cy.contains('Successfully Saved', { timeout: 10000 }).should('be.visible')

        // 2. NẠP TIỀN (2025 & 2026)
        // Nạp 2025
        cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/leave/addLeaveEntitlement')
        cy.get('input[placeholder="Type for hints..."]').type(testUser.firstName + ' ' + testUser.lastName)
        cy.wait(3000)
        cy.get('.oxd-autocomplete-dropdown > div').first().click()
        cy.contains('label', 'Leave Period').parent().next().click()
        cy.get('.oxd-select-dropdown').contains('2025').click()
        cy.get('.oxd-select-text').first().click()
        cy.contains('US - Personal').click()
        cy.contains('label', 'Entitlement').parent().next().find('input').type('20')
        cy.get('button[type="submit"]').click()
        cy.get('body').then(($body) => {
            if ($body.find('.oxd-button--secondary').length > 0) {
                cy.get('.oxd-button--secondary').contains('Confirm').click({ force: true })
            }
        })
        cy.contains('Successfully Saved').should('be.visible')

        // Nạp 2026
        cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/leave/addLeaveEntitlement')
        cy.get('input[placeholder="Type for hints..."]').type(testUser.firstName + ' ' + testUser.lastName)
        cy.wait(3000)
        cy.get('.oxd-autocomplete-dropdown > div').first().click()
        cy.contains('label', 'Leave Period').parent().next().click()
        cy.get('.oxd-select-dropdown').contains('2026').click()
        cy.get('.oxd-select-text').first().click()
        cy.contains('US - Personal').click()
        cy.contains('label', 'Entitlement').parent().next().find('input').type('20')
        cy.get('button[type="submit"]').click()
        cy.get('body').then(($body) => {
            if ($body.find('.oxd-button--secondary').length > 0) {
                cy.get('.oxd-button--secondary').contains('Confirm').click({ force: true })
            }
        })
        cy.contains('Successfully Saved').should('be.visible')

        // 3. ESS TẠO 5 ĐƠN
        cy.get('.oxd-userdropdown-name').click()
        cy.contains('Logout').click()

        cy.get('input[name="username"]').should('be.visible').type(testUser.username)
        cy.get('input[name="password"]').type(testUser.password)
        cy.get('button[type="submit"]').click()

        const runID = Math.floor(Math.random() * 1000);
        Cypress.env('currentRunID', runID);

        const createLeave = (date, comment) => {
            cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/leave/applyLeave')
            cy.get('.oxd-select-text').first().click()
            cy.contains('US - Personal').click()
            cy.get('input[placeholder="yyyy-dd-mm"]').first().clear().type(date, { force: true })
            cy.get('input[placeholder="yyyy-dd-mm"]').last().clear().type(date, { force: true })
            cy.contains('h6', 'Apply Leave').click({ force: true })
            cy.get('textarea').type(comment, { force: true })
            cy.get('button[type="submit"]').click()
            cy.contains('Successfully Saved', { timeout: 15000 }).should('be.visible')
            cy.wait(1000)
        }

        createLeave('2026-08-12', `Auto_Approve_${runID}`);
        createLeave('2026-08-13', `Auto_Reject_${runID}`);
        createLeave('2026-08-14', `Bulk_Approve_1_${runID}`);
        createLeave('2026-08-17', `Bulk_Approve_2_${runID}`);
        createLeave('2026-08-18', `Test_Case_09_Comment_${runID}`);

        cy.get('.oxd-userdropdown-name').click()
        cy.contains('Logout').click()
    })

    beforeEach(() => {
        cy.visit('https://opensource-demo.orangehrmlive.com/')
        cy.get('input[name="username"]').should('be.visible').type('Admin')
        cy.get('input[name="password"]').type('admin123')
        cy.get('button[type="submit"]').click()
    })

    // --- CÁC TEST CASE TỪ 01 ĐẾN 09 (GIỮ NGUYÊN) ---
    it('TC-LeaveManagement-01: Tìm kiếm đơn nghỉ theo Trạng thái (Pending Approval)', () => {
        const runID = Cypress.env('currentRunID');
        const targetComment = `Auto_Approve_${runID}`;
        cy.contains('.oxd-main-menu-item', 'Leave').click()
        cy.contains('button', 'Reset').click()
        cy.wait(1000)
        cy.contains('label', 'From Date').parent().next().find('input').clear({ force: true }).type('2026-01-01', { force: true })
        cy.contains('label', 'To Date').parent().next().find('input').clear({ force: true }).type('2027-01-01', { force: true })
        cy.get('.oxd-text--h5').click({ force: true })
        cy.contains('label', 'Show Leave with Status').parent().next().click()
        cy.contains('div[role="option"]', 'Pending Approval').click()
        cy.get('button[type="submit"]').click({ force: true })
        cy.wait(1500)
        cy.contains('div', targetComment).should('exist')
    })

    it('TC-LeaveManagement-02: Tìm kiếm đơn nghỉ theo Tên nhân viên (Valid)', () => {
        cy.contains('.oxd-main-menu-item', 'Leave').click()
        cy.contains('button', 'Reset').click({ force: true })
        cy.wait(1000)
        cy.contains('label', 'From Date').parent().next().find('input').clear({ force: true }).type('2026-01-01', { force: true })
        cy.contains('label', 'To Date').parent().next().find('input').clear({ force: true }).type('2027-01-01', { force: true })
        cy.get('.oxd-text--h5').click({ force: true })
        cy.get('input[placeholder="Type for hints..."]').type(testUser.firstName)
        cy.wait(3000)
        cy.get('.oxd-autocomplete-dropdown', { timeout: 10000 }).should('be.visible').find('[role="option"]').first().click()
        cy.get('button[type="submit"]').click({ force: true })
        cy.wait(1500)
        cy.get('.oxd-table-body').contains(testUser.firstName).should('exist')
    })

    it('TC-LeaveManagement-03: Tìm kiếm không có kết quả (No Records Found)', () => {
        cy.contains('.oxd-main-menu-item', 'Leave').click()
        cy.contains('button', 'Reset').click({ force: true })
        cy.wait(1000)
        cy.contains('label', 'From Date').parent().next().find('input').clear({ force: true }).type('2000-01-01', { force: true })
        cy.contains('label', 'To Date').parent().next().find('input').clear({ force: true }).type('2000-12-31', { force: true })
        cy.get('.oxd-text--h5').click({ force: true })
        cy.contains('label', 'Show Leave with Status').parent().next().click()
        cy.contains('div[role="option"]', 'Pending Approval').click()
        cy.get('button[type="submit"]').click({ force: true })
        cy.wait(1000)
        cy.contains('No Records Found').should('exist')
    })

    it('TC-LeaveManagement-04: Admin duyệt đơn nghỉ (Approve)', () => {
        const runID = Cypress.env('currentRunID');
        const targetComment = `Auto_Approve_${runID}`;
        cy.contains('.oxd-main-menu-item', 'Leave').click()
        cy.contains('button', 'Reset').click({ force: true })
        cy.wait(1000)
        cy.contains('label', 'From Date').parent().next().find('input').clear({ force: true }).type('2026-01-01', { force: true })
        cy.contains('label', 'To Date').parent().next().find('input').clear({ force: true }).type('2027-01-01', { force: true })
        cy.get('.oxd-text--h5').click({ force: true })
        cy.contains('label', 'Show Leave with Status').parent().next().click()
        cy.contains('div[role="option"]', 'Pending Approval').click()
        cy.get('button[type="submit"]').click({ force: true })
        cy.wait(1500)
        cy.contains('.oxd-table-row', targetComment).should('be.visible')
            .find('button.oxd-button--label-success').click({ force: true })
        cy.get('.oxd-toast-container').should('contain', 'Success')
        cy.contains('label', 'Show Leave with Status').parent().next().click()
        cy.contains('div[role="option"]', 'Scheduled').click()
        cy.get('button[type="submit"]').click({ force: true })
        cy.contains('.oxd-table-row', targetComment).should('contain', 'Scheduled')
    })

    it('TC-LeaveManagement-05: Admin từ chối đơn nghỉ (Reject)', () => {
        const runID = Cypress.env('currentRunID');
        const targetComment = `Auto_Reject_${runID}`;
        cy.contains('.oxd-main-menu-item', 'Leave').click()
        cy.contains('button', 'Reset').click({ force: true })
        cy.wait(1000)
        cy.contains('label', 'From Date').parent().next().find('input').clear({ force: true }).type('2026-01-01', { force: true })
        cy.contains('label', 'To Date').parent().next().find('input').clear({ force: true }).type('2027-01-01', { force: true })
        cy.get('.oxd-text--h5').click({ force: true })
        cy.contains('label', 'Show Leave with Status').parent().next().click()
        cy.contains('div[role="option"]', 'Pending Approval').click()
        cy.get('button[type="submit"]').click({ force: true })
        cy.wait(1500)
        cy.contains('.oxd-table-row', targetComment).should('be.visible')
            .find('button.oxd-button--label-danger').click({ force: true })
        cy.get('.oxd-toast-container').should('contain', 'Success')
        cy.contains('label', 'Show Leave with Status').parent().next().click()
        cy.contains('div[role="option"]', 'Rejected').click()
        cy.get('button[type="submit"]').click({ force: true })
        cy.contains('.oxd-table-row', targetComment).should('contain', 'Rejected')
    })

    it('TC-LeaveManagement-06: Hủy đơn đã duyệt (Cancel Scheduled Leave)', () => {
        const runID = Cypress.env('currentRunID');
        const targetComment = `Auto_Approve_${runID}`;
        cy.contains('.oxd-main-menu-item', 'Leave').click()
        cy.contains('button', 'Reset').click({ force: true })
        cy.wait(1000)
        cy.contains('label', 'From Date').parent().next().find('input').clear({ force: true }).type('2026-01-01', { force: true })
        cy.contains('label', 'To Date').parent().next().find('input').clear({ force: true }).type('2027-01-01', { force: true })
        cy.get('.oxd-text--h5').click({ force: true })
        cy.contains('label', 'Show Leave with Status').parent().next().click()
        cy.contains('div[role="option"]', 'Scheduled').click()
        cy.get('button[type="submit"]').click({ force: true })
        cy.wait(1500)
        cy.contains('.oxd-table-row', targetComment).within(() => {
            cy.get('.bi-three-dots-vertical').click({ force: true })
        })
        cy.get('.oxd-dropdown-menu').contains('Cancel').click({ force: true })
        cy.get('.oxd-toast-container').should('contain', 'Success')
        cy.contains('label', 'Show Leave with Status').parent().next().click()
        cy.contains('div[role="option"]', 'Cancelled').click()
        cy.get('button[type="submit"]').click({ force: true })
        cy.contains('.oxd-table-row', targetComment).should('contain', 'Cancelled')
    })

    it('TC-LeaveManagement-07: Duyệt nhiều đơn cùng lúc (Bulk Approve)', () => {
        const runID = Cypress.env('currentRunID');
        const comment1 = `Bulk_Approve_1_${runID}`;
        const comment2 = `Bulk_Approve_2_${runID}`;
        cy.contains('.oxd-main-menu-item', 'Leave').click()
        cy.contains('button', 'Reset').click({ force: true })
        cy.wait(1000)
        cy.contains('label', 'From Date').parent().next().find('input').clear({ force: true }).type('2026-01-01', { force: true })
        cy.contains('label', 'To Date').parent().next().find('input').clear({ force: true }).type('2027-01-01', { force: true })
        cy.get('.oxd-text--h5').click({ force: true })
        cy.contains('label', 'Show Leave with Status').parent().next().click()
        cy.contains('div[role="option"]', 'Pending Approval').click()
        cy.get('button[type="submit"]').click({ force: true })
        cy.wait(1500)
        cy.contains('.oxd-table-row', comment1).find('input[type="checkbox"]').check({ force: true })
        cy.contains('.oxd-table-row', comment2).find('input[type="checkbox"]').check({ force: true })
        cy.contains('button', 'Approve').click({ force: true })
        cy.contains('button', 'Yes, Confirm').click({ force: true })
        cy.get('.oxd-toast-container').should('contain', 'Success')
        cy.contains('label', 'Show Leave with Status').parent().next().click()
        cy.contains('div[role="option"]', 'Scheduled').click()
        cy.get('button[type="submit"]').click({ force: true })
        cy.contains('.oxd-table-row', comment1).should('contain', 'Scheduled')
        cy.contains('.oxd-table-row', comment2).should('contain', 'Scheduled')
    })

    it('TC-LeaveManagement-08: Reset bộ lọc tìm kiếm (Reset Filter)', () => {
        cy.contains('.oxd-main-menu-item', 'Leave').click()
        cy.get('.oxd-loading-spinner').should('not.exist')
        cy.contains('button', 'Reset').click({ force: true })
        cy.wait(1000)
        cy.contains('label', 'From Date').parent().next().find('input').clear({ force: true }).type('2026-01-01', { force: true })
        cy.contains('label', 'To Date').parent().next().find('input').clear({ force: true }).type('2027-01-01', { force: true })
        cy.get('.oxd-text--h5').click({ force: true })
        cy.contains('label', 'From Date').parent().next().find('input').should('have.value', '2026-01-01')
        cy.contains('button', 'Reset').click({ force: true })
        cy.wait(1000)
        const currentYear = new Date().getFullYear().toString();
        cy.contains('label', 'From Date').parent().next().find('input').should('contain.value', currentYear)
        cy.contains('label', 'To Date').parent().next().find('input').should('contain.value', currentYear)
        cy.contains('.oxd-select-text-input', '-- Select --').should('exist')
    })

    it('TC-LeaveManagement-09: Xem chi tiết lý do/Comment của đơn nghỉ', () => {
        const runID = Cypress.env('currentRunID');
        const targetComment = `Test_Case_09_Comment_${runID}`;
        cy.contains('.oxd-main-menu-item', 'Leave').click()
        cy.contains('button', 'Reset').click({ force: true })
        cy.wait(1000)
        cy.contains('label', 'From Date').parent().next().find('input').clear({ force: true }).type('2026-01-01', { force: true })
        cy.contains('label', 'To Date').parent().next().find('input').clear({ force: true }).type('2027-01-01', { force: true })
        cy.get('.oxd-text--h5').click({ force: true })
        cy.contains('label', 'Show Leave with Status').parent().next().click()
        cy.contains('div[role="option"]', 'Pending Approval').click()
        cy.get('button[type="submit"]').click({ force: true })
        cy.wait(1500)
        cy.contains('.oxd-table-row', targetComment).should('exist')
        cy.contains('div', targetComment).should('have.text', targetComment)
    })

    // =================================================================
    // TEST CASE 10: KIỂM TRA ACTION TRÊN ĐƠN ĐÃ REJECT/CANCEL
    // =================================================================
    it('TC-LeaveManagement-10: Kiểm tra hành động trên đơn đã kết thúc (Rejected/Cancelled)', () => {
        const runID = Cypress.env('currentRunID');
        const targetComment = `Auto_Reject_${runID}`; // Đơn này đã bị Reject ở TC-05

        cy.contains('.oxd-main-menu-item', 'Leave').click()
        cy.get('.oxd-loading-spinner').should('not.exist')
        cy.contains('button', 'Reset').click({ force: true })
        cy.wait(1000)

        // Filter tìm đơn Rejected 2026
        cy.contains('label', 'From Date').parent().next().find('input').clear({ force: true }).type('2026-01-01', { force: true })
        cy.contains('label', 'To Date').parent().next().find('input').clear({ force: true }).type('2027-01-01', { force: true })
        cy.get('.oxd-text--h5').click({ force: true })

        // Chọn status Rejected
        cy.contains('label', 'Show Leave with Status').parent().next().click()
        cy.contains('div[role="option"]', 'Rejected').click()
        // Lưu ý: Không cần bỏ chọn 'Pending' vì ta lọc chính xác theo Comment

        cy.get('button[type="submit"]').click({ force: true })
        cy.wait(1500)

        // 1. Verify tìm thấy dòng đó
        cy.contains('.oxd-table-row', targetComment).should('exist')

        // 2. Verify: Trong dòng đó KHÔNG CÓ nút Approve (Xanh) và Reject (Đỏ)
        cy.contains('.oxd-table-row', targetComment).within(() => {
            // Nút Approve class: .oxd-button--label-success
            cy.get('button.oxd-button--label-success').should('not.exist')

            // Nút Reject class: .oxd-button--label-danger
            cy.get('button.oxd-button--label-danger').should('not.exist')
        })
    })

})
