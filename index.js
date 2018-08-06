let packageJson = require('./package.json')

exports.getVersion = function() {
  return packageJson.name + '@' + packageJson.version
}

exports.getUrl = function( url, callback ) {
  let xhr = new XMLHttpRequest()
  xhr.open( "GET", url, true )
  xhr.responseType = "json"
  xhr.onload = function() {
    let status = xhr.status
    if (status === 200) {
      callback( null, xhr.response )
    } else {
      callback( status, xhr.response )
    }
  }
  xhr.send()
}

/*
 * All arguments are callbacks, isEnable, up, down, left, right are mandatory
 */
exports.keyListen = function( isEnable, up, down, left, right, space, ctrl, esc, tab ) {
  window.onkeydown = function( e ) {
    if( !isEnable() ) {
      return
    }
    let key = e.which
    let keyLeft = 37
    let keyUp = 38
    let keyRight = 39
    let keyDown = 40
    let keySpace = 32
    let keyW = 87
    let keyA = 65
    let keyS = 83
    let keyD = 68
    let keyEsc = 27
    let keyTab = 9

    if( key === keyUp || key === keyW ) {
      up()
    } else if( key === keyLeft || key === keyA ) {
      left()
    } else if( key === keyDown || key === keyS ) {
      down()
    } else if( key === keyRight || key === keyD ) {
      right()
    } else if( space && key === keySpace ) {
      space()
    } else if( ctrl && e.ctrlKey ) {
      ctrl()
    } else if( esc && key === keyEsc ) {
      esc()
    } else if( tab && key === keyTab ) {
      e.preventDefault()
      tab()
    }
  }
}

exports.randomizeArray = function( array ) {
  let currentIndex = array.length, temporaryValue, randomIndex
  while ( 0 !== currentIndex ) {
    randomIndex = Math.floor( Math.random() * currentIndex )
    currentIndex -= 1
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }
  return array
}

exports.leftPad = function( str, len, fillerChar=' ' ) {
  if( str.length > len ) { 
    return
  }

  if(fillerChar.length > 1 ) { 
    fillerChar=fillerChar.substring(0,1)
  }

  return fillerChar.repeat( len - str.length ) + str
}

exports.initCanvas = function() {
  let canvasEl = document.createElement('canvas')
  canvasEl.setAttribute('id', 'canvas')
  document.body.appendChild( canvasEl )
}