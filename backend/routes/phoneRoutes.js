const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Utility function to log audit events
async function logAudit(actorId, action, entityType, entityId, details) {
  try {
    await db.query(
      'INSERT INTO audit_log (actor_id, action, entity_type, entity_id, details) VALUES ($1, $2, $3, $4, $5)',
      [actorId, action, entityType, entityId, JSON.stringify(details)]
    );
  } catch (err) {
    console.error('Audit logging failed:', err);
  }
}

// GET /api/phones - Retrieve phones (supports optional brandId and search query parameters)
router.get('/', authenticateToken, async (req, res, next) => {
  const { brandId, search } = req.query;
  let queryText = `
    SELECT p.id, p.brand_id AS "brandId", b.name AS "brandName", p.model, p.box, 
           p.screen_type AS "screenType", p.img_url AS "imgUrl", p.created_at AS "createdAt"
    FROM phones p
    JOIN brands b ON p.brand_id = b.id
  `;
  const params = [];
  const conditions = [];

  if (brandId) {
    params.push(brandId);
    conditions.push(`p.brand_id = $${params.length}`);
  }

  if (search && search.trim().length > 0) {
    params.push(`%${search.trim()}%`);
    conditions.push(`(p.model ILIKE $${params.length} OR b.name ILIKE $${params.length})`);
  }

  if (conditions.length > 0) {
    queryText += ' WHERE ' + conditions.join(' AND ');
  }

  queryText += ' ORDER BY b.name ASC, p.model ASC';

  try {
    const result = await db.query(queryText, params);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// POST /api/phones - Create a phone (Admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res, next) => {
  const { brandId, model, box, screenType, imgUrl } = req.body;

  if (!brandId || !model || !box || !screenType) {
    return res.status(400).json({ error: 'Brand ID, Model, Box, and Screen Type are required' });
  }

  if (screenType !== 'flat' && screenType !== 'curved') {
    return res.status(400).json({ error: 'Screen Type must be flat or curved' });
  }

  try {
    // Verify brand exists
    const checkBrand = await db.query('SELECT name FROM brands WHERE id = $1', [brandId]);
    if (checkBrand.rows.length === 0) {
      return res.status(400).json({ error: `Brand "${brandId}" does not exist` });
    }

    const result = await db.query(
      `INSERT INTO phones (brand_id, model, box, screen_type, img_url)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, brand_id AS "brandId", model, box, screen_type AS "screenType", img_url AS "imgUrl"`,
      [brandId, model.trim(), box.trim(), screenType, imgUrl ? imgUrl.trim() : null]
    );

    const newPhone = result.rows[0];
    newPhone.brandName = checkBrand.rows[0].name;

    await logAudit(req.user.id, 'create_phone', 'phone', newPhone.id.toString(), { model: newPhone.model, brandId });

    res.status(201).json(newPhone);
  } catch (err) {
    next(err);
  }
});

// PUT /api/phones/:id - Update a phone (Admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res, next) => {
  const { id } = req.params;
  const { brandId, model, box, screenType, imgUrl } = req.body;

  if (!brandId || !model || !box || !screenType) {
    return res.status(400).json({ error: 'Brand ID, Model, Box, and Screen Type are required' });
  }

  if (screenType !== 'flat' && screenType !== 'curved') {
    return res.status(400).json({ error: 'Screen Type must be flat or curved' });
  }

  try {
    // Verify phone exists
    const checkPhone = await db.query('SELECT model FROM phones WHERE id = $1', [id]);
    if (checkPhone.rows.length === 0) {
      return res.status(404).json({ error: 'Phone not found' });
    }

    // Verify brand exists
    const checkBrand = await db.query('SELECT name FROM brands WHERE id = $1', [brandId]);
    if (checkBrand.rows.length === 0) {
      return res.status(400).json({ error: `Brand "${brandId}" does not exist` });
    }

    const result = await db.query(
      `UPDATE phones
       SET brand_id = $1, model = $2, box = $3, screen_type = $4, img_url = $5, updated_at = NOW()
       WHERE id = $6
       RETURNING id, brand_id AS "brandId", model, box, screen_type AS "screenType", img_url AS "imgUrl"`,
      [brandId, model.trim(), box.trim(), screenType, imgUrl ? imgUrl.trim() : null, id]
    );

    const updatedPhone = result.rows[0];
    updatedPhone.brandName = checkBrand.rows[0].name;

    await logAudit(req.user.id, 'update_phone', 'phone', id.toString(), { model: updatedPhone.model, brandId });

    res.json(updatedPhone);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/phones/:id - Delete a phone (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res, next) => {
  const { id } = req.params;

  try {
    const checkPhone = await db.query('SELECT model, brand_id FROM phones WHERE id = $1', [id]);
    if (checkPhone.rows.length === 0) {
      return res.status(404).json({ error: 'Phone not found' });
    }
    const phone = checkPhone.rows[0];

    await db.query('DELETE FROM phones WHERE id = $1', [id]);

    await logAudit(req.user.id, 'delete_phone', 'phone', id.toString(), { model: phone.model, brandId: phone.brand_id });

    res.json({ message: 'Phone deleted successfully' });
  } catch (err) {
    next(err);
  }
});

// POST /api/phones/import - Bulk import/replace database entries (Admin only)
router.post('/import', authenticateToken, requireAdmin, async (req, res, next) => {
  const { phones } = req.body;

  if (!Array.isArray(phones)) {
    return res.status(400).json({ error: 'Phones array is required' });
  }

  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Collect all unique brands from the imported phones list
    const brandsMap = new Map();
    for (const phone of phones) {
      if (phone.brandId && phone.brandName) {
        brandsMap.set(phone.brandId.trim().toLowerCase(), phone.brandName.trim());
      }
    }

    // 2. Insert brands if they do not exist
    for (const [bId, bName] of brandsMap.entries()) {
      await client.query(
        `INSERT INTO brands (id, name)
         VALUES ($1, $2)
         ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name`,
        [bId, bName]
      );
    }

    // 3. Clear existing phones table for full replace
    await client.query('DELETE FROM phones');

    // 4. Insert new phones
    for (const phone of phones) {
      const bId = phone.brandId.trim().toLowerCase();
      const screenType = (phone.screenType === 'curved' || phone.screenType === 'flat') ? phone.screenType : 'flat';
      
      await client.query(
        `INSERT INTO phones (brand_id, model, box, screen_type, img_url)
         VALUES ($1, $2, $3, $4, $5)`,
        [bId, phone.model.trim(), phone.box.trim(), screenType, phone.imgUrl ? phone.imgUrl.trim() : null]
      );
    }

    await client.query('COMMIT');
    await logAudit(req.user.id, 'bulk_import_phones', 'phone', 'all', { count: phones.length });

    res.json({ success: true, message: `Successfully imported ${phones.length} phones and created brands.` });
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
});

module.exports = router;
