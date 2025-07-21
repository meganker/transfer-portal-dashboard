const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeTransfers() {
  const url = 'https://barttorvik.com/playerstat.php?xvalue=trans&year=2025';
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);

  const players = [];

  $('table.stats-table tbody tr').each((i, row) => {
    const cells = $(row).find('td');
    if (cells.length < 15) return; 

    const player = {
      name: $(cells[0]).text().trim(),
      school: $(cells[1]).text().trim(),
      height: $(cells[2]).text().trim(),
      position: $(cells[3]).text().trim(),
      class: $(cells[4]).text().trim(),
      bpm: parseFloat($(cells[5]).text().trim()) || 0,
      dbpm: parseFloat($(cells[6]).text().trim()) || 0,
      ortg: parseFloat($(cells[7]).text().trim()) || 0,
      usg: parseFloat($(cells[8]).text().trim()) || 0,
      ast: parseFloat($(cells[9]).text().trim()) || 0,
      tov: parseFloat($(cells[10]).text().trim()) || 0,
      three_par: parseFloat($(cells[11]).text().trim()) || 0,
      three_pct: parseFloat($(cells[12]).text().trim()) || 0,
      vorp: parseFloat($(cells[13]).text().trim()) || 0,
    };

    players.push(player);
  });

  return players;
}

module.exports = { scrapeTransfers };