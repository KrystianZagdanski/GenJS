const canvasW = 1200;
const canvasH = 700;
const POPULATION_SIZE = 100;

var canvas = document.getElementById("canvas");
canvas.width = canvasW;
canvas.height = canvasH;
var ctx = canvas.getContext("2d");

var score = 0; // number of units that completed task (now)
var lastScore = 0; // -||- generation before
var bestScore = 0;
var mutation = 0; // % of mutation it curent population
var firstGoal = -1; // first generation when task was completed
var above50 = -1; // 50% ofpopulation complete task
var above80 = -1; // 80% of population coplete task