import os
import json
import pandas as pd
import pdfplumber
import traceback

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
REF_DIR = os.path.join(BASE_DIR, 'MANAGER', 'TZ_June_24', 'Справочные материалы')
OUT_DIR = os.path.join(BASE_DIR, 'src', 'data', 'ozon', 'reference-data')
os.makedirs(OUT_DIR, exist_ok=True)

def parse_locality_stats():
    print("Parsing locality stats...")
    file_path = os.path.join(REF_DIR, 'Статистика локальности 06.25-06.26.xlsx')
    if not os.path.exists(file_path):
        return None
        
    df = pd.read_excel(file_path)
    
    routes = []
    total_orders = 0
    for idx, row in df.iterrows():
        from_cluster = row['Кластер отгрузки → Товары']
        if pd.isna(from_cluster) or from_cluster == 'Итого и среднее':
            if from_cluster == 'Итого и среднее':
                total_orders = row.get('Заказано товаров по всем кластерам', 1)
            continue
            
        for col in df.columns:
            if col not in ['Кластер отгрузки → Товары', 'Заказано товаров по всем кластерам'] and not pd.isna(row[col]) and row[col] > 0:
                routes.append({
                    'from': from_cluster.strip(),
                    'to': col.strip(),
                    'count': float(row[col])
                })
                
    routes.sort(key=lambda x: x['count'], reverse=True)
    top5 = routes[:5]
    
    total = sum(r['count'] for r in routes)
    for r in routes:
        r['weight'] = r['count'] / total if total > 0 else 0
        
    result = {'top5': top5, 'all_routes': routes}
    with open(os.path.join(OUT_DIR, 'locality-stats.json'), 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    return result

def parse_dimensions():
    print("Parsing dimensions...")
    file_path = os.path.join(REF_DIR, 'Справочник Весогабариты.xlsx')
    if not os.path.exists(file_path):
        return
        
    df = pd.read_excel(file_path)
    records = df.to_dict(orient='records')
    with open(os.path.join(OUT_DIR, 'dimensions.json'), 'w', encoding='utf-8') as f:
        json.dump(records, f, ensure_ascii=False, indent=2)

def parse_ozon_tariffs(locality_data):
    print("Parsing Ozon logistics tariffs...")
    file_path = os.path.join(REF_DIR, 'Тарифы на Логистику FBO, FBS Озон от Кластеров и объёма (л).xlsx')
    if not os.path.exists(file_path):
        return
        
    df = pd.read_excel(file_path, sheet_name=0, header=2)
    
    # df.columns: ['Unnamed: 0', 'Объём товара', 'Кластер отправления', 'Кластер доставки', 'Для товаров до 300 руб.', 'Для товаров свыше 300 руб.']
    df = df.rename(columns={
        'Объём товара': 'volume',
        'Кластер отправления': 'from',
        'Кластер доставки': 'to',
        'Для товаров до 300 руб.': 'price_under_300',
        'Для товаров свыше 300 руб.': 'price_over_300'
    })
    
    # We only care about the top 5 routes to keep JSON small
    top_routes = [(r['from'], r['to']) for r in locality_data['top5']]
    
    # Drop unnamed columns that contain NaNs
    df = df.drop(columns=[col for col in df.columns if 'Unnamed' in col])
    
    df = df.dropna(subset=['volume', 'from', 'to'])
    df['from'] = df['from'].astype(str).str.strip()
    df['to'] = df['to'].astype(str).str.strip()
    
    # Filter only routes that are in top 5
    filtered_df = df[df.apply(lambda row: (row['from'], row['to']) in top_routes, axis=1)]
    
    records = filtered_df.to_dict(orient='records')
    # Replace NaN with None so json.dump writes null
    import math
    def clean_record(d):
        return {k: (None if isinstance(v, float) and math.isnan(v) else v) for k, v in d.items()}
    records = [clean_record(r) for r in records]
    
    with open(os.path.join(OUT_DIR, 'logistics-tariffs.json'), 'w', encoding='utf-8') as f:
        json.dump(records, f, ensure_ascii=False, indent=2)

def parse_dl_pdf(filename, out_filename):
    print(f"Parsing DL PDF: {filename}...")
    file_path = os.path.join(REF_DIR, filename)
    if not os.path.exists(file_path):
        return
    
    result = {'status': 'failed_need_excel', 'data': []}
    try:
        tables = []
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                extracted = page.extract_tables()
                for table in extracted:
                    tables.extend(table)
        
        if len(tables) > 0:
            result['status'] = 'success'
            result['data'] = tables
            print(f"Successfully extracted {len(tables)} rows from {filename}")
        else:
            print(f"No tables found in {filename}")
            
    except Exception as e:
        print(f"Error parsing {filename}: {e}")
        traceback.print_exc()
        
    with open(os.path.join(OUT_DIR, out_filename), 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    locality_data = parse_locality_stats()
    parse_dimensions()
    parse_ozon_tariffs(locality_data)
    parse_dl_pdf('Тарифы Деловые Линии, отгрузка из Мск.pdf', 'dl-tariffs-msk.json')
    parse_dl_pdf('Тарифы Деловые Линии, отгрузка из СПб.pdf', 'dl-tariffs-spb.json')
    print("ETL complete.")
