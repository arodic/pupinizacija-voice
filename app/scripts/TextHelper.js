/**
 * @author arodic / http://akirodic.com/
 * @param label text to be displayed
 * @param options.size height of text quad in world usnits
 * @param options.resolution height of text texture in pixels
 * @param options.align text alignment ('left' | 'right' | 'center')
 */

THREE.TextHelper = function ( label, options ) {

    options = options || {};
    options.size = options.size || 4;
    options.resolution = options.resolution || 128;
    options.align = options.align || 'center';

    var canvas = document.createElement( 'canvas' );

    var ctx = canvas.getContext( '2d' );
    // ctx.globalAlpha = 0;
    ctx.font = options.resolution + 'px sans-serif';

    var aspect = ctx.measureText(label).width / options.resolution;

    canvas.width = options.resolution * aspect;
    canvas.height = options.resolution;

    ctx.font = options.resolution + 'px sans-serif';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText( label, options.resolution * aspect / 2, options.resolution / 2 );

    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    texture.premultiplyAlpha = true;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    var material = new THREE.MeshBasicMaterial( { map: texture, transparent: true, side: THREE.DoubleSide } );
    material.blending = THREE.AdditiveBlending;
    // material.depthWrite = false;

    var indices = new Uint16Array( [ 0, 1, 2,  0, 2, 3 ] );
    var vertices = new Float32Array( [ - 0.5, - 0.5, 0,   0.5, - 0.5, 0,   0.5, 0.5, 0,   - 0.5, 0.5, 0 ] );
    var uvs = new Float32Array( [ 0, 0,   1, 0,   1, 1,   0, 1 ] );

    var geometry = new THREE.BufferGeometry();
    geometry.addAttribute( 'index', new THREE.BufferAttribute( indices, 1 ) );
    geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
    geometry.addAttribute( 'uv', new THREE.BufferAttribute( uvs, 2 ) );

    THREE.Mesh.call( this, geometry, material );

    this.type = 'textHelper';

    if (options.align == 'left') {

        this.position.x = - options.size * aspect / 2;

    } else if (options.align == 'right') {

        this.position.x = options.size * aspect / 2;

    }

    this.scale.set( options.size * aspect, options.size, 1 );
    this.updateMatrix();
    this.geometry.applyMatrix(this.matrix);

    this.scale.set( 1, 1, 1 );
    this.position.set( 0, 0, 0 );
    this.updateMatrix();

};

THREE.TextHelper.prototype = Object.create( THREE.Mesh.prototype );
THREE.TextHelper.prototype.constructor = THREE.TextHelper;
