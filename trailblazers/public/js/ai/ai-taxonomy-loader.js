let cachedTaxonomy = null;

/**
 * Fetches and parses the IAB Content Taxonomy from GitHub.
 * Results are cached for subsequent calls.
 * @return {Promise<Object>} A map of ID to category name (e.g., "1 > 2 > 3").
 */
export async function getTaxonomy() {
  if (cachedTaxonomy) {
    return cachedTaxonomy;
  }

  try {
    const TSV_URL =
      'https://raw.githubusercontent.com/InteractiveAdvertisingBureau/Taxonomies/develop/Content%20Taxonomies/Content%20Taxonomy%203.1.tsv';
    const response = await fetch(TSV_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const text = await response.text();

    const lines = text.split('\n');
    const taxonomy = {};

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) {
        continue;
      }
      const parts = line.split('\t');
      if (parts.length < 3) {
        continue;
      }
      const id = parts[0].trim();
      const tiers = parts
        .slice(3, 7)
        .map((t) => t.trim())
        .filter(Boolean);
      const name = tiers.join(' > ');
      if (id && name) {
        taxonomy[id] = name;
      }
    }

    cachedTaxonomy = taxonomy;
    return cachedTaxonomy;
  } catch (e) {
    console.warn(
      'Failed to fetch taxonomy from GitHub, falling back to basic resolution',
      e,
    );
    return {};
  }
}
