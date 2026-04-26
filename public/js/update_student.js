// Get the objects we need to modify
let updateStudentForm = document.getElementById('/update-student-ajax/');
function updateRow(data, studentID, yearInSchool){
    let parsedData = JSON.parse(data);
    console.log("parsed Data", parsedData);
    
    let table = document.getElementById("student-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == studentID) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of yearInSchool value
            let td_year = updateRowIndex.getElementsByTagName("td")[3];

            // Reassign yearInSchool to our value we updated to
            td_year.innerHTML = yearInSchool; 
       }
    }
}
// Modify the objects we need
updateStudentForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputstudentID = document.getElementById("mySelect");
    let inputyearInSchool = document.getElementById("input-yearInSchool-update");

    // Get the values from the form fields
    let studentIDValue = inputstudentID.value;
    let yearInSchoolValue = inputyearInSchool.value;
    
    // currently the database table for Students does not allow updating values to NULL
    // so we must abort if being bassed NULL for yearInSchool

    if (isNaN(yearInSchoolValue)) 
    {
        return;
    }


    // Put our data we want to send in a javascript object
    let data = {
        studentID: studentIDValue,
        yearInSchool: yearInSchoolValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/update-student-ajax/", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, studentIDValue,yearInSchoolValue);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
})



