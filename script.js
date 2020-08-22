var apiUrl = 'https://api.exchangeratesapi.io/latest?base=';

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

(() => {
    let base = document.querySelector('select');

    base.addEventListener('change', (event) => {
        let currency = event.target.value;
        getRates(currency);
    });
})();