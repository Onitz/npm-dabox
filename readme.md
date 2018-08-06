![alt text](https://onitz.github.io/npm-wetbox/trump.svg "Make Prototypes Great Again.")

### Setup ### 
`npm install wetbox`  
`let WET = require( 'wetbox' )` 

### Functions ### 
`getVersion()`  
Returns the current in-use version of the library

`getUrl( url, callback )`  
Fetches an external API url (typically json) and performs callback( status, response ) when loaded.  
Status being a nubmer (ie 400), and response being the data.

`keyListen( isEnable, up, down, left, right, space, ctrl, space, ctrl, esc, tab )`  
Adds some keyboard listeners to the page for typical game commands. All input params are callback functions.  
`isEnable()`, `up()`, `down()`, `left()`, `right()` are mandatory.
```
WET = require( 'wetbox' );
WET.keyListen( 
  () => { return true },
  () => { console.log( 'up' ) },
  () => { console.log( 'down' ) },
  () => { console.log( 'left' ) },
  () => { console.log( 'right' ) },
  () => { console.log( 'space' ) },
  () => { console.log( 'ctrl' ) },
  () => { console.log( 'esc' ) },
  () => { console.log( 'tab' ) },
  () => { console.log( 'enter' ) },
);
```


`randomizeArray( array )`  
Returns array with random-ordered elements using the Fisher-Yates-Knuth shuffle.

`leftPad( str, len, fillerChar )`  
Pads a string up to length len, with single-char: fillerChar (defaults to space character) 

`toRadians( x )`  
Convert x degrees to radians 

`toDegrees( x )`  
Convert x radians to degrees

### Classes ### 
`new WET.game( THREE, startScreen, pauseScreen, scoreScreen )`  
Given a three.js library `let THREE = require( 'three' )`, initialise a basic game environment
