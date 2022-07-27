var ground, groundImg, invisibleGround
var robot, robotImg
var cloud, cloudImg, cloudsGroup
var obstacle1,obstacle2, obstaclesGroup

var PLAY = 1
var END
var gameState = PLAY;

var gameOver, gameOverImg
var restart, restartImg
var score


function preload(){
groundImg = loadImage("ground2.png");
robotImg = loadImage("robot.png");
cloudImg = loadImage("cloud.png");
obstacle1 = loadImage("obstacle1.png");
obstacle2 = loadImage("obstacle2.png");
gameOverImg = loadImage("gameOver.png");
restartImg = loadImage("restart.png");
}

function setup() {
createCanvas(windowWidth, windowHeight);

robot = createSprite(50,height-70,20,50);
robot.addImage(robotImg);
robot.setCollider('circle',0,0,350);
robot.scale = 0.1;

invisibleGround = createSprite(width/2,height-10,width,125);  
invisibleGround.visible = false;
  
ground = createSprite(width/2,height-30,width,2);
ground.addImage("ground",groundImg);
ground.x = width/2;
ground.velocityX = -3;

gameOver = createSprite(width/2,height/2- 50);
gameOver.addImage(gameOverImg);
gameOver.scale = 0.5;

restart = createSprite(width/2,height/2);
restart.addImage(restartImg);
restart.scale = 0.5;

gameOver.visible = false;
restart.visible = false;

cloudsGroup = new Group();
obstaclesGroup = new Group();

score = 0;
}

function draw() {
 
textSize(20);
fill("black")
text("Score: "+ score,30,50);

if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    if((touches.length > 0 || keyDown("SPACE")) && robot.y  >= height-120) {
    robot.velocityY = -10;
        touches = [];
    }
    robot.velocityY = robot.velocityY + 0.8
    if (ground.x < 0){
        ground.x = ground.width/2;
      }
      robot.collide(invisibleGround);
      spawnClouds();
      spawnObstacles();

      if(obstaclesGroup.isTouching(robot)){
        gameState = END;
    }
}

else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    ground.velocityX = 0;
    robot.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(touches.length>0 || keyDown("SPACE"))
     {      
      reset();
      touches = []
    }
}
drawSprites();
}


function spawnClouds() {
    if (frameCount % 100 === 0) {
      var cloud = createSprite(width+20,height-300,40,10);
      cloud.y = Math.round(random(70,170));
      cloud.addImage(cloudImg);
      cloud.scale = 0.5;
      cloud.velocityX = -3;
      cloud.lifetime = 300;
      cloud.depth = robot.depth;
      robot.depth = robot.depth+1;
 
      cloudsGroup.add(cloud);
    }
  }

  function spawnObstacles() {
    if(frameCount % 70 === 0) {
      var obstacle = createSprite(600,height-95,20,30);
      obstacle.setCollider('circle',0,0,45)
      obstacle.velocityX = -3
      var rand = Math.round(random(1,2));
      switch(rand) {
        case 1: obstacle.addImage(obstacle1);
                break;
        case 2: obstacle.addImage(obstacle2);
                break;
        default: break;
      }
         
      obstacle.scale = 0.03;
      obstacle.lifetime = 300;
      obstacle.depth = robot.depth;
      robot.depth +=1;
      obstaclesGroup.add(obstacle);
    }
  }
  
  function reset(){
    gameState = PLAY;
    gameOver.visible = false;
    restart.visible = false;
    
    obstaclesGroup.destroyEach();
    cloudsGroup.destroyEach();
    score = 0;
  }