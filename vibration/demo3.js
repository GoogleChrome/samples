function startPattern() {
  // Values at even indices (0, 2, 4, ...) specify vibrations, while the odd
  // indices specify pauses.
  // Vibrate for 500ms 6 times, pausing for 250ms in between each one.
  navigator.vibrate([500, 250, 500, 250, 500, 250, 500, 250, 500, 250, 500]);
}
