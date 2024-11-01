import "./chunk-PR4QN5HX.js";

// node_modules/check-password-strength/dist/index.mjs
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var src = { exports: {} };
var defaultOptions = [
  {
    id: 0,
    value: "Too weak",
    minDiversity: 0,
    minLength: 0
  },
  {
    id: 1,
    value: "Weak",
    minDiversity: 2,
    minLength: 6
  },
  {
    id: 2,
    value: "Medium",
    minDiversity: 4,
    minLength: 8
  },
  {
    id: 3,
    value: "Strong",
    minDiversity: 4,
    minLength: 10
  }
];
var passwordStrength = (password, options = defaultOptions, allowedSymbols = "!\"#$%&'()*+,-./:;<=>?@[\\\\\\]^_`{|}~") => {
  let passwordCopy = password || "";
  options[0].minDiversity = 0, options[0].minLength = 0;
  const rules = [
    {
      regex: "[a-z]",
      message: "lowercase"
    },
    {
      regex: "[A-Z]",
      message: "uppercase"
    },
    {
      regex: "[0-9]",
      message: "number"
    }
  ];
  if (allowedSymbols) {
    rules.push({
      regex: `[${allowedSymbols}]`,
      message: "symbol"
    });
  }
  let strength = {};
  strength.contains = rules.filter((rule) => new RegExp(`${rule.regex}`).test(passwordCopy)).map((rule) => rule.message);
  strength.length = passwordCopy.length;
  let fulfilledOptions = options.filter((option) => strength.contains.length >= option.minDiversity).filter((option) => strength.length >= option.minLength).sort((o1, o2) => o2.id - o1.id).map((option) => ({ id: option.id, value: option.value }));
  Object.assign(strength, fulfilledOptions[0]);
  return strength;
};
src.exports = { passwordStrength, defaultOptions };
var passwordStrength_1 = src.exports.passwordStrength = passwordStrength;
var defaultOptions_1 = src.exports.defaultOptions = defaultOptions;
var srcExports = src.exports;
var index = getDefaultExportFromCjs(srcExports);
export {
  index as default,
  defaultOptions_1 as defaultOptions,
  passwordStrength_1 as passwordStrength
};
//# sourceMappingURL=check-password-strength.js.map
