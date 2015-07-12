(function(document, THREE) {

  var app = document.querySelector('#app');
  app.width = (window.innerWidth - 12);
  app.height = Math.floor(app.width / 2);

  app.scene = new THREE.Scene();

  window.addEventListener('resize', function() {
    app.width = (window.innerWidth - 12);
    app.height = Math.floor(app.width / 2);
  });

  app.onResultChanged = function (event) {
    this.$.animation.addAnimation(this.scene, event.detail.value);
  };
  app.onAnimationChanged = function () {
    this.$.viewport.render();
  };

  app.addEventListener('dom-change', function() {
    this.$.viewport.scene = app.scene;

    var camera = this.$.viewport.camera;
    camera.fov = 90;
    camera.position.set(0, 2, 10);
    camera.lookAt(camera._target);
  });

})(document, THREE);
