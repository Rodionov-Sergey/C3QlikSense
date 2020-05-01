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
			array: array,
			color: color,
			palette: palette,
			label: label,

			accordion: accordion,
			dimensions: dimensions,
			measures: measures,
			sorting: sorting,
			settings: settings,
			section: section,
			panel: panel
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
		 * @returns {IntegerBuilder}
		 */
		function array(propertyPath) {
			propertyPath = Array.prototype.slice.call(arguments);

			/** @type {QlikPropertyDefinition} */
			var definition = {
				ref: combinePath(propertyPath),
				type: 'array',
				items: { }
			};

			var builder = {};
			fillBuilder(builder, definition);
			fillPropertyBuilder(builder, definition);
			addItemsAdd(builder, definition);
			appendItemTitleFunction(builder, definition);
			appendItemTitlePropertyNameFunction(builder, definition);
			appendModifiableFunction(builder, definition);
			appendOrderableFunction(builder, definition);
			appendMaxCountFunction(builder, definition);
			return builder;
		}

		/**
		 * @param {Builder} builder 
		 * @param {QlikPropertyDefinition} definition 
		 */
		function appendItemTitleFunction(builder, definition) {
			builder.itemTitle = function (title) {
				if (typeof(title) === 'function') {
					// Установка функции вычисления заголовка
					definition.itemTitleRef = title;
				}
				else {
					// Установка текста заголовка
					definition.itemTitleRef = function () {
						return title;
					};
				}
				return builder;
			};
		}
		
		/**
		 * @param {Builder} builder 
		 * @param {QlikPropertyDefinition} definition 
		 */
		function appendItemTitlePropertyNameFunction(builder, definition) {
			builder.itemTitlePropertyName = function (itemPropertyName) {
				definition.itemTitleRef = itemPropertyName;
				return builder;
			};
		}

		/**
		 * @param {Builder} builder 
		 * @param {QlikPropertyDefinition} definition 
		 */
		function appendModifiableFunction(builder, definition) {
			builder.modifiable = function (isModifiable, additionTitle) {
				definition.allowAdd = isModifiable;
				definition.allowRemove = isModifiable;
				if (isModifiable) {
					definition.addTranslation = additionTitle;
				}
				return builder;
			};
		}
		
		/**
		 * @param {Builder} builder 
		 * @param {QlikPropertyDefinition} definition 
		 */
		function appendOrderableFunction(builder, definition) {
			builder.orderable = function (isOrderable) {
				definition.allowMove = isOrderable;
				return builder;
			};
		}

		/**
		 * @param {Builder} builder 
		 * @param {QlikPropertyDefinition} definition 
		 */
		function appendMaxCountFunction(builder, definition) {
			builder.maxCount = function (maxCount) {
				definition.max = maxCount;
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
		 * @param {...String} propertyPath
		 * @returns {ColorBuilder}
		 */
		function palette(propertyPath) {
			propertyPath = Array.prototype.slice.call(arguments);

			/** @type {QlikPropertyDefinition} */
			var definition = {
				ref: combinePath(propertyPath),
				type: 'string'
			};

			var builder = {};
			// NOTE: Свойство не готово к построению до выбора типа интерфейса
			fillBuilder(builder, definition);
			fillPropertyBuilder(builder, definition);
			addPalettePicker(builder, definition);
			addPaletteComboBox(builder, definition);
			return builder;
		}

		/**
		 * @param {PaletteBuilder} builder 
		 * @param {QlikPropertyDefinition} definition 
		 */
		function addPalettePicker(builder, definition) {
			builder.picker = function() {
				definition.type = 'items';
				definition.component = 'item-selection-list';
				definition.horizontal = false;
				definition.items = [];
				var builder = {};
				fillBuilder(builder, definition);
				fillPropertyBuilder(builder, definition);
				addPalettePickerAddFromTheme(builder, definition);
				addPaletteAdd(builder, definition);
				return builder;
			};
		}

		/**
		 * @param {PalettePickerBuilder} builder 
		 * @param {QlikPropertyDefinition} definition 
		 */
		function addPaletteAdd(builder, definition) {
			builder.add = function (paletteOption) {
				var palette = getPalettePickerDefinition(paletteOption);
				definition.items = definition.items.concat([palette]);
				return builder;
			};
		}

		/**
		 * @param {PalettePickerBuilder} builder 
		 * @param {QlikPropertyDefinition} definition 
		 */
		function addPalettePickerAddFromTheme(builder, definition) {
			builder.fillFromTheme = function (qlikTheme) {
				var palettes = getPalettesOptions(qlikTheme)
					.map(getPalettePickerDefinition);
				definition.items = definition.items.concat(palettes);
				return builder;
			};
		}

		/**
		 * @param {PaletteOption} paletteOption 
		 * @returns {QlikPropertyDefinition}
		 */
		function getPalettePickerDefinition(paletteOption) {
			return {
				component: 'color-scale',
				type: paletteOption.isContinuous ? 'gradient' : 'sequential',
				value: paletteOption.id,
				label: paletteOption.title,
				colors: paletteOption.colors,
				icon: ''
			};
		}

		/**
		 * @param {PaletteBuilder} builder 
		 * @param {QlikPropertyDefinition} definition 
		 */
		function addPaletteComboBox(builder, definition) {
			builder.comboBox = function() {
				definition.type = 'string';
				definition.component = 'dropdown';
				definition.options = [];
				var builder = {};
				fillBuilder(builder, definition);
				fillPropertyBuilder(builder, definition);
				addPaletteComboBoxAddFromTheme(builder, definition);
				addPaletteComboBoxAdd(builder, definition);
				return builder;
			};
		}
		
		/**
		 * @param {PalettePickerBuilder} builder 
		 * @param {QlikPropertyDefinition} definition 
		 */
		function addPaletteComboBoxAddFromTheme(builder, definition) {
			builder.fillFromTheme = function (qlikTheme) {
				var palettes = getPalettesOptions(qlikTheme)
					.map(getPaletteComboBoxOption);
				definition.options = definition.options.concat(palettes);
				return builder;
			};
		}
		
		/**
		 * @param {PalettePickerBuilder} builder 
		 * @param {QlikPropertyDefinition} definition 
		 */
		function addPaletteComboBoxAdd(builder, definition) {
			builder.add = function (id, title) {
				var option = {
					value: id,
					label: title
				};
				definition.options = definition.options.concat([option]);
				return builder;
			};
		}

		/**
		 * @param {PaletteOption} paletteOption 
		 * @returns {QlikPropertyOption}
		 */
		function getPaletteComboBoxOption(paletteOption) {
			return {
				value: paletteOption.id,
				label: paletteOption.title + 
					' (' + paletteOption.colors.length + ' цветов)'
			};
		}

		/**
		 * Возвращает список выбора палитры
		 * @param {QlikTheme} qlikTheme Тема
		 * @return {PaletteOption[]} Список палитр
		 */
		function getPalettesOptions(qlikTheme) {
			if (qlikTheme == null) {
				return [];
			}
			return getThemePalettes(qlikTheme)
				.map(getPaletteOption);
		}

		/**
		 * Возвращает опредление опции выбора палитры
		 * @param {QlikPalette} qlikPalette Палитра
		 * @returns {PaletteOption} Опция выбора палитры
		 */
		function getPaletteOption(qlikPalette) {
			return {
				id: qlikPalette.propertyValue,
				title: qlikPalette.name,
				colors: getPaletteScale(qlikPalette),
				isContinuous: isPaletteContinuous(qlikPalette)
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
		 * @param {QlikPalette} qlikPalette Палитра
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
		 * @param {QlikPalette} qlikPalette Палитра
		 * @returns {Boolean} Признак непрерывной палитры
		 */
		function isPaletteContinuous(qlikPalette) {
			switch (qlikPalette.type) {
				case "gradient":
					return true;
				case 'row':
				case 'pyramid':
				case 'class-pyramid':
					return false;
				default:
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

		// --------------------------------------------------------------------

		/**
		 * @returns {ItemsBuilder}
		 */
		function accordion() {
			/** @type {QlikPropertyDefinition} */
			var state = {
				type: 'items',
				component: 'accordion',
				items: {}
			};

			var builder = { };
			fillBuilder(builder, state);
			addItemsAdd(builder, state);
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
			fillBuilder(builder, state);
			addItemsAdd(builder, state);
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
			fillBuilder(builder, state);
			addItemsAdd(builder, state);
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
			fillBuilder(builder, state);
			addItemsAdd(builder, state);
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
			fillBuilder(builder, state);
			addItemsAdd(builder, state);
			return builder;
		}

		/**
		 * @param {String} title
		 * @returns {ItemsBuilder}
		 */
		function section(title) {
			/** @type {QlikPropertyDefinition} */
			var state = {
				type: 'items',
				component: 'expandable-items',
				label: title,
				items: {}
			};

			var builder = { };
			fillBuilder(builder, state);
			addItemsAdd(builder, state);
			addVisible(builder, state);
			return builder;
		}

		/**
		 * @param {String} title
		 * @returns {ItemsBuilder}
		 */
		function panel(title) {
			/** @type {QlikPropertyDefinition} */
			var state = {
				type: 'items',
				label: title,
				items: {}
			};

			var builder = { };
			fillBuilder(builder, state);
			addItemsAdd(builder, state);
			addVisible(builder, state);
			return builder;
		}

		/**
		 * @param {Builder} builder 
		 * @param {QlikPropertyDefinition} definition 
		 */
		function addItemsAdd(builder, definition) {
			builder.add = function (property) {
				// Автогенерация названия для свойства 
				var key = 0;
				// eslint-disable-next-line no-unused-vars
				for (var _ in definition.items) {
					key += 1;
				}

				// Для построителя
				if (typeof(property) === 'object' &&
					typeof(property.build) === 'function') {
					// Построить определение свойства
					property = property.build();
				}

				definition.items[key] = property;
				
				return builder;
			};
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
 * @property {function(...String): ArrayBuilder} array
 * @property {function(...String): ColorBuilder} color
 * @property {function(...String): PaletteBuilder} palette
 * @property {function(String): Builder} label
 * @property {function(): ItemsBuilder} accordion
 * @property {ColumnsBuilderFunction} dimensions
 * @property {ColumnsBuilderFunction} measures
 * @property {function(): ItemsBuilder} sorting
 * @property {function(): ItemsBuilder} settings
 * @property {TitledItemsBuilderFunction} section
 * @property {TitledItemsBuilderFunction} panel
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
 * @typedef {Object} ArrayBuilder
 * @property {function(): QlikPropertyDefinition} build
 * @property {function(String): ArrayBuilder} title
 * @property {function(Boolean|VisibleCallbackFunction): ArrayBuilder} visible
 * @property {ArrayAddPropertyFunction} add
 * @property {ArrayItemTitleSetterFunction} itemTitle
 * @property {ArrayItemTitlePropertyNameSetterFunction} itemTitlePropertyName
 * @property {ArrayModifiableSetterFunction} modifiable
 * @property {ArrayOrderableSetterFunction} orderable
 * @property {ArrayMaxCountSetterFunction} maxCount
 */

 /**
 * @callback ArrayAddPropertyFunction
 * @param {QlikPropertyDefinition|PropertyBuilder} item
 * @returns {ArrayBuilder}
 */
 
/**
 * @callback ArrayItemTitleSetterFunction
 * @param {String | GetArrayItemTitleFunction} title
 * @returns {ArrayBuilder}
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
 * @returns {ArrayBuilder}
 */

/**
 * @callback ArrayModifiableSetterFunction
 * @param {Boolean} isModifiable
 * @param {String} additionTitle
 * @returns {ArrayBuilder}
 */

/**
 * @callback ArrayOrderableSetterFunction
 * @param {Boolean} isOrderable
 * @returns {ArrayBuilder}
 */

/**
 * @callback ArrayMaxCountSetterFunction
 * @param {Number} maxCount
 * @returns {ArrayBuilder}
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
 * @typedef {Object} PaletteBuilder
 * @property {function(String): PaletteBuilder} title
 * @property {function(Boolean|VisibleCallbackFunction): PaletteBuilder} visible
 * @property {function(String): PaletteBuilder} default
 * @property {function(): PalettePickerBuilder} picker
 * @property {function(): PaletteComboBoxBuilder} comboBox
 */

/**
 * @typedef {Object} PalettePickerBuilder
 * @property {function(String): PalettePickerBuilder} title
 * @property {function(Boolean|VisibleCallbackFunction): PalettePickerBuilder} visible
 * @property {function(String): PalettePickerBuilder} default
 * @property {function(QlikTheme): PalettePickerBuilder} fillFromTheme
 * @property {function(PaletteOption): PalettePickerBuilder} add
 */

/**
 * @typedef {Object} PaletteOption
 * @property {String} title
 * @property {String} id
 * @property {Color[]} colors
 * @property {Boolean} isContinuous
 */

/**
 * @typedef {Object} PaletteComboBoxBuilder
 * @property {function(String): PaletteComboBoxBuilder} title
 * @property {function(Boolean|VisibleCallbackFunction): PaletteComboBoxBuilder} visible
 * @property {function(String): PaletteComboBoxBuilder} default
 * @property {function(QlikTheme): PaletteComboBoxBuilder} fillFromTheme
 * @property {function(String, String): PaletteComboBoxBuilder} add
 */

/**
 * @callback ColumnsBuilderFunction
 * @param {Number} minCount Минимальное число измерений
 * @param {Number} maxCount Максимальное число измерений
 * @returns {ItemsBuilder} Построитель набора элементов
 */

/** 
 * @callback VisibleCallbackFunction
 * @param {*} context
 * @returns {Boolean | Promise<Boolean>}
*/

/**
 * @callback TitledItemsBuilderFunction
 * @param {String} title
 * @returns {ItemsBuilder}
 */

/**
 * @typedef {Object} ItemsBuilder
 * @property {function(): QlikPropertyDefinition} build
 * @property {function(QlikPropertyDefinition): ItemsBuilder} add
 * @property {function(Boolean|VisibleCallbackFunction): ItemsBuilder} visible
 */

/**
 * @typedef {Object} Builder
 * @property {function(): QlikPropertyDefinition} build
 */