const db = require('../models/db');

// Fetch Intake Data for a Specific User
const getIntakeData = async (req, res) => {
  const { user_id } = req.params;

  if (isNaN(user_id)) {
    return res.status(400).json({ message: 'Invalid user ID: ID must be a number.' });
  }

  try {
    const { rows } = await db.query(
      `
      SELECT * 
      FROM Intake 
      WHERE id = $1;
      `,
      [user_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No intake data found for this user.' });
    }

    res.status(200).json(rows);
  } catch (err) {
    console.error('Error fetching intake data:', err.message);
    res.status(500).json({
      message: 'An error occurred while fetching intake data.',
      details: err.message,
    });
  }
};

// Add New Intake Data
const addIntakeData = async (req, res) => {
  const {
    client_name,
    sex,
    age,
    fat_percentage,
    height_cm,
    weight_category,
    bmi,
    ffmi,
    athleticism_score,
    movement_shoulder,
    movement_hips,
    movement_ankles,
    movement_thoracic,
    genetics,
  } = req.body;

  if (!client_name || !sex || !age) {
    return res.status(400).json({ message: 'Client name, sex, and age are required.' });
  }

  try {
    const { rows } = await db.query(
      `INSERT INTO Intake (
        client_name, sex, age, fat_percentage, height_cm, weight_category, bmi, ffmi, athleticism_score, 
        movement_shoulder, movement_hips, movement_ankles, movement_thoracic, genetics
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
       RETURNING *;`,
      [
        client_name, sex, age, fat_percentage, height_cm, weight_category, bmi, ffmi, athleticism_score,
        movement_shoulder, movement_hips, movement_ankles, movement_thoracic, genetics
      ]
    );

    res.status(201).json({ message: 'Intake data added successfully', data: rows[0] });
  } catch (err) {
    console.error('Error adding intake data:', err.message);
    res.status(500).json({ message: 'Internal Server Error', details: err.message });
  }
};

module.exports = { getIntakeData, addIntakeData };
