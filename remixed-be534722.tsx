import { useState, useEffect, useMemo, useRef } from "react";

const { useState, useEffect, useMemo, useRef } = React;

// ── TRANSLATIONS ────────────────────────────────────────────────────────────
const T = {
  ar: {
    dir:"rtl", appName:"BoxFinder",
    tagline:"أداة البحث عن زجاج الحماية",
    searchPlaceholder:"ابحث عن موديلك... (Galaxy A54, iPhone 15...)",
    brands:"الماركات", allPhones:"الكل", curved:"منحنية ⬡", flat:"مسطحة ▭",
    totalPhones:"إجمالي الهواتف", curvedScreens:"شاشات منحنية", flatScreens:"شاشات مسطحة",
    boxNumber:"رقم البوكس", screenType:"نوع الشاشة", curvedScreen:"شاشة منحنية", flatScreen:"شاشة مسطحة",
    home:"الرئيسية", back:"← رجوع", contact:"للتواصل",
    login:"تسجيل الدخول", register:"إنشاء حساب", logout:"خروج",
    email:"البريد الإلكتروني", password:"كلمة السر",
    firstName:"الاسم", lastName:"اللقب", phone:"رقم الهاتف",
    shopName:"اسم المحل", shopLocation:"مكان المحل",
    loginBtn:"دخول", registerBtn:"تسجيل",
    haveAccount:"لديك حساب؟", noAccount:"ليس لديك حساب؟",
    adminPanel:"لوحة الأدمن", users:"المستخدمون", phonesTab:"الهواتف",
    brandsTab:"البراندات", uploadExcel:"رفع Excel", contactTab:"التواصل",
    addPhone:"إضافة هاتف", searchAdmin:"ابحث عن هاتف...",
    save:"حفظ", cancel:"إلغاء", delete:"حذف", edit:"تعديل",
    results:"نتائج البحث", noResults:"لا توجد نتائج",
    uploadMsg:"ارفع ملف Excel بتنسيق: Brand | Model | Box | Image URL",
    uploadWarning:"⚠️ سيتم استبدال كل البيانات الحالية",
    chooseFile:"اختر ملف Excel", phoneCount:"هاتف", modelCount:"موديل",
    darkMode:"وضع مظلم", lightMode:"وضع ساطع",
    loading:"جاري التحميل...", error:"خطأ", success:"تم بنجاح",
    noImage:"لا توجد صورة", loadError:"تعذر تحميل قاعدة البيانات",
  },
  fr: {
    dir:"rtl", appName:"BoxFinder",
    tagline:"Outil de recherche de verre de protection",
    searchPlaceholder:"Rechercher votre modèle... (Galaxy A54, iPhone 15...)",
    brands:"Marques", allPhones:"Tout", curved:"Incurvé ⬡", flat:"Plat ▭",
    totalPhones:"Total téléphones", curvedScreens:"Écrans incurvés", flatScreens:"Écrans plats",
    boxNumber:"Numéro de boîte", screenType:"Type d'écran", curvedScreen:"Écran incurvé", flatScreen:"Écran plat",
    home:"Accueil", back:"← Retour", contact:"Contact",
    login:"Connexion", register:"Créer un compte", logout:"Déconnexion",
    email:"Email", password:"Mot de passe",
    firstName:"Prénom", lastName:"Nom", phone:"Téléphone",
    shopName:"Nom du magasin", shopLocation:"Emplacement du magasin",
    loginBtn:"Se connecter", registerBtn:"S'inscrire",
    haveAccount:"Déjà un compte?", noAccount:"Pas de compte?",
    adminPanel:"Panneau Admin", users:"Utilisateurs", phonesTab:"Téléphones",
    brandsTab:"Marques", uploadExcel:"Importer Excel", contactTab:"Contact",
    addPhone:"Ajouter téléphone", searchAdmin:"Rechercher...",
    save:"Enregistrer", cancel:"Annuler", delete:"Supprimer", edit:"Modifier",
    results:"Résultats", noResults:"Aucun résultat",
    uploadMsg:"Importez un fichier Excel: Brand | Model | Box | Image URL",
    uploadWarning:"⚠️ Toutes les données actuelles seront remplacées",
    chooseFile:"Choisir un fichier Excel", phoneCount:"téléphone", modelCount:"modèle",
    darkMode:"Mode sombre", lightMode:"Mode clair",
    loading:"Chargement...", error:"Erreur", success:"Succès",
    noImage:"Pas d'image", loadError:"Impossible de charger la base de données",
  },
  en: {
    dir:"ltr", appName:"BoxFinder",
    tagline:"Protection Glass Search Tool",
    searchPlaceholder:"Search your model... (Galaxy A54, iPhone 15...)",
    brands:"Brands", allPhones:"All", curved:"Curved ⬡", flat:"Flat ▭",
    totalPhones:"Total phones", curvedScreens:"Curved screens", flatScreens:"Flat screens",
    boxNumber:"Box Number", screenType:"Screen Type", curvedScreen:"Curved Screen", flatScreen:"Flat Screen",
    home:"Home", back:"← Back", contact:"Contact",
    login:"Login", register:"Create Account", logout:"Logout",
    email:"Email", password:"Password",
    firstName:"First Name", lastName:"Last Name", phone:"Phone",
    shopName:"Shop Name", shopLocation:"Shop Location",
    loginBtn:"Login", registerBtn:"Register",
    haveAccount:"Have an account?", noAccount:"No account?",
    adminPanel:"Admin Panel", users:"Users", phonesTab:"Phones",
    brandsTab:"Brands", uploadExcel:"Upload Excel", contactTab:"Contact",
    addPhone:"Add Phone", searchAdmin:"Search...",
    save:"Save", cancel:"Cancel", delete:"Delete", edit:"Edit",
    results:"Search Results", noResults:"No results found",
    uploadMsg:"Upload Excel file: Brand | Model | Box | Image URL",
    uploadWarning:"⚠️ All current data will be replaced",
    chooseFile:"Choose Excel File", phoneCount:"phone", modelCount:"model",
    darkMode:"Dark mode", lightMode:"Light mode",
    loading:"Loading...", error:"Error", success:"Success",
    noImage:"No image", loadError:"Could not load database",
  }
};

const ADMIN_USERNAME = "yassinoghazaouet";
const ADMIN_PASSWORD = "Ghazaouet13400";

// ⚠️ IMPORTANT: This points to wherever you host phones.json (see the
// separate database file). On a real deploy this should be your API
// endpoint, e.g. "https://yourapi.com/api/phones" or "/data/phones.json".
const PHONES_DATA_URL = "/data/phones.json";
const BRANDS_DATA_URL = "/data/brands.json";

// ── HELPERS ───────────────────────────────────────────────────────────────────
function BoxBadge({ box, large }) {
  const isCurved = box.startsWith("P");
  return (
    <span style={{
      display:"inline-block",
      padding: large ? "10px 32px" : "4px 14px",
      borderRadius:24, fontWeight:800,
      fontSize: large ? 24 : 12,
      letterSpacing: large ? 2 : 0.5,
      background: isCurved ? "linear-gradient(135deg,#3B82F6,#6366F1)" : "linear-gradient(135deg,#10B981,#059669)",
      color:"#fff",
      boxShadow: isCurved ? "0 4px 20px #3B82F655" : "0 4px 20px #10B98155",
    }}>{box}</span>
  );
}

function ThemeToggle({ dark, setDark }) {
  return (
    <button onClick={() => setDark(d => !d)} style={{
      background:"transparent", border:"1px solid currentColor", borderRadius:20,
      padding:"4px 12px", cursor:"pointer", fontSize:13, color:"inherit", opacity:.7
    }}>{dark ? "☀️" : "🌙"}</button>
  );
}

function LangSelector({ lang, setLang }) {
  return (
    <div style={{ display:"flex", gap:4 }}>
      {["ar","fr","en"].map(l => (
        <button key={l} onClick={() => setLang(l)} style={{
          background: lang===l ? "#3B82F6" : "transparent",
          border:`1px solid ${lang===l?"#3B82F6":"#3A3A5A"}`,
          color: lang===l ? "#fff" : "#7A7A9A",
          borderRadius:6, padding:"3px 8px", cursor:"pointer", fontSize:11, fontWeight:700
        }}>{l.toUpperCase()}</button>
      ))}
    </div>
  );
}

// ── DATA LOADING HOOK ───────────────────────────────────────────────────────
// Replace this with a real fetch() to your backend/API in production.
function useDatabase() {
  const [phones, setPhones] = useState([]);
  const [brandsLogos, setBrandsLogos] = useState({});
  const [status, setStatus] = useState("loading"); // loading | ready | error

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [phonesRes, brandsRes] = await Promise.all([
          fetch(PHONES_DATA_URL),
          fetch(BRANDS_DATA_URL).catch(() => null),
        ]);
        if (!phonesRes.ok) throw new Error("phones fetch failed");
        const phonesJson = await phonesRes.json();
        const brandsJson = brandsRes && brandsRes.ok ? await brandsRes.json() : {};
        if (!cancelled) {
          setPhones(phonesJson);
          setBrandsLogos(brandsJson);
          setStatus("ready");
        }
      } catch (e) {
        if (!cancelled) setStatus("error");
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  return { phones, brandsLogos, status, setPhones, setBrandsLogos };
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [lang, setLang] = useState("ar");
  const [dark, setDark] = useState(true);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authPage, setAuthPage] = useState("login");

  const [page, setPage] = useState("home");
  const [selectedBrandId, setSelectedBrandId] = useState(null);
  const [selectedPhone, setSelectedPhone] = useState(null);
  const [searchGlobal, setSearchGlobal] = useState("");
  const [searchBrand, setSearchBrand] = useState("");
  const [filterType, setFilterType] = useState("all");
  const searchRef = useRef(null);

  const t = T[lang] || T.ar;
  const { phones: allPhones, brandsLogos, status } = useDatabase();

  useEffect(() => {
    document.body.dir = t.dir;
  }, [t.dir]);

  useEffect(() => { if (page==="home" && searchRef.current) searchRef.current.focus(); }, [page]);

  const brands = useMemo(() => {
    const ids = [...new Set(allPhones.map(p => p.brandId))];
    return ids.map(id => ({
      id,
      name: id.charAt(0).toUpperCase() + id.slice(1).replace(/_/g," "),
      logo: brandsLogos[id] || "",
      count: allPhones.filter(p => p.brandId === id).length,
    })).filter(b => b.count > 0).sort((a,b) => a.name.localeCompare(b.name));
  }, [allPhones, brandsLogos]);

  const brandPhones = useMemo(() =>
    selectedBrandId ? allPhones.filter(p => p.brandId === selectedBrandId) : [],
    [allPhones, selectedBrandId]
  );

  const filteredBrandPhones = useMemo(() => {
    let list = brandPhones;
    if (filterType !== "all") list = list.filter(p => p.type === filterType);
    if (searchBrand.trim()) list = list.filter(p => p.model.toLowerCase().includes(searchBrand.toLowerCase()));
    return list;
  }, [brandPhones, searchBrand, filterType]);

  const globalResults = useMemo(() => {
    const q = searchGlobal.trim().toLowerCase();
    if (!q || q.length < 2) return [];
    return allPhones.filter(p =>
      p.model.toLowerCase().includes(q) ||
      brands.find(b => b.id === p.brandId)?.name.toLowerCase().includes(q)
    ).slice(0, 24);
  }, [searchGlobal, allPhones, brands]);

  function nav(pg, opts = {}) {
    setPage(pg);
    if (opts.brandId !== undefined) { setSelectedBrandId(opts.brandId); setSearchBrand(""); setFilterType("all"); }
    if (opts.phone !== undefined) setSelectedPhone(opts.phone);
    window.scrollTo(0, 0);
  }

  const C = dark ? {
    bg:"#07070F", nav:"#0C0C1A", card:"#0F0F1E", border:"#1A1A2E",
    cardHover:"#141428", text:"#E2E2F0", sub:"#3A3A5A", input:"#141428",
    inputBorder:"#1E1E32", accent:"#3B82F6", btnBg:"#141428", btnColor:"#7A7A9A",
  } : {
    bg:"#F0F4FF", nav:"#FFFFFF", card:"#FFFFFF", border:"#E0E8FF",
    cardHover:"#F8F9FF", text:"#1A1A2E", sub:"#6B7280", input:"#F8F9FF",
    inputBorder:"#CBD5E1", accent:"#3B82F6", btnBg:"#F0F4FF", btnColor:"#4B5563",
  };

  const S = {
    app:{ minHeight:"100vh", background:C.bg, color:C.text, transition:"all .3s" },
    nav:{ background:C.nav, borderBottom:`1px solid ${C.border}`, padding:"0 20px",
          display:"flex", alignItems:"center", justifyContent:"space-between",
          height:56, position:"sticky", top:0, zIndex:100,
          boxShadow: dark?"none":"0 2px 10px #0001" },
    logo:{ fontSize:20, fontWeight:900, color:C.accent, cursor:"pointer", userSelect:"none" },
    con:{ maxWidth:1200, margin:"0 auto", padding:"24px 16px" },
    inp:{ width:"100%", padding:"12px 16px", borderRadius:12, border:`1px solid ${C.inputBorder}`,
          background:C.input, color:C.text, fontSize:14, outline:"none", boxSizing:"border-box" },
    btn:{ padding:"8px 18px", borderRadius:9, border:"none", cursor:"pointer", fontSize:13, fontWeight:700 },
    card:{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:"18px" },
    lbl:{ fontSize:10, fontWeight:700, color:C.sub, letterSpacing:3, textTransform:"uppercase", marginBottom:14 },
    navBtn:{ background:C.btnBg, border:`1px solid ${C.border}`, color:C.btnColor,
             padding:"6px 12px", borderRadius:8, cursor:"pointer", fontSize:12, fontWeight:600 },
    bc:{ display:"flex", alignItems:"center", gap:8, marginBottom:20, fontSize:12, color:C.sub, flexWrap:"wrap" },
    bcLink:{ color:C.accent, cursor:"pointer", fontWeight:600 },
  };

  // ── LOADING / ERROR STATES ────────────────────────────────────────────────
  if (status === "loading") return (
    <div style={{ ...S.app, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:12 }}>
      <div style={{ width:32, height:32, border:`3px solid ${C.border}`, borderTopColor:C.accent, borderRadius:"50%", animation:"spin .8s linear infinite" }}/>
      <span style={{ color:C.sub, fontSize:14 }}>{t.loading}</span>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (status === "error") return (
    <div style={{ ...S.app, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:12, padding:20, textAlign:"center" }}>
      <div style={{ fontSize:40 }}>⚠️</div>
      <span style={{ color:C.sub, fontSize:14 }}>{t.loadError}</span>
      <code style={{ fontSize:11, color:C.sub, background:C.card, padding:"8px 12px", borderRadius:8 }}>{PHONES_DATA_URL}</code>
    </div>
  );

  if (!user) {
    return <AuthPage t={t} dark={dark} setDark={setDark} lang={lang} setLang={setLang}
      authPage={authPage} setAuthPage={setAuthPage}
      onLogin={(userData, admin) => { setUser(userData); setIsAdmin(admin); }}
    />;
  }

  // ── PHONE DETAIL ───────────────────────────────────────────────────────────
  if (page==="phone" && selectedPhone) {
    const brand = brands.find(b=>b.id===selectedPhone.brandId);
    const isCurved = selectedPhone.type==="curved";
    return (
      <div style={S.app}>
        <nav style={S.nav}>
          <span style={S.logo} onClick={()=>nav("home")}>📦 {t.appName}</span>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <LangSelector lang={lang} setLang={setLang} />
            <ThemeToggle dark={dark} setDark={setDark} />
            <button style={S.navBtn} onClick={()=>nav("brand",{brandId:selectedPhone.brandId})}>← {t.back}</button>
          </div>
        </nav>
        <div style={{ ...S.con, maxWidth:560 }}>
          <div style={S.bc}>
            <span style={S.bcLink} onClick={()=>nav("home")}>{t.home}</span><span>›</span>
            <span style={S.bcLink} onClick={()=>nav("brand",{brandId:selectedPhone.brandId})}>{brand?.name}</span><span>›</span>
            <span style={{color:C.text}}>{selectedPhone.model}</span>
          </div>
          <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:22, display:"flex", alignItems:"center", justifyContent:"center", height:300, marginBottom:12, overflow:"hidden" }}>
            {selectedPhone.img
              ? <img src={selectedPhone.img} alt={selectedPhone.model} style={{ maxHeight:280, maxWidth:"90%", objectFit:"contain" }} onError={e=>e.target.style.display="none"} />
              : <div style={{ textAlign:"center", color:C.sub }}><div style={{ fontSize:56 }}>📱</div><div style={{ fontSize:12, marginTop:8 }}>{t.noImage}</div></div>
            }
          </div>
          <div style={{ ...S.card, borderRadius:18 }}>
            <div style={{ fontSize:11, color:C.sub, marginBottom:4 }}>{brand?.name}</div>
            <h1 style={{ margin:"0 0 18px", fontSize:22, fontWeight:900, color:C.text }}>{selectedPhone.model}</h1>
            <div style={{ background:isCurved?dark?"#0A1428":"#EFF6FF":dark?"#041A0F":"#ECFDF5", border:`1px solid ${isCurved?dark?"#1E3A6A":"#BFDBFE":dark?"#0A3A1A":"#A7F3D0"}`, borderRadius:14, padding:"18px 20px", marginBottom:12, textAlign:"center" }}>
              <div style={{ fontSize:10, color:C.sub, letterSpacing:3, marginBottom:10, textTransform:"uppercase" }}>{t.boxNumber}</div>
              <BoxBadge box={selectedPhone.box} large={true} />
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 16px", background:C.input, borderRadius:10, border:`1px solid ${C.border}` }}>
              <span style={{fontSize:20}}>{isCurved?"⬡":"▭"}</span>
              <div>
                <div style={{fontSize:11,color:C.sub}}>{t.screenType}</div>
                <div style={{fontSize:14,fontWeight:700,color:isCurved?"#60A5FA":"#34D399"}}>{isCurved?t.curvedScreen:t.flatScreen}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── BRAND PAGE ─────────────────────────────────────────────────────────────
  if (page==="brand" && selectedBrandId) {
    const brand = brands.find(b=>b.id===selectedBrandId);
    return (
      <div style={S.app}>
        <nav style={S.nav}>
          <span style={S.logo} onClick={()=>nav("home")}>📦 {t.appName}</span>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <LangSelector lang={lang} setLang={setLang} />
            <ThemeToggle dark={dark} setDark={setDark} />
            <button style={{ ...S.navBtn, color:"#F87171" }} onClick={()=>{setUser(null);setIsAdmin(false);}}>→</button>
          </div>
        </nav>
        <div style={S.con}>
          <div style={S.bc}><span style={S.bcLink} onClick={()=>nav("home")}>{t.home}</span><span>›</span><span style={{color:C.text}}>{brand?.name}</span></div>
          <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:18 }}>
            {brand?.logo?<img src={brand.logo} alt={brand.name} style={{height:38,objectFit:"contain"}} onError={e=>e.target.style.display="none"} />:<div style={{width:38,height:38,background:C.border,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>📱</div>}
            <div>
              <h1 style={{margin:0,fontSize:22,fontWeight:900,color:C.text}}>{brand?.name}</h1>
              <span style={{fontSize:12,color:C.sub}}>{brandPhones.length} {t.modelCount}</span>
            </div>
          </div>
          <input style={{...S.inp,marginBottom:10}} placeholder={"🔍 "+t.searchPlaceholder} value={searchBrand} onChange={e=>setSearchBrand(e.target.value)} autoFocus />
          <div style={{display:"flex",gap:7,marginBottom:18}}>
            {[["all",t.allPhones],["curved",t.curved],["flat",t.flat]].map(([v,l])=>(
              <button key={v} style={{...S.btn,fontSize:12,padding:"6px 14px",background:filterType===v?C.accent:C.card,color:filterType===v?"#fff":C.btnColor,border:`1px solid ${filterType===v?C.accent:C.border}`}} onClick={()=>setFilterType(v)}>{l}</button>
            ))}
          </div>
          <div style={S.lbl}>{filteredBrandPhones.length} {t.modelCount}</div>
          {filteredBrandPhones.length===0
            ?<div style={{color:C.sub,padding:28,textAlign:"center"}}>{t.noResults}</div>
            :<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(165px,1fr))",gap:12}}>
              {filteredBrandPhones.map(phone=>(
                <div key={phone.id} style={{...S.card,cursor:"pointer",transition:"all .2s",padding:14,borderRadius:14}}
                  onMouseEnter={e=>{e.currentTarget.style.background=C.cardHover;e.currentTarget.style.borderColor=C.accent;e.currentTarget.style.transform="translateY(-2px)";}}
                  onMouseLeave={e=>{e.currentTarget.style.background=C.card;e.currentTarget.style.borderColor=C.border;e.currentTarget.style.transform="none";}}
                  onClick={()=>nav("phone",{phone})}>
                  <div style={{height:120,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:10,background:C.input,borderRadius:10,overflow:"hidden"}}>
                    {phone.img?<img src={phone.img} alt={phone.model} style={{maxHeight:110,maxWidth:"90%",objectFit:"contain"}} onError={e=>e.target.style.display="none"} />:<div style={{fontSize:28,opacity:.3}}>📱</div>}
                  </div>
                  <div style={{fontSize:12,fontWeight:700,color:C.text,marginBottom:7,lineHeight:1.3}}>{phone.model}</div>
                  <BoxBadge box={phone.box} />
                </div>
              ))}
            </div>
          }
        </div>
      </div>
    );
  }

  // ── HOME PAGE ──────────────────────────────────────────────────────────────
  return (
    <div style={S.app}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}`}</style>
      <nav style={S.nav}>
        <span style={S.logo}>📦 {t.appName}</span>
        <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
          <LangSelector lang={lang} setLang={setLang} />
          <ThemeToggle dark={dark} setDark={setDark} />
          <span style={{fontSize:12,color:C.sub}}>{user?.firstName}</span>
          <button style={{...S.navBtn,color:"#F87171"}} onClick={()=>{setUser(null);setIsAdmin(false);}}>→</button>
        </div>
      </nav>
      <div style={S.con}>
        <div style={{textAlign:"center",padding:"32px 0 24px"}}>
          <div style={{fontSize:10,color:C.accent,letterSpacing:4,fontWeight:700,marginBottom:10}}>ENCAPSULATED GLASS FINDER</div>
          <h1 style={{margin:"0 0 6px",fontSize:30,fontWeight:900,color:C.text,lineHeight:1.2}}>
            {t.appName}<br/>
            <span style={{background:"linear-gradient(90deg,#3B82F6,#8B5CF6)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",fontSize:18,fontWeight:600}}>{t.tagline}</span>
          </h1>
          <p style={{color:C.sub,fontSize:12,margin:"8px 0 0"}}>{allPhones.length.toLocaleString()} {t.phoneCount} · {brands.length} {t.brands}</p>
        </div>

        <input ref={searchRef} style={{...S.inp,marginBottom:14,fontSize:15}} placeholder={"🔍 "+t.searchPlaceholder} value={searchGlobal} onChange={e=>setSearchGlobal(e.target.value)} />

        {searchGlobal.trim().length>=2&&(
          <div style={{marginBottom:28,animation:"fadeIn .3s ease"}}>
            <div style={S.lbl}>{t.results} ({globalResults.length})</div>
            {globalResults.length===0
              ?<div style={{color:C.sub,padding:20,textAlign:"center",background:C.card,borderRadius:12}}>{t.noResults}</div>
              :<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(165px,1fr))",gap:12}}>
                {globalResults.map(phone=>{
                  const bname=brands.find(b=>b.id===phone.brandId)?.name||phone.brandId;
                  return(
                    <div key={phone.id} style={{...S.card,cursor:"pointer",transition:"all .2s",padding:14,borderRadius:14}}
                      onMouseEnter={e=>{e.currentTarget.style.background=C.cardHover;e.currentTarget.style.borderColor=C.accent;e.currentTarget.style.transform="translateY(-2px)";}}
                      onMouseLeave={e=>{e.currentTarget.style.background=C.card;e.currentTarget.style.borderColor=C.border;e.currentTarget.style.transform="none";}}
                      onClick={()=>nav("phone",{phone})}>
                      <div style={{height:110,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:8,background:C.input,borderRadius:10,overflow:"hidden"}}>
                        {phone.img?<img src={phone.img} alt={phone.model} style={{maxHeight:100,maxWidth:"90%",objectFit:"contain"}} onError={e=>e.target.style.display="none"} />:<div style={{fontSize:26,opacity:.3}}>📱</div>}
                      </div>
                      <div style={{fontSize:10,color:C.accent,marginBottom:3,fontWeight:600}}>{bname}</div>
                      <div style={{fontSize:12,fontWeight:700,color:C.text,marginBottom:7,lineHeight:1.3}}>{phone.model}</div>
                      <BoxBadge box={phone.box} />
                    </div>
                  );
                })}
              </div>
            }
          </div>
        )}

        {!searchGlobal.trim()&&(
          <>
            <div style={S.lbl}>{t.brands}</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))",gap:10,marginBottom:28}}>
              {brands.map(brand=>(
                <div key={brand.id} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:"16px 10px",cursor:"pointer",textAlign:"center",transition:"all .2s"}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=C.accent;e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.background=C.cardHover;}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.transform="none";e.currentTarget.style.background=C.card;}}
                  onClick={()=>nav("brand",{brandId:brand.id})}>
                  <div style={{height:36,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:7}}>
                    {brand.logo?<img src={brand.logo} alt={brand.name} style={{maxHeight:32,maxWidth:78,objectFit:"contain"}} onError={e=>e.target.style.display="none"} />:<div style={{width:36,height:36,background:C.border,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>📱</div>}
                  </div>
                  <div style={{fontWeight:700,color:C.text,fontSize:11,marginBottom:2}}>{brand.name}</div>
                  <div style={{fontSize:10,color:C.sub}}>{brand.count} {t.phoneCount}</div>
                </div>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
              {[{label:t.totalPhones,value:allPhones.length,color:"#3B82F6"},{label:t.curvedScreens,value:allPhones.filter(p=>p.type==="curved").length,color:"#8B5CF6"},{label:t.flatScreens,value:allPhones.filter(p=>p.type==="flat").length,color:"#10B981"}].map(s=>(
                <div key={s.label} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"16px 12px",textAlign:"center"}}>
                  <div style={{fontSize:24,fontWeight:900,color:s.color}}>{s.value.toLocaleString()}</div>
                  <div style={{fontSize:10,color:C.sub,marginTop:3}}>{s.label}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── AUTH PAGE ─────────────────────────────────────────────────────────────────
function AuthPage({ t, dark, setDark, lang, setLang, authPage, setAuthPage, onLogin }) {
  const [form, setForm] = useState({ email:"", password:"", firstName:"", lastName:"", phone:"", shopName:"", shopLocation:"" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const C2 = dark ? {
    bg:"#07070F", card:"#0F0F1E", border:"#1A1A2E", text:"#E2E2F0",
    sub:"#3A3A5A", input:"#141428", inputBorder:"#1E1E32", accent:"#3B82F6",
  } : {
    bg:"#F0F4FF", card:"#FFFFFF", border:"#E0E8FF", text:"#1A1A2E",
    sub:"#6B7280", input:"#F8F9FF", inputBorder:"#CBD5E1", accent:"#3B82F6",
  };

  const inputStyle = { width:"100%", padding:"11px 14px", borderRadius:10, border:`1px solid ${C2.inputBorder}`, background:C2.input, color:C2.text, fontSize:14, outline:"none", boxSizing:"border-box", marginBottom:10 };

  // NOTE: This still uses an in-memory placeholder for demo purposes.
  // Wire this up to your real auth API (POST /api/login, /api/register).
  async function handleSubmit() {
    setError(""); setLoading(true);
    try {
      if (form.email === ADMIN_USERNAME && form.password === ADMIN_PASSWORD) {
        onLogin({ firstName:"Admin", lastName:"", email:ADMIN_USERNAME }, true);
        setLoading(false); return;
      }
      // TODO: replace with real fetch() calls to your backend
      // const res = await fetch("/api/" + authPage, { method:"POST", body: JSON.stringify(form) });
      if (authPage === "register" && (!form.firstName || !form.lastName || !form.phone || !form.shopName || !form.shopLocation || !form.email || !form.password)) {
        setError("يرجى ملء جميع الحقول"); setLoading(false); return;
      }
      onLogin(form, false);
    } catch(e) { setError(e.message); }
    setLoading(false);
  }

  return (
    <div style={{ minHeight:"100vh", background:C2.bg, display:"flex", alignItems:"center", justifyContent:"center", padding:16, fontFamily:"'Inter','Segoe UI',sans-serif" }}>
      <div style={{ width:"100%", maxWidth:400 }}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ fontSize:40, marginBottom:8 }}>📦</div>
          <h1 style={{ margin:0, fontSize:26, fontWeight:900, color:C2.accent }}>BoxFinder</h1>
          <p style={{ margin:"6px 0 0", fontSize:13, color:C2.sub }}>{t.tagline}</p>
        </div>

        <div style={{ background:C2.card, border:`1px solid ${C2.border}`, borderRadius:20, padding:"28px 24px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
            <LangSelector lang={lang} setLang={setLang} />
            <button onClick={()=>setDark(d=>!d)} style={{ background:"transparent", border:`1px solid ${C2.border}`, borderRadius:16, padding:"4px 10px", cursor:"pointer", fontSize:12, color:C2.sub }}>{dark?"☀️":"🌙"}</button>
          </div>

          <div style={{ display:"flex", background:C2.input, borderRadius:10, padding:3, marginBottom:20 }}>
            {[["login",t.login],["register",t.register]].map(([v,l])=>(
              <button key={v} style={{ flex:1, padding:"8px", borderRadius:8, border:"none", cursor:"pointer", fontSize:13, fontWeight:700, background:authPage===v?C2.accent:"transparent", color:authPage===v?"#fff":C2.sub, transition:"all .2s" }}
                onClick={()=>{setAuthPage(v);setError("");}}>
                {l}
              </button>
            ))}
          </div>

          {authPage==="register" && (
            <>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                <input style={{ ...inputStyle, marginBottom:8 }} placeholder={t.firstName} value={form.firstName} onChange={e=>setForm(f=>({...f,firstName:e.target.value}))} />
                <input style={{ ...inputStyle, marginBottom:8 }} placeholder={t.lastName} value={form.lastName} onChange={e=>setForm(f=>({...f,lastName:e.target.value}))} />
              </div>
              <input style={inputStyle} placeholder={t.phone} value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} />
              <input style={inputStyle} placeholder={t.shopName} value={form.shopName} onChange={e=>setForm(f=>({...f,shopName:e.target.value}))} />
              <input style={inputStyle} placeholder={t.shopLocation} value={form.shopLocation} onChange={e=>setForm(f=>({...f,shopLocation:e.target.value}))} />
            </>
          )}

          <input style={inputStyle} placeholder={t.email} value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} type="email" />
          <input style={inputStyle} placeholder={t.password} value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} type="password"
            onKeyDown={e=>{if(e.key==="Enter")handleSubmit();}} />

          {error && <p style={{ color:"#F87171", fontSize:12, margin:"0 0 10px", textAlign:"center" }}>{error}</p>}

          <button style={{ width:"100%", padding:"12px", borderRadius:10, border:"none", cursor:"pointer", fontSize:15, fontWeight:800, background:`linear-gradient(135deg,#3B82F6,#6366F1)`, color:"#fff", marginBottom:6, opacity:loading?.8:1 }}
            onClick={handleSubmit} disabled={loading}>
            {loading ? "⏳" : authPage==="login" ? t.loginBtn : t.registerBtn}
          </button>
        </div>
      </div>
    </div>
  );
}
