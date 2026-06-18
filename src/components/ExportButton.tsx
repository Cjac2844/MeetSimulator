import React from 'react';
import { Button } from 'react-bootstrap';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MeetState, TeamSetup } from '../types/MeetTypes';

interface ExportButtonProps {
  meetState: MeetState;
  homeTeam: TeamSetup;
  awayTeam: TeamSetup;
}

const ExportButton: React.FC<ExportButtonProps> = ({ meetState, homeTeam, awayTeam }) => {
  const exportToPDF = () => {
    const doc = new jsPDF();
    let y = 20;

    // Title
    doc.setFontSize(20);
    doc.text(`${homeTeam.name} (${homeTeam.abbreviation}) vs ${awayTeam.name} (${awayTeam.abbreviation})`, 20, y);
    y += 15;

    // Final Score
    doc.setFontSize(16);
    doc.text(`FINAL SCORE: ${homeTeam.abbreviation} ${meetState.homeScore}  -  ${awayTeam.abbreviation} ${meetState.awayScore}`, 20, y);
    y += 20;

    const completedEvents = meetState.events.filter(e => e.results && e.results.length > 0);

    completedEvents.forEach((event, index) => {
      if (y > 240) {
        doc.addPage();
        y = 20;
      }

      // Event Header
      doc.setFontSize(14);
      doc.text(`Event ${event.eventNumber}: ${event.title}`, 20, y);
      y += 10;

      if (event.results) {
        const tableData = event.results.map(result => [
          result.isDQ ? 'DQ' : result.place.toString(),
          result.name,
          result.teamAbbr,
          result.isDQ ? 'DQ' : result.time,
          result.points.toString()
        ]);

        autoTable(doc, {
          startY: y,
          head: [['Place', 'Name', 'Team', 'Time', 'Points']],
          body: tableData,
          theme: 'striped',
          headStyles: { fillColor: [0, 123, 255], fontSize: 11 },
          bodyStyles: { fontSize: 10 },
          alternateRowStyles: { fillColor: [245, 245, 245] },
          margin: { left: 20, right: 20 },
          styles: { cellPadding: 4 }
        });

        // Get the new Y position after table
        y = (doc as any).lastAutoTable.finalY + 15;
      } else {
        y += 15;
      }
    });

    // Footer
    doc.setFontSize(10);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 20, doc.internal.pageSize.height - 15);

    doc.save(`Swim_Meet_Results_${homeTeam.abbreviation}_vs_${awayTeam.abbreviation}.pdf`);
  };

  return (
    <Button variant="success" onClick={exportToPDF}>
      📄 Export Full Results to PDF
    </Button>
  );
};

export default ExportButton;