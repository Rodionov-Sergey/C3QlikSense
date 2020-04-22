/**
 * JSDoc-определения для C3
 */

/**
 * Настройка графика C3
 * @typedef {Object} C3Settings
 * @property {*} bindto Селектор или DOM-узел целевого элемента для вставки
 * @property {C3Data} data Данные для построения
 * @property {C3Axes} axis Настройки осей
 * @property {C3Legend} legend Настройки легенды
 * @property {C3Grid} grid Настройки сетки
 */

/**
 * Настройки сетки
 * @typedef {Object} C3Grid
 * @property {C3AxisGrid} x Настройки сетки по оси X
 * @property {C3AxisGrid} y Настройки сетки по оси Y
 */

/**
 * Настройки сетки по оси
 * @typedef {Object} C3AxisGrid
 * @property {Boolean} show Признак отображения основной сетки
 * @property {С3AxisGridLine} lines Список дополнительных линий
 */

/**
 * Настройки дополнительной линии по оси
 * @typedef {Object} С3AxisGridLine
 * @property {Number} value Значение, в котором проводится линия
 * @property {String} text Подпись линии
 * @property {'start'|'middle'|'end'} position Место расположения подписи
 */

/**
 * Настойка легенды
 * @typedef {Object} C3Legend
 * @property {Boolean} show Признак отображения
 * @property {C3LegendPosition} position Положение
 */

/**
 * Положение легенды
 * @typedef {'right'|'bottom'|'inset'} C3LegendPosition
 * - 'right' - Справа
 * - 'bottom' - Снизу
 * - 'inset' - Внутри
 */
 
/**
 * Данные графика C3
 * @typedef {Object} C3Data
 * @property {String} x Идентификатор столбца данных для оси X
 * @property {String} xFormat Форматная строка разбора значений
 * @property {C3Value[][]} columns Массив столбцов; Столбец - массив из идентификатора столбца и значений
 * @property {C3Value[][]} rows Массив строк; Строка - массив значений
 * @property {C3Types} types Настройки типов столбцов
 * @property {String[][]} groups Группы серий
 */

/**
 * Настройки типов столбцов. 
 * Объект состоит из полей, где название - идентификатор столбца, значение - тип графика
 * @typedef {Object} C3Types
 */

/**
 * Тип графика
 * @typedef {'line'|'bar'} C3ChartType
 * - 'line' - Линейный график
 * - 'bar' - Столбчатая диаграмма
 */

/**
 * Настройки осей
 * @typedef {Object} C3Axes
 * @property {C3XAxis} x Ось X
 * @property {C3YAxis} y Ось Y
 * @property {C3YAxis} y2 Ось Y2
 */

/**
 * Настройки оси X
 * @typedef {Object} C3XAxis
 * @property {boolean} show true для отображения оси, иначе false
 * @property {C3Tick} tick Настройки засечек оси
 * @property {C3XAxisLabel} label Настройки подписи оси
 * @property {C3XAxisType} type Тип оси X
 * @property {String[]=} categories Список заголовков категорий
 */

/**
 * Тип оси X
 * @typedef {'category'|'linear'|'log'|'timeseries'} C3XAxisType
 * - 'category' - Категориальная ось - фиксированный список значений, не сравнимых по значению
 * - 'linear' - Линейная числовая ось
 * - 'log' - Логарифмическая числовая ось
 * - 'timeseries' - Временная ось
 */

/**
 * Настройки подписи оси X
 * @typedef {Object} C3XAxisLabel
 * @property {String} text Заголовок оси
 * @property {C3XAxisPosition} position Расположение оси
 */

/**
 * Тип расположения оси X
 * @typedef {'inner-right'|'inner-center'|'inner-left'|
 *   'outer-right'|'outer-center'|'outer-left'} C3XAxisPosition
 * - 'inner-right' - Внутри справа
 * - 'inner-center' - Внутри по центру
 * - 'inner-left' - Внутри слева
 * - 'outer-right' - Снаружи справа
 * - 'outer-center' - Снаружи по центру
 * - 'outer-left' - Снаружи слева
*/

 /**
 * Настройки оси Y
 * @typedef {Object} C3YAxis
 * @property {boolean} show true для отображения оси, иначе false
 * @property {C3Tick} tick Настройки засечек оси
 * @property {C3YAxisLabel} label Настройки подписи оси
 */

/**
 * Настройки подписи оси Y
 * @typedef {Object} C3YAxisLabel
 * @property {String} text Заголовок оси
 * @property {C3YAxisPosition} position Расположение оси
 */

/**
 * Тип расположения оси Y
 * @typedef {'inner-top'|'inner-middle'|'inner-bottom'|
 *   'outer-top'|'outer-middle'|'outer-bottom'} C3YAxisPosition
 * - 'inner-top' - Внутри сверху
 * - 'inner-middle' - Внутри по центру
 * - 'inner-bottom' - Внутри снизу
 * - 'outer-top' - Снаружи сверху
 * - 'outer-middle' - Снаружи по центру
 * - 'outer-bottom' - Снаружи снизу
*/

/**
 * Настройки засечек оси
 * @typedef {Object} C3Tick
 * @property {String|function(Number|Date):String} format Формат или функция форматирования
 * @property {Number} rotate Угол поворота подписей засечек
 * @property {Boolean} multiline Признак включения переноса текста в подписи засечек
 * /

/**
 * Значение в C3
 * @typedef {Number|String} C3Value
 */