import os
import json
import urllib.request
import urllib.error
import pandas as pd

# Константы путей
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
ENV_PATH = os.path.join(BASE_DIR, '.env.local')
OUTPUT_DIR = os.path.join(BASE_DIR, 'MANAGER', 'База_товаров')
OUTPUT_FILE = os.path.join(OUTPUT_DIR, 'Товары_Ozon_Характеристики.xlsx')

def load_credentials():
    """Загружает учетные данные Ozon API из .env.local"""
    config = {}
    if os.path.exists(ENV_PATH):
        with open(ENV_PATH, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    k, v = line.split('=', 1)
                    config[k.strip()] = v.strip()
    
    client_id = config.get('OZON_CLIENT_ID') or os.getenv('OZON_CLIENT_ID')
    api_key = config.get('OZON_API_KEY') or os.getenv('OZON_API_KEY')
    
    # Резервные значения из роута Next.js, если нет в файле
    if not client_id:
        client_id = '2717886'
    if not api_key:
        api_key = 'c7c4fa75-2ecd-4a8f-bd41-810d992edec3'
        
    return client_id, api_key

def make_ozon_request(endpoint, client_id, api_key, payload):
    """Делает POST-запрос к Ozon API Seller с обработкой ошибок"""
    url = f"https://api-seller.ozon.ru{endpoint}"
    headers = {
        'Client-Id': client_id,
        'Api-Key': api_key,
        'Content-Type': 'application/json'
    }
    
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode('utf-8'),
        headers=headers,
        method='POST'
    )
    
    try:
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        error_content = e.read().decode('utf-8')
        print(f"HTTP Error {e.code} for {endpoint}: {error_content}")
        raise
    except Exception as e:
        print(f"Connection error for {endpoint}: {e}")
        raise

def build_category_mapping(client_id, api_key):
    """Получает дерево категорий Ozon и строит плоский маппинг category_id -> category_name и type_id -> type_name"""
    print("Получение дерева категорий Ozon...")
    try:
        res = make_ozon_request('/v1/description-category/tree', client_id, api_key, {"language": "RU"})
        category_map = {}
        type_map = {}
        
        def traverse(node):
            if not node:
                return
            cat_id = node.get('description_category_id')
            title = node.get('category_name')
            if cat_id and title:
                category_map[cat_id] = title
            
            # Парсим типы
            types = node.get('types', [])
            for t in types:
                t_id = t.get('type_id')
                t_name = t.get('type_name')
                if t_id and t_name:
                    type_map[t_id] = t_name
            
            children = node.get('children', [])
            for child in children:
                traverse(child)
                
        for root_node in res.get('result', []):
            traverse(root_node)
            
        print(f"Успешно загружено категорий: {len(category_map)}, типов: {len(type_map)}")
        return category_map, type_map
    except Exception as e:
        print(f"Не удалось загрузить дерево категорий: {e}. Будут использованы только ID категорий.")
        return {}, {}

def fetch_attributes_for_pairs(client_id, api_key, pairs):
    """
    Получает описание атрибутов для пар (description_category_id, type_id).
    Возвращает маппинг {(description_category_id, type_id, attribute_id): attribute_name}
    """
    attr_map = {}
    if not pairs:
        return attr_map
        
    print(f"Запрос названий характеристик для {len(pairs)} уникальных типов товаров...")
    for cat_id, type_id in pairs:
        if not cat_id or not type_id:
            continue
        try:
            payload = {
                "description_category_id": int(cat_id),
                "type_id": int(type_id),
                "language": "RU"
            }
            res = make_ozon_request('/v1/description-category/attribute', client_id, api_key, payload)
            attributes = res.get('result', [])
            for attr in attributes:
                attr_id = attr.get('id')
                attr_name = attr.get('name')
                if attr_id and attr_name:
                    attr_map[(cat_id, type_id, attr_id)] = attr_name
            print(f"  Загружено {len(attributes)} атрибутов для категории {cat_id} и типа {type_id}")
        except Exception as e:
            print(f"  Ошибка при загрузке атрибутов для категории {cat_id}, типа {type_id}: {e}")
            
    return attr_map

def download_all_products(client_id, api_key):
    """Скачивает все товары с их характеристиками с Ozon API"""
    print("Запуск выгрузки товаров с Ozon API...")
    all_products = []
    last_id = ""
    limit = 1000
    
    while True:
        payload = {
            "filter": {
                "visibility": "ALL"
            },
            "last_id": last_id,
            "limit": limit
        }
        
        print(f"Запрос товаров (last_id: '{last_id}', limit: {limit})...")
        res = make_ozon_request('/v4/product/info/attributes', client_id, api_key, payload)
        items = res.get('result', [])
        
        if not items:
            break
            
        all_products.extend(items)
        print(f"Получено товаров в этой пачке: {len(items)}. Всего: {len(all_products)}")
        
        last_id = res.get('last_id', '')
        if not last_id or len(items) < limit:
            break
            
    print(f"Всего выгружено товаров: {len(all_products)}")
    return all_products

def main():
    client_id, api_key = load_credentials()
    print(f"Используются ключи: Client-Id: {client_id}, Api-Key: {api_key[:4]}...{api_key[-4:]}")
    
    # 1. Загрузка товаров
    products = download_all_products(client_id, api_key)
    if not products:
        print("Товары не найдены или ошибка при запросе.")
        return
        
    # 2. Загрузка справочников категорий и типов
    category_map, type_map = build_category_mapping(client_id, api_key)
    
    # Сбор уникальных пар (description_category_id, type_id)
    unique_pairs = set()
    for p in products:
        cat_id = p.get('description_category_id')
        type_id = p.get('type_id')
        if cat_id and type_id:
            unique_pairs.add((cat_id, type_id))
            
    # Загружаем атрибуты для этих пар
    attr_map = fetch_attributes_for_pairs(client_id, api_key, unique_pairs)
    
    # 3. Сборка плоской таблицы
    flat_data = []
    
    # Чтобы определить порядок колонок характеристик, будем собирать все уникальные имена атрибутов
    all_attribute_names = set()
    
    for item in products:
        cat_id = item.get('description_category_id')
        type_id = item.get('type_id')
        
        cat_name = category_map.get(cat_id, f"Категория {cat_id}" if cat_id else "")
        type_name = type_map.get(type_id, f"Тип {type_id}" if type_id else "")
        
        row = {
            'Артикул (offer_id)': item.get('offer_id'),
            'ID товара (product_id)': item.get('id'),
            'Наименование': item.get('name'),
            'Штрихкод': item.get('barcode'),
            'Категория': cat_name,
            'Тип товара': type_name,
            'Вес (г)': item.get('weight'),
            'Высота (мм)': item.get('height'),
            'Ширина (мм)': item.get('width'),
            'Глубина (мм)': item.get('depth'),
        }
        
        # Разбираем атрибуты
        attributes = item.get('attributes', [])
        for attr in attributes:
            attr_id = attr.get('id')
            attr_name = attr_map.get((cat_id, type_id, attr_id)) or f"Атрибут {attr_id}"
            
            # Собираем значения атрибута
            values = [v.get('value') for v in attr.get('values', []) if v.get('value')]
            val_str = ", ".join(values)
            
            if val_str:
                row[attr_name] = val_str
                all_attribute_names.add(attr_name)
                
        flat_data.append(row)
        
    # Сортируем названия атрибутов по алфавиту для предсказуемого порядка колонок
    sorted_attributes = sorted(list(all_attribute_names))
    
    # Формируем итоговые колонки
    base_columns = [
        'Артикул (offer_id)',
        'ID товара (product_id)',
        'Наименование',
        'Штрихкод',
        'Категория',
        'Тип товара',
        'Вес (г)',
        'Высота (мм)',
        'Ширина (мм)',
        'Глубина (мм)'
    ]
    final_columns = base_columns + sorted_attributes
    
    df = pd.DataFrame(flat_data)
    # Перевыстроим колонки, заполнив отсутствующие значения пустой строкой
    df = df.reindex(columns=final_columns).fillna('')
    
    # 4. Сохранение в Excel
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    print(f"Сохранение в Excel: {OUTPUT_FILE}...")
    
    with pd.ExcelWriter(OUTPUT_FILE, engine='openpyxl') as writer:
        df.to_excel(writer, index=False, sheet_name='Товары Ozon')
        worksheet = writer.sheets['Товары Ozon']
        
        # Автоподгон ширины колонок для красоты
        for col in worksheet.columns:
            max_len = 0
            col_letter = col[0].column_letter
            for cell in col:
                val = str(cell.value or '')
                if len(val) > max_len:
                    max_len = len(val)
            # Ограничим максимальную ширину в 50 символов, чтобы слишком длинные описания не растягивали сетку
            worksheet.column_dimensions[col_letter].width = min(max(max_len + 3, 10), 50)
            
    print(f"Выгрузка завершена успешно! Файл сохранен: {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
