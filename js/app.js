const calculator = document.querySelector('.calculator');
const keys = calculator.querySelector('.calculator__keys');
const display = calculator.querySelector('.calculator__display');

keys.addEventListener('click', (event) => {
  if (event.currentTarget === event.target) return;

  const key = event.target;
  const keyValue = key.textContent;
  const displayValue = display.textContent;
  const { type } = key.dataset;
  const { previousKeyType } = calculator.dataset;

  if (type === 'settings') {
    console.log(key);
  }

  if (type === 'number') {
    if (displayValue === '0' || previousKeyType === 'operator') {
      display.textContent = keyValue;
    } else {
      display.textContent = displayValue + keyValue;
    }
  }

  if (type === 'operator') {
    const operatorsKeys = keys.querySelectorAll('[data-type="operator"]');
    operatorsKeys.forEach((el) => (el.dataset.state = ''));
    key.dataset.state = 'selected';

    calculator.dataset.firstNumber = displayValue;
    calculator.dataset.operator = key.dataset.key;
  }

  if (type === 'equal') {
    const firstNumber = calculator.dataset.firstNumber;
    const operator = calculator.dataset.operator;
    const secondNumber = displayValue;

    let result = calculate(operator, firstNumber, secondNumber);
    display.textContent = result;
  }

  calculator.dataset.previousKeyType = type;
});

function calculate(operator, a, b) {
  a = parseInt(a);
  b = parseInt(b);

  if (operator === 'plus') return a + b;
  if (operator === 'minus') return a - b;
  if (operator === 'times') return a * b;
  if (operator === 'divide') return a / b;
}
