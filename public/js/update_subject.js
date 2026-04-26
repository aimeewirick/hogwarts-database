
// Get the objects we need to modify
let updateSubjectForm = document.getElementById('update-subject-form-ajax');

// Modify the objects we need
updateSubjectForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputSubjectID = document.getElementById("update_subject_name");
    let inputLocation = document.getElementById("update_subject_location");
    let inputInstructor = document.getElementById("update_subject_instructor");
    

    // Get the values from the form fields
    let subjectIDValue = inputSubjectID.value;
    let locationValue = inputLocation.value;
    let instructorValue = inputInstructor.value;

    // currently the database table for bsg_people does not allow updating values to NULL
    // so we must abort if being passed NULL for homeworld

    if (isNaN(locationValue)) {
        console.log("nan location value",locationValue)
        return;
    }

    // Put our data we want to send in a javascript object
    let data = {
        subjectID: subjectIDValue,
        classLocation: locationValue,
        instructor: instructorValue,
    }

    console.log("update subject")
    console.log(data)

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-subject-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, subjectIDValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

});


function updateRow(data, subjectID) {
    let parsedData = JSON.parse(data);
    console.log("parsed data", parsedData)
    let table = document.getElementById("subject-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == subjectID) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];



            // Get td of location value
            let td_location = updateRowIndex.getElementsByTagName("td")[3];

            // Reassign location to our value we updated to
            td_location.innerHTML = parsedData[1].professorName;
            let td_instructor = updateRowIndex.getElementsByTagName("td")[4];
            td_instructor.innerHTML = parsedData[0].professorName;
        }
    }
}
