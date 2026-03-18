/**
 * Runs the AI tag generation process using a streaming prompt.
 * @param {Object} session - The Language Model session.
 * @param {string} content - The content to generate tags for.
 * @param {Object} schema - The JSON schema for the response.
 * @param {Function} addTags - Callback to add generated tags to the collection.
 * @param {boolean} isRestricted - Whether to use the provided schema or a generic one.
 * @return {Promise<void>}
 */
export async function runTagGeneration(
  session,
  content,
  schema,
  addTags,
  isRestricted,
) {
  let full = '';
  const stream = session.promptStreaming(`Content: ${content}`, {
    responseConstraint: isRestricted
      ? schema
      : {
          type: 'object',
          properties: {
            tags: { type: 'array', items: { type: 'string' } },
          },
        },
  });
  for await (const chunk of stream) {
    full += chunk;
    try {
      addTags(JSON.parse(full).tags);
    } catch (e) {
      // Ignore partial JSON parsing errors
    }
  }
}
