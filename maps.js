var wx = window.innerWidth;
var wy = window.innerHeight;

var map1, map2, map3;
var strc = [];


strc[0] = new Circle(wx/2,wy/2,wy*0.25);
map1 = new Map({x :100, y :wy/2}, {x: wx-100, y: wy/2}, strc);

strc =[];
strc[0] = new Circle(wx/2,wy/2,wy*0.25);
strc[1] = new Circle(wx*0.75,wy*0.2,wy*0.25);
strc[2] = new Circle(wx*0.75,wy*0.8,wy*0.25);
strc[3] = new Circle(wx*0.25,wy*0.2,wy*0.25);
strc[4] = new Circle(wx*0.25,wy*0.8,wy*0.25);
map2 = new Map({x :100, y :wy/2}, {x: wx-100, y: wy/2}, strc);

strc = [];
strc[0] = new Circle(wx*0.445,wy*0.25,250);
strc[1] = new Circle(wx*0.565,wy*0.75,250);
map3 = new Map({x :100, y :wy/2}, {x: wx-100, y: wy/2}, strc);