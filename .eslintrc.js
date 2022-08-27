/* eslint-disable no-undef */
module.exports = {
    env: {
        browser: true,
        es6: true,
        node: true,
        amd: true,
    },
    extends: ['eslint:recommended', 'unused-imports'],
    overrides: [],
    parserOptions: {
        ecmaVersion: '9',
        sourceType: 'module',
    },
    rules: {
        'no-empty': ['error', { allowEmptyCatch: true }],
        indent: ['error', 4],
        'linebreak-style': ['windows'],
        quotes: ['error', 'single'],
        semi: ['warn', 'always'],
        'semi-spacing': [
            'error',
            {
                before: false,
                after: false,
            },
        ],
        eqeqeq: ['error', 'smart'],
        curly: 'off',
    },
    globals: {
        $: true,
        require: true,
        process: true,
    },
    root: true,
};
