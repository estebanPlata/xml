module.exports = {
  "extends": "google",
  "parserOptions": { "ecmaVersion": 8 },
  rules: {
    "linebreak-style": 0,
    "max-len": [
      "error",
      {
        "code": 170,
        "ignoreComments": true
      }
    ]
  }
};
