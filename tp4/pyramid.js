// Vertex shader 
var cubeVS = `
	attribute vec3 pos;
	attribute vec3 color;

	uniform mat4 mvp;

	// [COMPLETAR] Pasar color a FS
	varying vec3 color2fs;
	
	void main()
	{
		// Pass the color down to the fragment shader
		color2fs = color;

		gl_Position = mvp * vec4(pos,1);
	}
`;
// Fragment shader 
var cubeFS = `
	precision mediump float;
	
	varying vec3 color2fs;

	void main()
	{
		gl_FragColor = vec4(color2fs,1);
	}
`;


// Clase que dibuja la caja alrededor de la escena
class Pyramid {
	constructor()
	{
		// 1.  [COMPLETAR] Compilamos el programa de shaders
		this.prog   = InitShaderProgram( cubeVS, cubeFS );
		
		// 2.  [COMPLETAR] Obtenemos los IDs de las variables uniformes en los shaders
		this.mvp = gl.getUniformLocation (this.prog, 'mvp');
		
		// 3.  [COMPLETAR] Obtenemos los IDs de los atributos de los vértices en los shaders
		this.pos = gl.getAttribLocation(this.prog, 'pos');
		this.color = gl.getAttribLocation(this.prog, 'color');
		
		// 4.  [COMPLETAR] Creamos el buffer para los vertices		
		this.vertexbuffer = gl.createBuffer();

        // 4 caras pirámide // [COMPLETAR] Especificar posiciones de los vértices
		var pos = [
			// Cara 1
			0.0,  1.0,  0.0,
			1.0, 0.0,  0.0,
			0.0, 0.0,  1.0,
			// Cara 2
			0.0,  1.0,  0.0,
			1.0, 0.0,  0.0,
			0.0, 0.0, -1.0,
			// Cara 3
			0.0,  1.0,  0.0,
			0.0, 0.0, 1.0,
			0.0, 0.0, -1.0,
			// Cara 4
			0.0,  0.0,  1.0,
			0.0, 0.0, -1.0,
			1.0, 0.0, 0.0,		
		  ];	


		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexbuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);

		this.colorbuffer = gl.createBuffer();

		// [COMPLETAR]  Especificar colores
		var color = [
			[0.3,  1.0,  1.0],    // Cara 1: cyan
			[1.0,  0.0,  0.0],    // Cara 2: Rojo
			[0.3,  0.3,  1.0],    // Cara 3: Azul
			[1.0,  1.0,  0.3],    // Cara 4: Amarillo
		  ];


		gl.bindBuffer(gl.ARRAY_BUFFER, this.colorbuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color), gl.STATIC_DRAW);
        
	}

    // Esta función se llama para dibujar la caja
	draw( trans )
	{
        // 1. Seleccionamos el shader
		gl.useProgram( this.prog );

        // 2. Setear matriz de transformacion
		gl.uniformMatrix4fv( this.mvp, false, trans );

        //  [COMPLETAR] 3.Binding del buffer de posiciones
		gl.bindBuffer( gl.ARRAY_BUFFER, this.vertexbuffer );

        //  [COMPLETAR] 4. Habilitamos el atributo 
		gl.vertexAttribPointer( this.pos, 3, gl.FLOAT, false, 0, 0 ); //gl.vertexAttribPointer(attributeLocations.curveness, numComponents, type, normalize, stride, offset);
		gl.enableVertexAttribArray( this.pos );

        //  [COMPLETAR] 5. Lo mismo pero para color
		gl.bindBuffer( gl.ARRAY_BUFFER, this.colorbuffer );
		gl.vertexAttribPointer( this.color, 3, gl.FLOAT, false, 0, 0 ); //gl.vertexAttribPointer(attributeLocations.curveness, numComponents, type, normalize, stride, offset);
		gl.enableVertexAttribArray( this.color );
		
		// 5.  [COMPLETAR] Dibujamos
		gl.drawElements(gl.TRIANGLE, 12, gl.UNSIGNED_SHORT, 0);
	}
}


