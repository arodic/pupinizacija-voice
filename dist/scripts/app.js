!function(e){"use strict";var n=e.querySelector("#app");n.width=window.innerWidth-12,n.height=Math.floor(n.width/2),n.scene=new THREE.Scene,window.addEventListener("resize",function(){n.width=window.innerWidth-12,n.height=Math.floor(n.width/2)}),n.onResultChanged=function(e){this.$.animation.addAnimation(this.scene,e.detail.value)},n.onAnimationChanged=function(e){this.$.viewport.render()},n.addEventListener("dom-change",function(){this.$.viewport.scene=n.scene;var e=this.$.viewport.camera;e.fov=90,e.position.set(0,2,10),e.lookAt(e._target)})}(document);