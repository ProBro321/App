/* Robux Rewards — game rules (no drawing here, so the levels can be checked automatically) */
const T=40,ROWS=14,PW=26,PH=34,GRAV=0.7,JUMP=-13.5,PADV=-20,SPEED=5;
function build(w,fn){
  const m=Array.from({length:ROWS},()=>Array(w).fill("."));const L={w,m,movers:[],enemies:[],coins:[],start:[2,0],goal:[w-3,0]};
  const set=(x,r,ch)=>{if(x>=0&&x<w&&r>=0&&r<ROWS)m[r][x]=ch;};
  const api={
    g:(a,b,h=0)=>{for(let x=a;x<=b;x++)for(let r=11-h;r<ROWS;r++)set(x,r,"#");},
    p:(a,b,h)=>{for(let x=a;x<=b;x++)set(x,11-h,"#");},
    sp:(a,b,h=0)=>{for(let x=a;x<=b;x++)set(x,10-h,"^");},
    lava:(a,b)=>{for(let x=a;x<=b;x++)set(x,13,"L");},
    j:(x,h=0)=>set(x,11-h,"J"),
    c:(x,h=0,n=1)=>{for(let i=0;i<n;i++)L.coins.push({x:(x+i)*T+T/2,y:(10-h)*T+T/2});},
    e:(x,h=0,r=2)=>L.enemies.push({x:x*T+4,y:(10-h)*T+8,r:r*T,per:Math.round(r*T*2/1.6)}),
    mh:(x,h,range,per=220)=>L.movers.push({x:x*T,y:(11-h)*T,w:3*T,dx:range*T,dy:0,per}),
    mv:(x,h,range,per=220)=>L.movers.push({x:x*T,y:(11-h)*T,w:3*T,dx:0,dy:-range*T,per}),
    S:(x,h=0)=>L.start=[x,h],G:(x,h=0)=>L.goal=[x,h]
  };
  fn(api);return L;
}
const LEVELS=[
 build(44,a=>{a.g(0,9);a.g(12,18);a.g(19,22,1);a.g(23,26,2);a.g(30,43);a.lava(10,11);a.lava(27,29);a.c(5,0,3);a.c(14,0,3);a.c(20,1,2);a.c(24,2,2);a.c(34,0,4);a.S(2);a.G(41);}),
 build(52,a=>{a.g(0,7);a.sp(5,5);a.g(11,17);a.sp(14,15);a.g(21,24,1);a.g(28,31,2);a.g(35,51);a.sp(40,41);a.sp(45,45);a.lava(8,10);a.lava(18,20);a.lava(25,27);a.lava(32,34);
   a.c(5,2);a.c(9,2);a.c(14,2,2);a.c(22,1,2);a.c(29,2,2);a.c(40,2,2);a.c(45,2);a.S(1);a.G(49);}),
 build(56,a=>{a.g(0,6);a.lava(7,30);a.p(8,10,1);a.p(13,15,2);a.p(18,20,3);a.p(23,25,2);a.p(28,29,1);a.g(31,36);a.sp(33,34);a.lava(37,47);a.p(38,40,1);a.p(43,45,2);a.g(48,55);
   a.c(9,1);a.c(14,2);a.c(19,3);a.c(24,2);a.c(28,1,2);a.c(33,2,2);a.c(39,1);a.c(44,2);a.c(50,0,3);a.S(2);a.G(53);}),
 build(60,a=>{a.g(0,6);a.lava(7,19);a.mh(7,0,8,260);a.g(20,25);a.lava(26,43);a.mh(26,0,5,220);a.mh(35,1,5,240);a.g(44,59);a.sp(50,51);
   a.c(10,1,3);a.c(15,1,2);a.c(22,0,2);a.c(29,1,2);a.c(38,2,2);a.c(46,0,3);a.c(50,2,2);a.S(2);a.G(57);}),
 build(60,a=>{a.g(0,14);a.e(9,0,3);a.lava(15,17);a.g(18,30);a.e(22,0,2);a.sp(26,26);a.lava(31,33);a.g(34,38,1);a.e(36,1,1.5);a.lava(39,41);a.g(42,59);a.e(47,0,3);a.sp(51,52);a.e(55,0,1);
   a.c(9,2,2);a.c(16,2);a.c(22,2);a.c(26,2);a.c(36,3);a.c(47,2,2);a.c(51,2,2);a.S(2);a.G(58);}),
 build(58,a=>{a.g(0,8);a.j(7);a.g(10,15,5);a.g(16,22);a.sp(18,18);a.j(22);a.g(25,29,5);a.lava(30,36);a.p(32,34,3);a.g(37,41,1);a.j(41,1);a.g(44,57,6);
   a.c(7,4);a.c(7,6);a.c(12,5,2);a.c(22,4);a.c(22,6);a.c(26,5,3);a.c(33,3);a.c(41,5);a.c(41,7);a.c(48,6,4);a.S(2);a.G(55,6);}),
 build(56,a=>{a.g(0,6);a.lava(7,11);a.mv(8,0,5,260);a.g(12,17,5);a.sp(14,15,5);a.lava(18,25);a.mv(21,1,4,220);a.g(26,30);a.sp(28,28);a.lava(31,35);a.mv(32,0,6,280);a.g(36,42,6);a.lava(43,45);a.g(46,55,4);
   a.c(9,3);a.c(9,5);a.c(14,7,2);a.c(22,4);a.c(28,2);a.c(33,4);a.c(33,6);a.c(38,6,3);a.c(49,4,3);a.S(2);a.G(53,4);}),
 build(66,a=>{a.g(0,8);a.e(5,0,2);a.lava(9,20);a.mh(9,0,7,240);a.g(21,27);a.e(24,0,2);a.lava(28,45);a.p(31,33,2);a.p(36,38,3);a.mv(41,1,4,220);a.g(46,52,5);a.e(49,5,2);a.lava(53,55);a.g(56,65,2);a.sp(60,60,2);
   a.c(5,2);a.c(12,1,3);a.c(24,2);a.c(32,2);a.c(37,3);a.c(42,3);a.c(42,5);a.c(49,7);a.c(58,2,2);a.S(1);a.G(64,2);}),
 build(62,a=>{a.g(0,5);a.lava(6,50);a.p(8,8,1);a.p(11,11,2);a.p(14,14,3);a.p(18,18,3);a.p(22,22,2);a.p(26,27,2);a.p(31,31,3);a.p(35,35,3);a.p(39,40,1);a.j(40,1);a.p(43,45,6);a.p(48,48,5);a.g(51,61,3);a.sp(55,55,3);
   a.c(8,1);a.c(11,2);a.c(14,3);a.c(18,3);a.c(22,2);a.c(26,2,2);a.c(31,3);a.c(35,3);a.c(40,5);a.c(44,6);a.c(48,5);a.c(55,5);a.S(2);a.G(59,3);}),
 build(90,a=>{a.g(0,7);a.sp(5,5);a.lava(8,10);a.g(11,16,1);a.e(13,1,1.5);a.lava(17,30);a.mh(20,1,6,220);a.g(31,36,1);a.sp(33,34,1);a.j(36,1);a.g(39,43,6);a.e(41,6,1.5);a.lava(44,62);
   a.p(47,47,5);a.p(51,51,4);a.p(55,55,3);a.mv(58,0,5,240);a.g(63,68,5);a.sp(65,66,5);a.lava(69,81);a.mh(72,4,5,200);a.g(82,89,3);
   a.c(5,2);a.c(13,3);a.c(23,2,3);a.c(33,3,2);a.c(36,5);a.c(36,7);a.c(41,8);a.c(47,5);a.c(51,4);a.c(55,3);a.c(59,3);a.c(59,5);a.c(65,7,2);a.c(75,5,3);a.c(84,3,3);a.S(2);a.G(87,3);})
];
const tri=(t,per)=>{const k=(t%per)/per;return k<.5?k*2:2-k*2;};
function moverAt(mv,t){const k=tri(t,mv.per);return {x:mv.x+mv.dx*k,y:mv.y+mv.dy*k};}
function enemyAt(e,t){return {x:e.x+(tri(t,e.per)*2-1)*e.r,y:e.y};}
function tileAt(L,x,y){const c=Math.floor(x/T),r=Math.floor(y/T);if(c<0||c>=L.w)return "#";if(r<0||r>=ROWS)return ".";return L.m[r][c];}
const solid=ch=>ch==="#"||ch==="J";
function spawn(L){return {x:L.start[0]*T+(T-PW)/2,y:(11-L.start[1])*T-PH,vx:0,vy:0,ground:false,ride:-1,t:0,coy:0,buf:0,jh:false,dead:false,win:false,pad:false,landed:false,jumped:false};}
/* one frame. inp = {l,r,j} */
function step(s,inp,L){
  if(s.dead||s.win)return s;
  s.pad=false;s.landed=false;s.jumped=false;
  if(s.ride>=0){const a=moverAt(L.movers[s.ride],s.t),b=moverAt(L.movers[s.ride],s.t+1);s.x+=b.x-a.x;s.y+=b.y-a.y;}
  s.t++;
  const want=(inp.r?1:0)-(inp.l?1:0),acc=s.ground?0.9:0.6;
  if(want)s.vx+=Math.sign(want*SPEED-s.vx)*Math.min(acc,Math.abs(want*SPEED-s.vx));
  else s.vx-=Math.sign(s.vx)*Math.min(s.ground?0.8:0.25,Math.abs(s.vx));
  if(inp.j&&!s.jh)s.buf=7;s.jh=!!inp.j;
  if(s.buf>0)s.buf--;if(s.ground)s.coy=6;else if(s.coy>0)s.coy--;
  if(s.buf>0&&s.coy>0){s.vy=JUMP;s.buf=0;s.coy=0;s.ground=false;s.ride=-1;s.jumped=true;}
  if(!inp.j&&s.vy<-5&&!s.padAir)s.vy=-5;
  s.vy=Math.min(15,s.vy+GRAV);
  // sideways
  s.x+=s.vx;
  if(s.x<0){s.x=0;s.vx=0;}if(s.x>L.w*T-PW){s.x=L.w*T-PW;s.vx=0;}
  for(const yy of [s.y+1,s.y+PH/2,s.y+PH-1]){
    if(s.vx>0&&solid(tileAt(L,s.x+PW,yy))){s.x=Math.floor((s.x+PW)/T)*T-PW-0.01;s.vx=0;}
    else if(s.vx<0&&solid(tileAt(L,s.x,yy))){s.x=(Math.floor(s.x/T)+1)*T;s.vx=0;}
  }
  // up / down
  const prevBottom=s.y+PH;s.y+=s.vy;const wasGround=s.ground;s.ground=false;let ride=-1;
  if(s.vy>=0){
    for(const xx of [s.x+1,s.x+PW/2,s.x+PW-1]){const ch=tileAt(L,xx,s.y+PH);
      if(solid(ch)){s.y=Math.floor((s.y+PH)/T)*T-PH;s.ground=true;if(ch==="J"&&Math.abs(xx-(s.x+PW/2))<1||tileAt(L,s.x+PW/2,s.y+PH+1)==="J")s.pad=true;break;}}
    if(!s.ground)for(let i=0;i<L.movers.length;i++){const mv=L.movers[i],a=moverAt(mv,s.t),b=moverAt(mv,s.t-1);
      if(s.x+PW>a.x+2&&s.x<a.x+mv.w-2&&prevBottom<=Math.max(a.y,b.y)+6&&s.y+PH>=Math.min(a.y,b.y)-(s.ride===i?8:0)&&s.y+PH>=a.y-(s.ride===i?8:0)){s.y=a.y-PH;s.ground=true;ride=i;break;}}
    if(s.ground){if(!wasGround)s.landed=true;s.vy=0;s.padAir=false;}
  }else{
    for(const xx of [s.x+1,s.x+PW/2,s.x+PW-1])if(solid(tileAt(L,xx,s.y))){s.y=(Math.floor(s.y/T)+1)*T;s.vy=0;break;}
  }
  s.ride=ride;
  if(s.pad){s.vy=PADV;s.ground=false;s.ride=-1;s.padAir=true;s.coy=0;}
  // danger
  for(const [xx,yy] of [[s.x+5,s.y+PH-3],[s.x+PW-5,s.y+PH-3],[s.x+PW/2,s.y+PH-3],[s.x+5,s.y+8],[s.x+PW-5,s.y+8]]){
    const ch=tileAt(L,xx,yy);
    if(ch==="L")s.dead=true;
    if(ch==="^"){const lx=xx-Math.floor(xx/T)*T,ly=yy-Math.floor(yy/T)*T;if(ly>12&&lx>6&&lx<T-6)s.dead=true;}
  }
  for(const e of L.enemies){const p=enemyAt(e,s.t);if(s.x+PW>p.x+5&&s.x<p.x+27&&s.y+PH>p.y+6&&s.y<p.y+32)s.dead=true;}
  if(s.y>ROWS*T+60)s.dead=true;
  const gx=L.goal[0]*T,gy=(10-L.goal[1])*T;
  if(s.x+PW>gx+4&&s.x<gx+T-4&&s.y+PH>gy-T&&s.y<gy+T)s.win=true;
  return s;
}
if(typeof module!=="undefined")module.exports={LEVELS,step,spawn,T,ROWS,PW,PH,moverAt,enemyAt,tileAt};
