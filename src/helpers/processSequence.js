/**
 * @file Домашка по FP ч. 2
 * 
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 * 
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 * 
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import Api from '../tools/api';
import { pipe, __, allPass, andThen, prop, tap, ifElse, modulo, length, otherwise } from 'ramda';

const api = new Api();

const hasLessThanTenSymbols = (str) => str.length <= 10;

const hasMoreThanTwoSymbols = (str) => str.length >= 2;

const isPositiveNumber = (str) =>  /^[0-9]+(\.)?[0-9]*$/.test(str);

const convertStrToInt = (str) => pipe(parseFloat, Math.round)(str);

const isValidStr = (str) => allPass([hasLessThanTenSymbols, hasMoreThanTwoSymbols, isPositiveNumber])(str);

const getConvertedNumberFromApi = (number) => api.get('https://api.tech/numbers/base', { from: 10, to: 2, number });

const getRandomAnimalFromApi = (id) => api.get(`https://animals.tech/${id}`, {});

const getSquaredNumber = (number) => number * number;

const getConvertedNumberAsync = (number) => pipe(
    getConvertedNumberFromApi,
    andThen(prop('result'))
)(number);

const getRandomAnimalAsync = (id) => pipe(
    getRandomAnimalFromApi,
    andThen(prop('result'))
)(id);

const processSequence = ({value, writeLog, handleSuccess, handleError}) => {
    return pipe(
        tap(writeLog),
        ifElse(
            isValidStr,
            pipe(
                convertStrToInt,
                getConvertedNumberAsync,
                andThen(pipe(
                    tap(writeLog),
                    length,
                    tap(writeLog),
                    getSquaredNumber,
                    tap(writeLog),
                    modulo(__, 3),
                    tap(writeLog),
                    getRandomAnimalAsync,
                    andThen(handleSuccess)
                )),
                otherwise(tap(handleError)),
            ),
            () => handleError('ValidationError'),
        )
    )(value);
}

export default processSequence;
