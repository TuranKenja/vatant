

/* ****** VARIABLES ******* */

// let lock1, lock2, lock3, lock4, lock5, lock6, lock7, lock8, lock9, lock10, lock11, lock12, lock13, lock14, lock15, lock16, lock17, lock18, lock19, lock20, lock21, lock22, lock23, lock24, lock25, lock26, lock27, lock28, lock29, lock30, lock31, lock32, lock33, lock34, lock35, lock36, lock37, lock38, lock39, lock40 = false;
let evadeWarning = true;
let locks = { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false, 9: false, 10: false, 11: false, 12: false, 13: false, 14: false, 15: false, 16: false, 17: false, 18: false, 19: false, 20: false, 21: false, 22: false, 23: false, 24: false, 25: false, 26: false, 27: false, 28: false, 29: false, 30: false, 31: false, 32: false, 33: false, 34: false, 35: false, 36: false, 37: false, 38: false, 39: false, 40: false, 41: false, 42: false, 43: false, 44: false, 45: false, 46: false, 47: false, 48: false, 49: false, 50: false}; // To track which features are assigned to which nation
let successBool = true;
let selectedNation = 1; // To store which nation is selected
let nationBool = true;
let nationNames = {1: "Nation 1", 2: "Nation 2", 3: "Nation 3", 4: "Nation 4", 5: "Nation 5", 6: "Nation 6", 7: "Nation 7", 8: "Nation 8", 9: "Nation 9", 10: "Nation 10", 11: "Nation 11", 12: "Nation 12", 13: "Nation 13", 14: "Nation 14", 15: "Nation 15", 16: "Nation 16", 17: "Nation 17", 18: "Nation 18", 19: "Nation 19", 20: "Nation 20", 21: "Nation 21", 22: "Nation 22", 23: "Nation 23", 24: "Nation 24", 25: "Nation 25", 26: "Nation 26", 27: "Nation 27", 28: "Nation 28", 29: "Nation 29", 20: "Nation 20", 31: "Nation 31", 32: "Nation 32", 33: "Nation 33", 34: "Nation 34", 35: "Nation 35", 36: "Nation 36", 37: "Nation 37", 38: "Nation 38", 39: "Nation 39", 40: "Nation 40", 41: "Nation 41", 42: "Nation 42", 43: "Nation 43", 44: "Nation 44", 45: "Nation 45", 46: "Nation 46", 47: "Nation 47", 48: "Nation 48", 49: "Nation 49", 50: "Nation 50", 51: "Map 1"};
let nationColors = { 1: '#ff0000', 2: '#0091ff', 3: '#00ff26',  4: '#ea00ff',  5: '#ffe600',  6: '#0040ff',  7: '#00ffaa',  8: '#7b00ff',  9: '#ff8c00',  10: '#5d9300',  11: '#722a2a',  12: '#b980ff',  13: '#ff64b2',  14: '#64faff',  15: '#735b23',  16: '#950133',  17: '#417550',  18: '#5291ff',  19: '#fa3b06',  20: '#160d3f',  21: '#722a2a',  22: '#b980ff',  23: '#ff64b2',  24: '#64faff',  25: '#735b23',  26: '#950133',  27: '#417550',  28: '#5291ff',  29: '#fa3b06', 30: '#160d3f', 31: '#722a2a',  32: '#b980ff',  33: '#ff64b2',  34: '#64faff',  35: '#735b23',  36: '#950133',  37: '#417550',  38: '#5291ff',  39: '#fa3b06',  40: '#160d3f', 41: '#722a2a',  42: '#b980ff',  43: '#ff64b2',  44: '#64faff',  45: '#745b24',  46: '#950144',  47: '#417550',  48: '#5291ff',  49: '#fa4b06', 50: '#160d3f'}; // Define colors for each nation
let nationAssignments = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [], 12: [], 13: [], 14: [], 15: [], 16: [], 17: [], 18: [], 19: [], 20: [], 21: [], 22: [], 23: [], 24: [], 25: [], 26: [], 27: [], 28: [], 29: [], 30: [], 31: [], 32: [], 33: [], 34: [], 35: [], 36: [], 37: [], 38: [], 39: [], 40: [], 41: [], 42: [], 43: [], 44: [], 45: [], 46: [], 47: [], 48: [], 49: [], 50: [], names: [nationNames]}; // To track which features are assigned to which nation
let nationBase = {};
let tempNationAssignments;
let districtObjects = [];
let nationInfo = {};   // Holds the nation info for each of the keys
let allData = [];
let religionData = [];
let dataType;
let ethBool = true;
let shiftKeyPressed = false; // Track if the Shift key is pressed
let ctrlKeyPressed = false; // Track if the Control key is pressed
let altKeyPressed = false; // Track if the Control key is pressed
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
let ethAloneLayer = null;
let relAloneLayer = null;
let featureLayers = {}; // To store references to the GeoJSON layers by feature id
let districtBoundariesLayer = null;  // To hold the district boundaries layer
let provinceBoundariesLayer = null;  // To hold the province boundaries layer
let countryBoundariesLayer = null;  // To hold the country boundaries layer
let dataLoaded = false;
let saveBool = true;
let distBool = true;
let provBool = true;
let countryBool = true;
let densityBool = false;
let largeBool = false;
let religionBool = false;
let ethDropBool = false; 
let relDropBool = false; 
let opacityValue = 0.5;
let mapOpacityValue = 0.7;
let selectedEthnicity = null;
let selectedReligion = null;


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



function updateTable() {
    for (let i = 1; i <= 50; i++) {
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
        allData.forEach(col => {
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

function switchToBrowse() {
    drawMode = 'browse';
    document.getElementById('browse-btn').classList.add('clickedBtn');
    document.getElementById('draw-btn').classList.remove('clickedBtn');  // Remove the class
    document.getElementById('erase-btn').classList.remove('clickedBtn');  // Remove the class

}
function switchToDraw() {
    drawMode = 'draw';
    document.getElementById('draw-btn').classList.add('clickedBtn');
    document.getElementById('browse-btn').classList.remove('clickedBtn');  // Remove the class
    document.getElementById('erase-btn').classList.remove('clickedBtn');  // Remove the class

}

function switchToErase() {
    drawMode = 'erase';
    document.getElementById('erase-btn').classList.add('clickedBtn');
    document.getElementById('browse-btn').classList.remove('clickedBtn');  // Remove the class
    document.getElementById('draw-btn').classList.remove('clickedBtn');  // Remove the class

}

function switchToDistrict() {
    mode = 'district';
    document.getElementById('district-btn').classList.add('clickedBtn');
    document.getElementById('province-btn').classList.remove('clickedBtn');  // Remove the class
    document.getElementById('country-btn').classList.remove('clickedBtn');  // Remove the class
}

function switchToProvince() {
    mode = 'province';
    document.getElementById('province-btn').classList.add('clickedBtn');
    document.getElementById('district-btn').classList.remove('clickedBtn');  // Remove the class
    document.getElementById('country-btn').classList.remove('clickedBtn');  // Remove the class
}

function switchToCountry() {
    mode = 'country';
    document.getElementById('country-btn').classList.add('clickedBtn');
    document.getElementById('district-btn').classList.remove('clickedBtn');  // Remove the class
    document.getElementById('province-btn').classList.remove('clickedBtn');  // Remove the class
}

function distBoundaries() {
    distBool = !distBool;

    if (!distBool) {
        document.getElementById('dist-bound-btn').classList.add('clickedBtn');
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
        document.getElementById('prov-bound-btn').classList.add('clickedBtn');
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
        document.getElementById('count-bound-btn').classList.add('clickedBtn');
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
                        color: "#2e2550",
                        weight: 0.8,
                        opacity: 1,
                        fillColor: 'transparent',
                        fillOpacity: 0,
                        interactive: false
                    };
                },
                simplify: function (feature) {
                    tolerance: 0.1 // Adjust this value to reduce gaps (default is 1.0)
                }
            }).addTo(map);
            districtBoundariesLayer = boundariesLayer;
            districtBoundariesLayer.bringToFront();
        } else if (boundaryType === 'province') {
            boundariesLayer = L.geoJSON(data, {
                style: function (feature) {
                    return {
                        color: "#14005e",
                        weight: .8,
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
                        color: "#000327",
                        weight: .8,
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
}

function drawDensityLayers(dataLocation, boundariesLayer, opLayer) {
    fetch(dataLocation)
    .then(response => response.json())
    .then(data => {
        boundariesLayer = L.geoJSON(data, {
            pane: 'layers',
            style: function (feature) {
                let matchDistrict = districtObjects.find(obj => obj.ID.trim() === feature.properties.ID.trim());

                let density = matchDistrict["Population"]/(matchDistrict["Area"]);
                // let density = matchDistrict["Density"];
                // let color = density > 10000 ? '#ffed64' : (density > 8000 ? '#ffe100' : (density > 6000 ? '#ffa600' : (density > 4000 ? '#ff6f00' : (density > 2000 ? '#d45c00' : (density > 1500 ? '#c000d1' : (density > 1000 ? '#d40000' : (density > 750 ? '#c80078' : (density > 500 ? '#9600cd' : (density > 200 ? '#4e00cd' : (density > 100 ? '#6200ff' : (density > 75 ? '#6e14ff' : (density > 50 ? '#852dff' : (density > 40 ? '#6542fe' : (density > 30 ? '#8569ff' : (density > 20 ? '#8696ff' : (density > 10 ? '#dbc1ff' : '#ffffff')))))))))))))))); 
                let color = density > 14000 ? '#fffee2' : (density > 12000 ? '#fffb92' : (density > 10000 ? '#fff81f' : (density > 8000 ? '#ffe21b' : (density > 6000 ? '#ffcd36' : (density > 4000 ? '#ffb945' : (density > 2000 ? '#ffa547' : (density > 1500 ? '#ff8e45' :(density > 1000 ? '#ff7b4e' : (density > 750 ? '#f96957' : (density > 500 ? '#ec585e' : (density > 200 ? '#dd4a65' : (density > 100 ? '#cb3f69' : (density > 75 ? '#b8366c' : (density > 50 ? '#a32f6e' : (density > 40 ? '#8d2b6d' : (density > 30 ? '#77276a' : (density > 20 ? '#602465' : (density > 10 ? '#4a215d' : '#341d54')))))))))))))))))); 

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
                let matchDistrict = districtObjects.find(obj => obj.ID.trim() === feature.properties.ID.trim());

                // Use the largest group from the matched districtObject
                let largestGroup = matchDistrict["Largest Group"];

                return {
                    color: largestColors(largestGroup),
                    weight: 1,
                    opacity: opacityValue || 0.5,
                    fillColor: largestColors(largestGroup),  // Pass the Largest_Group to largestColors
                    fillOpacity: opacityValue || 0.5,
                    interactive: false
                };
            }
        }).addTo(map);  // Add to map
        opLayer = L.geoJSON(data, {
            pane: 'layers',
            style: function (feature) {
                let matchDistrict = districtObjects.find(obj => obj.ID.trim() === feature.properties.ID.trim());

                // Use the largest group from the matched districtObject
                let largestPercent = matchDistrict["Percent of Population"];

                return {
                    color: "#01002e",
                    weight: 0.7,
                    opacity: largestOpacity(largestPercent),
                    fillColor: opacityColor(largestPercent),
                    fillOpacity: largestOpacity(largestPercent),
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
                let matchDistrict = districtObjects.find(obj => obj.ID.trim() === feature.properties.ID.trim());

                // Use the largest group from the matched districtObject
                let largestReligion = matchDistrict["Largest Religion"];

                return {
                    color: religionColors(largestReligion),
                    weight: 1,
                    opacity: opacityValue || 0.5,
                    fillColor: religionColors(largestReligion),  // Pass the Largest_Group to religionColors
                    fillOpacity: opacityValue || 0.5,
                    interactive: false
                };
            }
        }).addTo(map);  // Add to map
        opLayer = L.geoJSON(data, {
            style: function (feature) {
                let matchDistrict = districtObjects.find(obj => obj.ID.trim() === feature.properties.ID.trim());

                // Use the largest group from the matched districtObject
                let religionPercent = matchDistrict["Share of Population"];

                return {
                    color: "#01002e",
                    weight: 0.7,
                    opacity: largestOpacity(religionPercent),
                    fillColor: opacityColor(religionPercent),
                    fillOpacity: largestOpacity(religionPercent),
                    interactive: false
                };
            }
        }).addTo(map);  // Add to map
        //Store the newly created layer in the global variable
        religionLayer = boundariesLayer;
        relOpacityLayer = opLayer;
    })     
}

function populateEthDropdown() {
    const ethDrop = document.getElementById("ethDrop");
    ethDrop.innerHTML = ""; // Clear existing content
    let stopper = 0;
    for (let key in nationBase) {
        if (nationBase.hasOwnProperty(key)) {
            if(key === 'religion') {
                stopper = 0;
            }
            if(stopper === 1) {
                const link = document.createElement("a");
                link.href = "#";    
                link.textContent = key;
                link.onclick = function() {
                    selectEthnicity = key; // Pass the key or any value you need for the function
                    ethAloneBoundaries();
                    // toggleLayerBoundaries();
                    // document.getElementsByClassName(selectEthnicity).classList.add('clickedBtn');
                    ethDrop.classList.remove("show");
                };    
                ethDrop.appendChild(link);
            }
            if(key === 'ethnicity') {
                stopper = 1;
            }
        }
    }
    ethDrop.classList.toggle("show");

    document.addEventListener('click', function(event) {
        if (!document.getElementById("ethnicDrop-btn").contains(event.target) &&
            !ethDrop.contains(event.target)) {
            ethDrop.classList.remove("show");
        }
    });
}

function ethAloneBoundaries() {
    toggleLayerBoundaries();
    ethDropBool = true;
    document.getElementById('ethnicDrop-btn').classList.add('clickedBtn');
    let dataLocation = `data/${regionSelection}/districtBoundaries.geojson`;

    fetch(dataLocation)
    .then(response => response.json())
    .then(data => {
        ethAloneLayer = L.geoJSON(data, {
            pane: 'layers',
            style: function (feature) {
                const curObj = districtObjects.find(obj => obj.ID.trim() === feature.properties.ID.trim());
                let ethnicCalc = (curObj[selectEthnicity]/curObj["Population"])*100;
                // let color = ethnicCalc > 95 ? '#ff0000' : (ethnicCalc > 90 ? '#fe3100' : (ethnicCalc > 85 ? '#fd4900' : (ethnicCalc > 80 ? '#fa5b00' : (ethnicCalc > 75 ? '#f66c00' : (ethnicCalc > 70 ? '#f17b00' : (ethnicCalc > 65 ? '#ea8a00' : (ethnicCalc > 60 ? '#e49700' : (ethnicCalc > 55 ? '#dda300' : (ethnicCalc > 50 ? '#d6ae00' : (ethnicCalc > 45 ? '#cdb900' : (ethnicCalc > 40 ? '#c5c400' : (ethnicCalc > 35 ? '#bbce00' : (ethnicCalc > 30 ? '#b0d800' : (ethnicCalc > 25 ? '#a3e200' : (ethnicCalc > 20 ? '#94ec00' : (ethnicCalc > 15 ? '#83f600' : '#6fff00')))))))))))))))); 
                // let color = ethnicCalc > 95 ? '#810000' : (ethnicCalc > 90 ? '#92241a' : (ethnicCalc > 85 ? '#a23c31' : (ethnicCalc > 80 ? '#b25247' : (ethnicCalc > 75 ? '#c1675f' : (ethnicCalc > 70 ? '#cf7d76' : (ethnicCalc > 65 ? '#dc938e' : (ethnicCalc > 60 ? '#e8a9a6' : (ethnicCalc > 55 ? '#f4bfbe' : (ethnicCalc > 50 ? '#ffd6d6' : (ethnicCalc > 45 ? '#d6ffd8' : (ethnicCalc > 40 ? '#bae9bc' : (ethnicCalc > 35 ? '#9ed4a0' : (ethnicCalc > 30 ? '#83bf84' : (ethnicCalc > 25 ? '#68aa69' : (ethnicCalc > 20 ? '#4c954f' : (ethnicCalc > 15 ? '#2f8135' : '#006d19')))))))))))))))); 
                let color = ethnicCalc > 99 ? '#9a0000' : (ethnicCalc > 95 ? '#d00000' : (ethnicCalc > 90 ? '#d9291c' : (ethnicCalc > 85 ? '#e13f32' : (ethnicCalc > 80 ? '#e85246' : (ethnicCalc > 75 ? '#ee6459' : (ethnicCalc > 70 ? '#f4756d' : (ethnicCalc > 65 ? '#f88580' : (ethnicCalc > 60 ? '#fb9692' : (ethnicCalc > 55 ? '#fea6a4' : (ethnicCalc > 50 ? '#ffb6b6' : (ethnicCalc > 45 ? '#b8ffc7' : (ethnicCalc > 40 ? '#abfbba' : (ethnicCalc > 35 ? '#9ef7ac' : (ethnicCalc > 30 ? '#92f39e' : (ethnicCalc > 25 ? '#86ef90' : (ethnicCalc > 20 ? '#79eb81' : (ethnicCalc > 15 ? '#6de671' : (ethnicCalc > 15 ? '#60e161' : (ethnicCalc > 10 ? '#54dd4f' : (ethnicCalc > 5 ? '#46d83b' : (ethnicCalc > 1 ? '#43d839' : '#30b826'))))))))))))))))))))); 
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
    })     
}

function populateRelDropdown() {
    const relDrop = document.getElementById("relDrop");
    relDrop.innerHTML = ""; // Clear existing content
    let stopper = 0;
    for (let key in nationBase) {
        if (nationBase.hasOwnProperty(key)) {
            // if(key === 'religion') {
            //     stopper = 0;
            // }
            console.log('d', key);
            if(stopper === 1) {
                const link = document.createElement("a");
                link.href = "#";    
                link.textContent = key;
                link.onclick = function() {
                    selectReligion = key; // Pass the key or any value you need for the function
                    relAloneBoundaries();
                    // toggleLayerBoundaries();
                    // document.getElementById('ethnicDrop-btn').classList.add('clickedBtn');
                    relDrop.classList.remove("show");
                };    
                relDrop.appendChild(link);
            }
            if(key === 'religion') {
                stopper = 1;
            }
        }
    }
    relDrop.classList.toggle("show");

    document.addEventListener('click', function(event) {
        if (!document.getElementById("religionDrop-btn").contains(event.target) &&
            !relDrop.contains(event.target)) {
            relDrop.classList.remove("show");
        }
    });
}

function relAloneBoundaries() {
    toggleLayerBoundaries();
    relDropBool = true;
    document.getElementById('religionDrop-btn').classList.add('clickedBtn');
    let dataLocation = `data/${regionSelection}/districtBoundaries.geojson`;

    fetch(dataLocation)
    .then(response => response.json())
    .then(data => {
        relAloneLayer = L.geoJSON(data, {
            pane: 'layers',
            style: function (feature) {
                const curObj = districtObjects.find(obj => obj.ID.trim() === feature.properties.ID.trim());
                let religionCalc = (curObj[selectReligion]/curObj["Population"])*100;

                // let color = religionCalc > 95 ? '#ff0000' : (religionCalc > 90 ? '#fe3100' : (religionCalc > 85 ? '#fd4900' : (religionCalc > 80 ? '#fa5b00' : (religionCalc > 75 ? '#f66c00' : (religionCalc > 70 ? '#f17b00' : (religionCalc > 65 ? '#ea8a00' : (religionCalc > 60 ? '#e49700' : (religionCalc > 55 ? '#dda300' : (religionCalc > 50 ? '#d6ae00' : (religionCalc > 45 ? '#cdb900' : (religionCalc > 40 ? '#c5c400' : (religionCalc > 35 ? '#bbce00' : (religionCalc > 30 ? '#b0d800' : (religionCalc > 25 ? '#a3e200' : (religionCalc > 20 ? '#94ec00' : (religionCalc > 15 ? '#83f600' : '#6fff00')))))))))))))))); 
                let color = religionCalc > 99 ? '#9a0000' : (religionCalc > 95 ? '#d00000' : (religionCalc > 90 ? '#d9291c' : (religionCalc > 85 ? '#e13f32' : (religionCalc > 80 ? '#e85246' : (religionCalc > 75 ? '#ee6459' : (religionCalc > 70 ? '#f4756d' : (religionCalc > 65 ? '#f88580' : (religionCalc > 60 ? '#fb9692' : (religionCalc > 55 ? '#fea6a4' : (religionCalc > 50 ? '#ffb6b6' : (religionCalc > 45 ? '#b8ffc7' : (religionCalc > 40 ? '#abfbba' : (religionCalc > 35 ? '#9ef7ac' : (religionCalc > 30 ? '#92f39e' : (religionCalc > 25 ? '#86ef90' : (religionCalc > 20 ? '#79eb81' : (religionCalc > 15 ? '#6de671' : (religionCalc > 15 ? '#60e161' : (religionCalc > 10 ? '#54dd4f' : (religionCalc > 5 ? '#46d83b' : (religionCalc > 1 ? '#43d839' : '#30b826'))))))))))))))))))))); 

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
    })     
}


function densityBoundaries() {
    densityBool = !densityBool;
    if (densityBool === true) {
    toggleLayerBoundaries();
    densityBool = !densityBool;
    document.getElementById('density-btn').classList.add('clickedBtn');
    if (densityLayer) {
        map.addLayer(densityLayer);  // Add the layer if it's not already on the 
        densityLayer.eachLayer(layer => {
            layer.setStyle({ fillOpacity: opacityValue,
                opacity: opacityValue });
        });
    } else {
        drawDensityLayers(`data/${regionSelection}/districtBoundaries.geojson`, densityLayer, densOpacityLayer);  // Load if it doesn't exist
    }
    } else {
        densityBool = !densityBool;
        toggleLayerBoundaries();
    }
}

function largestBoundaries() {
    largeBool = !largeBool;
    if (largeBool === true) {
        toggleLayerBoundaries();
        largeBool = !largeBool;
        document.getElementById('largest-btn').classList.add('clickedBtn');
        if (largestLayer) {
            map.addLayer(largestLayer);  // Add the layer if it's not already on the map
            map.addLayer(opacityLayer);  // Add the layer if it's not already on the map
            largestLayer.eachLayer(layer => {
                layer.setStyle({ fillOpacity: opacityValue,
                    opacity: opacityValue });
            });
            opacityLayer.eachLayer(layer => {
                const curObj = districtObjects.find(obj => obj.ID.trim() === layer.feature.properties.ID.trim());
                let initialOpacity = curObj["Percent of Population"];
                layer.setStyle({ 
                    fillOpacity: largestOpacity(initialOpacity) * 2 * opacityValue,
                    opacity: largestOpacity(initialOpacity) * 2 * opacityValue // Example of adjusting border opacity
                });
            });
        } else {
            drawLargestLayers(`data/${regionSelection}/districtBoundaries.geojson`, largestLayer, opacityLayer);  // Load if it doesn't exist
        }
    } else {
        largeBool = !largeBool;
        toggleLayerBoundaries();
    }
}

function religionBoundaries() {
    religionBool = !religionBool;
    if (religionBool === true) {
        toggleLayerBoundaries();
        religionBool = !religionBool;
        document.getElementById('religion-btn').classList.add('clickedBtn');
        if (religionLayer) {
            map.addLayer(religionLayer);  // Add the layer if it's not already on the map
            map.addLayer(relOpacityLayer);  // Add the layer if it's not already on the map
            religionLayer.eachLayer(layer => {
                layer.setStyle({ fillOpacity: opacityValue,
                    opacity: opacityValue });
            });
            relOpacityLayer.eachLayer(layer => {
                const curObj = districtObjects.find(obj => obj.ID.trim() === layer.feature.properties.ID.trim());
                let initialOpacity = curObj["Share of Population"];
                layer.setStyle({ 
                    fillOpacity: largestOpacity(initialOpacity) * 2 * opacityValue,
                    opacity: largestOpacity(initialOpacity) * 2 * opacityValue // Example of adjusting border opacity
                });
            });
        } else {
            drawReligionLayers(`data/${regionSelection}/districtBoundaries.geojson`, religionLayer, relOpacityLayer);  // Load if it doesn't exist
        }
    } else {
        religionBool = !religionBool;
        toggleLayerBoundaries();
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
        document.getElementById('density-btn').classList.remove('clickedBtn');
        if(densityLayer){
            map.removeLayer(densityLayer);  // Remove the layer if it exists
        }
    }
    if(largeBool === true){
        largeBool = false;
        document.getElementById('largest-btn').classList.remove('clickedBtn');
        if(largestLayer){
            map.removeLayer(largestLayer);  // Remove the layer if it exists
            map.removeLayer(opacityLayer);  // Remove the layer if it exists
        }
    }
    if(religionBool === true){
        religionBool = false;
        document.getElementById('religion-btn').classList.remove('clickedBtn');
        if(religionLayer){
            map.removeLayer(religionLayer);  // Remove the layer if it exists
            map.removeLayer(relOpacityLayer);  // Remove the layer if it exists
        }
    }
    if(ethDropBool === true){
        ethDropBool = false;
        document.getElementById('ethnicDrop-btn').classList.remove('clickedBtn');  
      
        if(ethAloneLayer){
            map.removeLayer(ethAloneLayer);  // Remove the layer if it exists
        }
    }
    if(relDropBool === true){
        relDropBool = false;
        document.getElementById('religionDrop-btn').classList.remove('clickedBtn');
        if(relAloneLayer){
            map.removeLayer(relAloneLayer);  // Remove the layer if it exists
        }

    }
}



function handleFeatureClick(layer, feature) {
    let provinceId;
    let countryId;
    if(feature.properties.Province){
        provinceId = feature.properties.Province;
        countryId = feature.properties.Country;    
    } else {
        provinceId = feature.properties.Province_GIS;
        countryId = feature.properties.Country_GIS;  
    }

    if (drawMode !== 'browse') {
        if (mode === 'district') {
            applyDistrictChange(layer, feature);
        } else if (mode === 'province') {
            applyGroupChange(provinceGroups[provinceId], provinceId);
        } else if (mode === 'country') {
            applyGroupChange(countryGroups[countryId], countryId);
        }
    }
}

function applyDistrictChange(layer, feature) {
    // Apply style changes based on selected nation
    let featureId = feature.properties.ID;
    let selectedColor = drawMode === 'draw' ? nationColors[selectedNation] : null;
    districtAddOrSub(featureId, drawMode);

    if(successBool === true) {
        layer.setStyle({
            color: selectedColor,
            fillColor: selectedColor,
            fillOpacity: selectedColor ? mapOpacityValue : 0,
            opacity: selectedColor ? mapOpacityValue * 1.2 : 0
        });
    }
    successBool = true;
}

function applyGroupChange(groupLayer, groupId) {
    console.log('ddddd', groupLayer)
    groupLayer.eachLayer(function (layer) {
        let featureId = layer.feature.properties.ID;
        let selectedColor = drawMode === 'draw' ? nationColors[selectedNation] : null;
        districtAddOrSub(featureId, drawMode);

        if(successBool === true) {
        layer.setStyle({
            color: selectedColor,
            fillColor: selectedColor,
            fillOpacity: selectedColor ? mapOpacityValue : 0,
            opacity: selectedColor ? mapOpacityValue * 1.2 : 0
            });
        }
        successBool = true;
    });
}

function districtAddOrSub(featureId, drawingMode) {
    if (drawingMode === 'draw') {
        districtAdd(selectedNation, featureId);
    } else if (drawingMode === 'erase') {
        districtSub(featureId);
    }
}


function districtAdd(selectedNation, featureId) {
    let previousNation = null;

    // Find which nation the feature currently belongs to, if any
    for (let i = 1; i <= 50; i++) {
        const index = nationAssignments[i].findIndex(obj => obj.ID === featureId);
        if (index !== -1) {
            previousNation = i;
            break;
        }
    }

    if(locks[previousNation] === true || locks[selectedNation] === true) {
        successBool = false;
        return;
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
    for (let i = 1; i  <= 50; i++) {
        const index = nationAssignments[i].findIndex(obj => obj.ID === featureId);
        if (index !== -1) {
            previousNation = i;
            break;
        }
    }

    if(locks[previousNation] === true) {
        successBool = false;
        return;
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



// function createAllNationOutlines(feature) {
//         if (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon') {
//             const outerBoundary = turf.polygonToLine(feature);
//             // Add this boundary to your map
//             L.geoJSON(outerBoundary, {
//                 style: { color: '#000000', weight: 2, fillOpacity: 0 }
//             }).addTo(map);
//         }
// }

// function outliner() {
//     fetch(`data/${regionSelection}/districtBoundaries.geojson`) // Ensure this path is correct
//     .then(response => response.json())
//     .then(data => {
//         // Filter and merge features using Turf.js
//         const filteredFeatures = {
//             type: 'FeatureCollection',
//             features: data.features.filter(feature => {
//                 for (let i = 1; i  <= 50; i++) {
//                     for (let j = 0; j < nationAssignments[i].length; j++) {
//                         if (feature.properties.ID === nationAssignments[i][j]) {
//                             return true; // Return true if the feature matches
//                         }
//                     }
//                 }
//                 return false; // Return false if no match is found
//             })
//         };

//         // Check if there are features to merge
//         if (filteredFeatures.features.length > 0) {
//             let mergedFeature;
//             if (filteredFeatures.features.length > 1) {
//                 mergedFeature = turf.union(...filteredFeatures.features);
//             } else {
//                 mergedFeature = filteredFeatures.features[0]; // Handle single feature case
//             }

//             // Add the merged feature to the map
//             L.geoJSON(mergedFeature, {
//                 pane: 'nations',
//                 style: function() {
//                     return {
//                         color: 'black', // Change this color as needed
//                         weight: 1.5,
//                         fill: false,
//                         opacity: 1
//                     };
//                 }
//             }).addTo(map);
//         } else {
//             console.warn('No features matched the filter criteria.');
//         }
//     })
//     .catch(err => console.error('Error loading GeoJSON:', err));
// }




/* ****** MAP ******* */


function mainLoadData(saveArray) {

    if(regionSelection === "southeastEurope"){
        map.flyTo([41.7403, 24.0206], 6);
    } else if (regionSelection === "westAsia") {
        map.flyTo([27.9763, 42.9730], 5);
    } else if (regionSelection === "russia") {
        map.flyTo([66.1274, 109.8646], 3);
    } else if (regionSelection === "centralAsia") {
        map.flyTo([41.5744, 64.1833], 4.5);
    } else if (regionSelection === "southAsia") {
        map.flyTo([22.0574, 78.9382], 5);
    } else if (regionSelection === "eastAsia") {
        map.flyTo([37.1426, 109.4898], 4.25);
    } else if (regionSelection === "southeastAsia") {
        map.flyTo([8.0384, 121.4194], 4.5);
    } else if (regionSelection === "northAfrica") {
        map.flyTo([23.4975, 11.9947], 4.5);
    } else if (regionSelection === "eastAfrica") {
        map.flyTo([2.9635, 40.1090], 5.25);
    } else if (regionSelection === "westAfrica") {
        map.flyTo([14.8703, -5.4678], 5.75);
    } else if (regionSelection === "southernAfrica") {
        map.flyTo([-22.3872, 26.7047], 5.25);
    }


    document.getElementById('dataTabClick').click();   

    // Fetch and add GeoJSON data to the map
    fetch(`data/${regionSelection}/districtBoundaries.geojson`) // Ensure this path is correct
        .then(response => response.json())
        .then(data => {

            L.geoJSON(data, {
                pane: 'nations',
                style: function(feature) {
                    return {
                        color: nationColors[selectedNation],
                        weight: 0.7,
                        fillColor: nationColors[selectedNation],
                        fillOpacity: 0,
                        opacity: 0
                    };
                },

                onEachFeature: function(feature, layer) {

                    let provinceId;
                    let countryId;
                    if(feature.properties.Province){
                        provinceId = feature.properties.Province;
                        countryId = feature.properties.Country;    
                    } else {
                        provinceId = feature.properties.Province_GIS;
                        countryId = feature.properties.Country_GIS;  
                    }
    
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
                        if(saveBool === true){
                            console.log(saveArray['names'][0]['1']);
                            for (let i = 1; i <= 50; i++) {    
                                updateNationName(i, saveArray['names'][0][i]);
                            }
                            document.querySelector(`#mapTitle`).textContent = saveArray['names'][0][51];
                            saveBool = false;
                        }            
                        // Clear all existing layers on the map before reloading
                        map.eachLayer(function (layer) {
                            if (layer instanceof L.GeoJSON) {
                                map.removeLayer(layer);
                            }
                        });    

                        for (let i = 1; i  <= 50; i++) { // Go through each nation
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

                        for (let i = 1; i  <= 50; i++) { // Go through each nation
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
                            if(`${curObj.oneGroup}` === "."){
                                document.getElementById('oneGroup').textContent = ".";
                                document.getElementById('oneGroup').style.background =  `linear-gradient(to right, #535071 0%, #1c1c21 0%)`;
                            } else {
                                document.getElementById('oneGroup').textContent = `${curObj[curObj.oneGroup].toLocaleString()}`;
                                document.getElementById('oneGroup').style.background =  `linear-gradient(to right, #535071 ${curObj[curObj.oneGroup]/curObj['Population'] * 100}%, #1c1c21 0%)`;
                            }

                            document.getElementById('groupTwo').textContent = `${curObj.twoGroup}`;                        
                            if(`${curObj.twoGroup}` === "."){
                                document.getElementById('twoGroup').textContent = ".";
                                document.getElementById('twoGroup').style.background =  `linear-gradient(to right, #535071 0%, #1c1c21 0%)`;
                            } else {
                                document.getElementById('twoGroup').textContent = `${curObj[curObj.twoGroup].toLocaleString()}`;
                                document.getElementById('twoGroup').style.background =  `linear-gradient(to right, #535071 ${curObj[curObj.twoGroup]/curObj['Population'] * 100}%, #1c1c21 0%)`;
                            }

                            document.getElementById('groupThree').textContent = `${curObj.threeGroup}`;
                            if(`${curObj.threeGroup}` === "."){
                                document.getElementById('threeGroup').textContent = ".";
                                document.getElementById('threeGroup').style.background =  `linear-gradient(to right, #535071 0%, #1c1c21 0%)`;
                            } else {
                                document.getElementById('threeGroup').textContent = `${curObj[curObj.threeGroup].toLocaleString()}`;
                                document.getElementById('threeGroup').style.background =  `linear-gradient(to right, #535071 ${curObj[curObj.threeGroup]/curObj['Population'] * 100}%, #1c1c21 0%)`;
                            }

                            document.getElementById('groupFour').textContent = `${curObj.fourGroup}`;
                            if(`${curObj.fourGroup}` === "."){
                                document.getElementById('fourGroup').textContent = ".";
                                document.getElementById('fourGroup').style.background =  `linear-gradient(to right, #535071 0%, #1c1c21 0%)`;
                            } else {
                                document.getElementById('fourGroup').textContent = `${curObj[curObj.fourGroup].toLocaleString()}`;
                                document.getElementById('fourGroup').style.background =  `linear-gradient(to right, #535071 ${curObj[curObj.fourGroup]/curObj['Population'] * 100}%, #1c1c21 0%)`;
                            }

                            document.getElementById('groupFive').textContent = `${curObj.fiveGroup}`;
                            if(`${curObj.fiveGroup}` === "."){
                                document.getElementById('fiveGroup').textContent = ".";
                                document.getElementById('fiveGroup').style.background =  `linear-gradient(to right, #535071 0%, #1c1c21 0%)`;

                            } else {
                                document.getElementById('fiveGroup').textContent = `${curObj[curObj.fiveGroup].toLocaleString()}`;
                                document.getElementById('fiveGroup').style.background =  `linear-gradient(to right, #535071 ${curObj[curObj.fiveGroup]/curObj['Population'] * 100}%, #1c1c21 0%)`;
                            }

                            document.getElementById('groupSix').textContent = `${curObj.sixGroup}`;
                            if(`${curObj.sixGroup}` === "."){
                                document.getElementById('sixGroup').textContent = ".";
                                document.getElementById('sixGroup').style.background =  `linear-gradient(to right, #535071 0%, #1c1c21 0%)`;

                            } else {
                                document.getElementById('sixGroup').textContent = `${curObj[curObj.sixGroup].toLocaleString()}`;
                                document.getElementById('sixGroup').style.background =  `linear-gradient(to right, #535071 ${curObj[curObj.sixGroup]/curObj['Population'] * 100}%, #1c1c21 0%)`;
                            }
                            
                            document.getElementById('groupSeven').textContent = `${curObj.sevenGroup}`;
                            if(`${curObj.sevenGroup}` === "."){
                                document.getElementById('sevenGroup').textContent = ".";
                                document.getElementById('sevenGroup').style.background =  `linear-gradient(to right, #535071 0%, #1c1c21 0%)`;
                            } else {
                                document.getElementById('sevenGroup').textContent = `${curObj[curObj.sevenGroup].toLocaleString()}`;
                                document.getElementById('sevenGroup').style.background =  `linear-gradient(to right, #535071 ${curObj[curObj.sevenGroup]/curObj['Population'] * 100}%, #1c1c21 0%)`;
                            }

                            document.getElementById('groupEight').textContent = `${curObj.eightGroup}`;
                            if(`${curObj.eightGroup}` === "."){
                                document.getElementById('eightGroup').textContent = ".";
                                document.getElementById('eightGroup').style.background =  `linear-gradient(to right, #535071 0%, #1c1c21 0%)`;
                            } else {
                                document.getElementById('eightGroup').textContent = `${curObj[curObj.eightGroup].toLocaleString()}`;
                                document.getElementById('eightGroup').style.background =  `linear-gradient(to right, #535071 ${curObj[curObj.eightGroup]/curObj['Population'] * 100}%, #1c1c21 0%)`;
                            }

                            document.getElementById('groupNine').textContent = `${curObj.nineGroup}`;
                            if(`${curObj.nineGroup}` === "."){
                                document.getElementById('nineGroup').textContent = ".";
                                document.getElementById('nineGroup').style.background =  `linear-gradient(to right, #535071 0%, #1c1c21 0%)`;
                            } else {
                                document.getElementById('nineGroup').textContent = `${curObj[curObj.nineGroup].toLocaleString()}`;
                                document.getElementById('nineGroup').style.background =  `linear-gradient(to right, #535071 ${curObj[curObj.nineGroup]/curObj['Population'] * 100}%, #1c1c21 0%)`;
                            }nineGroup

                            document.getElementById('groupTen').textContent = `${curObj.tenGroup}`;
                            if(`${curObj.tenGroup}` === "."){
                                document.getElementById('tenGroup').textContent = ".";
                                document.getElementById('tenGroup').style.background =  `linear-gradient(to right, #535071 0%, #1c1c21 0%)`;
                            } else {
                                document.getElementById('tenGroup').textContent = `${curObj[curObj.tenGroup].toLocaleString()}`;
                                document.getElementById('tenGroup').style.background =  `linear-gradient(to right, #535071 ${curObj[curObj.tenGroup]/curObj['Population'] * 100}%, #1c1c21 0%)`;
                            }

                            document.getElementById('religionOne').textContent = `${curObj.oneReligion}`;                        
                            if(`${curObj.oneReligion}` === "."){
                                document.getElementById('oneReligion').textContent = ".";
                                document.getElementById('oneReligion').style.background =  `linear-gradient(to right, #535071 0%, #1c1c21 0%)`;
                            } else {
                                document.getElementById('oneReligion').textContent = `${curObj[curObj.oneReligion].toLocaleString()}`;
                                document.getElementById('oneReligion').style.background =  `linear-gradient(to right, #535071 ${curObj[curObj.oneReligion]/curObj['Population'] * 100}%, #1c1c21 0%)`;
                            }

                            document.getElementById('religionTwo').textContent = `${curObj.twoReligion}`;                        
                            if(`${curObj.twoReligion}` === "."){
                                document.getElementById('twoReligion').textContent = ".";
                                document.getElementById('twoReligion').style.background =  `linear-gradient(to right, #535071 0%, #1c1c21 0%)`;
                            } else {
                                document.getElementById('twoReligion').textContent = `${curObj[curObj.twoReligion].toLocaleString()}`;
                                document.getElementById('twoReligion').style.background =  `linear-gradient(to right, #535071 ${curObj[curObj.twoReligion]/curObj['Population'] * 100}%, #1c1c21 0%)`;
                            }

                            document.getElementById('religionThree').textContent = `${curObj.threeReligion}`;
                            if(`${curObj.threeReligion}` === "."){
                                document.getElementById('threeReligion').textContent = ".";
                                document.getElementById('threeReligion').style.background =  `linear-gradient(to right, #535071 0%, #1c1c21 0%)`;
                            } else {
                                document.getElementById('threeReligion').textContent = `${curObj[curObj.threeReligion].toLocaleString()}`;
                                document.getElementById('threeReligion').style.background =  `linear-gradient(to right, #535071 ${curObj[curObj.threeReligion]/curObj['Population'] * 100}%, #1c1c21 0%)`;
                            }

                            document.getElementById('religionFour').textContent = `${curObj.fourReligion}`;
                            if(`${curObj.fourReligion}` === "."){
                                document.getElementById('fourReligion').textContent = ".";
                                document.getElementById('fourReligion').style.background =  `linear-gradient(to right, #535071 0%, #1c1c21 0%)`;
                            } else {
                                document.getElementById('fourReligion').textContent = `${curObj[curObj.fourReligion].toLocaleString()}`;
                                document.getElementById('fourReligion').style.background =  `linear-gradient(to right, #535071 ${curObj[curObj.fourReligion]/curObj['Population'] * 100}%, #1c1c21 0%)`;
                            }

                            document.getElementById('religionFive').textContent = `${curObj.fiveReligion}`;
                            if(`${curObj.fiveReligion}` === "."){
                                document.getElementById('fiveReligion').textContent = ".";
                                document.getElementById('fiveReligion').style.background =  `linear-gradient(to right, #535071 0%, #1c1c21 0%)`;

                            } else {
                                document.getElementById('fiveReligion').textContent = `${curObj[curObj.fiveReligion].toLocaleString()}`;
                                document.getElementById('fiveReligion').style.background =  `linear-gradient(to right, #535071 ${curObj[curObj.fiveReligion]/curObj['Population'] * 100}%, #1c1c21 0%)`;
                            }

                            document.getElementById('religionSix').textContent = `${curObj.sixReligion}`;
                            if(`${curObj.sixReligion}` === "."){
                                document.getElementById('sixReligion').textContent = ".";
                                document.getElementById('sixReligion').style.background =  `linear-gradient(to right, #535071 0%, #1c1c21 0%)`;

                            } else {
                                document.getElementById('sixReligion').textContent = `${curObj[curObj.sixReligion].toLocaleString()}`;
                                document.getElementById('sixReligion').style.background =  `linear-gradient(to right, #535071 ${curObj[curObj.sixReligion]/curObj['Population'] * 100}%, #1c1c21 0%)`;
                            }
                            
                            document.getElementById('religionSeven').textContent = `${curObj.sevenReligion}`;
                            if(`${curObj.sevenReligion}` === "."){
                                document.getElementById('sevenReligion').textContent = ".";
                                document.getElementById('sevenReligion').style.background =  `linear-gradient(to right, #535071 0%, #1c1c21 0%)`;
                            } else {
                                document.getElementById('sevenReligion').textContent = `${curObj[curObj.sevenReligion].toLocaleString()}`;
                                document.getElementById('sevenReligion').style.background =  `linear-gradient(to right, #535071 ${curObj[curObj.sevenReligion]/curObj['Population'] * 100}%, #1c1c21 0%)`;
                            }

                            document.getElementById('religionEight').textContent = `${curObj.eightReligion}`;
                            if(`${curObj.eightReligion}` === "."){
                                document.getElementById('eightReligion').textContent = ".";
                                document.getElementById('eightReligion').style.background =  `linear-gradient(to right, #535071 0%, #1c1c21 0%)`;
                            } else {
                                document.getElementById('eightReligion').textContent = `${curObj[curObj.eightReligion].toLocaleString()}`;
                                document.getElementById('eightReligion').style.background =  `linear-gradient(to right, #535071 ${curObj[curObj.eightReligion]/curObj['Population'] * 100}%, #1c1c21 0%)`;
                            }

                            document.getElementById('religionNine').textContent = `${curObj.nineReligion}`;
                            if(`${curObj.nineReligion}` === "."){
                                document.getElementById('nineReligion').textContent = ".";
                                document.getElementById('nineReligion').style.background =  `linear-gradient(to right, #535071 0%, #1c1c21 0%)`;
                            } else {
                                document.getElementById('nineReligion').textContent = `${curObj[curObj.nineReligion].toLocaleString()}`;
                                document.getElementById('nineReligion').style.background =  `linear-gradient(to right, #535071 ${curObj[curObj.nineReligion]/curObj['Population'] * 100}%, #1c1c21 0%)`;
                            }

                            document.getElementById('religionTen').textContent = `${curObj.tenReligion}`;
                            if(`${curObj.tenReligion}` === "."){
                                document.getElementById('tenReligion').textContent = ".";
                                document.getElementById('tenReligion').style.background =  `linear-gradient(to right, #535071 0%, #1c1c21 0%)`;
                            } else {
                                document.getElementById('tenReligion').textContent = `${curObj[curObj.tenReligion].toLocaleString()}`;
                                document.getElementById('tenReligion').style.background =  `linear-gradient(to right, #535071 ${curObj[curObj.tenReligion]/curObj['Population'] * 100}%, #1c1c21 0%)`;
                            }

                        } else {
                            console.warn(`No matching data found for ID: ${feature.properties.ID}`);
                        }

                    });
                }
            }).addTo(map); 
            
            document.getElementById('district-btn').click(); 
            document.getElementById('draw-btn').click();

            document.getElementById('dist-bound-btn').click();          
            document.getElementById('nation1-btn').click();   
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

// var reliefMap = L.tileLayer('http://localhost:8000/data/reliefMap/reliefMap/{z}/{x}/{y}.png', {
//     tms: true,
//     opacity: 0.5
// }).addTo(map);

// var CartoDB_Positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
// 	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
// }).addTo(map);

// var Esri_WorldShadedRelief = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}', {
// 	attribution: 'Tiles &copy; Esri &mdash; Source: Esri',
//     opacity: 0.6
// }).addTo(map);

var Esri_WorldTerrain = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: USGS, Esri, TANA, DeLorme, and NPS',
}).addTo(map);

var CartoDB_VoyagerOnlyLabels = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
}).addTo(map);


async function setupMap() {
    await initializeSelection();
    
fetch(`data/${regionSelection}/dataArray.json`)
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

            allData = Object.keys(baseNation);

        nationInfo = { 1: {...nationBase}, 2: {...nationBase}, 3: {...nationBase}, 4: {...nationBase}, 5: {...nationBase}, 6: {...nationBase}, 7: {...nationBase}, 8: {...nationBase}, 9: {...nationBase}, 10: {...nationBase}, 11: {...nationBase}, 12: {...nationBase}, 13: {...nationBase}, 14: {...nationBase}, 15: {...nationBase}, 16: {...nationBase}, 17: {...nationBase}, 18: {...nationBase}, 19: {...nationBase}, 20: {...nationBase}, 21: {...nationBase}, 22: {...nationBase}, 23: {...nationBase}, 24: {...nationBase}, 25: {...nationBase}, 26: {...nationBase}, 27: {...nationBase}, 28: {...nationBase}, 29: {...nationBase}, 30: {...nationBase}, 31: {...nationBase}, 32: {...nationBase}, 33: {...nationBase}, 34: {...nationBase}, 35: {...nationBase}, 36: {...nationBase}, 37: {...nationBase}, 38: {...nationBase}, 39: {...nationBase}, 40: {...nationBase}, 41: {...nationBase}, 42: {...nationBase}, 43: {...nationBase}, 44: {...nationBase}, 45: {...nationBase}, 46: {...nationBase}, 47: {...nationBase}, 48: {...nationBase}, 49: {...nationBase}, 50: {...nationBase}};   // Holds the nation info for each of the keys
        console.log('nationInfo loaded:', nationInfo);
        console.log('allData loaded:', allData);
    })
    .catch(error => console.error('Error loading JSON:', error));
    mainLoadData(null);
}


initializeSelection();
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
    if (event.key === '`') {
        drawMode = 'browse';
        document.getElementById('browse-btn').click();
        altKeyPressed = true;
    }
    if (event.key === '[') {
        document.getElementById('district-btn').click();
    }
    if (event.key === ']') {
        document.getElementById('province-btn').click();
    }
    if (event.key === '\\') {
        document.getElementById('country-btn').click();
    }
});
 
document.addEventListener('keyup', function(event) {
    if (event.key === 'Shift') {
        shiftKeyPressed = false;
    }
    if (event.key === 'Control') {
        ctrlKeyPressed = false;
    }
    if (event.key === '`') {
        altKeyPressed = false;
    }
});


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
updateButtonColor(21);
updateButtonColor(22);
updateButtonColor(23);
updateButtonColor(24);
updateButtonColor(25);
updateButtonColor(26);
updateButtonColor(27);
updateButtonColor(28);
updateButtonColor(29);
updateButtonColor(30);
updateButtonColor(31);
updateButtonColor(32);
updateButtonColor(33);
updateButtonColor(34);
updateButtonColor(35);
updateButtonColor(36);
updateButtonColor(37);
updateButtonColor(38);
updateButtonColor(39);
updateButtonColor(40);
updateButtonColor(41);
updateButtonColor(42);
updateButtonColor(43);
updateButtonColor(44);
updateButtonColor(45);
updateButtonColor(46);
updateButtonColor(47);
updateButtonColor(48);
updateButtonColor(49);
updateButtonColor(50);

for (let i = 1; i <= 50; i++) {
    // document.getElementById(`lock${i}-btn`).addEventListener('click', () => nationLock(i));
    document.getElementById(`nation${i}-btn`).addEventListener('click', () => selectNation(i));
    document.getElementById(`nation${i}-btn`).addEventListener('contextmenu', (e) => {
        e.preventDefault();
        document.getElementById(`color${i}`).click();
    });
    document.getElementById(`color${i}`).addEventListener('input', () => updateButtonColor(i));
}

document.addEventListener('DOMContentLoaded', function() {

    let checkboxes = document.querySelectorAll("input[type='checkbox']");
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                locks[this.getAttribute('id')] = true;
            } else {
                locks[this.getAttribute('id')] = false;
            }
        });
    });
    

    document.getElementById('mapOpacity').addEventListener('input', function () {
        mapOpacityValue = parseFloat(this.value)/100;

        for (let i = 1; i  <= 50; i++) {
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
                const curObj = districtObjects.find(obj => obj.ID.trim() === layer.feature.properties.ID.trim());
                let initialOpacity = curObj["Percent of Population"];
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
                const curObj = districtObjects.find(obj => obj.ID.trim() === layer.feature.properties.ID.trim());
                let initialOpacity = curObj["Share of Population"];
                layer.setStyle({ 
                    fillOpacity: largestOpacity(initialOpacity) * 2 * opacityValue,
                    opacity: largestOpacity(initialOpacity) * 2 * opacityValue // Example of adjusting border opacity
                    });
            })
        }
        if(ethDropBool === true) {
            ethAloneLayer.eachLayer(layer => {
                layer.setStyle({ fillOpacity: opacityValue,
                    opacity: opacityValue });
            });
        }
        if(relDropBool === true) {
            relAloneLayer.eachLayer(layer => {
                layer.setStyle({ fillOpacity: opacityValue,
                    opacity: opacityValue });
            });
        }

    });
    
        
    document.getElementById('district-btn').addEventListener('click', switchToDistrict);
    document.getElementById('province-btn').addEventListener('click', switchToProvince);
    document.getElementById('country-btn').addEventListener('click', switchToCountry);

    // document.querySelectorAll('.btn').forEach(btnClick => {
    //     btnClick.addEventListener('click', () => {
    //         document.querySelector('.clickedBtn')?.classList.remove('clickedBtn');
    //         btnClick.classList.add('clickedBtn');
    //     });
    // });


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

    document.querySelector("#mapTitle").addEventListener("input", function() {
        const newMapName = this.textContent.trim();
        nationNames[51] = newMapName;
    });    


    document.getElementById('dist-bound-btn').addEventListener('click', distBoundaries);
    document.getElementById('prov-bound-btn').addEventListener('click', provBoundaries);
    document.getElementById('count-bound-btn').addEventListener('click', countBoundaries);
    document.getElementById('density-btn').addEventListener('click', densityBoundaries);
    document.getElementById('largest-btn').addEventListener('click', largestBoundaries);
    document.getElementById('religion-btn').addEventListener('click', religionBoundaries);


    document.getElementById('browse-btn').addEventListener('click', switchToBrowse);
    document.getElementById('draw-btn').addEventListener('click', switchToDraw);
    document.getElementById('erase-btn').addEventListener('click', switchToErase);
});



