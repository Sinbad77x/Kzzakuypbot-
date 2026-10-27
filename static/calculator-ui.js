document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('calculator-form');
    if (!form) return;

    const fields = [
        'quantity', 'price', 'rate', 'intShipping', 
        'localShipping', 'dutyRate', 'customsFees', 
        'broker', 'docs', 'sellingPrice'
    ];

    function updateUI() {
        const inputs = {};
        let hasError = false;

        fields.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                const val = el.value.trim();
                if (el.hasAttribute('required') && (val === '' || isNaN(val) || Number(val) < 0)) {
                    el.classList.add('is-invalid');
                    hasError = true;
                } else {
                    el.classList.remove('is-invalid');
                }
                inputs[id] = val;
            }
        });

        const errorBanner = document.getElementById('calc-error-banner');
        if (hasError) {
            if (errorBanner) errorBanner.style.display = 'block';
            clearResultsDisplay();
            return;
        } else {
            if (errorBanner) errorBanner.style.display = 'none';
        }

        const result = calculateParty(inputs);
        if (!result.valid) {
            clearResultsDisplay();
            return;
        }

        renderResults(result);
    }

    fields.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', updateUI);
            el.addEventListener('change', updateUI);
        }
    });

    const currencySelect = document.getElementById('currency');
    if (currencySelect) {
        currencySelect.addEventListener('change', updateUI);
    }

    const regionSelect = document.getElementById('region');
    if (regionSelect) {
        regionSelect.addEventListener('change', updateUI);
    }

    updateUI();
});

function clearResultsDisplay() {
    const outputIds = ['res-purchase', 'res-duty', 'res-vat', 'res-total', 'res-unit', 'res-revenue', 'res-margin'];
    outputIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = '—';
    });
}

function renderResults(res) {
    document.getElementById('res-purchase').textContent = res.purchaseBaseKZT.toLocaleString('ru-RU') + ' ₸';
    document.getElementById('res-duty').textContent = res.duty.toLocaleString('ru-RU') + ' ₸';
    document.getElementById('res-vat').textContent = res.vat.toLocaleString('ru-RU') + ' ₸';
    document.getElementById('res-total').textContent = res.totalCost.toLocaleString('ru-RU') + ' ₸';
    document.getElementById('res-unit').textContent = res.unitCost.toLocaleString('ru-RU', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + ' ₸';
    document.getElementById('res-revenue').textContent = res.revenue.toLocaleString('ru-RU') + ' ₸';
    document.getElementById('res-margin').textContent = res.marginBeforeTax.toLocaleString('ru-RU') + ' ₸';
}

