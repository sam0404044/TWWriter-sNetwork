///////////////////////////淡入///////////////////////////////
document.addEventListener("DOMContentLoaded", () => {
  const fadeElements = document.querySelectorAll(".fade-in"); // **只選取有 fade-in 的元素**

  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show"); // **進入視口時觸發動畫**
          observer.unobserve(entry.target); // **動畫執行後停止監聽**
        }
      });
    },
    { threshold: 0.2 }
  ); // 進入視口 10% 觸發

  fadeElements.forEach((el) => observer.observe(el)); // **監聽所有 .fade-in 元素**
});

///////////////////////////////扭蛋抽卡//////////////////////////////////////////////
document.addEventListener("DOMContentLoaded", function () {
  const startButton = document.getElementById("startButton");
  if (startButton) {
    startButton.addEventListener("click", function () {
      // 隱藏 gatchaTextcontanier
      console.log("按鈕正常運作");
      document.querySelector(".gatchaTextcontanier").style.display = "none";
      // 顯示光芒卡片
      document.querySelector(".shiningCardContainerFlex").style.display =
        "flex";
    });
  } else {
    console.error("❌ startButton 找不到，請檢查 HTML 是否正確！");
  }
});

/////////////////////////////////EMAIL///////////////////////////////////////////////
document.addEventListener("DOMContentLoaded", function () {
  document.addEventListener("click", function (event) {
    if (event.target.classList.contains("email-icon")) {
      showEmail(event);
    }
  });
});

function showEmail(event) {
  var card = event.target.closest(".profile-card");
  if (!card) return;

  var emailDiv = card.querySelector(".email-display");

  if (!emailDiv) {
    console.error("❌ 找不到 .email-display，請檢查 HTML");
    return;
  }

  // 🔹 檢查是否已經顯示「📋 已複製」，如果是就不再處理
  if (emailDiv.textContent.includes("📋 已複製")) {
    return;
  }

  if (emailDiv.style.display === "none" || emailDiv.style.display === "") {
    emailDiv.style.display = "block";

    // 🔹 複製 Email 到剪貼簿
    const originalEmail = emailDiv.textContent;
    navigator.clipboard.writeText(originalEmail).then(() => {
      emailDiv.textContent = "📋 已複製：" + originalEmail;

      // 🔹 1.5 秒後恢復原 Email，防止堆疊顯示
      setTimeout(() => {
        emailDiv.textContent = originalEmail;
      }, 1500);
    });

    document.addEventListener("click", hideEmail);
  } else {
    hideEmail();
  }

  event.stopPropagation();
}

function hideEmail() {
  document.querySelectorAll(".email-display").forEach((emailDiv) => {
    emailDiv.style.display = "none";
  });
  document.removeEventListener("click", hideEmail);
}
///////////////////////fetch GOOGLE表單//////////////////////////////////
const SHEET_ID = "1jmobYLqOmMz_uXgXR_SfuB0lwT4wezoh9SOn6Wt9Ma4";
const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;

// 🔹 用來存放 Google Sheets 資料的全域變數
let columns = [];
let rows = [];

// 🔹 非同步函式來抓取 Google Sheets 資料
async function fetchSheetData() {
  try {
    const response = await fetch(url);
    const text = await response.text();

    // Google Sheets 回傳的是 JSONP，需要手動清理
    const json = JSON.parse(text.substring(47).slice(0, -2));

    // 取得標題（欄位名稱）
    columns = json.table.cols.map((col) => col.label);

    // 取得資料
    rows = json.table.rows.map((row) =>
      row.c.map((cell) => (cell ? cell.v : ""))
    );

    console.log("✅ Google Sheets 解析完成！");
    console.log("欄位名稱:", columns);
    console.log("資料:", rows);
  } catch (error) {
    console.error("❌ 發生錯誤:", error);
  }
}
// 🔹 主程式：等 `fetchSheetData()` 執行完再繼續
async function main() {
  await fetchSheetData(); // 確保資料載入完畢
  console.log("🚀 程式繼續執行...");

  // 🔹 這裡可以安全使用 `rows` 和 `columns`
  console.log("第一筆資料:", rows[0]); // 確保資料已載入
  const gridContainer = document.getElementById("gridContainer");
  // 你可以替換這個資料，或用 fetch 來讀取 Google Sheets 資料
  const personData = {
    name: rows?.[0]?.[1] || "未提供姓名",
    photo: "img/photo/寺尾.jpg",
    email: "person@example.com",
    description:
      "這裡是人物的簡介，可以放入相關背景、成就、興趣等資訊。這張卡片的設計讓圖片、名稱和介紹清晰分區，視覺更有層次感。",
  };
  // 使用 `for` 迴圈來產生卡片
  for (let i = 0; i < rows.length; i++) {
    let name = rows[i][1]; // 第 i 行，第 1 列是名字
    let photo = `./img/photo/${i}.jpg`; // 第 i 行，第 5 列是照片
    let email = rows[i][2]; // 第 i 行，第 2 列是 Email
    let description = rows[i][3]; // 第 i 行，第 3 列是簡介

    // 建立卡片 HTML
    const cardHTML = `
        <div class="profile-card">
          <div class="card-header">
            <img src="${photo}" alt="${name}" class="profile-img" />
            <h2 class="profile-name">${name}</h2>
          </div>
    
          <!-- Email 按鈕 -->
          <span class="email-icon" onclick="showEmail()">📧</span>
    
          <!-- Email 顯示區 -->
          <div class="email-display">${email}</div>
    
          <div class="card-body">
            <p class="profile-description">${description}</p>
          </div>
        </div>
    `;

    ////隨機打亂////
    // card.style.order = Math.floor(Math.random() * people.length);
    // 插入 grid-container
    gridContainer.innerHTML += cardHTML;
  }
}
// 🔹 執行主程式
main();

///////////////////////////產生人物圖卡///////////////////////////////////
// document.addEventListener("DOMContentLoaded", () => {

// });
