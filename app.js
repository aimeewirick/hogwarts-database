// App.js
/*
    Created by Wanda Sowa and Aimee Wirick
    For OSU CS 340
    5/1/2022
    Credit to: 
    https://canvas.oregonstate.edu/courses/1870053/pages/exploration-web-application-technology?module_item_id=22036033 for tables 
    https://www.w3schools.com/howto/howto_css_example_website.asp for style sheet
    https://fonts.cdnfonts.com/css/harry-potter for font
    https://colors.dopely.top/inside-colors/colors-in-the-world-of-harry-potter-movies/ for colors
    https://static.wikia.nocookie.net/warner-bros-entertainment/images/d/df/117843736.jpg/revision/latest?cb=20160227190718 for image
    And special credit to JK Rowling for content ideas, names and descriptions for our Data Base
*/
/*
    SETUP
*/
var express = require('express');   // We are using the express library for the web server
var app = express();            // We need to instantiate an express object to interact with the server in our code

// Express setup section

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'));

PORT = 9507;                 // Set a port number at the top so it's easy to change in the future

// Database
var db = require('./database/db-connector')

// Set up for handlebars

const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({ extname: ".hbs" }));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs')

/*
    ROUTES
*/
// render index
app.get('/', function (req, res) {
    res.render('index')
})
//render students
app.get('/students', function(req, res)
    {  
        //declare Query 1
        let query1;
        //If there is no query string, we just perform a basic SELECT
        if (req.query.studentName === undefined){
            query1= "SELECT * FROM Students;";
        }             
        // If there is a query string, we we assume this is a search, and return desired results
        else{
            query1=`SELECT * FROM Students WHERE studentName LIKE "${req.query.studentName}%"`
        }
        //selecting Houses ID's from Houses 
        let query2 = "SELECT * FROM Houses;";

        db.pool.query(query1, function(error, rows, fields){    // Execute the query
            // save the students
            let students = rows;

            //run the second query
            db.pool.query(query2,(error, rows, fields)=>{
                // save the houses
                let houses = rows;
                let housesmap ={}
                houses.map(house => {
                    let houseID = parseInt(house.houseID, 10);
                    housesmap[houseID] = house["houseName"];
                })
                students = students.map(student => {
                    return Object.assign(student, {studentHouse:housesmap[student.studentHouse]})
                })
                return res.render('students', {data: students, houses: houses}); //rendering back data returned
            })
        })
               
    });  
                                            
//add student
app.post('/add-student-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let studentName = parseInt(data['input-studentName']);
    if (isNaN(studentName))
    {
        studentName = 'NULL'
    }

    let studentHouse = parseInt(data['input-studentHouse']);
    if (isNaN(studentHouse))
    {
        studentHouse = 'NULL'
    }

    let yearInSchool = parseInt(data['input-yearInSchool']);
    if (isNaN(yearInSchool))
    {
        yearInSchool = 'NULL'
    }
    // Create the query and run it on the database
    query1 = `INSERT INTO Students (studentName, studentHouse, yearInSchool) VALUES ('${data['input-studentName']}', '${data['input-studentHouse']}', ${yearInSchool})`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else
        {
            res.redirect('/students');
        }
    })
});
//delete student
app.delete('/delete-student-ajax/', function(req,res,next){
    let data = req.body;
    let studentID = parseInt(data.studentID);
    console.log(studentID);

    let deleteStudent=`DELETE FROM Students WHERE studentID = ?`;

    db.pool.query(deleteStudent, [studentID], function(error, rows, fields) {

        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
    })
});
//update student 
app.put('/update-student-ajax/', function(req,res,next){                                   
    let data = req.body;
    console.log("data appside", data);
    let yearInSchool = parseInt(data.yearInSchool);
    let studentID = parseInt(data.studentID);
    queryUpdateYear = `UPDATE Students SET yearInSchool = ? WHERE Students.studentID = ? `;
    queryStudentName = `SELECT studentName FROM Students WHERE Students.studentID = ?`;        
    db.pool.query(queryUpdateYear, [yearInSchool, studentID], function(error, rows, fields){
        if (error) {
        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.              
            console.log(error);
            res.sendStatus(400);
        }
        // If there was no error, we run our second query and return that data so we can use it to update the people's              // table on the front-end              
        else {
            db.pool.query(queryStudentName, [studentID], function (error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                        res.send(rows);
                        console.log("rows on app side", rows);

                }
            })
        } 
    
    })});
//render professors
app.get('/professors', function(req, res)
    {  
        //declare Query 1
        let query1;
        //If there is no query string, we just perform a basic SELECT
        if (req.query.professorName === undefined){
            query1= "SELECT * FROM Professors;";
        }             
        // If there is a query string, we we assume this is a search, and return desired results
        else{
            query1=`SELECT * FROM Professors WHERE professorName LIKE "${req.query.professorName}%"`
        }

        db.pool.query(query1, function(error, rows, fields){    // Execute the query
            // save the professors
            let professors = rows;

            return res.render('professors', {data:professors}); //rendering back data returned
         
        })
               
    });  
                                            

app.post('/add-professor-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let professorName = parseInt(data['input-professorName']);
    if (isNaN(professorName))
    {
        professorName = 'NULL'
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO Professors (professorName) VALUES ('${data['input-professorName']}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else
        {
            res.redirect('/professors');
        }
    })
});

app.delete('/delete-professor-ajax/', function(req,res,next){
    let data = req.body;
    let employeeID = parseInt(data.employeeID);
    console.log(employeeID);

    let deleteProfessor=`DELETE FROM Professors WHERE employeeID = ?`;

    db.pool.query(deleteProfessor, [employeeID], function(error, rows, fields) {

        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
    })
});
//subjects
app.get('/subjects', function(req, res)
    {  
        //declare Query 1
        let query1;
        //If there is no query string, we just perform a basic SELECT
        if (req.query.subjectName === undefined){
            query1= "SELECT * FROM Subjects;";
        }             
        // If there is a query string, we we assume this is a search, and return desired results
        else{
            query1=`SELECT * FROM Subjects WHERE subjectName LIKE "${req.query.subjectName}%"`
        }
        //selecting Location ID's from Locations 
      let query2 = "SELECT * FROM Locations;";
      let query3 ="SELECT * FROM Professors;";
        db.pool.query(query1, function(error, rows, fields){    // Execute the query
            // save the subjects
            let subjects = rows;

            //run the second query
            db.pool.query(query2,(error, rows, fields)=>{
                // save the locations
                let locations = rows;
                let locationsmap ={}
                locations.map(location => {
                    let locationID = parseInt(location.locationID, 10);
                    locationsmap[locationID] = location["locationName"];
                    })
                    subjects = subjects.map(subject => {
                        return Object.assign(subject, {classLocation:locationsmap[subject.classLocation]})
                    })
                    //run third query
                    db.pool.query(query3,(error, rows, fields)=>{
                        // save the professors
                        let professors = rows;
                        let professorsmap ={}
                        professors.map(professor => {
                            let employeeID = parseInt(professor.employeeID, 10);
                                    professorsmap[employeeID] = professor["professorName"];
                        })
                        subjects = subjects.map(subject => {
                            return Object.assign(subject,{instructor:professorsmap[subject.instructor]})
                        })
                        return res.render('subjects', {data: subjects, locations: locations, professors:professors}); //rendering back data returned
            })
        })
    })           
});  
                                        
app.post('/add-subject-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let subjectName = parseInt(data['input-subjectName']);
    if (isNaN(subjectName))
    {
        subjectName = 'NULL'
    }

    let coreSubject = parseInt(data['input-coreSubject']);
    if (isNaN(coreSubject))
    {
        coreSubject = 'NULL'
    }

    let classLocation = parseInt(data['input-classLocation']);
    if (isNaN(classLocation))
    {
        classLocation = 'NULL'
    }
    let instructor = parseInt(data['input-instructor']);
    if (isNaN(instructor))
    {
        instructor = 'NULL'
    }
    // Create the query and run it on the database
    query1 = `INSERT INTO Subjects (subjectName, coreSubject, classLocation, instructor) VALUES ('${data['input-subjectName']}', '${data['input-coreSubject']}', '${data['input-classLocation']}','${data['input-instructor']}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else
        {
            res.redirect('/subjects');
        }
    })
});

//delete subject
app.delete('/delete-subject-ajax/', function(req,res,next){
    let data = req.body;
    let subjectID = parseInt(data.subjectID);
    console.log(subjectID);

    let deleteSubject=`DELETE FROM Subjects WHERE subjectID = ?`;

    db.pool.query(deleteSubject, [subjectID], function(error, rows, fields) {

        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
    })
}); 
//update subject
app.put('/put-subject-ajax', function (req, res, next) {
    let data = req.body;

    //UPDATE Subject
    console.log('update subject route')
    console.log(data)

    let classLocation = parseInt(data.classLocation);
    let instructor = parseInt(data.instructor);
    let subjectID = parseInt(data.subjectID);
    console.log("Class location", classLocation)
    console.log("instructor", instructor)
    let queryUpdateSubject = `UPDATE Subjects SET classLocation = ?, instructor = ? WHERE Subjects.subjectID = ?`;
    let selectInstructorUselectLocation = `SELECT professorName FROM Professors WHERE Professors.employeeID = ? UNION SELECT locationName FROM Locations WHERE Locations.locationID = ?`;
    let selectLocation = `SELECT * FROM Locations WHERE Locations.locationID = ?`;
    // Run the 1st query
    db.pool.query(queryUpdateSubject, [classLocation, instructor, subjectID], function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }

        // If there was no error, we run our second query and return that data so we can use it to update the people's
        // table on the front-end
        else {
            // Run the second query
            db.pool.query(selectInstructorUselectLocation, [instructor,classLocation], function (error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {

                    res.send(rows);
                        
                }
            })
        }
    })
});

//get and render classregistrations

app.get('/classregistrations', function(req, res)
    {  
        //declare Query 1
        let query1;
        //If there is no query string, we just perform a basic SELECT
        if (req.query.student === undefined){
            query1= "SELECT * FROM ClassRegistrations;";
        }             
        // If there is a query string, we we assume this is a search, and return desired results
        else{
            query1=`SELECT * FROM ClassRegistrations WHERE student LIKE "${req.query.student}%"`
        }
        //selecting Location ID's from Locations 
      let query2 = "SELECT * FROM Students;";
      let query3 ="SELECT * FROM Subjects;";
        db.pool.query(query1, function(error, rows, fields){    // Execute the query
            // save the subjects
            let registrations = rows;

            //run the second query
            db.pool.query(query2,(error, rows, fields)=>{
                // save the locations
                let students = rows;
                let studentsmap ={}
                students.map(student => {
                    let studentID = parseInt(student.studentID, 10);
                    studentsmap[studentID] = student["studentName"];
                    })
                    registrations = registrations.map(registration => {
                        return Object.assign(registration, {student:studentsmap[registration.student]})
                    })
                    //run third query
                    db.pool.query(query3,(error, rows, fields)=>{
                        // save the professors
                        let subjects = rows;
                        let subjectsmap ={}
                        subjects.map(subject => {
                            let subjectID = parseInt(subject.subjectID, 10);
                                    subjectsmap[subjectID] = subject["subjectName"];
                        })
                        registrations = registrations.map(registration => {
                            return Object.assign(registration,{subject:subjectsmap[registration.subject]})
                        })
                        return res.render('classregistrations', {data: registrations, students: students, subjects:subjects}); //rendering back data returned
            })
        })
    })           
});  
//add registration
app.post('/add-registration-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let student = parseInt(data['input-student']);
    if (isNaN(student))
    {
        subjectName = 'NULL'
    }

    let subject = parseInt(data['input-subject']);
    if (isNaN(subject))
    {
        subject = 'NULL'
    }

    let term = parseInt(data['input-term']);
    if (isNaN(term))
    {
        term = 'NULL'
    }
   
    // Create the query and run it on the database
    query1 = `INSERT INTO ClassRegistrations (student, subject, term) VALUES ('${data['input-student']}', '${data['input-subject']}', '${data['input-term']}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else
        {
            res.redirect('/classregistrations');
        }
    })
});
// delete registration
app.delete('/delete-registration-ajax/', function(req,res,next){
    let data = req.body;
    let registrationID = parseInt(data.registrationID);
    console.log(registrationID);

    let deleteRegistration=`DELETE FROM ClassRegistrations WHERE registrationID = ?`;

    db.pool.query(deleteRegistration, [registrationID], function(error, rows, fields) {

        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
    })
});

//UPDATE Registration
app.put('/put-registration-ajax', function (req, res, next) {
    let data = req.body;

    let student = parseInt(data.student);
    let subject = parseInt(data.subject);
    let term = parseInt(data.term);
    let registrationID = parseInt(data.registrationID);

    let queryUpdateRegistration = `UPDATE ClassRegistrations SET student = ?, subject = ?, term = ? WHERE ClassRegistrations.registrationID = ?`;
    let selectStudentUSubject = `SELECT Students.studentName FROM Students WHERE Students.studentID = ? UNION SELECT Subjects.subjectName FROM Subjects WHERE Subjects.subjectID=?`;
    let selectSubject = `SELECT * FROM Subjects WHERE Subjects.subjectID = ?`
    // Run the 1st query
    db.pool.query(queryUpdateRegistration, [student, subject, term, registrationID], function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }

        // If there was no error, we run our second query and return that data so we can use it to update the registration
        // table on the front-end
        else {
            // Run the second query
            db.pool.query(selectStudentUSubject, [student, subject], function (error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                        res.send(rows);
                        console.log("rows on app side", rows);

                }
            })
        }
    })
}); 
/* HOUSES CRUD STEPS */

// Render houses handlebars page
app.get('/houses', function(req, res)
    {  
        //declare Query 1
        let query1;
        //If there is no query string, we just perform a basic SELECT
        if (req.query.houseName === undefined){
            query1= "SELECT * FROM Houses;";
        }             
        // If there is a query string, we we assume this is a search, and return desired results
        else{
            query1=`SELECT * FROM Houses WHERE houseName LIKE "${req.query.houseName}%"`
        }
        //selecting Location ID's from Locations 
      let query2 = "SELECT * FROM Professors;";
      let query3 ="SELECT * FROM Locations;";
        db.pool.query(query1, function(error, rows, fields){    // Execute the query
            // save the subjects
            let houses = rows;

            //run the second query
            db.pool.query(query2,(error, rows, fields)=>{
                // save the locations
                let headMasters = rows;
                let headMastersmap ={}
                headMasters.map(headMaster => {
                    let employeeID = parseInt(headMaster.employeeID, 10);
                    headMastersmap[employeeID] = headMaster["professorName"];
                    })
                    houses = houses.map(house => {
                        return Object.assign(house, {headMaster:headMastersmap[house.headMaster]})
                    })
                    //run third query
                    db.pool.query(query3,(error, rows, fields)=>{
                        // save the professors
                        let locations = rows;
                        let locationsmap ={}
                        locations.map(location => {
                            let locationID = parseInt(location.locationID, 10);
                                    locationsmap[locationID] = location["locationName"];
                        })
                        houses = houses.map(house => {
                            return Object.assign(house,{location:locationsmap[house.location]})
                        })
                        return res.render('houses', {data: houses, headMasters: headMasters, locations:locations}); //rendering back data returned
            })
        })
    })           
});  

// Add House
app.post('/add-house-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let houseName = parseInt(data['input-houseName']);
    if (isNaN(houseName))
    {
        houseName = 'NULL'
    }

    let location = parseInt(data['input-location']);
    if (isNaN(location))
    {
        location = 'NULL'
    }

    let headMaster = parseInt(data['input-headMaster']);
    if (isNaN(headMaster))
    {
        headMaster = 'NULL'
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO Houses (houseName, location, headMaster) VALUES ('${data['input-houseName']}', '${data['input-location']}', '${data['input-headMaster']}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else
        {
            res.redirect('/houses');
        }
    })
});

// Delete House
app.delete('/delete-house-ajax/', function(req,res,next){
    let data = req.body;
    let houseID = parseInt(data.houseID);
    console.log(houseID);

    let deleteHouse =`DELETE FROM Houses WHERE houseID = ?`;

    db.pool.query(deleteHouse, [houseID], function(error, rows, fields) {

        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
    })
});

/* LOCATIONS CRUD STEPS */
//Render Locations!
app.get('/locations', function(req, res)
    {  
        //declare Query 1
        let query1;
        //If there is no query string, we just perform a basic SELECT
        if (req.query.locationName === undefined){
            query1= "SELECT * FROM Locations;";
        }             
        // If there is a query string, we we assume this is a search, and return desired results
        else{
            query1=`SELECT * FROM Locations WHERE locationName LIKE "${req.query.locationName}%"`
        }

        db.pool.query(query1, function(error, rows, fields){    // Execute the query
            // save the locations
            let locations = rows;

            return res.render('locations', {data:locations}); //rendering back data returned
         
        })
               
});  
// Add Location
app.post('/add-location-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let locationName = parseInt(data['input-locationName']);
    if (isNaN(locationName))
    {
        locationName = 'NULL'
    }

    let description = parseInt(data['input-locationDescription']);
    if (isNaN(description))
    {
        description = 'NULL'
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO Locations (locationName, description) VALUES ('${data['input-locationName']}', '${data['input-locationDescription']}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else
        {
            res.redirect('/locations');
        }
    })
});

// Update Location
app.put('/update-location-ajax/', function (req, res, next){
    let data = req.body;
    console.log("data appside", data);
    let description = data.description;
    console.log(description);
    let locationID = parseInt(data.locationID);
    let queryUpdateLocation = `UPDATE Locations SET description = ? WHERE Locations.locationID = ?`;
    let queryLocationID = `SELECT locationID FROM Locations WHERE Locations.locationID = ?`;
    // Run the 1st query
    db.pool.query(queryUpdateLocation, [locationID, description], function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }

        // If there was no error, we run our second query and return that data so we can use it to update the people's
        // table on the front-end
        else {
            db.pool.query(queryLocationID, [locationID], function (error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {

                    res.send(rows);
                    console.log("rows on app side", rows);  
                }
            })
        }
    })
});

// Delete Location
app.delete('/delete-location-ajax/', function(req,res,next){
    let data = req.body;
    let locationID = parseInt(data.locationID);
    console.log(locationID);

    let deleteLocation =`DELETE FROM Locations WHERE locationID = ?`;

    db.pool.query(deleteLocation, [locationID], function(error, rows, fields) {

        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
    })
});
/* PETS CRUD STEPS */
// Render Pets!
app.get('/pets', function(req, res)
    {  
        //declare Query 1
        let query1;
        //If there is no query string, we just perform a basic SELECT
        if (req.query.petName === undefined){
            query1= "SELECT * FROM Pets;";
        }             
        // If there is a query string, we we assume this is a search, and return desired results
        else{
            query1=`SELECT * FROM Pets WHERE petName LIKE "${req.query.petName}%"`
        }
        //selecting Houses ID's from Students
        let query2 = "SELECT * FROM Students;";

        db.pool.query(query1, function(error, rows, fields){    // Execute the query
            // save the students
            let pets = rows;

            //run the second query
            db.pool.query(query2,(error, rows, fields)=>{
                // save the houses
                let studentOwners = rows;
                let studentOwnersmap ={}
                studentOwners.map(studentOwner => {
                    let studentID = parseInt(studentOwner.studentID, 10);
                    studentOwnersmap[studentID] = studentOwner["studentName"];
                })
                pets = pets.map(pet => {
                    return Object.assign(pet, {studentOwner:studentOwnersmap[pet.studentOwner]})
                })
                return res.render('pets', {data: pets, studentOwners: studentOwners}); //rendering back data returned
            })
        })
               
    });  

// Add Pet
app.post('/add-pet-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let petName = parseInt(data['input-petName']);
    if (isNaN(petName))
    {
        petName = 'NULL'
    }

    let species = parseInt(data['input-species']);
    if (isNaN(species))
    {
        species = 'NULL'
    }

    let studentOwner = parseInt(data['input-studentOwner']);
    if (isNaN(studentOwner))
    {
        studentOwner = 'NULL'
    }

    let description = parseInt(data['input-description']);
    if (isNaN(description))
    {
        description = 'NULL'
    }
    
    // Create the query and run it on the database
    query1 = `INSERT INTO Pets (petName, species, studentOwner, description) VALUES ('${data['input-petName']}', '${data['input-species']}', '${data['input-studentOwner']}', '${data['input-description']}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else
        {
            res.redirect('pets');
        }
    })
});
// Delete Pet
app.delete('/delete-pet-ajax/', function(req,res,next){
    let data = req.body;
    let petID = parseInt(data.petID);
    console.log(petID);

    let deletePet =`DELETE FROM Pets WHERE petID = ?`;

    db.pool.query(deletePet, [petID], function(error, rows, fields) {

        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
    })
});

/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});