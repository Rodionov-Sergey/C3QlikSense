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
	 * @param {*} d3 D3.js - библиотека для манипулирования документами на основе данных
	 * @param {*} c3 C3.js - библиотека для построения графиков
	 * @param {*} c3Css Содержимое стилей C3.js
	 */
	function (qlik, $, d3, c3, c3Css) {

		// HACK: Так C3.js найдёт свою зависимость D3.js по имени d3
		window.d3 = d3;
		
		// Добавление стилей расширения
		$('<style>')
			.html(c3Css)
			.appendTo($('head'));

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
					max: 10
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

		// Модуль расширения Qlik Sense
		var extensionModule = {

			// Определения свойств
			definition: propertyDefinitions,

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
			 * @param {NxExtension} qlikExtension Данные расширения
			 * @returns {Promise} Promise завершения отрисовки
			 */
			paint: function ($element, qlikExtension) {

				try {
					// Подготовка контенера для графика
					var containerElement = prepareContainer($element);

					// Получение данных из Qlik
					var chartData = getQlikChartData(qlikExtension.qHyperCube);

					// Отрисовка данных на диаграмме
					drawChart(containerElement.get(0), chartData);
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
		 * Подготавливает контейнер
		 * @param {*} $parentElement Родительский jQuery-элемент
		 */
		function prepareContainer($parentElement) {
			var containerClass = 'chart-container';

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

			console.log('chartData', c3Settings);

			// Отрисовка графика
			c3.generate(c3Settings);
		}

		/* Преобразование данных из Qlik в промежуточное представление */

		/**
		 * Возвращает данные диаграммы
		 * @param {NxHyperCube} qlikHyperCube Данные гиперкуба
		 * @returns {Chart} Данные диаграммы
		 */
		function getQlikChartData(qlikHyperCube) {
			/** @type {Chart} */
			var chart = {
				argumentSeries: getQlikArgumentSeriesData(qlikHyperCube),
				valueSeries: getQlikValuesSeriesData(qlikHyperCube)
			};

			console.log('chart', chart);

			return chart;
		}

		/**
		 * Возвращает серии диаграммы
		 * @param {NxHyperCube} qlikHyperCube Данные гиперкуба
		 * @returns {Chart} Данные диаграммы
		 */
		function getQlikArgumentSeriesData(qlikHyperCube) {
			return getQlikSeriesData(
				qlikHyperCube.qDimensionInfo[0],
				qlikHyperCube.qDataPages[0].qMatrix,
				0,
				false);
		}

		/**
		 * Возвращает серии диаграммы
		 * @param {NxHyperCube} qlikHyperCube Данные гиперкуба
		 * @returns {Chart} Данные диаграммы
		 */
		function getQlikValuesSeriesData(qlikHyperCube) {
			return qlikHyperCube.qMeasureInfo.map(
				function (qlikMeasure, measureIndex) {
					return getQlikSeriesData(
						qlikHyperCube.qMeasureInfo[measureIndex],
						qlikHyperCube.qDataPages[0].qMatrix,
						qlikHyperCube.qDimensionInfo.length + measureIndex,
						true);
				});
		}

		/**
		 * Возвращает серию данных для столбца
		 * @param {NxDimension|NxMeasure} qlikColumn Столбец данных
		 * @param {NxCell[][]} qlikCells Ячейки данных
		 * @param {number} columnIndex Индекс столбца
		 * @param {boolean} isNumeric Признак числовой серии
		 * @returns {Series[]} Серии данных диаграммы
		 */
		function getQlikSeriesData(qlikColumn, qlikCells, columnIndex, isNumeric) {
			/** @type {Series} */
			var series = {
				id: qlikColumn.qFallbackTitle,
				title: qlikColumn.qFallbackTitle,
				type: 'line',
				values: getQlikColumnValuesData(qlikColumn, qlikCells, columnIndex, isNumeric)
			};
			return series;
		}

		/**
		 * Возвращает значения для столбца данных
		 * @param {NxDimension|NxMeasure} qlikColumn Столбец данных
		 * @param {NxCell[][]} qlikCells Ячейки данных
		 * @param {number} columnIndex Индекс столбца
		 * @param {boolean} isNumeric Признак числовой серии
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
		 * @param {NxDimension|NxMeasure} qlikCell Столбец данных
		 * @param {NxCell} qlikCells Ячейка данных
		 * @param {number} columnIndex Индекс столбца
		 * @param {boolean} isNumeric Признак числовой серии
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
 * @typedef {object} Chart
 * @property {Series} argumentSeries Последовательность аргументов
 * @property {Series[]} valueSeries Последовательность точек данных
 */

/**
 * @typedef {object} Series
 * @property {string} id Идентификатор серии
 * @property {string} title Заголовок серии
 * @property {C3ChartType} type Тип графика
 * @property {Value[]} values Последовательность значений серии
 */

/**
 * @typedef {object} Value
 * @property {number|string} value Значение в точке
 * @property {string} title Отображаемое значение в точке
 */

/**
 * JSDoc-определения для кастомных свойств расширения
 */

 /**
 * Данные расширения Qlik
 * @typedef {Object} ExtensionCustomProperties
 */

/**
 * Мера гиперкуба
 * @typedef {Object} ColumnCustomProperties
*/