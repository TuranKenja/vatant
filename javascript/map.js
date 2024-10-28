

/* ****** VARIABLES ******* */


let selectedNation = 1; // To store which nation is selected
let nationBool = true;
let nationNames = {1: "Nation 1", 2: "Nation 2", 3: "Nation 3", 4: "Nation 4", 5: "Nation 5", 6: "Nation 6", 7: "Nation 7", 8: "Nation 8", 9: "Nation 9", 10: "Nation 10"};
let nationColors = { 1: '#ff0000', 2: '#0091ff', 3: '#00ff26',  4: '#ea00ff',  5: '#ffe600',  6: '#0040ff',  7: '#00ffaa',  8: '#7b00ff',  9: '#ff005d',  10: '#00d5ff'}; // Define colors for each nation
let nationAssignments = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: []}; // To track which features are assigned to which nation
let tempNationAssignments;
let districtObjects = [];
let nationInfo = {};   // Holds the nation info for each of the keys
let ethnicData = [];
let religionData = [];
let dataType;
let ethBool = true;
let shiftKeyPressed = false; // Track if the Shift key is pressed
let provinceGroups = {}; // To store districts grouped by province
let countryGroups = {}; // To store districts grouped by province
let provincePopulations = {}; // To store district population after grouping
let countryPopulations = {}; // To store district population after grouping
let drawMode = 'draw';
let mode = 'district';
let largestLayer = null;  
let opacityLayer = null; 
let religionLayer = null;  
let relOpacityLayer = null; 
let featureLayers = {}; // To store references to the GeoJSON layers by feature id
let districtBoundariesLayer = null;  // To hold the district boundaries layer
let provinceBoundariesLayer = null;  // To hold the province boundaries layer
let countryBoundariesLayer = null;  // To hold the country boundaries layer
let dataLoaded = false;
let distBool = true;
let provBool = true;
let countryBool = true;
let largeBool = true;
let religionBool = true;




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
    nationAssignments[nationNumber].forEach(feature => {
        const featureId = feature.ID;
        featureLayers[featureId].setStyle({
            color: nationColors[nationNumber],  // Border color
            fillColor: nationColors[nationNumber], // Fill color
            fillOpacity: 0.7,
            opacity: 1
        });
    });
}

// Function to update all references to a nation name
function updateNationName(nationId, newName) {
    nationNames[nationId] = newName;
    
    // Update all span elements with the new nation name
    document.querySelector(`#nation${nationId}-feature`).textContent = newName;
    
    // Update any other reference on the page that needs to reflect the name change
    document.querySelector(`#nation${nationId} .nations`).textContent = newName;

    // If you have other places to update, like dropdowns or summaries, update them here too
}


function districtAdd(selectedNation, featureId) {
    let previousNation = null;

    // Find which nation the feature currently belongs to, if any
    for (let i = 1; i <= 10; i++) {
        const index = nationAssignments[i].findIndex(obj => obj.ID === featureId);
        if (index !== -1) {
            previousNation = i;
            break;
        }
    }

    // If the feature was previously assigned to a nation, deduct its population and other properties
    if (previousNation !== null) {
        districtSub(featureId);
    }

    // Add the feature to the new nation and update its properties
    const featureObject = districtObjects.find(obj => obj.ID === featureId);
    if (featureObject) {
        // Add values for all relevant keys
        for (const key in featureObject) {
            if (key !== 'ID' && typeof featureObject[key] === 'number') {
                nationInfo[selectedNation][key] += featureObject[key]; // Add the value
            }
        }
        
        nationAssignments[selectedNation].push(featureObject);  // Add the full object
    }

    // Update the display for the selected nation
    document.getElementById(`pop${selectedNation}`).textContent = nationInfo[selectedNation].Population.toLocaleString();
    for (let i = 1; i <= 10; i++) {
        document.getElementById(`population${i}`).textContent = `${nationInfo[i].Population.toLocaleString()}`      
    }    
}

function districtSub(featureId) {
    let previousNation = null;

    // Find which nation the feature currently belongs to, if any
    for (let i = 1; i <= 10; i++) {
        const index = nationAssignments[i].findIndex(obj => obj.ID === featureId);
        if (index !== -1) {
            previousNation = i;
            break;
        }
    }

    // If the feature was previously assigned to a nation, deduct its population and other properties
    if (previousNation !== null) {
        const previousFeature = nationAssignments[previousNation].find(obj => obj.ID === featureId);

        // Deduct values for all relevant keys
        for (const key in previousFeature) {
            if (key !== 'ID' && typeof previousFeature[key] === 'number') {
                nationInfo[previousNation][key] -= previousFeature[key]; // Deduct the value
            }
        }

        // Update the display for the previous nation
        document.getElementById(`pop${previousNation}`).textContent = nationInfo[previousNation].Population.toLocaleString();
        
        // Remove the feature from the previous nation's assignment
        const index = nationAssignments[previousNation].findIndex(obj => obj.ID === featureId);
        if (index !== -1) {
            nationAssignments[previousNation].splice(index, 1);  // Remove feature from the array
        }
    }
    for (let i = 1; i <= 10; i++) {
        document.getElementById(`population${i}`).textContent = `${nationInfo[i].Population.toLocaleString()}`      
    }    
}

function switchToDraw() {
    drawMode = 'draw';
    document.getElementById('draw-btn').classList.add('clickedBtn');  // Add the class to the clicked button
    document.getElementById('erase-btn').classList.remove('clickedBtn');  // Remove the class

}

function switchToErase() {
    drawMode = 'erase';
    document.getElementById('erase-btn').classList.add('clickedBtn');  // Add the class to the clicked button
    document.getElementById('draw-btn').classList.remove('clickedBtn');  // Remove the class

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
        drawBoundaries('data/southeastEurope/districtBoundaries1.geojson', districtBoundariesLayer, 'district');  // Load if it doesn't exist
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
        drawBoundaries('data/southeastEurope/provinceBoundaries.geojson', provinceBoundariesLayer, 'province');  // Load if it doesn't exist
    }
}


function countBoundaries() {
    countryBool = !countryBool;

    if (!countryBool) {
        document.getElementById('count-bound-btn').classList.add('clickedBtn');  // Add the class to the clicked button
    } else {
        document.getElementById('count-bound-btn').classList.remove('clickedBtn');  // Remove the class
    
    }
    if (countryBoundariesLayer) {
        toggleBoundaries(countryBoundariesLayer, countryBool);  // If the layer already exists
    } else {
        drawBoundaries('data/southeastEurope/countryBoundaries.geojson', countryBoundariesLayer, 'country');  // Load if it doesn't exist
    }
}


function largestBoundaries() {
    largeBool = !largeBool;

    if (!largeBool) {
        document.getElementById('largest-btn').classList.add('clickedBtn');  // Add the class to the clicked button
    } else {
        document.getElementById('largest-btn').classList.remove('clickedBtn');  // Remove the class
    
    }
    if (largestLayer) {
        toggleBoundaries(largestLayer, largeBool);  // If the layer already exists
        toggleBoundaries(opacityLayer, largeBool);  // If the layer already exists
    } else {
        drawLargestLayers('data/southeastEurope/districtBoundaries1.geojson', largestLayer, opacityLayer);  // Load if it doesn't exist
    }
    // largestLayer.bringToFront();
    // opacityLayer.bringToFront();
    // featureLayers.bringToFront();
    // countryBoundariesLayer.bringToFront();
    // provinceBoundariesLayer.bringToFront();
    // districtBoundariesLayer.bringToFront();
}

function religionBoundaries() {
    religionBool = !religionBool;

    if (!religionBool) {
        document.getElementById('religion-btn').classList.add('clickedBtn');  // Add the class to the clicked button
    } else {
        document.getElementById('religion-btn').classList.remove('clickedBtn');  // Remove the class
    
    }
    if (religionLayer) {
        toggleBoundaries(religionLayer, religionBool);  // If the layer already exists
        toggleBoundaries(relOpacityLayer, religionBool);  // If the layer already exists
    } else {
        drawReligionLayers('data/southeastEurope/districtBoundaries1.geojson', religionLayer, relOpacityLayer);  // Load if it doesn't exist
    }
    // largestLayer.bringToFront();
    // opacityLayer.bringToFront();
    // featureLayers.bringToFront();
    // countryBoundariesLayer.bringToFront();
    // provinceBoundariesLayer.bringToFront();
    // districtBoundariesLayer.bringToFront();
}


function drawBoundaries(dataLocation, boundariesLayer, boundaryType) {
    fetch(dataLocation)
    .then(response => response.json())
    .then(data => {
        // Create a new GeoJSON layer and store it in the variable
        if (boundaryType === 'district') {
            boundariesLayer = L.geoJSON(data, {
                pane: 'boundaries',
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
            }).addTo(map);
        } else if (boundaryType === 'province') {
            boundariesLayer = L.geoJSON(data, {
                pane: 'boundaries',
                style: function (feature) {
                    return {
                        color: "#daa520",
                        weight: .7,
                        opacity: 1,
                        fillColor: 'transparent',
                        fillOpacity: 0,
                        interactive: false
                    };
                }
            }).addTo(map);
        } else if (boundaryType === 'country') {
            boundariesLayer = L.geoJSON(data, {
                pane: 'boundaries',
                style: function (feature) {
                    return {
                        color: "#000000",
                        weight: .7,
                        opacity: 1,
                        fillColor: 'transparent',
                        fillOpacity: 0,
                        interactive: false
                    };
                }
            }).addTo(map);
        }
        //Store the newly created layer in the global variable
        if (boundaryType === 'district') {
            districtBoundariesLayer = boundariesLayer;
            districtBoundariesLayer.bringToFront();
        } else if (boundaryType === 'province') {
            provinceBoundariesLayer = boundariesLayer;
            provinceBoundariesLayer.bringToFront();
        } else if (boundaryType === 'country') {
            countryBoundariesLayer = boundariesLayer;
            countryBoundariesLayer.bringToFront();
        }
    })     
}

// Percent of Population Layer
function drawLargestLayers(dataLocation, boundariesLayer, opLayer) {
    fetch(dataLocation)
    .then(response => response.json())
    .then(data => {
        boundariesLayer = L.geoJSON(data, {
            pane: 'layers',
            style: function (feature) {
                return {
                    color: largestColors(feature.properties["Largest Group"]),
                    weight: 1,
                    opacity: 0.5,
                    fillColor: largestColors(feature.properties["Largest Group"]),  // Pass the Largest_Group to largestColors
                    fillOpacity: 0.6,
                    interactive: false
                };
            }
        }).addTo(map);  // Add to map
        opLayer = L.geoJSON(data, {
            pane: 'layers',
            style: function (feature) {
                return {
                    color: "#01002e",
                    weight: 0.7,
                    opacity: largestOpacity(feature.properties["Percent of Population"], 0),
                    fillColor: largestOpacity(feature.properties["Percent of Population"], 1),
                    fillOpacity: largestOpacity(feature.properties["Percent of Population"], 0),
                    interactive: false
                };
            }
        }).addTo(map);  // Add to map
        //Store the newly created layer in the global variable
        largestLayer = boundariesLayer;
        opacityLayer = opLayer;
    })     
}

// Percent of Population Layer
function drawReligionLayers(dataLocation, boundariesLayer, opLayer) {
    fetch(dataLocation)
    .then(response => response.json())
    .then(data => {
        boundariesLayer = L.geoJSON(data, {
            pane: 'layers',
            style: function (feature) {
                return {
                    color: religionColors(feature.properties["Largest Religion"]),
                    weight: 1,
                    opacity: 0.5,
                    fillColor: religionColors(feature.properties["Share of Population"]),  // Pass the Largest_Group to religionColors
                    fillOpacity: 0.6,
                    interactive: false
                };
            }
        }).addTo(map);  // Add to map
        opLayer = L.geoJSON(data, {
            pane: 'layers',
            style: function (feature) {
                return {
                    color: "#01002e",
                    weight: 0.7,
                    opacity: largestOpacity(feature.properties["Share of Population"], 0),
                    fillColor: largestOpacity(feature.properties["Share of Population"], 1),
                    fillOpacity: largestOpacity(feature.properties["Share of Population"], 0),
                    interactive: false
                };
            }
        }).addTo(map);  // Add to map
        //Store the newly created layer in the global variable
        religionLayer = boundariesLayer;
        relOpacityLayer = opLayer;
    })     
}

function largestOpacity(largestOp, colorOp) {
    if (colorOp === 1){
        if (largestOp > .5) {
            return 'black';
        } else {
            return 'white';
        }
    } else {
        if (largestOp > .6) {
            return (largestOp - .6);
        } else {
            return (.6 - largestOp);
        }
    }
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
            let featureId = feature.properties.ID; // Get the feature's ID
    
            // Assign the feature to the selected nation and update population
            if (drawMode === 'draw') {
                districtAdd(selectedNation, featureId);
            } else if (drawMode === 'erase'){
                districtSub(featureId);
            }

            // Change the feature's color based on the selected nation
            if (drawMode === 'draw'){
                let selectedColor = nationColors[selectedNation];
                layer.setStyle({
                    color: selectedColor,
                    fillColor: selectedColor,
                    fillOpacity: 0.7,
                    opacity: 1
                });
            } else if (drawMode === 'erase'){
                layer.setStyle({
                    color: null,
                    fillColor: null,
                    fillOpacity: 0,
                    opacity: 0
                });
            }
        };    
    } else if (mode === 'province') {
        let featureProv = feature.properties.Province;
        if (selectedNation !== null && provinceGroups[featureProv]) {                    
            provinceGroups[featureProv].forEach(districtFeature => {
                let districtLayer = featureLayers[districtFeature.properties.ID]; // Get the layer for each district in the province
                let featureId = districtFeature.properties.ID; // Get the feature's ID
    
                if (districtLayer) { // Ensure the layer exists
                    if (drawMode === 'draw') {
                        districtAdd(selectedNation, featureId);    
                    } else if (drawMode === 'erase'){
                        districtSub(featureId);
                    }
                    if (drawMode === 'draw'){
                        let selectedColor = nationColors[selectedNation];
                        districtLayer.setStyle({
                            color: selectedColor,
                            fillColor: selectedColor,
                            fillOpacity: 0.7,
                            opacity: 1
                        });
                    } else if (drawMode === 'erase'){
                        districtLayer.setStyle({
                            color: null,
                            fillColor: null,
                            fillOpacity: 0,
                            opacity: 0
                        });
                    }                

                } else {
                    console.error(`Error: Layer for district with ID ${districtFeature.properties.ID} not found.`);
                }
            });                        
        }
    } else if (mode === 'country') {
        let featureCountry = feature.properties.Country;
        if (selectedNation !== null && countryGroups[featureCountry]) {                    
            countryGroups[featureCountry].forEach(districtFeature => {
                let districtLayer = featureLayers[districtFeature.properties.ID]; // Get the layer for each district in the country
                let featureId = districtFeature.properties.ID; // Get the feature's ID
    
                if (districtLayer) { // Ensure the layer exists
                    if (drawMode === 'draw') {
                        districtAdd(selectedNation, featureId);    
                    } else if (drawMode === 'erase'){
                        districtSub(featureId);
                    }
                    if (drawMode === 'draw'){
                        let selectedColor = nationColors[selectedNation];
                        districtLayer.setStyle({
                            color: selectedColor,
                            fillColor: selectedColor,
                            fillOpacity: 0.7,
                            opacity: 1
                        });
                    } else if (drawMode === 'erase'){
                        districtLayer.setStyle({
                            color: null,
                            fillColor: null,
                            fillOpacity: 0,
                            opacity: 0
                        });
                    }                

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

        if (selectedNation !== null) {                    
            // Assign the feature to the selected nation and update population
            if (drawMode === 'draw') {
                districtAdd(selectedNation, featureId);    
            } else if (drawMode === 'erase'){
                districtSub(featureId);
            }
        }
        if (drawMode === 'draw'){
            let selectedColor = nationColors[selectedNation];
            layer.setStyle({
                color: selectedColor,
                fillColor: selectedColor,
                fillOpacity: 0.7,
                opacity: 1
            });
        } else if (drawMode === 'erase'){
            layer.setStyle({
                color: null,
                fillColor: null,
                fillOpacity: 0,
                opacity: 0
            });
        }


    } else if (mode === 'province') {
        let featureProv = feature.properties.Province;
        if (selectedNation !== null && provinceGroups[featureProv]) {                    
            provinceGroups[featureProv].forEach(districtFeature => {
                let districtLayer = featureLayers[districtFeature.properties.ID]; // Get the layer for each district in the province
                let featureId = districtFeature.properties.ID; // Get the feature's ID
    
                if (districtLayer) { // Ensure the layer exists
                    if (drawMode === 'draw') {
                        districtAdd(selectedNation, featureId);    
                    } else if (drawMode === 'erase'){
                        districtSub(featureId);
                    }
                    if (drawMode === 'draw'){
                        let selectedColor = nationColors[selectedNation];
                        districtLayer.setStyle({
                            color: selectedColor,
                            fillColor: selectedColor,
                            fillOpacity: 0.7,
                            opacity: 1
                        });
                    } else if (drawMode === 'erase'){
                        districtLayer.setStyle({
                            color: null,
                            fillColor: null,
                            fillOpacity: 0,
                            opacity: 0
                        });
                    }                
                } else {
                    console.error(`Error: Layer for district with ID ${districtFeature.properties.ID} not found.`);
                }
            });                        
        }
    } else if (mode === 'country') {
        let featureCountry = feature.properties.Country;
        if (selectedNation !== null && countryGroups[featureCountry]) {                    
            countryGroups[featureCountry].forEach(districtFeature => {
                let districtLayer = featureLayers[districtFeature.properties.ID]; // Get the layer for each district in the country
                let featureId = districtFeature.properties.ID; // Get the feature's ID
    
                if (districtLayer) { // Ensure the layer exists
                    if (drawMode === 'draw') {
                        districtAdd(selectedNation, featureId);    
                    } else if (drawMode === 'erase'){
                        districtSub(featureId);
                    }
                    if (drawMode === 'draw'){
                        let selectedColor = nationColors[selectedNation];
                        districtLayer.setStyle({
                            color: selectedColor,
                            fillColor: selectedColor,
                            fillOpacity: 0.7,
                            opacity: 1
                        });
                    } else if (drawMode === 'erase'){
                        districtLayer.setStyle({
                            color: null,
                            fillColor: null,
                            fillOpacity: 0,
                            opacity: 0
                        });
                    }                
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
    scrollWheelZoom: false, // disable original zoom function
    smoothWheelZoom: true,  // enable smooth zoom 
    smoothSensitivity: 6,   // zoom speed. default is 1
    center: [42.6629, 21.1655], zoom: 6
});


// Add tile layers
var Esri_WorldTerrain = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: USGS, Esri, TANA, DeLorme, and NPS',
}).addTo(map);

var CartoDB_VoyagerOnlyLabels = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
}).addTo(map);



// Use fetch to load the JSON file
fetch('data/southeastEurope/ethArray.json')
    .then(response => response.json())  // Parse JSON response
    .then(data => {
        districtObjects = data;  // Set the data to districtObjects
        // You can now use districtObjects in your script
        let baseNation = districtObjects.find(obj => obj.ID === 'base');
        dataType = districtObjects.find(obj => obj.ID === 'dataType');
        const excludeKeys = ["ID", "Data Year", "Country", "Province", "District", "Largest Group", "Percent of Population", "oneGroup", "twoGroup", "threeGroup", "fourGroup", "fiveGroup", "sixGroup", "sevenGroup", "eightGroup", "nineGroup", "tenGroup", "Largest Religion", "Share of Population"];

        const nationBase = Object.keys(baseNation)
            .filter(key => !excludeKeys.includes(key))
            .reduce((acc, key) => {
                acc[key] = baseNation[key];
                return acc;
            }, {});

            ethnicData = Object.keys(baseNation);
        // .filter(key => !excludeKeys.includes(key))
        // .reduce((acc, key) => {
        //     acc[key] = baseNation[key];
        //     return acc;
        // }, {});


        nationInfo = { 1: {...nationBase}, 2: {...nationBase}, 3: {...nationBase}, 4: {...nationBase}, 5: {...nationBase}, 6: {...nationBase}, 7: {...nationBase}, 8: {...nationBase}, 9: {...nationBase}, 10: {...nationBase}};   // Holds the nation info for each of the keys
        console.log('nationInfo loaded:', nationInfo);
        console.log('ethnicData loaded:', ethnicData);
    })
    .catch(error => console.error('Error loading JSON:', error));


function mainLoadData(saveArray) {
    // Fetch and add GeoJSON data to the map
    fetch('data/southeastEurope/districtBoundaries1.geojson') // Ensure this path is correct
        .then(response => response.json())
        .then(data => {

            L.geoJSON(data, {
                pane: 'nations',
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

                    // Group districts by province and country
                    data.features.forEach(feature => {
                        let provinceId = feature.properties.Province;
                        let provincePop, countryPop = feature.properties.Population;
                        if (!provinceGroups[provinceId]) {
                            provinceGroups[provinceId] = [];
                        }
                        provincePopulations[feature.properties.ID] = provincePop;
                        provinceGroups[provinceId].push(feature); // Add district to its province group

                        let countryId = feature.properties.Country; // Assuming province_id exists in your data
                        // let countryPop = feature.properties.Population; // Assuming province_id exists in your data
                        if (!countryGroups[countryId]) {
                            countryGroups[countryId] = [];
                        }
                        countryPopulations[feature.properties.ID] = countryPop;
                        countryGroups[countryId].push(feature); // Add district to its country group

                    });
        
                    let featureId = feature.properties.ID; // Get the feature's ID
                    featureLayers[featureId] = layer; // Store the layer reference for later updates

                    // Find the matching object from districtObjects based on feature.properties.ID
                    districtObjects.find(obj => obj.ID.trim() === feature.properties.ID.trim());
        

                    if(saveArray != null){
                    // Clear all existing layers on the map before reloading
                        map.eachLayer(function (layer) {
                            if (layer instanceof L.GeoJSON) {
                                map.removeLayer(layer);
                            }
                        });    

                        for (let i = 1; i <= 10; i++) { // Go through each nation
                            selectedNation = i;
                            let len = tempNationAssignments[i].length;
                            for (let j = 0; j < len; j++) { // Go through each district (starting from 0 for the first element)
                                let featureId = tempNationAssignments[i][j].ID;
                                if(feature.properties.ID === featureId) {
                                    drawMode='erase';
                                    handleFeatureClick(layer, feature);
                                    drawMode='draw';
                                    handleFeatureClick(layer, feature);
                            }
                            };
                        }

                        for (let i = 1; i <= 10; i++) { // Go through each nation
                            selectedNation = i;
                            let len = saveArray[i].length;
                            for (let j = 0; j < len; j++) { // Go through each district (starting from 0 for the first element)
                                let featureId = saveArray[i][j].ID;
                                if(feature.properties.ID === featureId) {
                                    handleFeatureClick(layer, feature);
                                }
                            };
                        }
                    }
        
                    layer.on('click', function() {
                        handleFeatureClick(layer, feature);
                        console.log('nationInfo right now:', nationInfo);
                        console.log('nationAssignments right now:', nationAssignments);
                    });

                    // Handle mouseover to display feature info
                    // Handle mouseover event, also with Shift key for coloring
                    layer.on('mouseover', function() {
                        // Find the matching object from districtObjects based on feature.properties.ID
                        const curObj = districtObjects.find(obj => obj.ID.trim() === feature.properties.ID.trim());

                        if (shiftKeyPressed) {
                            handleFeatureOver(layer, feature);
                        }

                        if (curObj) {
                            // Update the HTML content with the properties from both feature and curObj
                            document.getElementById('district').textContent = `${curObj.District}`;
                            document.getElementById('province').textContent = `${curObj.Province}`;
                            document.getElementById('country').textContent = `${curObj.Country}`;
                            document.getElementById('distID').textContent = `${curObj.ID}`;
                            document.getElementById('population').textContent = `${curObj.Population.toLocaleString()}`;
                            
                            
                            document.getElementById('groupOne').textContent = `${curObj.oneGroup}`;
                            document.getElementById('oneGroup').textContent = `${curObj[curObj.oneGroup].toLocaleString()}`;
                            document.getElementById('oneGroup').style.background =  `linear-gradient(to right, #e1e1eb ${curObj[curObj.oneGroup]/curObj['Population'] * 100}%, white 0%)`;
                            

                            document.getElementById('groupTwo').textContent = `${curObj.twoGroup}`;                        
                            if(`${curObj.twoGroup}` === "."){
                                document.getElementById('twoGroup').textContent = ".";
                            } else {
                                document.getElementById('twoGroup').textContent = `${curObj[curObj.twoGroup].toLocaleString()}`;
                                document.getElementById('twoGroup').style.background =  `linear-gradient(to right, #e1e1eb ${curObj[curObj.twoGroup]/curObj['Population'] * 100}%, white 0%)`;
                            }


                            document.getElementById('groupThree').textContent = `${curObj.threeGroup}`;
                            if(`${curObj.threeGroup}` === "."){
                                document.getElementById('threeGroup').textContent = ".";
                            } else {
                                document.getElementById('threeGroup').textContent = `${curObj[curObj.threeGroup].toLocaleString()}`;
                                document.getElementById('threeGroup').style.background =  `linear-gradient(to right, #e1e1eb ${curObj[curObj.threeGroup]/curObj['Population'] * 100}%, white 0%)`;
                            }


                            document.getElementById('groupFour').textContent = `${curObj.fourGroup}`;
                            if(`${curObj.fourGroup}` === "."){
                                document.getElementById('fourGroup').textContent = ".";
                            } else {
                                document.getElementById('fourGroup').textContent = `${curObj[curObj.fourGroup].toLocaleString()}`;
                                document.getElementById('fourGroup').style.background =  `linear-gradient(to right, #e1e1eb ${curObj[curObj.fourGroup]/curObj['Population'] * 100}%, white 0%)`;
                            }


                            document.getElementById('groupFive').textContent = `${curObj.fiveGroup}`;
                            if(`${curObj.fiveGroup}` === "."){
                                document.getElementById('fiveGroup').textContent = ".";
                            } else {
                                document.getElementById('fiveGroup').textContent = `${curObj[curObj.fiveGroup].toLocaleString()}`;
                                document.getElementById('fiveGroup').style.background =  `linear-gradient(to right, #e1e1eb ${curObj[curObj.fiveGroup]/curObj['Population'] * 100}%, white 0%)`;
                            }


                            document.getElementById('groupSix').textContent = `${curObj.sixGroup}`;
                            if(`${curObj.sixGroup}` === "."){
                                document.getElementById('sixGroup').textContent = ".";
                            } else {
                                document.getElementById('sixGroup').textContent = `${curObj[curObj.sixGroup].toLocaleString()}`;
                                document.getElementById('sixGroup').style.background =  `linear-gradient(to right, #e1e1eb ${curObj[curObj.sixGroup]/curObj['Population'] * 100}%, white 0%)`;
                            }

                            
                            document.getElementById('groupSeven').textContent = `${curObj.sevenGroup}`;
                            if(`${curObj.sevenGroup}` === "."){
                                document.getElementById('sevenGroup').textContent = ".";
                            } else {
                                document.getElementById('sevenGroup').textContent = `${curObj[curObj.sevenGroup].toLocaleString()}`;
                                document.getElementById('sevenGroup').style.background =  `linear-gradient(to right, #e1e1eb ${curObj[curObj.sevenGroup]/curObj['Population'] * 100}%, white 0%)`;
                            }

                            
                            document.getElementById('groupEight').textContent = `${curObj.eightGroup}`;
                            if(`${curObj.eightGroup}` === "."){
                                document.getElementById('eightGroup').textContent = ".";
                            } else {
                                document.getElementById('eightGroup').textContent = `${curObj[curObj.eightGroup].toLocaleString()}`;
                                document.getElementById('eightGroup').style.background =  `linear-gradient(to right, #e1e1eb ${curObj[curObj.eightGroup]/curObj['Population'] * 100}%, white 0%)`;
                                
                            }

                        } else {
                            console.warn(`No matching data found for ID: ${feature.properties.ID}`);
                        }

                    });
                }

            }).addTo(map); 
            
            document.getElementById('district-btn').click(); 
            document.getElementById('draw-btn').click();  // Add the class to the clicked button

            document.getElementById('dist-bound-btn').click();          
            document.getElementById('nation1-btn').click();   
            document.getElementById('stat-btn').click(); // Used in data.js

        })
        .catch(error => {
            console.error('Error loading GeoJSON:', error); // Catch any errors
    });
}

mainLoadData(null);

// Create the panes with custom z-index to control the layer order
map.createPane('boundaries');
map.getPane('boundaries').style.zIndex = 500;

map.createPane('nations');
map.getPane('nations').style.zIndex = 450;

map.createPane('layers'); 
map.getPane('layers').style.zIndex = 400;



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
    // for (let i = 1; i <= 10; i++) {
    //     document.getElementById(`pop${i}`).textContent = `${nationInfo[i].population}`;
    // }
        // Event listener for switch button
    //     console.log(dataLoaded);
    // if(dataLoaded === true){
    //     for (let i = 1; i <= 10; i++) {
    //         document.getElementById(`population${i}`).textContent = `${nationInfo[i].population.toLocaleString()}`      
    //     }    
    // }
        
    document.getElementById('district-btn').addEventListener('click', switchToDistrict);
    document.getElementById('province-btn').addEventListener('click', switchToProvince);
    document.getElementById('country-btn').addEventListener('click', switchToCountry);

    document.querySelectorAll('.btn').forEach(btnClick => {
        btnClick.addEventListener('click', () => {
            document.querySelector('.clickedBtn')?.classList.remove('clickedBtn');
            btnClick.classList.add('clickedBtn');
        });
    });

    document.querySelectorAll("[id^='nation']").forEach(span => {
        span.addEventListener("input", function() {
            const nationId = this.id.match(/\d+/)[0]; // Extract nation ID from element's ID
            const newName = this.textContent.trim();  // Get the new name
            
            updateNationName(nationId, newName);
        });
    });    

    document.getElementById('dist-bound-btn').addEventListener('click', distBoundaries);
    document.getElementById('prov-bound-btn').addEventListener('click', provBoundaries);
    document.getElementById('count-bound-btn').addEventListener('click', countBoundaries);
    document.getElementById('largest-btn').addEventListener('click', largestBoundaries);
    document.getElementById('religion-btn').addEventListener('click', religionBoundaries);

    document.getElementById('draw-btn').addEventListener('click', switchToDraw);
    document.getElementById('erase-btn').addEventListener('click', switchToErase);
});
