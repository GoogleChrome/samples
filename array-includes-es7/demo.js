var basketOfApples = ['🍎', '🍏', '🍎', '🍏', '🌰', '🍎', '🍏'];
if (basketOfApples.includes('🌰')) {
  ChromeSamples.log('Your basket of apples contains a chestnut.');
}
// The old way still "works"...
if (basketOfApples.indexOf('🌰') !== -1) {
  ChromeSamples.log('Your basket of apples contains a chestnut.');
}

var buildingInFire = [' ', ' ', '🔥', '🔥', '🔥', ' '];
if (buildingInFire.includes('🔥', 3)) {
  ChromeSamples.log('A fire is burning after the 3rd floor.');
}
if (buildingInFire.includes('🔥', -2)) {
  ChromeSamples.log('A fire is burning in the last 2 floors.');
}
