const firstSelect = document.querySelector('[data-first-select]');
const secondSelect = document.querySelector('[data-second-select]');

const comparisonInfo = document.querySelector('[data-comparison-info]');
const swapBtn = document.querySelector('[data-swap-btn]');

const inputFirst = document.querySelector('[data-first-input]');
const inputSecond = document.querySelector('[data-second-input]');

const BASE_URL = 'https://open.er-api.com/v6/latest';
const FIRST_CURRENCY = 'USD';
const SECOND_CURRENCY = 'BYN';

let rates = {};

//select event  - обработчик события выбора валюты

firstSelect.addEventListener('change', () => updateExchangeRate());
secondSelect.addEventListener('change', () => renderInfo());

//input event - обработчик события ввода данных

inputFirst.addEventListener('input', () => {
    inputSecond.value = (inputFirst.value * rates[secondSelect.value]).toFixed(2);
})

inputSecond.addEventListener('input', () => {
    inputFirst.value = (inputSecond.value / rates[secondSelect.value]).toFixed(2);
})

//swap event - обработчик события переключения валют

swapBtn.addEventListener('click', () => {
    [firstSelect.value, secondSelect.value] = [secondSelect.value, firstSelect.value];
    updateExchangeRate()
})

//updateExchangeRate - обновляем данные по валюте

const updateExchangeRate = async () => {
    try {
        const response = await fetch(`${BASE_URL}/${firstSelect.value}`);
        const data = await response.json();
        rates = data.rates;
        renderInfo();
    } catch (error) {
        console.error(error);
    }
}


//render info - рендерим информацию

const renderInfo = () => {
    comparisonInfo.textContent = `1 ${firstSelect.value}  = ${rates[secondSelect.value]} ${secondSelect.value} `;
    inputFirst.value = rates[firstSelect.value];
    inputSecond.value = rates[secondSelect.value];
}

//populate selects - заполняем select

const populateSelects = () => {
    firstSelect.innerHTML = '';
    secondSelect.innerHTML = '';

    for (const currency of Object.keys(rates)) {
        firstSelect.innerHTML += `<option value="${currency}" ${currency === FIRST_CURRENCY ? 'selected' : ''}>${currency}</option>`;
        secondSelect.innerHTML += `<option value="${currency}" ${currency === SECOND_CURRENCY ? 'selected' : ''}>${currency}</option>`;
    }
}

// getInitialRates - получаем данные по валюте

    const getInitialRates = async () => {
        try {
            const response = await fetch(`${BASE_URL}/${FIRST_CURRENCY}`);
            const data = await response.json();
            rates = data.rates;
            populateSelects();
            renderInfo();
        } catch (error) {
            console.error(error);
        }
    }

getInitialRates();
