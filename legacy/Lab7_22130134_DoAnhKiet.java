import io.github.bonigarcia.wdm.WebDriverManager;
import org.junit.jupiter.api.*;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.List;

public class Lab7_22130134_DoAnhKiet {

    private WebDriver driver;
    private WebDriverWait wait;

    private static final String VACANCY_NAME = "Payroll Administrator";

    // ====== HÀM TIỆN ÍCH CHỜ ======
    private void pause(long ms) {
        try {
            Thread.sleep(ms);
        } catch (InterruptedException ignored) {
        }
    }

    // ====== SETUP DRIVER 1 LẦN ======
    @BeforeAll
    public static void setupDriverBinary() {
        WebDriverManager.chromedriver().setup();
    }

    // ====== LUÔN ĐÓNG BROWSER SAU MỖI TEST ======
    @AfterEach
    public void tearDown() {
        if (driver != null) {
            driver.quit();
            driver = null;
        }
    }

    // ====== HÀM LOGIN CHUNG (GỌI TRONG TỪNG TEST) ======
    private void openBrowserAndLogin() {
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--user-data-dir=C:/temp/chrome-selenium-profile");
        options.addArguments("--remote-allow-origins=*");

        driver = new ChromeDriver(options);
        driver.manage().window().maximize();
        wait = new WebDriverWait(driver, Duration.ofSeconds(15));

        // Mở trang login
        driver.get("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login");

        // Đợi logo
        wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.cssSelector("img[alt='company-branding']")));

        // Đăng nhập
        WebElement username = wait.until(
                ExpectedConditions.visibilityOfElementLocated(By.cssSelector("input[name='username']")));
        WebElement password = driver.findElement(By.cssSelector("input[name='password']"));

        username.sendKeys("Admin");
        password.sendKeys("admin123");
        driver.findElement(By.cssSelector("button[type='submit']")).click();

        // Đợi Dashboard
        wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.xpath("//h6[text()='Dashboard']")));
    }

    // ====== Helper: vào Recruitment > Candidates ======
    private void goToRecruitmentCandidates() {
        WebElement recruitmentMenu = wait.until(
                ExpectedConditions.elementToBeClickable(
                        By.xpath("//span[text()='Recruitment']")));
        recruitmentMenu.click();

        wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.xpath("//h5[text()='Candidates']")));
    }

    // =================================================================
    // TC_ADD_01: Add Candidate (Positive)
    // =================================================================
    @Test
    public void TC_ADD_01_AddCandidateSuccess() {

        openBrowserAndLogin();         // mở browser + login
        goToRecruitmentCandidates();   // vào Recruitment > Candidates
        pause(1200);

        String firstName = "John";
        String middleName = "A";
        String lastName = "Smith";
        String email = "a@gmail.com";

        // 1. Click + Add
        WebElement addBtn = wait.until(
                ExpectedConditions.elementToBeClickable(
                        By.xpath("//button[contains(normalize-space(.),'Add')]")
                ));
        ((JavascriptExecutor) driver).executeScript(
                "arguments[0].scrollIntoView({block:'center'});", addBtn);
        pause(800);
        addBtn.click();

        // 2. Chờ form Add Candidate
        wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.xpath("//h6[text()='Add Candidate']")));
        pause(800);

        // 3. Nhập Full Name
        WebElement firstNameInput = wait.until(
                ExpectedConditions.visibilityOfElementLocated(By.name("firstName")));
        WebElement middleNameInput = driver.findElement(By.name("middleName"));
        WebElement lastNameInput = driver.findElement(By.name("lastName"));

        firstNameInput.sendKeys(firstName);
        middleNameInput.sendKeys(middleName);
        lastNameInput.sendKeys(lastName);
        pause(800);

        // 4. Chọn Vacancy = Payroll Administrator
        WebElement vacancyDropdown = driver.findElement(
                By.xpath("//label[text()='Vacancy']/parent::div/following-sibling::div//div[contains(@class,'oxd-select-text')]"));
        vacancyDropdown.click();

        WebElement vacancyOption = wait.until(
                ExpectedConditions.elementToBeClickable(
                        By.xpath("//div[@role='listbox']//div[@role='option' and normalize-space()='" + VACANCY_NAME + "']")));
        vacancyOption.click();
        pause(600);

        // 5. Nhập Email theo label Email
        WebElement emailInput = driver.findElement(
                By.xpath("//label[contains(normalize-space(),'Email')]/parent::div/following-sibling::div//input")
        );
        emailInput.sendKeys(email);
        pause(800);

        // 6. Click Save
        WebElement saveBtn = driver.findElement(
                By.xpath("//button[@type='submit' and normalize-space()='Save']"));
        saveBtn.click();

        // 7. Chờ URL chuyển sang trang chi tiết candidate
        wait.until(ExpectedConditions.urlContains("/recruitment/addCandidate/"));

        // 8. Cho em nhìn Application Stage 5 giây
        pause(5000);
        // Không cần quit ở đây. @AfterEach sẽ tự đóng browser.
    }

    // =================================================================
// TC_SEARCH_02: Search Candidates by Vacancy
// =================================================================
    @Test
    public void TC_SEARCH_02_SearchCandidateByVacancy() {

        openBrowserAndLogin();
        goToRecruitmentCandidates();
        pause(1200);

        // 1. Mở dropdown Vacancy
        WebElement vacancyDropdown = wait.until(
                ExpectedConditions.elementToBeClickable(
                        By.xpath("//label[text()='Vacancy']/parent::div/following-sibling::div//div[contains(@class,'oxd-select-text')]")
                ));
        ((JavascriptExecutor) driver).executeScript(
                "arguments[0].scrollIntoView({block:'center'});", vacancyDropdown);
        vacancyDropdown.click();
        pause(500);

        // 2. Chọn đúng VACANCY_NAME
        WebElement vacancyOption = wait.until(
                ExpectedConditions.elementToBeClickable(
                        By.xpath("//div[@role='listbox']//div[@role='option' and normalize-space()='" + VACANCY_NAME + "']")));
        vacancyOption.click();

        wait.until(ExpectedConditions.invisibilityOfElementLocated(
                By.xpath("//div[@role='listbox']")));
        pause(500);

        // 3. Click Search (dùng JS click để khỏi bị chặn)
        WebElement searchBtn = wait.until(
                ExpectedConditions.elementToBeClickable(
                        By.xpath("//button[normalize-space()='Search']")));
        ((JavascriptExecutor) driver).executeScript(
                "arguments[0].scrollIntoView({block:'center'});", searchBtn);
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", searchBtn);

        // 4. Chờ bảng kết quả
        WebElement tableBody = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".oxd-table-body")));

        List<WebElement> rows = tableBody.findElements(By.cssSelector(".oxd-table-card"));
        Assertions.assertFalse(rows.isEmpty(),
                "Không có kết quả nào trả về sau khi search theo Vacancy");

        String tableText = tableBody.getText();
        Assertions.assertTrue(tableText.contains(VACANCY_NAME),
                "Kết quả search không chứa Vacancy mong đợi: " + VACANCY_NAME);

        // 5. Cho xem kết quả 5 giây
        pause(5000);
    }

}
