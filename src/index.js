require('dotenv').config();

const express = require('express');

const userRoutes = require('./app/backend/routes/teacher-routes');

const app = express();

app.use(express.json());

app.use('/teacher', userRoutes);

const PORT = process.env.PORT || 3306;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
