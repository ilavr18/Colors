const columnsListElement = document.getElementById('columns-list')
const columnElement = document.getElementById('column')

window.addEventListener("load", () => {
    renderColorsColumns(6)
    setColors(document.location.hash)
})

window.addEventListener("click", ev => {
    const target = ev.target
    const dataType = target.dataset.type

    if (dataType === 'copy') {
        navigator.clipboard.writeText(target.textContent)
            .then(() => showCopiedNotification(target, ev.pageX, ev.pageY))
    } else if (target.closest('.colors__btn')) {
        toggleLockClass(target)
    } else {
        setRandomColors()
    }
})

window.onkeydown = (ev => {
    if (ev.code === "Space") {
        ev.preventDefault()
        setRandomColors()
    }
})

function renderColorsColumns(n) {
    for (let i = 0; i < n - 1; i++)
        columnsListElement.insertAdjacentHTML('beforeend', columnElement.outerHTML)
}

function setColors(colorsHash = null) {
    if (colorsHash) setColorsFromHash(colorsHash)
    else setRandomColors()
}

function setRandomColors() {
    const colorsColumns = document.querySelectorAll('.colors__item')
    let colorsHash = ''

    colorsColumns.forEach(column => {
        if (column.querySelector('.colors__btn').children[0].className !== 'fa-solid fa-lock') {
            const color = chroma.random()
            colorsHash += color.toString().substring(1) + '-';
            setColor(column, color)
        } else {
            colorsHash += rgbToHex(column.style.backgroundColor).substring(1) + '-';
        }
    })
    document.location.hash = colorsHash.substring(0, colorsHash.length - 1)
}

function setColorsFromHash(colorsHash) {
    const colors = parseColorsFromHash(colorsHash)
    const colorsColumns = document.querySelectorAll('.colors__item')

    colorsColumns.forEach((column, i) => setColor(column, colors[i]))
}

function setColor(column, color) {
    column.style.backgroundColor = color

    const textElements = Array.from(
        column.querySelectorAll('.colors__title, .colors__btn, .colors__copied')
    )

    textElements.forEach(el => setTextBlockStyle(el, color))
}

function setTextBlockStyle(el, color) {
    if (el.className === 'colors__title') el.textContent = color
    else if (el.className === 'colors__copied') setBgColor(el, color)
    setTextColor(el, color)
}

function setTextColor(textElement, color) {
    const luminance = chroma(color).luminance()
    textElement.style.color = luminance > 0.5 ? 'black' : 'white'
}

function setBgColor(textElement, color) {
    const luminance = chroma(color).luminance()
    if (luminance > 0.5) textElement.style.backgroundColor = 'rgba(255, 255, 255, 0.5)'
    else textElement.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'
}

function showCopiedNotification(target, x, y) {
    const copiedElement = target.parentElement.querySelector('.colors__copied')
    copiedElement.style.opacity = '1'
    setTimeout(() => copiedElement.style.opacity = '0', 1000)
}

function toggleLockClass(target) {
    if (target.tagName.toLowerCase() !== 'i') target = target.children[0]
    target.classList.toggle('fa-lock-open')
    target.classList.toggle('fa-lock')
}

function parseColorsFromHash(colorsHash) {
    return colorsHash
        .substring(1)
        .split('-')
        .map(code => '#' + code)
}

function rgbToHex(rgb) {
    rgb = rgb.substring(4, rgb.length - 1)
    const [r, g, b] = rgb.split(", ").map(el => +el)
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}