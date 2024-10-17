let districtObjects = [];

// Use fetch to load the JSON file
fetch('data/balkansArray.json')
    .then(response => response.json())  // Parse JSON response
    .then(data => {
        districtObjects = data;  // Set the data to districtObjects
        console.log('districtObjects loaded:', districtObjects);
        // You can now use districtObjects in your script
    })
    .catch(error => console.error('Error loading JSON:', error));
