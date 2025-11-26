// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";
import { slowCypressDown } from "cypress-slow-down";

slowCypressDown(200);
// Bỏ qua lỗi AxiosError: Request aborted từ phía ứng dụng
Cypress.on("uncaught:exception", (err, runnable) => {
  // Nếu thông báo lỗi có chứa từ khóa này
  if (
    err.message.includes("Request aborted") ||
    err.message.includes("AxiosError")
  ) {
    // Return false để Cypress không fail test case
    return false;
  }
  // Các lỗi khác vẫn báo fail bình thường
});
