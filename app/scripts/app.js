(function(document, THREE) {

  var app = document.querySelector('#app');
  app.width = (window.innerWidth - 12);
  app.height = Math.floor(app.width / 2);

  app.scene = new THREE.Scene();


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

      " float audioColor = texture2D( audio, vec2(dist, 0.0) ).r;",

      " float offset = texture2D( displace, uv ).r * 45.0 + audioColor;",

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

      " vec4 texelColor = 15.0 * texture2D( map, vUv * vec2(150.0, 75.0) );",
      " float audioColor = texture2D( audio, vec2(dist, 0.0) ).r;",

			"	gl_FragColor = vec4( texelColor.rgb * (1.0 + 15.0 * audioColor), 1.0 );",

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

  window.addEventListener('resize', function() {
    app.width = (window.innerWidth - 12);
    app.height = Math.floor(app.width / 2);
  });

  app.onResultChanged = function (event) {
    this.$.animation.addAnimation(this.scene, event.detail.value);
  };

  var loop = function () {
    requestAnimationFrame(loop);
    app.$.animation.update();
    app.$.voice.update();
    app.$.viewport.render();
  };


  app.addEventListener('dom-change', function() {

    this.$.viewport.scene = app.scene;
    var camera = this.$.viewport.camera;
    camera.fov = 90;
    camera.position.set(0, 3, 40);
    camera.lookAt(camera._target);
    // connect audio data texture;
    terrainShader.uniforms.audio.value = app.$.voice.levelDataTexture;
    loop();
  });

})(document, THREE);
