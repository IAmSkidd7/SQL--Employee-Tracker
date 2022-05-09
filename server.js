const inquirer = require('inquirer');
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  port: 3001,
  user: 'root',
  password: 'Dekem123!',
  database: 'employee_db'
});

db.connect(function (err) {
  if (err) throw err;
  console.log('Successful Connection');
  menuLoad();
});

function menuLoad() {
  return inquirer
  .prompt([
    {
      type: 'list',
      message: 'The following options allow you to view employees as well as add them',
      name: 'choices',
      choices: [
        {value: 'View all Departments'},
        {value: 'View all Roles'},
        {value: 'View Employees'},
        {value: 'add an employee'},
        {value: 'Add Department'},
        {value: 'Add Role'},
        {value: 'Update an Employee'},
        {value: 'Quit'}
      ]
    },
  ])
}