-- phpMyAdmin SQL Dump
-- version 5.1.3-2.el7.remi
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: May 05, 2022 at 07:08 AM
-- Server version: 10.6.7-MariaDB-log
-- PHP Version: 7.4.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cs340_wiricka`
--

-- --------------------------------------------------------
--
-- Drop Duplicate Tables 
--
DROP TABLE IF EXISTS ClassRegistrations;
DROP TABLE IF EXISTS Subjects;
DROP TABLE IF EXISTS Pets;
DROP TABLE IF EXISTS Students;
DROP TABLE IF EXISTS Houses;
DROP TABLE IF EXISTS Locations;
DROP Table IF EXISTS Professors;

--
-- Table structure for table `ClassRegistrations`
--
CREATE TABLE `ClassRegistrations` (
  `registrationID` INT(11) NOT NULL AUTO_INCREMENT,
  `student` int(11) NOT NULL,
  `subject` int(11) NOT NULL,
  `term` varchar(45) NOT NULL,
  PRIMARY KEY (registrationID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Table structure for table `Houses`
--
CREATE TABLE `Houses` (
  `houseID` INT(11) NOT NULL AUTO_INCREMENT,
  `houseName` varchar(45) NOT NULL,
  `location` int(11) NOT NULL,
  `headMaster` int(11) NOT NULL,
  PRIMARY KEY (houseID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Table structure for table `Locations`
--
CREATE TABLE `Locations` (
  `locationID` INT(11) NOT NULL AUTO_INCREMENT,
  `locationName` varchar(45) NOT NULL,
  `description` varchar(100) NOT NULL,
  PRIMARY KEY (locationID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Table structure for table `Pets`
--
CREATE TABLE `Pets` (
  `petID` INT(11) NOT NULL AUTO_INCREMENT,
  `petName` varchar(45) NOT NULL,
  `species` varchar(45) NOT NULL,
  `studentOwner` int(11) NOT NULL,
  `description` varchar(100) NOT NULL,
  PRIMARY KEY (petID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Table structure for table `Professors`
--
CREATE TABLE `Professors` (
  `employeeID` INT(11) NOT NULL AUTO_INCREMENT,
  `professorName` varchar(45) NOT NULL,
  PRIMARY KEY (employeeID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Table structure for table `Students`
--
CREATE TABLE `Students` (
  `studentID` INT(11) NOT NULL AUTO_INCREMENT,
  `studentName` varchar(45) NOT NULL,
  `studentHouse` int(11) NOT NULL,
  `yearInSchool` int(11) NOT NULL,
  PRIMARY KEY (studentID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Table structure for table `Subjects`
--
DROP TABLE IF EXISTS Subjects;
CREATE TABLE `Subjects` (
  `subjectID` INT(11) NOT NULL AUTO_INCREMENT,
  `subjectName` varchar(45) NOT NULL,
  `coreSubject` tinyint(4) DEFAULT NULL,
  `classLocation` int(11) NOT NULL,
  `instructor` int(11) NOT NULL,
  PRIMARY KEY (subjectID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `ClassRegistrations`
--
ALTER TABLE `ClassRegistrations`
  ADD KEY `student_idx` (`student`),
  ADD KEY `subject_idx` (`subject`);

--
-- Indexes for table `Houses`
--
ALTER TABLE `Houses`
  ADD KEY `location_idx` (`location`),
  ADD KEY `headMaster_idx` (`headMaster`);


--
-- Indexes for table `Pets`
--
ALTER TABLE `Pets`

  ADD KEY `studentOwner_idx` (`studentOwner`);


--
-- Indexes for table `Students`
--
ALTER TABLE `Students`
  ADD KEY `studentHouse_idx` (`studentHouse`);

--
-- Indexes for table `Subjects`
--
ALTER TABLE `Subjects`
  ADD KEY `classLocation_idx` (`classLocation`),
  ADD KEY `instructor_idx` (`instructor`);



--
-- Constraints for dumped tables
--

--
-- Constraints for table `ClassRegistration`
--
ALTER TABLE `ClassRegistrations`
  ADD CONSTRAINT `student` FOREIGN KEY (`student`) REFERENCES `Students` (`studentID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `subject` FOREIGN KEY (`subject`) REFERENCES `Subjects` (`subjectID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `Houses`
--
ALTER TABLE `Houses`
  ADD CONSTRAINT `headMaster` FOREIGN KEY (`headMaster`) REFERENCES `Professors` (`employeeID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `location` FOREIGN KEY (`location`) REFERENCES `Locations` (`locationID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `Pets`
--
ALTER TABLE `Pets`
  ADD CONSTRAINT `studentOwner` FOREIGN KEY (`studentOwner`) REFERENCES `Students` (`studentID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `Students`
--
ALTER TABLE `Students`
  ADD CONSTRAINT `studentHouse` FOREIGN KEY (`studentHouse`) REFERENCES `Houses` (`houseID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `Subjects`
--
ALTER TABLE `Subjects`
  ADD CONSTRAINT `classLocation` FOREIGN KEY (`classLocation`) REFERENCES `Locations` (`locationID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `instructor` FOREIGN KEY (`instructor`) REFERENCES `Professors` (`employeeID`) ON DELETE CASCADE ON UPDATE CASCADE;   
COMMIT; 

INSERT INTO Professors(professorName)
VALUES ('Severus Snape'),
('Minerva McGonagall'),
('Albus Dumbledore'),
('Rubeus Hagrid'),
('Pomona Sprout'),
('Filius Flitwick'),
('Remus Lupin'),
('Rolanda Hooch'),
('Dolores Umbridge'),
('Aurora Sinistra'),
('Alastor Moody'),
('Wilhemina Grubbly-Plank'),
('Cuthbert Binns'),
('Firenze'),
('Gilderoy Lockhart'),
('Horace Slughorn'),
('Septima Vector'),
('Sybill  Trelawney'),
('Alecto Carrow'),
('Bathsheda Babbling'),
('Charity Burbage');

INSERT INTO Locations(locationName, description)
VALUES('Gryffindor Common Room', 'The Gryffindor tower entrance is on the seventh floor in the east wing of Hogwarts Castle'),
('Ravenclaw Common Room', 'The Ravenclaw tower is found on the west side of Hogwarts Castle'),
('Hufflepuff Common Room', 'The Hufflepuff basement is below ground level behind a stack of barrels near the kitchens of Hogwarts Castle'),
('Slytherin Dungeon', 'The Slytherin Common room is located in the dungeons, behind an apparently blank stretch of wall of Hogwarts Castle '),
('Greenhouses','On the castle grounds, located at the back of the castle'),
('Dungeons', 'Dungeons of Hogwarts Castle'),
('Classroom C3', 'Iron chandelier hangs from the ceiling, as well as a dragons skeleton'),
('Divination Classroom','North Wing accessible through a circular trapdoor a cross between somebodys attic and an old-fashioned teashop'),
('The Great Lake','A freshwater loch located to the south of Hogwarts Castle. Contains a giant squid, Merpeople, Grindylows'),
('Hogsmeade Station','Where the Hogwarts Express arrives every year'),
('Great Hall','Where each student gets sorted their first year, and where all meals and events occur.  In Hogwarts Castle'),
('Quidditch Pitch', 'Where all Quidditch practices and matches occur'),
('Whomping Willow','A mysterious tree used to disguise the opening to the Shrieking Shack in Hogsmeade'),
('Hogsmeade', 'The only all-wizarding village in Britain where you have to at least be a 3rd year to be allowed to go'),
('The Forbidden Forest',' A forest that borders the edges of Hogwarts Castle, housing many dark and dangerous creatures'),
('Hagrids Hut', 'Where Professor Hagrid lives and where you go to attend Care of Magical Creatures'),
('The Owlery','At the top of the Castle West Tower, all of the owls used by staff and students are housed here'),
('Astronomy Tower','The tallest tower at Hogwarts Castle'),
('Classroom 2E', ' located on the third floor, on the Charms corridor Hogwarts Castle'),
('Classroom 4F', 'located on the first floor of Hogwarts Castle'),
('Muggle Studies Classroom', 'on the first-floor, accessed through a showroom displaying Muggle artefacts'),
('Classroom 1B', 'on the ground-floor, around the Middle Courtyard'),
('Room of runes','room of runes');



INSERT INTO Houses(houseName, location, headMaster)
VALUES('Gryffindor', 1, 2),
('Slytherin', 4, 1),
('Ravenclaw', 2, 6),
('Hufflepuff', 3, 5);

INSERT INTO Students(studentName, studentHouse, yearInSchool)
VALUES('Hermoine Granger', 1, 2),
('Ron Weasley', 1, 2),
('Luna Lovegood', 3, 2),
('Cedric Diggory', 4, 3),
('Draco Malfoy', 2, 2),
('Percy Weasley', 1, 4),
('Harry Potter', 1, 2),
('Neville Longbottom', 1, 2),
('Ginny Weasley', 1, 1),
('Fred Weasley', 1, 3),
('George Weasley',1, 3),
('Vicent Crabbe', 2, 2),
('Gregory Goyle', 2, 2),
('Seamus Finnigan', 1, 1),
('Millicent Bulstrode', 2, 2),
('Pansy Parkinson', 2, 2),
('Blaise Zabini', 2, 2),
('Dean Thomas', 1, 1),
('Colin Creevey', 1, 1),
('Oliver Wood', 1, 2),
('Lee Jordan', 1, 1),
('Katie Bell',1, 2),
('Cho Chang', 3, 3);

INSERT INTO Subjects(subjectName, coreSubject, classLocation, instructor)
VALUES('Potions', TRUE, 6, 1),
('Defense Against The Dark Arts', TRUE, 7, 7),
('Herbology', TRUE, 5, 5),
('Divination', FALSE, 8, 8),
('Care of Magical Creatures', FALSE, 16, 4),
('Astronomy', TRUE, 18, 10),
('Charms', TRUE, 6, 19),
('Flying', TRUE, 12, 8),
('History of Magic', TRUE, 20, 13),
('Muggle Studies', FALSE, 21, 21),
('Transfiguration', TRUE, 22, 2),
('Study of Ancient Runes', FALSE, 23, 20);

INSERT INTO ClassRegistrations(student, subject, term)
VALUES(1, 1, 2),
(2, 2, 3),
(3, 4, 1),
(4, 4, 4);

INSERT INTO Pets(petID, petName, species, studentOwner, description)
VALUES(1, 'Hedwig', 'Owl', 7, 'A snowy owl given to Harry by Hagrid on his 11th birthday'),
(2, 'Pidwidgeon', 'Owl', 2, 'Pig, a miniature scops owl given to Ron by Sirius Black after the loss of Scabbers'),
(3, 'Scabbers', 'Rat', 2, 'Rons pet rat...or is it?'),
(4, 'Crookshanks', 'Cat', 1, 'The clever half-Kneazle ginger cat of Hermione'),
(5, 'Trevor', 'Toad', 8, 'A toad given to Neville by his Uncle Algie upon his admission to Hogwarts'),
(6, 'Eagle Owl', 'Owl', 5, 'An eagle owl belonging to Draco Malfoy'),
(7, 'Hermes', 'Owl', 6, 'A screech owl belonging to Percy Weasley, purchased by his father for becoming a Prefect');




/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;