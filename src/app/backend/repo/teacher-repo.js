const db = require('./../config/db');

// Отримати всі записи (Read)
const getAllTeachers = (callback) => {
  const sql = 'SELECT * FROM teacher';
  db.query(sql, (err, result) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, result);
  });
};

// Отримати одного вчителя за ID (Read)
const getTeacherById = (id, callback) => {
  const sql = 'SELECT * FROM teacher WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, result[0]);
  });
};

// Додати нового вчителя (Create)
const addTeacher = (teacherData, callback) => {
  const sql = 'INSERT INTO teacher (name, email, password) VALUES (?, ?, ?)';
  db.query(sql, [teacherData.name, teacherData.email, teacherData.password], (err, result) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, result);
  });
};

// Оновити інформацію про вчителя (Update)
const updateTeacher = (id, teacherData, callback) => {
  const sql = 'UPDATE teacher SET name = ?, email = ?, password = ? WHERE id = ?';
  db.query(sql, [teacherData.name, teacherData.email, teacherData.password, id], (err, result) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, result);
  });
};

// Видалити вчителя (Delete)
const deleteTeacher = (id, callback) => {
  const sql = 'DELETE FROM teacher WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, result);
  });
};

module.exports = {
  getAllTeachers,
  getTeacherById,
  addTeacher,
  updateTeacher,
  deleteTeacher
};
