import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
from selenium.common.exceptions import TimeoutException

class BreakLoop(Exception): pass

def wait_and_click(driver, by, locator, time=7):
    WebDriverWait(driver, time).until(
        EC.visibility_of_element_located((by, locator))
    )
    driver.find_element(by, locator).click()
    
def wait_and_type(driver, by, locator, text, time=7):
    WebDriverWait(driver, time).until(
        EC.visibility_of_element_located((by, locator))
    )
    driver.find_element(by, locator).send_keys(text)
def wait_and_get_all(driver, by, locator, time=7):
    WebDriverWait(driver, time).until(
        EC.visibility_of_element_located((by, locator))
    )
    return driver.find_elements(by,locator)

def test_TC_Claim_OK(driver):
    # Chuyển qua trang Claim
    driver.get("https://opensource-demo.orangehrmlive.com/web/index.php/claim/viewAssignClaim")
    # Nhấn nút "Assign Claim" và chuyển sang trang mới
    wait_and_click(driver, By.CSS_SELECTOR, "div.orangehrm-header-container button")
    # Nhập tên nhân viên, sau đó đợi hiện gợi ý employee rồi click
    wait_and_type(driver, By.XPATH, "//input[@placeholder='Type for hints...']", "Ranga")
    wait_and_click(driver, By.XPATH, "//*[text()='Ranga  Akunuri']")
    #Chọn Event
    comboboxes = driver.find_elements(By.CSS_SELECTOR, ".oxd-select-text.oxd-select-text--active")
    event_combobox = comboboxes[0]
    event_combobox.click()
    wait_and_click(driver, By.XPATH, "//*[text()='Accommodation']")
    # Chọn Currency
    currency_combobox = comboboxes[1]
    currency_combobox.click()
    wait_and_click(driver, By.XPATH, "//*[text()='Afghanistan Afghani']")
    # Submit
    wait_and_click(driver, By.XPATH, "//button[@type='submit']")
    # Kiểm tra điều kiện
    WebDriverWait(driver, 10).until(
        EC.url_contains("/claim/assignClaim/id")
    )
    print("TC_Claim_OK: Passed")

def test_TC_Claim_EmployeeName_Missing(driver):
    # Chuyển qua trang Claim
    driver.get("https://opensource-demo.orangehrmlive.com/web/index.php/claim/viewAssignClaim")
    # Nhấn nút "Assign Claim" và chuyển sang trang mới
    wait_and_click(driver, By.CSS_SELECTOR, "div.orangehrm-header-container button")
    # Nhập tên nhân viên, sau đó đợi hiện gợi ý employee rồi click
    wait_and_type(driver, By.XPATH, "//input[@placeholder='Type for hints...']", "qqqqqqqqqqqqqqq")
    wait_and_click(driver, By.XPATH, "//*[text()='No Records Found']")
    #Chọn Event
    comboboxes = driver.find_elements(By.CSS_SELECTOR, ".oxd-select-text.oxd-select-text--active")
    event_combobox = comboboxes[0]
    event_combobox.click()
    wait_and_click(driver, By.XPATH, "//*[text()='Accommodation']")
    # Chọn Currency
    currency_combobox = comboboxes[1]
    currency_combobox.click()
    wait_and_click(driver, By.XPATH, "//*[text()='Afghanistan Afghani']")
    # Submit
    wait_and_click(driver, By.XPATH, "//button[@type='submit']")
    # Kiểm tra điều kiện
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.XPATH, '//span[text()="Invalid"]'))
    )
    print("TC_Claim_EmployeeName_Missing: Passed")
    
def test_TC_Claim_Attributes_Missing(driver):
    # Chuyển qua trang Claim
    driver.get("https://opensource-demo.orangehrmlive.com/web/index.php/claim/viewAssignClaim")
    # Nhấn nút "Assign Claim" và chuyển sang trang mới
    wait_and_click(driver, By.CSS_SELECTOR, "div.orangehrm-header-container button")
    # Nhập tên nhân viên, sau đó đợi hiện gợi ý employee rồi click
    wait_and_type(driver, By.XPATH, "//input[@placeholder='Type for hints...']", "Ranga")
    wait_and_click(driver, By.XPATH, "//*[text()='Ranga  Akunuri']")
    # Submit
    wait_and_click(driver, By.XPATH, "//button[@type='submit']")
    #Kiểm tra điều kiện
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.XPATH, '//span[text()="Required"]'))
    )
    print("TC_Claim_Attributes_Missing: Passed")
        
def test_TC_Claim_Myself_OK(driver):
    # Chuyển qua trang Claim
    driver.get("https://opensource-demo.orangehrmlive.com/web/index.php/claim/viewAssignClaim")
    wait_and_click(driver, By.XPATH, "//*[text()='My Claims']")
    wait_and_click(driver, By.XPATH, "//*[text()='Submit Claim']")
    # Đợi web hiện lên
    WebDriverWait(driver, 15).until(
        EC.visibility_of_element_located((By.CSS_SELECTOR, "h6.oxd-topbar-header-breadcrumb-module"))
    )
    #Chọn Event
    comboboxes = driver.find_elements(By.CSS_SELECTOR, ".oxd-select-text.oxd-select-text--active")
    event_combobox = comboboxes[0]
    event_combobox.click()
    wait_and_click(driver, By.XPATH, "//*[text()='Accommodation']")
    # Chọn Currency
    currency_combobox = comboboxes[1]
    currency_combobox.click()
    wait_and_click(driver, By.XPATH, "//*[text()='Afghanistan Afghani']")
    # Submit
    wait_and_click(driver, By.XPATH, "//button[@type='submit']")
    
    WebDriverWait(driver, 10).until(
        EC.url_contains("/claim/submitClaim/id")
    )
    print("TC_Claim_Myself_OK: Passed")
    
def test_TC_Claim_Myself_Attributes_Missing(driver):
    # Chuyển qua trang Claim
    driver.get("https://opensource-demo.orangehrmlive.com/web/index.php/claim/viewAssignClaim")
    wait_and_click(driver, By.XPATH, "//*[text()='My Claims']")
    wait_and_click(driver, By.XPATH, "//*[text()='Submit Claim']")
    # Đợi web hiện lên
    WebDriverWait(driver, 15).until(
        EC.visibility_of_element_located((By.CSS_SELECTOR, "h6.oxd-topbar-header-breadcrumb-module"))
    )
    # Submit
    wait_and_click(driver, By.XPATH, "//button[@type='submit']")
    #Kiểm tra điều kiện
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.XPATH, '//span[text()="Required"]'))
    )
    print("TC_Claim_Myself_Attributes_Missing: Passed")

def test_TC_Claim_AddExpense_OK(driver):
    # Chuyển qua trang Claim
    driver.get("https://opensource-demo.orangehrmlive.com/web/index.php/claim/viewAssignClaim")
    rows = wait_and_get_all(By.CSS_SELECTOR, "div.oxd-table-row")
    
    try:
        for row in rows:
            cells = row.find_elements(By.CSS_SELECTOR, ".oxd-table-cell")
            for cell in cells:
                if cell.text.strip() == "Initiated":
                    row.find_element(By.XPATH, ".//button[contains(., 'View Details')]").click()
                    raise BreakLoop
    except BreakLoop:
        pass
        
def test_TC_Claim_AddExpense_Missing_Attributes(driver):
    # Chuyển qua trang Claim
    driver.get("https://opensource-demo.orangehrmlive.com/web/index.php/claim/viewAssignClaim")
    # Nhấn nút "Assign Claim" và chuyển sang trang mới
    wait_and_click(driver, By.CSS_SELECTOR, "div.orangehrm-header-container button")
    # Nhập tên nhân viên, sau đó đợi hiện gợi ý employee rồi click
    wait_and_type(driver, By.XPATH, "//input[@placeholder='Type for hints...']", "Ranga")
    wait_and_click(driver, By.XPATH, "//*[text()='Ranga  Akunuri']")
    #Chọn Event
    comboboxes = driver.find_elements(By.CSS_SELECTOR, ".oxd-select-text.oxd-select-text--active")
    event_combobox = comboboxes[0]
    event_combobox.click()
    wait_and_click(driver, By.XPATH, "//*[text()='Accommodation']")
    # Chọn Currency
    currency_combobox = comboboxes[1]
    currency_combobox.click()
    wait_and_click(driver, By.XPATH, "//*[text()='Afghanistan Afghani']")
    # Submit
    wait_and_click(driver, By.XPATH, "//button[@type='submit']")
    # Kiểm tra điều kiện
    WebDriverWait(driver, 10).until(
        EC.url_contains("/claim/assignClaim/id")
    )
    
def test_TC_Claim_AddExpense_Money_Wrong_Input(driver):
    # Chuyển qua trang Claim
    driver.get("https://opensource-demo.orangehrmlive.com/web/index.php/claim/viewAssignClaim")
    # Nhấn nút "Assign Claim" và chuyển sang trang mới
    wait_and_click(driver, By.CSS_SELECTOR, "div.orangehrm-header-container button")
    # Nhập tên nhân viên, sau đó đợi hiện gợi ý employee rồi click
    wait_and_type(driver, By.XPATH, "//input[@placeholder='Type for hints...']", "Ranga")
    wait_and_click(driver, By.XPATH, "//*[text()='Ranga  Akunuri']")
    #Chọn Event
    comboboxes = driver.find_elements(By.CSS_SELECTOR, ".oxd-select-text.oxd-select-text--active")
    event_combobox = comboboxes[0]
    event_combobox.click()
    wait_and_click(driver, By.XPATH, "//*[text()='Accommodation']")
    # Chọn Currency
    currency_combobox = comboboxes[1]
    currency_combobox.click()
    wait_and_click(driver, By.XPATH, "//*[text()='Afghanistan Afghani']")
    # Submit
    wait_and_click(driver, By.XPATH, "//button[@type='submit']")
    # Kiểm tra điều kiện
    WebDriverWait(driver, 10).until(
        EC.url_contains("/claim/assignClaim/id")
    )
    
def test_TC_Claim_DeleteExpense_OK(driver):
    # Chuyển qua trang Claim
    driver.get("https://opensource-demo.orangehrmlive.com/web/index.php/claim/viewAssignClaim")
    # Nhấn nút "Assign Claim" và chuyển sang trang mới
    wait_and_click(driver, By.CSS_SELECTOR, "div.orangehrm-header-container button")
    # Nhập tên nhân viên, sau đó đợi hiện gợi ý employee rồi click
    wait_and_type(driver, By.XPATH, "//input[@placeholder='Type for hints...']", "Ranga")
    wait_and_click(driver, By.XPATH, "//*[text()='Ranga  Akunuri']")
    #Chọn Event
    comboboxes = driver.find_elements(By.CSS_SELECTOR, ".oxd-select-text.oxd-select-text--active")
    event_combobox = comboboxes[0]
    event_combobox.click()
    wait_and_click(driver, By.XPATH, "//*[text()='Accommodation']")
    # Chọn Currency
    currency_combobox = comboboxes[1]
    currency_combobox.click()
    wait_and_click(driver, By.XPATH, "//*[text()='Afghanistan Afghani']")
    # Submit
    wait_and_click(driver, By.XPATH, "//button[@type='submit']")
    # Kiểm tra điều kiện
    WebDriverWait(driver, 10).until(
        EC.url_contains("/claim/assignClaim/id")
    )
    