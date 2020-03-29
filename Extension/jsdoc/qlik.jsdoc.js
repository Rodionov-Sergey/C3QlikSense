/**
 * JSDoc-определения для Qlik API и кастомных свойств
 */

// Qlik API

/**
 * Qlik API
 * @typedef {Object} QlikApi
 * @property {PromiseApi} Promise - Точка доступа к Promise API
 */

 /**
 * Promise API
 * @typedef {Object} PromiseApi
 * @property {function():Promise} resolve - Возвращает завершенный Promise
 */

 // Qlik API свойств и данных

/**
 * Расширение Qlik
 * @see https://help.qlik.com/en-US/sense-developer/February2020/Subsystems/APIs/Content/Sense_ClientAPIs/ExtensionAPI/paint-method.htm
 * @typedef {Object} QlikExtension
 * @property {String} title - Заголовок расширения
 * @property {QlikHyperCube} qHyperCube - Гиперкуб данных
 * @property {ExtensionProperties} properties - Кастомные свойства расширения (определяются расширением)
 */

/**
 * Гиперкуб Qlik
 * @see https://help.qlik.com/en-US/sense-developer/June2019/APIs/EngineAPI/definitions-HyperCube.html
 * @typedef {Object} QlikHyperCube
 * @property {QlikDimension[]} qDimensionInfo - Измерения гиперкуба
 * @property {QlikMeasure[]} qMeasureInfo - Меры гиперкуба
 * @property {QlikDataPage[]} qDataPages - Страницы данных гиперкуба
 */

/**
 * Столбец гиперкуба Qlik
 * @typedef {Object} QlikColumn
 * @property {String} qFallbackTitle - Заголовок меры
 * @property {String} othersLabel - Текст специального значения Прочее
 * @property {ColumnProperties} properties - Кастомные свойства столбца (определяются расширением)
 */

/**
 * Измерение гиперкуба Qlik (добавочные поля к столбцу гиперкуба)
 * @typedef {Object} _QlikDimension
 * @property {DimensionProperties} properties - Кастомные свойства измерения (определяются расширением)
 */

/**
 * Измерение гиперкуба Qlik
 * @see https://help.qlik.com/en-US/sense-developer/June2019/APIs/EngineAPI/definitions-NxDimensionInfo.html
 * @typedef {QlikColumn & _QlikDimension} QlikDimension
 */

/**
 * Мера гиперкуба Qlik (добавочные поля к столбцу гиперкуба)
 * @typedef {Object} _QlikMeasure
 * @property {MeasureProperties} properties - Кастомные свойства меры (определяются расширением)
*/

/**
 * Мера гиперкуба Qlik
 * @see https://help.qlik.com/en-US/sense-developer/June2019/APIs/EngineAPI/definitions-NxMeasureInfo.html
 * @typedef {QlikColumn & _QlikMeasure} QlikMeasure
*/

/**
 * Страница данных гиперкуба Qlik
 * @see https://help.qlik.com/en-US/sense-developer/June2019/APIs/EngineAPI/definitions-NxDataPage.html
 * @typedef {Object} QlikDataPage
 * @property {QlikRow[]} qMatrix - Массив строк данных гиперкуба
 */

/**
 * Страница данных гиперкуба Qlik
 * @see https://help.qlik.com/en-US/sense-developer/June2019/APIs/EngineAPI/definitions-NxCellRows.html
 * @typedef {QlikCell[]} QlikRow
 */

/**
 * Ячейка данных гиперкуба Qlik
 * @see https://help.qlik.com/en-US/sense-developer/June2019/APIs/EngineAPI/definitions-NxCell.html
 * @typedef {Object} QlikCell
 * @property {Boolean} qIsEmpty - Признак пустоты ячейки
 * @property {Boolean} qIsNull - Признак null-значения в ячейке
 * @property {String} qText - Текстовые данные ячейки
 * @property {Number} qNum - Числовые данные ячейки; NaN, если нет числового значения
 * @property {QlikAttributes} qAttrExps - Значения атрибутов ячейки
 */

/**
 * Значения атрибутов ячейки Qlik
 * @see https://help.qlik.com/en-US/sense-developer/June2019/APIs/EngineAPI/definitions-NxAttributeExpressionValues.html
 * @typedef {Object} QlikAttributes
 * @property {QlikValue} qValues Массив значений атрибутов
 */

/**
 * Значение Qlik
 * @typedef {Object} QlikValue
 * @see https://help.qlik.com/en-US/sense-developer/June2019/APIs/EngineAPI/definitions-NxSimpleValue.html
 * @property {String} qText - Текстовое значение ячейки
 * @property {Number} qNum - Числовое значение ячейки; NaN, если нет числового значения
 */