import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.testng.Assert;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import java.time.Duration;

/**
 * Automation script for Assignment 7
 * Student: 22130003 - Nguyen Van An
 * Functions:
 *   1. Dashboard - Quick Launch - Assign Leave
 *   2. Buzz - Post a new status
 *
 * How to run (Maven + TestNG suggestion):
 *   - Add Selenium & TestNG dependencies to pom.xml
 *   - Update path to chromedriver if needed (System.setProperty)
 *   - Run with: mvn test
 */
public class OrangeHRM_22130003_NguyenVanAn_Lab7 {

    private WebDriver driver;
    private final String baseUrl = "https://opensource-demo.orangehrmlive.com";

    @BeforeClass
    public void setUp() {
        // TODO: change the path to chromedriver on your machine if you don't use WebDriverManager
        // Example on Mac:
        // System.setProperty("webdriver.chrome.driver", "/Users/yourname/Drivers/chromedriver");
        System.setProperty("webdriver.chrome.driver", "chromedriver");

        driver = new ChromeDriver();
        driver.manage().window().maximize();
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
    }

    @AfterClass
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }

    /**
     * Common login step used by all tests
     */
    private void loginAsAdmin() {
        driver.get(baseUrl + "/web/index.php/auth/login");

        WebElement usernameInput = driver.findElement(By.name("username"));
        WebElement passwordInput = driver.findElement(By.name("password"));
        WebElement loginButton = driver.findElement(By.cssSelector("button[type='submit']"));

        usernameInput.clear();
        usernameInput.sendKeys("Admin");

        passwordInput.clear();
        passwordInput.sendKeys("admin123");

        loginButton.click();

        // Verify Dashboard is displayed
        WebElement dashboardTitle = driver.findElement(By.xpath("//h6[text()='Dashboard']"));
        Assert.assertTrue(dashboardTitle.isDisplayed(), "Dashboard title is not displayed after login.");
    }

    /**
     * Test case 1:
     *  - Login
     *  - From Dashboard Quick Launch click "Assign Leave"
     *  - Verify Assign Leave page is opened
     */
    @Test
    public void TC01_Dashboard_QuickLaunch_AssignLeave() {
        loginAsAdmin();

        // Click Assign Leave in Quick Launch section
        WebElement assignLeaveCard = driver.findElement(
                By.xpath("//p[text()='Assign Leave']/ancestor::button")
        );
        assignLeaveCard.click();

        // Verify Assign Leave page title
        WebElement assignLeaveTitle = driver.findElement(By.xpath("//h6[text()='Assign Leave']"));
        Assert.assertTrue(assignLeaveTitle.isDisplayed(), "Assign Leave page is not displayed.");
        Assert.assertEquals(assignLeaveTitle.getText(), "Assign Leave");
    }

    /**
     * Test case 2:
     *  - Login
     *  - Go to Buzz page
     *  - Post a status
     *  - Verify the status appears in the feed
     */
    @Test
    public void TC02_Buzz_PostStatus() {
        loginAsAdmin();

        // Click Buzz menu
        WebElement buzzMenu = driver.findElement(By.xpath("//span[text()='Buzz']"));
        buzzMenu.click();

        // Verify Buzz header
        WebElement buzzTitle = driver.findElement(By.xpath("//h6[text()='Buzz']"));
        Assert.assertTrue(buzzTitle.isDisplayed(), "Buzz page is not displayed.");

        // Post a new status
        String statusText = "Automation post by 22130003_NguyenVanAn";

        WebElement textarea = driver.findElement(
                By.xpath("//textarea[@placeholder=\"What's on your mind?\"]")
        );
        textarea.clear();
        textarea.sendKeys(statusText);

        WebElement postButton = driver.findElement(
                By.xpath("//button[@type='submit']//span[text()='Post']/..")
        );
        postButton.click();

        // Verify the new post appears in the feed (usually at the top)
        WebElement newPost = driver.findElement(
                By.xpath("//p[contains(.,'" + "Automation post by 22130003_NguyenVanAn" + "')]")
        );
        Assert.assertTrue(newPost.isDisplayed(), "Newly created Buzz post was not found in the feed.");
    }
}
