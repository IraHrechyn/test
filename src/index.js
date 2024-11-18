require('dotenv').config();

const express = require('express');

const teacherRoutes = require('./app/backend/routes/teacher-routes');
const subjectRoutes = require('./app/backend/routes/subject-routes');
const studentRoutes = require('./app/backend/routes/student-routes');
const groupRoutes = require('./app/backend/routes/group-routes');
const testRoutes = require('./app/backend/routes/test-routes');


const app = express();

app.use(express.json());

const cors = require('cors');
const corsOptions ={
  origin:'http://localhost:4200',
  credentials:true,
  optionSuccessStatus:200
}
app.use(cors(corsOptions));

app.use('/teacher', teacherRoutes);
app.use('/subject', subjectRoutes);
app.use('/student', studentRoutes);
app.use('/group', groupRoutes);
app.use('/test', testRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
