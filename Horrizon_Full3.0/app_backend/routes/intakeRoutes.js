const express = require('express');
const app = express();
const intakeRoutes = require('./routes/intakeRoutes');

app.use(express.json());

// Use intake routes
app.use('/intake', intakeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
