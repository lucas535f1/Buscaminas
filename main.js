let menu = document.getElementById('menu')
let grid
let ancho
let alto
let minas
let cantidadMinas
let minasRestantes
let descubiertos
let primerClick
let perdiste


function iniciar() {

    ancho = document.getElementById('ancho').value
    alto = document.getElementById('alto').value
    cantidadMinas = document.getElementById('minas').value
    //console.log(`alto: ${alto} ancho: ${ancho} cantidadMinas ${cantidadMinas}`)
    if (cantidadMinas=='' || alto=='' || ancho=='' || cantidadMinas=='0' || alto=='0' || ancho=='0') {
        alert('Debe ingresar valores mayores a 0')
        
    } else if (cantidadMinas >= ancho * alto) {
        alert('Hay mas minas que cuadrados')
    } else if(ancho*alto>8000){
        alert('No pueden haber mas de 8000 cuadrados')
    } else {
        perdiste = false
        primerClick = false
        descubiertos = 0
        minasRestantes = cantidadMinas
        actualizarContador()
        let divMenu = document.createElement('div')
        divMenu.classList.add('menu')
        divMenu.setAttribute('onclick', 'volverMenu()')
        divMenu.setAttribute('id', 'divMenu')
        divMenu.innerText = 'menu'
        document.body.append(divMenu)
        menu.remove()
        generateGrid(ancho, alto)
        generateCuadrados(ancho, alto)
    }
}
function generateMinas(cantidad, ancho, alto, cordY, cordX) {

    let numeros = []
    // console.log(cordY)
    // console.log(cordX)
    let nroCuadrado = (cordY * ancho) + (cordX % ancho)
    //console.log("Nro=" + nroCuadrado)
    for (let index = 0; index < ancho * alto; index++) {
        numeros[index] = index
    }
    numeros.splice(nroCuadrado, 1)
    //console.log(numeros.toString())

    let hayMinas = [];
    for (let index = 0; index < cantidad; index++) {
        let random = Math.floor(Math.random() * numeros.length)
        hayMinas[index] = numeros[random]
        numeros.splice(random, 1)
        //console.log(numeros.toString())
        //console.log(random)

    }
    //console.log(hayMinas.toString())

    let minas = []
    for (let y = 0; y < alto; y++) {
        minas[y] = [];
        for (let x = 0; x < ancho; x++) {
            minas[y][x] = false
        }

    }
    //console.log(minas)

    hayMinas.forEach(element => {
        let y = Math.floor(element / ancho)
        let x = element % ancho
        minas[y][x] = true
        //console.log(element + " x=" + x + " y=" + y)
    });

    //console.log(minas)
    return (minas)
}

function generateGrid(ancho, alto) {
    grid = document.createElement('div')
    grid.style.gridTemplateColumns = "repeat(" + ancho + ", 1fr)"
    grid.style.gridTemplateRows = "repeat(" + alto + ", 1fr)"
    grid.setAttribute('id', 'grid')
    grid.setAttribute('class', 'grid')
    document.body.appendChild(grid)
}

function generateCuadrados(ancho, alto) {
    for (let y = 0; y < alto; y++) {
        for (let x = 0; x < ancho; x++) {
            let cuadrado = document.createElement('div')
            cuadrado.setAttribute('class', 'cuadrado cubierto')
            cuadrado.setAttribute('id', y + '-' + x)
            cuadrado.setAttribute('yCord', y)
            cuadrado.setAttribute('xCord', x)

            document.getElementById('grid').appendChild(cuadrado)

            cuadrado.addEventListener('contextmenu', bloquearMenu)
            cuadrado.addEventListener('mousedown', entra)
            cuadrado.addEventListener('mouseover', entra)
            cuadrado.addEventListener('mouseup', sale)
            cuadrado.addEventListener('mouseleave', sale)
        }
    }
}


function izquierdo(e) {
    e.preventDefault()
    //console.log(e)
    //console.log('izquierdo')
    let cuadrado = e.srcElement
    //console.log(cuadrado)
    y = parseInt(cuadrado.getAttribute('yCord'))
    x = parseInt(cuadrado.getAttribute('xCord'))
    if (!cuadrado.hasAttribute('descubierto') && !cuadrado.hasAttribute('bloqueado')) {
        //console.log('entra a descubrir' + y + ' ' + x)
        descubrir(y, x)
    } else if (cuadrado.hasAttribute('descubierto')) {
        //console.log('entra a descubrirAlrededor' + y + ' ' + x)
        descubrirAlrededor(y, x)
    }
}
function bloquearMenu(e) {
    e.preventDefault()
    //console.log('bloquear')
}

// function derecho(e) {
//     e.preventDefault()
//     console.log('derecho')
//     let cuadrado = e.srcElement
//     y = parseInt(cuadrado.getAttribute('yCord'))
//     x = parseInt(cuadrado.getAttribute('xCord'))
//     if (!cuadrado.hasAttribute('descubierto')) {
//         if (cuadrado.hasAttribute('bloqueado')) {
//             desbloquear(y, x)
//         } else {
//             bloquear(y, x)
//         }

//     }
// }

function entra(e) {
    //console.log('entra')
    //console.log(e)
    let cuadrado = e.srcElement
    y = parseInt(cuadrado.getAttribute('yCord'))
    x = parseInt(cuadrado.getAttribute('xCord'))

    if (e.buttons === 2 && e.type === "mousedown" && !cuadrado.hasAttribute('descubierto')) {
        if (cuadrado.hasAttribute('bloqueado')) {
            desbloquear(y, x)
        } else {
            bloquear(y, x)
        }

    }

    if (!cuadrado.hasAttribute('bloqueado') && e.buttons === 1) {
        if (cuadrado.hasAttribute('descubierto')) {
            marcarAlrededor(y, x)
        } else {
            cuadrado.setAttribute('hold', '')
        }
    }
}

function sale(e) {
    e.preventDefault()
    //console.log('sale')
    //console.log(e)
    let cuadrado = e.srcElement
    y = parseInt(cuadrado.getAttribute('yCord'))
    x = parseInt(cuadrado.getAttribute('xCord'))

    if (!cuadrado.hasAttribute('bloqueado')) {
        if (cuadrado.hasAttribute('descubierto')) {
            desmarcarAlrededor(y, x)
        } else {
            cuadrado.removeAttribute('hold', '')
        }
    }

    if (e.type === 'mouseup' && e.which === 1) {
        if (!cuadrado.hasAttribute('descubierto') && !cuadrado.hasAttribute('bloqueado')) {
            ///console.log('entra a descubrir' + y + ' ' + x)
            descubrir(y, x)
        }
        else if (cuadrado.hasAttribute('descubierto')) {
            //console.log('entra a descubrirAlrededor' + y + ' ' + x)
            descubrirAlrededor(y, x)
        }
    }

}

function descubrir(y, x) {
    //console.log('descubrir')
    if (!primerClick) {
        //console.log('entra primerclick')
        minas = generateMinas(cantidadMinas, ancho, alto, y, x)
        primerClick = true
    }
    let cuadrado = document.getElementById(y + '-' + x)
    if (minas[y][x]) {
        perder()
        cuadrado.classList.add('mina-click')
    } else {
        descubiertos++
        cuadrado.setAttribute('descubierto', '')
        cuadrado.classList.add('vacio')
        if (descubiertos == ancho * alto - cantidadMinas && !perdiste) {
            ganar()
        }
        let numero = contarAlrededor(y, x)
        cuadrado.innerText = numero
        if (numero !== '') {
            cuadrado.classList.add('color' + numero)
        }
    }
}

function bloquear(y, x) {
    let cuadrado = document.getElementById(y + '-' + x)
    cuadrado.innerText = '`'
    cuadrado.setAttribute('bloqueado', '')
    //console.log('bloqueando')
    minasRestantes--
    actualizarContador()
}
function desbloquear(y, x) {
    let cuadrado = document.getElementById(y + '-' + x)
    cuadrado.innerText = ''
    cuadrado.removeAttribute('bloqueado')
    //console.log('desbloqueando')
    minasRestantes++
    actualizarContador()
}


function marcarAlrededor(y, x) {
    //console.log('marcarAlrededor')
    for (let indey = y - 1; indey < y + 2; indey++) {
        for (let index = x - 1; index < x + 2; index++) {
            if (minas[indey] != undefined) if (minas[indey][index] != undefined) {
                let cuadrado = document.getElementById(indey + '-' + index)
                if (!cuadrado.hasAttribute('bloqueado') && !cuadrado.hasAttribute('descubierto')) {
                    cuadrado.setAttribute('hold', '')
                }
            }
        }
    }
}

function desmarcarAlrededor(y, x) {
    //console.log('marcarAlrededor')
    for (let indey = y - 1; indey < y + 2; indey++) {
        for (let index = x - 1; index < x + 2; index++) {
            if (minas[indey] != undefined) if (minas[indey][index] != undefined) {
                let cuadrado = document.getElementById(indey + '-' + index)
                if (!cuadrado.hasAttribute('bloqueado') && !cuadrado.hasAttribute('descubierto')) {
                    cuadrado.removeAttribute('hold', '')
                }
            }
        }
    }
}

function contarAlrededor(y, x) {
    let contador = 0
    for (let indey = y - 1; indey < y + 2; indey++) {
        for (let index = x - 1; index < x + 2; index++) {
            if (minas[indey] != undefined) if (minas[indey][index] != undefined) contador += minas[indey][index];
        }
    }
    //console.log('contador:' + contador)
    if (contador == 0) {
        for (let indey = y - 1; indey < y + 2; indey++) {
            for (let index = x - 1; index < x + 2; index++) {
                if (minas[indey] != undefined) if (minas[indey][index] != undefined) {
                    if (!document.getElementById(indey + '-' + index).hasAttribute('descubierto') && !document.getElementById(indey + '-' + index).hasAttribute('bloqueado')) {
                        descubrir(indey, index)
                    }
                }
            }
        }
        contador = ''
    }
    return contador
}

function descubrirAlrededor(y, x) {
    let cuadrado = document.getElementById(y + '-' + x)
    let numero = parseInt(cuadrado.innerText)
    numero = isNaN(numero) ? 0 : numero;
    //console.log(numero)
    let contador = 0
    for (let indey = y - 1; indey < y + 2; indey++) {
        for (let index = x - 1; index < x + 2; index++) {
            if (minas[indey] != undefined) if (minas[indey][index] != undefined) {
                contador += document.getElementById(indey + '-' + index).hasAttribute('bloqueado')
            }
        }
    }
    //console.log('contador:' + contador)
    if (contador == numero) {
        for (let indey = y - 1; indey < y + 2; indey++) {
            for (let index = x - 1; index < x + 2; index++) {
                if (minas[indey] != undefined) if (minas[indey][index] != undefined) {
                    if (!document.getElementById(indey + '-' + index).hasAttribute('descubierto') && !document.getElementById(indey + '-' + index).hasAttribute('bloqueado')) {
                        descubrir(indey, index)
                    }
                }
            }
        }
    }

}

function mostrarMinas() {
    for (let y = 0; y < alto; y++) {
        for (let x = 0; x < ancho; x++) {
            if (minas[y][x]) {
                document.getElementById(y + '-' + x).setAttribute('class', 'cuadrado mina')
            }
        }
    }
}
function ganar() {
    mostrarMinas()
    document.body.appendChild(createMensaje('Ganaste'))

    //reiniciar()
}
function perder() {
    if(perdiste!=true){
    perdiste = true
    document.body.appendChild(createMensaje('Perdiste'))
    mostrarMinas()
    }
}
function createMensaje(texto) {
    let mensaje = document.createElement('div')
    mensaje.classList.add('mensaje')
    mensaje.setAttribute('id', 'mensaje')
    mensaje.setAttribute("onclick", "reiniciar()")
    mensaje.innerHTML = texto
    return mensaje
}

function volverMenu() {
    if (document.getElementById('mensaje') != undefined) {
        document.getElementById('mensaje').remove()
    }
    document.getElementById('divMenu').remove()
    grid.remove()
    minasRestantes = '*'
    actualizarContador()
    document.body.appendChild(menu)
}

function actualizarContador() {
    document.getElementById('minasRestantes').innerText = minasRestantes
}

function reiniciar() {
    volverMenu()
    iniciar()
}
