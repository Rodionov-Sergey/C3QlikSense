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
	 * @param {*} properties - Настройки расширения
	 * @param {*} d3 D3.js - библиотека для манипулирования документами на основе данных
	 * @param {*} c3 C3.js - библиотека для построения графиков
	 * @param {*} c3Css Содержимое стилей C3.js
	 * @returns {*} Модуль
	 */
	function (qlik, $, properties, d3, c3, c3Css) {
		'use strict';

		// HACK: Так C3.js найдёт свою зависимость D3.js по имени d3
		window.d3 = d3;

		// DEBUG: Отладка настроек свойств расширения
		// console.log('Свойства расширения', properties);
		
		// Добавление стилей расширения
		$('<style>')
			.html(c3Css)
			.appendTo($('head'));

		// Модуль расширения Qlik Sense
		var extensionModule = {

			// Определения свойств
			definition: properties.definitions,

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

			var series = [chartData.argumentSeries].concat(chartData.valueSeries);
			var getValue = function(value) { return value.value; };
			var getColumn = function (series) { return [series.id].concat(series.values.map(getValue)); };
			var columns = series.map(getColumn);
			var columnTypes = chartData.valueSeries.reduce(
				function (types, series) { types[series.id] = series.type; return types; },
				{});

			// Формирование настроек графика C3

			/** @type {C3Settings} */
			var c3Settings = {
				// Родительский элемент для встраивания
				bindto: parentElement,
				data: {
					// Название столбца, определяющего значения X
					x: chartData.argumentSeries.id,
					// Значения X и значения Y кривых
					columns: columns,
					// Типы графиков для линий
					types: columnTypes
				},
				axis: {
					// Ось X
					x: {
						// Категориальная ось
						type: 'category',
						// Подпись оси
						label: {
							text: chartData.argumentSeries.title,
							position: 'outer-center'
						}
					}
				}
			};

			// DEBUG: Отладка данных графика
			// console.log('Данные графика C3', c3Settings);

			// Отрисовка графика
			c3.generate(c3Settings);
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
		 * @returns {Series} Серия для столбца аргументов данных
		 */
		function getQlikArgumentSeriesData(qlikHyperCube) {
			return getQlikSeriesData(
				qlikHyperCube.qDimensionInfo[0],
				qlikHyperCube.qDataPages[0].qMatrix,
				0,
				true,
				false);
		}

		/**
		 * Возвращает серии диаграммы
		 * @param {QlikHyperCube} qlikHyperCube Данные гиперкуба
		 * @returns {Series[]} Серии для столбцов значений данных
		 */
		function getQlikValuesSeriesData(qlikHyperCube) {
			return qlikHyperCube.qMeasureInfo.map(
				function (qlikMeasure, measureIndex) {
					return getQlikSeriesData(
						qlikHyperCube.qMeasureInfo[measureIndex],
						qlikHyperCube.qDataPages[0].qMatrix,
						qlikHyperCube.qDimensionInfo.length + measureIndex,
						false,
						true);
				});
		}

		/**
		 * Возвращает серию данных для столбца
		 * @param {QlikDimension|QlikMeasure} qlikColumn Столбец данных
		 * @param {QlikCell[][]} qlikCells Ячейки данных
		 * @param {Number} columnIndex Индекс столбца
		 * @param {Boolean} isArgument Признак серии аргумента
		 * @param {Boolean} isNumeric Признак числовой серии
		 * @returns {Series} Серия данных диаграммы
		 */
		function getQlikSeriesData(qlikColumn, qlikCells, columnIndex, isArgument, isNumeric) {
			/** @type {Series} */
			var series = {
				id: qlikColumn.qFallbackTitle,
				title: qlikColumn.qFallbackTitle,
				type: !isArgument ? getQlikMeasureChartType(qlikColumn) : null,
				values: getQlikColumnValuesData(qlikColumn, qlikCells, columnIndex, isNumeric)
			};
			return series;
		}

		/**
		 * Возвращает тип графика для столбца данных
		 * @param {_QlikMeasure} qlikMeasure Столбец данных
		 * @returns {C3ChartType} Тип графика
		 */
		function getQlikMeasureChartType(qlikMeasure) {
			/** @type {MeasureProperties} */
			var properties = qlikMeasure.properties || { };

			/** @type {ChartType} */
			var chartType = properties.chartType;

			/** @type {ChartTypes} */
			var ChartTypes = properties.chartTypes;

			switch (chartType) {
				case ChartTypes.LineChart: {
					return 'line';
				}
				case ChartTypes.BarChart: {
					return 'bar';
				}
				case null:
				case undefined: {
					throw new Error('Не указан тип графика');
				}
				default: {
					throw new Error('Неизвестный тип графика: ' + chartType);
				}
			}
		}

		/**
		 * Возвращает значения для столбца данных
		 * @param {QlikDimension|QlikMeasure} qlikColumn Столбец данных
		 * @param {QlikCell[][]} qlikCells Ячейки данных
		 * @param {Number} columnIndex Индекс столбца
		 * @param {Boolean} isNumeric Признак числовой серии
		 * @returns {Value[]} Значения столбца
		 */
		function getQlikColumnValuesData(qlikColumn, qlikCells, columnIndex, isNumeric) {
			return qlikCells.map(
				function (qlikRow) {
					return getQlikCellValueData(qlikColumn, qlikRow[columnIndex], isNumeric);
				});
		}

		/**
		 * Возвращает значение для ячкейки данных
		 * @param {QlikDimension|QlikMeasure} qlikColumn Столбец данных
		 * @param {QlikCell} qlikCell Ячейка данных
		 * @param {Boolean} isNumeric Признак числовой серии
		 * @returns {Value} Значение
		 */
		function getQlikCellValueData(qlikColumn, qlikCell, isNumeric) {
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
 * @property {Series} argumentSeries Последовательность аргументов
 * @property {Series[]} valueSeries Последовательность точек данных
 */

/**
 * @typedef {Object} Series
 * @property {String} id Идентификатор серии
 * @property {String} title Заголовок серии
 * @property {C3ChartType} type Тип графика
 * @property {Value[]} values Последовательность значений серии
 */

/**
 * @typedef {Object} Value
 * @property {Number|String} value Значение в точке
 * @property {String} title Отображаемое значение в точке
 */