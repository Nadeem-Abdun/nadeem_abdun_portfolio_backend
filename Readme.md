# Nadeem Abdun Portfolio Backend

This is the backend of the **Nadeem Abdun Portfolio** project, designed to support the frontend portfolio application with APIs for user management, profile editing, experience records, resume upload, skills (Wall Of Code), and project information.

## Features

- **User Authentication:** Register, login, logout, refresh token, password updates.
- **Profile Management:** Create, get, update, and delete user profiles.
- **Experience System:** Add, fetch, update, and remove experience entries linked to a profile.
- **Resume Handling:** Upload, get active, download, update status, and remove resumes.
- **Wall Of Code:** Manage skills ("Wall Of Code") associated with the profile.
- **Projects:** Add, fetch individual or all, and remove projects related to a user.
- **Contact Me:** Support for storing portfolio site contact form submissions.

## Base URL

The production API is hosted at:

```
https://nadeem-abdun-portfolio-backend.onrender.com
```

All API endpoints are prefixed with `/api/v1`.

## API Overview

### Users

- **Register:** `POST /api/v1/users/register`
- **Login:** `POST /api/v1/users/login`
- **Logout:** `POST /api/v1/users/logout`
- **Refresh Token:** `POST /api/v1/users/refresh-token`
- **Update Password:** `POST /api/v1/users/update-password`
- **Get Current User:** `GET /api/v1/users/get-user`
- **Update Account:** `PUT /api/v1/users/update-account`
- **Get User Profiles:** `GET /api/v1/users/get-profile/:username`

### Profile

- **Create Profile:** `POST /api/v1/profile/create`
- **Get Profile:** `GET /api/v1/profile/get/:profileId`
- **Update Profile:** `PUT /api/v1/profile/update/:profileId`
- **Delete Profile:** `DELETE /api/v1/profile/delete/:profileId`

### Experience

- **Add Experience:** `POST /api/v1/experience/create/:profileId`
- **Get Experience:** `GET /api/v1/experience/get/:id`
- **Get All Experiences:** `GET /api/v1/experience/getAll/:profileId`
- **Update Experience:** `PUT /api/v1/experience/update/:id`
- **Delete Experience:** `DELETE /api/v1/experience/delete/:id`

### Resume

- **Upload Resume:** `POST /api/v1/resume/upload/:profileId`
- **Get Active Resume:** `GET /api/v1/resume/getActive/:profileId`
- **Download Resume:** `GET /api/v1/resume/download/:id`
- **Get All Resumes:** `GET /api/v1/resume/getAll/:profileId`
- **Update Resume Status:** `PUT /api/v1/resume/update/:id`
- **Delete Resume:** `DELETE /api/v1/resume/delete/:id`

### Wall Of Code (Skills)

- **Add Skill:** `POST /api/v1/wallOfCode/create/:profileId`
- **Get All Skills:** `GET /api/v1/wallOfCode/getSkills/:profileId`
- **Update Skill:** `PUT /api/v1/wallOfCode/update/:id`
- **Delete Skill:** `DELETE /api/v1/wallOfCode/delete/:id`

### Projects

- **Create Project:** `POST /api/v1/project/create/:profileId`
- **Get Project:** `GET /api/v1/project/get/:id`
- **Get All Projects:** `GET /api/v1/project/getAll/:profileId`
- **Update Project:** `PUT /api/v1/project/update/:id`
- **Delete Project:** `DELETE /api/v1/project/delete/:id`

## Tech Stack

- **Node.js / Express** (inferred)
- **MongoDB** (likely for data persistence)
- **JWT for Auth** (common for user login flows)
- **Deployed on Render.com**

## Project Structure

Typical structure:

```
nadeem_abdun_portfolio_backend/
├── controllers/
├── models/
├── routes/
├── middleware/
├── config/
├── server.js / app.js
└── ...
```

## Running Locally

1. **Clone this repository**
2. **Install dependencies:**
   ```
   npm install
   ```
3. **Create a `.env` file** (see sample below)
4. **Start the server:**
   ```
   npm start
   ```

## Environment Variables (`.env` Example)

```
PORT=4000
MONGODB_URI=mongodb://localhost:27017/nadeem_abdun_portfolio
JWT_SECRET=your_secret_key
...
```

## Contributing

Pull requests are welcome! For significant changes, please open an issue first to discuss what you’d like to change.

---

**Frontend:** See [`nadeem_abdun_portfolio`](../nadeem_abdun_portfolio) for the React/TypeScript frontend.

**Contact:** Use the "Contact Me" form on the portfolio website to reach out.

---
