const selectorReg = /^([^#\.\[]+)?(?:#([^\.\[]+))?(?:\.((?:[^\[\]\\]|\\.)+))?((?:\[[^\]]*\])+)?$/; // eslint-disable-line
const attributeReg = /^([a-zA-Z0-9_-]*[^~|^$*!=])(?:([~|^$*!]?)=['"]?([^'"]*)['"]?)?$/;
const splitReg = /\s*,\s*/;

function expandMatcher(matcher) {
  if (typeof matcher === "string") {
    const match = matcher.match(selectorReg);

    if (match) {
      matcher = {};
      const tag = match[1];
      const id = match[2];
      const className = match[3];
      const attrs = match[4];
      let attributes;

      if (tag) {
        matcher.tag = tag;
      }

      if (attrs) {
        attributes = expandAttributes(attrs);
      } else if (id || className) {
        attributes = {};
      }

      if (id) {
        attributes.id = id;
      }

      if (className) {
        attributes.class = new RegExp(getCombinations(className.split(".")).map((order) => {
          return "(?:^|\\s)" + order.join("\\s(?:.*?\\s)?") + "(?:\\s|$)";
        }).join("|"));
      }

      if (attributes) {
        matcher.attrs = attributes;
      }
    } else {
      matcher = {tag: matcher};
    }
  }

  return matcher;
}

function cssAttrToRegExp(value, operator) {
  let reg;

  switch (operator) {
    case "~":
      reg = "(?:^|\\s)" + value + "(?:\\s|$)";
      break;

    case "|":
      reg = "^" + value + "(?:-|$)";
      break;

    case "^":
      reg = "^" + value;
      break;

    case "$":
      reg = value + "$";
      break;

    case "*":
      reg = value;
      break;

    case "!":
      reg = "^((?!" + value + ")[\\s\\S])*$";
      break;

    default:
      reg = "^" + value + "$";
      break;
  }

  return new RegExp(reg);
}

function expandAttributes(attrs) {
  attrs = attrs.slice(1, -1);

  if (attrs.length > 0) {
    attrs = attrs.split("][");
    const attrObject = {};
    let l = attrs.length;
    let attrMatch;
    let name;
    let operator;
    let value;

    while (l--) {
      attrMatch = attrs[l].match(attributeReg);

      if (attrMatch) {
        name = attrMatch[1];
        operator = attrMatch[2];
        value = attrMatch[3];

        if (!value) {
          value = true;
        }

        attrObject[name] = (operator) ? cssAttrToRegExp(value, operator) : value;
      }
    }

    return attrObject;
  }
}

function getCombinations(values, subresult) {
  subresult = subresult || [];
  let result = [];

  for (const value of values) {
    if (subresult.indexOf(value) < 0) {
      const _subresult = subresult.concat([value]);

      if (_subresult.length < values.length) {
        result = result.concat(getCombinations(values, _subresult));
      } else {
        result.push(_subresult);
      }
    }
  }

  return result;
}

export default function (matcher) {
  if (typeof matcher === "string") {
    if (matcher.match(splitReg)) {
      matcher = matcher.split(splitReg);
    } else {
      return expandMatcher(matcher);
    }
  }

  if (Array.isArray(matcher)) {
    return matcher.map(expandMatcher);
  }

  return matcher;
}
