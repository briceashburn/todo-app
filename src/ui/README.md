# ToDoApp Frontend - React Kanban Board

A modern, responsive React frontend for the ToDoApp task management system featuring a beautiful Kanban board interface with drag-and-drop functionality.

## 🚀 Features

- **Kanban Board Interface**: Interactive task management with drag-and-drop
- **Real-time Updates**: Seamless task status transitions
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Authentication**: JWT-based login and registration
- **Modern UI**: Clean, intuitive design with smooth animations
- **Protected Routes**: Secure navigation with authentication checks

## 🛠 Tech Stack

- **React 19.1.0** - Modern React with latest features
- **React Router DOM 7.6.2** - Client-side routing
- **HTML5 Drag & Drop API** - Native drag-and-drop functionality
- **CSS3** - Modern styling with flexbox and grid
- **JWT Authentication** - Secure token-based authentication

## 📋 Prerequisites

- Node.js 18+ and npm
- Running ToDoApp backend (Spring Boot application)

## 🚀 Quick Start

### Development Setup

1. **Navigate to the UI directory**

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

4. **Open your browser**
   - Visit http://localhost:3000
   - The app will automatically reload when you make changes

### Production Build

1. **Create production build**

   ```bash
   npm run build
   ```

2. **Serve the build** (optional)
   ```bash
   npx serve -s build
   ```

## 📖 Available Scripts

### `npm start`

Runs the app in development mode at http://localhost:3000

- Hot reloading enabled
- Lint errors shown in console
- Source maps for debugging

### `npm test`

Launches the test runner in interactive watch mode

- Runs all test files
- Re-runs tests when files change
- Coverage reporting available

### `npm run build`

Builds the app for production to the `build` folder

- Optimized for best performance
- Minified and bundled assets
- Hashed filenames for caching
- Ready for deployment

### `npm run eject`

⚠️ **One-way operation!** Ejects from Create React App

- Exposes all configuration files
- Full control over webpack, Babel, ESLint
- Use only if you need custom configuration

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

## 🏗 Project Structure

```
src/ui/
├── public/
│   ├── index.html              # Main HTML template
│   ├── favicon.ico             # App icon
│   ├── manifest.json           # PWA configuration
│   └── robots.txt              # SEO configuration
├── src/
│   ├── components/
│   │   └── NavBar.js           # Navigation component
│   ├── pages/
│   │   └── Dashboard.js        # Main Kanban board
│   ├── security/
│   │   └── ProtectedRoute.js   # Route protection
│   ├── css/
│   │   ├── HomePage.css        # Homepage styles
│   │   ├── Dashboard.css       # Kanban board styles
│   │   ├── NavBar.css          # Navigation styles
│   │   └── index.css           # Global styles
│   ├── services/               # API service layer
│   ├── tests/
│   │   └── App.test.js         # Component tests
│   ├── HomePage.js             # Landing/login page
│   ├── index.js                # App entry point
│   └── setupTests.js           # Test configuration
├── build/                      # Production build output
├── node_modules/               # Dependencies
├── package.json                # Project configuration
└── README.md                   # This file
```

## 🎨 UI Components

### Dashboard (Kanban Board)

- **Interactive Columns**: New, In Progress, Done
- **Drag & Drop**: Move tasks between columns
- **Task Management**: Add, delete, and organize tasks
- **Responsive Layout**: Adapts to different screen sizes

### NavBar

- **User Authentication**: Login/logout functionality
- **Navigation**: Seamless routing between pages
- **Responsive Design**: Mobile-friendly navigation

### ProtectedRoute

- **Authentication Guard**: Protects authenticated routes
- **JWT Validation**: Verifies token authenticity
- **Automatic Redirect**: Sends users to login when needed

## 🔧 Configuration

### Backend Integration

The frontend is configured to communicate with the Spring Boot backend:

```javascript
// Default backend URL
const API_BASE_URL = "http://localhost:8080/api";
```

### Environment Variables

For different environments, you can create `.env` files:

```bash
# .env.development
REACT_APP_API_URL=http://localhost:8080/api

# .env.production
REACT_APP_API_URL=https://your-production-api.com/api
```

## 🧪 Testing

### Running Tests

```bash
npm test
```

### Test Coverage

```bash
npm test -- --coverage
```

### Test Structure

- **Unit Tests**: Component functionality
- **Integration Tests**: Component interactions
- **E2E Tests**: Full user workflows (can be added)

## 🎯 Key Features Explained

### Kanban Board Functionality

1. **Add Tasks**: Enter task description and press "Add Task"
2. **Drag & Drop**: Click and drag tasks between columns
3. **Delete Tasks**: Use the delete button on each task
4. **Status Tracking**: Visual representation of task progress

### Authentication Flow

1. **Login**: JWT token stored in localStorage
2. **Protected Routes**: Automatic authentication checks
3. **Token Expiry**: Graceful handling of expired tokens
4. **Logout**: Clean token removal and redirect

### Responsive Design

- **Mobile-First**: Optimized for mobile devices
- **Tablet Support**: Adapted layout for tablets
- **Desktop**: Full-featured desktop experience
- **Touch-Friendly**: Easy interaction on touch devices

## 🚀 Deployment

### Docker Deployment

The UI includes its own Dockerfile for containerized deployment:

```bash
# Build Docker image
docker build -t todoapp-frontend .

# Run container
docker run -p 3000:80 todoapp-frontend
```

### Static Hosting

Deploy the build folder to any static hosting service:

- **Netlify**: Connect GitHub repository
- **Vercel**: Automatic deployments
- **AWS S3**: Static website hosting
- **GitHub Pages**: Free hosting for open source

### Build Optimization

The production build includes:

- **Code Splitting**: Lazy loading for better performance
- **Minification**: Reduced file sizes
- **Tree Shaking**: Removes unused code
- **Asset Optimization**: Compressed images and fonts

## 🐛 Common Issues & Solutions

### Development Issues

1. **Backend Connection Errors**

   ```bash
   # Ensure backend is running on localhost:8080
   # Check CORS configuration in Spring Boot
   ```

2. **Node Modules Issues**

   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Port Already in Use**
   ```bash
   # Kill process using port 3000
   lsof -ti:3000 | xargs kill -9
   ```

### Production Issues

1. **Routing Issues with SPA**

   - Configure server to serve index.html for all routes
   - Add `_redirects` file for Netlify
   - Configure `.htaccess` for Apache

2. **Environment Variables**
   - Ensure `REACT_APP_` prefix for custom variables
   - Set production API URL correctly

## 🔮 Future Enhancements

### Potential Features

- **Real-time Updates**: WebSocket integration
- **Task Categories**: Color-coded task types
- **Due Dates**: Calendar integration
- **Team Collaboration**: Multi-user features
- **Offline Support**: PWA capabilities
- **Dark Mode**: Theme switching
- **Mobile App**: React Native version

### Performance Optimizations

- **Virtual Scrolling**: For large task lists
- **Memoization**: React.memo for components
- **Lazy Loading**: Dynamic imports
- **Service Worker**: Caching strategies

## 📚 Learn More

### React Resources

- [Create React App Documentation](https://facebook.github.io/create-react-app/docs/getting-started)
- [React Documentation](https://reactjs.org/)
- [React Router Documentation](https://reactrouter.com/)

### CSS & Styling

- [CSS Grid Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [Flexbox Guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- [Responsive Design](https://web.dev/responsive-web-design-basics/)

### Testing

- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/ui-improvement
   ```
3. **Make your changes**
4. **Add tests** for new functionality
5. **Run the test suite**
   ```bash
   npm test
   ```
6. **Commit your changes**
   ```bash
   git commit -m 'Add awesome UI feature'
   ```
7. **Push to your branch**
   ```bash
   git push origin feature/ui-improvement
   ```
8. **Open a Pull Request**

### Code Style Guidelines

- Use functional components with hooks
- Follow React best practices
- Maintain consistent CSS naming conventions
- Add PropTypes for component props
- Write meaningful test cases

## 📞 Support

For frontend-specific questions:

1. Check the browser console for errors
2. Verify backend connectivity
3. Review React DevTools
4. Check network requests in browser dev tools

---

**Note**: This frontend requires the ToDoApp Spring Boot backend to be running. See the main project README for backend setup instructions.
