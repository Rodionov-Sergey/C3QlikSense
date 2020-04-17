/**
 * C3Extension - Расширение Qlik Sense для визуализации данных в виде графиков, использующее C3.js для отрисовки
 */
define(
	// Список зависимостей
	[
		// Qlik API - API Qlik Sense, приложения для визуализации, исследования и мониторинга данных
		'qlik',
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
	 * @param {*} properties - Определения настроек расширения
	 * @param {*} d3 D3.js - библиотека для манипулирования документами на основе данных
	 * @param {*} c3 C3.js - библиотека для построения графиков
	 * @param {*} c3Css Содержимое стилей C3.js
	 * @returns {*} Модуль
	 */
	function(qlik, $, properties, d3, c3, c3Css) {
		'use strict';

		// HACK: Так C3.js найдёт свою зависимость D3.js по имени d3
		window.d3 = d3;

		// Добавление стилей расширения
		$('<style>')
			.html(c3Css)
			.appendTo($('head'));

		// Модуль расширения Qlik Sense
		return properties.then(
			function (props) {
				console.log('properties in C3Extension', props);
				return {
					// Определения свойств
					definition: props,

					// Настройки первичной загрузки данных
					initialProperties: {
						qHyperCubeDef: {
							qDimensions: [],
							qMeasures: [],
							qInitialDataFetch: [
								{
									qWidth: 11,
									qHeight: 900
								}
							]
						}
					},

					// Настройки выгрузки
					support: {
						snapshot: true,
						export: true,
						exportData: false
					},

					/**
					 * Создаёт и обновляет интерфейс расширения
					 * @param {*} $parentElement Родительский jQuery-элемент
					 * @param {QlikExtension} qlikExtension Данные расширения
					 * @returns {Promise} Promise завершения отрисовки
					 */
					paint: function($parentElement, qlikExtension) {	
						console.log('paint');

						return getThemePromise(qlik)
							.then(
								function (qlikTheme) {
									// Отрисовка графика
									paintChart($parentElement, qlikExtension, qlikTheme);
								}
							)
							.catch(
								function (error) {
									console.log(error);
									throw error;
								}
							);
					}
				};
			}
		);
		
		/**
		 * Возвращает Promise текущей темы
		 * @param {QlikApi} qlik Qlik API
		 * @returns {Promise<QlikTheme>}
		 */
		function getThemePromise(qlik) {
			var qlikApplication = qlik.currApp();
			return qlikApplication.theme.getApplied();
		}

		/**
		 * Рисует график
		 * @param {*} $parentElement Родительский jQuery-элемент
		 * @param {QlikExtension} qlikExtension Данные расширения
		 * @param {QlikTheme} qlikTheme Тема
		 */
		function paintChart($parentElement, qlikExtension, qlikTheme) {
			try {
				// Контейнер для графика
				var $containerElement = prepareContainer($parentElement);

				// DEBUG: Отладка настроек расширения
				//console.log('Определения настроек расширения', properties);

				// Подготовка контейнера для графика
				var containerNode = $containerElement.get(0);
				
				// DEBUG: Отладка данных расширения
				//console.log('Данные расширения', qlikExtension);

				// Формирование настроек графика C3
				var c3Settings = getChartSettings(containerNode, qlikExtension, qlikTheme);

				// DEBUG: Отладка данных графика
				//console.log('Данные графика C3', c3Settings);

				// Отрисовка графика
				c3.generate(c3Settings);
			}
			catch (error) {
				console.log(error);
				throw error;
			}
		}

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

		/* Преобразование промежуточного представления в представление C3 */

		/**
		 * Создаёт настройки графика для C3
		 * @param {*} parentElement Родительский DOM-элемент для встраивания графика
		 * @param {QlikExtension} qlikExtension Данные расширения
		 * @param {QlikTheme} qlikTheme Тема
		 * @returns {C3Settings} Настройки графика C3
		 */
		function getChartSettings(parentElement, qlikExtension, qlikTheme) {
			return {
				// Родительский элемент
				bindto: parentElement,
				// Данные
				data: getChartData(qlikExtension),
				// Оси
				axis: {
					// Ось X
					x: getXAxis(qlikExtension),
					// Ось Y
					y: getYAxis(qlikExtension)
				},
				// Легенда
				legend: getLegend(qlikExtension),
				// Палитра
				color: {
					pattern: getPalette(qlikExtension, qlikTheme)
				}
			};
		}

		/**
		 * Возвращает палитру из темы
		 * @param {QlikExtension} qlikExtension Данные расширения
		 * @param {QlikTheme} qlikTheme Палитра темы из Qlik
		 * @returns {String[]} Массив цветов палитры
		 */
		function getPalette(qlikExtension, qlikTheme) {
			
			if (qlikTheme.properties == null || 
				qlikTheme.properties.palettes == null) {
				return null;
			}

			var qlikPalettes = qlikTheme.properties.palettes.data;
			if (qlikPalettes == null || qlikPalettes.length === 0) {
				return null;
			}
			
			var qlikPalette = qlikPalettes[0];
			var colorCount = qlikExtension.qHyperCube.qMeasureInfo.length;
			return getPaletteScale(qlikPalette, colorCount);
		}

		/**
		 * Возвращает цветовую шкалу палитры типа Пирамида
		 * @param {QlikDataPalette} qlikPyramidPalette Палитра
		 * @param {Number} colorCount Количество цветов
		 * @returns {String[]} Массив цветов палитры
		 */
		function getPaletteScale(qlikPalette, colorCount) {

			if (qlikPalette.type === 'pyramid') {
				return getPyramidPaletteScale(qlikPalette, colorCount);
			}
			else if (qlikPalette.type === 'row') {
				return getRowPaletteScale(qlikPalette);
			}
			
			return null;
		}

		/**
		 * Возвращает цветовую шкалу палитры типа Пирамида
		 * @param {QlikDataPalette} qlikPyramidPalette Палитра
		 * @param {Number} scaleSize Размер шкалы
		 * @returns {String[]} Массив цветов палитры
		 */
		function getPyramidPaletteScale(qlikPyramidPalette, scaleSize) {
			/** @type {Color[][]} */
			var qlikPaletteScales = qlikPyramidPalette.scale
				.filter(
					function (scale) {
						return scale != null && scale.length === scaleSize;
					}
				);

			if (qlikPaletteScales.length > 0) {
				return qlikPaletteScales[0];
			}
				
			return qlikPyramidPalette.scale[qlikPyramidPalette.scale.length-1];
		}

		/**
		 * Возвращает цветовую шкалу палитры типа Ряд
		 * @param {QlikDataPalette} qlikRowPalette Палитра
		 * @returns {Color[]} Массив цветов палитры
		 */
		function getRowPaletteScale(qlikRowPalette) {
			return qlikRowPalette.scale;
		}

		/**
		 * Возвращает данные графика
		 * @param {QlikExtension} qlikExtension Данные расширения
		 * @returns {C3Data} Данные графика C3
		 */
		function getChartData(qlikExtension) {

			var qlikHyperCube = qlikExtension.qHyperCube;

			if (qlikHyperCube.qDimensionInfo.length !== 1) {
				throw new Error('Сконфигурировано некорректное число измерений.');
			}

			var argumentColumnIndex = 0;
			var argumentDimension = qlikHyperCube.qDimensionInfo[argumentColumnIndex];

			var dimensionValues = getDimensionIdAndValues(qlikHyperCube, argumentDimension, argumentColumnIndex);
			var valueMeasures = qlikHyperCube.qMeasureInfo;
			var measureValues = valueMeasures.map(
				function (qlikMeasure, index) {
					return getMeasureIdAndValues(qlikHyperCube, qlikMeasure, index + 1);
				}
			);
			var allValues = [dimensionValues].concat(measureValues);

			return {
				// Название столбца, определяющего значения X
				x: getColumnId(argumentDimension),
				// Формат аргументов
				xFormat: getXFormat(argumentDimension),
				// Значения X и значения Y кривых
				columns: allValues,
				// Типы графиков для линий
				types: getColumnTypes(valueMeasures)
			};
		}

		/**
		 * Возвращает идентификатор столбца
		 * @param {QlikDimension|QlikMEasure} qlikColumn Столбец данных
		 * @returns {String} Идентификатор столбца
		 */
		function getColumnId(qlikColumn) {
			return qlikColumn.qFallbackTitle;
		}

		/**
		 * Возвращает значения данных измерения
		 * @param {QlikHyperCube} qlikHyperCube Данные гиперкуба
		 * @param {QlikDimension} qlikDimension Измерение
		 * @param {Number} index Индекс столбца
		 * @returns {(Number|String)[]} Идентификатор и значения ячеек
		 */
		function getDimensionIdAndValues(qlikHyperCube, qlikDimension, index) {
			var scaleType = qlikDimension.properties.scaleType;
			return getColumnIdAndValues(qlikHyperCube, qlikDimension, index, scaleType);
		}

		/**
		 * Возвращает значения данных меры
		 * @param {QlikHyperCube} qlikHyperCube Данные гиперкуба
		 * @param {QlikDimension} qlikMeasure Мера
		 * @param {Number} index Индекс столбца
		 * @returns {(Number|String)[]} Идентификатор и значения ячеек
		 */
		function getMeasureIdAndValues(qlikHyperCube, qlikMeasure, index) {
			return getColumnIdAndValues(qlikHyperCube, qlikMeasure, index, 'NumericScale');
		}

		/**
		 * Возвращает значения данных столбца
		 * @param {QlikHyperCube} qlikHyperCube Данные гиперкуба
		 * @param {QlikDimension|QlikMeasure} qlikColumn Столбец данных
		 * @param {Number} index Индекс столбца
		 * @param {ScaleType} scaleType Тип шкалы
		 * @returns {(Number|String)[]} Идентификатор и значения ячеек
		 */
		function getColumnIdAndValues(qlikHyperCube, qlikColumn, index, scaleType) {
			var columnId = getColumnId(qlikColumn);
			var values = getColumnValues(qlikHyperCube, index, scaleType);
			return [columnId].concat(values);
		}

		/**
		 * Возвращает значения для столбца данных
		 * @param {QlikHyperCube} qlikHyperCube Данные гиперкуба
		 * @param {Number} columnIndex Индекс столбца
		 * @param {ScaleType} scaleType Тип шкалы
		 * @returns {(Number|String)[]} Значения столбца
		 */
		function getColumnValues(qlikHyperCube, columnIndex, scaleType) {
			return qlikHyperCube.qDataPages[0].qMatrix.map(
				function(qlikRow) {
					return getCellValue(qlikRow[columnIndex], scaleType);
				}
			);
		}
		
		/**
		 * Возвращает числовое значение ячейки
		 * @param {QlikCell} qlikCell Ячека данных
		 * @param {ScaleType} scaleType Тип шкалы
		 * @returns {Number|String} Значение ячейки
		 */
		function getCellValue(qlikCell, scaleType) {
			return scaleType === 'NumericScale' ? qlikCell.qNum : qlikCell.qText;
		}

		/**
		 * Возвращает формат подписей измерения
		 * @param {QlikDimension} qlikDimension Измерение аргумента
		 * @returns {String=} Форматная строка аргумента
		 */
		function getXFormat(qlikDimension) {
			switch (qlikDimension.properties.scaleType) {
				case 'TemporalScale':
					return '%d.%m.%Y';
				default:
					return null;
			}
		}

		/**
		 * Возвращает типы графиков для мер
		 * @param {QlikMeasure[]} qlikMeasures Меры
		 * @returns {*} Типы столбцов
		 */
		function getColumnTypes(qlikMeasures) {
			return qlikMeasures.reduce(
				function(types, qlikMeasure) {
					types[getColumnId(qlikMeasure)] = getColumnType(qlikMeasure.properties.chartType);
					return types;
				}, 
				{}
			);
		}

		/**
		 * Возращает тип графика для меры
		 * @param {ChartType} chartType Мера
		 * @returns {C3ChartType} Тип графика C3
		 */
		function getColumnType(chartType) {
			switch (chartType) {
				case 'LineChart': {
					return 'line';
				}
				case 'BarChart': {
					return 'bar';
				}
				default: {
					throw new Error('Неизвестный тип графика: ' + chartType);
				}
			}
		}

		/**
		 * Возвращает настройки оси X
		 * @param {QlikExtension} qlikExtension Данные расширения
		 * @returns {C3XAxis} Настройки оси X
		 */
		function getXAxis(qlikExtension) {
			var qlikDimension = qlikExtension.qHyperCube.qDimensionInfo[0];
			return {
				// Тип шкалы
				type: getXAsisType(qlikDimension.properties.scaleType),
				// Настройки засечек
				tick: getXAxisTick(qlikDimension),
				// Подпись оси
				label: {
					text: qlikDimension.qFallbackTitle,
					position: 'outer-center'
				}
			};
		}

		/**
		 * Возвращает настройки засечки оси X
		 * @param {QlikDimension} qlikDimension Измерение
		 * @returns {C3Tick} Настройки засечки оси
		 */
		function getXAxisTick(qlikDimension) {
			return {
				format: getXTickFormat(qlikDimension.properties.scaleType),
				rotate: qlikDimension.properties.tickLabelAngle,
				multiline: false
			};
		}

		/**
		 * Возвращает формат для типа шкалы аргументов
		 * @param {ScaleType} scaleType Тип шкалы
		 * @return {String|function(*):String} Строка формата или функция форматирования
		 */
		function getXTickFormat(scaleType) {
			switch (scaleType) {
				case 'TemporalScale':
					return '%d.%m.%Y';
				case 'NumericScale':
					return d3.format('.2f');
				default:
					return null;
			}
		}

		/**
		 * Возвращает тип шкалы для оси X
		 * @param {ScaleType} scaleType Измерение
		 * @returns {C3XAxisType} Тип оси X
		 */
		function getXAsisType(scaleType) {
			switch (scaleType) {
				case 'CategoricalScale':
					return 'category';
				case 'NumericScale':
					return 'linear';
				case 'TemporalScale':
					return 'timeseries';
				default:
					throw new Error('Неизвестный тип оси X: ' + scaleType);
			}
		}
		
		/**
		 * Возвращает настройки оси Y
		 * @param {QlikExtension} qlikExtension Данные расширения
		 * @returns {C3YAxis} Настройки оси
		 */
		function getYAxis(qlikExtension) {
			return {
				label: {
					text: qlikExtension.properties.axisY.title,
					position: 'outer-middle'
				},
				tick: {
					format: d3.format('.2f')
				}
			};
		}

		/**
		 * Возвращает настройки легенды
		 * @param {QlikExtension} qlikExtension Данные расширения
		 * @returns {C3Legend} Настройки егенды
		 */
		function getLegend(qlikExtension) {
			var legendProperties = qlikExtension.properties.legend;
			return {
				// Признак отображения
				show: legendProperties.shown,
				// Положение
				position: getLegendPosition(legendProperties.position)
			};
		}
		
		/**
		 * Возвращает положение легегды для C3
		 * @param {LegendPosition} position Положение легенды
		 * @returns {C3LegendPosition} Положение легенды для C3
		 */
		function getLegendPosition(position) {
			switch (position) {
				case 'Right':
					return 'right';
				case 'Bottom':
					return 'bottom';
				case 'Inside':
					return 'inset';
				default:
					throw new Error('Неизвестное положение легенды: ' + position);
			}
		}
	}
);