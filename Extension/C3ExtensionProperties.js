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
 */

/**
 * Столбец гиперкуба
 * @typedef {Object} ColumnProperties
 */

 /**
 * Измерение гиперкуба (добавочные поля к столбцу гиперкуба)
 * @typedef {Object} _DimensionProperties
 * @typedef {ScaleType} scaleType Тип шкалы
 */

/**
 * Измерение гиперкуба
 * @typedef {ColumnProperties & _DimensionProperties} DimensionProperties
 */

/**
 * Мера гиперкуба (добавочные поля к столбцу гиперкуба)
 * @typedef {Object} _MeasureProperties
 * @property {ChartType} chartType Тип графика
 */

/**
 * Мера гиперкуба
 * @typedef {ColumnProperties & _MeasureProperties} MeasureProperties
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
 * Тип шкалы
 * @typedef {String} ScaleType
 * - 'CategoricalScale' - Категориальная шкала
 * - 'NumericScale' - Числовая шкала
 * - 'TemporalScale' - Временная шкала
 */

/**
 * Типы графиков
 * @typedef {Object} ChartTypes
 * @property {ChartType} LineChart Линейный график
 * @property {ChartType} BarChart Столбчатая диаграмма
 */

/**
 * Тип графика
 * @typedef {String} ChartType
 * - 'LineChart' - линейный график
 * - 'BarChart' - столбчатая диаграмма
 */