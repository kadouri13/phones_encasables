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

// GET /api/settings - Retrieve app settings
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const result = await db.query('SELECT key, value FROM app_settings');
    const settings = {};
    result.rows.forEach(row => {
      settings[row.key] = row.value;
    });
    res.json(settings);
  } catch (err) {
    next(err);
  }
});

// PUT /api/settings - Update app settings (Admin only)
router.put('/', authenticateToken, requireAdmin, async (req, res, next) => {
  const settings = req.body; // Expect key-value object: { contact_number: "..." }

  if (typeof settings !== 'object') {
    return res.status(400).json({ error: 'Settings object required' });
  }

  try {
    for (const [key, value] of Object.entries(settings)) {
      await db.query(
        `INSERT INTO app_settings (key, value, updated_by, updated_at)
         VALUES ($1, $2, $3, NOW())
         ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_by = EXCLUDED.updated_by, updated_at = NOW()`,
        [key, value, req.user.id]
      );
    }

    await logAudit(req.user.id, 'update_settings', 'settings', 'all', settings);

    res.json({ message: 'Settings updated successfully', settings });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
