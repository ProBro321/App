"use strict";
const $=id=>document.getElementById(id),KEY="learn_phone_v1";
let P={lang:0,done:{}};try{const s=JSON.parse(localStorage.getItem(KEY));if(s)P=Object.assign(P,s);}catch(e){}
const store=()=>{try{localStorage.setItem(KEY,JSON.stringify(P));}catch(e){}};
const tr=a=>Array.isArray(a)?a[P.lang]??a[0]:a;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

/* ---------- icons (plain generic drawings) ---------- */
const S=(d,o="")=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${o}>${d}</svg>`;
const IC={
  phone:S('<path d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.700a2 2 0 0 1 2-2.200z" fill="currentColor" stroke="none"/>'),
  chat:S('<path d="M4 5.500h16v10.500H10.500L6 19.500V16H4z" fill="currentColor"/>'),
  web:S('<circle cx="12" cy="12" r="8.500"/><path d="M3.500 12h17M12 3.500c3 3 3 14 0 17M12 3.500c-3 3-3 14 0 17"/>'),
  camera:S('<path d="M4 8h3.500l1.500-2.500h6L16.500 8H20v11H4z"/><circle cx="12" cy="13.200" r="3.300"/>'),
  mail:S('<rect x="3.500" y="5.500" width="17" height="13" rx="2"/><path d="M4 7l8 6 8-6"/>'),
  video:S('<rect x="3" y="5" width="18" height="12" rx="2.500"/><path d="M10.500 8.500v5l4.200-2.500z" fill="currentColor"/><path d="M8 20.500h8"/>'),
  gallery:S('<rect x="3.500" y="4.500" width="17" height="15" rx="2.500"/><circle cx="9" cy="10" r="1.600" fill="currentColor"/><path d="M4 17l5-4.500 3.500 3 3-2.500 5 4"/>'),
  settings:S('<circle cx="12" cy="12" r="3"/><path d="M12 3v2.500M12 18.500V21M3 12h2.500M18.500 12H21M5.600 5.600l1.800 1.800M16.600 16.600l1.800 1.800M5.600 18.400l1.800-1.800M16.600 7.400l1.800-1.800"/>'),
  calc:S('<rect x="5" y="3.500" width="14" height="17" rx="2.500"/><path d="M8 7.500h8M8.500 12h.01M12 12h.01M15.500 12h.01M8.500 16h.01M12 16h.01M15.500 16h.01" stroke-width="2.600"/>'),
  clock:S('<circle cx="12" cy="12" r="8.500"/><path d="M12 7v5l3.500 2"/>'),
  cal:S('<rect x="4" y="5.500" width="16" height="14.500" rx="2.500"/><path d="M4 10h16M8.500 3.500v4M15.500 3.500v4"/>'),
  notes:S('<path d="M6 3.500h9l3.500 3.500v13.500H6z"/><path d="M9 11h6M9 15h6"/>'),
  store:S('<path d="M5 8h14l-1 12H6z"/><path d="M9 8V6.500a3 3 0 0 1 6 0V8"/>'),
  wifi:S('<path d="M3 9.500a13 13 0 0 1 18 0M6 13a8.500 8.500 0 0 1 12 0M9 16.500a4.200 4.200 0 0 1 6 0"/><circle cx="12" cy="19.500" r="1" fill="currentColor"/>'),
  bt:S('<path d="M7 7.500l10 9-5 4.500V3l5 4.500-10 9"/>'),
  torch:S('<path d="M8 3.500h8v4l-2 3v10h-4v-10l-2-3z"/><path d="M12 13v2"/>'),
  data:S('<path d="M8 20V6M4.500 9.500L8 6l3.500 3.500M16 4v14M12.500 14.500L16 18l3.500-3.500"/>'),
  plane:S('<path d="M12 3c1 0 1.500 1 1.500 2.500V9l7 4.500v2l-7-2v4l2 1.500V20.500L12 19.500l-3.500 1V19l2-1.500v-4l-7 2v-2l7-4.500V5.500C10.500 4 11 3 12 3z" fill="currentColor" stroke="none"/>'),
  silent:S('<path d="M6 9.500a6 6 0 0 1 12 0c0 4.500 1.800 6.300 2.500 7h-17c.7-.7 2.500-2.500 2.500-7z"/><path d="M4 4l16 16"/>'),
  signal:S('<path d="M5 19v-3M10 19v-7M15 19V8M20 19V4" stroke-width="2.600"/>'),
  battery:S('<rect x="3" y="8" width="16" height="9" rx="2"/><path d="M21 11v3"/><rect x="5" y="10" width="9" height="5" fill="currentColor" stroke="none"/>'),
  home:S('<circle cx="12" cy="12" r="7.500"/>'),back:S('<path d="M16 5l-9 7 9 7z"/>'),recents:S('<rect x="5.500" y="5.500" width="13" height="13" rx="2.500"/>'),
  speaker:S('<path d="M4 9.500h4l5-4v13l-5-4H4z" fill="currentColor"/><path d="M16.500 9a4.500 4.500 0 0 1 0 6M19 6.500a8 8 0 0 1 0 11"/>'),
  mute:S('<rect x="9" y="3.500" width="6" height="11" rx="3"/><path d="M5.500 11.500a6.500 6.500 0 0 0 13 0M12 18v3"/>'),
  mic:S('<rect x="9" y="3.500" width="6" height="11" rx="3" fill="currentColor"/><path d="M5.500 11.500a6.500 6.500 0 0 0 13 0M12 18v3"/>'),
  send:S('<path d="M4 12l16-7-6 15-2.500-6z" fill="currentColor"/>'),
  bin:S('<path d="M5 7h14M9.500 7V4.500h5V7M7 7l1 13h8l1-13"/>'),
  search:S('<circle cx="11" cy="11" r="6.500"/><path d="M20 20l-4.200-4.200"/>'),
  flip:S('<path d="M4.500 12a7.500 7.500 0 0 1 13-5l2 2M19.500 12a7.500 7.500 0 0 1-13 5l-2-2"/><path d="M19.500 4.500V9H15M4.500 19.500V15H9"/>'),
  play:S('<path d="M8 5v14l11-7z" fill="currentColor"/>'),pause:S('<path d="M8 5v14M16 5v14" stroke-width="3.500"/>')
};
const COL={phone:"#22b45a",chat:"#1fa855",web:"#2f7df6",camera:"#444a5a",mail:"#e8eefc",video:"#b3261e",gallery:"#f08a24",settings:"#6b7280",calc:"#0f766e",clock:"#3b3f52",cal:"#2563eb",notes:"#eab308",store:"#7c3aed"};
const PAGES=[["mail","video","gallery","settings"],["calc","clock","cal","notes","store"]],DOCK=["phone","chat","web","camera"];

/* ---------- the practice phone ---------- */
let sim;
function fresh(){return {page:0,app:null,view:null,shade:false,wifi:true,bt:false,btDev:false,torch:false,data:true,plane:false,silent:false,bright:100,menu:null,locked:false,off:false,boot:false,pmenu:false,
  vol:6,volShow:false,call:null,dial:"",typed:"",kb:false,chatOpen:false,msgs:[],rec:false,mail:null,mailGone:false,yt:{v:"home",play:false,ad:false},cam:{front:false,shots:0,flash:0},gal:null,popup:false,recents:false,opened:[]};}
const appIcon=(id,ev=true)=>`<div class="app"${ev?` data-ev="app:${id}"`:""}><div class="ic" style="background:${COL[id]};color:${id==="mail"?"#d93025":"#fff"}">${IC[id]}</div>${esc(tr(NAMES[id]))}</div>`;
function statusBar(dark){return `<div class="sb" style="${dark?"color:#222":""}"><span data-ev="st:time">12:30</span><span class="r"><span data-ev="st:signal">${IC.signal}</span>${sim.bt?`<span>${IC.bt}</span>`:""}${sim.wifi?`<span data-ev="st:wifi">${IC.wifi}</span>`:""}<span data-ev="st:battery">${IC.battery}</span></span></div>`;}
function navBar(){return `<div class="nav"><div data-ev="nav:recents">${IC.recents}</div><div data-ev="nav:home">${IC.home}</div><div data-ev="nav:back">${IC.back}</div></div>`;}
const KB=[["йцукенгшщзх","фывапролджэ","ячсмитьбю"],["qwertyuiop","asdfghjkl","zxcvbnm"]];
function keyboard(){return `<div class="kb" data-ev="kbd">${KB[P.lang].map(r=>`<div class="kr">${[...r].map(k=>`<div class="k" data-ev="kb:${k}">${k}</div>`).join("")}</div>`).join("")}<div class="kr"><div class="k g" data-ev="kb:del">⌫</div><div class="k w" data-ev="kb:space"></div><div class="k g" data-ev="kb:.">.</div></div></div>`;}
const CONTACTS=[[["Сын","Son"],"#2f7df6"],[["Анна","Anna"],"#e5412f"],[["Врач","Doctor"],"#0f766e"],[["Сосед Борис","Neighbour Boris"],"#f08a24"]];
const MAILS=[{f:["Поликлиника","Clinic"],s:["Запись к врачу","Your appointment"],b:["Здравствуйте! Напоминаем: вы записаны к врачу в четверг в 10:00. Возьмите с собой документы.","Hello! A reminder: your doctor's appointment is on Thursday at 10:00. Please bring your documents."]},
  {f:["ПРИЗ!!!","PRIZE!!!"],s:["Вы выиграли 1 000 000","You won 1,000,000"],b:["Поздравляем! Вы выиграли. Срочно нажмите на ссылку и введите номер карты:","Congratulations! You won. Quickly touch the link and enter your card number:"],scam:true},
  {f:["Внучка Маша","Granddaughter Masha"],s:["Фото с моря","Photos from the sea"],b:["Привет! Посылаю фотографии с отдыха. Целую!","Hi! Sending photos from the holiday. Kisses!"]}];
const QS=[["русские песни","old songs"],["новости сегодня","news today"],["как сварить борщ","how to make soup"]];
const VIDS=[["🎸","Лучшие песни — концерт","Best songs — live concert"],["🎻","Песни нашей молодости","Songs of our youth"],["🎤","Золотые хиты","Golden hits"]];
const PHOTOS=["🌳","🐈","🌇","🎂","👨‍👩‍👧","🌊"];
function appWindow(){
  const a=sim.app,title=t=>`<div class="bar2">${t}</div>`;
  if(a==="phone"){
    if(sim.call){const c=sim.call,inc=c.state==="in";
      return `<div class="callscr"><div><div class="who">${esc(tr(c.name))}</div><div class="st">${tr(inc?["Входящий звонок…","Incoming call…"]:c.state==="out"?["Вызов…","Calling…"]:["Разговор 00:07","On call 00:07"])}</div></div>
        <div style="font-size:4em">${inc?"📲":"🙂"}</div>
        <div class="btns">${inc?`<div class="cbtn" data-ev="call:end"><i class="red">${IC.phone}</i>${tr(["Отклонить","Decline"])}</div><div class="cbtn" data-ev="call:answer"><i class="green ring">${IC.phone}</i>${tr(["Ответить","Answer"])}</div>`
          :`<div class="cbtn${c.speaker?" on":""}" data-ev="call:speaker"><i>${IC.speaker}</i>${tr(["Динамик","Speaker"])}</div><div class="cbtn" data-ev="call:end"><i class="red">${IC.phone}</i>${tr(["Завершить","End"])}</div><div class="cbtn" data-ev="call:mute"><i>${IC.mute}</i>${tr(["Без звука","Mute"])}</div>`}</div></div>`;}
    const tabs=`<div class="tabs"><div class="${sim.view!=="contacts"?"on":""}" data-ev="ph:keys">${tr(["Клавиши","Keypad"])}</div><div class="${sim.view==="contacts"?"on":""}" data-ev="ph:contacts">${tr(["Контакты","Contacts"])}</div></div>`;
    if(sim.view==="contacts")return `<div class="win">${title(tr(["Контакты","Contacts"]))}<div class="body">${CONTACTS.map((c,i)=>`<div class="row" data-ev="contact:${i}"><div class="av" style="background:${c[1]}">${esc(tr(c[0])[0])}</div><div class="tx"><b>${esc(tr(c[0]))}</b><small>05${i}-123-45-6${i}</small></div></div>`).join("")}</div>${tabs}</div>`;
    return `<div class="win"><div class="body" style="justify-content:flex-end"><div class="dial">${esc(sim.dial)||"&nbsp;"}</div><div class="keys" data-ev="keys">${"123456789*0#".split("").map(k=>`<div data-ev="key:${k}">${k}</div>`).join("")}</div><div class="round green" data-ev="call:start">${IC.phone}</div></div>${tabs}</div>`;
  }
  if(a==="chat"){
    if(!sim.chatOpen)return `<div class="win">${title(tr(NAMES.chat))}<div class="body">${[["son",["Сын","Son"],["Пап, как дела?","Dad, how are you?"],"#2f7df6"],["anna",["Анна","Anna"],["Спасибо!","Thank you!"],"#e5412f"],["x",["+7 900 000-00-00","+1 900 000 0000"],["Вы выиграли приз! Нажмите…","You won a prize! Touch…"],"#888"]]
      .map(c=>`<div class="row" data-ev="chat:${c[0]}"><div class="av" style="background:${c[3]}">${esc(tr(c[1])[0])}</div><div class="tx"><b>${esc(tr(c[1]))}</b><small>${esc(tr(c[2]))}</small></div></div>`).join("")}</div></div>`;
    return `<div class="win"><div class="bar2" style="background:#128c5e;color:#fff">${esc(tr(["Сын","Son"]))}</div><div class="chat"><div class="bub">${tr(["Пап, как дела?","Dad, how are you?"])}</div>${sim.msgs.map(m=>`<div class="bub ${m.me?"me":""}">${m.voice?"🎤 ▶ ▁▃▅▂▆▃▁ 0:04":esc(m.t)}${m.me?"<small>✓✓</small>":""}</div>`).join("")}</div>
      <div class="inp"><div class="fld${sim.typed?" has":""}" data-ev="msg:field">${sim.typed?esc(sim.typed)+(sim.kb?"|":""):sim.rec?tr(["● Идёт запись…","● Recording…"]):tr(["Сообщение","Message"])}</div>${sim.typed?`<div class="rb" data-ev="msg:send">${IC.send}</div>`:`<div class="rb${sim.rec?" rec":""}" data-ev="msg:mic">${IC.mic}</div>`}</div>${sim.kb?keyboard():""}</div>`;
  }
  if(a==="mail"){
    if(sim.mail!=null){const m=MAILS[sim.mail];return `<div class="win"><div class="bar2" style="justify-content:space-between"><span>${esc(tr(m.s))}</span><span data-ev="mail:del" style="color:#b3261e;padding:.2em;border-radius:.6em">${IC.bin.replace("<svg",'<svg style="width:1.5em;height:1.5em"')}</span></div>
      <div class="body"><div class="row"><div class="av" style="background:${m.scam?"#888":"#0f766e"}">${esc(tr(m.f)[0])}</div><div class="tx"><b>${esc(tr(m.f))}</b><small>${m.scam?"win-prize-777@xmail.biz":"info@clinic.example"}</small></div></div>
      ${m.scam?`<div class="warn">⚠ ${tr(["Это обман","This is a scam"])}</div>`:""}<div class="mailbody">${esc(tr(m.b))}${m.scam?`<br><br><u style="color:#2f7df6" data-ev="mail:link">http://free-prize.example/win</u>`:""}</div></div></div>`;}
    return `<div class="win">${title(tr(["Входящие","Inbox"]))}<div class="body">${MAILS.map((m,i)=>m.scam&&sim.mailGone?"":`<div class="row mailrow ${i<2?"unread":""}" data-ev="mail:${i}"><div class="av" style="background:${m.scam?"#888":i?"#7c3aed":"#0f766e"}">${esc(tr(m.f)[0])}</div><div class="tx"><b>${esc(tr(m.f))}</b><small>${esc(tr(m.s))}</small></div></div>`).join("")}</div></div>`;
  }
  if(a==="video"){const y=sim.yt,top=`<div class="bar2"><span style="color:#ff5a4d">${IC.video.replace("<svg",'<svg style="width:1.5em;height:1.5em"')}</span><div class="yts" data-ev="yt:search">${IC.search.replace("<svg",'<svg style="width:1.1em;height:1.1em"')}${tr(["Поиск","Search"])}</div></div>`;
    if(y.v==="search")return `<div class="win yt">${top}<div class="body" style="padding:.6em">${QS.map((q,i)=>`<div><span class="chip" data-ev="yt:q:${i}">🔍 ${esc(tr(q))}</span></div>`).join("")}</div>${keyboard()}</div>`;
    if(y.v==="player")return `<div class="win yt"><div class="player ${y.play&&!y.ad?"play":""}" style="background:linear-gradient(135deg,#3b1d5e,#b3261e)" data-ev="yt:toggle"><div class="scene">${VIDS[y.i||0][0]}</div>${!y.play&&!y.ad?`<div class="pp">${IC.play}</div>`:""}
      ${y.ad?`<div class="ad" data-ev="yt:ad"><div>🛒<br>${tr(["РЕКЛАМА<br>Купите сейчас!","ADVERT<br>Buy now!"])}</div><div class="skip" data-ev="yt:skip">${tr(["Пропустить ▶|","Skip ▶|"])}</div></div>`:""}</div>
      <div class="body" style="padding:.8em;font-weight:700">${esc(tr(VIDS[y.i||0].slice(1)))}<div style="font-weight:400;opacity:.7;font-size:.82em;margin-top:.4em">${tr(["1,2 млн просмотров","1.2M views"])}</div></div></div>`;
    return `<div class="win yt">${top}<div class="body">${(y.v==="results"?VIDS:VIDS.slice().reverse()).map((v,i)=>`<div class="vid" ${y.v==="results"?`data-ev="yt:v:${i}"`:""}><div class="th" style="background:linear-gradient(135deg,#3b1d5e,#b3261e)">${v[0]}</div><div class="mt">${esc(tr(v.slice(1)))}</div></div>`).join("")}</div></div>`;
  }
  if(a==="camera"){const c=sim.cam;return `<div class="cam ${c.front?"front":""}">${c.flash?`<div class="flash"></div>`:""}<div class="sc">${c.front?"🧓":"🌳🏠"}</div><div class="ctl"><div class="sm" data-ev="cam:gallery">${c.shots?(c.lastFront?"🧓":"🌳"):IC.gallery}</div><div class="shut" data-ev="cam:shot"></div><div class="sm" data-ev="cam:flip">${IC.flip}</div></div></div>`;}
  if(a==="gallery"){const ph=[...(sim.cam.shots?["🧓","🌳"].slice(0,Math.min(2,sim.cam.shots)):[]),...PHOTOS];
    return sim.gal!=null?`<div class="win"><div class="big">${ph[sim.gal]}</div></div>`:`<div class="win">${title(tr(NAMES.gallery))}<div class="body"><div class="gal">${ph.map((p,i)=>`<div data-ev="gal:${i}">${p}</div>`).join("")}</div></div></div>`;}
  if(a==="settings"){
    if(sim.view==="bt")return `<div class="win">${title("Bluetooth")}<div class="body"><div class="row" data-ev="set:bttoggle"><div class="tx"><b>Bluetooth</b><small>${tr(sim.bt?["Включён","On"]:["Выключен","Off"])}</small></div><div class="sw ${sim.bt?"on":""}"></div></div>
      ${sim.bt?`<div class="row" style="color:#777;font-size:.8em">${tr(["УСТРОЙСТВА РЯДОМ","DEVICES NEARBY"])}</div><div class="row" data-ev="bt:dev"><div class="av" style="background:#2f7df6">🎧</div><div class="tx"><b>${tr(["Наушники","Headphones"])}</b><small style="color:${sim.btDev?"#1f9d5b":"#777"}">${tr(sim.btDev?["Подключено ✓","Connected ✓"]:["Нажмите, чтобы подключить","Touch to connect"])}</small></div></div>`:""}</div></div>`;
    return `<div class="win">${title(tr(NAMES.settings))}<div class="body">${[["wifi","Wi-Fi",sim.wifi?["Дом","Home"]:["Выключен","Off"]],["bt","Bluetooth",sim.bt?["Включён","On"]:["Выключен","Off"]],["snd",["Звук","Sound"],["Громкость, мелодия","Volume, ringtone"]],["disp",["Экран","Display"],["Яркость, размер букв","Brightness, text size"]],["bat",["Батарея","Battery"],"68%"]]
      .map(r=>`<div class="row" data-ev="set:${r[0]}"><div class="tx"><b>${esc(tr(r[1]))}</b><small>${esc(tr(r[2]))}</small></div><span style="color:#bbb">›</span></div>`).join("")}</div></div>`;
  }
  if(a==="web"){
    if(sim.view==="search")return `<div class="win"><div class="bar2"><div class="yts" style="background:#f0f1f5;color:#111">${IC.search.replace("<svg",'<svg style="width:1.1em;height:1.1em"')}|</div></div><div class="body" style="padding:.6em"><div><span class="chip" data-ev="web:q">🔍 ${tr(["погода на завтра","weather tomorrow"])}</span></div><div><span class="chip">🔍 ${tr(["новости","news"])}</span></div></div>${keyboard()}</div>`;
    if(sim.view==="result")return `<div class="win"><div class="bar2"><div class="yts" style="background:#f0f1f5;color:#111">${tr(["погода на завтра","weather tomorrow"])}</div></div><div class="body" style="align-items:center;justify-content:center;gap:.3em"><div style="font-size:4em">⛅</div><b style="font-size:2em">+24°</b><span style="color:#777">${tr(["Завтра, без дождя","Tomorrow, no rain"])}</span></div></div>`;
    return `<div class="win"><div class="body" style="align-items:center;justify-content:center;gap:1em;padding:1em"><b style="font-size:1.6em;color:#2f7df6">${tr(["Поиск","Search"])}</b><div class="yts" style="background:#f0f1f5;color:#777;flex:none;width:100%" data-ev="web:search">${IC.search.replace("<svg",'<svg style="width:1.1em;height:1.1em"')}${tr(["Что найти?","What are you looking for?"])}</div></div></div>`;
  }
  return `<div class="win"><div class="body" style="align-items:center;justify-content:center;gap:.6em;color:#555;padding:1em;text-align:center"><div class="app"><div class="ic" style="background:${COL[a]};color:#fff">${IC[a]}</div></div><b>${esc(tr(NAMES[a]))}</b></div></div>`;
}
function render(){
  const el=$("sim");$("frame").classList.toggle("torch",sim.torch);
  if(sim.off||sim.boot){el.innerHTML=`<div class="off">${sim.boot?`<div style="font-size:1.2em;font-weight:700" class="ring">⟳ ${tr(["Перезагрузка…","Restarting…"])}</div>`:""}</div>`;mark();return;}
  let body;
  if(sim.locked)body=`<div class="lock"><div><div class="clk">12:30</div><div>${tr(["Пятница, 2 октября","Friday, 2 October"])}</div></div><div>🔒<br>${tr(["Проведите вверх","Swipe up"])}</div></div>`;
  else if(sim.recents)body=`<div style="flex:1;display:flex;gap:.8em;align-items:center;justify-content:center;background:rgba(0,0,0,.35);padding:1em">${sim.opened.length?sim.opened.slice(-2).map(a=>`<div style="background:#fff;color:#111;border-radius:1.2em;width:44%;height:60%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.4em;font-size:.9em">${appIcon(a,false)}</div>`).join(""):`<b>${tr(["Нет открытых приложений","No open apps"])}</b>`}</div>`;
  else if(sim.app)body=appWindow();
  else body=`<div class="grid">${PAGES[sim.page].map(a=>appIcon(a)).join("")}</div><div class="pgdots"><i class="${sim.page?"":"on"}"></i><i class="${sim.page?"on":""}"></i></div><div class="dock">${DOCK.map(a=>appIcon(a)).join("")}</div>`;
  const darkBar=sim.app&&!sim.locked&&!sim.recents&&!sim.shade&&!(sim.app==="phone"&&sim.call)&&sim.app!=="camera"&&sim.app!=="video";
  let ov="";
  if(sim.shade){const q=(id,name,on,sub)=>`<div class="q ${on?"on":""}" data-ev="qs:${id}">${IC[id]}<div>${name}${sub?`<small>${sub}</small>`:""}</div></div>`;
    ov+=`<div class="ovl shade"><div class="qs">${q("wifi","Wi-Fi",sim.wifi,tr(sim.wifi?["Дом","Home"]:["Выключен","Off"]))}${q("bt","Bluetooth",sim.bt,tr(sim.btDev?["Наушники","Headphones"]:sim.bt?["Включён","On"]:["Выключен","Off"]))}
      ${q("data",tr(["Моб. интернет","Mobile data"]),sim.data)}${q("torch",tr(["Фонарик","Flashlight"]),sim.torch)}${q("plane",tr(["Режим полёта","Airplane mode"]),sim.plane)}${q("silent",tr(["Без звука","Silent"]),sim.silent)}</div>
      <div class="slider" data-ev="bright" data-drag="bright"><i style="width:${sim.bright}%"></i><span>☀</span></div><div class="note">💬 <b>${tr(["Сын","Son"])}</b>: ${tr(["Пап, как дела?","Dad, how are you?"])}</div></div>`;}
  if(sim.menu)ov+=`<div class="ovl amenu" data-ev="menu:close"><div class="m"><div style="display:flex;gap:.6em;align-items:center"><b>${esc(tr(NAMES[sim.menu]))}</b></div><div>ⓘ ${tr(["О приложении","App info"])}</div><div>🗑 ${tr(["Удалить","Uninstall"])}</div></div></div>`;
  if(sim.popup)ov+=`<div class="ovl popup"><div class="p"><div class="x" data-ev="popup:x">✕</div><div style="font-size:2.4em">⚠️</div><b>${tr(["ВНИМАНИЕ! В телефоне 5 вирусов!","WARNING! 5 viruses on your phone!"])}</b><div style="margin-top:.4em">${tr(["Срочно нажмите, чтобы очистить","Press now to clean it"])}</div><div class="okb" data-ev="popup:ok">${tr(["ОЧИСТИТЬ СЕЙЧАС","CLEAN NOW"])}</div></div></div>`;
  if(sim.pmenu)ov+=`<div class="ovl pmenu"><div data-ev="pw:off">⏻ ${tr(["Выключить","Power off"])}</div><div data-ev="pw:restart">⟳ ${tr(["Перезагрузить","Restart"])}</div></div>`;
  if(sim.volShow)ov+=`<div class="vol"><i style="height:${sim.vol*10}%"></i><span>🔊</span></div>`;
  el.style.filter=`brightness(${.6+sim.bright/100*.4})`;
  el.innerHTML=statusBar(darkBar).replace('class="sb"',`class="sb"${darkBar?' data-dark':''}`)+`<div class="scr" style="${darkBar?"margin-top:-2.2em;padding-top:2.2em;background:#fff":""}">${body}${ov}</div>`+(sim.locked?"":navBar());
  mark();
}
/* what each action does on the practice phone */
let volT,replyT;
function handle(ev){
  const [g,...rest]=ev.split(":"),id=rest.join(":");
  if(ev==="tap:hw:power"){if(sim.off){sim.off=false;sim.locked=true;}else if(sim.pmenu)sim.pmenu=false;else{sim.off=true;sim.shade=false;}return;}
  if(ev==="long:hw:power"){sim.off=false;sim.pmenu=true;return;}
  if(id==="hw:volup"||id==="hw:voldown"){if(g!=="tap"&&g!=="long")return;sim.vol=Math.max(0,Math.min(10,sim.vol+(id==="hw:volup"?1:-1)));sim.volShow=true;clearTimeout(volT);volT=setTimeout(()=>{sim.volShow=false;render();},1800);return;}
  if(sim.off)return;
  if(g==="tap"&&id.startsWith("pw:")){sim.pmenu=false;if(id==="pw:restart"){sim.boot=true;setTimeout(()=>{sim.boot=false;Object.assign(sim,{app:null,shade:false,recents:false});render();},1800);}else sim.off=true;return;}
  if(g==="swipe"){
    if(sim.locked){if(id==="up")sim.locked=false;return;}
    if(id==="down:top"){sim.shade=true;return;}
    if(id==="up"&&sim.shade){sim.shade=false;return;}
    if(id==="up"&&sim.recents){sim.opened.pop();return;}
    if(!sim.app&&!sim.shade&&!sim.recents){if(id==="left")sim.page=1;if(id==="right")sim.page=0;}
    return;
  }
  if(g==="drag")return;
  if(g==="up"){if(id==="msg:mic"&&sim.rec){sim.rec=false;sim.msgs.push({me:1,voice:1});}return;}
  if(g==="long"){
    if(id.startsWith("app:"))sim.menu=id.slice(4);
    else if(id==="qs:bt"){sim.shade=false;sim.app="settings";sim.view="bt";open("settings");}
    else if(id==="qs:wifi"){sim.shade=false;sim.app="settings";sim.view=null;open("settings");}
    else if(id==="msg:mic"){sim.rec=true;sim.kb=false;}
    return;
  }
  // taps
  if(id==="menu:close"){sim.menu=null;return;}
  if(id==="popup:x"){sim.popup=false;return;}
  if(id.startsWith("nav:")){
    if(sim.popup&&id==="nav:back"){sim.popup=false;return;}
    sim.menu=null;sim.shade=false;
    if(id==="nav:home"){sim.app=null;sim.recents=false;sim.call=null;sim.kb=false;sim.page=0;resetApps();}
    else if(id==="nav:recents"){sim.recents=!sim.recents;sim.app=null;}
    else back();
    return;
  }
  if(id.startsWith("qs:")){const k=id.slice(3);sim[k]=!sim[k];if(k==="bt"&&!sim.bt)sim.btDev=false;if(k==="plane"&&sim.plane){sim.wifi=false;sim.bt=false;sim.btDev=false;}return;}
  if(id.startsWith("app:")){const a=id.slice(4);sim.app=a;sim.view=null;sim.recents=false;resetApps();open(a);return;}
  if(id.startsWith("key:")){if(sim.dial.length<12)sim.dial+=id.slice(4);return;}
  if(id==="call:start"){sim.call={name:sim.dial||"…",state:"talk"};return;}
  if(id==="call:answer"){sim.call.state="talk";return;}
  if(id==="call:speaker"){sim.call.speaker=!sim.call.speaker;return;}
  if(id==="call:end"){sim.call=null;sim.dial="";return;}
  if(id==="ph:contacts"){sim.view="contacts";return;}
  if(id==="ph:keys"){sim.view=null;return;}
  if(id.startsWith("contact:")){sim.call={name:CONTACTS[+id.slice(8)][0],state:"talk"};return;}
  if(id.startsWith("chat:")){sim.chatOpen=true;return;}
  if(id==="msg:field"){sim.kb=true;return;}
  if(id.startsWith("kb:")){const k=id.slice(3);if(sim.app!=="chat")return;sim.typed=k==="del"?sim.typed.slice(0,-1):sim.typed+(k==="space"?" ":k);return;}
  if(id==="msg:send"){sim.msgs.push({me:1,t:sim.typed});sim.typed="";sim.kb=false;clearTimeout(replyT);replyT=setTimeout(()=>{if(sim.app==="chat"){sim.msgs.push({t:tr(["Получил! 👍","Got it! 👍"])});render();}},1500);return;}
  if(id==="mail:del"){if(MAILS[sim.mail].scam)sim.mailGone=true;sim.mail=null;return;}
  if(id.startsWith("mail:")&&id!=="mail:link"){sim.mail=+id.slice(5);return;}
  if(id==="yt:search"){sim.yt.v="search";return;}
  if(id.startsWith("yt:q:")){sim.yt.v="results";return;}
  if(id.startsWith("yt:v:")){sim.yt={v:"player",i:+id.slice(5),ad:true,play:false};return;}
  if(id==="yt:skip"){sim.yt.ad=false;sim.yt.play=true;return;}
  if(id==="yt:toggle"){if(!sim.yt.ad)sim.yt.play=!sim.yt.play;return;}
  if(id==="cam:shot"){sim.cam.shots++;sim.cam.lastFront=sim.cam.front;sim.cam.flash=1;setTimeout(()=>{sim.cam.flash=0;},50);return;}
  if(id==="cam:flip"){sim.cam.front=!sim.cam.front;return;}
  if(id==="cam:gallery"){sim.app="gallery";sim.gal=null;open("gallery");return;}
  if(id.startsWith("gal:")){sim.gal=+id.slice(4);return;}
  if(id==="set:bt"){sim.view="bt";return;}
  if(id==="set:bttoggle"){sim.bt=!sim.bt;if(!sim.bt)sim.btDev=false;return;}
  if(id==="bt:dev"){sim.btDev=!sim.btDev;return;}
  if(id==="web:search"){sim.view="search";return;}
  if(id==="web:q"){sim.view="result";return;}
}
function open(a){sim.opened=sim.opened.filter(x=>x!==a);sim.opened.push(a);}
function resetApps(){sim.chatOpen=false;sim.kb=false;sim.typed="";sim.mail=null;sim.gal=null;sim.yt={v:"home",play:false,ad:false};sim.view=null;sim.rec=false;}
function back(){
  if(sim.recents){sim.recents=false;return;}
  const a=sim.app;if(!a)return;
  if(a==="phone"&&sim.call){sim.call=null;return;}
  if(a==="chat"&&sim.kb){sim.kb=false;return;}
  if(a==="chat"&&sim.chatOpen){sim.chatOpen=false;sim.typed="";return;}
  if(a==="mail"&&sim.mail!=null){sim.mail=null;return;}
  if(a==="gallery"&&sim.gal!=null){sim.gal=null;return;}
  if(a==="video"&&sim.yt.v!=="home"){sim.yt.v=sim.yt.v==="player"?"results":"home";sim.yt.play=false;sim.yt.ad=false;return;}
  if((a==="settings"||a==="phone"||a==="web")&&sim.view){sim.view=a==="web"&&sim.view==="result"?"search":null;return;}
  sim.app=null;
}

/* ---------- gestures: tap, hold, swipe, drag ---------- */
let G=null;
const frame=$("frame");
frame.addEventListener("pointerdown",e=>{
  if(G)return;const tEl=e.target.closest("[data-ev]"),r=$("sim").getBoundingClientRect();
  G={x:e.clientX,y:e.clientY,t:Date.now(),ev:tEl&&tEl.dataset.ev,el:tEl,moved:false,long:false,drag:tEl&&tEl.dataset.drag,id:e.pointerId,top:(e.clientY-r.top)/r.height<.3,r};
  if(tEl)tEl.classList.add("press");
  if(G.drag)dragTo(e);
  else G.timer=setTimeout(()=>{if(G&&!G.moved&&G.ev){G.long=true;if(navigator.vibrate)try{navigator.vibrate(25);}catch(_){}emit("long:"+G.ev);}},600);
  e.preventDefault();
});
function dragTo(e){const el=document.querySelector('[data-drag="bright"]');if(!el)return;const r=el.getBoundingClientRect();sim.bright=Math.max(8,Math.min(100,Math.round((e.clientX-r.left)/r.width*100)));el.firstElementChild.style.width=sim.bright+"%";$("sim").style.filter=`brightness(${.6+sim.bright/100*.4})`;G.dragged=true;}
addEventListener("pointermove",e=>{if(!G||e.pointerId!==G.id)return;if(G.drag){dragTo(e);return;}
  if(!G.moved&&Math.hypot(e.clientX-G.x,e.clientY-G.y)>18){G.moved=true;clearTimeout(G.timer);if(G.el)G.el.classList.remove("press");}});
function endG(e){if(!G||e.pointerId!==G.id)return;const g=G;G=null;clearTimeout(g.timer);if(g.el)g.el.classList.remove("press");
  if(g.drag){emit("drag:"+g.drag);return;}
  if(g.long){emit("up:"+g.ev);return;}
  if(g.moved){const dx=e.clientX-g.x,dy=e.clientY-g.y;if(Math.hypot(dx,dy)<40)return;
    const dir=Math.abs(dx)>Math.abs(dy)?(dx<0?"left":"right"):(dy<0?"up":"down");emit("swipe:"+dir+(dir==="down"&&g.top?":top":""));return;}
  if(g.ev)emit("tap:"+g.ev);else emit("tap:empty");}
addEventListener("pointerup",endG);addEventListener("pointercancel",e=>{if(G&&e.pointerId===G.id){clearTimeout(G.timer);if(G.el)G.el.classList.remove("press");G=null;}});
frame.addEventListener("contextmenu",e=>e.preventDefault());

/* ---------- lessons ---------- */
let cur=null,stepI=0,free=false,finished=false;
const match=(ok,ev)=>typeof ok==="function"?ok(ev,sim):Array.isArray(ok)?ok.some(o=>match(o,ev)):ok.endsWith("*")?ev.startsWith(ok.slice(0,-1)):ok===ev;
function emit(ev){
  if(finished)return;
  if(free){handle(ev);render();const id=ev.split(":").slice(1).join(":");if(ev.startsWith("tap:")||ev.startsWith("long:")){const x=EXPL[id];if(x)say(tr(x));else if(ev.startsWith("long:app:"))say(tr(["Долгое нажатие открыло меню. Коснитесь пустого места, чтобы закрыть.","Holding opened a menu. Touch an empty spot to close it."]));}return;}
  const st=cur.steps[stepI];
  // closing an accidental menu is always allowed
  if(ev==="tap:menu:close"&&sim.menu&&!match(st.ok,ev)){handle(ev);render();return;}
  const before=()=>{handle(ev);};
  if(typeof st.ok==="function"){
    if((st.allow||[]).some(a=>ev.startsWith(a))){before();if(st.ok(ev,sim))return advance();render();return;}
  }else if(match(st.ok,ev)){before();return advance();}
  else if((st.allow||[]).some(a=>ev.startsWith(a))){before();render();return;}
  if(ev.startsWith("up:")||ev==="tap:empty"&&!st.hl)return;
  if(st.bad&&st.bad[ev]){hint(tr(st.bad[ev]));return;}
  const want=typeof st.ok==="string"?st.ok:Array.isArray(st.ok)?st.ok[0]:"";
  if(ev.startsWith("long:")&&want==="tap:"+ev.slice(5)){hint(tr(UI.tooLong));return;}
  if(ev.startsWith("tap:")&&want==="long:"+ev.slice(4)){hint(tr(UI.tooShort));return;}
  if(ev.startsWith("long:")){hint(tr(UI.tooLong)+" "+tr(st.hand?UI.nudgeSwipe:UI.nudge));return;}
  hint(tr(st.hand?UI.nudgeSwipe:UI.nudge));
}
function hint(text){const h=$("hint");h.className="";h.textContent="👉 "+text;$("coach").classList.remove("shake");void $("coach").offsetWidth;$("coach").classList.add("shake");beep(200,.12);speak(text);}
function advance(){
  beep(660,.09);setTimeout(()=>beep(880,.12),90);
  stepI++;render();
  const tEl=document.createElement("div");tEl.className="toast";tEl.textContent="✓ "+tr(UI.right);$("frame").appendChild(tEl);setTimeout(()=>tEl.remove(),900);
  if(stepI>=cur.steps.length){finish();return;}
  enterStep();
}
function enterStep(){const st=cur.steps[stepI];if(st.pre){st.pre(sim);}render();$("hint").textContent="";say(tr(st.t));$("prog").style.width=(stepI/cur.steps.length*100)+"%";}
function say(text){const s=$("say");s.textContent=text;s.classList.remove("in");void s.offsetWidth;s.classList.add("in");speak(text);}
function mark(){
  document.querySelectorAll(".hl").forEach(e=>e.classList.remove("hl"));document.querySelectorAll(".hand").forEach(e=>e.remove());
  if(!cur||free||finished)return;const st=cur.steps[stepI];if(!st)return;
  if(st.hl){const e=document.querySelector(`#frame [data-ev="${st.hl}"]`);if(e)e.classList.add("hl");}
  if(st.hand){const h=document.createElement("div");h.className="hand "+st.hand;h.textContent="👆";$("sim").appendChild(h);}
}
function finish(){
  finished=true;P.done[cur.id]=true;store();$("prog").style.width="100%";mark();
  const i=LESSONS.indexOf(cur),nx=LESSONS[i+1];
  [523,659,784,1047].forEach((f,k)=>setTimeout(()=>beep(f,.18),k*130));
  $("hint").textContent="";$("say").innerHTML=`<div class="doneBox"><div class="big">🎉 ${tr(UI.done)}</div>${nx?`<button class="cta" id="bNext">${tr(UI.next)}</button>`:""}<button class="cta ghost" id="bList">${tr(UI.list)}</button></div>`;
  if(nx)$("bNext").onclick=()=>startLesson(nx);$("bList").onclick=showMenu;speak(tr(UI.done));
}
function startLesson(l){cur=l;stepI=0;free=false;finished=false;sim=fresh();$("menu").classList.add("hide");$("lessonView").classList.remove("hide");
  $("lTitle").textContent=(LESSONS.indexOf(l)+1)+". "+tr(l.t);fit();enterStep();}
function startFree(){cur=null;free=true;finished=false;sim=fresh();$("menu").classList.add("hide");$("lessonView").classList.remove("hide");$("lTitle").textContent=tr(UI.free);$("prog").style.width="0%";$("hint").textContent="";fit();render();say(tr(UI.freeSay));}
function showMenu(){
  cur=null;free=false;if(window.speechSynthesis)speechSynthesis.cancel();$("lessonView").classList.add("hide");const m=$("menu");m.classList.remove("hide");document.documentElement.lang=P.lang?"en":"ru";document.title=tr(UI.title);
  const nxt=LESSONS.find(l=>!P.done[l.id]);
  m.innerHTML=`<h1>📱 ${tr(UI.title)}</h1><p class="sub">${tr(UI.sub)}</p><div class="langs"><button class="${P.lang===0?"on":""}" data-l="0">Русский</button><button class="${P.lang===1?"on":""}" data-l="1">English</button></div>
    ${LESSONS.map((l,i)=>`<button class="lesson ${P.done[l.id]?"done":""} ${l===nxt?"next":""}" data-i="${i}"><div class="n">${P.done[l.id]?"✓":i+1}</div><div><b>${esc(tr(l.t))}</b><span>${esc(tr(l.s))}</span></div></button>`).join("")}
    <button class="lesson" id="bFree"><div class="n">🖐</div><div><b>${tr(UI.free)}</b><span>${tr(UI.freeSub)}</span></div></button>`;
  m.querySelectorAll(".langs button").forEach(b=>b.onclick=()=>{P.lang=+b.dataset.l;store();showMenu();});
  m.querySelectorAll(".lesson[data-i]").forEach(b=>b.onclick=()=>startLesson(LESSONS[+b.dataset.i]));
  $("bFree").onclick=startFree;
}
$("bMenu").onclick=showMenu;
/* read aloud */
let talk=!!P.talk;
function speak(text){if(!talk||!window.speechSynthesis)return;try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang=P.lang?"en-US":"ru-RU";u.rate=.9;speechSynthesis.speak(u);}catch(e){}}
function paintSay(){$("bSay").textContent=talk?"🔊":"🔇";$("bSay").style.background=talk?"#fff0e0":"#fff";}
$("bSay").onclick=()=>{talk=!talk;P.talk=talk;store();paintSay();if(talk)speak($("say").textContent);else if(window.speechSynthesis)speechSynthesis.cancel();};paintSay();
let ac;function beep(f,d){try{ac=ac||new (window.AudioContext||window.webkitAudioContext)();const o=ac.createOscillator(),a=ac.createGain();o.type="sine";o.frequency.value=f;a.gain.value=.08;a.gain.exponentialRampToValueAtTime(.0001,ac.currentTime+d);o.connect(a).connect(ac.destination);o.start();o.stop(ac.currentTime+d);}catch(e){}}
/* everything inside the practice phone is sized from its width */
function fit(){const f=$("frame");f.style.fontSize="16px";const w=f.getBoundingClientRect().width;if(w)f.style.fontSize=(w/21)+"px";}
addEventListener("resize",()=>{if(!$("lessonView").classList.contains("hide")){fit();}});
new ResizeObserver(()=>{if(!$("lessonView").classList.contains("hide"))fit();}).observe($("coach"));
showMenu();
