var field = {
  size: 512,
  grid: 8,
  intensity: 0.25,
  texture: THREE.ImageUtils.loadTexture('noise_mid.png'),
  transform: new THREE.Mesh(
    new THREE.CubeGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: true})
  )
};

field.texture.wrapS = THREE.ClampToEdgeWrapping;
field.texture.wrapT = THREE.ClampToEdgeWrapping;
field.texture.magFilter = THREE.LinearFilter;
field.texture.minFilter = THREE.LinearFilter;
field.texture.wrapS = THREE.RepeatWrapping;
field.texture.wrapT = THREE.RepeatWrapping;

field.transform.material.visible = false;
field.transform.scale.set(20, 10, 10);
field.transform.position.y = 3.5;
field.transform.position.z = 30;
field.transform.position.x = 0;
field.transform.updateMatrixWorld();

field.uniforms = {
  'ftex': { type: 't', value: field.texture },
  'fgrid': { type: 'f', value: field.grid },
  'fintensity': { type: 'f', value: field.intensity },
  'ftrans': { type: 'm4', value: field.transform.matrixWorld },
  'finvTrans': { type: 'm4', value: new THREE.Matrix4().getInverse(field.transform.matrixWorld.clone()) },
};

field.shaderChunk = {
  params: [
    'uniform sampler2D ftex;',
		'uniform float     fgrid;',
		'uniform float     fintensity;',
		'uniform mat4      ftrans;',
		'uniform mat4      finvTrans;'
	].join('\n'),

  functions: [
    'vec3 getTiles(vec3 pos, float grid){',
		'	float z = (pos.z+0.5)*grid*grid;',
		'	float tile1 = floor(z);',
		'	float bias = abs(z-tile1);',
		'	float tile2 = (tile1 > z) ? tile1 + 1.0 : tile1 - 1.0;',
		'	return vec3(tile1, tile2, bias);',
		'}',

    'vec2 uvFromPos(vec3 pos, float tile, float grid){',
		'	return vec2(',
		'			+(pos.x+0.5)/grid',
		'			+floor(tile / grid) / grid,',
		'			+(pos.y+0.5)/grid',
		'		  +mod(tile, grid) / grid',
		'		);',
		'}',

    'vec3 getPosition(sampler2D tPositions, mat4 trans, vec2 uv){',
		'	vec3 pos = texture2D(tPositions, uv).xyz - vec3(0.5);',
		'	pos = (trans * vec4(pos, 1.0)).xyz;',
		'	return pos;',
		'}',

    'vec3 getField(sampler2D tPositions, mat4 trans, mat4 invTrans, vec3 pos, float grid, float intensity){',
		'	vec3 posOldInv = (invTrans * vec4(pos, 1.0)).xyz;',
	  '	vec3 tiles = getTiles(posOldInv, grid);',
	  '	vec3 sample1 = texture2D(tPositions, uvFromPos(posOldInv, tiles.x, grid)).xyz;',
	  '	vec3 sample2 = texture2D(tPositions, uvFromPos(posOldInv, tiles.y, grid)).xyz;',
    '	vec3 field = (sample1*tiles.z + sample2*(1.0-tiles.z) - vec3(0.5)) * intensity;',
    '	return (mat4(trans[0], trans[1], trans[2], vec4(0.,0.,0.,1.0)) * vec4(field, 1.0)).xyz;',
		'}'
	].join('\n')
};

field.update = function() {
  this.transform.rotation.x += 0.005;
  this.transform.position.x += 0.1;
  this.transform.position.x = this.transform.position.x % 20000;
  this.transform.updateMatrixWorld();
  this.uniforms.ftrans.value = this.transform.matrixWorld;
  this.uniforms.finvTrans.value = new THREE.Matrix4().getInverse(this.transform.matrixWorld.clone());
};


var animationShader = new THREE.ShaderMaterial({

  uniforms: field.uniforms,

	vertexShader: [
    field.shaderChunk.params,

    'varying vec3 col;',

    field.shaderChunk.functions,

		'void main() {',

    ' vec4 mvPosition = modelMatrix * vec4(position, 1.0);',

    ' float intensity = max(0.0, abs(mvPosition.x / 25.) - fintensity);',

    ' vec3 field = getField(ftex, ftrans, finvTrans, mvPosition.xyz, fgrid, intensity);',

    ' field.y *= 3.0;',

    ' col = mix(vec3(1.0), abs(field), intensity);',

    ' gl_Position = projectionMatrix * viewMatrix * (mvPosition + vec4(field, 0.0));',

		'}'

	].join('\n'),

	fragmentShader: [

    'varying vec3 col;',

		'void main() {',

		'	gl_FragColor = vec4(col, 1.0);',

		'}'

	].join('\n')

});

var animations = [], min = 0;

var TextAnimation = function (word) {

  var geometry = new THREE.TextGeometry(word, {

    size: 1,
    height: 0.1,
    curveSegments: 1,

    font: 'droid sans',
    weight: 'normal',
    style: 'normal',

    bevelThickness: 0.02,
    bevelSize: 0.015,
    bevelEnabled: true,
  });

  geometry.computeBoundingBox();

  var material = new THREE.ShaderMaterial({
    uniforms: animationShader.uniforms,
    vertexShader: animationShader.vertexShader,
    fragmentShader: animationShader.fragmentShader,
    wireframe: true
  });

  material.uniforms.ftex.value = field.texture;
  material.uniforms.ftrans.value = field.uniforms.ftrans.value;
  material.uniforms.finvTrans.value = field.uniforms.finvTrans.value;

  THREE.LineSegments.call(this, geometry, material);

  min = 0;

  for(var i = 0; i < animations.length; i++) {
    min = Math.min(min, animations[i].position.x - 1);
  }

  this.position.y = 3.5;
  this.position.z = 30;
  this.position.x = - geometry.boundingBox.max.x - Math.max(30, -min);

  animations.push(this);

  this.update = function() {
    this.position.x += 0.04;
    if (this.position.x > 50) {
      animations.splice(animations.indexOf(this), 1);
      this.parent.remove(this);
    }
  };
};

TextAnimation.prototype = Object.create(THREE.Mesh.prototype);
TextAnimation.prototype.constructor = TextAnimation;

//Animation Loop
var loop = function() {
  requestAnimationFrame(loop);
  for (var i = 0; i < animations.length; i++) {
    animations[i].update();
  }
  field.update();
}
loop();
