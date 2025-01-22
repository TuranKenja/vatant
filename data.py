import pandas as pd

url = "http://pop-stat.mashke.org/russia-census-2010-ethnic/arhangelskaja.htm"
tables = pd.read_html(url)  # Reads all tables from the webpage
print(len(tables))  # Check how many tables are found

# Save the first table to a CSV
tables[0].to_csv("output.csv", index=False)

