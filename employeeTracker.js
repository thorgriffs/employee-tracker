const inquirer = require('inquirer');
const mysql = require('mysql');
const cTable = require('console.table');
var figlet = require('figlet');


figlet('Employee\n \n Manager', function(err, data) {
  if (err) {
      console.log('Something went wrong...');
      console.dir(err);
      return;
  }
  console.log(data);
  setTimeout(connectToDb,2000);
});

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "employee_manager"
});

function connectToDb() {
  connection.connect(function(err) {
    if (err) throw err;  
  
    employeeManager();
  })
}
// connection.connect(function(err) {
//   if (err) throw err;  

//   employeeManager();
// })

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
        'Add Employee',
        'Remove Employee',
        'Update Employee Role',
        'Update Employee Manager',
        'View All Departments',
        'View All Roles',
        'Add Department',
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

        case 'Add Department':
          addDepartment();
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
    if (err) throw err;
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
    if (err) throw err;
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
  var employeeNames = [];
  var query = 'SELECT id, CONCAT(first_name," ",last_name) AS employee FROM employee'; 
  connection.query(query, function (err, employees) {
    if (err) throw err;
    for (var i = 0; i < employees.length; i++) {
      employeeNames.push(employees[i].employee);
    }

    inquirer
    .prompt([
      {
      name: 'remove',
      type: 'list',
      message: 'Which employee do you want to remove',
      choices: employeeNames
      },
    ])
    .then(function(answer) {
      var employeeId = employees.filter(ee => ee.employee === answer.remove)[0].id;      
        
      connection.query(
        'DELETE FROM employee WHERE id = ?', 
        [
          employeeId
        ],
        function(err) {
          if (err) throw err;
          console.log('Removed employee ' + answer.remove + ' from the database');
          console.log(employeeId);
          console.log(answer, employeeId);
          
          employeeManager();
        }
      );
    });
  });
}

function editEmployeeRole() {
  var roleNames = [];
  var employeeNames = [];
  var query = 'SELECT id, CONCAT(first_name," ",last_name) AS employee FROM employee'; 
  
  connection.query(query, function (err, employees) {
    if (err) throw err;

    query = 'SELECT id, title FROM role';
    connection.query(query, function(err, roles) {
      if (err) throw err;
    
      for (var i = 0; i < employees.length; i++) {
        employeeNames.push(employees[i].employee);
      }
      for (var i = 0; i < roles.length; i++) {
        roleNames.push(roles[i].title);
      }

    inquirer
    .prompt([
      {
        name: 'empSelection',
        type: 'list',
        message: 'Which employee\'s role do you want to update?',
        choices: employeeNames
      },
      {
        name: 'roleSelection',
        type: 'list',
        message: 'Which role do you want to set for the selected employee?',
        choices: roleNames
      }
    ])
    .then(function(answer) {        
      var employeeId = employees.filter(emp => emp.employee === answer.empSelection)[0].id;
      var roleId = roles.filter(role => role.title === answer.roleSelection)[0].id;
      
      var query = 'UPDATE employee SET role_id = ? WHERE id = ?'
      
      connection.query(query, [roleId, employeeId], function(err, res) {
        if (err) throw err;
        console.log(answer.empSelection  + '\'s role was set to ' + answer.roleSelection);
        
        employeeManager();
        }
      );
    });
  });
});
}

function editEmployeeMgr() {
  var employeeNames = [];
  var managerNames = ['None'];
  var query = 'SELECT id, CONCAT(first_name," ",last_name) AS employee FROM employee'; 
  
  connection.query(query, function (err, employees) {
    if (err) throw err;

    query = 'SELECT id, CONCAT(first_name," ",last_name) AS manager FROM employee';
    connection.query(query, function(err, managers) {
      if (err) throw err;
    
      for (var i = 0; i < employees.length; i++) {
        employeeNames.push(employees[i].employee);
      }
      for (var i = 0; i < managers.length; i++) {
        managerNames.push(managers[i].manager);
      }
    inquirer
    .prompt([
      {
        name: 'selectEmployee',
        type: 'list',
        message: 'Which employee\'s manager do you want to update?',
        choices: employeeNames
      },
      {
        name: 'selectMgr',
        type: 'list',
        message: 'Which employee do you want to set as the manager for the selected employee?',
        choices: managerNames
      }
    ])
    .then(function(answer) {        
      var managerId = null;
      if (answer.selectMgr !== 'None') {
        managerId = managers.filter(mgr => mgr.manager === answer.selectMgr)[0].id;
      }
      var employeeId = employees.filter(emp => emp.employee === answer.selectEmployee)[0].id;

      var query = 'UPDATE employee SET manager_id = ? WHERE id = ?'
      
      connection.query(query, [managerId, employeeId], function(err, res) {
        if (err) throw err;
        console.log(answer.selectEmployee  + '\'s manager was set to ' + answer.selectMgr);
        
        employeeManager();
        }
      );
    });
  });
});
}

function addDepartment() {
  inquirer
  .prompt([
    {
      name: 'department',
      type: 'input', 
      message: 'What is the name of the department?'
    }
  ])
  .then(function(answer) {
    connection.query('INSERT INTO department SET ?', { name: answer.department},
    function(err) {
      if (err) throw err;
      console.log(answer.department + ' was successfully added as a department');
      
      employeeManager();
      }
    );
  });
}

function addRole() {
  var departmentNames = [];
  var query = 'SELECT id, name AS department FROM department'; 
  connection.query(query, function (err, departments) {
    if (err) throw err;
    for (var i = 0; i < departments.length; i++) {
      departmentNames.push(departments[i].department);
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
      name: 'eeDept',
      type: 'list',
      message: 'Under Which department does the role belong?',
      choices: departmentNames
      }
    ])
    .then(function(answer) {        
      var departmentId = departments.filter(dept => dept.department === answer.eeDept)[0].id;
      
      connection.query(
        'INSERT INTO role SET ?',
        {
          title: answer.title,
          salary: answer.salary,
          department_id: departmentId
        },
        function(err) {
          if (err) throw err;
          console.log(answer.title + ' was successfully added as a Role');
          employeeManager();
        }
      );
    });
  });
}