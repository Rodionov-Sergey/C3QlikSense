/**
 * Настройки расширения C3Extension
 */
define(
	// Зависимости
  	[],

	/**
	 * Создаёт модуль
	 * @param {QlikApi} qlik Qlik API
	 * @returns Модуль
	 */
	function () {
		'use strict';

		// Определения свойств
		return {
			// Функция получения определений свойств
			getProperties: getProperties,
			getInitialProperties: getInitialProperties,
			getSupportProperties: getSupportProperties
		};

		/**
		 * Возвращает настройки первичной загрузки данных
		 * @returns {*} Настройки первичной загрузки данных
		 */
		function getInitialProperties() {
			return {
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
			};
		}

		/**
		 * Возвращает настройки выгрузки
		 * @returns {*} Настройки выгрузки
		 */
		function getSupportProperties() {
			return {
				snapshot: true,
				export: true,
				exportData: false
			};
		}

		/**
		 * Возвращает определения свойств, настраиваемых пользователем
		 * @param {*} qlikTheme Тема
		 * @returns {*} Определения свойств
		 */
		function getProperties(qlikTheme) {
			var columnPropertiesPath = path('qDef', 'properties');
			var extensionPropertiesPath = 'properties';
			return {
				type: 'items',
				component: 'accordion',
				items: {
					// Блок свойств Измерения
					dimensions: getDimensionProperties(columnPropertiesPath),
					// Блок свойств Меры
					measures: getMeasureProperties(columnPropertiesPath),
					// Блок свойств Сортировка
					sorting: {
						uses: 'sorting'
					},
					// Блок свойств Вид
					settings: {
						uses: 'settings'
					},
					// Свойства графика
					chart: getChartProperties(extensionPropertiesPath, qlikTheme)
				}
			};
		}

		/**
		 * Возвращает определения свойств секции Измерения
		 * @param {String} basePath Базовый путь к свойству
		 * @returns Определения свойств измерений
		 */
		function getDimensionProperties(basePath) {
			return {
				uses: 'dimensions',
				min: 1,
				max: 1,
				// Cвойства измерений графика
				items: {
					// Тип шкалы
					scaleType: {
						ref: path(basePath, 'scaleType'),
						type: 'string',
						component: 'dropdown',
						label: 'Тип шкалы',
						options: [
							{
								value: 'CategoricalScale',
								label: 'Категориальная шкала'
							},
							{
								value: 'NumericScale',
								label: 'Числовая шкала'
							},
							{
								value: 'TemporalScale',
								label: 'Временная шкала'
							}
						],
						defaultValue: 'CategoricalScale'
					},
					// Угол наклона подписей - текстовое поле
					tickLabelAngleText: {
						ref: path(basePath, 'tickLabelAngle'),
						type: 'number',
						label: 'Угол наклона подписей',
						min: -90,
						max: 90,
						defaultValue: 0
					},
					// Угол наклона подписей - слайдер
					tickLabelAngle: {
						ref: path(basePath, 'tickLabelAngle'),
						type: 'number',
						component: 'slider',
						min: -90,
						max: 90,
						step: 10,
						defaultValue: 0
					}
				}
			};
		}

		/**
		 * Возвращает определение свойств секции Меры
		 * @param {String} basePath Базовый путь к свойству
		 * @param {QlikTheme} qlikTheme
		 * @returns {*} Определение свойств меры
		 */
		function getMeasureProperties(basePath) {
			return {
				uses: 'measures',
				min: 1,
				max: 10,
				// Свойства мер графика
				items: {
					// Тип графика
					chartType: {
						ref: path(basePath, 'chartType'),
						type: 'string',
						component: 'dropdown',
						label: 'Тип графика',
						options: [
							{
								value: 'LineChart',
								label: 'Линейный график'
							},
							{
								value: 'BarChart',
								label: 'Столбчатая диаграмма'
							}
						],
						defaultValue: 'LineChart'
					},
					// Настройка группировки
					groupKey: {
						ref: path(basePath, 'groupKey'),
						type: 'string',
						label: 'Идентификатор группы',
					},
					// Настройки линейного графика
					lineChart: getLineChartProperties(
						path(basePath, 'lineChart'))
				}
			};
		}

		/**
		 * Возвращает определения свойств линейного графика
		 * @param {String} basePath Базовый путь к свойству
		 * @returns {*} Определения свойств
		 */
		function getLineChartProperties(basePath) {
			return {
				type: 'items',
				items: {
					_header: {
						type: 'string',
						component: 'text',
						label: 'Линейный график'
					},
					pointsShown: {
						ref: path(basePath, 'pointsShown'),
						type: 'boolean',
						label: 'Отображение точек',
						defaultValue: true
					},
					lineShown: {
						ref: path(basePath, 'lineShown'),
						type: 'boolean',
						label: 'Отображение линии',
						defaultValue: true
					},
					areaShown: {
						ref: path(basePath, 'areaShown'),
						type: 'boolean',
						label: 'Отображение области',
						defaultValue: true
					}
				},
				show: function (context) {
					/** @type {MeasureProperties} */
					var properties = context.qDef.properties;
					// Отображение только для линейного графика
					return properties.chartType === 'LineChart';
				}
			};
		}
		
		/**
		 * Возвращает определения свойств графика
		 * @param {String} basePath Базовый путь к свойству
		 * @param {QlikTheme} qlikTheme Тема
		 * @returns {*} Определения свойств графика
		 */
		function getChartProperties(basePath, qlikTheme) {
			return {
				type: 'items',
				component: 'expandable-items',
				label: 'График',
				items: {
					// Свойства оси X
					axisX: getAxisXProperties(path(basePath, 'axisX')),
					// Свойства оси Y
					axisY: getAxisYProperties(path(basePath, 'axisY')),
					// Линии оси Y
					axisYLines: getLinesProperties(path(basePath, 'axisY')),
					// Свойства легенды
					legend: getLegendProperties(path(basePath, 'legend')),
					// Палитра
					palette: getPaletteProperties(
						path(basePath, 'palette'),
						qlikTheme
					)
				}
			};
		}

		/**
		 * Возвращает определения свойств оси X
		 * @param {String} basePath Базовый путь к свойству
		 * @returns {*} Определения свойств оси
		 */
		function getAxisXProperties(basePath) {
			return {
				type: 'items',
				label: 'Ось X',
				items: {
					// Признак отображение сетки
					gridShown: {
						ref: path(basePath, 'grid', 'shown'),
						type: 'boolean',
						component: 'switch',
						label: 'Отображение сетки',
						options: [
							{
								value: true,
								label: 'Отобразить'
							},
							{
								value: false,
								label: 'Скрыть'
							}
						],
						defaultValue: false
					}
				}
			};
		}

		/**
		 * Возвращает определения свойств оси Y
		 * @param {String} basePath Базовый путь к свойству
		 * @returns {*} Определения свойств оси
		 */
		function getAxisYProperties(basePath) {
			return {
				type: 'items',
				label: 'Ось Y',
				items: {
					// Подпись оси
					title: {
						ref: path(basePath, 'title'),
						type: 'string',
						label: 'Заголовок оси Y'
					},
					// Признак отображение сетки
					gridShown: {
						ref: path(basePath, 'grid', 'shown'),
						type: 'boolean',
						component: 'switch',
						label: 'Отображение сетки',
						options: [
							{
								value: true,
								label: 'Отобразить'
							},
							{
								value: false,
								label: 'Скрыть'
							}
						],
						defaultValue: false
					}
				}
			};
		}

		/**
		 * Возвращает определения свойств линий
		 * @param {String} basePath Базовый путь к свойству
		 * @returns {*} Определения свойств линий
		 */
		function getLinesProperties(basePath) {
			return {
				ref: path(basePath, 'lines'),
				type: 'array',
				label: 'Ось Y. Линии',
				allowAdd: true,
				allowRemove: true,
				addTranslation: 'Добавить',
				// Свойства линии
				items: {
					// Значение
					value: {
						ref: 'value',
						type: 'number',
						label: 'Значение',
						expression: 'optional'
					},
					// Подпись
					title: {
						ref: 'title',
						type: 'string',
						label: 'Подпись'
					},
					// Цвет
					color: {
						ref: 'color',
						type: 'string',
						label: 'Цвет',
						expression: 'optional'
					}
				},
				// Подпись элемента в боковой панели
				itemTitleRef: function (item)
				{
					var valueString = '';
					// Число
					if (typeof(item.value) === 'number') {
						valueString = item.value.toString();
					}
					// Выражение
					else if (typeof(item.value) === 'object' && 
						item.value.qValueExpression != null) {
						valueString = item.value.qValueExpression.qExpr;
					}

					var titleString = item.title != null && item.title != '' ? item.title + ': ' : '';
					return titleString + valueString; 
				}
			};
		}

		/**
		 * Возвращает определения свойств легенды
		 * @param {String} basePath Базовый путь к свойству
		 * @returns {*} Определения свойств
		 */
		function getLegendProperties(basePath) {
			return {
				type: 'items',
				label: 'Легенда',
				items: {
					shown: {
						ref: path(basePath, 'shown'),
						type: 'boolean',
						component: 'switch',
						label: 'Отображение легенды',
						options: [
							{
								value: true,
								label: 'Отобразить'
							},
							{
								value: false,
								label: 'Скрыть'
							}
						],
						defaultValue: true
					},
					position: {
						ref: path(basePath, 'position'),
						type: 'string',
						component: 'dropdown',
						label: 'Расположение легенды',
						options: [
							{
								value: 'Bottom',
								label: 'Снизу'
							},
							{
								value: 'Right',
								label: 'Справа'
							},
							{
								value: 'Inside',
								label: 'Внутри'
							}
						],
						defaultValue: 'Bottom',
						show: function(context) {
							return context.properties.legend.shown;
						}
					}
				}
			};
		}

		/**
		 * Возвращает определение свойства палитры
		 * @param {String} basePath Базовый путь к свойству
		 * @param {QlikTheme} qlikTheme Тема
		 * @returns {*} Определение свойства
		 */
		function getPaletteProperties(basePath, qlikTheme) {
			return {
				type: 'items',
				label: 'Палитра',
				grouped: true,
				items: {
					// Элементы списка палитр
					paletteItems: {
						ref: path(basePath, 'id'),
						type: 'items',
						component: 'item-selection-list', 
						horizontal: false,
						items: getPalettesOptions(qlikTheme)
					}
				},
				shown: function() {
					return qlikTheme != null;
				}
			};
		}

		/**
		 * Возвращает определение списка выбора палитры
		 * @param {QlikTheme} qlikTheme Тема
		 * @return {QlikColorScaleComponent[]} Список выбора темы
		 */
		function getPalettesOptions(qlikTheme) {
			if (qlikTheme == null) {
				return null;
			}
			return getThemePalettes(qlikTheme)
				.map(getColorScaleComponent);
		}

		/**
		 * Возвращает опредление опции выбора палитры
		 * @param {QlikDataPalette} qlikPalette Палитра
		 * @returns {QlikColorScaleComponent} Опция выбора палитры
		 */
		function getColorScaleComponent(qlikPalette) {
			return {
				component: 'color-scale',
				value: qlikPalette.propertyValue,
				label: qlikPalette.name,
				icon: '',
				type: 'sequential',
				colors: getPaletteScale(qlikPalette),
			};
		}

		// Вспомогательные функции определений свойств

		/**
		 * Соединяет части пути к свойству
		 * @param {...String} args Части пути
		 * @returns {String} Общий путь к свойству
		 */
		function path(args) {
			args = Array.prototype.slice.call(arguments);
			return args.join('.');
		}

		// Функции Qlik API
				
		/**
		 * Возвращает список палитр темы
		 * @param {QlikTheme} qlikTheme Тема
		 * @returns {QlikDataPalette[]} Список палитр
		 */
		function getThemePalettes(qlikTheme) {
			return qlikTheme.properties.palettes.data;
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
			if (scaleSize != null) {
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
	}
);

/**
 * JSDoc-определения для кастомных свойств расширения
 */

/**
 * Данные расширения Qlik
 * @typedef {Object} ExtensionProperties
 * @property {AxisXProperties} axisX Настройки оси X
 * @property {AxisYProperties} axisY Настройки оси Y
 * @property {LegendProperties} Настройки легенды
 * @property {PaletteProperties} palette Настройки палитры
 */

 /**
  * Настройки палитры
  * @typedef {Object} PaletteProperties
  * @property {String} id Идентификатор палитры
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
 * @property {LineChart} lineChart Настройки линейного графика
 * @property {String} groupKey Идентификатор группы
 */

/**
 * Настройки линейного графика
 * @typedef {Object} LineChart
 * @property {Boolean} pointsShown Признак отображения точек
 * @property {Boolean} lineShown Признак отображения линии
 * @property {Boolean} areaShown Признак отображения области
 */

/**
 * Свойства оси X
 * @typedef {Object} AxisXProperties
 * @property {AxisGrid} grid Сетка
 */

/**
 * Свойства оси Y
 * @typedef {Object} AxisYProperties
 * @property {String} title Подпись оси
 * @property {AxisGridLine[]} lines Линии
 * @property {AxisGrid} grid Сетка
 */

 /**
 * Свойства сетки по оси
 * @typedef {Object} AxisGrid
 * @property {Boolean} shown Признак отображения
 */

/**
 * Дополнительная линия по оси
 * @typedef {Object} AxisGridLine
 * @property {String} cId Идентификатор, назначаемый Qlik
 * @property {Number} value Значение
 * @property {Number} title Подпись
 * @property {String} color Цвет
 */

/**
 * Настройки легенды
 * @typedef {Object} LegendProperties
 * @property {Boolean} shown Признак отображения легенды
 * @property {LegendPosition} position Расположение легенды
 */
 
/**
 * Позиция легенды
 * @typedef {'Bottom'|'Right'|'Inside'} LegendPosition
 * - 'Bottom' - Снизу
 * - 'Right' - Справа
 * - 'Inside' - Внутри
 */

/**
 * Тип шкалы
 * @typedef {'CategoricalScale'|'NumericScale'|'TemporalScale'} ScaleType
 * - 'CategoricalScale' - Категориальная шкала
 * - 'NumericScale' - Числовая шкала
 * - 'TemporalScale' - Временная шкала
 */

/**
 * Тип графика
 * @typedef {'LineChart'|'BarChart'} ChartType
 * - 'LineChart' - линейный график
 * - 'BarChart' - столбчатая диаграмма
 */