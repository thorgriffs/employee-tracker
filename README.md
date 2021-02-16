# Bootcamp Homework 12 - MySQL: Employee Tracker

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
## Description
This is a coding bootcamp homework assignment to architect and build a solution for managing a company's employees using node, [inquirer](https://www.npmjs.com/package/inquirer), and [MySQL](https://www.npmjs.com/package/mysql). The command-line application allows a user to:

  * Add departments, roles, employees

  * View departments, roles, employees

  * Update employee roles

  * And more...

## Table of Contents
* [Installation](#Installation)
* [Usage](#Usage)
* [Demo](#Demo)
* [Contributing](#Contributing)
* [Questions](#Questions)
* [License](#License)

## Installation
Install the following dependencies: 
```bash
npm install
npm install inquirer
npm install mysql
npm install console.table
npm install figlet
```
The application database schema contains three tables:

![Database Schema](Assets/schema-design.png)

* **department**:

  * **id** - INT PRIMARY KEY
  * **name** - VARCHAR(30) to hold department name

* **role**:

  * **id** - INT PRIMARY KEY
  * **title** -  VARCHAR(30) to hold role title
  * **salary** -  DECIMAL to hold role salary
  * **department_id** -  INT to hold reference to department role belongs to

* **employee**:

  * **id** - INT PRIMARY KEY
  * **first_name** - VARCHAR(30) to hold employee first name
  * **last_name** - VARCHAR(30) to hold employee last name
  * **role_id** - INT to hold reference to role employee has
  * **manager_id** - INT to hold reference to another employee that manages the employee being Created. This field may be null if the employee has no manager

**Sample `schema.sql` & `seed.sql` files are provided in `/db` folder**

## Usage
Execute the Employee Tracker with 
```bash
node employeeTracker.js
```
## Demo
The application is run from the command-line:

![EmployeeTrackerDemo](Assets/employee-tracker-demo.gif)

**A full demo can be found [here](https://drive.google.com/file/d/1hcNuZC-dd99eOsZZ9Dpe1YVe_7XlsPnp/view?usp=sharing).**

## Contributing
Fork the repo and submit a pull request to enhance the code or fix a bug

## Questions
Have questions?  Contact me on [GitHub](https://github.com/thorgriffs) or email <22.kelliking@gmail.com>

## License

  [MIT](https://github.com/thorgriffs/employee-tracker/blob/main/LICENSE) License
  
  Copyright (c) 2021 Kelli King