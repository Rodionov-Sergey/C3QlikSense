/**
 * Настройки расширения C3Extension
 */
define(
	[
		'./QlikPropertyFactory',
		'./QlikPropertyDefinitions'
	],

	/**
	 * Создаёт модуль
	 * @param {PropertyFactory} f
	 * @param {QlikPropertyDefinitions} pf
	 * @param {PropertyBuilderApi} propertiesBuilder Построитель определений свойств
	 * @returns Модуль
	 */
	function (f, pf) {
		'use strict';

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
			return f.accordion()
				// Секция свойств Измерения
				.add(getDimensionProperties(columnPropertiesPath))
				// Секция свойств Меры
				.add(getMeasureProperties(columnPropertiesPath))
				// Секция свойств Сортировка
				.add(f.sorting())
				// Секция свойств Вид
				.add(f.settings())
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
			return f.dimensions(1, 1)
				// Тип шкалы
				.add(
					f.enumeration(basePath, 'scaleType')
						.title('Тип шкалы')
						.add('CategoricalScale', 'Категориальная шкала', true)
						.add('NumericScale', 'Числовая шкала')
						.add('TemporalScale', 'Временная шкала')
						.default('NumericScale')
						.comboBox()
				)
				.add(
					// Угол наклона подписей
					f.panel()
						// Слайдер
						.add(
							f.integer(basePath, 'tickLabelAngle')
								.title('Угол наклона подписей')
								.default(0)
								.range(-90, 90)
								.slider()
								.step(10)
						)
						// Числовое поле
						.add(
							f.integer(basePath, 'tickLabelAngle')
								.default(0)
								.range(-90, 90)
								.editBox()
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
			return f.measures(1, 10)
				// Тип графика
				.add(
					f.enumeration(basePath, 'chartType')
						.title('Тип графика')
						.add('LineChart', 'Линейный график', true)
						.add('BarChart', 'Столбчатая диаграмма')
						.comboBox()
				)
				// Настройка группировки
				.add(
					f.string(basePath, 'groupKey')
						.title('Идентификатор группы')
						.expressionBox()
						.optionalExpression(true)
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
			return f.panel()
				.add(
					f.label('Линейный график')
				)
				.add(
					f.boolean(basePath, 'pointsShown')
						.title('Отображение точек')
						.default(false)
						.checkBox()
				)
				.add(
					f.boolean(basePath, 'lineShown')
						.title('Отображение линии')
						.default(true)
						.checkBox()
				)
				.add(
					f.boolean(basePath, 'areaShown')
						.title('Отображение области')
						.default(false)
						.checkBox()
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
			return f.section('График')
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
					f.palette(basePath, 'palette', 'id')
						.title('Палитра')
						.picker()
						.fillFromTheme(qlikTheme)
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
			return f.panel('Ось X')
				// Признак отображение сетки
				.add(
					f.boolean(basePath, 'grid', 'shown')
						.title('Отображение сетки')
						.default(false)
						.switch()
						.optionTitles('Показать', 'Скрыть')
				);
		}

		/**
		 * Возвращает определения свойств оси Y
		 * @param {String} basePath Базовый путь к свойству
		 * @returns {QlikPropertyDefinition} Определения свойств оси
		 */
		function getAxisYProperties(basePath) {
			return f.panel('Ось Y')
				// Подпись оси
				.add(
					f.string(basePath, 'title')
						.title('Заголовок оси')
						.expressionBox()
						.optionalExpression(true)
				)
				// Признак отображение сетки
				.add(
					f.boolean(basePath, 'grid', 'shown')
						.title('Отображение сетки')
						.default(false)
						.switch()
						.optionTitles('Показать', 'Скрыть')
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
					f.string('value')
						.title('Значение')
						.expressionBox(true)
						.optionalExpression(true)
				)
				// Подпись
				.add(
					f.string('title')
						.title('Подпись')
						.expressionBox(true)
						.optionalExpression(true)
				)
				// Цвет
				.add(
					f.color('foreground')
						.title('Цвет')
						.default('#ffff00')
						.picker(true)
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
						else if (typeof(item.value) === 'object') {
							// Числовое выражение
							if (item.value.qValueExpression != null) {
								valueString = item.value.qValueExpression.qExpr;
							}
							// Строковое выражение
							else if (item.value.qStringExpression != null) {
								valueString = item.value.qStringExpression.qExpr;
							}
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
			return f.panel('Легенда')
				.add(
					f.boolean(basePath, 'grid', 'shown')
						.title('Отображение легенды')
						.default(false)
						.switch()
						.optionTitles('Показать', 'Скрыть')
				)
				.add(
					f.enumeration(basePath, 'position')
						.title('Расположение легенды')
						.add('Bottom', 'Снизу', true)
						.add('Right', 'Справа')
						.add('Inside', 'Внутри')
						.comboBox()
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