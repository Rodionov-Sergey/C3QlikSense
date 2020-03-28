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
 * Данные расширения Qlik
 * @see https://help.qlik.com/en-US/sense-developer/February2020/Subsystems/APIs/Content/Sense_ClientAPIs/ExtensionAPI/paint-method.htm
 * @typedef {Object} NxExtension
 * @property {String} title - Заголовок расширения
 * @property {NxHyperCube} qHyperCube - Гиперкуб данных
 * @property {ExtensionCustomProperties} customProperties - Кастомные свойства расширения (определяются расширением)
 */

/**
 * Гиперкуб
 * @see https://help.qlik.com/en-US/sense-developer/June2019/APIs/EngineAPI/definitions-HyperCube.html
 * @typedef {Object} NxHyperCube
 * @property {NxDimension[]} qDimensionInfo - Измерения гиперкуба
 * @property {NxMeasure[]} qMeasureInfo - Меры гиперкуба
 * @property {NxDataPage[]} qDataPages - Страницы данных гиперкуба
 */

/**
 * Измерение гиперкуба
 * @see https://help.qlik.com/en-US/sense-developer/June2019/APIs/EngineAPI/definitions-NxDimensionInfo.html
 * @typedef {Object} NxDimension
 * @property {String} qFallbackTitle - Заголовок измерения
 * @property {String} othersLabel - Текст специального значения Прочее
 * @property {ColumnCustomProperties} customProperties - Кастомные свойства столбца (определяются расширением)
 */

/**
 * Мера гиперкуба
 * @see https://help.qlik.com/en-US/sense-developer/June2019/APIs/EngineAPI/definitions-NxMeasureInfo.html
 * @typedef {Object} NxMeasure
 * @property {String} qFallbackTitle - Заголовок меры
 * @property {String} othersLabel - Текст специального значения Прочее
 * @property {ColumnCustomProperties} customProperties - Кастомные свойства столбца (определяются расширением)
*/

 /**
  * Страница данных гиперкуба 
  * @see https://help.qlik.com/en-US/sense-developer/June2019/APIs/EngineAPI/definitions-NxDataPage.html
  * @typedef {Object} NxDataPage
  * @property {NxRow[]} qMatrix - Массив строк данных гиперкуба
  */

  /**
  * Страница данных гиперкуба 
  * @see https://help.qlik.com/en-US/sense-developer/June2019/APIs/EngineAPI/definitions-NxCellRows.html
  * @typedef {NxCell[]} NxRow
  */

 /**
  * Ячейка данных гиперкуба
  * @see https://help.qlik.com/en-US/sense-developer/June2019/APIs/EngineAPI/definitions-NxCell.html
  * @typedef {Object} NxCell
  * @property {Boolean} qIsEmpty - Признак пустоты ячейки
  * @property {Boolean} qIsNull - Признак null-значения в ячейке
  * @property {String} qText - Текстовые данные ячейки
  * @property {Number} qNum - Числовые данные ячейки; NaN, если нет числового значения
  * @property {NxAttributes} qAttrExps - Значения атрибутов ячейки
  */

/**
 * Значения атрибутов ячейки
 * @see https://help.qlik.com/en-US/sense-developer/June2019/APIs/EngineAPI/definitions-NxAttributeExpressionValues.html
 * @typedef {Object} NxAttributes
 * @property {NxValue} qValues Массив значений атрибутов
 */

 /**
  * Значение
  * @typedef {Object} NxValue
  * @see https://help.qlik.com/en-US/sense-developer/June2019/APIs/EngineAPI/definitions-NxSimpleValue.html
  * @property {String} qText - Текстовые данные ячейки
  * @property {Number} qNum - Числовые данные ячейки; NaN, если нет числового значения
  */