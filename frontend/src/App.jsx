import React, { useState, useEffect, useMemo, useRef } from "react";

// Translations mapping
const T = {
  ar: {
    dir: "rtl",
    appName: "BoxFinder",
    tagline: "أداة البحث عن زجاج الحماية",
    searchPlaceholder: "ابحث عن الموديل... (S23 Ultra, A54...)",
    brands: "الماركات",
    allPhones: "الكل",
    curved: "منحنية ⬡",
    flat: "مسطحة ▭",
    totalPhones: "إجمالي الهواتف",
    curvedScreens: "شاشات منحنية",
    flatScreens: "شاشات مسطحة",
    boxNumber: "رقم البوكس",
    screenType: "نوع الشاشة",
    curvedScreen: "شاشة منحنية",
    flatScreen: "شاشة مسطحة",
    home: "الرئيسية",
    back: "رجوع",
    contact: "للتواصل",
    login: "تسجيل الدخول",
    logout: "خروج",
    email: "اسم المستخدم / البريد الإلكتروني",
    password: "كلمة السر",
    loginBtn: "دخول",
    adminPanel: "لوحة التحكم",
    users: "المستخدمون",
    phonesTab: "الهواتف",
    brandsTab: "البراندات",
    bulkImport: "استيراد دفعة",
    logsTab: "سجلات العمليات",
    settingsTab: "الإعدادات",
    addPhone: "إضافة هاتف",
    addBrand: "إضافة براند",
    addUser: "إضافة مستخدم",
    edit: "تعديل",
    delete: "حذف",
    save: "حفظ",
    cancel: "إلغاء",
    loading: "جاري التحميل...",
    error: "حدث خطأ",
    success: "تم بنجاح",
    noResults: "لا توجد نتائج",
    noImage: "لا توجد صورة",
    firstName: "الاسم الأول",
    lastName: "اللقب",
    phone: "رقم الهاتف",
    shopName: "اسم المحل",
    shopLocation: "عنوان المحل",
    contactNumber: "رقم التواصل بالدعم",
    bulkImportWarning: "⚠️ سيؤدي هذا الإجراء إلى حذف جميع الهواتف الحالية واستبدالها بالبيانات الجديدة المستوردة.",
    pasteDataLabel: "البيانات بتنسيق النص الخام (انسخ محتوى ملف data والقه هنا):",
    importBtn: "استيراد البيانات الآن",
    activeStatus: "نشط",
    inactiveStatus: "موقف",
    action: "العملية",
    details: "التفاصيل",
    actor: "القائم بالعملية",
    time: "الوقت"
  },
  fr: {
    dir: "ltr",
    appName: "BoxFinder",
    tagline: "Outil de Recherche de Verre Trempé",
    searchPlaceholder: "Rechercher un modèle... (S23 Ultra, A54...)",
    brands: "Marques",
    allPhones: "Tout",
    curved: "Incurvé ⬡",
    flat: "Plat ▭",
    totalPhones: "Total téléphones",
    curvedScreens: "Écrans incurvés",
    flatScreens: "Écrans plats",
    boxNumber: "Numéro de boîte",
    screenType: "Type d'écran",
    curvedScreen: "Écran incurvé",
    flatScreen: "Écran plat",
    home: "Accueil",
    back: "Retour",
    contact: "Contact",
    login: "Connexion",
    logout: "Déconnexion",
    email: "Nom d'utilisateur / Email",
    password: "Mot de passe",
    loginBtn: "Se connecter",
    adminPanel: "Panneau Admin",
    users: "Utilisateurs",
    phonesTab: "Téléphones",
    brandsTab: "Marques",
    bulkImport: "Importation en bloc",
    logsTab: "Journal d'audit",
    settingsTab: "Configuration",
    addPhone: "Ajouter téléphone",
    addBrand: "Ajouter marque",
    addUser: "Ajouter utilisateur",
    edit: "Modifier",
    delete: "Supprimer",
    save: "Enregistrer",
    cancel: "Annuler",
    loading: "Chargement...",
    error: "Une erreur est survenue",
    success: "Succès",
    noResults: "Aucun résultat trouvé",
    noImage: "Pas d'image",
    firstName: "Prénom",
    lastName: "Nom de famille",
    phone: "Téléphone",
    shopName: "Nom de la boutique",
    shopLocation: "Adresse de la boutique",
    contactNumber: "Numéro de contact du support",
    bulkImportWarning: "⚠️ Cette action effacera et remplacera toutes les fiches de téléphones existantes.",
    pasteDataLabel: "Coller les données brutes (Copier le contenu du fichier 'data'):",
    importBtn: "Importer les données",
    activeStatus: "Actif",
    inactiveStatus: "Désactivé",
    action: "Action",
    details: "Détails",
    actor: "Auteur",
    time: "Date"
  },
  en: {
    dir: "ltr",
    appName: "BoxFinder",
    tagline: "Protection Glass Finder Utility",
    searchPlaceholder: "Search model... (S23 Ultra, A54...)",
    brands: "Brands",
    allPhones: "All",
    curved: "Curved ⬡",
    flat: "Flat ▭",
    totalPhones: "Total Phones",
    curvedScreens: "Curved Screens",
    flatScreens: "Flat Screens",
    boxNumber: "Box Number",
    screenType: "Screen Type",
    curvedScreen: "Curved Screen",
    flatScreen: "Flat Screen",
    home: "Home",
    back: "Back",
    contact: "Contact",
    login: "Login",
    logout: "Logout",
    email: "Username / Email",
    password: "Password",
    loginBtn: "Login",
    adminPanel: "Admin Panel",
    users: "Users",
    phonesTab: "Phones",
    brandsTab: "Brands",
    bulkImport: "Bulk Import",
    logsTab: "Audit Logs",
    settingsTab: "Settings",
    addPhone: "Add Phone",
    addBrand: "Add Brand",
    addUser: "Add User",
    edit: "Edit",
    delete: "Delete",
    save: "Save",
    cancel: "Cancel",
    loading: "Loading...",
    error: "An error occurred",
    success: "Success",
    noResults: "No results found",
    noImage: "No image",
    firstName: "First Name",
    lastName: "Last Name",
    phone: "Phone Number",
    shopName: "Shop Name",
    shopLocation: "Shop Location",
    contactNumber: "Support Contact Number",
    bulkImportWarning: "⚠️ This action will delete all existing phones and replace them with the new imported data.",
    pasteDataLabel: "Paste raw text data (Copy content from the 'data' file):",
    importBtn: "Import Data Now",
    activeStatus: "Active",
    inactiveStatus: "Inactive",
    action: "Action",
    details: "Details",
    actor: "Actor",
    time: "Time"
  }
};

// UI badge helper
function BoxBadge({ box, large }) {
  const isCurved = box.startsWith("P") || box.startsWith("p");
  return (
    <span className={`box-badge ${isCurved ? 'box-badge-curved' : 'box-badge-flat'} ${large ? 'box-badge-large' : ''}`}>
      {box}
    </span>
  );
}

export default function App() {
  // Config state
  const [lang, setLang] = useState(() => localStorage.getItem("boxfinder_lang") || "ar");
  const [theme, setTheme] = useState(() => localStorage.getItem("boxfinder_theme") || "dark");
  const [token, setToken] = useState(() => localStorage.getItem("boxfinder_token") || null);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("boxfinder_user");
    return saved ? JSON.parse(saved) : null;
  });

  // Navigation & queries
  const [page, setPage] = useState("home"); // home | brand | phone | admin
  const [selectedBrandId, setSelectedBrandId] = useState(null);
  const [selectedPhone, setSelectedPhone] = useState(null);
  
  // Data lists
  const [brands, setBrands] = useState([]);
  const [phones, setPhones] = useState([]);
  const [settings, setSettings] = useState({ contact_number: "" });
  const [loading, setLoading] = useState(false);
  const [searchGlobal, setSearchGlobal] = useState("");
  const [searchBrand, setSearchBrand] = useState("");
  const [filterType, setFilterType] = useState("all"); // all | curved | flat

  const t = T[lang] || T.ar;

  // Toggle dark/light class on body
  useEffect(() => {
    const bodyClass = document.body.classList;
    if (theme === "light") {
      bodyClass.add("light");
    } else {
      bodyClass.remove("light");
    }
    localStorage.setItem("boxfinder_theme", theme);
  }, [theme]);

  // Apply language directionality
  useEffect(() => {
    document.body.dir = t.dir;
    localStorage.setItem("boxfinder_lang", lang);
  }, [lang, t.dir]);

  // Fetch core data on token login
  useEffect(() => {
    if (token) {
      fetchCoreData();
    }
  }, [token]);

  const fetchCoreData = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [brandsRes, phonesRes, settingsRes] = await Promise.all([
        fetch("/api/brands", { headers }),
        fetch("/api/phones", { headers }),
        fetch("/api/settings", { headers })
      ]);

      if (brandsRes.status === 401 || brandsRes.status === 403) {
        handleLogout();
        return;
      }

      if (brandsRes.ok && phonesRes.ok && settingsRes.ok) {
        const brandsData = await brandsRes.json();
        const phonesData = await phonesRes.json();
        const settingsData = await settingsRes.json();

        setBrands(brandsData);
        setPhones(phonesData);
        setSettings(settingsData);
      }
    } catch (err) {
      console.error("Failed to load catalog data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (jwtToken, loggedInUser) => {
    localStorage.setItem("boxfinder_token", jwtToken);
    localStorage.setItem("boxfinder_user", JSON.stringify(loggedInUser));
    setToken(jwtToken);
    setUser(loggedInUser);
    setPage("home");
  };

  const handleLogout = () => {
    localStorage.removeItem("boxfinder_token");
    localStorage.removeItem("boxfinder_user");
    setToken(null);
    setUser(null);
    setPage("home");
  };

  // Nav helper
  const navigate = (pg, options = {}) => {
    setPage(pg);
    if (options.brandId !== undefined) {
      setSelectedBrandId(options.brandId);
      setSearchBrand("");
      setFilterType("all");
    }
    if (options.phone !== undefined) {
      setSelectedPhone(options.phone);
    }
    window.scrollTo(0, 0);
  };

  // Search computations
  const currentBrand = useMemo(() => {
    return brands.find(b => b.id === selectedBrandId);
  }, [brands, selectedBrandId]);

  const brandPhones = useMemo(() => {
    if (!selectedBrandId) return [];
    return phones.filter(p => p.brandId === selectedBrandId);
  }, [phones, selectedBrandId]);

  const filteredBrandPhones = useMemo(() => {
    let list = brandPhones;
    if (filterType !== "all") {
      list = list.filter(p => p.screenType === filterType);
    }
    if (searchBrand.trim()) {
      list = list.filter(p => p.model.toLowerCase().includes(searchBrand.toLowerCase()));
    }
    return list;
  }, [brandPhones, searchBrand, filterType]);

  const globalResults = useMemo(() => {
    const q = searchGlobal.trim().toLowerCase();
    if (!q || q.length < 2) return [];
    return phones.filter(p =>
      p.model.toLowerCase().includes(q) ||
      p.brandName.toLowerCase().includes(q)
    ).slice(0, 24);
  }, [searchGlobal, phones]);

  // Auth Guard
  if (!token) {
    return (
      <LoginPage
        t={t}
        theme={theme}
        setTheme={setTheme}
        lang={lang}
        setLang={setLang}
        onLogin={handleLogin}
      />
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Navbar */}
      <nav className="navbar">
        <span className="nav-brand" onClick={() => navigate("home")}>
          📦 {t.appName}
        </span>
        <div className="nav-actions">
          {/* Lang */}
          <div style={{ display: "flex", gap: 4 }}>
            {["ar", "fr", "en"].map(l => (
              <button
                key={l}
                onClick={() => setLang(l)}
                style={{
                  background: lang === l ? "var(--accent-color)" : "transparent",
                  border: `1px solid ${lang === l ? "var(--accent-color)" : "var(--border-color)"}`,
                  color: lang === l ? "#fff" : "var(--text-secondary)",
                  borderRadius: 8,
                  padding: "4px 8px",
                  cursor: "pointer",
                  fontSize: 11,
                  fontWeight: 700
                }}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Theme */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="btn btn-secondary"
            style={{ padding: "6px 12px", fontSize: 13, border: "1px solid var(--border-color)", borderRadius: 10 }}
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>

          {/* Admin panel link */}
          {user?.role === "admin" && (
            <button
              onClick={() => navigate(page === "admin" ? "home" : "admin")}
              className={`btn ${page === "admin" ? "btn-secondary" : "btn-primary"}`}
              style={{ padding: "8px 14px", borderRadius: 10 }}
            >
              🛠️ {page === "admin" ? t.home : t.adminPanel}
            </button>
          )}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="btn btn-danger"
            style={{ padding: "8px 12px", borderRadius: 10 }}
            title={t.logout}
          >
            🚪
          </button>
        </div>
      </nav>

      {/* Main Container */}
      <div style={{ flexGrow: 1 }}>
        {loading ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "calc(100vh - 150px)", flexDirection: "column", gap: 16 }}>
            <div className="spinner" />
            <span style={{ color: "var(--text-secondary)" }}>{t.loading}</span>
          </div>
        ) : page === "admin" && user?.role === "admin" ? (
          <AdminPanel
            t={t}
            token={token}
            brands={brands}
            phones={phones}
            settings={settings}
            refreshData={fetchCoreData}
          />
        ) : page === "phone" && selectedPhone ? (
          <PhoneDetailsView
            t={t}
            phone={selectedPhone}
            navigate={navigate}
          />
        ) : page === "brand" && selectedBrandId ? (
          <BrandDetailsView
            t={t}
            brand={currentBrand}
            phones={filteredBrandPhones}
            filterType={filterType}
            setFilterType={setFilterType}
            searchBrand={searchBrand}
            setSearchBrand={setSearchBrand}
            navigate={navigate}
          />
        ) : (
          <HomeView
            t={t}
            brands={brands}
            phones={phones}
            searchGlobal={searchGlobal}
            setSearchGlobal={setSearchGlobal}
            globalResults={globalResults}
            navigate={navigate}
          />
        )}
      </div>

      {/* Footer */}
      <footer style={{ background: "var(--input-bg)", padding: 24, textAlign: "center", borderTop: "1px solid var(--border-color)", fontSize: 13, color: "var(--text-muted)" }}>
        <p>© {new Date().getFullYear()} {t.appName} - {t.tagline}</p>
        {settings.contact_number && (
          <p style={{ marginTop: 6 }}>📞 {t.contact}: <span style={{ color: "var(--accent-color)", fontWeight: "bold" }}>{settings.contact_number}</span></p>
        )}
      </footer>
    </div>
  );
}

// ── LOGIN PAGE ────────────────────────────────────────────────────────────────
function LoginPage({ t, theme, setTheme, lang, setLang, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      onLogin(data.token, data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-color)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div className="card" style={{ width: "100%", maxWidth: 400, border: "1px solid var(--border-color)" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 50, marginBottom: 8 }}>📦</div>
          <h1 style={{ fontSize: 28, background: "var(--accent-gradient)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            {t.appName}
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 13, marginTop: 4 }}>{t.tagline}</p>
        </div>

        {/* Global Controls */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid var(--border-color)" }}>
          {/* Lang Toggle */}
          <div style={{ display: "flex", gap: 4 }}>
            {["ar", "fr", "en"].map(l => (
              <button
                key={l}
                onClick={() => setLang(l)}
                style={{
                  background: lang === l ? "var(--accent-color)" : "transparent",
                  border: `1px solid ${lang === l ? "var(--accent-color)" : "var(--border-color)"}`,
                  color: lang === l ? "#fff" : "var(--text-secondary)",
                  borderRadius: 8,
                  padding: "4px 8px",
                  cursor: "pointer",
                  fontSize: 11,
                  fontWeight: 700
                }}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="btn btn-secondary"
            style={{ padding: "6px 12px", fontSize: 12, borderRadius: 10 }}
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t.email}</label>
            <input
              type="text"
              className="search-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. yassinoghazaouet"
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 20 }}>
            <label>{t.password}</label>
            <input
              type="password"
              className="search-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div style={{ color: "var(--danger-color)", fontSize: 13, marginBottom: 16, textAlign: "center", fontWeight: "bold" }}>
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", padding: "12px", borderRadius: 12 }}
            disabled={loading}
          >
            {loading ? t.loading : t.loginBtn}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── HOME VIEW ────────────────────────────────────────────────────────────────
function HomeView({ t, brands, phones, searchGlobal, setSearchGlobal, globalResults, navigate }) {
  // Screens stats
  const totalCount = phones.length;
  const curvedCount = phones.filter(p => p.screenType === "curved").length;
  const flatCount = phones.filter(p => p.screenType === "flat").length;

  return (
    <div className="container">
      {/* Intro */}
      <div style={{ textAlign: "center", padding: "40px 0 24px" }}>
        <span style={{ fontSize: 11, fontWeight: 900, color: "var(--accent-color)", letterSpacing: 4, textTransform: "uppercase" }}>
          Encapsulated Glass Finder
        </span>
        <h1 style={{ fontSize: 36, marginTop: 10, marginBottom: 8 }}>
          {t.appName}
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>{t.tagline}</p>
        <div style={{ marginTop: 8, fontSize: 12, color: "var(--text-muted)" }}>
          {totalCount} {t.allPhones.toLowerCase()} · {brands.length} {t.brands.toLowerCase()}
        </div>
      </div>

      {/* Global Search Bar */}
      <div style={{ maxWidth: 650, margin: "0 auto 36px" }}>
        <input
          type="text"
          className="search-input"
          style={{ fontSize: 16, padding: "16px 22px" }}
          placeholder={"🔍 " + t.searchPlaceholder}
          value={searchGlobal}
          onChange={(e) => setSearchGlobal(e.target.value)}
        />
      </div>

      {/* Instant Global Search Results */}
      {searchGlobal.trim().length >= 2 && (
        <div style={{ marginBottom: 40, animation: "fadeIn 0.3s ease" }}>
          <h2 style={{ fontSize: 14, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 2, marginBottom: 16 }}>
            {t.results} ({globalResults.length})
          </h2>

          {globalResults.length === 0 ? (
            <div className="card" style={{ textAlign: "center", padding: 32, color: "var(--text-secondary)" }}>
              {t.noResults}
            </div>
          ) : (
            <div className="grid-phones">
              {globalResults.map(phone => (
                <div
                  key={phone.id}
                  className="card card-hoverable"
                  style={{ cursor: "pointer", padding: 14, borderRadius: 16 }}
                  onClick={() => navigate("phone", { phone })}
                >
                  <div style={{ height: 110, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "var(--input-bg)", borderRadius: 12, overflow: "hidden", marginBottom: 12 }}>
                    {phone.imgUrl ? (
                      <img src={phone.imgUrl} alt={phone.model} style={{ maxHeight: 95, maxWidth: "90%", objectFit: "contain" }} />
                    ) : (
                      <span style={{ fontSize: 32, opacity: 0.2 }}>📱</span>
                    )}
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "var(--accent-color)", textTransform: "uppercase", marginBottom: 4 }}>
                    {phone.brandName}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {phone.model}
                  </div>
                  <BoxBadge box={phone.box} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Brands Directory */}
      {!searchGlobal.trim() && (
        <>
          <h2 style={{ fontSize: 14, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 2, marginBottom: 16 }}>
            {t.brands}
          </h2>

          <div className="grid-brands">
            {brands.map(brand => (
              <div
                key={brand.id}
                className="card card-hoverable"
                style={{ textAlign: "center", padding: "20px 12px", cursor: "pointer" }}
                onClick={() => navigate("brand", { brandId: brand.id })}
              >
                <div style={{ height: 48, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                  {brand.logoUrl ? (
                    <img src={brand.logoUrl} alt={brand.name} style={{ maxHeight: 42, maxWidth: 90, objectFit: "contain" }} />
                  ) : (
                    <span style={{ fontSize: 24 }}>📱</span>
                  )}
                </div>
                <div style={{ fontWeight: 700, fontSize: 13, color: "var(--text-primary)" }}>{brand.name}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>{brand.phoneCount} {t.allPhones.toLowerCase()}</div>
              </div>
            ))}
          </div>

          {/* Stats Bar */}
          <div className="stat-grid">
            <div className="card" style={{ textAlign: "center", padding: "20px 12px" }}>
              <div className="stat-value" style={{ color: "#3b82f6" }}>{totalCount}</div>
              <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>{t.totalPhones}</div>
            </div>
            <div className="card" style={{ textAlign: "center", padding: "20px 12px" }}>
              <div className="stat-value" style={{ color: "#8b5cf6" }}>{curvedCount}</div>
              <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>{t.curvedScreens}</div>
            </div>
            <div className="card" style={{ textAlign: "center", padding: "20px 12px" }}>
              <div className="stat-value" style={{ color: "#10b981" }}>{flatCount}</div>
              <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>{t.flatScreens}</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ── BRAND DETAILS VIEW ────────────────────────────────────────────────────────
function BrandDetailsView({ t, brand, phones, filterType, setFilterType, searchBrand, setSearchBrand, navigate }) {
  if (!brand) return null;

  return (
    <div className="container">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span className="breadcrumb-link" onClick={() => navigate("home")}>{t.home}</span>
        <span>/</span>
        <span style={{ color: "var(--text-primary)" }}>{brand.name}</span>
      </div>

      {/* Header Info */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
        <div style={{ height: 48, width: 48, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "var(--card-bg)", borderRadius: 12 }}>
          {brand.logoUrl ? (
            <img src={brand.logoUrl} alt={brand.name} style={{ maxHeight: 36, maxWidth: 36, objectFit: "contain" }} />
          ) : (
            <span style={{ fontSize: 24 }}>📱</span>
          )}
        </div>
        <div>
          <h1 style={{ fontSize: 24 }}>{brand.name}</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 13 }}>{phones.length} {t.allPhones.toLowerCase()}</p>
        </div>
      </div>

      {/* Filters & Search Row */}
      <div style={{ marginBottom: 24 }}>
        <input
          type="text"
          className="search-input"
          placeholder={"🔍 " + t.searchPlaceholder}
          value={searchBrand}
          onChange={(e) => setSearchBrand(e.target.value)}
          style={{ marginBottom: 14 }}
        />

        <div style={{ display: "flex", gap: 8 }}>
          {[
            { key: "all", label: t.allPhones },
            { key: "curved", label: t.curved },
            { key: "flat", label: t.flat }
          ].map(opt => (
            <button
              key={opt.key}
              className={`btn ${filterType === opt.key ? "btn-primary" : "btn-secondary"}`}
              style={{ fontSize: 12, padding: "6px 14px" }}
              onClick={() => setFilterType(opt.key)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Phones Grid */}
      {phones.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: 32, color: "var(--text-secondary)" }}>
          {t.noResults}
        </div>
      ) : (
        <div className="grid-phones">
          {phones.map(phone => (
            <div
              key={phone.id}
              className="card card-hoverable"
              style={{ cursor: "pointer", padding: 14, borderRadius: 16 }}
              onClick={() => navigate("phone", { phone })}
            >
              <div style={{ height: 110, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "var(--input-bg)", borderRadius: 12, overflow: "hidden", marginBottom: 12 }}>
                {phone.imgUrl ? (
                  <img src={phone.imgUrl} alt={phone.model} style={{ maxHeight: 95, maxWidth: "90%", objectFit: "contain" }} />
                ) : (
                  <span style={{ fontSize: 32, opacity: 0.2 }}>📱</span>
                )}
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {phone.model}
              </div>
              <BoxBadge box={phone.box} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── PHONE DETAILS VIEW ────────────────────────────────────────────────────────
function PhoneDetailsView({ t, phone, navigate }) {
  if (!phone) return null;
  const isCurved = phone.screenType === "curved";

  return (
    <div className="container" style={{ maxWidth: 560 }}>
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span className="breadcrumb-link" onClick={() => navigate("home")}>{t.home}</span>
        <span>/</span>
        <span className="breadcrumb-link" onClick={() => navigate("brand", { brandId: phone.brandId })}>{phone.brandName}</span>
        <span>/</span>
        <span style={{ color: "var(--text-primary)" }}>{phone.model}</span>
      </div>

      {/* Phone Image Card */}
      <div className="card" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 260, overflow: "hidden", marginBottom: 16 }}>
        {phone.imgUrl ? (
          <img src={phone.imgUrl} alt={phone.model} style={{ maxHeight: 230, maxWidth: "95%", objectFit: "contain" }} />
        ) : (
          <div style={{ textAlign: "center", color: "var(--text-muted)" }}>
            <span style={{ fontSize: 60 }}>📱</span>
            <div style={{ fontSize: 12, marginTop: 8 }}>{t.noImage}</div>
          </div>
        )}
      </div>

      {/* Box Number Card */}
      <div className="card">
        <div style={{ fontSize: 12, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: 1 }}>
          {phone.brandName}
        </div>
        <h1 style={{ fontSize: 24, marginTop: 4, marginBottom: 20 }}>{phone.model}</h1>

        <div style={{
          backgroundColor: isCurved ? "rgba(59, 130, 246, 0.08)" : "rgba(16, 185, 129, 0.08)",
          border: `1px solid ${isCurved ? "rgba(59, 130, 246, 0.2)" : "rgba(16, 185, 129, 0.2)"}`,
          padding: 24,
          borderRadius: 16,
          textAlign: "center",
          marginBottom: 16
        }}>
          <div style={{ fontSize: 11, color: "var(--text-secondary)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>
            {t.boxNumber}
          </div>
          <BoxBadge box={phone.box} large={true} />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", backgroundColor: "var(--input-bg)", borderRadius: 12, border: "1px solid var(--border-color)" }}>
          <span style={{ fontSize: 22 }}>{isCurved ? "⬡" : "▭"}</span>
          <div>
            <div style={{ fontSize: 10, color: "var(--text-secondary)", textTransform: "uppercase" }}>{t.screenType}</div>
            <div style={{ fontSize: 13, fontWeight: "bold", color: isCurved ? "#3b82f6" : "#10b981", marginTop: 2 }}>
              {isCurved ? t.curvedScreen : t.flatScreen}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── ADMIN PANEL ───────────────────────────────────────────────────────────────
function AdminPanel({ t, token, brands, phones, settings, refreshData }) {
  const [adminTab, setAdminTab] = useState("users"); // users | phones | brands | settings | logs | bulk
  const [usersList, setUsersList] = useState([]);
  const [logsList, setLogsList] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [banner, setBanner] = useState({ text: "", type: "" }); // success | error

  // Modals state
  const [modalType, setModalType] = useState(""); // user | phone | brand | ''
  const [modalMode, setModalMode] = useState("add"); // add | edit
  const [currentItem, setCurrentItem] = useState(null);

  // Form Fields
  const [userForm, setUserForm] = useState({ email: "", firstName: "", lastName: "", phone: "", shopName: "", shopLocation: "", password: "", isActive: true });
  const [phoneForm, setPhoneForm] = useState({ brandId: "", model: "", box: "", screenType: "flat", imgUrl: "" });
  const [brandForm, setBrandForm] = useState({ id: "", name: "", logoUrl: "" });
  const [settingsForm, setSettingsForm] = useState({ contact_number: settings.contact_number || "" });
  const [bulkImportText, setBulkImportText] = useState("");

  const headers = useMemo(() => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  }), [token]);

  // Load audit logs and users list on tab switch
  useEffect(() => {
    if (adminTab === "users") {
      fetchUsers();
    } else if (adminTab === "logs") {
      fetchLogs();
    }
  }, [adminTab]);

  const showBanner = (text, type = "success") => {
    setBanner({ text, type });
    setTimeout(() => setBanner({ text: "", type: "" }), 4000);
  };

  const fetchUsers = async () => {
    setTableLoading(true);
    try {
      const res = await fetch("/api/users", { headers });
      if (res.ok) {
        const data = await res.json();
        setUsersList(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTableLoading(false);
    }
  };

  const fetchLogs = async () => {
    setTableLoading(true);
    try {
      const res = await fetch("/api/logs", { headers });
      if (res.ok) {
        const data = await res.json();
        setLogsList(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTableLoading(false);
    }
  };

  // User Actions
  const handleOpenUserModal = (mode, item = null) => {
    setModalMode(mode);
    setModalType("user");
    if (mode === "edit" && item) {
      setCurrentItem(item);
      setUserForm({
        email: item.email,
        firstName: item.firstName,
        lastName: item.lastName,
        phone: item.phone,
        shopName: item.shopName,
        shopLocation: item.shopLocation,
        password: "", // do not fill password
        isActive: item.isActive
      });
    } else {
      setUserForm({ email: "", firstName: "", lastName: "", phone: "", shopName: "", shopLocation: "", password: "", isActive: true });
    }
  };

  const handleSubmitUser = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (modalMode === "add") {
        res = await fetch("/api/users", {
          method: "POST",
          headers,
          body: JSON.stringify(userForm)
        });
      } else {
        res = await fetch(`/api/users/${currentItem.id}`, {
          method: "PUT",
          headers,
          body: JSON.stringify(userForm)
        });
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "User operation failed");

      showBanner(t.success, "success");
      setModalType("");
      fetchUsers();
    } catch (err) {
      showBanner(err.message, "error");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Confirm deletion?")) return;
    try {
      const res = await fetch(`/api/users/${userId}`, { method: "DELETE", headers });
      if (res.ok) {
        showBanner(t.success, "success");
        fetchUsers();
      } else {
        const data = await res.json();
        throw new Error(data.error || "Failed");
      }
    } catch (err) {
      showBanner(err.message, "error");
    }
  };

  // Phone Actions
  const handleOpenPhoneModal = (mode, item = null) => {
    setModalMode(mode);
    setModalType("phone");
    if (mode === "edit" && item) {
      setCurrentItem(item);
      setPhoneForm({
        brandId: item.brandId,
        model: item.model,
        box: item.box,
        screenType: item.screenType,
        imgUrl: item.imgUrl || ""
      });
    } else {
      setPhoneForm({ brandId: brands[0]?.id || "", model: "", box: "", screenType: "flat", imgUrl: "" });
    }
  };

  const handleSubmitPhone = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (modalMode === "add") {
        res = await fetch("/api/phones", {
          method: "POST",
          headers,
          body: JSON.stringify(phoneForm)
        });
      } else {
        res = await fetch(`/api/phones/${currentItem.id}`, {
          method: "PUT",
          headers,
          body: JSON.stringify(phoneForm)
        });
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Phone operation failed");

      showBanner(t.success, "success");
      setModalType("");
      refreshData();
    } catch (err) {
      showBanner(err.message, "error");
    }
  };

  const handleDeletePhone = async (phoneId) => {
    if (!window.confirm("Confirm deletion?")) return;
    try {
      const res = await fetch(`/api/phones/${phoneId}`, { method: "DELETE", headers });
      if (res.ok) {
        showBanner(t.success, "success");
        refreshData();
      } else {
        const data = await res.json();
        throw new Error(data.error || "Failed");
      }
    } catch (err) {
      showBanner(err.message, "error");
    }
  };

  // Brand Actions
  const handleOpenBrandModal = (mode, item = null) => {
    setModalMode(mode);
    setModalType("brand");
    if (mode === "edit" && item) {
      setCurrentItem(item);
      setBrandForm({
        id: item.id,
        name: item.name,
        logoUrl: item.logoUrl || ""
      });
    } else {
      setBrandForm({ id: "", name: "", logoUrl: "" });
    }
  };

  const handleSubmitBrand = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (modalMode === "add") {
        res = await fetch("/api/brands", {
          method: "POST",
          headers,
          body: JSON.stringify(brandForm)
        });
      } else {
        res = await fetch(`/api/brands/${currentItem.id}`, {
          method: "PUT",
          headers,
          body: JSON.stringify(brandForm)
        });
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Brand operation failed");

      showBanner(t.success, "success");
      setModalType("");
      refreshData();
    } catch (err) {
      showBanner(err.message, "error");
    }
  };

  const handleDeleteBrand = async (brandId) => {
    if (!window.confirm("Confirm deletion?")) return;
    try {
      const res = await fetch(`/api/brands/${brandId}`, { method: "DELETE", headers });
      if (res.ok) {
        showBanner(t.success, "success");
        refreshData();
      } else {
        const data = await res.json();
        throw new Error(data.error || "Failed");
      }
    } catch (err) {
      showBanner(err.message, "error");
    }
  };

  // Settings Action
  const handleSubmitSettings = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers,
        body: JSON.stringify(settingsForm)
      });

      if (res.ok) {
        showBanner(t.success, "success");
        refreshData();
      } else {
        throw new Error("Failed to update settings");
      }
    } catch (err) {
      showBanner(err.message, "error");
    }
  };

  // Bulk Import Parser & Post Action
  const handleBulkImport = async () => {
    if (!bulkImportText.trim()) return;
    if (!window.confirm(t.bulkImportWarning + "\nAre you sure you want to proceed?")) return;

    setTableLoading(true);
    try {
      // Client-side parser for data file
      const lines = bulkImportText.split("\n");
      const importList = [];

      for (let line of lines) {
        line = line.trim();
        if (!line || line.startsWith("--")) continue;

        const match = line.match(/^([^(]+)\s*\(([^)]+)\)\s*:\s*(.+)$/);
        if (match) {
          const brandName = match[1].trim();
          const screenType = match[2].trim().toLowerCase(); // curved / flat
          const modelsStr = match[3].trim();
          const brandId = brandName.toLowerCase().replace(/[^a-z0-9_-]/g, "");

          const tokens = modelsStr.split(",");
          for (let token of tokens) {
            token = token.trim();
            if (!token) continue;

            let model = "";
            let box = "";

            if (token.includes("→")) {
              const parts = token.split("→");
              model = parts[0].trim();
              box = parts[1].trim();
            } else if (token.includes("->")) {
              const parts = token.split("->");
              model = parts[0].trim();
              box = parts[1].trim();
            } else {
              continue;
            }

            importList.push({
              brandId,
              brandName,
              model,
              box,
              screenType
            });
          }
        }
      }

      if (importList.length === 0) {
        throw new Error("Could not parse any valid phone data from pasted text.");
      }

      const res = await fetch("/api/phones/import", {
        method: "POST",
        headers,
        body: JSON.stringify({ phones: importList })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Bulk import failed");

      showBanner(data.message || t.success, "success");
      setBulkImportText("");
      refreshData();
    } catch (err) {
      showBanner(err.message, "error");
    } finally {
      setTableLoading(false);
    }
  };

  return (
    <div className="admin-layout">
      {/* Sidebar navigation */}
      <aside className="admin-sidebar">
        <button className={`sidebar-btn ${adminTab === "users" ? "active" : ""}`} onClick={() => setAdminTab("users")}>
          👥 {t.users}
        </button>
        <button className={`sidebar-btn ${adminTab === "phones" ? "active" : ""}`} onClick={() => setAdminTab("phones")}>
          📱 {t.phonesTab}
        </button>
        <button className={`sidebar-btn ${adminTab === "brands" ? "active" : ""}`} onClick={() => setAdminTab("brands")}>
          🏢 {t.brandsTab}
        </button>
        <button className={`sidebar-btn ${adminTab === "bulk" ? "active" : ""}`} onClick={() => setAdminTab("bulk")}>
          📤 {t.bulkImport}
        </button>
        <button className={`sidebar-btn ${adminTab === "logs" ? "active" : ""}`} onClick={() => setAdminTab("logs")}>
          📜 {t.logsTab}
        </button>
        <button className={`sidebar-btn ${adminTab === "settings" ? "active" : ""}`} onClick={() => setAdminTab("settings")}>
          ⚙️ {t.settingsTab}
        </button>
      </aside>

      {/* Main administrative display workspace */}
      <main className="admin-content">
        {banner.text && (
          <div style={{
            backgroundColor: banner.type === "error" ? "rgba(239,68,68,0.2)" : "rgba(16,185,129,0.2)",
            border: `1px solid ${banner.type === "error" ? "var(--danger-color)" : "var(--accent-color)"}`,
            padding: "12px 18px",
            borderRadius: 10,
            marginBottom: 20,
            color: "var(--text-primary)",
            fontWeight: "bold"
          }}>
            {banner.text}
          </div>
        )}

        {/* Tab workspace content */}
        {adminTab === "users" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2>👥 {t.users}</h2>
              <button className="btn btn-primary" onClick={() => handleOpenUserModal("add")}>
                + {t.addUser}
              </button>
            </div>

            {tableLoading ? (
              <div style={{ padding: 40, textAlign: "center" }}><div className="spinner" style={{ margin: "0 auto" }} /></div>
            ) : (
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>{t.email}</th>
                      <th>{t.firstName} {t.lastName}</th>
                      <th>{t.phone}</th>
                      <th>{t.shopName} ({t.shopLocation})</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.map(u => (
                      <tr key={u.id}>
                        <td style={{ fontWeight: "bold" }}>{u.email}</td>
                        <td>{u.firstName} {u.lastName}</td>
                        <td>{u.phone}</td>
                        <td>{u.shopName} - {u.shopLocation}</td>
                        <td>
                          <span className={u.isActive ? "badge-active" : "badge-inactive"}>
                            {u.isActive ? t.activeStatus : t.inactiveStatus}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: 6 }}>
                            <button className="btn btn-secondary" style={{ padding: "4px 8px", fontSize: 11 }} onClick={() => handleOpenUserModal("edit", u)}>
                              {t.edit}
                            </button>
                            <button className="btn btn-danger" style={{ padding: "4px 8px", fontSize: 11 }} onClick={() => handleDeleteUser(u.id)}>
                              {t.delete}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {adminTab === "phones" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2>📱 {t.phonesTab} ({phones.length})</h2>
              <button className="btn btn-primary" onClick={() => handleOpenPhoneModal("add")}>
                + {t.addPhone}
              </button>
            </div>

            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>{t.brandsTab}</th>
                    <th>Model</th>
                    <th>{t.boxNumber}</th>
                    <th>{t.screenType}</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {phones.slice(0, 150).map(p => (
                    <tr key={p.id}>
                      <td style={{ textTransform: "uppercase", fontWeight: "bold", color: "var(--accent-color)" }}>{p.brandName}</td>
                      <td>{p.model}</td>
                      <td><BoxBadge box={p.box} /></td>
                      <td style={{ textTransform: "capitalize" }}>{p.screenType}</td>
                      <td>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button className="btn btn-secondary" style={{ padding: "4px 8px", fontSize: 11 }} onClick={() => handleOpenPhoneModal("edit", p)}>
                            {t.edit}
                          </button>
                          <button className="btn btn-danger" style={{ padding: "4px 8px", fontSize: 11 }} onClick={() => handleDeletePhone(p.id)}>
                            {t.delete}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {phones.length > 150 && (
                    <tr>
                      <td colSpan="5" style={{ textAlign: "center", color: "var(--text-muted)", fontStyle: "italic" }}>
                        ... showing first 150 entries. Use client search to verify details.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {adminTab === "brands" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2>🏢 {t.brandsTab} ({brands.length})</h2>
              <button className="btn btn-primary" onClick={() => handleOpenBrandModal("add")}>
                + {t.addBrand}
              </button>
            </div>

            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Logo</th>
                    <th>Name</th>
                    <th>Phones Count</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {brands.map(b => (
                    <tr key={b.id}>
                      <td><code>{b.id}</code></td>
                      <td>
                        {b.logoUrl ? (
                          <img src={b.logoUrl} alt={b.name} style={{ height: 20, maxWidth: 50, objectFit: "contain" }} />
                        ) : (
                          "-"
                        )}
                      </td>
                      <td style={{ fontWeight: "bold" }}>{b.name}</td>
                      <td>{b.phoneCount}</td>
                      <td>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button className="btn btn-secondary" style={{ padding: "4px 8px", fontSize: 11 }} onClick={() => handleOpenBrandModal("edit", b)}>
                            {t.edit}
                          </button>
                          <button className="btn btn-danger" style={{ padding: "4px 8px", fontSize: 11 }} onClick={() => handleDeleteBrand(b.id)}>
                            {t.delete}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {adminTab === "bulk" && (
          <div>
            <h2>📤 {t.bulkImport}</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: 13, margin: "8px 0 20px" }}>
              {t.bulkImportWarning}
            </p>

            <div className="form-group">
              <label>{t.pasteDataLabel}</label>
              <textarea
                className="search-input"
                style={{ height: 260, fontFamily: "monospace", fontSize: 12, resize: "vertical", marginTop: 8 }}
                value={bulkImportText}
                onChange={(e) => setBulkImportText(e.target.value)}
                placeholder="Samsung (curved): S23 Ultra→P12, S22 Ultra→P12&#10;Xiaomi (flat): Redmi Note 13 Pro→B05"
              />
            </div>

            <button className="btn btn-primary" style={{ padding: "12px 24px" }} onClick={handleBulkImport} disabled={tableLoading}>
              {tableLoading ? t.loading : t.importBtn}
            </button>
          </div>
        )}

        {adminTab === "logs" && (
          <div>
            <h2>📜 {t.logsTab}</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: 13, margin: "8px 0 16px" }}>
              Tracking all recent administrator updates.
            </p>

            {tableLoading ? (
              <div style={{ padding: 40, textAlign: "center" }}><div className="spinner" style={{ margin: "0 auto" }} /></div>
            ) : (
              <div className="admin-table-container">
                <table className="admin-table" style={{ fontSize: 12 }}>
                  <thead>
                    <tr>
                      <th>{t.actor}</th>
                      <th>{t.action}</th>
                      <th>Entity</th>
                      <th>{t.details}</th>
                      <th>{t.time}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logsList.map(l => (
                      <tr key={l.id}>
                        <td>
                          <strong>{l.actorFirstName} {l.actorLastName}</strong>
                          <div style={{ fontSize: 10, color: "var(--text-muted)" }}>{l.actorEmail}</div>
                        </td>
                        <td><code style={{ padding: "2px 6px", borderRadius: 4, backgroundColor: "var(--bg-color)" }}>{l.action}</code></td>
                        <td>{l.entityType} ({l.entityId})</td>
                        <td><pre style={{ fontSize: 10, fontFamily: "monospace", whiteSpace: "pre-wrap" }}>{JSON.stringify(l.details)}</pre></td>
                        <td>{new Date(l.createdAt).toLocaleString(lang === "ar" ? "ar-EG" : "en-US")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {adminTab === "settings" && (
          <div>
            <h2>⚙️ {t.settingsTab}</h2>
            <form onSubmit={handleSubmitSettings} style={{ maxWidth: 450, marginTop: 20 }}>
              <div className="form-group">
                <label>{t.contactNumber}</label>
                <input
                  type="text"
                  className="search-input"
                  value={settingsForm.contact_number}
                  onChange={(e) => setSettingsForm({ contact_number: e.target.value })}
                  placeholder="e.g. +213 555 00 00 00"
                />
              </div>

              <button type="submit" className="btn btn-primary">
                {t.save}
              </button>
            </form>
          </div>
        )}
      </main>

      {/* ── MODALS ── */}
      {modalType === "user" && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{modalMode === "add" ? t.addUser : t.edit}</h3>
              <button className="btn btn-secondary" style={{ padding: "4px 8px" }} onClick={() => setModalType("")}>✕</button>
            </div>
            <form onSubmit={handleSubmitUser}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label>{t.firstName}</label>
                    <input type="text" className="search-input" value={userForm.firstName} onChange={e => setUserForm({ ...userForm, firstName: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>{t.lastName}</label>
                    <input type="text" className="search-input" value={userForm.lastName} onChange={e => setUserForm({ ...userForm, lastName: e.target.value })} required />
                  </div>
                </div>

                <div className="form-group">
                  <label>{t.email} (Username)</label>
                  <input type="text" className="search-input" value={userForm.email} onChange={e => setUserForm({ ...userForm, email: e.target.value })} required disabled={modalMode === "edit"} />
                </div>

                <div className="form-group">
                  <label>{t.phone}</label>
                  <input type="text" className="search-input" value={userForm.phone} onChange={e => setUserForm({ ...userForm, phone: e.target.value })} required />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>{t.shopName}</label>
                    <input type="text" className="search-input" value={userForm.shopName} onChange={e => setUserForm({ ...userForm, shopName: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>{t.shopLocation}</label>
                    <input type="text" className="search-input" value={userForm.shopLocation} onChange={e => setUserForm({ ...userForm, shopLocation: e.target.value })} required />
                  </div>
                </div>

                <div className="form-group">
                  <label>{t.password} {modalMode === "edit" && "(leave empty to keep unchanged)"}</label>
                  <input type="password" className="search-input" value={userForm.password} onChange={e => setUserForm({ ...userForm, password: e.target.value })} required={modalMode === "add"} />
                </div>

                {modalMode === "edit" && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
                    <input type="checkbox" id="user-active" checked={userForm.isActive} onChange={e => setUserForm({ ...userForm, isActive: e.target.checked })} />
                    <label htmlFor="user-active" style={{ fontSize: 13, cursor: "pointer" }}>Account is active</label>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setModalType("")}>{t.cancel}</button>
                <button type="submit" className="btn btn-primary">{t.save}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalType === "phone" && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{modalMode === "add" ? t.addPhone : t.edit}</h3>
              <button className="btn btn-secondary" style={{ padding: "4px 8px" }} onClick={() => setModalType("")}>✕</button>
            </div>
            <form onSubmit={handleSubmitPhone}>
              <div className="modal-body">
                <div className="form-group">
                  <label>{t.brandsTab}</label>
                  <select className="search-input" value={phoneForm.brandId} onChange={e => setPhoneForm({ ...phoneForm, brandId: e.target.value })} required>
                    {brands.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Model Name</label>
                  <input type="text" className="search-input" value={phoneForm.model} onChange={e => setPhoneForm({ ...phoneForm, model: e.target.value })} required />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>{t.boxNumber}</label>
                    <input type="text" className="search-input" value={phoneForm.box} onChange={e => setPhoneForm({ ...phoneForm, box: e.target.value })} placeholder="e.g. P12, B01" required />
                  </div>
                  <div className="form-group">
                    <label>{t.screenType}</label>
                    <select className="search-input" value={phoneForm.screenType} onChange={e => setPhoneForm({ ...phoneForm, screenType: e.target.value })} required>
                      <option value="flat">Flat ▭</option>
                      <option value="curved">Curved ⬡</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Image URL (Optional)</label>
                  <input type="url" className="search-input" value={phoneForm.imgUrl} onChange={e => setPhoneForm({ ...phoneForm, imgUrl: e.target.value })} placeholder="https://example.com/phone.jpg" />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setModalType("")}>{t.cancel}</button>
                <button type="submit" className="btn btn-primary">{t.save}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalType === "brand" && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{modalMode === "add" ? t.addBrand : t.edit}</h3>
              <button className="btn btn-secondary" style={{ padding: "4px 8px" }} onClick={() => setModalType("")}>✕</button>
            </div>
            <form onSubmit={handleSubmitBrand}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Brand ID (alphanumeric, lowercase)</label>
                  <input type="text" className="search-input" value={brandForm.id} onChange={e => setBrandForm({ ...brandForm, id: e.target.value })} placeholder="e.g. samsung, apple" required disabled={modalMode === "edit"} />
                </div>

                <div className="form-group">
                  <label>Brand Name</label>
                  <input type="text" className="search-input" value={brandForm.name} onChange={e => setBrandForm({ ...brandForm, name: e.target.value })} placeholder="e.g. Samsung, Apple" required />
                </div>

                <div className="form-group">
                  <label>Logo URL (Optional)</label>
                  <input type="url" className="search-input" value={brandForm.logoUrl} onChange={e => setBrandForm({ ...brandForm, logoUrl: e.target.value })} placeholder="https://example.com/logo.png" />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setModalType("")}>{t.cancel}</button>
                <button type="submit" className="btn btn-primary">{t.save}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
