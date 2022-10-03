module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "plugin:prettier/recommended",
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    "vue/no-deprecated-v-bind-sync": "off",
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
  },
};

// "eslintConfig": {
//   "root": true,
//   "env": {
//     "node": true
//   },
//   "extends": [
//     "plugin:vue/essential",
//     "eslint:recommended"
//   ],
//   "parserOptions": {
//     "parser": "@babel/eslint-parser"
//   },
//   "rules": {}
// },
// "browserslist": [
//   "> 1%",
//   "last 2 versions",
//   "not dead"
// ]
