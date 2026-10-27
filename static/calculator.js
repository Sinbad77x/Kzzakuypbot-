/**
 * Core calculation module for Kzzakupbot Hub Calculator
 */
function calculateParty(inputs) {
    const qty = parseFloat(inputs.quantity);
    const price = parseFloat(inputs.price);
    const rate = parseFloat(inputs.rate);
    
    // Строгая валидация обязательных полей и защита от нулевого/отрицательного курса
    if (isNaN(qty) || qty <= 0 || isNaN(price) || price < 0 || isNaN(rate) || rate <= 0) {
        return { error: "Invalid parameters: quantity and rate must be > 0", valid: false };
    }

    const purchaseBaseKZT = qty * price * rate;
    const intShipping = Math.max(0, parseFloat(inputs.intShipping) || 0);
    const dutyBase = purchaseBaseKZT + intShipping;
    
    const dutyRate = Math.max(0, parseFloat(inputs.dutyRate) || 0) / 100;
    const duty = dutyBase * dutyRate;
    
    const customsFees = Math.max(0, parseFloat(inputs.customsFees) || 0);
    const vatBase = dutyBase + duty + customsFees;
    
    const vatRate = 0.16; // Модельный импортный НДС 16%
    const vat = vatBase * vatRate;
    
    const localShipping = Math.max(0, parseFloat(inputs.localShipping) || 0);
    const broker = Math.max(0, parseFloat(inputs.broker) || 0);
    const docs = Math.max(0, parseFloat(inputs.docs) || 0);
    
    const otherExpenses = localShipping + customsFees + broker + docs;
    
    // Итоговая себестоимость (учитывает таможенные сборы ровно 1 раз)
    const totalCost = purchaseBaseKZT + intShipping + duty + vat + localShipping + customsFees + broker + docs;
    
    const unitCost = qty > 0 ? totalCost / qty : 0;
    const sellingPrice = Math.max(0, parseFloat(inputs.sellingPrice) || 0);
    const revenue = qty * sellingPrice;
    const marginBeforeTax = revenue - totalCost;

    return {
        valid: true,
        purchaseBaseKZT,
        intShipping,
        duty,
        vat,
        otherExpenses,
        totalCost,
        unitCost,
        revenue,
        marginBeforeTax
    };
}

if (typeof module !== 'undefined') {
    module.exports = { calculateParty };
}
