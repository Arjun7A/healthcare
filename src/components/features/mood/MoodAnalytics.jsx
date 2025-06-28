import React, { useState, useEffect } from 'react';

const MoodAnalytics = ({ entries }) => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState('month'); // week, month, quarter, year

  useEffect(() => {
    generateAnalytics();
  }, [entries, selectedTimeframe]);

  const generateAnalytics = () => {
    if (!entries || entries.length === 0) {
      setAnalyticsData(null);
      return;
    }

    const now = new Date();
    let filteredEntries = [...entries];

    // Filter by timeframe
    switch (selectedTimeframe) {
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filteredEntries = entries.filter(e => new Date(e.timestamp) >= weekAgo);
        break;
      case 'month':
        const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        filteredEntries = entries.filter(e => new Date(e.timestamp) >= monthAgo);
        break;
      case 'quarter':
        const quarterAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
        filteredEntries = entries.filter(e => new Date(e.timestamp) >= quarterAgo);
        break;
      case 'year':
        const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        filteredEntries = entries.filter(e => new Date(e.timestamp) >= yearAgo);
        break;
    }

    if (filteredEntries.length === 0) {
      setAnalyticsData(null);
      return;
    }

    // Calculate mood distribution
    const moodCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    filteredEntries.forEach(entry => {
      moodCounts[entry.mood]++;
    });

    // Calculate emotion patterns
    const emotionFrequency = {};
    filteredEntries.forEach(entry => {
      entry.emotions?.forEach(emotion => {
        emotionFrequency[emotion] = (emotionFrequency[emotion] || 0) + 1;
      });
    });

    // Calculate activity impact
    const activityMoodImpact = {};
    filteredEntries.forEach(entry => {
      entry.activities?.forEach(activity => {
        if (!activityMoodImpact[activity]) {
          activityMoodImpact[activity] = { count: 0, totalMood: 0 };
        }
        activityMoodImpact[activity].count++;
        activityMoodImpact[activity].totalMood += entry.mood;
      });
    });

    // Calculate averages for activities
    Object.keys(activityMoodImpact).forEach(activity => {
      activityMoodImpact[activity].average = 
        activityMoodImpact[activity].totalMood / activityMoodImpact[activity].count;
    });

    // Sort activities by impact
    const sortedActivities = Object.entries(activityMoodImpact)
      .map(([activity, data]) => ({ activity, ...data }))
      .sort((a, b) => b.average - a.average);

    // Calculate mood trends (day by day)
    const moodTrend = filteredEntries
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
      .map(entry => ({
        date: new Date(entry.timestamp).toLocaleDateString(),
        mood: entry.mood
      }));

    // Calculate statistics
    const moods = filteredEntries.map(e => e.mood);
    const averageMood = moods.reduce((sum, mood) => sum + mood, 0) / moods.length;
    const highestMood = Math.max(...moods);
    const lowestMood = Math.min(...moods);
    
    // Calculate mood variance
    const variance = moods.reduce((sum, mood) => sum + Math.pow(mood - averageMood, 2), 0) / moods.length;
    const moodStability = variance < 0.5 ? 'Very Stable' : 
                         variance < 1 ? 'Stable' : 
                         variance < 2 ? 'Moderate' : 'Variable';

    setAnalyticsData({
      totalEntries: filteredEntries.length,
      averageMood: Math.round(averageMood * 100) / 100,
      highestMood,
      lowestMood,
      moodStability,
      moodDistribution: moodCounts,
      emotionFrequency,
      activityImpact: sortedActivities,
      moodTrend,
      timeframe: selectedTimeframe
    });
  };

  const getMoodColor = (moodValue) => {
    if (moodValue >= 4.5) return '#16a34a';
    if (moodValue >= 3.5) return '#22c55e';
    if (moodValue >= 2.5) return '#eab308';
    if (moodValue >= 1.5) return '#f97316';
    return '#ef4444';
  };

  const getMoodLabel = (mood) => {
    const labels = { 1: 'Very Low', 2: 'Low', 3: 'Okay', 4: 'Good', 5: 'Very Good' };
    return labels[mood];
  };

  if (!analyticsData) {
    return (
      <div className="mood-analytics">
        <div className="analytics-header">
          <h3>Mood Analytics</h3>
          <select 
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="timeframe-selector"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
        </div>
        <div className="no-analytics-data">
          <p>No mood data available for the selected timeframe.</p>
          <p>Start tracking your mood to see detailed analytics!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mood-analytics">
      <div className="analytics-header">
        <h3>Mood Analytics</h3>
        <select 
          value={selectedTimeframe}
          onChange={(e) => setSelectedTimeframe(e.target.value)}
          className="timeframe-selector"
        >
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="quarter">Last Quarter</option>
          <option value="year">Last Year</option>
        </select>
      </div>

      {/* Key Statistics */}
      <div className="analytics-stats">
        <div className="stat-card">
          <h4>Average Mood</h4>
          <div className="stat-value" style={{ color: getMoodColor(analyticsData.averageMood) }}>
            {analyticsData.averageMood}/5
          </div>
        </div>
        <div className="stat-card">
          <h4>Mood Range</h4>
          <div className="stat-value">
            {analyticsData.lowestMood} - {analyticsData.highestMood}
          </div>
        </div>
        <div className="stat-card">
          <h4>Stability</h4>
          <div className="stat-value">
            {analyticsData.moodStability}
          </div>
        </div>
        <div className="stat-card">
          <h4>Total Entries</h4>
          <div className="stat-value">
            {analyticsData.totalEntries}
          </div>
        </div>
      </div>

      {/* Mood Distribution */}
      <div className="mood-distribution">
        <h4>Mood Distribution</h4>
        <div className="distribution-chart">
          {Object.entries(analyticsData.moodDistribution).map(([mood, count]) => {
            const percentage = (count / analyticsData.totalEntries) * 100;
            return (
              <div key={mood} className="mood-bar-container">
                <div className="mood-bar-label">
                  {getMoodLabel(parseInt(mood))}
                </div>
                <div className="mood-bar-track">
                  <div 
                    className="mood-bar-fill"
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: getMoodColor(parseInt(mood))
                    }}
                  ></div>
                </div>
                <div className="mood-bar-value">
                  {count} ({Math.round(percentage)}%)
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Emotions */}
      {Object.keys(analyticsData.emotionFrequency).length > 0 && (
        <div className="emotion-analysis">
          <h4>Most Frequent Emotions</h4>
          <div className="emotion-frequency-list">
            {Object.entries(analyticsData.emotionFrequency)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 8)
              .map(([emotion, count]) => (
                <div key={emotion} className="emotion-frequency-item">
                  <span className="emotion-name">{emotion}</span>
                  <span className="emotion-count">{count} times</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Activity Impact */}
      {analyticsData.activityImpact.length > 0 && (
        <div className="activity-impact">
          <h4>Activity Impact on Mood</h4>
          <div className="impact-list">
            {analyticsData.activityImpact.slice(0, 10).map(({ activity, average, count }) => (
              <div key={activity} className="impact-item">
                <div className="impact-info">
                  <span className="activity-name">{activity}</span>
                  <span className="activity-frequency">{count} times</span>
                </div>
                <div className="impact-score">
                  <div 
                    className="impact-rating"
                    style={{ color: getMoodColor(average) }}
                  >
                    {Math.round(average * 10) / 10}
                  </div>
                  <div className="impact-bar">
                    <div 
                      className="impact-fill"
                      style={{ 
                        width: `${(average / 5) * 100}%`,
                        backgroundColor: getMoodColor(average)
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mood Trend */}
      <div className="mood-trend">
        <h4>Mood Trend Over Time</h4>
        <div className="trend-chart">
          {analyticsData.moodTrend.map((point, index) => (
            <div key={index} className="trend-point">
              <div 
                className="trend-dot"
                style={{ 
                  backgroundColor: getMoodColor(point.mood),
                  height: `${(point.mood / 5) * 100}%`
                }}
                title={`${point.date}: ${point.mood}/5`}
              ></div>
              <div className="trend-date">
                {point.date.split('/')[1]}/{point.date.split('/')[0]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MoodAnalytics;
