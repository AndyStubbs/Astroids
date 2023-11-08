
( function () {

	const game = {};

	g.createWorld = function createWorld() {
		createTextureGroups();
		game.world = new PIXI.Container();
		game.world.scale.x = 0.4;
		game.world.scale.y = 0.4;
		g.app.stage.addChild( game.world );
		game.astroids = [];
		createAstroids( 10, 3 );
		g.app.ticker.add( run );
	};

	g.startGame = function startGame() {
		game.isRunning = true;
		game.ship = createShip( "playerShip1", "blue" );
		document.addEventListener( "keydown", keydown );
		document.addEventListener( "keyup", keyup );
		window.addEventListener( "blur", blur );
	};

	function createTextureGroups() {
		game.textureGroups = {};
		game.textureGroups.bigAstroids = [
			g.spritesheet.textures[ "meteorBrown_big1.png" ],
			g.spritesheet.textures[ "meteorBrown_big2.png" ],
			g.spritesheet.textures[ "meteorBrown_big3.png" ],
			g.spritesheet.textures[ "meteorBrown_big4.png" ],
			g.spritesheet.textures[ "meteorGrey_big1.png" ],
			g.spritesheet.textures[ "meteorGrey_big2.png" ],
			g.spritesheet.textures[ "meteorGrey_big3.png" ],
			g.spritesheet.textures[ "meteorGrey_big4.png" ],
		];
		game.textureGroups.mediumAstroids = [
			g.spritesheet.textures[ "meteorBrown_med1.png" ],
			g.spritesheet.textures[ "meteorBrown_med3.png" ],
			g.spritesheet.textures[ "meteorGrey_med1.png" ],
			g.spritesheet.textures[ "meteorGrey_med2.png" ]
		];
		game.textureGroups.smallAstroids = [
			g.spritesheet.textures[ "meteorBrown_small1.png" ],
			g.spritesheet.textures[ "meteorBrown_small2.png" ],
			g.spritesheet.textures[ "meteorGrey_small1.png" ],
			g.spritesheet.textures[ "meteorGrey_small2.png" ]
		];
		game.textureGroups.explosion = [
			g.spritesheet.textures[ "explosion_00.png" ],
			g.spritesheet.textures[ "explosion_01.png" ],
			g.spritesheet.textures[ "explosion_02.png" ],
			g.spritesheet.textures[ "explosion_03.png" ],
			g.spritesheet.textures[ "explosion_04.png" ],
			g.spritesheet.textures[ "explosion_05.png" ],
			g.spritesheet.textures[ "explosion_06.png" ],
			g.spritesheet.textures[ "explosion_07.png" ],
			g.spritesheet.textures[ "explosion_08.png" ],
			g.spritesheet.textures[ "explosion_09.png" ],
			g.spritesheet.textures[ "explosion_10.png" ],
			g.spritesheet.textures[ "explosion_11.png" ],
			g.spritesheet.textures[ "explosion_12.png" ],
			g.spritesheet.textures[ "explosion_13.png" ],
			g.spritesheet.textures[ "explosion_14.png" ],
			g.spritesheet.textures[ "explosion_13.png" ],
			g.spritesheet.textures[ "explosion_11.png" ],
			g.spritesheet.textures[ "explosion_09.png" ],
			g.spritesheet.textures[ "explosion_07.png" ],
			g.spritesheet.textures[ "explosion_05.png" ],
			g.spritesheet.textures[ "explosion_03.png" ],
			g.spritesheet.textures[ "explosion_01.png" ],
			g.spritesheet.textures[ "explosion_00.png" ]
		];
		game.textureGroups.laserBlast = [
			g.spritesheet.textures[ "laserBlue09.png" ],
			g.spritesheet.textures[ "laserBlue11.png" ],
			g.spritesheet.textures[ "laserBlue10.png" ],
			g.spritesheet.textures[ "laserBlue10.png" ],
			g.spritesheet.textures[ "laserBlue10.png" ],
			g.spritesheet.textures[ "laserBlue11.png" ]
		];
		game.textureGroups.shield = [
			g.spritesheet.textures[ "shield1.png" ],
			g.spritesheet.textures[ "shield2.png" ],
			g.spritesheet.textures[ "shield3.png" ]
		];
	}

	function createAstroids( count, size, pos ) {
		for ( let i = 0; i < count; i++ ) {

			// Create the astroid object
			const astroid = {};
			astroid.rotationSpeed = Math.random() * 0.1 - 0.05;
			astroid.speed = ( Math.random() * 2 * ( 4 - size ) ) + 1;
			astroid.moveAngle = Math.random() * Math.PI * 2;
			astroid.isAlive = true;
			astroid.components = [];
			astroid.size = size;
			astroid.health = size * 2;

			// Create the astroid container
			astroid.container = new PIXI.Container();
			astroid.container.scale.x = 1.5;
			astroid.container.scale.y = 1.5;
			
			// Create the astroid body
			let textureGroup = game.textureGroups.bigAstroids;
			let explosionScale = 2.3;
			if( size === 2 ) {
				explosionScale = 1.0;
				textureGroup = game.textureGroups.mediumAstroids;
			} else if( size === 1 ) {
				explosionScale = 0.5;
				textureGroup = game.textureGroups.smallAstroids;
			}
			const texture = textureGroup[ Math.floor( Math.random() * textureGroup.length ) ];
			astroid.body = new PIXI.Sprite( texture );
			astroid.body.anchor.set( 0.5, 0.5 );
			astroid.body.rotation = Math.random() * Math.PI * 2;
			astroid.container.addChild( astroid.body );

			// Set the astroid's position
			let setPos;
			if( pos ) {
				const buffer = Math.max( astroid.body.width, astroid.body.height );
				setPos = {
					"x": pos.x + ( Math.random() * buffer - buffer / 2 ),
					"y": pos.y + ( Math.random() * buffer - buffer / 2 )
				};
			} else {
				setPos = game.world.toLocal(
					new PIXI.Point(
						Math.random() * g.app.screen.width,
						Math.random() * g.app.screen.height 
					)
				);
			}
			astroid.container.x = setPos.x;
			astroid.container.y = setPos.y;

			// Create the explosion
			astroid.explosion = createAnimation( "explosion", 0.35, explosionScale );
			astroid.container.addChild( astroid.explosion );

			// Add astroid components
			game.astroids.push( astroid );

			// Add the astroid to the world
			game.world.addChild( astroid.container );
		}
	}

	function createShip( name, color ) {

		// Create the ship container
		const ship = {};
		ship.container = new PIXI.Container();
		ship.components = [];
		ship.shieldCooldownMax = 200;
		ship.shieldCooldown = ship.shieldCooldownMax;
		ship.laserSounds = [ "laser1", "laser2", "laser3", "laser4", "laser5", "laser6" ];
		ship.laserSound = 0;

		// Set the ship's position to the center of the screen
		const pos = game.world.toLocal(
			new PIXI.Point( g.app.screen.width / 2, g.app.screen.height / 2 )
		);
		ship.container.x = pos.x;
		ship.container.y = pos.y;

		// Exhaust
		ship.exhaust = new PIXI.Graphics();
		ship.exhaust.lineStyle( 0 );
		ship.exhaust.beginFill( 0xFF0000 );
		ship.exhaust.drawPolygon( [ -10, 0, 10, 0, 0, 50 ] );
		ship.exhaust.endFill();
		ship.exhaust.beginFill( 0xFFFF00 );
		ship.exhaust.drawPolygon( [ -6, 0, 6, 0, 0, 30 ] );
		ship.exhaust.endFill();
		ship.exhaust.x = 0;
		ship.exhaust.y = 30;
		ship.exhaust.visible = false;
		ship.container.addChild( ship.exhaust );
		ship.components.push( ship.exhaust );

		// Ship Body
		ship.body = new PIXI.Sprite( g.spritesheet.textures[ name + "_" + color + ".png" ] );
		ship.body.anchor.set( 0.5, 0.5 );
		ship.container.addChild( ship.body );

		// Guns
		ship.guns = [ [ 25, 0 ], [ -25, 0 ] ];
		ship.guns = ship.guns.map( ( gun ) => {
			const gunSprite = new PIXI.Sprite( g.spritesheet.textures[ "gun00.png" ] );
			gunSprite.anchor.set( 0.5, 0.5 );
			gunSprite.rotation = Math.PI;
			gunSprite.x = gun[ 0 ];
			gunSprite.y = gun[ 1 ];
			ship.container.addChild( gunSprite );
			ship.components.push( gunSprite );
			return gunSprite;
		} );

		// Create some bullets
		ship.bullets = [];
		for ( let i = 0; i < 14; i++ ) {

			// Create the bullet
			const bullet = {};
			bullet.speed = 10;
			bullet.components = [];
			bullet.isAlive = false;

			// Create the bullet container
			bullet.container = new PIXI.Container();
			bullet.container.visible = false;

			// Create the bullet body
			bullet.body = new PIXI.Sprite( g.spritesheet.textures[ "laserBlue01.png" ] );
			bullet.body.anchor.set( 0.5, 0.5 );
			bullet.container.addChild( bullet.body );

			// Create the bullet explosion
			bullet.explosion = createAnimation( "laserBlast", 0.25, 1.0 );
			bullet.container.addChild( bullet.explosion );

			// Add the bullet components
			ship.bullets.push( bullet );

			// Add the bullet to the world
			game.world.addChild( bullet.container );
		}

		// Create the shield
		ship.shield = new PIXI.Sprite( g.spritesheet.textures[ "shield3.png" ] );
		ship.shield.anchor.set( 0.5, 0.5 );
		ship.shield.alpha = 0;
		ship.container.addChild( ship.shield );

		// Create the explosion
		ship.explosion = createAnimation( "explosion", 0.35, 2.3 );
		ship.container.addChild( ship.explosion );

		// Set the ship's initial speed and rotation
		ship.acceleration = 0;
		ship.accelerationMax = 0.1;
		ship.velociytX = 0;
		ship.velocityY = 0;
		ship.rotationSpeed = 0;
		ship.rotationSpeedMax = 0.05;
		ship.isAlive = true;
		ship.isFiring = false;
		ship.fireCooldown = 0;
		ship.fireCooldownMax = 20;

		// Add the ship to the world
		game.world.addChild( ship.container );

		return ship;
	}

	function createAnimation( name, speed, scale ) {
		const animation = new PIXI.AnimatedSprite( game.textureGroups[ name ] );
		animation.anchor.set( 0.5, 0.5 );
		animation.visible = false;
		animation.animationSpeed = speed;
		animation.loop = false;
		animation.scale.x = scale;
		animation.scale.y = scale;

		return animation;
	}

	function run( delta ) {
		if( game.isRunning ) {
			moveShip( game.ship, delta );
			moveBullets( game.ship.bullets, delta );
		}

		moveAstroids( game.astroids, delta );
	}

	function moveShip( ship, delta ) {
		if( ship.isAlive ) {
			ship.container.rotation += ship.rotationSpeed * delta;
			if( ship.acceleration > 0 ) {
				ship.velociytX += Math.cos( ship.container.rotation - Math.PI / 2 ) * ship.acceleration;
				ship.velocityY += Math.sin( ship.container.rotation - Math.PI / 2 ) * ship.acceleration;
			}
			if( ship.isFiring && ship.fireCooldown <= 0 ) {
				fireBullets( ship );
				ship.fireCooldown = ship.fireCooldownMax;
			}
			ship.exhaust.visible = ship.acceleration > 0;
			ship.shieldCooldown = Math.max( 0, ship.shieldCooldown - delta );
			if( ship.shieldCooldown > 0 ) {
				ship.shield.alpha = Math.sin(
					( ship.shieldCooldown / ship.shieldCooldownMax ) * Math.PI
				);
			} else {
				ship.shield.visible = false;
			}
		} else {
			ship.exhaust.visible = false;
		}
		ship.container.x += ship.velociytX * delta;
		ship.container.y += ship.velocityY * delta;
		ship.fireCooldown = Math.max( 0, ship.fireCooldown - delta );
		wrapObject( ship.container );
	}

	function moveBullets( bullets, delta ) {
		bullets.forEach( ( bullet ) => {
			if( bullet.isAlive ) {

				// Move the bullet
				bullet.container.x += Math.cos( bullet.container.rotation - Math.PI / 2 ) * bullet.speed * delta;
				bullet.container.y += Math.sin( bullet.container.rotation - Math.PI / 2 ) * bullet.speed * delta;

				// Set the bullet lifespan and alpha
				bullet.lifespan -= delta;
				if( bullet.lifespan <= 0 ) {
					bullet.container.visible = false;
					bullet.isAlive = false;
				} else if( bullet.lifespan <= 10 ) {
					bullet.container.alpha = bullet.lifespan / 10;
				}

				// check for collisions with the astroids
				game.astroids.forEach( ( astroid ) => {
					if( !astroid.isAlive ) {
						return;
					}
					if( checkCollision( bullet.container, astroid.container ) ) {
						astroid.health--;
						if( astroid.health <= 0 ) {
							killObject( astroid );
							if( astroid.size > 1 ) {
								createAstroids(
									astroid.size,
									astroid.size - 1,
									{ "x": astroid.container.x, "y": astroid.container.y }
								);
							}
						}
						killObject( bullet );
					}
				} );
			}
		} );
	}

	function moveAstroids( astroids, delta ) {
		astroids.forEach( ( astroid ) => {
			astroid.container.x += Math.cos( astroid.moveAngle ) * astroid.speed * delta;
			astroid.container.y += Math.sin( astroid.moveAngle ) * astroid.speed * delta;
			astroid.body.rotation += astroid.rotationSpeed * delta;

			if( !astroid.isAlive ) {
				return;
			}
			// Wrap the astroids
			wrapObject( astroid.container );

			// Check for collisions with the ship
			if( game.isRunning && game.ship.isAlive && game.ship.shieldCooldown <= 0 ) {
				if( checkCollision( game.ship.container, astroid.container ) ) {
					killObject( game.ship );
				}
			}
		} );
	}

	function wrapObject( obj ) {
		const padding = Math.max( obj.width, obj.height );
		const worldWidth = ( g.app.screen.width / g.app.stage.scale.x / game.world.scale.x ) +
			( padding * 2 );
		const worldHeight = ( g.app.screen.height / g.app.stage.scale.y / game.world.scale.y ) +
			( padding * 2 );
		if( obj.x < -padding ) {
			obj.x += worldWidth;
		} else if( obj.x > worldWidth ) {
			obj.x -= ( worldWidth + padding );
		}
		if( obj.y < -padding ) {
			obj.y += worldHeight;
		} else if( obj.y > worldHeight ) {
			obj.y -= ( worldHeight + padding );
		}
	}

	function checkCollision( obj1, obj2 ) {
		const pos = obj1.toGlobal( new PIXI.Point( 0, 0 ) );
		return obj2.getBounds().contains( pos.x, pos.y );
	}

	function killObject( obj ) {
		obj.isAlive = false;
		obj.explosion.visible = true;
		obj.explosion.onFrameChange = () => {
			if( obj.explosion.currentFrame === Math.round( obj.explosion.totalFrames / 2 ) ) {
				obj.body.visible = false;
				obj.components.forEach( ( component ) => {
					component.visible = false;
				} );
			}
		}
		obj.explosion.onComplete = () => {
			obj.explosion.visible = false;
			obj.explosion.gotoAndStop( 0 );
			obj.container.visible = false;
		};
		obj.explosion.play();
	}

	function fireBullets( ship ) {
		let didFire = false;
		ship.guns.forEach( ( gun ) => {
			const bullet = getBullet( ship );
			if( !bullet ) { 
				return;
			}
			didFire = true;
			g.assets.audio[ ship.laserSounds[ ship.laserSound ] ].play();
			bullet.isAlive = true;
			bullet.body.visible = true;
			const pos = game.world.toLocal( gun.position, ship.container );
			bullet.container.x = pos.x;
			bullet.container.y = pos.y;
			bullet.container.rotation = ship.container.rotation;
			bullet.container.visible = true;
			bullet.lifespan = 100;
			bullet.container.alpha = 1;
		} );
		if( didFire ) {
			ship.laserSound = ( ship.laserSound + 1 ) % ship.laserSounds.length;
		}
	}

	function getBullet( ship ) {
		for ( let i = 0; i < ship.bullets.length; i++ ) {
			if ( !ship.bullets[ i ].container.visible ) {
				return ship.bullets[ i ];
			}
		}
		return null;
	}

	function keydown( e ) {
		if( e.key === "ArrowLeft" ) {
			game.ship.rotationSpeed = -game.ship.rotationSpeedMax;
		} else if( e.key === "ArrowRight" ) {
			game.ship.rotationSpeed = game.ship.rotationSpeedMax;
		} else if( e.key === "ArrowUp" ) {
			game.ship.exhaust.visible = true;
			game.ship.acceleration = game.ship.accelerationMax;
		} else if( e.key === " " ) {
			game.ship.isFiring = true;
		}
	}

	function keyup( e ) {
		if( e.key === "ArrowLeft" || e.key === "ArrowRight" ) {
			game.ship.rotationSpeed = 0;
		} else if( e.key === "ArrowUp" ) {
			game.ship.exhaust.visible = false;
			game.ship.acceleration = 0;
		} else if( e.key === " " ) {
			game.ship.isFiring = false;
		}
	}

	function blur() {
		game.ship.rotationSpeed = 0;
		game.ship.exhaust.visible = false;
		game.ship.acceleration = 0;
		game.ship.isFiring = false;
	}

} )();