import sortOrderSmacss from './stylelint/generate.js';

const sortOrder = sortOrderSmacss();

export default {
	extends: ['stylelint-config-standard'],
	plugins: ['stylelint-order'],
	rules: {
		'declaration-empty-line-before': null,
		'order/order': [
			['dollar-variables', 'declarations'],
			{
				unspecified: 'ignore',
			},
		],
		'order/properties-order': sortOrder,
	},
};
