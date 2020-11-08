'use strict';

const NUMBER_DATA_IN_TABLE = 100;
const API_URL = 'https://5ccad0a354c8540014834fa5.mockapi.io/api/ex/news';


let tabItems;
let tabContent;
let likeIcon;

let tableData = [];
let cardStorage;

let positionTable;
let locationTable;
let priceTable;

let date = new Date();

let cardContainer;

document.addEventListener('DOMContentLoaded', function() {
    initVariable();
    updatePagination();
    addLikeEvenListener();
    addTableRowSelectorListener();
    addTablePaginationListener();
    addCardFromApi();
});

function initVariable() {
    tabItems = document.querySelectorAll('.tabs_item');
    tabContent = document.querySelectorAll('.tab_content');
    likeIcon = document.querySelectorAll('.like_icon');
    positionTable = document.getElementById('position_table');
    locationTable = document.getElementById('location_table');
    priceTable = document.getElementById('price_table');
    cardContainer = document.getElementById('card_container');
    createTableData(tableData);
    cardStorage = [];
    loadCardFromLocalStorage();
}

function updateLikeListener() {
    likeIcon = document.querySelectorAll('.like_icon');
    addLikeEvenListener();

}

//tabs

let activeNumContent = 1;

function changeTabsAndContent(contentNum) {
    if (activeNumContent != contentNum) {
        tabContent.forEach(content => {
            if (content.dataset.num == contentNum) {
                content.classList.remove('noactive_tab_content');
            } else {
                content.classList.add('noactive_tab_content');
            }
        });
        tabItems.forEach(tab => {
            if (tab.dataset.num == contentNum) {
                tab.classList.add('active')
            } else {
                tab.classList.remove('active')
            }
        });
        activeNumContent = contentNum;
    }
}

//table

let currentNumberRows = 10;
let currentTablePage = 1;

function createTableData(tableData) {
    for (let i = 1; i <= NUMBER_DATA_IN_TABLE; i++) {
        tableData.push({
            position: 'some pos #' + i,
            location: 'some loc #' + i,
            price: 'some price #' + i
        })
    }
}

function addTableRowSelectorListener() {
    let row_selecter = document.getElementById("table_row_selector");
    row_selecter.addEventListener('change', function() {
        currentNumberRows = row_selecter.value;
        changeTableRow(currentNumberRows);
        updatePagination();
    });
}

function changeTableRow(count) {
    let rows = positionTable.rows.length - 1;
    if (count > rows) {
        for (let i = rows; i < count && i < tableData.length; i++) {
            positionTable.insertRow(++rows)
                .insertCell(-1)
                .innerHTML = "<span>" + tableData[i].position + "</span>";

            locationTable.insertRow(rows)
                .insertCell(-1)
                .innerHTML = "<span>" + tableData[i].position + "</span>";

            priceTable.insertRow(rows)
                .insertCell(-1)
                .innerHTML = "<span>" + tableData[i].position + "</span>";
        }
    } else {
        for (let i = rows; i > count; i--, --rows) {
            positionTable.deleteRow(rows);
            locationTable.deleteRow(rows);
            priceTable.deleteRow(rows);
        }
    }
}

function displayTable(tablePage) {

    let start;

    if (tablePage == 1) {
        start = 0;
    } else {
        start = ((tablePage - 1) * currentNumberRows);
    }

    let rows = positionTable.rows.length - 1;
    let rowsPositionTable = document.querySelectorAll('#position_table tbody span');
    let rowsLocationTable = document.querySelectorAll('#location_table tbody span');
    let rowsPriceTable = document.querySelectorAll('#price_table tbody span');

    for (let i = 0; i < rows; i++, start++) {
        if (start < tableData.length) {
            rowsPositionTable[i].innerHTML = tableData[start].position;
            rowsLocationTable[i].innerHTML = tableData[start].position;
            rowsPriceTable[i].innerHTML = tableData[start].position;
        } else {
            rowsPositionTable[i].innerHTML = '';
            rowsLocationTable[i].innerHTML = '';
            rowsPriceTable[i].innerHTML = '';
        }
    }

}

//pagination

let pageButtonPage = document.getElementById('pagination_page');
let numberPages;

function addTablePaginationListener() {
    let prevTablePage = document.getElementById("prev_table_page");
    let nextTablePage = document.getElementById("next_table_page");
    prevTablePage.addEventListener('click', function() {
        if (currentTablePage != 1) {
            --currentTablePage;
            updatePagination();
            changeTablePage(currentTablePage);

        }
    });
    nextTablePage.addEventListener('click', function() {
        if (currentTablePage != numberPages) {
            ++currentTablePage;
            updatePagination();
            changeTablePage(currentTablePage);
        }
    });
}

function updatePagination() {
    numberPages = Math.ceil(tableData.length / currentNumberRows);
    displayPageButton(numberPages, currentTablePage);
}

function changeTablePage(numButton) {
    currentTablePage = numButton;
    displayTable(currentTablePage);
    updatePagination();
}

function displayPageButton(numberOfButton, activeButton) {
    pageButtonPage.innerHTML = '';
    for (let i = 1; i <= numberOfButton; i++) {
        if (i == activeButton) {
            let li = document.createElement('li');
            li.setAttribute('class', 'page_active');
            li.dataset.num = i;
            pageButtonPage.appendChild(li);
            li.innerHTML = li.innerHTML + i
        } else {
            let li = document.createElement('li');
            li.dataset.num = i;
            pageButtonPage.appendChild(li);
            li.innerHTML = li.innerHTML + i
        }
    }
    addTableButtonListener();
}

function addTableButtonListener() {
    let li = document.querySelectorAll('#pagination_page li');
    li.forEach(element => {
        element.addEventListener('click', () => {
            changeTablePage(element.dataset.num);
        });
    });
}

//network

function httpGet(url) {
    return new Promise(function(resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', API_URL, true);
        xhr.onload = function() {
            if (this.status == 200) {
                resolve(this.response);
            } else {
                let error = new Error(this.statusText);
                error.code = this.status;
                reject(error);
            }
        };
        xhr.onerror = function() {
            reject(new Error("Network Error"));
        };
        xhr.send();
    });
}

function addCardFromApi() {
    httpGet(API_URL).then(
        (success) => {
            displayCardFromJson(success)
        },
        (error) => {
            console.log(error)
        }
    )
}

function displayCardFromJson(json) {
    let objectList = JSON.parse(json);

    if (objectList != null) {
        objectList.forEach(card => {
            let createdAt = date.getDate() + '.' + date.getMonth() + '.' + date.getFullYear();
            let newCard = {
                'id': card.id,
                'createdAt': createdAt,
                'name': card.name,
                'title': card.title,
                'description': card.description,
                'avatar': card.avatar,
                'isLiked': card.isLiked,
                'base64image': false
            }
            if (newCard != undefined && newCard.title != undefined &&
                newCard.description != undefined && newCard.avatar != undefined) {
                displayCard(newCard.id, newCard.createdAt, newCard.name,
                    newCard.description, newCard.title,
                    newCard.avatar, newCard.isLiked);
            }
        });
    }
    updateLikeListener();
}

//adding cards

//like
function addLikeEvenListener() {
    likeIcon.forEach(element => {
        element.addEventListener('click', () => {
            changeLike(element);
        })
    });
}

function changeLike(element) {
    if (!element.classList.contains('active_like')) {
        element.classList.add('active_like');
    } else {
        element.classList.remove('active_like')
    }
}

//add card dialog 

let displayedCardCounter = 0;

function changeDialogVisibility() {

    let dialog = document.getElementById("add_card_dialog");
    dialog.style.visibility = (dialog.style.visibility == "visible") ? "hidden" : "visible";

}

function addCard() {

    const file = document.add_card_form.card_img.files[0]
    let id = ++cardID;
    let createdAt = date.getDate() + '.' + date.getMonth() + '.' + date.getFullYear();
    let name = document.add_card_form.card_name.value;
    let title = document.add_card_form.card_title.value;
    let description = document.add_card_form.card_text.value;

    if (file != undefined && title != undefined &&
        description != undefined && title.length != 0) {

        const reader = new FileReader();

        reader.onload = (function(file) {
            return function(e) {
                const base64String = reader.result.replace('data', '').replace(/^.+,/, '');
                let card = {
                    'id': id,
                    'createdAt': createdAt,
                    'name': name,
                    'title': title,
                    'description': description,
                    'avatar': base64String,
                    'isLiked': false,
                    'isBase64img': true

                }
                saveInLocalStorage(card);
            }
        })(file);

        if (file && file.type.match('image.*')) {
            reader.readAsDataURL(file);
        }
        changeDialogVisibility();

    } else {
        alert('Fill in all the fields and upload the image!');
    }
}

function saveInLocalStorage(newCard) {
    if (cardStorage == null) {
        cardStorage = [];
    }
    if (newCard != undefined && newCard.title != undefined &&
        newCard.description != undefined && newCard.avatar != undefined) {
        cardStorage.push(newCard);
        localStorage.setItem('cards', JSON.stringify(cardStorage));
        loadCardFromLocalStorage();
    }
}

function loadCardFromLocalStorage() {
    cardStorage = JSON.parse(localStorage.getItem('cards'));

    if (cardStorage != null) {
        for (let index = displayedCardCounter; index < cardStorage.length; index++) {
            displayCard(cardStorage[index].id, cardStorage[index].createdAt,
                cardStorage[index].name, cardStorage[index].desctiption,
                cardStorage[index].title, cardStorage[index].avatar,
                cardStorage[index].isLiked, cardStorage[index].isBase64img);
            displayedCardCounter++;
        }
    }
}

function displayCard(id, createdAt, name, description, title, avatar, isLiked, isBase64img) {
    let likeClass = isLiked ? 'like_icon active_like' : 'like_icon';
    let imgType = isBase64img ? 'data:image/png;base64,' + avatar : avatar;

    let cardTemplate = `<div class="card">
        <div class="img_wrapper ">
            <img src="${imgType}" alt="card image">
        </div>
        <div class="card_content">
            
            <div class="card_like">
                <span class="${likeClass}"></span>
            </div>
            <span class="card_date">${createdAt}</span>
            <div class="card_title_containter">
                <span class="card_title">${title}</span>
                <span class="card_name">${name}</span>                 
            </div>
           
            <div class="card_article">
                <span>${description}</span>
            </div>
        </div>
        <div class="card_actions button">
            <a href="#">READ MORE</a>
        </div>
        </div>`;

    cardContainer.insertAdjacentHTML('afterbegin', cardTemplate);
}

function displayFileName() {
    let fileName = document.getElementById('card_img_file').value;
    fileName = fileName.replace(/\\/g, '/').split('/').pop();
    document.getElementById('file_name_span').innerHTML = fileName;
}