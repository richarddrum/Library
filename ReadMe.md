# Library Management System

## Overview

This Library Management System is a web application designed to manage book registrations, user sign-ups, and user roles (Customer and Librarian). It provides functionalities for both types of users, allowing them to interact with the system efficiently.

## Features

### User Registration and Login

- **Sign Up**: New users can register as either Customers or Librarians. Upon successful registration, they are automatically logged in.
- **Login**: Registered users can log in with their username and password. The application verifies their credentials and manages user roles.

### Role-Based Access

- **Customers**: 
  - Can browse books on the registry
  - Make reviews on books that include a star rating, and review message
  - Check out books.
- **Librarians**: 
  - Can view all checked-out books and their due dates.
  - Managing book information and availability.
  - Add, edit and delete books on the registry
  - Return books
  
### JWT Authentication

- The application uses JSON Web Tokens (JWT) for user authentication, ensuring secure access to resources based on user roles.

## Technologies Used

- **Frontend**: 
  - React
  - TypeScript
  - Axios for API calls
  - React Router for navigation
- **Backend**: 
  - ASP.NET Core for API
  - Entity Framework for database interaction
  - JWT for authentication
- **Database**: 
  - SQL Server or any relational database for storing user and book information.

## Installation
Download and install the necessary technology: .NET 8, Node Package Manager, SQL Server

1. Clone the repository:
   ```bash
   git clone https://github.com/richarddrum/Library.git
2. Ensure SQL Server is running on port 1433 on your machine
    - Set the connection string in ./appsettings.json appropriately 
3. Build and start the API - should run locally on port 5237
   ```bash
   cd Library
   dotnet build
   dotnet run
4. Install the necessary dependencies
   ```bash
   cd library-frontend
   npm install
5. Run the frontend - should run on port 3000
   ```bash
   npm run start
