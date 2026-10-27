from flask import Flask, render_template, request

app = Flask(__name__)

# Данные образовательных ресурсов (ТЗ № 20)
EDUCATION_RESOURCES = [
    {
        "title": "Закупки в производственной и коммерческой деятельности",
        "platform": "Skills Enbek",
        "url": "https://skills.enbek.kz/ru/course-catalog/course/460",
        "description": "Изучение закупочной деятельности и её организации в производственной и коммерческой сфере.",
        "status": "Бесплатно после регистрации",
        "verified_date": "Октябрь 2026"
    },
    {
        "title": "Бизнес как система",
        "platform": "Skills Enbek",
        "url": "https://skills.enbek.kz/ru/course-catalog/course/1125",
        "description": "Основы системного подхода к организации и управлению бизнесом.",
        "status": "Бесплатно после регистрации",
        "verified_date": "Октябрь 2026"
    },
    {
        "title": "Управление бизнес-процессами",
        "platform": "Skills Enbek",
        "url": "https://skills.enbek.kz/ru/course-catalog/course/666",
        "description": "Знакомство с организацией и управлением бизнес-процессами предприятия.",
        "status": "Бесплатно после регистрации",
        "verified_date": "Октябрь 2026"
    },
    {
        "title": "Обучение основам предпринимательства («Бастау Бизнес»)",
        "platform": "Skills Enbek",
        "url": "https://skills.enbek.kz/ru/course-catalog/course/992",
        "description": "Основы предпринимательства, необходимые для организации и развития бизнеса поставщика.",
        "status": "Бесплатно после регистрации",
        "verified_date": "Октябрь 2026"
    },
    {
        "title": "Рейтинг образовательных программ НПП «Атамекен»",
        "platform": "НПП «Атамекен»",
        "url": "https://atameken.kz/business/rating",
        "description": "Дополнительный ресурс для изучения рейтинга образовательных программ.",
        "status": "Условия уточняются",
        "verified_date": "Октябрь 2026"
    }
]

# Структурированные темы обучения
LEARNING_MODULES = [
    {
        "title": "1. Государственные закупки Казахстана",
        "topics": ["Основные этапы закупки", "Поиск объявлений и лотов", "Изучение документации", "Требования к поставщику"]
    },
    {
        "title": "2. Закупки Самрук-Казына",
        "topics": ["Поиск закупок", "Изучение требований", "Подготовка к участию"]
    },
    {
        "title": "3. Коммерческие закупки",
        "topics": ["Закупки частных компаний", "Поиск потенциальных заказчиков", "Работа с коммерческими тендерными площадками"]
    },
    {
        "title": "4. Подготовка заявки",
        "topics": ["Необходимые документы", "Проверка требований", "Типичные ошибки", "Причины отклонения заявок"]
    },
    {
        "title": "5. Обеспечение и исполнение договора",
        "topics": ["Обеспечение заявки", "Обеспечение исполнения договора", "Сроки и обязательства поставщика", "Условия возврата обеспечения"]
    },
    {
        "title": "6. Экономика участия в тендерах",
        "topics": ["Себестоимость товара", "Расходы на доставку", "Налоги и таможенные платежи", "Комиссии и банковские гарантии", "Расчёт ожидаемой прибыли"]
    }
]

# Практический маршрут начинающего поставщика
PRACTICE_STEPS = [
    "Изучить основы закупок.",
    "Выбрать интересующую площадку.",
    "Найти подходящий лот.",
    "Изучить квалификационные требования и документацию.",
    "Рассчитать себестоимость и предполагаемую прибыль.",
    "Проверить требования к обеспечению заявки и исполнению договора.",
    "Подготовить документы и подать заявку в соответствии с правилами соответствующей площадки."
]


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


@app.route('/education')
def education():
    return render_template(
        'education.html',
        resources=EDUCATION_RESOURCES,
        modules=LEARNING_MODULES,
        practice_steps=PRACTICE_STEPS
    )


if __name__ == '__main__':
    app.run(debug=True)
