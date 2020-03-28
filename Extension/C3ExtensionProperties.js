/**
 * Настройки расширения C3Extension
 */
define(
    // Зависимости    
    [],

    /**
	 * Создаёт модуль
	 * @returns Модуль
	 */
    function () {
        'use strict';

        // Определения свойств
        var propertyDefinitions = {
            type: 'items',
            component: 'accordion',
            items: {
                // Блок свойств Измерения
                dimensions: {
                    uses: 'dimensions',
                    min: 1,
                    max: 1
                },
                // Блок свойств Меры
                measures: {
                    uses: 'measures',
                    min: 1,
                    max: 10
                },
                // Блок свойств Сортировка
                sorting: {
                    uses: 'sorting'
                },
                // Блок свойств Вид
                settings: {
                    uses: 'settings'
                }
            }
        };

        return {
            // Определения свойств, настраиваемых пользователем в боковой панели
            definitions: propertyDefinitions
        };
    }
);