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

		// Типы графиков
		/** @type {ChartTypes} */
		var chartTypes = {
			// Линейный график
			LineChart: 'LineChart',
			// Столбчатая диаграмма
			BarChart: 'BarChart'
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
		var propertyDefinitions = {
			type: 'items',
			component: 'accordion',
			items: {
				// Блок свойств Измерения
				dimensions: {
					uses: 'dimensions',
					min: 1,
					max: 1
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
			definitions: propertyDefinitions,

			// Типы графиков
			chartTypes: chartTypes
		};

		/**
		 * Формирует ключ свойства для столбца (свойство измерения или меры)
		 * @param {String} columnName Название свойства
		 * @returns {String} Ключ свойства
		 */
		function getTablePropertyKey(columnName) {
			return 'customProperties.' + columnName;
		}

		/**
		 * Формирует ключ свойства для столбца (свойство измерения или меры)
		 * @param {String} columnName Название свойства
		 * @returns {String} Ключ свойства
		 */
		function getColumnPropertyKey(columnName) {
			return 'qDef.customProperties.' + columnName;
		}

		/**
		 * Формирует ключ свойства для ячейки (атрибут ячейки измерения или меры)
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
 * @typedef {Object} ExtensionCustomProperties
 */

/**
 * Столбец гиперкуба
 * @typedef {Object} ColumnCustomProperties
 */

 /**
 * Измерение гиперкуба (добавочные поля к столбцу гиперкуба)
 * @typedef {Object} _DimensionCustomProperties
 */

/**
 * Измерение гиперкуба
 * @typedef {ColumnCustomProperties & _DimensionCustomProperties} DimensionCustomProperties
 */

/**
 * Мера гиперкуба (добавочные поля к столбцу гиперкуба)
 * @typedef {Object} _MeasureCustomProperties
 * @property {ChartType} chartType Тип графика
 */

/**
 * Мера гиперкуба
 * @typedef {ColumnCustomProperties & _MeasureCustomProperties} MeasureCustomProperties
 */

/* JSDoc-определения для словарей */

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