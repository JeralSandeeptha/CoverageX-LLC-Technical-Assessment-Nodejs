# Express.js API with TypeScript and PostgreSQL

This repository contains the source code for a Expressjs API with Typescript that integrates with a React Application. The project is designed to run locally, providing a backend setup for demonstration purposes.

## Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
    - [Run project thorugh Nodejs](#run-project-through-nodejs)
    - [Run thorugh Docker](#run-through-docker)
- [Test Application](#test-application)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## Overview

This is a RESTful API built with Express.js and TypeScript, using PostgreSQL as the database. The API allows users to manage tasks, including creating, retrieving, updating, and deleting tasks.

## Getting Started

Follow the instructions below to set up and run the project locally.

Ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- npm (comes with Node.js)
- A code editor, such as [Visual Studio Code](https://code.visualstudio.com/)
- As a Language [Setup Typescript](https://www.typescriptlang.org/)
```js
npm install -g typescript
```
- As a Database [Download PostgreSQL](https://www.postgresql.org/download/)
- As a database Management tool [Download PgAdmin](https://www.pgadmin.org/download/)

# Project Structure

- **Utils**: Include all the utility functions
- **Cypress**: Include all the E2D tests
- **Config**: Include all the configurations such as Database and logger
- **Controllers**: Include all the controllers to handle business logic of each request and responses
- **Routes**: Include all the routes for handle API request
- **Middleswares**: Include all the middlewares to handle and authenticate related request and responses
- **Tests**: Include all the unit and intergration testing
- **Types**: Include all the Typescript types for ensure the type safety

# Database Schema

![ER Diagram](https://res.cloudinary.com/dv9ax00l4/image/upload/v1740517480/er_gmsju3.png)

- Create a database called `TodoApp`
- Run the below sql commands to create tables
```sql
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS task (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description VARCHAR(255) NOT NULL,
    userId VARCHAR(255) NOT NULL,
    isCompleted BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SELECT * FROM task;
SELECT * FROM users;
```

## Environment Variables

- Create .env file inside the project root folder.
- Add these variables to .env file.
```bash
PORT=3000
DATABASE_URL=postgres://postgres:1234@localhost:5432/TodoApp
JWT_SECRET=my_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

## Running the Project

### Run project thorugh Nodejs

For production server
```bash
npm start
```

For development server
```bash
npm run dev
```

### Run thorugh Docker

If you are want to run the project locally with Docker? You can run the follwing command.
```bash
docker run -p 3000:3000 -e PORT=3000 -e DATABASE_URL="postgres://postgres:1234@host.docker.internal:5432/TodoApp" -e JWT_SECRET=my_secret -e JWT_REFRESH_SECRET=your_refresh_secret jeralsandeeptha/coveragex-nodejs
```

## Test Application

## API Documentation

This is the [API Documentation](https://documenter.getpostman.com/view/20760727/2sAYdeNC6s)

## Contributing

- Feel free to fork the repository and submit pull requests to contribute to the project.

## License

- This project is licensed under the MIT License.