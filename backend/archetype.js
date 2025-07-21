function classifyPlayer(p) {
    const { usg, ast, tov, dbpm, three_par, three_pct, height, position } = p;
  
    const heightInInches = parseHeight(height);
  
    if (usg > 25 && ast > 20) return 'Shot Creator';
    if (three_par > 40 && dbpm > 1.0 && heightInInches >= 76) return '3&D Wing';
    if (heightInInches >= 80 && three_par > 30 && tov < 15) return 'Stretch Big';
    if (heightInInches >= 80 && dbpm > 2.5 && usg < 20) return 'Rim Protector';
    if (usg < 18 && ast > 15 && tov < 12) return 'Glue Guy';
    if (usg > 27 && ast < 10) return 'Volume Scorer';
  
    return 'Versatile';
  }
  
  function parseHeight(hStr) {
    if (!hStr) return 0;
  
    const str = String(hStr).trim(); 
    const match = str.match(/(\d)'(\d{1,2})/);
    if (!match) return 0;
  
    return parseInt(match[1]) * 12 + parseInt(match[2]);
  }
  
  
  module.exports = { classifyPlayer };
  