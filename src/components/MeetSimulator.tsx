import React, { useState } from 'react';
import { Container, Button, Card, Form, InputGroup, Row, Col } from 'react-bootstrap';
import { TeamSetup, MeetState, EventData, LaneEntry, EventResult } from '../types/MeetTypes';
import LaneInputRow from './LaneInputRow';
import EventResults from './EventResults';
import Scoreboard from './Scoreboard';
import ExportButton from './ExportButton';   // ← New import

interface MeetSimulatorProps {
  homeTeam: TeamSetup;
  awayTeam: TeamSetup;
  onBackToSetup: () => void;
}

const TOTAL_EVENTS = 66;

const EVENT_TITLES: string[] = [
  "Girls 12&U 100 Meter IM",
  "Boys 12&U 100 Meter IM",
  "Girls 13-14 100 Meter IM",
  "Boys 13-14 100 Meter IM",
  "Girls 15-18 100 Meter IM",
  "Boys 15-18 200 Meter IM",
  "Girls 8&U 100 Meter Medley Relay",
  "Boys 8&U 100 Meter Medley Relay",
  "Girls 9-10 100 Meter Medley Relay",
  "Boys 9-10 100 Meter Medley Relay",
  "Girls 11-12 200 Meter Medley Relay",
  "Boys 11-12 200 Meter Medley Relay",
  "Girls 13-14 200 Meter Medley Relay",
  "Boys 13-14 200 Meter Medley Relay",
  "Girls 15-18 200 Meter Medley Relay",
  "Boys 15-18 200 Meter Medley Relay",
  "Girls 8&U 25 Meter Freestyle",
  "Boys 8&U 25 Meter Freestyle",
  "Girls 9-10 50 Meter Freestyle",
  "Boys 9-10 50 Meter Freestyle",
  "Girls 11-12 50 Meter Freestyle",
  "Boys 11-12 50 Meter Freestyle",
  "Girls 13-14 100 Meter Freestyle",
  "Boys 13-14 100 Meter Freestyle",
  "Girls 15-18 100 Meter Freestyle",
  "Boys 15-18 100 Meter Freestyle",
  "Girls 8&U 25 Meter Backstroke",
  "Boys 8&U 25 Meter Backstroke",
  "Girls 9-10 25 Meter Backstroke",
  "Boys 9-10 25 Meter Backstroke",
  "Girls 11-12 50 Meter Backstroke",
  "Boys 11-12 50 Meter Backstroke",
  "Girls 13-14 50 Meter Backstroke",
  "Boys 13-14 50 Meter Backstroke",
  "Girls 15-18 50 Meter Backstroke",
  "Boys 15-18 100 Meter Backstroke",
  "Girls 8&U 25 Meter Breaststroke",
  "Boys 8&U 25 Meter Breaststroke",
  "Girls 9-10 25 Meter Breaststroke",
  "Boys 9-10 25 Meter Breaststroke",
  "Girls 11-12 50 Meter Breaststroke",
  "Boys 11-12 50 Meter Breaststroke",
  "Girls 13-14 50 Meter Breaststroke",
  "Boys 13-14 50 Meter Breaststroke",
  "Girls 15-18 50 Meter Breaststroke",
  "Boys 15-18 100 Meter Breaststroke",
  "Girls 8&U 25 Meter Butterfly",
  "Boys 8&U 25 Meter Butterfly",
  "Girls 9-10 25 Meter Butterfly",
  "Boys 9-10 25 Meter Butterfly",
  "Girls 11-12 50 Meter Butterfly",
  "Boys 11-12 50 Meter Butterfly",
  "Girls 13-14 50 Meter Butterfly",
  "Boys 13-14 50 Meter Butterfly",
  "Girls 15-18 50 Meter Butterfly",
  "Boys 15-18 50 Meter Butterfly",
  "Girls 8&U 100 Meter Freestyle Relay",
  "Boys 8&U 100 Meter Freestyle Relay",
  "Girls 9-10 200 Meter Freestyle Relay",
  "Boys 9-10 200 Meter Freestyle Relay",
  "Girls 11-12 200 Meter Freestyle Relay",
  "Boys 11-12 200 Meter Freestyle Relay",
  "Girls 13-14 200 Meter Freestyle Relay",
  "Boys 13-14 200 Meter Freestyle Relay",
  "Girls 15-18 200 Meter Freestyle Relay",
  "Boys 15-18 200 Meter Freestyle Relay"
];

const MeetSimulator: React.FC<MeetSimulatorProps> = ({
  homeTeam,
  awayTeam,
  onBackToSetup,
}) => {
  const [meetState, setMeetState] = useState<MeetState>(() => {
    const initialEvents: EventData[] = Array.from({ length: TOTAL_EVENTS }, (_, i) => ({
      eventNumber: i + 1,
      title: EVENT_TITLES[i] || `Event ${i + 1}`,
      isRelay: (i >= 6 && i <= 15) || (i >= 56 && i <= 65),
      entries: Array.from({ length: 6 }, (_, laneIndex) => ({
        lane: laneIndex + 1,
        name: '',
        teamAbbr: (laneIndex + 1) % 2 === 1 ? homeTeam.abbreviation : awayTeam.abbreviation,
        time: '',
      })),
      results: undefined,
    }));

    return {
      homeTeam,
      awayTeam,
      events: initialEvents,
      currentEventIndex: 0,
      homeScore: 0,
      awayScore: 0,
    };
  });

  const currentEvent = meetState.events[meetState.currentEventIndex];

  const [searchTerm, setSearchTerm] = useState('');

  const filteredEvents = meetState.events.filter(event =>
    event.eventNumber.toString().includes(searchTerm) ||
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const normalizeTime = (timeStr: string): string => timeStr.trim().toUpperCase();

  const timeToSeconds = (timeStr: string): number => {
    const normalized = normalizeTime(timeStr);
    if (normalized === 'DQ' || !timeStr) return Infinity;
    const parts = timeStr.split(':');
    if (parts.length === 2) {
      return parseInt(parts[0]) * 60 + parseFloat(parts[1]);
    }
    return parseFloat(timeStr);
  };

  const isDQ = (timeStr: string): boolean => normalizeTime(timeStr) === 'DQ';

  const simulateEvent = () => {
    const { entries, isRelay } = currentEvent;
    const validEntries = entries.filter(e => e.name.trim() !== '' && e.time.trim() !== '');

    if (validEntries.length === 0) {
      alert('Please enter at least one swimmer with a time or DQ.');
      return;
    }

    const sorted = [...validEntries].sort((a, b) => {
      const aDQ = isDQ(a.time);
      const bDQ = isDQ(b.time);
      if (aDQ && bDQ) return 0;
      if (aDQ) return 1;
      if (bDQ) return -1;
      return timeToSeconds(a.time) - timeToSeconds(b.time);
    });

    const results: EventResult[] = sorted.map((entry, index) => {
      const place = index + 1;
      const dq = isDQ(entry.time);
      let points = 0;

      if (!dq) {
        if (isRelay) points = place === 1 ? 7 : 0;
        else {
          if (place === 1) points = 5;
          else if (place === 2) points = 3;
          else if (place === 3) points = 1;
        }
      }

      return {
        place: dq ? 0 : place,
        name: entry.name,
        teamAbbr: entry.teamAbbr,
        time: entry.time,
        points,
        lane: entry.lane,
        isDQ: dq,
      };
    });

    let homePoints = 0;
    let awayPoints = 0;
    results.forEach(r => {
      if (r.teamAbbr === homeTeam.abbreviation) homePoints += r.points;
      else if (r.teamAbbr === awayTeam.abbreviation) awayPoints += r.points;
    });

    setMeetState(prev => {
      const newEvents = [...prev.events];
      newEvents[prev.currentEventIndex] = { ...currentEvent, results };
      return {
        ...prev,
        events: newEvents,
        homeScore: prev.homeScore + homePoints,
        awayScore: prev.awayScore + awayPoints,
      };
    });
  };

  const editCurrentEvent = () => {
    if (!currentEvent.results) return;

    let homePointsToRemove = 0;
    let awayPointsToRemove = 0;

    currentEvent.results.forEach(r => {
      if (r.teamAbbr === homeTeam.abbreviation) homePointsToRemove += r.points;
      else if (r.teamAbbr === awayTeam.abbreviation) awayPointsToRemove += r.points;
    });

    setMeetState(prev => {
      const newEvents = [...prev.events];
      newEvents[prev.currentEventIndex] = { ...newEvents[prev.currentEventIndex], results: undefined };

      return {
        ...prev,
        events: newEvents,
        homeScore: Math.max(0, prev.homeScore - homePointsToRemove),
        awayScore: Math.max(0, prev.awayScore - awayPointsToRemove),
      };
    });
  };

  const resetCurrentEvent = () => {
    setMeetState(prev => {
      const event = prev.events[prev.currentEventIndex];
      const previousResults = event.results;

      let newHomeScore = prev.homeScore;
      let newAwayScore = prev.awayScore;

      if (previousResults) {
        previousResults.forEach(r => {
          if (r.teamAbbr === prev.homeTeam.abbreviation) newHomeScore -= r.points;
          else if (r.teamAbbr === prev.awayTeam.abbreviation) newAwayScore -= r.points;
        });
      }

      const newEvents = [...prev.events];
      newEvents[prev.currentEventIndex] = {
        ...newEvents[prev.currentEventIndex],
        entries: Array.from({ length: 6 }, (_, laneIndex) => ({
          lane: laneIndex + 1,
          name: '',
          teamAbbr: (laneIndex + 1) % 2 === 1 ? prev.homeTeam.abbreviation : prev.awayTeam.abbreviation,
          time: '',
        })),
        results: undefined,
      };

      return {
        ...prev,
        events: newEvents,
        homeScore: Math.max(0, newHomeScore),
        awayScore: Math.max(0, newAwayScore),
      };
    });
  };

  const goToEvent = (index: number) => {
    if (index >= 0 && index < TOTAL_EVENTS) {
      setMeetState(prev => ({ ...prev, currentEventIndex: index }));
      setSearchTerm('');
    }
  };

  const nextEvent = () => goToEvent(meetState.currentEventIndex + 1);
  const prevEvent = () => goToEvent(meetState.currentEventIndex - 1);

  const updateLane = (updatedLane: LaneEntry) => {
    setMeetState(prev => {
      const newEvents = [...prev.events];
      const event = newEvents[prev.currentEventIndex];
      const laneIndex = event.entries.findIndex(e => e.lane === updatedLane.lane);
      if (laneIndex !== -1) {
        event.entries[laneIndex] = updatedLane;
      }
      return { ...prev, events: newEvents };
    });
  };

  return (
    <div className="meet-simulator">
      <Container className="py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Button variant="secondary" onClick={onBackToSetup}>
            ← Back to Setup
          </Button>
          <h1 className="text-center">Swim Meet Simulator</h1>
          <div>Event {currentEvent.eventNumber} of {TOTAL_EVENTS}</div>
        </div>

        <Scoreboard
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          homeScore={meetState.homeScore}
          awayScore={meetState.awayScore}
        />

        {/* Quick Jump Navigation */}
        <Card className="mb-4">
          <Card.Body>
            <Row className="align-items-center">
              <Col md={7}>
                <InputGroup>
                  <InputGroup.Text>🔍</InputGroup.Text>
                  <Form.Control
                    placeholder="Search event number or keyword (e.g. Butterfly, 11-12, Breaststroke)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </Col>
              <Col md={5}>
                <Form.Select 
                  onChange={(e) => goToEvent(parseInt(e.target.value) - 1)}
                  value={currentEvent.eventNumber}
                >
                  {filteredEvents.map(event => (
                    <option key={event.eventNumber} value={event.eventNumber}>
                      {event.eventNumber}: {event.title}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Card className="mb-4">
          <Card.Body>
            <h3>
              Event {currentEvent.eventNumber}: {currentEvent.title}
              {currentEvent.isRelay && <span className="text-muted ms-2">(Relay)</span>}
            </h3>
          </Card.Body>
        </Card>

        <Card className="mb-4">
          <Card.Header>
            <h5>Lane Entries</h5>
          </Card.Header>
          <Card.Body>
            {currentEvent.entries.map((lane) => (
              <LaneInputRow
                key={lane.lane}
                lane={lane}
                homeTeam={homeTeam}
                awayTeam={awayTeam}
                onUpdate={updateLane}
                disabled={!!currentEvent.results}
                isRelay={currentEvent.isRelay}
              />
            ))}
          </Card.Body>
          <Card.Footer className="d-flex gap-2 flex-wrap">
            <Button 
              variant="primary" 
              onClick={simulateEvent}
              disabled={!!currentEvent.results}
            >
              Simulate Event
            </Button>

            {currentEvent.results && (
              <Button 
                variant="warning" 
                onClick={editCurrentEvent}
              >
                Edit Event
              </Button>
            )}

            <Button 
              variant="outline-secondary" 
              onClick={resetCurrentEvent}
            >
              Reset Event
            </Button>

            {/* Export Button */}
            <ExportButton 
              meetState={meetState} 
              homeTeam={homeTeam} 
              awayTeam={awayTeam} 
            />
          </Card.Footer>
        </Card>

        {currentEvent.results && (
          <EventResults 
            results={currentEvent.results} 
            isRelay={currentEvent.isRelay} 
          />
        )}

        <div className="d-flex justify-content-between mt-4">
          <Button 
            variant="outline-primary" 
            onClick={prevEvent}
            disabled={meetState.currentEventIndex === 0}
          >
            ← Previous
          </Button>
          
          <div className="d-flex gap-2">
            <Button variant="outline-info" onClick={() => goToEvent(0)}>
              First
            </Button>
            <Button variant="outline-info" onClick={() => goToEvent(TOTAL_EVENTS - 1)}>
              Last
            </Button>
          </div>

          <Button 
            variant="primary" 
            onClick={nextEvent}
            disabled={meetState.currentEventIndex === TOTAL_EVENTS - 1}
          >
            Next →
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default MeetSimulator;