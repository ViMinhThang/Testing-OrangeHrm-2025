describe('22130134_DoAnhKiet_Lab9 - Kiểm thử Recruitment OrangeHRM', () => {
  
  // Hook chạy trước mỗi bài test để đăng nhập
  beforeEach(() => {
    // 1. Truy cập trang login
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    
    // Đăng nhập (Credentials mặc định của trang Demo)
    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();

    // Xác nhận đăng nhập thành công bằng cách check URL hoặc Dashboard
    cy.url().should('include', '/dashboard');
  });

  // --- TEST CASE 1: Thêm ứng viên hợp lệ ---
  it('TC_ADD_01: Thêm ứng viên mới hợp lệ', () => {
    // 2. Vào Recruitment -> Candidates
    cy.contains('span', 'Recruitment').click();
    cy.contains('a', 'Candidates').click();

    // 3. Click Add
    cy.get('.orangehrm-header-container > button').click();

    // 4. Nhập đầy đủ thông tin (John, A, Smith, email, Vacancy)
    cy.get('input[name="firstName"]').type('John');
    cy.get('input[name="middleName"]').type('A');
    cy.get('input[name="lastName"]').type('Smith');
    
    // Xử lý Dropdown Vacancy (OrangeHRM dùng custom div, không phải thẻ select)
    cy.get('.oxd-select-text').first().click(); 
    // Chọn 'Payroll Administrator' (Hoặc Automaton Tester nếu có, ở đây mình chọn mẫu có sẵn)
    cy.contains('span', 'Payroll Administrator').click(); 

    // Nhập Email (Tìm input dựa trên label gần đó vì ID thường động)
    cy.contains('label', 'Email').parent().parent().find('input').type('john.smith@example.com');

    // 5. Save
    cy.get('button[type="submit"]').click();

    // Expected: Hệ thống lưu và hiển thị "Successfully Saved"
    // (OrangeHRM hiển thị thông báo toast ở góc)
    cy.get('.oxd-toast').should('contain', 'Success');
  });

  // --- TEST CASE 2: Thiếu First Name ---
  it('TC_ADD_02: Thiếu First Name', () => {
    cy.contains('span', 'Recruitment').click();
    cy.get('.orangehrm-header-container > button').click();

    // 3. Bỏ trống First Name (Chỉ nhập Last Name để kích hoạt validation)
    cy.get('input[name="lastName"]').type('Smith');
    cy.contains('label', 'Email').parent().parent().find('input').type('test@example.com');

    // 4. Save
    cy.get('button[type="submit"]').click();

    // Expected: Hiển thị lỗi Required dưới ô First Name
    cy.get('input[name="firstName"]').parent().parent().should('contain', 'Required');
  });

  // --- TEST CASE 3: Email không hợp lệ ---
  it('TC_ADD_03: Email không hợp lệ', () => {
    cy.contains('span', 'Recruitment').click();
    cy.get('.orangehrm-header-container > button').click();

    cy.get('input[name="firstName"]').type('John');
    cy.get('input[name="lastName"]').type('Doe');

    // 3. Email = abc123
    cy.contains('label', 'Email').parent().parent().find('input').type('abc123');

    // 4. Save
    cy.get('button[type="submit"]').click();

    // Expected: Hiển thị lỗi format email
    cy.contains('label', 'Email').parent().parent().should('contain', 'Expected format: admin@example.com');
  });

// --- TEST CASE 4: Search theo tên (Positive) ---
  it('TC_SEARCH_01: Search theo tên TỒN TẠI (Ví dụ: "John")', () => {
    cy.contains('span', 'Recruitment').click();
    
    // 1. Xóa tất cả các bộ lọc cũ (rất quan trọng)
    cy.get('button[type="reset"]').click();

    // 2. Nhập tên và chọn từ gợi ý Autocomplete
    const candidateName = 'John';
    
    // Nhập tên
    cy.get('input[placeholder="Type for hints..."]').type(candidateName);
    
    // Chờ 1 giây để danh sách gợi ý hiện ra
    cy.wait(1000); 

    // CHỌN GỢI Ý ĐẦU TIÊN TỪ DANH SÁCH (Bắt buộc)
    cy.get('.oxd-autocomplete-option').first().click();

    // 3. Search
    cy.get('button[type="submit"]').click();

    // 4. Expected: Hiển thị ứng viên có tên "John"
    
    // ASSERTION ĐÃ SỬA: Kiểm tra xem BẤT KỲ dòng nào trong danh sách kết quả có chứa 'John' không.
    // Lấy toàn bộ bảng
    cy.get('.oxd-table-body') 
        // Tìm BẤT KỲ phần tử .oxd-table-card (dòng kết quả) nào có chứa 'John'
        .should('contain', candidateName); 
        
    // Đảm bảo số lượng kết quả phải lớn hơn 0
    cy.get('.oxd-table-body').find('.oxd-table-card').should('have.length.at.least', 1);

  }); // <--- Đảm bảo khối 'it' này được đóng lại chính xác


  // --- TEST CASE 5: Search theo Vacancy ---
  it('TC_SEARCH_02: Search theo Vacancy', () => {
    cy.contains('span', 'Recruitment').click();

    // 3. Vacancy = Payroll Administrator (Thay cho Automaton Tester để đảm bảo có data demo)
    cy.get('.oxd-select-text').first().click();
    cy.contains('span', 'Payroll Administrator').click();

    // 4. Search
    cy.get('button[type="submit"]').click();

    // Expected: Hiển thị ứng viên đúng Vacancy
    // Kiểm tra xem danh sách kết quả có hiện ra ít nhất 1 dòng không
    cy.get('.oxd-table-body').find('.oxd-table-card').should('have.length.at.least', 1);
  });

});