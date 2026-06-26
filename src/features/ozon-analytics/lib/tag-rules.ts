/**
 * tag-rules.ts
 * Автоматическое присвоение тэгов товарам категории «Аэрохоккей»
 * на основе ключевых слов в названии и размере.
 *
 * Правила по ТЗ (июнь 2024):
 *   Настольный      — sizeFt <= 3 или ключ. слово «настольный»
 *   Напольный       — sizeFt >= 6 или ключ. слово «напольный»
 *   Складной        — ключ. слово «складной» / «fold»
 *   Подсветка       — ключ. слово «подсветка» / «neon» / «light» / «led»
 *   Электронный счётчик — ключ. слово «электрон» / «electronic» / «цифровой» / «digital»
 */

import { ProductTag } from '../model/types';

interface TaggableProduct {
  title: string;
  sizeFt: number;
}

type TagRule = {
  tag: ProductTag;
  test: (p: TaggableProduct) => boolean;
};

const match = (title: string, ...keywords: string[]): boolean => {
  const lower = title.toLowerCase();
  return keywords.some((kw) => lower.includes(kw.toLowerCase()));
};

const TAG_RULES: TagRule[] = [
  {
    tag: 'Настольный',
    test: (p) => p.sizeFt <= 3 || match(p.title, 'настольный', 'table-top', 'tabletop', 'mini'),
  },
  {
    tag: 'Напольный',
    test: (p) => p.sizeFt >= 6 || match(p.title, 'напольный', 'floor', 'напол'),
  },
  {
    tag: 'Складной',
    test: (p) => match(p.title, 'складной', 'складн', 'fold', 'folding'),
  },
  {
    tag: 'Подсветка',
    test: (p) => match(p.title, 'подсветк', 'neon', 'neon-x', 'light', 'led', 'подсвет'),
  },
  {
    tag: 'Электронный счётчик',
    test: (p) =>
      match(p.title, 'электрон', 'electronic', 'цифровой', 'digital', 'счётчик', 'счетчик'),
  },
];

/**
 * Вычисляет тэги для одного товара по правилам.
 * Возвращает массив (может быть пустым — если ни одно правило не сработало).
 */
export function inferTags(product: TaggableProduct): ProductTag[] {
  return TAG_RULES.filter((rule) => rule.test(product)).map((rule) => rule.tag);
}
