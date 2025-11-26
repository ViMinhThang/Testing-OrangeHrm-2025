import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
from selenium.common.exceptions import TimeoutException

def test_TC_Claim_OK(driver):
    # Chuyển qua trang Claim
    driver.get("https://opensource-demo.orangehrmlive.com/web/index.php/claim/viewAssignClaim")
    # Đợi web hiện lên
    WebDriverWait(driver, 15).until(
        EC.visibility_of_element_located((By.CSS_SELECTOR, "h6.oxd-topbar-header-breadcrumb-module"))
    )
    
    # Nhấn nút "Assign Claim"
    button = driver.find_element(By.CSS_SELECTOR, "div.orangehrm-header-container button")
    button.click()
    # Đợi web hiện lên
    WebDriverWait(driver, 15).until(
        EC.visibility_of_element_located((By.CSS_SELECTOR, "h6.oxd-topbar-header-breadcrumb-module"))
    )
    # Nhập tên nhân viên
    employee_name_input = driver.find_element(By.XPATH, "//input[@placeholder='Type for hints...']")
    employee_name_input.send_keys("Ranga")
    WebDriverWait(driver, 15).until(
        EC.visibility_of_element_located((By.XPATH, "//*[text()='Ranga  Akunuri']"))
    )
    driver.find_element(By.XPATH, "//*[text()='Ranga  Akunuri']").click()
    # Chọn Event
    comboboxes = driver.find_elements(By.CLASS_NAME, "oxd-select-text.oxd-select-text--active")
    event_combobox = comboboxes[0]
    event_combobox.click()
    driver.find_element(By.XPATH, "//*[text()='Accommodation']").click()
    # Chọn Currency
    currency_combobox = comboboxes[1]
    currency_combobox.click()
    driver.find_element(By.XPATH, "//*[text()='Afghanistan Afghani']").click()
    # Submit
    submit_button = driver.find_element(By.XPATH, "//button[@type='submit']")
    submit_button.click()
    
    try:
        # Chờ tối đa 15 giây xem URL có chứa chuỗi mong muốn không
        WebDriverWait(driver, 10).until(
            EC.url_contains("/claim/assignClaim/id")
        )
        # Nếu chạy đến đây nghĩa là không bị Timeout -> Test Pass
        print("Test Passed: Đã chuyển hướng thành công.")

    except TimeoutException:
        assert False

def test_TC_Claim_EmployeeName_Missing(driver):
    # Chuyển qua trang Claim
    driver.get("https://opensource-demo.orangehrmlive.com/web/index.php/claim/viewAssignClaim")
    # Đợi web hiện lên
    WebDriverWait(driver, 15).until(
        EC.visibility_of_element_located((By.CSS_SELECTOR, "h6.oxd-topbar-header-breadcrumb-module"))
    )
    
    # Nhấn nút "Assign Claim"
    button = driver.find_element(By.CSS_SELECTOR, "div.orangehrm-header-container button")
    button.click()
    # Đợi web hiện lên
    WebDriverWait(driver, 15).until(
        EC.visibility_of_element_located((By.CSS_SELECTOR, "h6.oxd-topbar-header-breadcrumb-module"))
    )
    # Nhập tên nhân viên
    employee_name_input = driver.find_element(By.XPATH, "//input[@placeholder='Type for hints...']")
    employee_name_input.send_keys("qqqqqqqqqqqqqqq")
    WebDriverWait(driver, 15).until(
        EC.visibility_of_element_located((By.XPATH, "//*[text()='No Records Found']"))
    )
    # Chọn Event
    comboboxes = driver.find_elements(By.CLASS_NAME, "oxd-select-text.oxd-select-text--active")
    event_combobox = comboboxes[0]
    event_combobox.click()
    driver.find_element(By.XPATH, "//*[text()='Accommodation']").click()
    # Chọn Currency
    currency_combobox = comboboxes[1]
    currency_combobox.click()
    driver.find_element(By.XPATH, "//*[text()='Afghanistan Afghani']").click()
    # Submit
    submit_button = driver.find_element(By.XPATH, "//button[@type='submit']")
    submit_button.click()
    
    
    try:
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, '//span[text()="Invalid"]'))
        )
        assert True

    except TimeoutException:
        assert False