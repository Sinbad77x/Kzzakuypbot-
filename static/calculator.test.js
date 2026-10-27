const test = require('node:test');
const assert = require('node:assert');
const { calculateParty } = require('./calculator.js');

test('Core Arithmetic: Control Scenario Check', () => {
    const inputs = {
        quantity: 100,
        price: 10,
        rate: 480,
        intShipping: 18000,
        localShipping: 5000,
        dutyRate: 10,
        customsFees: 20000,
        broker: 15000,
        docs: 10000,
        sellingPrice: 8500
    };

    const res = calculateParty(inputs);
    assert.strictEqual(res.valid, true);
    assert.strictEqual(res.purchaseBaseKZT, 480000);
    assert.strictEqual(res.intShipping, 18000);
    assert.strictEqual(res.duty, 49800);
    assert.strictEqual(res.vat, 90848);
    assert.strictEqual(res.totalCost, 688648);
    assert.strictEqual(Math.round(res.unitCost * 100) / 100, 6886.48);
    assert.strictEqual(res.revenue, 850000);
    assert.strictEqual(res.marginBeforeTax, 161352);
});

test('Input Validation: Empty & Negative values handling', () => {
    const invalidInputs = {
        quantity: '',
        price: -10,
        rate: 480
    };
    const res = calculateParty(invalidInputs);
    assert.strictEqual(res.valid, false);
});

test('Exchange Rate Validation: Zero or negative rate blocking', () => {
    const zeroRateInputs = {
        quantity: 100,
        price: 10,
        rate: 0
    };
    const resZero = calculateParty(zeroRateInputs);
    assert.strictEqual(resZero.valid, false);

    const negativeRateInputs = {
        quantity: 100,
        price: 10,
        rate: -480
    };
    const resNeg = calculateParty(negativeRateInputs);
    assert.strictEqual(resNeg.valid, false);
});
