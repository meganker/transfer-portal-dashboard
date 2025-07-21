const express = require('express');
const cors = require('cors');
const { classifyPlayer } = require('./archetype');
const { loadTransferData } = require('./loadCSV');

const app = express();
app.use(cors());

app.get('/api/players', async (req, res) => {
  const raw = await loadTransferData();

  const players = raw.map(p => {
    const parsedPlayer = {
        name: p['Player'],              
        team: p['Team'],                 
        height: "N/A",
        position: "N/A",
        bpm: parseFloat(p['BPM']) || 0,
        dbpm: 0,
        ortg: parseFloat(p['ORtg']) || 0,
        usg: parseFloat(p['Usg']) || 0,
        ast: parseFloat(p['Ast']) || 0,
        tov: parseFloat(p['TO']) || 0,
        three_par: parseFloat(p['3P/10']) || 0,
        three_pct: parseFloat(p['3P']) || 0,
        vorp: parseFloat(p['PRPG!']) || 0,
      };
      
      

    return {
      ...parsedPlayer,
      archetype: classifyPlayer(parsedPlayer),
      fitScore: Math.round((parsedPlayer.bpm + parsedPlayer.vorp) * 10)
    };
  });

  res.json(players);
});

app.listen(3001, () => console.log('API listening on port 3001'));
