const calculator = document.querySelector('.calculator');
const keys = calculator.querySelector('.calculator__keys');
const display = calculator.querySelector('.calculator__display');

keys.addEventListener('click', (event) => {
  if (event.currentTarget === event.target) return;

  const key = event.target;
  const keyValue = key.textContent;
  const displayValue = display.textContent;

  // Is this a settings key?
  if (key.dataset.type === 'settings') {
    console.log(key);
  }

  // Is this a number key?
  if (key.dataset.type === 'number') {
    if (displayValue === '0') {
      display.textContent = keyValue;
    } else {
      display.textContent = displayValue + keyValue;
    }
  }

  // Is this an operator key?

  if (key.dataset.type === 'operator') {
    console.log(key);

    calculator.dataset.previousKeyType = 'operator';
  }
});

function operate(operator, a, b) {
  a = Number(a);
  b = Number(b);

  switch (operator) {
    case '+':
      return add(a, b);
    case '-':
      return subtract(a, b);
    case '*':
      return multiply(a, b);
    case '/':
      return divide(a, b);
    default:
      return null;
  }
}

function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  return a / b;
}
