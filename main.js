var wx = window.innerWidth;
var wy = window.innerHeight;
var canvas = document.getElementById("canvas");
canvas.width = wx;
canvas.height = wy;
var ctx = canvas.getContext("2d");


var TIME = 15;
var population = 100;

var gen = 0;
var timer = TIME;
var alive = 0;
var score = 0;
var lastScore = 0;
var bestScore = 0;
var mutation = 0;
var firstGoal = -1;
var above50 = -1;
var above80 = -1;

var target;
var startPoint = {x: 100, y: wy/2};
var obstacles = [];
var pop = [];
var newPop = [];
var newPopWI = [];
var newPopBI = [];
var pool = [];

function Menu()
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
		Sort();
		setPool();
		Fuck();
		Mutation();
	}
	//update
	for(var i = 0; i < pop.length; i++)
	{
		pop[i].move();
		pop[i].colide();
	}
	//draw
	map3.draw();

	for(var i = 0; i < pop.length; i++)
	{
		pop[i].draw();
	}
	Menu();
	//restart
	requestAnimationFrame(Update);
}

map3.open();
Create();

requestAnimationFrame(Update);
var tm = setInterval(Timer,1000);