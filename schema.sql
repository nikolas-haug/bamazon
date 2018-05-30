-- Drops the animals_db if it exists currently --
DROP DATABASE IF EXISTS bamazon;
-- Creates the "animals_db" database --
CREATE DATABASE bamazon;

-- Makes it so all of the following code will affect animals_db --
USE bamazon;

-- Creates the table "people" within animals_db --
CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(50) NOT NULL,
  department_name VARCHAR(50) NOT NULL,
  price DECIMAL (10,2) NOT NULL,
  stock_quantity INT(10),
  PRIMARY KEY (item_id)
);


