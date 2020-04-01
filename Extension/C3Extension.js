/**
 * C3Extension - Расширение Qlik Sense для визуализации данных в виде графиков, использующее C3.js для отрисовки
 */
define(
	// Список зависимостей
	[
		// Qlik API - API Qlik Sense, приложения для визуализации, исследования и мониторинга данных
		"qlik",
		// jQuery - библиотека для работы с HTML
		'jquery',
		// Свойства расширения
		'./C3ExtensionProperties',
		// D3.js - библиотека для манипулирования документами на основе данных
		'./packages/d3.v5.min',
		// С3.js - библиотека для построения графиков
		'./packages/c3.min',
		// Стили С3.js
		'text!./packages/c3.min.css'
	],

	/**
	 * Создаёт модуль расширения
	 * @param {QlikApi} qlik API Qlik Sense
	 * @param {*} $ jQuery - библиотека для работы с HTML
	 * @param {*} definitions - Определения настроек расширения
	 * @param {*} d3 D3.js - библиотека для манипулирования документами на основе данных
	 * @param {*} c3 C3.js - библиотека для построения графиков
	 * @param {*} c3Css Содержимое стилей C3.js
	 * @returns {*} Модуль
	 */
	function (qlik, $, definitions, d3, c3, c3Css) {
		'use strict';

		// HACK: Так C3.js найдёт свою зависимость D3.js по имени d3
		window.d3 = d3;

		/** @type {ScaleTypes} */
		var ScaleTypes = definitions.scaleTypes;
		/** @type {ChartTypes} */
		var ChartTypes = definitions.chartTypes;

		// DEBUG: Отладка настроек свойств расширения
		// console.log('Определения настроек расширения', definitions);
		
		// Добавление стилей расширения
		$('<style>')
			.html(c3Css)
			.appendTo($('head'));

		// Модуль расширения Qlik Sense
		var extensionModule = {

			// Определения свойств
			definition: definitions.properties,

			// Настройки первичной загрузки данных
			initialProperties: {
				qHyperCubeDef: {
					qDimensions: [],
					qMeasures: [],
					qInitialDataFetch: [{
						qWidth: 11,
						qHeight: 900
					}]
				}
			},

			// Настройки выгрузки
			support: {
				snapshot: true,
				export: true,
				exportData : false
			},

			/**
			 * Создаёт и обновляет интерфейс расширения
			 * @param {*} $element Родительский jQuery-элемент
			 * @param {QlikExtension} qlikExtension Данные расширения
			 * @returns {Promise} Promise завершения отрисовки
			 */
			paint: function ($element, qlikExtension) {

				try {
					// Подготовка контенера для графика
					var $containerElement = prepareContainer($element);
					var containerNode = $containerElement.get(0);

					// Получение данных из Qlik
					var chartData = getQlikChartData(qlikExtension.qHyperCube);

					// Отрисовка данных на диаграмме
					drawChart(containerNode, chartData);
				}
				catch (error) {
					console.log(error);
					throw error;
				}

				return qlik.Promise.resolve();
			}

		};

		return extensionModule;

		/**
		 * Подготавливает контейнер для графика
		 * @param {*} $parentElement Родительский jQuery-объект
		 * @returns {*} jQuery-объект контейнера
		 */
		function prepareContainer($parentElement) {
			var containerClass = 'chart-container';

			// Поиск существующего контейнера
			var $existingElement = $parentElement.find('div.' + containerClass);
			if ($existingElement.length > 0) {
				return $existingElement;
			}

			// Создание контейнера
			var $newElement = $('<div>')
				.addClass(containerClass)
				.appendTo($parentElement);
			return $newElement;
		}
		
		/* Отрисовка графика */

		/**
		 * Отрисовывает график
		 * @param {*} parentElement Родительский DOM-элемент для встраивания графика
		 * @param {Chart} chartData Данные графика
		 */
		function drawChart(parentElement, chartData) {
			
			// Подготовка данных для настроек

			var argumentSeries = chartData.argumentSeries;
			var series = [argumentSeries].concat(chartData.valueSeries);
			var getValue = function(value) { return value.value; };
			var getColumn = function (series) { return [series.id].concat(series.values.map(getValue)); };
			var columns = series.map(getColumn);
			var columnTypes = chartData.valueSeries.reduce(
				function (types, series) { 
					types[series.id] = toC3ChartType(series.type);
					return types;
				},
				{});

			// Формирование настроек графика C3

			/** @type {C3Settings} */
			var c3Settings = {
				// Родительский элемент для встраивания
				bindto: parentElement,
				data: {
					// Название столбца, определяющего значения X
					x: argumentSeries.id,
					xFormat: argumentSeries.type === ScaleTypes.TemporalScale ?
						'%d.%m.%Y':
						null,
					// Значения X и значения Y кривых
					columns: columns,
					// Типы графиков для линий
					types: columnTypes
				},
				axis: {
					// Ось X
					x: createXAxis(argumentSeries),
					// Ось Y
					y: createYAxis()
				}
			};

			// DEBUG: Отладка данных графика
			// console.log('Данные графика C3', c3Settings);

			// Отрисовка графика
			c3.generate(c3Settings);
		}
		
		/* Преобразование промежуточного представления в представление C3 */

		/**
		 * Создаёт настройки оси X
		 * @param {ArgumentSeries} argumentSeries Серия аргументов графика
		 * @returns {C3XAxis} Настройки оси X
		 */
		function createXAxis(argumentSeries) {
			/** @type {C3XAxis} */
			var xAxis = {
				// Тип шкалы
				type: toC3XAsisType(argumentSeries.type),
				// Настройки засечек
				tick: createXAxisTick(argumentSeries),
				// Подпись оси
				label: {
					text: argumentSeries.title,
					position: 'outer-center'
				}
			};
			return xAxis;
		}

		/**
		 * Создаёт настройки засечки оси X
		 * @param {ArgumentSeries} argumentSeries Серия аргументов графика
		 * @returns {C3Tick} Настройки засечки оси
		 */
		function createXAxisTick(argumentSeries) {
			switch (argumentSeries.type) {
				case ScaleTypes.TemporalScale: {
					return {
						format: '%d.%m.%Y'
					};
				}
				case ScaleTypes.NumericScale: {
					return { 
						format: d3.format('.2f')
					};
				}
				default: 
					return null;
			}
		}

		/**
		 * Преобразует тип шкалы в тип оси
		 * @param {ScaleType} scaleType Тип шкалы
		 * @returns {C3XAxisType} Тип оси X в C3
		 */
		function toC3XAsisType(scaleType) {
			switch (scaleType) {
				case ScaleTypes.CategoricalScale: {
					return 'category';
				}
				case ScaleTypes.NumericScale: {
					return 'linear';
				}
				case ScaleTypes.TemporalScale: {
					return 'timeseries';
				}
				default: {
					throw new Error('Тип оси X в С3 неизвестен для типа шкалы: ' + scaleType);
				}
			}
		}

		/**
		 * Создаёт настройки оси Y
		 * @returns {C3YAxis} Настройки оси
		 */
		function createYAxis() {
			/** @type {C3YAxis} */
			var yAxis = {
				tick: {
					format: d3.format('.2f')
				}
			};
			return yAxis;
		}

		/**
		 * Преобразует тип графика в тип графика C3
		 * @param {ChartType} chartType Тип графика
		 * @returns {C3ChartType} Тип графика C3
		 */
		function toC3ChartType(chartType) {
			switch (chartType) {
				case ChartTypes.LineChart: {
					return 'line';
				}
				case ChartTypes.BarChart: {
					return 'bar';
				}
				default: {
					throw new Error('Тип графика C3 неизвестный для типа графика: ' + chartType);
				}
			}
		}

		/* Преобразование данных из Qlik в промежуточное представление */

		/**
		 * Возвращает данные диаграммы
		 * @param {QlikHyperCube} qlikHyperCube Данные гиперкуба
		 * @returns {Chart} Данные диаграммы
		 */
		function getQlikChartData(qlikHyperCube) {
			
			// DEBUG: Отладка настроек свойств расширения
			// console.log('Данные расширения', qlikHyperCube);
			
			/** @type {Chart} */
			var chart = {
				argumentSeries: getQlikArgumentSeriesData(qlikHyperCube),
				valueSeries: getQlikValuesSeriesData(qlikHyperCube)
			};

			// DEBUG: Отладка промежуточных данных графика
			// console.log('Данные графика', chart);

			return chart;
		}

		/**
		 * Возвращает серии диаграммы
		 * @param {QlikHyperCube} qlikHyperCube Данные гиперкуба
		 * @returns {ArgumentSeries} Серия для столбца аргументов данных
		 */
		function getQlikArgumentSeriesData(qlikHyperCube) {
			var columnIndex = 0;
			/** @type {QlikDimension} */
			var qlikDimension = qlikHyperCube.qDimensionInfo[columnIndex];
			var qlikCells = qlikHyperCube.qDataPages[0].qMatrix;

			/** @type {ArgumentSeries} */
			var series = {
				id: qlikDimension.qFallbackTitle,
				title: qlikDimension.qFallbackTitle,
				values: getQlikColumnValuesData(qlikCells, columnIndex, qlikDimension.properties.scaleType),
				type: qlikDimension.properties.scaleType
			};
			return series;
		}
		
		/**
		 * Возвращает серии диаграммы
		 * @param {QlikHyperCube} qlikHyperCube Данные гиперкуба
		 * @returns {ValueSeries[]} Серии для столбцов значений данных
		 */
		function getQlikValuesSeriesData(qlikHyperCube) {
			return qlikHyperCube.qMeasureInfo.map(
				function (qlikMeasure, measureIndex) {
					return getQlikValueSeriesData(
						qlikMeasure,
						qlikHyperCube.qDataPages[0].qMatrix,
						qlikHyperCube.qDimensionInfo.length + measureIndex,
						true);
				});
		}

		/**
		 * Возвращает серию данных для столбца
		 * @param {QlikMeasure} qlikMeasure Мера гиперкуба
		 * @param {QlikCell[][]} qlikCells Ячейки данных
		 * @param {Number} columnIndex Индекс столбца
		 * @returns {ValueSeries} Серия данных диаграммы
		 */
		function getQlikValueSeriesData(qlikMeasure, qlikCells, columnIndex) {
			/** @type {ValueSeries} */
			var series = {
				id: qlikMeasure.qFallbackTitle,
				title: qlikMeasure.qFallbackTitle,
				values: getQlikColumnValuesData(qlikCells, columnIndex, ScaleTypes.NumericScale),
				type: qlikMeasure.properties.chartType
			};
			return series;
		}

		/**
		 * Возвращает значения для столбца данных
		 * @param {QlikCell[][]} qlikCells Ячейки данных
		 * @param {Number} columnIndex Индекс столбца
		 * @param {ScaleType} scaleType Тип шкалы
		 * @returns {Value[]} Значения столбца
		 */
		function getQlikColumnValuesData(qlikCells, columnIndex, scaleType) {
			return qlikCells.map(
				function (qlikRow) {
					return getQlikCellValueData(qlikRow[columnIndex], scaleType);
				});
		}

		/**
		 * Возвращает значение для ячкейки данных
		 * @param {QlikCell} qlikCell Ячейка данных
		 * @param {ScaleType} scaleType Тип шкалы
		 * @returns {Value} Значение
		 */
		function getQlikCellValueData(qlikCell, scaleType) {
			var isNumeric = scaleType === ScaleTypes.NumericScale;
			/** @type {Value} */
			var value = {
				value: isNumeric ? qlikCell.qNum : qlikCell.qText,
				title: qlikCell.qText
			};
			return value;
		}
	}
);

/**
 * JSDoc-определения для промежуточной модели данных
 */

/**
 * @typedef {Object} Chart
 * @property {ArgumentSeries} argumentSeries Последовательность аргументов
 * @property {ValueSeries[]} valueSeries Последовательность точек данных
 */

 /**
 * @typedef {Object} ArgumentSeries
 * @property {String} id Идентификатор серии
 * @property {String} title Заголовок серии
 * @property {Value[]} values Последовательность значений серии
 * @property {ScaleType} type Тип шкалы аргумента
 */

 /**
 * Тип шкалы
 * @typedef {String} ScaleType
 * - 'CategoricalScale' - Категориальная шкала
 * - 'NumericScale' - Числовая шкала
 * - 'TemporalScale' - Временная шкала
 */

/**
 * @typedef {Object} ValueSeries
 * @property {String} id Идентификатор серии
 * @property {String} title Заголовок серии
 * @property {Value[]} values Последовательность значений серии
 * @property {C3ChartType} type Тип графика
 */

/**
 * @typedef {Object} Value
 * @property {Number|String} value Значение в точке
 * @property {String} title Отображаемое значение в точке
 */

 /**
 * Тип графика
 * @typedef {String} ChartType
 * - 'LineChart' - линейный график
 * - 'BarChart' - столбчатая диаграмма
 */