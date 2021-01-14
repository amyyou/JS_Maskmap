


//執行步驟  renderDay(顯示日期) > setMap(載入地圖) > setOptions(撈地區) > 
//點擊town option > renderList(顯示診所列表) / setBtnActive > updateListUI

init();

function init() {
    renderDay();
    setMap();
    sidebarToggle();
}

//顯示資料用
function renderDay() {
    //判斷日期
    const date = new Date();
    let day = date.getDay();
    let chineseDay = judgeDayChinese(day);
    //顯示日期到網頁
    let thisDay = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    document.querySelector('.jsDate span').textContent = chineseDay;
    document.querySelector('.today').textContent = thisDay;

    //判斷奇數偶數，並顯示可以購買的人
    if (day == 1 || day == 3 || day == 5) {
        document.querySelector('.odd').style.display = 'inline'
    } else if (day == 2 || day == 4 || day == 6) {
        document.querySelector('.even').style.display = 'inline'
    } else {
        document.querySelector('.other').style.display = 'inline'
    }

}
//工具類 函式 輸入東西 > 輸出內容
function judgeDayChinese(day) {
    switch (day) {
        case 0:
            return "日";
            break;
        case 1:
            return "一";
            break;
        case 2:
            return "二";
            break;
        case 3:
            return "三";
            break;
        case 4:
            return "四";
            break;
        case 5:
            return "五";
            break;
        case 6:
            return "六";
            break;

    }
}

function setMap() {

    //設定一個地圖，把這地圖定位在 #map
    //先定位center座標，zoom定位16(縮放等級)
    const map = L.map('map', {
        center: [24.6928672, 121.7675467],
        zoom: 16
    });

    //載入圖資資料，放到div內 (你要用誰的圖資)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    let greenIcon = new L.Icon({
        iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    let redIcon = new L.Icon({
        iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    let yellowIcon = new L.Icon({
        iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    });

    //新增一個圖層，這圖層專門放icon群組
    let markers = new L.MarkerClusterGroup().addTo(map);;
    //開啟一個網路請求
    let xhr = new XMLHttpRequest();
    //我準備跟某某伺服器，要藥局剩餘口罩資料
    xhr.open("get", "https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json");
    //執行要資料的動作
    xhr.send();
    //當資料回傳時，下面語法就會自動觸發
    xhr.onload = function () {
        //我要把string轉成物件陣列的JSON格式
        var data = JSON.parse(xhr.responseText).features
        //依序把marker倒進圖層裡
        for (let i = 0; data.length > i; i++) {
            let mask;
            if (data[i].properties.mask_adult == 0 && data[i].properties.mask_child == 0) {
                mask = redIcon;
            } else if (data[i].properties.mask_adult !== 0 && data[i].properties.mask_child !== 0) {
                mask = greenIcon;
            } else {
                mask = yellowIcon;
            }

            markers.addLayer(L.marker([data[i].geometry.coordinates[1], data[i].geometry.coordinates[0]], { icon: mask })
                .bindPopup(
                    //'<h1>' + data[i].properties.name + '</h1>' + '<p>成人口罩數量' + data[i].properties.mask_adult + '</p>'
                    '<div class="popupBox">\
                          <h2>'+ data[i].properties.name + '</h2>\
                          <p>'+ data[i].properties.address + '</p>\
                          <p>連絡電話 : '+ data[i].properties.phone + '</p>\
                          <div class="maskBox">\
                             <span class="btn btn_adult">成人口罩 <br> '+ data[i].properties.mask_adult + '個</span>\
                             <span class="btn btn_child">兒童口罩 <br> '+ data[i].properties.mask_child + '個</span>\
                          </div>\
                          <a class="btn_google" target="_blank" href="https://www.google.com.tw/maps/dir//'+ data[i].properties.address + '">Google 路線導航</a>\
                         </div>'

                ));
            // add more markers here...
            // L.marker().addTo(map)
            //   )
        }
        map.addLayer(markers);
        setOptions(data, map);

    }

}

//將地區帶入option
function setOptions(data, map) {

    let countyList = []
    let county = [];
    let area = [];

    data.forEach(function (item) {
        countyList.push(item.properties.county);
    });
    //過濾重複地區
    repeatDataFilter(countyList, county);
    //console.log(countyList); >> 4672個
    //console.log(county); >> 22個

    for (let i = 0; i < county.length; i++) {
        let objCity = {};
        objCity.county = county[i];
        let townList = [];
        let town = [];
        for (j = 0; j < data.length; j++) {
            if (data[j].properties.county === county[i]) {
                townList.push(data[j].properties.town);
                //console.log(townList);
                repeatDataFilter(townList, town);
                //console.log(town);
            }
        }

        objCity.town = town;
        area.push(objCity);
        //console.log(area);

    }

    let countySelect = document.getElementById('countySelect');
    let townSelect = document.getElementById('townSelect');

    //加入County
    area.forEach(function (item) {
        countySelect.add(new Option(item.county, item.county));
    });

    //加入Town
    countySelect.addEventListener('change', function () {
        townSelect.length = 0;
        townSelect.add(new Option('請選擇鄉鎮區', '請選擇鄉鎮區'));
        for (let i = 0; i < county.length; i++) {
            if (countySelect.value === area[i].county) {
                for (let j = 0; j < area[i].town.length; j++) {
                    townSelect.add(new Option(area[i].town[j], area[i].town[j]))
                }
            }
        }

    });

    //點擊town option > show list > 更新地圖
    townSelect.addEventListener('change', function (e) {
        //顯示診所列表
        renderList(data, e)
        setBtnActive(data, e);
        //更新地圖
        moveToMapIcon(map);
        moveToTown(map);
    })

}

//過濾重複
function repeatDataFilter(original, response) {
    original.forEach(function (value) {
        if (response.indexOf(value) === -1 && value !== '') {
            response.push(value);
        }
    });
}


function renderList(data, e) {
    // let ary = data.features;
    // let str = ''
    // for (let i = 0; i < ary.length; i++) {
    //     if (ary[i].properties.county == city) {
    //         str += '<li>' + ary[i].properties.county + ary[i].properties.name + '成人口罩:' + ary[i].properties.mask_adult + '</li>';
    //     }
    // }
    let list = document.querySelector('.nameList');
    let dataFilter = [];

    data.forEach(function (item) {
        if (item.properties.county === countySelect.value && item.properties.town === e.target.value) {
            dataFilter.push(item);
        }
    });
    //console.log(dataFilter);

    //判斷為 所有/成人/兒童 口罩
    //點擊-setBtnActive > 取得Btn index (載入jQuery套件 - $ >> jQuery語法) 
    let btnGroup = $('#maskGroup').children();
    let btnIndex = 0;
    for (let i = 0; i < btnGroup.length; i++) {
        if (btnGroup[i].classList.contains('active')) {
            btnIndex = i;
        }
    }
    if (btnIndex === 1) {
        //由高到低排序
        dataFilter = dataFilter.sort(function (a, b) {
            return a.properties.mask_adult < b.properties.mask_adult ? 1 : -1;
        });
    } else if (btnIndex === 2) {
        dataFilter = dataFilter.sort(function (a, b) {
            return a.properties.mask_child < b.properties.mask_child ? 1 : -1;
        });
    }

    //update list UI
    list.innerHTML = updateListUI(dataFilter);

}

//所有/成人/兒童 口罩
function setBtnActive(data, e) {
    let btnGroup = $('#maskGroup').children();
    for (let i = 0; i < btnGroup.length; i++) {
        btnGroup[i].addEventListener('click', function () {
            $(this).siblings('.btn').removeClass('active');
            $(this).addClass('active');
            //更新List >> 判斷為 所有/成人/兒童 口罩
            renderList(data, e);
        })
    }
}

function updateListUI(dataFilter) {
    let str = '';
    dataFilter.forEach(function (item) {
        if (item.properties.mask_adult !== 0 && item.properties.mask_child !== 0) {
            str += `<li class="listItem" >
                <h2 data-lat="${item.geometry.coordinates[0]}" data-lng="${item.geometry.coordinates[1]}" data-name="${item.properties.name}" data-tel="${item.properties.phone}" data-address="${item.properties.address}" data-maskAdult="${item.properties.mask_adult}" data-maskChild="${item.properties.mask_child}">${item.properties.name}</h2>
                <p>${item.properties.address}</p>
                <p>電話 : ${item.properties.phone}</p>
                <div class="maskBox">
                    <span class="btn btn_adult">成人口罩 ${item.properties.mask_adult} 個</span>
                    <span class="btn btn_child">兒童口罩 ${item.properties.mask_child} 個</span>
                </div>
            </li>`
        } else if (item.properties.mask_adult === 0) {
            str += `<li class="listItem" >
            <h2 data-lat="${item.geometry.coordinates[0]}" data-lng="${item.geometry.coordinates[1]}" data-name="${item.properties.name}" data-tel="${item.properties.phone}" data-address="${item.properties.address}" data-maskAdult="${item.properties.mask_adult}" data-maskChild="${item.properties.mask_child}">${item.properties.name}</h2>
            <p>${item.properties.address}</p>
            <p>電話 : ${item.properties.phone}</p>
            <div class="maskBox">
                <span class="btn btn_noMask">成人口罩缺貨中</span>
                <span class="btn btn_child">兒童口罩 ${item.properties.mask_child} 個</span>
            </div>
          </li>`
        } else if (item.properties.mask_child === 0) {
            str += `<li class="listItem" >
            <h2 data-lat="${item.geometry.coordinates[0]}" data-lng="${item.geometry.coordinates[1]}" data-name="${item.properties.name}" data-tel="${item.properties.phone}" data-address="${item.properties.address}" data-maskAdult="${item.properties.mask_adult}" data-maskChild="${item.properties.mask_child}">${item.properties.name}</h2>
            <p>${item.properties.address}</p>
            <p>電話 : ${item.properties.phone}</p>
            <div class="maskBox">
                <span class="btn btn_adult">成人口罩 ${item.properties.mask_adult} 個</span>
                <span class="btn btn_noMask">兒童口罩缺貨中</span>
            </div>
        </li>`
        } else {
            str += `<li class="listItem" >
            <h2 data-lat="${item.geometry.coordinates[0]}" data-lng="${item.geometry.coordinates[1]}" data-name="${item.properties.name}" data-tel="${item.properties.phone}" data-address="${item.properties.address}" data-maskAdult="${item.properties.mask_adult}" data-maskChild="${item.properties.mask_child}">${item.properties.name}</h2>
            <p>${item.properties.address}</p>
            <p>電話 : ${item.properties.phone}</p>
            <div class="maskBox">
                <span class="btn btn_noMask">成人口罩缺貨中</span>
                <span class="btn btn_noMask">兒童口罩缺貨中</span>
            </div>
        </li>`
        }
    });
    return str;

}

function moveToMapIcon(map) {
    document.querySelector('.nameList').addEventListener('click', function (e) {
        if (e.target.nodeName === 'H2') {
            let lat = e.target.dataset.lat;//緯度
            let lng = e.target.dataset.lng;//經度

            console.log(e.target.dataset.maskAdult);
            //打開popup
            L.popup()
                .setLatLng([lng, lat])
                .setContent(
                    `<div class="popupBox">
                       <h2>${e.target.dataset.name}</h2>
                       <p>${e.target.dataset.address}</p>
                       <p>連絡電話 : ${e.target.dataset.tel}</p>
                       <div class="maskBox">
                             <span class="btn btn_adult">成人口罩 <br>${e.target.dataset.maskadult}個</span>
                             <span class="btn btn_child">兒童口罩 <br>${e.target.dataset.maskchild}個</span>
                        </div>
                        <a class="btn_google" target="_blank" href="https://www.google.com.tw/maps/dir//${e.target.dataset.address}">Google 路線導航</a>
                    </div>
                    `
                    )
                .openOn(map);


        }

    });
}

function moveToTown(map){
    //移至第一間診所位置
    let firstH2 = $('#nameList > li:first')[0].firstElementChild;
    let lat = firstH2.dataset.lat;
    let lng = firstH2.dataset.lng;
    map.setView([lng,lat],16);
}
    
function sidebarToggle(){
     $('.btn-toggle').on('click',function(){
         $(this).toggleClass('hide');
         $('.sidebar').toggleClass('hide');
     })
}
