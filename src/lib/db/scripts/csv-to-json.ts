import * as fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import csv from 'csv-parser';

function csvToJson(csvFilePath: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const results: any[] = [];

    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (data) => {
        results.push(data);
      })
      .on('end', () => {
        resolve(results);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

function createRelativePathInESM(relativePath: string) {
  // Convert the import.meta.url to a file path string
  const __filename = fileURLToPath(import.meta.url);

  // Derive the directory name from that file path
  const __dirname = path.dirname(__filename);

  // Now you can create paths relative to this current file
  return path.join(__dirname, relativePath);
}

export async function main(csvFilePath: string) {
  if (!csvFilePath) {
    console.error('Please provide a CSV file path as an argument.');
    process.exit(1);
  }
  const standarizedCsvFilePath = createRelativePathInESM(csvFilePath);

  try {
    const jsonData = await csvToJson(standarizedCsvFilePath);
    // Print to console, or write to a file:
    const outputFilePath = createRelativePathInESM(csvFilePath.replace(/\.csv$/i, '.json'));
    fs.writeFileSync(outputFilePath, JSON.stringify(jsonData, null, 2));
    console.log(`JSON data written to ${outputFilePath}`);
  } catch (error) {
    console.error('Error converting CSV to JSON:', error);
  }
}

(async () => {
  await main('../data/questionnaire_junction.csv');
})();
