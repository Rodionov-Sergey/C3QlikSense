/**
 * Настройки расширения C3Extension
 */
define(
	['./QlikPropertiesBuilder'],

	/**
	 * Создаёт модуль
	 * @param {PropertyBuilderApi} propertiesBuilder Построитель определений свойств
	 * @returns Модуль
	 */
	function (propertiesBuilder) {
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
			return {
				type: 'items',
				component: 'accordion',
				items: {
					// Секция свойств Измерения
					dimensions: getDimensionProperties(columnPropertiesPath),
					// Секция свойств Меры
					measures: getMeasureProperties(columnPropertiesPath),
					// Секция свойств Сортировка
					sorting: {
						uses: 'sorting'
					},
					// Секция свойств Вид
					settings: {
						uses: 'settings'
					},
					// Секция свойства графика
					chart: getChartProperties(extensionPropertiesPath, qlikTheme),
				}
			};
		}

		/**
		 * Возвращает определения свойств секции Измерения
		 * @param {String} basePath Базовый путь к свойству
		 * @returns {QlikPropertyDefinition} Определения свойств измерений
		 */
		function getDimensionProperties(basePath) {

			return {
				uses: 'dimensions',
				min: 1,
				max: 1,
				// Cвойства измерений графика
				items: {
					// Тип шкалы
					scaleType: propertiesBuilder
						.comboBox()
						.addOption('CategoricalScale', 'Категориальная шкала', true)
						.addOption('NumericScale', 'Числовая шкала')
						.addOption('TemporalScale', 'Временная шкала')
						.titled('Тип шкалы')
						.forProperty(path(basePath, 'scaleType')),
					tickLabelAngle: {
						type: 'items',
						items: {
							// Угол наклона подписей - слайдер
							slider: propertiesBuilder
								.numberSlider()
								.range(-90, 90)
								.step(10)
								.defaulted(0)
								.titled('Угол наклона подписей')
								.forProperty(path(basePath, 'tickLabelAngle')),
							// Угол наклона подписей - числовое поле
							input: propertiesBuilder
								.integerInput()
								//.range(-90, 90)
								.defaulted(0)
								.forProperty(path(basePath, 'tickLabelAngle'))
						}
					}
				}
			};
		}

		/**
		 * Возвращает определение свойств секции Меры
		 * @param {String} basePath Базовый путь к свойству
		 * @param {QlikTheme} qlikTheme
		 * @returns {QlikPropertyDefinition} Определение свойств меры
		 */
		function getMeasureProperties(basePath) {
			return {
				uses: 'measures',
				min: 1,
				max: 10,
				// Свойства мер графика
				items: {
					// Тип графика
					chartType: propertiesBuilder
						.comboBox()
						.addOption('LineChart', 'Линейный график', true)
						.addOption('BarChart', 'Столбчатая диаграмма')
						.titled('Тип графика')
						.forProperty(path(basePath, 'chartType')),
					// Настройка группировки
					groupKey: propertiesBuilder
						.stringInput()
						.useExpression()
						.titled('Идентификатор группы')
						.forProperty(path(basePath, 'groupKey')),
					// Настройки линейного графика
					lineChart: getLineChartProperties(path(basePath, 'lineChart'))
				}
			};
		}

		/**
		 * Возвращает определения свойств линейного графика
		 * @param {String} basePath Базовый путь к свойству
		 * @returns {QlikPropertyDefinition} Определения свойств
		 */
		function getLineChartProperties(basePath) {
			return {
				type: 'items',
				items: {
					_header: propertiesBuilder
						.label('Линейный график'),
					pointsShown: propertiesBuilder
						.checkBox()
						.defaulted(false)
						.titled('Отображение точек')
						.forProperty(path(basePath, 'pointsShown')),
					lineShown: propertiesBuilder
						.checkBox()
						.defaulted(true)
						.titled('Отображение линии')
						.forProperty(path(basePath, 'lineShown')),
					areaShown: propertiesBuilder
						.checkBox()
						.defaulted(false)
						.titled('Отображение области')
						.forProperty(path(basePath, 'areaShown')),
				},
				show: function (context) {
					/** @type {MeasureProperties} */
					var properties = context.qDef.properties;
					// Отображение только для линейного графика
					return properties.chartType === 'LineChart';
				}
			};
		}
		
		/**
		 * Возвращает определения свойств графика
		 * @param {String} basePath Базовый путь к свойству
		 * @param {QlikTheme} qlikTheme Тема
		 * @returns {QlikPropertyDefinition} Определения свойств графика
		 */
		function getChartProperties(basePath, qlikTheme) {
			return {
				type: 'items',
				component: 'expandable-items',
				label: 'График',
				items: {
					// Свойства оси X
					axisX: getAxisXProperties(path(basePath, 'axisX')),
					// Линии оси X
					axisXLines: getLinesProperties(path(basePath, 'axisX'), 'Ось X. Линии'),
					// Свойства оси Y
					axisY: getAxisYProperties(path(basePath, 'axisY')),
					// Линии оси Y
					axisYLines: getLinesProperties(path(basePath, 'axisY'), 'Ось Y. Линии'),
					// Свойства легенды
					legend: getLegendProperties(path(basePath, 'legend')),
					// Палитра
					palette: propertiesBuilder
						.palettePicker(qlikTheme)
						.titled('Палитра')
						.visible(
							function() {
								return qlikTheme != null;
							})
						.forProperty(path(basePath, 'palette', 'id'))
				}
			};
		}

		/**
		 * Возвращает определения свойств оси X
		 * @param {String} basePath Базовый путь к свойству
		 * @returns {QlikPropertyDefinition} Определения свойств оси
		 */
		function getAxisXProperties(basePath) {
			return {
				type: 'items',
				label: 'Ось X',
				items: {
					// Признак отображение сетки
					gridShown: propertiesBuilder
						.toggle('Показать', 'Скрыть')
						.defaulted(true)
						.titled('Отображение сетки')
						.forProperty(path(basePath, 'grid', 'shown'))
				}
			};
		}

		/**
		 * Возвращает определения свойств оси Y
		 * @param {String} basePath Базовый путь к свойству
		 * @returns {QlikPropertyDefinition} Определения свойств оси
		 */
		function getAxisYProperties(basePath) {
			return {
				type: 'items',
				label: 'Ось Y',
				items: {
					// Подпись оси
					title: propertiesBuilder
						.stringInput()
						.useExpression()
						.titled('Заголовок оси')
						.forProperty(path(basePath, 'title')),
					// Признак отображение сетки
					gridShown: propertiesBuilder
						.toggle('Показать', 'Скрыть')
						.defaulted(false)
						.titled('Отображение сетки')
						.forProperty(path(basePath, 'grid', 'shown'))
				}
			};
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
			return {
				type: 'items',
				label: 'Легенда',
				items: {
					shown: propertiesBuilder
						.toggle('Показать', 'Скрыть')
						.defaulted(true)
						.titled('Отображение легенды')
						.forProperty(path(basePath, 'shown')),
					position: propertiesBuilder
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
				}
			};
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