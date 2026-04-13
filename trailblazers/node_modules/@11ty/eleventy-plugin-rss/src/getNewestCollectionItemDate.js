export default function(collection, emptyFallbackDate) {
  if( !collection || !collection.length ) {
    return emptyFallbackDate || new Date();
  }

  return new Date(Math.max(...collection.map(item => {return item.date})));
}
