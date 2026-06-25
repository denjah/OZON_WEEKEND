import zipfile
import xml.etree.ElementTree as ET
import os
import sys

docx_path = r"d:\!PROJECTS\OZON_MANAGER\MANAGER\TZ_June_24\ТЗ Оптимизация Интерфейса Матрицы.docx"
output_path = r"d:\!PROJECTS\OZON_MANAGER\MANAGER\TZ_June_24\tz_extracted.txt"

nsmap = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}

with zipfile.ZipFile(docx_path, 'r') as z:
    with z.open('word/document.xml') as f:
        tree = ET.parse(f)
        root = tree.getroot()

paragraphs = []
for para in root.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p'):
    texts = []
    for run in para.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t'):
        if run.text:
            texts.append(run.text)
    paragraphs.append(''.join(texts))

with open(output_path, 'w', encoding='utf-8') as f:
    f.write('\n'.join(paragraphs))

print(f"Extracted {len(paragraphs)} paragraphs")
