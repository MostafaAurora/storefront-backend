# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
#### Products
- Index 
   - http verb: get
   - route: '/products'

- Show by id
    - http verb: get
    - route: '/products/id'
    - params: 
        - id : sent in request query

- Show by price
    - http verb: get
    - route: '/products/price'
    - params:
        - price: sent in request query
        - operator: sent in request query [<, >, =]

- Show by price range
    - http verb: get
    - route: '/products/priceRange'
    - params:
        - min: sent in request query
        - max: sent in request query

- Show by keyword
    - http verb: get
    - route: '/products/keyword'
    - params:
        - keyword: sent in request query

- Show by category
    - http verb: get
    - route: '/products/category'
    - params:
        - category: sent in request query
        - sub_category: sent in request query [optional]
        - sub_category2: sent in request query [optional]
               
- Create [token required & attribute required]
    - http verb: post
    - route '/products'
    - params: [sent in request body]
        - name
        - price
        - category
        - sub_category
        - sub_category2
        - product_description

- Update [token required & attribute required]
    - http verb: put
    - route '/products'
    - params: [sent in request body]
        - id
        - name
        - price
        - category
        - sub_category
        - sub_category2
        - product_description

- Delete [token required & attribute required]
    - http verb: delete
    - route '/products'
    - params: [sent in request body]
        - id


#### Users
- Index [token required & attribute required]
    - http verb: get
    - route: '/users'

- Show by id [token required & attribute required]
    - http verb: get
    - route: '/users/id'
    - params: [sent in request query]
        - id

- Show by email [token required & attribute required]
    - http verb: get
    - route: '/users/email'
    - params: [sent in request query]
        - email

- Show by phone number [token required & attribute required]
    - http verb: post [for security reasons]
    - route: '/users/byNumber'
    - params: [sent in request body for security reasons]
        - phone number

- authenticate 
    - http verb: post
    - route: '/users'
    - params: [sent in request body]
        - email
        - password
       
- Create [no token required if creating a normal account, token required and attribute required for creating admin or moderator accounts] 
    - http verb: post
    - route: '/users/new'
    - params: [sent in request body]
        - first_name
        - last_name
        - email
        - password
        - role [only admins can create admin or moderator users]
        - phone_number

- Update [token required and same user required] 
    - http verb: put
    - route: '/users'
    - params: [sent in request body]
        - first_name
        - last_name
        - email
        - password
        - role
        - phone_number

- Delete [token required and same user required] 
    - http verb: delete
    - route: '/users/delete'
    - params: [sent in request body]
        - id

- Create N[token required]

#### Orders
- Index [token required and attribute required]
    - http verb: get
    - route: '/orders'

- show by user id [token required and attribute or same user required]
    - http verb: get
    - route: '/orders/user_id'
    - params: [sent in request query]
        - user_id

- show by order id [token required and attribute or same user required]
    - http verb: get
    - route: '/orders/order_id'
    - params: [sent in request query]
        - order_id

- Create [token required]
    - http verb: post
    - route: '/orders'
    - params: [sent in request body]
        - user_id

- Update [token required and attribute required]
    - http verb: put
    - route: '/orders'
    - params: [sent in request body]
        - user_id
        - status [from open to closed]


- Delete by user id [token required and same user required]
    - http verb: delete
    - route: '/orders/user_id'
    - params: [sent in request body]
        - user_id

- Delete by order id [token required and same user required]
    - http verb: delete
    - route: '/orders/user_id'
    - params: [sent in request body]
        - order_id


### order products
- Create [token required]
    - http verb: post
    - route: '/orders/products'
    - params: [sent in request body]
        - quantity
        - order_id
        - product_id

- Delete [token required]
    - http verb: delete
    - route: '/orders/products'
    - params: [sent in request body]
        - order_id
        - product_id



## Data Shapes
#### Product
- products table
    - id SERIAL PRIMARY KEY,
    - name VARCHAR(50) NOT NULL,
    - price BIGINT NOT NULL,
    - category VARCHAR(50) NOT NULL,
    - sub_category VARCHAR(50),
    - sub_category2 VARCHAR(50),
    - product_description TEXT NOT NULL

#### User
- users table
    - id SERIAL PRIMARY KEY,
    - first_name VARCHAR(50) NOT NULL,
    - last_name VARCHAR(50) NOT NULL,
    - email VARCHAR(100) UNIQUE NOT NULL,
    - password VARCHAR(200) NOT NULL,
    - role VARCHAR(50) NOT NULL,
    - phone_number VARCHAR(15) UNIQUE

#### Orders
- orders table
    - id SERIAL PRIMARY KEY,
    - status VARCHAR(15),
    - user_id bigint REFERENCES users(id)

- order_products table
    - id SERIAL PRIMARY KEY,
    - quantity integer,
    - order_id bigint REFERENCES orders(id),
    - product_id bigint REFERENCES products(id)

