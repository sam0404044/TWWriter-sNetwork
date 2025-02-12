// window.onload = () => {

//     // **導覽列的位置**//
//     let navbar = document.getElementById("navbar");
//     let navbarOffset = navbar.offsetTop; // 取得 nav 距離頁面頂部的高度

//     window.addEventListener("scroll", function() {
//         let scrollPosition = window.scrollY; // 取得目前滾動位置
//         if (scrollPosition >= navbarOffset) { // 當滾動到 nav 的初始位置時固定
//             navbar.style.position = "fixed";
//             navbar.style.top = "0";
//             navbar.style.width = "100%";
//             navbar.style.background = "#333";
//             navbar.style.zIndex = "1000";
//         } else{
//              navbar.style.position = "relative"; 
//         }
//     });
// };
