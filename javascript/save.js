// Function to handle saving data
function saveData() {
  // Convert the array to a JSON string
  const jsonData = JSON.stringify(nationAssignments, null, 2);

  // Create a Blob from the JSON string
  const blob = new Blob([jsonData], { type: 'application/json' });

  // Create a temporary anchor element for the download
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${nationNames[51]}.json`; // Name of the downloaded file

  // Append the anchor to the body, click it to initiate the download, and remove it
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  closePopUp(); // Close the modal after saving
}


function uploadData() {
  const file = event.target.files[0];
  if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        tempNationAssignments = nationAssignments;
        const uploadedData = JSON.parse(e.target.result);
        console.log('Uploaded Data:', uploadedData);
        // Process the uploaded data as needed
        //updatedNations = uploadSaveFiles(uploadedData);
        mainLoadData(uploadedData);
      };
      reader.readAsText(file);
  }
  closePopUp(); // Close the modal after saving
}




// function uploadDistricts(uploadedData, layer) {
//   let previousNation = null;

//   nationNames = uploadedData[names];
//   console.log("ddd", nationNames);
  
//   for (let i = 1; i <= 40; i++) { // Go through each nation
//     selectedNation = i;
//     updateNationName(i, nationNames[i]);
    
//     let len = uploadedData[i].length;
//     for (let j = 0; j < len; j++) { // Go through each district (starting from 0 for the first element)
//       let featureId = uploadedData[i][j].ID;

//       // Find which nation the feature currently belongs to, if any
//       for (let k = 1; k <= 10; k++) {
//         const index = nationAssignments[k].findIndex(obj => obj.ID === featureId);
//         if (index !== -1) {
//           previousNation = k;
//           break;
//         }
//       }

//       // If the feature was previously assigned to a nation, deduct its population and other properties
//       if (previousNation !== null) {
//         const previousFeature = nationAssignments[previousNation].find(obj => obj.ID === featureId);
        
//         // Deduct values for all relevant keys
//         for (const key in previousFeature) {
//           if (key !== 'ID' && typeof previousFeature[key] === 'number') {
//             nationInfo[previousNation][key] -= previousFeature[key]; // Deduct the value
//           }
//         }

//         // Update the display for the previous nation
//         document.getElementById(`pop${previousNation}`).textContent = nationInfo[previousNation].population.toLocaleString();

//         // Remove the feature from the previous nation's assignment
//         const index = nationAssignments[previousNation].findIndex(obj => obj.ID === featureId);
//         if (index !== -1) {
//           nationAssignments[previousNation].splice(index, 1);  // Remove feature from the array
//         }
//       }

//       // Add the feature to the new nation and update its properties
//       const featureObject = districtObjects.find(obj => obj.ID === featureId);
//       if (featureObject) {
//         // Add values for all relevant keys
//         for (const key in featureObject) {
//           if (key !== 'ID' && typeof featureObject[key] === 'number') {
//             nationInfo[selectedNation][key] += featureObject[key]; // Add the value
//           }
//         }
        
//         nationAssignments[selectedNation].push(featureObject);  // Add the full object
//       }

//       // Find the corresponding layer and feature from featureLayers and districtObjects
//       let featureLayer = featureLayers[featureId]; // Get the layer
//       let featureData = districtObjects.find(obj => obj.ID === featureId); // Get the feature data

//       // Send the feature to be colored
//       if (featureLayer && featureData) {
//         handleFeatureClick(featureLayer, featureData); // Pass both layer and feature to handleFeatureClick
//       }

//       // Update the display for the selected nation
//       document.getElementById(`pop${selectedNation}`).textContent = nationInfo[selectedNation].population.toLocaleString();
//       for (let x = 1; x <= 10; x++) {
//         document.getElementById(`population${x}`).textContent = `${nationInfo[x].population.toLocaleString()}`;
//       }
//     }
//   }

// }
