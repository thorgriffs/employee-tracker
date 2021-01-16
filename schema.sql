DROP DATABASE IF EXISTS employee_manager;
CREATE DATABASE employee_manager;

USE employee_manager;

CREATE TABLE department (
	id INTEGER NOT NULL AUTO_INCREMENT,
    name VARCHAR (30),
    PRIMARY KEY (id)
);

CREATE TABLE role (
	id INTEGER NOT NULL AUTO_INCREMENT,
	title VARCHAR(30) NOT NULL,
	salary DECIMAL,
    department_id INTEGER,
    PRIMARY KEY (id),
    FOREIGN KEY (department_id) REFERENCES department(id)   
);

CREATE TABLE employee (
	id INTEGER NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER,
    manager_id INTEGER,
    PRIMARY KEY (id),
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (manager_id) REFERENCES employee(id)
);