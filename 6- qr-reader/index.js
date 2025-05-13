const wrapper = document.querySelector('.wrapper');
const form = document.querySelector('form');
const fileInp = document.querySelector('input');
const infoText = document.querySelector('p');
const closeBtn = document.querySelector('.close');
const copyBtn = document.querySelector('.copy');

//fecht a la api
function fetchRequest(file, formdata) {
  infoText.innerText = 'Escaneando codigo QR...';

  fetch('http://api.qrserver.com/v1/read-qr-code/', {
    method: 'POST',
    body: formdata,
  })
    .then((res) => res.json())
    .then((result) => {
      let rawData = result[0].symbol[0].data;

      let decodedData = rawData ? decodeURIComponent(rawData) : null;

      infoText.innerText = decodedData
        ? 'Escaneo exitoso!'
        : 'No se pudo escanear el codigo QR';

      if (!decodedData) return;

      // Mostrar resultados del escaneo
      document.querySelector('textarea').innerText = decodedData;
      form.querySelector('img').src = URL.createObjectURL(file);
      wrapper.classList.add('active');
    })
    .catch(() => {
      infoText.innerText = 'No se pudo escanear el codigo QR';
    });
}

//enviar datos a la api
fileInp.addEventListener('change', async (e) => {
  let file = e.target.files[0];

  if (!file) return;

  let formdata = new FormData();
  formdata.append('file', file);
  fetchRequest(file, formdata);
});

copyBtn.addEventListener('click', () => {
  const textarea = document.querySelector('textarea');

  textarea.disabled = false;

  textarea.select();
  document.execCommand('copy'); //execCommand para copiar

  textarea.disabled = true;
});

//abrir el explorador de archivos
form.addEventListener('click', () => fileInp.click());

closeBtn.addEventListener('click', () => {
  wrapper.classList.remove('active');
  fileInp.value = ''; // corregir bug de scaneo de nuevo qr
});
