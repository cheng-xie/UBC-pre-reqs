var stage;
var canvas;

var graph;

function tick(event) {
	graph.tic();
	stage.update(event);
}

function init(){
	stage = new createjs.Stage("demoCanvas");
	canvas = document.getElementById("demoCanvas");
	
	var data = new DATA_TEST1();
	graph = new ForceDirectedGraph(data.matrix, stage, data.node_texts);
	graph.setup(data.starting_positions);
	
	lineObj = new createjs.Shape();
	lineObj.graphics.beginStroke("blue");
	lineObj.graphics.moveTo(10, 20);
	lineObj.graphics.lineTo(30, 40);
	stage.addChild(lineObj);
	
	stage.update();
	createjs.Ticker.addEventListener("tick", tick);
	createjs.Ticker.setFPS(10);
}