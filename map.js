

/* ****** VARIABLES ******* */


let selectedNation = 1; // To store which nation is selected
let nationColors = { 1: '#8b0000', 2: '#adff2f', 3: '#00bfff',  4: '#800080',  5: '#f0e68c',  6: '#ffa07a',  7: '#00ffff',  8: '#a9a9a9',  9: '#b03060',  10: '#ffd700'}; // Define colors for each nation
let nationAssignments = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: []}; // To track which features are assigned to which nation
let nationPopulations = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0};
let featureLayers = {}; // To store references to the GeoJSON layers by feature id
let prevFeature = false; // Track if the feature already is assigned somewhere
let shiftKeyPressed = false; // Track if the Shift key is pressed

let districtMode = true; // Track whether we're in district mode or not
let provinceMode = false; // Track whether we're in province mode or not
let countryMode = false; // Track whether we're in country mode or not
let currentMode = districtMode; // What the current mode is

// Group districts by province and update the map
let provinceGroups = {};


/* ****** FUNCTIONS ******* */


// Function to handle nation selection
function selectNation(nationNumber) {
    selectedNation = nationNumber;

    // Highlight the selected button and set its border
    document.querySelectorAll('.nation-btn').forEach(btn => {
        btn.style.border = '2px solid rgb(255, 232, 172)'; // Reset all buttons
    });
    document.getElementById(`nation${nationNumber}-btn`).style.border = '2px solid';
}


// Function to update the color of the button and the corresponding nation's features
function updateButtonColor(nationNumber) {
    let colorPicker = document.getElementById(`color${nationNumber}`);
    let button = document.getElementById(`nation${nationNumber}-btn`);


    // Update the button's background color and the nation's color
    button.style.backgroundColor = colorPicker.value;
    nationColors[nationNumber] = colorPicker.value;

    // Update the color of all features assigned to this nation
    nationAssignments[nationNumber].forEach(featureId => {
        featureLayers[featureId].setStyle({
            color: nationColors[nationNumber],  // Border color
            fillColor: nationColors[nationNumber], // Fill color
            fillOpacity: 0.7
        });
    });
}


// Function to switch to district
function switchToDistrict() {
    districtMode = true;
    provinceMode = false;
    countryMode = false;
    currentMode = districtMode;
    switchAdmin();
}

// Function to switch to country
function switchToProvince() {
    districtMode = false;
    provinceMode = true;
    countryMode = false;
    currentMode = provinceMode;
    switchAdmin();
}

// Function to switch to country
function switchToCountry() {
    districtMode = false;
    provinceMode = false;
    countryMode = true;
    currentMode = countryMode;
    switchAdmin();
}

// Function to switch to provinces
function switchAdmin() {
    let adminLevel = district;
    if(currentMode == provinceMode){
        adminLevel = province;
    } else if (currentMode == countryMode) {
        adminLevel = country;
    }
    // Loop through district GeoJSON to group by province
    Object.values(featureLayers).forEach(layer => {
        let adminLevel = layer.feature.properties.adminLevel; // Assuming each feature has a province property

        if (!adminGroups[adminLevel]) {
            adminGroups[adminLevel] = [];
        }

        adminGroups[adminLevel].push(layer);
    });

    // Update the map to show provinces
    Object.keys(adminGroups).forEach(adminLevel => {
        let curLevel = adminGroups[adminLevel];
    });

    curLevel.forEach(layer => {
        layer.setStyle({
            color: 'black',
            weight: 0.3,
            fillColor: 'white',
            fillOpacity: 0.2
        });
    });    
}

// Function to assign a nation to a province
function assignNationToProvince(nationNumber, province) {
    let provinceDistricts = provinceGroups[province];
    
    // Iterate over all districts in the province
    provinceDistricts.forEach(layer => {
        let featureId = layer.feature.properties.ID; // Get the feature's ID
        nationAssignments[nationNumber].push(featureId);

        // Update the style for the district
        layer.setStyle({
            color: 'black',
            weight: 0.3,
            fillColor: 'white',
            fillOpacity: 0.2
        });
    });
}





function popAdd(selectedNation, featurePop, featureId) {
    let previousNation = null;

    // Find which nation the feature currently belongs to, if any
    for (let i = 1; i <= 10; i++) {
        if (nationAssignments[i].includes(featureId)) {  
            previousNation = i;
            break;
        }
    }

    // If the feature was previously assigned to a nation, deduct its population from that nation
    if (previousNation !== null) {
        nationPopulations[previousNation] -= featurePop;
        document.getElementById(`pop${previousNation}`).textContent = nationPopulations[previousNation];
        
        // Remove the feature from the previous nation's assignment
        const index = nationAssignments[previousNation].indexOf(featureId);
        if (index !== -1) {
            nationAssignments[previousNation].splice(index, 1);  // Remove feature from the array
        }
    }

    // Add the feature to the new nation and update its population
    nationPopulations[selectedNation] += featurePop;
    nationAssignments[selectedNation].push(featureId);
    document.getElementById(`pop${selectedNation}`).textContent = nationPopulations[selectedNation];
}


/* ****** MAP ******* */


// Initialize the map
var map = L.map('map', {
    center: [42.6629, 21.1655], zoom: 6,
});

// Add tile layers
var Esri_WorldTerrain = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: USGS, Esri, TANA, DeLorme, and NPS',
}).addTo(map);

var CartoDB_VoyagerOnlyLabels = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
}).addTo(map);


// Fetch and add GeoJSON data to the map
fetch('data/balkans.geojson') // Ensure this path is correct
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            style: function(feature) {
                return {
                    color: 'black',
                    weight: 0.3,
                    fillColor: 'white',
                    fillOpacity: 0.2
                };
            },
            onEachFeature: function(feature, layer) {
                let featureId = feature.properties.ID; // Get the feature's ID
                featureLayers[featureId] = layer; // Store the layer reference for later updates

                // Handle click on feature
                layer.on('click', function() {
                    if (selectedNation !== null) {
                        let featurePop = feature.properties.population; // Get population of the feature
                        let featureId = feature.properties.ID; // Get the feature's ID
                
                        // Assign the feature to the selected nation and update population
                        popAdd(selectedNation, featurePop, featureId);

                        // Change the feature's color based on the selected nation
                        let selectedColor = nationColors[selectedNation];
                        layer.setStyle({
                            color: selectedColor,
                            fillColor: selectedColor,
                            fillOpacity: 0.7
                        });
                    }
                });

                // Handle mouseover event, also with Shift key for coloring
                layer.on('mouseover', function() {

                    let featureDist = feature.properties.district; // Get population of the feature
                    let featureProv = feature.properties.province; // Get population of the feature
                    let featureCountry = feature.properties.country; // Get population of the feature
                    let featureId = feature.properties.ID; // Get the feature's ID
                    let featurePop = feature.properties.population; // Get population of the feature
                    // let featureLarge = feature.properties.population; // Get population of the feature
                    // let featurePerc = feature.properties.population; // Get population of the feature

                        // Display the district information in a specific HTML element, e.g., a div or span
                    document.getElementById('district').textContent = `District: ${featureDist}`;
                    document.getElementById('province').textContent = `Province: ${featureProv}`;
                    document.getElementById('country').textContent = `Country: ${featureCountry}`;
                    document.getElementById('distID').textContent = `ID: ${featureId}`;
                    document.getElementById('population').textContent = `Population: ${featurePop}`;

                    if (shiftKeyPressed && selectedNation !== null) {
                        let selectedColor = nationColors[selectedNation];
                        layer.setStyle({
                            color: selectedColor,
                            fillColor: selectedColor,
                            fillOpacity: 0.7
                        });

                        if (selectedNation !== null) {                    
                            // Assign the feature to the selected nation and update population
                            popAdd(selectedNation, featurePop, featureId);    
                        }
                    }
                });

            }
        }).addTo(map);
    })
    .catch(error => {
        console.error('Error loading GeoJSON:', error); // Catch any errors
    });
    


    /* ****** SHIFT KEY HANDLING ******* */

// Detect when the Shift key is pressed and released
document.addEventListener('keydown', function(event) {
    if (event.key === 'Shift') {
        shiftKeyPressed = true;
    }
});

document.addEventListener('keyup', function(event) {
    if (event.key === 'Shift') {
        shiftKeyPressed = false;
    }
});


    /* ****** EVENT ******* */

for (let i = 1; i <= 10; i++) {
    document.getElementById(`nation${i}-btn`).addEventListener('click', () => selectNation(i));
    document.getElementById(`nation${i}-btn`).addEventListener('contextmenu', (e) => {
        e.preventDefault();
        document.getElementById(`color${i}`).click();
    });
    document.getElementById(`color${i}`).addEventListener('input', () => updateButtonColor(i));
}

// Initialize button colors
updateButtonColor(1);
updateButtonColor(2);
updateButtonColor(3);
updateButtonColor(4);
updateButtonColor(5);
updateButtonColor(6);
updateButtonColor(7);
updateButtonColor(8);
updateButtonColor(9);
updateButtonColor(10);


// Event listener for district switch button
document.getElementById('district-btn').addEventListener('click', switchToDistrict);

// Event listener for province switch button
document.getElementById('province-btn').addEventListener('click', switchToProvince);

// Event listener for country switch button
document.getElementById('country-btn').addEventListener('click', switchToCountry);


document.addEventListener('DOMContentLoaded', function() {
    for (let i = 1; i <= 10; i++) {
        document.getElementById(`pop${i}`).textContent = `${nationPopulations[i]}`;
    }
});