/**
 * JSDoc-определения для Qlik API и определений свойств
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

 // Qlik Theme API

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
 * @property {function(String, String, String):String} getStyle Возвращает строковое значение свойства
 * Поиск осуществляется вверх от указанного базового пути по указанному пути и названию.
 * Если свойство не найдено, поиск повторяется с родительского от базового. И так далее.
 * 
 * Аргументы:
 *   1. Базовый путь свойства (через точки)
 *   2. Путь к свойству (через точки)
 *   3. Название свойства
 * 
 * Результат:
 *   * Строковое значение свойства; null, если не найдено
 */

/**
 * Свойства темы Qlik
 * @see https://help.qlik.com/en-US/sense-developer/February2020/Subsystems/Extensions/Content/Sense_Extensions/CustomThemes/custom-themes-properties.htm
 * @typedef {Object} QlikThemeProperties
 * @property {Color} color Цвет фона объектов
 * @property {Color} backgroundColor Цвет фона листа
 * @property {String} fontSize Размер шрифта
 * @property {QlikObjectsThemeProperties} object Настройки объектов
 * @property {QlikDataColors} dataColors Цветовые настройки
 * @property {QlikPalettes} palettes Цветовые палитры измерений и для интерфейса
 * @property {QlikPalette[]} scales Цветовые палитры мер
 */

/**
 * Настройки темы объектов
 * @typedef {Object} QlikObjectsThemeProperties
 * @property {QlikThemeLegendProperties} legend Настройки темы легенды
 * @property {QlikThemeAxisProperties} axis Настройки темы оси
 * @property {QlikThemeGridProperties} grid Настройки темы сетки
 */

/**
 * Настройки темы легенды
 * @typedef {Object} QlikThemeLegendProperties
 * @property {QlikThemeForegroundFontSizeProperties} title Настройки заголовка легенды
 * @property {QlikThemeForegroundFontSizeProperties} label Настройки подписей элементов легенды
 */

/**
 * Настройки темы оси
 * @typedef {Object} QlikThemeAxisProperties
 * @property {QlikThemeForegroundFontSizeProperties} title Настройки заголовка легенды
 * @property {QlikThemeLabelProperties} label Настройки темы подписей засечек
 * @property {QlikThemeLineProperties} line Настройки темы линий осей
 */

/**
 * Настройки темы подписей засечек
 * @typedef {Object} QlikThemeLabelProperties
 * @property {QlikThemeForegroundFontSizeProperties} name Настройки названия
 */

/**
 * Настройки сетки
 * @typedef {Object} QlikThemeGridProperties
 * @property {QlikThemeLineProperties} line Настройки темы линии сетки
 */

/**
 * Настройки дополнительной линии
 * @typedef {Object} QlikThemeReferenceLineProperties
 * @property {QlikThemeLabelProperties} label Настройки метки линии
 * @property {QlikThemeForegroundFontSizeBackgoundProperties} outOfBounds Настройки индикатора линий вне границ графика
 */

/**
 * Настройки темы линий
 * @typedef {Object} QlikThemeLineProperties
 * @property {QlikThemeForegroundProperties} major Настройки цвета основной линии
 * @property {QlikThemeForegroundProperties} minor Настройки цвета дополнительной линии
 */

 /**
 * Настройки темы легенды
 * @typedef {Object} QlikThemeForegroundFontSizeBackgoundProperties
 * @property {Color=} color Цвет
 * @property {String=} fontSize Размер шрифта
 * @property {Color=} backgroundColor Цвет фона
 */

 /**
 * Настройки темы легенды
 * @typedef {Object} QlikThemeForegroundFontSizeProperties
 * @property {Color=} color Цвет
 * @property {String=} fontSize Размер шрифта
 */

 /**
 * Настройки темы легенды
 * @typedef {Object} QlikThemeForegroundProperties
 * @property {Color=} color Цвет
 */

/**
 * Настройки цветов данных
 * @typedef {Object} QlikDataColors
 * @property {Color=} primaryColor Основной цвет данных
 * @property {Color=} othersColor Цвет прочих данных
 * @property {Color=} errorColor Цвет ошибочных данных
 * @property {Color=} nullColor Цвет пустых данных
 */

/**
 * Настройки цветовых палитр
 * @typedef {Object} QlikPalettes
 * @property {QlikPalette[]} data Палитры для измерений
 * @property {QlikUiPalette[]} ui Палитры для выбора пользователем с интерфейса
 */

/**
 * Настройки цветовой палитры
 * @typedef {Object} QlikPalette
 * @property {String} propertyValue Идентификатор палитры
 * @property {String=} name Название палитры
 * @property {String} translation Отображаемое название палитры
 * @property {QlikDimensionPaletteType|QlikMeasurePaletteType} type Тип палитры
 * @property {Color[]|Color[][]} scale Цветовые шкалы в палитре
 */

/**
 * Тип палитры для измерения
 * @typedef {'row'|'pyramid'} QlikDimensionPaletteType
 * - 'row' - Ряд цветов
 * - 'pyramid' - Пирамидальная палитра - набор палитр разной длины
 */

 /**
 * Тип палитры для меры
 * @typedef {'gradient'|'class-pyramid'} QlikMeasurePaletteType
 * - 'gradient' - Градиентная палитра - плавный переход между рядом цветов согласно значению меры
 * - 'class-pyramid' - Пирамидальная палитра - интервальное назначени цветов согласно значению меры
 */

/**
 * Настройка цветовой палитры для интерфейса
 * @typedef {Object} QlikUiPalette
 * @property {String=} name Название палитры
 * @property {Color[]} colors Цвета в палитре
 */

/**
 * Цвет, представленный строкой с шестнадцатиричным RGB-кодом, начинающейся с '#'
 * @typedef {String} Color 
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
 * Измерение гиперкуба Qlik
 * @see https://help.qlik.com/en-US/sense-developer/June2019/APIs/EngineAPI/definitions-NxDimensionInfo.html
 * @typedef {Object} QlikDimension
 * @property {String} cId - Идентификтор измерения
 * @property {String} qFallbackTitle - Заголовок измерения
 * @property {String} othersLabel - Текст специального значения Прочее
 * @property {DimensionProperties} properties - Кастомные свойства измерения (определяются расширением)
 */

 /**
 * Мера гиперкуба Qlik
 * @see https://help.qlik.com/en-US/sense-developer/June2019/APIs/EngineAPI/definitions-NxMeasureInfo.html
 * @typedef {Object} QlikMeasure
 * @property {String} cId - Идентификатор меры
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
 * @property {QlikValue[]] qValues Массив значений атрибутов
 */

/**
 * Значение Qlik
 * @see https://help.qlik.com/en-US/sense-developer/June2019/APIs/EngineAPI/definitions-NxSimpleValue.html
 * @typedef {Object} QlikValue
 * @property {String} qText - Текстовое значение ячейки
 * @property {Number} qNum - Числовое значение ячейки; NaN, если нет числового значения
 */

// Qlik настройки расширений

/**
 * Определение свойства
 * @typedef {Object} QlikPropertyDefinition
 * @property {QlikDefaultSectionType} uses Тип подключаемой стандартной секции
 * @property {Number} min - Минимальное количество элементов (для секций измерений и мер)
 * @property {Number} max - Максимальное количество элементов (для секций измерений и мер)
 * @property {QlikPropertyDataType} type Тип данных
 * @property {QlikPropertyComponentType} component Тип интерфейса
 * @property {String} ref Путь к заполняемому свойству через "."
 * @property {String} label Отображаемое название
 * @property {*} defaultValue Значение по умолчанию
 * @property {QlikPropertyOption[]} options Набор опций выбора (для свойств выбора опций)
 * @property {Object.<string, QlikPropertyDefinition>} items Элементы
 * @property {function(
 *   Boolean
 *   | (function(*): Boolean)
 *   | (function(*): Promise<Boolean>)
 * ): PropertyBuilder} show Устанавливает видимость элемента
 * * arg0: Признак видимости или функция, возвращающая признак видимости
 */

/**
 * Тип подключаемой стандартной секции
 * @typedef {'dimensions'
 * |'measures'
 * |'sorting'
 * |'settings'
 * } QlikDefaultSectionType
 * * 'dimensions' - Секция свойств Измерения
 * * 'measures' - Секция свойств Меры
 * * 'sorting' - Секция свойств Сортировка
 * * 'settings' - Секция свойств Вид
 */

/**
 * Типы данных свойств
 * @typedef {'items'
 *  | 'boolean'
 *  | 'integer'
 *  | 'number'
 *  | 'string'
 *  | 'object'
 * 	| 'array'
 * } QlikPropertyDataType
 * * 'items' - Список элементов интерфейса
 * * 'boolean' - Логическое значение
 * * 'integer' - Целочисленное значение
 * * 'number' - Числовое вещественное значени
 * * 'string' - Строковое значение
 * * 'object' - Объект
 * * 'array' - Массив данных
 */

/**
 * Типы данных свойств
 * @typedef {'accordion'
 * | 'expandable-items'
 * | 'switch'
 * | 'slider'
 * | 'dropdown'
 * | 'buttongroup'
 * | 'radiobuttons'
 * | 'textarea'
 * | 'text'
 * | 'item-selection-list'
 * | 'color-scale'
 * } QlikPropertyComponentType
 * * 'accordion' - Список секций, одна из которых открыта
 * * 'expandable-items' - Раскрываемая секция
 * * 'switch' - Переключатель
 * * 'slider' - Ползунок
 * * 'dropdown' - Выпадающий список
 * * 'buttongroup' - Группа кнопок
 * * 'radiobuttons' - Набор переключателей
 * * 'textarea' - Многострочное текстовое поле
 * * 'text' - Текстовая метка
 * * 'item-selection-list' - Список выбора
 * * 'color-scale' - Палитра
 */

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

/**
 * Цветовой объект
 * @typedef {Object} QlikColorObject
 * @property {Color} color Цвет
 * @property {Number} index Индекс в палитре, начинающийся с единицы; -1, если используется цветовой код
 */