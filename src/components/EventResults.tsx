import React from 'react';
import { Table, Card } from 'react-bootstrap';
import { EventResult } from '../types/MeetTypes';

interface EventResultsProps {
  results: EventResult[];
  isRelay: boolean;
}

const EventResults: React.FC<EventResultsProps> = ({ results, isRelay }) => {
  if (results.length === 0) {
    return null;
  }

  return (
    <Card className="mb-4">
      <Card.Header>
        <h5>Event Results</h5>
      </Card.Header>
      <Card.Body>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Place</th>
              <th>Name</th>
              <th>Team</th>
              <th>Time</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => (
              <tr key={index}>
                <td>
                  {result.isDQ ? (
                    <span className="text-danger fw-bold">DQ</span>
                  ) : (
                    result.place
                  )}
                </td>
                <td>{result.name}</td>
                <td>{result.teamAbbr}</td>
                <td className={result.isDQ ? 'text-danger fw-bold' : ''}>
                  {result.isDQ ? 'DQ' : result.time}
                </td>
                <td className={result.points > 0 ? 'fw-bold text-success' : ''}>
                  {result.points}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default EventResults;