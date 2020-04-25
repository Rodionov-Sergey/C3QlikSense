/**
 * JSDoc-определения для кастомных свойств расширения
 */

/**
 * Данные расширения Qlik
 * @typedef {Object} ExtensionProperties
 * @property {AxisXProperties} axisX Настройки оси X
 * @property {AxisYProperties} axisY Настройки оси Y
 * @property {LegendProperties} legend Настройки легенды
 * @property {PaletteProperties} palette Настройки палитры
 */

 /**
  * Настройки палитры
  * @typedef {Object} PaletteProperties
  * @property {String} id Идентификатор палитры
  */

/**
 * Измерение гиперкуба
 * @typedef {Object} DimensionProperties
 * @property {ScaleType} scaleType Тип шкалы
 * @property {Number} tickLabelAngle Угол поворота подписи засечки
 */

/**
 * Мера гиперкуба
 * @typedef {Object} MeasureProperties
 * @property {ChartType} chartType Тип графика
 * @property {LineChart} lineChart Настройки линейного графика
 * @property {String} groupKey Идентификатор группы
 */

/**
 * Настройки линейного графика
 * @typedef {Object} LineChart
 * @property {Boolean} pointsShown Признак отображения точек
 * @property {Boolean} lineShown Признак отображения линии
 * @property {Boolean} areaShown Признак отображения области
 */

/**
 * Свойства оси X
 * @typedef {Object} AxisXProperties
 * @property {AxisGrid} grid Сетка
 * @property {AxisGridLine[]} lines Линии
 */

/**
 * Свойства оси Y
 * @typedef {Object} AxisYProperties
 * @property {String} title Подпись оси
 * @property {AxisGrid} grid Сетка
 * @property {AxisGridLine[]} lines Линии
 */

 /**
 * Свойства сетки по оси
 * @typedef {Object} AxisGrid
 * @property {Boolean} shown Признак отображения
 * @property {'Solid'|'Dashed'} lineType Тип линии
 * @property {Number} width Толщина линии
 */

/**
 * Дополнительная линия по оси
 * @typedef {Object} AxisGridLine
 * @property {String} cId Идентификатор, назначаемый Qlik
 * @property {Number} value Значение
 * @property {Number} title Подпись
 * @property {QlikColorObject} foreground Настройки переднего плана
 */

/**
 * Настройки легенды
 * @typedef {Object} LegendProperties
 * @property {Boolean} shown Признак отображения легенды
 * @property {LegendPosition} position Расположение легенды
 */
 
/**
 * Позиция легенды
 * @typedef {'Bottom'|'Right'|'Inside'} LegendPosition
 * - 'Bottom' - Снизу
 * - 'Right' - Справа
 * - 'Inside' - Внутри
 */

/**
 * Тип шкалы
 * @typedef {'CategoricalScale'|'NumericScale'|'TemporalScale'} ScaleType
 * - 'CategoricalScale' - Категориальная шкала
 * - 'NumericScale' - Числовая шкала
 * - 'TemporalScale' - Временная шкала
 */

/**
 * Тип графика
 * @typedef {'LineChart'|'BarChart'} ChartType
 * - 'LineChart' - линейный график
 * - 'BarChart' - столбчатая диаграмма
 */