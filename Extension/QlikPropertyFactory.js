/**
 * Фабрика определений свойств Qlik
 */
define(
	[],

	/**
	 * @returns {PropertyFactory}
	 */
	function () {
		'use strict';

		// API
		return {
			boolean: boolean,
			integer: integer,
			number: number,
			string: string,
			enumeration: enumeration,
			color: color,
			label: label
		};

		/**
		 * @param {...String} propertyPath
		 * @returns {BooleanBuilder}
		 */
		function boolean(propertyPath) {
			propertyPath = Array.prototype.slice.call(arguments);

			/** @type {QlikPropertyDefinition} */
			var definition = {
				ref: combinePath(propertyPath),
				type: 'boolean'
			};

			var builder = {};
			fillBuilder(builder, definition);
			fillPropertyBuilder(builder, definition);
			addBooleanCheckBox(builder, definition);
			addBooleanSwitch(builder, definition);
			return builder;
		}
		
		/**
		 * @param {BooleanBuilder} builder 
		 * @param {QlikPropertyDefinition} definition 
		 */
		function addBooleanCheckBox(builder, definition) {
			builder.checkBox = function () {
				delete definition.component;
				var builder = {};
				fillBuilder(builder, definition);
				fillPropertyBuilder(builder, definition);
				return builder;
			};
		}
		
		/**
		 * @param {BooleanBuilder} builder 
		 * @param {QlikPropertyDefinition} definition 
		 */
		function addBooleanSwitch(builder, definition) {
			builder.switch = function () {
				definition.component = 'switch';
				var builder = {};
				fillBuilder(builder, definition);
				fillPropertyBuilder(builder, definition);
				addBooleanSwitchOptionTitles(builder, definition);
				return builder;
			};
		}
				
		/**
		 * @param {BooleanSwitchBuilder} builder 
		 * @param {QlikPropertyDefinition} definition 
		 */
		function addBooleanSwitchOptionTitles(builder, definition) {
			builder.optionTitles = function (trueTitle, falseTitle) {
				definition.options = [
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
		 * @param {...String} propertyPath
		 * @returns {IntegerBuilder}
		 */
		function integer(propertyPath) {
			propertyPath = Array.prototype.slice.call(arguments);

			/** @type {QlikPropertyDefinition} */
			var definition = {
				ref: combinePath(propertyPath),
				type: 'integer'
			};

			var builder = {};
			fillBuilder(builder, definition);
			fillPropertyBuilder(builder, definition);
			fillIntegerBuilder(builder, definition);
			addIntegerEditBox(builder, definition);
			addIntegerSlider(builder, definition);
			return builder;
		}
		
		/**
		 * @param {*} builder 
		 * @param {QlikPropertyDefinition} definition 
		 */
		function fillIntegerBuilder(builder, definition) {
			addRange(builder, definition);
		}

		/**
		 * @param {IntegerBuilder} builder 
		 * @param {QlikPropertyDefinition} definition 
		 */
		function addIntegerEditBox(builder, definition) {
			builder.editBox = function() {
				delete definition.component;
				var builder = {};
				fillBuilder(builder, definition);
				fillPropertyBuilder(builder, definition);
				fillIntegerBuilder(builder, definition);
				return builder;
			};
		}

		/**
		 * @param {IntegerBuilder} builder 
		 * @param {QlikPropertyDefinition} definition 
		 */
		function addIntegerSlider(builder, definition) {
			builder.slider = function() {
				definition.component = 'slider';
				var builder = {};
				fillBuilder(builder, definition);
				fillPropertyBuilder(builder, definition);
				fillIntegerBuilder(builder, definition);
				addIntegerSliderStep(builder, definition);
				return builder;
			};
		}

		/**
		 * @param {Slider} builder 
		 * @param {QlikPropertyDefinition} definition 
		 */
		function addIntegerSliderStep(builder, definition) {
			builder.step = function (stepValue) {
				definition.step = Math.max(Math.round(stepValue), 1);
				return builder;
			};
		}

		/**
		 * @param {...String} propertyPath
		 * @returns {IntegerBuilder}
		 */
		function number(propertyPath) {
			propertyPath = Array.prototype.slice.call(arguments);

			/** @type {QlikPropertyDefinition} */
			var definition = {
				ref: combinePath(propertyPath),
				type: 'number'
			};

			var builder = {};
			fillBuilder(builder, definition);
			fillPropertyBuilder(builder, definition);
			fillNumberBuilder(builder, definition);
			addNumberEditBox(builder, definition);
			addNumberSlider(builder, definition);
			addNumberExpressionBox(builder, definition);
			return builder;
		}

		/**
		 * @param {*} builder 
		 * @param {QlikPropertyDefinition} definition 
		 */
		function fillNumberBuilder(builder, definition) {
			addRange(builder, definition);
		}
		
		/**
		 * @param {NumberBuilder} builder 
		 * @param {QlikPropertyDefinition} definition 
		 */
		function addNumberEditBox(builder, definition) {
			builder.editBox = function() {
				delete definition.component;
				var builder = {};
				fillBuilder(builder, definition);
				fillPropertyBuilder(builder, definition);
				fillNumberBuilder(builder, definition);
				return builder;
			};
		}

		/**
		 * @param {NumberBuilder} builder 
		 * @param {QlikPropertyDefinition} definition 
		 */
		function addNumberSlider(builder, definition) {
			builder.slider = function() {
				definition.component = 'slider';
				definition.type = 'number';
				var builder = {};
				fillBuilder(builder, definition);
				fillPropertyBuilder(builder, definition);
				fillNumberBuilder(builder, definition);
				addNumberSliderStep(builder, definition);
				return builder;
			};
		}

		/**
		 * @param {Slider} builder 
		 * @param {QlikPropertyDefinition} definition 
		 */
		function addNumberSliderStep(builder, definition) {
			builder.step = function (stepValue) {
				definition.step = stepValue;
				return builder;
			};
		}

		/**
		 * @param {IntegerExpressionBoxBuilder} builder 
		 * @param {QlikPropertyDefinition} definition 
		 */
		function addNumberExpressionBox(builder, definition) {
			builder.expressionBox = function() {
				delete definition.component;
				definition.expression = 'always';
				var builder = {};
				fillBuilder(builder, definition);
				fillPropertyBuilder(builder, definition);
				fillNumberBuilder(builder, definition);
				addExpressionBoxOptionalExpression(builder, definition);
				return builder;
			};
		}

		/**
		 * @param {...String} propertyPath
		 * @returns {IntegerBuilder}
		 */
		function string(propertyPath) {
			propertyPath = Array.prototype.slice.call(arguments);

			/** @type {QlikPropertyDefinition} */
			var definition = {
				ref: combinePath(propertyPath),
				type: 'string'
			};

			var builder = {};
			fillBuilder(builder, definition);
			fillPropertyBuilder(builder, definition);
			fillStringBuilder(builder, definition);
			addStringEditBox(builder, definition);
			addStringTextArea(builder, definition);
			addStringExpressionBox(builder, definition);
			return builder;
		}

		/**
		 * @param {*} builder 
		 * @param {QlikPropertyDefinition} definition 
		 */
		function fillStringBuilder(builder, definition) {
			addStringMaxLength(builder, definition);
		}

		/**
		 * @param {StringBuilder} builder 
		 * @param {QlikPropertyDefinition} definition 
		 */
		function addStringMaxLength(builder, definition) {
			builder.maxLength = function (maxLength) {
				definition.maxLength = maxLength;
				return builder;
			};
		}

		/**
		 * @param {StringBuilder} builder 
		 * @param {QlikPropertyDefinition} definition 
		 */
		function addStringEditBox(builder, definition) {
			builder.editBox = function () {
				delete definition.component;
				var builder = {};
				fillBuilder(builder, definition);
				fillPropertyBuilder(builder, definition);
				fillStringBuilder(builder, definition);
				return builder;
			};
		}

		/**
		 * @param {StringBuilder} builder 
		 * @param {QlikPropertyDefinition} definition 
		 */
		function addStringTextArea(builder, definition) {
			builder.textArea = function () {
				definition.component = 'textarea';
				var builder = {};
				fillBuilder(builder, definition);
				fillPropertyBuilder(builder, definition);
				fillStringBuilder(builder, definition);
				addStringTextAreaRowCount(builder, definition);
				return builder;
			};
		}

		/**
		 * @param {StringTextAreaBuilder} builder 
		 * @param {QlikPropertyDefinition} definition 
		 */
		function addStringTextAreaRowCount(builder, definition) {
			builder.rowCount = function (rowCount) {
				definition.rowCount = rowCount;
				return builder;
			};
		}

		/**
		 * @param {IntegerExpressionBoxBuilder} builder 
		 * @param {QlikPropertyDefinition} definition 
		 */
		function addStringExpressionBox(builder, definition) {
			builder.expressionBox = function() {
				delete definition.component;
				definition.expression = 'always';
				var builder = {};
				fillBuilder(builder, definition);
				fillPropertyBuilder(builder, definition);
				fillStringBuilder(builder, definition);
				addExpressionBoxOptionalExpression(builder, definition);
				return builder;
			};
		}

		/**
		 * @param {IntegerExpressionBoxBuilder & NumberExpressionBox} builder 
		 * @param {QlikPropertyDefinition} definition 
		 */
		function addExpressionBoxOptionalExpression(builder, definition) {
			builder.optionalExpression = function(isOptional) {
				definition.expression = isOptional ? 'optional' : 'always';
				return builder;
			};
		}

		/**
		 * @param {...String} propertyPath
		 * @returns {IntegerBuilder}
		 */
		function enumeration(propertyPath) {
			propertyPath = Array.prototype.slice.call(arguments);

			/** @type {QlikPropertyDefinition} */
			var definition = {
				ref: combinePath(propertyPath),
				type: 'string',
				// По умолчанию - выпадающий список
				component: 'dropdown',
				options: []
			};

			var builder = {};
			fillBuilder(builder, definition);
			fillPropertyBuilder(builder, definition);
			fillEnumBuilder(builder, definition);
			addEnumComboBox(builder, definition);
			addEnumRadioButtons(builder, definition);
			addEnumButtons(builder, definition);
			return builder;
		}

		/**
		 * @param {PropertyBuilder} builder 
		 * @param {QlikPropertyDefinition} definition 
		 */
		function fillEnumBuilder(builder, definition) {
			addEnumAddOption(builder, definition);
		}
		
		/**
		 * @param {EnumBuilder} builder 
		 * @param {QlikPropertyDefinition} definition 
		 */
		function addEnumAddOption(builder, definition) {
			builder.add = function (value, title, isDefault) {
				var option = {
					value: value,
					label: title
				};
				definition.options.push(option);

				if (isDefault) {
					definition.defaultValue = value;
				}
				return builder;
			};
		}

		/**
		 * @param {EnumBuilder} builder 
		 * @param {QlikPropertyDefinition} definition 
		 */
		function addEnumComboBox(builder, definition) {
			builder.comboBox = function () {
				definition.component = 'dropdown';
				var builder = {};
				fillBuilder(builder, definition);
				fillPropertyBuilder(builder, definition);
				fillEnumBuilder(builder, definition);
				return builder;
			};
		}

		/**
		 * @param {EnumBuilder} builder 
		 * @param {QlikPropertyDefinition} definition 
		 */
		function addEnumRadioButtons(builder, definition) {
			builder.radioButtons = function () {
				definition.component = 'radiobuttons';
				var builder = {};
				fillBuilder(builder, definition);
				fillPropertyBuilder(builder, definition);
				fillEnumBuilder(builder, definition);
				return builder;
			};
		}

		/**
		 * @param {EnumBuilder} builder 
		 * @param {QlikPropertyDefinition} definition 
		 */
		function addEnumButtons(builder, definition) {
			builder.buttons = function () {
				definition.component = 'dropdown';
				var builder = {};
				fillBuilder(builder, definition);
				fillPropertyBuilder(builder, definition);
				fillEnumBuilder(builder, definition);
				return builder;
			};
		}

		/**
		 * @param {...String} propertyPath
		 * @returns {ColorBuilder}
		 */
		function color(propertyPath) {
			propertyPath = Array.prototype.slice.call(arguments);

			/** @type {QlikPropertyDefinition} */
			var definition = {
				ref: combinePath(propertyPath)
			};

			var builder = {};
			// NOTE: Свойство не готово к построению до выбора типа интерфейса
			fillPropertyBuilder(builder, definition);
			addColorPicker(builder, definition);
			addColorEditBox(builder, definition);
			addColorExpressionBox(builder, definition);
			return builder;
		}

		/**
		 * @param {ColorBuilder} builder 
		 * @param {QlikPropertyDefinition} definition 
		 */
		function addColorPicker(builder, definition) {
			builder.picker = function(allowCustomColor) {
				definition.component = 'color-picker';
				if (allowCustomColor) {
					definition.type = 'object';

					var existingDefaultValue = definition.defaultValue;
					if (typeof(existingDefaultValue) == 'string') {
						definition.defaultValue = {
							index: -1,
							color: existingDefaultValue
						};
					} 
					else if (typeof(existingDefaultValue) == 'number') {
						definition.defaultValue = {
							index: existingDefaultValue
						};
					}
				}
				else {
					definition.ref = combinePath([definition.ref, 'index']);
					definition.type = 'integer';
				}

				var builder = {};
				fillBuilder(builder, definition);
				fillPropertyBuilder(builder, definition);
				return builder;
			};
		}

		/**
		 * @param {ColorBuilder} builder 
		 * @param {QlikPropertyDefinition} definition 
		 */
		function addColorEditBox(builder, definition) {
			builder.editBox = function() {
				definition.ref = combinePath([definition.ref, 'color']);
				definition.type = 'string';

				var builder = {};
				fillBuilder(builder, definition);
				fillPropertyBuilder(builder, definition);
				return builder;
			};
		}

		/**
		 * @param {ColorBuilder} builder 
		 * @param {QlikPropertyDefinition} definition 
		 */
		function addColorExpressionBox(builder, definition) {
			builder.expressionBox = function() {
				definition.ref = combinePath([definition.ref, 'color']);
				definition.type = 'string';
				definition.expression = 'always';

				var builder = {};
				fillBuilder(builder, definition);
				fillPropertyBuilder(builder, definition);
				addExpressionBoxOptionalExpression(builder, definition);
				return builder;
			};
		}

		/**
		 * @param {*} builder 
		 * @param {QlikPropertyDefinition} definition 
		 */
		function fillPropertyBuilder(builder, definition) {
			addDefault(builder, definition);
			addTitle(builder, definition);
			addVisible(builder, definition);
		}

		/**
		 * @param {*} builder 
		 * @param {QlikPropertyDefinition} definition 
		 */
		function addDefault(builder, definition) {
			builder.default = function (defaultValue) {
				definition.defaultValue = defaultValue;
				return builder;
			};
		}

		/**
		 * @param {*} builder 
		 * @param {QlikPropertyDefinition} definition 
		 */
		function addTitle(builder, definition) {
			builder.title = function (title) {
				definition.label = title;
				return builder;
			};
		}

		/**
		 * @param {PropertyBuilder} builder 
		 * @param {QlikPropertyDefinition} definition 
		 */
		function addVisible(builder, definition) {
			builder.visible = function (visibility) {
				definition.show = visibility;
				return builder;
			};
		}

		/**
		 * @param {IntegerBuilder & NumberBuilder} builder 
		 * @param {QlikPropertyDefinition} definition 
		 */
		function addRange(builder, definition) {
			builder.range = function(minValue, maxValue) {
				if (minValue != null) {
					definition.min = minValue;
				}
				else {
					delete definition.min;
				}

				if (maxValue != null) {
					definition.max = maxValue;
				}
				else {
					delete definition.max;
				}

				return builder;
			};
		}

		/**
		 * @returns {BooleanBuilder}
		 */
		function label(title) {

			/** @type {QlikPropertyDefinition} */
			var definition = {
				component: 'text',
				label: title
			};

			var builder = {};
			fillBuilder(builder, definition);
			return builder;
		}

		/**
		 * @param {*} builder 
		 * @param {QlikPropertyDefinition} definition 
		 */
		function fillBuilder(builder, definition) {
			builder.build = function () {
				return definition;
			};
		}

		// /**
		//  * Соединяет части пути к свойству
		//  * @param {...String} args Части пути
		//  * @returns {String} Общий путь к свойству
		//  */
		// function path(args) {
		// 	args = Array.prototype.slice.call(arguments);
		// 	return combinePath(args);
		// }

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
 * @typedef {Object} PropertyFactory
 * @property {function(...String): BooleanBuilder} boolean
 * @property {function(...String): IntegerBuilder} integer
 * @property {function(...String): NumberBuilder} number
 * @property {function(...String): StringBuilder} string
 * @property {function(...String): EnumBuilder} enumeration
 * @property {function(...String): ColorBuilder} color
 * @property {function(String) label
 */

/**
 * @typedef {Object} BooleanBuilder
 * @property {function(): QlikPropertyDefinition} build
 * @property {function(String): BooleanBuilder} title
 * @property {function(Boolean|VisibleCallbackFunction): BooleanBuilder} visible
 * @property {function(Boolean): BooleanBuilder} default
 * @property {function(): CheckBoxBuilder} checkBox
 * @property {function(): BooleanSwitchBuilder} switch
 */

/**
 * @typedef {Object} CheckBoxBuilder
 * @property {function(): QlikPropertyDefinition} build
 * @property {function(String): CheckBoxBuilder} title
 * @property {function(Boolean|VisibleCallbackFunction): CheckBoxBuilder} visible
 * @property {function(Boolean): CheckBoxBuilder} default
 */

/**
 * @typedef {Object} BooleanSwitchBuilder
 * @property {function(): QlikPropertyDefinition} build
 * @property {function(String): BooleanSwitchBuilder} title
 * @property {function(Boolean|VisibleCallbackFunction): BooleanSwitchBuilder} visible
 * @property {function(Boolean): BooleanSwitchBuilder} default
 * @property {function(String, String): BooleanSwitchBuilder} optionTitles
 */

/**
 * @typedef {Object} IntegerBuilder
 * @property {function(): QlikPropertyDefinition} build
 * @property {function(String): IntegerBuilder} title
 * @property {function(Boolean|VisibleCallbackFunction): IntegerBuilder} visible
 * @property {function(Number): IntegerBuilder} default
 * @property {function(Number, Number): IntegerBuilder} range
 * @property {function(): IntegerEditBoxBuilder} editBox
 * @property {function(): IntegerSliderBuilder} slider
 */

/**
 * @typedef {Object} IntegerEditBoxBuilder
 * @property {function(): QlikPropertyDefinition} build
 * @property {function(String): IntegerEditBoxBuilder} title
 * @property {function(Boolean|VisibleCallbackFunction): IntegerEditBoxBuilder} visible
 * @property {function(Number): IntegerEditBoxBuilder} default
 * @property {function(Number, Number): IntegerEditBoxBuilder} range
 */

/**
 * @typedef {Object} IntegerSliderBuilder
 * @property {function(): QlikPropertyDefinition} build
 * @property {function(String): IntegerSliderBuilder} title
 * @property {function(Boolean|VisibleCallbackFunction): IntegerSliderBuilder} visible
 * @property {function(Number): IntegerSliderBuilder} default
 * @property {function(Number, Number): IntegerSliderBuilder} range
 * @property {function(Number): IntegerSliderBuilder} step
 */

/**
 * @typedef {Object} NumberBuilder
 * @property {function(): QlikPropertyDefinition} build
 * @property {function(String): NumberBuilder} title
 * @property {function(Boolean|VisibleCallbackFunction): NumberBuilder} visible
 * @property {function(Number): NumberBuilder} default
 * @property {function(Number, Number): NumberBuilder} range
 * @property {function(): NumberEditBoxBuilder} editBox
 * @property {function(): NumberSliderBuilder} slider
 * @property {function(): NumberExpressionBoxBuilder} expressionBox
 */

/**
 * @typedef {Object} NumberEditBoxBuilder
 * @property {function(): QlikPropertyDefinition} build
 * @property {function(String): NumberEditBoxBuilder} title
 * @property {function(Boolean|VisibleCallbackFunction): NumberEditBoxBuilder} visible
 * @property {function(Number): NumberEditBoxBuilder} default
 * @property {function(Number, Number): NumberEditBoxBuilder} range
 */

/**
 * @typedef {Object} NumberSliderBuilder
 * @property {function(): QlikPropertyDefinition} build
 * @property {function(String): NumberSliderBuilder} title
 * @property {function(Boolean|VisibleCallbackFunction): NumberSliderBuilder} visible
 * @property {function(Number): NumberSliderBuilder} default
 * @property {function(Number, Number): NumberSliderBuilder} range
 * @property {function(Number): NumberSliderBuilder} step
 */

/**
 * @typedef {Object} NumberExpressionBoxBuilder
 * @property {function(): QlikPropertyDefinition} build
 * @property {function(String): NumberExpressionBoxBuilder} title
 * @property {function(Boolean|VisibleCallbackFunction): NumberExpressionBoxBuilder} visible
 * @property {function(Number): NumberExpressionBoxBuilder} default
 * @property {function(Number, Number): NumberExpressionBoxBuilder} range
 * @property {function(Boolean): NumberExpressionBoxBuilder} optionalExpression
 */

/**
 * @typedef {Object} StringBuilder
 * @property {function(): QlikPropertyDefinition} build
 * @property {function(String): StringBuilder} title
 * @property {function(Boolean|VisibleCallbackFunction): StringBuilder} visible
 * @property {function(String): StringBuilder} default
 * @property {function(Number): StringBuilder} maxLength
 * @property {function(): StringEditBoxBuilder} editBox
 * @property {function(): StringTextAreaBuilder} textArea
 * @property {function(): StringExpressionBoxBuilder} expressionBox
 */

/**
 * @typedef {Object} StringEditBoxBuilder
 * @property {function(): QlikPropertyDefinition} build
 * @property {function(String): StringEditBoxBuilder} title
 * @property {function(Boolean|VisibleCallbackFunction): StringEditBoxBuilder} visible
 * @property {function(String): StringEditBoxBuilder} default
 * @property {function(Number): StringEditBoxBuilder} maxLength
 */

/**
 * @typedef {Object} StringTextAreaBuilder
 * @property {function(): QlikPropertyDefinition} build
 * @property {function(String): StringTextAreaBuilder} title
 * @property {function(Boolean|VisibleCallbackFunction): StringTextAreaBuilder} visible
 * @property {function(String): StringTextAreaBuilder} default
 * @property {function(Number): StringTextAreaBuilder} maxLength
 * @property {function(Number): StringTextAreaBuilder} rowCount
 */

/**
 * @typedef {Object} StringExpressionBoxBuilder
 * @property {function(): QlikPropertyDefinition} build
 * @property {function(String): StringExpressionBoxBuilder} title
 * @property {function(Boolean|VisibleCallbackFunction): StringExpressionBoxBuilder} visible
 * @property {function(String): StringExpressionBoxBuilder} default
 * @property {function(Boolean): StringExpressionBoxBuilder} optionalExpression
 */

/**
 * @typedef {Object} EnumBuilder
 * @property {function(): QlikPropertyDefinition} build
 * @property {function(String): EnumBuilder} title
 * @property {function(Boolean|VisibleCallbackFunction): EnumBuilder} visible
 * @property {function(String): EnumBuilder} default
 * @property {function(*, String, Boolean): EnumBuilder} add
 * @property {function(): EnumUiBuilder} comboBox
 * @property {function(): EnumUiBuilder} radioButtons
 * @property {function(): EnumUiBuilder} buttons
 */

/**
 * @typedef {Object} EnumUiBuilder
 * @property {function(): QlikPropertyDefinition} build
 * @property {function(String): EnumUiBuilder} title
 * @property {function(Boolean|VisibleCallbackFunction): EnumUiBuilder} visible
 * @property {function(String): EnumUiBuilder} default
 * @property {function(*, String, Boolean): EnumUiBuilder} add
 */

/**
 * @typedef {Object} ColorBuilder
 * @property {function(String): ColorBuilder} title
 * @property {function(Boolean|VisibleCallbackFunction): ColorBuilder} visible
 * @property {function(*): ColorBuilder} default
 * @property {function(Boolean): ColorUiBuilder} picker
 * @property {function(Boolean): ColorUiBuilder} editBox
 * @property {function(Boolean): ColorExpressionBoxBuilder} expressionBox
 */

/**
 * @typedef {Object} ColorUiBuilder
 * @property {function(): QlikPropertyDefinition} build
 * @property {function(String): ColorUiBuilder} title
 * @property {function(Boolean|VisibleCallbackFunction): ColorUiBuilder} visible
 * @property {function(*): ColorUiBuilder} default
 */

 /**
 * @typedef {Object} ColorExpressionBoxBuilder
 * @property {function(): QlikPropertyDefinition} build
 * @property {function(String): ColorExpressionBoxBuilder} title
 * @property {function(Boolean|VisibleCallbackFunction): ColorExpressionBoxBuilder} visible
 * @property {function(String): ColorExpressionBoxBuilder} default
 * @property {function(Boolean): ColorExpressionBoxBuilder} optionalExpression
 */

/** 
 * @callback VisibleCallbackFunction
 * @param {*} context
 * @returns {Boolean | Promise<Boolean>}
*/

/**
 * @typedef {Object} Builder
 * @property {function(): QlikPropertyDefinition} build
 */