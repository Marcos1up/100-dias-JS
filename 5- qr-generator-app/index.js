const download = document.querySelector('.download');
const dark = document.querySelector('.dark');
const light = document.querySelector('.light');
const qrContainer = document.querySelector('#qr-code');
const qrText = document.querySelector('.qr-text');
const shareBtn = document.querySelector('.share-btn');
const sizes = document.querySelector('.sizes');

dark.addEventListener('input', handleDarkColor);
light.addEventListener('input', handleLightColor);
qrText.addEventListener('input', handleQRText);
sizes.addEventListener('change', handleSize);
shareBtn.addEventListener('click', handleShare);

const defaultUrl = 'itsmarcos.1up@gmail.com';
let colorLight = '#fff',
  colorDark = '#000',
  text = defaultUrl,
  size = 300;

//funciones para los colores
function handleDarkColor(e) {
  colorDark = e.target.value;
  generateQRCode();
}

function handleLightColor(e) {
  colorLight = e.target.value;
  generateQRCode();
}

function handleQRText(e) {
  const value = e.target.value;
  text = value;
  if (!value) {
    text = defaultUrl;
  }
  generateQRCode();
}

//generar qr
async function generateQRCode() {
  qrContainer.innerHTML = '';

  //problema con acentos
  const encodedText = encodeURIComponent(text);

  new QRCode('qr-code', {
    text: encodedText,
    height: size,
    width: size,
    colorLight,
    colorDark,
    correctLevel: QRCode.CorrectLevel.H,
  });

  download.href = await resolveDataUrl();
}

//compartir el qr
async function handleShare() {
  setTimeout(async () => {
    try {
      const base64url = await resolveDataUrl();
      const blob = await (await fetch(base64url)).blob();
      const file = new File([blob], 'QRCode.png', {
        type: blob.type,
      });

      await navigator.share({
        files: [file],
        title: text,
      });
    } catch (error) {
      alert('Tu navegador no soporta compartir archivos');
    }
  }, 100);
}

function handleSize(e) {
  size = e.target.value;
  generateQRCode();
}

//resolver la url del qr una vez generado
function resolveDataUrl() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const img = document.querySelector('#qr-code img');
      if (img && img.currentSrc) {
        resolve(img.currentSrc);
        return;
      }
      const canvas = document.querySelector('#qr-code canvas');
      if (canvas) {
        resolve(canvas.toDataURL());
      } else {
        reject('No se pudo generar la imagen QR');
      }
    }, 50);
  });
}

generateQRCode();
