// Function to handle tab switching
function openStatTab(evt, tabName) {
    console.log('dssdfsadfas');
    var i, statTable, ethTable, relTable, sourceTable, tabID;

    if (tabName === 'statistics') {
        tabID = "stat-btn";
    } else if (tabName === 'ethnicity1') {
        tabID = "eth-btn1";      
        populateEthnicityTable();  // Call this when Ethnicity button is clicked
    } else if (tabName === 'religion1') {
        tabID = "rel-btn1";
        populateReligionTable();  // Call this when Religion button is clicked
    } else if (tabName === 'sources') {
        tabID = "sources-btn";
        populateSourcesTable();
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

    // Hide all source tables
    sourceTable = document.getElementsByClassName("sourceTable");
    for (i = 0; i < sourceTable.length; i++) {
        sourceTable[i].style.display = "none";
    }

    // Show the clicked tab (based on tabName argument)
    document.getElementById(tabName).style.display = "block";

    // Remove the "active" class from all buttons
    var btns = document.getElementsByClassName("data-btn");
    for (i = 0; i < btns.length; i++) {
        btns[i].classList.remove("active");
    }
    document.getElementById('stat-btn').classList.remove('clickedBtn');
    document.getElementById('eth-btn1').classList.remove('clickedBtn');
    document.getElementById('rel-btn1').classList.remove('clickedBtn');
    document.getElementById('sources-btn').classList.remove('clickedBtn');

    // Add the "active" class to the clicked button
    evt.currentTarget.className += " active";
    document.getElementById(tabID).classList.add('clickedBtn');
}



function populateEthnicityTable() { 
    let ethBoolHeader = null;
    const excludeKeys = ["OKTMO ID", "ID", "Data Year", "Country", "Province", "District", "Density", "Area", "ethnicity", "Largest Group", "Largest Percent", "oneGroup", "twoGroup", "threeGroup", "fourGroup", "fiveGroup", "sixGroup", "sevenGroup", "eightGroup", "nineGroup", "tenGroup", "oneReligion", "twoReligion", "threeReligion", "fourReligion", "fiveReligion", "sixReligion", "sevenReligion", "eightReligion", "nineReligion", "tenReligion", "religion", "Largest Religion", "Share of Population", "Percent of Population"];

    // Clear existing headers and rows (in case it's repopulated)
    const ethHeaderRow = document.getElementById('colNamesEth');
    ethHeaderRow.innerHTML = '';

    // Create table headers
    const nationHeader = document.createElement('th');
    nationHeader.textContent = "Nations";
    ethHeaderRow.appendChild(nationHeader);

    allData.forEach(col => {
        const th = document.createElement('th');
        th.textContent = col;
        if (excludeKeys.includes(col)) {
            th.classList.add('hidden-column'); // Add class to hide the column
        }
        if(col === "ethnicity" || col === "religion") {
            ethBoolHeader = col;
        }
        if(ethBoolHeader === null || ethBoolHeader === "ethnicity"){
            ethHeaderRow.appendChild(th);
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
        allData.forEach(col => {
            const td = document.createElement('td');
            const value = nationInfo[ID][col] || 0; // Fallback to 0 if value is missing

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
    const excludeKeys = ["OKTMO ID", "ID", "Data Year", "Country", "Province", "District", "Density", "Area", "ethnicity", "Largest Group", "Largest Percent", "oneGroup", "twoGroup", "threeGroup", "fourGroup", "fiveGroup", "sixGroup", "sevenGroup", "eightGroup", "nineGroup", "tenGroup", "oneReligion", "twoReligion", "threeReligion", "fourReligion", "fiveReligion", "sixReligion", "sevenReligion", "eightReligion", "nineReligion", "tenReligion", "religion", "Largest Religion", "Share of Population", "Percent of Population"];

    // Clear existing headers and rows (in case it's repopulated)
    const relHeaderRow = document.getElementById('colNamesRel');
    relHeaderRow.innerHTML = '';

    // Create table headers
    const nationHeader = document.createElement('th');
    nationHeader.textContent = "Nations";
    relHeaderRow.appendChild(nationHeader);

    allData.forEach(col => {
        const th = document.createElement('th');
        th.textContent = col;
        if (excludeKeys.includes(col)) {
            th.classList.add('hidden-column'); // Add class to hide the column
        }
        if(col === "ethnicity" || col === "religion") {
            relBoolHeader = col;
        }
        if(relBoolHeader === null){
            relHeaderRow.appendChild(th);
        }
        if(relBoolHeader === "religion"){
            relHeaderRow.appendChild(th);
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
        allData.forEach(col => {
            const td = document.createElement('td');
            const value = nationInfo[ID][col] || 0; // Fallback to 0 if value is missing

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


        if (nationIndex % 2 === 0) {
            row.classList.add('grayed');
        } 

        tableBodyRel.appendChild(row);
        nationIndex++;
    }
}


// Function to parse CSV into an array of objects
function parseCSV(csvText) {
    const rows = csvText.split('\n').filter(row => row.trim() !== ''); // Filter out empty rows
    const headers = rows.shift().split(',');

    return rows.map(row => {
        const values = row.split(',');
        return headers.reduce((obj, header, index) => {
            obj[header] = values[index] ? values[index].trim() : '';
            return obj;
        }, {});
    });
}

async function populateSourcesTable() {

    // Fetch the CSV file and convert it to text
    const response = await fetch(`data/${regionSelection}/dataSource.csv`);
    if (!response.ok) {
        console.error('Failed to fetch the CSV file');
        return;
    }

    const csvText = await response.text();
    
    // Parse CSV data into an array of objects (rows)
    const data = parseCSV(csvText);
    if (!data || data.length === 0) {
        console.error('No data found in the CSV');
        return;
    }

    // Create and populate the header row
    const headerRow = document.getElementById('colNamesSource');
    headerRow.innerHTML = '';

    Object.keys(data[0]).forEach(col => {
        const th = document.createElement('th');
        th.textContent = col;
        headerRow.appendChild(th);
    });

    // Clear table body before populating
    const tableBodySource = document.getElementById('tableBodySource');
    tableBodySource.innerHTML = '';

    // Populate table rows
    data.forEach(row => {
        const tableRow = document.createElement('tr');

        // Populate the rest of the columns
        Object.keys(row).forEach(col => {

            const td = document.createElement('td');
            const value = row[col] || "-"; // Fallback to 0 if value is missing
            let color = background(value);
            td.classList.add(color);


            td.textContent = typeof value === "number" ? value.toLocaleString() : value; // Format numbers
            tableRow.appendChild(td);
        });

        tableBodySource.appendChild(tableRow);
    });
}

function background(value) {
    if(value === 'A') {
        return "shadeA";
    } else if (value === 'B') {
        return "shadeB";
    } else if (value === 'C') {
        return "shadeC";
    }
    if(value === "1") {
        return "shade1";
    } else if (value === "2") {
        return "shade2";
    } else if (value === "3") {
        return "shade3";
    } else if (value === "4") {
        return "shade4";
    } else if (value === "5") {
        return "shade5";
    } else if (value === "6") {
        return "shade6";
    } else if (value === "7") {
        return "shade7";
    } else if (value === "8") {
        return "shade8";
    } else if (value === "9") {
        return "shade9";
    } else if (value === "10") {
        return "shade10";
    }
}

// Set statistics tab as default on load
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('stat-btn').click();
});
