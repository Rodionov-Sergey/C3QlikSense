/**
 * Настройки расширения C3Extension
 */
define(
	['./QlikPropertyDefinitions'],

	/**
	 * Создаёт модуль
	 * @param {QlikPropertyFactory} propertyFactory
	 * @param {PropertyBuilderApi} propertiesBuilder Построитель определений свойств
	 * @returns Модуль
	 */
	function (propertyFactory) {
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
					pf.property(basePath, 'scaleType')
						.title('Тип шкалы')
						.ofEnum()
						.add('CategoricalScale', 'Категориальная шкала', true)
						.add('NumericScale', 'Числовая шкала')
						.add('TemporalScale', 'Временная шкала')
						.asComboBox()
				)
				.add(
					pf.items()
						// Угол наклона подписей - слайдер
						.add(
							pf.property(basePath, 'tickLabelAngle')
								.title('Угол наклона подписей')
								.default(0)
								.ofInteger()
								.range(-90, 90)
								.asSlider(10)
						)
						// Угол наклона подписей - числовое поле
						.add(
							pf.property(basePath, 'tickLabelAngle')
								.default(0)
								.ofInteger()
								.range(-90, 90)
								.asInput()
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
					pf.property(basePath, 'chartType')
						.title('Тип графика')
						.ofEnum()
						.add('LineChart', 'Линейный график', true)
						.add('BarChart', 'Столбчатая диаграмма')
						.asComboBox()
				)
				// Настройка группировки
				.add(
					pf.property(basePath, 'groupKey')
						.title('Идентификатор группы')
						.ofString()
						.asExpressionBox()
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
					pf.label('Линейный график')
				)
				.add(
					pf.property(basePath, 'pointsShown')
						.title('Отображение точек')
						.default(false)
						.ofBoolean()
						.asCheckBox()
				)
				.add(
					pf.property(basePath, 'lineShown')
						.title('Отображение линии')
						.default(true)
						.ofBoolean()
						.asCheckBox()
				)
				.add(
					pf.property(basePath, 'areaShown')
						.title('Отображение области')
						.default(false)
						.ofBoolean()
						.asCheckBox()
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
					pf.property(basePath, 'palette', 'id')
						.title('Палитра')
						.ofPalette(qlikTheme)
						.visible(
							function() {
								return qlikTheme != null;
							})
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
					pf.property(basePath, 'grid', 'shown')
						.title('Отображение сетки')
						.default(true)
						.ofBoolean()
						.asSwitch('Показать', 'Скрыть')
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
					pf.property(basePath, 'title')
						.title('Заголовок оси')
						.ofString()
						.asExpressionBox(true)
				)
				// Признак отображение сетки
				.add(
					pf.property(basePath, 'grid', 'shown')
						.title('Отображение сетки')
						.default(false)
						.ofBoolean()
						.asSwitch('Показать', 'Скрыть')
				);
		}

		/**
		 * Возвращает определения свойств линий
		 * @param {String} basePath Базовый путь к свойству
		 * @param {String} title Заголовок секции
		 * @returns {QlikPropertyDefinition} Определения свойств линий
		 */
		function getLinesProperties(basePath, title) {
			return pf.property(basePath, 'lines')
				.title(title)
				.ofArray()
				.modifiable(true, 'Добавить')
				.orderable(false)
				// Значение
				.add(
					pf.property('value')
						.title('Значение')
						.ofString()
						.asExpressionBox(true)
						.build()
				)
				// Подпись
				.add(
					pf.property('title')
						.title('Подпись')
						.ofString()
						.asExpressionBox(true)
						.build()
				)
				// Цвет
				.add(
					pf.property('foreground')
						.title('Цвет')
						.ofColor(true)
						.build()
				)
				// Подпись элемента в боковой панели
				.itemTitle(
					function (item)
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
				);
		}

		/**
		 * Возвращает определения свойств легенды
		 * @param {String} basePath Базовый путь к свойству
		 * @returns {QlikPropertyDefinition} Определения свойств
		 */
		function getLegendProperties(basePath) {
			return pf.items('Легенда')
				.add(
					pf.property(basePath, 'shown')
						.title('Отображение легенды')
						.default(true)
						.ofBoolean()
						.asSwitch('Показать', 'Скрыть')
				)
				.add(
					pf
						.property(basePath, 'position')
						.title('Расположение легенды')
						.ofEnum()
						.add('Bottom', 'Снизу', true)
						.add('Right', 'Справа')
						.add('Inside', 'Внутри')
						.asComboBox()
						.visible(
							function (context) {
								return context.properties.legend.shown;
							})
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