exports.getVersion = function() {
  console.log('Dabox version 0.0.1');
}

function getUrl( url, callback ) {
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
}