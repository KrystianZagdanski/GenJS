// config
const TIME = 10*60; //Time to complete task
const map = map1; //Current map
// config end

let gen = 0; // generation counter
let timer = TIME;
let alive = 0; // number of alive units

let target; // meta circle
let startPoint = {x: 100, y: canvasH/2};
let obstacles = []; // object on the map
let pop = new Population();
map.open(); // prepare map

function drawMenu() // draw top left info text
{
	let x = 10, y = 24;
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
	ctx.fillText("Mutation: "+mutation+"%",x,y+30);
	ctx.fillText("Alive: "+alive,x,y+45);
	ctx.fillText("Score: "+score,x,y+60);
	ctx.fillText("Last: "+lastScore,x,y+75);
	ctx.fillText("Best: "+bestScore,x,y+90);
	if(bestTime < 1000)
		ctx.fillText("BestTime: "+bestTime,x,y+105);
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
	let dx = a.x - b.x;
	let dy = a.y - b.y;
	let dis = Math.sqrt(dx * dx + dy * dy);
	return dis;
}

function setValues() // set values for new test
{
	gen++;
	alive = pop.units.length;
	timer = TIME;
	lastScore = score;
	if(score > bestScore)
		bestScore = score;
	score = 0;
}

function Update()
{
	
	/*
		Create new population
	*/
	if(alive <= 0 || timer == 0)
	{
		pop.calculateFitness();
		pop.sort();
		//console.log("Sorted:", pop.units);
		pop.rewrite();
		//console.log("rewrite:", pop.newUnits);
		pop.crossover();
		//console.log("crossover:", pop.newUnits);
		pop.mutate();
		//console.log("mute:", pop.newUnits);
		pop.applyNewPopulation();
		//console.log("apply:", pop.newUnits, pop.units);
		setValues();
	}

	/*
		Update
	*/
	for(let i = 0; i < POPULATION_SIZE; i++)
	{
		pop.units[i].move();

		// check if Unit find solution
		if(!pop.units[i].win && pop.units[i].collider.colideWith(target))
		{
			pop.units[i].win = true;
			score++;
			alive--;
			if(pop.units[i].ttc < bestTime)
				bestTime = pop.units[i].ttc;
			if(firstGoal == -1)
				firstGoal = gen;
			if(score >= Math.round(POPULATION_SIZE/2) && above50 == -1)
				above50 = gen;
			if(score >= Math.round(POPULATION_SIZE*0.8) && above80 == -1)
				above80 = gen;
		}

		// detect colision 
		for(let x = 0; x < obstacles.length; x++)
		{
			//console.log(pop.units[i], obstacles[x], pop.units[i].collider.colideWith(obstacles[x]));	
			if(pop.units[i].alive && pop.units[i].collider.colideWith(obstacles[x]))
			{
				pop.units[i].alive = false;
				alive--;
				break;
			}
		}
	}

	/*
		Draw
	*/
	map.draw();
	for(let i = POPULATION_SIZE-1; i >= 0 ; i--)
	{
		pop.units[i].draw();
	}
	drawMenu();

	if(timer > 0)
		timer -= 1;

	//update (60FPS)
	requestAnimationFrame(Update);
}

requestAnimationFrame(Update);