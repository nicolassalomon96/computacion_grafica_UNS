// Completar la implementación de esta clase y el correspondiente vertex shader. 
// En principio no es necesario modificar el fragment shader, salvo que quieren modificar el color de la curva
class CurveDrawer 
{
	// Inicialización de los shaders y buffers
	constructor()
	{
		// Creamos el programa webgl con los shaders para los segmentos de recta
		this.prog   = InitShaderProgram( curvesVS, curvesFS );

		// Muestreo del parámetro t: Genero una secuencia de 100 valores reales entre 0 y 1
		this.steps = 100;
		var tv = [];
		for ( var i=0; i<this.steps; ++i ) {
			tv.push( i / (this.steps-1) );
		}
		
		// [Completar] Creacion del vertex buffer y seteo de contenido
		// createbuffer, bindbuffer, bufferdata
		this.buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer );
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tv), gl.STATIC_DRAW);

		// [Completar] Incialización y obtención de las ubicaciones de los atributos y variables uniformes de los shaders	
		this.mvp = gl.getUniformLocation (this.prog, 'mvp');
		this.p0 = gl.getUniformLocation (this.prog, 'p0');
		this.p1 = gl.getUniformLocation (this.prog, 'p1');
		this.p2 = gl.getUniformLocation (this.prog, 'p2');
		this.p3 = gl.getUniformLocation (this.prog, 'p3');
		this.t = gl.getAttribLocation (this.prog, 'tv');
		
		//getUniformLocation, getAttribLocation
	}

	// Actualización del viewport (se llama al inicializar la web o al cambiar el tamaño de la pantalla)
	setViewport( width, height )
	{
		const pixelRatio = window.devicePixelRatio || 1;
		canvas.width     = pixelRatio * canvas.clientWidth;
		canvas.height    = pixelRatio * canvas.clientHeight;
		gl.viewport(0, 0, canvas.width, canvas.height);

		// [Completar] Matriz de transformación los puntos están en coordenadas de pantalla. .
		var trans = [ 2/width,            0,		0,		0,
					  		0,	  -2/height,		0,		0,
					  		0,	          0,		1,		0,
					 	   -1,	          1,		0,		1];

		// [Completar] Binding del programa y seteo de la variable uniforme para la matriz. 
		gl.useProgram( this.prog );
		gl.uniformMatrix4fv( this.mvp, false, trans );

	}

	updatePoints( pt )
	{
	
		/*var p = [];
		for ( var i=0; i<4; ++i ) 
		{
			var x = pt[i].getAttribute("cx");
			var y = pt[i].getAttribute("cy");
		
			p.push(x);
			p.push(y);
		}*/
		// [Completar] Pueden acceder a las coordenadas de los puntos de control consultando el arreglo pt[]:
		// [Completar] No se olviden de hacer el binding del programa antes de setear las variables 
		// [Completar] Actualización de las variables uniformes para los puntos de control

		// var x = pt[i].getAttribute("cx");
		// var y = pt[i].getAttribute("cy");

		var p0 = [pt[0].getAttribute("cx"), pt[0].getAttribute("cy")];
		var p1 = [pt[1].getAttribute("cx"), pt[1].getAttribute("cy")];
		var p2 = [pt[2].getAttribute("cx"), pt[2].getAttribute("cy")];
		var p3 = [pt[3].getAttribute("cx"), pt[3].getAttribute("cy")];

		gl.useProgram(this.prog);
		gl.uniform2fv(this.p0, p0);
		gl.uniform2fv(this.p1, p1);
		gl.uniform2fv(this.p2, p2);
		gl.uniform2fv(this.p3, p3);

		// Enviamos al buffer
		//gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
		//gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(p), gl.STATIC_DRAW);
	}

	draw()
	{

		// Seleccionamos el shader
		gl.useProgram( this.prog );
		// Binding del buffer de posiciones
		gl.bindBuffer( gl.ARRAY_BUFFER, this.buffer );
		
		// Habilitamos los atributos
		gl.vertexAttribPointer( this.t, 1, gl.FLOAT, false, 0, 0 ); //gl.vertexAttribPointer(attributeLocations.curveness, numComponents, type, normalize, stride, offset);
		gl.enableVertexAttribArray( this.t );

		// Dibujamos lineas utilizando primitivas gl.LINE_STRIP 
		// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/drawArrays
		gl.drawArrays( gl.LINE_STRIP, 0, 100 );
		
		
		// [Completar] No se olviden de hacer el binding del programa y de habilitar los atributos de los vértices
		// [Completar] Setear los valores uniformes del Vertex shader.
	}
}

// Vertex Shader
//[Completar] El vertex shader se ejecuta una vez por cada punto en mi curva (parámetro step). No confundir punto con punto de control.
// Deberán completar con la definición de una Bezier Cúbica para un punto t. Algunas consideraciones generales respecto a GLSL: si
// declarás las variables pero no las usás, no se les asigna espacio. Siempre poner ; al finalizar las sentencias. Las constantes
// en punto flotante necesitan ser expresadas como X.Y, incluso si son enteros: ejemplo, para 4 escribimos 4.0
var curvesVS = `
	attribute float tv;

	uniform mat4 mvp;
	
	uniform vec2 p0;
	uniform vec2 p1;
	uniform vec2 p2;
	uniform vec2 p3;

	void main()
	{ 
		//[completar]
		gl_Position = mvp * vec4(p0 * pow(1.0-tv,3.0) + p1 * (3.0*tv) * pow(1.0-tv,2.0) + p2 * 3.0 * pow(tv,2.0) * (1.0-tv) + p3 * pow(tv,3.0), 0, 1);		

	}
`;

// Fragment Shader
var curvesFS = `
	precision mediump float;

	void main()
	{
		//[ Salvo que te moleste que se vea azul, no deberías tocarlo :P ]
		gl_FragColor = vec4(1,0,1,1);
	}
`;
