/**
 * Настройки расширения C3Extension
 */
define(
	[
		'./QlikPropertyDefinitions',
		'./QlikPropertiesBuilder'
	],

	/**
	 * Создаёт модуль
	 * @param {QlikPropertyFactory} propertyFactory
	 * @param {PropertyBuilderApi} propertiesBuilder Построитель определений свойств
	 * @returns Модуль
	 */
	function (propertyFactory, propertiesBuilder) {
		'use strict';

		var pf = propertyFactory;

		// Определения свойств
		return {
			// Функция получения определений свойств
			getProperties: getProperties,
			getInitialProperties: getInitialProperties,
			getSupportProperties: getSupportProperties
		};

		/**
		 * Возвращает настройки первичной загрузки данных
		 * @returns {*} Настройки первичной загрузки данных
		 */
		function getInitialProperties() {
			return {
				qHyperCubeDef: {
					qDimensions: [],
					qMeasures: [],
					qInitialDataFetch: [
						{
							qWidth: 11,
							qHeight: 900
						}
					]
				}
			};
		}

		/**
		 * Возвращает настройки выгрузки
		 * @returns {*} Настройки выгрузки
		 */
		function getSupportProperties() {
			return {
				snapshot: true,
				export: true,
				exportData: false
			};
		}
		
		// Настройка пользовательских свойст для боковой панели расширения
		// https://help.qlik.com/en-US/sense-developer/April2020/Subsystems/Extensions/Content/Sense_Extensions/Howtos/working-with-custom-properties.htm

		/**
		 * Возвращает определения свойств, настраиваемых пользователем
		 * @param {*} qlikTheme Тема
		 * @returns {QlikPropertyDefinition} Определения свойств
		 */
		function getProperties(qlikTheme) {
			var columnPropertiesPath = path('qDef', 'properties');
			var extensionPropertiesPath = 'properties';
			return pf.sections()
				// Секция свойств Измерения
				.add(getDimensionProperties(columnPropertiesPath))
				// Секция свойств Меры
				.add(getMeasureProperties(columnPropertiesPath))
				// Секция свойств Сортировка
				.add(pf.sorting())
				// Секция свойств Вид
				.add(pf.settings())
				// Секция свойства графика
				.add(getChartProperties(extensionPropertiesPath, qlikTheme))
				.build();
		}

		/**
		 * Возвращает определения свойств секции Измерения
		 * @param {String} basePath Базовый путь к свойству
		 * @returns {QlikPropertyDefinition} Определения свойств измерений
		 */
		function getDimensionProperties(basePath) {
			return pf.dimensions(1, 1)
				// Тип шкалы
				.add(
					propertiesBuilder
						.comboBox()
						.addOption('CategoricalScale', 'Категориальная шкала', true)
						.addOption('NumericScale', 'Числовая шкала')
						.addOption('TemporalScale', 'Временная шкала')
						.titled('Тип шкалы')
						.forProperty(path(basePath, 'scaleType'))
				)
				.add(
					pf.items()
						// Угол наклона подписей - слайдер
						.add(
							propertiesBuilder
								.numberSlider()
								.range(-90, 90)
								.step(10)
								.defaulted(0)
								.titled('Угол наклона подписей')
								.forProperty(path(basePath, 'tickLabelAngle'))
						)
						// Угол наклона подписей - числовое поле
						.add(
							propertiesBuilder
								.integerInput()
								.range(-90, 90)
								.defaulted(0)
								.forProperty(path(basePath, 'tickLabelAngle'))
						)
				);
		}

		/**
		 * Возвращает определение свойств секции Меры
		 * @param {String} basePath Базовый путь к свойству
		 * @param {QlikTheme} qlikTheme
		 * @returns {QlikPropertyDefinition} Определение свойств меры
		 */
		function getMeasureProperties(basePath) {
			return pf.measures(1, 10)
				// Тип графика
				.add(
					propertiesBuilder
						.comboBox()
						.addOption('LineChart', 'Линейный график', true)
						.addOption('BarChart', 'Столбчатая диаграмма')
						.titled('Тип графика')
						.forProperty(path(basePath, 'chartType'))
				)
				// Настройка группировки
				.add(
					propertiesBuilder
						.stringInput()
						.useExpression()
						.titled('Идентификатор группы')
						.forProperty(path(basePath, 'groupKey'))
				)
				// Настройки линейного графика
				.add(
					getLineChartProperties(path(basePath, 'lineChart'))
				);
		}

		/**
		 * Возвращает определения свойств линейного графика
		 * @param {String} basePath Базовый путь к свойству
		 * @returns {QlikPropertyDefinition} Определения свойств
		 */
		function getLineChartProperties(basePath) {
			return pf.items()
				.add(
					propertiesBuilder
						.label('Линейный график')
				)
				.add(
					propertiesBuilder
						.checkBox()
						.defaulted(false)
						.titled('Отображение точек')
						.forProperty(path(basePath, 'pointsShown'))
				)
				.add(
					propertiesBuilder
						.checkBox()
						.defaulted(true)
						.titled('Отображение линии')
						.forProperty(path(basePath, 'lineShown'))
				)
				.add(
					propertiesBuilder
						.checkBox()
						.defaulted(false)
						.titled('Отображение области')
						.forProperty(path(basePath, 'areaShown'))
				)
				.visible(
					function (context) {
						/** @type {MeasureProperties} */
						var properties = context.qDef.properties;
						// Отображение только для линейного графика
						return properties.chartType === 'LineChart';
					}
				);
		}
		
		/**
		 * Возвращает определения свойств графика
		 * @param {String} basePath Базовый путь к свойству
		 * @param {QlikTheme} qlikTheme Тема
		 * @returns {QlikPropertyDefinition} Определения свойств графика
		 */
		function getChartProperties(basePath, qlikTheme) {
			return pf.expandableItems('График')
				// Свойства оси X
				.add(getAxisXProperties(path(basePath, 'axisX')))
				// Линии оси X
				.add(getLinesProperties(path(basePath, 'axisX'), 'Ось X. Линии'))
				// Свойства оси Y
				.add(getAxisYProperties(path(basePath, 'axisY')))
				// Линии оси Y
				.add(getLinesProperties(path(basePath, 'axisY'), 'Ось Y. Линии'))
				// Свойства легенды
				.add(getLegendProperties(path(basePath, 'legend')))
				// Палитра
				.add(
					propertiesBuilder
						.palettePicker(qlikTheme)
						.titled('Палитра')
						.visible(
							function() {
								return qlikTheme != null;
							})
						.forProperty(path(basePath, 'palette', 'id'))
				);
		}

		/**
		 * Возвращает определения свойств оси X
		 * @param {String} basePath Базовый путь к свойству
		 * @returns {QlikPropertyDefinition} Определения свойств оси
		 */
		function getAxisXProperties(basePath) {
			return pf.items('Ось X')
				// Признак отображение сетки
				.add(
					propertiesBuilder
						.toggle('Показать', 'Скрыть')
						.defaulted(true)
						.titled('Отображение сетки')
						.forProperty(path(basePath, 'grid', 'shown'))
				);
		}

		/**
		 * Возвращает определения свойств оси Y
		 * @param {String} basePath Базовый путь к свойству
		 * @returns {QlikPropertyDefinition} Определения свойств оси
		 */
		function getAxisYProperties(basePath) {
			return pf.items('Ось Y')
				// Подпись оси
				.add(
					propertiesBuilder
						.stringInput()
						.useExpression()
						.titled('Заголовок оси')
						.forProperty(path(basePath, 'title'))
				)
				// Признак отображение сетки
				.add(
					propertiesBuilder
						.toggle('Показать', 'Скрыть')
						.defaulted(false)
						.titled('Отображение сетки')
						.forProperty(path(basePath, 'grid', 'shown'))
				);
		}

		/**
		 * Возвращает определения свойств линий
		 * @param {String} basePath Базовый путь к свойству
		 * @param {String} title Заголовок секции
		 * @returns {QlikPropertyDefinition} Определения свойств линий
		 */
		function getLinesProperties(basePath, title) {
			return {
				ref: path(basePath, 'lines'),
				type: 'array',
				label: title,
				allowAdd: true,
				allowRemove: true,
				addTranslation: 'Добавить',
				// Свойства линии
				items: {
					// Значение
					value: propertiesBuilder
						.stringInput()
						.useExpression()
						.titled('Значение')
						.forProperty('value'),
					// Подпись
					title: propertiesBuilder
						.stringInput()
						.useExpression()
						.titled('Подпись')
						.forProperty('title'),
					// Цвет
					color: propertiesBuilder
						.colorPicker(true)
						.titled('Цвет')
						.forProperty('foreground')
				},
				// Подпись элемента в боковой панели
				itemTitleRef: function (item)
				{
					var valueString = '';
					// Число
					if (typeof(item.value) === 'number') {
						valueString = item.value.toString();
					}
					// Выражение
					else if (typeof(item.value) === 'object' && 
						item.value.qValueExpression != null) {
						valueString = item.value.qValueExpression.qExpr;
					}

					var titleString = item.title != null && item.title != '' ? item.title + ': ' : '';
					return titleString + valueString; 
				}
			};
		}

		/**
		 * Возвращает определения свойств легенды
		 * @param {String} basePath Базовый путь к свойству
		 * @returns {QlikPropertyDefinition} Определения свойств
		 */
		function getLegendProperties(basePath) {
			return pf.items('Легенда')
				.add(
					propertiesBuilder
						.toggle('Показать', 'Скрыть')
						.defaulted(true)
						.titled('Отображение легенды')
						.forProperty(path(basePath, 'shown'))
				)
				.add(
					propertiesBuilder
						.comboBox()
						.addOption('Bottom', 'Снизу', true)
						.addOption('Right', 'Справа')
						.addOption('Inside', 'Внутри')
						.titled('Расположение легенды')
						.visible(
							function (context) {
								return context.properties.legend.shown;
							})
						.forProperty(path(basePath, 'position'))
				);
		}
		
		// Вспомогательные функции определений свойств

		/**
		 * Соединяет части пути к свойству
		 * @param {...String} args Части пути
		 * @returns {String} Общий путь к свойству
		 */
		function path(args) {
			args = Array.prototype.slice.call(arguments);
			return args.join('.');
		}
	}
);