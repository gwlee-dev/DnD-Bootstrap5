/* common */
let gridString = "";
/* common */

/* generator */
let option = {
    column: 0,
    row: 0,
    columnGap: 0,
    rowGap: 0,
    columnSizes: [],
    rowSizes: [],
};

let selectedObject = {
    start: "",
    end: "",
};

const randomString = () => {
    return Math.random().toString(36).substring(2, 11);
};

const randomHexColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    return `rgba(${r}, ${g}, ${b}, 0.2)`;
};

const generatorToDnd = () => {
    const generator = document.querySelector("#generator-html");
    const dnd = document.querySelector("#dnd-html");

    generator.classList.add("d-none");
    dnd.classList.remove("d-none");
};

const resetGrid = () => {
    if (confirm("레이아웃을 처음상태로 되돌리시겠습니까 ?")) {
        document.querySelectorAll(".setting input").forEach((input) => {
            input.removeAttribute("disabled");
        });
        generatorInit();
        countActivated();
    }
};

const saveGrid = () => {
    if (confirm("레이아웃을 저장하시겠습니까?")) {
        if (document.querySelector(".grid-box").childNodes.length > 0) {
            const target = document.querySelector(".grid-copy");
            const removed = target.querySelectorAll("h1");
            removed.forEach((remove) => {
                remove.remove();
            });

            target.childNodes.forEach((child) => {
                child.classList.add("drop");
                child.style.backgroundColor = "";
            });

            target.id = "grid-zone";
            target.className = "drop-zone";

            gridString = target.outerHTML;
            target.remove();
            generatorToDnd();
            dndInit();
        } else {
            alert("선택된 영역이 없습니다.");
            return;
        }
    }
};

const removeMergedGrid = (e) => {
    if (confirm("해당 영역을 삭제하시겠습니까?")) {
        const targetData = e.target.parentNode.textContent;
        const target = document.querySelector(
            `.grid-copy div[data-target="${targetData}"]`
        );
        target.remove();
        e.target.parentNode.remove();
        countActivated();
    }
};

const changeColumnSize = () => {
    const columnSizes = [];

    document.querySelectorAll(".column-size input").forEach((column) => {
        columnSizes.push(column.value);
    });

    option["columnSizes"] = columnSizes;
    initializeGrid();
};

const changeRowSize = () => {
    const rowSizes = [];

    document.querySelectorAll(".row-size input").forEach((row) => {
        rowSizes.push(row.value);
    });

    option["rowSizes"] = rowSizes;
    initializeGrid();
};

const applyGridStyle = (target) => {
    const columnSizeDiv = document.querySelector(".column-size");
    const rowSizeDiv = document.querySelector(".row-size");

    let columns = [];
    let rows = [];

    for (let i = 0; i < option.column; i++) {
        if (option.columnSizes.length !== option.column) {
            columns.push("1fr");
        } else {
            columns.push(option.columnSizes[i]);
        }
    }

    for (let i = 0; i < option.row; i++) {
        if (option.rowSizes.length !== option.row) {
            rows.push("1fr");
        } else {
            rows.push(option.rowSizes[i]);
        }
    }

    target.style.gridTemplateColumns = `${columns.join(" ")}`;
    columnSizeDiv.style.gridTemplateColumns = `${columns.join(" ")}`;
    columnSizeDiv.style.gridTemplateRows = `1fr`;
    target.style.gridTemplateRows = `${rows.join(" ")}`;
    rowSizeDiv.style.gridTemplateColumns = `1fr`;
    rowSizeDiv.style.gridTemplateRows = `${rows.join(" ")}`;
    target.style.gridGap = `${option.rowGap}px ${option.columnGap}px`;
};

const createCopyElement = (target, startC, startR, endC, endR) => {
    const gridBox = document.querySelector("#grid-box");

    const div = document.createElement("div");
    const str = randomString();
    const color = randomHexColor();
    div.className = "grid";
    div.style.gridArea = `${startR} / ${startC} / ${endR} / ${endC}`;
    div.style.backgroundColor = color;
    div.setAttribute("data-target", str);
    const h1 = document.createElement("h1");
    h1.className = "fs-6 fw-bold";
    h1.textContent = str;
    div.appendChild(h1);
    target.appendChild(div);

    const div2 = document.createElement("div");
    div2.className = "activated-item";
    div2.style.cssText = `--dnd-bg: ${color}`;
    div2.textContent = str;
    const delButton = document.createElement("button");
    delButton.className = "btn-close btn-sm ms-auto";
    delButton.type = "button";
    delButton.addEventListener("click", removeMergedGrid);
    div2.appendChild(delButton);
    gridBox.appendChild(div2);

    countActivated();
};

const countActivated = () => {
    const gridBox = document.querySelector("#grid-box");
    const targetClass = "activated-item";
    const divCount = gridBox.getElementsByClassName("activated-item").length;
    const countIndicator = document.getElementById("activation-indicator");
    countIndicator.innerHTML = divCount;
};

const createGridTemplate = (target, column, row) => {
    const columnSizeDiv = document.querySelector(".column-size");
    const rowSizeDiv = document.querySelector(".row-size");

    target.innerHTML = "";
    columnSizeDiv.innerHTML = "";
    rowSizeDiv.innerHTML = "";

    for (let i = 0; i < column; i++) {
        const input = document.createElement("input");
        input.type = "text";
        input.className = "form-control form-control-sm";
        input.addEventListener("focusout", changeColumnSize);
        if (option.columnSizes.length !== column) {
            input.value = "1fr";
        } else {
            input.value = option.columnSizes[i];
        }
        columnSizeDiv.appendChild(input);
    }

    for (let i = 0; i < row; i++) {
        const input = document.createElement("input");
        input.type = "text";
        input.className = "form-control form-control-sm";
        input.addEventListener("focusout", changeRowSize);
        if (option.rowSizes.length !== row) {
            input.value = "1fr";
        } else {
            input.value = option.rowSizes[i];
        }
        rowSizeDiv.appendChild(input);
    }

    for (let i = 0; i < column * row; i++) {
        const div = document.createElement("div");
        div.className = "grid";
        target.appendChild(div);
    }
};

const initializeGrid = () => {
    const gridElement = document.querySelector("#grid");

    const column = parseInt(
        document.querySelector('input[name="column"]').value
    );
    const row = parseInt(document.querySelector('input[name="row"]').value);
    const columnGap = parseInt(
        document.querySelector('input[name="column-gap"]').value
    );
    const rowGap = parseInt(
        document.querySelector('input[name="row-gap"]').value
    );

    createGridTemplate(gridElement, column, row);

    const columnSizes = [];
    const rowSizes = [];

    document.querySelectorAll(".column-size input").forEach((column) => {
        columnSizes.push(column.value);
    });

    document.querySelectorAll(".row-size input").forEach((row) => {
        rowSizes.push(row.value);
    });

    option = { column, row, columnGap, rowGap, columnSizes, rowSizes };

    applyGridStyle(gridElement);

    if (document.querySelector(".grid-copy")) {
        document.querySelector(".grid-copy").remove();
    }

    const copyElement = gridElement.cloneNode(false);
    copyElement.id = "grid-copy";
    copyElement.style.zIndex = -1;
    copyElement.classList.add("grid-copy");
    document.querySelector(".generator").appendChild(copyElement);
};

const gridSizeHandler = (e) => {
    const target = e.target;
    option[target.name] = parseInt(target.value);

    initializeGrid();
};

const inputHandler = () => {
    const settings = document.querySelectorAll(".setting input");

    settings.forEach((setting) => {
        setting.addEventListener("change", gridSizeHandler);
    });
};

const calculateElementIndex = (target) => {
    let idx = 0;
    while ((target = target.previousSibling) != null) {
        idx++;
    }
    return idx;
};

const calculateMerge = () => {
    const start = selectedObject["start"];
    const startIndex = calculateElementIndex(start) + 1;
    const end = selectedObject["end"];
    const endIndex = calculateElementIndex(end) + 1;

    const columnSize = option["column"];

    const startColumn =
        startIndex % columnSize === 0 ? columnSize : startIndex % columnSize;
    const startRow = Math.ceil(startIndex / columnSize);

    const endColumn =
        endIndex % columnSize === 0
            ? columnSize + 1
            : (endIndex % columnSize) + 1;
    const endRow = Math.ceil(endIndex / columnSize) + 1;

    const copyElement = document.querySelector(".grid-copy");

    if (startColumn > endColumn - 1 || startRow > endRow - 1) {
        selectedObject = { start: "", end: "" };
        return false;
    } else {
        createCopyElement(
            copyElement,
            startColumn,
            startRow,
            endColumn,
            endRow
        );
    }

    selectedObject = { start: "", end: "" };
};

const mouseUpHandler = (e) => {
    if (e.target.classList.contains("grid")) {
        e.preventDefault();
        selectedObject["end"] = e.target;
        document.querySelectorAll(".setting input").forEach((input) => {
            input.setAttribute("disabled", true);
        });
        calculateMerge();
    }
};

const mouseDownHandler = (e) => {
    if (e.target.classList.contains("grid")) {
        e.preventDefault();
        selectedObject["start"] = e.target;
    }
};

const destroyMouseHandler = () => {
    window.removeEventListener("mousedown", mouseDownHandler);

    window.removeEventListener("mouseup", mouseUpHandler);
};

const mouseHandler = () => {
    window.addEventListener("mousedown", mouseDownHandler);

    window.addEventListener("mouseup", mouseUpHandler);
};

const generatorInit = () => {
    mouseHandler();
    inputHandler();
    initializeGrid();
    document.querySelector("#grid-box").innerHTML = "";
};
/* generator */

/* dnd */
let object = "";

let charts = {};

let labels = [
    "00",
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
    "23",
];

const getRandomColor = () => {
    let letters = "0123456789ABCDEF".split("");
    let color = "#";

    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
};

const getRandom = (count) => {
    let data = [];

    for (let i = 0; i < count; i++) {
        data.push(Math.floor(Math.random() * 1000));
    }

    return data;
};

const createChart = (id) => {
    let data = {
        labels: labels,
        datasets: [
            {
                label: "data",
                data: getRandom(24),
                borderWidth: 1,
            },
        ],
    };

    let config = {
        type: id,
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
        },
    };

    const target = document.getElementById(id + "-chart");
    target.style.maxWidth = target.parentNode.clientWidth - 20 + "px";
    target.style.maxHeight = target.parentNode.clientHeight - 20 + "px";
    data.datasets[0].backgroundColor = getRandomColor();
    charts[id] = new Chart(target, config);
};

const dropTemplate = (text) => {
    return `<canvas id="${text}-chart" draggable="true"></canvas><span class="btn-close" data-target="${text}" onclick="removeComponent();"></span>`;
};

const itemTemplate = (text) => {
    return `<div class="item no-select" draggable="true" id="${text}">${text.toUpperCase()} CHART</div>`;
};

const removeComponent = () => {
    const target = event.target.getAttribute("data-target");
    const removed = document.querySelector(`canvas#${target}-chart`);
    charts[target].destroy();
    delete charts[target];
    removed.parentNode.innerHTML = "";

    const items = document.querySelector(".items");
    const div = document.createElement("div");
    div.className = "item no-select";
    div.setAttribute("draggable", true);
    div.id = target;
    div.textContent = `${target.toUpperCase()} CHART`;
    div.addEventListener("dragstart", dragStartHandler);
    items.appendChild(div);
};

const dropHandler = (e) => {
    if (object != null && object != "" && object != undefined) {
        if (e.target.innerHTML === "") {
            if (object.classList.contains("item")) {
                const type = object.id;
                e.target.innerHTML = dropTemplate(type);
                createChart(type);
                object.remove();
            }

            e.target.classList.remove("enter");
        }
    }
    object = "";
};

const dragLeaveHandler = (e) => {
    if (object != null && object != "" && object != undefined) {
        if (object.classList.contains("item")) {
            if (e.target.classList.contains("drop")) {
                if (e.target.innerHTML === "") {
                    e.target.classList.remove("enter");
                }
            }
        }
    }
};

const dragEnterHandler = (e) => {
    if (object != null && object != "" && object != undefined) {
        if (object.classList.contains("item")) {
            if (e.target.classList.contains("drop")) {
                if (e.target.innerHTML === "") {
                    e.target.classList.add("enter");
                }
            }
        }
    }
};

const dragOverHandler = (e) => {
    e.preventDefault();
};

const dragStartHandler = (e) => {
    if (e.target.classList.contains("item")) object = e.target;
};

const setDnDHandler = () => {
    const items = document.querySelectorAll(".item");
    const drops = document.querySelectorAll(".drop");

    items.forEach((item) => {
        // item.removeEventListener('dragstart', dragStartHandler);
        item.addEventListener("dragstart", dragStartHandler);
    });

    drops.forEach((drop) => {
        // drop.removeEventListener('dragover', dragOverHandler);
        drop.addEventListener("dragover", dragOverHandler);

        // drop.removeEventListener('dragenter', dragEnterHandler);
        drop.addEventListener("dragenter", dragEnterHandler);

        // drop.removeEventListener('dragleave', dragLeaveHandler);
        drop.addEventListener("dragleave", dragLeaveHandler);

        // drop.removeEventListener('drop', dropHandler);
        drop.addEventListener("drop", dropHandler);
    });
};

const settingGrid = () => {
    const target = document.querySelector("#grid-zone");
    console.log(target);
    target.outerHTML = gridString;
};

const dndInit = () => {
    destroyMouseHandler();
    settingGrid();
    setDnDHandler();
};
/* dnd */

/* common */
// generatorInit();

const override = () => {
    gridString = `<div id="grid" class="drop-zone" style="grid-template-columns: 1fr 1fr 1fr; grid-template-rows: 1fr 1fr 1fr; gap: 5px; z-index: -1;"><div class="grid drop" data-target="njyc2arux" style="grid-area: 1 / 1 / 2 / 4;"></div><div class="grid drop" data-target="nhlmk8e3p" style="grid-area: 2 / 1 / 3 / 2;"></div><div class="grid drop" data-target="82qbgdz5b" style="grid-area: 3 / 1 / 4 / 2;"></div><div class="grid drop" data-target="twholn05f" style="grid-area: 2 / 2 / 4 / 3;"></div><div class="grid drop" data-target="370728h0r" style="grid-area: 2 / 3 / 3 / 4;"></div><div class="grid drop" data-target="9tx6e4t4x" style="grid-area: 3 / 3 / 4 / 4;"></div></div>`;
    dndInit();
};

(() => {
    window.dnd = {
        override: override,
        init: generatorInit,
    };
})();

/* common */
