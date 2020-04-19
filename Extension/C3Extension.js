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
	 * @param {*} propertiesFactory - Определения настроек расширения
	 * @param {*} d3 D3.js - библиотека для манипулирования документами на основе данных
	 * @param {*} c3 C3.js - библиотека для построения графиков
	 * @param {*} c3Css Содержимое стилей C3.js
	 * @returns {*} Модуль
	 */
	function(qlik, $, propertiesFactory, d3, c3, c3Css) {
		'use strict';

		// HACK: Так C3.js найдёт свою зависимость D3.js по имени d3
		window.d3 = d3;

		// Добавление стилей расширения
		$('<style>')
			.html(c3Css)
			.appendTo($('head'));
		
		// Модуль расширения Qlik Sense
		return getThemePromise(qlik)
			.then(
				function (qlikTheme) {

					var properties = propertiesFactory.getProperties(qlikTheme);					

					// DEBUG: Отладка настроек расширения
					//console.log('Определения настроек расширения', properties);

					return {
						// Определения свойств
						definition: properties,
						// Настройки первичной загрузки данных
						initialProperties: propertiesFactory.getInitialProperties(),
						// Настройки выгрузки
						support: propertiesFactory.getSupportProperties(),

						/**
						 * Создаёт и обновляет интерфейс расширения
						 * @param {*} $parentElement Родительский jQuery-элемент
						 * @param {QlikExtension} qlikExtension Данные расширения
						 * @returns {Promise} Promise завершения отрисовки
						 */
						paint: function($parentElement, qlikExtension) {
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
			return qlik.currApp().theme.getApplied();
		}

		/**
		 * Рисует график
		 * @param {*} $parentElement Родительский jQuery-элемент
		 * @param {QlikExtension} qlikExtension Данные расширения
		 * @param {QlikTheme} qlikTheme Тема
		 */
		function paintChart($parentElement, qlikExtension, qlikTheme) {

			// DEBUG: Отладка данных расширения
			//console.log('Тема', qlikTheme);

			// Контейнер для графика
			var $containerElement = prepareContainer($parentElement);
			
			// DEBUG: Отладка данных расширения
			//console.log('Данные расширения', qlikExtension);

			// Формирование настроек графика C3
			var c3Settings = getChartSettings(qlikExtension, qlikTheme);

			// DEBUG: Отладка данных графика
			//console.log('Данные графика C3', c3Settings);

			// Отрисовка графика
			var $chart = createChartUi($containerElement, c3Settings, qlikExtension);

			// Настройка стилей графика
			styleChartUi($chart, qlikTheme)
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
		 * @param {QlikExtension} qlikExtension Данные расширения
		 * @param {QlikTheme} qlikTheme Тема
		 * @returns {C3Settings} Настройки графика C3
		 */
		function getChartSettings(qlikExtension, qlikTheme) {
			return {
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
		 * @returns {String[]} Массив цветов палитры; 
		 *   null, если не указаны настройки или нет палитр в теме
		 */
		function getPalette(qlikExtension, qlikTheme) {
			// Не указаны настройки палитры
			if (qlikExtension.properties == null ||
				qlikExtension.properties.palette == null) {
					return null;
			}

			// В теме нет свойств или палитр
			if (qlikTheme.properties == null || 
				qlikTheme.properties.palettes == null) {
				return null;
			}

			// В палитрах нет данных
			var qlikPalettes = qlikTheme.properties.palettes.data;
			if (qlikPalettes == null || qlikPalettes.length === 0) {
				return null;
			}

			// Поиск палитры в теме по идентификатору
			var qlikPalette = null;
			for (var i = 0; i < qlikPalettes.length; i++) {
				if (qlikPalettes[i].propertyValue === qlikExtension.properties.palette.id) {
					qlikPalette = qlikPalettes[i];
					break;
				}
			}

			// Если палитра не найдена
			if (qlikPalette == null) {
				// Используется первая палитра из темы
				qlikPalette = qlikPalettes[0];
			}

			// Получение цветов палитры
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
			switch (qlikPalette.type) {
				// Пирамидальная палитра
				case 'pyramid':
					return getPyramidPaletteScale(qlikPalette, colorCount);
				// Палитра с набором цветов
				case 'row':
					return getRowPaletteScale(qlikPalette);
				default:
					// Цвета палитры не найдены
					return null;
			}
		}

		/**
		 * Возвращает цветовую шкалу палитры типа Пирамида
		 * @param {QlikDataPalette} qlikPyramidPalette Палитра
		 * @param {Number} scaleSize Размер шкалы
		 * @returns {String[]} Массив цветов палитры
		 */
		function getPyramidPaletteScale(qlikPyramidPalette, scaleSize) {
			var colorScales = qlikPyramidPalette.scale;
			// Нет цветовых шкал
			if (colorScales.length === 0) {
				return null;
			}

			// Поиск цветовой шкалы требуемого размера
			for (var i = 0; i < colorScales.length; i++) {
				var colorScale = colorScales[i];
				if (colorScale != null && colorScale.length === scaleSize) {
					// Найдена цветовая шкала
					return colorScale;
				}
			}
			
			// Иначе возьмём последнюю шкалу (предположительно самая большая)
			return colorScales[colorScales.length-1];
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
				// Типы графиков для серий
				types: getColumnTypes(valueMeasures),
				// Отображаемые названия серий
				names: getColumnTitles(valueMeasures)
			};
		}

		/**
		 * Возвращает идентификатор столбца
		 * @param {QlikDimension|QlikMEasure} qlikColumn Столбец данных
		 * @returns {String} Идентификатор столбца
		 */
		function getColumnId(qlikColumn) {
			return qlikColumn.cId;
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
				case 'LineChart':
					return 'area';
				case 'BarChart':
					return 'bar';
				default:
					throw new Error('Неизвестный тип графика: ' + chartType);
			}
		}

		/**
		 * Возвращает названия серий для мер
		 * @param {QlikMeasure[]} qlikMeasures Меры
		 * @returns {*} Названия столбцов
		 */
		function getColumnTitles(qlikMeasures) {
			return qlikMeasures.reduce(
				function(titles, qlikMeasure) {
					titles[getColumnId(qlikMeasure)] = qlikMeasure.qFallbackTitle;
					return titles;
				}, 
				{}
			);
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
		
		/**
		 * Создаёт интерфейс графика
		 * @param {*} $containerElement jQuery-объект контейнера для графика
		 * @param {C3Settings} c3Settings Настройки графика C3
		 * @param {QlikExtension} qlikExtension Расширение
		 * @returns {*} jQuery-объект SVG-элемента графика
		 */
		function createChartUi($containerElement, c3Settings, qlikExtension) {

			// Указание контейнера для графика
			c3Settings.bindto = $containerElement.get(0);

			// Отрисовка графика в SVG
			c3.generate(c3Settings);

			// Созданный элемент
			var $chartElement = $containerElement.children('svg');

			// Исправление элементов графика
			refineChartUi($chartElement, qlikExtension);

			return $chartElement;
		}

		/**
		 * Исправляет интерфейс графика
		 * @param {*} $chartElement jQuery-объект графика
		 * @param {QlikExtension} qlikExtension Расширение
		 * @returns {*} jQuery-объект SVG-элемента графика
		 */
		function refineChartUi($chartElement, qlikExtension) {

			// Улучшения для серий
			qlikExtension.qHyperCube.qMeasureInfo.forEach(
				function (qlikMeasure) {
					refineSeriesUi($chartElement, qlikMeasure);
				}
			);
		}

		/**
		 * Исправляет интерфейс серии графика
		 * @param {*} $chartElement jQuery-объект графика
		 * @param {QlikMeasure} qlikMeasure Мера
		 */
		function refineSeriesUi($chartElement, qlikMeasure) {

			// Для линейного графика
			if (qlikMeasure.properties.chartType === "LineChart" && 
				qlikMeasure.properties.lineChart != null) {

				// Управление видимостью точек
				if (!qlikMeasure.properties.lineChart.pointsShown) {
					$chartElement
						.find(".c3-circles-" + qlikMeasure.cId)
						.remove();
				}
				
				// Управление видимостью линии
				if (!qlikMeasure.properties.lineChart.lineShown) {
					$chartElement
						.find(".c3-lines-" + qlikMeasure.cId)
						.remove();
				}

				// Управление видимостью области
				if (!qlikMeasure.properties.lineChart.areaShown) {
					$chartElement
						.find(".c3-areas-" + qlikMeasure.cId)
						.remove();
				}
			}
		}

		/**
		 * Настраивает стиль графика
		 * @param {*} $chart jQuery-объект SVG-элемента графика
		 * @param {QlikTheme} qlikTheme Тема
		 */
		function styleChartUi($chart, qlikTheme) {
			// Легенда
			// Подпись элемента легенды
			$chart
				.find('.c3-legend-item > text')
				.css('fill', qlikTheme.getStyle('object', 'legend.label', 'color'));

			// Ось
			// Цвет оси
			$chart
				.find('.c3-axis > path.domain ')
				.css('stroke', qlikTheme.getStyle('object', 'axis.line.major', 'color'));
			// Подпись оси
			$chart
				.find('text.c3-axis-x-label, text.c3-axis-y-label')
				.css('fill', qlikTheme.getStyle('object', 'axis.title', 'color'));

			// Засечки оси
			// Цвет засечек
			$chart
				.find('.c3-axis > .tick > line')
				.css('stroke', qlikTheme.getStyle('object', 'axis.line.minor', 'color'));
			// Подписи засечек осей
			$chart
				.find('.c3-axis > .tick > text')
				.css('fill', qlikTheme.getStyle('object', 'axis.label.name', 'color'));
		}
	}
);