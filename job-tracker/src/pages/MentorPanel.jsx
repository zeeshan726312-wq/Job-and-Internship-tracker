import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Check, X, Calendar } from 'lucide-react';

const MentorPanel = () => {
  const { mentorships, updateMentorshipStatus } = useContext(AppContext);
  const mentorName = 'Alice Johnson'; // Mock mentor

  const myRequests = mentorships.filter(m => m.mentorName === mentorName);

  return (
    <div className="panel-container">
      <h2 className="panel-title">Mentor Dashboard</h2>
      
      <div className="card full-width">
        <h3>Mentorship Requests</h3>
        <p>Review and manage your mentees.</p>
        <div className="list mt-4">
          {myRequests.length === 0 ? <p>No mentorship requests yet.</p> : null}
          {myRequests.map(req => (
            <div key={req.id} className="list-item">
              <div className="item-info">
                <h4>{req.menteeName}</h4>
                <p>Status: <span className={`status ${req.status.toLowerCase()}`}>{req.status}</span></p>
              </div>
              
              {req.status === 'Pending' && (
                <div className="action-btns">
                  <button className="btn-icon text-green" onClick={() => updateMentorshipStatus(req.id, 'Accepted')}>
                    <Check />
                  </button>
                  <button className="btn-icon text-red" onClick={() => updateMentorshipStatus(req.id, 'Declined')}>
                    <X />
                  </button>
                </div>
              )}
              {req.status === 'Accepted' && (
                <button className="btn secondary">
                  <Calendar className="icon-sm" /> Schedule Session
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MentorPanel;
