import React, { useState } from 'react';
import { useAuth } from '../../../contexts/useAuth';
import { supabase } from '../../../lib/supabaseClient';
import Button from '../../common/Button';
import '../../../styles/components/MoodLogger.css';

const MoodLogger = ({ onMoodLogged }) => {
  const [moodScore, setMoodScore] = useState(3);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { user } = useAuth();

  const moodLabels = {
    1: { emoji: '😢', label: 'Very Sad', color: '#e74c3c' },
    2: { emoji: '😔', label: 'Sad', color: '#f39c12' },
    3: { emoji: '😐', label: 'Neutral', color: '#95a5a6' },
    4: { emoji: '😊', label: 'Happy', color: '#2ecc71' },
    5: { emoji: '😄', label: 'Very Happy', color: '#27ae60' }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setMessage('');

    try {
      const { data, error } = await supabase
        .from('mood_entries')
        .insert([
          {
            user_id: user.id,
            mood_score: moodScore,
            notes: notes.trim() || null
          }
        ])
        .select();

      if (error) throw error;

      setMessage('Mood logged successfully! 🎉');
      setNotes('');
      setMoodScore(3);
      
      // Callback to parent component to refresh mood list
      if (onMoodLogged) {
        onMoodLogged(data[0]);
      }

    } catch (error) {
      console.error('Error logging mood:', error);
      setMessage('Failed to log mood. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mood-logger">
      <h3>How are you feeling today?</h3>
      
      <form onSubmit={handleSubmit} className="mood-form">
        {/* Mood Score Selector */}
        <div className="mood-selector">
          <label className="mood-label">Your Mood:</label>
          <div className="mood-options">
            {Object.entries(moodLabels).map(([score, { emoji, label, color }]) => (
              <button
                key={score}
                type="button"
                className={`mood-option ${moodScore === parseInt(score) ? 'selected' : ''}`}
                style={{ 
                  borderColor: moodScore === parseInt(score) ? color : '#ddd',
                  backgroundColor: moodScore === parseInt(score) ? `${color}20` : 'white'
                }}
                onClick={() => setMoodScore(parseInt(score))}
              >
                <span className="mood-emoji">{emoji}</span>
                <span className="mood-text">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Notes Section */}
        <div className="mood-notes">
          <label htmlFor="mood-notes" className="mood-label">
            Notes (optional):
          </label>
          <textarea
            id="mood-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="What's on your mind? Any specific thoughts or events that influenced your mood..."
            className="mood-textarea"
            rows={3}
            maxLength={500}
          />
          <div className="character-count">
            {notes.length}/500 characters
          </div>
        </div>

        {/* Submit Button */}
        <Button 
          type="submit" 
          disabled={loading}
          fullWidth
          variant="primary"
        >
          {loading ? 'Logging Mood...' : 'Log My Mood'}
        </Button>

        {/* Success/Error Message */}
        {message && (
          <div className={`mood-message ${message.includes('successfully') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default MoodLogger;
