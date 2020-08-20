CREATE DATABASE inventory_app;

CREATE TYPE roles AS ENUM
(
  'Admin', 
  'User', 
  'Viewer');

CREATE TABLE accounts
(
  user_id serial PRIMARY KEY,
  firstname VARCHAR ( 50 ) NOT NULL,
  lastname VARCHAR ( 50 ) NOT NULL,
  password VARCHAR ( 255 ) NOT NULL,
  email VARCHAR ( 50 ) UNIQUE NOT NULL,
  created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  account_role roles NOT NULL DEFAULT 'Viewer'
);

CREATE TABLE products
(

  p_id SERIAL PRIMARY KEY,
  creator INT references accounts (user_id) NOT NULL,
  name VARCHAR(255),
  description VARCHAR(255) NOT NULL,
  price BIGINT NOT NULL,
  qrcode VARCHAR(255) UNIQUE NOT NULL,
  thumbnail VARCHAR(255) NOT NULL,
  thumbnail_url VARCHAR(255) NOT NULL,
  category VARCHAR(255) NOT NULL,
  last_user INT references accounts (user_id) NOT NULL,
  last_transact TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP

);





-- DROP TABLE IF EXISTS products 
-- CASCADE RESTRICT;