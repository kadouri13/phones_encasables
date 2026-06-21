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

// GET /api/brands - List all brands, with phone count
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT b.id, b.name, b.logo_url AS "logoUrl", COUNT(p.id)::int AS "phoneCount"
       FROM brands b
       LEFT JOIN phones p ON b.id = p.brand_id
       GROUP BY b.id, b.name, b.logo_url
       ORDER BY b.name ASC`
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// POST /api/brands - Create a brand (Admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res, next) => {
  const { id, name, logoUrl } = req.body;

  if (!id || !name) {
    return res.status(400).json({ error: 'Brand ID and Name are required' });
  }

  // Ensure brand ID is URL friendly / alphanumeric lowercase
  const formattedId = id.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');

  try {
    // Check if ID exists
    const checkBrand = await db.query('SELECT id FROM brands WHERE id = $1', [formattedId]);
    if (checkBrand.rows.length > 0) {
      return res.status(400).json({ error: `Brand with ID "${formattedId}" already exists` });
    }

    const result = await db.query(
      `INSERT INTO brands (id, name, logo_url)
       VALUES ($1, $2, $3)
       RETURNING id, name, logo_url AS "logoUrl"`,
      [formattedId, name.trim(), logoUrl ? logoUrl.trim() : null]
    );

    const newBrand = result.rows[0];
    newBrand.phoneCount = 0;

    await logAudit(req.user.id, 'create_brand', 'brand', newBrand.id, { name: newBrand.name });

    res.status(201).json(newBrand);
  } catch (err) {
    next(err);
  }
});

// PUT /api/brands/:id - Update brand name and logo (Admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res, next) => {
  const { id } = req.params;
  const { name, logoUrl } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Brand Name is required' });
  }

  try {
    const checkBrand = await db.query('SELECT name FROM brands WHERE id = $1', [id]);
    if (checkBrand.rows.length === 0) {
      return res.status(404).json({ error: 'Brand not found' });
    }

    const result = await db.query(
      `UPDATE brands
       SET name = $1, logo_url = $2, updated_at = NOW()
       WHERE id = $3
       RETURNING id, name, logo_url AS "logoUrl"`,
      [name.trim(), logoUrl ? logoUrl.trim() : null, id]
    );

    const updatedBrand = result.rows[0];

    // Get phone count to return complete object
    const countRes = await db.query('SELECT COUNT(*)::int AS count FROM phones WHERE brand_id = $1', [id]);
    updatedBrand.phoneCount = countRes.rows[0].count;

    await logAudit(req.user.id, 'update_brand', 'brand', id, { name: updatedBrand.name, logoUrl });

    res.json(updatedBrand);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/brands/:id - Delete a brand (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res, next) => {
  const { id } = req.params;

  try {
    const checkBrand = await db.query('SELECT name FROM brands WHERE id = $1', [id]);
    if (checkBrand.rows.length === 0) {
      return res.status(404).json({ error: 'Brand not found' });
    }
    const brandName = checkBrand.rows[0].name;

    // Check if phones are linked to this brand
    const checkPhones = await db.query('SELECT COUNT(*)::int AS count FROM phones WHERE brand_id = $1', [id]);
    if (checkPhones.rows[0].count > 0) {
      return res.status(400).json({ error: `Cannot delete brand. There are still ${checkPhones.rows[0].count} phones associated with it.` });
    }

    await db.query('DELETE FROM brands WHERE id = $1', [id]);

    await logAudit(req.user.id, 'delete_brand', 'brand', id, { name: brandName });

    res.json({ message: 'Brand deleted successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
