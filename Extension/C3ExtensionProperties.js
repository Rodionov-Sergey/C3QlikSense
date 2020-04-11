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

		// Типы шкалы
		/** @type {ScaleTypes} */
		var scaleTypes = {
			// Категориальная шкала
			CategoricalScale: 'CategoricalScale',
			// Числовая шкала
			NumericScale: 'NumericScale',
			// Временная шкала
			TemporalScale: 'TemporalScale'
		};

		// Типы графиков
		/** @type {ChartTypes} */
		var chartTypes = {
			// Линейный график
			LineChart: 'LineChart',
			// Столбчатая диаграмма
			BarChart: 'BarChart'
		};

		// Определения свойств измерений
		var dimensionProperties = {
			// Тип шкалы
			scaleTypes: {
				ref: getColumnPropertyKey('scaleType'),
				type: 'string',
				component: 'dropdown',
				label: 'Тип шкалы',
				options: [
					{
						value: scaleTypes.CategoricalScale,
						label: 'Категориальная шкала',
					},
					{
						value: scaleTypes.NumericScale,
						label: 'Числовая шкала',
					},
					{
						value: scaleTypes.TemporalScale,
						label: 'Временная шкала'
					}
				],
				defaultValue: scaleTypes.CategoricalScale
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
						value: chartTypes.LineChart,
						label: 'Линейный график',
					},
					{
						value: chartTypes.BarChart,
						label: 'Столбчатая диаграмма',
					}
				],
				defaultValue: chartTypes.LineChart
			}
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
					// Кастомные свойства измерений
					items: dimensionProperties
				},
				// Блок свойств Меры
				measures: {
					uses: 'measures',
					min: 1,
					max: 10,
					// Кастомные свойства мер
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
				// Кастомные свойства расширения
				chart: {
					type: 'items',
					label: 'Настройки графика',
					items: {
						yAxisTitle: {
							ref: getExtensionPropertyKey('yAxisTitle'),
							type: 'string',
							label: 'Заголовок оси Y'
						},	
						legendShown: {
							ref: getExtensionPropertyKey('legendShown'),
							type: 'boolean',
							component: 'switch',
							label: 'Отображение легенды',
							options: [
								{
									value: true,
									label: 'Отобразить'
								}, {
									value: false,
									label: 'Скрыть'
								}
							],
							defaultValue: true
						}
					}
				}
			}
		};

		return {
			// Определения свойств, настраиваемых пользователем в боковой панели
			properties: properties,

			// Типы шкал
			scaleTypes: scaleTypes,

			// Типы графиков
			chartTypes: chartTypes
		};

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
	}
);

/**
 * JSDoc-определения для кастомных свойств расширения
 */

 /**
 * Данные расширения Qlik
 * @typedef {Object} ExtensionProperties
 * @property {String} yAxisTitle Заголовок оси Y
 * @property {Boolean} legendShown Признак отображения легенды
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

/* JSDoc-определения для словарей */

/**
 * Типы шкал
 * @typedef {Object} ScaleTypes
 * @property {ScaleType} CategoricalScale Категориальная шкала
 * @property {ScaleType} NumericScale Числовая шкала
 * @property {ScaleType} TemporalScale Временная шкала
 */

/**
 * Типы графиков
 * @typedef {Object} ChartTypes
 * @property {ChartType} LineChart Линейный график
 * @property {ChartType} BarChart Столбчатая диаграмма
 */