/* 
 * Remember to update readme.md doco on update!
 */
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
exports.keyListen = function( isEnable, up, down, left, right, space, ctrl, esc, tab, enter ) {
  if( isEnable == null || up == null || down == null || left == null || right == null ) {
    console.error( 'WET.keyListen() is missing mandatory args')
  }
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
    let keyEnter = 13

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
    } else if( enter && key === keyEnter ) {
      enter()
    }
  }
}

exports.mouseListen = function( isEnable, leftClick, rightClick, leftDrag, rightDrag, scroll ) {
  if( isEnable == null || leftClick == null || rightClick == null || leftDrag == null || rightDrag == null || scroll == null) {
    console.error( 'WET.mouseListen() is missing mandatory args')
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

exports.toRadians = function( x ) {
  return x * Math.PI / 180
}

exports.toDegrees = function( x ) {
  return x * 180 / Math.PI
}

exports.Game = class {

  constructor( THREE, startScreen, pauseScreen, scoreScreen ) {
    let renderer, canvasEl, scene, camera, cameraTarget, cameraPosition
    let box, plane, toonAxis
    let isJumping = false 
    let isDragging = false

    this.gameState = { score: 0 }
    this.playState = {
      preGame: true,
      inGame: false,
      paused: false,
      ended: false
    }

    this.init( THREE )
    this.animate()

    window.addEventListener( 'resize', x => { this.doResize() } )
  }

  init( THREE ) {
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 1, 10000 )

    this.cameraPosition = new THREE.Vector3 ( 0, 20, -40 )
    this.camera.position.set( this.cameraPosition.x, this.cameraPosition.y, this.cameraPosition.z )
    this.cameraTarget = new THREE.Vector3( 0, 5, 0 )
    this.camera.lookAt( this.cameraTarget )

    let boxGeometry = new THREE.BoxGeometry( 10, 10, 10 )
    let material = new THREE.MeshLambertMaterial( { color: 0x666666, flatShading: THREE.SmoothShading } )
    let worldAxis = new THREE.AxesHelper( 25 )
    let light = new THREE.PointLight( 0xff4000, 10 )
    let helper = new THREE.PointLightHelper( light, 1 )

    light.position.set( 20, 15, 0 )

    this.toonAxis = new THREE.AxesHelper( 10 )
    this.box = new THREE.Mesh( boxGeometry, material )
    this.plane = new THREE.Mesh( new THREE.PlaneGeometry( 10, 15, 1, 1 ), material )
    this.toonAxis.position.set( this.cameraTarget.x, this.cameraTarget.y, this.cameraTarget.z )
    this.box.position.y = 10
    this.plane.rotation.x = exports.toRadians( -90 )

    this.scene.add( light )
    this.scene.add( new THREE.AmbientLight( 0xffffff ) )
    this.scene.add( helper )
    this.scene.add( worldAxis )
    this.scene.add( this.toonAxis )
    this.scene.add( this.box )
    this.scene.add( this.plane )
    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setSize( window.innerWidth, window.innerHeight )
    this.canvasEl = document.body.appendChild( this.renderer.domElement )
    this.canvasEl.style.display = 'block' // fix fullscreen scrollbar issue
  } // end init()

  animate() {
    window.requestAnimationFrame( x => { this.animate() } )

    this.renderer.render( this.scene, this.camera )
    //this.box.position.set( this.cameraTarget.position ) //odd not working
    this.toonAxis.position.set( this.cameraTarget.position )

//this.cameraTarget.x += 0.01

    this.camera.position.x = this.cameraTarget.x + this.cameraPosition.x
    this.camera.position.y = this.cameraTarget.y + this.cameraPosition.y
    this.camera.position.z = this.cameraTarget.z + this.cameraPosition.z
    this.camera.lookAt( this.cameraTarget )
  }

  doResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize( window.innerWidth, window.innerHeight )  
  }

}