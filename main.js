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
//let ganaste


function iniciar() {
    //Tomo los valores ingresados
    ancho = document.getElementById('ancho').value
    alto = document.getElementById('alto').value
    cantidadMinas = document.getElementById('minas').value
    //Compruebo que sean validos
    if (cantidadMinas == '' || alto == '' || ancho == '' || cantidadMinas == '0' || alto == '0' || ancho == '0') {
        alert('Debe ingresar valores mayores a 0')
    } else if (cantidadMinas >= ancho * alto) {
        alert('Hay mas minas que cuadrados')
    } else if (ancho * alto > 8000) {
        alert('No pueden haber mas de 8000 cuadrados')
    } else {
        //Reseteo los valores e inicializo el tablero
        perdiste = false
        //ganaste = false
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

    //genero un array con todos los numeros
    let numeros = []
    for (let index = 0; index < ancho * alto; index++) {
        numeros[index] = index
    }
    //Calculo el nro de cuadrado donde no quiero se generen minas
    let nroCuadrado = (cordY * ancho) + (cordX % ancho)
    //Elimino el cuadrado del array
    numeros.splice(nroCuadrado, 1)

    let hayMinas = [];
    //Saco aleatoriamente numeros del array de los cuadrados y los pongo en el aray hay minas
    for (let index = 0; index < cantidad; index++) {
        let random = Math.floor(Math.random() * numeros.length)
        hayMinas[index] = numeros[random]
        numeros.splice(random, 1)
    }
    //Creo una matriz que representa cada cuadrado 
    let minas = []
    for (let y = 0; y < alto; y++) {
        minas[y] = [];
        for (let x = 0; x < ancho; x++) {
            minas[y][x] = false
        }

    }
    //Para cada cuadrado que tiene minas calculo sus coordenadas y los marco en la matriz minas
    hayMinas.forEach(element => {
        let y = Math.floor(element / ancho)
        let x = element % ancho
        minas[y][x] = true
    });

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
            //Creo el cuadrado
            let cuadrado = document.createElement('div')
            cuadrado.setAttribute('class', 'cuadrado cubierto')
            cuadrado.setAttribute('id', y + '-' + x)
            cuadrado.setAttribute('yCord', y)
            cuadrado.setAttribute('xCord', x)
            //Inserto el cuadrado en la grid
            document.getElementById('grid').appendChild(cuadrado)
            //Añado aventListeners al cuadrado
            cuadrado.addEventListener('contextmenu', bloquearMenu)
            cuadrado.addEventListener('mousedown', entra)
            cuadrado.addEventListener('mouseover', entra)
            cuadrado.addEventListener('mouseup', sale)
            cuadrado.addEventListener('mouseleave', sale)
        }
    }
}

function bloquearMenu(e) {
    e.preventDefault()
    //console.log('bloquear')
}


function entra(e) {
    //Si el juego finalizo sale
    if (perdiste /*|| ganaste*/) return;
    //Obtengo el cuadrado y sus coordenadas
    let cuadrado = e.srcElement
    y = parseInt(cuadrado.getAttribute('yCord'))
    x = parseInt(cuadrado.getAttribute('xCord'))

    //Click derecho sobre un cuadrado cubierto
    if (e.buttons === 2 && e.type === "mousedown" && !cuadrado.hasAttribute('descubierto')) {
        if (cuadrado.hasAttribute('bloqueado')) {
            desbloquear(y, x)
        } else {
            bloquear(y, x)
        }

    }
    //Click izquierdo sobre un cuadrado no bloqueado
    if (!cuadrado.hasAttribute('bloqueado') && e.buttons === 1) {
        if (cuadrado.hasAttribute('descubierto')) {
            marcarAlrededor(y, x)
        } else {
            cuadrado.setAttribute('hold', '')
        }
    }
}

function sale(e) {
    //Si el juego finalizo sale
    if (perdiste /*|| ganaste*/) return;
    //Obtengo el cuadrado y sus coordenadas
    let cuadrado = e.srcElement
    y = parseInt(cuadrado.getAttribute('yCord'))
    x = parseInt(cuadrado.getAttribute('xCord'))

    //Al dejar se hacer click sobre un cuadrado desbloqueado se desmarca
    if (!cuadrado.hasAttribute('bloqueado')) {
        if (cuadrado.hasAttribute('descubierto')) {
            desmarcarAlrededor(y, x)
        } else {
            cuadrado.removeAttribute('hold', '')
        }
    }
    //Si se levanta el click izquierdo sobre el cuadrado se descubre
    if (e.type === 'mouseup' && e.which === 1) {
        if (!cuadrado.hasAttribute('descubierto') && !cuadrado.hasAttribute('bloqueado')) {
            descubrir(y, x)
        }
        else if (cuadrado.hasAttribute('descubierto')) {
            descubrirAlrededor(y, x)
        }
    }

}

function descubrir(y, x) {
    if(perdiste) return;
    //Si es el primer click genero las minas
    if (!primerClick) {
        //console.log('entra primerclick')
        minas = generateMinas(cantidadMinas, ancho, alto, y, x)
        primerClick = true
    }
    //Obtengo el cuadrado
    let cuadrado = document.getElementById(y + '-' + x)
    //Si en el cuadrado hay una mina perdist

    if (minas[y][x]) {
        perder()
        cuadrado.classList.add('mina-click')
    } else {
        descubiertos++
        cuadrado.setAttribute('descubierto', '')
        cuadrado.classList.add('vacio')
        //Si descubriste todos los cuadrados ganaste
        if (descubiertos == ancho * alto - cantidadMinas && !perdiste) {
            ganar()
        }
        //Se calcula y pone el numero en cuadrado
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
    minasRestantes--
    actualizarContador()
}
function desbloquear(y, x) {
    let cuadrado = document.getElementById(y + '-' + x)
    cuadrado.innerText = ''
    cuadrado.removeAttribute('bloqueado')
    minasRestantes++
    actualizarContador()
}


function marcarAlrededor(y, x) {
    //Recorro los cuadrados de alrededor del cuadrado
    for (let indey = y - 1; indey < y + 2; indey++) {
        for (let index = x - 1; index < x + 2; index++) {
            //Si el cuadrado existe y no esta bloqueado o descubierto lo marco
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
    //Recorro los cuadrados de alrededor del cuadrado
    for (let indey = y - 1; indey < y + 2; indey++) {
        for (let index = x - 1; index < x + 2; index++) {
            //Si el cuadrado existe y no esta bloqueado o descubierto lo marco
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
    //Recorro los cuadrados de alrededor del cuadrado y cuento cuantas minas hay
    for (let indey = y - 1; indey < y + 2; indey++) {
        for (let index = x - 1; index < x + 2; index++) {
            if (minas[indey] != undefined) if (minas[indey][index] != undefined) contador += minas[indey][index];
        }
    }
    //Si no hay minas descubro los cuadrados de alrededor que no esten bloqueados o descubiertos
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
    let contador = 0
    //Cuento cuantas cuadrados bloqueados hay alrededor del cuadrado
    for (let indey = y - 1; indey < y + 2; indey++) {
        for (let index = x - 1; index < x + 2; index++) {
            if (minas[indey] != undefined) if (minas[indey][index] != undefined) {
                contador += document.getElementById(indey + '-' + index).hasAttribute('bloqueado')
            }
        }
    }
    //Si coincide el numero del cuadrado con los cuadrados de alrededor bloqueados descubro los que no estan bloqueados
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
    //Recorro todas las minas y muestro las que no estan bloqueadas
    for (let y = 0; y < alto; y++) {
        for (let x = 0; x < ancho; x++) {
            if (minas[y][x]) {
                cuadrado = document.getElementById(y + '-' + x)
                if (!cuadrado.hasAttribute('bloqueado')) {
                    cuadrado.setAttribute('class', 'cuadrado mina')
                }
            }
        }
    }
}
function descurbirBanderas() {
    //Busco todas los cuadrados bloqueados
    let banderas = document.querySelectorAll('[bloqueado]');
    banderas.forEach(bandera => {
        let y = bandera.getAttribute('ycord');
        let x = bandera.getAttribute('xcord');
        //Marco los que estan bloqueados pero no tieen minas
        if (!minas[y][x]) {
            bandera.innerHTML = 'X'
            bandera.classList.add('fallo')
        }
    });
}
function ganar() {
    mostrarMinas()
    document.body.appendChild(createMensaje('Ganaste'))
    perdiste = true
}
function perder() {
    perdiste = true
    document.body.appendChild(createMensaje('Perdist'))
    mostrarMinas()
    descurbirBanderas()
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
