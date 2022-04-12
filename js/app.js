const calculator = document.querySelector('.calculator');
const keys = calculator.querySelector('.calculator__keys');
const equation = calculator.querySelector('.calculator__display__equation');
const result = calculator.querySelector('.calculator__display__result');

const equalBtn = calculator.querySelector('.equal');
const clearBtn = calculator.querySelector('.clear');
const deleteBtn = calculator.querySelector('.delete');

let currentEquation = '0';
let previousKeyType = null;

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

  calculator.dataset.previousKeyType = type;
  previousKeyType = type;
}

function appendNumber(number) {
  if (currentEquation === '0') {
    equation.textContent = number;
    currentEquation = number;
  } else {
    equation.textContent = currentEquation + number;
    currentEquation += number;
  }

  if (currentEquation !== '0') {
    result.textContent = handleEquation(currentEquation);
  }
}

function appendOperator(operator) {
  if (previousKeyType === 'operator') {
    currentEquation = currentEquation.slice(0, currentEquation.length - 3);
  }

  currentEquation += ' ' + operator + ' ';
  equation.textContent = currentEquation;
  result.textContent = '';
}

function handleEquation(equation) {
  equation = equation.split(' ');
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
