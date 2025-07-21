import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [players, setPlayers] = useState([]);
  const [successMap, setSuccessMap] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [sortKey, setSortKey] = useState('vorp');
  const [sortAsc, setSortAsc] = useState(false);

const [showTeamFilters, setShowTeamFilters] = useState(true);
const [showArchetypeFilters, setShowArchetypeFilters] = useState(true);


  const [filters, setFilters] = useState({
    team: [],
    archetype: [],
    success_probability: [0, 1]
  });

  useEffect(() => {
    fetch('http://localhost:3001/api/players')
      .then(res => res.json())
      .then(data => setPlayers(data));

    fetch('/success_probabilities.json')
      .then(res => res.json())
      .then(data => {
        const map = {};
        data.forEach(p => {
          map[p.Player.toLowerCase()] = p.success_probability;
        });
        setSuccessMap(map);
      });
  }, []);

  const mergedPlayers = players.map(p => ({
    ...p,
    success_probability: successMap[p.name?.toLowerCase()] ?? null
  }));

  // Filtered and sorted players
  const filteredPlayers = mergedPlayers.filter(p => {
    const prob = p.success_probability ?? 0;
    const teamMatch = filters.team.length === 0 || filters.team.includes(p.team);
    const archetypeMatch = filters.archetype.length === 0 || filters.archetype.includes(p.archetype);
    const probMatch = prob >= filters.success_probability[0] && prob <= filters.success_probability[1];
    return teamMatch && archetypeMatch && probMatch;
  });

  const sortedPlayers = [...filteredPlayers].sort((a, b) => {
    const valA = a[sortKey] ?? 0;
    const valB = b[sortKey] ?? 0;
    return sortAsc ? valA - valB : valB - valA;
  });

  const columns = [
    'name', 'team', 'vorp', 'bpm', 'usg', 'ortg',
    'ast', 'tov', 'three_pct', 'archetype', 'success_probability'
  ];

  const uniqueTeams = [...new Set(mergedPlayers.map(p => p.team))].filter(Boolean);
  const uniqueArchetypes = [...new Set(mergedPlayers.map(p => p.archetype))].filter(Boolean);

  return (
    <div className="container">
      <h1 className="title">Transfer Portal Dashboard</h1>

      <button className="filter-btn" onClick={() => setShowFilters(!showFilters)}>Filters</button>
      <div className={`sidebar ${!showFilters ? 'hidden' : ''}`}>
  <h3 onClick={() => setShowTeamFilters(!showTeamFilters)} style={{ cursor: 'pointer' }}>
    Filter by Team {showTeamFilters ? '▲' : '▼'}
  </h3>
  {showTeamFilters && (
    <div className="checkbox-grid">
      {uniqueTeams.map(team => (
        <label key={team}>
          <input
            type="checkbox"
            checked={filters.team.includes(team)}
            onChange={() => {
              const newTeam = filters.team.includes(team)
                ? filters.team.filter(t => t !== team)
                : [...filters.team, team];
              setFilters({ ...filters, team: newTeam });
            }}
          />
          {team}
        </label>
      ))}
    </div>
  )}

  <h3 onClick={() => setShowArchetypeFilters(!showArchetypeFilters)} style={{ cursor: 'pointer' }}>
    Filter by Archetype {showArchetypeFilters ? '▲' : '▼'}
  </h3>
  {showArchetypeFilters && (
    <div className="checkbox-grid">
      {uniqueArchetypes.map(arch => (
        <label key={arch}>
          <input
            type="checkbox"
            checked={filters.archetype.includes(arch)}
            onChange={() => {
              const newArch = filters.archetype.includes(arch)
                ? filters.archetype.filter(a => a !== arch)
                : [...filters.archetype, arch];
              setFilters({ ...filters, archetype: newArch });
            }}
          />
          {arch}
        </label>
      ))}
    </div>
  )}

          <h3>Success Probability</h3>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={filters.success_probability[0]}
            onChange={e => setFilters({ ...filters, success_probability: [parseFloat(e.target.value), filters.success_probability[1]] })}
          />
          <span>{(filters.success_probability[0] * 100).toFixed(0)}%</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={filters.success_probability[1]}
            onChange={e => setFilters({ ...filters, success_probability: [filters.success_probability[0], parseFloat(e.target.value)] })}
          />
          <span>{(filters.success_probability[1] * 100).toFixed(0)}%</span>
        </div>

      <table className="leaderboard">
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col} onClick={() => {
                if (sortKey === col) {
                  setSortAsc(!sortAsc);
                } else {
                  setSortKey(col);
                  setSortAsc(false);
                }
              }}>
                {col.toUpperCase()} {sortKey === col ? (sortAsc ? '↑' : '↓') : ''}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedPlayers.map((p, i) => (
            <tr key={i}>
              {columns.map(col => (
                <td
                  key={col}
                  style={col === 'success_probability' ? {
                    backgroundColor:
                      p[col] > 0.8 ? '#10b981' :
                      p[col] > 0.5 ? '#f59e0b' :
                      '#ef4444',
                    fontWeight: 'bold'
                  } : {}}
                >
                  {col === 'success_probability'
                    ? (p[col] != null ? `${(p[col] * 100).toFixed(1)}%` : 'N/A')
                    : p[col] ?? 'N/A'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
