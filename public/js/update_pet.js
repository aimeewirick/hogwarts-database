// Get the objects we need to modify
let updatePetForm = document.getElementById('/update-pet-ajax/');

// Modify the objects we need
updatePetForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputPetID = document.getElementById("mySelect");
    let inputPetName = document.getElementById("input-petName-update");
    let inputSpecies = document.getElementById("input-species-update");
    let inputStudentOwner = document.getElementById("input-studentOwner-update");
    let inputPetDescription = document.getElementById("input-petDescription-update");

    // Get the values from the form fields
    let petID = inputPetID.value;
    let petName = inputPetName.value;
    let species = inputSpecies.value;
    let studentOwner = inputStudentOwner.value;
    let description = inputPetDescription.value;

    
    // currently the database table for Locations does not allow updating values to NULL
    // so we must abort if being bassed NULL for locationDescription

    if (isNaN(locationDescription)) // NEED TO UPDATE HERE AND BELOW
    {
        return;
    }


    // Put our data we want to send in a javascript object
    let data = {
        locationID: locationIDValue,
        locationDescription: locationDescriptionValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/update-location-ajax/", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, locationIDValue);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
})


function updateRow(data, locationID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("location-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == locationID) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of yearInSchool value
            let td = updateRowIndex.getElementsByTagName("td")[3];

            // Reassign yearInSchool to our value we updated to
            td.innerHTML = parsedData[0].locationID; 
       }
    }
}