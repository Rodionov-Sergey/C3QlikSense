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
			return {
				type: 'items',
				component: 'accordion',
				items: {
					// Блок свойств Измерения
					dimensions: getDimensionProperties(),
					// Блок свойств Меры
					measures: getMeasureProperties(),
					// Блок свойств Сортировка
					sorting: {
						uses: 'sorting'
					},
					// Блок свойств Вид
					settings: {
						uses: 'settings'
					},
					// Свойства графика
					chart: getChartProperties(qlikTheme)
				}
			};
		}

		/**
		 * Возвращает определения свойств секции Измерения
		 * @returns Определения свойств измерений
		 */
		function getDimensionProperties() {
			return {
				uses: 'dimensions',
				min: 1,
				max: 1,
				// Cвойства измерений графика
				items: {
					// Тип шкалы
					scaleType: {
						ref: getColumnPropertyKey('scaleType'),
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
						ref: getColumnPropertyKey('tickLabelAngle'),
						type: 'number',
						label: 'Угол наклона подписей',
						min: -90,
						max: 90,
						defaultValue: 0
					},
					// Угол наклона подписей - слайдер
					tickLabelAngle: {
						ref: getColumnPropertyKey('tickLabelAngle'),
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
		 * @param {QlikTheme} qlikTheme
		 * @returns {*} Определение свойств меры
		 */
		function getMeasureProperties() {
			return {
				uses: 'measures',
				min: 1,
				max: 10,
				// Свойства мер графика
				items: {
					// Тип графика
					chartType: {
						ref: getColumnPropertyKey('chartType'),
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
					// Настройки линейного графика
					lineChart: {
						type: 'items',
						label: 'Ленейный график',
						items: {
							pointsShown: {
								ref: getExtensionPropertyKey('lineChart.pointsShown'),
								type: 'boolean',
								label: 'Отображение точек',
								defaultValue: true
							},
							lineShown: {
								ref: getExtensionPropertyKey('lineChart.lineShown'),
								type: 'boolean',
								label: 'Отображение линии',
								defaultValue: true
							},
							areaShown: {
								ref: getExtensionPropertyKey('lineChart.areaShown'),
								type: 'boolean',
								label: 'Отображение области',
								defaultValue: true
							}
						}
					}
				}
			};
		}
		
		/**
		 * Возвращает определения свойств графика
		 * @param {QlikTheme} qlikTheme Тема
		 * @returns {*} Определения свойств графика
		 */
		function getChartProperties(qlikTheme) {
			return {
				type: 'items',
				component: 'expandable-items',
				label: 'График',
				items: {
					// Свойства оси Y
					axisY: getAxisYProperties(),
					// Свойства легенды
					legend: getLegendProperties(),
					// Палитра
					palette: getPaletteProperties(qlikTheme)
				}
			};
		}

		/**
		 * Возвращает определения свойств оси Y
		 * @returns {*} Определения свойств оси
		 */
		function getAxisYProperties() {
			return {
				type: 'items',
				label: 'Ось Y',
				items: {
					// Подпись оси
					title: {
						ref: getExtensionPropertyKey('axisY.title'),
						type: 'string',
						label: 'Заголовок оси Y'
					}
				}
			};
		}
				
		// Настройки легенды
		function getLegendProperties() {
			return {
				type: 'items',
				label: 'Легенда',
				items: {
					shown: {
						ref: getExtensionPropertyKey('legend.shown'),
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
						ref: getExtensionPropertyKey('legend.position'),
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
		 * @param {QlikTheme} qlikTheme Тема
		 * @returns {*} Определение свойства
		 */
		function getPaletteProperties(qlikTheme) {
			return {
				type: 'items',
				label: 'Палитра',
				grouped: true,
				items: {
					// Элементы списка палитр
					paletteItems: {
						ref: getExtensionPropertyKey('palette.id'),
						type: 'items',
						component: 'item-selection-list', 
						horizontal: false,
						items: getPalettesOptions(qlikTheme)
					}
				},
				shown: function() {
					return qlikTheme != null;
				}
			}
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
 */

/**
 * Настройки линейного графика
 * @typedef {Object} LineChart
 * @property {Boolean} pointsShown Признак отображения точек
 * @property {Boolean} lineShown Признак отображения линии
 * @property {Boolean} areaShown Признак отображения области
 */

/**
 * Свойства оси Y
 * @typedef {Object} AxisYProperties
 * @property {String} title Подпись оси
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