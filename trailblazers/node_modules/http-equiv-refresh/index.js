const PATTERN = /^\s*(\d+)(?:\s*;(?:\s*url\s*=)?\s*(?:["']\s*(.*?)\s*['"]|(.*?)))?\s*$/i;



export default content =>
{
	content = PATTERN.exec(content);

	let timeout, url;

	if (content !== null)
	{
		timeout = parseInt(content[1], 10);

		url = content[2] || content[3] || null; // first matching group
	}
	else
	{
		timeout = null;
		url = null;
	}

	return { timeout, url };
};
