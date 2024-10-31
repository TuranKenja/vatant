async function dataSetup() {
    await initializeSelection();

// Define the path to your CSV file
console.log("data objects region", regionSelection);
const csvFilePath = `data/${regionSelection}/regionInfo.csv`;  // Replace with the path to your CSV file
console.log("data objects region 2", regionSelection);

// Declare ethArray to store the parsed data
let ethArray = [];

// Use fetch to load the CSV file
fetch(csvFilePath)
    .then(response => response.text())
    .then(csvText => {
        // Parse the CSV file content using PapaParse
        Papa.parse(csvText, {
            header: true,  // Treat the first row as headers
            dynamicTyping: true,  // Automatically typecast values (numbers, etc.)
            complete: function(results) {
                const data = results.data;

                // Iterate through each row in the CSV file and create objects

                data.forEach((row) => {
                    const demoData = Object.keys(row).reduce((acc, key) => {
                        acc[key] = row[key];
                        return acc;
                    }, {});
                    
                    ethArray.push(demoData);
                });

                exportToFile(ethArray, 'ethArray.json');
            }
        });
    })
    .catch(error => console.error('Error loading the CSV file:', error));

// Function to export array to a file
function exportToFile(data, filename) {
    const json = JSON.stringify(data, null, 2); // Convert data to JSON string
    const blob = new Blob([json], { type: 'application/json' }); // Create a new Blob with the data
    const url = URL.createObjectURL(blob); // Create a URL for the Blob

    // Create a download link and click it programmatically
    const a = document.createElement('a');
    a.href = url;
    a.download = filename; // Specify the filename
    document.body.appendChild(a); // Append the link to the document
    a.click(); // Simulate a click to start the download
    document.body.removeChild(a); // Remove the link after download
}
} 

dataSetup();