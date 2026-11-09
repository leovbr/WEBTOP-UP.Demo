/* Local catalog adapter; all catalog data is stored in this browser. */
window.LEOOSTORE_CATALOG={async getCatalog(legacy=[]){return Array.isArray(legacy)&&legacy.length?legacy:(window.LEOOSTORE_PRODUCTS||[]);}};
