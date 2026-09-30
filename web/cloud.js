/* Cloud save — name + password, saves by itself. Source of truth for the copy inlined in both apps
   (tools/inline-cloud.py puts it between the CLOUD markers). Uses Firebase Auth + Realtime Database REST,
   each person can only read/write users/<their id>/. */
(function(){
const CFG={apiKey:"AIzaSyDMn3IPi06aVXNpaXNMAwbgw0S90EaO_Uo",db:"https://probro-saves-default-rtdb.europe-west1.firebasedatabase.app"};
const SESS="probro_cloud";
const ready=()=>CFG.apiKey&&!CFG.apiKey.startsWith("__")&&CFG.db&&!CFG.db.startsWith("__");
const T={
  en:{title:"☁️ Cloud save",off:"Cloud save is almost ready — it turns on soon.",
    intro:"Sign in and your data saves by itself every time you change something. New phone or reset? Sign in again and it all comes back.",
    name:"Your name",pass:"Password (6+ characters)",go:"Sign in / Create account",
    hint:"A new name makes a new account. Don't forget the password — it can't be reset.",
    signedAs:n=>`Signed in as <b>${n}</b>`,saved:a=>`✓ Saved to the cloud ${a}`,saving:"Saving…",never:"Not saved yet",
    err:e=>`⚠ Couldn't save (${e}) — it will try again`,offline:"Offline — it will save when you're back online",
    saveNow:"Save now",load:"Load from cloud",out:"Sign out",
    working:"Signing in…",badName:"Type a name",shortPass:"Password needs at least 6 characters",wrongPass:"Wrong password for that name",
    tooMany:"Too many tries — wait a minute",net:"No internet connection",created:"Account created — saving your data",welcome:"Signed in",
    found:(d,x)=>`Found your cloud save from ${d}${x?" ("+x+")":""}.\n\nLoad it on this phone? This replaces what's here now.\n\nCancel = keep this phone's data and save it to the cloud instead.`,
    confirmLoad:d=>`Replace everything here with your cloud save from ${d}?`,nothing:"Nothing saved in the cloud yet",
    restored:"Loaded from the cloud ✓",synced:"Updated from the cloud",outQ:"Sign out? Your data stays on this phone and in the cloud.",
    now:"just now",min:n=>n+" min ago",hr:n=>n+" h ago",day:n=>n+" d ago"},
  ru:{title:"☁️ Облачная копия",off:"Облачная копия скоро заработает.",
    intro:"Войдите, и данные будут сохраняться сами после каждого изменения. Новый телефон? Войдите снова — и всё вернётся.",
    name:"Ваше имя",pass:"Пароль (минимум 6 символов)",go:"Войти / Создать аккаунт",
    hint:"Новое имя создаёт новый аккаунт. Не забудьте пароль — его нельзя восстановить.",
    signedAs:n=>`Вы вошли как <b>${n}</b>`,saved:a=>`✓ Сохранено в облаке ${a}`,saving:"Сохраняю…",never:"Ещё не сохранено",
    err:e=>`⚠ Не удалось сохранить (${e}) — попробую снова`,offline:"Нет интернета — сохраню, когда он появится",
    saveNow:"Сохранить сейчас",load:"Загрузить из облака",out:"Выйти",
    working:"Вхожу…",badName:"Введите имя",shortPass:"Пароль должен быть не короче 6 символов",wrongPass:"Неверный пароль для этого имени",
    tooMany:"Слишком много попыток — подождите минуту",net:"Нет подключения к интернету",created:"Аккаунт создан — сохраняю данные",welcome:"Вы вошли",
    found:(d,x)=>`Найдена копия в облаке от ${d}${x?" ("+x+")":""}.\n\nЗагрузить её на этот телефон? Это заменит текущие данные.\n\nОтмена = оставить данные этого телефона и сохранить их в облако.`,
    confirmLoad:d=>`Заменить всё копией из облака от ${d}?`,nothing:"В облаке пока ничего нет",
    restored:"Загружено из облака ✓",synced:"Обновлено из облака",outQ:"Выйти? Данные останутся на телефоне и в облаке.",
    now:"только что",min:n=>n+" мин назад",hr:n=>n+" ч назад",day:n=>n+" дн назад"},
  he:{title:"☁️ גיבוי בענן",off:"גיבוי בענן כמעט מוכן — יופעל בקרוב.",
    intro:"התחברו והנתונים יישמרו לבד בכל שינוי. טלפון חדש או איפוס? מתחברים שוב והכול חוזר.",
    name:"השם שלך",pass:"סיסמה (6 תווים לפחות)",go:"התחברות / יצירת חשבון",
    hint:"שם חדש יוצר חשבון חדש. אל תשכחו את הסיסמה — אי אפשר לאפס אותה.",
    signedAs:n=>`מחובר/ת בתור <b>${n}</b>`,saved:a=>`✓ נשמר בענן ${a}`,saving:"שומר…",never:"עוד לא נשמר",
    err:e=>`⚠ השמירה נכשלה (${e}) — ננסה שוב`,offline:"אין אינטרנט — יישמר כשהחיבור יחזור",
    saveNow:"שמירה עכשיו",load:"טעינה מהענן",out:"התנתקות",
    working:"מתחבר…",badName:"כתבו שם",shortPass:"הסיסמה צריכה 6 תווים לפחות",wrongPass:"סיסמה שגויה לשם הזה",
    tooMany:"יותר מדי ניסיונות — חכו דקה",net:"אין חיבור לאינטרנט",created:"החשבון נוצר — שומר את הנתונים",welcome:"מחובר",
    found:(d,x)=>`נמצא גיבוי בענן מ-${d}${x?" ("+x+")":""}.\n\nלטעון אותו לטלפון הזה? זה יחליף את מה שיש כאן עכשיו.\n\nביטול = להשאיר את הנתונים של הטלפון הזה ולשמור אותם בענן.`,
    confirmLoad:d=>`להחליף את כל מה שיש כאן בגיבוי מהענן מ-${d}?`,nothing:"אין עדיין גיבוי בענן",
    restored:"נטען מהענן ✓",synced:"עודכן מהענן",outQ:"להתנתק? הנתונים נשארים בטלפון ובענן.",
    now:"עכשיו",min:n=>`לפני ${n} דק׳`,hr:n=>`לפני ${n} שע׳`,day:n=>`לפני ${n} ימים`}
};
let opt=null,initAt=0,timer=null,busy=false,status="",lastErr="",panels=[];
const L=()=>{const l=opt&&opt.lang&&opt.lang();return T[l]||T.en;};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function sess(){try{return JSON.parse(localStorage.getItem(SESS)||"null");}catch(e){return null;}}
function setSess(s){try{s?localStorage.setItem(SESS,JSON.stringify(s)):localStorage.removeItem(SESS);}catch(e){}}
const K=k=>"probro_cloud_"+k+"_"+opt.app;
const getN=k=>+(localStorage.getItem(K(k))||0);
const setN=(k,v)=>{try{localStorage.setItem(K(k),String(v));}catch(e){}};
function emailFor(name){
  const n=name.trim().toLowerCase();
  const safe=/^[a-z0-9._-]{1,40}$/.test(n)?n:"u"+[...new TextEncoder().encode(n)].map(b=>b.toString(16).padStart(2,"0")).join("").slice(0,60);
  return safe+"@probro-saves.app";
}
async function post(url,body,form){
  const r=await fetch(url,{method:"POST",headers:{"Content-Type":form?"application/x-www-form-urlencoded":"application/json"},body:form?body:JSON.stringify(body)});
  const j=await r.json().catch(()=>({}));
  if(!r.ok)throw new Error((j.error&&j.error.message)||("HTTP "+r.status));
  return j;
}
async function auth(kind,name,pass){
  return post(`https://identitytoolkit.googleapis.com/v1/accounts:${kind}?key=${CFG.apiKey}`,{email:emailFor(name),password:pass,returnSecureToken:true});
}
async function idToken(){
  const s=sess();if(!s)throw new Error("signed out");
  if(s.idToken&&s.exp>Date.now()+60000)return s.idToken;
  const j=await post(`https://securetoken.googleapis.com/v1/token?key=${CFG.apiKey}`,"grant_type=refresh_token&refresh_token="+encodeURIComponent(s.refresh),true);
  s.idToken=j.id_token;s.refresh=j.refresh_token;s.exp=Date.now()+(+j.expires_in||3600)*1000;setSess(s);
  return s.idToken;
}
const dbUrl=(uid,tok)=>`${CFG.db.replace(/\/$/,"")}/users/${uid}/${opt.app}.json?auth=${encodeURIComponent(tok)}`;
async function fetchCloud(){
  const s=sess(),tok=await idToken();
  const r=await fetch(dbUrl(s.uid,tok),{cache:"no-store"});
  if(!r.ok)throw new Error("HTTP "+r.status);
  return r.json();   // null when nothing saved yet
}
// Two-way sync for apps that can merge (Anime List): fetch cloud, merge with this device, save both sides.
async function sync(){
  const s=sess();if(!s||!ready())return {off:true};
  if(!navigator.onLine){status="offline";paint();return {offline:true};}
  if(busy){schedule(2000);return {busy:true};}
  busy=true;status="saving";paint();if(opt.busy)opt.busy(true);
  const startedDirty=getN("dirty");let changed=false;
  try{
    const c=await fetchCloud();
    const local=localStorage.getItem(opt.key)||"";
    let merged=local;
    if(c&&c.data)merged=local?opt.merge(local,c.data):c.data;
    if(merged!==local){localStorage.setItem(opt.key,merged);changed=true;if(opt.apply)opt.apply(merged);}
    let savedAt=c&&c.savedAt||0;
    if(!c||merged!==c.data){
      const tok=await idToken();savedAt=Date.now();
      const r=await fetch(dbUrl(s.uid,tok),{method:"PUT",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({savedAt,data:merged,summary:opt.summary?opt.summary():""})});
      if(!r.ok)throw new Error("HTTP "+r.status);
    }
    setN("sync",Date.now());if(getN("dirty")===startedDirty)setN("dirty",0);else schedule(3000);
    status="saved";lastErr="";
  }catch(e){status="error";lastErr=e.message;schedule(30000);busy=false;paint();if(opt.busy)opt.busy(false);throw e;}
  busy=false;paint();if(opt.busy)opt.busy(false);
  return {changed};
}
async function push(){
  if(opt&&opt.merge){try{await sync();}catch(e){}return;}
  const s=sess();if(!s||!ready())return;
  if(!navigator.onLine){status="offline";paint();return;}
  if(busy){schedule(3000);return;}
  busy=true;status="saving";paint();
  const startedDirty=getN("dirty");
  try{
    const tok=await idToken();
    const savedAt=Date.now();
    const data=localStorage.getItem(opt.key)||"";
    const r=await fetch(dbUrl(s.uid,tok),{method:"PUT",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({savedAt,data,summary:opt.summary?opt.summary():""})});
    if(!r.ok)throw new Error("HTTP "+r.status);
    setN("sync",savedAt);if(getN("dirty")===startedDirty)setN("dirty",0);
    status="saved";lastErr="";
  }catch(e){status="error";lastErr=e.message;schedule(30000);}
  busy=false;paint();
}
function schedule(ms){clearTimeout(timer);timer=setTimeout(()=>{timer=null;push();},ms);}
function apply(c){
  try{localStorage.setItem(opt.key,c.data);}catch(e){return;}
  setN("sync",c.savedAt);setN("dirty",0);
  try{sessionStorage.setItem("probro_cloud_msg",L().restored);}catch(e){}
  location.reload();
}
function fmtDate(ts){const d=new Date(ts);return d.toLocaleDateString(undefined,{day:"numeric",month:"short",year:"numeric"})+" "+d.toLocaleTimeString(undefined,{hour:"2-digit",minute:"2-digit"});}
function ago(ts){const m=Math.floor((Date.now()-ts)/60000),t=L();if(m<1)return t.now;if(m<60)return t.min(m);if(m<1440)return t.hr(Math.floor(m/60));return t.day(Math.floor(m/1440));}
function nice(e){const t=L(),m=String(e&&e.message||e);
  if(/INVALID_PASSWORD|INVALID_LOGIN|EMAIL_EXISTS/.test(m))return t.wrongPass;
  if(/TOO_MANY/.test(m))return t.tooMany;if(/WEAK_PASSWORD/.test(m))return t.shortPass;
  if(/Failed to fetch|NetworkError|Load failed/.test(m))return t.net;return m;}
async function signIn(name,pass){
  const t=L();name=name.trim();
  if(!name)throw new Error(t.badName);if(pass.length<6)throw new Error(t.shortPass);
  let j,created=false;
  try{j=await auth("signInWithPassword",name,pass);}
  catch(e){
    if(!/INVALID_LOGIN_CREDENTIALS|EMAIL_NOT_FOUND|INVALID_PASSWORD/.test(e.message))throw new Error(nice(e));
    try{j=await auth("signUp",name,pass);created=true;}catch(e2){throw new Error(nice(/EMAIL_EXISTS/.test(e2.message)?e:e2));}
  }
  setSess({name,uid:j.localId,idToken:j.idToken,refresh:j.refreshToken,exp:Date.now()+(+j.expiresIn||3600)*1000});
  setN("sync",0);
  if(opt.merge&&!created){if(opt.toast)opt.toast(t.welcome);try{await sync();}catch(e){}return;}
  const c=created?null:await fetchCloud().catch(()=>null);
  if(c&&c.data){
    const local=localStorage.getItem(opt.key);
    const empty=!local||(opt.isEmpty&&opt.isEmpty());
    if(empty||confirm(t.found(fmtDate(c.savedAt),c.summary||""))){apply(c);return;}
  }
  if(opt.toast)opt.toast(created?t.created:t.welcome);
  push();
}
// On open: if another phone saved newer data and this one has nothing unsaved, take the newer copy.
async function checkNewer(){
  if(!sess()||!ready()||!navigator.onLine)return;
  if(opt.merge){try{await sync();}catch(e){}return;}
  try{
    const c=await fetchCloud();
    if(c&&c.data&&c.savedAt>getN("sync")+1000&&!getN("dirty")&&c.data!==localStorage.getItem(opt.key)){apply(c);return;}
    if(!c&&localStorage.getItem(opt.key))push();
    else if(getN("dirty"))push();
  }catch(e){}
}
function paint(){panels=panels.filter(p=>document.body.contains(p));panels.forEach(render);}
function render(el){
  const t=L(),s=sess();
  if(!ready()){el.innerHTML=`<div class="mini">${t.off}</div>`;return;}
  if(!s){
    el.innerHTML=`<div class="mini" style="margin-bottom:10px">${t.intro}</div>
      <input class="field" data-c="name" placeholder="${t.name}" autocomplete="username" autocapitalize="none" style="margin-bottom:8px">
      <input class="field" data-c="pass" type="password" placeholder="${t.pass}" autocomplete="current-password" style="margin-bottom:8px">
      <button class="ghostbtn brand" data-c="go">${t.go}</button>
      <div class="mini" data-c="msg" style="margin-top:6px">${t.hint}</div>`;
    const go=el.querySelector('[data-c=go]'),msg=el.querySelector('[data-c=msg]');
    go.onclick=async()=>{
      go.disabled=true;go.textContent=t.working;
      try{await signIn(el.querySelector('[data-c=name]').value,el.querySelector('[data-c=pass]').value);}
      catch(e){msg.innerHTML=`<span style="color:#ff6b5b;font-weight:700">${esc(nice(e))}</span>`;go.disabled=false;go.textContent=t.go;return;}
      paint();
    };
    return;
  }
  const sync=getN("sync");
  const line=status==="saving"?t.saving:status==="error"?esc(t.err(lastErr)):status==="offline"?t.offline:sync?t.saved(ago(sync)):t.never;
  el.innerHTML=`<div class="mini" style="margin-bottom:4px">${t.signedAs(esc(s.name))}</div>
    <div class="mini" style="margin-bottom:10px;font-weight:700;color:${status==="error"?"#ff6b5b":"#33d9a0"}">${line}</div>
    <button class="ghostbtn" data-c="now">${t.saveNow}</button>
    <button class="ghostbtn" data-c="load">${t.load}</button>
    <button class="ghostbtn" data-c="out">${t.out}</button>`;
  el.querySelector('[data-c=now]').onclick=()=>push();
  el.querySelector('[data-c=load]').onclick=async()=>{
    try{const c=await fetchCloud();if(!c||!c.data){opt.toast&&opt.toast(t.nothing);return;}
      if(confirm(t.confirmLoad(fmtDate(c.savedAt))))apply(c);}catch(e){opt.toast&&opt.toast(nice(e));}
  };
  el.querySelector('[data-c=out]').onclick=()=>{if(confirm(t.outQ)){setSess(null);status="";paint();}};
}
window.Cloud={
  init(o){
    opt=o;initAt=Date.now();
    try{const m=sessionStorage.getItem("probro_cloud_msg");if(m){sessionStorage.removeItem("probro_cloud_msg");setTimeout(()=>opt.toast&&opt.toast(m),600);}}catch(e){}
    document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="hidden"&&getN("dirty")&&sess())push();
      else if(document.visibilityState==="visible")checkNewer();});
    window.addEventListener("online",()=>{if(getN("dirty")&&sess())push();});
    setTimeout(checkNewer,1500);
    setInterval(()=>{if(status==="saved")paint();},60000);
  },
  changed(){if(!opt||!sess()||!ready()||Date.now()-initAt<2500)return;setN("dirty",Date.now());if(!timer)schedule(4000);},  // never keep postponing: saves at most ~4s after the first change
  panel(el){if(!panels.includes(el))panels.push(el);render(el);},
  signedIn:()=>!!sess()&&ready(),
  sync:()=>sync(),
  ready
};
})();
