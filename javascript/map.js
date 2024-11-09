// async function initializeMap() {
//     await initializeSelection(); // Wait for regionSelection to be set


/* ****** VARIABLES ******* */

let selectedNation = 1; // To store which nation is selected
let nationBool = true;
let nationNames = {1: "Nation 1", 2: "Nation 2", 3: "Nation 3", 4: "Nation 4", 5: "Nation 5", 6: "Nation 6", 7: "Nation 7", 8: "Nation 8", 9: "Nation 9", 10: "Nation 10", 11: "Nation 11", 12: "Nation 12", 13: "Nation 13", 14: "Nation 14", 15: "Nation 15", 16: "Nation 16", 17: "Nation 17", 18: "Nation 18", 19: "Nation 19", 20: "Nation 20"};
let nationColors = { 1: '#ff0000', 2: '#0091ff', 3: '#00ff26',  4: '#ea00ff',  5: '#ffe600',  6: '#0040ff',  7: '#00ffaa',  8: '#7b00ff',  9: '#ff8c00',  10: '#5d9300',  11: '#722a2a',  12: '#b980ff',  13: '#ff64b2',  14: '#64faff',  15: '#735b23',  16: '#950133',  17: '#417550',  18: '#5291ff',  19: '#fa3b06',  20: '#160d3f'}; // Define colors for each nation
let nationAssignments = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [], 12: [], 13: [], 14: [], 15: [], 16: [], 17: [], 18: [], 19: [], 20: []}; // To track which features are assigned to which nation
let nationBase = {};
let tempNationAssignments;
let districtObjects = [];
let nationInfo = {};   // Holds the nation info for each of the keys
let ethnicData = [];
let religionData = [];
let dataType;
let ethBool = true;
let shiftKeyPressed = false; // Track if the Shift key is pressed
let ctrlKeyPressed = false; // Track if the Control key is pressed
let provinceGroups = {}; // To store districts grouped by province
let countryGroups = {}; // To store districts grouped by province
let provincePopulations = {}; // To store district population after grouping
let countryPopulations = {}; // To store district population after grouping
let tempDrawMode = 'draw';
let drawMode = 'draw';
let mode = 'district';
let densityLayer = null;  
let densOpacityLayer = null; 
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
let densityBool = null;
let largeBool = null;
let religionBool = null;
let opacityValue = 0.5;
let mapOpacityValue = 0.7;


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
            weight: 0.7,
            fillOpacity: mapOpacityValue,
            opacity: mapOpacityValue
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
    for (let i = 1; i <= 20; i++) {
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
    updateTable();
}

function districtSub(featureId) {
    let previousNation = null;

    // Find which nation the feature currently belongs to, if any
    for (let i = 1; i <= 20; i++) {
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
    updateTable();
}

function updateTable() {
    for (let i = 1; i <= 20; i++) {
        let density = Math.round(`${nationInfo[i].Population/nationInfo[i].Area}` *10)/10;
        if(isNaN(density)) {
            density = 0;
        }
        document.getElementById(`population${i}`).textContent = `${nationInfo[i].Population.toLocaleString()}`;
        document.getElementById(`area${i}`).textContent = `${nationInfo[i].Area.toLocaleString()}`;
        document.getElementById(`density${i}`).textContent = (density).toLocaleString();

        let header;
        let percentEth = 0;
        let largestEth = "-";
        let percentRel = 0;
        let largestRel = "-";
        ethnicData.forEach(col => {
            if(col === "ethnicity" || col === "religion") {
                header = col;
            }
            if(header === "ethnicity"){
                if(nationInfo[i][col] > percentEth){
                    percentEth = nationInfo[i][col];
                    largestEth = col;
                }
            }
            if(header === "religion"){
                if(nationInfo[i][col] > percentRel){
                    percentRel = nationInfo[i][col];
                    largestRel = col;
                }
            }
        });
        document.getElementById(`group${i}`).textContent = largestEth;
        document.getElementById(`relGroup${i}`).textContent = largestRel;
        ethPercent = Math.round(percentEth/`${nationInfo[i].Population}`*1000)/10;
        relPercent = Math.round(percentRel/`${nationInfo[i].Population}`*1000)/10;
        if(isNaN(ethPercent)) {
            ethPercent = 0;
        }
        if(isNaN(relPercent)) {
            relPercent = 0;
        }
        document.getElementById(`percent${i}`).textContent = `${ethPercent}%`;
        document.getElementById(`relPercent${i}`).textContent = `${relPercent}%`;
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
        drawBoundaries(`data/${regionSelection}/districtBoundaries.geojson`, districtBoundariesLayer, 'district');  // Load if it doesn't exist
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
        drawBoundaries(`data/${regionSelection}/provinceBoundaries.geojson`, provinceBoundariesLayer, 'province');  // Load if it doesn't exist
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
        drawBoundaries(`data/${regionSelection}/countryBoundaries.geojson`, countryBoundariesLayer, 'country');  // Load if it doesn't exist
    }
}

function drawBoundaries(dataLocation, boundariesLayer, boundaryType) {
    fetch(dataLocation)
    .then(response => response.json())
    .then(data => {
        // Create a new GeoJSON layer and store it in the variable
        if (boundaryType === 'district') {
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
            }).addTo(map);
            districtBoundariesLayer = boundariesLayer;
            districtBoundariesLayer.bringToFront();
        } else if (boundaryType === 'province') {
            boundariesLayer = L.geoJSON(data, {
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
            provinceBoundariesLayer = boundariesLayer;
            provinceBoundariesLayer.bringToFront();
        } else if (boundaryType === 'country') {
            boundariesLayer = L.geoJSON(data, {
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
            console.log("layer", boundariesLayer);
            countryBoundariesLayer = boundariesLayer;
            countryBoundariesLayer.bringToFront();
        }
    }) 
    console.log("ay", boundariesLayer);
}

function drawDensityLayers(dataLocation, boundariesLayer, opLayer) {
    fetch(dataLocation)
    .then(response => response.json())
    .then(data => {
        boundariesLayer = L.geoJSON(data, {
            pane: 'layers',
            style: function (feature) {
                let density = feature.properties["Population"]/(feature.properties["Area"]/1000000);
                // let color = density > 10000 ? '#ffed64' : (density > 8000 ? '#ffe100' : (density > 6000 ? '#ffa600' : (density > 4000 ? '#ff6f00' : (density > 2000 ? '#d45c00' : (density > 1500 ? '#c000d1' : (density > 1000 ? '#d40000' : (density > 750 ? '#c80078' : (density > 500 ? '#9600cd' : (density > 200 ? '#4e00cd' : (density > 100 ? '#6200ff' : (density > 75 ? '#6e14ff' : (density > 50 ? '#852dff' : (density > 40 ? '#6542fe' : (density > 30 ? '#8569ff' : (density > 20 ? '#8696ff' : (density > 10 ? '#dbc1ff' : '#ffffff')))))))))))))))); 
                let color = density > 10000 ? '#fff81f' : (density > 8000 ? '#ffe21b' : (density > 6000 ? '#ffcd36' : (density > 4000 ? '#ffb945' : (density > 2000 ? '#ffa547' : (density > 1500 ? '#ff8e45' :(density > 1000 ? '#ff7b4e' : (density > 750 ? '#f96957' : (density > 500 ? '#ec585e' : (density > 200 ? '#dd4a65' : (density > 100 ? '#cb3f69' : (density > 75 ? '#b8366c' : (density > 50 ? '#a32f6e' : (density > 40 ? '#8d2b6d' : (density > 30 ? '#77276a' : (density > 20 ? '#602465' : (density > 10 ? '#4a215d' : '#341d54')))))))))))))))); 

                return {
                    color: color,
                    weight: 1,
                    opacity: opacityValue,
                    fillColor: color,  // Pass the Largest_Group to largestColors
                    fillOpacity: opacityValue,
                    interactive: false
                };
            }
        }).addTo(map);  // Add to map
        //Store the newly created layer in the global variable
        densityLayer = boundariesLayer;
    })     
}

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
                    opacity: opacityValue || 0.5,
                    fillColor: largestColors(feature.properties["Largest Group"]),  // Pass the Largest_Group to largestColors
                    fillOpacity: opacityValue || 0.5,
                    interactive: false
                };
            }
        }).addTo(map);  // Add to map
        console.log("dsf", opacityValue);

        opLayer = L.geoJSON(data, {
            pane: 'layers',
            style: function (feature) {
                return {
                    color: "#01002e",
                    weight: 0.7,
                    opacity: largestOpacity(feature.properties["Percent of Population"]),
                    fillColor: opacityColor(feature.properties["Percent of Population"]),
                    fillOpacity: largestOpacity(feature.properties["Percent of Population"]),
                    interactive: false
                };
            }
        }).addTo(map);  // Add to map
        //Store the newly created layer in the global variable
        largestLayer = boundariesLayer;
        opacityLayer = opLayer;
    })     
}

function drawReligionLayers(dataLocation, boundariesLayer, opLayer) {
    fetch(dataLocation)
    .then(response => response.json())
    .then(data => {
        boundariesLayer = L.geoJSON(data, {
            style: function (feature) {
                return {
                    color: religionColors(feature.properties["Largest Religion"]),
                    weight: 1,
                    opacity: opacityValue || 0.5,
                    fillColor: religionColors(feature.properties["Largest Religion"]),  // Pass the Largest_Group to religionColors
                    fillOpacity: opacityValue || 0.5,
                    interactive: false
                };
            }
        }).addTo(map);  // Add to map
        console.log("obcbp", opacityValue);
        opLayer = L.geoJSON(data, {
            style: function (feature) {
                return {
                    color: "#01002e",
                    weight: 0.7,
                    opacity: largestOpacity(feature.properties["Share of Population"]),
                    fillColor: opacityColor(feature.properties["Share of Population"]),
                    fillOpacity: largestOpacity(feature.properties["Share of Population"]),
                    interactive: false
                };
            }
        }).addTo(map);  // Add to map
        //Store the newly created layer in the global variable
        religionLayer = boundariesLayer;
        relOpacityLayer = opLayer;
    })     
}

function densityBoundaries() {
    toggleLayerBoundaries();
    densityBool = true;
    document.getElementById('density-btn').classList.add('clickedBtn');  // Add the class to the clicked button
    if (densityLayer) {
        map.addLayer(densityLayer);  // Add the layer if it's not already on the 
        densityLayer.eachLayer(layer => {
            layer.setStyle({ fillOpacity: opacityValue,
                opacity: opacityValue });
        });
    } else {
        drawDensityLayers(`data/${regionSelection}/districtBoundaries.geojson`, densityLayer, densOpacityLayer);  // Load if it doesn't exist
    }
}

function largestBoundaries() {
    toggleLayerBoundaries();
    largeBool = true;
    document.getElementById('largest-btn').classList.add('clickedBtn');  // Add the class to the clicked button
    if (largestLayer) {
        map.addLayer(largestLayer);  // Add the layer if it's not already on the map
        map.addLayer(opacityLayer);  // Add the layer if it's not already on the map
        largestLayer.eachLayer(layer => {
            layer.setStyle({ fillOpacity: opacityValue,
                opacity: opacityValue });
        });
        opacityLayer.eachLayer(layer => {
            let initialOpacity = layer.feature.properties["Percent of Population"];
            layer.setStyle({ 
                fillOpacity: largestOpacity(initialOpacity) * 2 * opacityValue,
                opacity: largestOpacity(initialOpacity) * 2 * opacityValue // Example of adjusting border opacity
            });
        });
    } else {
        drawLargestLayers(`data/${regionSelection}/districtBoundaries.geojson`, largestLayer, opacityLayer);  // Load if it doesn't exist
    }
}

function religionBoundaries() {
    toggleLayerBoundaries();
    religionBool = true;
    document.getElementById('religion-btn').classList.add('clickedBtn');  // Add the class to the clicked button
    if (religionLayer) {
        map.addLayer(religionLayer);  // Add the layer if it's not already on the map
        map.addLayer(relOpacityLayer);  // Add the layer if it's not already on the map
        religionLayer.eachLayer(layer => {
            layer.setStyle({ fillOpacity: opacityValue,
                opacity: opacityValue });
        });
        relOpacityLayer.eachLayer(layer => {
            let initialOpacity = layer.feature.properties["Share of Population"];
            layer.setStyle({ 
                fillOpacity: largestOpacity(initialOpacity) * 2 * opacityValue,
                opacity: largestOpacity(initialOpacity) * 2 * opacityValue // Example of adjusting border opacity
            });
        });
    } else {
        drawReligionLayers(`data/${regionSelection}/districtBoundaries.geojson`, religionLayer, relOpacityLayer);  // Load if it doesn't exist
    }
}


function opacityColor(largestOp) {
    if (largestOp > .6) {
        return 'black';
    } else {
        return 'white';
    }
}
function largestOpacity(largestOp) {
    if (largestOp > .6) {
        return (largestOp - 0.6);
    } else {
        return (0.6 - largestOp);
    }
}

function toggleBoundaries(boundariesLayer, boundBool) {
    if (boundBool === true) {
        map.removeLayer(boundariesLayer);  // Remove the layer if it exists
    } else {
        map.addLayer(boundariesLayer);  // Add the layer if it's not already on the map
    }
    
}

function toggleLayerBoundaries() {
    if(densityBool === true){
        densityBool = false;
        document.getElementById('density-btn').classList.remove('clickedBtn');  // Add the class to the clicked button
        map.removeLayer(densityLayer);  // Remove the layer if it exists
    }
    if(largeBool === true){
        largeBool = false;
        document.getElementById('largest-btn').classList.remove('clickedBtn');  // Add the class to the clicked button
        map.removeLayer(largestLayer);  // Remove the layer if it exists
        map.removeLayer(opacityLayer);  // Remove the layer if it exists
    }
    if(religionBool === true){
        religionBool = false;
        document.getElementById('religion-btn').classList.remove('clickedBtn');  // Add the class to the clicked button
        map.removeLayer(religionLayer);  // Remove the layer if it exists
        map.removeLayer(relOpacityLayer);  // Remove the layer if it exists
    }
}



function handleFeatureClick(layer, feature) {
    if (mode === 'district') {
        applyDistrictChange(layer, feature);
    } else if (mode === 'province') {
        applyGroupChange(provinceGroups[feature.properties.Province], feature.properties.Province);
    } else if (mode === 'country') {
        applyGroupChange(countryGroups[feature.properties.Country], feature.properties.Country);
    }
}

function applyDistrictChange(layer, feature) {
    // Apply style changes based on selected nation
    let featureId = feature.properties.ID;
    let selectedColor = drawMode === 'draw' ? nationColors[selectedNation] : null;
    districtAddOrSub(featureId, drawMode);

    layer.setStyle({
        color: selectedColor,
        fillColor: selectedColor,
        fillOpacity: selectedColor ? mapOpacityValue : 0,
        opacity: selectedColor ? mapOpacityValue * 1.2 : 0
    });
}

function applyGroupChange(groupLayer, groupId) {
    groupLayer.eachLayer(function (layer) {
        let featureId = layer.feature.properties.ID;
        let selectedColor = drawMode === 'draw' ? nationColors[selectedNation] : null;
        districtAddOrSub(featureId, drawMode);

        layer.setStyle({
            color: selectedColor,
            fillColor: selectedColor,
            fillOpacity: selectedColor ? 0.7 : 0,
            opacity: selectedColor ? 1 : 0
        });
    });
}

function districtAddOrSub(featureId, mode) {
    if (mode === 'draw') {
        districtAdd(selectedNation, featureId);
    } else if (mode === 'erase') {
        districtSub(featureId);
    }
    // mode = x;
}





initializeSelection();


/* ****** MAP ******* */


function mainLoadData(saveArray) {
    // console.log('In it:', saveArray);

    if(regionSelection === "southeastEurope"){
        map.flyTo([41.7403, 24.0206], 6);
    } else if (regionSelection === "westAsia") {
        map.flyTo([27.9763, 42.9730], 5);
    } else if (regionSelection === "russia") {
        map.flyTo([66.1274, 109.8646], 3);
    } else if (regionSelection === "centralAsia") {
        map.flyTo([41.5744, 64.1833], 4.5);
    }
    // Fetch and add GeoJSON data to the map
    fetch(`data/${regionSelection}/districtBoundaries.geojson`) // Ensure this path is correct
        .then(response => response.json())
        .then(data => {

            L.geoJSON(data, {
                pane: 'nations',
                style: function(feature) {
                    return {
                        color: nationColors[selectedNation],
                        weight: 0.5,
                        fillColor: nationColors[selectedNation],
                        fillOpacity: 0,
                        opacity: 0
                    };
                },

                onEachFeature: function(feature, layer) {

                    let provinceId = feature.properties.Province;
                    let countryId = feature.properties.Country;
    
                    // Add district to province and country groups
                    if (!provinceGroups[provinceId]) provinceGroups[provinceId] = L.layerGroup();
                    provinceGroups[provinceId].addLayer(layer);
    
                    if (!countryGroups[countryId]) countryGroups[countryId] = L.layerGroup();
                    countryGroups[countryId].addLayer(layer);
    
                    // Store layer reference in featureLayers
                    featureLayers[feature.properties.ID] = layer;

                    // Find the matching object from districtObjects based on feature.properties.ID
                    districtObjects.find(obj => obj.ID.trim() === feature.properties.ID.trim());
        

                    if(saveArray != null){

                        // Clear all existing layers on the map before reloading
                        map.eachLayer(function (layer) {
                            if (layer instanceof L.GeoJSON) {
                                map.removeLayer(layer);
                            }
                        });    

                        for (let i = 1; i <= 20; i++) { // Go through each nation
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

                        for (let i = 1; i <= 20; i++) { // Go through each nation
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
                    });

                    // Handle mouseover to display feature info
                    // Handle mouseover event, also with Shift key for coloring
                    layer.on('mouseover', function() {
                        // Find the matching object from districtObjects based on feature.properties.ID
                        const curObj = districtObjects.find(obj => obj.ID.trim() === feature.properties.ID.trim());

                        if (shiftKeyPressed || ctrlKeyPressed) {
                            handleFeatureClick(layer, feature);
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
                                document.getElementById('twoGroup').style.background =  `linear-gradient(to right, #e1e1eb 0%, white 0%)`;
                            } else {
                                document.getElementById('twoGroup').textContent = `${curObj[curObj.twoGroup].toLocaleString()}`;
                                document.getElementById('twoGroup').style.background =  `linear-gradient(to right, #e1e1eb ${curObj[curObj.twoGroup]/curObj['Population'] * 100}%, white 0%)`;
                            }

                            document.getElementById('groupThree').textContent = `${curObj.threeGroup}`;
                            if(`${curObj.threeGroup}` === "."){
                                document.getElementById('threeGroup').textContent = ".";
                                document.getElementById('threeGroup').style.background =  `linear-gradient(to right, #e1e1eb 0%, white 0%)`;
                            } else {
                                document.getElementById('threeGroup').textContent = `${curObj[curObj.threeGroup].toLocaleString()}`;
                                document.getElementById('threeGroup').style.background =  `linear-gradient(to right, #e1e1eb ${curObj[curObj.threeGroup]/curObj['Population'] * 100}%, white 0%)`;
                            }

                            document.getElementById('groupFour').textContent = `${curObj.fourGroup}`;
                            if(`${curObj.fourGroup}` === "."){
                                document.getElementById('fourGroup').textContent = ".";
                                document.getElementById('fourGroup').style.background =  `linear-gradient(to right, #e1e1eb 0%, white 0%)`;
                            } else {
                                document.getElementById('fourGroup').textContent = `${curObj[curObj.fourGroup].toLocaleString()}`;
                                document.getElementById('fourGroup').style.background =  `linear-gradient(to right, #e1e1eb ${curObj[curObj.fourGroup]/curObj['Population'] * 100}%, white 0%)`;
                            }

                            document.getElementById('groupFive').textContent = `${curObj.fiveGroup}`;
                            if(`${curObj.fiveGroup}` === "."){
                                document.getElementById('fiveGroup').textContent = ".";
                                document.getElementById('fiveGroup').style.background =  `linear-gradient(to right, #e1e1eb 0%, white 0%)`;

                            } else {
                                document.getElementById('fiveGroup').textContent = `${curObj[curObj.fiveGroup].toLocaleString()}`;
                                document.getElementById('fiveGroup').style.background =  `linear-gradient(to right, #e1e1eb ${curObj[curObj.fiveGroup]/curObj['Population'] * 100}%, white 0%)`;
                            }

                            document.getElementById('groupSix').textContent = `${curObj.sixGroup}`;
                            if(`${curObj.sixGroup}` === "."){
                                document.getElementById('sixGroup').textContent = ".";
                                document.getElementById('sixGroup').style.background =  `linear-gradient(to right, #e1e1eb 0%, white 0%)`;

                            } else {
                                document.getElementById('sixGroup').textContent = `${curObj[curObj.sixGroup].toLocaleString()}`;
                                document.getElementById('sixGroup').style.background =  `linear-gradient(to right, #e1e1eb ${curObj[curObj.sixGroup]/curObj['Population'] * 100}%, white 0%)`;
                            }
                            
                            document.getElementById('groupSeven').textContent = `${curObj.sevenGroup}`;
                            if(`${curObj.sevenGroup}` === "."){
                                document.getElementById('sevenGroup').textContent = ".";
                                document.getElementById('sevenGroup').style.background =  `linear-gradient(to right, #e1e1eb 0%, white 0%)`;
                            } else {
                                document.getElementById('sevenGroup').textContent = `${curObj[curObj.sevenGroup].toLocaleString()}`;
                                document.getElementById('sevenGroup').style.background =  `linear-gradient(to right, #e1e1eb ${curObj[curObj.sevenGroup]/curObj['Population'] * 100}%, white 0%)`;
                            }

                            document.getElementById('groupEight').textContent = `${curObj.eightGroup}`;
                            if(`${curObj.eightGroup}` === "."){
                                document.getElementById('eightGroup').textContent = ".";
                                document.getElementById('eightGroup').style.background =  `linear-gradient(to right, #e1e1eb 0%, white 0%)`;
                            } else {
                                document.getElementById('eightGroup').textContent = `${curObj[curObj.eightGroup].toLocaleString()}`;
                                document.getElementById('eightGroup').style.background =  `linear-gradient(to right, #e1e1eb ${curObj[curObj.eightGroup]/curObj['Population'] * 100}%, white 0%)`;
                            }

                            document.getElementById('groupNine').textContent = `${curObj.nineGroup}`;
                            if(`${curObj.nineGroup}` === "."){
                                document.getElementById('nineGroup').textContent = ".";
                                document.getElementById('nineGroup').style.background =  `linear-gradient(to right, #e1e1eb 0%, white 0%)`;
                            } else {
                                document.getElementById('nineGroup').textContent = `${curObj[curObj.nineGroup].toLocaleString()}`;
                                document.getElementById('nineGroup').style.background =  `linear-gradient(to right, #e1e1eb ${curObj[curObj.nineGroup]/curObj['Population'] * 100}%, white 0%)`;
                            }nineGroup

                            document.getElementById('groupTen').textContent = `${curObj.tenGroup}`;
                            if(`${curObj.tenGroup}` === "."){
                                document.getElementById('tenGroup').textContent = ".";
                                document.getElementById('tenGroup').style.background =  `linear-gradient(to right, #e1e1eb 0%, white 0%)`;
                            } else {
                                document.getElementById('tenGroup').textContent = `${curObj[curObj.tenGroup].toLocaleString()}`;
                                document.getElementById('tenGroup').style.background =  `linear-gradient(to right, #e1e1eb ${curObj[curObj.tenGroup]/curObj['Population'] * 100}%, white 0%)`;
                            }

                            document.getElementById('religionOne').textContent = `${curObj.oneReligion}`;                        
                            if(`${curObj.oneReligion}` === "."){
                                document.getElementById('oneReligion').textContent = ".";
                                document.getElementById('oneReligion').style.background =  `linear-gradient(to right, #e1e1eb 0%, white 0%)`;
                            } else {
                                document.getElementById('oneReligion').textContent = `${curObj[curObj.oneReligion].toLocaleString()}`;
                                document.getElementById('oneReligion').style.background =  `linear-gradient(to right, #e1e1eb ${curObj[curObj.oneReligion]/curObj['Population'] * 100}%, white 0%)`;
                            }

                            document.getElementById('religionTwo').textContent = `${curObj.twoReligion}`;                        
                            if(`${curObj.twoReligion}` === "."){
                                document.getElementById('twoReligion').textContent = ".";
                                document.getElementById('twoReligion').style.background =  `linear-gradient(to right, #e1e1eb 0%, white 0%)`;
                            } else {
                                document.getElementById('twoReligion').textContent = `${curObj[curObj.twoReligion].toLocaleString()}`;
                                document.getElementById('twoReligion').style.background =  `linear-gradient(to right, #e1e1eb ${curObj[curObj.twoReligion]/curObj['Population'] * 100}%, white 0%)`;
                            }

                            document.getElementById('religionThree').textContent = `${curObj.threeReligion}`;
                            if(`${curObj.threeReligion}` === "."){
                                document.getElementById('threeReligion').textContent = ".";
                                document.getElementById('threeReligion').style.background =  `linear-gradient(to right, #e1e1eb 0%, white 0%)`;
                            } else {
                                document.getElementById('threeReligion').textContent = `${curObj[curObj.threeReligion].toLocaleString()}`;
                                document.getElementById('threeReligion').style.background =  `linear-gradient(to right, #e1e1eb ${curObj[curObj.threeReligion]/curObj['Population'] * 100}%, white 0%)`;
                            }

                            document.getElementById('religionFour').textContent = `${curObj.fourReligion}`;
                            if(`${curObj.fourReligion}` === "."){
                                document.getElementById('fourReligion').textContent = ".";
                                document.getElementById('fourReligion').style.background =  `linear-gradient(to right, #e1e1eb 0%, white 0%)`;
                            } else {
                                document.getElementById('fourReligion').textContent = `${curObj[curObj.fourReligion].toLocaleString()}`;
                                document.getElementById('fourReligion').style.background =  `linear-gradient(to right, #e1e1eb ${curObj[curObj.fourReligion]/curObj['Population'] * 100}%, white 0%)`;
                            }

                            document.getElementById('religionFive').textContent = `${curObj.fiveReligion}`;
                            if(`${curObj.fiveReligion}` === "."){
                                document.getElementById('fiveReligion').textContent = ".";
                                document.getElementById('fiveReligion').style.background =  `linear-gradient(to right, #e1e1eb 0%, white 0%)`;

                            } else {
                                document.getElementById('fiveReligion').textContent = `${curObj[curObj.fiveReligion].toLocaleString()}`;
                                document.getElementById('fiveReligion').style.background =  `linear-gradient(to right, #e1e1eb ${curObj[curObj.fiveReligion]/curObj['Population'] * 100}%, white 0%)`;
                            }

                            document.getElementById('religionSix').textContent = `${curObj.sixReligion}`;
                            if(`${curObj.sixReligion}` === "."){
                                document.getElementById('sixReligion').textContent = ".";
                                document.getElementById('sixReligion').style.background =  `linear-gradient(to right, #e1e1eb 0%, white 0%)`;

                            } else {
                                document.getElementById('sixReligion').textContent = `${curObj[curObj.sixReligion].toLocaleString()}`;
                                document.getElementById('sixReligion').style.background =  `linear-gradient(to right, #e1e1eb ${curObj[curObj.sixReligion]/curObj['Population'] * 100}%, white 0%)`;
                            }
                            
                            document.getElementById('religionSeven').textContent = `${curObj.sevenReligion}`;
                            if(`${curObj.sevenReligion}` === "."){
                                document.getElementById('sevenReligion').textContent = ".";
                                document.getElementById('sevenReligion').style.background =  `linear-gradient(to right, #e1e1eb 0%, white 0%)`;
                            } else {
                                document.getElementById('sevenReligion').textContent = `${curObj[curObj.sevenReligion].toLocaleString()}`;
                                document.getElementById('sevenReligion').style.background =  `linear-gradient(to right, #e1e1eb ${curObj[curObj.sevenReligion]/curObj['Population'] * 100}%, white 0%)`;
                            }

                            document.getElementById('religionEight').textContent = `${curObj.eightReligion}`;
                            if(`${curObj.eightReligion}` === "."){
                                document.getElementById('eightReligion').textContent = ".";
                                document.getElementById('eightReligion').style.background =  `linear-gradient(to right, #e1e1eb 0%, white 0%)`;
                            } else {
                                document.getElementById('eightReligion').textContent = `${curObj[curObj.eightReligion].toLocaleString()}`;
                                document.getElementById('eightReligion').style.background =  `linear-gradient(to right, #e1e1eb ${curObj[curObj.eightReligion]/curObj['Population'] * 100}%, white 0%)`;
                            }

                            document.getElementById('religionNine').textContent = `${curObj.nineReligion}`;
                            if(`${curObj.nineReligion}` === "."){
                                document.getElementById('nineReligion').textContent = ".";
                                document.getElementById('nineReligion').style.background =  `linear-gradient(to right, #e1e1eb 0%, white 0%)`;
                            } else {
                                document.getElementById('nineReligion').textContent = `${curObj[curObj.nineReligion].toLocaleString()}`;
                                document.getElementById('nineReligion').style.background =  `linear-gradient(to right, #e1e1eb ${curObj[curObj.nineReligion]/curObj['Population'] * 100}%, white 0%)`;
                            }

                            document.getElementById('religionTen').textContent = `${curObj.tenReligion}`;
                            if(`${curObj.tenReligion}` === "."){
                                document.getElementById('tenReligion').textContent = ".";
                                document.getElementById('tenReligion').style.background =  `linear-gradient(to right, #e1e1eb 0%, white 0%)`;
                            } else {
                                document.getElementById('tenReligion').textContent = `${curObj[curObj.tenReligion].toLocaleString()}`;
                                document.getElementById('tenReligion').style.background =  `linear-gradient(to right, #e1e1eb ${curObj[curObj.tenReligion]/curObj['Population'] * 100}%, white 0%)`;
                            }

                        } else {
                            console.warn(`No matching data found for ID: ${feature.properties.ID}`);
                        }

                    });
                }

            }).addTo(map); 
            console.log("ehre",districtObjects)
            
            document.getElementById('district-btn').click(); 
            document.getElementById('draw-btn').click();  // Add the class to the clicked button

            document.getElementById('dist-bound-btn').click();          
            document.getElementById('nation1-btn').click();   
            document.getElementById('stat-btn').classList.add('clickedBtn');  // Add the class to the clicked button

            // document.getElementById('stat-btn').click(); // Used in data.js

        })
        .catch(error => {
            console.error('Error loading GeoJSON:', error); // Catch any errors
    });
}


// Initialize the map
var map = L.map('map', {
    scrollWheelZoom: false, // disable original zoom function
    smoothWheelZoom: true,  // enable smooth zoom 
    smoothSensitivity: 6,   // zoom speed. default is 1
    center: [34.5553, 69.2075], zoom: 3

});

// Add tile layers
var Esri_WorldTerrain = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: USGS, Esri, TANA, DeLorme, and NPS',
}).addTo(map);

var CartoDB_VoyagerOnlyLabels = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
}).addTo(map);


initializeSelection();

async function setupMap() {
    await initializeSelection();
    
fetch(`data/${regionSelection}/ethArray.json`)
    .then(response => response.json())  // Parse JSON response
    .then(data => {
        districtObjects = data;  // Set the data to districtObjects
        // You can now use districtObjects in your script
        let baseNation = districtObjects.find(obj => obj.ID === 'base');
        dataType = districtObjects.find(obj => obj.ID === 'dataType');
        const excludeKeys = ["OKTMO ID", "ID", "Data Year", "Country", "Province", "District", "Largest Group", "Percent of Population", "oneGroup", "twoGroup", "threeGroup", "fourGroup", "fiveGroup", "sixGroup", "sevenGroup", "eightGroup", "nineGroup", "tenGroup", "oneReligion", "twoReligion", "threeReligion", "fourReligion", "fiveReligion", "sixReligion", "sevenReligion", "eightReligion", "nineReligion", "tenReligion", "Largest Religion", "Share of Population"];

        nationBase = Object.keys(baseNation)
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


        nationInfo = { 1: {...nationBase}, 2: {...nationBase}, 3: {...nationBase}, 4: {...nationBase}, 5: {...nationBase}, 6: {...nationBase}, 7: {...nationBase}, 8: {...nationBase}, 9: {...nationBase}, 10: {...nationBase}, 11: {...nationBase}, 12: {...nationBase}, 13: {...nationBase}, 14: {...nationBase}, 15: {...nationBase}, 16: {...nationBase}, 17: {...nationBase}, 18: {...nationBase}, 19: {...nationBase}, 20: {...nationBase}};   // Holds the nation info for each of the keys
        console.log('nationInfo loaded:', nationInfo);
        console.log('ethnicData loaded:', ethnicData);
    })
    .catch(error => console.error('Error loading JSON:', error));
    mainLoadData(null);
}

setupMap();

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
        drawMode = 'draw';
        document.getElementById('draw-btn').click();
        shiftKeyPressed = true;
    }
    if (event.key === 'Control') {
        drawMode = 'erase';
        document.getElementById('erase-btn').click();
        ctrlKeyPressed = true;
    }
});

document.addEventListener('keyup', function(event) {
    if (event.key === 'Shift') {
        shiftKeyPressed = false;
    }
    if (event.key === 'Control') {
        ctrlKeyPressed = false;
    }

});



    /* ****** EVENT ******* */

for (let i = 1; i <= 20; i++) {
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
updateButtonColor(11);
updateButtonColor(12);
updateButtonColor(13);
updateButtonColor(14);
updateButtonColor(15);
updateButtonColor(16);
updateButtonColor(17);
updateButtonColor(18);
updateButtonColor(19);
updateButtonColor(20);


document.addEventListener('DOMContentLoaded', function() {


    // for (let i = 1; i <= 20; i++) {
    //     document.getElementById(`pop${i}`).textContent = `${nationInfo[i].population}`;
    // }
        // Event listener for switch button
    //     console.log(dataLoaded);
    // if(dataLoaded === true){
    //     for (let i = 1; i <= 20; i++) {
    //         document.getElementById(`population${i}`).textContent = `${nationInfo[i].population.toLocaleString()}`      
    //     }    
    // }

    // for (let i = 1; i <= 20; i++) {
    //     document.getElementById(`area${i}`).textContent = `${Math.round((nationInfo[i].Area)/1000000).toLocaleString()}`
    // }    

    document.getElementById('mapOpacity').addEventListener('input', function () {
        mapOpacityValue = parseFloat(this.value)/100;

        for (let i = 1; i <= 20; i++) {
            nationAssignments[i].forEach(feature => {
                const featureId = feature.ID;
                featureLayers[featureId].setStyle({
                    fillOpacity: mapOpacityValue,
                    opacity: mapOpacityValue

                });
            });
        }
    })


    document.getElementById('layerOpacity').addEventListener('input', function () {
        opacityValue = parseFloat(this.value)/100;
    
        // Update fillOpacity for each feature in densityLayer
        if(densityBool === true) {
            densityLayer.eachLayer(layer => {
                layer.setStyle({ fillOpacity: opacityValue,
                    opacity: opacityValue });
            });    
        }
        if(largeBool === true) {
            largestLayer.eachLayer(layer => {
                layer.setStyle({ fillOpacity: opacityValue,
                    opacity: opacityValue });
            });
            opacityLayer.eachLayer(layer => {
                let initialOpacity = layer.feature.properties["Percent of Population"];
                layer.setStyle({ 
                    fillOpacity: largestOpacity(initialOpacity) * 2 * opacityValue,
                    opacity: largestOpacity(initialOpacity) * 2 * opacityValue // Example of adjusting border opacity
                    });
            });
        }
        if(religionBool === true) {
            religionLayer.eachLayer(layer => {
                layer.setStyle({ fillOpacity: opacityValue,
                    opacity: opacityValue });
            });
            relOpacityLayer.eachLayer(layer => {
                let initialOpacity = layer.feature.properties["Share of Population"];
                layer.setStyle({ 
                    fillOpacity: largestOpacity(initialOpacity) * 2 * opacityValue,
                    opacity: largestOpacity(initialOpacity) * 2 * opacityValue // Example of adjusting border opacity
                    });
            })
        }
    
    });
    
        
    document.getElementById('district-btn').addEventListener('click', switchToDistrict);
    document.getElementById('province-btn').addEventListener('click', switchToProvince);
    document.getElementById('country-btn').addEventListener('click', switchToCountry);

    document.querySelectorAll('.btn').forEach(btnClick => {
        btnClick.addEventListener('click', () => {
            document.querySelector('.clickedBtn')?.classList.remove('clickedBtn');
            btnClick.classList.add('clickedBtn');
        });
    });


    // document.querySelectorAll('.btn3').forEach(btnClick => {
    //     btnClick.addEventListener('click', () => {
    //         document.querySelector('.clickedBtn')?.classList.remove('clickedBtn');
    //         btnClick.classList.add('clickedBtn');
    //     });
    // });

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
    document.getElementById('density-btn').addEventListener('click', densityBoundaries);
    document.getElementById('largest-btn').addEventListener('click', largestBoundaries);
    document.getElementById('religion-btn').addEventListener('click', religionBoundaries);


    document.getElementById('draw-btn').addEventListener('click', switchToDraw);
    document.getElementById('erase-btn').addEventListener('click', switchToErase);
});



