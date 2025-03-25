The Recipe RESTful API is a service designed to manage and interact with recipes in a
structured and secure manner. It provides endpoints for creating, reading, updating, and
deleting (CRUD) recipes, as well as managing user accounts. This API follows RESTful
principles, ensuring stateless communication and clear resource identification through
well-defined endpoints.

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Key features include:
1. Authentication: The API uses Basic Authentication for secure access, requiring
   valid credentials to perform certain operations like creating or updating recipes.

2. Validation: JSON schema validation ensures that all incoming data is to predefined formats,
   improving data integrity and reducing errors.

3. Pagination and Filtering: The API supports pagination and filtering to efficiently
   handle large datasets, making it user-friendly and scalable.

4. Access Control: Role-based access control (RBAC) ensures that only authorized
   users can modify or delete their recipes while administrators have extended permissions.
   
6. Database Integration: The API interacts with a MySQL database to store and retrieve data,
   ensuring persistence and reliability.

7. Scalability: Designed with modularity, the API can be extended with additional models, routes,
   and functionalities.
   
9. This API is ideal for applications requiring recipe management, providing a secure, and extensible
   service for end-users.
   

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
ER Diagram:
Client (Postman/Browser/Mobile App)
↕
RESTful API (Koa.js Framework)
↕
MySQL Database (Users, Recipes, RecipeViews)

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Video link: https://youtu.be/-O0bJPMqS-k?si=ZR
