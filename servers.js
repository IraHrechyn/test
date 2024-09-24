const express = require('express');
const bodyParser = require('body-parser');
const teacherRoutes = require('./src/app/backend/routes/teacher-routes');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/teacher', teacherRoutes);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
