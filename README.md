# ToDoApp - Full Stack Task Management Application

A modern, full-stack task management application built with Spring Boot (backend) and React (frontend), featuring JWT authentication and a Kanban board interface.

## 🚀 Features

- **User Authentication**: Secure JWT-based login and registration
- **Kanban Board**: Drag-and-drop task management with multiple columns (New, In Progress, Done)
- **RESTful API**: Clean REST endpoints for all operations
- **Responsive UI**: Modern React interface with intuitive design
- **Database Integration**: PostgreSQL database with JPA/Hibernate
- **Containerized**: Docker support for easy deployment
- **Security**: BCrypt password hashing and JWT token management

## 🛠 Tech Stack

### Backend

- **Java 21**
- **Spring Boot 3.5.0**
- **Spring Security** with JWT authentication
- **Spring Data JPA** with Hibernate
- **PostgreSQL** database
- **Maven** for dependency management
- **Docker** for containerization

### Frontend

- **React 19.1.0**
- **React Router DOM 7.6.2**
- **Modern CSS** with responsive design
- **Drag & Drop API** for Kanban functionality

## 📋 Prerequisites

- Java 21 or higher
- Maven 3.6+
- Node.js 18+ and npm
- PostgreSQL 12+
- Docker and Docker Compose (optional)

## 🚀 Quick Start

### Option 1: Docker Compose (Recommended)

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd ToDoApp
   ```

2. **Set up PostgreSQL database**

   - Ensure PostgreSQL is running on your host machine
   - Create a database named `dev`
   - Update database credentials in `docker-compose.yml` if needed

3. **Start the application**

   ```bash
   docker-compose up --build
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080
   - API Documentation: http://localhost:8080/swagger-ui/index.html

### Option 2: Local Development

#### Backend Setup

1. **Configure Database**

   ```bash
   # Create PostgreSQL database
   createdb dev
   ```

2. **Update application.properties**

   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/dev
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

3. **Build and run the backend**
   ```bash
   ./mvnw clean install
   ./mvnw spring-boot:run
   ```

#### Frontend Setup

1. **Navigate to UI directory**

   ```bash
   cd src/ui
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

## 🔧 Configuration

### Database Configuration

The application expects a PostgreSQL database with the following default configuration:

```properties
# Development
spring.datasource.url=jdbc:postgresql://localhost:5432/dev
spring.datasource.username=devappuser
spring.datasource.password=devbrice

# Docker
spring.datasource.url=jdbc:postgresql://host.docker.internal:5432/dev
```

### JWT Configuration

JWT tokens are configured for secure authentication. The secret key and expiration can be configured in `application.properties`.

## 📖 API Documentation

The application includes OpenAPI documentation available at:

- **Swagger UI**: http://localhost:8080/swagger-ui/index.html
- **OpenAPI JSON**: http://localhost:8080/v3/api-docs

### Key Endpoints

#### Authentication

- `POST /api/register` - User registration
- `POST /api/login` - User login

#### Protected Routes

All todo-related endpoints require JWT authentication via the `Authorization: Bearer <token>` header.

## 🏗 Project Structure

```
ToDoApp/
├── src/
│   ├── main/
│   │   ├── java/com/brice/todoapp/
│   │   │   ├── controllers/          # REST controllers
│   │   │   ├── models/              # JPA entities
│   │   │   ├── repositories/        # Data repositories
│   │   │   ├── security/            # Security configuration
│   │   │   ├── dto/                 # Data transfer objects
│   │   │   └── config/              # Application configuration
│   │   └── resources/
│   │       └── application.properties
│   ├── test/                        # Unit tests
│   └── ui/                          # React frontend (see ui/README.md)
├── docker-compose.yml               # Docker composition
├── Dockerfile                       # Backend Docker image
└── pom.xml                         # Maven configuration
```

## 🧪 Testing

### Backend Tests

```bash
./mvnw test
```

### Frontend Tests

```bash
cd src/ui
npm test
```

## 🐳 Docker Commands

### Build and run with Docker Compose

```bash
docker-compose up --build
```

### Build backend image only

```bash
docker build -t todoapp-backend .
```

### Run backend container

```bash
docker run -p 8080:8080 todoapp-backend
```

## 🚀 Deployment

### Production Build

1. **Backend JAR**

   ```bash
   ./mvnw clean package -DskipTests
   ```

2. **Frontend Build**
   ```bash
   cd src/ui
   npm run build
   ```

### Environment Variables

For production deployment, configure these environment variables:

```bash
SPRING_PROFILES_ACTIVE=prod
SPRING_DATASOURCE_URL=jdbc:postgresql://your-db-host:5432/todoapp_prod
SPRING_DATASOURCE_USERNAME=your_username
SPRING_DATASOURCE_PASSWORD=your_password
JWT_SECRET=your_jwt_secret_key
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Issues**

   - Ensure PostgreSQL is running
   - Verify database credentials in configuration
   - Check if database exists

2. **Port Conflicts**

   - Backend runs on port 8080
   - Frontend runs on port 3000
   - Ensure these ports are available

3. **CORS Issues**

   - Frontend is configured to run on localhost:3000
   - Update CORS configuration in `WebConfig.java` if needed

4. **JWT Token Issues**
   - Tokens expire after the configured time
   - Ensure proper token format: `Bearer <token>`

### Logs

- **Backend logs**: Check console output or configure logging in `application.properties`
- **Frontend logs**: Check browser console for React errors

## 📞 Support

For questions or issues, please:

1. Check the troubleshooting section above
2. Review the API documentation
3. Create an issue in the repository
