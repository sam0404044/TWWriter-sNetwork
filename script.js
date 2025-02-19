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
  const retryButton = document.getElementById("retryButton");
  const gridContainer = document.getElementById("gridContainer");

  function getRandomCard() {
    const cards = gridContainer.children;
    if (cards.length === 0)
      return "<div class='profile-card shining'>❌ 沒有可用的卡片</div>";
    const randomIndex = Math.floor(Math.random() * cards.length);
    return `<div class='profile-card shining'>${cards[randomIndex].innerHTML}</div>`;
  }

  if (startButton) {
    startButton.addEventListener("click", function () {
      console.log("按鈕正常運作");
      document.querySelector(".gatchaTextcontanier").style.display = "none";

      let cardContainer = document.querySelector(".shiningCardContainerFlex");
      cardContainer.innerHTML = `
          <div id="selectedCardContainer">
            ${getRandomCard()}
          </div>
          <div><button id="retryButton">再抽一次</button></div>
        `;
      cardContainer.style.display = "flex";

      document
        .getElementById("retryButton")
        .addEventListener("click", function () {
          console.log("再抽一次");
          document.getElementById("selectedCardContainer").innerHTML =
            getRandomCard();
        });
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
/////////////////////////////////卡片相關///////////////////////////////////////////
async function main() {
  await fetchSheetData(); // 先抓取 Google Sheets 資料
  console.log("🚀 資料載入完成...");

  // 取得主要卡片容器
  const gridContainer = document.getElementById("gridContainer");

  // 取得各區域的展示容器 (請確保 HTML 中有這些 id)
  const section3gridContainerNorth = document.getElementById(
    "section3gridContainerNorth"
  );
  const section3gridContainerCentral = document.getElementById(
    "section3gridContainerCentral"
  );
  const section3gridContainerSouth = document.getElementById(
    "section3gridContainerSouth"
  );
  const section3gridContainerEast = document.getElementById(
    "section3gridContainerEast"
  );

  // 用來累積所有卡片以及各區域卡片的 HTML
  let cardHTML = "";
  let cardHTMLNorth = "";
  let cardHTMLCentral = "";
  let cardHTMLSouth = "";
  let cardHTMLEast = "";

  for (let i = 0; i < rows.length; i++) {
    let name = rows[i][1] || "未提供姓名";
    let photo = `./img/photo/${i}.jpg`;
    let email = rows[i][2] || "未提供 Email";
    let description = rows[i][3] || "沒有提供簡介";
    let location = rows[i][4] != null ? rows[i][4].toString() : "";

    // 單筆卡片 HTML
    let thisCardHTML = `
        <div class="profile-card grid-item">
          <div class="card-header">
            <img src="${photo}" alt="${name}" class="profile-img" />
            <h2 class="profile-name">${name}</h2>
          </div>
          <!-- Email 按鈕 -->
          <span class="email-icon" onclick="showEmail(event)">📧</span>
          <!-- Email 顯示區 -->
          <div class="email-display">${email}</div>
          <div class="card-body">
            <p class="profile-description">${description}</p>
          </div>
        </div>
      `;

    // 累積所有卡片
    cardHTML += thisCardHTML;

    // 根據 location 判斷累積卡片
    if (location.includes("北部")) {
      cardHTMLNorth += thisCardHTML;
      console.log("北部卡片已產生：", name);
    }
    if (location.includes("中部")) {
      cardHTMLCentral += thisCardHTML;
      console.log("中部卡片已產生：", name);
    }
    if (location.includes("南部")) {
      cardHTMLSouth += thisCardHTML;
      console.log("南部卡片已產生：", name);
    }
    if (location.includes("東部")) {
      cardHTMLEast += thisCardHTML;
      console.log("東部卡片已產生：", name);
    }
  }

  // 將所有卡片插入到主要容器中
  gridContainer.innerHTML = cardHTML;

  // 點擊北部區塊時，顯示北部卡片，並清空其他區域
  document.getElementById("North").addEventListener("click", () => {
    console.log("North 區塊被點擊");
    // 清空其他區域
    section3gridContainerCentral.innerHTML = "";
    section3gridContainerSouth.innerHTML = "";
    section3gridContainerEast.innerHTML = "";
    // 顯示北部卡片
    if (cardHTMLNorth) {
      console.log("顯示北部卡片，內容：", cardHTMLNorth);
      section3gridContainerNorth.innerHTML = cardHTMLNorth;
    } else {
      console.log("沒有北部的卡片可顯示");
      section3gridContainerNorth.innerHTML = "<p>無北部卡片</p>";
    }
  });

  // 點擊中部區塊時，顯示中部卡片，並清空其他區域
  document.getElementById("Central").addEventListener("click", () => {
    console.log("Central 區塊被點擊");
    // 清空其他區域
    section3gridContainerNorth.innerHTML = "";
    section3gridContainerSouth.innerHTML = "";
    section3gridContainerEast.innerHTML = "";
    // 顯示中部卡片
    if (cardHTMLCentral) {
      console.log("顯示中部卡片，內容：", cardHTMLCentral);
      section3gridContainerCentral.innerHTML = cardHTMLCentral;
    } else {
      console.log("沒有中部的卡片可顯示");
      section3gridContainerCentral.innerHTML = "<p>無中部卡片</p>";
    }
  });

  // 點擊南部區塊時，顯示南部卡片，並清空其他區域
  document.getElementById("South").addEventListener("click", () => {
    console.log("South 區塊被點擊");
    // 清空其他區域
    section3gridContainerNorth.innerHTML = "";
    section3gridContainerCentral.innerHTML = "";
    section3gridContainerEast.innerHTML = "";
    // 顯示南部卡片
    if (cardHTMLSouth) {
      console.log("顯示南部卡片，內容：", cardHTMLSouth);
      section3gridContainerSouth.innerHTML = cardHTMLSouth;
    } else {
      console.log("沒有南部的卡片可顯示");
      section3gridContainerSouth.innerHTML = "<p>無南部卡片</p>";
    }
  });

  // 點擊東部區塊時，顯示東部卡片，並清空其他區域
  document.getElementById("East").addEventListener("click", () => {
    console.log("East 區塊被點擊");
    // 清空其他區域
    section3gridContainerNorth.innerHTML = "";
    section3gridContainerCentral.innerHTML = "";
    section3gridContainerSouth.innerHTML = "";
    // 顯示東部卡片
    if (cardHTMLEast) {
      console.log("顯示東部卡片，內容：", cardHTMLEast);
      section3gridContainerEast.innerHTML = cardHTMLEast;
    } else {
      console.log("沒有東部的卡片可顯示");
      section3gridContainerEast.innerHTML = "<p>暫無東部作家</p>";
    }
  });

  // 可選：設定所有 grid-item 的隨機 order
  const gridItems = document.querySelectorAll(".grid-item");
  gridItems.forEach((item) => {
    item.style.order = Math.floor(Math.random() * gridItems.length);
  });
}

main();

///////////////////////////抽卡///////////////////////////////////
document.getElementById("startButton").addEventListener("click", () => {
  const gridContainer = document.getElementById("gridContainer");

  // 🔹 確保 `grid-container` 已經有內容
  if (!gridContainer.innerHTML.trim()) {
    alert("❌ 目前沒有可抽的卡片，請先載入 Grid！");
    return;
  }

  // **重新選取 `.grid-item`（確保抓到最新的卡片）**
  const gridItems = document.querySelectorAll(".grid-item");
  if (gridItems.length === 0) {
    alert("❌ 沒有可抽的卡片！");
    return;
  }

  // **隨機選取一張卡片**
  const randomIndex = Math.floor(Math.random() * gridItems.length);
  const selectedCard = gridItems[randomIndex];

  // **複製卡片（保持原本的卡片不變）**
  const clonedCard = selectedCard.cloneNode(true);
  clonedCard.style.background = "lightgoldenrodyellow"; // 改變顏色標示
  clonedCard.style.transform = "scale(1.1)"; // 放大一點讓它突出
  clonedCard.classList.add("shining"); // 🔹 添加 `.shining` class 來標示這張卡片

  // **插入到 "selected-card-container"**
  const selectedContainer = document.getElementById("selectedCardContainer");
  selectedContainer.innerHTML = ""; // 清空舊卡片
  selectedContainer.appendChild(clonedCard);
});
