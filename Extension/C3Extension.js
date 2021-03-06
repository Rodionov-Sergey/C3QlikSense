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
	 * Создаёт расширение
	 * @param {QlikApi} qlik API Qlik Sense
	 * @param {*} $ jQuery - библиотека для работы с HTML
	 * @param {*} propertiesFactory - Определения настроек расширения
	 * @param {*} d3 D3.js - библиотека для манипулирования документами на основе данных
	 * @param {*} c3 C3.js - библиотека для построения графиков
	 * @param {*} c3Css Содержимое стилей C3.js
	 * @returns {*} Расширение
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
			.then(createExtension);

		/**
		 * Создаёт расширение
		 * @param {QlikTheme} qlikTheme Тема
		 * @returns {*} Расширение
		 */
		function createExtension(qlikTheme) {

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
								// eslint-disable-next-line no-console
								console.log(error);
								throw error;
							}
						);
				}
			};
		}
		
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

			// DEBUG: Отладка темы
			//console.log('Тема', qlikTheme);

			// Контейнер для графика
			var $container = prepareContainer($parentElement);
			
			// DEBUG: Отладка данных расширения
			//console.log('Данные расширения', qlikExtension);

			// Формирование настроек графика C3
			var c3Settings = getChartSettings(qlikExtension, qlikTheme);

			// DEBUG: Отладка данных графика
			//console.log('Данные графика C3', c3Settings);

			// Отрисовка графика
			var $chart = createChart($container, c3Settings, qlikExtension);

			// Применяет тему к графику
			themeChart($chart, qlikTheme);

			// Применяет стили к графику
			styleChart($chart, qlikExtension, qlikTheme);
		}

		/**
		 * Подготавливает контейнер для графика
		 * @param {*} $parent Родительский jQuery-объект
		 * @returns {*} jQuery-объект контейнера
		 */
		function prepareContainer($parent) {
			var containerClass = 'chart-container';

			// Поиск существующего контейнера
			var $existingElement = $parent.find('div.' + containerClass);
			if ($existingElement.length > 0) {
				return $existingElement;
			}

			// Создание контейнера
			var $container = $('<div>')
				.addClass(containerClass)
				.appendTo($parent);
			
			return $container;
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
				},
				// Сетка
				grid: getGrid(qlikExtension),
				// Регионы
				regions: getRegions(qlikExtension)
			};
		}

		/**
		 * Возвращает настройки регионов
		 * @param {QlikExtension} qlikExtension Данные расширения
		 * @returns {C3Region[]} Настройки регионов
		 */
		function getRegions(qlikExtension) {
			var xRanges = qlikExtension.properties.axisX.ranges.map(
				function(range) {
					return getRegion(range, 'x');
				}
			);
			var yRanges = qlikExtension.properties.axisY.ranges.map(
				function(range) {
					return getRegion(range, 'y');
				}
			);
			return xRanges.concat(yRanges);
		}

		/**
		 * Возвращает настройки регионов
		 * @param {AxisGridRange} range Регион
		 * @param {C3AxisType} axisType Тип оси
		 * @returns {C3Region} Настройки региона
		 */
		function getRegion(range, axisType) {
			return {
				axis: axisType, 
				label: range.title,
				start: range.startValue,
				end: range.finishValue,
				class: range.cId
			};
		}

		/**
		 * Возвращает настройки сетки
		 * @param {QlikExtension} qlikExtension Данные расширения
		 * @returns {C3Grid} Настройки сетки
		 */
		function getGrid(qlikExtension) {
			/** @type {ExtensionProperties} */
			var properties = qlikExtension.properties || { };
			return {
				// Сетка по X
				x: getAxisGrid(properties.axisX),
				// Сетка по Y
				y: getAxisGrid(properties.axisY)
				
			};
		}

		/**
		 * Возвращает настройки сетки по оси
		 * @param {AxisXProperties|AxisYProperties} axis Свойства оси
		 * @returns {C3AxisGrid} Настройки сетки по оси
		 */
		function getAxisGrid(axis) {
			if (axis == null) {
				return undefined;
			}
			return {
				// Отображение сетки
				show: axis.grid != null ? axis.grid.shown : false,
				// Дополнительные линии
				lines: axis.lines != null ? axis.lines.map(getAxisGridLine) : undefined
			};
		}

		/**
		 * Возвращает настройки дополнительной линии сетки
		 * @param {AxisGridLine} line Свойства оси
		 * @returns {C3AxisGridLine} Настройки дополнительной сетки по оси C3
		 */
		function getAxisGridLine(line) {
			return {
				// Значение
				value: line.value,
				// Подпись
				text: line.title,
				// Класс для применения стиля после отрисовки
				'class': line.cId
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
		 * @param {QlikPalette} qlikPyramidPalette Палитра
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
		 * @param {QlikPalette} qlikPyramidPalette Палитра
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
		 * @param {QlikPalette} qlikRowPalette Палитра
		 * @returns {Color[]} Массив цветов палитры
		 */
		function getRowPaletteScale(qlikRowPalette) {
			return qlikRowPalette.scale;
		}

		// === Конфигурирование графика ===

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
				x: getSeriesId(argumentDimension),
				// Формат аргументов
				xFormat: getXFormat(argumentDimension),
				// Значения X и значения Y кривых
				columns: allValues,
				// Типы графиков для серий
				types: getSeriesTypes(valueMeasures),
				// Отображаемые названия серий
				names: getSeriesTitles(valueMeasures),
				// Группы
				groups: getSeriesGroups(valueMeasures)
			};
		}

		/**
		 * Возвращает идентификатор столбца
		 * @param {QlikDimension|QlikMEasure} qlikColumn Столбец данных
		 * @returns {String} Идентификатор столбца
		 */
		function getSeriesId(qlikColumn) {
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
			var columnId = getSeriesId(qlikColumn);
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
		function getSeriesTypes(qlikMeasures) {
			return qlikMeasures.reduce(
				function(types, qlikMeasure) {
					types[getSeriesId(qlikMeasure)] = getColumnType(qlikMeasure.properties.chartType);
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
		function getSeriesTitles(qlikMeasures) {
			return qlikMeasures.reduce(
				function(titles, qlikMeasure) {
					titles[getSeriesId(qlikMeasure)] = qlikMeasure.qFallbackTitle;
					return titles;
				}, 
				{}
			);
		}

		/**
		 * Возвращает группы серий для мер
		 * @param {QlikMeasure[]} qlikMeasures Меры
		 * @returns {String[][]} Группы серий
		 */
		function getSeriesGroups(qlikMeasures) {
			var groups = {};
			for ( var i = 0; i < qlikMeasures.length; i++) {
				var qlikMeasure = qlikMeasures[i];
				var groupKey = qlikMeasure.properties.groupKey;
				// Если указана группа
				if (groupKey != null && groupKey != '') {
					if (groups[groupKey] == null) {
						groups[groupKey] = [];
					}
					groups[groupKey].push(qlikMeasure.cId);
				}	
			}
			return objectValues(groups);
		}

		/**
		 * Преобразует значений объектов в массив
		 * @param {*} obj Объект
		 * @returns {any[]} Массив значений
		 */
		function objectValues(obj) {		
			var values = [];
			for (var key in obj) {
				values.push(obj[key]);
			}
			return values;
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

		// === Отрисовка графика ===
		
		/**
		 * Создаёт интерфейс графика
		 * @param {*} $container jQuery-объект контейнера для графика
		 * @param {C3Settings} c3Settings Настройки графика C3
		 * @returns {*} jQuery-объект SVG-элемента графика
		 */
		function createChart($container, c3Settings) {

			// Указание контейнера для графика
			c3Settings.bindto = $container.get(0);

			// Отрисовка графика в SVG
			c3.generate(c3Settings);

			// Созданный элемент
			var $chart = $container.children('svg');

			return $chart;
		}

		// === Применение темы ===

		/**
		 * Темизует интерфейс графика
		 * @param {*} $chart jQuery-объект SVG-элемента графика
		 * @param {QlikTheme} qlikTheme Тема
		 */
		function themeChart($chart, qlikTheme) {

			var getThemeValue = function (propertyPath, propertyName) {
				return qlikTheme.getStyle('object.lineChart', propertyPath, propertyName);
			};

			// Легенда
			// Подпись элемента легенды
			$chart
				.find('.c3-legend-item > text')
				.css('fill', getThemeValue('legend.label', 'color'));

			// Ось
			// Цвет оси
			$chart
				.find('.c3-axis > path.domain ')
				.css('stroke', getThemeValue('axis.line.major', 'color'));
			// Подпись оси
			$chart
				.find('text.c3-axis-x-label, text.c3-axis-y-label')
				.css('fill', getThemeValue('axis.title', 'color'))
				.css('fontSize', getThemeValue('axis.title', 'fontSize'));

			// Засечки оси
			// Цвет засечек
			$chart
				.find('.c3-axis > .tick > line')
				.css('stroke', getThemeValue('axis.line.minor', 'color'));
			// Подписи засечек осей
			$chart
				.find('.c3-axis > .tick > text')
				.css('fill', getThemeValue('axis.label.name', 'color'))
				.css('fontSize', getThemeValue('axis.label.name', 'fontSize'));

			// Сетка
			$chart
				.find('line.c3-xgrid, line.c3-ygrid')
				.css('stroke', getThemeValue('grid.line.minor', 'color'));

			// Дополнительные линии
			var $gridLineContainer = $chart
				.find('.c3-xgrid-line, .c3-ygrid-line');
			var gridLineThemeColor = getThemeValue('referenceLine.label.name', 'color');
			// Цвет линии
			$gridLineContainer
				.children('line')
				.css('stroke', gridLineThemeColor);
			// Цвет текста
			$gridLineContainer
				.children('text')
				.css('fill', gridLineThemeColor)
				.css('font-size', getThemeValue('referenceLine.label.name', 'fontSize'));
				
			// Регион
			var $gridRangeContainer = $chart
				.find('g.c3-region');
			var gridRangeThemeColor = getThemeValue('referenceLine.label.name', 'color');
			// Цвет заливки
			$gridRangeContainer.children('rect')
				.css('fill', gridRangeThemeColor);
			// Цвет подписи
			$gridRangeContainer.children('text')	
				.css('fill', gridRangeThemeColor)
				.css('font-size', getThemeValue('referenceLine.label.name', 'fontSize'));
		}

		// === Применение стилей ===

		/**
		 * Стилизует график
		 * @param {*} $chart jQuery-объект графика
		 * @param {QlikExtension} qlikExtension Расширение
		 * @param {QlikTheme} qlikTheme Тема
		 */
		function styleChart($chart, qlikExtension, qlikTheme) {
			// Cерии
			qlikExtension.qHyperCube.qMeasureInfo
				.forEach(
					function (qlikMeasure) {
						styleSeries($chart, qlikMeasure);
					}
				);

			// Ось X
			styleAxis($chart, qlikExtension.properties.axisX, qlikTheme, 'c3-xgrid');
			// Ось Y
			styleAxis($chart, qlikExtension.properties.axisY, qlikTheme, 'c3-ygrid');
		}

		/**
		 * Стилизует ось графика
		 * @param {*} $chart jQuery-объект графика
		 * @param {AxisXProperties|AxisYProperties} axis Настройки оси
		 * @param {QlikTheme} qlikTheme Тема
		 * @param {String} gridClass Класс элементов линии сетки
		 */
		function styleAxis($chart, axis, qlikTheme, gridClass) {
			if (axis == null) {
				return;
			}

			// Стилизация линий
			axis.lines
				.forEach(
					function (line) {
						styleAxisGridLine($chart, line, qlikTheme);
					}
				);

			// Стилизация сетки
			var dashArray = axis.grid.lineType === 'Solid' ? '0' : '4';
			$chart
				.find('line.'+ gridClass)
				.css('stroke-dasharray', dashArray)
				.css('stroke-width', axis.grid.width);

			// Стилизация региона
			axis.ranges
				.forEach(
					function (range) {
						styleAxisGridRange($chart, range, qlikTheme);
					}
				);	
		}

		/**
		 * Стилизует серию графика
		 * @param {*} $chart jQuery-объект графика
		 * @param {QlikMeasure} qlikMeasure Мера
		 */
		function styleSeries($chart, qlikMeasure) {

			// Для линейного графика
			if (qlikMeasure.properties.chartType === 'LineChart' && 
				qlikMeasure.properties.lineChart != null) {

				// Управление видимостью точек
				if (!qlikMeasure.properties.lineChart.pointsShown) {
					$chart
						.find('.c3-circles-' + qlikMeasure.cId)
						.remove();
				}
				
				// Управление видимостью линии
				if (!qlikMeasure.properties.lineChart.lineShown) {
					$chart
						.find('.c3-lines-' + qlikMeasure.cId)
						.remove();
				}

				// Управление видимостью области
				if (!qlikMeasure.properties.lineChart.areaShown) {
					$chart
						.find('.c3-areas-' + qlikMeasure.cId)
						.remove();
				}
			}
		}

		/**
		 * Стилизует линию по оси
		 * @param {*} $chart jQuery-объект графика
		 * @param {AxisGridLine} axisGridLine Линия по оси
		 * @param {QlikTheme} qlikTheme Тема
		 */
		function styleAxisGridLine($chart, axisGridLine, qlikTheme) {
			
			// Контейнер с классом равным идентификатору
			var $lineContainer = $chart.find('.c3-grid-lines g.' + axisGridLine.cId);
			
			// Цвет переднего плана
			var foregroundColor = findColor(axisGridLine.foreground, qlikTheme);

			if (foregroundColor != null) {
				// Цвет линии
				$lineContainer
					.children('line')
					.css('stroke', foregroundColor);
				// Цвет подписи
				$lineContainer
					.children('text')
					.css('fill', foregroundColor);
			}

			// Тип линии
			var dashArray = axisGridLine.lineType === 'Solid' ? '0' : '4';
			$lineContainer
				.children('line')
				.css('stroke-dasharray', dashArray)
				// Толщина линии
				.css('stroke-width', axisGridLine.width);
		}
		
		/**
		 * Стилизует регион по оси
		 * @param {*} $chart jQuery-объект графика
		 * @param {QlikTheme} qlikTheme Тема
		 * @param {AxisGridRange} range Регион
		 */
		function styleAxisGridRange($chart, range, qlikTheme) {
			// Контейнер региона
			var $rangeGroup = $chart.find('g.c3-region.' + range.cId);

			// Цвет заливки
			var backgroundColor = findColor(range.background, qlikTheme);
			
			// Заливка региона
			$rangeGroup
				.children('rect')
				.css('fill', backgroundColor);

			// Подпись региона
			$rangeGroup
				.children('text')	
				.css('fill', backgroundColor);
		}

		/**
		 * Возвращает цвет из цветового объекта
		 * @param {QlikColorObject} colorObject Цветовой объект
		 * @param {QlikTheme} qlikTheme Тема
		 * @returns {String} Цвет; null, если цвет не определён
		 */
		function findColor(colorObject, qlikTheme) {
			if (colorObject == null) {
				return null;
			}
			
			// Режим цвета из палитры
			if (colorObject.index !== -1) {
				var qlikPalette = findThemeUiPallete(qlikTheme);
				var paletteColor = findPaletteColor(qlikPalette, colorObject.index);
				if (paletteColor != null) {
					return paletteColor;
				}
			}

			// Режим указания конкретного цвета
			if (colorObject.color == null || colorObject.color == '') {
				return null;
			}
			
			return colorObject.color;
		}

		/**
		 * Возвращает палитру для интерфейса из темы
		 * @param {QlikTheme} qlikTheme Тема
		 * @returns {QlikUiPalette} Палитра; null, если палитры нет
		 */
		function findThemeUiPallete(qlikTheme) {
			if (qlikTheme.properties == null ||
				qlikTheme.properties.palettes == null ||
				qlikTheme.properties.palettes.ui == null ||
				qlikTheme.properties.palettes.ui.length == 0) {
					// Отсутствуют настройки палитр для интерфейса
					return null;
			}

			// Первая палитра для интерфейса
			return qlikTheme.properties.palettes.ui[0];
		}

		/**
		 * Возвращает цвет из цветового объекта
		 * @param {QlikUiPalette} qlikPalette Цветовая палитра
		 * @param {Number} colorIndex Индекс цвета в палитре
		 * @returns {String} Цвет
		 */
		function findPaletteColor(qlikPalette, colorIndex) {
			if (qlikPalette == null || qlikPalette.colors == null) {
				return null;
			}

			// Индексация с единицы
			var arrayIndex = colorIndex - 1;
			if (arrayIndex < 0 || arrayIndex >= qlikPalette.colors.length) {
				return null;
			}

			return qlikPalette.colors[arrayIndex];
		}
	}
);