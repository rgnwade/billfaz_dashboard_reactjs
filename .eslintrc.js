module.exports = {
  "extends": [
    "airbnb"
  ],
  "parser": "babel-eslint",
  "env": {
    "browser": true,
    "jasmine": true,
    "node": true,
    "es6": true
  },
  "plugins": [
    "prettier"
  ],
  "rules": {
    "react/jsx-filename-extension": [1, { "extensions": [".js"] }],
    "semi": ["error", "never"],
    "import/first": "off",
    "react/no-danger": "off",
    "react/forbid-prop-types": "off",
    "jsx-a11y/anchor-is-valid": "off",
    "no-unused-expressions": [2, { "allowTernary": true,  "allowShortCircuit": true }],
    "no-param-reassign": ["error", { "props": false }],
    "jsx-a11y/label-has-for": "off",
    "no-plusplus": "off",
    "jsx-a11y/click-events-have-key-events": "off",
    "react/no-array-index-key": "off",
    "jsx-a11y/no-static-element-interactions": "off",
    "max-len": "off",
    "react/no-did-mount-set-state": "off",
    "import/prefer-default-export": "off",
    "import/no-named-as-default": "off",
    "react/no-string-refs": "off",
    "no-nested-ternary": "off",
    "object-curly-newline": "off",
    "react/jsx-one-expression-per-line": "off",
    "react/destructuring-assignment": "off",
    "react/no-access-state-in-setstate": "off",
    "react/no-did-update-set-state": "off",
    "jsx-a11y/label-has-associated-control": "off"
  }
}
