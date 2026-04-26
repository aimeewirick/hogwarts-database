// Get the objects we need to modify
let updateRegistrationForm = document.getElementById('update-registration-form-ajax');

// Modify the objects we need
updateRegistrationForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputRegistrationID = document.getElementById("update-registrationID");
    let inputStudent = document.getElementById("update-student");
    let inputSubject = document.getElementById("update-subject");
    let inputTerm = document.getElementById("update-term");
    console.log("input info", inputRegistrationID, inputStudent, inputSubject, inputTerm);

    // Get the values from the form fields
    let registrationIDValue = inputRegistrationID.value;
    let studentValue = inputStudent.value;
    let subjectValue = inputSubject.value;
    let termValue = inputTerm.value;

    // currently the database table for bsg_people does not allow updating values to NULL
    // so we must abort if being passed NULL for homeworld

    if (isNaN(studentValue)) {

        return;
    }

    // Put our data we want to send in a javascript object
    let data = {
        registrationID: registrationIDValue,
        student: studentValue,
        subject: subjectValue,
        term: termValue,
    }

    console.log("update registration");
    console.log(data);

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-registration-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, registrationIDValue, termValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.");
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, registrationID, term) {
    let parsedData = JSON.parse(data);
    console.log(parsedData);
    let table = document.getElementById("registration_table");
    console.log("term", term)

    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == registrationID) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];



            // Get td of location value
            let td_student = updateRowIndex.getElementsByTagName("td")[1];
            console.log("parsed Data [0]",parsedData[0].studentName);
            // Reassign location to our value we updated to
            td_student.innerHTML = parsedData[0].studentName;
            let td_subject = updateRowIndex.getElementsByTagName("td")[2];
            td_subject.innerHTML = parsedData[1].studentName;
            let td_term = updateRowIndex.getElementsByTagName("td")[3];
            td_term.innerHTML = term;

        }
    }
}