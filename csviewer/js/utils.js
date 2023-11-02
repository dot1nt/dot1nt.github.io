function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function getRandomColor() {
    const r = Math.floor(getRandomInt(100, 200));
    const g = Math.floor(getRandomInt(100, 200));
    const b = Math.floor(getRandomInt(100, 200));

    const hexR = r.toString(16).padStart(2, '0');
    const hexG = g.toString(16).padStart(2, '0');
    const hexB = b.toString(16).padStart(2, '0');

    const hex = `#${hexR}${hexG}${hexB}`

    return hex
}

function getWindowSize() {
    return {
        width: window.innerWidth - 20,
        height: window.innerHeight - 55,
    }
}

function readFileContent(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(e);
        reader.readAsText(file);
    });
}