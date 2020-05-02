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
			dimensionsSection: dimensionsSection,
			measuresSection: measures,
			sortingSection: sorting,
			appearanceSection: settings,
			section: section,
			panel: panel
		};

		/**
		 * Создаёт логическое свойство
		 * @param {...String} propertyPath Путь к свойству
		 * @returns {BooleanBuilder} Построитель свойства
		 */
		function boolean(propertyPath) {
			propertyPath = Array.prototype.slice.call(arguments);

			/** @type {QlikPropertyDefinition} */
			var definition = {
				ref: combinePath(propertyPath),
				type: 'boolean'
			};

			return {
				build: builderBuild(definition),
				default: setPropertyDefault(definition),
				title: setPropertyTitle(definition),
				visible: setPropertyVisible(definition),
				checkBox: toBooleanCheckBox(definition),
				switch: toBooleanSwitch(definition)
			};
		}

		/**
		 * @param {QlikPropertyDefinition} definition 
		 */
		function toBooleanCheckBox(definition) {
			return function () {
				delete definition.component;
				return {
					build: builderBuild(definition),
					default: setPropertyDefault(definition),
					title: setPropertyTitle(definition),
					visible: setPropertyVisible(definition)
				};
			};
		}
		
		/**
		 * @param {QlikPropertyDefinition} definition 
		 */
		function toBooleanSwitch(definition) {
			return function () {
				definition.component = 'switch';
				return {
					build: builderBuild(definition),
					default: setPropertyDefault(definition),
					title: setPropertyTitle(definition),
					visible: setPropertyVisible(definition),
					optionTitles: setBooleanSwitchOptionTitles(definition)
				};
			};
		}

		/**
		 * @param {QlikPropertyDefinition} definition 
		 */
		function setBooleanSwitchOptionTitles(definition) {
			return function (trueTitle, falseTitle) {
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
				return this;
			};
		}
	
		/**
		 * Создаёт целочисленное свойство
		 * @param {...String} propertyPath Путь к свойству
		 * @returns {IntegerBuilder} Построитель свойства
		 */
		function integer(propertyPath) {
			propertyPath = Array.prototype.slice.call(arguments);

			/** @type {QlikPropertyDefinition} */
			var definition = {
				ref: combinePath(propertyPath),
				type: 'integer'
			};

			return {
				build: builderBuild(definition),
				default: setPropertyDefault(definition),
				title: setPropertyTitle(definition),
				visible: setPropertyVisible(definition),
				range: setRange(definition),
				editBox: toIntegerEditBox(definition),
				slider: toIntegerSlider(definition)
			};
		}

		/**
		 * @param {QlikPropertyDefinition} definition 
		 */
		function toIntegerEditBox(definition) {
			return function() {
				delete definition.component;
				return {
					build: builderBuild(definition),
					default: setPropertyDefault(definition),
					title: setPropertyTitle(definition),
					visible: setPropertyVisible(definition),
					range: setRange(definition)
				};
			};
		}

		/**
		 * @param {QlikPropertyDefinition} definition 
		 */
		function toIntegerSlider(definition) {
			return function() {
				definition.component = 'slider';
				return {
					build: builderBuild(definition),
					default: setPropertyDefault(definition),
					title: setPropertyTitle(definition),
					visible: setPropertyVisible(definition),
					range: setRange(definition),
					step: setIntegerSliderStep(definition)
				};
			};
		}

		/**
		 * @param {QlikPropertyDefinition} definition 
		 */
		function setIntegerSliderStep(definition) {
			return function (stepValue) {
				definition.step = Math.max(Math.round(stepValue), 1);
				return this;
			};
		}

		/**
		 * Создаёт вещественное числовое свойство
		 * @param {...String} propertyPath Путь к свойству
		 * @returns {NumberBuilder} Построитель свойства
		 */
		function number(propertyPath) {
			propertyPath = Array.prototype.slice.call(arguments);

			/** @type {QlikPropertyDefinition} */
			var definition = {
				ref: combinePath(propertyPath),
				type: 'number'
			};

			return {
				build: builderBuild(definition),
				default: setPropertyDefault(definition),
				title: setPropertyTitle(definition),
				visible: setPropertyVisible(definition),
				range: setRange(definition),
				editBox: toNumberEditBox(definition),
				slider: toNumberSlider(definition),
				expressionBox: setNumberExpressionBox(definition)
			};
		}
		
		/**
		 * @param {QlikPropertyDefinition} definition 
		 */
		function toNumberEditBox(definition) {
			return function() {
				delete definition.component;
				return {
					build: builderBuild(definition),
					default: setPropertyDefault(definition),
					title: setPropertyTitle(definition),
					visible: setPropertyVisible(definition),
					range: setRange(definition)
				};
			};
		}

		/**
		 * @param {QlikPropertyDefinition} definition 
		 */
		function toNumberSlider(definition) {
			return function() {
				definition.component = 'slider';
				definition.type = 'number';
				return {
					build: builderBuild(definition),
					default: setPropertyDefault(definition),
					title: setPropertyTitle(definition),
					visible: setPropertyVisible(definition),
					range: setRange(definition),
					step: setNumberSliderStep(definition)
				};
			};
		}

		/**
		 * @param {QlikPropertyDefinition} definition 
		 */
		function setNumberSliderStep(definition) {
			return function (stepValue) {
				definition.step = stepValue;
				return this;
			};
		}

		/**
		 * @param {QlikPropertyDefinition} definition 
		 */
		function setNumberExpressionBox(definition) {
			return function() {
				delete definition.component;
				definition.expression = 'always';
				return {
					build: builderBuild(definition),
					default: setPropertyDefault(definition),
					title: setPropertyTitle(definition),
					visible: setPropertyVisible(definition),
					optionalExpression: setExpressionBoxOptionalExpression(definition)
				};
			};
		}

		/**
		 * Создаёт строковое свойство
		 * @param {...String} propertyPath Путь к свойству
		 * @returns {StringBuilder} Построитель свойства
		 */
		function string(propertyPath) {
			propertyPath = Array.prototype.slice.call(arguments);

			/** @type {QlikPropertyDefinition} */
			var definition = {
				ref: combinePath(propertyPath),
				type: 'string'
			};

			return {
				build: builderBuild(definition),
				default: setPropertyDefault(definition),
				title: setPropertyTitle(definition),
				visible: setPropertyVisible(definition),
				maxLength: setStringMaxLength(definition),
				editBox: toStringEditBox(definition),
				textArea: toStringTextArea(definition),
				expressionBox: toStringExpressionBox(definition)
			};
		}

		/**
		 * @param {QlikPropertyDefinition} definition 
		 */
		function setStringMaxLength(definition) {
			return function (maxLength) {
				definition.maxLength = maxLength;
				return this;
			};
		}

		/**
		 * @param {QlikPropertyDefinition} definition 
		 */
		function toStringEditBox(definition) {
			return function () {
				delete definition.component;
				return {
					build: builderBuild(definition),
					default: setPropertyDefault(definition),
					title: setPropertyTitle(definition),
					visible: setPropertyVisible(definition),
					maxLength: setStringMaxLength(definition)
				};
			};
		}

		/**
		 * @param {QlikPropertyDefinition} definition 
		 */
		function toStringTextArea(definition) {
			return function () {
				definition.component = 'textarea';
				return {
					build: builderBuild(definition),
					default: setPropertyDefault(definition),
					title: setPropertyTitle(definition),
					visible: setPropertyVisible(definition),
					maxLength: setStringMaxLength(definition),
					rowCount: setStringTextAreaRowCount(definition)
				};
			};
		}

		/**
		 * @param {QlikPropertyDefinition} definition 
		 */
		function setStringTextAreaRowCount(definition) {
			return function (rowCount) {
				definition.rowCount = rowCount;
				return this;
			};
		}

		/**
		 * @param {QlikPropertyDefinition} definition 
		 */
		function toStringExpressionBox(definition) {
			return function() {
				delete definition.component;
				definition.expression = 'always';
				return {
					build: builderBuild(definition),
					default: setPropertyDefault(definition),
					title: setPropertyTitle(definition),
					visible: setPropertyVisible(definition),
					optionalExpression: setExpressionBoxOptionalExpression(definition)
				};
			};
		}

		/**
		 * @param {QlikPropertyDefinition} definition 
		 */
		function setExpressionBoxOptionalExpression(definition) {
			return function(isOptional) {
				definition.expression = isOptional ? 'optional' : 'always';
				return this;
			};
		}

		/**
		 * Создаёт перечислимое свойство
		 * @param {...String} propertyPath Путь к свойству
		 * @returns {EnumBuilder} Построитель свойства
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

			return {
				build: builderBuild(definition),
				default: setPropertyDefault(definition),
				title: setPropertyTitle(definition),
				visible: setPropertyVisible(definition),
				add: enumAddOption(definition),
				comboBox: toEnumComboBox(definition),
				radioButtons: addEnumRadioButtons(definition),
				buttons: addEnumButtons(definition)
			};
		}
		
		/**
		 * @param {QlikPropertyDefinition} definition 
		 */
		function enumAddOption(definition) {
			return function (value, title, isDefault) {
				var option = {
					value: value,
					label: title
				};
				definition.options.push(option);

				if (isDefault) {
					definition.defaultValue = value;
				}
				return this;
			};
		}

		/**
		 * @param {QlikPropertyDefinition} definition 
		 */
		function toEnumComboBox(definition) {
			return function () {
				definition.component = 'dropdown';
				return {
					build: builderBuild(definition),
					default: setPropertyDefault(definition),
					title: setPropertyTitle(definition),
					visible: setPropertyVisible(definition),
					add: enumAddOption(definition)
				};
			};
		}

		/**
		 * @param {QlikPropertyDefinition} definition 
		 */
		function addEnumRadioButtons(definition) {
			return function () {
				definition.component = 'radiobuttons';
				return {
					build: builderBuild(definition),
					default: setPropertyDefault(definition),
					title: setPropertyTitle(definition),
					visible: setPropertyVisible(definition),
					add: enumAddOption(definition)
				};
			};
		}

		/**
		 * @param {QlikPropertyDefinition} definition 
		 */
		function addEnumButtons(definition) {
			return function () {
				definition.component = 'dropdown';
				return {
					build: builderBuild(definition),
					default: setPropertyDefault(definition),
					title: setPropertyTitle(definition),
					visible: setPropertyVisible(definition),
					add: enumAddOption(definition)
				};
			};
		}

		/**
		 * Создаёт свойство-массив
		 * @param {...String} propertyPath Путь к свойству
		 * @returns {ArrayBuilder} Построитель свойства
		 */
		function array(propertyPath) {
			propertyPath = Array.prototype.slice.call(arguments);

			/** @type {QlikPropertyDefinition} */
			var definition = {
				ref: combinePath(propertyPath),
				type: 'array',
				items: { }
			};

			return {
				build: builderBuild(definition),
				default: setPropertyDefault(definition),
				title: setPropertyTitle(definition),
				visible: setPropertyVisible(definition),
				add: addItemsAdd(definition),
				itemTitle: setArrayItemTitle(definition),
				itemTitlePropertyName: setArrayItemTitlePropertyName(definition),
				modifiable: setArrayModifiable(definition),
				orderable: setArrayOrderable(definition),
				maxCount: setArrayMaxCount(definition)
			};
		}

		/**
		 * @param {QlikPropertyDefinition} definition 
		 */
		function setArrayItemTitle(definition) {
			return function (title) {
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
				return this;
			};
		}
		
		/**
		 * @param {QlikPropertyDefinition} definition 
		 */
		function setArrayItemTitlePropertyName(definition) {
			return function (itemPropertyName) {
				definition.itemTitleRef = itemPropertyName;
				return this;
			};
		}

		/**
		 * @param {QlikPropertyDefinition} definition 
		 */
		function setArrayModifiable(definition) {
			return function (isModifiable, additionTitle) {
				definition.allowAdd = isModifiable;
				definition.allowRemove = isModifiable;
				if (isModifiable) {
					definition.addTranslation = additionTitle;
				}
				return this;
			};
		}
		
		/**
		 * @param {QlikPropertyDefinition} definition 
		 */
		function setArrayOrderable(definition) {
			return function (isOrderable) {
				definition.allowMove = isOrderable;
				return this;
			};
		}

		/**
		 * @param {QlikPropertyDefinition} definition 
		 */
		function setArrayMaxCount(definition) {
			return function (maxCount) {
				definition.max = maxCount;
				return this;
			};
		}

		/**
		 * Создаёт свойство-цвет
		 * @param {...String} propertyPath Путь к свойству
		 * @returns {ColorBuilder} Построитель свойства
		 */
		function color(propertyPath) {
			propertyPath = Array.prototype.slice.call(arguments);

			/** @type {QlikPropertyDefinition} */
			var definition = {
				ref: combinePath(propertyPath)
			};

			return {
				// NOTE: Свойство не готово к построению до выбора типа интерфейса
				default: setPropertyDefault(definition),
				title: setPropertyTitle(definition),
				visible: setPropertyVisible(definition),
				picker: addColorPicker(definition),
				editBox: addColorEditBox(definition),
				expressionBox: addColorExpressionBox(definition)
			};
		}

		/**
		 * @param {QlikPropertyDefinition} definition 
		 */
		function addColorPicker(definition) {
			return function(allowCustomColor) {
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

				return {
					build: builderBuild(definition),
					default: setPropertyDefault(definition), // TODO: Проверить правильность работы
					title: setPropertyTitle(definition),
					visible: setPropertyVisible(definition)
				};
			};
		}

		/**
		 * @param {QlikPropertyDefinition} definition 
		 */
		function addColorEditBox(definition) {
			return function() {
				definition.ref = combinePath([definition.ref, 'color']);
				definition.type = 'string';

				return {
					build: builderBuild(definition),
					default: setPropertyDefault(definition),
					title: setPropertyTitle(definition),
					visible: setPropertyVisible(definition)
				};
			};
		}

		/**
		 * @param {QlikPropertyDefinition} definition 
		 */
		function addColorExpressionBox(definition) {
			return function() {
				definition.ref = combinePath([definition.ref, 'color']);
				definition.type = 'string';
				definition.expression = 'always';

				return {
					build: builderBuild(definition),
					default: setPropertyDefault(definition),
					title: setPropertyTitle(definition),
					visible: setPropertyVisible(definition),
					optionalExpression: setExpressionBoxOptionalExpression(definition)
				};
			};
		}

		/**
		 * Создаёт свойство-палитру
		 * @param {...String} propertyPath Путь к свойству
		 * @returns {PaletteBuilder} Построитель свойства
		 */
		function palette(propertyPath) {
			propertyPath = Array.prototype.slice.call(arguments);

			/** @type {QlikPropertyDefinition} */
			var definition = {
				ref: combinePath(propertyPath),
				type: 'string'
			};

			return {
				// NOTE: Свойство не готово к построению до выбора типа интерфейса
				default: setPropertyDefault(definition),
				title: setPropertyTitle(definition),
				visible: setPropertyVisible(definition),
				picker: addPalettePicker(definition),
				comboBox: addPaletteComboBox(definition)
			};
		}

		/**
		 * @param {QlikPropertyDefinition} definition 
		 */
		function addPalettePicker(definition) {
			return function() {
				definition.type = 'items';
				definition.component = 'item-selection-list';
				definition.horizontal = false;
				definition.items = [];
				
				return {
					build: builderBuild(definition),
					default: setPropertyDefault(definition),
					title: setPropertyTitle(definition),
					visible: setPropertyVisible(definition),
					add: addPaletteAdd(definition),
					addFromTheme: addPalettePickerAddFromTheme(definition)
				};
			};
		}

		/**
		 * @param {QlikPropertyDefinition} definition 
		 */
		function addPaletteAdd(definition) {
			return function (paletteOption) {
				var palette = getPalettePickerDefinition(paletteOption);
				definition.items = definition.items.concat([palette]);
				return this;
			};
		}

		/**
		 * @param {QlikPropertyDefinition} definition 
		 */
		function addPalettePickerAddFromTheme(definition) {
			return function (qlikTheme) {
				var palettes = getPalettesOptions(qlikTheme)
					.map(getPalettePickerDefinition);
				definition.items = definition.items.concat(palettes);
				return this;
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
		 * @param {QlikPropertyDefinition} definition 
		 */
		function addPaletteComboBox(definition) {
			return function() {
				definition.type = 'string';
				definition.component = 'dropdown';
				definition.options = [];

				return {
					build: builderBuild(definition),
					default: setPropertyDefault(definition),
					title: setPropertyTitle(definition),
					visible: setPropertyVisible(definition),
					add: addPaletteComboBoxAdd(definition),
					addFromTheme: addPaletteComboBoxAddFromTheme(definition)
				};
			};
		}
		
		/**
		 * @param {QlikPropertyDefinition} definition 
		 */
		function addPaletteComboBoxAddFromTheme(definition) {
			return function (qlikTheme) {
				var palettes = getPalettesOptions(qlikTheme)
					.map(getPaletteComboBoxOption);
				definition.options = definition.options.concat(palettes);
				return this;
			};
		}
		
		/**
		 * @param {QlikPropertyDefinition} definition 
		 */
		function addPaletteComboBoxAdd(definition) {
			return function (id, title) {
				var option = {
					value: id,
					label: title
				};
				definition.options = definition.options.concat([option]);
				return this;
			};
		}

		/**
		 * @param {PaletteOption} paletteOption 
		 * @returns {QlikPropertyOption}
		 */
		function getPaletteComboBoxOption(paletteOption) {
			return {
				value: paletteOption.id,
				label: paletteOption.title
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
		 * @param {QlikPropertyDefinition} definition 
		 */
		function setPropertyDefault(definition) {
			return function (defaultValue) {
				definition.defaultValue = defaultValue;
				return this;
			};
		}

		/**
		 * @param {QlikPropertyDefinition} definition 
		 */
		function setPropertyTitle(definition) {
			return function (title) {
				definition.label = title;
				return this;
			};
		}

		/**
		 * @param {QlikPropertyDefinition} definition 
		 */
		function setPropertyVisible(definition) {
			return function (visibility) {
				definition.show = visibility;
				return this;
			};
		}

		/**
		 * @param {QlikPropertyDefinition} definition 
		 */
		function setRange(definition) {
			return function(minValue, maxValue) {
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

				return this;
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

			return {
				build: builderBuild(definition)
			};
		}

		/**
		 * @param {QlikPropertyDefinition} definition 
		 */
		function builderBuild(definition) {
			return function () {
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
			var definition = {
				type: 'items',
				component: 'accordion',
				items: {}
			};

			return {
				build: builderBuild(definition),
				add: addItemsAdd(definition)
			};
		}

		/**
		 * @returns {ItemsBuilder}
		 */
		function dimensionsSection(minCount, maxCount) {
			/** @type {QlikPropertyDefinition} */
			var definition = {
				uses: 'dimensions',
				min: minCount,
				max: maxCount,
				items: {}
			};

			return {
				build: builderBuild(definition),
				add: addItemsAdd(definition)
			};
		}

		/**
		 * @returns {ItemsBuilder}
		 */
		function measures(minCount, maxCount) {
			/** @type {QlikPropertyDefinition} */
			var definition = {
				uses: 'measures',
				min: minCount,
				max: maxCount,
				items: {}
			};

			return {
				build: builderBuild(definition),
				add: addItemsAdd(definition)
			};
		}

		/**
		 * @returns {ItemsBuilder}
		 */
		function sorting() {
			/** @type {QlikPropertyDefinition} */
			var definition = {
				uses: 'sorting',
				items: {}
			};

			return {
				build: builderBuild(definition),
				add: addItemsAdd(definition)
			};
		}

		/**
		 * @returns {ItemsBuilder}
		 */
		function settings() {
			/** @type {QlikPropertyDefinition} */
			var definition = {
				uses: 'settings',
				items: {}
			};

			return {
				build: builderBuild(definition),
				add: addItemsAdd(definition)
			};
		}

		/**
		 * @param {String} title
		 * @returns {ItemsBuilder}
		 */
		function section(title) {
			/** @type {QlikPropertyDefinition} */
			var definition = {
				type: 'items',
				component: 'expandable-items',
				label: title,
				items: {}
			};

			return {
				build: builderBuild(definition),
				add: addItemsAdd(definition),
				visible: setPropertyVisible(definition)
			};
		}

		/**
		 * @param {String} title
		 * @returns {ItemsBuilder}
		 */
		function panel(title) {
			/** @type {QlikPropertyDefinition} */
			var definition = {
				type: 'items',
				label: title,
				items: {}
			};

			return {
				build: builderBuild(definition),
				add: addItemsAdd(definition),
				visible: setPropertyVisible(definition)
			};
		}

		/**
		 * @param {QlikPropertyDefinition} definition 
		 */
		function addItemsAdd(definition) {
			return function (property) {
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
				
				return this;
			};
		}

	}
);

/**
 * Фабрика свойств
 * @typedef {Object} PropertyFactory
 * @property {function(...String): BooleanBuilder} boolean Логическое свойство
 * @property {function(...String): IntegerBuilder} integer Целочисленое свойство
 * @property {function(...String): NumberBuilder} number Вещественное числовое свойство
 * @property {function(...String): StringBuilder} string Строковое свойство
 * @property {function(...String): EnumBuilder} enumeration Перечислимое свойство
 * @property {function(...String): ArrayBuilder} array Свойство-массив
 * @property {function(...String): ColorBuilder} color Свойство-цвет
 * @property {function(...String): PaletteBuilder} palette Свойство-палитра
 * @property {function(String): Builder} label Текстовая метка
 * @property {function(): ItemsBuilder} accordion Панель-аккордион
 * @property {ColumnsBuilderFunction} dimensionsSection Стандартная секция измерений
 * @property {ColumnsBuilderFunction} measuresSection Стандартная секция мер
 * @property {function(): ItemsBuilder} sortingSection Стандартная секция сортировки
 * @property {function(): ItemsBuilder} appearanceSection Стандартная секция представления
 * @property {TitledItemsBuilderFunction} section Секция
 * @property {TitledItemsBuilderFunction} panel Панель элементов
 */

/**
 * Логическое свойство
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
 * Целочисленое свойство
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
 * Вещественное числовое свойство
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
 * Строковое свойство
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
 * Перечислимое свойство
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
 * Свойство-массив
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
 * Свойство-цвет
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
 * Свойство-палитра
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
 * @property {function(QlikTheme): PalettePickerBuilder} addFromTheme
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
 * @property {function(QlikTheme): PaletteComboBoxBuilder} addFromTheme
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
 * Набор элементов
 * @typedef {Object} ItemsBuilder
 * @property {function(): QlikPropertyDefinition} build
 * @property {function(QlikPropertyDefinition): ItemsBuilder} add
 * @property {function(Boolean|VisibleCallbackFunction): ItemsBuilder} visible
 */

/**
 * @typedef {Object} Builder
 * @property {function(): QlikPropertyDefinition} build
 */