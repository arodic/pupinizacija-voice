!function(e,a,r){var i=e.querySelector("#app");i.width=window.innerWidth,i.height=window.innerHeight;var t={minFilter:a.LinearFilter,magFilter:a.NearestFilter,format:a.RGBFormat},n=new a.WebGLRenderTarget(i.width,i.height,t),o=new a.WebGLRenderTarget(i.width,i.height,t),d=new a.Scene,s=new a.Mesh(new a.PlaneBufferGeometry(1,1),new a.MeshBasicMaterial({map:n,alphaMap:a.ImageUtils.loadTexture("images/maskLeft.png"),transparent:!0}));s.position.x=-.5,d.add(s);var l=new a.Mesh(new a.PlaneBufferGeometry(1,1),new a.MeshBasicMaterial({map:o,alphaMap:a.ImageUtils.loadTexture("images/maskRight.png"),transparent:!0}));l.position.x=.5,d.add(l);var v=new a.OrthographicCamera(-1,1,.5,-.5,-100,100);i.scene=new a.Scene,i.camera=new a.PerspectiveCamera(90,i.width/i.height,.1,1e3),i.camera.position.set(0,4,40),i.camera.lookAt(new a.Vector3);var u=a.ImageUtils.loadTexture("images/grid.png");u.wrapS=a.RepeatWrapping,u.wrapT=a.RepeatWrapping,u.anisotropy=6;var m=a.ImageUtils.loadTexture("images/displace.jpg"),f=new a.ShaderMaterial({uniforms:{map:{type:"t",value:u},displace:{type:"t",value:m},audio:{type:"t",value:null}},vertexShader:["uniform sampler2D displace;","uniform sampler2D audio;","varying vec2 vUv;","varying float dist;","void main() {"," vUv = uv;"," dist = distance(uv * vec2(1.0, 0.5), vec2(0.35, 0.05));"," float audioColor = texture2DLod(audio, vec2(dist, 0.0), 2.0).r;"," float offset = texture2D(displace, uv).r * 45.0 + audioColor * 4.0;"," vec4 mvPosition = modelViewMatrix * vec4(position + vec3(0.0, 0.0, offset), 1.0);"," gl_Position = projectionMatrix * mvPosition;","}"].join("\n"),fragmentShader:["uniform sampler2D map;","uniform sampler2D audio;","varying vec2 vUv;","varying float dist;","void main() {"," vec4 texelColor = 10.0 * texture2D(map, vUv * vec2(150.0, 75.0));"," float audioColor = texture2D(audio, vec2(dist, 0.0)).r;","	gl_FragColor = vec4(texelColor.rgb * (1.0 + 10.0 * audioColor), 1.0);","}"].join("\n")}),h=new a.Mesh(new a.PlaneBufferGeometry(150,75,150,75),f);h.rotation.x=-Math.PI/2,h.position.y=0,i.scene.add(h);for(var c=new a.ShaderMaterial({uniforms:a.UniformsUtils.merge([{audio:{type:"t",value:null}},r.uniforms]),vertexShader:[r.shaderChunk.params,"uniform sampler2D audio;",r.shaderChunk.functions,"varying vec2 vUv;","void main() {","vUv = uv;"," float offset = texture2D(audio, vec2(uv.x, 0.0)).r * 8.;"," vec4 mvPosition = modelMatrix * vec4(position + vec3(0.0, offset, 0.0), 1.0);"," float intensity = max(0.0, abs(mvPosition.x / 25.) - fintensity);"," vec3 field = getField(ftex, ftrans, finvTrans, mvPosition.xyz, fgrid, intensity);"," field.y *= 3.0;"," gl_Position = projectionMatrix * viewMatrix * (mvPosition + vec4(field, 0.0));","}"].join("\n"),fragmentShader:["uniform sampler2D audio;","varying vec2 vUv;","void main() {"," float alpha = min(1.0, abs(texture2D(audio, vec2(vUv.x, 0.0)).r * 1000.));","	gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);","}"].join("\n"),transparent:!0,depthTest:!1}),p=2048,g=new a.BufferGeometry,w=new Float32Array(3*p),x=new Float32Array(2*p),y=0;p>y;y++){var C=-30+y/p*60,M=3.5,T=30;w[3*y]=C,w[3*y+1]=M,w[3*y+2]=T,x[2*y]=y/p,x[2*y+1]=y/p}g.addAttribute("position",new a.BufferAttribute(w,3)),g.addAttribute("uv",new a.BufferAttribute(x,2)),g.computeBoundingSphere();var P=new a.Line(g,c);i.scene.add(P),window.addEventListener("resize",function(){i.width=window.innerWidth,i.height=window.innerHeight,n=new a.WebGLRenderTarget(i.width,i.height,t),o=new a.WebGLRenderTarget(i.width,i.height,t),s.material.map=n,l.material.map=o,i.camera.aspect=i.width/i.height,i.camera.updateProjectionMatrix()}),i.onResultChanged=function(e){this.$.animation.addAnimation(this.scene,e.detail.value)};var U=function(){c.uniforms.ftex.value=r.texture,c.uniforms.ftrans.value=r.uniforms.ftrans.value,c.uniforms.finvTrans.value=r.uniforms.finvTrans.value,c.uniforms.audio.value=i.$.voice.waveHistoryTexture,f.uniforms.audio.value=i.$.voice.levelHistoryTexture,requestAnimationFrame(U),i.$.animation.update(),i.$.voice.update(),i.$.renderer.autoClear=!0,i.$.renderer.autoClearDepth=!0,i.$.renderer.autoClearColor=!0,i.$.renderer.autoClearAlpha=!0,i.$.renderer.autoClearStencil=!0,i.$.renderer.clear();var e=1.05;i.camera.setViewOffset(i.width,i.height,0,0,i.width/2*e,i.height),i.$.renderer.render(i.scene,i.camera,n,!0),i.camera.setViewOffset(i.width,i.height,i.width/2-e,0,i.width/2*e,i.height),i.$.renderer.render(i.scene,i.camera,o,!0),i.$.renderer.render(d,v)};i.addEventListener("dom-change",function(){U()})}();