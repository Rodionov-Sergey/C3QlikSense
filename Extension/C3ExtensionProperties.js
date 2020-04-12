/**
 * Настройки расширения C3Extension
 */
define(
	// Зависимости
  	[],
	/**
	 * Создаёт модуль
	 * @returns Модуль
	 */
	function () {
		'use strict';

		// Определения свойств измерений
		var dimensionProperties = {
			// Тип шкалы
			scaleType: {
				ref: getColumnPropertyKey('scaleType'),
				type: 'string',
				component: 'dropdown',
				label: 'Тип шкалы',
				options: [
					{
						value: 'CategoricalScale',
						label: 'Категориальная шкала'
					},
					{
						value: 'NumericScale',
						label: 'Числовая шкала'
					},
					{
						value: 'TemporalScale',
						label: 'Временная шкала'
					}
				],
				defaultValue: 'CategoricalScale'
			},
			// Угол наклона подписей - текстовое поле
			tickLabelAngleText: {
				ref: getColumnPropertyKey('tickLabelAngle'),
				type: 'number',
				label: 'Угол наклона подписей',
				min: -90,
				max: 90,
				defaultValue: 0
			},
			// Угол наклона подписей - слайдер
			tickLabelAngle: {
				ref: getColumnPropertyKey('tickLabelAngle'),
				type: 'number',
				component: 'slider',
				min: -90,
				max: 90,
				step: 10,
				defaultValue: 0
			}
		};

		// Определения свойств мер
		var measureProperties = {
			// Тип графика
			chartType: {
				ref: getColumnPropertyKey('chartType'),
				type: 'string',
				component: 'dropdown',
				label: 'Тип графика',
				options: [
					{
						value: 'LineChart',
						label: 'Линейный график'
					},
					{
						value: 'BarChart',
						label: 'Столбчатая диаграмма'
					}
				],
				defaultValue: 'LineChart'
			}
		};

		// Настройки легенды
		var legendProperties = {
			type: 'items',
			label: 'Легенда',
			items: {
				shown: {
					ref: getExtensionPropertyKey('legend.shown'),
					type: 'boolean',
					component: 'switch',
					label: 'Отображение легенды',
					options: [
						{
							value: true,
							label: 'Отобразить'
						},
						{
							value: false,
							label: 'Скрыть'
						}
					],
					defaultValue: true
				},
				position: {
					ref: getExtensionPropertyKey('legend.position'),
					type: 'string',
					component: 'dropdown',
					label: 'Расположение легенды',
					options: [
						{
							value: 'Bottom',
							label: 'Снизу'
						},
						{
							value: 'Right',
							label: 'Справа'
						},
						{
							value: 'Inside',
							label: 'Внутри'
						}
					],
					defaultValue: 'Bottom',
					show: function(context) {
						return context.properties.legend.shown;
					}
				}
			}
		};

		// Свойства графика
		var chartProperties = {
			// Свойства оси Y
			axisY: {
				type: 'items',
				label: 'Ось Y',
				items: {
					// Подпись оси
					title: {
						ref: getExtensionPropertyKey('axisY.title'),
						type: 'string',
						label: 'Заголовок оси Y'
					}
				}
			},
			// Свойства легенды
			legend: legendProperties
		};

		// Определения свойств
		var properties = {
			type: 'items',
			component: 'accordion',
			items: {
				// Блок свойств Измерения
				dimensions: {
					uses: 'dimensions',
					min: 1,
					max: 1,
					// Cвойства измерений графика
					items: dimensionProperties
				},
				// Блок свойств Меры
				measures: {
					uses: 'measures',
					min: 1,
					max: 10,
					// Свойства мер графика
					items: measureProperties
				},
				// Блок свойств Сортировка
				sorting: {
					uses: 'sorting'
				},
				// Блок свойств Вид
				settings: {
					uses: 'settings'
				},
				// Свойства графика
				chart: {
					type: 'items',
					component: 'expandable-items',
					label: 'Настройки графика',
					items: chartProperties
				}
			}
		};

		return properties;

	/**
	 * Формирует ключ свойства для расширения
	 * @param {String} propertyName Название свойства
	 * @returns {String} Ключ свойства
	 */
	function getExtensionPropertyKey(propertyName) {
		return 'properties.' + propertyName;
	}

	/**
	 * Формирует ключ свойства для столбца (измерения или меры)
	 * @param {String} propertyName Название свойства
	 * @returns {String} Ключ свойства
	 */
	function getColumnPropertyKey(propertyName) {
		return 'qDef.properties.' + propertyName;
	}

	/**
	 * Формирует ключ свойства для ячейки (атрибут ячейки)
	 * @param {Number} cellAttributeIndex Индекс атрибута ячейки
	 * @returns {String} Ключ свойства
	 */
	function getCellPropertyKey(cellAttributeIndex) {
		return 'qAttributeExpressions.' + cellAttributeIndex + '.qExpression';
	}
});

/**
 * JSDoc-определения для кастомных свойств расширения
 */

/**
 * Данные расширения Qlik
 * @typedef {Object} ExtensionProperties
 * @property {AxisYProperties} axisY Настройки оси Y
 * @property {LegendProperties} Настройки легенды
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
 */

/**
 * Свойства оси Y
 * @typedef {Object} AxisYProperties
 * @property {String} title Подпись оси
 */

/**
 * Настройки легенды
 * @typedef {Object} LegendProperties
 * @property {Boolean} shown Признак отображения легенды
 * @property {LegendPosition} position Расположение легенды
 */
 
/**
 * Позиция легенды
 * @typedef {String} LegendPosition
 * - 'Bottom' - Снизу
 * - 'Right' - Справа
 * - 'Inside' - Внутри
 */

/**
 * Тип шкалы
 * @typedef {String} ScaleType
 * - 'CategoricalScale' - Категориальная шкала
 * - 'NumericScale' - Числовая шкала
 * - 'TemporalScale' - Временная шкала
 */

/**
 * Тип графика
 * @typedef {String} ChartType
 * - 'LineChart' - линейный график
 * - 'BarChart' - столбчатая диаграмма
 */