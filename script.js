const apiUrlAll = 'https://api.exchangeratesapi.io/latest';
const apiURLForDiagram = 'https://api.exchangeratesapi.io/history?start_at=2020-01-01&end_at=2020-08-01&symbols=';
let currencyBase = 'USD';
let currencyTo = 'PLN';
let dates = [];
let rates = [];
let mychart;
let firstRun = true;

function loadSelectors(selectorId) {
    let currencySelect = document.querySelector(selectorId);
    fetch(apiUrlAll)
        .then(response => response.json())
        .then(response => {
            let currencies = Object.keys(response.rates);
            currencies.push(response.base);
            currencies.sort();
            addSelectElementsToHtml(currencies, currencySelect);
            addDefaultSelectElements(selectorId);
        })
}

function addSelectElementsToHtml(currencies, currencySelect) {
    for (const index in currencies) {
        let currency = (currencies[index]);
        let option = document.createElement('option');
        option.appendChild(document.createTextNode(currency));
        option.value = currency;
        currencySelect.appendChild(option);
    }
}

function addDefaultSelectElements(selectorId) {
    if (selectorId == '#currency-one') {
        setDefaultSelectElement('currency-one', currencyBase);
    } else {
        setDefaultSelectElement('currency-two', currencyTo);
    }
}

function setDefaultSelectElement(id, valueToSelect) {    
    let element = document.getElementById(id);
    element.value = valueToSelect;
}

function getRates() {
    newApiUrl = `${apiURLForDiagram}${currencyTo}&base=${currencyBase}`;
    fetch(newApiUrl)
        .then(response => response.json())
        .then(response => {
            dates = [];
            rates = [];
            let currencies = Object.keys(response.rates);
            currencies.sort(function(a,b) {
                return new Date(a) - new Date(b)
            })
            loadDiagramData(currencies, response);
            handleDiagramDisplay();  
        })
}

function loadDiagramData(currencies, response) {
    for (const property in currencies) {
        let date = (currencies[property]);
        let currencyAndRate = Object.values(response.rates[date]);
        let rate = currencyAndRate[0];
        dates.push(date);
        rates.push(rate);  
    }
}

function handleDiagramDisplay() {
    if (firstRun) {
        displayDiagram();
        firstRun = false;  
    } else {
        updateDiagram(dates, rates);
    }
}

function updateDiagram(dates, rates){
    mychart.data.datasets[0].data = rates;
    mychart.data.labels = dates;
    mychart.data.datasets[0].label = currencyTo;
    mychart.update();
}

function showRatesOnSelectorChange() {
    let currencySelect = document.querySelector('#currency-one');
    let currencySelect2 = document.querySelector('#currency-two');
    
    currencySelect.addEventListener('change', (event) => {
        currencyBase = event.target.value;
        getRates();
    });
    currencySelect2.addEventListener('change', (event) => {
        currencyTo = event.target.value;
        getRates();
    });
}

function displayDiagram(){
    var ctx = document.getElementById('myChart').getContext('2d');
    mychart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: currencyTo,
                data: rates,
                backgroundColor: [
                    '#ececec60'
                ],
                borderColor: [
                    'rgba(0, 153, 153, 0.6)'
                ],
                borderWidth: 5
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
            },
            elements: {
                point:{
                    radius: 0.1
                }
            }
        }
    });
}

(() => {
    loadSelectors('#currency-one');
    loadSelectors('#currency-two');
    getRates();
    showRatesOnSelectorChange();
})();
