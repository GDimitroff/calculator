const calculator = document.querySelector('.calculator');
const keys = calculator.querySelector('.calculator__keys');
const equation = calculator.querySelector('.calculator__display__equation');
const result = calculator.querySelector('.calculator__display__result');

let previousKeyType = null;
let currentNumber = null;
let currentEquation = [];

keys.addEventListener('click', (e) => {
  if (e.target === e.currentTarget) return;

  const key = e.target;
  const keyValue = key.textContent;
  const { type } = key.dataset;
  appendKey(type, keyValue);
});

function appendKey(type, keyValue) {
  if (type === 'number') appendNumber(keyValue);
  if (type === 'operator') appendOperator(keyValue);
  if (type === 'decimal') appendDecimal();
  if (type === 'clear') clearDisplay();
  if (type === 'delete') deleteNumber();

  calculator.dataset.previousKeyType = type;
  previousKeyType = type;
}

function appendNumber(number) {
  if (!currentNumber) {
    currentNumber = number;
  } else {
    currentNumber = currentEquation.pop() + number;
  }

  currentEquation.push(currentNumber);
  equation.textContent = currentEquation.join(' ');
  result.textContent = handleEquation(currentEquation);
}

function appendOperator(operator) {
  if (currentEquation.length === 0) return;

  if (previousKeyType === 'operator') {
    currentEquation.pop();
  }

  currentNumber = null;
  currentEquation.push(operator);
  equation.textContent = currentEquation.join(' ');
  result.textContent = '';
}

function appendDecimal() {
  if (!currentNumber || currentNumber.includes('.')) return;

  currentNumber += '.';
  currentEquation[currentEquation.length - 1] = currentNumber;
  equation.textContent = currentEquation.join(' ');
  result.textContent = '';
}

function clearDisplay() {
  previousKeyType = null;
  currentNumber = null;
  currentEquation = [];
  equation.textContent = '';
  result.textContent = '';
}

function deleteNumber() {
  let number = currentEquation.pop();

  if (!isNaN(Number(number))) {
    number = number.slice(0, number.length - 1);

    if (number) {
      currentNumber = number;
      currentEquation.push(number);
    } else {
      currentNumber = null;
    }
  }

  if (currentNumber && !currentNumber.endsWith('.')) {
    result.textContent = handleEquation(currentEquation);
  }

  if (currentNumber && currentNumber.endsWith('.')) {
    result.textContent = '';
  }

  if (!currentNumber) {
    if (!isNaN(Number(currentEquation[currentEquation.length - 1]))) {
      currentNumber = currentEquation[currentEquation.length - 1];
      result.textContent = handleEquation(currentEquation);
    } else {
      result.textContent = '';
    }
  }

  equation.textContent = currentEquation.join(' ');
}

function handleEquation(equation) {
  equation = equation.join(' ').split(' ');
  const operators = ['÷', '×', '−', '+'];
  let firstNumber;
  let secondNumber;
  let operator;
  let operatorIndex;
  let result;

  for (var i = 0; i < operators.length; i++) {
    while (equation.includes(operators[i])) {
      operatorIndex = equation.findIndex((item) => item === operators[i]);
      firstNumber = equation[operatorIndex - 1];
      operator = equation[operatorIndex];
      secondNumber = equation[operatorIndex + 1];
      result = calculate(firstNumber, operator, secondNumber);
      equation.splice(operatorIndex - 1, 3, result);
    }
  }

  return result;
}

function calculate(a, operator, b) {
  a = Number(a);
  b = Number(b);

  if (operator === '+') return a + b;
  if (operator === '−') return a - b;
  if (operator === '×') return a * b;
  if (operator === '÷') return a / b;
}
