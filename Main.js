/* Define Canvas */

var canvas;
var stage;

/* [Graphics] */

/* Background */

var bgImg = new Image();
var bg;
var bg2Img = new Image();
var bg2;

/* Ship */

var sImg = new Image();
var ship;

/* Enemy */

var eImg = new Image();

/* Boss */

var bImg = new Image();
var boss;

/* Lives */

var lImg = new Image();

/* Bullets */

var bltImg = new Image();

/* Alert */

var winImg = new Image();
var loseImg = new Image();
var win;
var lose;

/* Variables */

var lives = new Container();
var bullets = new Container();
var enemies = new Container();
var bossHealth = 20;
var score;
var gfxLoaded = 0;
/* width ="320" height ="480" */
var centerX =  240;
var centerY = 400;
var tkr = new Object();
var timerSource;

/* Main */

function Main()
{
	/* Link Canvas */
	
	canvas = document.getElementById('Shooter');
  	stage = new Stage(canvas);
  		
  	stage.mouseEventsEnabled = true;
  	
  	/* Sound */

	SoundJS.addBatch([
		{name:'boss', src:'boss.wav', instances:1},
		{name:'explo', src:'explo.mp3', instances:10},
		{name:'shot', src:'shot.wav', instances:10},
		{name:'song', src:'song.wav', instances:1},
		{name:'fail', src:'fail.mp3', instances:3}]);

	SoundJS.addBatch([
		{name:'victory', src: 'victory.wav', instances:1},
		{name: 'letmeout', src: 'letmeout.wav', instances:1},
		{name:'lose', src:'lose.wav', instances:1}]);
  		
  	/* Load GFX */
  		
  	bgImg.src = 'bg.gif';
  	bgImg.name = 'bg';
  	bgImg.onload = loadGfx;
  	
  	bg2Img.src = 'bg.gif';
  	bg2Img.name = 'bg2';
  	bg2Img.onload = loadGfx;
  	
  	sImg.src = 'shipgif.gif';
  	sImg.name = 'ship';
  	sImg.onload = loadGfx;
	
	eImg.src = 'asteroid1.png';
	eImg.name = 'enemy';
	eImg.onload = loadGfx;
	
	bImg.src = 'boss.png';
	bImg.name = 'boss';
	bImg.onload = loadGfx;
	
	lImg.src = 'live.png';
	lImg.name = 'live';
	lImg.onload = loadGfx;
	
	bltImg.src = 'bullet.png';
	bltImg.name = 'bullet';
	bltImg.onload = loadGfx;
	
	winImg.src = 'win.png';
	winImg.name = 'win';
	winImg.onload = loadGfx;
	
	loseImg.src = 'lose.png';
	loseImg.name = 'lose';
	loseImg.onload = loadGfx;
	
	/* Ticker */
	
	Ticker.setFPS(90);
	Ticker.addListener(stage);
}

function loadGfx(e)
{
	if(e.target.name = 'bg'){bg = new Bitmap(bgImg);}
	if(e.target.name = 'bg2'){bg2 = new Bitmap(bg2Img);}
	if(e.target.name = 'ship'){ship = new Bitmap(sImg);}
	
	gfxLoaded++;
	
	if(gfxLoaded == 9)
	{
		addGameView();
	}
}

function intro()
{

}

function addGameView()
{
	ship.x = centerX;
	ship.y = 800;
	
	/* Add Lives */
	
	for(var i = 0; i < 3; i++)
	{
		var l = new Bitmap(lImg);
		
		l.x = 400 + (25 * i);
		l.y = centerY + 375;
		
		lives.addChild(l);
		stage.update();
	}
	
	/* Score Text */
	
	score = new Text('0', 'bold 24px Courier New', '#FFFFFF');
	score.maxWidth = 1000;	//fix for Chrome 17
	score.x = 5;
	score.y = 790;
	
	/* Second Background */
	
	bg2.y = -480;
	
	/* Add gfx to stage and Tween Ship */
	
	stage.addChild(bg, bg2, ship, enemies, bullets, lives, score);
	Tween.get(ship).to({y:700}, 1000).call(startGame);

}

function moveShip(e)
{
	ship.x = e.stageX - 18.5;
}

function shoot()
{
	var b = new Bitmap(bltImg);
	
	b.x = ship.x + 27;
	b.y = ship.y - 20;
	
	bullets.addChild(b);
	stage.update();
	boss.x += Math.floor((Math.random() * -5)+5);

	
	SoundJS.play('shot');
}

function addEnemy()
{
	var e = new Bitmap(eImg);
	
	e.x = Math.floor(Math.random() * (320 - 50))
	e.y = -50
	
	enemies.addChild(e);
	stage.update();
}

function startGame()
{
	SoundJS.play('song');
	stage.onMouseMove = moveShip;
	bg.onPress = shoot;
	bg2.onPress = shoot;
	
	Ticker.addListener(tkr, false);
	tkr.tick = update;

	timerSource = setInterval('addEnemy()', 1000);
	stage.canvas.style.cursor = "none";

}

function update()
{
	/* Move Background */
	
	bg.y += 5;
	bg2.y += 5;
	
	if(bg.y >= 480)
	{
		bg.y = -480;
	}
	else if(bg2.y >= 480)
	{
		bg2.y = -480;
	}
	
	/* Move Bullets */
	
	for(var i = 0; i < bullets.children.length; i++)
	{
		bullets.children[i].y -= 20;
		
		/* Remove Offstage Bullets */
		
		if(bullets.children[i].y < - 50)
		{
			bullets.removeChildAt(i);
		}
	}
	
	/* Show Boss */
	
	if(parseInt(score.text) >= 500 && boss == null)
	{
		boss = new Bitmap(bImg);
				
		SoundJS.play('boss');
				
		boss.x = centerX - 90;
		boss.y = -300;
				
		stage.addChild(boss);
		Tween.get(boss).to({y:60}, 2000)

	}


	
	/* Move Enemies */
	
	for(var j = 0; j < enemies.children.length; j++)
	{
		enemies.children[j].y += 10	;
		
		/* Remove Offstage Enemies */
		
		if(enemies.children[j].y > 800 + 50)
		{
			enemies.removeChildAt(j);
			lives.removeChildAt(lives.length);
			SoundJS.play('fail')
			score.text = parseFloat(score.text - 30)
		}
		
		for(var k = 0; k < bullets.children.length; k++)
		{
			/* Bullet - Enemy Collision */
	
			if(bullets.children[k].x >= enemies.children[j].x && bullets.children[k].x + 11 < enemies.children[j].x + 49 && bullets.children[k].y < enemies.children[j].y + 40)
			{
				bullets.removeChildAt(k);
				enemies.removeChildAt(j);
				stage.update();
				SoundJS.play('explo');
				score.text = parseFloat(score.text + 50);
			}
			
			/* Bullet - Boss Collision */
			
			if(boss != null && bullets.children[k].x >= boss.x && bullets.children[k].x + 11 < boss.x + 183 && bullets.children[k].y < boss.y + 162)
			{
				bullets.removeChildAt(k);
				bossHealth--;
				stage.update();
				SoundJS.play('explo');
				score.text = parseInt(score.text + Math.floor(Math.random() * 20));
				boss.y += Math.floor(Math.random() * 22);
				boss.x += Math.floor(Math.random() * 5);
			}
		}
		
		/* Ship - Enemy Collision */
		
		if(enemies.hitTest(ship.x, ship.y) || enemies.hitTest(ship.x + 37, ship.y))
		{
			enemies.removeChildAt(j);
			lives.removeChildAt(lives.length);
			ship.y = 800 + 34;
			Tween.get(ship).to({y:700}, 500)
			SoundJS.play('explo');
		}
	}
	
	/* Check for win */
	
	if(boss != null && bossHealth <= 0)
	{
		alert('win');
	}
	
	/* Check for lose */
	
	if(lives.children.length <= 0)
	{
		alert('lose');
	}
}

function alert(e)
{
	/* Remove Listeners */
		
	stage.onMouseMove = null;
	bg.onPress = null;
	bg2.onPress = null;
	
	Ticker.removeListener(tkr);
	tkr = null;
	
	timerSource = null;
	
	/* Display Correct Message */
	
	if(e == 'win')
	{
		SoundJS.play('letmeout');
		SoundJS.play('victory');
		win = new Bitmap(winImg);
		win.x = centerX - 70;
		win.y = centerY - 50;
		stage.addChild(win);
		stage.removeChild(boss);
	}
	else
	{
		SoundJS.play('lose');
		lose = new Bitmap(loseImg);
		lose.x = centerX - 70;
		lose.y = centerY - 50;
		stage.addChild(lose);
		stage.removeChild(enemies, ship);
	}
	
	bg.onPress = function(){window.location.reload();};
	bg2.onPress = function(){window.location.reload();};
	stage.update();

}