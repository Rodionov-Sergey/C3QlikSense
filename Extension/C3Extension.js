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

					// Удаление старого содержимого
					$element
						.empty();

					// Создание контейнера
					$element
						.append($('<div>')
							.attr('id', 'chart'));
					
					// Подготовка данных

					var xColumn = getQlikColumnDataWithTitle(qlikExtension.qHyperCube, 0, false);
					var xTitle = xColumn[0];
					var yColumns = qlikExtension.qHyperCube.qMeasureInfo.map(
						function (qlikMeasure, measureIndex) {
							return getQlikColumnDataWithTitle(
								qlikExtension.qHyperCube,
								qlikExtension.qHyperCube.qDimensionInfo.length + measureIndex,
								true);
						});
					var columns = [xColumn].concat(yColumns);

					// Формирование настроек графика C3

					/** @type {C3Settings} */
					var chartData = {
						bindto: '#chart',
						data: {
							// Название стоолбцы, определяющего значения X
							x: xTitle,
							// Значения X и значения Y кривых
							columns: columns
						},
						axis: {
							// Ось X
							x: {
								// Категориальная ось
								type: 'category',
								// Подпись оси
								label: {
									text: xTitle,
									position: 'outer-center'
								}
							}
						}
					};

					// Отрисовка графика
					c3.generate(chartData);
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
		 * Возвращает данные столбца Qlik
		 * @param {NxHyperCube} qlikHyperCube Данные гиперкуба
		 * @param {number} columnIndex Индекс столбца
		 * @param {boolean} isNumeric true, если необходимо взять числовое значение; иначе false
		 * @returns {C3Value[]} Значения столбца
		 */
		function getQlikColumnDataWithTitle(qlikHyperCube, columnIndex, isNumeric) {
			// Значения
			var values = getQlikColumnData(qlikHyperCube, columnIndex, isNumeric);
			// Заголовок
			var columnTitle = getQlikColumnTitle(qlikHyperCube, columnIndex);
			// Массив из заголовка и значений
			values.unshift(columnTitle);
			return values;
		}

		/**
		 * Возвращает данные столбца Qlik
		 * @param {NxHyperCube} qlikHyperCube Данные гиперкуба
		 * @param {number} columnIndex Индекс столбца
		 * @param {boolean} isNumeric true, если необходимо взять числовое значение; иначе false
		 * @param {withHeader} withHeader true, если необходимо добавить название заголовка; иначе false
		 * @returns {C3Value[]} Значения столбца
		 */
		function getQlikColumnData(qlikHyperCube, columnIndex, isNumeric) {
			return qlikHyperCube.qDataPages[0].qMatrix.map(
				function (qlikRow) {
					return isNumeric ? qlikRow[columnIndex].qNum : qlikRow[columnIndex].qText;
				});
		}
		
		/**
		 * Возвращает заголовок столбца Qlik
		 * @param {NxHyperCube} qlikHyperCube Данные гиперкуба
		 * @param {number} columnIndex Индекс столбца
		 * @param {boolean} isNumeric true, если необходимо взять числовое значение; иначе false
		 * @param {withHeader} withHeader true, если необходимо добавить название заголовка; иначе false
		 * @returns {C3Value[]} Значения столбца
		 */
		function getQlikColumnTitle(qlikHyperCube, columnIndex) {
			var qlikColumn = columnIndex < qlikHyperCube.qDimensionInfo.length ?
				qlikHyperCube.qDimensionInfo[columnIndex] :
				qlikHyperCube.qMeasureInfo[columnIndex - qlikHyperCube.qDimensionInfo.length];
			var columnTitle = qlikColumn.qFallbackTitle;
			return columnTitle;
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
 * Мера гиперкуба
 * @typedef {Object} ColumnCustomProperties
*/