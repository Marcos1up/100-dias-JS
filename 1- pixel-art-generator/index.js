let container = document.querySelector('.container');
let gridButton = document.getElementById('submit-grid');
let clearGridButton = document.getElementById('clear-grid');
let gridWidth = document.getElementById('width-range');
let gridHeight = document.getElementById('height-range');
let colorButton = document.getElementById('color-input');
let eraseBtn = document.getElementById('erase-btn');
let paintBtn = document.getElementById('paint-btn');
let widthValue = document.getElementById('width-value');
let heightValue = document.getElementById('height-value');
let downloadBtn = document.getElementById('download-btn');

let events = {
  mouse: {
    down: 'mousedown',
    move: 'mousemove',
    up: 'mouseup',
  },
  touch: {
    down: 'touchstart',
    move: 'touchmove',
    up: 'touchend',
  },
};

let deviceType = '';
let draw = false;
let erase = false;

// Detectar si es dispositivo táctil
const isTouchDevice = () => {
  try {
    document.createEvent('TouchEvent');
    deviceType = 'touch';
    return true;
  } catch (e) {
    deviceType = 'mouse';
    return false;
  }
};

isTouchDevice();

// Establecer valores iniciales
window.onload = () => {
  gridHeight.value = 16;
  gridWidth.value = 16;
  updateValueDisplays();
  setActiveToolButton(paintBtn);
};

// Actualizar los displays de valores
function updateValueDisplays() {
  widthValue.innerHTML =
    gridWidth.value < 10 ? `0${gridWidth.value}` : gridWidth.value;
  heightValue.innerHTML =
    gridHeight.value < 10 ? `0${gridHeight.value}` : gridHeight.value;
}

// Cambio de herramienta activa
function setActiveToolButton(activeButton) {
  // Remover clase activa de todos los botones
  document.querySelectorAll('.tool-btn').forEach((btn) => {
    btn.classList.remove('active');
  });

  // Añadir clase activa al botón seleccionado
  activeButton.classList.add('active');
}

// Crear la cuadrícula
gridButton.addEventListener('click', () => {
  container.innerHTML = '';
  let count = 0;

  for (let i = 0; i < gridHeight.value; i++) {
    count += 2;
    let div = document.createElement('div');
    div.classList.add('gridRow');

    for (let j = 0; j < gridWidth.value; j++) {
      count += 2;
      let col = document.createElement('div');
      col.classList.add('gridCol');
      col.setAttribute('id', `gridCol${count}`);

      // Eventos para dibujar
      col.addEventListener(events[deviceType].down, () => {
        draw = true;
        if (erase) {
          col.style.backgroundColor = 'transparent';
        } else {
          col.style.backgroundColor = colorButton.value;
        }
      });

      col.addEventListener(events[deviceType].move, (e) => {
        let elementId = document.elementFromPoint(
          !isTouchDevice() ? e.clientX : e.touches[0].clientX,
          !isTouchDevice() ? e.clientY : e.touches[0].clientY
        ).id;
        checker(elementId);
      });

      col.addEventListener(events[deviceType].up, () => {
        draw = false;
      });

      div.appendChild(col);
    }

    container.appendChild(div);
  }

  // Agregar borde a la cuadrícula
  container.style.border = '1px solid #ddd';
});

// Verificar qué elemento está bajo el cursor/dedo
function checker(elementId) {
  let gridColumns = document.querySelectorAll('.gridCol');
  gridColumns.forEach((element) => {
    if (elementId == element.id) {
      if (draw && !erase) {
        element.style.backgroundColor = colorButton.value;
      } else if (draw && erase) {
        element.style.backgroundColor = 'transparent';
      }
    }
  });
}

// Limpiar la cuadrícula
clearGridButton.addEventListener('click', () => {
  let gridColumns = document.querySelectorAll('.gridCol');
  gridColumns.forEach((element) => {
    element.style.backgroundColor = 'transparent';
  });
});

// Cambiar a modo borrador
eraseBtn.addEventListener('click', () => {
  erase = true;
  setActiveToolButton(eraseBtn);
});

// Cambiar a modo pintar
paintBtn.addEventListener('click', () => {
  erase = false;
  setActiveToolButton(paintBtn);
});

// Actualizar valores de los sliders
gridWidth.addEventListener('input', () => {
  widthValue.innerHTML =
    gridWidth.value < 10 ? `0${gridWidth.value}` : gridWidth.value;
});

gridHeight.addEventListener('input', () => {
  heightValue.innerHTML =
    gridHeight.value < 10 ? `0${gridHeight.value}` : gridHeight.value;
});

// Descargar la imagen
downloadBtn.addEventListener('click', () => {
  // Verificar que hay una cuadrícula para descargar
  if (container.children.length === 0) {
    alert('¡Primero crea una cuadrícula!');
    return;
  }

  // Crear un lienzo temporal para convertir el pixel art a imagen
  html2canvas(container).then((canvas) => {
    // Crear un enlace temporal para descargar
    const link = document.createElement('a');
    link.download = 'pixel-art.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  });
});

// Prevenir arrastrar en el navegador que puede interferir con el dibujo
document.addEventListener('dragstart', (e) => {
  e.preventDefault();
});

// Detener el dibujo cuando el mouse sale del container
container.addEventListener('mouseleave', () => {
  draw = false;
});

// Añadir script html2canvas para poder descargar (solo podría funcionar si se añade la librería)
function loadScript() {
  const script = document.createElement('script');
  script.src =
    'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
  document.body.appendChild(script);
}

loadScript();
