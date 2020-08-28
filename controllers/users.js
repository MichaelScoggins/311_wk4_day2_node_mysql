const mysql = require('mysql')
const pool = require('../sql/connection')
const { handleSQLError } = require('../sql/error')

const getAllUsers = (req, res) => {
  // SELECT ALL USERS
  let sql ="SELECT CONCAT(first_name,' ',last_name) AS 'Name', phone1,phone2,email,address,city,county,state,zip FROM users,usersContact,usersAddress WHERE usersAddress.user_id = users.id AND usersContact.user_id = users.id"
  sql = mysql.format(sql, [])
  pool.query(sql, (err, rows) => {
    if (err) return handleSQLError(res, err)
    return res.json(rows);
  })
}

const getUserById = (req, res) => {
  // SELECT USERS WHERE ID = <REQ PARAMS ID>
  let sql = "SELECT CONCAT(first_name,' ',last_name) AS 'Name', phone1,phone2,email,address,city,county,state,zip FROM users,usersContact,usersAddress WHERE usersAddress.user_id = users.id AND usersContact.user_id = users.id AND users.?"
  // WHAT GOES IN THE BRACKETS
  sql = mysql.format(sql, [req.params])

  pool.query(sql, (err, rows) => {
    if (err) return handleSQLError(res, err)
    return res.json(rows);
  })
}

const createUser = (req, res) => {
  // INSERT INTO USERS FIRST AND LAST NAME 
  let sql = `BEGIN WORK;
  INSERT INTO users (first_name, last_name)
    VALUES(?, ?);
  INSERT INTO usersAddress (user_id, address, city, county, state, zip) 
    VALUES(LAST_INSERT_ID(), ?, ?, ?, ?, ?);
  INSERT INTO usersContact (user_id, phone1, phone2, email)
    VALUES(LAST_INSERT_ID(), ?, ?, ?);
  COMMIT;`
  // WHAT GOES IN THE BRACKETS
  sql = mysql.format(sql, [req.body.first_name, req.body.last_name, req.body.address, req.body.city, req.body.county, req.body.state, req.body.zip, req.body.phone1, req.body.phone2, req.body.email])
  pool.query(sql, (err, results) => {
    if (err) return handleSQLError(res, err)
    return res.json({ newId: results.insertId });
  })
}

const updateUserById = (req, res) => {
  // UPDATE USERS AND SET FIRST AND LAST NAME WHERE ID = <REQ PARAMS ID>
  let sql = `UPDATE users, usersAddress, usersContact
  SET first_name = ?, last_name = ?, address = ?, city = ?, county = ?, state = ?, zip = ?, phone1 = ?, phone2 = ?, email = ?
  WHERE usersAddress.user_id = users.id AND usersContact.user_id = users.id AND users.?`
  // WHAT GOES IN THE BRACKETS
  sql = mysql.format(sql, [req.body.first_name, req.body.last_name, req.body.address, req.body.city, req.body.county, req.body.state, req.body.zip, req.body.phone1, req.body.phone2, req.body.email, req.params])
  console.log(sql)

  pool.query(sql, (err, results) => {
    if (err) return handleSQLError(res, err)
    return res.status(204).json();
  })
}

const deleteUserByFirstName = (req, res) => {
  // DELETE FROM USERS WHERE FIRST NAME = <REQ PARAMS FIRST_NAME>
  let sql = "DELETE FROM ?? WHERE ?"
  // WHAT GOES IN THE BRACKETS
  sql = mysql.format(sql, ['users',req.params])

  pool.query(sql, (err, results) => {
    if (err) return handleSQLError(res, err)
    return res.json({ message: `Deleted ${results.affectedRows} user(s)` });
  })
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUserById,
  deleteUserByFirstName
}