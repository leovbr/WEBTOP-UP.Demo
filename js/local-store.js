/* =========================================================
   WEBTOP-UP.Demo — LOCAL STORAGE DATABASE
   database lokal-compatible demo adapter. No network/database calls.
   Data is isolated to this browser and this origin.
========================================================= */
(() => {
  "use strict";
  const PREFIX = "WEBTOPUP_DEMO:";
  const read = (key, fallback=[]) => { try { const v=JSON.parse(localStorage.getItem(PREFIX+key)); return v ?? fallback; } catch { return fallback; } };
  const write = (key, value) => { localStorage.setItem(PREFIX+key, JSON.stringify(value)); window.dispatchEvent(new CustomEvent("webtopup:change",{detail:{table:key}})); };
  const clone = value => JSON.parse(JSON.stringify(value));
  const now = () => new Date().toISOString();
  const slugify = s => String(s||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
  const defaults = {
    store_games: [], store_products: [], store_promos: [], store_articles: [],
    store_homepage_settings: [{id:1,trending_enabled:true,trending_title:"Trending",trending_limit:6,trending_slugs:[],all_games_enabled:true,all_games_title:"All Games",all_games_initial_limit:12,show_all_games_button:true,all_games_slugs:[]}],
    store_game_accounts: [], store_account_listings: [], store_home_banners: [], store_images: [],
    store_chat_conversations: [], store_chat_messages: [], store_accounts: [], store_leaderboard: []
  };
  function seed() {
    const source = window.LEOOSTORE_PRODUCTS || [];
    if (!Array.isArray(source) || !source.length) return;
    let games = read("store_games", []);
    let products = read("store_products", []);
    if (!games.length) {
      games = source.map((g,i)=>({
        id:g.id || g.slug || String(i+1), slug:g.slug || slugify(g.name), name:g.name || g.slug,
        publisher:g.publisher || "", description:g.description || "", icon_url:g.icon_url || g.image || ("assets/icons/"+(g.slug||slugify(g.name))+".webp"),
        banner_url:g.banner_url || "", is_active:true, sort_order:i+1, created_at:now(), updated_at:now()
      }));
      write("store_games",games);
    }
    if (!products.length) {
      products = source.flatMap(g=>(g.denominations||[]).map((d,i)=>({
        id:d.id || (g.slug+"-"+i), game_slug:g.slug || slugify(g.name),
        amount:d.amount || d.name || "", price:Number(d.price)||0, category:d.category||"Top Up",
        is_active:true, sort_order:i+1, created_at:now(), updated_at:now()
      })));
      write("store_products",products);
    }
    for (const [table,rows] of Object.entries(defaults)) if (!localStorage.getItem(PREFIX+table)) write(table,rows);
  }
  window.LEOOSTORE_SEED_LOCAL = seed;
  const tables = new Set(Object.keys(defaults));
  function builder(table) {
    let action="select", columns="*", filters=[], orders=[], limitCount=null, payload=null, singleMode="";
    const api = {
      select(cols="*"){ if(action==="select") columns=cols; return api; },
      insert(rows){action="insert";payload=Array.isArray(rows)?rows:[rows];return api;},
      upsert(rows){action="upsert";payload=Array.isArray(rows)?rows:[rows];return api;},
      update(row){action="update";payload=row||{};return api;},
      delete(){action="delete";return api;},
      eq(k,v){filters.push(r=>String(r?.[k]??"")===String(v??""));return api;},
      neq(k,v){filters.push(r=>String(r?.[k]??"")!==String(v??""));return api;},
      is(k,v){filters.push(r=>r?.[k]===v);return api;},
      not(k,op,v){filters.push(r=>op==="is" ? r?.[k]!==v : op==="eq" ? r?.[k]!==v : true);return api;},
      in(k,values){filters.push(r=>values.includes(r?.[k]));return api;},
      gte(k,v){filters.push(r=>String(r?.[k]??"")>=String(v));return api;},
      lte(k,v){filters.push(r=>String(r?.[k]??"")<=String(v));return api;},
      gt(k,v){filters.push(r=>Number(r?.[k])>Number(v));return api;},
      lt(k,v){filters.push(r=>Number(r?.[k])<Number(v));return api;},
      ilike(k,v){const q=String(v).replace(/%/g,"").toLowerCase();filters.push(r=>String(r?.[k]||"").toLowerCase().includes(q));return api;},
      like(k,v){return api.ilike(k,v);},
      order(k,{ascending=true,nullsFirst=false}={}){orders.push({k,ascending,nullsFirst});return api;},
      limit(n){limitCount=Number(n);return api;},
      range(a,b){limitCount=Math.max(0,Number(b)-Number(a)+1);return api;},
      single(){singleMode="single";return api;},
      maybeSingle(){singleMode="maybe";return api;},
      then(resolve,reject){return execute().then(resolve,reject);},
      catch(reject){return execute().catch(reject);},
      finally(fn){return execute().finally(fn);}
    };
    async function execute(){
      seed();
      if(!tables.has(table)) return {data:null,error:{message:"Tabel lokal tidak dikenal: "+table,code:"LOCAL_TABLE_MISSING"}};
      let rows=read(table,defaults[table]||[]);
      const matches=r=>filters.every(fn=>{try{return fn(r)}catch{return false}});
      let result=[];
      if(action==="select") result=rows.filter(matches);
      if(action==="insert"){
        const incoming=payload.map(x=>({...x,id:x.id??(table+"-"+Date.now()+"-"+Math.random().toString(36).slice(2,7)),created_at:x.created_at||now(),updated_at:x.updated_at||now()}));
        rows.push(...incoming);write(table,rows);result=incoming;
      }
      if(action==="upsert"){
        result=payload.map(x=>{const idx=rows.findIndex(r=>(x.id!=null&&String(r.id)===String(x.id))||(x.slug&&r.slug===x.slug)||(x.code&&r.code===x.code));if(idx>=0){rows[idx]={...rows[idx],...x,updated_at:now()};return rows[idx];}const item={...x,id:x.id??(table+"-"+Date.now()+"-"+Math.random().toString(36).slice(2,7)),created_at:x.created_at||now(),updated_at:now()};rows.push(item);return item;});write(table,rows);
      }
      if(action==="update"){result=rows.filter(matches).map(r=>{Object.assign(r,payload,{updated_at:now()});return r;});write(table,rows);}
      if(action==="delete"){result=rows.filter(matches);rows=rows.filter(r=>!matches(r));write(table,rows);}
      if(action==="select"||action==="delete") for(const o of orders) result.sort((a,b)=>{const av=a?.[o.k],bv=b?.[o.k];if(av==null||bv==null)return av==null?(o.nullsFirst?-1:1):(o.nullsFirst?1:-1);const c=typeof av==="number"&&typeof bv==="number"?av-bv:String(av).localeCompare(String(bv));return o.ascending?c:-c;});
      if(limitCount!=null) result=result.slice(0,limitCount);
      if(singleMode==="single") return {data:result[0]||null,error:result.length?null:{message:"No rows found",code:"PGRST116"}};
      if(singleMode==="maybe") return {data:result[0]||null,error:null};
      return {data:clone(result),error:null,count:result.length};
    }
    return api;
  }
  const sessionKey=PREFIX+"auth_session";
  const auth={
    async getSession(){return {data:{session:read("auth_session",null)},error:null};},
    async getUser(){const s=read("auth_session",null);return {data:{user:s?.user||null},error:null};},
    async signInWithPassword({email,password}={}){if(email==="admin@leoostore.demo"&&password==="demo123"){const user={id:"local-admin",email,role:"admin"};const session={access_token:"LOCAL-DEMO-SESSION",user};write("auth_session",session);return {data:{user,session},error:null};}return {data:{user:null,session:null},error:{message:"Login demo: gunakan admin@leoostore.demo / demo123"}};},
    async signOut(){localStorage.removeItem(sessionKey);window.dispatchEvent(new CustomEvent("local-auth-change"));return {error:null};},
    onAuthStateChange(callback){const fn=()=>callback("SIGNED_IN",read("auth_session",null));window.addEventListener("local-auth-change",fn);return {data:{subscription:{unsubscribe(){window.removeEventListener("local-auth-change",fn);}}}};}
  };
  const storage={from(bucket){return {
    async list(prefix=""){const files=read("files:"+bucket,{});return {data:Object.keys(files).filter(k=>k.startsWith(prefix)).map(name=>({name})),error:null};},
    async upload(path,file){return new Promise((resolve)=>{const reader=new FileReader();reader.onload=()=>{const key=PREFIX+"files:"+bucket;const files=read("files:"+bucket,{});files[path]=reader.result;write("files:"+bucket,files);resolve({data:{path},error:null});};reader.onerror=()=>resolve({data:null,error:{message:"Gagal membaca file"}});reader.readAsDataURL(file);});},
    getPublicUrl(path){const files=read("files:"+bucket,{});return {data:{publicUrl:files[path]||path}};},
    async remove(paths){const files=read("files:"+bucket,{});(paths||[]).forEach(p=>delete files[p]);write("files:"+bucket,files);return {data:paths||[],error:null};}
  };}};
  window.LEOOSTORE_DB={createClient(){return {from:builder,auth,storage,channel(){return {on(){return this;},subscribe(){return {unsubscribe(){}};}};},removeChannel(){}};}};
  window.addEventListener("storage",e=>{if(e.key?.startsWith(PREFIX))window.dispatchEvent(new CustomEvent("webtopup:change",{detail:{key:e.key}}));});
  seed();
})();