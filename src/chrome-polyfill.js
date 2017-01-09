/*
 * An INCOMPLETE and very naïve, non-persisting `chrome.storage` polyfill
 *
 * @author: Evo Stamatov (https://github.com/avioli)
 * @created: 2017-01-09
 * @version: 0.1.0
 */

;(function (window, undefined) {
	if (window.chrome && window.chrome.storage) {
		return;
	}

	if (!window.chrome) {
		window.chrome = {};
	}

	var storage = {};

	function get (key, callback) {
		if (key === null) {
			var clone = Object.assign({}, storage);
			callback(clone);
			return;
		}

		var result = {};

		if (typeof key === 'string') {
			result[key] = storage[key];
		} else if (Array.isArray(key)) {
			var keys = key;

			keys.forEach(function (k) {
				result[k] = storage[k];
			});
		} else {
			var items = key;

			for (var k in items) {
				if (storage[k] === undefined) {
					result[k] = items[k];
				} else {
					result[k] = storage[k];
				}
			}
		}

		callback(result);
	}

	function sanitizeArray (array) {
		return array.map(sanitizeItem)
	}

	function sanitizeObject (items) {
		var sanitizedItems = {};

		for (var k in items) {
			sanitizedItems[k] = sanitizeItem(items[k]);
		}

		return sanitizedItems;
	}

	function sanitizeItem (item) {
		if (item === undefined || item === null || typeof item === 'number' || typeof item === 'string') {
			return item;
		} else if (typeof item === 'function') {
			return {};
		} else if (Array.isArray(item)) {
			return sanitizeArray(item);
		} else if (item instanceof Date || item instanceof RegExp) {
			return String(item);
		} else if (typeof item === 'object') {
			return sanitizeObject(item);
		}
		return item;
	}

	function set (items, callback) {
		var sanitizedItems = sanitizeObject(items);

		storage = Object.assign({}, storage, sanitizedItems);

		if (callback) {
			callback();
		}
	}

	function remove (keys, callback) {
		if (typeof items === 'string') {
			keys = [keys];
		}

		var newStorage = Object.assign({}, storage);

		keys.forEach(function (key) {
			delete newStorage[key];
		});

		storage = newStorage;

		if (callback) {
			callback();
		}
	}

	window.chrome.storage = {
		local: {
			get: get,
			set: set,
			remove: remove
		},
		sync: {
			get: get,
			set: set,
			remove: remove
		}
	};
})(window);
