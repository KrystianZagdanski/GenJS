function Circle(x,y,r, color)
{
	this.x = x;
	this.y = y;
	this.r = r;
	if(color)
		this.color = color;
	else
		this.color = "#222";
	this.draw = function()
	{
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(this.x,this.y,this.r,0,2*Math.PI);
		ctx.fill();	
	}
}

function Map(start, meta, struct)
{
	this.start = start;
	this.meta = new Circle(meta.x,meta.y,25,"#060");
	this.struct = struct;
	this.open = function()
	{
		startPoint = this.start;
		target = this.meta;
		obstacles = this.struct;
	}
	this.draw = function()
	{
		ctx.beginPath()
		ctx.fillStyle = "#000";
		ctx.fillRect(0,0,wx,wy);

		ctx.beginPath()
		ctx.strokeStyle = "rgba(255,255,255,0.1)";
		ctx.arc(start.x,start.y,30,0,2*Math.PI);
		ctx.stroke();

		for(var i =0; i < this.struct.length; i++)
		{
			this.struct[i].draw();
		}

		this.meta.draw();
	}

}

function Unit(x,y,r,dna)
{
	this.x = x;
	this.y = y;
	this.r = r;
	this.angle = 0;
	this.fitnes = 0;
	this.speed = (wx*1.5) / (TIME*30);
	this.time = 0;
	this.alive = true;
	this.win = false;
	this.lastWinner = false;
	this.best = false;
	this.dis = 999999;
	this.movePos = 0;
	if(dna)
		this.dna = dna;
	else
		this.dna = [];
	this.move = function()
	{
		var d = distance(this,target);
		if(d < this.dis)
			this.dis = d;
		if(this.alive && this.movePos < this.dna.length && !this.win)
		{
			if (this.dna[this.movePos] == -1)
				this.angle -= 1.6*this.speed;
			if (this.dna[this.movePos] == 1)
				this.angle += 1.6*this.speed;

			if(this.angle > 360)
				this.angle -= 360;
			if(this.angle < 360)
				this.angle += 360;
			this.x += this.speed * Math.cos(this.angle * Math.PI / 180);
    		this.y += this.speed * Math.sin(this.angle * Math.PI / 180);
			
			this.time++;
    		this.movePos++;
		}
	}
	this.colide = function()
	{
		if(this.alive && !this.win)
		{
			if(colide(this,target))
			{
				this.win = true;
				var scr = this.dis - (this.time/60);
				this.fitnes = 10*(wx-scr)/100;
				score++;
				alive--;
				if(firstGoal == -1)
					firstGoal = gen;
				if(score >= Math.round(population/2) && above50 == -1)
					above50 = gen;
				if(score >= Math.round(population*0.8) && above80 == -1)
					above80 = gen;
			}
			for(var i = 0; i < obstacles.length; i++)
			{
				if(colide(this,obstacles[i]))
				{
					this.alive = false;
				}
			}
			if(this.x - this.r < 0)
				this.alive = false;
			if(this.x + this.r > wx)
				this.alive = false;
			if(this.y - this.r < 0)
				this.alive = false;
			if(this.y + this.r > wy)
				this.alive = false;

			if(!this.alive)
				alive -= 1;
		}
		else if(this.fitnes == 0)
		{
			if(wx - this.dis <= 0)
				this.fitnes = 1;
			else
			{
				var scr = this.dis - (this.time/60);
				this.fitnes = (wx-scr)/100;
				if(!this.alive)
					this.fitnes -= 1;
				if(this.fitnes < 1)
					this.fitnes = 1;
			}
		}
	}
	this.update = function()
	{
		this.move();
		this.colide();
	}
	this.draw = function()
	{

		if(this.alive && !this.win)
		{
			//#a33
			if(this.lastWinner)
			{
				ctx.fillStyle = "rgba(205,0,0,0.8)";
				ctx.strokeStyle = "white";
				ctx.lineWidth = 4;
			}
			else if(this.best)
			{
				ctx.fillStyle = "rgba(170,51,51,0.5)";
				ctx.strokeStyle = "rgba(0,0,255,0.5)";
				ctx.lineWidth = 4;
			}
			else
			{
				ctx.fillStyle = "rgba(170,51,51,0.3)";
				ctx.strokeStyle = "rgba(255,165,0,0.5)";
				ctx.lineWidth = 3;
			}
		}
		else if(this.win)
		{
			if(this.lastWinner || this.best)
				ctx.fillStyle = "rgba(204,102,0,0.9)";
			else
				ctx.fillStyle = "rgba(255,255,0,0.8)";
			ctx.strokeStyle = "rgba(0,0,0,0)";
			ctx.lineWidth = 3;
		}
		else
		{
			//ctx.fillStyle = "#755";
			ctx.fillStyle = "rgba(119,85,85,0.5)";
			ctx.strokeStyle = "rgba(0,0,0,0)";
			ctx.lineWidth = 3;
		}
		ctx.beginPath();
		ctx.arc(this.x,this.y,this.r,0,2*Math.PI);
		ctx.fill();

		ctx.beginPath();
		ctx.moveTo(this.x,this.y);
		var a =this.x + this.r * Math.cos(this.angle * Math.PI / 180);
    	var b =this.y + this.r * Math.sin(this.angle * Math.PI / 180);
		ctx.lineTo(a,b);
		ctx.stroke();
	}

	if(this.dna.length <= 0)
	{
		for(var i = 0; i < TIME*60; i++)
		{
			this.dna.push(Rand(-1,2));
		}
	}
}