function attributeEntryToString(attribute, context) {
  let [key, value] = attribute;

  if (typeof value === "function") { // Callback must return a string or a number
    value = value(context); // Run the provided callback and store the result
  }

  if (typeof value !== "string" && typeof value !== "number") {
    throw new Error(
      `Attribute "${key}" must have, or evaluate to, a value of type string or number, not "${typeof value}".`
    );
  }

  return `${key}="${value}"`;
}

/**
 * ## Usage
 * The function `getAttributes` is used to convert an object, `attributes`, with HTML attributes as keys and the values as the corresponding HTML attribute's values.
 * If it is falsey, an empty string will be returned.
 *
 * ```js
  getAttributes({
    tabindex: 0,
    'data-language': function (context) { return context.language; },
    'data-otherStuff': 'value'
  }) // => ' tabindex="0" data-language="JavaScript" data-otherStuff="value"'
  ```
 *
 * @param {{[s: string]: string | number}} attributes An object with key-value pairs that represent attributes.
 * @param {object} context An object with the current context.
 * @param {string} context.content The code to parse and highlight.
 * @param {string} context.language The language for the current instance.
 * @param {object} context.options The options passed to the syntax highlighter.
 * @returns {string} A string containing the above HTML attributes preceded by a single space.
 */
function getAttributes(attributes, context = {}) {
  let langClass = context.language ? `language-${context.language}` : "";

  if (!attributes) {
    return langClass ? ` class="${langClass}"` : "";
  } else if (typeof attributes === "object") {
    if(!("class" in attributes) && langClass) {
      // class attribute should be first in order
      let tempAttrs = { class: langClass };
      for(let key in attributes) {
        tempAttrs[key] = attributes[key];
      }
      attributes = tempAttrs;
    }

    const formattedAttributes = Object.entries(attributes).map(
      entry => attributeEntryToString(entry, context)
    );

    return formattedAttributes.length ? ` ${formattedAttributes.join(" ")}` : "";
  } else if (typeof attributes === "string") {
    throw new Error("Syntax highlighter plugin custom attributes on <pre> and <code> must be an object. Received: " + JSON.stringify(attributes));
  }
}

module.exports = getAttributes;
