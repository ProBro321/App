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
  weather:S('<circle cx="9" cy="9" r="3.500"/><path d="M9 2.500v1.500M3 9h1.500M4.500 4.500l1 1M13.500 4.500l-1 1"/><path d="M8 19.500h9a3.500 3.500 0 0 0 0-7 5 5 0 0 0-9.500 1.500A3 3 0 0 0 8 19.500z" fill="currentColor"/>'),
  share:S('<circle cx="6" cy="12" r="2.500"/><circle cx="17.500" cy="5.500" r="2.500"/><circle cx="17.500" cy="18.500" r="2.500"/><path d="M8.200 10.800l7-4M8.200 13.200l7 4"/>'),
  gps:S('<path d="M12 21c-5-6.500-7-9.500-7-12.500a7 7 0 0 1 14 0c0 3-2 6-7 12.500z" fill="currentColor"/><circle cx="12" cy="8.500" r="2.500" fill="#fff" stroke="none"/>'),
  store:S('<path d="M5 8h14l-1 12H6z"/><path d="M9 8V6.500a3 3 0 0 1 6 0V8"/>'),
  wifi:S('<path d="M3 9.500a13 13 0 0 1 18 0M6 13a8.500 8.500 0 0 1 12 0M9 16.500a4.200 4.200 0 0 1 6 0"/><circle cx="12" cy="19.500" r="1" fill="currentColor"/>'),
  bt:S('<path d="M7 7.500l10 9-5 4.500V3l5 4.500-10 9"/>'),
  shot:S('<circle cx="7" cy="7" r="2.500"/><circle cx="7" cy="17" r="2.500"/><path d="M9 8.500l10 8M9 15.500l10-8"/>'),
  saver:S('<rect x="3" y="8" width="16" height="9" rx="2"/><path d="M21 11v3M11 10.500v4M9 12.500h4"/>'),
  eye:S('<path d="M2.500 12s3.500-6 9.500-6 9.500 6 9.500 6-3.500 6-9.500 6-9.500-6-9.500-6z"/><circle cx="12" cy="12" r="2.500"/>'),
  rotate:S('<rect x="8" y="8" width="8" height="8" rx="1.500"/><path d="M4 9a8.500 8.500 0 0 1 14-3.500M20 15a8.500 8.500 0 0 1-14 3.500"/>'),
  dark:S('<path d="M19 14.500A8 8 0 0 1 9.500 5a8 8 0 1 0 9.500 9.500z" fill="currentColor"/>'),
  rec:S('<rect x="3" y="7" width="12" height="10" rx="2" fill="currentColor"/><path d="M15 11l5.500-3v8L15 13z" fill="currentColor"/>'),
  scan:S('<path d="M4 8V5.500A1.500 1.500 0 0 1 5.500 4H8M16 4h2.500A1.500 1.500 0 0 1 20 5.500V8M20 16v2.500a1.500 1.500 0 0 1-1.500 1.500H16M8 20H5.500A1.500 1.500 0 0 1 4 18.500V16M8 12h8"/>'),
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
const COL={phone:"#22b45a",chat:"#1fa855",web:"#2f7df6",camera:"#444a5a",mail:"#e8eefc",video:"#b3261e",gallery:"#f08a24",settings:"#6b7280",calc:"#0f766e",clock:"#3b3f52",cal:"#2563eb",notes:"#eab308",store:"#7c3aed",weather:"#0ea5e9",gps:"#38bdf8"};
const PAGES=[["mail","video","gallery","settings"],["calc","clock","cal","notes","store","gps"]],DOCK=["phone","chat","web","camera"];

/* ---------- the practice phone ---------- */
let sim;
function fresh(){return {page:0,app:null,view:null,shade:false,wifi:true,bt:false,btDev:false,torch:false,data:true,plane:false,silent:false,bright:100,menu:null,locked:false,off:false,boot:false,pmenu:false,
  vol:6,volShow:false,notif:[],banner:null,installed:false,inst:0,ncName:"",newC:"",call:null,dial:"",typed:"",kb:false,chatOpen:false,msgs:[],rec:false,mail:null,mailGone:false,yt:{v:"home",play:false,ad:false},cam:{front:false,shots:0,flash:0},gal:null,popup:false,recents:false,opened:[]};}
const appIcon=(id,ev=true)=>`<div class="app"${ev?` data-ev="app:${id}"`:""}><div class="ic" style="background:${COL[id]};color:${id==="mail"?"#d93025":"#fff"}">${IC[id]}${ev&&id==="chat"&&sim.notif.some(n=>n.app==="chat")?`<span class="badge">1</span>`:""}</div>${esc(tr(NAMES[id]))}</div>`;
function statusBar(dark){return `<div class="sb" style="${dark?"color:#222":""}"><span data-ev="st:time">12:30</span><span class="r"><span data-ev="st:signal">${IC.signal}</span>${sim.bt?`<span>${IC.bt}</span>`:""}${sim.wifi?`<span data-ev="st:wifi">${IC.wifi}</span>`:""}<span data-ev="st:battery">${IC.battery}</span></span></div>`;}
function navBar(){return `<div class="nav"><div data-ev="nav:recents">${IC.recents}</div><div data-ev="nav:home">${IC.home}</div><div data-ev="nav:back">${IC.back}</div></div>`;}
const KB=[["йцукенгшщзх","фывапролджэ","ячсмитьбю"],["qwertyuiop","asdfghjkl","zxcvbnm"]];
function keyboard(){return `<div class="kb" data-ev="kbd">${KB[P.lang].map(r=>`<div class="kr">${[...r].map(k=>`<div class="k" data-ev="kb:${k}">${k}</div>`).join("")}</div>`).join("")}<div class="kr"><div class="k g" data-ev="kb:del">⌫</div><div class="k w" data-ev="kb:space"></div><div class="k g" data-ev="kb:.">.</div></div></div>`;}
const CONTACTS=[[["Сын","Son"],"#2f7df6"],[["Анна","Anna"],"#e5412f"],[["Врач","Doctor"],"#0f766e"],[["Сосед Борис","Neighbour Boris"],"#f08a24"]];
const allContacts=()=>[...CONTACTS,...(sim.newC?[[[sim.newC,sim.newC],"#7c3aed"]]:[])];
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
    const tabs=`<div class="tabs"><div class="${!sim.view?"on":""}" data-ev="ph:keys">${tr(["Клавиши","Keypad"])}</div><div class="${sim.view==="recents"?"on":""}" data-ev="ph:recents">${tr(["Недавние","Recents"])}</div><div class="${sim.view==="contacts"?"on":""}" data-ev="ph:contacts">${tr(["Контакты","Contacts"])}</div></div>`;
    if(sim.view==="new")return `<div class="win">${title(tr(["Новый контакт","New contact"]))}<div class="body" style="padding:.8em;gap:.7em"><div style="font-size:.8em;color:#777">${tr(["Имя","Name"])}</div><div class="fldbox" data-ev="nc:name">${esc(sim.ncName)||`<span style="color:#aaa">${tr(["Как зовут?","Who is it?"])}</span>`}${sim.kb?"|":""}</div>
      <div style="font-size:.8em;color:#777">${tr(["Номер","Number"])}</div><div class="fldbox">050-555-0123</div><div class="sbtn" data-ev="nc:save" style="margin-top:.4em;${sim.ncName.trim()?"":"background:#9aa"}">${tr(["Сохранить","Save"])}</div></div>${sim.kb?keyboard():""}</div>`;
    if(sim.view==="recents"){const rec=[[["Сын","Son"],"↙",["Входящий · сегодня, 10:12","Incoming · today, 10:12"],"#1f9d5b"],[sim.newC?[sim.newC,sim.newC]:["050-555-0123","050-555-0123"],"↙",["Пропущенный · сегодня, 09:40","Missed · today, 09:40"],"#e5412f",1],[["Анна","Anna"],"↗",["Исходящий · вчера","Outgoing · yesterday"],"#2f7df6"]];
      return `<div class="win">${title(tr(["Недавние звонки","Recent calls"]))}<div class="body">${rec.map(r=>`<div class="row"><div class="av" style="background:${r[3]}">${r[1]}</div><div class="tx"><b style="${r[4]?"color:#e5412f":""}">${esc(tr(r[0]))}</b><small>${esc(tr(r[2]))}</small></div>${r[4]&&!sim.newC?`<div class="addc" data-ev="rec:add">＋</div>`:""}</div>`).join("")}</div>${tabs}</div>`;}
    if(sim.view==="contacts")return `<div class="win">${title(tr(["Контакты","Contacts"]))}<div class="body"><div class="yts" style="background:#f0f1f5;color:#777;flex:none;margin:.3em .8em">${IC.search.replace("<svg",'<svg style="width:1.1em;height:1.1em"')}${tr(["Поиск по имени","Search by name"])}</div>${allContacts().map((c,i)=>`<div class="row" data-ev="contact:${i}"><div class="av" style="background:${c[1]}">${esc(tr(c[0])[0])}</div><div class="tx"><b>${esc(tr(c[0]))}</b><small>05${i}-123-45-6${i}</small></div></div>`).join("")}</div>${tabs}</div>`;
    return `<div class="win"><div class="body" style="justify-content:flex-end"><div class="dial">${esc(sim.dial)||"&nbsp;"}</div><div class="keys" data-ev="keys">${"123456789*0#".split("").map(k=>`<div data-ev="key:${k}">${k}</div>`).join("")}</div><div class="round green" data-ev="call:start">${IC.phone}</div></div>${tabs}</div>`;
  }
  if(a==="chat"){
    const WHO={son:["Сын","Son"],anna:["Анна","Anna"],x:["+7 900 000-00-00","+1 900 000 0000"]};
    const first={son:`<div class="bub">${tr(["Пап, как дела?","Dad, how are you?"])}</div>${sim.copyMsg?`<div class="bub" data-ev="bub:copy">${tr(["Телефон врача:","The doctor's number:"])} 050-123-4567</div>`:""}${sim.linkMsg?`<div class="bub">${tr(["Вот адрес поликлиники, нажми — и навигатор сам покажет дорогу:","Here's the clinic's address, touch it and the navigator shows the way:"])}<br><u class="lnk" data-ev="link:map">📍 maps.example/sadovaya-12</u></div>`:""}`,
      anna:`<div class="bub">${tr(["Спасибо!","Thank you!"])}</div>`,
      x:`<div class="bub">${tr(["Ваша посылка задержана! Срочно оплатите доставку 9 ₪, иначе её вернут:","Your parcel is held! Pay 9 ₪ for delivery right now or it will be returned:"])}<br><u class="lnk" data-ev="link:scam">http://post-pay.example/k7x2</u></div>`};
    if(!sim.chatOpen)return `<div class="win">${title(tr(NAMES.chat))}<div class="body">${[["son",["Сын","Son"],["Пап, как дела?","Dad, how are you?"],"#2f7df6"],["anna",["Анна","Anna"],["Спасибо!","Thank you!"],"#e5412f"],["x",["+7 900 000-00-00","+1 900 000 0000"],["Ваша посылка задержана! Срочно…","Your parcel is held! Pay now…"],"#888"]]
      .map(c=>`<div class="row" data-ev="chat:${c[0]}"><div class="av" style="background:${c[3]}">${esc(tr(c[1])[0])}</div><div class="tx"><b>${esc(tr(c[1]))}</b><small>${esc(tr(c[2]))}</small></div></div>`).join("")}</div></div>`;
    return `<div class="win"><div class="bar2" style="background:#128c5e;color:#fff">${esc(tr(WHO[sim.chatOpen]||WHO.son))}</div><div class="chat">${first[sim.chatOpen]||first.son}${sim.msgs.filter(m=>(m.to||"son")===sim.chatOpen).map(m=>`<div class="bub ${m.me?"me":""}">${m.voice?"🎤 ▶ ▁▃▅▂▆▃▁ 0:04":m.photo?`<div style="font-size:4em;line-height:1.2;background:#dfe9f5;border-radius:.15em;padding:0 .3em">${m.photo}</div>`:esc(m.t)}${m.me?"<small>✓✓</small>":""}</div>`).join("")}${sim.bubMenu==="copy"?`<div class="bmenu" style="top:30%"><div data-ev="bm:copy">📋 ${tr(["Копировать","Copy"])}</div><div>↪ ${tr(["Переслать","Forward"])}</div><div>🗑 ${tr(["Удалить","Delete"])}</div></div>`:""}${sim.bubMenu==="paste"?`<div class="bmenu" style="bottom:4.5em"><div data-ev="bm:paste">📋 ${tr(["Вставить","Paste"])}</div></div>`:""}</div>
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
    return sim.gal!=null?`<div class="win" style="position:relative"><div class="big">${ph[sim.gal]}</div><div class="gtool"><div data-ev="gal:share">${IC.share}${tr(["Отправить","Send"])}</div><div data-ev="gal:del">${IC.bin}${tr(["Удалить","Delete"])}</div></div>
      ${sim.share==="apps"?`<div class="sheet"><b>${tr(["Отправить через…","Send with…"])}</b><div class="srow">${["chat","mail"].map(a=>`<div class="app" data-ev="share:${a}" style="color:#111;text-shadow:none"><div class="ic" style="background:${COL[a]};color:${a==="mail"?"#d93025":"#fff"}">${IC[a]}</div>${esc(tr(NAMES[a]))}</div>`).join("")}<div class="app" style="color:#111;text-shadow:none"><div class="ic" style="background:#2f7df6;color:#fff">${IC.bt}</div>Bluetooth</div></div></div>`:""}
      ${sim.share==="who"?`<div class="sheet"><b>${tr(["Кому отправить?","Send to whom?"])}</b>${[["son",["Сын","Son"],"#2f7df6"],["anna",["Анна","Anna"],"#e5412f"]].map(c=>`<div class="row" data-ev="share:to:${c[0]}"><div class="av" style="background:${c[2]}">${esc(tr(c[1])[0])}</div><div class="tx"><b>${esc(tr(c[1]))}</b></div></div>`).join("")}</div>`:""}</div>`:`<div class="win">${title(tr(NAMES.gallery))}<div class="body"><div class="gal">${ph.map((p,i)=>`<div data-ev="gal:${i}">${p}</div>`).join("")}</div></div></div>`;}
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
  if(a==="gps"){const go=sim.gps==="go";return `<div class="win"><div class="body" style="position:relative;background:#e9efe4">
      <svg viewBox="0 0 200 300" preserveAspectRatio="none" style="position:absolute;inset:0;width:100%;height:100%"><path d="M0 60H200M0 150H200M0 240H200M50 0V300M140 0V300" stroke="#fff" stroke-width="12"/><path d="M50 280V150H140V70" fill="none" stroke="#2f7df6" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><circle cx="50" cy="280" r="8" fill="#2f7df6" stroke="#fff" stroke-width="3"/><path d="M140 70c-9-12-13-18-13-25a13 13 0 0 1 26 0c0 7-4 13-13 25z" fill="#e5412f"/><circle cx="140" cy="45" r="5" fill="#fff"/></svg>
      ${go?`<div style="position:relative;margin:.6em;background:#1f9d5b;color:#fff;border-radius:1em;padding:.8em 1em;font-weight:800">↱ ${tr(["Через 200 м поверните направо","In 200 m turn right"])}</div>`:""}
      <div style="position:relative;margin:auto .6em .6em;background:#fff;border-radius:1.2em;padding:.9em 1em;box-shadow:0 6px 20px rgba(0,0,0,.25)"><b>${tr(["Поликлиника, ул. Садовая, 12","Clinic, 12 Sadovaya St"])}</b><div style="color:#666;font-size:.88em;margin:.2em 0 .7em">12 ${tr(["мин","min"])} · 4 ${tr(["км","km"])}</div>
      <div class="sbtn" data-ev="${go?"gps:stop":"gps:go"}" style="${go?"background:#e5412f":""}">${tr(go?["Завершить","Stop"]:["Поехали","Go"])}</div></div></div></div>`;}
  if(a==="weather")return `<div class="win"><div class="body" style="align-items:center;justify-content:center;gap:.3em;background:linear-gradient(180deg,#8fd3ff,#e8f6ff)"><div style="font-size:5em">⛅</div><b style="font-size:2.6em">+24°</b><span>${tr(["Сегодня, без дождя","Today, no rain"])}</span></div></div>`;
  if(a==="store"){const apps=[["weather",["Погода","Weather"],["Прогноз на каждый день","Forecast for every day"]],["calc",["Шахматы","Chess"],["Игра для ума","A game for the mind"]],["clock",["Радио","Radio"],["Музыка и новости","Music and news"]]];
    if(sim.view==="detail")return `<div class="win">${title(tr(["Магазин","App store"]))}<div class="body" style="padding:1em;gap:.8em"><div style="display:flex;gap:.9em;align-items:center"><div class="app"><div class="ic" style="background:${COL.weather};color:#fff">${IC.weather}</div></div><div><b style="font-size:1.2em">${tr(["Погода","Weather"])}</b><div style="color:#777;font-size:.85em">★ 4,6 · ${tr(["Бесплатно","Free"])}</div></div></div>
      <div class="sbtn" data-ev="${sim.inst?"store:open":"store:install"}" style="${sim.inst===1?"background:#9aa":""}">${tr(sim.inst===2?["Открыть","Open"]:sim.inst===1?["Установка…","Installing…"]:["Установить","Install"])}</div><div style="font-size:.9em;line-height:1.5;color:#444">${tr(["Показывает погоду на сегодня и на неделю. Людям нравится: оценка 4,6 из 5.","Shows the weather for today and the week. People like it: rated 4.6 out of 5."])}</div></div></div>`;
    return `<div class="win">${title(tr(["Магазин","App store"]))}<div class="body">${apps.map((x,i)=>`<div class="row" data-ev="store:${i}"><div class="av" style="background:${COL[x[0]]};border-radius:.7em">${IC[x[0]].replace("<svg",'<svg style="width:1.5em;height:1.5em"')}</div><div class="tx"><b>${esc(tr(x[1]))}</b><small>${esc(tr(x[2]))}</small></div><span style="color:#1a73e8;font-weight:700;font-size:.85em">${tr(["Бесплатно","Free"])}</span></div>`).join("")}</div></div>`;}
  return `<div class="win"><div class="body" style="align-items:center;justify-content:center;gap:.6em;color:#555;padding:1em;text-align:center"><div class="app"><div class="ic" style="background:${COL[a]};color:#fff">${IC[a]}</div></div><b>${esc(tr(NAMES[a]))}</b></div></div>`;
}
function render(){
  const el=$("sim");$("frame").classList.toggle("torch",sim.torch);
  if(sim.off||sim.boot){el.innerHTML=`<div class="off">${sim.boot?`<div style="font-size:1.2em;font-weight:700" class="ring">⟳ ${tr(["Перезагрузка…","Restarting…"])}</div>`:""}</div>`;mark();return;}
  let body;
  if(sim.locked)body=`<div class="lock"><div><div class="clk">12:30</div><div>${tr(["Пятница, 2 октября","Friday, 2 October"])}</div></div><div>🔒<br>${tr(["Проведите вверх","Swipe up"])}</div></div>`;
  else if(sim.recents)body=`<div style="flex:1;display:flex;gap:.8em;align-items:center;justify-content:center;background:rgba(0,0,0,.35);padding:1em">${sim.opened.length?sim.opened.slice(-2).map(a=>`<div style="background:#fff;color:#111;border-radius:1.2em;width:44%;height:60%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.4em;font-size:.9em">${appIcon(a,false)}</div>`).join(""):`<b>${tr(["Нет открытых приложений","No open apps"])}</b>`}</div>`;
  else if(sim.app)body=appWindow();
  else body=`<div class="grid">${[...PAGES[sim.page],...(sim.installed&&!sim.page?["weather"]:[])].map(a=>appIcon(a)).join("")}</div><div class="pgdots"><i class="${sim.page?"":"on"}"></i><i class="${sim.page?"on":""}"></i></div><div class="dock">${DOCK.map(a=>appIcon(a)).join("")}</div>`;
  const darkBar=sim.app&&!sim.locked&&!sim.recents&&!sim.shade&&!(sim.app==="phone"&&sim.call)&&sim.app!=="camera"&&sim.app!=="video";
  let ov="";
  if(sim.shade==="cc"){ // control centre, laid out like Xiaomi HyperOS
    const big=(id,name,on)=>`<div class="q big ${on?"on":""}" data-ev="qs:${id}">${IC[id]}<div>${name}<small>${tr(on?["Вкл.","On"]:["Выкл.","Off"])}</small></div></div>`;
    const rnd=(id)=>`<div class="rq ${sim[id]?"on":""}" data-ev="qs:${id}">${IC[id]}</div>`;
    ov+=`<div class="ovl shade cc"><div class="cchead"><span>${tr(["Пт, 2 Окт","Fri, 2 Oct"])}</span><span class="r">${tr(["Оператор","Carrier"])} ${IC.signal}${IC.battery} 78%</span></div>
      <div class="ccgrid"><div style="display:flex;flex-direction:column;gap:.6em">${big("wifi","Wi-Fi",sim.wifi)}<div class="media"><div>${tr(["Не воспроизводится","Not playing"])}</div><div class="mc">⏮ &nbsp;▶&nbsp; ⏭</div></div></div>
      <div style="display:flex;flex-direction:column;gap:.6em">${big("data",tr(["Мобильный интернет","Mobile data"]),sim.data)}<div style="display:flex;gap:.6em;flex:1">
        <div class="vslider" data-ev="bright" data-drag="bright"><i style="height:${sim.bright}%"></i><span>☀</span></div><div class="vslider" data-ev="volbar" data-drag="volbar"><i style="height:${sim.vol*10}%"></i><span style="color:#2f7df6">🔊</span></div></div></div></div>
      <div class="rgrid">${["bt","plane","silent","torch","shot","saver","eye","rotate","dark","rec","scan","gear"].map(rnd).join("")}</div></div>`;}
  if(sim.shade==="notes")ov+=`<div class="ovl shade"><div class="cchead" style="flex-direction:column;align-items:flex-start;gap:0"><span style="font-size:2.4em;font-weight:300">12:30</span><span>${tr(["Пятница, 2 октября","Friday, 2 October"])}</span></div>
      <b style="opacity:.8;font-size:.9em">${tr(["Уведомления","Notifications"])}</b>
      ${sim.notif.length?sim.notif.map((n,i)=>`<div class="note" data-ev="note:${i}">${n.app==="chat"?"💬":"🛒"} <b>${esc(tr(n.from))}</b><br>${esc(tr(n.text))}</div>`).join(""):`<div class="note" style="text-align:center;opacity:.7">${tr(["Нет уведомлений","No notifications"])}</div>`}</div>`;
  if(sim.banner&&!sim.shade)ov+=`<div class="banner" data-ev="note:0">💬 <b>${esc(tr(sim.banner.from))}</b><br>${esc(tr(sim.banner.text))}</div>`;
  if(sim.menu)ov+=`<div class="ovl amenu" data-ev="menu:close"><div class="m"><div style="display:flex;gap:.6em;align-items:center"><b>${esc(tr(NAMES[sim.menu]))}</b></div><div data-ev="menu:info">ⓘ ${tr(["О приложении","App info"])}</div><div data-ev="menu:del">🗑 ${tr(["Удалить","Uninstall"])}</div></div></div>`;
  if(sim.popup)ov+=`<div class="ovl popup"><div class="p"><div class="x" data-ev="popup:x">✕</div><div style="font-size:2.4em">⚠️</div><b>${tr(["ВНИМАНИЕ! В телефоне 5 вирусов!","WARNING! 5 viruses on your phone!"])}</b><div style="margin-top:.4em">${tr(["Срочно нажмите, чтобы очистить","Press now to clean it"])}</div><div class="okb" data-ev="popup:ok">${tr(["ОЧИСТИТЬ СЕЙЧАС","CLEAN NOW"])}</div></div></div>`;
  if(sim.pmenu)ov+=`<div class="ovl pmenu"><div data-ev="pw:off">⏻ ${tr(["Выключить","Power off"])}</div><div data-ev="pw:restart">⟳ ${tr(["Перезагрузить","Restart"])}</div></div>`;
  if(sim.volShow)ov+=`<div class="vol"><i style="height:${sim.vol*10}%"></i><span>🔊</span></div>`;
  el.style.filter=`brightness(${.6+sim.bright/100*.4})`;
  el.innerHTML=statusBar(darkBar).replace('class="sb"',`class="sb"${darkBar?' data-dark':''}`)+`<div class="scr" style="${darkBar?"margin-top:-2.2em;padding-top:2.2em;background:#fff":""}">${body}${ov}</div>`+(sim.locked?"":navBar());
  mark();clearTimeout(markT);markT=setTimeout(mark,340);
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
    if(id==="down:right"){sim.shade="cc";return;}
    if(id==="down:left"){sim.shade="notes";sim.banner=null;return;}
    if(id==="up"&&sim.shade){sim.shade=false;return;}
    if((id==="left"||id==="right")&&sim.shade==="notes"){sim.notif.shift();return;}
    if(id==="up"&&sim.recents){sim.opened.pop();return;}
    if(!sim.app&&!sim.shade&&!sim.recents){if(id==="left")sim.page=1;if(id==="right")sim.page=0;}
    return;
  }
  if(g==="drag")return;
  if(g==="up"){if(id==="msg:mic"&&sim.rec){sim.rec=false;sim.msgs.push({me:1,voice:1,to:sim.chatOpen});}return;}
  if(g==="long"&&id==="bub:copy"){sim.bubMenu="copy";return;}
  if(g==="long"&&id==="msg:field"){if(sim.clip)sim.bubMenu="paste";return;}
  if(g==="tap"&&!id.startsWith("bm:"))sim.bubMenu=null;
  if(g==="long"){
    if(id.startsWith("app:"))sim.menu=id.slice(4);
    else if(id==="qs:bt"){sim.shade=false;sim.app="settings";sim.view="bt";open("settings");}
    else if(id==="qs:wifi"){sim.shade=false;sim.app="settings";sim.view=null;open("settings");}
    else if(id==="msg:mic"){sim.rec=true;sim.kb=false;}
    return;
  }
  // taps
  if(id==="menu:close"||id==="menu:info"){sim.menu=null;return;}
  if(id==="menu:del"){if(sim.menu==="weather"){sim.installed=false;sim.inst=0;}sim.menu=null;return;}
  if(id.startsWith("note:")){const n=sim.notif[+id.slice(5)]||sim.banner;sim.banner=null;if(!n)return;sim.notif=sim.notif.filter(x=>x!==n);sim.shade=false;resetApps();
    if(n.app==="chat"){sim.app="chat";sim.chatOpen="son";sim.msgs.push({t:tr(n.text)});open("chat");}else{sim.app="store";open("store");}return;}
  if(id==="store:install"){sim.inst=1;setTimeout(()=>{sim.inst=2;sim.installed=true;render();},1300);return;}
  if(id==="store:open"){if(sim.inst===2){sim.app="weather";open("weather");}return;}
  if(id.startsWith("store:")){if(id==="store:0")sim.view="detail";return;}
  if(id==="popup:x"){sim.popup=false;return;}
  if(id.startsWith("nav:")){
    if(sim.popup&&id==="nav:back"){sim.popup=false;return;}
    sim.menu=null;sim.shade=false;
    if(id==="nav:home"){sim.app=null;sim.recents=false;sim.call=null;sim.kb=false;sim.page=0;resetApps();}
    else if(id==="nav:recents"){sim.recents=!sim.recents;sim.app=null;}
    else back();
    return;
  }
  if(id.startsWith("qs:")){const k=id.slice(3);sim[k]=!sim[k];if(k==="bt"&&!sim.bt)sim.btDev=false;if(k==="plane"){if(sim.plane){sim.wifi=false;sim.data=false;sim.bt=false;sim.btDev=false;}else{sim.wifi=true;sim.data=true;}}if(k==="gear"){sim.gear=false;sim.shade=false;sim.app="settings";sim.view=null;open("settings");}return;}
  if(id.startsWith("app:")){const a=id.slice(4);sim.app=a;sim.view=null;sim.recents=false;resetApps();open(a);return;}
  if(id.startsWith("key:")){if(sim.dial.length<12)sim.dial+=id.slice(4);return;}
  if(id==="call:start"){sim.call={name:sim.dial||"…",state:"talk"};return;}
  if(id==="call:answer"){sim.call.state="talk";return;}
  if(id==="call:speaker"){sim.call.speaker=!sim.call.speaker;return;}
  if(id==="call:end"){sim.call=null;sim.dial="";return;}
  if(id==="ph:contacts"){sim.view="contacts";return;}
  if(id==="ph:keys"){sim.view=null;return;}
  if(id.startsWith("contact:")){sim.call={name:allContacts()[+id.slice(8)][0],state:"talk"};return;}
  if(id==="ph:recents"){sim.view="recents";return;}
  if(id==="rec:add"){sim.view="new";sim.ncName="";return;}
  if(id==="nc:name"){sim.kb=true;return;}
  if(id==="nc:save"){if(!sim.ncName.trim())return;sim.newC=sim.ncName.trim();sim.newC=sim.newC[0].toUpperCase()+sim.newC.slice(1);sim.kb=false;sim.view="contacts";flash(tr(["Контакт сохранён","Contact saved"]));return;}
  if(id==="bm:copy"){sim.clip="050-123-4567";sim.bubMenu=null;flash(tr(["Скопировано","Copied"]));return;}
  if(id==="bm:paste"){sim.typed+=sim.clip||"";sim.bubMenu=null;return;}
  if(id==="gal:share"){sim.share="apps";return;}
  if(id==="gal:del"){sim.gal=null;sim.share=null;return;}
  if(id==="share:chat"){sim.share="who";return;}
  if(id==="share:mail"){sim.share=null;return;}
  if(id.startsWith("share:to:")){const to=id.slice(9),ph=[...(sim.cam.shots?["🧓","🌳"].slice(0,Math.min(2,sim.cam.shots)):[]),...PHOTOS];sim.msgs.push({me:1,photo:ph[sim.gal]||"🌳",to});sim.share=null;sim.gal=null;sim.app="chat";sim.chatOpen=to;open("chat");return;}
  if(id.startsWith("chat:")){sim.chatOpen=id.slice(5);return;}
  if(id==="link:map"){sim.app="gps";sim.gps="route";open("gps");return;}
  if(id==="gps:go"){sim.gps="go";return;}
  if(id==="gps:stop"){sim.gps="route";return;}
  if(id==="msg:field"){sim.kb=true;return;}
  if(id.startsWith("kb:")&&sim.app==="phone"&&sim.view==="new"){const k=id.slice(3);sim.ncName=k==="del"?sim.ncName.slice(0,-1):sim.ncName+(k==="space"?" ":k);return;}
  if(id.startsWith("kb:")){const k=id.slice(3);if(sim.app!=="chat")return;sim.typed=k==="del"?sim.typed.slice(0,-1):sim.typed+(k==="space"?" ":k);return;}
  if(id==="msg:send"){const to=sim.chatOpen;sim.msgs.push({me:1,t:sim.typed,to});sim.typed="";sim.kb=false;clearTimeout(replyT);replyT=setTimeout(()=>{if(sim.app==="chat"){sim.msgs.push({t:tr(["Получил! 👍","Got it! 👍"]),to});render();}},1500);return;}
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
function flash(text){const t=document.createElement("div");t.className="toast";t.style.cssText="top:62%;font-size:1.1em;background:#333";t.textContent=text;$("frame").appendChild(t);setTimeout(()=>t.remove(),900);}
function resetApps(){sim.share=null;sim.bubMenu=null;sim.chatOpen=false;sim.kb=false;sim.typed="";sim.mail=null;sim.gal=null;sim.yt={v:"home",play:false,ad:false};sim.view=null;sim.rec=false;}
function back(){
  if(sim.recents){sim.recents=false;return;}
  const a=sim.app;if(!a)return;
  if(a==="gps"&&sim.chatOpen){sim.app="chat";return;}
  if(a==="phone"&&sim.call){sim.call=null;return;}
  if(a==="phone"&&sim.view==="new"){sim.kb=false;sim.view="recents";return;}
  if(a==="chat"&&sim.kb){sim.kb=false;return;}
  if(a==="chat"&&sim.chatOpen){sim.chatOpen=false;sim.typed="";return;}
  if(a==="mail"&&sim.mail!=null){sim.mail=null;return;}
  if(a==="gallery"&&sim.share){sim.share=null;return;}
  if(a==="gallery"&&sim.gal!=null){sim.gal=null;return;}
  if(a==="video"&&sim.yt.v!=="home"){sim.yt.v=sim.yt.v==="player"?"results":"home";sim.yt.play=false;sim.yt.ad=false;return;}
  if((a==="settings"||a==="phone"||a==="web"||a==="store")&&sim.view){sim.view=a==="web"&&sim.view==="result"?"search":null;return;}
  sim.app=null;
}

/* ---------- gestures: tap, hold, swipe, drag ---------- */
let G=null;
const frame=$("frame");
frame.addEventListener("pointerdown",e=>{
  if(G)return;const tEl=e.target.closest("[data-ev]"),r=$("sim").getBoundingClientRect();
  G={x:e.clientX,y:e.clientY,t:Date.now(),ev:tEl&&tEl.dataset.ev,el:tEl,moved:false,long:false,drag:tEl&&tEl.dataset.drag,id:e.pointerId,top:(e.clientY-r.top)/r.height<.3||(!sim.app&&!sim.recents&&!sim.locked&&!sim.off),r};
  if(tEl)tEl.classList.add("press");
  if(G.drag)dragTo(e);
  else G.timer=setTimeout(()=>{if(G&&!G.moved&&G.ev){G.long=true;if(navigator.vibrate)try{navigator.vibrate(25);}catch(_){}emit("long:"+G.ev);}},600);
  e.preventDefault();
});
function dragTo(e){const el=document.querySelector(`[data-drag="${G.drag}"]`);if(!el)return;const r=el.getBoundingClientRect();const v=Math.max(8,Math.min(100,Math.round((r.bottom-e.clientY)/r.height*100)));
  if(G.drag==="bright"){sim.bright=v;$("sim").style.filter=`brightness(${.6+sim.bright/100*.4})`;}else sim.vol=Math.round(v/10);el.firstElementChild.style.height=v+"%";G.dragged=true;}
addEventListener("pointermove",e=>{if(!G||e.pointerId!==G.id)return;if(G.drag){dragTo(e);return;}
  if(!G.moved&&Math.hypot(e.clientX-G.x,e.clientY-G.y)>18){G.moved=true;clearTimeout(G.timer);if(G.el)G.el.classList.remove("press");}});
function endG(e){if(!G||e.pointerId!==G.id)return;const g=G;G=null;clearTimeout(g.timer);if(g.el)g.el.classList.remove("press");
  if(g.drag){emit("drag:"+g.drag);return;}
  if(g.long){emit("up:"+g.ev);return;}
  if(g.moved){const dx=e.clientX-g.x,dy=e.clientY-g.y;if(Math.hypot(dx,dy)<40)return;
    const dir=Math.abs(dx)>Math.abs(dy)?(dx<0?"left":"right"):(dy<0?"up":"down");emit("swipe:"+dir+(dir==="down"&&g.top?((g.x-g.r.left)/g.r.width>.5?":right":":left"):""));return;}
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
  if(st.ok==="swipe:down:right"&&ev==="swipe:down:left"){hint(tr(UI.sideR));return;}
  if(st.ok==="swipe:down:left"&&ev==="swipe:down:right"){hint(tr(UI.sideL));return;}
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
function enterStep(){const st=cur.steps[stepI];if(st.pre){st.pre(sim);}$("hint").textContent="";say(tr(st.t));render();$("prog").style.width=(stepI/cur.steps.length*100)+"%";}
function say(text){const s=$("say");s.textContent=text;s.style.fontSize=text.length>230?"16px":text.length>150?"17px":"";s.classList.remove("in");void s.offsetWidth;s.classList.add("in");speak(text);}
let markT;
function mark(){
  document.querySelectorAll(".hl").forEach(e=>e.classList.remove("hl"));document.querySelectorAll(".hand,.hole,.finger,.dimall").forEach(e=>e.remove());
  const coach=$("coach");coach.style.maxHeight="";
  if(!cur||free||finished){coach.classList.remove("bottom");return;}const st=cur.steps[stepI];if(!st)return;
  const simEl=$("sim"),sr=simEl.getBoundingClientRect();let bottom=false;
  if(st.hl){const e=document.querySelector(`#frame [data-ev="${st.hl}"]`);
    if(e&&e.classList.contains("hw")){e.classList.add("hl");const d=document.createElement("div");d.className="dimall";simEl.appendChild(d);bottom=true;}
    else if(e){const r=e.getBoundingClientRect(),pad=sr.width*.012,h=document.createElement("div");h.className="hole";
      h.style.cssText=`left:${r.left-sr.left-pad}px;top:${r.top-sr.top-pad}px;width:${r.width+pad*2}px;height:${r.height+pad*2}px`;simEl.appendChild(h);
      const chh=coach.offsetHeight,t=r.top-sr.top,bt=r.bottom-sr.top,fitB=bt+12<sr.height-66-chh,fitT=t-12>44+chh;
      bottom=fitB?(fitT?t+r.height/2<sr.height*.5:true):fitT?false:(sr.height-bt-66>t-44);
      coach.style.maxHeight=fitB||fitT?"":Math.max(150,(bottom?sr.height-bt-66:t-44)-14)+"px";
      if(r.height<sr.height*.3){const f=document.createElement("div"),below=r.bottom-sr.top<sr.height*.8;f.className="finger"+(below?"":" dn");f.textContent=below?"👆":"👇";
        f.style.left=Math.max(0,Math.min(sr.width-50,r.left-sr.left+r.width/2-sr.width*.06))+"px";if(below)f.style.top=(r.bottom-sr.top+pad)+"px";else f.style.bottom=(sr.bottom-r.top+pad)+"px";simEl.appendChild(f);}}}
  if(st.hand){const h=document.createElement("div");h.className="hand "+st.hand;h.textContent="👆";simEl.appendChild(h);bottom=st.hand.startsWith("down");}
  if(st.coach)bottom=st.coach==="bottom";
  coach.classList.toggle("bottom",bottom);
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
addEventListener("resize",()=>{if(!$("lessonView").classList.contains("hide")){fit();render();}});
showMenu();
