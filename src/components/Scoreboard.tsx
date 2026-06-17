import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { TeamSetup } from '../types/MeetTypes';

interface ScoreboardProps {
  homeTeam: TeamSetup;
  awayTeam: TeamSetup;
  homeScore: number;
  awayScore: number;
}

const Scoreboard: React.FC<ScoreboardProps> = ({
  homeTeam,
  awayTeam,
  homeScore,
  awayScore,
}) => {
  return (
    <Card className="scoreboard mb-4">
      <Card.Header className="text-center fw-bold">MEET SCORE</Card.Header>
      <Card.Body>
        <Row className="text-center">
          <Col>
            <div className="team-name">{homeTeam.name}</div>
            <div className="score-value display-4 text-primary">{homeScore}</div>
            <div className="team-abbr">{homeTeam.abbreviation}</div>
          </Col>
          <Col>
            <div className="vs text-muted">VS</div>
          </Col>
          <Col>
            <div className="team-name">{awayTeam.name}</div>
            <div className="score-value display-4 text-danger">{awayScore}</div>
            <div className="team-abbr">{awayTeam.abbreviation}</div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default Scoreboard;