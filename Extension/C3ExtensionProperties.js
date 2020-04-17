/**
 * Настройки расширения C3Extension
 */
define(
	// Зависимости
  	[
		  // Qlik API
		  'qlik'
	],
	/**
	 * Создаёт модуль
	 * @param {QlikApi} qlik Qlik API
	 * @returns Модуль
	 */
	function (qlik) {
		'use strict';

		// Определения свойств измерений
		var dimensionProperties = {
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
						value: 'LineChart',
						label: 'Линейный график'
					},
					{
						value: 'BarChart',
						label: 'Столбчатая диаграмма'
					}
				],
				defaultValue: 'LineChart'
			}
		};

		// Настройки легенды
		var legendProperties = {
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

		// Свойства графика
		var chartProperties = {
			// Свойства оси Y
			axisY: {
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
			},
			// Свойства легенды
			legend: legendProperties
		};


		// these arrays contain the colors displayed in the palettes. the actual number of entries doesn't seem to match the name of the palette. 
		var defaultUse=!![]; // true = palette, faalse = custom
		var defaultRev=![]; // false = no reverse
		var defaultGradientCalc='absolute';
		var defaultGradientRange='full';
		var defaultPalette='qlik10';

		return getPalettesOptions()
			.then(
				function (paletteOptions) {

					console.log('paletteOptions', paletteOptions);

					// Свойства Вид
					var settingsProperties = {
						colorsandlegend: {
							label: 'Colors', // usually colors and legend but we're not legending here. 
							type: 'items',
							grouped: true, // not sure what grouped does but its true
							items: {
								// usePalette: {
								// 	ref: 'color.usePalette',
								// 	type: 'boolean',
								// 	component: 'switch',
								// 	label: 'Colors',
								// 	defaultValue:defaultUse, //true
								// 	options: [{
								// 		value:!![], //true
								// 		label: 'Use Color Scheme'
								// 	},{
								// 		value:![], // false
								// 			label: 'Use Custom Colors'
								// 	}]
								// },
								paletteItems: {
									ref: 'color.colorPalette',
									type: 'items',
									component: 'item-selection-list', 
									horizontal: false,
									items: paletteOptions
									
									/*function () {
												return qlik.Promise.resolve([
													{ component: "color-scale", value: "12", label: "12 Colors", icon: "", type: "sequential", colors: [ 'red' ] },
													{ component: "color-scale", value: "100", label: "100 Colors", icon: "", type: "sequential", colors: [ 'blue' ] }
												]);
											}
									*/	
									// getPalettesOptions

									// [
									// 	{
									// 		component: 'color-scale',
									// 		icon: '',
									// 		label: 'Qlik Sense',
									// 		reverse: function (m) {
									// 			return typeof(m.colors) != 'undefined' ? m.colors.reverse : defaultRev;
									// 		},
									// 		value: 'qlik10',
									// 		type: 'sequential',
									// 		colors:q10
									// 	}
									// ],
									// show: function (m) {
									// 	return typeof(m.color) != 'undefined' ? m.color.usePalette : defaultUse;
									// },
									//defaultValue: defaultPalette,
								},
								// customPalette: {
								// 	ref: 'color.colorPaletteCustom',
								// 	type: 'string',
								// 	expression: 'optional',
								// 	defaultValue:defaultCustomColors, 
								// 	show: function(m) {
								// 		return typeof(m.color)!='undefined'? m.color.usePalette==![]:!defaultUse;
								// 	}
								// },
								// descTest: {
								// 	label: 'Comma\x20separated\x20list\x20of\x20HEX\x20colors', // all this just to show a bit of text (smh)
								// 	component: 'text',
								// 	show:function(m) {
								// 		return typeof(m.color)!='undefined'?m.color.usePalette==![]:!defaultUse;
								// 	}
								// },
								// reverseColors: {
								// 	type: 'boolean',  // a checkbox by default.
								// 	ref: 'colors.reverse',
								// 	label: 'Reverse\x20Colors',
								// 	defaultValue: defaultRev
								// }/*,
								// 'consistentcolors': {
								// 	'type': 'boolean', // to use same colors regardlesss of selection.. whatever. 
								// 	'ref': 'color.consistent',
								// 	'label': 'Consistent\x20Colors',
								// 	'defaultValue': ![]
								// }*/
							}
						}
						
						// GradientCalc: {
						// 	label: 'Measure Is',
						// 	component: 'dropdown',
						// 	ref: 'props.gradientCalc',
						// 	type: 'string',
						// 	defaultValue:defaultGradientCalc,
						// 	options: [
						// 		{label: 'Absolute',value: 'absolute'},
						// 		{label: 'Duration',value: 'duration'}
						// 	],
						// 	order:0
						// },
						// GradientRange: {
						// 	label: 'Gradient Relative To',
						// 	component: 'dropdown',
						// 	ref: 'props.gradientRange',
						// 	type: 'string',
						// 	defaultValue:defaultGradientRange,
						// 	options: [
						// 		{label: 'Full Dataset',value: 'full'},
						// 		{label: 'Dimension 1',value: 'dimension1'},
						// 		{label: 'Dimension 2',value: 'dimension2'}
						// 	],
						// 	order:0
						// }
					};

					// Определения свойств
					var properties = {
						type: 'items',
						component: 'accordion',
						items: {
							// Блок свойств Измерения
							dimensions: {
								uses: 'dimensions',
								min: 1,
								max: 1,
								// Cвойства измерений графика
								items: dimensionProperties
							},
							// Блок свойств Меры
							measures: {
								uses: 'measures',
								min: 1,
								max: 10,
								// Свойства мер графика
								items: measureProperties
							},
							// Блок свойств Сортировка
							sorting: {
								uses: 'sorting'
							},
							// Блок свойств Вид
							settings: {
								uses: 'settings',
								items: settingsProperties
							},
							// Свойства графика
							chart: {
								type: 'items',
								component: 'expandable-items',
								label: 'Настройки графика',
								items: chartProperties
							}
						}
					};

					return properties;
				}
			);

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

		/**
		 * Возвращает Promise списка выбора темы
		 * @return {Promise<QlikColorScaleComponent[]>} Список выбора темы
		 */
		function getPalettesOptions() {
			return qlik.currApp().theme.getApplied()
				.then(getThemePalettes)
				.then(
					function (qlikPalettes) {
						return qlikPalettes.map(getColorScaleComponent);
					}
				)
				.then(
					function (components) {
						console.log('components', components);
						return components;
					}
				);
		}
		
		/**
		 * 
		 * @param {*} qlikTheme 
		 * @returns {QlikDataPalette[]}
		 */
		function getThemePalettes(qlikTheme) {
			return qlikTheme.properties.palettes.data;
		}

		/**
		 * Преобразует тесу из внутреннего представления в опцию выбора
		 * @param {QlikDataPalette} qlikPalette Тема
		 * @returns {QlikColorScaleComponent} Настройки цветового компонента
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

		/**
		 * Преобразует список тем из внутреннего представления в опции выбора
		 * @param {QlikTheme[]} qlikThemes Список тем
		 * @returns {QlikPropertyOption[]} Список опций выбора
		 */
		function toPaletteOptions(qlikThemes) {
			
			return qlikThemes.map(toPaletteOption);
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
 * @typedef {String} LegendPosition
 * - 'Bottom' - Снизу
 * - 'Right' - Справа
 * - 'Inside' - Внутри
 */

/**
 * Тип шкалы
 * @typedef {String} ScaleType
 * - 'CategoricalScale' - Категориальная шкала
 * - 'NumericScale' - Числовая шкала
 * - 'TemporalScale' - Временная шкала
 */

/**
 * Тип графика
 * @typedef {String} ChartType
 * - 'LineChart' - линейный график
 * - 'BarChart' - столбчатая диаграмма
 */