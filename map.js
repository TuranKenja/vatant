

/* ****** VARIABLES ******* */


let selectedNation = 1; // To store which nation is selected
let nationColors = { 1: '#8b0000', 2: '#adff2f', 3: '#00bfff',  4: '#800080',  5: '#f0e68c',  6: '#ffa07a',  7: '#00ffff',  8: '#a9a9a9',  9: '#b03060',  10: '#ffd700'}; // Define colors for each nation
let nationAssignments = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: []}; // To track which features are assigned to which nation
let nationPopulations = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0};
let featureLayers = {}; // To store references to the GeoJSON layers by feature id
let shiftKeyPressed = false; // Track if the Shift key is pressed
let provinceGroups = {}; // To store districts grouped by province
let provincePopulations = {}; // To store district population after grouping
let mode = 'district';
let districtBoundariesLayer = null;  // To hold the district boundaries layer
let provinceBoundariesLayer = null;  // To hold the province boundaries layer
let countryBoundariesLayer = null;  // To hold the country boundaries layer
let distBool = true;
let provBool = true;
let countBool = true;


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
    document.getElementById(`pop${selectedNation}`).textContent = nationPopulations[selectedNation].toLocaleString();
}
function switchToDistrict() {
    mode = 'district';
}

function switchToProvince() {
    mode = 'province';

}

function switchToCountry() {
    mode = 'country';
}

function distBoundaries() {
    distBool = !distBool;

    if (!distBool) {
        document.getElementById('dist-bound-btn').classList.add('clickedBtn');  // Add the class to the clicked button
    } else {
        document.getElementById('dist-bound-btn').classList.remove('clickedBtn');  // Remove the class
    }


    if (districtBoundariesLayer) {
        toggleBoundaries(districtBoundariesLayer, distBool);  // If the layer already exists
    } else {
        drawBoundaries('data/balkans.geojson', districtBoundariesLayer, 'district');  // Load if it doesn't exist
    }
}


function provBoundaries() {
    provBool = !provBool;

    if (!provBool) {
        document.getElementById('prov-bound-btn').classList.add('clickedBtn');  // Add the class to the clicked button
    } else {
        document.getElementById('prov-bound-btn').classList.remove('clickedBtn');  // Remove the class
    }

    if (provinceBoundariesLayer) {
        toggleBoundaries(provinceBoundariesLayer, provBool);  // If the layer already exists
    } else {
        drawBoundaries('data/balkans_prov.geojson', provinceBoundariesLayer, 'province');  // Load if it doesn't exist
    }
}


function countBoundaries() {
    countBool = !countBool;

    if (!countBool) {
        document.getElementById('count-bound-btn').classList.add('clickedBtn');  // Add the class to the clicked button
    } else {
        document.getElementById('count-bound-btn').classList.remove('clickedBtn');  // Remove the class
    
    }
    if (countryBoundariesLayer) {
        toggleBoundaries(countryBoundariesLayer, countBool);  // If the layer already exists
    } else {
        drawBoundaries('data/balkans.geojson', countryBoundariesLayer, 'country');  // Load if it doesn't exist
    }
}


function drawBoundaries(dataLocation, boundariesLayer, boundaryType) {
    fetch(dataLocation)
    .then(response => response.json())
    .then(data => {
        // Create a new GeoJSON layer and store it in the variable
        boundariesLayer = L.geoJSON(data, {
            style: function (feature) {
                return {
                    color: "#01002e",
                    weight: .7,
                    opacity: 1,
                    fillColor: 'transparent',
                    fillOpacity: 0,
                    interactive: false
                };
            }
        }).addTo(map);  // Add to map
        //Store the newly created layer in the global variable
        if (boundaryType === 'district') {
            districtBoundariesLayer = boundariesLayer;
        } else if (boundaryType === 'province') {
            provinceBoundariesLayer = boundariesLayer;
        } else if (boundaryType === 'country') {
            countryBoundariesLayer = boundariesLayer;
        }
    })     
}


function toggleBoundaries(boundariesLayer, boundBool) {
    if (boundBool === true) {
        map.removeLayer(boundariesLayer);  // Remove the layer if it exists
    } else {
        map.addLayer(boundariesLayer);  // Add the layer if it's not already on the map
    }
    
}



function handleFeatureClick(layer, feature) {
    if (mode === 'district') {
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
        };    
    } else if (mode === 'province') {
        let featureProv = feature.properties.province;
        if (selectedNation !== null && provinceGroups[featureProv]) {                    
            provinceGroups[featureProv].forEach(districtFeature => {
                let districtLayer = featureLayers[districtFeature.properties.ID]; // Get the layer for each district in the province
                let featureId = districtFeature.properties.ID; // Get the feature's ID
                let featurePop = districtFeature.properties.population; // Get the population of the district
    
                if (districtLayer) { // Ensure the layer exists
                    popAdd(selectedNation, featurePop, featureId);    
    
                    let selectedColor = nationColors[selectedNation];
                    districtLayer.setStyle({
                        color: selectedColor,
                        fillColor: selectedColor,
                        fillOpacity: 0.7
                    });
                } else {
                    console.error(`Error: Layer for district with ID ${districtFeature.properties.ID} not found.`);
                }
            });                        
        }
    };
}

function handleFeatureOver(layer, feature) {
    if (mode === 'district') {
         
        let featureId = feature.properties.ID; // Get the feature's ID
        let featurePop = feature.properties.population; // Get population of the feature

        if (selectedNation !== null) {                    
            // Assign the feature to the selected nation and update population
            popAdd(selectedNation, featurePop, featureId);    
        }
        let selectedColor = nationColors[selectedNation];
        layer.setStyle({
            color: selectedColor,
            fillColor: selectedColor,
            fillOpacity: 0.7
        });

    } else if (mode === 'province') {
        let featureProv = feature.properties.province;
        if (selectedNation !== null && provinceGroups[featureProv]) {                    
            provinceGroups[featureProv].forEach(districtFeature => {
                let districtLayer = featureLayers[districtFeature.properties.ID]; // Get the layer for each district in the province
                let featureId = districtFeature.properties.ID; // Get the feature's ID
                let featurePop = districtFeature.properties.population; // Get the population of the district
    
                if (districtLayer) { // Ensure the layer exists
                    popAdd(selectedNation, featurePop, featureId);    
                    let selectedColor = nationColors[selectedNation];
                    districtLayer.setStyle({
                        color: selectedColor,
                        fillColor: selectedColor,
                        fillOpacity: 0.7
                    });
                } else {
                    console.error(`Error: Layer for district with ID ${districtFeature.properties.ID} not found.`);
                }
            });                        
        }
    };
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
                    fillOpacity: 0,
                    opacity: 0
                };
            },

            onEachFeature: function(feature, layer) {

                // Group districts by province
                data.features.forEach(feature => {
                    let provinceId = feature.properties.province; // Assuming province_id exists in your data
                    let provincePop = feature.properties.population; // Assuming province_id exists in your data
                    if (!provinceGroups[provinceId]) {
                        provinceGroups[provinceId] = [];
                    }
                    provincePopulations[feature.properties.ID] = provincePop;
                    provinceGroups[provinceId].push(feature); // Add district to its province group
                });
    
                let featureId = feature.properties.ID; // Get the feature's ID
                featureLayers[featureId] = layer; // Store the layer reference for later updates

                layer.on('click', function() {
                    handleFeatureClick(layer, feature);
                });

                // Handle mouseover to display feature info
                // Handle mouseover event, also with Shift key for coloring
                layer.on('mouseover', function() {
                    document.getElementById('district').textContent = `${feature.properties.district}`;
                    document.getElementById('province').textContent = `${feature.properties.province}`;
                    document.getElementById('country').textContent = `${feature.properties.country}`;
                    document.getElementById('distID').textContent = `${feature.properties.ID}`;
                    document.getElementById('population').textContent = `${feature.properties.population}`;

                    if (shiftKeyPressed) {
                        handleFeatureOver(layer, feature);
                    }
                });
            }
        }).addTo(map);       
        document.getElementById('district-btn').click();  // Add the class to the clicked button
        document.getElementById('dist-bound-btn').click();          
        document.getElementById('nation1-btn').click();          
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


document.addEventListener('DOMContentLoaded', function() {
    for (let i = 1; i <= 10; i++) {
        document.getElementById(`pop${i}`).textContent = `${nationPopulations[i]}`;
    }
    
        // Event listener for switch button
    document.getElementById('district-btn').addEventListener('click', switchToDistrict);
    document.getElementById('province-btn').addEventListener('click', switchToProvince);
    document.getElementById('country-btn').addEventListener('click', switchToCountry);

    document.querySelectorAll('.btn').forEach(btnClick => {
        btnClick.addEventListener('click', () => {
            document.querySelector('.clickedBtn')?.classList.remove('clickedBtn');
            btnClick.classList.add('clickedBtn');
        });
    });

    document.getElementById('dist-bound-btn').addEventListener('click', distBoundaries);
    document.getElementById('prov-bound-btn').addEventListener('click', provBoundaries);
    document.getElementById('count-bound-btn').addEventListener('click', countBoundaries);

});