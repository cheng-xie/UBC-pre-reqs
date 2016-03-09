var TextNode = function(text, position){
	this.textObj = new createjs.Text(text, "20px Arial", "#ff7700");
	this.textObj.x = position[0];
	this.textObj.y = position[1];
	
	this.movePosition = function(delta){
		this.textObj.x += delta[0];
		this.textObj.y += delta[1];
	};
	
	this.getPosition = function(){
		return [this.textObj.x, this.textObj.y];
	};
	
	this.getTextObj = function(){
		return this.textObj;
	};
};

var NodeEdge = function(stage, value, start, end){
	this.value = value;
	this.start = start;
	this.end = end;
	this.lineObj = new createjs.Shape();
	
	if(value != 0){
		this.lineObj = new createjs.Shape();
		this.lineObj.graphics.setStrokeStyle(1);
		this.lineObj.graphics.beginStroke("blue");
		this.lineObj.graphics.moveTo(start.getPosition()[0], start.getPosition()[1]);
		this.lineObj.graphics.lineTo(end.getPosition()[0], end.getPosition()[1]);
		stage.addChild(this.lineObj);
	}
	
	this.getLineObj = function(){
		return this.lineObj;
	};
	
	this.update = function(stage){
		stage.removeChild(this.lineObj);
		this.lineObj = new createjs.Shape();
		this.lineObj.graphics.setStrokeStyle(1);
		this.lineObj.graphics.beginStroke("blue");
		this.lineObj.graphics.moveTo(start.getPosition()[0], start.getPosition()[1]);
		this.lineObj.graphics.lineTo(end.getPosition()[0], end.getPosition()[1]);
		stage.addChild(this.lineObj);
	};
};

var ForceDirectedGraph = function(matrix, stage, node_texts){
	var REPULSIVE_CONSTANT = 10000;
	var SPRING_CONSTANT = 0.02;
	
	//matrix representation of force directed graph, the rows represent the end point of the edges
	var graph_matrix = matrix;
	var nodes = [];
	var edges = [];
	
	this.setup = function (starting_positions){
		for(i = 0; i < node_texts.length; i++){
			var text = new TextNode(node_texts[i], starting_positions[i]);
			nodes.push(text);
			stage.addChild(nodes[nodes.length-1].getTextObj());
		}
		for(i = 0; i < node_texts.length; i++){
			for(j = 0; j < node_texts.length; j++){
				if(graph_matrix[i][j] != 0){
					edges.push(new NodeEdge(stage, graph_matrix[i][j], nodes[i], nodes[j]));
				}
			}
		}
	};
	
	this.tic = function (){
		//Perform logic to update the positions of the nodes each tic.
		for(i = 0; i < nodes.length; i++){
			repulse = getRepulsion(i);
			attract = getAttraction(i);
			nodes[i].movePosition([(repulse[0] + attract[0]), (repulse[1] + attract[1])]);
		}
		//update the edges accordingly
		for(i = 0; i < edges.length; i++){
			edges[i].update(stage);
		}
	};
	
	function getRepulsion(node_index){
		/*
		 * The summed repulsion of all the other nodes of the graph.
		 * Repulsion scales with inverse square of the distance between the nodes.
		 */
		delta = [0, 0];
		for(j = 0; j < nodes.length; j++){
			if(j != node_index){
				r = [(nodes[node_index].getPosition()[0]-nodes[j].getPosition()[0]),
					(nodes[node_index].getPosition()[1]-nodes[j].getPosition()[1])];
				h = Math.sqrt(r[0]*r[0] + r[1]*r[1]);
				c = REPULSIVE_CONSTANT/(h*h);
				delta[0] += c*(r[0]/h);
				delta[1] += c*(r[1]/h);
			}
		}
		console.log(delta[0]);
		return delta;
	}
	
	function getAttraction(node_index){
		/*
		 * The summed attraction of all the parent nodes of node_index.
		 * Based on Hooke's law, simple weighted distance.
		 */
		delta = [0, 0];
		for(j = 0; j < nodes.length; j++){
			//only pull this nodes towards its parents
			if(graph_matrix[node_index][j]!=0){
				r = [(nodes[j].getPosition()[0]-nodes[node_index].getPosition()[0]),
					(nodes[j].getPosition()[1]-nodes[node_index].getPosition()[1])];
				c = SPRING_CONSTANT;
				delta[0] += c*r[0];
				delta[1] += c*r[1];
			}
		}
		console.log(delta);
		return delta;
	}
	
	function borderRepulsion(node_index){
		//TODO implement this function
	}
};


