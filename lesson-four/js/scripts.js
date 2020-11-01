'use strict';

const NUMBER_DATA_IN_TABLE = 100;

let tabItems;
let tabContent;
let like_icon;

let tableData = [];

let positionTable;
let locationTable;
let priceTable;

document.addEventListener('DOMContentLoaded', function() {
    initVariable();
    createTableData(tableData);
    updatePagination();
    addLikeEvenListener();
    addTableRowSelectorListener();
    addTablePaginationListener();
});

function initVariable() {
    tabItems = document.querySelectorAll('.tabs_item');
    tabContent = document.querySelectorAll('.tab_content');
    like_icon = document.querySelectorAll('.like_icon');
    positionTable = document.getElementById('position_table');
    locationTable = document.getElementById('location_table');
    priceTable = document.getElementById('price_table');
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

    let end = start + currentNumberRows;

    let rows = positionTable.rows.length - 1;
    let rowsPositionTable = document.querySelectorAll('#position_table tbody span');
    let rowsLocationTable = document.querySelectorAll('#location_table tbody span');
    let rowsPriceTable = document.querySelectorAll('#price_table tbody span');

    for (let i = 0; i < rows; i++, start++) {
        rowsPositionTable[i].innerHTML = tableData[start].position;
        rowsLocationTable[i].innerHTML = tableData[start].position;
        rowsPriceTable[i].innerHTML = tableData[start].position;
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


//like
function addLikeEvenListener() {
    like_icon.forEach(element => {
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