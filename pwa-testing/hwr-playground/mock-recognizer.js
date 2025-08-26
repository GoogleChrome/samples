const STATE_DRAWING = 'drawing'
const STATE_FINISHED = 'finished'

class HandwritingStroke {
  constructor() {
    this._points = []
  }
  
  addPoint({x, y, t, ...rest} = {}) {
    if (x === undefined || y === undefined || t === undefined)
      throw new TypeError('x,y,t required')
    
    this._points.push({x, y, t})
  }
  
  numOfPoints() {
    return this._points.length
  }
}

class HandwritingDrawing {
  constructor(hints) {
    this._hints = hints
    this._state = STATE_DRAWING
    this._strokes = []
  }
  
  finish() {
    this._state = STATE_FINISHED
  }
  
  addStroke(stroke) {
    if (!(stroke instanceof HandwritingStroke))
      throw new TypeError('HandwritingStroke required')
    
    const idx = this._strokes.length
    this._strokes.push(stroke)
    return idx
  }
  
  async getPrediction() {
    let left = +Infinity, right = 0, top = +Infinity, bottom = 0
    let numOfPoints = 0
    
    for (const stroke of this._strokes) {
      numOfPoints += stroke.numOfPoints()
      for (const point of stroke._points) {
        left = Math.min(left, point.x)
        right = Math.max(right, point.x)
        top = Math.min(top, point.y)
        bottom = Math.max(bottom, point.y)
      }
    }

    return {
      text: `${this._strokes.length} strokes, ${numOfPoints} points text`,
      boundingBox: new DOMRectReadOnly(left, top, right-left, bottom-top),
      alternatives: [
        "alternative",
        "more alternative"
      ]
    } 
  }
}

class HandwritingRecognizer {
  constructor(hints) {
    this._hints = hints
  }
  
  startDrawing() {
    return new HandwritingDrawing(this._hints)
  }
}


navigator.queryHandwritingRecognizerSupport = function(feature) {
  const features = {
    'supportedLanguages': navigator.languages,
    'supportedRecognitionTypes': ['text', 'number'],
    'supportedInputTypes': ['pen', 'mouse', 'touch'],
    'textContext': true,
    'writingArea': true,
    'alternatives': true,
    'characterSet': true,
  }
  
  return features[feature] || null
}

navigator.createHandwritingRecognizer = async function(hints) {
  return new HandwritingRecognizer(hints)
}
