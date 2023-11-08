
const g = {
	"assets": {},
	"scale": { "aspect": 4 / 3, "x": 1.0, "y": 1.0 }
};

// Convert color from hex string to array of RGB values
g.getRGB = function getRgb( color ) {
	color = parseInt( color.replace( /^#/, "" ), 16 );
	const r = ( color >> 16 ) & 0xFF;
	const g = ( color >> 8 ) & 0xFF;
	const b = color & 0xFF;
	return [ r, g, b ];
};

// Convert color from array of RGB values to hex string
g.getHexColor = function getHex( color ) {
	color = color.map( ( c ) => c.toString( 16 ).padStart( 2, "0" ) );
	return "#" + color.join( "" );
};

( function () {

	window.addEventListener( "DOMContentLoaded", init );

	function init() {

		// Create the application helper and add its render target to the page
		g.app = new PIXI.Application( {
			"backgroundColor": 0x000000,
			"resizeTo": window,
			"antialias": true
		} );

		// Load the assets
		( async () => {
			g.spritesheet = await PIXI.Assets.load( "assets/spritesheet.json" );
			g.createWorld();
			g.showIntro();
		} )();

		// Load the background
		g.assets.background = PIXI.TilingSprite.from(
			"assets/images/Backgrounds/darkPurple.png" ,
			{ "width": g.app.screen.width, "height": g.app.screen.height }
		);

		// Add the background
		g.app.stage.addChild( g.assets.background );

		// Add the application to the page
		document.body.appendChild( g.app.view );
		resize();

		// Resize the background when the window is resized
		window.addEventListener( "resize", resize );
	}

	function resize() {
		// Calculate the scale based on the aspect ratio
		if ( window.innerWidth / window.innerHeight >= g.scale.aspect ) {
			g.scale.x = window.innerHeight * g.scale.aspect / 800.0;
			g.scale.y = window.innerHeight / 600.0;
		} else {
			g.scale.x = window.innerWidth / 800.0;
			g.scale.y = window.innerWidth / g.scale.aspect / 600.0;
		}
		g.app.stage.scale.x = g.scale.x;
		g.app.stage.scale.y = g.scale.y;
		g.assets.background.width = g.app.screen.width / g.scale.x;
		g.assets.background.height = g.app.screen.height / g.scale.y;
	}

} )();