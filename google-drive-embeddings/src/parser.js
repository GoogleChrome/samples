/**
 * TrackParser utility for validating and splitting MP3 filenames
 * into structured Artist and Title metadata.
 */
export class TrackParser {
  // Common blacklist terms that make a file name uninformative/generic
  static BLACKLIST = new Set([
    'unknown',
    'unknown artist',
    'unknown track',
    'unknown title',
    'unknown song',
    'unknown band',
    'untitled',
    'various',
    'various artists',
    'va',
    'various-artists',
    'audio',
    'audio track',
    'soundtrack',
    'track',
    'song',
    'music',
    'music track',
    'placeholder',
    'recording',
    'clip',
    'sound',
    'copy',
    'temp'
  ]);

  // Regular expressions to catch placeholder syntax like "$artist_name" or "artist_name"
  static PLACEHOLDER_REGEX = /\$[a-zA-Z_]+|[a-zA-Z_]+_name|[a-zA-Z_]+_title/i;

  // Regular expressions to check if a string is pure numeric, track numbers, roman numerals
  static NUMERIC_ONLY_REGEX = /^\s*(\d+|[ivxcdm]+)\s*$/i;
  static TRACK_INDEX_ONLY_REGEX = /^\s*(track\s*\d+|song\s*\d+|vol(ume)?\s*\d+|part\s*\d+|pt\s*\d+)\s*$/i;

  /**
   * Cleans a filename by removing extensions and normalizing spacers.
   */
  static cleanString(str) {
    if (!str) return '';
    // Strip .mp3 extension if present
    let cleaned = str.replace(/\.mp3$/i, '');
    // Replace underscores with spaces
    cleaned = cleaned.replace(/_/g, ' ');
    
    // Strip leading numeric track index if followed by spacer punctuation (dot/dash/spaces)
    // e.g. "01. Linkin Park" -> "Linkin Park", "02-Pink Floyd" -> "Pink Floyd"
    cleaned = cleaned.replace(/^\s*\d+[\s.-]*[.-]+\s*(?=[a-zA-Z0-9])/, '');
    
    // Remove typical enclosing characters like brackets/quotes
    cleaned = cleaned.replace(/[\[\]\(\)"']/g, ' ');
    // Normalize spaces
    return cleaned.replace(/\s+/g, ' ').trim();
  }

  /**
   * Checks if a specific string part is generic or uninformative.
   */
  static validatePart(part) {
    const trimmed = part.trim();
    if (trimmed.length < 2) {
      return { valid: false, reason: 'Too short (must be at least 2 chars)' };
    }
    const lower = trimmed.toLowerCase();
    if (this.BLACKLIST.has(lower)) {
      return { valid: false, reason: `Contains generic keyword "${trimmed}"` };
    }
    if (this.NUMERIC_ONLY_REGEX.test(trimmed)) {
      return { valid: false, reason: 'Contains only numbers/digits' };
    }
    if (this.TRACK_INDEX_ONLY_REGEX.test(trimmed)) {
      return { valid: false, reason: 'Contains only a track/volume index' };
    }
    if (this.PLACEHOLDER_REGEX.test(trimmed)) {
      return { valid: false, reason: 'Contains unresolved placeholder syntax' };
    }
    return { valid: true };
  }

  /**
   * Main parsing routine. Splits and validates a filename.
   * Supports strict delimiters (spaces around the dash) or loose delimiters.
   */
  static parse(filename, options = {}) {
    const { strictDelimiter = true } = options;
    const cleaned = this.cleanString(filename);
    const result = {
      original: filename,
      cleaned: cleaned,
      approved: false,
      artist: null,
      title: null,
      reasons: [],
      checklist: {
        separatorFound: false,
        artistValid: false,
        titleValid: false
      }
    };

    if (!cleaned) {
      result.reasons.push('Empty filename after cleaning');
      return result;
    }

    // Standard separators: space-dash-space, en-dash, em-dash, colon, tilde
    // e.g., "Artist - Title", "Artist: Title", "Artist ~ Title"
    let separatorRegex = /\s+[-–—~:]\s+/;
    if (!strictDelimiter) {
      // In loose mode, support any dash bordered by word characters, or just colon/tilde
      separatorRegex = /\s+[-–—~:]\s+|(?<=\w)-(?=\w)|[-–—~:]/;
    }

    let parts = cleaned.split(separatorRegex).map(p => p.trim()).filter(Boolean);

    // If no standard separator is found but we split on raw dash/colon
    if (parts.length === 1 && strictDelimiter) {
      result.reasons.push('No standard space-separated delimiter (e.g. " - ") found');
      return result;
    }

    result.checklist.separatorFound = true;

    // Check if we have standard "01 - Artist - Title" (3 parts) where first is index
    if (parts.length >= 3) {
      const firstPartCheck = this.validatePart(parts[0]);
      if (!firstPartCheck.valid && (this.NUMERIC_ONLY_REGEX.test(parts[0]) || this.TRACK_INDEX_ONLY_REGEX.test(parts[0]))) {
        // Discard the leading track number part and take the second and third parts!
        parts = [parts[1], parts[2]];
      }
    }

    if (parts.length < 2) {
      result.reasons.push('Could not split filename into both artist and title candidates');
      return result;
    }

    let artistCandidate = parts[0];
    let titleCandidate = parts[1];

    // If the first part is purely numbers/indexes, it's just index and title (no artist!)
    const artistCheck = this.validatePart(artistCandidate);
    const titleCheck = this.validatePart(titleCandidate);

    result.checklist.artistValid = artistCheck.valid;
    result.checklist.titleValid = titleCheck.valid;

    if (!artistCheck.valid) {
      result.reasons.push(`Artist candidate is invalid: ${artistCheck.reason}`);
    }
    if (!titleCheck.valid) {
      result.reasons.push(`Title candidate is invalid: ${titleCheck.reason}`);
    }

    if (artistCheck.valid && titleCheck.valid) {
      result.approved = true;
      result.artist = artistCandidate;
      result.title = titleCandidate;
    }

    return result;
  }
}
