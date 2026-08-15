/**
 * Google Apps Script to save Portfolio Contact Form submissions into Google Sheets
 * 
 * Instructions:
 * 1. Open Google Sheets (https://sheets.new)
 * 2. Click Extensions > Apps Script
 * 3. Delete existing code and paste this entire code
 * 4. Click Deploy > New deployment
 * 5. Select type: "Web app"
 * 6. Description: "Portfolio Contact Form"
 * 7. Execute as: "Me"
 * 8. Who has access: "Anyone" (VERY IMPORTANT!)
 * 9. Click "Deploy", authorize access, and copy the Web App URL!
 * 10. Paste the URL into index.html at SCRIPT_URL
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000); // Prevent concurrent write collisions

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // If the sheet is empty, create headers automatically
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Timestamp", "Name", "Email", "Message"]);
      sheet.getRange(1, 1, 1, 4)
           .setFontWeight("bold")
           .setBackground("#6c5ce7")
           .setFontColor("#ffffff");
    }

    var data = {};
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    } else if (e.parameter) {
      data = e.parameter;
    }

    // Format current date and time (IST)
    var timestamp = Utilities.formatDate(new Date(), "Asia/Kolkata", "yyyy-MM-dd HH:mm:ss");
    var name = data.name || "N/A";
    var email = data.email || "N/A";
    var message = data.message || "N/A";

    // Append new row with details
    sheet.appendRow([timestamp, name, email, message]);

    return ContentService
      .createTextOutput(JSON.stringify({ "status": "success", "message": "Message saved successfully" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ "status": "error", "message": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput("The Portfolio Contact Form Webhook is active and running!")
    .setMimeType(ContentService.MimeType.TEXT);
}
