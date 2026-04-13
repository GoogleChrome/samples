// lib/v4/isZodErrorLike.ts
function isZodErrorLike(err) {
  return err instanceof Object && "name" in err && (err.name === "ZodError" || err.name === "$ZodError") && "issues" in err && Array.isArray(err.issues);
}

// lib/v4/ValidationError.ts
var ZOD_VALIDATION_ERROR_NAME = "ZodValidationError";
var ValidationError = class extends Error {
  name;
  details;
  constructor(message, options) {
    super(message, options);
    this.name = ZOD_VALIDATION_ERROR_NAME;
    this.details = getIssuesFromErrorOptions(options);
  }
  toString() {
    return this.message;
  }
};
function getIssuesFromErrorOptions(options) {
  if (options) {
    const cause = options.cause;
    if (isZodErrorLike(cause)) {
      return cause.issues;
    }
  }
  return [];
}

// lib/v4/isValidationError.ts
function isValidationError(err) {
  return err instanceof ValidationError;
}

// lib/v4/isValidationErrorLike.ts
function isValidationErrorLike(err) {
  return err instanceof Error && err.name === ZOD_VALIDATION_ERROR_NAME;
}

// lib/v4/errorMap/custom.ts
function parseCustomIssue(issue) {
  return {
    type: issue.code,
    path: issue.path,
    message: issue.message ?? "Invalid input"
  };
}

// lib/v4/errorMap/invalidElement.ts
function parseInvalidElementIssue(issue) {
  return {
    type: issue.code,
    path: issue.path,
    message: `unexpected element in ${issue.origin}`
  };
}

// lib/v4/errorMap/invalidKey.ts
function parseInvalidKeyIssue(issue) {
  return {
    type: issue.code,
    path: issue.path,
    message: `unexpected key in ${issue.origin}`
  };
}

// lib/utils/prependWithAOrAn.ts
var vowelSoundCharSet = /* @__PURE__ */ new Set(["a", "e", "i", "o", "u", "h"]);
function prependWithAOrAn(value) {
  const firstLetter = value.charAt(0).toLowerCase();
  const prefix = vowelSoundCharSet.has(firstLetter) ? "an" : "a";
  return [prefix, value].join(" ");
}

// lib/utils/stringify.ts
function stringifySymbol(symbol) {
  return symbol.description ?? "";
}
function stringify(value, options = {}) {
  switch (typeof value) {
    case "symbol":
      return stringifySymbol(value);
    case "bigint":
    case "number": {
      switch (options.localization) {
        case true:
          return value.toLocaleString();
        case false:
          return value.toString();
        default:
          return value.toLocaleString(options.localization);
      }
    }
    case "string": {
      if (options.wrapStringValueInQuote) {
        return `"${value}"`;
      }
      return value;
    }
    default: {
      if (value instanceof Date) {
        switch (options.localization) {
          case true:
            return value.toLocaleString();
          case false:
            return value.toISOString();
          default:
            return value.toLocaleString(options.localization);
        }
      }
      return String(value);
    }
  }
}

// lib/v4/errorMap/invalidStringFormat.ts
function parseInvalidStringFormatIssue(issue, options) {
  let message = "";
  switch (issue.format) {
    case "lowercase":
    case "uppercase":
      message += `expected ${issue.format} string`;
      break;
    case "starts_with": {
      message += `expected string to start with "${issue.prefix}"`;
      break;
    }
    case "ends_with": {
      message += `expected string to end with "${issue.suffix}"`;
      break;
    }
    case "includes": {
      message += `expected string to include "${issue.includes}"`;
      break;
    }
    case "regex": {
      message += "expected string to match pattern";
      if (options.displayInvalidFormatDetails) {
        message += ` "${issue.pattern}"`;
      }
      break;
    }
    case "jwt": {
      message += "expected a jwt";
      if (options.displayInvalidFormatDetails && issue.inst && "alg" in issue.inst._zod.def) {
        message += `/${issue.inst._zod.def.alg}`;
      }
      message += " token";
      break;
    }
    case "email": {
      message += "expected an email address";
      break;
    }
    case "url":
    case "uuid":
    case "guid":
    case "cuid":
    case "cuid2":
    case "ulid":
    case "xid":
    case "ksuid": {
      message += `expected a ${issue.format.toUpperCase()}`;
      if (issue.inst && "version" in issue.inst._zod.def) {
        message += ` ${issue.inst._zod.def.version}`;
      }
      break;
    }
    case "date":
    case "datetime":
    case "time":
    case "duration": {
      message += `expected an ISO ${issue.format}`;
      break;
    }
    case "ipv4":
    case "ipv6": {
      message += `expected an ${issue.format.slice(0, 2).toUpperCase()}${issue.format.slice(2)} address`;
      break;
    }
    case "cidrv4":
    case "cidrv6": {
      message += `expected a ${issue.format.slice(0, 4).toUpperCase()}${issue.format.slice(4)} address range`;
      break;
    }
    case "base64":
    case "base64url": {
      message += `expected a ${issue.format} encoded string`;
      break;
    }
    case "e164": {
      message += "expected an E.164 formatted phone number";
      break;
    }
    default: {
      if (issue.format.startsWith("sha") || issue.format.startsWith("md5")) {
        const [alg, encoding] = issue.format.split("_");
        message += `expected a ${alg.toUpperCase()}`;
        if (encoding) {
          message += ` ${encoding}-encoded`;
        }
        message += ` hash`;
        break;
      }
      message += `expected ${prependWithAOrAn(issue.format)}`;
    }
  }
  if ("input" in issue && options.reportInput === "typeAndValue") {
    const valueStr = stringify(issue.input, {
      wrapStringValueInQuote: true,
      localization: options.numberLocalization
    });
    message += `, received ${valueStr}`;
  }
  return {
    type: issue.code,
    path: issue.path,
    message
  };
}

// lib/utils/isPrimitive.ts
function isPrimitive(value) {
  if (value === null) {
    return true;
  }
  switch (typeof value) {
    case "string":
    case "number":
    case "bigint":
    case "boolean":
    case "symbol":
    case "undefined":
      return true;
    default:
      return false;
  }
}

// lib/v4/errorMap/invalidType.ts
function parseInvalidTypeIssue(issue, options) {
  let message = `expected ${issue.expected}`;
  if ("input" in issue && options.reportInput !== false) {
    const value = issue.input;
    message += `, received ${getTypeName(value)}`;
    if (options.reportInput === "typeAndValue") {
      if (isPrimitive(value)) {
        const valueStr = stringify(value, {
          wrapStringValueInQuote: true,
          localization: options.numberLocalization
        });
        message += ` (${valueStr})`;
      } else if (value instanceof Date) {
        const valueStr = stringify(value, {
          localization: options.dateLocalization
        });
        message += ` (${valueStr})`;
      }
    }
  }
  return {
    type: issue.code,
    path: issue.path,
    message
  };
}
function getTypeName(value) {
  if (typeof value === "object") {
    if (value === null) {
      return "null";
    }
    if (value === void 0) {
      return "undefined";
    }
    if (Array.isArray(value)) {
      return "array";
    }
    if (value instanceof Date) {
      return "date";
    }
    if (value instanceof RegExp) {
      return "regexp";
    }
    if (value instanceof Map) {
      return "map";
    }
    if (value instanceof Set) {
      return "set";
    }
    if (value instanceof Error) {
      return "error";
    }
    if (value instanceof Function) {
      return "function";
    }
    return "object";
  }
  return typeof value;
}

// lib/v4/errorMap/invalidUnion.ts
function parseInvalidUnionIssue(issue) {
  return {
    type: issue.code,
    path: issue.path,
    message: issue.message ?? "Invalid input"
  };
}

// lib/utils/joinValues.ts
function joinValues(values, options) {
  const valuesToDisplay = (options.maxValuesToDisplay ? values.slice(0, options.maxValuesToDisplay) : values).map((value) => {
    return stringify(value, {
      wrapStringValueInQuote: options.wrapStringValuesInQuote
    });
  });
  if (valuesToDisplay.length < values.length) {
    valuesToDisplay.push(
      `${values.length - valuesToDisplay.length} more value(s)`
    );
  }
  return valuesToDisplay.reduce((acc, value, index) => {
    if (index > 0) {
      if (index === valuesToDisplay.length - 1 && options.lastSeparator) {
        acc += options.lastSeparator;
      } else {
        acc += options.separator;
      }
    }
    acc += value;
    return acc;
  }, "");
}

// lib/v4/errorMap/invalidValue.ts
function parseInvalidValueIssue(issue, options) {
  let message;
  if (issue.expected === "stringbool") {
    message = "expected boolean as string";
  } else if (issue.values.length === 0) {
    message = "invalid value";
  } else if (issue.values.length === 1) {
    const valueStr = stringify(issue.values[0], {
      wrapStringValueInQuote: true
    });
    message = `expected value to be ${valueStr}`;
  } else {
    const valuesStr = joinValues(issue.values, {
      separator: options.allowedValuesSeparator,
      lastSeparator: options.allowedValuesLastSeparator,
      wrapStringValuesInQuote: options.wrapAllowedValuesInQuote,
      maxValuesToDisplay: options.maxAllowedValuesToDisplay
    });
    message = `expected value to be one of ${valuesStr}`;
  }
  if ("input" in issue && options.reportInput === "typeAndValue") {
    if (isPrimitive(issue.input)) {
      const valueStr = stringify(issue.input, {
        wrapStringValueInQuote: true,
        localization: options.numberLocalization
      });
      message += `, received ${valueStr}`;
    } else if (issue.input instanceof Date) {
      const valueStr = stringify(issue.input, {
        localization: options.dateLocalization
      });
      message += `, received ${valueStr}`;
    }
  }
  return {
    type: issue.code,
    path: issue.path,
    message
  };
}

// lib/v4/errorMap/notMultipleOf.ts
function parseNotMultipleOfIssue(issue, options) {
  let message = `expected multiple of ${issue.divisor}`;
  if ("input" in issue && options.reportInput === "typeAndValue") {
    const valueStr = stringify(issue.input, {
      wrapStringValueInQuote: true,
      localization: options.numberLocalization
    });
    message += `, received ${valueStr}`;
  }
  return {
    type: issue.code,
    path: issue.path,
    message
  };
}

// lib/v4/errorMap/tooBig.ts
function parseTooBigIssue(issue, options) {
  const maxValueStr = issue.origin === "date" ? stringify(new Date(issue.maximum), {
    localization: options.dateLocalization
  }) : stringify(issue.maximum, {
    localization: options.numberLocalization
  });
  let message = "";
  switch (issue.origin) {
    case "number":
    case "int":
    case "bigint": {
      message += `expected number to be less than${issue.inclusive ? " or equal to" : ""} ${maxValueStr}`;
      break;
    }
    case "string": {
      message += `expected string to contain at most ${maxValueStr} character(s)`;
      break;
    }
    case "date": {
      message += `expected date to be prior ${issue.inclusive ? "or equal to" : "to"} "${maxValueStr}"`;
      break;
    }
    case "array": {
      message += `expected array to contain at most ${maxValueStr} item(s)`;
      break;
    }
    case "set": {
      message += `expected set to contain at most ${maxValueStr} item(s)`;
      break;
    }
    case "file": {
      message += `expected file to not exceed ${maxValueStr} byte(s) in size`;
      break;
    }
    default: {
      message += `expected value to be less than${issue.inclusive ? " or equal to" : ""} ${maxValueStr}`;
    }
  }
  if ("input" in issue && options.reportInput === "typeAndValue") {
    const value = issue.input;
    if (isPrimitive(value)) {
      const valueStr = stringify(value, {
        wrapStringValueInQuote: true,
        localization: options.numberLocalization
      });
      message += `, received ${valueStr}`;
    } else if (value instanceof Date) {
      const valueStr = stringify(value, {
        localization: options.dateLocalization
      });
      message += `, received ${valueStr}`;
    }
  }
  return {
    type: issue.code,
    path: issue.path,
    message
  };
}

// lib/v4/errorMap/tooSmall.ts
function parseTooSmallIssue(issue, options) {
  const minValueStr = issue.origin === "date" ? stringify(new Date(issue.minimum), {
    localization: options.dateLocalization
  }) : stringify(issue.minimum, {
    localization: options.numberLocalization
  });
  let message = "";
  switch (issue.origin) {
    case "number":
    case "int":
    case "bigint": {
      message += `expected number to be greater than${issue.inclusive ? " or equal to" : ""} ${minValueStr}`;
      break;
    }
    case "date": {
      message += `expected date to be ${issue.inclusive ? "later or equal to" : "later to"} "${minValueStr}"`;
      break;
    }
    case "string": {
      message += `expected string to contain at least ${minValueStr} character(s)`;
      break;
    }
    case "array": {
      message += `expected array to contain at least ${minValueStr} item(s)`;
      break;
    }
    case "set": {
      message += `expected set to contain at least ${minValueStr} item(s)`;
      break;
    }
    case "file": {
      message += `expected file to be at least ${minValueStr} byte(s) in size`;
      break;
    }
    default:
      message += `expected value to be greater than${issue.inclusive ? " or equal to" : ""} ${minValueStr}`;
  }
  if ("input" in issue && options.reportInput === "typeAndValue") {
    const value = issue.input;
    if (isPrimitive(value)) {
      const valueStr = stringify(value, {
        wrapStringValueInQuote: true,
        localization: options.numberLocalization
      });
      message += `, received ${valueStr}`;
    } else if (value instanceof Date) {
      const valueStr = stringify(value, {
        localization: options.dateLocalization
      });
      message += `, received ${valueStr}`;
    }
  }
  return {
    type: issue.code,
    path: issue.path,
    message
  };
}

// lib/v4/errorMap/unrecognizedKeys.ts
function parseUnrecognizedKeysIssue(issue, options) {
  const keysStr = joinValues(issue.keys, {
    separator: options.unrecognizedKeysSeparator,
    lastSeparator: options.unrecognizedKeysLastSeparator,
    wrapStringValuesInQuote: options.wrapUnrecognizedKeysInQuote,
    maxValuesToDisplay: options.maxUnrecognizedKeysToDisplay
  });
  return {
    type: issue.code,
    path: issue.path,
    message: `unrecognized key(s) ${keysStr} in object`
  };
}

// lib/v4/errorMap/errorMap.ts
var issueParsers = {
  invalid_type: parseInvalidTypeIssue,
  too_big: parseTooBigIssue,
  too_small: parseTooSmallIssue,
  invalid_format: parseInvalidStringFormatIssue,
  invalid_value: parseInvalidValueIssue,
  invalid_element: parseInvalidElementIssue,
  not_multiple_of: parseNotMultipleOfIssue,
  unrecognized_keys: parseUnrecognizedKeysIssue,
  invalid_key: parseInvalidKeyIssue,
  custom: parseCustomIssue,
  invalid_union: parseInvalidUnionIssue
};
var defaultErrorMapOptions = {
  reportInput: "type",
  displayInvalidFormatDetails: false,
  allowedValuesSeparator: ", ",
  allowedValuesLastSeparator: " or ",
  wrapAllowedValuesInQuote: true,
  maxAllowedValuesToDisplay: 10,
  unrecognizedKeysSeparator: ", ",
  unrecognizedKeysLastSeparator: " and ",
  wrapUnrecognizedKeysInQuote: true,
  maxUnrecognizedKeysToDisplay: 5,
  dateLocalization: true,
  numberLocalization: true
};
function createErrorMap(partialOptions = {}) {
  const options = {
    ...defaultErrorMapOptions,
    ...partialOptions
  };
  const errorMap = (issue) => {
    if (issue.code === void 0) {
      return "Not supported issue type";
    }
    const parseFunc = issueParsers[issue.code];
    const ast = parseFunc(issue, options);
    return ast.message;
  };
  return errorMap;
}

// lib/utils/NonEmptyArray.ts
function isNonEmptyArray(value) {
  return value.length !== 0;
}

// lib/utils/joinPath.ts
var identifierRegex = /[$_\p{ID_Start}][$\u200c\u200d\p{ID_Continue}]*/u;
function joinPath(path) {
  if (path.length === 1) {
    let propertyKey = path[0];
    if (typeof propertyKey === "symbol") {
      propertyKey = stringifySymbol(propertyKey);
    }
    return propertyKey.toString() || '""';
  }
  return path.reduce((acc, propertyKey) => {
    if (typeof propertyKey === "number") {
      return acc + "[" + propertyKey.toString() + "]";
    }
    if (typeof propertyKey === "symbol") {
      propertyKey = stringifySymbol(propertyKey);
    }
    if (propertyKey.includes('"')) {
      return acc + '["' + escapeQuotes(propertyKey) + '"]';
    }
    if (!identifierRegex.test(propertyKey)) {
      return acc + '["' + propertyKey + '"]';
    }
    const separator = acc.length === 0 ? "" : ".";
    return acc + separator + propertyKey;
  }, "");
}
function escapeQuotes(str) {
  return str.replace(/"/g, '\\"');
}

// lib/utils/titleCase.ts
function titleCase(value) {
  if (value.length === 0) {
    return value;
  }
  return value.charAt(0).toUpperCase() + value.slice(1);
}

// lib/v4/MessageBuilder.ts
var defaultMessageBuilderOptions = {
  prefix: "Validation error",
  prefixSeparator: ": ",
  maxIssuesInMessage: 99,
  // I've got 99 problems but the b$tch ain't one
  unionSeparator: " or ",
  issueSeparator: "; ",
  includePath: true,
  forceTitleCase: true
};
function createMessageBuilder(partialOptions = {}) {
  const options = {
    ...defaultMessageBuilderOptions,
    ...partialOptions
  };
  return function messageBuilder(issues) {
    const message = issues.slice(0, options.maxIssuesInMessage).map((issue) => mapIssue(issue, options)).join(options.issueSeparator);
    return conditionallyPrefixMessage(message, options);
  };
}
function mapIssue(issue, options) {
  if (issue.code === "invalid_union" && isNonEmptyArray(issue.errors)) {
    const individualMessages = issue.errors.map(
      (issues) => issues.map(
        (subIssue) => mapIssue(
          {
            ...subIssue,
            path: issue.path.concat(subIssue.path)
          },
          options
        )
      ).join(options.issueSeparator)
    );
    return Array.from(new Set(individualMessages)).join(options.unionSeparator);
  }
  const buf = [];
  if (options.forceTitleCase) {
    buf.push(titleCase(issue.message));
  } else {
    buf.push(issue.message);
  }
  pathCondition: if (options.includePath && issue.path !== void 0 && isNonEmptyArray(issue.path)) {
    if (issue.path.length === 1) {
      const identifier = issue.path[0];
      if (typeof identifier === "number") {
        buf.push(` at index ${identifier}`);
        break pathCondition;
      }
    }
    buf.push(` at "${joinPath(issue.path)}"`);
  }
  return buf.join("");
}
function conditionallyPrefixMessage(message, options) {
  if (options.prefix != null) {
    if (message.length > 0) {
      return [options.prefix, message].join(options.prefixSeparator);
    }
    return options.prefix;
  }
  if (message.length > 0) {
    return message;
  }
  return defaultMessageBuilderOptions.prefix;
}

// lib/v4/fromZodError.ts
function fromZodError(zodError, options = {}) {
  if (!isZodErrorLike(zodError)) {
    throw new TypeError(
      `Invalid zodError param; expected instance of ZodError. Did you mean to use the "${fromError.name}" method instead?`
    );
  }
  return fromZodErrorWithoutRuntimeCheck(zodError, options);
}
function fromZodErrorWithoutRuntimeCheck(zodError, options = {}) {
  const zodIssues = zodError.issues;
  let message;
  if (isNonEmptyArray(zodIssues)) {
    const messageBuilder = createMessageBuilderFromOptions(options);
    message = messageBuilder(zodIssues);
  } else {
    message = zodError.message;
  }
  return new ValidationError(message, { cause: zodError });
}
function createMessageBuilderFromOptions(options) {
  if ("messageBuilder" in options) {
    return options.messageBuilder;
  }
  return createMessageBuilder(options);
}

// lib/v4/toValidationError.ts
var toValidationError = (options = {}) => (err) => {
  if (isZodErrorLike(err)) {
    return fromZodErrorWithoutRuntimeCheck(err, options);
  }
  if (err instanceof Error) {
    return new ValidationError(err.message, { cause: err });
  }
  return new ValidationError("Unknown error");
};

// lib/v4/fromError.ts
function fromError(err, options = {}) {
  return toValidationError(options)(err);
}

// lib/v4/fromZodIssue.ts
import * as zod from "zod/v4/core";
function fromZodIssue(issue, options = {}) {
  const messageBuilder = createMessageBuilderFromOptions2(options);
  const message = messageBuilder([issue]);
  return new ValidationError(message, {
    cause: new zod.$ZodRealError([issue])
  });
}
function createMessageBuilderFromOptions2(options) {
  if ("messageBuilder" in options) {
    return options.messageBuilder;
  }
  return createMessageBuilder(options);
}
export {
  ValidationError,
  createErrorMap,
  createMessageBuilder,
  fromError,
  fromZodError,
  fromZodIssue,
  isValidationError,
  isValidationErrorLike,
  isZodErrorLike,
  toValidationError
};
//# sourceMappingURL=index.mjs.map