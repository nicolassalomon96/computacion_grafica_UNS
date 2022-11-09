// Vertex shader 
var cubeVS = `
	attribute vec3 pos;
	attribute vec3 color;

	uniform mat4 mvp;

	varying vec3 color2fs;

	void main()
	{
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
		//gl_FragColor = vec4(1,0,0,1);
	}
`;


// Clase que dibuja la caja alrededor de la escena
class SolidRev {

	constructor(theta_steps, points_seq)
	{

		this.model = glMatrix.mat4.create()

		// 1. Compilamos el programa de shaders
		this.prog = InitShaderProgram( cubeVS, cubeFS );

		// 2. Obtenemos los IDs de las variables uniformes en los shaders
		this.mvp_loc = gl.getUniformLocation( this.prog, 'mvp' );
		
		// 3. Obtenemos los IDs de los atributos de los vértices en los shaders
		this.pos_loc = gl.getAttribLocation( this.prog, 'pos' );
		this.color_loc = gl.getAttribLocation( this.prog, 'color' );

		this.vertex_pos = [];
		this.vertex_color = [];
		

		// [COMPLETAR] Calcular los vértices para un sólido por revolucion
		for (var step=0; step<theta_steps; step++){
			var lista_actual = []
			var mat_actual = mat4.fromYRotation(mat4.create(), (step/theta_steps) * (2*Math.PI)) //fromYRotation(out, rad) Creates a matrix from the given angle around the Y axis

			var lista_sig = []
			var mat_sig = mat4.fromYRotation(mat4.create(), ((step+1) / theta_steps) * (2*Math.PI))

			for (var p=0; p<points_seq.length; p++) {
				lista_actual.push(vec4.transformMat4(vec4.create(), points_seq[p], mat_actual)) //transformMat4(out, a, m) Transforms the vec4 with a mat4.
				lista_sig.push(vec4.transformMat4(vec4.create(), points_seq[p], mat_sig))
			}

			for (var p=0; p<points_seq.length-1; p++){
				this.vertex_pos.push(lista_actual[p][0], lista_actual[p][1], lista_actual[p][2]);
				this.vertex_pos.push(lista_sig[p][0], lista_sig[p][1], lista_sig[p][2]);
				this.vertex_pos.push(lista_sig[p+1][0], lista_sig[p+1][1], lista_sig[p+1][2]);

				this.vertex_color.push(1,0,0);
				this.vertex_color.push(0,1,0);
				this.vertex_color.push(0,0,1);

				this.vertex_pos.push(lista_actual[p][0], lista_actual[p][1], lista_actual[p][2]);
				this.vertex_pos.push(lista_actual[p+1][0], lista_actual[p+1][1], lista_actual[p+1][2]);
				this.vertex_pos.push(lista_sig[p+1][0], lista_sig[p+1][1], lista_sig[p+1][2]);

				this.vertex_color.push(1,0,0);
				this.vertex_color.push(0,1,0);
				this.vertex_color.push(0,0,1);
			}
		}

		this.vertex_count  = this.vertex_pos.length / 3
		
		this.pos_buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.pos_buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertex_pos), gl.STATIC_DRAW);

	
		this.color_buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.color_buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertex_color), gl.STATIC_DRAW);        
	}

    // Esta función se llama para dibujar la caja
	draw( camera )
	{
        // 1. Seleccionamos el shader
		gl.useProgram( this.prog );

		// 1.5 Actualizar la matriz de mvp
		let mvp = mat4.create()
		m4_mult(mvp, m4_mult(mvp, camera.get_proj_mat(), camera.get_view_mat()), this.model);
		
        // 2. Setear matriz de transformacion
		gl.uniformMatrix4fv( this.mvp_loc, false, mvp );

        // 3.Binding del buffer de posiciones
		gl.bindBuffer( gl.ARRAY_BUFFER, this.pos_buffer );

		gl.vertexAttribPointer( this.pos_loc, 3, gl.FLOAT, false, 0, 0 );
		gl.enableVertexAttribArray( this.pos_loc );

		// 4 Binding del buffer de color
		gl.bindBuffer( gl.ARRAY_BUFFER, this.color_buffer );
		
		gl.vertexAttribPointer( this.color_loc, 3, gl.FLOAT, false, 0, 0 );
		gl.enableVertexAttribArray( this.color_loc );		

        // 5. Dibujamos
		gl.drawArrays( gl.TRIANGLES, 0, this.vertex_count);
		
	}
}


