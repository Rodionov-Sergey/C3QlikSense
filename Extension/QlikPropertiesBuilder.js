/**
 * Построитель пользовательских свойств для расширения Qlik
 */
define(
	[],
	function () {
		'use strict';

		return {
			property: property,
			option: option
		};

		// https://help.qlik.com/en-US/sense-developer/April2020/Subsystems/Extensions/Content/Sense_Extensions/Howtos/working-with-custom-properties.htm


		/**
		 * 
		 * @param {*} path 
		 * @param {*} title 
		 */
		function property(path, title) {
			var target = {
				ref: path,
				label: title
			};
		
			return {
				asLabel: function() {
					target.component = 'text';
					target.defaultValue = 13;
					return this;
				},
				asString: function() {
					target.type = 'string';
					return this;
				},
				asNumber: function(defaultValue, minValue, maxValue) {
					target.type = 'number';
					target.defaultValue = defaultValue;
					target.min = minValue;
					target.max = maxValue;
					return this;
				},
				asSlider: function(step) {
					target.component = 'slider';
					target.step = step;
					return this;
				},
				asCheckBox: function(defaultValue) {
					target.type = 'boolean';
					target.defaultValue = defaultValue;
					return this;
				},
				asSwitch: function(defaultValue, trueTitle, falseTitle) {
					target.type = 'boolean';
					target.component = 'switch';
					target.defaultValue = defaultValue;
					target.options = [
						{
							value: true,
							label: trueTitle || '',
						},
						{
							value: false,
							label: falseTitle || ''
						}
					];
					return this;
				},
				asDropDown: function() {
					target.type = 'string';
					target.component = 'dropdown';
					target.options = [];
					return this;
				},
				asColor: function() {
					target.type = 'object';
					target.component = 'color-picker';
					return this;
				},
				asThemePaletteSelector: function(qlikTheme) {
					target.type = 'items';
					target.component = 'item-selection-list';
					target.horizontal = false;
					target.items = getPalettesOptions(qlikTheme);
					return this;
				},

				withExpression: function(isSignRequired) {
					target.expression = isSignRequired ? 'always' : 'optional';
					return this;
				},

				visible: function(value) {
					target.show = value;
					return this;
				},

				addOption: function (value, title, isDefault) {
					var option = {
						value: value,
						label: title
					};
					target.options.push(option);
					if (isDefault) {
						target.defaultValue = value;
					}
					return this;
				},

				build: function() {
					return target;
				}
			};
		}

		/**
		 * Создаёт опцию выбора
		 * @param {String|Number|Boolean} value Значение
		 * @param {String} title Подпись
		 * @returns {QlikPropertyOption} Опция выбора
		 */
		function option(value, title) {
			return {
				value: value,
				label: title
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