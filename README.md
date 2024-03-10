# User Management System Frontend

*Disclaimer: This repository is for technical assessment only.*

User and role management system built using React + Vite. 

[PrimeReact](https://primereact.org/) was used for UI components and styling.

*Note: This is only the repository for the frontend. Please make sure to clone and use it together with the [User Management System API](https://github.com/giovictor/eastvantage-coding-assignment-laravel) to manage data and use the REST API endpoints in the application.*

## Requirements
* Node.js
* NPM

## Initial Setup
1. Open terminal and clone the repository

```
git clone https://github.com/giovictor/eastvantage-coding-assignment-react.git
```

2. Change directory to the repository
```
cd eastvantage-coding-assignment-react
```

3. In order to load environment variables, create an `.env` file and provide the following values:
```
VITE_APP_NAME="User Management System"
VITE_API_URL=http://localhost:8000/api/v1
```

4. Install all dependencies via NPM
```
npm install
```

5. Start the dev server
```
npm run dev
```

Access the frontend application via http://localhost:5174/

Additional features aside from the assignment's requirements:
1. User update and delete
2. Roles CRUD
