var map1, map2, map3;
var strc = [];

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
		ctx.beginPath();
		ctx.fillStyle = "#000";
		ctx.fillRect(0,0,wx,wy);

		ctx.beginPath();
		ctx.strokeStyle = "rgba(255,255,255,0.1)";
		ctx.arc(start.x,start.y,30,0,2*Math.PI);
		ctx.stroke();

		for(let i =0; i < this.struct.length; i++)
		{
			this.struct[i].draw();
		}

		this.meta.draw();
	}
}

strc[0] = new Circle(wx/2,wy/2,wy*0.25);
map1 = new Map({x :100, y :wy/2}, {x: wx-100, y: wy/2}, strc);

strc =[];
strc[0] = new Circle(wx/2,wy/2,wy*0.25);
strc[1] = new Circle(wx*0.75,wy*0.2,wy*0.2);
strc[2] = new Circle(wx*0.75,wy*0.8,wy*0.2);
strc[3] = new Circle(wx*0.25,wy*0.2,wy*0.2);
strc[4] = new Circle(wx*0.25,wy*0.8,wy*0.2);
map2 = new Map({x :100, y :wy/2}, {x: wx-100, y: wy/2}, strc);

strc = [];
strc[0] = new Circle(wx*0.445,wy*0.25,175);
strc[1] = new Circle(wx*0.565,wy*0.75,175);
map3 = new Map({x :100, y :wy/2}, {x: wx-100, y: wy/2}, strc);