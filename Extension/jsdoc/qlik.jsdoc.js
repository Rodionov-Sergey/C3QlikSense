/**
 * JSDoc-определения для Qlik API и кастомных свойств
 */

// Qlik API

/**
 * Qlik API
 * @see https://help.qlik.com/en-US/sense-developer/February2020/Subsystems/APIs/Content/Sense_ClientAPIs/CapabilityAPIs/qlik-interface-interface.htm
 * @typedef {Object} QlikApi
 * @property {function(Object=):QlikApplication} currApp Возвращает текущее приложение
 * @property {function():Promise<QlikThemeInfo[]>} getThemeList Возвращает Promise краткой информации о темах
 * @property {*} Promise Точка доступа к Promise API
 */

/**
 * Приложение Qlik
 * @see https://help.qlik.com/en-US/sense-developer/February2020/Subsystems/APIs/Content/Sense_ClientAPIs/CapabilityAPIs/qlik-app-interface.htm
 * @typedef {Object} QlikApplication
 * @property {String} id Идентификатор приложения
 * @property {QlikThemeApi} theme API тем Qlik
 */

/**
 * API тем Qlik
 * @see https://help.qlik.com/en-US/sense-developer/February2020/Subsystems/APIs/Content/Sense_ClientAPIs/CapabilityAPIs/ThemeAPI/ThemeAPI.htm
 * @typedef {Object} QlikThemeApi
 * @property {function():Promise<QlikTheme>} getApplied Возвращающает Promise текущей темы
 */

/**
 * Тема Qlik
 * @see https://help.qlik.com/en-US/sense-developer/February2020/Subsystems/APIs/Content/Sense_ClientAPIs/CapabilityAPIs/ThemeAPI/QTheme.htm
 * @typedef {Object} QlikTheme
 * @property {String} id Идентификатор темы
 * @property {String} name Отображаемое название темы
 * @property {QlikThemeProperties} properties Настройки темы
 */

/**
 * Свойства темы Qlik
 * @see https://help.qlik.com/en-US/sense-developer/February2020/Subsystems/Extensions/Content/Sense_Extensions/CustomThemes/custom-themes-properties.htm
 * @typedef {Object} QlikThemeProperties
 * @property {QlikDataColors} dataColors Цветовые настройки
 * @property {QlikPalettes} palettes Цветовые палитры
 * @property {QlikColorScale[]} scales Цветовые шкалы
 */

/**
 * Настройки цветов данных
 * @typedef {Object} QlikDataColors
 * @property {Color} primaryColor Основной цвет данных
 * @property {Color} othersColor Цвет прочих данных
 * @property {Color} errorColor Цвет ошибочных данных
 * @property {Color} nullColor Цвет пустых данных
 */

/**
 * Настройки цветовых палитр
 * @typedef {Object} QlikPalettes
 * @property {QlikDataPalette[]} data Палитры для данных
 * @property {*} ui Палитры для UI
 */

/**
 * Настройки цветовых палитр
 * @typedef {Object} QlikDataPalette
 * @property {String} propertyValue Идентификатор палитры
 * @property {String=} name Название палитры
 * @property {String} translation Отображаемое название палитры
 * @property {QlikDataPaletteType} type Тип палитры
 * @property {Color[]|Color[][]} scale Цветовые шкалы в палитре
 */

/**
 * Тип палитры
 * @typedef {String} QlikDataPaletteType
 * - row - Ряд цветов
 * - pyramid - Пирамидальная - набор палитр разной длины
 */

/**
 * Настройки
 * @typedef {Object} QlikColorScale
 */

/**
 * Информация о теме
 * @typedef {Object} QlikThemeInfo
 * @property {String} id Идентификатор темы
 * @property {String} name Отображаемое название темы
 */

 // Qlik API данных

/**
 * Расширение Qlik
 * @see https://help.qlik.com/en-US/sense-developer/February2020/Subsystems/APIs/Content/Sense_ClientAPIs/ExtensionAPI/paint-method.htm
 * @typedef {Object} QlikExtension
 * @property {String} title - Заголовок расширения
 * @property {QlikHyperCube} qHyperCube - Гиперкуб данных
 * @property {ExtensionProperties} properties - Кастомные свойства расширения (определяются расширением)
 */

/**
 * Гиперкуб Qlik
 * @see https://help.qlik.com/en-US/sense-developer/June2019/APIs/EngineAPI/definitions-HyperCube.html
 * @typedef {Object} QlikHyperCube
 * @property {QlikDimension[]} qDimensionInfo - Измерения гиперкуба
 * @property {QlikMeasure[]} qMeasureInfo - Меры гиперкуба
 * @property {QlikDataPage[]} qDataPages - Страницы данных гиперкуба
 */

/**
 * Столбец гиперкуба Qlik
 * @typedef {Object} QlikColumn
 * @property {String} qFallbackTitle - Заголовок меры
 * @property {String} othersLabel - Текст специального значения Прочее
 */

/**
 * Измерение гиперкуба Qlik
 * @see https://help.qlik.com/en-US/sense-developer/June2019/APIs/EngineAPI/definitions-NxDimensionInfo.html
 * @typedef {Object} QlikDimension
 * @property {String} qFallbackTitle - Заголовок меры
 * @property {String} othersLabel - Текст специального значения Прочее
 * @property {DimensionProperties} properties - Кастомные свойства измерения (определяются расширением)
 */

 /**
 * Мера гиперкуба Qlik
 * @see https://help.qlik.com/en-US/sense-developer/June2019/APIs/EngineAPI/definitions-NxMeasureInfo.html
 * @typedef {Object} QlikMeasure
 * @property {String} qFallbackTitle - Заголовок меры
 * @property {String} othersLabel - Текст специального значения Прочее
 * @property {MeasureProperties} properties - Кастомные свойства меры (определяются расширением)
 */

/**
 * Страница данных гиперкуба Qlik
 * @see https://help.qlik.com/en-US/sense-developer/June2019/APIs/EngineAPI/definitions-NxDataPage.html
 * @typedef {Object} QlikDataPage
 * @property {QlikRow[]} qMatrix - Массив строк данных гиперкуба
 */

/**
 * Страница данных гиперкуба Qlik
 * @see https://help.qlik.com/en-US/sense-developer/June2019/APIs/EngineAPI/definitions-NxCellRows.html
 * @typedef {QlikCell[]} QlikRow
 */

/**
 * Ячейка данных гиперкуба Qlik
 * @see https://help.qlik.com/en-US/sense-developer/June2019/APIs/EngineAPI/definitions-NxCell.html
 * @typedef {Object} QlikCell
 * @property {Boolean} qIsEmpty - Признак пустоты ячейки
 * @property {Boolean} qIsNull - Признак null-значения в ячейке
 * @property {String} qText - Текстовые данные ячейки
 * @property {Number} qNum - Числовые данные ячейки; NaN, если нет числового значения
 * @property {QlikAttributes} qAttrExps - Значения атрибутов ячейки
 */

/**
 * Значения атрибутов ячейки Qlik
 * @see https://help.qlik.com/en-US/sense-developer/June2019/APIs/EngineAPI/definitions-NxAttributeExpressionValues.html
 * @typedef {Object} QlikAttributes
 * @property {QlikValue} qValues Массив значений атрибутов
 */

/**
 * Значение Qlik
 * @typedef {Object} QlikValue
 * @see https://help.qlik.com/en-US/sense-developer/June2019/APIs/EngineAPI/definitions-NxSimpleValue.html
 * @property {String} qText - Текстовое значение ячейки
 * @property {Number} qNum - Числовое значение ячейки; NaN, если нет числового значения
 */

// Qlik настройки расширений

/**
 * Описание элемента выбора
 * @typedef {Object} QlikPropertyOption
 * @property {String|Number} value Выбираемое значение элемента
 * @property {String} label Отображаемое название элемента
 */

/**
 * 
 * @typedef {Object} QlikColorScaleComponent
 * @property {String} component Тип компонента, равен 'color-scale'
 * @property {String|Number} value Значение (ключ)
 * @property {String} label Отображаемое название
 * @property {String} type Тип шкалы
 * @property {Color[]} colors Список цветов
 */