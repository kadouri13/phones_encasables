const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../db');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Apply admin protection to all routes in this file
router.use(authenticateToken, requireAdmin);

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

// GET /api/users - List all users (excluding admins, sorted by creation date)
router.get('/', async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT id, email, role, first_name AS "firstName", last_name AS "lastName", 
              phone, shop_name AS "shopName", shop_location AS "shopLocation", 
              is_active AS "isActive", created_at AS "createdAt", last_login_at AS "lastLoginAt"
       FROM users 
       WHERE role = 'user'
       ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// POST /api/users - Admin creates a new user
router.post('/', async (req, res, next) => {
  const { email, password, firstName, lastName, phone, shopName, shopLocation } = req.body;

  if (!email || !password || !firstName || !lastName || !phone || !shopName || !shopLocation) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Check if email already exists
    const checkEmail = await db.query('SELECT id FROM users WHERE LOWER(email) = LOWER($1)', [email.trim()]);
    if (checkEmail.rows.length > 0) {
      return res.status(400).json({ error: 'Email/username already registered' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Insert user
    const result = await db.query(
      `INSERT INTO users (email, password_hash, role, first_name, last_name, phone, shop_name, shop_location, created_by)
       VALUES ($1, $2, 'user', $3, $4, $5, $6, $7, $8)
       RETURNING id, email, role, first_name AS "firstName", last_name AS "lastName", phone, shop_name AS "shopName", shop_location AS "shopLocation", is_active AS "isActive"`,
      [email.trim(), passwordHash, firstName.trim(), lastName.trim(), phone.trim(), shopName.trim(), shopLocation.trim(), req.user.id]
    );

    const newUser = result.rows[0];

    // Log action
    await logAudit(req.user.id, 'create_user', 'user', newUser.id, { email: newUser.email, firstName, lastName });

    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
});

// PUT /api/users/:id - Update user details or password
router.put('/:id', async (req, res, next) => {
  const { id } = req.params;
  const { firstName, lastName, phone, shopName, shopLocation, isActive, password } = req.body;

  try {
    // Check if user exists
    const checkUser = await db.query('SELECT email FROM users WHERE id = $1', [id]);
    if (checkUser.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const currentEmail = checkUser.rows[0].email;

    let queryText;
    let queryParams;

    if (password && password.trim().length > 0) {
      // Hashing new password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      queryText = `UPDATE users 
                   SET first_name = $1, last_name = $2, phone = $3, shop_name = $4, shop_location = $5, is_active = $6, password_hash = $7, updated_at = NOW()
                   WHERE id = $8
                   RETURNING id, email, first_name AS "firstName", last_name AS "lastName", phone, shop_name AS "shopName", shop_location AS "shopLocation", is_active AS "isActive"`;
      queryParams = [firstName, lastName, phone, shopName, shopLocation, isActive, passwordHash, id];
    } else {
      queryText = `UPDATE users 
                   SET first_name = $1, last_name = $2, phone = $3, shop_name = $4, shop_location = $5, is_active = $6, updated_at = NOW()
                   WHERE id = $7
                   RETURNING id, email, first_name AS "firstName", last_name AS "lastName", phone, shop_name AS "shopName", shop_location AS "shopLocation", is_active AS "isActive"`;
      queryParams = [firstName, lastName, phone, shopName, shopLocation, isActive, id];
    }

    const result = await db.query(queryText, queryParams);
    const updatedUser = result.rows[0];

    // Log action
    await logAudit(req.user.id, 'update_user', 'user', id, { email: currentEmail, updatedFields: Object.keys(req.body).filter(k => k !== 'password') });

    res.json(updatedUser);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/users/:id - Delete a user
router.delete('/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    const checkUser = await db.query('SELECT email FROM users WHERE id = $1', [id]);
    if (checkUser.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const userEmail = checkUser.rows[0].email;

    await db.query('DELETE FROM users WHERE id = $1', [id]);

    // Log action
    await logAudit(req.user.id, 'delete_user', 'user', id, { email: userEmail });

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
