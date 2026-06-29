import { ProductClass, ProductCategory, ProductTag } from '../model/types';

export function classifyProduct(title: string, characteristics: any = {}): { productClass: ProductClass, productCategory: ProductCategory, tags: ProductTag[] } {
  const text = `${title} ${JSON.stringify(characteristics)}`.toLowerCase();
  
  let productClass: ProductClass = 'Неизвестно';
  let productCategory: ProductCategory = 'Другое';
  let tags: ProductTag[] = [];

  // 1. Класс
  if (text.includes('теннисный стол') || text.includes('настольный теннис')) {
    productClass = 'Теннисный стол';
  } else if (text.includes('бильярд')) {
    productClass = 'Бильярд';
  } else if (text.includes('кикер') || text.includes('настольный футбол') || text.includes('футбол настольный')) {
    productClass = 'Настольный футбол';
  } else if (text.includes('аэрохоккей') || text.includes('настольный хоккей') || text.includes('хоккей настольный')) {
    productClass = 'Настольный хоккей';
  } else if (text.includes('трансформер') || text.includes('многофункциональный')) {
    productClass = 'Стол-трансформер';
  } else if (text.includes('кий ') || text.includes('шары') || text.includes('сетка') || text.includes('ракетка') || text.includes('чехол') || text.includes('робот')) {
    productClass = 'Аксессуары';
  }

  // 2. Категория и Теги
  if (productClass === 'Теннисный стол') {
    if (text.match(/outdoor|всепогодный|уличный/i)) {
      productCategory = 'Outdoor';
    } else {
      productCategory = 'Indoor';
    }

    if (text.match(/mdf|мдф/i)) tags.push('МДФ');
    if (text.match(/smc|смк/i)) tags.push('SMC');
    if (text.match(/acp|ацп|алюминиев/i)) tags.push('ACP');
    
    const thickMatch = text.match(/(\d+)\s*(мм|mm)/i);
    if (thickMatch) tags.push(`${thickMatch[1]} мм`);

    if (text.includes('сетка')) tags.push('Сетка');
    if (text.includes('робот')) tags.push('Робот');
    if (text.includes('чехол')) tags.push('Чехол');
  } 
  else if (productClass === 'Бильярд') {
    const ftMatch = text.match(/(\d+)\s*(ф|фт|фут)/i);
    if (ftMatch) {
      const num = parseInt(ftMatch[1]);
      if ([2, 3, 4].includes(num)) productCategory = `${num} фута` as ProductCategory;
      else if ([5, 6, 7, 8].includes(num)) productCategory = `${num} футов` as ProductCategory;
    } else if (text.includes('122 см')) {
      productCategory = '4 фута';
    }

    if (text.includes('стол') && !text.includes('теннисный')) tags.push('Столы');
    if (text.match(/кий|кии\s/i)) tags.push('Кии');
    if (text.match(/шар|шары/i)) tags.push('Шары');
    if (text.includes('светильник') || text.includes('освещение')) tags.push('Освещение');
  }
  else if (productClass === 'Настольный футбол' || productClass === 'Настольный хоккей') {
    const ftMatch = text.match(/(\d+)\s*(ф|фт|фут)/i);
    if (ftMatch) {
      const num = parseInt(ftMatch[1]);
      if ([2, 3, 4].includes(num)) productCategory = `${num} фута` as ProductCategory;
      else if ([5, 6, 7, 8].includes(num)) productCategory = `${num} футов` as ProductCategory;
    }
  }
  else if (productClass === 'Стол-трансформер') {
    const vMatch = text.match(/(\d+)\s*[вv]\s*1/i);
    if (vMatch) {
      const num = parseInt(vMatch[1]);
      if (num >= 10) productCategory = '10+ в 1';
      else if ([2, 3, 4, 6].includes(num)) productCategory = `${num} в 1` as ProductCategory;
    }
  }

  // Общие теги
  if (text.includes('напольный')) tags.push('Напольный');
  if (text.includes('настольный') && productClass !== 'Теннисный стол' && productClass !== 'Настольный футбол' && productClass !== 'Настольный хоккей') tags.push('Настольный');
  if (text.includes('складной')) tags.push('Складной');
  if (text.includes('подсветка')) tags.push('Подсветка');
  if (text.match(/электронный счетчик|электронное табло/i)) tags.push('Электронный счётчик');

  tags = Array.from(new Set(tags));

  return { productClass, productCategory, tags };
}
