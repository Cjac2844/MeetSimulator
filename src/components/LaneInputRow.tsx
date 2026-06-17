import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { LaneEntry, TeamSetup } from '../types/MeetTypes';

interface LaneInputRowProps {
  lane: LaneEntry;
  homeTeam: TeamSetup;
  awayTeam: TeamSetup;
  onUpdate: (updatedLane: LaneEntry) => void;
  disabled?: boolean;
  isRelay?: boolean;        // ← New prop
}

const LaneInputRow: React.FC<LaneInputRowProps> = ({
  lane,
  homeTeam,
  awayTeam,
  onUpdate,
  disabled = false,
  isRelay = false,
}) => {
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...lane, name: e.target.value });
  };

  const handleTeamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdate({ ...lane, teamAbbr: e.target.value });
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...lane, time: e.target.value });
  };

  const namePlaceholder = isRelay ? "Relay Name (e.g. HG A Team)" : "Swimmer Name";

  return (
    <Row className="mb-3 align-items-center lane-row">
      <Col xs={1}>
        <strong>Lane {lane.lane}</strong>
      </Col>
      <Col xs={4}>
        <Form.Control
          type="text"
          placeholder={namePlaceholder}
          value={lane.name}
          onChange={handleNameChange}
          disabled={disabled}
        />
      </Col>
      <Col xs={3}>
        <Form.Select
          value={lane.teamAbbr}
          onChange={handleTeamChange}
          disabled={disabled}
        >
          <option value={homeTeam.abbreviation}>{homeTeam.abbreviation} (Home)</option>
          <option value={awayTeam.abbreviation}>{awayTeam.abbreviation} (Away)</option>
        </Form.Select>
      </Col>
      <Col xs={4}>
        <Form.Control
          type="text"
          placeholder="Time (e.g. 32.95 or 1:01.66 or DQ)"
          value={lane.time}
          onChange={handleTimeChange}
          disabled={disabled}
        />
      </Col>
    </Row>
  );
};

export default LaneInputRow;