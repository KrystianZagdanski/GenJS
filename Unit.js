class Unit
{
    /*
        dis -> distance 
        d -> currentDistance
    */
    constructor(x, y, r, dna)
    {
        this.x = x;
        this.y = y;
        this.r = r;
        this.rotation = 0;
        this.fitness = 0; // how good unit is
		this.speed = 5;
		this.turnSpeed = 10;
        this.ttc = 0; // time to complete
        this.alive = true;
        this.win = false; // complete task (now)
        this.lastWinner = false; // complete task in last gen and was put in new gen
        this.best = false; // -||- was close 
        this.distance = 999999; // distance from target
		this.movePos = 0; // index of move in DNA
		this.colider = new Colider(this.x, this.y, this.r);
        if(dna)
        {
            this.dna = dna;
        }
        else
        {
            this.dna = [];
            for(let i = 0; i < TIME*60; i++)
            {``
                this.dna.push(Rand(-1,2));
            }
        }
            
    }
    move()
    {
        let currentDistance = distance(this,target);
		if(currentDistance < this.distance)
			this.distance = currentDistance;
		if(this.alive && this.movePos < this.dna.length && !this.win)
		{
			// DNA[index] == -1(left) 0(forward) 1(right)
			if (this.dna[this.movePos] == -1)
				this.rotation -= this.turnSpeed;
			if (this.dna[this.movePos] == 1)
				this.rotation += this.turnSpeed;

			if(this.rotation > 360)
				this.rotation -= 360;
			if(this.rotation < 0)
				this.rotation += 360;
			this.x += this.speed * Math.cos(this.rotation * Math.PI / 180);
    		this.y += this.speed * Math.sin(this.rotation * Math.PI / 180);
			
			this.ttc++;
    		this.movePos++;
		}
    }
    draw()
    {
        if(this.alive && !this.win)
		{
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
			ctx.fillStyle = "rgba(119,85,85,0.5)";
			ctx.strokeStyle = "rgba(0,0,0,0)";
			ctx.lineWidth = 3;
		}
		ctx.beginPath();
		ctx.arc(this.x,this.y,this.r,0,2*Math.PI);
		ctx.fill();

		ctx.beginPath();
		ctx.moveTo(this.x,this.y);
		let a = this.x + this.r * Math.cos(this.rotation * Math.PI / 180);
    	let b = this.y + this.r * Math.sin(this.rotation * Math.PI / 180);
		ctx.lineTo(a,b);
		ctx.stroke();
    }
}