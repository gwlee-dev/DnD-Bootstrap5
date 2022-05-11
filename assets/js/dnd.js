const gridString = `<div id="grid" class="drop-zone" style="grid-template-columns: 1fr 1fr 1fr; grid-template-rows: 1fr 1fr 1fr; gap: 5px; z-index: -1;"><div class="grid drop" data-target="njyc2arux" style="grid-area: 1 / 1 / 2 / 4;"></div><div class="grid drop" data-target="nhlmk8e3p" style="grid-area: 2 / 1 / 3 / 2;"></div><div class="grid drop" data-target="82qbgdz5b" style="grid-area: 3 / 1 / 4 / 2;"></div><div class="grid drop" data-target="twholn05f" style="grid-area: 2 / 2 / 4 / 3;"></div><div class="grid drop" data-target="370728h0r" style="grid-area: 2 / 3 / 3 / 4;"></div><div class="grid drop" data-target="9tx6e4t4x" style="grid-area: 3 / 3 / 4 / 4;"></div></div>`;

let object = '';

let charts = {};

let labels = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '23'];

const getRandomColor = () => {
    let letters = '0123456789ABCDEF'.split('');
    let color = '#';

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
                label: 'data',
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

    const target = document.getElementById(id + '-chart');
    target.style.maxWidth = target.parentNode.clientWidth - 20 + 'px';
    target.style.maxHeight = target.parentNode.clientHeight - 20 + 'px';
    data.datasets[0].backgroundColor = getRandomColor();
    charts[id] = new Chart(target, config);
};

const dropTemplate = (text) => {
    return `<canvas id="${text}-chart" draggable="true"></canvas><span class="clear-btn" data-target="${text}" onclick="removeComponent();">X</span>`;
};

const itemTemplate = (text) => {
    return `<div class="item no-select" draggable="true" id="${text}">${text.toUpperCase()} CHART</div>`;
};

const removeComponent = () => {
    const target = event.target.getAttribute('data-target');
    const removed = document.querySelector(`canvas#${target}-chart`);
    charts[target].destroy();
    delete charts[target];
    removed.parentNode.innerHTML = '';

    const items = document.querySelector('.items');
    const div = document.createElement('div');
    div.className = 'item no-select';
    div.setAttribute('draggable', true);
    div.id = target;
    div.textContent = `${target.toUpperCase()} CHART`;
    div.addEventListener('dragstart', dragStartHandler);
    items.appendChild(div);
};

const dropHandler = (e) => {
    if (e.target.innerHTML === '') {
        if (object.classList.contains('item')) {
            const type = object.id;
            e.target.innerHTML = dropTemplate(type);
            createChart(type);
            object.remove();
        }

        e.target.classList.remove('enter');
    }
    object = '';
};

const dragLeaveHandler = (e) => {
    if (object.classList.contains('item')) {
        if (e.target.classList.contains('drop')) {
            if (e.target.innerHTML === '') {
                e.target.classList.remove('enter');
            }
        }
    }
};

const dragEnterHandler = (e) => {
    if (object.classList.contains('item')) {
        if (e.target.classList.contains('drop')) {
            if (e.target.innerHTML === '') {
                e.target.classList.add('enter');
            }
        }
    }
};

const dragOverHandler = (e) => {
    e.preventDefault();
};

const dragStartHandler = (e) => {
    if (e.target.classList.contains('item')) object = e.target;
};

const setDnDHandler = () => {
    const items = document.querySelectorAll('.item');
    const drops = document.querySelectorAll('.drop');

    items.forEach((item) => {
        // item.removeEventListener('dragstart', dragStartHandler);
        item.addEventListener('dragstart', dragStartHandler);
    });

    drops.forEach((drop) => {
        // drop.removeEventListener('dragover', dragOverHandler);
        drop.addEventListener('dragover', dragOverHandler);

        // drop.removeEventListener('dragenter', dragEnterHandler);
        drop.addEventListener('dragenter', dragEnterHandler);

        // drop.removeEventListener('dragleave', dragLeaveHandler);
        drop.addEventListener('dragleave', dragLeaveHandler);

        // drop.removeEventListener('drop', dropHandler);
        drop.addEventListener('drop', dropHandler);
    });
};

const settingGrid = () => {
    const target = document.querySelector('#grid');
    target.outerHTML = gridString;
};

const init = () => {
    settingGrid();
    setDnDHandler();
};

init();
