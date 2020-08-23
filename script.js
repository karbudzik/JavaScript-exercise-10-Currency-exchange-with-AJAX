let apiUrlAll = 'https://api.exchangeratesapi.io/latest';
let apiUrl = 'https://api.exchangeratesapi.io/latest?base=';
let apiURLForDiagram = 'https://api.exchangeratesapi.io/history?start_at=2020-01-01&end_at=2020-08-01&symbols=EUR&base=';
let defaultCurrency = 'USD';
let dates = ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'];
let rates = [12, 19, 3, 5, 2, 3];

function loadSelectors(idCurrency) {
    let currencySelect = document.querySelector(idCurrency);
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
    newApiUrl = apiURLForDiagram + currency;
    fetch(newApiUrl)
        .then(response => response.json())
        .then(response => {
            console.log(response);
            let currencies = Object.keys(response.rates);
            for (const property in currencies) {
              
                    let date = (currencies[property]);
                    let currencyAndRate = Object.values(response.rates[date]);
                    let rate = currencyAndRate[0];
                    
                    console.log(date);
                    console.log(rate);
                
            }
            console.log(rates);
        })
}

function showRatesOnSelectorChange() {
    let currencySelect = document.querySelector('select');
    currencySelect.addEventListener('change', (event) => {
        let currency = event.target.value;
        getRates(currency);
    });
}

function displayDiagram(){
    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: '# of Votes',
                data: rates,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: false,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}

(() => {
    loadSelectors('#currency-one');
    loadSelectors('#currency-two');
    getRates(defaultCurrency);
    // showRatesOnSelectorChange();
    displayDiagram();
})();
