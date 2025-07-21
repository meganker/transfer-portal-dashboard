const fs = require('fs');
const csv = require('csv-parser');

function loadTransferData() {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream('./transfers_table.csv')
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', reject);
  });
}

module.exports = { loadTransferData };
