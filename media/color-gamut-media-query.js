if (window.matchMedia("(color-gamut: srgb)").matches) {
  log(`Screen supports approximately the sRGB gamut or more.`);
}

if (window.matchMedia("(color-gamut: p3)").matches) {
  log(`Screen supports approximately the gamut specified 
      by the DCI P3 Color Space or more.`);
}

if (window.matchMedia("(color-gamut: rec2020)").matches) {
  log(`Screen supports approximately the gamut specified
      by the ITU-R Recommendation BT.2020 Color Space or more.`);
}
