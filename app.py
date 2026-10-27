from flask import Flask, render_template, request

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def index():
    results = None
    error = None
    form_data = {}

    if request.method == 'POST':
        try:
            form_data = {
                'quantity': request.form.get('quantity'),
                'price': request.form.get('price'),
                'currency': request.form.get('currency'),
                'exchange_rate': request.form.get('exchange_rate'),
                'delivery': request.form.get('delivery'),
                'customs_duty': request.form.get('customs_duty'),
                'broker': request.form.get('broker'),
                'documents': request.form.get('documents'),
                'selling_price': request.form.get('selling_price')
            }

            quantity = float(form_data['quantity'])
            price = float(form_data['price'])
            exchange_rate = float(form_data['exchange_rate'])
            delivery = float(form_data['delivery'] or 0)
            customs_duty_pct = float(form_data['customs_duty'] or 0)
            broker = float(form_data['broker'] or 0)
            documents = float(form_data['documents'] or 0)
            selling_price = float(form_data['selling_price'])

            if exchange_rate <= 0 or quantity <= 0:
                raise ValueError("Курс валюты и количество должны быть больше нуля.")

            purchase_kzt = quantity * price * exchange_rate
            duty_kzt = purchase_kzt * (customs_duty_pct / 100)
            
            vat_base = purchase_kzt + duty_kzt
            vat_kzt = vat_base * 0.16

            total_cost_party = purchase_kzt + duty_kzt + vat_kzt + delivery + broker + documents
            total_cost_unit = total_cost_party / quantity

            revenue = quantity * selling_price
            margin = revenue - total_cost_party

            results = {
                'purchase_kzt': f"{purchase_kzt:,.2f} KZT",
                'duty_kzt': f"{duty_kzt:,.2f} KZT",
                'vat_kzt': f"{vat_kzt:,.2f} KZT",
                'total_cost_party': f"{total_cost_party:,.2f} KZT",
                'total_cost_unit': f"{total_cost_unit:,.2f} KZT",
                'revenue': f"{revenue:,.2f} KZT",
                'margin': f"{margin:,.2f} KZT"
            }

        except ValueError as e:
            error = f"Проверьте правильность заполнения полей: {str(e)}"

    return render_template('index.html', results=results, error=error, form_data=form_data)

if __name__ == '__main__':
    app.run(debug=True)
