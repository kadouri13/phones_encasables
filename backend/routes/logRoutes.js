const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// GET /api/logs - Get system audit logs (Admin only)
router.get('/', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const result = await db.query(`
      SELECT l.id, l.action, l.entity_type AS "entityType", l.entity_id AS "entityId", 
             l.details, l.created_at AS "createdAt",
             u.email AS "actorEmail", u.first_name AS "actorFirstName", u.last_name AS "actorLastName"
      FROM audit_log l
      LEFT JOIN users u ON l.actor_id = u.id
      ORDER BY l.created_at DESC
      LIMIT 100
    `);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
