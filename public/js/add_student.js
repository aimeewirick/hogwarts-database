// Get the objects we need to modify
let addStudentForm = document.getElementById('add-student-form-ajax');

// Modify the objects we need
addStudentForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputstudentName = document.getElementById("input-studentName");
    let inputstudentHouse = document.getElementById("input-studentHouse");
    let inputyearInSchool = document.getElementById("input-yearInSchool");

    // Get the values from the form fields
    let studentNameValue = inputstudentName.value;
    let studentHouseValue = inputstudentHouse.value;
    let yearInSchoolValue = inputyearInSchool.value;

    // Put our data we want to send in a javascript object
    let data = {
        studentName: studentNameValue,
        studentHouse: studentHouseValue,
        yearInSchool: yearInSchoolValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-student-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputstudentName.value = '';
            inputstudentHouse.value = '';
            inputyearInSchool.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// 
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("student-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let studentIDCell = document.createElement("TD");
    let studentNameCell = document.createElement("TD");
    let studentHouseCell = document.createElement("TD");
    let yearInSchoolCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    studentIDCell.innerText = newRow.studentID;
    studentNameCell.innerText = newRow.studentName;
    studentHouseCell.innerText = newRow.studentHouse;
    yearInSchoolCell.innerText = newRow.yearInSchool;
    
    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteStudent(newRow.studentID);
    };


    // Add the cells to the row 
    row.appendChild(studentIDCell);
    row.appendChild(studentNameCell);
    row.appendChild(studentHouseCell);
    row.appendChild(yearInSchoolCell);
    row.appendChild(deleteCell);
    
    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.studentID);

    // Add the row to the table
    currentTable.appendChild(row);

    let selectMenu = document.getElementById("mySelect");
    let option = document.createElement("option");
    option.text = newRow.studentName;
    option.value = newRow.studentID;
    selectMenu.add(option);
}