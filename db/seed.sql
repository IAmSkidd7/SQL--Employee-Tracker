USE employee_db;

INSERT INTO department (id, dept_name)
VALUES
(1, 'marketing'),
(2, 'Science'),
(3, 'Human Resources');

INSERT INTO `role` (dept_id, title, salary)
VALUES
(1, 'Sales representative', 55000),
(2, 'Biologist', 75000),
(3, 'HR manager', 80000);

INSERT INTO employee (manager_id, first_name, last_name, role_id)
VALUES
(24, 'Baron', 'Skidmore', 2),
(12, 'Barry', 'Skidmore', 1),
(4, 'Mandy', 'Vernon', 3);
