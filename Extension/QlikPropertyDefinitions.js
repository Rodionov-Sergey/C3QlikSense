/**
 * Построитель пользовательских свойств для расширения Qlik
 */
define(
	[],

	/**
	 * Возвращает API построителя определений свойств
	 * @returns {QlikPropertyFactory} API построителя определений свойств
	 */
	function () {
		'use strict';

		return {
			sections: sections,

			dimensions: dimensions,
			measures: measures,
			sorting: sorting,
			settings: settings,
			expandableItems: expandableItems,

			items: items,

			label: label,
			property: property,

			utils: utils
		};

		/**
		 * @returns {ItemsBuilder}
		 */
		function sections() {
			/** @type {QlikPropertyDefinition} */
			var state = {
				type: 'items',
				component: 'accordion',
				items: {}
			};

			var builder = { };
			appendAddFunction(builder, state);
			appendBuildFunction(builder, state);
			return builder;
		}

		/**
		 * @returns {ItemsBuilder}
		 */
		function dimensions(minCount, maxCount) {
			/** @type {QlikPropertyDefinition} */
			var state = {
				uses: 'dimensions',
				min: minCount,
				max: maxCount,
				items: {}
			};

			var builder = { };
			appendAddFunction(builder, state);
			appendBuildFunction(builder, state);
			return builder;
		}

		/**
		 * @returns {ItemsBuilder}
		 */
		function measures(minCount, maxCount) {
			/** @type {QlikPropertyDefinition} */
			var state = {
				uses: 'measures',
				min: minCount,
				max: maxCount,
				items: {}
			};

			var builder = { };
			appendAddFunction(builder, state);
			appendBuildFunction(builder, state);
			return builder;
		}

		/**
		 * @returns {ItemsBuilder}
		 */
		function sorting() {
			/** @type {QlikPropertyDefinition} */
			var state = {
				uses: 'sorting',
				items: {}
			};

			var builder = { };
			appendAddFunction(builder, state);
			appendBuildFunction(builder, state);
			return builder;
		}

		/**
		 * @returns {ItemsBuilder}
		 */
		function settings() {
			/** @type {QlikPropertyDefinition} */
			var state = {
				uses: 'settings',
				items: {}
			};

			var builder = { };
			appendAddFunction(builder, state);
			appendBuildFunction(builder, state);
			return builder;
		}

		/**
		 * @param {String} title
		 * @returns {ItemsBuilder}
		 */
		function expandableItems(title) {
			/** @type {QlikPropertyDefinition} */
			var state = {
				type: 'items',
				component: 'expandable-items',
				label: title,
				items: {}
			};

			var builder = { };
			appendAddFunction(builder, state);
			appendVisibleFunction(builder, state);
			appendBuildFunction(builder, state);
			return builder;
		}

		/**
		 * @param {String} title
		 * @returns {ItemsBuilder}
		 */
		function items(title) {
			/** @type {QlikPropertyDefinition} */
			var state = {
				type: 'items',
				label: title,
				items: {}
			};

			var builder = { };
			appendAddFunction(builder, state);
			appendVisibleFunction(builder, state);
			appendBuildFunction(builder, state);
			return builder;
		}

		/**
		 * 
		 * @param {String} title 
		 */
		function label(title) {
			/** @type {QlikPropertyDefinition} */
			var state = {
				label: title,
				component: 'text'
			};

			var builder = { };
			appendBuildFunction(builder, state);
			return builder;
		}

		/**
		 * @param {Builder} builder 
		 * @param {QlikPropertyDefinition} state 
		 */
		function appendAddFunction(builder, state) {
			builder.add = function (property) {
				// Автогенерация названия для свойства 
				var key = 0;
				// eslint-disable-next-line no-unused-vars
				for (var _ in state.items) {
					key += 1;
				}

				// Для построителя
				if (typeof(property) === 'object' &&
					typeof(property.build) === 'function') {
					// Построить определение свойства
					property = property.build();
				}

				state.items[key] = property;
				
				return builder;
			};
		}

		/**
		 * @param {String} pathParts
		 * @returns {PropertyBuilder}
		 */
		function property(pathParts) {
			pathParts = Array.prototype.slice.call(arguments);

			/** @type {QlikPropertyDefinition} */
			var state = {
				ref: combinePath(pathParts)
			};

			var builder = { };
			appendBuildFunction(builder, state);

			appendVisibleFunction(builder, state);
			appendTitleFunction(builder, state);
			appendDefaultFunction(builder, state);

			appendOfBooleanFunction(builder, state);
			appendOfIntegerFunction(builder, state);
			appendOfNumberFunction(builder, state);
			appendOfStringFunction(builder, state);
			appendOfEnumFunction(builder, state);

			appendOfArrayFunction(builder, state);

			appendOfColorFunction(builder, state);
			appendOfPaletteFunction(builder, state);

			return builder;
		}

		/**
		 * @param {Builder} builder 
		 * @param {QlikPropertyDefinition} state 
		 */
		function appendBuildFunction(builder, state) {
			builder.build = function () {
				return state;
			};
		}

		/**
		 * @param {Builder} builder 
		 * @param {QlikPropertyDefinition} state 
		 */
		function appendVisibleFunction(builder, state) {
			builder.visible = function (visibility) {
				state.show = visibility;
				return builder;
			};
		}

		/**
		 * @param {Builder} builder 
		 * @param {QlikPropertyDefinition} state 
		 */
		function appendTitleFunction(builder, state) {
			builder.title = function (title) {
				state.label = title;
				return builder;
			};
		}

		/**
		 * @param {Builder} builder 
		 * @param {QlikPropertyDefinition} state 
		 */
		function appendDefaultFunction(builder, state) {
			builder.default = function (defaultValue) {
				state.defaultValue = defaultValue;
				return builder;
			};
		}

		/**
		 * @param {Builder} builder 
		 * @param {QlikPropertyDefinition} state 
		 */
		function appendOfBooleanFunction(builder, state) {
			builder.ofBoolean = function () {
				state.type = 'boolean';
				appendAsCheckBoxFunction(builder, state);
				appendAsSwithFunction(builder, state);
				return builder;
			};
		}

		/**
		 * @param {Builder} builder 
		 * @param {QlikPropertyDefinition} state 
		 */
		function appendAsCheckBoxFunction(builder, state) {
			builder.asCheckBox = function () {
				delete state.component;
				return builder;
			};
		}

		/**
		 * @param {Builder} builder 
		 * @param {QlikPropertyDefinition} state 
		 */
		function appendAsSwithFunction(builder, state) {
			builder.asSwitch = function (trueTitle, falseTitle) {
				state.component = 'switch';
				state.options = [
					{
						value: true,
						label: trueTitle
					},
					{
						value: false,
						label: falseTitle
					}
				];
				return builder;
			};
		}

		/**
		 * @param {Builder} builder 
		 * @param {QlikPropertyDefinition} state 
		 */
		function appendOfIntegerFunction(builder, state) {
			builder.ofInteger = function () {
				state.type = 'integer';
				appendRangeFunction(builder, state);
				appendAsNumberInputFunction(builder, state);
				appendAsNumberSliderFunction(builder, state);
				return builder;
			};
		}

		/**
		 * @param {Builder} builder 
		 * @param {QlikPropertyDefinition} state 
		 */
		function appendOfNumberFunction(builder, state) {
			builder.ofInteger = function () {
				state.type = 'number';
				appendRangeFunction(builder, state);
				appendAsNumberInputFunction(builder, state);
				appendAsNumberSliderFunction(builder, state);
				return builder;
			};
		}

		/**
		 * @param {Builder} builder 
		 * @param {QlikPropertyDefinition} state 
		 */
		function appendRangeFunction(builder, state) {
			builder.range = function (minValue, maxValue) {
				state.min = minValue;
				state.max = maxValue;
				return builder;
			};
		}

		/**
		 * @param {Builder} builder 
		 * @param {QlikPropertyDefinition} state 
		 */
		function appendAsNumberInputFunction(builder, state) {
			builder.asInput = function () {
				delete state.component;
				return builder;
			};
		}

		/**
		 * @param {Builder} builder 
		 * @param {QlikPropertyDefinition} state 
		 */
		function appendAsNumberSliderFunction(builder, state) {
			builder.asSlider = function (step) {
				state.component = 'slider';
				if (step != null) {
					state.step = step;
				}
				return builder;
			};
		}

		/**
		 * @param {Builder} builder 
		 * @param {QlikPropertyDefinition} state 
		 */
		function appendOfStringFunction(builder, state) {
			builder.ofString = function () {
				state.type = 'string';
				appendMaxLengthFunction(builder, state);
				appendAsStringTextBoxFunction(builder, state);
				appendAsStringExpressionBoxFunction(builder, state);
				appendAsStringTextAreaFunction(builder, state);
				return builder;
			};
		}

		/**
		 * @param {Builder} builder 
		 * @param {QlikPropertyDefinition} state 
		 */
		function appendMaxLengthFunction(builder, state) {
			builder.maxLength = function (maxLength) {
				state.maxLength = maxLength;
				return builder;
			};
		}

		/**
		 * @param {Builder} builder 
		 * @param {QlikPropertyDefinition} state 
		 */
		function appendAsStringTextBoxFunction(builder, state) {
			builder.asTextBox = function () {
				delete state.component;
				delete state.expression;
				return builder;
			};
		}

		/**
		 * @param {Builder} builder 
		 * @param {QlikPropertyDefinition} state 
		 */
		function appendAsStringExpressionBoxFunction(builder, state) {
			builder.asExpressionBox = function (implicit) {
				delete state.component;
				state.expression = implicit ? 'optional' : 'always';
				return builder;
			};
		}

		/**
		 * @param {Builder} builder 
		 * @param {QlikPropertyDefinition} state 
		 */
		function appendAsStringTextAreaFunction(builder, state) {
			builder.asTextArea = function (rowCount) {
				state.component = 'textarea';
				state.rows = rowCount;
				return builder;
			};
		}

		/**
		 * @param {Builder} builder 
		 * @param {QlikPropertyDefinition} state 
		 */
		function appendOfEnumFunction(builder, state) {
			builder.ofEnum = function () {
				state.type = 'string';
				state.component = 'dropdown';
				state.options = [];
				appendAddOptionFunction(builder, state);
				appendAsComboboxFunction(builder, state);
				appendAsButtonsFunction(builder, state);
				appendAsRadioButtonsFunction(builder, state);
				return builder;
			};
		}

		/**
		 * @param {Builder} builder 
		 * @param {QlikPropertyDefinition} state 
		 */
		function appendAddOptionFunction(builder, state) {
			builder.add = function (value, title, isDefault) {
				var option = {
					value: value,
					label: title
				};
				state.options.push(option);

				if (isDefault) {
					state.defaultValue = value;
				}
				return builder;
			};
		}

		/**
		 * @param {Builder} builder 
		 * @param {QlikPropertyDefinition} state 
		 */
		function appendAsComboboxFunction(builder, state) {
			builder.asComboBox = function () {
				state.component = 'dropdown';
				return builder;
			};
		}

		/**
		 * @param {Builder} builder 
		 * @param {QlikPropertyDefinition} state 
		 */
		function appendAsButtonsFunction(builder, state) {
			builder.asButtons = function () {
				state.component = 'buttongroup';
				return builder;
			};
		}

		/**
		 * @param {Builder} builder 
		 * @param {QlikPropertyDefinition} state 
		 */
		function appendAsRadioButtonsFunction(builder, state) {
			builder.asRadioButtons = function () {
				state.component = 'radiobuttons';
				return builder;
			};
		}

		/**
		 * @param {Builder} builder 
		 * @param {QlikPropertyDefinition} state 
		 */
		function appendOfArrayFunction(builder, state) {
			builder.ofArray = function () {
				state.type = 'array';
				state.items = { };
				appendAddFunction(builder, state);
				appendItemTitleFunction(builder, state);
				appendItemTitlePropertyNameFunction(builder, state);
				appendModifiableFunction(builder, state);
				appendOrderableFunction(builder, state);
				appendMaxCountFunction(builder, state);
				return builder;
			};
		}

		/**
		 * @param {Builder} builder 
		 * @param {QlikPropertyDefinition} state 
		 */
		function appendItemTitleFunction(builder, state) {
			builder.itemTitle = function (title) {
				if (typeof(title) === 'function') {
					// Установка функции вычисления заголовка
					state.itemTitleRef = title;
				}
				else {
					// Установка текста заголовка
					state.itemTitleRef = function () {
						return title;
					};
				}
				return builder;
			};
		}
		
		/**
		 * @param {Builder} builder 
		 * @param {QlikPropertyDefinition} state 
		 */
		function appendItemTitlePropertyNameFunction(builder, state) {
			builder.itemTitlePropertyName = function (itemPropertyName) {
				state.itemTitleRef = itemPropertyName;
				return builder;
			};
		}

		/**
		 * @param {Builder} builder 
		 * @param {QlikPropertyDefinition} state 
		 */
		function appendModifiableFunction(builder, state) {
			builder.modifiable = function (isModifiable, additionTitle) {
				state.allowAdd = isModifiable;
				state.allowRemove = isModifiable;
				if (isModifiable) {
					state.addTranslation = additionTitle;
				}
				return builder;
			};
		}
		
		/**
		 * @param {Builder} builder 
		 * @param {QlikPropertyDefinition} state 
		 */
		function appendOrderableFunction(builder, state) {
			builder.orderable = function (isOrderable) {
				state.allowMove = isOrderable;
				return builder;
			};
		}

		/**
		 * @param {Builder} builder 
		 * @param {QlikPropertyDefinition} state 
		 */
		function appendMaxCountFunction(builder, state) {
			builder.maxCount = function (maxCount) {
				state.max = maxCount;
				return builder;
			};
		}


		/**
		 * @param {Builder} builder 
		 * @param {QlikPropertyDefinition} state 
		 */
		function appendOfColorFunction(builder, state) {
			builder.ofColor = function (allowCustomColor) {
				// Идентификатор описывается на уровне шаблона элемента, а не списка
				state.type = allowCustomColor ? 'object' : 'integer';
				state.component = 'color-picker';
				return builder;
			};
		}

		/**
		 * @param {Builder} builder 
		 * @param {QlikPropertyDefinition} state 
		 */
		function appendOfPaletteFunction(builder, state) {
			builder.ofPalette = function (qlikTheme) {
				
				state.type = 'items';
				state.items = {
					template: {
						// Идентификатор добавляется в описание элемента
						ref: state.ref,
						type: 'items',
						component: 'item-selection-list',
						horizontal: false,
						items: getPalettesOptions(qlikTheme)
					}
				};
				// Идентификатор удаляется из описания списка
				delete state.ref;

				return builder;
			};
		}

		/**
		 * Возвращает определение списка выбора палитры
		 * @param {QlikTheme} qlikTheme Тема
		 * @return {QlikColorScaleComponent[]} Список выбора темы
		 */
		function getPalettesOptions(qlikTheme) {
			if (qlikTheme == null) {
				return [];
			}
			return getThemePalettes(qlikTheme)
				.map(colorScaleComponent);
		}

		/**
		 * Возвращает опредление опции выбора палитры
		 * @param {QlikPalette} qlikPalette Палитра
		 * @returns {QlikColorScaleComponent} Опция выбора палитры
		 */
		function colorScaleComponent(qlikPalette) {
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
		 * Возвращает список палитр темы
		 * @param {QlikTheme} qlikTheme Тема
		 * @returns {QlikPalette[]} Список палитр
		 */
		function getThemePalettes(qlikTheme) {
			return qlikTheme.properties.palettes.data;
		}

		/**
		 * Возвращает цветовую шкалу палитры типа Пирамида
		 * @param {QlikPalette} qlikPyramidPalette Палитра
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
		 * @param {QlikPalette} qlikPyramidPalette Палитра
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
		 * @param {QlikPalette} qlikRowPalette Палитра
		 * @returns {Color[]} Массив цветов палитры
		 */
		function getRowPaletteScale(qlikRowPalette) {
			return qlikRowPalette.scale;
		}

		/**
		 * @returns {PropertyUtils}
		 */
		function utils() {
			return {
				path: path
			};
		}

		
		/**
		 * Соединяет части пути к свойству
		 * @param {...String} args Части пути
		 * @returns {String} Общий путь к свойству
		 */
		function path(args) {
			args = Array.prototype.slice.call(arguments);
			return combinePath(args);
		}

		/**
		 * Соединяет части пути к свойству
		 * @param {String[]} itemParts Части пути
		 * @returns {String} Общий путь к свойству
		 */
		function combinePath(itemParts) {
			return itemParts.join('.');
		}
	}
);

/**
 * @typedef {Object} QlikPropertyDefinitions
 * @property {function(): ItemsBuilder} sections
 * @property {ColumnsBuilderFunction} dimensions
 * @property {ColumnsBuilderFunction} measures
 * @property {function(): ItemsBuilder} sorting
 * @property {function(): ItemsBuilder} settings
 * @property {TitledItemsBuilderFunction} expandableItems
 * @property {TitledItemsBuilderFunction} items
 * @property {PropertyBuilderFunction} property
 * @property {LabelBuilderFunction} label
 * @property {function(): PropertyUtils} utils
 */

/**
 * @callback TitledItemsBuilderFunction
 * @param {String} title
 * @returns {ItemsBuilder}
 */

/**
 * @callback ColumnsBuilderFunction
 * @param {Number} minCount Минимальное число измерений
 * @param {Number} maxCount Максимальное число измерений
 * @returns {ItemsBuilder} Построитель набора элементов
 */

/**
 * @typedef {Object} _ItemsBuilder
 * @property {function(QlikPropertyDefinition): ItemsBuilder} add
 * @property {function(Boolean|VisibleCallbackFunction): ItemsBuilder} visible
 */
/**
 * @typedef {_ItemsBuilder & Builder} ItemsBuilder
 */

/**
 * @callback PropertyBuilderFunction
 * @param {...String[]} pathParts
 * @returns {PropertyBuilder}
 */

/**
 * @typedef {Object} _PropertyBuilder
 * @property {VisiblePropertySetterFunction} visible
 * @property {TitlePropertySetterFunction} title
 * @property {DefaultPropertySetterFunction} default
 * @property {function(): BooleanPropertyBuilder} ofBoolean
 * @property {function(): NumberPropertyBuilder} ofInteger
 * @property {function(): NumberPropertyBuilder} ofNumber
 * @property {function(): StringPropertyBuilder} ofString
 * @property {function(): EnumPropertyBuilder} ofEnum
 * @property {function(): ArrayPropertyBuilder} ofArray
 * @property {PalettePropertyFunction} ofPalette
 */
/**
 * @typedef {_PropertyBuilder & Builder} PropertyBuilder
 */

/**
 * @callback VisiblePropertySetterFunction
 * @param {Boolean | VisibleCallbackFunction} visible
 * @returns {PropertyBuilder}
 */

/** 
 * @callback VisibleCallbackFunction
 * @param {*} context
 * @returns {Boolean | Promise<Boolean>}
*/

/**
 * @callback TitlePropertySetterFunction
 * @param {String} title
 * @returns {PropertyBuilder}
 */

/**
 * @callback DefaultPropertySetterFunction
 * @param {*} defaultValue
 * @returns {PropertyBuilder}
 */

/**
 * @typedef {Object} _BooleanPropertyBuilder
 * @property {function(): BooleanPropertyBuilder} asCheckBox
 * @property {BooleanSwitchBuilderFunction} asSwitch
 */
/**
 * @typedef {_BooleanPropertyBuilder & PropertyBuilder} BooleanPropertyBuilder
 */

/**
 * @callback BooleanSwitchBuilderFunction
 * @param {String} trueTitle
 * @param {String} falseTitle
 * @returns {BooleanPropertyBuilder}
 */

/**
 * @typedef {Object} _IntegerPropertyBuilder
 * @property {NumberRangeSetterFunction} range
 * @property {function(): NumberPropertyBuilder} asInput
 * @property {NumberSliderBuilderFunction} asSlider
 */
/**
 * @typedef {_IntegerPropertyBuilder & PropertyBuilder} NumberPropertyBuilder
 */

/**
 * @callback NumberRangeSetterFunction
 * @param {Number} minValue
 * @param {Number} maxValue
 * @returns {NumberPropertyBuilder}
 */

/**
 * @callback NumberSliderBuilderFunction
 * @param {Number} step
 * @returns {NumberPropertyBuilder}
 */

/**
 * @typedef {Object} _StringPropertyBuilder
 * @property {StringMaxLengthSetterFunction} maxLength
 * @property {function(): StringPropertyBuilder} asTextBox
 * @property {StringExpressionBoxPropertyFunction} asExpressionBox
 * @property {StringTextAreaPropertyFunction} asTextArea
 */
/**
 * @typedef {_StringPropertyBuilder & PropertyBuilder} StringPropertyBuilder
 */

 /**
 * @callback StringMaxLengthSetterFunction
 * @param {Number} maxLength
 * @returns {StringPropertyBuilder}
 */

/**
 * @callback StringExpressionBoxPropertyFunction
 * @param {Boolean=} implicit
 * @returns {StringPropertyBuilder}
 */

 /**
 * @callback StringTextAreaPropertyFunction
 * @param {Number} rowCount
 * @returns {StringPropertyBuilder}
 */

/**
 * @typedef {Object} _EnumPropertyBuilder
 * @property {AddOptionFunction} add
 * @property {function(): EnumPropertyBuilder} asComboBox
 * @property {function(): EnumPropertyBuilder} asButtons
 * @property {function(): EnumPropertyBuilder} asRadioButtons
 */
/**
 * @typedef {_EnumPropertyBuilder & PropertyBuilder} EnumPropertyBuilder
 */

/**
 * @callback AddOptionFunction
 * @param {*} value
 * @param {String} title
 * @param {Boolean=} isDefault
 * @returns {EnumPropertyBuilder}
 */

/**
 * @typedef {Object} _ArrayPropertyBuilder
 * @property {ArrayAddPropertyFunction} add
 * @property {ArrayItemTitleSetterFunction} itemTitle
 * @property {ArrayItemTitlePropertyNameSetterFunction} itemTitlePropertyName
 * @property {ArrayModifiableSetterFunction} modifiable
 * @property {ArrayOrderableSetterFunction} orderable
 * @property {ArrayMaxCountSetterFunction} maxCount
 */
/**
 * @typedef {_ArrayPropertyBuilder & PropertyBuilder} ArrayPropertyBuilder
 */

/**
 * @callback ArrayAddPropertyFunction
 * @param {QlikPropertyDefinition|PropertyBuilder} item
 * @returns {ArrayPropertyBuilder}
 */
 
/**
 * @callback ArrayItemTitleSetterFunction
 * @param {String | GetArrayItemTitleFunction} title
 * @returns {ArrayPropertyBuilder}
 */

/**
 * @callback GetArrayItemTitleFunction
 * @param {*} item
 * @param {Number} index
 * @param {*} context
 * @returns {String}
 */

/**
 * @callback ArrayItemTitlePropertyNameSetterFunction
 * @param {String} itemPropertyName
 * @returns {ArrayPropertyBuilder}
 */

/**
 * @callback ArrayModifiableSetterFunction
 * @param {Boolean} isModifiable
 * @param {String} additionTitle
 * @returns {ArrayPropertyBuilder}
 */

/**
 * @callback ArrayOrderableSetterFunction
 * @param {Boolean} isOrderable
 * @returns {ArrayPropertyBuilder}
 */

/**
 * @callback ArrayMaxCountSetterFunction
 * @param {Number} maxCount
 * @returns {ArrayPropertyBuilder}
 */

/**
 * @callback PalettePropertyFunction
 * @param {QlikTheme} qlikTheme
 * @returns {PalettePropertyBuilder}
 */

/**
 * @typedef {PropertyBuilder} PalettePropertyBuilder
 */

/**
 * @callback LabelBuilderFunction
 * @param {String} title
 * @returns {Builder}
 */

/**
 * @typedef {Object} Builder
 * @property {function(): QlikPropertyDefinition} build
 */

/**
 * @typedef {Object} PropertyUtils
 * @property {function(...String): String} path
 */