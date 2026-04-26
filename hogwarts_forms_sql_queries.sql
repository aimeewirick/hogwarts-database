-- These are some queries for Group 45 Hogwarts Database Project

-- `ClassRegistrations` QUERIES

--    Select/Browse
--    get all registrationID's, Student IDs, Subject ID's, and term number involved in ClassRegistrations
SELECT * FROM `ClassRegistrations`;
--    get registrationID studentName and subjectName and term from ClassRegistrations for easy browsing
SELECT registrationID as "Registration ID", Students.studentName as "Student Name", Subjects.subjectName as "Subject", term as "Term"
FROM ClassRegistrations
INNER JOIN Students ON student = Students.studentID
INNER JOIN Subjects ON subject = Subjects.subjectID;

-- Insert from Add Class Registration
INSERT INTO ClassRegistrations(student, subject, term) VALUES (:nameInput, :subjectInput, :termInput);

-- Update
--  collect student, subject, term by registrationID
SELECT Students.studentName as "Student Name", Subjects.subjectName as "Subject Name", term as Term
FROM ClassRegistrations
INNER JOIN Students ON student = Students.studentID
INNER JOIN Subjects ON subject = Subjects.subjectID
WHERE registrationID = : registrationID_selected_from_update_ClassRegistrations_page;
--  the actual upadate (we need to figure out how to change a studentName to a studentID for this and take out registration ID)
UPDATE ClassRegistrations SET student=:studentNameInput, subject=:subjectNameInput, term = :termInput 
WHERE registrationID = :registration_ID_selected_from_ClassRegistration_browser;

-- Delete
--   collect and return registrationID and studentName
SELECT registrationID, Students.studentName as "Student Name"
FROM ClassRegistrations
INNER JOIN Students ON student = Students.studentID
WHERE registrationID = : registrationID_selected_from_delete_ClassRegistrations_page;
--   the actual deletion
DELETE FROM ClassRegistrations WHERE registrationId = : registrationID_selected_from_delete_ClassRegistrations_page;

-- `Subjects` QUERIES

-- Browse
--   lists all subject rows with ID, name, core class (binary 0,1), locationID, instructorID
SELECT * FROM Subjects;
--   lists all subject rows but with ID, name, core class(0,1), locationName, instructorName
SELECT subjectID, subjectName, coreSubject, Locations.locationName, Professors.professorName
FROM Subjects
INNER JOIN Locations ON classLocation = Locations.locationID
INNER JOIN Professors ON instructor = Professors.employeeID;
--  list just all subjectName-s
SELECT subjectName FROM `Subjects`;
--  lists subjectID from subjectName dropdown (this will help with update?) 
SELECT subjectID FROM `Subjects`
WHERE subjectName = :a subject name populated from a dropdown;

-- Insert
INSERT INTO `Subjects` (`subjectName`, `coreSubject`, `classLocation`, `instructor`) 
VALUES (subjectName=:subjectNameInput , coreSubject= :Yes select returns 1 No returns 0, classLocation=:populates a locationID 
when a location is selected from a dropdown, instructor: a employeeID when a professor is selected from a dropdown);

-- Update (need to figure out how to make a binary answer from a yes/no dropdown or change the dropdown to 1/0
-- also need to figure out how to change a locationName to a locationID)
UPDATE Subjects SET subjectName=:snameInput, coreSubject=:binary_based_on_yes/no_dropdown, classLocation=: locationID_based on_input_from_locationName, instructor=: employeeID_based_on_professorName
WHERE subjectID =:subjectID_from_the_update_form;

-- Delete
DELETE FROM Subjects WHERE subjectID =: subjectID_selected_from_delete_form;


-- Professors QUERIES

-- Browse/Read
-- lists all data and rows in Professors includes employeeID and professorName
SELECT * FROM `Professors`;
-- lists just professorName for dropdown searches
SELECT professorName FROM `Professors`;
-- lists employeeId from selected professorName (for update?)
SELECT employeeID FROM `Professors`
WHERE professorName = :professorName_populated_by_dropdown;

-- Insert/Create
INSERT INTO `Professors` (`professorName`) VALUES (:populated_by_text_bar);

-- Update
UPDATE Professors SET professorName=:text_input_from_update_form;

-- Delete
DELETE FROM Professors WHERE employeeID =:ID_populated_by_delete_form;


-- Pets QUERIES

-- Browse/Read
-- lists all data and rows from Pets includes petID petName species studentOwner(as studentID) description
SELECT * FROM `Pets`;
-- more readable list contains: petID petName species owner(as studentName) description
SELECT petID, petName, species, Students.studentName as owner, description
FROM Pets
INNER JOIN Students ON studentOwner = studentID;
-- just pet names (not sure if this is needed)
SELECT petName FROM Pets;
-- pet owner by petID (not sure if this is needed)
SELECT petID, Students.studentName 
FROM Pets
INNER JOIN Students ON studentOwner= Students.studentID
WHERE petID=:petID_from_table;

-- Insert/Create
INSERT INTO `Pets` (`petName`, `species`, `studentOwner`, `description`) 
VALUES (petName=:populated_by_text_box_in_AddPet, species=: populated_by_dropdown_which_is_populated_by_a_list, studentOwner: populated_by_dropdown_in_addPet_form, description:populated_by_text_box_in_add_pets_form);

-- Delete
DELETE FROM Pets WHERE petID =:populated_from_delete_form;


-- Students QUERIES

-- Browse/Read
-- lists all rows of information from Students included studentID, studentName, studentHouse(houseID), yearInSchool
 SELECT * FROM `Students`;
 -- more readable version of all row data includes houseName rather than houseID
SELECT studentID, studentName, Houses.houseName as House, yearInSchool
FROM `Students`
INNER JOIN Houses ON studentHouse = Houses.houseID;
-- just studentName-s
SELECT studentName FROM Students;
-- studentName by studentID
SELECT studentName FROM Students
WHERE studentID =: selectedstudentID;
-- studentID by studentName
SELECT studentID FROM Students
WHERE studentName =: selectedstudentName;

-- Insert/Create
INSERT INTO `Students` (`studentName`, `studentHouse`, `yearInSchool`) 
VALUES (studentName: populated_by_text_box_in_add_student_form, studentHouse:houseID_populated_from_search_based_on_houseName, yearInSchool:populated_by_dropdown_in_add_student_form)

-- Update
UPDATE Students SET studentName=:text_input_from_update_form, studentHouse=:houseID_populated_from_search_based_on_houseName, yearInSchool=:populated_by_dropdown_in_edit;

-- Delete
DELETE FROM Students WHERE studentID =:populated_by_delete_form;


-- Locations QUERIES (we are going to have to change our roomNumber and descriptions..maybe remove some for reverse search capability

-- Browse/Read
-- lists all rows of data from Locations as is
SELECT * FROM Locations;
-- lists just the building name by locationID
SELECT locationName FROM Locations WHERE locationID =:populatated_by_dropdown_list

-- Insert/Create
INSERT INTO `Locations` (`locationName`, `description`) 
VALUES (locationName:populated_by_text_box_in_add_location_form, description:populated_by_textbox_in_add_location_form)

-- Houses QUERIES

-- Browse/Read
-- lists all the raw house info:  houseID, houseName, location(by locationID), headMaster(by employeeID)
SELECT * FROM Houses;
-- lists data in readable form:  houseID houseName, location(by building, headMaster(by professorName)
SELECT houseID, houseName, Locations.locationName as locationName, Professors.professorName as HeadMaster
FROM Houses
INNER JOIN Locations ON location=Locations.locationID
INNER JOIN Professors ON headMaster=Professors.employeeID;

-- lists just the house names
SELECT houseName FROM Houses;
-- lists houseName-s from houseID
SELECT houseID FROM Houses
WHERE houseName=:populated_by_dropdown_of_house_names

-- Insert
INSERT INTO `Houses` (`houseName`, `location`, `headMaster`) 
VALUES (houseName:populated_by_text_box_add_house_form, location:populated_by_dropdown, headMaster:populated_by_dropdown)


