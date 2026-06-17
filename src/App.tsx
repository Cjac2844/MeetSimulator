import React, { useState } from 'react';
import './App.css';
import MeetSetupPage, { TeamSetup } from './components/MeetSetupPage';
import MeetSimulator from './components/MeetSimulator';

function App() {
  const [meetStarted, setMeetStarted] = useState(false);
  const [homeTeam, setHomeTeam] = useState<TeamSetup | null>(null);
  const [awayTeam, setAwayTeam] = useState<TeamSetup | null>(null);

  const handleStartMeet = (home: TeamSetup, away: TeamSetup) => {
    setHomeTeam(home);
    setAwayTeam(away);
    setMeetStarted(true);
  };

  const handleBackToSetup = () => {
    setMeetStarted(false);
    setHomeTeam(null);
    setAwayTeam(null);
  };

  if (meetStarted && homeTeam && awayTeam) {
    return (
      <MeetSimulator 
        homeTeam={homeTeam} 
        awayTeam={awayTeam} 
        onBackToSetup={handleBackToSetup} 
      />
    );
  }

  return <MeetSetupPage onStartMeet={handleStartMeet} />;
}

export default App;

