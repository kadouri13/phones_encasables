-- ============================================================
-- BoxFinder Database Schema
-- PostgreSQL (works on MySQL/SQLite with minor tweaks noted below)
-- ============================================================

-- ── EXTENSIONS (Postgres only, for UUID generation) ──────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 1. BRANDS
-- ============================================================
CREATE TABLE brands (
    id          VARCHAR(40)  PRIMARY KEY,      -- e.g. 'samsung', 'appel', 'xiaomi'
    name        VARCHAR(80)  NOT NULL,
    logo_url    TEXT,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- ============================================================
-- 2. PHONES
-- ============================================================
CREATE TABLE phones (
    id          BIGSERIAL    PRIMARY KEY,
    brand_id    VARCHAR(40)  NOT NULL REFERENCES brands(id)
                    ON UPDATE CASCADE ON DELETE RESTRICT,
    model       VARCHAR(150) NOT NULL,
    box         VARCHAR(10)  NOT NULL,         -- e.g. 'B21', 'P04'
    screen_type VARCHAR(10)  NOT NULL CHECK (screen_type IN ('flat','curved')),
    img_url     TEXT,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX idx_phones_brand_id   ON phones(brand_id);
CREATE INDEX idx_phones_model      ON phones USING gin (to_tsvector('simple', model)); -- fast search
CREATE INDEX idx_phones_box        ON phones(box);
CREATE INDEX idx_phones_screen_type ON phones(screen_type);

-- Optional: prevent literal duplicate entries per brand
CREATE UNIQUE INDEX uq_phones_brand_model ON phones(brand_id, model);

-- ============================================================
-- 3. USERS  (admin creates all accounts — no public self-signup)
-- ============================================================
CREATE TABLE users (
    id              UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    email           VARCHAR(150) NOT NULL UNIQUE,
    password_hash   TEXT         NOT NULL,      -- store bcrypt/argon2 hash, never plaintext
    role            VARCHAR(10)  NOT NULL DEFAULT 'user' CHECK (role IN ('admin','user')),
    first_name      VARCHAR(80)  NOT NULL,
    last_name       VARCHAR(80)  NOT NULL,
    phone           VARCHAR(30)  NOT NULL,
    shop_name       VARCHAR(120) NOT NULL,
    shop_location   VARCHAR(150) NOT NULL,
    is_active       BOOLEAN      NOT NULL DEFAULT true,   -- admin can disable a user instead of deleting
    created_by      UUID         REFERENCES users(id) ON DELETE SET NULL, -- which admin created this account
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT now(),
    last_login_at   TIMESTAMPTZ
);

CREATE INDEX idx_users_role  ON users(role);
CREATE INDEX idx_users_email ON users(email);

-- ============================================================
-- 4. CONTACT INFO  (single row, shown at bottom of the app)
-- ============================================================
CREATE TABLE app_settings (
    key         VARCHAR(50)  PRIMARY KEY,   -- e.g. 'contact_number'
    value       TEXT,
    updated_by  UUID REFERENCES users(id) ON DELETE SET NULL,
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 5. OPTIONAL: AUDIT LOG for admin actions (recommended)
-- ============================================================
CREATE TABLE audit_log (
    id          BIGSERIAL   PRIMARY KEY,
    actor_id    UUID        REFERENCES users(id) ON DELETE SET NULL,
    action      VARCHAR(50) NOT NULL,   -- 'create_phone','update_phone','delete_phone','create_user', etc.
    entity_type VARCHAR(30) NOT NULL,   -- 'phone','brand','user'
    entity_id   VARCHAR(60),
    details     JSONB,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_actor ON audit_log(actor_id);
CREATE INDEX idx_audit_entity ON audit_log(entity_type, entity_id);

-- ============================================================
-- TRIGGERS: auto-update updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_brands_updated BEFORE UPDATE ON brands
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_phones_updated BEFORE UPDATE ON phones
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_users_updated BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- SEED: the one and only admin account
-- (password hash below is a placeholder — generate a real bcrypt
--  hash in your backend, e.g. bcrypt.hash("Ghazaouet13400", 10))
-- ============================================================
INSERT INTO users (email, password_hash, role, first_name, last_name, phone, shop_name, shop_location)
VALUES (
    'yassinoghazaouet',
    '$2b$10$REPLACE_WITH_REAL_BCRYPT_HASH',
    'admin',
    'Yassin',
    'Oghazaouet',
    '',
    'BoxFinder HQ',
    'Tlemcen'
);

INSERT INTO app_settings (key, value)
VALUES ('contact_number', '');

-- ============================================================
-- USEFUL QUERIES
-- ============================================================

-- All phones for a brand, with brand info joined
-- SELECT p.*, b.name AS brand_name, b.logo_url
-- FROM phones p JOIN brands b ON b.id = p.brand_id
-- WHERE p.brand_id = 'samsung'
-- ORDER BY p.model;

-- Global search across model + brand name
-- SELECT p.*, b.name AS brand_name
-- FROM phones p JOIN brands b ON b.id = p.brand_id
-- WHERE p.model ILIKE '%a54%' OR b.name ILIKE '%a54%'
-- LIMIT 24;

-- Stats for homepage
-- SELECT
--   COUNT(*) AS total,
--   COUNT(*) FILTER (WHERE screen_type = 'curved') AS curved,
--   COUNT(*) FILTER (WHERE screen_type = 'flat') AS flat
-- FROM phones;

-- Admin: list all non-admin users they manage
-- SELECT id, email, first_name, last_name, phone, shop_name, shop_location, is_active, created_at
-- FROM users
-- WHERE role = 'user'
-- ORDER BY created_at DESC;

-- Admin creates a new user (run from backend, password_hash computed server-side)
-- INSERT INTO users (email, password_hash, role, first_name, last_name, phone, shop_name, shop_location, created_by)
-- VALUES ('user@email.com', '$2b$10$...', 'user', 'Ahmed', 'Belkaid', '0555000000', 'My Shop', 'Tlemcen', '<admin_uuid>');
