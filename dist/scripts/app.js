!function(e,n){var t=e.querySelector("#app");t.width=window.innerWidth-12,t.height=Math.floor(t.width/2),t.scene=new n.Scene,window.addEventListener("resize",function(){t.width=window.innerWidth-12,t.height=Math.floor(t.width/2)}),t.onResultChanged=function(e){this.$.animation.addAnimation(this.scene,e.detail.value)},t.onAnimationChanged=function(){this.$.viewport.render()},t.addEventListener("dom-change",function(){this.$.viewport.scene=t.scene;var e=this.$.viewport.camera;e.fov=90,e.position.set(0,2,10),e.lookAt(e._target)})}(document,THREE),function(e,n){var t=e.querySelector("#app");t.width=window.innerWidth-12,t.height=Math.floor(t.width/2),t.scene=new n.Scene,window.addEventListener("resize",function(){t.width=window.innerWidth-12,t.height=Math.floor(t.width/2)}),t.onResultChanged=function(e){this.$.animation.addAnimation(this.scene,e.detail.value)},t.onAnimationChanged=function(){this.$.viewport.render()},t.addEventListener("dom-change",function(){this.$.viewport.scene=t.scene;var e=this.$.viewport.camera;e.fov=90,e.position.set(0,2,10),e.lookAt(e._target)})}(document,THREE);