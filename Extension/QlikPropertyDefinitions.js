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
			property: property
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
		 * @param {String} title
		 * @returns {PropertyBuilder}
		 */
		function property(propertyPath) {
			/** @type {QlikPropertyDefinition} */
			var state = {
				ref: propertyPath
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
	}
);

/**
 * @typedef {Object} QlikPropertyFactory
 * @property {function(): ItemsBuilder} sections
 * @property {ColumnsBuilderFunction} dimensions
 * @property {ColumnsBuilderFunction} measures
 * @property {function(): ItemsBuilder} sorting
 * @property {function(): ItemsBuilder} settings
 * @property {TitledItemsBuilderFunction} expandableItems
 * @property {TitledItemsBuilderFunction} items
 * @property {PropertyBuilderFunction} property
 * @property {LabelBuilderFunction} label
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
 * @param {String} propertyPath
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
 * @callback LabelBuilderFunction
 * @param {String} title
 * @returns {Builder}
 */

/**
 * @typedef {Object} Builder
 * @property {function(): QlikPropertyDefinition} build
 */