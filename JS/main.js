// config
const TIME = 10; //Time to complete task
const map = map1;
var stop = false;

var gen = 0; // curent generation
var timer = TIME; // count down
var alive = 0; // number of alive units

var target; 
var startPoint = {x: 100, y: wy/2};
var obstacles = []; // object on the map
var pop = new Population();
map.open(); // prepare map

function drawMenu() // draw top left info 
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
	if(timer > 0 && !stop)
		timer -= 1;
}

function Rand(min, max)
{
	return Math.floor((Math.random() * (max-min) + min));
}

function Distance(a,b) // return distace betwen 2 circles
{
	var dx = a.x - b.x;
	var dy = a.y - b.y;
	var dis = Math.sqrt(dx * dx + dy * dy);
	return dis;
}

function resetValues()
{
	gen++;
	alive = pop.population.length;
	timer = TIME;
	lastScore = score;
	if(score > bestScore)
		bestScore = score;
	score = 0;
}

function Update(timestamp)
{
	if(!stop)
	{
		if(alive <= 0 || timer == 0)
		{
			pop.calculateFitness();
			pop.sort();
			//console.log("Sorted:", pop.population);
			pop.rewrite();
			//console.log("rewrite:", pop.newPopulation);
			pop.born();
			//console.log("born:", pop.newPopulation);
			pop.mutate();
			//console.log("mute:", pop.newPopulation);
			pop.applyNewPopulation();
			//console.log("apply:", pop.newPopulation, pop.population);
			resetValues();
		}
		//update
		for(let i = 0; i < POPULATION_SIZE; i++)
		{
			pop.population[i].move();
			if(!pop.population[i].win && pop.population[i].colider.colideWith(target))
			{
				pop.population[i].win = true;
				score++;
				alive--;
				if(firstGoal == -1)
					firstGoal = gen;
				if(score >= Math.round(POPULATION_SIZE/2) && above50 == -1)
					above50 = gen;
				if(score >= Math.round(POPULATION_SIZE*0.8) && above80 == -1)
					above80 = gen;
			}
			for(let x = 0; x < obstacles.length; x++)
			{
				//console.log(pop.population[i], obstacles[x], pop.population[i].colider.colideWith(obstacles[x]));	
				if(pop.population[i].alive && pop.population[i].colider.colideWith(obstacles[x]))
				{
					pop.population[i].alive = false;
					alive--;
					break;
				}
			}
		}
		//draw
		map.draw();
	
		for(var i = POPULATION_SIZE-1; i >= 0 ; i--)
		{
			pop.population[i].draw();
		}
		drawMenu();
	}
	//update (60FPS)
	requestAnimationFrame(Update);
}

requestAnimationFrame(Update);
var tm = setInterval(Timer,1000);