/**
 * JSDoc-определения для C3
 */

/**
 * Настройка графика C3
 * @typedef {Object} C3Settings
 * @property {String} bindto Селектор целевого элемента для вставки
 * @property {C3Data} data Данные для построения
 * @property {C3Axes} axis Настройки осей
 */

/**
 * Данные графика C3
 * @typedef {Object} C3Data
 * @property {String} x Идентификатор столбца данных для оси X
 * @property {C3Value[][]} columns Массив столбцов; Столбец - массив из идентификатора столбца и значений
 * @property {C3Value[][]} rows Массив строк; Строка - массив значений
 * @property {C3Types} types Настройки типов столбцов
 */

/**
 * Настройки типов столбцов. 
 * Объект состоит из полей, где название - идентификатор столбца, значение - тип графика
 * @typedef {Object} C3Types
 */

/**
 * Тип графика
 * @typedef {String} C3ChartType
 * - 'line' - Линейный график
 * - 'bar' - Столбчатая диаграмма
 */

/**
 * Настройки осей
 * @typedef {Object} C3Axes
 * @property {C3Axis} x Ось X
 * @property {C3Axis} y Ось Y
 * @property {C3Axis} y2 Ось Y2
 */

/**
 * Настройки оси
 * @typedef {Object} C3Axis
 * @property {boolean} show true для отображения оси, иначе false
 * @property {C3AxisType} type Тип оси
 * @property {String[]} categories Список заголовков категорий
 * @property {C3AxisLabel} label Настройки подписи оси
 */

/**
 * Тип оси
 * @typedef {String} C3AxisType
 * - 'category' - Категориальная ось - фиксированный список значений, не сравнимых по значению
 */

/**
 * Настройки подписи оси
 * @typedef {Object} C3AxisLabel
 * @property {String} text Заголовок оси
 * @property {C3XAxisPosition|C3YAxisPosition} position Расположение оси
 */

/**
 * Тип расположения оси X
 * @typedef {String} C3XAxisPosition
 * - 'inner-right' - Внутри справа
 * - 'inner-center' - Внутри по центру
 * - 'inner-left' - Внутри слева
 * - 'outer-right' - Снаружи справа
 * - 'outer-center' - Снаружи по центру
 * - 'outer-left' - Снаружи слева
*/

/**
 * Тип расположения оси Y
 * @typedef {String} C3YAxisPosition
 * - 'inner-top' - Внутри сверху
 * - 'inner-middle' - Внутри по центру
 * - 'inner-bottom' - Внутри снизу
 * - 'outer-top' - Снаружи сверху
 * - 'outer-middle' - Снаружи по центру
 * - 'outer-bottom' - Снаружи снизу
*/

/**
 * Значение в C3
 * @typedef {Number|String} C3Value
 */