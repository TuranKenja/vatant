// Define the path to your CSV file
const csvFilePath = 'data/balkans.csv';  // Replace with the path to your CSV file

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
                    const demoData = {
                        ID: row.ID,
                        country: row.Country,
                        province: row.Province,
                        district: row.District,
                        oneGroup: row.oneGroup,
                        twoGroup: row.twoGroup,
                        threeGroup: row.threeGroup,
                        fourGroup: row.fourGroup,
                        fiveGroup: row.fiveGroup,
                        sixGroup: row.sixGroup,
                        sevenGroup: row.sevenGroup,
                        eightGroup: row.eightGroup,
                        nineGroup: row.nineGroup,
                        tenGroup: row.tenGroup,
                        population: row.Total,
                        serbs: row.Serbs,
                        montenegrins: row.Montenegrins,
                        croats: row.Croats,
                        bosniaks: row.Bosniaks,
                        albanians: row.Albanians,
                        bulgarians: row.Bulgarians,
                        macedonians: row.Macedonians,
                        turks: row.Turks,
                        roma: row.Roma,
                        others: row.Others,
                        unstated: row.Unstated,
                        unknown: row.Unknown,
                        hungarians: row.Hungarians,
                        slovaks: row.Slovaks,
                        aromanians: row.Aromanians,
                        muslims: row.Muslims,
                        yugoslavs: row.Yugoslavs,
                        greeks: row.Greeks,
                        romanians: row.Romanians,
                        gorans: row.Gorans,
                        egyptians: row.Egyptians,
                        ashkali: row.Ashkali,
                        italians: row.Italians,
                        russians: row.Russians,
                        ruthenians: row.Ruthenians,
                        bunjevacis: row.Bunjevacis,
                        slovenians: row.Slovenians,
                        czechs: row.Czechs,
                        ukrainians: row.Ukrainians,
                        germans: row.Germans,
                        poles: row.Poles,
                        jews: row.Jews,
                        austrians: row.Austrians,
                        vlachs: row.Vlachs,
                        armenian: row.Armenian,
                        english: row.English,
                        french: row.French,
                        spanish: row.Spanish,
                        swedish: row.Swedish,
                        finnish: row.Finnish,
                        portuguese: row.Portuguese,
                        dutch: row.Dutch,
                        danish: row.Danish,
                        nigerian: row.Nigerian,
                        sri_lankan: row['Sri Lankan'],
                        indian: row.Indian,
                        pakistan: row.Pakistan,
                        bangladeshi: row.Bangladeshi,
                        chinese: row.Chinese,
                        filippino: row.Filippino,
                        vietnamese: row.Vietnamese,
                        iran: row.Iran,
                        syrians: row.Syrians,
                        turkmenistan: row.Turkmenistan,
                        azerbaijan: row.Azerbaijan,
                        maronite_arabs: row['Maronite Arabs'],
                        sunni_arabs: row['Sunni Arabs'],
                        shia_arabs: row['Shia Arabs'],
                        orthodox_arabs: row['Orthodox Arabs'],
                        copt_arabs: row['Copt Arabs'],
                        catholic_arabs: row['Catholic Arabs']
                    };

                    // Add each object to the ethArray
                    ethArray.push(demoData);
                });

                // Export the array to a file after processing
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
