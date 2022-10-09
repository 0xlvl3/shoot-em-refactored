(()=>{"use strict";var t={d:(i,e)=>{for(var s in e)t.o(e,s)&&!t.o(i,s)&&Object.defineProperty(i,s,{enumerable:!0,get:e[s]})},o:(t,i)=>Object.prototype.hasOwnProperty.call(t,i)};t.d({},{c:()=>g,J:()=>m,h:()=>w});class i{constructor(t,i,e,s,o){this.x=t,this.y=i,this.radius=e,this.color=s,this.velocity=o,this.type="Linear",this.radians=0,this.center={x:t,y:i},Math.random()<.5&&(this.type="Homing",Math.random()<.5&&(this.type="Spinning",Math.random()<.5&&(this.type="Homing Spinning")))}draw(){g.beginPath(),g.arc(this.x,this.y,this.radius,0,2*Math.PI,!1),g.fillStyle=this.color,g.fill()}update(){if(this.draw(),"Spinning"===this.type)this.radians+=.1,this.center.x+=this.velocity.x,this.center.y+=this.velocity.y,this.x=this.center.x+30*Math.cos(this.radians),this.y=this.center.y+30*Math.sin(this.radians);else if("Homing"===this.type){const t=Math.atan2(w.y-this.y,w.x-this.x);this.velocity.x=Math.cos(t),this.velocity.y=Math.sin(t),this.x=this.x+this.velocity.x,this.y=this.y+this.velocity.y}else if("Homing Spinning"===this.type){this.radians+=.1;const t=Math.atan2(w.y-this.center.y,w.x-this.center.x);this.velocity.x=Math.cos(t),this.velocity.y=Math.sin(t),this.center.x+=this.velocity.x,this.center.y+=this.velocity.y,this.x=this.center.x+30*Math.cos(this.radians),this.y=this.center.y+30*Math.sin(this.radians)}else this.x=this.x+this.velocity.x,this.y=this.y+this.velocity.y}}class e{constructor(t,i,e,s){this.x=t,this.y=i,this.radius=e,this.color=s,this.velocity={x:0,y:0},this.powerUp}draw(){g.beginPath(),g.arc(this.x,this.y,this.radius,0,2*Math.PI,!1),g.fillStyle=this.color,g.fill()}update(){this.draw(),this.velocity.x*=.95,this.velocity.y*=.95,this.x+this.radius+this.velocity.x<=m.width&&this.x-this.radius+this.velocity.x>=0?this.x+=this.velocity.x:this.velocity.x=0,this.y+this.radius+this.velocity.y<=m.height&&this.y-this.radius+this.velocity.y>=0?this.y+=this.velocity.y:this.velocity.y=0}}class s{constructor(t,i,e,s,o){this.x=t,this.y=i,this.radius=e,this.color=s,this.velocity=o,this.alpha=1}draw(){g.save(),g.globalAlpha=this.alpha,g.beginPath(),g.arc(this.x,this.y,this.radius,0,2*Math.PI,!1),g.fillStyle=this.color,g.fill(),g.restore()}update(){this.draw(),this.velocity.x*=.99,this.velocity.y*=.99,this.x=this.x+this.velocity.x,this.y=this.y+this.velocity.y,this.alpha-=.01}}class o{constructor(t,i,e,s,o){this.x=t,this.y=i,this.radius=e,this.color=s,this.velocity=o}draw(){g.beginPath(),g.arc(this.x,this.y,this.radius,0,2*Math.PI,!1),g.fillStyle=this.color,g.fill()}update(){this.draw(),this.x=this.x+this.velocity.x,this.y=this.y+this.velocity.y}}class a{constructor({position:t={x:0,y:0},velocity:i,imageSrc:e}){this.position=t,this.velocity=i,this.image=new Image,this.image.src=e,this.alpha=1,gsap.to(this,{alpha:.02,duration:.3,repeat:-1,yoyo:!0,ease:"linear"}),this.radians=0}draw(){g.save(),g.globalAlpha=this.alpha,g.translate(this.position.x+this.image.width/2,this.position.y+this.image.height/2),g.rotate(this.radians),g.translate(-this.position.x-this.image.width/2,-this.position.y-this.image.height/2),g.drawImage(this.image,this.position.x,this.position.y),g.restore()}update(){this.draw(),this.radians+=.01,this.position.x+=this.velocity.x}}class h{constructor({position:t,radius:i=3,color:e="blue"}){this.position=t,this.radius=i,this.color=e,this.alpha=.1}draw(){g.save(),g.globalAlpha=this.alpha,g.beginPath(),g.arc(this.position.x,this.position.y,this.radius,0,2*Math.PI),g.fillStyle=this.color,g.fill(),g.restore()}}const n={shoot:new Howl({src:"../src/sounds/Basic_shoot_noise.wav",volume:.025}),damageTaken:new Howl({src:"../src/sounds/Damage_taken.wav",volume:.05}),explode:new Howl({src:"../src/sounds/Explode.wav",volume:.05}),powerUp:new Howl({src:"../src/sounds/Powerup.wav",volume:.025}),death:new Howl({src:"../src/sounds/Death.wav",volume:.05}),select:new Howl({src:"../src/sounds/Select.wav",volume:.05}),background:new Howl({src:"../src/sounds/Hyper.wav",volume:.1,loop:!0})},l=document.getElementById("scoreEl"),c=document.getElementById("modalEl"),r=document.getElementById("endScoreEl"),y=document.getElementById("buttonEl"),d=document.getElementById("startButton"),p=document.getElementById("startModalEl"),u=document.getElementById("volumeOn"),x=document.getElementById("volumeOff"),v=document.getElementById("body"),m=document.querySelector("canvas"),g=m.getContext("2d");let w;m.width=innerWidth,m.height=innerHeight;let M,f,b=[],E=[],k=[],I=[],H=[],L=0,S=0,P={active:!1};const B={position:{x:0,y:0}};function T(){const t=m.width/2,i=m.height/2;w=new e(t,i,30,"white"),b=[],E=[],k=[],I=[],L=0,l.innerHTML=0,S=0,P={active:!0},H=[];for(let t=0;t<m.width+30;t+=30)for(let i=0;i<m.height+30;i+=30)H.push(new h({position:{x:t,y:i},radius:2.5}))}function C(){M=setInterval((()=>{const t=22*Math.random()+8;let e,s;Math.random()<.5?(e=Math.random()<.5?0-t:m.width+t,s=Math.random()*m.height):(e=Math.random()*m.width,s=Math.random()<.5?0-t:m.height+t);const o=`hsl(${360*Math.random()}, 50%, 50%)`,a=Math.atan2(m.height/2-s,m.width/2-e),h={x:Math.cos(a),y:Math.sin(a)};E.push(new i(e,s,t,o,h))}),1e3)}function U(){f=setInterval((()=>{I.push(new a({position:{x:-30,y:Math.random()*m.height},velocity:{x:Math.random()+2,y:0},imageSrc:"./img/lightningBolt.png"}))}),4500)}function A({position:t,score:i}){const e=document.createElement("label");e.innerHTML=i,e.style.color="white",e.style.position="absolute",e.style.left=t.x+"px",e.style.top=t.y+"px",e.style.userSelect="none",e.style.left=document.body.appendChild(e),e.style.pointerEvents="none",gsap.to(e,{opacity:0,y:-30,duration:.75,onComplete:()=>{e.parentNode.removeChild(e)}})}let O;function X(){O=requestAnimationFrame(X),H.forEach((t=>{t.draw();const i=Math.hypot(w.x-t.position.x,w.y-t.position.y);i<150?(t.alpha=0,i>100&&(t.alpha=.5)):i>100&&t.alpha<.1?t.alpha+=.01:i>100&&t.alpha>.1&&(t.alpha-=.01)})),g.fillStyle="rgba(0,0,0,0.1)",g.fillRect(0,0,m.width,m.height),S++,w.update();for(let t=I.length-1;t>=0;t--){const i=I[t];i.position.x>m.width?I.splice(t,1):i.update(),Math.hypot(w.x-i.position.x,w.y-i.position.y)<i.image.height/2+w.radius&&(n.powerUp.play(),I.splice(t,1),w.powerUp="MachineGun",w.color="yellow",setTimeout((()=>{w.powerUp=null,w.color="white"}),5e3))}if("MachineGun"===w.powerUp){const t=Math.atan2(B.position.y-w.y,B.position.x-w.x),i={x:5*Math.cos(t),y:5*Math.sin(t)};S%2==0&&b.push(new o(w.x,w.y,5,"yellow",i)),S%5==0&&n.shoot.play()}for(let t=k.length-1;t>=0;t--){const i=k[t];i.alpha<=0?k.splice(t,1):i.update()}for(let t=b.length-1;t>=0;t--){const i=b[t];i.update(),(i.x+i.radius<0||i.x-i.radius>m.width||i.y+i.radius<0||i.y-i.radius>m.height)&&b.splice(t,1)}for(let t=E.length-1;t>=0;t--){const i=E[t];i.update(),Math.hypot(w.x-i.x,w.y-i.y)-i.radius-w.radius<1&&(n.death.play(),P.active=!1,cancelAnimationFrame(O),clearInterval(M),clearInterval(f),c.style.display="block",gsap.fromTo(c,{scale:.8,opacity:0},{scale:1,opacity:1,ease:"expo"}),r.innerHTML=L);for(let e=b.length-1;e>=0;e--){const o=b[e];if(Math.hypot(o.x-i.x,o.y-i.y)-i.radius-o.radius<1){for(let t=0;t<2*i.radius;t++)k.push(new s(o.x,o.y,2*Math.random(),i.color,{x:(Math.random()-.5)*Math.random()*4,y:(Math.random()-.5)*Math.random()*4}));i.radius-10>5?(n.damageTaken.play(),l.innerHTML=L+=50,gsap.to(i,{radius:i.radius-10}),A({position:{x:o.x,y:o.y},score:50}),b.splice(e,1)):(l.innerHTML=L+=150,A({position:{x:o.x,y:o.y},score:150}),H.forEach((t=>{gsap.set(t,{color:"white",alpha:1}),gsap.to(t,{color:i.color,alpha:.1}),t.color=i.color})),n.explode.play(),E.splice(t,1),b.splice(e,1))}}}}let Y=!1;function _({x:t,y:i}){if(P.active){const e=Math.atan2(i-w.y,t-w.x),s={x:4.5*Math.cos(e),y:4.5*Math.sin(e)};b.push(new o(w.x,w.y,5,"white",s)),n.shoot.play()}}addEventListener("click",(t=>{n.background.playing()||Y||(n.background.play(),Y=!0),_({x:t.clientX,y:t.clientY})})),y.addEventListener("click",(()=>{T(),n.select.play(),X(),C(),U(),gsap.to(c,{opacity:0,scale:.8,duration:.2,ease:"expo.in",onComplete:()=>{c.style.display="none"}})})),addEventListener("mousemove",(t=>{B.position.x=t.clientX,B.position.y=t.clientY})),addEventListener("touchmove",(t=>{B.position.x=t.touches[0].clientX,B.position.y=t.touches[0].clientY})),d.addEventListener("click",(()=>{T(),n.select.play(),X(),C(),U(),v.style.backgroundColor="white",gsap.to(p,{opacity:0,scale:.8,duration:.2,ease:"expo.in",onComplete:()=>{p.style.display="none"}})})),addEventListener("touchstart",(t=>{const i=t.touches[0].clientX,e=t.touches[0].clientY;B.position.x=t.touches[0].clientX,B.position.y=t.touches[0].clientY,_({x:i,y:e})})),addEventListener("resize",(()=>{m.width=innerWidth,m.height=innerHeight,T()})),addEventListener("keydown",(({key:t})=>{switch(t){case"d":w.velocity.x+=1;break;case"a":w.velocity.x-=1;break;case"w":w.velocity.y-=1;break;case"s":w.velocity.y+=1}})),u.addEventListener("click",(t=>{n.background.pause(),x.style.display="block",u.style.display="none";for(let t in n)n[t].mute(!0)})),x.addEventListener("click",(t=>{Y&&n.background.play(),u.style.display="block",x.style.display="none";for(let t in n)n[t].mute(!1)})),document.addEventListener("visibilitychange",(()=>{document.hidden?(clearInterval(M),clearInterval(f)):(C(),U())}))})();