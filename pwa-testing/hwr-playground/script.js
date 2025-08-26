// All supported languages
const supportedLanguages = ['en', 'zxx-x-Gesture']
const hues = [0, 45, 90, 135, 180, 225, 270, 315]

let activeLanguage = supportedLanguages[0]
let recognizer
let drawing

function getCoordinateFromEvent(ev) {
  if (ev.targetTouches) {
    return {
      x: ev.targetTouches[0].pageX - ev.target.offsetLeft,
      y: ev.targetTouches[0].pageY - ev.target.offsetTop,
      t: ev.timeStamp
    }
  } else {
    return {
      x: ev.offsetX,
      y: ev.offsetY,
      t: ev.timeStamp 
    }
  }
}

/*
 * Mouse moves outside of `writingAreaRefElement` is ignore.
 * onStroke: function (stroke: {x, y, ts})
 * onPoint: function (currentPoint: {x, y, ts}, previousPoint: {x, y, ts}|null)
 */
async function createMouseStrokeHandler(writingAreaRefElement, onStroke, onStrokePoint) {
  let stroke = null
  let lastPoint = null
  
  const stylusDownHandler = (ev) => {
    if (!drawing)
      return 
    
    lastPoint = getCoordinateFromEvent(ev)
    
    // Create a new stroke and add it to recognizer
    stroke = new HandwritingStroke()
    stroke.addPoint(lastPoint)
    drawing.addStroke(stroke)
  }
  
  const stylusUpHandler = (ev) => {
    if (!drawing || !stroke)
      return 
    
    if (onStroke) 
      onStroke(stroke)
    
    // Stroke is finished.
    stroke = null
    lastPoint = null
  }
  
  const stylusMoveHandler = (ev) => {
    if (!drawing)
      return 
    
    if (stroke && ev.target === writingAreaRefElement) {
      if (ev.touches) {
        // Prevent scrolling in touchevents
        ev.preventDefault()
      }
      
      let point = getCoordinateFromEvent(ev)
      stroke.addPoint(point)
      
      if (onStrokePoint)
        onStrokePoint(point, lastPoint)
      
      lastPoint = point
    }
  }
  
  writingAreaRefElement.addEventListener('mousedown', stylusDownHandler)
  writingAreaRefElement.addEventListener('mousemove', stylusMoveHandler)
  document.addEventListener('mouseup', stylusUpHandler)
  
  writingAreaRefElement.addEventListener('touchstart', stylusDownHandler)
  writingAreaRefElement.addEventListener('touchmove', stylusMoveHandler)
  document.addEventListener('touchend', stylusUpHandler)
  
}

async function initRecognizer(lang) {
  // V2 query.
  if (navigator.queryHandwritingRecognizer) {
    const desc = await navigator.queryHandwritingRecognizer({ languages: [lang] })
    if (!desc) {
      document.querySelector('#status').innerText = `Error: (query v2) recognizer "${lang}" is not supported on this device`
      return
    }
  }
  
  // V1 query.
  if (navigator.queryHandwritingRecognizerSupport) {
    const {languages} = await navigator.queryHandwritingRecognizerSupport({ languages: [lang] })
    if (!languages) {
      document.querySelector('#status').innerText = `Error: (query v1) recognizer "${lang}" is not supported on this device`
      return
    }
  }
  
  // set global recognizer
  recognizer = await navigator.createHandwritingRecognizer({
    languages: [lang]
  }).then(
    r => {
      document.querySelector('#status').innerText = `Initialized, lang = ${activeLanguage}`
      recognizer = r
      return r
    },
    error => {
      document.querySelector('#status').innerText = `Error: can't create recognizer, ${error.message}`
      return null
    }
  )
}

async function resetDrawing() {
  const canvas = document.querySelector('canvas')
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  if (recognizer) {
    drawing = await recognizer.startDrawing({ type: 'text' })
    
    window.drawing = drawing
  }
}

async function switchLanguageAndClear() {
  // Switch to next language, and clear canvas
  const circularLanguages = [...supportedLanguages, ...supportedLanguages]
  activeLanguage = circularLanguages[supportedLanguages.indexOf(activeLanguage) + 1]
  await initRecognizer(activeLanguage)
  await resetDrawing()
}

window.addEventListener('DOMContentLoaded', async (event) => {
  // Check OT status and print correct step to enable feature
  const originTrialExpiry = parseExpiryTimeOriginTrialToken()
  if (originTrialExpiry > Date.now()) {
    document.querySelector('#ot-status').innerText = `OT Token is valid, expires at ${new Date(originTrialExpiry).toISOString()}`
  } else {
    document.querySelector('#ot-status').innerText = `Enable "Experimental Web Platform Features" in chrome://flags. ${originTrialExpiry ? `(OT expired at ${new Date(originTrialExpiry).toISOString()})}` : "(OT token not available)"}`
  }

  if (
    (navigator.queryHandwritingRecognizer || navigator.queryHandwritingRecognizerSupport)
    && navigator.createHandwritingRecognizer
  ) {
    document.body.removeChild(document.querySelector('#feature-detection-error'))
  } else {
    document.querySelector('#status').innerText = "Error, API isn't available. Check the steps above"
    return
  }
  
  document.querySelector('#clear-btn').addEventListener('click', ev => {
    resetDrawing()
    ev.preventDefault()
  })
  document.querySelector('#switch-btn').addEventListener('click', ev => {
    switchLanguageAndClear()
    ev.preventDefault()
  })
  
  document.addEventListener('keydown', async event => {
    if (event.code === 'KeyC') {
      resetDrawing()
    }
    
    if (event.code === 'KeyX') {
      switchLanguageAndClear()
    }
  })
  
  await initRecognizer(activeLanguage)
  await resetDrawing()
  
  const canvas = document.querySelector('canvas')
  const ctx = canvas.getContext('2d')
  
  createMouseStrokeHandler(
    canvas,
    function onStroke(stroke) {
      ctx.closePath()
      
      window.lastStroke = stroke
      
      // Assuming it's fast
      const startTime = Date.now()
      drawing.getPrediction().then(
        result => {
          console.log(result)
          window.lastResult = result
          
          if (result) {
            document.querySelector('#output').innerText = result.map($ => $.text).join('\n') 
          } else {
            document.querySelector('#output').innerText = JSON.stringify(result)
          }
          
          if (!result)
            return
          
          const pred = result[0]
          if (!pred)
            return
          
          const oldStrokeStyle = ctx.strokeStyle
          
          // Paint grampehes
          let hueIdx = 0
          
          const graphemes = pred.segmentationResult
          for (const g of graphemes) {
            for (const seg of g.drawingSegments) {
              const stroke = drawing.getStrokes()[seg.strokeIndex]
              const points = stroke.getPoints()
              let prevPoint = points[seg.beginPointIndex]
              
              ctx.beginPath()

              for (let idx = seg.beginPointIndex; idx !== seg.endPointIndex; ++idx) {
                const point = points[idx]
                ctx.moveTo(prevPoint.x, prevPoint.y)
                ctx.lineTo(point.x, point.y)
                prevPoint = point
              }
              
              // Paint the segment
              ctx.strokeStyle = `hsl(${hues[hueIdx]}, 100%, 65%)`
              ctx.stroke()
              
              ctx.closePath()
            }
            hueIdx = (hueIdx + 1) % hues.length
          }
          
          ctx.strokeStyle = oldStrokeStyle
          
          document.querySelector('#status').innerText = `OK, getPrediction(), elapsed time = ${Date.now() - startTime}ms`
        },
        err => document.querySelector('#status').innerText = `Error, getPrediction(), message = ${err.message}`
      )
    },
    function onPoint(point, previousPoint) {
      if (!previousPoint)
        return
      
      ctx.beginPath()
      ctx.moveTo(previousPoint.x, previousPoint.y)
      ctx.lineTo(point.x, point.y)
      ctx.stroke()
    }
  )
  
});

