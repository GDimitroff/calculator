const calculator = document.querySelector('.calculator');
const keys = calculator.querySelector('.calculator__keys');
const equationDisplay = calculator.querySelector('#display-equation');
const resultDisplay = calculator.querySelector('#display-result');
const soundBtn = calculator.querySelector('.sound');
const clickSound = new Audio('./sounds/clickSound.mp3');

let sound = false;
let currentNumber = null;
let equation = [];

window.addEventListener('keyup', handleKeyboardInput);

keys.addEventListener('click', (e) => {
  if (e.target === e.currentTarget) return;

  const key = e.target;
  const keyValue = key.textContent;
  const { type } = key.dataset;
  appendKey(type, keyValue);

  key.classList.toggle('active');
  setTimeout(() => {
    key.classList.toggle('active');
  }, 50);
});

function appendKey(type, keyValue) {
  if (type === 'number' || type === 'operator' || type === 'point') {
    const length = equation.join('').length;
    if (length > 15) {
      resultDisplay.textContent = "Can't enter more than 20 characters!";
      return;
    }
  }

  if (type === 'number') appendNumber(keyValue);
  if (type === 'operator') setOperator(keyValue);
  if (type === 'point') appendPoint();
  if (type === 'clear') clearDisplay();
  if (type === 'delete') deleteNumber();
  if (type === 'equal') evaluate();
  if (type === 'sound') setSound();

  window.navigator.vibrate(50);

  if (sound) {
    clickSound.currentTime = 0;
    clickSound.play();
  }
}

function appendNumber(number) {
  equation.length === 0
    ? (currentNumber = null)
    : (currentNumber = equation.pop());

  if (isNaN(currentNumber)) {
    equation.push(currentNumber);
    currentNumber = null;
  }

  if (!currentNumber) {
    currentNumber = number;
  } else {
    currentNumber += number;

    if (currentNumber[0] === '0' && currentNumber[1] !== '.') {
      currentNumber = currentNumber.slice(1);
    }
  }

  equation.push(currentNumber);
  currentNumber = null;
  equationDisplay.textContent = equation.join(' ');
  resultDisplay.textContent = handleEquation(equation);
}

function setOperator(operator) {
  if (equation.length === 0) return;

  currentNumber = equation.pop();
  if (!isNaN(currentNumber)) {
    if (currentNumber.endsWith('.')) {
      currentNumber = currentNumber.slice(0, currentNumber.length - 1);
    }

    equation.push(currentNumber);
  }

  currentNumber = null;
  equation.push(operator);
  equationDisplay.textContent = equation.join(' ');
  resultDisplay.textContent = '';
}

function appendPoint() {
  if (equation.length === 0) {
    currentNumber = '0';
  } else {
    currentNumber = equation.pop();
  }

  if (currentNumber.includes('.')) {
    equation.push(currentNumber);
    return;
  }

  if (isNaN(currentNumber)) {
    equation.push(currentNumber);
    currentNumber = '0';
  }

  currentNumber += '.';
  equation.push(currentNumber);
  currentNumber = null;
  equationDisplay.textContent = equation.join(' ');
  resultDisplay.textContent = '';
}

function clearDisplay() {
  currentNumber = null;
  equation = [];
  equationDisplay.textContent = '';
  resultDisplay.textContent = '';
}

function deleteNumber() {
  currentNumber = equation.pop();

  if (!isNaN(Number(currentNumber))) {
    currentNumber = currentNumber.slice(0, currentNumber.length - 1);

    if (currentNumber.length === 1 && currentNumber[0] === '-') {
      currentNumber = null;
    }

    if (currentNumber) {
      equation.push(currentNumber);
    } else {
      currentNumber = null;
    }
  }

  if (currentNumber && !currentNumber.endsWith('.')) {
    resultDisplay.textContent = handleEquation(equation);
  }

  if (currentNumber && currentNumber.endsWith('.')) {
    resultDisplay.textContent = '';
  }

  if (!currentNumber) {
    currentNumber = equation[equation.length - 1];
    if (!isNaN(Number(currentNumber))) {
      resultDisplay.textContent = handleEquation(equation);
    } else {
      resultDisplay.textContent = '';
    }
  }

  equationDisplay.textContent = equation.join(' ');
}

function setSound() {
  soundBtn.classList.toggle('active');
  sound = soundBtn.classList.contains('active') ? true : false;
}

function evaluate() {
  if (equation.length === 0) return;

  let lastElement = equation[equation.length - 1];
  if (isNaN(lastElement)) {
    equation.pop();
  }

  if (lastElement.endsWith('.')) {
    lastElement = lastElement.slice(0, lastElement.length - 1);
    equation[equation.length - 1] = lastElement;
  }

  let finalResult;
  if (equation.length < 3) {
    finalResult = equation[0];
  } else {
    finalResult = handleEquation(equation);
  }

  finalResult = finalResult.toString();

  if (finalResult === "Can't divide by zero!") return;

  equationDisplay.textContent = finalResult;
  resultDisplay.textContent = '';

  equation = [];
  equation.push(finalResult);
}

function handleEquation(equation) {
  equation = equation.join(' ').split(' ');
  let firstNumber;
  let secondNumber;
  let operator;
  let operatorIndex;
  let result;

  while (equation.includes('÷') || equation.includes('×')) {
    operatorIndex = equation.findIndex((item) => item === '÷' || item === '×');

    firstNumber = equation[operatorIndex - 1];
    operator = equation[operatorIndex];
    secondNumber = equation[operatorIndex + 1];

    if (operator === '÷' && secondNumber === '0') {
      return "Can't divide by zero!";
    }

    result = calculate(firstNumber, operator, secondNumber);
    equation.splice(operatorIndex - 1, 3, result);
  }

  while (equation.includes('+') || equation.includes('−')) {
    operatorIndex = equation.findIndex((item) => item === '+' || item === '−');

    firstNumber = equation[operatorIndex - 1];
    operator = equation[operatorIndex];
    secondNumber = equation[operatorIndex + 1];

    result = calculate(firstNumber, operator, secondNumber);
    equation.splice(operatorIndex - 1, 3, result);
  }

  if (result || result === 0) {
    return Math.round(result * 100 + Number.EPSILON) / 100;
  }
}

function calculate(a, operator, b) {
  a = Number(a);
  b = Number(b);

  if (operator === '+') return a + b;
  if (operator === '−') return a - b;
  if (operator === '×') return a * b;
  if (operator === '÷') return a / b;
}

function handleKeyboardInput(e) {
  if (e.key === ' ' || e.code === 'Space' || e.keyCode === 32) return;
  if (e.key >= 0 && e.key <= 9) appendKey('number', e.key);
  if (e.key === '.') appendKey('point');
  if (e.key === '=' || e.key === 'Enter') appendKey('equal');
  if (e.key === 'Backspace') appendKey('delete');
  if (e.key === 'Escape') appendKey('clear');
  if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
    const operators = {
      '+': '+',
      '-': '−',
      '/': '÷',
      '*': '×',
    };

    appendKey('operator', operators[e.key]);
  }
}
