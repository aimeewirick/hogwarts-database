# 🧙 Hogwarts Database Management System
### MySQL • Node.js • JavaScript • HTML • CSS | CS340 Introduction to Databases | Oregon State University

> *"It is our choices that show what we truly are, far more than our abilities."* — Albus Dumbledore

A fully normalized relational database management system themed around the wizarding world of Hogwarts, built as the portfolio capstone for OSU's Introduction to Databases course. Features complete CRUD operations across seven interconnected entities, complex multi-table JOIN queries, and a three-tier web architecture.

**Academic Integrity Note:** This project was built as an educational exercise for OSU CS340. All Harry Potter themed content, names, and descriptions are the intellectual property of J.K. Rowling and Warner Bros. Entertainment. This project is not affiliated with or endorsed by either.

---
![Hogwarts Demo](demo1.gif)
## ✨ Features

- **Full CRUD operations** across all seven entities — Create, Read, Update, and Delete for every table
- **Complex multi-table JOINs** — readable query results that resolve foreign keys to human-readable names
- **Search functionality** — filter any entity by name with dynamic SQL queries
- **Normalized relational schema** — properly designed with foreign key constraints and intersection tables
- **Dynamic dropdowns** — all foreign key fields populated from live database queries
- **Harry Potter themed UI** — custom CSS with Hogwarts house colors and themed imagery

---

## 🗄️ Database Schema

The database contains **7 normalized entities:**

| Entity | Description |
|--------|-------------|
| **Students** | Hogwarts students with name, house, and year in school |
| **Houses** | The four Hogwarts houses with headmaster and location |
| **Professors** | Teaching staff and house headmasters |
| **Subjects** | Classes offered at Hogwarts with location and instructor |
| **Locations** | Rooms and buildings within Hogwarts |
| **Pets** | Student-owned pets with species and owner relationship |
| **ClassRegistrations** | Intersection table linking Students to Subjects by term |

### Entity Relationship Overview

```
Professors ──< Houses >── Locations
     │
     └──< Subjects >── Locations
              │
              └──< ClassRegistrations >── Students ──< Pets
```

**Key relationships:**
- A House has one headmaster (Professor) and one Location
- A Subject has one instructor (Professor) and one Location
- ClassRegistrations is an intersection table linking Students and Subjects (many-to-many)
- Pets belong to one Student owner

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Database | MySQL (MariaDB) |
| Backend | Node.js, Express.js |
| Templating | Handlebars (.hbs) |
| Frontend | HTML, CSS, JavaScript (AJAX) |
| DB Connection | mysql npm package, connection pooling |

---

## 📋 SQL Highlights

**Multi-table JOIN example — Class Registrations with readable names:**
```sql
SELECT registrationID AS "Registration ID",
       Students.studentName AS "Student Name",
       Subjects.subjectName AS "Subject",
       term AS "Term"
FROM ClassRegistrations
INNER JOIN Students ON student = Students.studentID
INNER JOIN Subjects ON subject = Subjects.subjectID;
```

**Three-table JOIN example — Subjects with location and instructor names:**
```sql
SELECT subjectID, subjectName, coreSubject,
       Locations.locationName,
       Professors.professorName
FROM Subjects
INNER JOIN Locations ON classLocation = Locations.locationID
INNER JOIN Professors ON instructor = Professors.employeeID;
```

**Parameterized search query:**
```sql
SELECT * FROM Students WHERE studentName LIKE ?
```

All SQL queries are documented in `hogwarts_forms_sql_queries.sql`.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- MySQL or MariaDB database server
- npm

### Setup

```bash
# Clone the repo
git clone https://github.com/aimeewirick/hogwarts-database.git
cd hogwarts-database

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Import the database schema and sample data
mysql -u your_username -p your_database_name < hogwarts_database.sql

# Start the server
node app.js
```

Visit `http://localhost:9507` in your browser.

---

## 📁 Project Structure

```
hogwarts-database/
├── app.js                          ← Express server and all routes
├── hogwarts_database.sql           ← Database schema + sample data
├── hogwarts_forms_sql_queries.sql  ← All SQL queries documented
├── database/
│   └── db-connector.js             ← MySQL connection pool
├── public/
│   ├── css/
│   │   └── hogwarts.css            ← Custom Hogwarts themed styles
│   ├── js/
│   │   ├── add_student.js          ← AJAX handlers for each entity
│   │   ├── delete_student.js
│   │   ├── update_student.js
│   │   └── ...                     ← Similar files for all 7 entities
│   └── img/                        ← Hogwarts themed imagery
└── views/
    ├── index.hbs                   ← Home page
    ├── students.hbs                ← Students CRUD page
    ├── houses.hbs                  ← Houses CRUD page
    ├── professors.hbs              ← Professors CRUD page
    ├── subjects.hbs                ← Subjects CRUD page
    ├── locations.hbs               ← Locations CRUD page
    ├── pets.hbs                    ← Pets CRUD page
    ├── classregistrations.hbs      ← Class Registrations CRUD page
    └── layouts/
        └── main.hbs                ← Shared layout template
```

---

## 🎓 What I Learned

This project gave me hands-on experience with every layer of database-driven web application development:

- **Relational database design** — modeling real-world relationships with proper normalization, foreign keys, and intersection tables
- **SQL at depth** — writing basic, intermediate, and advanced queries including multi-table JOINs, parameterized statements, and analytical queries
- **Three-tier architecture** — separating database, business logic, and presentation layers cleanly
- **AJAX for dynamic UI** — updating the DOM without full page reloads for delete and update operations
- **Connection pooling** — managing database connections efficiently in a Node.js environment
- **Data integrity** — understanding cascade relationships and the downstream impact of data changes

---

## 👩‍💻 Author

**Aimee Wirick** (with partner Wanda Sowa)
Oregon State University — B.S. Computer Science, Expected June 2026
[LinkedIn](https://www.linkedin.com/in/aimee-wirick-170765122) • [AimeeWirick.com](https://AimeeWirick.com) • [GitHub](https://github.com/aimeewirick)

*Built with 🧡 and a deep love for database design*
