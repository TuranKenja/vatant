

/* ****** VARIABLES ******* */


let selectedNation = 1; // To store which nation is selected
let nationColors = { 1: '#ff0000', 2: '#0091ff', 3: '#00ff26',  4: '#ea00ff',  5: '#ffe600',  6: '#0040ff',  7: '#00ffaa',  8: '#7b00ff',  9: '#ff005d',  10: '#00d5ff'}; // Define colors for each nation
let nationAssignments = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: []}; // To track which features are assigned to which nation
let nationPopulations = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0};
let shiftKeyPressed = false; // Track if the Shift key is pressed
let provinceGroups = {}; // To store districts grouped by province
let provincePopulations = {}; // To store district population after grouping
let drawMode = 'draw';
let mode = 'district';
let largestLayer = null;  
let opacityLayer = null; 
let featureLayers = {}; // To store references to the GeoJSON layers by feature id
let districtBoundariesLayer = null;  // To hold the district boundaries layer
let provinceBoundariesLayer = null;  // To hold the province boundaries layer
let countryBoundariesLayer = null;  // To hold the country boundaries layer
let distBool = true;
let provBool = true;
let countBool = true;
let largeBool = true;
const districtKeys = [];   // Holds the keys of the object
const nationInfo = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: []};   // Holds the nation info for each of the keys



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
            fillOpacity: 0.7,
            opacity: 1
        });
    });
}

function districtAdd(selectedNation, featurePop, featureId) {
    let previousNation = null;

    // Find which nation the feature currently belongs to, if any
    for (let i = 1; i <= 10; i++) {
        const index = nationAssignments[i].findIndex(obj => obj.ID === featureId);
        if (index !== -1) {  
            previousNation = i;
            break;
        }
    }

    // If the feature was previously assigned to a nation, deduct its population from that nation
    if (previousNation !== null) {
        nationPopulations[previousNation] -= featurePop;
        document.getElementById(`pop${previousNation}`).textContent = nationPopulations[previousNation].toLocaleString();
        
        // Remove the feature from the previous nation's assignment
        const index = nationAssignments[previousNation].findIndex(obj => obj.ID === featureId);
        if (index !== -1) {
            nationAssignments[previousNation].splice(index, 1);  // Remove feature from the array
        }
    }

    // Add the feature to the new nation and update its population
    nationPopulations[selectedNation] += featurePop;
    // Find the feature's object in districtObjects using featureId
    const featureObject = districtObjects.find(obj => obj.ID === featureId);
    if (featureObject) {
        nationAssignments[selectedNation].push(featureObject);  // Add the full object
    }
    document.getElementById(`pop${selectedNation}`).textContent = nationPopulations[selectedNation].toLocaleString();
}

function districtSub(selectedNation, featurePop, featureId) {
    let previousNation = null;

    // Find which nation the feature currently belongs to, if any
    for (let i = 1; i <= 10; i++) {
        const index = nationAssignments[i].findIndex(obj => obj.ID === featureId);
        if (index !== -1) {  
            previousNation = i;
            break;
        }
    }

    // If the feature was previously assigned to a nation, deduct its population from that nation
    if (previousNation !== null) {
        nationPopulations[previousNation] -= featurePop;
        document.getElementById(`pop${previousNation}`).textContent = nationPopulations[previousNation].toLocaleString();
        
        // Remove the feature from the previous nation's assignment
        const index = nationAssignments[previousNation].findIndex(obj => obj.ID === featureId);
        if (index !== -1) {
            nationAssignments[previousNation].splice(index, 1);  // Remove feature from the array
        }
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
        drawLargestLayers('data/balkans1.geojson', largestLayer, opacityLayer, 'largest');  // Load if it doesn't exist
    }
    largestLayers.bringToFront();
    opacityLayers.bringToFront();
    featureLayers.bringToFront();
    countryBoundariesLayer.bringToFront();
    provinceBoundariesLayer.bringToFront();
    districtBoundariesLayer.bringToFront();
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

// Largest Group Layer
function drawLargestLayers(dataLocation, boundariesLayer, opLayer, boundaryType) {
    fetch(dataLocation)
    .then(response => response.json())
    .then(data => {
        boundariesLayer = L.geoJSON(data, {
            pane: 'layers',
            style: function (feature) {
                return {
                    color: largestColors(feature.properties["T_Balkans_eth$_.Largest_Group"]),
                    weight: 1,
                    opacity: 0.5,
                    fillColor: largestColors(feature.properties["T_Balkans_eth$_.Largest_Group"]),  // Pass the Largest_Group to largestColors
                    fillOpacity: 0.5,
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
                    opacity: largestOpacity(feature.properties["T_Balkans_eth$_.Largest__"], 0),
                    fillColor: largestOpacity(feature.properties["T_Balkans_eth$_.Largest__"], 1),
                    fillOpacity: largestOpacity(feature.properties["T_Balkans_eth$_.Largest__"], 0),
                    interactive: false
                };
            }
        }).addTo(map);  // Add to map
        //Store the newly created layer in the global variable
        largestLayer = boundariesLayer;
        opacityLayer = opLayer;
    })     
}
function largestColors(largestCol) {
    if(largestCol === "Albanians"){
        return '#2f4f4f';
    } else if (largestCol === "Bosniaks") {
        return '#6b8e23';
    } else if (largestCol === "Bulgarians") {
        return '#ffa500';
    } else if (largestCol === "Croats") {
        return '#1e90ff';
    } else if (largestCol === "Czechs") {
        return '#00ff00';
    } else if (largestCol === "Greeks") {
        return '#0000ff';
    } else if (largestCol === "Hungarians") {
        return '#000080';
    } else if (largestCol === "Macedonians") {
        return '#a0522d';
    } else if (largestCol === "Montenegrins") {
        return '#ff00ff';
    } else if (largestCol === "Roma") {
        return '#ffe4c4';
    } else if (largestCol === "Serbs") {
        return '#c71585';
    } else if (largestCol === "Slovaks") {
        return '#00fa9a';
    } else if (largestCol === "Turks") {
        return '#ff0000';
    }
}
function largestOpacity(largestOp, colorOp) {
    if (colorOp === 1){
        if (largestOp > .50) {
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
            let featurePop = feature.properties.population; // Get population of the feature
            let featureId = feature.properties.ID; // Get the feature's ID
    
            // Assign the feature to the selected nation and update population
            if (drawMode === 'draw') {
                districtAdd(selectedNation, featurePop, featureId);    
            } else if (drawMode === 'erase'){
                districtSub(selectedNation, featurePop, featureId);
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
        let featureProv = feature.properties.province;
        if (selectedNation !== null && provinceGroups[featureProv]) {                    
            provinceGroups[featureProv].forEach(districtFeature => {
                let districtLayer = featureLayers[districtFeature.properties.ID]; // Get the layer for each district in the province
                let featureId = districtFeature.properties.ID; // Get the feature's ID
                let featurePop = districtFeature.properties.population; // Get the population of the district
    
                if (districtLayer) { // Ensure the layer exists
                    if (drawMode === 'draw') {
                        districtAdd(selectedNation, featurePop, featureId);    
                    } else if (drawMode === 'erase'){
                        districtSub(selectedNation, featurePop, featureId);
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
        let featurePop = feature.properties.population; // Get population of the feature

        if (selectedNation !== null) {                    
            // Assign the feature to the selected nation and update population
            if (drawMode === 'draw') {
                districtAdd(selectedNation, featurePop, featureId);    
            } else if (drawMode === 'erase'){
                districtSub(selectedNation, featurePop, featureId);
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
        let featureProv = feature.properties.province;
        if (selectedNation !== null && provinceGroups[featureProv]) {                    
            provinceGroups[featureProv].forEach(districtFeature => {
                let districtLayer = featureLayers[districtFeature.properties.ID]; // Get the layer for each district in the province
                let featureId = districtFeature.properties.ID; // Get the feature's ID
                let featurePop = districtFeature.properties.population; // Get the population of the district
    
                if (districtLayer) { // Ensure the layer exists
                    if (drawMode === 'draw') {
                        districtAdd(selectedNation, featurePop, featureId);    
                    } else if (drawMode === 'erase'){
                        districtSub(selectedNation, featurePop, featureId);
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


// Fetch and add GeoJSON data to the map
fetch('data/balkans.geojson') // Ensure this path is correct
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

                // Find the matching object from districtObjects based on feature.properties.ID
                districtObjects.find(obj => obj.ID.trim() === feature.properties.ID.trim());

                layer.on('click', function() {
                    handleFeatureClick(layer, feature);
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
                        document.getElementById('district').textContent = `${curObj.district}`;
                        document.getElementById('province').textContent = `${curObj.province}`;
                        document.getElementById('country').textContent = `${curObj.country}`;
                        document.getElementById('distID').textContent = `${curObj.ID}`;
                        document.getElementById('population').textContent = `${curObj.population.toLocaleString()}`;
                        
                        
                        const color = largestColors(curObj.oneGroup);
                        document.getElementById('groupOne').textContent = `${curObj.oneGroup}`;
                        document.getElementById('oneGroup').textContent = `${curObj[curObj.oneGroup.toLowerCase()].toLocaleString()}`;
                        document.getElementById('oneGroup').style.background =  `linear-gradient(to right, #e1e1eb ${curObj[curObj.oneGroup.toLowerCase()]/curObj['population'] * 100}%, white 0%)`;
                        

                        document.getElementById('groupTwo').textContent = `${curObj.twoGroup}`;                        
                        if(`${curObj.twoGroup}` === "."){
                            document.getElementById('twoGroup').textContent = ".";
                        } else {
                            document.getElementById('twoGroup').textContent = `${curObj[curObj.twoGroup.toLowerCase()].toLocaleString()}`;
                            document.getElementById('twoGroup').style.background =  `linear-gradient(to right, #e1e1eb ${curObj[curObj.twoGroup.toLowerCase()]/curObj['population'] * 100}%, white 0%)`;
                        }


                        document.getElementById('groupThree').textContent = `${curObj.threeGroup}`;
                        if(`${curObj.threeGroup}` === "."){
                            document.getElementById('threeGroup').textContent = ".";
                        } else {
                            document.getElementById('threeGroup').textContent = `${curObj[curObj.threeGroup.toLowerCase()].toLocaleString()}`;
                            document.getElementById('threeGroup').style.background =  `linear-gradient(to right, #e1e1eb ${curObj[curObj.threeGroup.toLowerCase()]/curObj['population'] * 100}%, white 0%)`;
                        }


                        document.getElementById('groupFour').textContent = `${curObj.fourGroup}`;
                        if(`${curObj.fourGroup}` === "."){
                            document.getElementById('fourGroup').textContent = ".";
                        } else {
                            document.getElementById('fourGroup').textContent = `${curObj[curObj.fourGroup.toLowerCase()].toLocaleString()}`;
                            document.getElementById('fourGroup').style.background =  `linear-gradient(to right, #e1e1eb ${curObj[curObj.fourGroup.toLowerCase()]/curObj['population'] * 100}%, white 0%)`;
                        }


                        document.getElementById('groupFive').textContent = `${curObj.fiveGroup}`;
                        if(`${curObj.fiveGroup}` === "."){
                            document.getElementById('fiveGroup').textContent = ".";
                        } else {
                            document.getElementById('fiveGroup').textContent = `${curObj[curObj.fiveGroup.toLowerCase()].toLocaleString()}`;
                            document.getElementById('fiveGroup').style.background =  `linear-gradient(to right, #e1e1eb ${curObj[curObj.fiveGroup.toLowerCase()]/curObj['population'] * 100}%, white 0%)`;
                        }


                        document.getElementById('groupSix').textContent = `${curObj.sixGroup}`;
                        if(`${curObj.sixGroup}` === "."){
                            document.getElementById('sixGroup').textContent = ".";
                        } else {
                            document.getElementById('sixGroup').textContent = `${curObj[curObj.sixGroup.toLowerCase()].toLocaleString()}`;
                            document.getElementById('sixGroup').style.background =  `linear-gradient(to right, #e1e1eb ${curObj[curObj.sixGroup.toLowerCase()]/curObj['population'] * 100}%, white 0%)`;
                        }

                        
                        document.getElementById('groupSeven').textContent = `${curObj.sevenGroup}`;
                        if(`${curObj.sevenGroup}` === "."){
                            document.getElementById('sevenGroup').textContent = ".";
                        } else {
                            document.getElementById('sevenGroup').textContent = `${curObj[curObj.sevenGroup.toLowerCase()].toLocaleString()}`;
                            document.getElementById('sevenGroup').style.background =  `linear-gradient(to right, #e1e1eb ${curObj[curObj.sevenGroup.toLowerCase()]/curObj['population'] * 100}%, white 0%)`;
                        }

                        
                        document.getElementById('groupEight').textContent = `${curObj.eightGroup}`;
                        if(`${curObj.eightGroup}` === "."){
                            document.getElementById('eightGroup').textContent = ".";
                        } else {
                            document.getElementById('eightGroup').textContent = `${curObj[curObj.eightGroup.toLowerCase()].toLocaleString()}`;
                            document.getElementById('eightGroup').style.background =  `linear-gradient(to right, #e1e1eb ${curObj[curObj.eightGroup.toLowerCase()]/curObj['population'] * 100}%, white 0%)`;
                            
                        }

                    } else {
                        console.warn(`No matching data found for ID: ${feature.properties.ID}`);
                    }

                });
            }
        }).addTo(map);       

        Object.keys(nationInfo).forEach(oneNation => {
            nationInfo[oneNation] = Object.keys(districtObjects);
        });
        
        document.getElementById('district-btn').click(); 
        document.getElementById('draw-btn').click();  // Add the class to the clicked button

        document.getElementById('dist-bound-btn').click();          
        document.getElementById('nation1-btn').click();    
    })
    .catch(error => {
        console.error('Error loading GeoJSON:', error); // Catch any errors
});


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
    document.getElementById('largest-btn').addEventListener('click', largestBoundaries);

    document.getElementById('draw-btn').addEventListener('click', switchToDraw);
    document.getElementById('erase-btn').addEventListener('click', switchToErase);

});