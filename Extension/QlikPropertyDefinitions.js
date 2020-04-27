/**
 * Построитель пользовательских свойств для расширения Qlik
 */
define(
	[],

	/**
	 * Возвращает API построителя определений свойств
	 * @returns {QlikPropertyFactory} API построителя определений свойств
	 */
	function () {
		'use strict';

		return {
			sections: sections,

			dimensions: dimensions,
			measures: measures,
			sorting: sorting,
			settings: settings,
			expandableItems: expandableItems,

			items: items
		};

		/**
		 * @returns {ItemsBuilder}
		 */
		function sections() {
			/** @type {QlikPropertyDefinition} */
			var state = {
				type: 'items',
				component: 'accordion',
				items: {}
			};

			var builder = { };
			appendAddFunction(builder, state);
			appendBuildFunction(builder, state);
			return builder;
		}

		/**
		 * @returns {QlikPropertyDefinition}
		 */
		function dimensions(minCount, maxCount) {
			/** @type {QlikPropertyDefinition} */
			var state = {
				uses: 'dimensions',
				min: minCount,
				max: maxCount,
				items: {}
			};

			var builder = { };
			appendAddFunction(builder, state);
			appendBuildFunction(builder, state);
			return builder;
		}

		/**
		 * @returns {QlikPropertyDefinition}
		 */
		function measures(minCount, maxCount) {
			/** @type {QlikPropertyDefinition} */
			var state = {
				uses: 'measures',
				min: minCount,
				max: maxCount,
				items: {}
			};

			var builder = { };
			appendAddFunction(builder, state);
			appendBuildFunction(builder, state);
			return builder;
		}

		/**
		 * @returns {QlikPropertyDefinition}
		 */
		function sorting() {
			/** @type {QlikPropertyDefinition} */
			var state = {
				uses: 'sorting',
				items: {}
			};

			var builder = { };
			appendAddFunction(builder, state);
			appendBuildFunction(builder, state);
			return builder;
		}

		/**
		 * @returns {QlikPropertyDefinition}
		 */
		function settings() {
			/** @type {QlikPropertyDefinition} */
			var state = {
				uses: 'settings',
				items: {}
			};

			var builder = { };
			appendAddFunction(builder, state);
			appendBuildFunction(builder, state);
			return builder;
		}

		/**
		 * @param {String} title
		 * @returns {QlikPropertyDefinition}
		 */
		function expandableItems(title) {
			/** @type {QlikPropertyDefinition} */
			var state = {
				type: 'items',
				component: 'expandable-items',
				label: title,
				items: {}
			};

			var builder = { };
			appendAddFunction(builder, state);
			appendVisibleFunction(builder, state);
			appendBuildFunction(builder, state);
			return builder;
		}

		/**
		 * @param {String} title
		 * @returns {QlikPropertyDefinition}
		 */
		function items(title) {
			/** @type {QlikPropertyDefinition} */
			var state = {
				type: 'items',
				label: title,
				items: {}
			};

			var builder = { };
			appendAddFunction(builder, state);
			appendVisibleFunction(builder, state);
			appendBuildFunction(builder, state);
			return builder;
		}

		/**
		 * @param {PropertyDefinitionBuilder} builder 
		 * @param {QlikPropertyDefinition} state 
		 */
		function appendAddFunction(builder, state) {
			builder.add = function (property) {
				// Автогенерация названия для свойства 
				var key = 0;
				for (var _ in state.items) {
					key += 1;
				}

				// Для построителя
				if (typeof(property) === 'object' &&
					typeof(property.build) === 'function') {
					// Построить определение свойства
					property = property.build();
				}

				state.items[key] = property;
				
				return builder;
			};
		}

		/**
		 * @param {PropertyDefinitionBuilder} builder 
		 * @param {QlikPropertyDefinition} state 
		 */
		function appendVisibleFunction(builder, state) {
			builder.visible = function (visibility) {
				state.show = visibility;
				return builder;
			};
		}

		/**
		 * @param {PropertyDefinitionBuilder} builder 
		 * @param {QlikPropertyDefinition} state 
		 */
		function appendBuildFunction(builder, state) {
			builder.build = function () {
				return state;
			};
		}
	}
);

/**
 * @typedef {Object} QlikPropertyFactory
 * @property {function(): ItemsBuilder} sections
 * @property {ColumnsFunction} dimensions
 * @property {ColumnsFunction} measures
 * @property {function(): ItemsBuilder} sorting
 * @property {function(): ItemsBuilder} settings
 * @property {TitledItemsBuilderFunction} expandableItems
 * @property {TitledItemsBuilderFunction} items
 */

/**
 * @callback TitledItemsBuilderFunction
 * @param {String} title
 * @returns {ItemsBuilder}
 */

/**
 * @callback ColumnsFunction
 * @param {Number} minCount Минимальное число измерений
 * @param {Number} maxCount Максимальное число измерений
 * @returns {ItemsBuilder} Построитель набора элементов
 */

/**
 * @typedef {Object} _ItemsBuilder
 * @property {function(QlikPropertyDefinition): ItemsBuilder} add
 * @property {Boolean|VisibleFunction} visible
 */
/**
 * @typedef {_ItemsBuilder & PropertyDefinitionBuilder} ItemsBuilder
 */

/** 
 * @callback VisibleFunction
 * @param {*} context
 * @returns {Boolean|Promise<Boolean>}
*/

/**
 * @typedef {Object} PropertyDefinitionBuilder
 * @property {function(): QlikPropertyDefinition} build
 */