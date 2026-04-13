"use strict";
const DEFAULT_OPTIONS = require("./defaultOptions");
const evaluateValue = require("evaluate-value");
const list2Array = require("list-to-array");
const parseMetaRefresh = require("http-equiv-refresh");
const parseSrcset = require("parse-srcset");

const CONTENT_ATTR = "content";
const PING_ATTR = "ping";
const SRCSET_ATTR = "srcset";

const DELIMITER = ",";
const EMPTY_STRING = "";
const EMPTY_TAG_GROUP = Object.freeze({});
const FUNCTION_TYPE = "function";
const PRETTY_DELIMITER = ", ";



const plugin = options =>
{
	const {eachURL, filter} = Object.assign({}, DEFAULT_OPTIONS, options);

	if (typeof eachURL !== FUNCTION_TYPE)
	{
		throw new TypeError("eachURL option must be a function");
	}

	// const tagMatchers = Object.keys(filter).map(tagName => ({ tag: tagName }));

	// Called by PostHTML
	return tree =>
	{
		const promises = [];

		tree.walk(node =>
		// tree.match(tagMatchers, (node) =>
		{
			if (node.attrs === undefined) {
				return node;
			}

			const tagGroup = filter[node.tag] || EMPTY_TAG_GROUP;

			Object.keys(node.attrs).forEach(attrName =>
			{
				const isAcceptedTagAttr = attrName in tagGroup && evaluateValue(tagGroup[attrName], node, attrName);

				if (isAcceptedTagAttr)
				{
					switch (attrName)
					{
						case CONTENT_ATTR:
						{
							promises.push( transformMetaRefresh(node, attrName, eachURL) );
							break;
						}
						case PING_ATTR:
						{
							promises.push( transformCommaSeparated(node, attrName, eachURL) );
							break;
						}
						case SRCSET_ATTR:
						{
							promises.push( transformSrcset(node, attrName, eachURL) );
							break;
						}
						default:
						{
							promises.push( transformDefault(node, attrName, eachURL) );
						}
					}
				}
			});

			return node;
		});

		return Promise.all(promises).then(() => tree);
	};
};



const transformCommaSeparated = (node, attrName, transformer) =>
{
	const {attrs, tag} = node;
	const urls = list2Array( attrs[attrName], DELIMITER );

	if (urls.length > 0)
	{
		const promises = urls.map(value => Promise.resolve( transformer(value, attrName, tag, node) ));

		return Promise.all(promises).then(newUrls => attrs[attrName] = newUrls.join(PRETTY_DELIMITER));
	}
};



const transformDefault = (node, attrName, transformer) =>
{
	const {attrs, tag} = node;
	return Promise.resolve( transformer( attrs[attrName], attrName, tag, node ) )
	.then(newUrl => attrs[attrName] = newUrl);
};



const transformMetaRefresh = (node, attrName, transformer) =>
{
	const {attrs, tag} = node;
	const {timeout, url} = parseMetaRefresh( attrs[attrName] );

	if (timeout !== null)
	{
		return Promise.resolve( transformer(url || "", attrName, tag, node) )
		.then(newUrl => attrs[attrName] = `${timeout}; url=${newUrl}`);
	}
};



const transformSrcset = (node, attrName, transformer) =>
{
	const {attrs, tag} = node;
	const values = parseSrcset( attrs[attrName] );

	if (values.length > 0)
	{
		const promises = values.map(({d, h, url, w}) => Promise.resolve( transformer(url, attrName, tag, node) )
		.then(newUrl =>
		{
			d = d !== undefined ? ` ${d}x` : EMPTY_STRING;
			h = h !== undefined ? ` ${h}h` : EMPTY_STRING;
			w = w !== undefined ? ` ${w}w` : EMPTY_STRING;

			return `${newUrl}${w}${h}${d}`;
		}));

		return Promise.all(promises).then(newValues => attrs[attrName] = newValues.join(PRETTY_DELIMITER));
	}
};



module.exports = plugin;
