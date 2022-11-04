
// Traigo al "namespace" global las declaraciones de la lib glMatrix
m4_mult = glMatrix.mat4.multiply
mat4 = glMatrix.mat4

vec2 = glMatrix.vec2
vec2_add = glMatrix.vec2.add
vec2_normalize = glMatrix.vec2.normalize


vec3 = glMatrix.vec3
vec3_add = glMatrix.vec3.add
vec3_normalize = glMatrix.vec3.normalize

to_rad = glMatrix.glMatrix.toRadian
to_deg = function(rad) {return rad * 180 / Math.PI}

button_clicked = null;

function InitWebGL()
{
	// Inicializamos el canvas WebGL
	canvas = document.getElementById("canvas");
	// canvas.oncontextmenu = function() {return false;};
	gl = canvas.getContext("webgl", {antialias: false, depth: true});	
	if (!gl) 
	{
		alert("Imposible inicializar WebGL. Tu navegador quizás no lo soporte.");
		return;
	}
	
	// Inicializar color clear
	gl.clearColor(0.9, 0.9, 0.9, 1);
	gl.enable(gl.DEPTH_TEST); // habilitar test de profundidad 

	camera = new PerspectiveCamera();
	//camera.look_at(vec3.fromValues(0, -1, 3), vec3.fromValues(0, 0, 0))
	camera.look_at(vec3.fromValues(20, 20, 0), vec3.fromValues(0, 0, 0));


	// [COMPLETAR] Armar el grafo de escena con al menos 1 sol, 2 planetas y 1 luna
	sol = new Node();
	sol.name = 'sol';
	sol.transform.set_pos(vec3.fromValues(0,0,0));

	planeta_1 = new Node();
	planeta_1.name = 'planeta_1';
	planeta_1.parent = sol;
	planeta_1.transform.set_pos(vec3.fromValues(5,0,0));

	planeta_2 = new Node();
	planeta_2.name = 'planeta_2';
	planeta_2.parent = sol;
	planeta_2.transform.set_pos(vec3.fromValues(10,0,0));

	luna = new Node();
	luna.name = 'luna';
	luna.parent = planeta_1;
	luna.transform.set_pos(vec3.fromValues(1.5,0,0));
	
	//console.log(luna.parent)
	DrawScene();

	// Setear el tamaño del viewport
	UpdateCanvasSize();
}

function update_graph(node) {
	// [COMPLETAR] Implementar el recorrido recursivo actualizando el estado del grafo
	
	//calcular las wi (producto de las transformaciones anteriores)
	function MatrixMult( A, B )
	{	
		var C = [];
		for ( var i=0; i<4; ++i ) 
		{
			for ( var j=0; j<4; ++j ) 
					{
					var v = 0;
					for ( var k=0; k<4; ++k ) 
					{
						v += A[j+4*k] * B[k+4*i];
					}
					C.push(v);
			}
		}
		return C;
	}

	if (node.name == 'sol'){
		sol.world_mat = sol.transform.get_model_mat();	
	}

	else if (node.name == 'planeta_1'){
		planeta_1.world_mat = MatrixMult(sol.transform.get_model_mat(), planeta_1.transform.get_model_mat());
	}

	else if (node.name == 'luna'){
		luna.world_mat = MatrixMult(MatrixMult(sol.transform.get_model_mat(), planeta_1.transform.get_model_mat()), luna.transform.get_model_mat());
	}

	else if (node.name == 'planeta_2'){
		planeta_2.world_mat = MatrixMult(sol.transform.get_model_mat(), planeta_2.transform.get_model_mat());
	}

}

function draw_graph(node) {

	// [COMPLETAR] Implementar el recorrido para dibujar todas las entidades
	pyramid = new Pyramid();
	pyramid.model = node.world_mat //transform.get_model_mat();
	//console.log(node.transform.get_model_mat());
	//console.log(node.world_mat)

	//Dibujar las piramides
	pyramid.draw(camera); //Que objeto tipo camara pasarle???!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1
	
}

function WindowResize()
{
	UpdateCanvasSize();
	DrawScene();
}


function DrawScene()
{
	
	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

	// [COMPLETAR] Invocar a la actulización y dibujado del grafo
	update_graph(sol)
	draw_graph(sol)

	update_graph(planeta_1)
	draw_graph(planeta_1)

	update_graph(luna)
	draw_graph(luna)

	update_graph(planeta_2)
	draw_graph(planeta_2)
	
}

function UpdateCanvasSize()
{

	const pixelRatio = window.devicePixelRatio || 1;
	canvas.width     = pixelRatio * canvas.clientWidth;
	canvas.height    = pixelRatio * canvas.clientHeight;

	const width  = (canvas.width  / pixelRatio);
	const height = (canvas.height / pixelRatio);

	canvas.style.width  = width  + 'px';
	canvas.style.height = height + 'px';

	// 2. Lo seteamos en el contexto WebGL
	gl.viewport( 0, 0, canvas.width, canvas.height );

}

var timer;
var t = 0;
window.onload = function() {
	
	InitWebGL();

	// Dibujo la escena
	DrawScene();

	timer = setInterval( function() 
	{
		t += 0.02;
		
		sol.transform.set_rotation([0,5*t,0])
		//sol.transform.set_pos([t,t,t]);

		//luna.transform.set_rotation([0,5*t,0])
		//luna.transform.set_pos([t,t,t]);

		planeta_1.transform.set_rotation([0,5*t,0])
		//sol.transform.set_pos([t,t,t]);


		// [COMPLETAR] actulizar la rotación de los astros...
		
		DrawScene();
	}, 30);

	canvas.onwheel = function() { 
		camera.translateW(-0.0003 * event.deltaY)
		DrawScene()
	}


	// Evento de click 
	canvas.onmousedown = function(e) 
	{
		button_clicked = event.which
		// 1 izquierdo
		// 2 scroll
		// 3 derecho
		
		var down_x = event.clientX;
		var down_y = event.clientY;

		canvas.onmousemove = function() 
			{
				const cam_delta_x =  (event.clientX - down_x)   
				const cam_delta_y =  (event.clientY - down_y) 

				if (button_clicked == 2) {
					camera.set_delta_pitch(cam_delta_y* 0.005);
        			camera.set_delta_yaw(cam_delta_x* 0.005);
				} else {
					camera.translateU(-cam_delta_x * 0.005);
        			camera.translateV(cam_delta_y * 0.005);
				}

				down_x = event.clientX;
				down_y = event.clientY;

				DrawScene();
			}
	}

	// Evento soltar el mouse
	canvas.onmouseup = canvas.onmouseleave = function()
	{
		canvas.onmousemove = null;
	}
	


};


