function Rand(min, max)
{
	return Math.floor((Math.random() * (max-min) + min));
}

function RColor() // hmm i didn't use it
{
	var HEX = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F'];
	h = "#";
	for(var i = 0; i < 3; i++)
	{
		h += HEX[Rand(0,15)];
	}
	return h;
}

function distance(a,b) // return distace betwen 2 circles
{
	var dx = a.x - b.x;
	var dy = a.y - b.y;
	var dis = Math.sqrt(dx * dx + dy * dy);
	return dis;
}

function colide(cir1,cir2) // check if circles colide
{
	var dis = distance(cir1,cir2);
	return dis <= cir1.r + cir2.r;
}

function Sort() // sort population
{
	var cmpr = function(a,b)
	{
		const disA = a.dis - (a.time/60);
		const disB = b.dis - (b.time/60);

		if (disA > disB)
			return 1;
		else if (disA < disB)
			return -1;
		else
			return 0;
	}
	pop.sort(cmpr);
}

function setPool() // set pool of index of units
{
	for(var i = 0; i < pop.length; i++)
	{
		for(var x = 0; x < pop[i].fitnes; x++)
		{
			pool.push(i);
		}
	}
}

function Fuck() // CHANGE THAT NAME!!!
{
	var x = 0;
	while(newPop.length < Math.round(population * 0.15)) // push 15% of old pop DNA to new
	{
		if(Math.random() > 0.1) // 90% for top Unit to get rewrite
		{
			newPop.push(pop[x].dna);
			if(pop[x].win)
				newPopWI.push(newPop.length-1);
			else
				newPopBI.push(newPop.length-1);

		}
		else // 10% other random get lucky
		{
			var r = pool[Rand(x,pool.length)];
			newPop.push(pop[r].dna);
		}
		x++;
	}
	while(newPop.length < population) // 85% of new pop are  born from parents 
	{
		var r1 = pool[Rand(0,pool.length)]; // get random index from pool
		var r2 = pool[Rand(0,pool.length)]; 
		
		var u1 = pop[r1].dna;// get Unit DNA
		var u2 = pop[r2].dna;

		if(u1 === u2) // NO! They can't self-fuck   umm what? ohh
			continue;

		// slice DNA 1 and 2 and join like this 1-2-1-2   2-1-2-1
		var l = u1.length/4;

		var u1a = u1.slice(0,l);
		var u1b = u1.slice(l,l*2);
		var u1c = u1.slice(l*2,l*3);
		var u1d = u1.slice(l*3,l*4);

		var u2a = u2.slice(0,l);
		var u2b = u2.slice(l,l*2);
		var u2c = u2.slice(l*2,l*3);
		var u2d = u2.slice(l*3,l*4);

		newPop.push(u1a.concat(u2b,u1c,u2d));
		if(newPop.length < population)
			newPop.push(u2a.concat(u1b,u2c,u1d));
	}
	
}

function Mutation()
{
	var lw = 0, lb = 0, m = 0;
	for(var i = 0; i < newPop.length; i++)
	{
		var r = Math.random();
		if(r > 0.92) // around 8% of new pop change something in DNA
		{
			m++;
			var lvl = Rand(10,50); // change 10 - 49 parts of DNA
			for(; 0 < lvl; lvl--)
			{
				newPop[i][Rand(0,newPop[i].length)] = Rand(-1,2);
			}
		}
		// Create new population
		if(i == newPopWI[lw])
		{
			CreteOne(newPop[i],i, true);
			lw++;
		}
		else if(i == newPopBI[lb])
		{
			CreteOne(newPop[i],i, false,true);
			lb++;
		}
		else
			CreteOne(newPop[i],i);
	}

	// Set values to start new generation
	gen++;
	alive = newPop.length;
	timer = TIME;
	lastScore = score;
	if(score > bestScore)
		bestScore = score;
	score = 0;
	mutation = Math.round((m/population)*100);
	newPop = [];
	newPopWI = [];
}

function CreteOne(dna,index,winer,best)
{
	pop[index] = new Unit(startPoint.x, startPoint.y, 10, dna);
	if(winer)
		pop[index].lastWinner = true;
	if(best)
		pop[index].best = true;
}

function Create()
{
	for(var i = 0; i < population; i++)
	{
		pop[i] = new Unit(startPoint.x, startPoint.y, 10);
		alive += 1;
	}
}