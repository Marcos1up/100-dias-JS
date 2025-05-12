const lengthSlider = document.querySelector('.pass-length input');
const options = document.querySelectorAll('.option input');
const copyIcon = document.querySelector('.input-box span');
const passwordInput = document.querySelector('.input-box input');
const passIndicator = document.querySelector('.pass-indicator');
const generateBtn = document.querySelector('.generate-btn');

const characters = {
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  symbols: '!$%&|[](){}:;.,*+-#@<>~',
};

//funcion para generar la pasword
const generatePassword = () => {
  let staticPassword = '',
    randomPassword = '',
    excludeDuplicate = false,
    passLength = lengthSlider.value;

  let optionsSelected = false;

  //checkbox
  options.forEach((option) => {
    if (option.checked) {
      if (option.id !== 'exc-duplicate' && option.id !== 'spaces') {
        staticPassword += characters[option.id];
        optionsSelected = true;
      } else if (option.id === 'spaces') {
        staticPassword += ' ';
        optionsSelected = true;
      } else if (option.id === 'exc-duplicate') {
        excludeDuplicate = true;
      }
    }
  });

  //seleccionar min por defecto
  if (!optionsSelected) {
    staticPassword = characters.lowercase;
    document.getElementById('lowercase').checked = true;
  }

  //generar la pass
  for (let i = 0; i < passLength; i++) {
    if (
      excludeDuplicate &&
      staticPassword.length < passLength &&
      randomPassword.length >= staticPassword.length
    ) {
      break;
    }

    let randomIndex = Math.floor(Math.random() * staticPassword.length);
    let randomChar = staticPassword[randomIndex];

    if (excludeDuplicate) {
      if (!randomPassword.includes(randomChar)) {
        randomPassword += randomChar;
      } else {
        i--;
      }
    } else {
      randomPassword += randomChar;
    }
  }

  passwordInput.value = randomPassword;
};

//segridad de la passs
const updatePassIndicator = () => {
  passIndicator.id =
    lengthSlider.value <= 8
      ? 'weak'
      : lengthSlider.value <= 16
      ? 'medium'
      : 'strong';
};

//actualizar el slidder
const updateSlider = () => {
  document.querySelector('.pass-length span').innerText = lengthSlider.value;
  updatePassIndicator();
  generatePassword();
};

updateSlider();

//copiar la pass
const copyPassword = () => {
  if (passwordInput.value) {
    navigator.clipboard.writeText(passwordInput.value);
    copyIcon.innerText = 'check';
    copyIcon.style.color = '#4361ee';
    setTimeout(() => {
      copyIcon.innerText = 'copy_all';
      copyIcon.style.color = '#495057';
    }, 1500);
  }
};

copyIcon.addEventListener('click', copyPassword);
lengthSlider.addEventListener('input', updateSlider);
generateBtn.addEventListener('click', generatePassword);

window.addEventListener('load', generatePassword);
