/* eslint-disable no-invalid-this */
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
			// Поля
			boolean: boolean,
			integer: integer,
			number: number,
			string: string,
			enumeration: enumeration,
			array: array,
			color: color,
			palette: palette,
			label: label,
			// Контейнеры
			accordion: accordion,
			dimensionsSection: dimensionsSection,
			measuresSection: measures,
			sortingSection: sorting,
			appearanceSection: settings,
			section: section,
			panel: panel
		};

		// Поля ---------------------------------------------------------------

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
				default: setPropertyDefaultValue(definition),
				title: setPropertyTitle(definition),
				visible: setPropertyVisible(definition),
				checkBox: toBooleanCheckBox(definition),
				switch: toBooleanSwitch(definition)
			};
		}

		/**
		 * Создаёт логическое свойство c интерфейсом галочки
		 * @param {QlikPropertyDefinition} definition Определение свойства
		 * @returns {function(): CheckBoxBuilder} Построитель свойства
		 */
		function toBooleanCheckBox(definition) {
			return function () {
				delete definition.component;
				return {
					build: builderBuild(definition),
					default: setPropertyDefaultValue(definition),
					title: setPropertyTitle(definition),
					visible: setPropertyVisible(definition)
				};
			};
		}
		
		/**
		 * Создаёт логическое свойство c интерфейсом переключателя
		 * @param {QlikPropertyDefinition} definition Определение свойства
		 * @returns {function(): BooleanSwitchBuilder} Построитель свойства
		 */
		function toBooleanSwitch(definition) {
			return function () {
				definition.component = 'switch';
				return {
					build: builderBuild(definition),
					default: setPropertyDefaultValue(definition),
					title: setPropertyTitle(definition),
					visible: setPropertyVisible(definition),
					optionTitles: setBooleanSwitchOptionTitles(definition)
				};
			};
		}

		/**
		 * Устанавливает отображаемые названия состояний переключателя
		 * @param {QlikPropertyDefinition} definition Изменяемое определение свойства
		 * @return {function(String, String): *} Фунция установки
		 */
		function setBooleanSwitchOptionTitles(definition) {
			return function (trueTitle, falseTitle) {
				definition.options = [
					// Включённый переключатель
					{
						value: true,
						label: trueTitle
					},
					// Выключенный переключатель
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
				default: setPropertyDefaultValue(definition),
				title: setPropertyTitle(definition),
				visible: setPropertyVisible(definition),
				range: setRange(definition),
				editBox: toIntegerEditBox(definition),
				slider: toIntegerSlider(definition)
			};
		}

		/**
		 * Создаёт целочисленное свойство c интерфейсом поля ввода
		 * @param {QlikPropertyDefinition} definition Определение свойства
		 * @returns {function(): IntegerEditBoxBuilder} Построитель свойства
		 */
		function toIntegerEditBox(definition) {
			return function() {
				delete definition.component;
				return {
					build: builderBuild(definition),
					default: setPropertyDefaultValue(definition),
					title: setPropertyTitle(definition),
					visible: setPropertyVisible(definition),
					range: setRange(definition)
				};
			};
		}

		/**
		 * Создаёт целочисленное свойство c интерфейсом слайдера
		 * @param {QlikPropertyDefinition} definition Определение свойства
		 * @returns {function(): IntegerSliderBuilder} Построитель свойства
		 */
		function toIntegerSlider(definition) {
			return function() {
				definition.component = 'slider';
				return {
					build: builderBuild(definition),
					default: setPropertyDefaultValue(definition),
					title: setPropertyTitle(definition),
					visible: setPropertyVisible(definition),
					range: setRange(definition),
					step: setIntegerSliderStep(definition)
				};
			};
		}

		/**
		 * Устанавливает шаг изменения значения свойства
		 * @param {QlikPropertyDefinition} definition Изменяемое определение свойства
		 * @return {function(Number): *} Фунция установки
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
				default: setPropertyDefaultValue(definition),
				title: setPropertyTitle(definition),
				visible: setPropertyVisible(definition),
				range: setRange(definition),
				editBox: toNumberEditBox(definition),
				slider: toNumberSlider(definition)
			};
		}
		
		/**
		 * Создаёт вещественное числовое свойство c интерфейсом поля ввода
		 * @param {QlikPropertyDefinition} definition Определение свойства
		 * @returns {function(): NumberEditBoxBuilder} Построитель свойства
		 */
		function toNumberEditBox(definition) {
			return function() {
				delete definition.component;
				return {
					build: builderBuild(definition),
					default: setPropertyDefaultValue(definition),
					title: setPropertyTitle(definition),
					visible: setPropertyVisible(definition),
					range: setRange(definition),
					useExpression: setUseExpression(definition)
				};
			};
		}

		/**
		 * Создаёт вещественное числовое свойство c интерфейсом слайдера
		 * @param {QlikPropertyDefinition} definition Определение свойства
		 * @returns {function(): NumberSliderBuilder} Построитель свойства
		 */
		function toNumberSlider(definition) {
			return function() {
				definition.component = 'slider';
				definition.type = 'number';
				return {
					build: builderBuild(definition),
					default: setPropertyDefaultValue(definition),
					title: setPropertyTitle(definition),
					visible: setPropertyVisible(definition),
					range: setRange(definition),
					step: setNumberSliderStep(definition)
				};
			};
		}

		/**
		 * Устанавливает шаг изменения значения свойства
		 * @param {QlikPropertyDefinition} definition Изменяемое определение свойства
		 * @return {function(Number): *} Фунция установки
		 */
		function setNumberSliderStep(definition) {
			return function (stepValue) {
				definition.step = stepValue;
				return this;
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
				default: setPropertyDefaultValue(definition),
				title: setPropertyTitle(definition),
				visible: setPropertyVisible(definition),
				maxLength: setStringMaxLength(definition),
				editBox: toStringEditBox(definition),
				textArea: toStringTextArea(definition)
			};
		}

		/**
		 * Устанавливает максимальную длину значения свойства
		 * @param {QlikPropertyDefinition} definition Изменяемое определение свойства
		 * @return {function(Number): *} Фунция установки
		 */
		function setStringMaxLength(definition) {
			return function (maxLength) {
				definition.maxLength = maxLength;
				return this;
			};
		}

		/**
		 * Создаёт строковое свойство c интерфейсом поля ввода
		 * @param {QlikPropertyDefinition} definition Определение свойства
		 * @returns {function(): StringEditBoxBuilder} Построитель свойства
		 */
		function toStringEditBox(definition) {
			return function () {
				delete definition.component;
				return {
					build: builderBuild(definition),
					default: setPropertyDefaultValue(definition),
					title: setPropertyTitle(definition),
					visible: setPropertyVisible(definition),
					maxLength: setStringMaxLength(definition),
					useExpression: setUseExpression(definition)
				};
			};
		}

		/**
		 * Создаёт строковое свойство c интерфейсом многострочного поля ввода
		 * @param {QlikPropertyDefinition} definition Определение свойства
		 * @returns {function(): StringTextAreaBuilder} Построитель свойства
		 */
		function toStringTextArea(definition) {
			return function () {
				definition.component = 'textarea';
				return {
					build: builderBuild(definition),
					default: setPropertyDefaultValue(definition),
					title: setPropertyTitle(definition),
					visible: setPropertyVisible(definition),
					maxLength: setStringMaxLength(definition),
					rowCount: setStringTextAreaRowCount(definition)
				};
			};
		}

		/**
		 * Устанавливает количество строк в поле для свойства
		 * @param {QlikPropertyDefinition} definition Изменяемое определение свойства
		 * @return {function(Number): *} Фунция установки
		 */
		function setStringTextAreaRowCount(definition) {
			return function (rowCount) {
				definition.rowCount = rowCount;
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
				default: setPropertyDefaultValue(definition),
				title: setPropertyTitle(definition),
				visible: setPropertyVisible(definition),
				add: addEnumOption(definition),
				comboBox: toEnumComboBox(definition),
				radioButtons: toEnumRadioButtons(definition),
				buttons: toEnumButtons(definition)
			};
		}
		
		/**
		 * Добавляет опцию выбора для перечислисого свойства
		 * @param {QlikPropertyDefinition} definition Изменяемое определение свойства
		 * @return {function(*, String, Boolean=): *} Фунция добавления
		 */
		function addEnumOption(definition) {
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
		 * Создаёт перечислимое свойство c интерфейсом выпадающего списка
		 * @param {QlikPropertyDefinition} definition Определение свойства
		 * @returns {function(): EnumUiBuilder} Построитель свойства
		 */
		function toEnumComboBox(definition) {
			return function () {
				definition.component = 'dropdown';
				return {
					build: builderBuild(definition),
					default: setPropertyDefaultValue(definition),
					title: setPropertyTitle(definition),
					visible: setPropertyVisible(definition),
					add: addEnumOption(definition)
				};
			};
		}

		/**
		 * Создаёт перечислимое свойство c интерфейсом набора переключатей
		 * @param {QlikPropertyDefinition} definition Определение свойства
		 * @returns {function(): EnumUiBuilder} Построитель свойства
		 */
		function toEnumRadioButtons(definition) {
			return function () {
				definition.component = 'radiobuttons';
				return {
					build: builderBuild(definition),
					default: setPropertyDefaultValue(definition),
					title: setPropertyTitle(definition),
					visible: setPropertyVisible(definition),
					add: addEnumOption(definition)
				};
			};
		}

		/**
		 * Создаёт перечислимое свойство c интерфейсом набора кнопок
		 * @param {QlikPropertyDefinition} definition Определение свойства
		 * @returns {function(): EnumUiBuilder} Построитель свойства
		 */
		function toEnumButtons(definition) {
			return function () {
				definition.component = 'dropdown';
				return {
					build: builderBuild(definition),
					default: setPropertyDefaultValue(definition),
					title: setPropertyTitle(definition),
					visible: setPropertyVisible(definition),
					add: addEnumOption(definition)
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
				title: setPropertyTitle(definition),
				visible: setPropertyVisible(definition),
				add: addItem(definition),
				itemTitle: setArrayItemTitle(definition),
				itemTitlePropertyName: setArrayItemTitlePropertyName(definition),
				modifiable: setArrayModifiable(definition),
				orderable: setArrayOrderable(definition),
				maxCount: setArrayMaxCount(definition)
			};
		}

		/**
		 * Устанавливает название элемента массива
		 * @param {QlikPropertyDefinition} definition Изменяемое определение свойства
		 * @return {function(String | GetArrayItemTitleFunction): *} Фунция установки
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
		 * Устанавливает название элемента массива, используя название одного из свойств
		 * @param {QlikPropertyDefinition} definition Изменяемое определение свойства
		 * @return {function(String): *} Фунция установки
		 */
		function setArrayItemTitlePropertyName(definition) {
			return function (itemPropertyName) {
				definition.itemTitleRef = itemPropertyName;
				return this;
			};
		}

		/**
		 * Устанавливает признак изменяемости массива
		 * @param {QlikPropertyDefinition} definition Изменяемое определение свойства
		 * @return {function(Boolean): *} Фунция установки
		 */
		function setArrayModifiable(definition) {
			return function (isModifiable, additionTitle) {
				definition.allowAdd = isModifiable;
				definition.allowRemove = isModifiable;
				if (isModifiable && additionTitle != null && additionTitle != '') {
					definition.addTranslation = additionTitle;
				}
				return this;
			};
		}
		
		/**
		 * Устанавливает признак упорядочиваемости массива
		 * @param {QlikPropertyDefinition} definition Изменяемое определение свойства
		 * @return {function(Boolean): *} Фунция установки
		 */
		function setArrayOrderable(definition) {
			return function (isOrderable) {
				definition.allowMove = isOrderable;
				return this;
			};
		}

		/**
		 * Устанавливает ограничение размера массива
		 * @param {QlikPropertyDefinition} definition Изменяемое определение свойства
		 * @return {function(Number): *} Фунция установки
		 */
		function setArrayMaxCount(definition) {
			return function (maxCount) {
				definition.max = maxCount;
				return this;
			};
		}

		/**
		 * Создаёт цветовое свойство
		 * @param {...String} propertyPath Путь к свойству
		 * @returns {ColorBuilder} Построитель свойства
		 */
		function color(propertyPath) {
			propertyPath = Array.prototype.slice.call(arguments);

			var path = combinePath(propertyPath);

			/** @type {QlikPropertyDefinition} */
			var definition = {
				ref: combinePath([path, 'color']),
				type: 'string'
			};

			return {
				build: builderBuild(definition),
				default: setPropertyDefaultValue(definition),
				title: setPropertyTitle(definition),
				visible: setPropertyVisible(definition),
				picker: toColorPicker(definition, path),
				editBox: toColorEditBox(definition, path)
			};
		}

		/**
		 * Создаёт цветовое свойство c интерфейсом выбора из палитры
		 * @param {QlikPropertyDefinition} definition Определение свойства
		 * @returns {function(): ColorPickerBuilder} Построитель свойства
		 */
		function toColorPicker(definition, path) {
			return function() {
				return createCustomColorPicker(definition, path);
			};
		}

		/**
		 * Устанавливает признак использования пользовательских цветов
		 * @param {QlikPropertyDefinition} definition Изменяемое определение свойства
		 * @return {function(Boolean): *} Фунция установки
		 */
		function setUseColorPickerCustomColor(definition, path) {
			return function (useCustomColor) {
				if (useCustomColor || useCustomColor == null || useCustomColor == undefined) {
					if (definition.type === 'object') {
						return this;
					}

					return createCustomColorPicker(definition, path);
				}
				else {
					if (definition.type === 'integer') {
						return this;
					}
					
					return createStandardColorPicker(definition, path);
				}
			};
		}

		/**
		 * Создаёт построитель цветового свойства c интерфейсом выбора из пользовательской палитры
		 * @param {QlikPropertyDefinition} definition Определение свойства
		 * @returns {ColorPickerBuilder} Построитель свойства
		 */
		function createCustomColorPicker(definition, path) {
			definition.component = 'color-picker';
			definition.type = 'object';
			definition.ref = path;

			var setDefault = setCustomColorPickerDefault(definition);
			setDefault(definition.defaultValue);

			return {
				build: builderBuild(definition),
				default: setDefault,
				title: setPropertyTitle(definition),
				visible: setPropertyVisible(definition),
				useCustomColor: setUseColorPickerCustomColor(definition, path)
			};
		}

		/**
		 * Устанавливает значение по умолчанию для выбора пользовательского цвета
		 * @param {QlikPropertyDefinition} definition Изменяемое определение свойства
		 * @return {function(String|Number): *} Фунция установки
		 */
		function setCustomColorPickerDefault(definition) {
			return function (defaultValue) {
				switch (typeof(defaultValue)) {
					case 'number': {
						delete definition.defaultValue;
						definition.defaultValue = {
							index: defaultValue + 1
						};
						break;
					}
					case 'string': {
						definition.defaultValue = {
							index: -1,
							color: defaultValue
						};
						break;
					}
					case 'null':
					case 'undefined':
					default:
						delete definition.defaultValue;
						break;
				}
			};
		}

		/**
		 * Создаёт построитель цветового свойства c интерфейсом выбора из стандартной палитры
		 * @param {QlikPropertyDefinition} definition Определение свойства
		 * @returns {ColorPickerBuilder} Построитель свойства
		 */
		function createStandardColorPicker(definition, path) {
			definition.component = 'color-picker';
			definition.type = 'integer';
			definition.ref = combinePath([path, 'index']);

			var setDefault = setStandardColorPickerDefault(definition);
			setDefault(definition.defaultValue);

			return {
				build: builderBuild(definition),
				default: setDefault,
				title: setPropertyTitle(definition),
				visible: setPropertyVisible(definition),
				useCustomColor: setUseColorPickerCustomColor(definition, path)
			};
		}
		
		/**
		 * Устанавливает значение по умолчанию для выбора стандартного цвета
		 * @param {QlikPropertyDefinition} definition Изменяемое определение свойства
		 * @return {function(Number): *} Фунция установки
		 */
		function setStandardColorPickerDefault(definition) {
			return function (defaultValue) {
				switch (typeof(defaultValue)) {
					case 'number': {
						break;
					}
					case 'object': {
						if (defaultValue.index == null || defaultValue.index == -1) {
							delete definition.defaultValue;
							break;
						}

						definition.defaultValue = defaultValue.index - 1;
						break;
					}
					case 'string':
					case 'null':
					case 'undefined':
					default: {
						delete definition.defaultValue;
						break;
					}
				}
			};
		}

		/**
		 * Создаёт цветовое свойство c интерфейсом поля ввода
		 * @param {QlikPropertyDefinition} definition Определение свойства
		 * @returns {function(): ColorEditBoxBuilder} Построитель свойства
		 */
		function toColorEditBox(definition, path) {
			return function() {
				definition.ref = combinePath([path, 'color']);
				definition.type = 'string';

				return {
					build: builderBuild(definition),
					default: setPropertyDefaultValue(definition),
					title: setPropertyTitle(definition),
					visible: setPropertyVisible(definition),
					useExpression: setUseExpression(definition)
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
				// TODO: Сделать editBox по умолчанию, добавить build()
				default: setPropertyDefaultValue(definition),
				title: setPropertyTitle(definition),
				visible: setPropertyVisible(definition),
				picker: toPalettePicker(definition),
				comboBox: toPaletteComboBox(definition)
			};
		}

		/**
		 * Создаёт свойство выбора палитры c интерфейсом списка
		 * @param {QlikPropertyDefinition} definition Определение свойства
		 * @returns {function(): PalettePickerBuilder} Построитель свойства
		 */
		function toPalettePicker(definition) {
			return function() {
				definition.type = 'items';
				definition.component = 'item-selection-list';
				definition.horizontal = false;
				definition.items = [];
				
				return {
					build: builderBuild(definition),
					default: setPropertyDefaultValue(definition),
					title: setPropertyTitle(definition),
					visible: setPropertyVisible(definition),
					add: addPalettePickerOption(definition),
					addFromTheme: addPalettePickerOptionsFromTheme(definition)
				};
			};
		}

		/**
		 * Добавляет опцию выбора в список палитр
		 * @param {QlikPropertyDefinition} definition Изменяемое определение свойства
		 * @return {function(PaletteInfo): *} Фунция добавления
		 */
		function addPalettePickerOption(definition) {
			return function (paletteInfo) {
				var palette = getPalettePickerOption(paletteInfo);
				definition.items = definition.items.concat([palette]);
				return this;
			};
		}

		/**
		 * Добавляет опции выбора палитр из темы в список палитр
		 * @param {QlikPropertyDefinition} definition Изменяемое определение свойства
		 * @return {function(QlikTheme): *} Фунция добавления
		 */
		function addPalettePickerOptionsFromTheme(definition) {
			return function (qlikTheme) {
				var palettes = getThemePalettesInfo(qlikTheme)
					.map(getPalettePickerOption);
				definition.items = definition.items.concat(palettes);
				return this;
			};
		}

		/**
		 * Создаёт опцию выбора палитры для списка палитр
		 * @param {PaletteInfo} paletteInfo Информация о палитре
		 * @returns {QlikPropertyDefinition} Определение опции выбора
		 */
		function getPalettePickerOption(paletteInfo) {
			return {
				component: 'color-scale',
				type: paletteInfo.isContinuous ? 'gradient' : 'sequential',
				value: paletteInfo.id,
				label: paletteInfo.title,
				colors: paletteInfo.colors,
				icon: ''
			};
		}

		/**
		 * Создаёт свойство выбора палитры c интерфейсом выбора из выпадающего списка
		 * @param {QlikPropertyDefinition} definition Определение свойства
		 * @returns {function(): PalettePickerBuilder} Построитель свойства
		 */
		function toPaletteComboBox(definition) {
			return function() {
				definition.type = 'string';
				definition.component = 'dropdown';
				definition.options = [];

				return {
					build: builderBuild(definition),
					default: setPropertyDefaultValue(definition),
					title: setPropertyTitle(definition),
					visible: setPropertyVisible(definition),
					add: addPaletteComboBoxOption(definition),
					addFromTheme: addPaletteComboBoxOptionsFromTheme(definition)
				};
			};
		}
		
		/**
		 * Добавляет опцию выбора палитры в выпадающей список палитр
		 * @param {QlikPropertyDefinition} definition Изменяемое определение свойства
		 * @return {function(String, String): *} Фунция добавления
		 */
		function addPaletteComboBoxOption(definition) {
			return function (id, title) {
				/** @type {QlikPropertyOption} */
				var option = {
					value: id,
					label: title
				};
				definition.options = definition.options.concat([option]);
				return this;
			};
		}
		
		/**
		 * Добавляет опции палитр из темы в выпадающий список тем
		 * @param {QlikPropertyDefinition} definition Изменяемое определение свойства
		 * @return {function(QlikTheme): *} Фунция добавления
		 */
		function addPaletteComboBoxOptionsFromTheme(definition) {
			return function (qlikTheme) {
				var palettes = getThemePalettesInfo(qlikTheme)
					.map(getPaletteComboBoxOption);
				definition.options = definition.options.concat(palettes);
				return this;
			};
		}

		/**
		 * Создаёт определение опции для выпадающего списка
		 * @param {PaletteInfo} paletteInfo Информация о палитре 
		 * @returns {QlikPropertyOption} Определение опции выбора
		 */
		function getPaletteComboBoxOption(paletteInfo) {
			return {
				value: paletteInfo.id,
				label: paletteInfo.title
			};
		}

		/**
		 * Возвращает список палитр темы
		 * @param {QlikTheme} qlikTheme Тема
		 * @return {PaletteInfo[]} Список палитр
		 */
		function getThemePalettesInfo(qlikTheme) {
			if (qlikTheme == null ||
				qlikTheme.properties == null ||
				qlikTheme.properties.palettes == null ||
				qlikTheme.properties.palettes.data == null) {
				return [];
			}
			return qlikTheme.properties.palettes.data
				.map(getPaletteInfo);
		}

		/**
		 * Возвращает информацию о палитре
		 * @param {QlikPalette} qlikPalette Палитра
		 * @returns {PaletteInfo} Информация
		 */
		function getPaletteInfo(qlikPalette) {
			return {
				id: qlikPalette.propertyValue,
				title: qlikPalette.name,
				colors: getPaletteScale(qlikPalette),
				isContinuous: isPaletteContinuous(qlikPalette)
			};
		}

		/**
		 * Возвращает цветовую шкалу палитры
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
		 * Возвращает признак непрерывной цветовой шкалы
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
		 * Возвращает фунцию установки значения по умолчанию для свойства
		 * @param {QlikPropertyDefinition} definition Изменяемое определение свойства
		 * @return {function(*): *} Фунция установки
		 */
		function setPropertyDefaultValue(definition) {
			return function (defaultValue) {
				definition.defaultValue = defaultValue;
				return this;
			};
		}

		/**
		 * Возвращает фунцию установки заголовка для свойства
		 * @param {QlikPropertyDefinition} definition Изменяемое определение свойства
		 * @return {function(String): *} Фунция установки
		 */
		function setPropertyTitle(definition) {
			return function (title) {
				definition.label = title;
				return this;
			};
		}

		/**
		 * Возвращает фунцию установки видимости для свойства
		 * @param {QlikPropertyDefinition} definition Изменяемое определение свойства
		 * @return {function(Boolean|VisibleCallbackFunction): *} Фунция установки
		 */
		function setPropertyVisible(definition) {
			return function (visibility) {
				definition.show = visibility;
				return this;
			};
		}

		/**
		 * Возвращает фунцию установки диапазона значений для свойства
		 * @param {QlikPropertyDefinition} definition Изменяемое определение свойства
		 * @return {function(Number, Number): *} Фунция установки
		 */
		function setRange(definition) {
			return function(minValue, maxValue) {
				if (minValue === undefined) {
					delete definition.min;
				}
				else if (minValue !== null) {
					definition.min = minValue;
				}

				if (maxValue === undefined) {
					delete definition.max;
				}
				else if (maxValue !== null) {
					definition.max = maxValue;
				}

				return this;
			};
		}

		/**
		 * Возвращает фунцию установки признака использования выражения для свойства
		 * @param {QlikPropertyDefinition} definition Изменяемое определение свойства
		 * @return {function(Boolean=): *} Фунция установки
		 */
		function setUseExpression(definition) {
			return function(usageFlag) {
				if (usageFlag) {
					definition.expression = 'always';
				}
				else if (usageFlag === null) {
					definition.expression = 'optional';
				}
				else {
					delete definition.expression;
				}
				return this;
			};
		}

		/**
		 * Возвращает построитель текстовой метки
		 * @param {String} title Текст метки
		 * @returns {Builder} Построитель
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
		 * Создаёт функцию построения определения свойства
		 * @param {QlikPropertyDefinition} definition Возвращаемое фукнцией определение свойства
		 * @returns {functino(): QlikPropertyDefinition} Функция построения определения
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

		// Контейнеры ---------------------------------------------------------

		/**
		 * Создаёт контейнер элементов верхнего уровня (аккордион)
		 * @returns {ContainerBuilder} Построитель списка элементов
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
				add: addItem(definition)
			};
		}

		/**
		 * Создаёт контейнер стандартной секции Измерения
		 * @returns {ContainerBuilder} Построитель списка элементов
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
				add: addItem(definition)
			};
		}

		/**
		 * Создаёт контейнер стандартной секции Меры
		 * @returns {ContainerBuilder} Построитель списка элементов
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
				add: addItem(definition)
			};
		}

		/**
		 * Создаёт контейнер стандартной секции Сортировка
		 * @returns {ContainerBuilder} Построитель списка элементов
		 */
		function sorting() {
			/** @type {QlikPropertyDefinition} */
			var definition = {
				uses: 'sorting',
				items: {}
			};

			return {
				build: builderBuild(definition),
				add: addItem(definition)
			};
		}

		/**
		 * Создаёт контейнер стандартной секции Представление
		 * @returns {ContainerBuilder} Построитель списка элементов
		 */
		function settings() {
			/** @type {QlikPropertyDefinition} */
			var definition = {
				uses: 'settings',
				items: {}
			};

			return {
				build: builderBuild(definition),
				add: addItem(definition)
			};
		}

		/**
		 * Создаёт контейнер секции
		 * @returns {SectionBuilder} Построитель списка элементов
		 */
		function section() {
			/** @type {QlikPropertyDefinition} */
			var definition = {
				type: 'items',
				component: 'expandable-items',
				items: {}
			};

			return {
				build: builderBuild(definition),
				add: addItem(definition),
				title: setPropertyTitle(definition),
				visible: setPropertyVisible(definition)
			};
		}

		/**
		 * Создаёт контейнер-список элементов
		 * @returns {PanelBuilder} Построитель списка элементов
		 */
		function panel() {
			/** @type {QlikPropertyDefinition} */
			var definition = {
				type: 'items',
				items: {}
			};

			return {
				build: builderBuild(definition),
				add: addItem(definition),
				title: setPropertyTitle(definition),
				visible: setPropertyVisible(definition)
			};
		}

		/**
		 * Добавляет элемент в контейнер
		 * @param {QlikPropertyDefinition} definition 
		 * @returns {function(QlikPropertyDefinition|Builder): ContainerBuilder} Функция добавления
		 */
		function addItem(definition) {
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
 * @property {function(): ContainerBuilder} accordion Панель-аккордион
 * @property {ColumnsContainerBuilderFunction} dimensionsSection Стандартная секция измерений
 * @property {ColumnsContainerBuilderFunction} measuresSection Стандартная секция мер
 * @property {function(): ContainerBuilder} sortingSection Стандартная секция сортировки
 * @property {function(): ContainerBuilder} appearanceSection Стандартная секция представления
 * @property {function(): SectionBuilder} section Секция
 * @property {function(): PanelBuilder} panel Панель элементов
 */

/**
 * Логическое свойство
 * @typedef {Object} BooleanBuilder
 * @property {BuildFunction} build Создаёт определение свойства
 * @property {function(String): BooleanBuilder} title Устанавливает заголовок
 * @property {function(Boolean|VisibleCallbackFunction): BooleanBuilder} visible Устанавливает видимость
 * @property {function(Boolean): BooleanBuilder} default Устанавливает значение по умолчанию
 * @property {function(): CheckBoxBuilder} checkBox Устанавливает интерфейс галочки
 * @property {function(): BooleanSwitchBuilder} switch Устанавливает интерфейс переключателя
 */

/**
 * Галочка выбора логического свойства
 * @typedef {Object} CheckBoxBuilder
 * @property {BuildFunction} build Создаёт определение свойства
 * @property {function(String): CheckBoxBuilder} title Устанавливает заголовок
 * @property {function(Boolean|VisibleCallbackFunction): CheckBoxBuilder} visible Устанавливает видимость
 * @property {function(Boolean): CheckBoxBuilder} default Устанавливает значение по умолчанию
 */

/**
 * Переключатель выбора логического значения
 * @typedef {Object} BooleanSwitchBuilder
 * @property {BuildFunction} build Создаёт определение свойства
 * @property {function(String): BooleanSwitchBuilder} title Устанавливает заголовок
 * @property {function(Boolean|VisibleCallbackFunction): BooleanSwitchBuilder} visible Устанавливает видимость
 * @property {function(Boolean): BooleanSwitchBuilder} default Устанавливает значение по умолчанию
 * @property {function(String, String): BooleanSwitchBuilder} optionTitles Устанавливает отображаемые названия опций
 */

/**
 * Целочисленое свойство
 * @typedef {Object} IntegerBuilder
 * @property {BuildFunction} build Создаёт определение свойства
 * @property {function(String): IntegerBuilder} title Устанавливает заголовок
 * @property {function(Boolean|VisibleCallbackFunction): IntegerBuilder} visible Устанавливает видимость
 * @property {function(Number): IntegerBuilder} default Устанавливает значение по умолчанию
 * @property {function(Number, Number): IntegerBuilder} range Устанавливает диапазон изменения значения
 * @property {function(): IntegerEditBoxBuilder} editBox 
 * @property {function(): IntegerSliderBuilder} slider
 */

/**
 * Поле ввода целочисленного свойства
 * @typedef {Object} IntegerEditBoxBuilder
 * @property {BuildFunction} build Создаёт определение свойства
 * @property {function(String): IntegerEditBoxBuilder} title Устанавливает заголовок
 * @property {function(Boolean|VisibleCallbackFunction): IntegerEditBoxBuilder} visible Устанавливает видимость
 * @property {function(Number): IntegerEditBoxBuilder} default Устанавливает значение по умолчанию
 * @property {function(Number, Number): IntegerEditBoxBuilder} range Устанавливает диапазон изменения значения
 */

/**
 * Слайдер целочисленного свойства
 * @typedef {Object} IntegerSliderBuilder
 * @property {BuildFunction} build Создаёт определение свойства
 * @property {function(String): IntegerSliderBuilder} title Устанавливает заголовок
 * @property {function(Boolean|VisibleCallbackFunction): IntegerSliderBuilder} visible Устанавливает видимость
 * @property {function(Number): IntegerSliderBuilder} default Устанавливает значение по умолчанию
 * @property {function(Number, Number): IntegerSliderBuilder} range Устанавливает диапазон изменения значения
 * @property {function(Number): IntegerSliderBuilder} step Устанавливает шаг изменения значения
 */

/**
 * Вещественное числовое свойство
 * @typedef {Object} NumberBuilder
 * @property {BuildFunction} build Создаёт определение свойства
 * @property {function(String): NumberBuilder} title Устанавливает заголовок
 * @property {function(Boolean|VisibleCallbackFunction): NumberBuilder} visible Устанавливает видимость
 * @property {function(Number): NumberBuilder} default Устанавливает значение по умолчанию
 * @property {function(Number, Number): NumberBuilder} range Устанавливает диапазон изменения значения
 * @property {function(): NumberEditBoxBuilder} editBox
 * @property {function(): NumberSliderBuilder} slider
 */

/**
 * Поле ввода вещественного числового свойства
 * @typedef {Object} NumberEditBoxBuilder
 * @property {BuildFunction} build Создаёт определение свойства
 * @property {function(String): NumberEditBoxBuilder} title Устанавливает заголовок
 * @property {function(Boolean|VisibleCallbackFunction): NumberEditBoxBuilder} visible Устанавливает видимость
 * @property {function(Number): NumberEditBoxBuilder} default Устанавливает значение по умолчанию
 * @property {function(Number, Number): NumberEditBoxBuilder} range Устанавливает диапазон изменения значения
 * @property {function(Boolean=): NumberEditBoxBuilder} useExpression Устанавливает признак использования выражения
 */

/**
 * Слайдер вещественного числового свойства
 * @typedef {Object} NumberSliderBuilder
 * @property {BuildFunction} build Создаёт определение свойства
 * @property {function(String): NumberSliderBuilder} title Устанавливает заголовок
 * @property {function(Boolean|VisibleCallbackFunction): NumberSliderBuilder} visible Устанавливает видимость
 * @property {function(Number): NumberSliderBuilder} default Устанавливает значение по умолчанию
 * @property {function(Number, Number): NumberSliderBuilder} range Устанавливает диапазон изменения значения
 * @property {function(Number): NumberSliderBuilder} step Устанавливает шаг изменения значения
 */

/**
 * Строковое свойство
 * @typedef {Object} StringBuilder
 * @property {BuildFunction} build Создаёт определение свойства
 * @property {function(String): StringBuilder} title Устанавливает заголовок
 * @property {function(Boolean|VisibleCallbackFunction): StringBuilder} visible Устанавливает видимость
 * @property {function(String): StringBuilder} default Устанавливает значение по умолчанию
 * @property {function(Number): StringBuilder} maxLength Устанавливает максимальную длину
 * @property {function(): StringEditBoxBuilder} editBox Устанавливает интерфейс поля ввода
 * @property {function(): StringTextAreaBuilder} textArea Устанавливает интерфейс многострочного поля ввода
 */

/**
 * Поле ввода строкового свойства
 * @typedef {Object} StringEditBoxBuilder
 * @property {BuildFunction} build Создаёт определение свойства
 * @property {function(String): StringEditBoxBuilder} title Устанавливает заголовок
 * @property {function(Boolean|VisibleCallbackFunction): StringEditBoxBuilder} visible Устанавливает видимость
 * @property {function(String): StringEditBoxBuilder} default Устанавливает значение по умолчанию
 * @property {function(Number): StringEditBoxBuilder} maxLength Устанавливает максимальную длину
 * @property {function(Boolean=): StringEditBoxBuilder} useExpression Устанавливает признак использования выражения
 */

/**
 * Многострочное поле ввода строкового свойства
 * @typedef {Object} StringTextAreaBuilder
 * @property {BuildFunction} build Создаёт определение свойства
 * @property {function(String): StringTextAreaBuilder} title Устанавливает заголовок
 * @property {function(Boolean|VisibleCallbackFunction): StringTextAreaBuilder} visible Устанавливает видимость
 * @property {function(String): StringTextAreaBuilder} default Устанавливает значение по умолчанию
 * @property {function(Number): StringTextAreaBuilder} maxLength Устанавливает максимальную длину
 * @property {function(Number): StringTextAreaBuilder} rowCount Устанавливает количество строк поля
 */

/**
 * Перечислимое свойство
 * @typedef {Object} EnumBuilder
 * @property {BuildFunction} build Создаёт определение свойства
 * @property {function(String): EnumBuilder} title Устанавливает заголовок
 * @property {function(Boolean|VisibleCallbackFunction): EnumBuilder} visible Устанавливает видимость
 * @property {function(String): EnumBuilder} default Устанавливает значение по умолчанию
 * @property {function(*, String, Boolean): EnumBuilder} add Добавляет опцию выбора
 * @property {function(): EnumUiBuilder} comboBox Устанавливает интерфейс выпадающего списка
 * @property {function(): EnumUiBuilder} radioButtons Устанавливает интерфейс списка переключателей
 * @property {function(): EnumUiBuilder} buttons Устанавливает интерфейс списка кнопок
 */

/**
 * Интерфейс перечислимого свойства
 * @typedef {Object} EnumUiBuilder
 * @property {BuildFunction} build Создаёт определение свойства
 * @property {function(String): EnumUiBuilder} title Устанавливает заголовок
 * @property {function(Boolean|VisibleCallbackFunction): EnumUiBuilder} visible Устанавливает видимость
 * @property {function(String): EnumUiBuilder} default Устанавливает значение по умолчанию
 * @property {function(*, String, Boolean): EnumUiBuilder} add Добавляет опицию выбора
 */

/**
 * Свойство-массив
 * @typedef {Object} ArrayBuilder
 * @property {BuildFunction} build Создаёт определение свойства
 * @property {function(String): ArrayBuilder} title Устанавливает заголовок
 * @property {function(Boolean|VisibleCallbackFunction): ArrayBuilder} visible Устанавливает видимость
 * @property {ArrayAddPropertyFunction} add Добавляет свойство элемента
 * @property {ArrayItemTitleSetterFunction} itemTitle Устанавливате отображаемое название элемента
 * @property {function(String): ArrayBuilder} itemTitlePropertyName Устанавливает отображаемое название элемента через название свойства
 * @property {ArrayModifiableSetterFunction} modifiable Устанавливает признак редактируемости массива
 * @property {function(Boolean): ArrayBuilder} orderable Устанавливает признак упорядочиваемости
 * @property {function(Number): ArrayBuilder} maxCount Устанавливает максимальное число элементов массива
 */

/**
 * Функция добавления свойства элемента массива 
 * @callback ArrayAddPropertyFunction
 * @param {QlikPropertyDefinition|PropertyBuilder} item Добавляемое свойство
 * @returns {ArrayBuilder} Построитель массива
 */
 
/**
 * Функция установки отображаемого названия элемента массива
 * @callback ArrayItemTitleSetterFunction
 * @param {String | GetArrayItemTitleFunction} title Устанавливаемы заголовок или функция указывающая заголовок для элемента
 * @returns {ArrayBuilder} Построитель массива
 */

/**
 * Функция указания отображаемого названия элемента массива
 * @callback GetArrayItemTitleFunction
 * @param {*} itemData Данные элемента массива
 * @param {Number} index Индекс элемента
 * @param {*} context Контектсные данные Qlik
 * @returns {String} Отображаемое название элемента
 */

/**
 * Функция установки признака редактируемости массива
 * @callback ArrayModifiableSetterFunction
 * @param {Boolean} isModifiable Признак редактируемости массива
 * @param {String} additionTitle Заголовок действия добавления
 * @returns {ArrayBuilder} Построитель массива
 */

/**
 * Цветовое свойство
 * @typedef {Object} ColorBuilder
 * @property {BuildFunction} build Создаёт определение свойства
 * @property {function(String): ColorBuilder} title Устанавливает заголовок
 * @property {function(Boolean|VisibleCallbackFunction): ColorBuilder} visible Устанавливает видимость
 * @property {function(*): ColorBuilder} default Устанавливает значение по умолчанию
 * @property {function(): ColorPickerBuilder} picker Устанавливает интерфейс выбора из палитры
 * @property {function(): ColorEditBoxBuilder} editBox Устанавливает интерфейс поля ввода
 */

/**
 * Выпадающий список выбора цвета
 * @typedef {Object} ColorPickerBuilder
 * @property {BuildFunction} build Создаёт определение свойства
 * @property {function(String): ColorPickerBuilder} title Устанавливает заголовок
 * @property {function(Boolean|VisibleCallbackFunction): ColorPickerBuilder} visible Устанавливает видимость
 * @property {function(*): ColorPickerBuilder} default Устанавливает значение по умолчанию
 * @property {function(Boolean): ColorPickerBuilder} useCustomColor
 */

/**
 * Поле ввода цвета
 * @typedef {Object} ColorEditBoxBuilder
 * @property {BuildFunction} build Создаёт определение свойства
 * @property {function(String): ColorEditBoxBuilder} title Устанавливает заголовок
 * @property {function(Boolean|VisibleCallbackFunction): ColorEditBoxBuilder} visible Устанавливает видимость
 * @property {function(*): ColorEditBoxBuilder} default Устанавливает значение по умолчанию
 * @property {function(Boolean=): ColorEditBoxBuilder} useExpression Устанавливает признак использования выражения
 */

/**
 * Свойство-палитра
 * @typedef {Object} PaletteBuilder
 * @property {function(String): PaletteBuilder} title Устанавливает заголовок
 * @property {function(Boolean|VisibleCallbackFunction): PaletteBuilder} visible Устанавливает видимость
 * @property {function(String): PaletteBuilder} default Устанавливает значение по умолчанию
 * @property {function(): PalettePickerBuilder} picker Устанавливает интерфейс выбора из списка
 * @property {function(): PaletteComboBoxBuilder} comboBox Устанавливает интерфейс выбора из выпадающего списка
 */

/**
 * Список выбора палитры
 * @typedef {Object} PalettePickerBuilder
 * @property {BuildFunction} build Создаёт определение свойства
 * @property {function(String): PalettePickerBuilder} title Устанавливает заголовок
 * @property {function(Boolean|VisibleCallbackFunction): PalettePickerBuilder} visible Устанавливает видимость
 * @property {function(String): PalettePickerBuilder} default Устанавливает значение по умолчанию
 * @property {function(PaletteInfo): PalettePickerBuilder} add Добавляет опцию выбора
 * @property {function(QlikTheme): PalettePickerBuilder} addFromTheme Добавляет опции выбора из темы
 */

/**
 * Информация о палитре
 * @typedef {Object} PaletteInfo
 * @property {String} id Идентификатор
 * @property {String} title Отображаемое название
 * @property {Color[]} colors Список цветов
 * @property {Boolean} isContinuous Признок непрерывной палитры
 */

/**
 * Выпадающий список выбора палитры
 * @typedef {Object} PaletteComboBoxBuilder
 * @property {BuildFunction} build Создаёт определение свойства
 * @property {function(String): PaletteComboBoxBuilder} title Устанавливает заголовок
 * @property {function(Boolean|VisibleCallbackFunction): PaletteComboBoxBuilder} visible Устанавливает видимость
 * @property {function(String): PaletteComboBoxBuilder} default Устанавливает значение по умолчанию
 * @property {AddPaletteComboBoxOptionFunction} add Добавляет опцию выбора
 * @property {function(QlikTheme): PaletteComboBoxBuilder} addFromTheme Добавляет опции выбора из темы
 */

/**
 * Функция добавления опции выбора в выпадающий список палитр
 * @callback AddPaletteComboBoxOptionFunction
 * @param {String} id Идентификатор палитры
 * @param {String} title Отображаемое название палитры
 * @returns {PaletteComboBoxBuilder} Построитель выпадающего списка палитр
 */

/**
 * Функция установки диапазона количества элементов измерений или мер
 * @callback ColumnsContainerBuilderFunction
 * @param {Number} minCount Минимальное число измерений
 * @param {Number} maxCount Максимальное число измерений
 * @returns {ContainerBuilder} Построитель набора элементов
 */

/**
 * Контейнер элементов
 * @typedef {Object} ContainerBuilder
 * @property {BuildFunction} build Создаёт определение свойства
 * @property {function(QlikPropertyDefinition): ContainerBuilder} add
 */

/**
 * Секция
 * @typedef {Object} SectionBuilder
 * @property {BuildFunction} build Создаёт определение свойства
 * @property {function(QlikPropertyDefinition): SectionBuilder} add
 * @property {function(String): SectionBuilder} title Устанавливает заголовок
 * @property {function(Boolean|VisibleCallbackFunction): SectionBuilder} visible Устанавливает видимость
 */

/**
 * Панель
 * @typedef {Object} PanelBuilder
 * @property {BuildFunction} build Создаёт определение свойства
 * @property {function(QlikPropertyDefinition): PanelBuilder} add
 * @property {function(String): PanelBuilder} title Устанавливает заголовок
 * @property {function(Boolean|VisibleCallbackFunction): PanelBuilder} visible Устанавливает видимость
 */

/** 
 * Функция указания видимости свойства
 * @callback VisibleCallbackFunction
 * @param {*} context Контекст Qlik
 * @returns {Boolean | Promise<Boolean>} Значение видимости или его Promise
*/

/**
 * Построитель определения свойства
 * @typedef {Object} Builder
 * @property {BuildFunction} build Создаёт определение свойства
 */

 /**
  * Функция создания определения свойства
  * @callback BuildFunction
  * @returns {QlikPropertyDefinition} Определение свойства
  */