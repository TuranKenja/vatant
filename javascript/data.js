// Function to handle tab switching
function openStatTab(evt, tabName) {
    var i, statTable, ethTable, relTable, tabID;

    if (tabName === 'statistics') {
        tabID = "stat-btn";
    } else if (tabName === 'ethnicity') {
        tabID = "eth-btn";        
        populateEthnicityTable();  // Call this when Ethnicity button is clicked
    } else {
        tabID = "rel-btn";
        populateReligionTable();  // Call this when Religion button is clicked
    }

    // Hide all statistics tables
    statTable = document.getElementsByClassName("statTable");
    for (i = 0; i < statTable.length; i++) {
        statTable[i].style.display = "none";
    }

    // Hide all ethnicity tables
    ethTable = document.getElementsByClassName("ethTable");
    for (i = 0; i < ethTable.length; i++) {
        ethTable[i].style.display = "none";
    }

    // Hide all religion tables
    relTable = document.getElementsByClassName("relTable");
    for (i = 0; i < relTable.length; i++) {
        relTable[i].style.display = "none";
    }

    // Show the clicked tab (based on tabName argument)
    document.getElementById(tabName).style.display = "block";

    // Remove the "active" class from all buttons
    var btns = document.getElementsByClassName("data-btn");
    for (i = 0; i < btns.length; i++) {
        btns[i].classList.remove("active");
    }
    document.getElementById('stat-btn').classList.remove('clickedBtn');
    document.getElementById('eth-btn').classList.remove('clickedBtn');
    document.getElementById('rel-btn').classList.remove('clickedBtn');

    // Add the "active" class to the clicked button
    evt.currentTarget.className += " active";
    document.getElementById(tabID).classList.add('clickedBtn');
}



function populateEthnicityTable() { 
    let ethBoolHeader = null;
    const excludeKeys = ["OKTMO ID", "ID", "Data Year", "Country", "Province", "District", "Density", "Area", "ethnicity", "Largest Group", "Largest Percent", "oneGroup", "twoGroup", "threeGroup", "fourGroup", "fiveGroup", "sixGroup", "sevenGroup", "eightGroup", "nineGroup", "tenGroup", "religion", "Largest Religion", "Share of Population", "Percent of Population"];

    // Clear existing headers and rows (in case it's repopulated)
    const headerRow = document.getElementById('colNamesEth');
    headerRow.innerHTML = '';

    // Create table headers
    const nationHeader = document.createElement('th');
    nationHeader.textContent = "Nations";
    headerRow.appendChild(nationHeader);

    ethnicData.forEach(col => {
        const th = document.createElement('th');
        th.textContent = col;
        if (excludeKeys.includes(col)) {
            th.classList.add('hidden-column'); // Add class to hide the column
        }
        if(col === "ethnicity" || col === "religion") {
            ethBoolHeader = col;
        }
        if(ethBoolHeader === null || ethBoolHeader === "ethnicity"){
            headerRow.appendChild(th);
        }
    });

    // Clear table body before populating
    const tableBodyEth = document.getElementById('tableBodyEth');
    tableBodyEth.innerHTML = '';

    // Populate table rows
    let nationIndex = 1;
    for (const ID in nationInfo) {
        const row = document.createElement('tr');

        // Create the first column with "Nation 1", "Nation 2", etc.
        const nationCell = document.createElement('td');
        nationCell.textContent = nationNames[nationIndex];

        if (nationIndex % 2 === 0) {
            nationCell.classList.add('grayed');
        } else {
            nationCell.classList.add('whited');
        }

        row.appendChild(nationCell);

        ethBoolRow = null;
        // For each column, create a cell in the row
        ethnicData.forEach(col => {
            const td = document.createElement('td');
            const value = nationInfo[ID][col] || 0; // Fallback to 0 if value is missing
            console.log(value);

            td.textContent = typeof value === "number" ? value.toLocaleString() : value; // Use toLocaleString() for numbers

            if (excludeKeys.includes(col)) {
                td.classList.add('hidden-column'); // Add class to hide the column
            }
            if(col === "religion") {
                ethBoolRow = col;
            }
            if(ethBoolRow === null || ethBoolRow === "ethnicity"){
                    row.appendChild(td);
            }
        });
        if (nationIndex % 2 === 0) {
            row.classList.add('grayed');
        } 

        tableBodyEth.appendChild(row);
        nationIndex++;
    }
}





function populateReligionTable() { 
    let relBoolHeader = null;
    const excludeKeys = ["OKTMO ID", "ID", "Data Year", "Country", "Province", "District", "Density", "Area", "ethnicity", "Largest Group", "Largest Percent", "oneGroup", "twoGroup", "threeGroup", "fourGroup", "fiveGroup", "sixGroup", "sevenGroup", "eightGroup", "nineGroup", "tenGroup", "religion", "Largest Religion", "Share of Population", "Percent of Population"];

    // Clear existing headers and rows (in case it's repopulated)
    const headerRow = document.getElementById('colNamesRel');
    headerRow.innerHTML = '';

    // Create table headers
    const nationHeader = document.createElement('th');
    nationHeader.textContent = "Nations";
    headerRow.appendChild(nationHeader);

    ethnicData.forEach(col => {
        console.log(col);
        console.log(relBoolHeader);
        const th = document.createElement('th');
        th.textContent = col;
        if (excludeKeys.includes(col)) {
            th.classList.add('hidden-column'); // Add class to hide the column
        }
        if(col === "ethnicity" || col === "religion") {
            console.log(col);
            console.log(relBoolHeader);    
            relBoolHeader = col;
        }
        if(relBoolHeader === null){
            headerRow.appendChild(th);
        }
        if(relBoolHeader === "religion"){
            headerRow.appendChild(th);
            console.log("yay");
        }

    });

    // Clear table body before populating
    const tableBodyRel = document.getElementById('tableBodyRel');
    tableBodyRel.innerHTML = '';

    // Populate table rows
    let nationIndex = 1;
    for (const ID in nationInfo) {
        const row = document.createElement('tr');

        // Create the first column with "Nation 1", "Nation 2", etc.
        const nationCell = document.createElement('td');
        nationCell.textContent = nationNames[nationIndex];

        if (nationIndex % 2 === 0) {
            nationCell.classList.add('grayed');
        } else {
            nationCell.classList.add('whited');
        }

        row.appendChild(nationCell);

        let relBoolRow = null;
        // For each column, create a cell in the row
        ethnicData.forEach(col => {
            const td = document.createElement('td');
            const value = nationInfo[ID][col] || 0; // Fallback to 0 if value is missing
            console.log(value);

            td.textContent = typeof value === "number" ? value.toLocaleString() : value; // Use toLocaleString() for numbers

            if (excludeKeys.includes(col)) {
                td.classList.add('hidden-column'); // Add class to hide the column
            }
            if(col === "ethnicity" || col === "religion") {
                relBoolRow = col;
            }
            if(relBoolRow === null || relBoolRow === "religion"){
                    row.appendChild(td);
            }
        });

        console.log(religionData);

        if (nationIndex % 2 === 0) {
            row.classList.add('grayed');
        } 

        tableBodyRel.appendChild(row);
        nationIndex++;
    }
}



// Set statistics tab as default on load
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('stat-btn').click();
});
