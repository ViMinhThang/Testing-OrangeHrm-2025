package com.example.OrangeHrmDemo;

import java.util.regex.Pattern;
import java.util.concurrent.TimeUnit;
import org.testng.annotations.*;
import static org.testng.Assert.*;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.Select;
import java.io.File;
import org.apache.commons.io.FileUtils;

public class TestBuzzLikeCommentShare {
  private WebDriver driver;
  private String baseUrl;
  private boolean acceptNextAlert = true;
  private StringBuffer verificationErrors = new StringBuffer();
  private JavascriptExecutor js;

  @BeforeClass(alwaysRun = true)
  public void setUp() throws Exception {
    System.setProperty("webdriver.chrome.driver", "");
    driver = new ChromeDriver();
    baseUrl = "https://www.google.com/";
    driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(30));
    js = (JavascriptExecutor) driver;
  }

  @Test
  public void testBuzzLikeCommentShare() throws Exception {
    driver.get("https://opensource-demo.orangehrmlive.com/web/index.php/buzz/viewBuzz");
    driver.findElement(By.id("heart")).click();
    driver.findElement(By.xpath("//div[@id='app']/div/div[2]/div[2]/div/div/div/div[3]/div/div/div[3]/div/button/i")).click();
    driver.findElement(By.xpath("//div[@id='app']/div/div[2]/div[2]/div/div/div/div[3]/div/div/div[4]/div/form/div/div[2]/input")).clear();
    driver.findElement(By.xpath("//div[@id='app']/div/div[2]/div[2]/div/div/div/div[3]/div/div/div[4]/div/form/div/div[2]/input")).sendKeys("ABC 123");
    driver.findElement(By.cssSelector(".oxd-form")).submit();
    driver.findElement(By.xpath("//div[@id='app']/div/div[2]/div[2]/div/div/div/div[3]/div/div/div[3]/div/button[2]/i")).click();
    driver.findElement(By.xpath("//div[@id='app']/div/div[2]/div[2]/div/div/div[2]/div/div/div/form/div[2]/button")).click();
  }

  @AfterClass(alwaysRun = true)
  public void tearDown() throws Exception {
    driver.quit();
    String verificationErrorString = verificationErrors.toString();
    if (!"".equals(verificationErrorString)) {
      fail(verificationErrorString);
    }
  }

  private boolean isElementPresent(By by) {
    try {
      driver.findElement(by);
      return true;
    } catch (NoSuchElementException e) {
      return false;
    }
  }

  private boolean isAlertPresent() {
    try {
      driver.switchTo().alert();
      return true;
    } catch (NoAlertPresentException e) {
      return false;
    }
  }

  private String closeAlertAndGetItsText() {
    try {
      Alert alert = driver.switchTo().alert();
      String alertText = alert.getText();
      if (acceptNextAlert) {
        alert.accept();
      } else {
        alert.dismiss();
      }
      return alertText;
    } finally {
      acceptNextAlert = true;
    }
  }
}
