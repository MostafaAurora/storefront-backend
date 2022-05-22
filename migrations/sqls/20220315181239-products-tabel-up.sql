CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    price BIGINT NOT NULL,
    category VARCHAR(50) NOT NULL,
    sub_category VARCHAR(50),
    sub_category2 VARCHAR(50),
    product_description TEXT NOT NULL
);