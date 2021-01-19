# Leaflet + OpenStreetMap 地圖應用 - 口罩地圖

使用技術 : HTML 、 CSS 、 RWD 、 Javascript         
網站連結 : https://amyyou.github.io/JS_Maskmap/

## 資源
[UI 線上設計稿](https://challenge.thef2e.com/user/2872?schedule=4434#works-4434)   
[影片教學](https://www.youtube.com/watch?v=pUizu62dlnY)   
[講義](https://quip.com/vdqYAiFHHkaV)   


## 地圖應用(原理 底層)框架
Google Map 、OSM、mapbox         

## Leaflet (js框架 -常見處理)
圖資(地圖資料)       
標示點(marker)     

## OpenStreetMap(圖資、圖磚 - 地圖資料)
Google Map (收費)      
Safari Map      
OpenSteetMap(開源免費)     

## Geolocation api 
抓自己座標     

## 程式說明
執行步驟  renderDay(顯示日期) > setMap(載入地圖) > setOptions(撈地區) > 點擊town option > renderList(顯示診所列表) / setBtnActive > updateListUI
1. 使用document.querySelector()方法選取 id 或 class 元素(選擇單一元素，抓第一筆資料做更新)
2. 使用document.getElementById()方法選取 id 元素渲染到網頁
3. 使用Date() 取得本地時間，並呼叫內建函式 getDate()、getMonth()、getFullYear()，顯示日期到網頁    
4. 載入地圖資源，依序載入 css 與 js 檔案     
   - 使用 L.map(id, options) 方法創建地圖，並設定地圖中心點與放大級別(設定一個地圖，把這地圖定位在 #map，並定位center座標以及zoom縮放等級)     
   - 使用 L.tileLayer(urlTemplate, options).addTo(map) 方法載入圖資資料，且放到div內 (你要用誰的圖資)    
   - 使用 L.icon(options) 方法客製化標記點 icon     
   - 使用 L.marker(latlng, options).addTo(map).bindPopup(content).openPopup() 方法在地圖上創建標記點，bindPopup 方法綁定彈出視窗，openPopup 則是開啟彈跳視窗      
   - let markers = new L.MarkerClusterGroup().addTo(map) : 新增一個圖層，這圖層專門放icon群組     
   - 使用 L.popup() 打開popup
5. AJAX JSON 傳遞     
    - let xhr = new XMLHttpRequest() : 開啟一個網路請求      
    - xhr.open("get" , "JSON URL") : 我準備跟某某伺服器，要藥局剩餘口罩資料    
    - xhr.send() : 執行要資料的動作      
    - xhr.onload = function () { } :當資料回傳時，function內語法就會自動觸發      
6. 使用JSON.parse()將string轉為array，使用JSON.stringify()將array轉為string
7. 過濾重複地區 : 使用forEach對陣列的每個元素執行一次提供的函數
8. 顯示診所列表
   - sort() 方法會對一個陣列的所有元素進行排序，並回傳此陣列    
   - 使用innerHTML增加標籤(特性是會把裡面給清空，才會在指定的id or class塞你要賦予給他的值)    
9. 點擊所有/成人/兒童 口罩按鈕 
   - 使用addEventListener()監聽使用者點擊事件  
10. 更新UI內容
    - 使用forEach對陣列的每個元素執行一次提供的函數   
    - 使用比較運算子和邏輯運算子判斷口罩數量   
    - 使用innerHTML增加標籤(特性是會把裡面給清空，才會在指定的id or class塞你要賦予給他的值)   
    - data-* : 透過 dataset 讀取自訂資料，跟資料做綁定和驗證的動作


    













