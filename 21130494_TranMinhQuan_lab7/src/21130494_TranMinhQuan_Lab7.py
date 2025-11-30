import pytest
from time import sleep
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
from selenium.common.exceptions import TimeoutException

class BreakLoop(Exception): pass

DOMAIN = r"http://localhost/orangehrm-5.8/orangehrm-5.8"

def gotoURL(driver, path):
    driver.get(DOMAIN + path)

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
    try:
        WebDriverWait(driver, time).until(
            EC.visibility_of_element_located((by, locator))
        )
        return driver.find_elements(by, locator)
    except TimeoutException:
        return []  # trả về mảng rỗng nếu hết thời gian chờ
    
def claimCount(driver):
    rows = wait_and_get_all(driver, By.CSS_SELECTOR, "div.oxd-table-row")
    return len(rows)
    
def expenseCount(driver):
    rows = wait_and_get_all(driver, By.CSS_SELECTOR, ".oxd-table-card")
    return len(rows)
    
def createNewClaimMySelf(driver):
    gotoURL(driver, r"/web/index.php/claim/submitClaim")
    WebDriverWait(driver, 7).until(
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

def getClaimInitiated(driver):
    rows = wait_and_get_all(driver, By.CSS_SELECTOR, "div.oxd-table-card")
    if len(rows) == 0:
        return None
    
    for row in rows:
        cells = row.find_elements(By.CSS_SELECTOR, ".oxd-table-cell")
        for cell in cells:
            if cell.text.strip() == "Initiated":
                return row
    return None

def test_TC_Claim_OK(driver):
    # Chuyển qua trang Claim
    gotoURL(driver, r"/web/index.php/claim/viewAssignClaim")
    previousAddClaimCount = claimCount(driver)
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
    WebDriverWait(driver, 7).until(
        EC.url_contains("/claim/assignClaim/id")
    )
    gotoURL(driver, r"/web/index.php/claim/viewAssignClaim")
    currentClaimCount = claimCount(driver)
    assert currentClaimCount - previousAddClaimCount == 1
    

def test_TC_Claim_EmployeeName_Missing(driver):
    # Chuyển qua trang Claim
    gotoURL(driver, r"/web/index.php/claim/viewAssignClaim")
    previousAddClaimCount = claimCount(driver)
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
    WebDriverWait(driver, 7).until(
        EC.visibility_of_element_located((By.XPATH, '//span[text()="Invalid"]'))
    )
    gotoURL(driver, r"/web/index.php/claim/viewAssignClaim")
    currentClaimCount = claimCount(driver)
    assert currentClaimCount == previousAddClaimCount
    
def test_TC_Claim_Attributes_Missing(driver):
    # Chuyển qua trang Claim
    gotoURL(driver, r"/web/index.php/claim/viewAssignClaim")
    previousAddClaimCount = claimCount(driver)
    # Nhấn nút "Assign Claim" và chuyển sang trang mới
    wait_and_click(driver, By.CSS_SELECTOR, "div.orangehrm-header-container button")
    # Nhập tên nhân viên, sau đó đợi hiện gợi ý employee rồi click
    wait_and_type(driver, By.XPATH, "//input[@placeholder='Type for hints...']", "Ranga")
    wait_and_click(driver, By.XPATH, "//*[text()='Ranga  Akunuri']")
    # Submit
    wait_and_click(driver, By.XPATH, "//button[@type='submit']")
    
    #Kiểm tra điều kiện
    WebDriverWait(driver, 7).until(
        EC.visibility_of_element_located((By.XPATH, '//span[text()="Required"]'))
    )
    gotoURL(driver, r"/web/index.php/claim/viewAssignClaim")
    currentClaimCount = claimCount(driver)
    assert currentClaimCount == previousAddClaimCount
        
def test_TC_Claim_Myself_OK(driver):
    # Chuyển qua trang Claim
    gotoURL(driver, r"/web/index.php/claim/viewAssignClaim")
    wait_and_click(driver, By.XPATH, "//*[text()='My Claims']")
    previousAddClaimCount = claimCount(driver)
    # Nhấn "Submit Claim" và chuyển trang mới
    wait_and_click(driver, By.XPATH, "//*[text()='Submit Claim']")
    WebDriverWait(driver, 7).until(
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
    
    WebDriverWait(driver, 7).until(
        EC.url_contains("/claim/submitClaim/id")
    )
    gotoURL(driver, r"/web/index.php/claim/viewClaim")
    currentClaimCount = claimCount(driver)
    assert currentClaimCount - previousAddClaimCount == 1
    
def test_TC_Claim_Myself_Attributes_Missing(driver):
    # Chuyển qua trang Claim
    gotoURL(driver, r"/web/index.php/claim/viewAssignClaim")
    wait_and_click(driver, By.XPATH, "//*[text()='My Claims']")
    previousAddClaimCount = claimCount(driver)
    # Nhấn "Submit Claim" và chuyển trang mới
    wait_and_click(driver, By.XPATH, "//*[text()='Submit Claim']")
    WebDriverWait(driver, 7).until(
        EC.visibility_of_element_located((By.CSS_SELECTOR, "h6.oxd-topbar-header-breadcrumb-module"))
    )
    # Submit
    wait_and_click(driver, By.XPATH, "//button[@type='submit']")
    #Kiểm tra điều kiện
    WebDriverWait(driver, 7).until(
        EC.visibility_of_element_located((By.XPATH, '//span[text()="Required"]'))
    )
    gotoURL(driver, r"/web/index.php/claim/viewClaim")
    currentClaimCount = claimCount(driver)
    assert currentClaimCount == previousAddClaimCount

def test_TC_Claim_Status_Init2Submitted_OK(driver):
    # Chuyển qua trang Claim
    gotoURL(driver, r"/web/index.php/claim/viewClaim")
    claim_initiated = getClaimInitiated(driver)
    if claim_initiated is None:
        createNewClaimMySelf(driver)
        gotoURL(driver, r"/web/index.php/claim/viewClaim")
        claim_initiated = getClaimInitiated(driver)
    claim_initiated.find_element(By.XPATH, ".//button[contains(., 'View Details')]").click()
    
    wait_and_click(driver, By.XPATH, ".//button[contains(., 'Submit')]")
    driver.refresh()
    WebDriverWait(driver, 7).until(
        EC.visibility_of_element_located((By.CSS_SELECTOR, "h6.oxd-topbar-header-breadcrumb-module"))
    )
    
def test_TC_Claim_Status_Init2Cancelled_OK(driver):
    # Chuyển qua trang Claim
    gotoURL(driver, r"/web/index.php/claim/viewClaim")
    claim_initiated = getClaimInitiated(driver)
    if claim_initiated is None:
        createNewClaimMySelf(driver)
        gotoURL(driver, r"/web/index.php/claim/viewClaim")
        claim_initiated = getClaimInitiated(driver)
    claim_initiated.find_element(By.XPATH, ".//button[contains(., 'View Details')]").click()
    
    wait_and_click(driver, By.XPATH, ".//button[contains(., 'Cancel')]")
    driver.refresh()
    WebDriverWait(driver, 7).until(
        EC.visibility_of_element_located((By.CSS_SELECTOR, "h6.oxd-topbar-header-breadcrumb-module"))
    )
    

def test_TC_Claim_AddExpense_OK(driver):
    # Chuyển qua trang Claim
    gotoURL(driver, r"/web/index.php/claim/viewAssignClaim")
    claim_initiated = getClaimInitiated(driver)
    if claim_initiated is None:
        createNewClaimMySelf(driver)
        gotoURL(driver, r"/web/index.php/claim/viewAssignClaim")
        claim_initiated = getClaimInitiated(driver)
    claim_initiated.find_element(By.XPATH, ".//button[contains(., 'View Details')]").click()
    
    previousExpenseCount = expenseCount(driver)
    expense_button = wait_and_get_all(driver, By.CSS_SELECTOR, "button.oxd-button")[0]
    expense_button.click()
    expense_form = wait_and_get_all(driver, By.TAG_NAME, "form")[1]
    wait_and_click(expense_form, By.CSS_SELECTOR, ".oxd-select-text.oxd-select-text--active")
    wait_and_click(expense_form, By.XPATH, ".//*[text()='Accommodation']")
    inputs = wait_and_get_all(expense_form, By.CSS_SELECTOR, "input.oxd-input")
    date_input = inputs[0]
    date_input.send_keys("2025-11-10")
    amount_input = inputs[1]
    amount_input.send_keys("1000")
    wait_and_click(expense_form, By.XPATH, ".//button[@type='submit']")
    
    #Kiểm tra điều kiện
    driver.refresh()
    currentExpenseCount = expenseCount(driver)
    assert currentExpenseCount - previousExpenseCount == 1
    
    
def test_TC_Claim_AddExpense_Missing_Attributes(driver):
    # Chuyển qua trang Claim
    gotoURL(driver, r"/web/index.php/claim/viewAssignClaim")
    claim_initiated = getClaimInitiated(driver)
    if claim_initiated is None:
        createNewClaimMySelf(driver)
        gotoURL(driver, r"/web/index.php/claim/viewAssignClaim")
        claim_initiated = getClaimInitiated(driver)
    claim_initiated.find_element(By.XPATH, ".//button[contains(., 'View Details')]").click()
    
    previousExpenseCount = expenseCount(driver)
    expense_button = wait_and_get_all(driver, By.CSS_SELECTOR, "button.oxd-button")[0]
    expense_button.click()
    expense_form = wait_and_get_all(driver, By.TAG_NAME, "form")[1]
    wait_and_click(expense_form, By.XPATH, ".//button[@type='submit']")
    messages = wait_and_get_all(expense_form, By.XPATH, ".//*[text()='Required']")
    assert len(messages) == 3
    
    #Kiểm tra điều kiện
    driver.refresh()
    currentExpenseCount = expenseCount(driver)
    assert currentExpenseCount == previousExpenseCount
    
def test_TC_Claim_AddExpense_Money_Wrong_Input(driver):
    # Chuyển qua trang Claim
    gotoURL(driver, r"/web/index.php/claim/viewAssignClaim")
    claim_initiated = getClaimInitiated(driver)
    if claim_initiated is None:
        createNewClaimMySelf(driver)
        gotoURL(driver, r"/web/index.php/claim/viewAssignClaim")
        claim_initiated = getClaimInitiated(driver)
    claim_initiated.find_element(By.XPATH, ".//button[contains(., 'View Details')]").click()
    
    previousExpenseCount = expenseCount(driver)
    expense_button = wait_and_get_all(driver, By.CSS_SELECTOR, "button.oxd-button")[0]
    expense_button.click()
    expense_form = wait_and_get_all(driver, By.TAG_NAME, "form")[1]
    wait_and_click(expense_form, By.CSS_SELECTOR, ".oxd-select-text.oxd-select-text--active")
    wait_and_click(expense_form, By.XPATH, ".//*[text()='Accommodation']")
    inputs = wait_and_get_all(expense_form, By.CSS_SELECTOR, "input.oxd-input")
    date_input = inputs[0]
    date_input.send_keys("2025-11-10")
    amount_input = inputs[1]
    amount_input.send_keys("Test Test")
    wait_and_click(expense_form, By.XPATH, ".//button[@type='submit']")
    messages = wait_and_get_all(expense_form, By.XPATH, ".//*[text()='Should be a valid number (xxx.xx)']")
    assert len(messages) == 1
    amount_input.send_keys(Keys.CONTROL, "a")
    amount_input.send_keys(Keys.DELETE)
    amount_input.send_keys("-1111")
    wait_and_click(expense_form, By.XPATH, ".//button[@type='submit']")
    messages = wait_and_get_all(expense_form, By.XPATH, ".//*[text()='Should be a valid number (xxx.xx)']")
    assert len(messages) == 1
    amount_input.send_keys(Keys.CONTROL, "a")
    amount_input.send_keys(Keys.DELETE)
    amount_input.send_keys("987654321987654321")
    wait_and_click(expense_form, By.XPATH, ".//button[@type='submit']")
    messages = wait_and_get_all(expense_form, By.XPATH, ".//*[text()='Should be less than 10,000,000,000']")
    assert len(messages) == 1
    
    
    #Kiểm tra điều kiện
    driver.refresh()
    currentExpenseCount = expenseCount(driver)
    assert currentExpenseCount == previousExpenseCount

def test_TC_Claim_AddExpense_Date_Wrong_Input(driver):
    # Chuyển qua trang Claim
    gotoURL(driver, r"/web/index.php/claim/viewAssignClaim")
    claim_initiated = getClaimInitiated(driver)
    if claim_initiated is None:
        createNewClaimMySelf(driver)
        gotoURL(driver, r"/web/index.php/claim/viewAssignClaim")
        claim_initiated = getClaimInitiated(driver)
    claim_initiated.find_element(By.XPATH, ".//button[contains(., 'View Details')]").click()
    
    previousExpenseCount = expenseCount(driver)
    expense_button = wait_and_get_all(driver, By.CSS_SELECTOR, "button.oxd-button")[0]
    expense_button.click()
    expense_form = wait_and_get_all(driver, By.TAG_NAME, "form")[1]
    wait_and_click(expense_form, By.CSS_SELECTOR, ".oxd-select-text.oxd-select-text--active")
    wait_and_click(expense_form, By.XPATH, ".//*[text()='Accommodation']")
    inputs = wait_and_get_all(expense_form, By.CSS_SELECTOR, "input.oxd-input")
    amount_input = inputs[1]
    amount_input.send_keys("1000")
    
    date_input = inputs[0]
    date_input.send_keys("abcdef")
    wait_and_click(expense_form, By.XPATH, ".//button[@type='submit']")
    messages = wait_and_get_all(expense_form, By.XPATH, ".//*[text()='Should be a valid date in yyyy-mm-dd format']")
    assert len(messages) == 1
    date_input.send_keys(Keys.CONTROL, "a")
    date_input.send_keys(Keys.DELETE)
    date_input.send_keys("10000-05-16")
    wait_and_click(expense_form, By.XPATH, ".//button[@type='submit']")
    messages = wait_and_get_all(expense_form, By.XPATH, ".//*[text()='Should be a valid date in yyyy-mm-dd format']")
    assert len(messages) == 1
    date_input.send_keys(Keys.CONTROL, "a")
    date_input.send_keys(Keys.DELETE)
    date_input.send_keys("2025-13-16")
    wait_and_click(expense_form, By.XPATH, ".//button[@type='submit']")
    messages = wait_and_get_all(expense_form, By.XPATH, ".//*[text()='Should be a valid date in yyyy-mm-dd format']")
    assert len(messages) == 1
    date_input.send_keys(Keys.CONTROL, "a")
    date_input.send_keys(Keys.DELETE)
    date_input.send_keys("2025-02-31")
    wait_and_click(expense_form, By.XPATH, ".//button[@type='submit']")
    messages = wait_and_get_all(expense_form, By.XPATH, ".//*[text()='Should be a valid date in yyyy-mm-dd format']")
    assert len(messages) == 1
    
    #Kiểm tra điều kiện
    driver.refresh()
    currentExpenseCount = expenseCount(driver)
    assert currentExpenseCount == previousExpenseCount
    
def test_TC_Claim_DeleteExpense_OK(driver):
    pass
    