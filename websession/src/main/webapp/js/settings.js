/**
 * Name space for configuration parameters.
 */
dosidos.settings = dosidos.settings || {};

/**
 * The URL of the token end point.
 */
dosidos.settings.TOKEN_ENDPOINT_URL = '/token';

/**
 * The HTTP header name for the LAT when accessing token end point.
 */
dosidos.settings.HTTP_HEADER_LAT = 'X-LAT';

/**
 * Sets a shorter life time intentionally to allow time differences between
 * the server and the user agent. In milliseconds.
 */
dosidos.settings.TIME_BUFFER_MS = 10 * 1000; //5 * 60 * 1000;

