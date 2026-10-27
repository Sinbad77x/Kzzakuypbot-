const test = require('node:test');
const assert = require('node:assert');
const { calculateParty } = require('./calculator.js');

test('Control Scenario Calculation', () => {
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
    assert.strictEqual(res.totalCost, 688648);
    assert.strictEqual(Math.round(res.unitCost * 100) / 100, 6886.48);
});

test('Customs fees change impact check', () => {
    const baseInputs = { quantity: 100, price: 10, rate: 480, intShipping: 18000, localShipping: 5000, dutyRate: 10, broker: 15000, docs: 10000, sellingPrice: 8500 };
    const res1 = calculateParty({ ...baseInputs, customsFees: 20000 });
    const res2 = calculateParty({ ...baseInputs, customsFees: 0 });
    assert.strictEqual(res1.totalCost - res2.totalCost, 20000);
});

test('All 8 currencies conversion check', () => {
    const currencies = ['KZT', 'USD', 'CNY', 'KGS', 'UZS', 'RUB', 'TRY', 'AED'];
    currencies.forEach(curr => {
        const res = calculateParty({ quantity: 10, price: 100, rate: 5 });
        assert.strictEqual(res.valid, true);
        assert.strictEqual(res.purchaseBaseKZT, 5000);
    });
});

test('Rate validation (empty, zero, negative, NaN)', () => {
    assert.strictEqual(calculateParty({ quantity: 10, price: 10, rate: 0 }).valid, false);
    assert.strictEqual(calculateParty({ quantity: 10, price: 10, rate: -5 }).valid, false);
    assert.strictEqual(calculateParty({ quantity: 10, price: 10, rate: NaN }).valid, false);
    assert.strictEqual(calculateParty({ quantity: 10, price: 10, rate: '' }).valid, false);
});
