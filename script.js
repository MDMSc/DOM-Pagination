const heading = document.createElement("h1");
const para = document.createElement("p");
const tableContainer = document.createElement("div");
const buttonContainer = document.createElement("div");

heading.setAttribute("id", "title");
para.setAttribute("id", "description");
tableContainer.setAttribute("class", "table-responsive");
buttonContainer.setAttribute("class", "pagination-container d-flex justify-content-center");
buttonContainer.setAttribute("id", "buttons");

heading.innerText = "Pagination";
para.innerText = "Pagination in DOM Manipulation";

const table = document.createElement('table');
table.setAttribute("class", "table table-bordered table-striped col-sm-10 col-md-7 col-lg-7");
table.setAttribute("id", "table");

const thead = document.createElement("thead");
thead.innerHTML = `
        <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Email</th>
        </tr>
`;

let tbody = document.createElement("tbody");

let state = {
    current: 1,
    prevPage: 1,
    rows: 10,
    window: 5,
    data: null,
    totalPages: 0
}

async function getData(){
    try {
        const result = await fetch(`https://raw.githubusercontent.com/Rajavasanthan/jsondata/master/pagenation.json`);
        state.data = await result.json();
        state.totalPages = Math.ceil(state.data.length / state.rows);
        buildTable()
    } catch (error) {
        console.log(error.message);
    }
}
getData();

function pagination(data) {
    let startIndex = (state.current-1) * state.rows;
    let endIndex = startIndex + state.rows;

    let tableData = data.slice(startIndex, endIndex);

    return tableData;
}

function buildTable(){
    let finalData = pagination(state.data);

    tbody.innerHTML = "";
    finalData.forEach(item => {
        tbody.innerHTML += `
            <tr>
                <th>${item.id}</th>
                <td>${item.name}</td>
                <td>${item.email}</td>
            </tr>
        `;
    });
    table.append(thead, tbody);
    tableContainer.append(table);
    pageNumbers();
}

function pageNumbers() {
    let shownPages = "";

    const half = Math.round(state.window/2);
    let to = state.window;

    if(state.current + half >= state.totalPages){
        to = state.totalPages;
    } else if(state.current > half){
        to = state.current + half;
    }

    let from = to - state.window;

    for(let i = 1+from; i<=to; i++){
        shownPages += `
        <li class="page-item" id="page-${i}"><button class="page-link" id="${i}" value="${i}" onClick="handleToggle(id)">${i}</button></li>
        `;
    }

    buttonContainer.innerHTML = `
    <ul class="pagination" id="pagination">
        <li class="page-item" id="page-first"><button class="page-link" id="first" onClick="handleToggle(id)">First</button></li>
        <li class="page-item" id="page-previous"><button class="page-link" id="previous" onClick="handleToggle(id)">&laquo; Previous</button></li>
        ${shownPages}
        <li class="page-item" id="page-next"><button class="page-link" id="next" onClick="handleToggle(id)">Next &raquo;</button></li>
        <li class="page-item" id="page-last"><button class="page-link" id="last" onClick="handleToggle(id)">Last</button></li>
    </ul>
    `;
    setActive();
}

function handleToggle(id){
    state.current = parseInt(state.current);
    state.prevPage = state.current;

    switch (id) {
        case "first":
            id = 1;
            break;
        case "previous":
            (state.current - 1) <= 0 ? id = state.current : id = state.current - 1;
            break;
        case "next":
            (state.current + 1) > state.totalPages ? id = state.current : id = state.current + 1;
            break;
        case "last":
            id = state.totalPages;
            break;            
        default:
            break;
    }

    if(state.current === parseInt(id)) return;

    state.current = parseInt(id);
    buildTable();
    setActive();
}

function setActive(){
    try {
        if(document.body.contains(document.getElementById(state.prevPage))){
            document.getElementById(state.prevPage).parentElement.classList.remove("active");
        }
        document.getElementById(state.current).parentElement.classList.add("active");
    } catch (error) {
        console.log(error.message)
    }
}

document.body.append(heading, para, tableContainer, buttonContainer);

