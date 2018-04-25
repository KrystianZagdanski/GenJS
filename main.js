var wx =  1200;
var wy = 700;
var canvas = document.getElementById("canvas");
canvas.width = wx;
canvas.height = wy;
var ctx = canvas.getContext("2d");


var TIME = 15; //Time to complete task
var population = 200; // populatin size
var map = map2;

var gen = 0; // curent generation
var timer = TIME; // count down
var alive = 0; // number of alive units
var score = 0; // number of units that completed task (now)
var lastScore = 0; // -||- generation before
var bestScore = 0;
var mutation = 0; // % of mutation it curent population
var firstGoal = -1; // first generation when task was completed
var above50 = -1; // 50% ofpopulation complete task
var above80 = -1; // 80% of population coplete task

var target; 
var startPoint = {x: 100, y: wy/2};
var obstacles = []; // object on the map
var pop = []; // array of units (population)
var newPop = []; // genes for nwe population
var newPopWI = []; // few units that complete task in last generation (unit with white line)
var newPopBI = []; // -||- that wsa close to complete task (unit with blue line)
var pool = []; // just probability of being chosen

function Menu() // draw top left info 
{
	var x = 10, y = 24;
	ctx.fillStyle = "#fff";
	ctx.font = "24px Verdana Bold";
	ctx.fillText("Gen: "+gen,x,y);
	ctx.font = "14px Verdana";
	if(firstGoal != -1)
		ctx.fillText("First Goal: "+firstGoal,x+150,y);
	if(above50 != -1)
		ctx.fillText("Score > 50%: "+above50,x+150,y+15);
	if(above80 != -1)
		ctx.fillText("Score > 80%: "+above80,x+150,y+30);

	ctx.fillText("Timer: "+timer,x,y+15);
	ctx.fillText("Alive: "+alive,x,y+30);
	ctx.fillText("Score: "+score,x,y+45);
	ctx.fillText("Last: "+lastScore,x,y+60);
	ctx.fillText("Best: "+bestScore,x,y+75);
	ctx.fillText("Mutation: "+mutation+"%",x,y+90);
}

function Timer() 
{
	if(timer > 0)
		timer -= 1;
}


function Update(timestamp)
{

	if(alive <= 0 || timer == 0)
	{
		Sort(); // sort pop best units first
		setPool();
		Fuck(); // umm push 15% of this gen to new gen, 85% create from parents
		Mutation(); // change part of DNA for around 8% of population
	}
	//update
	for(var i = 0; i < pop.length; i++)
	{
		pop[i].move();
		pop[i].colide();
	}
	//draw
	map.draw();

	for(var i = pop.length-1; i >= 0 ; i--)
	{
		pop[i].draw();
	}
	Menu();
	
	//update (60FPS)
	requestAnimationFrame(Update);
}

map.open(); // prepare map
Create(); // create full population

requestAnimationFrame(Update);
var tm = setInterval(Timer,1000);