import pytest
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

DOMAIN = r"http://localhost/orangehrm-5.8/orangehrm-5.8"
USERNAME = "admin"
PASSWORD = "Admin123123mmnn@"

def gotoURL(driver, path):
    driver.get(DOMAIN + path)

# Khởi tạo 1 browser duy nhất cho toàn bộ test session
@pytest.fixture(scope="session")
def driver():
    driver = webdriver.Chrome()
    driver.maximize_window()
    yield driver
    driver.quit()

# Chạy script trước mỗi test case
@pytest.fixture(autouse=True)
def beforeEach(driver):
    # Logout trước
    gotoURL(driver, r"/web/index.php/auth/logout")
    
    WebDriverWait(driver, 15).until(
        EC.url_contains("/auth/login")
    )
    
    WebDriverWait(driver, 15).until(
        EC.visibility_of_element_located((By.NAME, "username"))
    )
    
    # Nhập thông tin tài khoản/mật khẩu admin và đăng nhập
    driver.find_element(By.NAME, "username").send_keys(USERNAME)
    driver.find_element(By.NAME, "password").send_keys(PASSWORD)
    driver.find_element(By.CSS_SELECTOR, "button.orangehrm-login-button").click()
    
    # Đợi đến khi có phản hồi
    WebDriverWait(driver, 15).until(
        EC.url_contains("dashboard")
    )
