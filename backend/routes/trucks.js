
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// 1. VIEW ALL TRUCKS
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM trucks ORDER BY truck_id DESC';

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }

        res.json(results);
    });
});

// 2. SEARCH TRUCKS
router.get('/search', (req, res) => {
    const keyword = `%${req.query.keyword || ''}%`;

    const sql = `
        SELECT * FROM trucks
        WHERE CAST(truck_id AS CHAR) LIKE ?
        OR plate_number LIKE ?
        ORDER BY truck_id DESC
    `;

    db.query(sql, [keyword, keyword], (err, results) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }

        res.json(results);
    });
});

// 3. ADD TRUCK
router.post('/', (req, res) => {
    const {
        plate_number,
        truck_model,
        truck_type,
        capacity,
        driver_name,
        contact_number,
        truck_status
    } = req.body;

    if (!plate_number || !truck_model || !truck_type ||
        capacity === undefined || capacity === '' ||
        !driver_name) {
        return res.status(400).json({
            message: 'Please complete all required fields.'
        });
    }

    if (!Number.isFinite(Number(capacity)) || Number(capacity) <= 0) {
        return res.status(400).json({
            message: 'Capacity must be a positive number.'
        });
    }

    const sql = `
        INSERT INTO trucks
        (plate_number, truck_model, truck_type, capacity,
        driver_name, contact_number, truck_status)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [
        plate_number,
        truck_model,
        truck_type,
        capacity,
        driver_name,
        contact_number || null,
        truck_status || 'Available'
    ], (err, result) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }

        res.status(201).json({
            message: 'Truck added successfully!',
            truck_id: result.insertId
        });
    });
});

// 4. UPDATE TRUCK
router.put('/:id', (req, res) => {
    const {
        plate_number,
        truck_model,
        truck_type,
        capacity,
        driver_name,
        contact_number,
        truck_status
    } = req.body;

    if (!plate_number || !truck_model || !truck_type ||
        capacity === undefined || capacity === '' ||
        !driver_name) {
        return res.status(400).json({
            message: 'Please complete all required fields.'
        });
    }

    if (!Number.isFinite(Number(capacity)) || Number(capacity) <= 0) {
        return res.status(400).json({
            message: 'Capacity must be a positive number.'
        });
    }

    const sql = `
        UPDATE trucks SET
        plate_number = ?,
        truck_model = ?,
        truck_type = ?,
        capacity = ?,
        driver_name = ?,
        contact_number = ?,
        truck_status = ?
        WHERE truck_id = ?
    `;

    db.query(sql, [
        plate_number,
        truck_model,
        truck_type,
        capacity,
        driver_name,
        contact_number || null,
        truck_status || 'Available',
        req.params.id
    ], (err, result) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Truck not found.'
            });
        }

        res.json({ message: 'Truck updated successfully!' });
    });
});

// 5. DELETE TRUCK
router.delete('/:id', (req, res) => {
    const sql = 'DELETE FROM trucks WHERE truck_id = ?';

    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Truck not found.'
            });
        }

        res.json({ message: 'Truck deleted successfully!' });
    });
});

module.exports = router;
