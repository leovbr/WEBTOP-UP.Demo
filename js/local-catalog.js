/* WEBTOP-UP.Demo — build storefront catalog from browser Local Storage. */
(() => {
  const parse = (key, fallback=[]) => { try { return JSON.parse(localStorage.getItem("WEBTOPUP_DEMO:"+key)) || fallback; } catch { return fallback; } };
  window.LEOOSTORE_CATALOG = {
    async getCatalog(legacy=[]) {
      window.LEOOSTORE_SEED_LOCAL?.();
      const games = parse("store_games");
      const products = parse("store_products");
      if (!games.length) return Array.isArray(legacy) ? legacy : [];
      return games.filter(g=>g.is_active!==false).sort((a,b)=>(Number(a.sort_order)||0)-(Number(b.sort_order)||0)).map(g=>({
        id:String(g.id||g.slug), slug:g.slug, name:g.name, image:g.icon_url||g.image||"",
        icon:g.icon||"🎮", publisher:g.publisher||"", description:g.description||"",
        banner:g.banner_url||"", server_required:g.server_required, account_type:g.account_type,
        denominations:products.filter(p=>p.game_slug===g.slug&&p.is_active!==false)
          .sort((a,b)=>(Number(a.sort_order)||0)-(Number(b.sort_order)||0))
          .map(p=>({id:String(p.id),amount:p.amount||"",price:Number(p.price)||0,category:p.category||"Top Up"}))
      }));
    }
  };
})();