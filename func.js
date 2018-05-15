function Rand(min, max)
{
	return Math.floor((Math.random() * (max-min) + min));
}

function RColor()
{
	var HEX = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F'];
	h = "#";
	for(var i = 0; i < 3; i++)
	{
		h += HEX[Rand(0,15)];
	}
	return h;
}

function distance(a,b)
{
	var dx = a.x - b.x;
	var dy = a.y - b.y;
	var dis = Math.sqrt(dx * dx + dy * dy);
	return dis;
}

function colide(cir1,cir2)
{
	var dis = distance(cir1,cir2);
	return dis <= cir1.r + cir2.r;
}

function Sort()
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

function setPool()
{
	for(var i = 0; i < pop.length; i++)
	{
		for(var x = 0; x < pop[i].fitnes; x++)
		{
			pool.push(i);
		}
	}
}

function Fuck()
{
	var x = 0;
	while(newPop.length < Math.round(population * 0.15))
	{
		if(Math.random() > 0.1)
		{
			newPop.push(pop[x].dna);
			if(pop[x].win)
				newPopWI.push(newPop.length-1);
			else
				newPopBI.push(newPop.length-1);

		}
		else
		{
			var r = pool[Rand(x,pool.length)];
			newPop.push(pop[r].dna);
		}
		x++;
	}
	while(newPop.length < population)
	{
		var r1 = pool[Rand(0,pool.length)];
		var r2 = pool[Rand(0,pool.length)];
		
		var u1 = pop[r1].dna;
		var u2 = pop[r2].dna;

		if(u1 === u2)
			continue;

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
		if(r > 0.92)
		{
			m++;
			var lvl = Rand(10,50);
			for(; 0 < lvl; lvl--)
			{
				newPop[i][Rand(0,newPop[i].length)] = Rand(-1,2);
			}
		}
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