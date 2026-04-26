// Get the objects we need to modify
let addLocationForm = document.getElementById('add-location-form-ajax');

// Modify the objects we need
addLocationForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputLocationName = document.getElementById("input-locationName");
    let inputLocationDescription = document.getElementById("input-locationDescription");

    // Get the values from the form fields
    let locationName = inputLocationName.value;
    let locationDescription = inputLocationDescription.value;

    // Put our data we want to send in a javascript object
    let data = {
        locationName: locationName.value,
        locationDescription: locationDescription.value
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-location-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputLocationName.value = '';
            inputLocationDescription.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// bsg_people
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("house-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let locationIDCell = document.createElement("TD");
    let locationNameCell = document.createElement("TD");
    let locationDescriptionCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    locationIDCell.innerText = newRow.locationID;
    locationNameCell.innerText = newRow.locationName;
    locationDescriptionCell.innerText = newRow.locationDescription;
    
    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteLocation(newRow.locationID);
    };


    // Add the cells to the row 
    row.appendChild(locationIDCell);
    row.appendChild(locationNameCell);
    row.appendChild(locationDescriptionCell);
    row.appendChild(deleteCell);
    
    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.locationID);

    // Add the row to the table
    currentTable.appendChild(row);

    let selectMenu = document.getElementById("mySelect");
    let option = document.createElement("option");
    option.text = newRow.locationName;
    option.value = newRow.locationID;
    selectMenu.add(option);
}

