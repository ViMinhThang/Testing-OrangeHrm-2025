/**
 * Author: Nguyen Ngoc Thinh - 22130270
 * Module: Leave Apply (ESS User) - OrangeHRM
 * Lab: 9
 */
describe('Module Leave Apply (ESS User)', () => {

    Cypress.on('uncaught:exception', (err, runnable) => { return false })

    let testUser = {
        firstName: 'AutoEss',
        lastName: 'User' + Math.floor(Math.random() * 10000),
        username: 'ess_apply_' + Math.floor(Math.random() * 10000),
        password: 'Password123!',
        empID: ''
    };

    before(() => {
        // 1. ADMIN LOGIN
        cy.visit('https://opensource-demo.orangehrmlive.com/')
        cy.get('input[name="username"]').type('Admin')
        cy.get('input[name="password"]').type('admin123')
        cy.get('button[type="submit"]').click()

        // 2. TẠO USER
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

        // --- HÀM NẠP TIỀN DÙNG CHUNG (CHO GỌN) ---
        const addEntitlement = (year) => {
            cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/leave/addLeaveEntitlement')
            cy.get('input[placeholder="Type for hints..."]').type(testUser.firstName + ' ' + testUser.lastName)
            cy.wait(3000)
            cy.get('.oxd-autocomplete-dropdown > div').first().click()

            cy.get('.oxd-select-text').first().click()
            cy.contains('US - Personal').click()

            cy.contains('label', 'Leave Period').parent().next().click()
            cy.get('.oxd-select-dropdown').contains(year).click()

            cy.contains('label', 'Entitlement').parent().next().find('input').type('30')
            cy.get('button[type="submit"]').click()

            // --- FIX QUAN TRỌNG: CHỜ POPUP HIỆN RA ---
            cy.wait(1000)
            cy.get('body').then(($body) => {
                // Nếu tìm thấy nút Confirm (Popup hiện ra do trùng lặp hoặc confirm policy)
                if ($body.find('.oxd-button--secondary').length > 0) {
                    cy.contains('button', 'Confirm').click({ force: true })
                }
            })
            cy.contains('Successfully Saved', { timeout: 10000 }).should('be.visible')
        }

        // 3. NẠP 2025 VÀ 2026
        addEntitlement('2025')
        addEntitlement('2026')

        // 4. LOGOUT
        cy.get('.oxd-userdropdown-name').click()
        cy.contains('Logout').click()
    })

    beforeEach(() => {
        cy.visit('https://opensource-demo.orangehrmlive.com/')
        cy.get('input[name="username"]').type(testUser.username)
        cy.get('input[name="password"]').type(testUser.password)
        cy.get('button[type="submit"]').click()
    })

    // -------------------------------------------------------------
    // TC-01: Xin nghỉ phép (Có chọn Partial Days theo yêu cầu)
    // -------------------------------------------------------------
    it('TC-LeaveApply-01: Xin nghỉ phép thành công (Nhiều ngày)', () => {
        cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/leave/applyLeave')
        cy.get('.oxd-select-text').first().click()
        cy.contains('US - Personal').click()
        cy.wait(1000)
        cy.get('input[placeholder="yyyy-dd-mm"]').first().clear().type('2026-05-01', { force: true })
        cy.get('input[placeholder="yyyy-dd-mm"]').last().clear().type('2026-09-01', { force: true })
        cy.get('.oxd-text--h6').first().click({ force: true })
        cy.wait(1000) // Chờ load
        cy.contains('label', 'Partial Days').parent().next().click()
        cy.get('.oxd-select-dropdown').contains('All Days').click()
        cy.contains('label', 'Duration').parent().next().click()
        cy.get('.oxd-select-dropdown').contains('Half Day - Morning').click()
        cy.get('textarea').type('TC 01 with Partial Days', { force: true })
        cy.get('button[type="submit"]').click()
        cy.get('.oxd-toast-container').should('contain', 'Success')
    })

    // -------------------------------------------------------------
    // TC-02: Xin nghỉ phép thành công (1 ngày - Dùng 2025 an toàn)
    // -------------------------------------------------------------
    it('TC-LeaveApply-02: Xin nghỉ phép thành công (1 ngày)', () => {
        cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/leave/applyLeave')
        cy.get('.oxd-select-text').first().click()
        cy.contains('US - Personal').click()
        cy.wait(1000)

        // Chọn ngày 17/12/2025 (Thứ 4) - Tránh trùng TC-01
        const fixedDate = '2025-12-17'
        cy.get('input[placeholder="yyyy-dd-mm"]').first().clear().type(fixedDate, { force: true })
        cy.get('input[placeholder="yyyy-dd-mm"]').last().clear().type(fixedDate, { force: true })
        cy.get('.oxd-text--h6').first().click({ force: true })

        cy.get('textarea').type('TC 02 Single Day', { force: true })
        cy.get('button[type="submit"]').click()
        cy.get('.oxd-toast-container').should('contain', 'Success')
    })

    // -------------------------------------------------------------
    // TC-03: Check lỗi khi KHÔNG chọn loại nghỉ
    // -------------------------------------------------------------
    it('TC-LeaveApply-03: Check lỗi khi KHÔNG chọn loại nghỉ', () => {
        cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/leave/applyLeave')

        // KHÔNG chọn Leave Type
        const date = '2025-12-25'
        cy.get('input[placeholder="yyyy-dd-mm"]').first().clear().type(date, { force: true })
        cy.get('input[placeholder="yyyy-dd-mm"]').last().clear().type(date, { force: true })
        cy.get('.oxd-text--h6').first().click({ force: true })

        cy.get('button[type="submit"]').click()
        cy.contains('.oxd-input-group', 'Leave Type').find('.oxd-input-field-error-message').should('contain', 'Required')
    })

    // -------------------------------------------------------------
    // TC-04: Check lỗi khi KHÔNG nhập ngày tháng
    // -------------------------------------------------------------
    it('TC-LeaveApply-04: Check lỗi khi KHÔNG nhập ngày tháng', () => {
        cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/leave/applyLeave')
        cy.get('.oxd-select-text').first().click()
        cy.contains('US - Personal').click()

        cy.get('input[placeholder="yyyy-dd-mm"]').first().clear({ force: true })
        cy.get('input[placeholder="yyyy-dd-mm"]').last().clear({ force: true })
        cy.get('button[type="submit"]').click()

        cy.contains('.oxd-input-group', 'From Date').find('.oxd-input-field-error-message').should('contain', 'Required')
    })

    // -------------------------------------------------------------
    // TC-05: Check logic To Date < From Date
    // -------------------------------------------------------------
    it('TC-LeaveApply-05: Check logic To Date < From Date', () => {
        cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/leave/applyLeave')
        cy.get('.oxd-select-text').first().click()
        cy.contains('US - Personal').click()

        // From lớn hơn To
        cy.get('input[placeholder="yyyy-dd-mm"]').first().clear().type('2025-12-10', { force: true })
        cy.get('input[placeholder="yyyy-dd-mm"]').last().clear().type('2025-12-01', { force: true })
        cy.get('.oxd-text--h6').first().click({ force: true })

        cy.contains('.oxd-input-group', 'To Date').find('.oxd-input-field-error-message').should('contain', 'To date should be after from date')
    })

    // -------------------------------------------------------------
    // TC-06: Check lỗi khi xin nghỉ quá số dư (Dùng năm 2026, xin 30 ngày)
    // -------------------------------------------------------------
    it('TC-LeaveApply-06: Check lỗi khi xin nghỉ quá số dư', () => {
        cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/leave/applyLeave')
        cy.get('.oxd-select-text').first().click()
        cy.contains('US - Personal').click()
        cy.wait(1000)

        // Dù có nạp 20 ngày cho 2026 thì ta xin hẳn 30 ngày (01/03 -> 31/03/2026)
        // Đảm bảo chắc chắn sẽ Over Balance
        cy.get('input[placeholder="yyyy-dd-mm"]').first().clear().type('2026-20-01', { force: true })
        cy.get('input[placeholder="yyyy-dd-mm"]').last().clear().type('2026-03-03', { force: true })
        cy.get('.oxd-text--h6').first().click({ force: true })

        cy.wait(2000)
        cy.get('button[type="submit"]').click()
        cy.get('.oxd-toast-container').should('contain', 'Exceeded')
    })

    // -------------------------------------------------------------
    // TC-07: Check nhập sai định dạng ngày
    // -------------------------------------------------------------
    it('TC-LeaveApply-07: Check nhập sai định dạng ngày (nhập chữ)', () => {
        cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/leave/applyLeave')
        cy.get('.oxd-select-text').first().click()
        cy.contains('US - Personal').click()

        cy.get('input[placeholder="yyyy-dd-mm"]').first().clear().type('abc', { force: true })
        cy.get('.oxd-text--h6').first().click({ force: true })

        cy.contains('.oxd-input-group', 'From Date').find('.oxd-input-field-error-message').should('contain', 'Should be a valid date')
    })

    // -------------------------------------------------------------
    // TC-08: Check tạo đơn trùng (Dùng lại ngày của TC-02)
    // -------------------------------------------------------------
    it('TC-LeaveApply-08: Check tạo đơn trùng với ngày đã nghỉ', () => {
        cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/leave/applyLeave')
        cy.get('.oxd-select-text').first().click()
        cy.contains('US - Personal').click()

        // Dùng lại ngày 17/12/2025 (Đã pass ở TC-02)
        const fixedDate = '2025-12-17'
        cy.get('input[placeholder="yyyy-dd-mm"]').first().clear().type(fixedDate, { force: true })
        cy.get('input[placeholder="yyyy-dd-mm"]').last().clear().type(fixedDate, { force: true })
        cy.get('.oxd-text--h6').first().click({ force: true })
        cy.wait(1000)

        cy.get('button[type="submit"]').click()
        // Có thể báo "Failed" hoặc "Overlapping"
        cy.get('body').should('contain', 'Overlapping Leave Request')
    })

    // -------------------------------------------------------------
    // TC-09: Check nhập ký tự đặc biệt
    // -------------------------------------------------------------
    it('TC-LeaveApply-09: Check nhập ký tự đặc biệt vào ô Lý do', () => {
        cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/leave/applyLeave')
        cy.get('.oxd-select-text').first().click()
        cy.contains('US - Personal').click()

        // Chọn ngày an toàn: 30/12/2025 (Thứ 3)
        const date = '2025-12-30'
        cy.get('input[placeholder="yyyy-dd-mm"]').first().clear().type(date, { force: true })
        cy.get('input[placeholder="yyyy-dd-mm"]').last().clear().type(date, { force: true })
        cy.get('.oxd-text--h6').first().click({ force: true })

        const specialChars = '!@#$%^&*()_+<>?:"{}|~`'
        cy.get('textarea').type(specialChars, { force: true })
        cy.get('button[type="submit"]').click()
        cy.get('.oxd-toast-container').should('contain', 'Success')
    })

    // -------------------------------------------------------------
    // TC-10: Xin nghỉ cuối tuần (Bắt buộc chọn T7/CN để check lỗi)
    // -------------------------------------------------------------
    it('TC-LeaveApply-10: Check logic khi xin nghỉ hoàn toàn vào cuối tuần', () => {
        cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/leave/applyLeave')
        cy.get('.oxd-select-text').first().click()
        cy.contains('US - Personal').click()

        // Chọn T7 (27/12/2025) và CN (28/12/2025)
        const saturdayDate = '2025-12-27'
        const sundayDate = '2025-12-28'

        cy.get('input[placeholder="yyyy-dd-mm"]').first().clear().type(saturdayDate, { force: true })
        cy.get('input[placeholder="yyyy-dd-mm"]').last().clear().type(sundayDate, { force: true })
        cy.get('.oxd-text--h6').first().click({ force: true })

        cy.wait(1000)
        cy.get('button[type="submit"]').click()

        // Verify lỗi
        cy.get('.oxd-toast-container').should('contain', 'No Working Days Selected')
    })
})
