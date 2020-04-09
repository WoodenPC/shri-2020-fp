/**
 * @file Домашка по FP ч. 1
 * 
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

import { pipe, last, allPass, pickBy, propEq, reject, gte,
    length, props, apply, keys, values, countBy, identity, equals, __,
    difference, all, complement } from 'ramda';

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = (shapes) => {
    const hasWhiteTriangle = propEq('triangle', 'white');
    const hasWhiteCircle = propEq('circle', 'white');
    const hasRedStar = propEq('star', 'red');
    const hasGreenSquare = propEq('square', 'green');

    return allPass([hasWhiteTriangle, hasWhiteCircle, hasRedStar, hasGreenSquare])(shapes);
};

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = (shapes) => {
    const isGreen = (value) => value === 'green';
    const greenShapes = pickBy(isGreen, shapes);
    return keys(greenShapes).length >= 2;
};

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = (shapes) => {
    const isRed = (value) => value === 'red';
    const isBlue = (value) => value === 'blue';
    const redShapes = pickBy(isRed, shapes);
    const blueShapes = pickBy(isBlue, shapes);
    return keys(redShapes).length === keys(blueShapes).length;
};

// 4. Синий круг, красная звезда, оранжевый квадрат
export const validateFieldN4 = (shapes) => {
    const hasBlueCircle = propEq('circle', 'blue');
    const hasRedStar = propEq('star', 'red');
    const hasOrangeSquare = propEq('square', 'orange');
    return allPass([hasBlueCircle, hasRedStar, hasOrangeSquare])(shapes);
};

// 5. Три фигуры одного любого цвета кроме белого.
export const validateFieldN5 = (shapes) => {
    const isWhite = (value) => value === 'white';
    return pipe(
        values,
        reject(isWhite),
        countBy(identity),
        values,
        last,
        gte(__, 3)
    )(shapes);
};

// 6. Две зеленые фигуры (одна из них треугольник), еще одна любая красная.
export const validateFieldN6 = (shapes) => {
    const hasGreenTriangle = propEq('triangle', 'green');
    const hasTwoGreenAndRed = pipe(
        values,
        difference(['green', 'green', 'red'], __),
        length,
        equals(__, 0)
    );
    return allPass([hasGreenTriangle, hasTwoGreenAndRed])(shapes);
};

// 7. Все фигуры оранжевые.
export const validateFieldN7 = (shapes) => {
    const isOrange = (value) => value === 'orange';
    return pipe(
        values,
        all(isOrange)
    )(shapes);
};

// 8. Не красная и не белая звезда.
export const validateFieldN8 = (shapes) => {
    const hasRedStar = propEq('star', 'red');
    const hasWhiteStar = propEq('star', 'white');
    return allPass([complement(hasRedStar), complement(hasWhiteStar)])(shapes);
};

// 9. Все фигуры зеленые.
export const validateFieldN9 = (shapes) => {
    const isGreen = (value) => value === 'green';
    return pipe(
        values,
        all(isGreen)
    )(shapes);
};

// 10. Треугольник и квадрат одного цвета (не белого)
export const validateFieldN10 = (shapes) => {
    const hasWhiteSquare = propEq('square', 'white');
    const triangleEqualsSquare = pipe(props(['triangle', 'square']), apply(equals));
    return allPass([triangleEqualsSquare, complement(hasWhiteSquare)])(shapes);
};
