# BLOCKLEND Backend Setup Guide

## 1. Prerequisites
- **Node.js** (v14 or higher recommended): [Download Node.js](https://nodejs.org/)
- **MySQL Server**: [Download MySQL](https://dev.mysql.com/downloads/mysql/)

---

## 2. Project Structure

```
BLOCKLEND/
├── backend/
│   ├── .env
│   ├── package.json
│   ├── src/
│   │   └── server.js
│   └── ...other files
├── schema.sql  <-- IMPORTANT: This file contains your database schema
└── README.md   <-- This guide
```

---

## 3. Environment Configuration

Open the file:  
`backend/.env`

**You MUST update the following values:**

```dotenv
MYSQL_HOST=localhost          # Change if your MySQL is on another server
MYSQL_PORT=3306               # Change if your MySQL uses a different port
MYSQL_USER=root               # Change to your MySQL username
MYSQL_PASSWORD=030621Ljh      # Change to your MySQL password
MYSQL_DATABASE=blocklend      # Change if you want a different database name

PORT=5000                     # Change if you want the backend to run on a different port
NODE_ENV=development
```

**Highlight for Client:**  
- `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_USER`, `MYSQL_PASSWORD`, and `MYSQL_DATABASE` must match your MySQL server settings.
- `PORT` is the port your backend server will run on (default is 5000).

---

## 4. Database Setup

### 4.1. Log in to MySQL
```sh
mysql -u root -p
```
(Replace `root` with your MySQL username.)

### 4.2. Create the database (if not already created)
```sql
CREATE DATABASE blocklend;
```
(Change `blocklend` if you use a different database name, and update `.env` accordingly.)

### 4.3. Create tables using the schema

**Insert the schema!**

- The schema file is provided as `schema.sql` in the root of this project.
- To import the schema, run:

```sh
mysql -u root -p blocklend < schema.sql
```
(Replace `blocklend` if needed.)

---

## 5. Install Dependencies

Navigate to the backend folder and install dependencies:
```sh
cd backend
npm install
```

---

## 6. Start the Backend Server

```sh
npm start
```
or
```sh
node src/server.js
```

---

## 7. Testing

- Open your browser and go to:  
  `http://localhost:5000/` (or the port you set in `.env`)
- Test the API endpoints using Postman, curl, or your frontend.

---

## 8. Security Note

**Do NOT use the default password or root user in production.**
- Create a new MySQL user with limited privileges for production use.
- Update `.env` with the new credentials.

---

## 9. Troubleshooting

- If you get a "Unknown database" error, make sure the database is created and the name matches `.env`.
- If you get a connection error, check that MySQL is running and the credentials are correct.

---

## 10. Contact

For further assistance, contact the developer at:  
**[your-email@example.com]** (replace with your contact info)

---

## Summary of Adjustments for the Client

| File               | What to Change                                   | Where/How                                  |
|--------------------|--------------------------------------------------|--------------------------------------------|
| `.env`             | MySQL credentials and backend port               | Update values as described above           |
| MySQL              | Database name and user/password                  | Create database/user as needed             |
| `schema.sql`       | Database schema                                  | Import after creating database             |

---

# Database Schema

See `schema.sql` in this project root. Import it as described above.
