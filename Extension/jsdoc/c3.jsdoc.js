/**
 * JSDoc-определения для C3
 */

/**
 * Настройка графика C3
 * @typedef {object} C3Settings
 * @property {string} bindto Селектор целевого элемента для вставки
 * @property {C3Data} data Данные для построения
 * @property {C3Axes} axis Описание осей
 */

/**
 * Данные графика C3
 * @typedef {object} C3Data
 * @property {string} x Название столбца данных для оси X
 * @property {C3Value[][]} columns Массив столбцов; Столбец - массив, где первое знаение - название столбца, далее значения
 * @property {C3Value[][]} rows Массив строк; Строка - массив значений
 * @property {C3Types} types Настройки типов столбцов
 */

/**
 * Настройки типов столбцов. 
 * Объект состоит из полей, где название - идентификатор столбца, значение - тип графика
 * @typedef {object} C3Types
 */

/**
 * Тип графика
 * @typedef {string} C3ChartType
 * - 'line' - Линейный график
 * - 'bar' - Столбчатая диаграмма
 */

/**
 * Настройки осей
 * @typedef {object} C3Axes
 * @property {C3Axis} x Ось X
 * @property {C3Axis} y Ось Y
 * @property {C3Axis} y2 Ось Y2
 */

/**
 * Настройки оси
 * @typedef {object} C3Axis
 * @property {boolean} show true для отображения оси, иначе false
 * @property {C3AxisType} type Тип
 * @property {string[]} categories Список заголовков категорий
 * @property {C3AxisLabel} label Настройки подписи оси
 */

/**
 * Тип оси
 * @typedef {string} C3AxisType
 * - 'category' - Категориальная ось - фиксированный список значений, не сравнимых по значению
 */

/**
 * Настройки подписи оси
 * @typedef {object} C3AxisLabel
 * @property {string} text Заголовок оси
 * @property {C3XAxisPosition|C3YAxisPosition} position Расположение оси
 */

/**
 * Тип расположения оси X
 * @typedef {string} C3XAxisPosition
 * - 'inner-right' - Внутри справа
 * - 'inner-center' - Внутри по центру
 * - 'inner-left' - Внутри слева
 * - 'outer-right' - Снаружи справа
 * - 'outer-center' - Снаружи по центру
 * - 'outer-left' - Снаружи слева
*/

/**
 * Тип расположения оси X
 * @typedef {string} C3YAxisPosition
 * - 'inner-top' - Внутри сверху
 * - 'inner-middle' - Внутри по центру
 * - 'inner-bottom' - Внутри снизу
 * - 'outer-top' - Снаружи сверху
 * - 'outer-middle' - Снаружи по центру
 * - 'outer-bottom' - Снаружи снизу
*/

/**
 * @typedef {number|string} C3Value
 */