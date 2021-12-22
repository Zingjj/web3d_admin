module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:vue/essential', '@vue/prettier'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'prettier/prettier': [
      'error',
      {
        semi: true, // 语句结尾强制添加分号
        singleQuote: false // 强制使用单引号
      }
    ]
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
