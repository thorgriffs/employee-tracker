const inquirer = require('inquirer');
const mysql = require('mysql');
const cTable = require('console.table');

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "employee_manager"
  });

connection.connect(function(err) {
  if (err) throw err;
  employeeManager();
})

function employeeManager() {
  inquirer
    .prompt({
      name: 'action',
      type: 'rawlist',
      message: 'What would you like to do?',
      choices: [
        'View All Employees',
        'View All Employees By Department',
        'View All Employees By Manager',
        'View All Departments',
        'View All Roles',
        'Add Employee',
        'Remove Employee',
        'Update Employee Role',
        'Update Employee Manager',
        'Add Role'
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
        case 'View All Employees':
          viewEmployees();
          break;

        case 'View All Employees By Department':
          viewEmployeesDept();
          break;

        case 'View All Employees By Manager':
          viewEmployeesMgr();
          break;

        case 'View All Departments':
          viewDepartments();
          break;

        case 'View All Roles':
          viewRoles();
          break;

        case 'Add Employee':
          addEmployee();
          break;

        case 'Remove Employee':
          removeEmployee();
          break;

        case 'Update Employee Role':
          editEmployeeRole();
          break;

        case 'Update Employee Manager':
          editEmployeeMgr();
          break;

        case 'Add Role':
          addRole();
          break;
      }
    });
}

function viewEmployees() {
  var query = 'SELECT ee.id, ee.first_name,ee.last_name,rl.title,dt.name AS department, ';
  query += 'rl.salary,CONCAT(e2.first_name," ",e2.last_name) AS manager '; 
  query += 'FROM employee ee ';
  query += 'LEFT JOIN role rl ON rl.id = ee.role_id ';
  query += 'LEFT JOIN department dt ON dt.id = rl.department_id ';
  query += 'LEFT JOIN employee e2 ON e2.id = ee.manager_id';
  connection.query(query, function(err, res) {
    console.table(res);

    employeeManager();
  });  
}

function viewEmployeesDept() {
  var query = 'SELECT ee.id, ee.first_name,ee.last_name,rl.title,dt.name AS department, ';
  query += 'rl.salary,CONCAT(e2.first_name," ",e2.last_name) AS manager '; 
  query += 'FROM employee ee ';
  query += 'LEFT JOIN role rl ON rl.id = ee.role_id ';
  query += 'LEFT JOIN department dt ON dt.id = rl.department_id ';
  query += 'LEFT JOIN employee e2 ON e2.id = ee.manager_id ';
  query += 'Order by department';
  connection.query(query, function(err, res) {
    console.table(res);

    employeeManager();
  });  
}

function viewEmployeesMgr() {
  var query = 'SELECT ee.id, ee.first_name,ee.last_name,rl.title,dt.name AS department, ';
  query += 'rl.salary,CONCAT(e2.first_name," ",e2.last_name) AS manager '; 
  query += 'FROM employee ee ';
  query += 'LEFT JOIN role rl ON rl.id = ee.role_id ';
  query += 'LEFT JOIN department dt ON dt.id = rl.department_id ';
  query += 'LEFT JOIN employee e2 ON e2.id = ee.manager_id ';
  query += 'Order by manager';
  connection.query(query, function(err, res) {
    if (err) throw err;

    console.table(res);

    employeeManager();
  });  
}

function viewDepartments() {
  var query = 'SELECT id, name AS department FROM department ORDER BY name'; 
  connection.query(query, function(err, res) {
    if (err) throw err;
    
    console.table(res);

    employeeManager();
  });  
}

function viewRoles() {
  var query = 'SELECT id, title AS role FROM role ORDER BY title'; 
  connection.query(query, function(err, res) {
    if (err) throw err;
    
    console.table(res);

    employeeManager();
  });  
}

function addEmployee() {
  var roleNames = [];
  var managerNames = ['None'];
  var query = 'SELECT id, CONCAT(first_name," ",last_name) AS manager FROM employee'; 
  
  connection.query(query, function (err, managers) {
    if (err) throw err;

    query = 'SELECT id, title FROM role';
    connection.query(query, function(err, roles) {
      if (err) throw err;
    
      for (var i = 0; i < managers.length; i++) {
        managerNames.push(managers[i].manager);
      }
      for (var i = 0; i < roles.length; i++) {
        roleNames.push(roles[i].title);
      }

      inquirer
      .prompt([
        {
          name: 'firstName',
          type: 'input',
          message: 'What is the employee\'s first name?',
        },
        {
          name: 'lastName',
          type: 'input',
          message: 'What is the employee\'s last name?'
        },
        {
          name: 'eeRole',
          type: 'list',
          message: 'What is the employee\'s role?',
          choices: roleNames
        },
        {
          name: 'eeMgr',
          type: 'list',
          message: 'Who is the employee\'s manager?',
          choices: managerNames
        }
      ])
      .then(function(answer) {        
        var managerId = null;
        if (answer.eeMgr !== 'None') {
          managerId = managers.filter(mgr => mgr.manager === answer.eeMgr)[0].id;
        }
        var roleId = roles.filter(role => role.title === answer.eeRole)[0].id;

        console.log(answer, managerId, roleId);
        
        connection.query(
          'INSERT INTO employee SET ?',
          {
            first_name: answer.firstName,
            last_name: answer.lastName,
            role_id: roleId,
            manager_id: managerId
          },
          function(err) {
            if (err) throw err;
            console.log('The employee was successfully added');
            employeeManager();
          }
        );
      });
    });
  });
}

function removeEmployee() {
  var employees = [];
  var query = 'SELECT CONCAT(first_name," ",last_name) AS employee FROM employee'; 
  connection.query(query, function (err,res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      employees.push(res[i].employee);
    }

    inquirer
    .prompt([
      {
      name: 'remove',
      type: 'list',
      message: 'Which employee do you want to remove',
      choices: employees
      },
    ])
    .then(function(answer) {
      console.log(answer);

      employeeManager();
    });
  });
};

function editEmployeeRole() {
  var roles = [];
  var employees = [];
  var query = 'SELECT r.id, r.title, e.id, CONCAT(e.first_name," ",e.last_name) AS employee '; 
  query += 'FROM role r JOIN employee e ON e.role_id = r.id';
  connection.query(query, function (err,res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      roles.push(res[i].title);
      employees.push(res[i].employee);
    }

    inquirer
    .prompt([
      {
        name: 'empSelection',
        type: 'list',
        message: 'Which employee\'s role do you want to update?',
        choices: employees
      },
      {
        name: 'roleSelection',
        type: 'list',
        message: 'Which role do you want to set for the selected employee?',
        choices: roles
      }
    ])
    .then(function(answer) {
      console.log(answer);
      const selectedEmp = answer.empSelection;
      const eeName = selectedEmp.split(' ')
      console.log(eeName[0],eeName[1]);


      employeeManager();
    });
  });
};

function editEmployeeMgr() {
  var employees = [];
  var query = 'SELECT CONCAT(first_name," ",last_name) AS employee FROM employee'; 
  connection.query(query, function (err,res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      employees.push(res[i].employee);
    }

    inquirer
    .prompt([
      {
        name: 'selectEmployee',
        type: 'list',
        message: 'Which employee\'s manager do you want to update?',
        choices: employees
      },
      {
        name: 'selectMrg',
        type: 'list',
        message: 'Which employee do you want to set as the manager for the selected employee?',
        choices: employees
      }
    ])
    .then(function(answer) {
      console.log(answer);
      const selectedEmp = answer.selectEmployee;
      const eeName = selectedEmp.split(' ')
      console.log(eeName[0],eeName[1]);


      employeeManager();
    });
  });
};

function addRole() {
  var departments = [];
  var query = 'SELECT name AS department FROM department'; 
  connection.query(query, function (err,res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      departments.push(res[i].department);
    }

    inquirer
    .prompt([
      {
      name: 'title',
      type: 'input',
      message: 'What is the title of the role?',
      },
      {
      name: 'salary',
      type: 'input',
      message: 'What is the salary of the role?'
      },
      {
      name: 'eeRole',
      type: 'list',
      message: 'Which department do you want to set for the new role?',
      choices: departments
      }
    ])
    .then(function(answer) {
      console.log(answer);
    
      employeeManager();
    });
  });
};