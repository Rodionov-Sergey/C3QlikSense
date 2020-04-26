/**
 * Построитель пользовательских свойств для расширения Qlik
 */
define(
	[],

	/**
	 * Возвращает API построителя определений свойств
	 * @returns {PropertyBuilderApi} API построителя определений свойств
	 */
	function () {
		'use strict';

		return {
			stringInput: stringInput,
			integerInput: integerInput,
			numberInput: numberInput,
			numberSlider: numberSlider,
			rangeSlider: rangeSlider,
			checkBox: checkBox,
			toggle: toggle,
			comboBox: comboBox,
			buttonGroup: buttonGroup,
			radioButtonGroup: radioButtonGroup,
			text: text,
			colorPicker: colorPicker,
			palettePicker: palettePicker,
			label: label,
		};

		// https://help.qlik.com/en-US/sense-developer/April2020/Subsystems/Extensions/Content/Sense_Extensions/Howtos/working-with-custom-properties.htm

		/**
		 * Создаёт построитель поля ввода строки
		 * @returns {StringInputBuilder} Построитель поля ввода строки
		 */
		function stringInput() {
			var state = {
				type: 'string'
			};

			var builder = createBaseBuilder(state);

			// Максимальная длина
			appendMaxLengthFunction(builder, state);

			// Использование выражения
			builder.useExpression = function (use) {
				if (use == null) {
					state.expression = 'optional';
				}
				else if (use) {
					state.expression = 'always';
				}
				else {
					delete state.expression;
				}
				return builder;
			};

			return builder;
		}

		/**
		 * Создаёт построитель поля ввода целого числа
		 * @returns {IntegerInputBuilder} Построитель поля ввода целого числа
		 */
		function integerInput() {
			var state = {
				type: 'integer'
			};

			var builder = createBaseBuilder(state);
			// Диапазон
			appendRangeFunction(builder, state);

			return builder;
		}

		/**
		 * Создаёт построитель поля ввода вещественного числа
		 * @returns {NumberInputBuilder} Построитель поля ввода вещественного числа
		 */
		function numberInput() {
			var state = {
				type: 'number'
			};

			var builder = createBaseBuilder(state);

			// Диапазон
			appendRangeFunction(builder, state);

			return builder;
		}
		
		/**
		 * Создаёт построитель слайдера числа (Slider)
		 * @returns {NumberSliderBuilder} Построитель слайдера числа
		 */
		function numberSlider() {

			var state = {
				type: 'number',
				component: 'slider',
				// Значения по умолчанию:
				min: 0,
				max: 1,
				step: 0.1,
				defaultValue: 0
			};

			var builder = createBaseBuilder(state);

			// Диапазон
			appendRangeFunction(builder, state);
			// Шаг
			appendStepFunction(builder, state);

			return builder;
		}
				
		/**
		 * Создаёт построитель слайдера диапазона (Slider)
		 * @returns {RangeSliderBuilder} Построитель слайдера диапазона
		 */
		function rangeSlider() {
			var state = {
				type: 'array',
				component: 'slider',
				// Значения по умолчанию:
				min: 0,
				max: 1,
				step: 0.1,
				defaultValue: [0, 1]
			};

			var builder = createBaseBuilder(state);

			// Диапазон
			appendRangeFunction(builder, state);
			// Шаг
			appendStepFunction(builder, state);

			return builder;
		}

		/**
		 * Создаёт построитель флажка (Checkbox)
		 * @returns {CheckBoxBuilder} Построитель флажка
		 */
		function checkBox() {
			var state = {
				type: 'boolean',
			};

			return createBaseBuilder(state);
		}

		/**
		 * Создаёт построитель переключателя (Toggle, Switch)
		 * @param {} trueTitle Отображаемое название для включённого состояния
		 * @param {} falseTitle Отображаемое название для выключённого состояния
		 * @returns {ToggleBuilder} Построитель переключателя
		 */
		function toggle(trueTitle, falseTitle) {
			var state = {
				type: 'boolean',
				component: 'switch',
				options: [
					{
						value: true,
						label: trueTitle
					},
					{
						value: false,
						label: falseTitle
					}
				]
			};

			return createBaseBuilder(state);
		}

		/**
		 * Создаёт построитель выпадающего списка (Combobox, Dropdown)
		 * @returns {ComboBoxBuilder} Построитель выпадающего списка
		 */
		function comboBox() {
			var state = {
				type: 'string',
				component: 'dropdown',
				options: []
			};

			var builder = createBaseBuilder(state);
			
			// Опции
			appendAddOptionFunction(builder, state);

			return builder;
		}

		/**
		 * Создаёт построитель группы кнопок
		 * @returns {ButtonGroupBuilder} Построитель группы кнопок
		 */
		function buttonGroup() {
			var state = {
				type: 'string',
				component: 'buttongroup',
				options: []
			};

			var builder = createBaseBuilder(state);

			// Опции
			appendAddOptionFunction(builder, state);

			return builder;
		}

		/**
		 * Создаёт построитель набора переключателей (Radiobutton)
		 * @returns {RadioButtonGroupBuilder} Построитель набора переключателей
		 */
		function radioButtonGroup() {
			var state = {
				type: 'string',
				component: 'radiobuttons',
				options: []
			};

			var builder = createBaseBuilder(state);

			// Опции
			appendAddOptionFunction(builder, state);

			return builder;
		}

		/**
		 * Создаёт построитель поля ввода текста
		 * @returns {TextBuilder} Построитель поля ввода текста
		 */
		function text() {
			var state = {
				type: 'string',
				component: 'textarea'
			};

			var builder = createBaseBuilder(state);

			// Максимальная длина
			appendMaxLengthFunction(builder, state);
			
			// Число строк
			builder.rowCount = function (count) {
				state.rowCount = count;
				return builder;
			};

			return builder;
		}

		/**
		 * Создаёт построитель поля выбора цвета
		 * @returns {ColorPickerBuilder} Построитель поля выбора цвета
		 */
		function colorPicker(allowCustomColor) {
			var state = {
				type: allowCustomColor ? 'object' : 'integer',
				component: 'color-picker',
			};

			return createBaseBuilder(state);
		}

		/**
		 * Создаёт построитель поля выбора палитры
		 * @returns {PalettePickerBuilder} Построитель поля выбора палитры
		 */
		function palettePicker(qlikTheme) {
			// Список
			var state = {
				type: 'items',
				grouped: true,
				items: {
					// Элемент - палитра
					paletteItems: {
						type: 'items',
						component: 'item-selection-list',
						horizontal: false,
						items: getPalettesOptions(qlikTheme)
					}
				}
			};

			var builder = createBaseBuilder(state);
			
			// Подмена реализации, чтобы установить идентификатор на уровне элемента
			builder.forProperty = function(property) {
				state.items.paletteItems.ref = property;
				return state;
			};

			return builder;
		}

		/**
		 * Создаёт определение свойства текстовой метки
		 * @param {String} Текст метки
		 * @returns {QlikPropertyDefinition} Определение свойства текстовой метки
		 */
		function label(title) {
			var state = {
				component: 'text',
				label: title
			};

			return state;
		}

		/**
		 * Создаёт базовый построитель свойства
		 * @param {QlikPropertyDefinition} state Состояние
		 * @returns {PropertyBuilder} Базовый построитель свойства
		 */
		function createBaseBuilder(state) {
			return {
				titled: function (title) {
					state.label = title;
					return this;
				},
				defaulted: function (value) {
					state.defaultValue = value;
					return this;
				},
				visible: function (visibility) {
					state.show = visibility;
					return this;
				},
				forProperty: function(property) {
					state.ref = property;
					return state;
				}
			};
		}

		/**
		 * Добавляет в построитель функцию для установки максимальной длины
		 * @param {StringInputBuilder} builder Построитель
		 * @param {QlikPropertyDefinition} state Состояние
		 */
		function appendMaxLengthFunction(builder, state) {
			builder.maxLength = function (maxLength) {
				state.maxLength = maxLength;
				return builder;
			};
		}

		/**
		 * Добавляет в построитель функцию для установки диапазона
		 * @param {IntegerInputBuilder|NumberInputBuilder|NumberSliderBuilder|RangeSliderBuilder} builder Построитель
		 * @param {QlikPropertyDefinition} state Состояние
		 */
		function appendRangeFunction(builder, state) {
			builder.range = function (minValue, maxValue) {
				state.min = minValue;
				state.max = maxValue;
				return builder;
			};
		}

		/**
		 * Добавляет в построитель функцию для установки шага
		 * @param {NumberSliderBuilder|RangeSliderBuilder} builder Построитель
		 * @param {QlikPropertyDefinition} state Состояние
		 */
		function appendStepFunction(builder, state) {
			builder.step = function (stepValue) {
				state.step = stepValue;
				return builder;
			};
		}

		/**
		 * Добавляет в построитель функцию для добавления опции выбора
		 * @param {NumberSliderBuilder|RangeSliderBuilder} builder Построитель
		 * @param {QlikPropertyDefinition} state Состояние
		 */
		function appendAddOptionFunction(builder, state) {
			builder.addOption = function (value, title, isDefault) {
				var option = {
					value: value,
					label: title
				};
				state.options.push(option);

				if (isDefault) {
					builder.defaulted(value);
				}
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
				return null;
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

		// Функции Qlik API
				
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
	}
);

/**
 * @typedef {Object} PropertyBuilderApi
 * @property {function(): StringInputBuilder} stringInput Построитель поля ввода строки
 * @property {function(): IntegerInputBuilder} integerInput Построитель поля ввода целого числа
 * @property {function(): NumberInputBuilder} numberInput Построитель поля ввода вещественного числа
 * @property {function(): NumberSliderBuilder} numberSlider Построитель слайдера числа (Slider)
 * @property {function(): RangeSliderBuilder} rangeSlider Построитель слайдера диапазона (Slider)
 * @property {function(): CheckBoxBuilder} checkBox Построитель флажка (Checkbox)
 * @property {function(String, String): ToggleBuilder} toggle Построитель переключателя (Toggle, Switch)
 * * arg0: Отображаемое название для включённого состояния
 * * arg1: Отображаемое название для выключённого состояния
 * @property {function(): ComboBoxBuilder} comboBox Построитель выпадающего списка (Combobox, Dropdown)
 * @property {function(): ButtonGroupBuilder} buttonGroup Построитель группы кнопок
 * @property {function(): RadioButtonGroupBuilder} radioButtonGroup Построитель набора переключателей (Radiobutton)
 * @property {function(): TextBuilder} text Построитель поля ввода текста
 * @property {function(Boolean): ColorPickerBuilder} colorPicker Построитель поля выбора цвета
 * * arg0: Признак разрешения использования пользовательских цветов
 * @property {function(QlikTheme): PalettePickerBuilder} palettePicker Построитель поля выбора палитры
 * * arg0: Тема
 * @property {function(String): QlikPropertyDefinition} label Определение свойства текстовой метки
 * * arg0: Текст метки
 */

/**
 * Базовый построитель поля
 * @typedef {Object} PropertyBuilder
 * @property {function(String): PropertyBuilder} titled Устанавливает заголовок
 * * arg0: Заголовок
 * @property {function(*): PropertyBuilder} defaulted Устанавливает значение по умолчанию
 * * arg0: Значение по умолчанию
 * @property {function(
 *   Boolean
 *   | (function(*): Boolean)
 *   | (function(*): Promise<Boolean>)
 * ): PropertyBuilder} visible Устанавливает видимость элемента
 * * arg0: Признак видимости или функция, возвращающая признак видимости
 * @property {function(String): QlikPropertyDefinition} forProperty Создаёт определение свойства
 * * arg0: Название свойства или путь к свойсвтву через '.'
 */

/**
 * Построитель поля ввода строки
 * @typedef {Object} _StringInputBuilder
 * @property {function(Number): StringInputBuilder} maxLength Устанавливает максимальную длину
 * * arg0: Максимальная длина
 * @property {function(Boolean=): StringInputBuilder} useExpression Настраивает использование выражения
 * * arg0: 
 * * * false, выражение не используется;
 * * * true, используется выражение, обязательно начинающееся с символа "="; 
 * * * иначе выражение используется, если начинается с символа "="
 */
/**
 * Построитель поля ввода строки
 * @typedef {_StringInputBuilder & PropertyBuilder} StringInputBuilder
 */

/**
 * Построитель поля ввода целого числа
 * @typedef {Object} _IntegerInputBuilder
 * @property {function(Number, Number): IntegerInputBuilder} range Устанавливает диапазон значений
 * * arg0: Минимальное значение
 * * arg1: Максимальное значение
 */
/**
 * Построитель поля ввода целого числа
 * @typedef {_IntegerInputBuilder & PropertyBuilder} IntegerInputBuilder
 */

/**
 * Построитель поля ввода вещественного числа
 * @typedef {Object} _NumberInputBuilder
 * @property {function(Number, Number): NumberInputBuilder} range Устанавливает диапазон значений
 * * arg0: Минимальное значение
 * * arg1: Максимальное значение
 */
/**
 * Построитель поля ввода вещественного числа
 * @typedef {_NumberInputBuilder & PropertyBuilder} NumberInputBuilder
 */

/**
 * Построитель слайдера числа
 * @typedef {Object} _NumberSliderBuilder
 * @property {function(Number, Number): NumberInputBuilder} range Устанавливает диапазон значений
 * * arg0: Минимальное значение
 * * arg1: Максимальное значение
 * @property {function(Number): NumberSliderBuilder} step Устанавливает шаг значений
 * * arg0: Шаг значений
 */
/**
 * Построитель слайдера числа
 * @typedef {_NumberSliderBuilder & PropertyBuilder} NumberSliderBuilder
 */

/**
 * Построитель слайдера диапазона
 * @typedef {Object} _RangeSliderBuilder
 * @property {function(Number, Number): NumberInputBuilder} range Устанавливает диапазон значений
 * * arg0: Минимальное значение
 * * arg1: Максимальное значение
 * @property {function(Number): RangeSliderBuilder} step Устанавливает шаг значений
 * * arg0: Шаг значений
 */
/**
 * Построитель слайдера диапазона
 * @typedef {_RangeSliderBuilder & PropertyBuilder} RangeSliderBuilder
 */

/**
 * Построитель флажка (Checkbox)
 * @typedef {PropertyBuilder} CheckBoxBuilder
 */

/**
 * Построитель переключателя (Toggle, Switch)
 * @typedef {PropertyBuilder} ToggleBuilder
 */

/**
 * Построитель выпадающего списка (Combobox, Dropdown)
 * @typedef {Object} _ComboBoxBuilder
 * @property {function(*, String, Boolean=): ComboBoxBuilder} addOption Добавляет опцию выбора
 * * arg0: Выбираемое значение опции
 * * arg1: Отображаемое название опции
 * * arg2: Признак опции, выбранной по умолчанию
 */
/**
 * Построитель выпадающего списка (Combobox, Dropdown)
 * @typedef {_ComboBoxBuilder & PropertyBuilder} ComboBoxBuilder
 */

/**
 * Построитель группы кнопок
 * @typedef {Object} _ButtonGroupBuilder
 * @property {function(*, String, Boolean=): ButtonGroupBuilder} addOption Добавляет опцию выбора
 * * arg0: Выбираемое значение опции
 * * arg1: Отображаемое название опции
 * * arg2: Признак опции, выбранной по умолчанию
 */
/**
 * Построитель группы кнопок
 * @typedef {_ButtonGroupBuilder & PropertyBuilder} ButtonGroupBuilder
 */

/**
 * Построитель группы кнопок
 * @typedef {Object} _RadioButtonGroupBuilder
 * @property {function(*,String,Boolean=): RadioButtonGroupBuilder} addOption Добавляет опцию выбора
 * * arg0: Выбираемое значение опции
 * * arg1: Отображаемое название опции
 * * arg2: Признак опции, выбранной по умолчанию
 */
/**
 * Построитель группы кнопок
 * @typedef {_RadioButtonGroupBuilder & PropertyBuilder} RadioButtonGroupBuilder
 */

/**
 * Построитель поля ввода текста
 * @typedef {Object} _TextBuilder
 * @property {function(Number): TextBuilder} rowCount Устанавливает число строк поля ввода
 * * arg0: Число строк для поля ввода
 * @property {function(Number): TextBuilder} maxLength Устанавливает максимальную длину текста
 * * arg0: Максимальная длина текста
 */
/**
 * Построитель поля ввода текста
 * @typedef {_TextBuilder & PropertyBuilder} TextBuilder
 */

/**
 * Построитель поля выбора цвета
 * @typedef {PropertyBuilder} ColorPickerBuilder
 */

/**
 * Построитель поля выбора палитры
 * @typedef {PropertyBuilder} PalettePickerBuilder
 */