(function(document, THREE) {

  var app = document.querySelector('#app');
  app.width = window.innerWidth;
  app.height =  window.innerHeight;

  var rtParams = {minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, format: THREE.RGBFormat};
  var rtLeft = new THREE.WebGLRenderTarget(app.width, app.height, rtParams);
  var rtRight = new THREE.WebGLRenderTarget(app.width, app.height, rtParams);

  var sceneScreen = new THREE.Scene();
  var quadLeft = new THREE.Mesh(new THREE.PlaneBufferGeometry(1, 1),
   new THREE.MeshBasicMaterial({
     map: rtLeft,
     alphaMap: THREE.ImageUtils.loadTexture("images/maskLeft.png"),
     transparent: true
   }));
  quadLeft.position.x = -0.5;
  sceneScreen.add( quadLeft );
  var quadRight = new THREE.Mesh(new THREE.PlaneBufferGeometry(1, 1),
   new THREE.MeshBasicMaterial({
     map: rtRight,
     alphaMap: THREE.ImageUtils.loadTexture("images/maskRight.png"),
     transparent: true
    }));
  quadRight.position.x = 0.5;
  sceneScreen.add( quadRight );

  var cameraScreen = new THREE.OrthographicCamera( -1, 1, 0.5, -0.5, -100, 100 );

  app.scene = new THREE.Scene();

  app.camera = new THREE.PerspectiveCamera(90, app.width/app.height, 0.1, 1000);
  app.camera.position.set(0, 4, 40);
  app.camera.lookAt(new THREE.Vector3());

  // SCENE
  var terrainTexture = THREE.ImageUtils.loadTexture( "images/grid.png" );
  terrainTexture.wrapS = THREE.RepeatWrapping;
  terrainTexture.wrapT = THREE.RepeatWrapping;
  terrainTexture.anisotropy = 6;

  var displaceTexture = THREE.ImageUtils.loadTexture( "images/displace.jpg" );

  var terrainShader = new THREE.ShaderMaterial({

    uniforms: {

      "map" : { type: "t", value: terrainTexture },
      "displace" : { type: "t", value: displaceTexture },
      "audio" : { type: "t", value: null }

		},

		vertexShader: [

			"uniform sampler2D displace;",
			"uniform sampler2D audio;",

			"varying vec2 vUv;",
			"varying float dist;",

			"void main() {",

      " vUv = uv;",

      " dist = distance(uv * vec2(1.0, 0.5), vec2(0.35, 0.05));",

      " float audioColor = texture2DLod( audio, vec2(dist, 0.0), 2.0 ).r;",

      " float offset = texture2D( displace, uv ).r * 45.0 + audioColor * 4.0;",

      " vec4 mvPosition = modelViewMatrix * vec4( position + vec3(0.0, 0.0, offset), 1.0 );",

      " gl_Position = projectionMatrix * mvPosition;",

			"}"

		].join("\n"),

		fragmentShader: [

			"uniform sampler2D map;",
			"uniform sampler2D audio;",

			"varying vec2 vUv;",
			"varying float dist;",

			"void main() {",

      " vec4 texelColor = 10.0 * texture2D( map, vUv * vec2(150.0, 75.0) );",
      " float audioColor = texture2D( audio, vec2(dist, 0.0) ).r;",

			"	gl_FragColor = vec4( texelColor.rgb * (1.0 + 10.0 * audioColor), 1.0 );",

			"}"

		].join("\n")

  });

  var terrain = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(150, 75, 150, 75),
    terrainShader
  );
  terrain.rotation.x = - Math.PI / 2;
  terrain.position.y = 0;
  app.scene.add(terrain);

  var lineShader = new THREE.ShaderMaterial({

    uniforms: THREE.UniformsUtils.merge([{

      "audio" : { type: "t", value: null }

    }, field.uniforms]),

    vertexShader: [

      field.shaderChunk.params,

      "uniform sampler2D audio;",

      field.shaderChunk.functions,

      "varying vec2 vUv;",

      "void main() {",

      "vUv = uv;",

      " float offset = texture2D( audio, vec2(uv.x, 0.0) ).r * 8.;",

      " vec4 mvPosition = modelMatrix * vec4( position + vec3(0.0, offset, 0.0), 1.0 );",

      " float intensity = max(0.0, abs(mvPosition.x / 25.) - fintensity);",

      " vec3 field = getField(ftex, ftrans, finvTrans, mvPosition.xyz, fgrid, intensity);",

      " field.y *= 3.0;",

      " gl_Position = projectionMatrix * viewMatrix * (mvPosition + vec4(field, 0.0));",

      "}"

    ].join("\n"),

    fragmentShader: [

      "uniform sampler2D audio;",

      "varying vec2 vUv;",

      "void main() {",

      " float alpha = min(1.0, abs(texture2D( audio, vec2(vUv.x, 0.0) ).r * 1000.));",

      "	gl_FragColor = vec4( 1.0, 1.0, 1.0, alpha );",

      "}"

    ].join("\n"),

    transparent: true,
    depthTest: false

  });

  var segments = 2048;
	var geometry = new THREE.BufferGeometry();
	var positions = new Float32Array( segments * 3 );
	var uv = new Float32Array( segments * 2 );
	for ( var i = 0; i < segments; i ++ ) {
		var x = -30 + (i / segments) * 60;
		var y = 3.5;
		var z = 30;
		// positions
		positions[ i * 3 ] = x;
		positions[ i * 3 + 1 ] = y;
		positions[ i * 3 + 2 ] = z;
		// colors
		uv[ i * 2 ] = i / segments;
		uv[ i * 2 + 1 ] = i / segments;
	}
	geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
	geometry.addAttribute( 'uv', new THREE.BufferAttribute( uv, 2 ) );
	geometry.computeBoundingSphere();

  var line = new THREE.Line(
    geometry,
    lineShader
  );
  app.scene.add(line);

  window.addEventListener('resize', function() {
    app.width = window.innerWidth;
    app.height = window.innerHeight;
    rtLeft = new THREE.WebGLRenderTarget(app.width, app.height, rtParams);
    rtRight = new THREE.WebGLRenderTarget(app.width, app.height, rtParams);

    quadLeft.material.map = rtLeft;
    quadRight.material.map = rtRight;

    app.camera.aspect = app.width/app.height;
    app.camera.updateProjectionMatrix();
  });

  app.onResultChanged = function (event) {
    this.$.animation.addAnimation(this.scene, event.detail.value);
  };

  var loop = function () {
    lineShader.uniforms.ftex.value = field.texture;
    lineShader.uniforms.ftrans.value = field.uniforms.ftrans.value;
    lineShader.uniforms.finvTrans.value = field.uniforms.finvTrans.value;

    lineShader.uniforms.audio.value = app.$.voice.waveHistoryTexture;
    terrainShader.uniforms.audio.value = app.$.voice.levelHistoryTexture;

    requestAnimationFrame(loop);

    app.$.animation.update();

    app.$.voice.update();
    app.$.renderer.autoClear = true;
    app.$.renderer.autoClearDepth = true;
    app.$.renderer.autoClearColor = true;
    app.$.renderer.autoClearAlpha = true;
    app.$.renderer.autoClearStencil = true;

    app.$.renderer.clear();

    var overscan = 1.05;

    app.camera.setViewOffset(app.width, app.height, 0, 0, app.width/2 * overscan, app.height);
    app.$.renderer.render(app.scene, app.camera, rtLeft, true);

    app.camera.setViewOffset(app.width, app.height, app.width/2 - overscan, 0, app.width/2 * overscan, app.height);
    app.$.renderer.render(app.scene, app.camera, rtRight, true);

    app.$.renderer.render(sceneScreen, cameraScreen);
  };


  app.addEventListener('dom-change', function() {
    loop();
  });

})(document, THREE);
