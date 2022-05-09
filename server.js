const inquirer = require('inquirer');
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  port: 3306,
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
          'View all Departments',
          'View all Roles',
          'View Employees',
          'Add an Employee',
          'Add Department',
          'Add Role',
          'Update an Employee',
          'Quit'
        ]
      },
    ])
    .then(function (response) {
      if (response.choices === 'View all Departments') {viewDepartment();}
      if (response.choices === 'View all Roles') {viewRoles();}
      if (response.choices === 'View Employees') {viewEmployees();}
      if (response.choices === 'Add an Employee') {addEmployee();}
      if (response.choices === 'Add Department') {addDept();}
      if (response.choices === 'Add Role') {addRole();}
      if (response.choices === 'Update an Employee') {updateEmployee();}
      if (response.choices === 'Quit') {db.end();}
    });
};

function viewDepartment() {
  db.query(`SELECT * FROM department`, function (err, results) {
    if (err) {
      console.log(err);
    };
    console.table(results);
    menuLoad();
  });
};

function viewEmployees() {
  db.query(`SELECT * FROM employee`, function (err, results) {
    if (err) {
      console.log(err);
    };
    console.table(results);
    menuLoad();
  });
};

function viewRoles() {
  db.query(`SELECT * FROM role`, function (err, results) {
    if (err) {
      console.log(err);
    };
    console.table(results);
    menuLoad();
  });
};

function addDept() {
  inquirer.prompt(
    [
      {
        message: 'Enter new department name',
        name: 'dept_name'
      }
    ]
  ).then((answers) => {
    db.query(`INSERT INTO department (dept_name) VALUES (?)`,
      [answers.dept_name],
      (err, results) => {
        menuLoad();
      }
    );
  });
}

function addRole() {
  db.query(`SELECT id AS value, dept_name AS name FROM department`, (err, departments) => {
    if (err) console.log(err);

    inquirer.prompt(
      [
        {
          message: 'Enter role',
          name: 'title'
        },
        {
          message: 'Enter Salary',
          name: 'salary'
        },
        {
          message: 'Choose Department',
          type: 'list',
          name: 'dept',
          choices: departments
        },
      ]
    ).then((answers) => {
      db.query(
        'INSERT INTO role (title, salary, department_id) VALUES (?,?,?)',
        [answers.title, answers.salary, answers.dept],
        (err, results) => {
          if (err) console.log(err);
          console.log(answers);
          menuLoad();
        }
      );
    }
    )
  });
}

function addEmployee() {
  db.query('SELECT id AS value, title AS name FROM role', (err, roles) => {
    if (err) console.log(err);

    inquirer.prompt(
      [
        {
          message: 'First Name:',
          name: 'first_name'
        },
        {
          message: 'last name:',
          name: 'last_name'
        },
        {
          message: 'Choose your Role',
          type: 'list',
          name: 'role',
          choices: roles
        },
      ]
    ).then((answers) => {
      db.query(`INSERT INTO employee (first_name, last_name, role_id) VALUES (?,?,?)`,
        [answers.first_name, answers.last_name, answers.role],
        (err, results) => {
          if (err) console.log(err);
          console.log(answers);
          menuLoad();
        }
      );
    })
  });
}

function updateEmployee() {
  var roleResults;
  db.query(
      `SELECT id AS value, title AS name FROM role`, (err, roles) => {
          if (err) {
              console.log(err)
              return;
          }
          roleResults = roles;
      });
  db.query(
      `SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employee`, (err, employees) => {
          if (err) console.log(err);
          inquirer.prompt(
              [
                  {
                      message: 'Choose employee',
                      type: 'list',
                      name: 'employees',
                      choices: employees
                  },
                  {
                      message: 'Choose new role',
                      type: 'list',
                      name: 'role',
                      choices: roleResults
                  },
              ]
          ).then((answers) => {
              var employeeName = answers.employees.split(' ');
              var employeeFirstName = employeeName[0];
              var employeeLastName = employeeName[employeeName.length - 1];

              db.query(
                  'UPDATE employee SET role_id = ? WHERE first_name = ? AND last_name = ?',
                  [answers.role, employeeFirstName, employeeLastName],
                  (err, results) => {
                      if (err) console.log(err);
                      console.log(results);
                      menuLoad();
                  }
              );
          }
          )
      });
}
