/**
 * Настройки расширения C3Extension
 */
define(
	// Зависимости
  	[],
	/**
	 * Создаёт модуль
	 * @returns Модуль
	 */
	function () {
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
		var defaultGradientCalc="absolute";
		var defaultGradientRange="full";
		var defaultPalette="qlik10";
		var defaultCustomColors="#4477aa,#7db8da,#b6d7ea,#46c646,#f93f17,#ffcf02,#b0afae,#7b7a78,#545352"; // copied from example (TODO match q10?)
		var q10=['red','magenta', '#332288', '#6699cc', '#88ccee', '#44aa99', '#117733', '#999933', '#ddcc77', '#661100', '#cc6677', '#aa4466', '#882255', '#aa4499'];
		var q100=['magenta','#99c867', '#e43cd0', '#e2402a', '#66a8db', '#3f1a20', '#e5aa87', '#3c6b59', '#e9b02e', '#7864dd', '#65e93c', '#5ce4ba', '#d0e0da', '#d796dd', '#64487b', '#986717', '#408c1d', '#dd325f', '#533d1c', '#2a3c54', '#db7127', 
		'#72e3e2', '#d47555', '#7d7f81', '#3a8855', '#5be66e', '#a6e332', '#e39e51', '#4f1c42', '#273c1c', '#aa972e', '#bdeca5', '#63ec9b', '#aaa484', '#9884df', '#e590b8', '#44b62b', '#ad5792', '#c65dea', '#e670ca', '#29312d', 
		'#6a2c1e', '#d7b1aa', '#b1e7c3', '#cdc134', '#9ee764', '#65464a', '#3c7481', '#3a4e96', '#6493e1', '#db5656', '#bbabe4', '#d0607d', '#759f79', '#9d6b5e', '#8574ae', '#ad8fac', '#4b77de', '#647e17', '#b9c379', '#b972d9', 
		'#7ec07d', '#916436', '#2d274f', '#dce680', '#759748', '#dae65a', '#459c49', '#b7934a', '#9ead3f', '#969a5c', '#b9976a', '#46531a', '#c0f084', '#76c146', '#2ca02c'];//, '#d62728', '#9467bd', '#8c564b', '#e377c2', '#1f77b4'];
		//'#7f7f7f', '#17becf', '#aec7e8', '#ff7f0e', '#ffbb78', '#ff9896', '#c49c94', '#f7b6d2', '#c7c7c7', '#dbdb8d', '#9edae5', '#393b79', '#5254a3', '#6b6ecf', '#637939', '#b5cf6b', '#cedb9c', '#8c6d31', '#bd9e39', '#843c39']; 

		var appearanceSection = {
			uses: "settings",
			items: {
				colorsandlegend:{
					label:"Colors", // usually colors and legend but we're not legending here. 
					type:"items",
					grouped:!![], // not sure what grouped does but its true
					items:{
						usePalette: {
							ref:"color.usePalette",
							type:"boolean",
							label:"Colors",
							component:"switch",
							defaultValue:defaultUse, //true
							options:[{
								value:!![], //true
								label:"Use Color Scheme"
							},{
								value:![], // false
								 label:"Use Custom Colors"
							}]
						},
						paletteItems: {
							ref:"color.colorPalette",
							type:"string",
							component:"item-selection-list", 
							defaultValue:defaultPalette, 
							horizontal:0x0,
							items:[{
								icon:"",
								label:"Qlik\x20Sense",
								component:"color-scale",
								reverse: function(m){              // basically called on every mouse event, return boolean value of reverse setting. 
									return typeof(m.colors)!='undefined'?m.colors.reverse:defaultRev;
								},
								value:"qlik10",
								type:"sequential",
								colors:q10
							},{
								icon:"",
								label:"Qlik\x20Sense\x20100",
								component:"color-scale",
								reverse: function(m){ // basically called on every mouse event
									return typeof(m.colors)!='undefined'?m.colors.reverse:defaultRev;
								},
								value:"qlik100",
								type:"sequential",
								colors:q100
							}],
							show:function(m) {
								return typeof(m.color)!='undefined'?m.color.usePalette:defaultUse;    //==!![] is implied?
							}
						},
						customPalette: {
							ref:"color.colorPaletteCustom",
							type:"string",
							expression:"optional",
							defaultValue:defaultCustomColors, 
							show: function(m) {
								return typeof(m.color)!='undefined'? m.color.usePalette==![]:!defaultUse;
							}
						},
					   descTest: {
							label: "Comma\x20separated\x20list\x20of\x20HEX\x20colors", // all this just to show a bit of text (smh)
							component: "text",
							show:function(m) {
								return typeof(m.color)!='undefined'?m.color.usePalette==![]:!defaultUse;
							}
						},
						reverseColors: {
							type: "boolean",  // a checkbox by default.
							ref: "colors.reverse",
							label: "Reverse\x20Colors",
							defaultValue: defaultRev
						}/*,
						'consistentcolors': {
							'type': 'boolean', // to use same colors regardlesss of selection.. whatever. 
							'ref': 'color.consistent',
							'label': 'Consistent\x20Colors',
							'defaultValue': ![]
						}*/
					}//end colors and legend items
				}, //end colors and legend
				
				GradientCalc: {
					label:"Measure Is",
					component:"dropdown",
					ref: "props.gradientCalc",
					type:"string",
					defaultValue:defaultGradientCalc,
					options:[
						{label:"Absolute",value:"absolute"},
						{label:"Duration",value:"duration"}
					],
					order:0
				},
				GradientRange: {
					label:"Gradient Relative To",
					component:"dropdown",
					ref: "props.gradientRange",
					type:"string",
					defaultValue:defaultGradientRange,
					options:[
						{label:"Full Dataset",value:"full"},
						{label:"Dimension 1",value:"dimension1"},
						{label:"Dimension 2",value:"dimension2"}
					],
					order:0
				} 
			}//end appearanc items
		}; //end appearance section


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
					uses: 'settings'
				},
				// Свойства графика
				chart: {
					type: 'items',
					component: 'expandable-items',
					label: 'Настройки графика',
					items: chartProperties
				},
				appearance: appearanceSection
			}
		};

		return properties;

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
});

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