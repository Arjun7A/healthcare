import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/useAuth';
import { supabase } from '../../../lib/supabaseClient';
import '../../../styles/components/MoodHistory.css';

const MoodHistory = ({ refreshTrigger }) => {
  const [moodEntries, setMoodEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const moodLabels = {
    1: { emoji: '😢', label: 'Very Sad', color: '#e74c3c' },
    2: { emoji: '😔', label: 'Sad', color: '#f39c12' },
    3: { emoji: '😐', label: 'Neutral', color: '#95a5a6' },
    4: { emoji: '😊', label: 'Happy', color: '#2ecc71' },
    5: { emoji: '😄', label: 'Very Happy', color: '#27ae60' }
  };

  const fetchMoodEntries = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      setMoodEntries(data || []);
    } catch (err) {
      console.error('Error fetching mood entries:', err);
      setError('Failed to load mood history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMoodEntries();
  }, [user, refreshTrigger]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const calculateAverageMood = () => {
    if (moodEntries.length === 0) return 0;
    const sum = moodEntries.reduce((acc, entry) => acc + entry.mood_score, 0);
    return (sum / moodEntries.length).toFixed(1);
  };

  if (loading) {
    return (
      <div className="mood-history loading">
        <div className="loading-spinner"></div>
        <p>Loading your mood history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mood-history error">
        <p>{error}</p>
        <button onClick={fetchMoodEntries} className="retry-btn">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="mood-history">
      <div className="mood-history-header">
        <h3>Your Mood Journey</h3>
        {moodEntries.length > 0 && (
          <div className="mood-average">
            <span className="average-label">Recent Average:</span>
            <span className="average-score">
              {moodLabels[Math.round(calculateAverageMood())]?.emoji} {calculateAverageMood()}/5
            </span>
          </div>
        )}
      </div>

      {moodEntries.length === 0 ? (
        <div className="no-entries">
          <div className="no-entries-icon">📊</div>
          <h4>No mood entries yet</h4>
          <p>Start logging your moods to see your emotional journey over time!</p>
        </div>
      ) : (
        <div className="mood-timeline">
          {moodEntries.map((entry) => {
            const mood = moodLabels[entry.mood_score];
            return (
              <div key={entry.id} className="mood-entry">
                <div className="mood-entry-mood">
                  <span 
                    className="mood-emoji-large"
                    style={{ color: mood.color }}
                  >
                    {mood.emoji}
                  </span>
                  <span className="mood-score">{entry.mood_score}/5</span>
                </div>
                
                <div className="mood-entry-content">
                  <div className="mood-entry-header">
                    <span className="mood-label">{mood.label}</span>
                    <span className="mood-date">{formatDate(entry.created_at)}</span>
                  </div>
                  
                  {entry.notes && (
                    <div className="mood-notes">
                      <p>"{entry.notes}"</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {moodEntries.length >= 10 && (
        <div className="view-more">
          <p>Showing your 10 most recent entries</p>
        </div>
      )}
    </div>
  );
};

export default MoodHistory;
