let packageJson = require('./package.json');

exports.getVersion = function() {
  return packageJson.name + '@' + packageJson.version;
}

exports.getUrl = function( url, callback ) {
  let xhr = new XMLHttpRequest();
  xhr.open( "GET", url, true );
  xhr.responseType = "json";
  xhr.onload = function() {
    let status = xhr.status;
    if (status === 200) {
      callback( null, xhr.response );
    } else {
      callback( status, xhr.response );
    }
  };
  xhr.send();
};

exports.keyListen = function( isEnable, up, down, left, right, space, ctrl) {
  window.onkeydown = function( e ) {
    if( !isEnable() ) {
      return;
    }
    var key = e.which;
    var keyLeft = 37;
    var keyUp = 38;
    var keyRight = 39;
    var keyDown = 40;
    var keySpace = 32;
    var keyW = 87;
    var keyA = 65;
    var keyS = 83;
    var keyD = 68;

    if( key === keyUp || key === keyW ) {
      up();
    } else if( key === keyDown || key === keyS ) {
      down();
    } else if( key === keyLeft || key === keyA ) {
      left();
    } else if( key === keyRight || key === keyD ) {
      right();
    } else if( key === keySpace ) {
      space();
    } else if( e.ctrlKey ) {
      ctrl();
    }
  }
};

exports.randomizeArray = function( array ) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  while ( 0 !== currentIndex ) {
    randomIndex = Math.floor( Math.random() * currentIndex );
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

exports.leftPad = function( str, len, fillerChar=' ' ) {
  if( str.length > len ) { 
    return;
  }

  if(fillerChar.length > 1 ) { 
    fillerChar=fillerChar.substring(0,1);
  }

  return fillerChar.repeat( len - str.length ) + str;
}