!function(e,a){var i=e.querySelector("#app");i.width=window.innerWidth,i.height=window.innerHeight;var r={minFilter:a.LinearFilter,magFilter:a.NearestFilter,format:a.RGBFormat},t=new a.WebGLRenderTarget(i.width,i.height,r),n=new a.WebGLRenderTarget(i.width,i.height,r),o=new a.Scene,d=new a.Mesh(new a.PlaneBufferGeometry(1,1),new a.MeshBasicMaterial({map:t,alphaMap:a.ImageUtils.loadTexture("images/maskLeft.png"),transparent:!0}));d.position.x=-.5,o.add(d);var s=new a.Mesh(new a.PlaneBufferGeometry(1,1),new a.MeshBasicMaterial({map:n,alphaMap:a.ImageUtils.loadTexture("images/maskRight.png"),transparent:!0}));s.position.x=.5,o.add(s);var l=new a.OrthographicCamera(-1,1,.5,-.5,-100,100);i.scene=new a.Scene,i.camera=new a.PerspectiveCamera(90,i.width/i.height,.1,1e3),i.camera.position.set(0,4,40),i.camera.lookAt(new a.Vector3);var u=a.ImageUtils.loadTexture("images/grid.png");u.wrapS=a.RepeatWrapping,u.wrapT=a.RepeatWrapping,u.anisotropy=6;var v=a.ImageUtils.loadTexture("images/displace.jpg"),m=new a.ShaderMaterial({uniforms:{map:{type:"t",value:u},displace:{type:"t",value:v},audio:{type:"t",value:null}},vertexShader:["uniform sampler2D displace;","uniform sampler2D audio;","varying vec2 vUv;","varying float dist;","void main() {"," vUv = uv;"," dist = distance(uv * vec2(1.0, 0.5), vec2(0.35, 0.05));"," float audioColor = texture2DLod( audio, vec2(dist, 0.0), 2.0 ).r;"," float offset = texture2D( displace, uv ).r * 45.0 + audioColor * 4.0;"," vec4 mvPosition = modelViewMatrix * vec4( position + vec3(0.0, 0.0, offset), 1.0 );"," gl_Position = projectionMatrix * mvPosition;","}"].join("\n"),fragmentShader:["uniform sampler2D map;","uniform sampler2D audio;","varying vec2 vUv;","varying float dist;","void main() {"," vec4 texelColor = 10.0 * texture2D( map, vUv * vec2(150.0, 75.0) );"," float audioColor = texture2D( audio, vec2(dist, 0.0) ).r;","	gl_FragColor = vec4( texelColor.rgb * (1.0 + 10.0 * audioColor), 1.0 );","}"].join("\n")}),f=new a.Mesh(new a.PlaneBufferGeometry(150,75,150,75),m);f.rotation.x=-Math.PI/2,f.position.y=0,i.scene.add(f);for(var h=new a.ShaderMaterial({uniforms:a.UniformsUtils.merge([{audio:{type:"t",value:null}},field.uniforms]),vertexShader:[field.shaderChunk.params,"uniform sampler2D audio;",field.shaderChunk.functions,"varying vec2 vUv;","void main() {","vUv = uv;"," float offset = texture2D( audio, vec2(uv.x, 0.0) ).r * 8.;"," vec4 mvPosition = modelMatrix * vec4( position + vec3(0.0, offset, 0.0), 1.0 );"," float intensity = max(0.0, abs(mvPosition.x / 25.) - fintensity);"," vec3 field = getField(ftex, ftrans, finvTrans, mvPosition.xyz, fgrid, intensity);"," field.y *= 3.0;"," gl_Position = projectionMatrix * viewMatrix * (mvPosition + vec4(field, 0.0));","}"].join("\n"),fragmentShader:["uniform sampler2D audio;","varying vec2 vUv;","void main() {"," float alpha = min(1.0, abs(texture2D( audio, vec2(vUv.x, 0.0) ).r * 1000.));","	gl_FragColor = vec4( 1.0, 1.0, 1.0, alpha );","}"].join("\n"),transparent:!0,depthTest:!1}),c=2048,p=new a.BufferGeometry,g=new Float32Array(3*c),w=new Float32Array(2*c),x=0;c>x;x++){var y=-30+x/c*60,C=3.5,M=30;g[3*x]=y,g[3*x+1]=C,g[3*x+2]=M,w[2*x]=x/c,w[2*x+1]=x/c}p.addAttribute("position",new a.BufferAttribute(g,3)),p.addAttribute("uv",new a.BufferAttribute(w,2)),p.computeBoundingSphere();var T=new a.Line(p,h);i.scene.add(T),window.addEventListener("resize",function(){i.width=window.innerWidth,i.height=window.innerHeight,t=new a.WebGLRenderTarget(i.width,i.height,r),n=new a.WebGLRenderTarget(i.width,i.height,r),d.material.map=t,s.material.map=n,i.camera.aspect=i.width/i.height,i.camera.updateProjectionMatrix()}),i.onResultChanged=function(e){this.$.animation.addAnimation(this.scene,e.detail.value)};var P=function(){h.uniforms.ftex.value=field.texture,h.uniforms.ftrans.value=field.uniforms.ftrans.value,h.uniforms.finvTrans.value=field.uniforms.finvTrans.value,h.uniforms.audio.value=i.$.voice.waveHistoryTexture,m.uniforms.audio.value=i.$.voice.levelHistoryTexture,requestAnimationFrame(P),i.$.animation.update(),i.$.voice.update(),i.$.renderer.autoClear=!0,i.$.renderer.autoClearDepth=!0,i.$.renderer.autoClearColor=!0,i.$.renderer.autoClearAlpha=!0,i.$.renderer.autoClearStencil=!0,i.$.renderer.clear();var e=1.05;i.camera.setViewOffset(i.width,i.height,0,0,i.width/2*e,i.height),i.$.renderer.render(i.scene,i.camera,t,!0),i.camera.setViewOffset(i.width,i.height,i.width/2-e,0,i.width/2*e,i.height),i.$.renderer.render(i.scene,i.camera,n,!0),i.$.renderer.render(o,l)};i.addEventListener("dom-change",function(){P()})}(document,THREE),function(e,a){var i=e.querySelector("#app");i.width=window.innerWidth,i.height=window.innerHeight;var r={minFilter:a.LinearFilter,magFilter:a.NearestFilter,format:a.RGBFormat},t=new a.WebGLRenderTarget(i.width,i.height,r),n=new a.WebGLRenderTarget(i.width,i.height,r),o=new a.Scene,d=new a.Mesh(new a.PlaneBufferGeometry(1,1),new a.MeshBasicMaterial({map:t,alphaMap:a.ImageUtils.loadTexture("images/maskLeft.png"),transparent:!0}));d.position.x=-.5,o.add(d);var s=new a.Mesh(new a.PlaneBufferGeometry(1,1),new a.MeshBasicMaterial({map:n,alphaMap:a.ImageUtils.loadTexture("images/maskRight.png"),transparent:!0}));s.position.x=.5,o.add(s);var l=new a.OrthographicCamera(-1,1,.5,-.5,-100,100);i.scene=new a.Scene,i.camera=new a.PerspectiveCamera(90,i.width/i.height,.1,1e3),i.camera.position.set(0,4,40),i.camera.lookAt(new a.Vector3);var u=a.ImageUtils.loadTexture("images/grid.png");u.wrapS=a.RepeatWrapping,u.wrapT=a.RepeatWrapping,u.anisotropy=6;var v=a.ImageUtils.loadTexture("images/displace.jpg"),m=new a.ShaderMaterial({uniforms:{map:{type:"t",value:u},displace:{type:"t",value:v},audio:{type:"t",value:null}},vertexShader:["uniform sampler2D displace;","uniform sampler2D audio;","varying vec2 vUv;","varying float dist;","void main() {"," vUv = uv;"," dist = distance(uv * vec2(1.0, 0.5), vec2(0.35, 0.05));"," float audioColor = texture2DLod( audio, vec2(dist, 0.0), 2.0 ).r;"," float offset = texture2D( displace, uv ).r * 45.0 + audioColor * 4.0;"," vec4 mvPosition = modelViewMatrix * vec4( position + vec3(0.0, 0.0, offset), 1.0 );"," gl_Position = projectionMatrix * mvPosition;","}"].join("\n"),fragmentShader:["uniform sampler2D map;","uniform sampler2D audio;","varying vec2 vUv;","varying float dist;","void main() {"," vec4 texelColor = 10.0 * texture2D( map, vUv * vec2(150.0, 75.0) );"," float audioColor = texture2D( audio, vec2(dist, 0.0) ).r;","	gl_FragColor = vec4( texelColor.rgb * (1.0 + 10.0 * audioColor), 1.0 );","}"].join("\n")}),f=new a.Mesh(new a.PlaneBufferGeometry(150,75,150,75),m);f.rotation.x=-Math.PI/2,f.position.y=0,i.scene.add(f);for(var h=new a.ShaderMaterial({uniforms:a.UniformsUtils.merge([{audio:{type:"t",value:null}},field.uniforms]),vertexShader:[field.shaderChunk.params,"uniform sampler2D audio;",field.shaderChunk.functions,"varying vec2 vUv;","void main() {","vUv = uv;"," float offset = texture2D( audio, vec2(uv.x, 0.0) ).r * 8.;"," vec4 mvPosition = modelMatrix * vec4( position + vec3(0.0, offset, 0.0), 1.0 );"," float intensity = max(0.0, abs(mvPosition.x / 25.) - fintensity);"," vec3 field = getField(ftex, ftrans, finvTrans, mvPosition.xyz, fgrid, intensity);"," field.y *= 3.0;"," gl_Position = projectionMatrix * viewMatrix * (mvPosition + vec4(field, 0.0));","}"].join("\n"),fragmentShader:["uniform sampler2D audio;","varying vec2 vUv;","void main() {"," float alpha = min(1.0, abs(texture2D( audio, vec2(vUv.x, 0.0) ).r * 1000.));","	gl_FragColor = vec4( 1.0, 1.0, 1.0, alpha );","}"].join("\n"),transparent:!0,depthTest:!1}),c=2048,p=new a.BufferGeometry,g=new Float32Array(3*c),w=new Float32Array(2*c),x=0;c>x;x++){var y=-30+x/c*60,C=3.5,M=30;g[3*x]=y,g[3*x+1]=C,g[3*x+2]=M,w[2*x]=x/c,w[2*x+1]=x/c}p.addAttribute("position",new a.BufferAttribute(g,3)),p.addAttribute("uv",new a.BufferAttribute(w,2)),p.computeBoundingSphere();var T=new a.Line(p,h);i.scene.add(T),window.addEventListener("resize",function(){i.width=window.innerWidth,i.height=window.innerHeight,t=new a.WebGLRenderTarget(i.width,i.height,r),n=new a.WebGLRenderTarget(i.width,i.height,r),d.material.map=t,s.material.map=n,i.camera.aspect=i.width/i.height,i.camera.updateProjectionMatrix()}),i.onResultChanged=function(e){this.$.animation.addAnimation(this.scene,e.detail.value)};var P=function(){h.uniforms.ftex.value=field.texture,h.uniforms.ftrans.value=field.uniforms.ftrans.value,h.uniforms.finvTrans.value=field.uniforms.finvTrans.value,h.uniforms.audio.value=i.$.voice.waveHistoryTexture,m.uniforms.audio.value=i.$.voice.levelHistoryTexture,requestAnimationFrame(P),i.$.animation.update(),i.$.voice.update(),i.$.renderer.autoClear=!0,i.$.renderer.autoClearDepth=!0,i.$.renderer.autoClearColor=!0,i.$.renderer.autoClearAlpha=!0,i.$.renderer.autoClearStencil=!0,i.$.renderer.clear();var e=1.05;i.camera.setViewOffset(i.width,i.height,0,0,i.width/2*e,i.height),i.$.renderer.render(i.scene,i.camera,t,!0),i.camera.setViewOffset(i.width,i.height,i.width/2-e,0,i.width/2*e,i.height),i.$.renderer.render(i.scene,i.camera,n,!0),i.$.renderer.render(o,l)};i.addEventListener("dom-change",function(){P()})}(document,THREE);