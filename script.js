let apiUrlAll = 'https://api.exchangeratesapi.io/latest';
let apiUrl = 'https://api.exchangeratesapi.io/latest?base=';
let defaultCurrency = 'USD';

function loadSelectors() {
    let currencySelect = document.querySelector('select');
    fetch(apiUrlAll)
        .then(response => response.json())
        .then(response => {
            let currencies = Object.keys(response.rates);
            for (const index in currencies) {
                let currency = (currencies[index]);
                let option = document.createElement('option');
                option.appendChild(document.createTextNode(currency));
                option.value = currency;
                currencySelect.appendChild(option);
            }
        })
}

function getRates(currency) {
    newApiUrl = apiUrl + currency;
    fetch(newApiUrl)
        .then(response => response.json())
        .then(response => {
            let innerHtml = '';
            for (const property in response.rates) {
                if (response.rates.hasOwnProperty(property)) {
                    const row = `1${response.base} = ${response.rates[property]}${property}`;
                    const rowHtml = `<p>${row}</p>`;
                    innerHtml += rowHtml;
                }
            }
            document.querySelector('.container').innerHTML = innerHtml;
        })
}

function showRatesOnSelectorChange() {
    let currencySelect = document.querySelector('select');
    currencySelect.addEventListener('change', (event) => {
        let currency = event.target.value;
        getRates(currency);
    });
}

(() => {
    loadSelectors();
    getRates(defaultCurrency);
    showRatesOnSelectorChange();
})();