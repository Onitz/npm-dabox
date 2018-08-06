/* 
 * Remember to update readme.md doco on update!
 */
let packageJson = require('./package.json')
let key = {
  left: 37,
  up: 38,
  right: 39,
  down: 40,
  space: 32,
  w: 87,
  a: 65,
  s: 83,
  d: 68,
  c: 67,
  esc: 27,
  tab: 9,
  enter: 13,
  ctrl: 17
}

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

exports.zeros = function( n ) {
  if( typeof n === 'undefined' || n < 1 ) {
    return []
  }
  return new Array( n + 1 ).join( '0' ).split( '' ).map( parseFloat )
}

exports.sequence = function( n ) {
  return Array.apply( null, { length: n } ).map( Number.call, Number )
}

exports.randInt = function( n ) {
  return Math.floor( Math.random() * n )
}

function compress( array ) {
  let ret = new Array()
  for( i in array ) {
    if( array[ i ] ) {
      ret.push( array[ i ] )
    }
  }
  return ret
}

/*
 * All arguments are callbacks, isEnable, up, down, left, right are mandatory
 */
exports.keyListen = function( isEnable, up, left, down, right, crouch, space, esc, tab, enter ) {
  if( isEnable == null || up == null || down == null || left == null || right == null ) {
    console.error( 'WET.keyListen() is missing mandatory args')
  }
  window.onkeydown = function( e ) {
    if( !isEnable() ) {
      return
    }
    let pressed = e.which
    if( pressed === key.up || pressed === key.w ) {
      up()
    } else if( pressed === key.left || pressed === key.a ) {
      left()
    } else if( pressed === key.down || pressed === key.s ) {
      down()
    } else if( pressed === key.right || pressed === key.d ) {
      right()
    } else if( space && pressed === key.space ) {
      space()
    } else if( crouch && ( pressed === key.ctrl || pressed === key.c ) ) {
      crouch()
    } else if( esc && pressed === key.esc ) {
      esc()
    } else if( tab && pressed === key.tab ) {
      e.preventDefault()
      tab()
    } else if( enter && pressed === key.enter ) {
      enter()
    }
  }
}

exports.keyUpListen = function( up, left, down, right, crouch ) {
  window.onkeyup = function( e ) {
    let released = e.which
    if( released === key.up || released === key.w ) {
      up()
    } else if( released === key.left || released === key.a ) {
      left()
    } else if( released === key.down || released === key.s ) {
      down()
    } else if( released === key.right || released === key.d ) {
      right()
    } else if( released === key.ctrl || released === key.c ){
      crouch()
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
    let jumpApex = false

    this.keySwitch = {
      w: false, 
      a: false, 
      s: false, 
      d: false,
      c: false,
    } 
    this.gameState = { 
      score: 0,
    }
    this.playState = {
      preGame: true,
      inGame: false,
      paused: false,
      ended: false,
    }

    this.zeroVector = x => { return new THREE.Vector3( 0, 0, 0 ) }
    this.init( THREE )
    this.animate()

    // Add listeners
    window.addEventListener( 'resize', x => { this.doResize() } )
    window.addEventListener( 'blur', x => { this.resetControls() } )
    exports.keyListen( 
      enabled => { return true },
      up      => { this.keySwitch.w = true },
      left    => { this.keySwitch.a = true },
      down    => { this.keySwitch.s = true },
      right   => { this.keySwitch.d = true },
      crouch  => { this.keySwitch.c = true },
      space   => { this.isJumping = true },
      esc     => { console.log( 'esc' ) },
      tab     => { console.log( 'tab' ) },
      enter   => { console.log( 'enter' ) },
    )
    exports.keyUpListen(
      releaseUp     => { this.keySwitch.w = false },
      releaseLeft   => { this.keySwitch.a = false },
      releaseDown   => { this.keySwitch.s = false },
      releaseRight  => { this.keySwitch.d = false },
      releaseCrouch => { this.keySwitch.c = false },
    )
  }

  resetControls() {
    this.keySwitch = {
      w: false, 
      a: false, 
      s: false, 
      d: false,
      c: false,
    } 
  }

  init( THREE ) {
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 1, 10000 )
    this.cameraTarget = new THREE.Vector3( 0, 5, 0 )
    this.cameraPosition = new THREE.Vector3 ( 0, 20, -40 )
    this.camera.position.set( this.cameraPosition.x, this.cameraPosition.y, this.cameraPosition.z )
    this.camera.lookAt( this.cameraTarget )

    let boxGeometry = new THREE.BoxGeometry( 10, 10, 10 )
    let material = new THREE.MeshLambertMaterial( { color: 0x666666, flatShading: THREE.SmoothShading } )
    let worldAxis = new THREE.AxesHelper( 25 )
    let light = new THREE.PointLight( 0xff4000, 10 )
    let helper = new THREE.PointLightHelper( light, 1 )

    light.position.set( 20, 15, -15 )
    boxGeometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 5, 0 ) ) //offset box origin for crouching

    this.toonAxis = new THREE.AxesHelper( 10 )
    this.box = new THREE.Mesh( boxGeometry, material )
    this.plane = new THREE.Mesh( new THREE.PlaneGeometry( 10, 15, 1, 1 ), material )
    this.toonAxis.position.set( this.cameraTarget.x, this.cameraTarget.y, this.cameraTarget.z )
    this.plane.rotation.x = exports.toRadians( -90 )

    this.scene.add( light )
    this.scene.add( new THREE.AmbientLight( 0xffffff ) )
    this.scene.add( helper )
    this.scene.add( worldAxis )
    this.scene.add( this.toonAxis )
    this.scene.add( this.box )
    this.scene.add( this.plane )
    this.renderer = new THREE.WebGLRenderer()
    this.canvasEl = document.body.appendChild( this.renderer.domElement )
    this.canvasEl.style.display = 'block' // fix fullscreen scrollbar issue
    this.doResize()
  } // end init()

  animate() {
    window.requestAnimationFrame( x => { this.animate() } )
    this.move()
    this.renderer.render( this.scene, this.camera )

    let womboCombo = this.zeroVector().add( this.cameraTarget ).add( this.cameraPosition )
    this.camera.position.copy( womboCombo )
    this.camera.lookAt( this.cameraTarget )
    this.box.position.copy( this.cameraTarget )
    this.toonAxis.position.copy( this.cameraTarget )
  }

  doResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize( window.innerWidth, window.innerHeight )  
  }

  move() {
    let forwardUnit = ( new THREE.Vector3( -this.cameraPosition.x, -this.cameraPosition.y, -this.cameraPosition.z ) ).normalize()
    let leftUnit = ( ( new THREE.Vector3( 0, 1, 0) ).cross( forwardUnit ) ).normalize()

    if( this.keySwitch.w ) {
      this.cameraTarget.x += forwardUnit.x
      this.cameraTarget.z += forwardUnit.z
    }
    if( this.keySwitch.a ) {
      this.cameraTarget.x += leftUnit.x
      this.cameraTarget.z += leftUnit.z
    }
    if( this.keySwitch.s ) {
      this.cameraTarget.x -= forwardUnit.x
      this.cameraTarget.z -= forwardUnit.z
    }
    if( this.keySwitch.d ) {
      this.cameraTarget.x -= leftUnit.x
      this.cameraTarget.z -= leftUnit.z
    }
    
    this.box.scale.y = this.keySwitch.c ? 0.5 : 1

    this.jump()
  }

  jump() {
    let jumpHeight = 20

    if( this.isJumping && !this.jumpApex ) {
      if( this.cameraTarget.y < jumpHeight ) {
          this.cameraTarget.y += 1
       } else {
          this.jumpApex = true
       }
    } else if( this.cameraTarget.y > 5 ) {
       this.cameraTarget.y = this.cameraTarget.y - 1
       if( this.cameraTarget.y <= 5) {
          this.cameraTarget.y = 5
          this.isJumping = false
          this.jumpApex = false
       }
    }
  }

}