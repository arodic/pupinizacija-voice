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

			"varying vec2 vUv;",

			"void main() {",

      " vUv = uv * 50.0;",

      " vec4 offset = texture2D( displace, uv );",

      " vec4 mvPosition = modelViewMatrix * vec4( position + vec3(0.0, 0.0, 15.0 * pow(offset.r, 3.0)), 1.0 );",

      " gl_Position = projectionMatrix * mvPosition;",

			"}"

		].join("\n"),

		fragmentShader: [

			"uniform sampler2D map;",
			"uniform sampler2D audio;",

			"varying vec2 vUv;",

			"void main() {",

      " vec4 texelColor = texture2D( map, vUv );",
      " vec4 audioColor = texture2D( audio, vUv );",

			"	gl_FragColor = vec4( texelColor.rgb + 10.0 * (audioColor.rgb - vec3(0.5)), 1.0 );",

			"}"

		].join("\n")

  });

  var terrain = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(150, 150, 50, 50),
    terrainShader
  );
  terrain.rotation.x = - Math.PI / 2;
  terrain.position.y = - 5;

  app.scene.add(terrain);

  window.addEventListener('resize', function() {
    app.width = (window.innerWidth - 12);
    app.height = Math.floor(app.width / 2);
  });

  app.onResultChanged = function (event) {
    this.$.animation.addAnimation(this.scene, event.detail.value);
  };


  var loop = function () {

    terrainShader.uniforms.audio.value = app.$.voice.freqDataTexture;

    requestAnimationFrame(loop);
    app.$.animation.update();
    app.$.voice.update();
    app.$.viewport.render();
  };


  app.addEventListener('dom-change', function() {
    this.$.viewport.scene = app.scene;

    var camera = this.$.viewport.camera;
    camera.fov = 90;
    camera.position.set(0, 5, 10);
    camera.lookAt(camera._target);
    loop();
  });

})(document, THREE);
