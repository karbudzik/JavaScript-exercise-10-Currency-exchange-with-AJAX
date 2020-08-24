let apiUrlAll = 'https://api.exchangeratesapi.io/latest';
let apiUrl = 'https://api.exchangeratesapi.io/latest?base=';
let apiURLForDiagram = 'https://api.exchangeratesapi.io/history?start_at=2020-01-01&end_at=2020-08-01&symbols=';
let currencyBase = 'USD';
let currencyTo = 'EUR';
let dates = [];
let rates = [];
let mychart;
let firstRun = true;

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

function getRates() {
    newApiUrl = `${apiURLForDiagram}` + currencyTo + '&base=' + currencyBase;
    fetch(newApiUrl)
        .then(response => response.json())
        .then(response => {
            dates = [];
            rates = [];
            // console.log(response);
            let currencies = Object.keys(response.rates);
            currencies.sort(function(a,b){
                return new Date(a) - new Date(b)
              })
            // console.log(currencies);
            for (const property in currencies) {
              
                    let date = (currencies[property]);
                    let currencyAndRate = Object.values(response.rates[date]);
                    let rate = currencyAndRate[0];
                    
                    dates.push(date);
                    rates.push(rate);  
            }
            if(firstRun){
                displayDiagram();
                firstRun = false;  
            }else{
                updateDiagram(dates, rates);
            }
            
        })
}

function updateDiagram(dates, rates){
    console.log("update");
    console.log(mychart);
    mychart.data.datasets[0].data = rates;
    mychart.data.labels = dates;
    mychart.data.datasets[0].label = 'changed';

    mychart.update();
}

function showRatesOnSelectorChange() {
    let currencySelect = document.querySelector('#currency-one');
    currencySelect.addEventListener('change', (event) => {
        currencyBase = event.target.value;
        getRates();
    });
    let currencySelect2 = document.querySelector('#currency-two');
    currencySelect2.addEventListener('change', (event) => {
        currencyTo = event.target.value;
        getRates();
    });
}

function displayDiagram(){
    console.log(currencyBase);
    console.log(currencyTo);
    var ctx = document.getElementById('myChart').getContext('2d');
    mychart = new Chart(ctx, {
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
                        beginAtZero: false
                    }
                }]
            }
        }
    });
}

function initialize(){
    loadSelectors('#currency-one');
    loadSelectors('#currency-two');
    getRates();
}

(() => {
    initialize();
    showRatesOnSelectorChange();
})();
