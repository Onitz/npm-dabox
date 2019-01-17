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

`zeros( n )`  
Returns an array of zeros of lenth _n_

`sequence( n )`  
Returns an array of numbers from 0 .. n-1

`randInt( n )`  
Returns a random int from 0 .. n-1

`clearEmptyElements( array )`  
Remove all zero and falsy values from an array

`randomizeArray( array )`  
Returns array with random-ordered elements using the Fisher-Yates-Knuth shuffle.

`leftPad( str, len, fillerChar )`  
Pads a string up to length _len_, with single-char: fillerChar (defaults to space character) 

`toRadians( x )`  
Convert x degrees to radians 

`toDegrees( x )`  
Convert x radians to degrees

`hasDuplicates( n )`
Returns true if array contains duplicates

`choose( n, k )`
The mathematical choose function. One-indexed 

`ithIteration( n, k, i )`
Alias for `ithCombination( n, k, i )`

`inverseIthIteration( n, combinationArray )`
Alias for `inverseIthCombination( n, combinationArray )`

`ithCombination( n, k, i )`
Given a set of `n` items, `k` choices, and an index `i`, give me a k-sized array of the ith combination. 0 <= i < n.

`inverseIthCombination( n, combinationArray )`
Given a number `n` and combinationArray, convert the array into an ith ordering. k is infered from `combinationArray`s length.

### Classes ### 
`new WET.game( THREE, gameTitle )`  
Given a three.js library `let THREE = require( 'three' )`, initialize a basic game environment using threejs. ie in index.js
```
WET = require( 'wetbox' )
THREE = require( 'three' )
game = new WET.Game( THREE, 'Wizzy boi' )
```

### Window ~~lickers~~ listeners ###
`keyListen( isEnable, up, left, down, right, crouch, space, esc, tab, enter )`  
Adds some keyboard listeners to the page for typical game commands. All input params are callback functions, first 5 are mandatory.
```
WET.keyListen( 
  enabled => { return true },
  up      => { console.log( 'up' ) },
  left    => { console.log( 'left' ) },
  down    => { console.log( 'down' ) },
  right   => { console.log( 'right' ) },
  crouch  => { console.log( 'crouch' ) },
  space   => { console.log( 'space' ) },
  esc     => { console.log( 'esc' ) },
  tab     => { console.log( 'tab' ) },
  enter   => { console.log( 'enter' ) },
)
```

`keyUpListen( up, left, down, right, crouch )`  
Adds key-release listeners for switch-keys, all args are callbacks and always enabled.
```
WET.keyUpListen(
  releaseUp     => { console.log( 'release up' ) },
  releaseLeft   => { console.log( 'release left' ) },
  releaseDown   => { console.log( 'release down' ) },
  releaseRight  => { console.log( 'release right' ) },
  releaseCrouch => { console.log( 'release crouch' ) },
)
```

### Administration ###
First update the `major.minor.patch` version in package.json, commit, and..  
`npm login`  
`npm publish`  
