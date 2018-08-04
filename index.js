exports.getVersion = function() {
  console.log('Wetbox version 0.0.2');
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