function browserCheck() {
    const agent = window.navigator.userAgent.toLowerCase();

    if (agent.indexOf('trident') > -1) {
        document.body.innerHTML = '';
        const div = document.createElement('div');
        div.className = 'full';
        const h1 = document.createElement('h1');
        h1.className = 'fs-1 fw-bolder';
        h1.textContent = 'This browser is not supported.';
        div.appendChild(h1);
        document.body.appendChild(div);
    }
}

browserCheck();
