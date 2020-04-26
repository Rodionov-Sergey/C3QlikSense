/**
 * Настройки расширения C3Extension
 */
define(
	['./QlikPropertiesBuilder'],

	/**
	 * Создаёт модуль
	 * @param {QlikApi} qlik Qlik API
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
		 * @returns {*} Определения свойств
		 */
		function getProperties(qlikTheme) {
			var columnPropertiesPath = path('qDef', 'properties');
			var extensionPropertiesPath = 'properties';
			return {
				type: 'items',
				component: 'accordion',
				items: {
					// Блок свойств Измерения
					dimensions: getDimensionProperties(columnPropertiesPath),
					// Блок свойств Меры
					measures: getMeasureProperties(columnPropertiesPath),
					// Блок свойств Сортировка
					sorting: {
						uses: 'sorting'
					},
					// Блок свойств Вид
					settings: {
						uses: 'settings'
					},
					// Свойства графика
					chart: getChartProperties(extensionPropertiesPath, qlikTheme)
				}
			};
		}

		/**
		 * Возвращает определения свойств секции Измерения
		 * @param {String} basePath Базовый путь к свойству
		 * @returns Определения свойств измерений
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
						.property(path(basePath, 'scaleType'), 'Тип шкалы')
						.asDropDown()
						.addOption('CategoricalScale', 'Категориальная шкала', true)
						.addOption('NumericScale', 'Числовая шкала')
						.addOption('TemporalScale', 'Временная шкала')
						.build(),
					// Угол наклона подписей - текстовое поле
					tickLabelAngleText: propertiesBuilder
						.property(path(basePath, 'tickLabelAngle'), 'Угол наклона подписей')
						.asNumber(0, -90, 90)
						.build(),
					// Угол наклона подписей - слайдер
					tickLabelAngle: propertiesBuilder
						.property(path(basePath, 'tickLabelAngle'))
						.asNumber(0, -90, 90)
						.asSlider(10)
						.build()
				}
			};
		}

		/**
		 * Возвращает определение свойств секции Меры
		 * @param {String} basePath Базовый путь к свойству
		 * @param {QlikTheme} qlikTheme
		 * @returns {*} Определение свойств меры
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
						.property(path(basePath, 'chartType'), 'Тип графика')
						.asDropDown()
						.addOption('LineChart', 'Линейный график', true)
						.addOption('BarChart', 'Столбчатая диаграмма')
						.build(),
					// Настройка группировки
					groupKey: propertiesBuilder
						.property(path(basePath, 'groupKey'), 'Идентификатор группы')
						.asString()
						.build(),
					// Настройки линейного графика
					lineChart: getLineChartProperties(path(basePath, 'lineChart'))
				}
			};
		}

		/**
		 * Возвращает определения свойств линейного графика
		 * @param {String} basePath Базовый путь к свойству
		 * @returns {*} Определения свойств
		 */
		function getLineChartProperties(basePath) {
			return {
				type: 'items',
				items: {
					_header: propertiesBuilder
						.property(null, 'Линейный график')
						.asString()
						.asLabel()
						.build(),
					pointsShown: propertiesBuilder
						.property(path(basePath, 'pointsShown'), 'Отображение точек')
						.asCheckBox(true)
						.build(),
					lineShown: propertiesBuilder
						.property(path(basePath, 'lineShown'), 'Отображение линии')
						.asCheckBox(true)
						.build(),
					areaShown: propertiesBuilder
						.property(path(basePath, 'areaShown'), 'Отображение области')
						.asCheckBox(true)
						.build()
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
		 * @returns {*} Определения свойств графика
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
					palette: getPaletteProperties(path(basePath, 'palette'), qlikTheme)
				}
			};
		}

		/**
		 * Возвращает определения свойств оси X
		 * @param {String} basePath Базовый путь к свойству
		 * @returns {*} Определения свойств оси
		 */
		function getAxisXProperties(basePath) {
			return {
				type: 'items',
				label: 'Ось X',
				items: {
					// Признак отображение сетки
					gridShown: propertiesBuilder
						.property(path(basePath, 'grid', 'shown'), 'Отображение сетки')
						.asSwitch(true, 'Показать', 'Скрыть')
						.build()
				}
			};
		}

		/**
		 * Возвращает определения свойств оси Y
		 * @param {String} basePath Базовый путь к свойству
		 * @returns {*} Определения свойств оси
		 */
		function getAxisYProperties(basePath) {
			return {
				type: 'items',
				label: 'Ось Y',
				items: {
					// Подпись оси
					title: propertiesBuilder
						.property(path(basePath, 'title'), 'Заголовок оси')
						.asString()
						.build()
					},
					// Признак отображение сетки
					gridShown: propertiesBuilder
						.property(path(basePath, 'grid', 'shown'), 'Отображение сетки')
						.asSwitch(false, 'Показать', 'Скрыть')
						.build()
			};
		}

		/**
		 * Возвращает определения свойств линий
		 * @param {String} basePath Базовый путь к свойству
		 * @param {String} title Заголовок секции
		 * @returns {*} Определения свойств линий
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
						.property('value', 'Значение')
						.asNumber()
						.withExpression()
						.build(),
					// Подпись
					title: propertiesBuilder
						.property('title', 'Подпись')
						.asString()
						.withExpression()
						.build(),
					// Цвет
					color: propertiesBuilder
						.property('foreground', 'Цвет')
						.asColor()
						.build()
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
		 * @returns {*} Определения свойств
		 */
		function getLegendProperties(basePath) {
			return {
				type: 'items',
				label: 'Легенда',
				items: {
					shown: propertiesBuilder
						.property(path(basePath, 'shown'), 'Отображение легенды')
						.asSwitch(true, 'Показать', 'Скрыть')
						.build(),
					position: propertiesBuilder
						.property(path(basePath, 'position'), 'Расположение легенды')
						.asDropDown()
						.addOption('Bottom', 'Снизу', true)
						.addOption('Right', 'Справа')
						.addOption('Inside', 'Внутри')
						.visible(
							function(context) {
								return context.properties.legend.shown;
							})
						.build()
				}
			};
		}

		/**
		 * Возвращает определение свойства палитры
		 * @param {String} basePath Базовый путь к свойству
		 * @param {QlikTheme} qlikTheme Тема
		 * @returns {*} Определение свойства
		 */
		function getPaletteProperties(basePath, qlikTheme) {
			return {
				type: 'items',
				label: 'Палитра',
				grouped: true,
				items: {
					// Элементы списка палитр
					paletteItems: propertiesBuilder
						.property(path(basePath, 'id'))
						.asThemePaletteSelector(qlikTheme)
						.build()
				},
				shown: function() {
					return qlikTheme != null;
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