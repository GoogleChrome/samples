if (MediaSource.isTypeSupported('video/webm; codecs="vp9"')) {
  log('> Some VP9 profile');
}

if (MediaSource.isTypeSupported('video/webm; codecs="vp09.00.10.08"')) {
  log('> VP9, Profile 0, level 1, bit depth 8 (later fields defaulted)');
}

if (MediaSource.isTypeSupported('video/webm; codecs="vp09.01.20.08.01"')) {
  log('> VP9, Profile 1, level 2, bit depth 8, ' +
      '4:2:0 chroma subsampling colocated with (0,0) luma, ' +
      '(later fields defaulted)');
}

if (MediaSource.isTypeSupported('video/webm; codecs="vp09.01.20.08.01.01.01.01.00"')) {
  log('> VP9, Profile 1, level 2, bit depth 8, ' +
      '4:2:0 chroma subsampling colocated with (0,0) luma, ' +
      'REC709 color/transfer/matrix, ' +
      'luma/chroma encoded in the "legal" range.');
}

if (MediaSource.isTypeSupported('video/webm; codecs="vp09.02.10.10.01.09.16.09.01"')) {
  log('> VP9, Profile 2, level 1, 10-bit YUV content, ' +
      '4:2:0 colocated with luma (0,0) chroma subsampling, ' +
      'ITU-R BT.2020 primaries, ' +
      'ST 2084 EOTF, ITU-R BT.2020 non-constant luminance color matrix, ' +
      'full-range chroma/luma encoding.');
}
