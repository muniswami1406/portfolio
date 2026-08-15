# 📊 How to Save Contact Form Messages to Excel / Google Sheets

This guide will show you how to connect your portfolio contact form so whenever someone submits their details (**Name, Email, Message**), it is automatically saved as a new row in a spreadsheet that you can view in **Microsoft Excel** on your PC.

---

## 🚀 2-Minute Setup (Step-by-Step)

### Step 1: Create a New Google Sheet
1. Open your browser and go to **[sheets.new](https://sheets.new)** (or create a new spreadsheet in your Google Drive).
2. Name the sheet something like: `Portfolio Contact Messages`.

---

### Step 2: Open Apps Script
1. In the top menu of your Google Sheet, click **Extensions** > **Apps Script**.
2. A new tab will open with a code editor.
3. Delete any default code (`function myFunction() { ... }`).

---

### Step 3: Paste the Code
Copy and paste the following code into the editor (or copy from [`google_script.js`](./google_script.js)):

```javascript
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Automatically create header row if empty
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

    var timestamp = Utilities.formatDate(new Date(), "Asia/Kolkata", "yyyy-MM-dd HH:mm:ss");
    var name = data.name || "N/A";
    var email = data.email || "N/A";
    var message = data.message || "N/A";

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
```

---

### Step 4: Deploy as Web App
1. At the top right of the Apps Script window, click the blue **Deploy** button > **New deployment**.
2. Click the gear icon ⚙️ next to "Select type" and choose **Web app**.
3. Fill in the deployment details:
   - **Description**: `Portfolio Contact Form`
   - **Execute as**: `Me (your_email@gmail.com)`
   - **Who has access**: **`Anyone`** *(⚠️ IMPORTANT: Must select "Anyone" so visitors on your site can submit)*
4. Click **Deploy**.
5. If prompted, click **Authorize access**, select your Google account, click **Advanced**, and click **Go to Untitled project (unsafe)** to grant permissions.
6. Copy the **Web App URL** that appears (it looks like `https://script.google.com/macros/s/AKfycbx.../exec`).

---

### Step 5: Add URL to `index.html`
1. Open [`index.html`](./index.html).
2. Find line ~2245 where it says:
   ```javascript
   const SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL';
   ```
3. Replace `'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL'` with your copied Web App URL:
   ```javascript
   const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx.../exec';
   ```
4. Save the file!

---

## 🖥️ How to View & Access in Excel on Your PC

Once someone submits the form, the row is instantly created in the sheet. You can access it on your PC in 2 ways:

### Method 1: Instant Download as Excel (.xlsx)
1. Open your Google Sheet.
2. Click **File** > **Download** > **Microsoft Excel (.xlsx)**.
3. Open the downloaded file directly in Microsoft Excel on your PC.

### Method 2: Automatic Live Sync to Your PC Folder
1. Install **Google Drive for Desktop** on your PC.
2. Your Google Sheet will appear as a file in your Windows File Explorer (`G:\My Drive\Portfolio Contact Messages`).
3. You can double-click it to view all live responses anytime.

---

## 🧪 Testing Your Setup
1. Open [`index.html`](./index.html) in your browser.
2. Scroll to the **Get In Touch** section.
3. Fill in:
   - **Name**: `John Doe`
   - **Email**: `john@example.com`
   - **Message**: `Hello Muniswami, great portfolio!`
4. Click **Send Message**.
5. Check your Google Sheet — you will immediately see a new row with the timestamp, name, email, and message!
