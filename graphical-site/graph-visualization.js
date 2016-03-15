var stage;
var canvas;

var graph;

function tick(event) {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
	graph.tic();
	stage.update(event);
}

function init(){
	stage = new createjs.Stage("demoCanvas");
	canvas = document.getElementById("demoCanvas");
	
	var data = new DATA_TEST1();
	graph = new ForceDirectedGraph(data.matrix, stage, data.node_texts, canvas);
	graph.setup(data.starting_positions);
	
	stage.update();
	createjs.Ticker.addEventListener("tick", tick);
	createjs.Ticker.setFPS(10);
}
