var TextNode = function(stage, text, position){
    this.hue = Math.random()*300 + 90;
    this.defColor = createjs.Graphics.getHSL(this.hue, 20, 70); 
    
    this.circleObj = new createjs.Shape();
    this.circleObj.graphics.beginFill(this.defColor).drawCircle(0, 0, 10);
    this.circleObj.x = 0;
    this.circleObj.y = 0;
    this.circleObj.hue = this.hue;
    this.circleObj.selected = false;
    this.circleObj.getColor = function(){
        var color  = createjs.Graphics.getHSL(this.hue, 15, 70);
        if(this.selected){
            var color  = createjs.Graphics.getHSL(this.hue, 90, 40);
        }
        else{
            var color  = createjs.Graphics.getHSL(this.hue, 15, 70); 
        }
        return color;
    };
    this.circleObj.getRadius = function(){
        var radius  = 10;
        if(this.selected){
            radius = 15;
        }
        else{
            radius = 10; 
        }
        return radius;
    };
    this.circleObj.update = function(){
        this.graphics.clear().beginFill(this.getColor()).drawCircle(0, 0, this.getRadius());
    }

	this.textObj = new createjs.Text(text, "20px Arial", this.defColor);
	this.textObj.x = 0;
	this.textObj.y = 0;
    this.textObj.hue = this.hue;
    this.circleObj.selected = false;
    this.textObj.getColor = function(){
        var color  = createjs.Graphics.getHSL(this.hue, 20, 65);
        if(this.selected){
            var color  = createjs.Graphics.getHSL(this.hue, 100, 20);
        }
        else{
            var color  = createjs.Graphics.getHSL(this.hue, 20, 65); 
        }
        return color;
    };
    this.textObj.update = function(){
        this.color = this.getColor();
    }

	this.container = new createjs.Container();
    this.container.x = position[0];
    this.container.y = position[1];
    this.container.addChild(this.circleObj);
    this.container.addChild(this.textObj);
    
    this.container.physics_enabled = true;
    this.container.selected = false;

    stage.addChild(this.container);

    this.container.on("mousedown", function(evt){
        evt.currentTarget.physics_enabled = false;
        console.log("Disabled");
    });

    this.container.on("pressmove", function(evt){
        evt.currentTarget.x = evt.stageX;
        evt.currentTarget.y = evt.stageY;
        stage.update();
        console.log("Moved");
    });

    this.container.on("pressup", function(evt){
        evt.currentTarget.physics_enabled = true;
        console.log("Up");
    });

    this.container.on("click", function(evt){
        evt.currentTarget.selected = !evt.currentTarget.selected;
    });

    this.update = function(){
        this.textObj.selected = this.isSelected();
        this.circleObj.selected = this.isSelected();
        this.textObj.update();
        this.circleObj.update();
    };

	this.movePosition = function(delta){
        if(this.container.physics_enabled){
	        this.container.x += delta[0];
            this.container.y += delta[1];
        }
    };

	this.getPosition = function(){
		return [this.container.x, this.container.y];
	};
	
	this.getTextObj = function(){
		return this.textObj;
	};
    
    this.getCircleObj = function(){
        return this.circleObj;
    };

    this.getContainer = function(){
        return this.container;
    };

    this.isSelected = function(){
        return this.container.selected;
    }; 

    this.getText = function(){
        return this.textObj.text;
    }
};

var NodeEdge = function(stage, value, start, end){
    this.value = value;
	this.start = start;
	this.end = end;
	this.lineObj = new createjs.Shape();
    this.arrow = new createjs.Shape();

    this.getColor = function(){
        var color = createjs.Graphics.getHSL(230, 20, 70);

        if(this.start.isSelected() && this.end.isSelected()){
            color = createjs.Graphics.getHSL(120, 70, 50);
        }
        else if(this.start.isSelected()){
            color = createjs.Graphics.getHSL(5, 70, 50);
        }
        else if(this.end.isSelected()){
            color = createjs.Graphics.getHSL(230, 70, 50);
        }
        else{
            color = createjs.Graphics.getHSL(230, 20, 70);
        }
        return color;
    };
    
    this.drawArrow = function(radian, x, y) {
        var ARROW_SIZE = 10;
        var arrow = new createjs.Shape();
        arrow.graphics.setStrokeStyle(1)
        arrow.graphics.beginStroke(this.getColor());
        arrow.graphics.moveTo(-ARROW_SIZE, +ARROW_SIZE/2);
        arrow.graphics.lineTo(0, 0);
        arrow.graphics.lineTo(-ARROW_SIZE, -ARROW_SIZE/2);
        var degree = radian / Math.PI * 180 + 180;
        arrow.x = x;
        arrow.y = y;
        arrow.rotation = degree;
        return arrow;
    };
	
    if(value != 0){
		this.lineObj = new createjs.Shape();
		this.lineObj.graphics.setStrokeStyle(1);
		this.lineObj.graphics.beginStroke(this.getColor());

        startp = this.start.getPosition();
        endp = this.end.getPosition();
        midp = [(endp[0] + startp[0])/2, (endp[1] + startp[1])/2];

        this.lineObj.graphics.moveTo(startp[0], startp[1]);
		this.lineObj.graphics.lineTo(endp[0], endp[1]);
        this.arrow = this.drawArrow( Math.atan2( (endp[1]-startp[1]), (endp[0]-startp[0]) ), midp[0], midp[1]);

        stage.addChild(this.lineObj);
        stage.addChild(this.arrow);
	}

	this.getLineObj = function(){
		return this.lineObj;
	};

    this.update = function(stage){
		stage.removeChild(this.lineObj);
        stage.removeChild(this.arrow);
		this.lineObj = new createjs.Shape();
		this.lineObj.graphics.setStrokeStyle(1);
		this.lineObj.graphics.beginStroke(this.getColor());
        startp = this.start.getPosition();
        endp = this.end.getPosition();
        midp = [(endp[0] + startp[0])/2, (endp[1] + startp[1])/2];
		this.lineObj.graphics.moveTo(startp[0], startp[1]);
		this.lineObj.graphics.lineTo(endp[0], endp[1]);
        this.arrow = this.drawArrow( Math.atan2( (endp[1]-startp[1]), (endp[0]-startp[0]) ), midp[0], midp[1]);
		stage.addChild(this.arrow);
        stage.addChild(this.lineObj);
	};
};

var ForceDirectedGraph = function(canvas, stage, matrix, node_texts){
	var REPULSIVE_CONSTANT = 50000;
	var SPRING_CONSTANT = 0.02;
    var BORDER_REPULSION_CONSTANT = 0.02;

	//matrix representation of force directed graph, the rows represent the end point of the edges
	var graph_matrix = matrix;

	var nodes = [];
	var edges = [];

    var graphContainer = new createjs.Container();

	this.setup = function (starting_positions){
		for(i = 0; i < node_texts.length; i++){
			var text = new TextNode(stage, node_texts[i], starting_positions[i]);
			nodes.push(text);
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
            p_attract = pointAttraction(i);
			nodes[i].movePosition([(repulse[0] + attract[0] + p_attract[0]), (repulse[1] + attract[1] + p_attract[1])]);
		    nodes[i].update();
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
			if(graph_matrix[node_index][j]!=0 || graph_matrix[j][node_index]!=0){
				r = [(nodes[j].getPosition()[0]-nodes[node_index].getPosition()[0]),
					(nodes[j].getPosition()[1]-nodes[node_index].getPosition()[1])];
				c = SPRING_CONSTANT;
				delta[0] += c*r[0];
				delta[1] += c*r[1];
			}
		}
		return delta;
	}

	function pointAttraction(node_index){
		//TODO implement this function
        /*
         * Returns the delta position change generated by the
         * repulsion from the borders of the canvas on this node.
         */
        border_height = canvas.height;
        border_width = canvas.width;
        delta = [0, 0];
        x_position = nodes[node_index].getPosition()[0];
        y_position = nodes[node_index].getPosition()[1];
        r = [0, 0];
        r[0] = x_position - border_width/2;
        r[1] = y_position - border_height/2;
        c = BORDER_REPULSION_CONSTANT;
		delta[0] -= c*r[0];
		delta[1] -= c*r[1]*border_width/border_height;

        return delta;
    }
};

