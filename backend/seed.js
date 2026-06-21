const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
require('dotenv').config();

// Setup DB Pool specifically for seeder
const isProduction = process.env.NODE_ENV === 'production';
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: false } : false
});

async function runSeed() {
  console.log('Starting BoxFinder database initialization & seeding...');

  try {
    // 1. Read schema SQL
    const schemaPath = path.join(__dirname, '../boxfinder-schema.sql');
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Schema file not found at ${schemaPath}`);
    }
    let schemaSql = fs.readFileSync(schemaPath, 'utf8');

    // 2. Generate bcrypt hash for default admin password (Ghazaouet13400)
    console.log('Generating password hash for default admin...');
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('Ghazaouet13400', salt);

    // Replace the placeholder hash with the real bcrypt hash
    schemaSql = schemaSql.replace('$2b$10$REPLACE_WITH_REAL_BCRYPT_HASH', hash);

    // 3. Execute Schema queries to set up tables
    console.log('Initializing schema tables, triggers, and admin account...');
    await pool.query(schemaSql);
    console.log('Database tables, functions, and admin initialized successfully.');

    // 4. Read & parse data file
    const dataPath = path.join(__dirname, '../data');
    if (!fs.existsSync(dataPath)) {
      throw new Error(`Data file not found at ${dataPath}`);
    }
    const dataContent = fs.readFileSync(dataPath, 'utf8');
    const lines = dataContent.split('\n');

    const brands = [];
    const phones = [];

    console.log('Parsing phone data file...');
    for (let line of lines) {
      line = line.trim();
      if (!line || line.startsWith('--')) continue;

      // Match format: Brand (screen_type): model1->box, model2->box
      const match = line.match(/^([^(]+)\s*\(([^)]+)\)\s*:\s*(.+)$/);
      if (match) {
        const brandName = match[1].trim();
        const screenType = match[2].trim().toLowerCase(); // 'curved' or 'flat'
        const modelsStr = match[3].trim();

        // Safe ID: Samsung -> samsung, OnePlus -> oneplus
        const brandId = brandName.toLowerCase().replace(/[^a-z0-9_-]/g, '');

        if (!brands.find(b => b.id === brandId)) {
          brands.push({ id: brandId, name: brandName });
        }

        const tokens = modelsStr.split(',');
        for (let token of tokens) {
          token = token.trim();
          if (!token) continue;

          let model = '';
          let box = '';

          if (token.includes('→')) {
            const parts = token.split('→');
            model = parts[0].trim();
            box = parts[1].trim();
          } else if (token.includes('->')) {
            const parts = token.split('->');
            model = parts[0].trim();
            box = parts[1].trim();
          } else {
            continue;
          }

          phones.push({
            brandId,
            model,
            box,
            screenType
          });
        }
      }
    }

    console.log(`Parsed ${brands.length} brands and ${phones.length} phones.`);

    // 5. Insert parsed data into database
    console.log('Seeding brands and phones into database...');
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Insert Brands
      for (const brand of brands) {
        await client.query(
          `INSERT INTO brands (id, name) 
           VALUES ($1, $2) 
           ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name`,
          [brand.id, brand.name]
        );
      }

      // Insert Phones
      for (const phone of phones) {
        // Prevent duplicate entries per brand
        await client.query(
          `INSERT INTO phones (brand_id, model, box, screen_type)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (brand_id, model) DO NOTHING`,
          [phone.brandId, phone.model, phone.box, phone.screenType]
        );
      }

      await client.query('COMMIT');
      console.log('Database transaction committed successfully.');

      // Print final counts
      const brandsCountRes = await client.query('SELECT COUNT(*) FROM brands');
      const phonesCountRes = await client.query('SELECT COUNT(*) FROM phones');
      console.log(`\nSeeding completed successfully!`);
      console.log(`- Total Brands in DB: ${brandsCountRes.rows[0].count}`);
      console.log(`- Total Phones in DB: ${phonesCountRes.rows[0].count}`);
    } catch (dbErr) {
      await client.query('ROLLBACK');
      throw dbErr;
    } finally {
      client.release();
    }

  } catch (err) {
    console.error('Seeding failed:', err.message || err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runSeed();
