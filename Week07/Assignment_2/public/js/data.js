export default async function getData() {
    const response = await fetch('http://localhost:3000/data');
    const data = await response.json();

    const number1 = document.getElementById('number1');
    const number2 = document.getElementById('number2');
    const outcome = document.getElementById('outcome');
    const select = document.querySelector('.form-select');
    const selectedValue = select.value;
    if (!data) {
        outcome.setAttribute('hidden', '');
    } else {
        number1.value = data.number1;
        number2.value = data.number2;
        outcome.textContent = data.outcome;
        if (data.operation != selectedValue) {
            select.value = data.operation;
        }
    }
}
