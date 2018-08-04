![alt text](https://onitz.github.io/npm-wetbox/trump.svg "Make Prototypes Great Again.")

### Functions ### 
`getVersion()`  
Returns the current in-use version of the library

`getUrl( url, callback )`  
Fetches an external API url (typically json) and performs callback( status, response ) when loaded.  
Status being a nubmer (ie 400), and response being the data.

`keyListen( isEnable, up, down, left, right, space, ctrl)`  
Adds some keyboard listeners to the page for typical game commands. All input parameters are callback functions.

`randomizeArray( array )`  
Returns array with random-ordered elements using the Fisher-Yates-Knuth shuffle.
