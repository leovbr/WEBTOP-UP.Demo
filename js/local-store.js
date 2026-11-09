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
  const demoArticles = [
    {id:"demo-article-01",slug:"panduan-top-up-game-aman",title:"Panduan Top Up Game yang Aman untuk Pemula",excerpt:"Kenali langkah sederhana sebelum melakukan transaksi top up agar pengalaman bermain tetap nyaman.",category:"Panduan",thumbnail_url:"https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=85",content:"Top up game sebaiknya dilakukan dengan teliti. Pastikan nama game dan nominal yang dipilih sudah benar sebelum melanjutkan transaksi.\n\nPeriksa kembali Player ID dan Server jika game yang digunakan memerlukannya. Kesalahan data akun dapat membuat pesanan tertunda atau terkirim ke akun yang tidak sesuai.\n\nUntuk demo ini, seluruh transaksi hanya simulasi dan tidak memproses pembayaran sungguhan.",status:"published",published_at:now()},
    {id:"demo-article-02",slug:"cara-memilih-nominal-top-up",title:"Cara Memilih Nominal Top Up yang Tepat",excerpt:"Sesuaikan nominal pembelian dengan kebutuhan dan anggaran bermainmu.",category:"Tips",thumbnail_url:"https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=85",content:"Sebelum memilih nominal, tentukan terlebih dahulu item atau kebutuhan di dalam game. Bandingkan pilihan nominal yang tersedia dan perhatikan total harga pada ringkasan pesanan.\n\nHindari membeli secara impulsif. Pilih nominal sesuai kebutuhan dan anggaran yang sudah disiapkan.\n\nKonten dan harga pada website ini merupakan data contoh untuk keperluan demonstrasi.",status:"published",published_at:now()},
    {id:"demo-article-03",slug:"mengenal-player-id-dan-server",title:"Mengenal Player ID dan Server dalam Transaksi Game",excerpt:"Kenapa data Player ID dan Server perlu diperiksa sebelum checkout?",category:"Edukasi",thumbnail_url:"https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=1200&q=85",content:"Player ID digunakan untuk mengenali akun game tujuan. Pada beberapa game, informasi Server atau Zone ID juga diperlukan agar pengiriman item menuju akun yang tepat.\n\nSalin data langsung dari profil game dan periksa kembali sebelum menekan tombol checkout. Jangan membagikan kata sandi akun kepada pihak lain.\n\nWebsite demo ini tidak mengirim item sungguhan dan tidak meminta kredensial akun untuk transaksi top up biasa.",status:"published",published_at:now()},
    {id:"demo-article-04",slug:"tips-mengelola-budget-gaming",title:"Tips Mengelola Budget Gaming",excerpt:"Tetap menikmati game dengan pengeluaran yang terencana dan terkontrol.",category:"Tips",thumbnail_url:"https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?auto=format&fit=crop&w=1200&q=85",content:"Buat batas pengeluaran hiburan setiap minggu atau bulan. Pisahkan kebutuhan utama dari anggaran bermain agar aktivitas gaming tidak mengganggu keuangan pribadi.\n\nCatat transaksi dan evaluasi pembelian secara berkala. Promo bukan berarti harus selalu digunakan; beli hanya jika memang dibutuhkan.\n\nArtikel ini merupakan konten contoh yang disediakan untuk preview halaman artikel demo.",status:"published",published_at:now()}
  ];
  const demoPromos = [
    {id:"demo-banner-01",code:"DEMO10",title:"Demo Special",description:"Contoh promo untuk melihat tampilan banner dan kode diskon.",discount_type:"percent",discount_value:10,usage_limit:100,per_user_limit:1,usage_count:0,min_purchase:10000,starts_at:null,ends_at:null,is_active:true,sort_order:1,image_url:"https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1600&q=85",target_url:"index.html",created_at:now()},
    {id:"demo-banner-02",code:"GAMING5",title:"Gaming Week",description:"Contoh banner promosi bertema gaming untuk demo.",discount_type:"fixed",discount_value:5000,usage_limit:100,per_user_limit:1,usage_count:0,min_purchase:25000,starts_at:null,ends_at:null,is_active:true,sort_order:2,image_url:"https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=1600&q=85",target_url:"shop.html",created_at:now()},
    {id:"demo-banner-03",code:"WELCOME",title:"Welcome Gamer",description:"Contoh banner sambutan untuk pengunjung baru.",discount_type:"percent",discount_value:5,usage_limit:100,per_user_limit:1,usage_count:0,min_purchase:0,starts_at:null,ends_at:null,is_active:true,sort_order:3,image_url:"https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1600&q=85",target_url:"artikel.html",created_at:now()}
  ];
  const demoHomeBanners = demoPromos.map((p,i)=>({id:"demo-home-"+(i+1),title:p.title,description:p.description,image_url:p.image_url,target_url:p.target_url,is_active:true,sort_order:i+1}));
  const demoExtraGames = [
    ["arena-of-valor","Arena of Valor"],["black-clover-m","Black Clover M"],["blood-strike","Blood Strike"],
    ["call-of-duty-mobile","Call of Duty Mobile"],["delta-force","Delta Force"],["ea-sports-fc-mobile","EA SPORTS FC Mobile"],
    ["efootball","eFootball"],["genshin-impact","Genshin Impact"],["honkai-impact-3","Honkai Impact 3"],
    ["honkai-star-rail","Honkai: Star Rail"],["honor-of-kings","Honor of Kings"],
    ["league-of-legends-wild-rift","League of Legends: Wild Rift"],["lifeafter","LifeAfter"],
    ["marvel-rivals","Marvel Rivals"],["point-blank","Point Blank"],["speed-drifters","Speed Drifters"],
    ["valorant","VALORANT"],["wuthering-waves","Wuthering Waves"],["zenless-zone-zero","Zenless Zone Zero"]
  ].map((g,i)=>({id:g[0],slug:g[0],name:g[1],publisher:"",description:"Game contoh untuk preview katalog WEBTOP-UP.Demo.",icon_url:"https://raw.githubusercontent.com/leovbr/Leo-store/main/assets/icons/"+g[0]+".webp",banner_url:"https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1400&q=80",is_active:true,sort_order:20+i,created_at:now(),updated_at:now()}));
  const demoExtraProducts = demoExtraGames.flatMap(g=>[
    {id:g.slug+"-demo-small",game_slug:g.slug,amount:"Demo Pack Small",price:5000,category:"Demo Package",is_active:true,sort_order:1},
    {id:g.slug+"-demo-medium",game_slug:g.slug,amount:"Demo Pack Medium",price:15000,category:"Demo Package",is_active:true,sort_order:2},
    {id:g.slug+"-demo-large",game_slug:g.slug,amount:"Demo Pack Large",price:30000,category:"Demo Package",is_active:true,sort_order:3}
  ]);
  const defaults = {
    store_games: [], store_products: [], store_promos: demoPromos, store_articles: demoArticles,
    store_homepage_settings: [{id:1,trending_enabled:true,trending_title:"Trending",trending_limit:6,trending_slugs:[],all_games_enabled:true,all_games_title:"All Games",all_games_initial_limit:12,show_all_games_button:true,all_games_slugs:[]}],
    store_game_accounts: [], store_account_listings: [], store_home_banners: demoHomeBanners, store_images: [],
    store_chat_conversations: [], store_chat_messages: [],
    store_accounts: [
      {id:"demo-account-01",account_name:"Starter Account — Sample",game_name:"Mobile Legends",description:"Contoh listing akun untuk preview marketplace demo. Detail dan stok hanya simulasi.",price:75000,stock:2,warranty_days:1,image1_url:"https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=900&q=80",image2_url:"https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=80",sort_order:1,is_active:true,created_at:now()},
      {id:"demo-account-02",account_name:"Adventure Account — Sample",game_name:"Genshin Impact",description:"Contoh listing akun game untuk menampilkan kartu produk, foto, harga, dan detail.",price:125000,stock:1,warranty_days:1,image1_url:"https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=900&q=80",image2_url:"https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?auto=format&fit=crop&w=900&q=80",sort_order:2,is_active:true,created_at:now()},
      {id:"demo-account-03",account_name:"Competitive Account — Sample",game_name:"Free Fire",description:"Data contoh. Hubungi admin demo untuk melihat alur tombol konsultasi dan pembelian.",price:99000,stock:3,warranty_days:1,image1_url:"https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=80",image2_url:"https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=900&q=80",sort_order:3,is_active:true,created_at:now()}
    ],
    store_leaderboard: []
  };
  function seed() {
    // Seed demo tables on every page, including article pages that do not load products.js.
    for (const [table,rows] of Object.entries(defaults)) {
      if (!localStorage.getItem(PREFIX+table)) write(table,rows);
    }
    if(!localStorage.getItem(PREFIX+"seed_v2")){
      for(const table of ["store_articles","store_promos","store_home_banners","store_accounts"]){
        if(read(table,[]).length===0 && defaults[table]?.length) write(table,defaults[table]);
      }
      localStorage.setItem(PREFIX+"seed_v2","1");
    }

    const source = window.LEOOSTORE_PRODUCTS || [];
    if (!Array.isArray(source) || !source.length) return;
    let games = read("store_games", []);
    let products = read("store_products", []);
    if (!games.length) {
      games = source.map((g,i)=>({
        id:g.id || g.slug || String(i+1), slug:g.slug || slugify(g.name), name:g.name || g.slug,
        publisher:g.publisher || "", description:g.description || "",
        icon_url:"https://raw.githubusercontent.com/leovbr/Leo-store/main/assets/icons/"+((g.slug||slugify(g.name)).startsWith("roblox-")?"roblox":(g.slug||slugify(g.name)))+".webp",
        banner_url:"https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1400&q=80",
        is_active:true, sort_order:i+1, created_at:now(), updated_at:now()
      }));
      games = games.concat(demoExtraGames);
      write("store_games",games);
    } else {
      let changed=false;
      games=games.map(g=>{
        const slug=g.slug||slugify(g.name), icon=g.icon_url||"";
        const nextIcon=(!icon||icon.startsWith("assets/"))?"https://raw.githubusercontent.com/leovbr/Leo-store/main/assets/icons/"+(slug.startsWith("roblox-")?"roblox":slug)+".webp":icon;
        const nextBanner=g.banner_url||"https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1400&q=80";
        if(nextIcon!==icon||nextBanner!==g.banner_url)changed=true;
        return {...g,icon_url:nextIcon,banner_url:nextBanner};
      });
      const known=new Set(games.map(g=>g.slug));
      const missing=demoExtraGames.filter(g=>!known.has(g.slug));
      if(missing.length){games=games.concat(missing);changed=true;}
      if(changed)write("store_games",games);
    }
    if (!products.length) {
      products = source.flatMap(g=>(g.denominations||[]).map((d,i)=>({
        id:d.id || (g.slug+"-"+i), game_slug:g.slug || slugify(g.name),
        amount:d.amount || d.name || "", price:Number(d.price)||0, category:d.category||"Top Up",
        is_active:true, sort_order:i+1, created_at:now(), updated_at:now()
      })));
      products = products.concat(demoExtraProducts);
      write("store_products",products);
    } else {
      const known=new Set(products.map(p=>String(p.id)));
      const missing=demoExtraProducts.filter(p=>!known.has(String(p.id)));
      if(missing.length)write("store_products",products.concat(missing.map(p=>({...p,created_at:now(),updated_at:now()}))));
    }
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
  const isAdminContext=()=>{const path=String(window.location.pathname||"").toLowerCase();return path.includes("/admin-")||path.endsWith("/admin.html");};
  const activeSessionKey=()=>PREFIX+(isAdminContext()?"auth_session_admin":"auth_session_customer");
  const auth={
    async getSession(){return {data:{session:read(activeSessionKey().slice(PREFIX.length),null)},error:null};},
    async getUser(){const s=read(activeSessionKey().slice(PREFIX.length),null);return {data:{user:s?.user||null},error:null};},
    async signInWithPassword({email,password}={}){let user=null;if(email==="admin@leoostore.demo"&&password==="demo123")user={id:"local-admin",email,role:"admin"};else{const users=read("demo_users",[]);const match=users.find(x=>String(x.email).toLowerCase()===String(email).toLowerCase()&&x.password===password);if(match)user={id:match.id,email:match.email,role:"customer",user_metadata:match.user_metadata||{}};}if(!user)return {data:{user:null,session:null},error:{message:"Email atau password salah. Akun admin demo: admin@leoostore.demo / demo123."}};const session={access_token:"LOCAL-DEMO-SESSION",user};localStorage.setItem(activeSessionKey(),JSON.stringify(session));window.dispatchEvent(new CustomEvent("local-auth-change",{detail:{event:"SIGNED_IN"}}));return {data:{user,session},error:null};},
    async signUp({email,password,options={}}={}){const clean=String(email||"").trim().toLowerCase();if(!clean||!String(password||""))return {data:{user:null,session:null},error:{message:"Email dan password wajib diisi."}};const users=read("demo_users",[]);if(users.some(x=>String(x.email).toLowerCase()===clean))return {data:{user:null,session:null},error:{message:"Email sudah terdaftar di browser ini."}};const user={id:"local-customer-"+Date.now()+"-"+Math.random().toString(36).slice(2,7),email:clean,role:"customer",user_metadata:options.data||{}};users.push({...user,password});write("demo_users",users);const session={access_token:"LOCAL-DEMO-SESSION",user};localStorage.setItem(PREFIX+"auth_session_customer",JSON.stringify(session));window.dispatchEvent(new CustomEvent("local-auth-change",{detail:{event:"SIGNED_IN"}}));return {data:{user,session},error:null};},
    async signOut(){localStorage.removeItem(activeSessionKey());window.dispatchEvent(new CustomEvent("local-auth-change",{detail:{event:"SIGNED_OUT"}}));return {error:null};},
    onAuthStateChange(callback){const fn=e=>callback(e.detail?.event||"SIGNED_IN",read(activeSessionKey().slice(PREFIX.length),null));window.addEventListener("local-auth-change",fn);return {data:{subscription:{unsubscribe(){window.removeEventListener("local-auth-change",fn);}}}};}
  };
  const storage={from(bucket){return {
    async list(prefix=""){const files=read("files:"+bucket,{});return {data:Object.keys(files).filter(k=>k.startsWith(prefix)).map(name=>({name})),error:null};},
    async upload(path,file){return new Promise((resolve)=>{const reader=new FileReader();reader.onload=()=>{const key=PREFIX+"files:"+bucket;const files=read("files:"+bucket,{});files[path]=reader.result;write("files:"+bucket,files);resolve({data:{path},error:null});};reader.onerror=()=>resolve({data:null,error:{message:"Gagal membaca file"}});reader.readAsDataURL(file);});},
    getPublicUrl(path){const files=read("files:"+bucket,{});return {data:{publicUrl:files[path]||path}};},
    async remove(paths){const files=read("files:"+bucket,{});(paths||[]).forEach(p=>delete files[p]);write("files:"+bucket,files);return {data:paths||[],error:null};}
  };}};
  window.LEOOSTORE_DB={createClient(){return {from:builder,auth,storage,channel(name){let config=null,listener=null;const channel={on(event,filter,callback){config={event,filter,callback};return channel;},subscribe(){const table=config?.filter?.table;const known=new Map((table?read(table,[]):[]).map(row=>[String(row.id),JSON.stringify(row)]));listener=e=>{if(!table||e.detail?.table!==table)return;const rows=read(table,[]);const filterText=config?.filter?.filter||"";const parts=filterText.split("=eq.");const field=parts.length===2?parts[0]:null;const value=parts.length===2?parts[1]:null;for(const row of rows){if(field&&String(row[field])!==String(value))continue;const id=String(row.id);const signature=JSON.stringify(row);const old=known.get(id);if(old!==signature){const type=old===undefined?"INSERT":"UPDATE";if(config.event==="*"||config.event===type||(!config.event&&type==="INSERT"))config.callback?.({eventType:type,new:clone(row),old:old?JSON.parse(old):null});known.set(id,signature);}}for(const id of [...known.keys()])if(!rows.some(row=>String(row.id)===id))known.delete(id);};window.addEventListener("webtopup:change",listener);return {unsubscribe(){if(listener)window.removeEventListener("webtopup:change",listener);}};}};return channel;},removeChannel(channel){channel?.unsubscribe?.();}};}};
  window.addEventListener("storage",e=>{if(e.key?.startsWith(PREFIX))window.dispatchEvent(new CustomEvent("webtopup:change",{detail:{key:e.key,table:e.key.slice(PREFIX.length)}}));});
  seed();
})();