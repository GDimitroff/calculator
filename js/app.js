const calculator = document.querySelector('.calculator');
const keys = calculator.querySelector('.calculator__keys');
const equationDisplay = calculator.querySelector('#display-equation');
const resultDisplay = calculator.querySelector('#display-result');

let previousKeyType = null;
let currentNumber = null;
let equation = [];

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
  if (type === 'equal') evaluate();

  calculator.dataset.previousKeyType = type;
  previousKeyType = type;
}

function appendNumber(number) {
  if (!currentNumber) {
    currentNumber = number;
  } else {
    currentNumber = equation.pop() + number;

    if (currentNumber[0] === '0' && currentNumber[1] !== '.') {
      currentNumber = currentNumber.slice(1);
    }
  }

  equation.push(currentNumber);
  equationDisplay.textContent = equation.join(' ');
  resultDisplay.textContent = handleEquation(equation);
}

function appendOperator(operator) {
  if (equation.length === 0) return;

  if (previousKeyType === 'operator') {
    equation.pop();
  }

  currentNumber = null;
  equation.push(operator);
  equationDisplay.textContent = equation.join(' ');
  resultDisplay.textContent = '';
}

function appendDecimal() {
  if (!currentNumber || currentNumber.includes('.')) return;

  currentNumber += '.';
  equation[equation.length - 1] = currentNumber;
  equationDisplay.textContent = equation.join(' ');
  resultDisplay.textContent = '';
}

function clearDisplay() {
  previousKeyType = null;
  currentNumber = null;
  equation = [];
  equationDisplay.textContent = '';
  resultDisplay.textContent = '';
}

function deleteNumber() {
  let number = equation.pop();

  if (!isNaN(Number(number))) {
    number = number.slice(0, number.length - 1);

    if (number) {
      currentNumber = number;
      equation.push(number);
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
    const lastNumber = equation[equation.length - 1];
    if (!isNaN(Number(lastNumber))) {
      currentNumber = lastNumber;
      resultDisplay.textContent = handleEquation(equation);
    } else {
      resultDisplay.textContent = '';
    }
  }

  equationDisplay.textContent = equation.join(' ');
}

function evaluate() {
  let finalResult;
  if (equation.length === 0) return;

  if (equation.length < 3) {
    if (equation[0].endsWith('.')) {
      finalResult = equation[0].slice(0, equation[0].length - 1);
    } else {
      finalResult = equation[0];
    }
  } else {
    finalResult = handleEquation(equation);
  }

  equationDisplay.textContent = finalResult;
  resultDisplay.textContent = '';

  currentNumber = finalResult.toString();
  equation = [];
  equation.push(currentNumber);
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
