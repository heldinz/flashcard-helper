import order from './sort-order.js';

const defaultOptions = {
	emptyLineBefore: 'always',
	noEmptyLineBetween: true,
};
const secondaryOptions = {
	unspecified: 'bottomAlphabetical',
	emptyLineBeforeUnspecified: 'always',
};

/**
 * Returns an array of group objects for `stylelint-order` config
 * @param {Object} options - Optional group properties
 * @return {Array}
 */
export default (options = defaultOptions) => {
	const keys = Object.keys(order);

	const primaryOption = keys.reduce((config, key) => {
		const groupName = key;
		const groupCurrent = order[key];
		const hasNestedGroups = groupCurrent.every((item) => Array.isArray(item));

		let properties = groupCurrent;

		if (hasNestedGroups) {
			properties = groupCurrent.reduce((arr, item) => [...arr, ...item], []);
		}

		return [...config, { groupName, ...options, properties }];
	}, []);

	return [primaryOption, secondaryOptions];
};
