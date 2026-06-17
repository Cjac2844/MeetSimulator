import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import '../styles/MeetSetupPage.css';

export interface TeamSetup {
  name: string;
  abbreviation: string;
  type: 'Home' | 'Away';
}

interface MeetSetupPageProps {
  onStartMeet: (homeTeam: TeamSetup, awayTeam: TeamSetup) => void;
}

function MeetSetupPage({ onStartMeet }: MeetSetupPageProps) {
  const [homeTeam, setHomeTeam] = useState<TeamSetup>({
    name: '',
    abbreviation: '',
    type: 'Home',
  });

  const [awayTeam, setAwayTeam] = useState<TeamSetup>({
    name: '',
    abbreviation: '',
    type: 'Away',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleAbbreviationChange = (
    value: string,
    teamType: 'home' | 'away'
  ) => {
    // Only allow letters and limit to 2 characters
    const sanitized = value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 2);
    
    if (teamType === 'home') {
      setHomeTeam({ ...homeTeam, abbreviation: sanitized });
    } else {
      setAwayTeam({ ...awayTeam, abbreviation: sanitized });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!homeTeam.name.trim()) {
      newErrors.homeName = 'Home team name is required';
    }
    if (!homeTeam.abbreviation.trim()) {
      newErrors.homeAbbr = 'Home team abbreviation is required';
    }
    if (homeTeam.abbreviation.length !== 2) {
      newErrors.homeAbbr = 'Abbreviation must be exactly 2 letters';
    }

    if (!awayTeam.name.trim()) {
      newErrors.awayName = 'Away team name is required';
    }
    if (!awayTeam.abbreviation.trim()) {
      newErrors.awayAbbr = 'Away team abbreviation is required';
    }
    if (awayTeam.abbreviation.length !== 2) {
      newErrors.awayAbbr = 'Abbreviation must be exactly 2 letters';
    }

    // Check for duplicate abbreviations
    if (
      homeTeam.abbreviation &&
      awayTeam.abbreviation &&
      homeTeam.abbreviation === awayTeam.abbreviation
    ) {
      newErrors.duplicate = 'Team abbreviations must be different';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStartMeet = () => {
    if (validateForm()) {
      onStartMeet(homeTeam, awayTeam);
    }
  };

  return (
    <div className="meet-setup-page">
      <Container className="py-5">
        <div className="setup-header mb-5">
          <h1 className="setup-title">Swim Meet Simulator</h1>
          <p className="setup-subtitle">Set up your teams and start planning strategy</p>
        </div>

        <Row className="g-4 mb-5">
          {/* Home Team Card */}
          <Col lg={6}>
            <Card className="team-card home-team-card">
              <Card.Body>
                <div className="team-label home-label">HOME TEAM</div>

                <Form.Group className="mb-3">
                  <Form.Label className="form-label">Team Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., Haddon Glen"
                    value={homeTeam.name}
                    onChange={(e) =>
                      setHomeTeam({ ...homeTeam, name: e.target.value })
                    }
                    className={errors.homeName ? 'is-invalid' : ''}
                    isInvalid={!!errors.homeName}
                  />
                  {errors.homeName && (
                    <Form.Control.Feedback type="invalid">
                      {errors.homeName}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>

                <Form.Group>
                  <Form.Label className="form-label">Abbreviation</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., HG"
                    maxLength={2}
                    value={homeTeam.abbreviation}
                    onChange={(e) =>
                      handleAbbreviationChange(e.target.value, 'home')
                    }
                    className={
                      errors.homeAbbr || errors.duplicate ? 'is-invalid' : ''
                    }
                    isInvalid={!!errors.homeAbbr || !!errors.duplicate}
                  />
                  {(errors.homeAbbr || errors.duplicate) && (
                    <Form.Control.Feedback type="invalid">
                      {errors.homeAbbr || errors.duplicate}
                    </Form.Control.Feedback>
                  )}
                  <small className="text-muted">2 letters only</small>
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>

          {/* Away Team Card */}
          <Col lg={6}>
            <Card className="team-card away-team-card">
              <Card.Body>
                <div className="team-label away-label">AWAY TEAM</div>

                <Form.Group className="mb-3">
                  <Form.Label className="form-label">Team Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., Rival Club"
                    value={awayTeam.name}
                    onChange={(e) =>
                      setAwayTeam({ ...awayTeam, name: e.target.value })
                    }
                    className={errors.awayName ? 'is-invalid' : ''}
                    isInvalid={!!errors.awayName}
                  />
                  {errors.awayName && (
                    <Form.Control.Feedback type="invalid">
                      {errors.awayName}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>

                <Form.Group>
                  <Form.Label className="form-label">Abbreviation</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., RC"
                    maxLength={2}
                    value={awayTeam.abbreviation}
                    onChange={(e) =>
                      handleAbbreviationChange(e.target.value, 'away')
                    }
                    className={
                      errors.awayAbbr || errors.duplicate ? 'is-invalid' : ''
                    }
                    isInvalid={!!errors.awayAbbr || !!errors.duplicate}
                  />
                  {(errors.awayAbbr || errors.duplicate) && (
                    <Form.Control.Feedback type="invalid">
                      {errors.awayAbbr || errors.duplicate}
                    </Form.Control.Feedback>
                  )}
                  <small className="text-muted">2 letters only</small>
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Start Button */}
        <Row>
          <Col className="d-flex justify-content-center">
            <Button
              size="lg"
              className="start-button"
              onClick={handleStartMeet}
            >
              Start Simulation
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default MeetSetupPage;