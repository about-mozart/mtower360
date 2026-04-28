const menuBtn=document.getElementById("menuBtn");
const navLinks=document.getElementById("navLinks");
if(menuBtn){menuBtn.addEventListener("click",()=>navLinks.classList.toggle("open"))}

document.querySelectorAll(".nav-links a").forEach(a=>a.addEventListener("click",()=>navLinks.classList.remove("open")));

const target=new Date("2026-05-13T09:00:00-03:00").getTime();
const pad=n=>String(n).padStart(2,"0");
function tick(){
  const diff=Math.max(0,target-Date.now());
  const d=Math.floor(diff/86400000);
  const h=Math.floor(diff%86400000/3600000);
  const m=Math.floor(diff%3600000/60000);
  const s=Math.floor(diff%60000/1000);
  document.getElementById("d").textContent=pad(d);
  document.getElementById("h").textContent=pad(h);
  document.getElementById("m").textContent=pad(m);
  document.getElementById("s").textContent=pad(s);
}
tick();
setInterval(tick,1000);

const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting)entry.target.classList.add("on");
  });
},{threshold:.12});
document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));

const form=document.getElementById("leadForm");
const msg=document.getElementById("formMsg");
const FORM_ENDPOINT="https://script.google.com/macros/s/AKfycbwBhn1j1mkZDnh3FUwhXEVJmGC3aPUKJ4lv7O6f-GQ1Ku9cJDO1SKhYRcyvx3ruOkBg/exec";

if(form){
  form.addEventListener("submit",async e=>{
    e.preventDefault();

    const btn=form.querySelector('button[type="submit"]');
    const originalText=btn?btn.textContent:"";
    const data={
      nome:document.getElementById("nome")?.value.trim()||"",
      email:document.getElementById("email")?.value.trim()||"",
      telefone:document.getElementById("telefone")?.value.trim()||"",
      empresa:document.getElementById("empresa")?.value.trim()||"",
      interesse:document.getElementById("interesse")?.value||"",
      origem:window.location.href
    };

    if(btn){btn.disabled=true;btn.textContent="Enviando inscrição...";}
    if(msg){msg.textContent="";msg.classList.remove("show","error");}

    try{
      await fetch(FORM_ENDPOINT,{method:"POST",mode:"no-cors",body:JSON.stringify(data)});
      if(msg){msg.textContent="Inscrição realizada com sucesso. Em breve entraremos em contato.";msg.classList.add("show");}
      form.reset();
    }catch(err){
      if(msg){msg.textContent="Não foi possível enviar agora. Tente novamente em instantes.";msg.classList.add("show","error");}
    }finally{
      if(btn){btn.disabled=false;btn.textContent=originalText;}
    }
  });
}

const scrollProgress=document.getElementById("scrollProgress");
const cursorGlow=document.getElementById("cursorGlow");
window.addEventListener("scroll",()=>{
  const h=document.documentElement.scrollHeight-window.innerHeight;
  const p=h>0?(window.scrollY/h)*100:0;
  if(scrollProgress)scrollProgress.style.width=p+"%";
});
window.addEventListener("pointermove",e=>{
  if(cursorGlow){cursorGlow.style.left=e.clientX+"px";cursorGlow.style.top=e.clientY+"px";}
});

document.querySelectorAll(".tilt-card").forEach(card=>{
  card.addEventListener("pointermove",e=>{
    const r=card.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5;
    const y=(e.clientY-r.top)/r.height-.5;
    card.style.transform=`perspective(900px) rotateY(${x*7}deg) rotateX(${-y*7}deg) translateY(-3px)`;
  });
  card.addEventListener("pointerleave",()=>card.style.transform="");
});

const terminal=document.getElementById("terminalLine");
const terminalTexts=[
  "Conectividade estável • Monitoramento contínuo • Operação garantida",
  "Rede sincronizada • Equipes conectadas • Status seguro",
  "Segurança operacional ativa • Disponibilidade validada",
  "Infraestrutura MTower • Campo conectado • Controle contínuo"
];
let terminalIndex=0;
setInterval(()=>{
  if(!terminal)return;
  terminalIndex=(terminalIndex+1)%terminalTexts.length;
  terminal.textContent=terminalTexts[terminalIndex];
},2400);

const canvas=document.getElementById("techCanvas");
if(canvas){
  const ctx=canvas.getContext("2d");
  let w,h,dpr,points=[];
  function resize(){
    dpr=window.devicePixelRatio||1;
    w=canvas.offsetWidth;h=canvas.offsetHeight;
    canvas.width=w*dpr;canvas.height=h*dpr;
    ctx.setTransform(dpr,0,0,dpr,0,0);
    points=Array.from({length:54},()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.35,vy:(Math.random()-.5)*.35,r:Math.random()*1.8+1}));
  }
  function draw(){
    ctx.clearRect(0,0,w,h);
    for(const p of points){
      p.x+=p.vx;p.y+=p.vy;
      if(p.x<0||p.x>w)p.vx*=-1;
      if(p.y<0||p.y>h)p.vy*=-1;
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle="rgba(82,255,241,.6)";ctx.fill();
    }
    for(let i=0;i<points.length;i++)for(let j=i+1;j<points.length;j++){
      const a=points[i],b=points[j],dx=a.x-b.x,dy=a.y-b.y,dist=Math.hypot(dx,dy);
      if(dist<145){ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.strokeStyle=`rgba(124,77,219,${(1-dist/145)*.28})`;ctx.lineWidth=1;ctx.stroke();}
    }
    requestAnimationFrame(draw);
  }
  resize();draw();window.addEventListener("resize",resize);
}
