/**
 * Cross-Platform Funnel Visualization Dashboard for CDL Help
 * Interactive dashboard for visualizing funnel analytics and cross-platform journeys
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Line, Bar, Doughnut, Sankey } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import apiClient from '../services/api-client';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

/**
 * Main Funnel Analytics Dashboard Component
 */
export const FunnelVisualizationDashboard = ({ className = '' }) => {
  const [funnelData, setFunnelData] = useState(null);
  const [journeyData, setJourneyData] = useState(null);
  const [realTimeData, setRealTimeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedPlatform, setSelectedPlatform] = useState('all');

  useEffect(() => {
    loadDashboardData();

    // Set up real-time updates
    const interval = setInterval(loadRealTimeData, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [timeRange, selectedPlatform]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - parseInt(timeRange.replace('d', '')));

      // Load funnel performance data - using new API client and endpoints
      const funnelData = await apiClient.post('/api/analytics/funnel/performance', {
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        platform: selectedPlatform === 'all' ? null : selectedPlatform,
      });
      
      // Data is already parsed by API client
      setFunnelData(funnelData?.analysis || funnelData);

      // Load cross-platform journey data - using new endpoint
      const journeyData = await apiClient.post('/api/analytics/funnel/cross-platform-journeys', {
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        min_touchpoints: 2,
      });
      
      setJourneyData(journeyData?.analysis || journeyData);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error loading dashboard data:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadRealTimeData = async () => {
    try {
      // Using new API client and endpoint
      const metricsData = await apiClient.post('/api/analytics/funnel/real-time-metrics', {
        hours_back: 1,
      });
      
      setRealTimeData(metricsData?.metrics || metricsData);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error loading real-time data:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className={`funnel-dashboard loading ${className}`}>
        <div className="dashboard-skeleton">
          <div className="skeleton-header"></div>
          <div className="skeleton-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton-chart"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`funnel-dashboard ${className}`}>
      <DashboardHeader
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        selectedPlatform={selectedPlatform}
        onPlatformChange={setSelectedPlatform}
        realTimeData={realTimeData}
      />

      <div className="dashboard-grid">
        <FunnelOverviewCard funnelData={funnelData} />
        <ConversionFunnelChart funnelData={funnelData} />
        <CrossPlatformJourneyMap journeyData={journeyData} />
        <PlatformPerformanceChart funnelData={funnelData} />
        <BottleneckAnalysis funnelData={funnelData} />
        <RealTimeMetrics realTimeData={realTimeData} />
        <TopConversionPaths journeyData={journeyData} />
        <AttributionBreakdown funnelData={funnelData} />
      </div>
    </div>
  );
};

/**
 * Dashboard Header with Controls
 */
const DashboardHeader = ({
  timeRange,
  onTimeRangeChange,
  selectedPlatform,
  onPlatformChange,
  realTimeData,
}) => {
  return (
    <div className="dashboard-header">
      <div className="header-title">
        <h1>Cross-Platform Funnel Analytics</h1>
        <div className="live-indicator">
          <span className="live-dot"></span>
          Live Data
        </div>
      </div>

      <div className="header-controls">
        <div className="control-group">
          <label>Time Range:</label>
          <select value={timeRange} onChange={e => onTimeRangeChange(e.target.value)}>
            <option value="1d">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
        </div>

        <div className="control-group">
          <label>Platform:</label>
          <select value={selectedPlatform} onChange={e => onPlatformChange(e.target.value)}>
            <option value="all">All Platforms</option>
            <option value="website">Website</option>
            <option value="mobile">Mobile App</option>
            <option value="backend">Backend</option>
          </select>
        </div>

        <div className="real-time-stats">
          <div className="stat">
            <span className="stat-value">
              {realTimeData?.current_metrics?.active_users_now || 0}
            </span>
            <span className="stat-label">Active Now</span>
          </div>
          <div className="stat">
            <span className="stat-value">
              {realTimeData?.current_metrics?.events_last_hour || 0}
            </span>
            <span className="stat-label">Events/Hour</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Funnel Overview Card
 */
const FunnelOverviewCard = ({ funnelData }) => {
  const overview = funnelData?.funnel_overview || {};

  return (
    <div className="dashboard-card overview-card">
      <h3>Funnel Overview</h3>
      <div className="overview-stats">
        <div className="stat-item">
          <span className="stat-number">{overview.total_users?.toLocaleString() || 0}</span>
          <span className="stat-label">Total Users</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">
            {Math.round((overview.conversion_rate_overall || 0) * 100)}%
          </span>
          <span className="stat-label">Conversion Rate</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{overview.platforms_active?.length || 0}</span>
          <span className="stat-label">Active Platforms</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{overview.total_events?.toLocaleString() || 0}</span>
          <span className="stat-label">Total Events</span>
        </div>
      </div>
    </div>
  );
};

/**
 * Conversion Funnel Chart
 */
const ConversionFunnelChart = ({ funnelData }) => {
  const chartData = useMemo(() => {
    if (!funnelData?.stage_metrics) return null;

    const stages = Object.keys(funnelData.stage_metrics);
    const users = stages.map(stage => funnelData.stage_metrics[stage].total_users || 0);

    return {
      labels: stages.map(stage => stage.replace(/_/g, ' ').toUpperCase()),
      datasets: [
        {
          label: 'Users',
          data: users,
          backgroundColor: [
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)',
            'rgba(255, 159, 64, 0.8)',
            'rgba(255, 99, 132, 0.8)',
            'rgba(201, 203, 207, 0.8)',
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(201, 203, 207, 1)',
          ],
          borderWidth: 2,
        },
      ],
    };
  }, [funnelData]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Conversion Funnel by Stage' },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="dashboard-card chart-card">
      <h3>Conversion Funnel</h3>
      <div className="chart-container">
        {chartData ? (
          <Bar data={chartData} options={options} />
        ) : (
          <div className="chart-placeholder">No funnel data available</div>
        )}
      </div>
    </div>
  );
};

/**
 * Cross-Platform Journey Map
 */
const CrossPlatformJourneyMap = ({ journeyData }) => {
  const journeyPatterns = journeyData?.journey_patterns?.top_converting_sequences || [];

  return (
    <div className="dashboard-card journey-card">
      <h3>Top Cross-Platform Journeys</h3>
      <div className="journey-list">
        {journeyPatterns.slice(0, 5).map((pattern, index) => (
          <div key={index} className="journey-item">
            <div className="journey-sequence">
              {pattern.sequence.split(' -> ').map((platform, idx, arr) => (
                <React.Fragment key={idx}>
                  <span className={`platform-badge ${platform.toLowerCase()}`}>{platform}</span>
                  {idx < arr.length - 1 && <span className="arrow">→</span>}
                </React.Fragment>
              ))}
            </div>
            <div className="journey-stats">
              <span className="conversion-rate">
                {Math.round(pattern.metrics.conversion_rate * 100)}% conversion
              </span>
              <span className="user-count">({pattern.metrics.count} users)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Platform Performance Chart
 */
const PlatformPerformanceChart = ({ funnelData }) => {
  const chartData = useMemo(() => {
    if (!funnelData?.cross_platform_metrics) return null;

    const metrics = funnelData.cross_platform_metrics;

    return {
      labels: ['Total Users', 'Cross-Platform Users', 'Platform Transitions'],
      datasets: [
        {
          label: 'Count',
          data: [
            metrics.total_users || 0,
            metrics.cross_platform_users || 0,
            Object.values(metrics.platform_transitions || {}).reduce(
              (sum, count) => sum + count,
              0
            ),
          ],
          backgroundColor: [
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
          ],
        },
      ],
    };
  }, [funnelData]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Cross-Platform Activity' },
    },
  };

  return (
    <div className="dashboard-card chart-card">
      <h3>Platform Performance</h3>
      <div className="chart-container">
        {chartData ? (
          <Doughnut data={chartData} options={options} />
        ) : (
          <div className="chart-placeholder">No platform data available</div>
        )}
      </div>
    </div>
  );
};

/**
 * Bottleneck Analysis
 */
const BottleneckAnalysis = ({ funnelData }) => {
  const bottlenecks = funnelData?.bottlenecks || [];

  return (
    <div className="dashboard-card bottleneck-card">
      <h3>Funnel Bottlenecks</h3>
      <div className="bottleneck-list">
        {bottlenecks.length === 0 ? (
          <div className="no-bottlenecks">
            <span className="success-icon">✓</span>
            No critical bottlenecks detected
          </div>
        ) : (
          bottlenecks.slice(0, 3).map((bottleneck, index) => (
            <div key={index} className={`bottleneck-item severity-${bottleneck.severity}`}>
              <div className="bottleneck-header">
                <span className="bottleneck-type">{bottleneck.type.replace(/_/g, ' ')}</span>
                <span className={`severity-badge ${bottleneck.severity}`}>
                  {bottleneck.severity}
                </span>
              </div>
              <div className="bottleneck-details">
                <p>{bottleneck.stage || bottleneck.stage_transition}</p>
                <div className="bottleneck-metrics">
                  <span>Users Lost: {bottleneck.users_lost?.toLocaleString()}</span>
                  {bottleneck.conversion_rate && (
                    <span>Rate: {Math.round(bottleneck.conversion_rate * 100)}%</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

/**
 * Real-Time Metrics
 */
const RealTimeMetrics = ({ realTimeData }) => {
  const hourlyData = realTimeData?.hourly_breakdown || {};
  const alerts = realTimeData?.alerts || [];

  const chartData = useMemo(() => {
    const hours = Object.keys(hourlyData).sort().reverse().slice(0, 12);
    const events = hours.map(hour => hourlyData[hour]?.total_events || 0);
    const users = hours.map(hour => hourlyData[hour]?.unique_users || 0);

    return {
      labels: hours.map(hour => {
        const hourNum = parseInt(hour.replace('hour_', ''));
        return `${hourNum}h ago`;
      }),
      datasets: [
        {
          label: 'Events',
          data: events,
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          fill: true,
        },
        {
          label: 'Users',
          data: users,
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          fill: true,
        },
      ],
    };
  }, [hourlyData]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
      title: { display: true, text: 'Last 12 Hours Activity' },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="dashboard-card real-time-card">
      <h3>Real-Time Activity</h3>
      <div className="chart-container">
        <Line data={chartData} options={options} />
      </div>

      {alerts.length > 0 && (
        <div className="alerts-section">
          <h4>Alerts</h4>
          {alerts.map((alert, index) => (
            <div key={index} className={`alert-item severity-${alert.severity}`}>
              <span className="alert-type">{alert.type.replace(/_/g, ' ')}</span>
              <span className="alert-message">
                {alert.type === 'conversion_rate_drop' &&
                  `Conversion rate dropped ${Math.round(alert.drop_percentage)}%`}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Top Conversion Paths
 */
const TopConversionPaths = ({ journeyData }) => {
  const optimalPaths = journeyData?.optimal_conversion_paths || [];

  return (
    <div className="dashboard-card paths-card">
      <h3>Optimal Conversion Paths</h3>
      <div className="paths-list">
        {optimalPaths.slice(0, 5).map((path, index) => (
          <div key={index} className="path-item">
            <div className="path-header">
              <span className="path-rank">#{index + 1}</span>
              <span className="efficiency-score">
                Efficiency: {path.efficiency_score?.toFixed(2)}
              </span>
            </div>
            <div className="path-details">
              <div className="platforms">Platforms: {path.platforms_involved?.join(', ')}</div>
              <div className="path-metrics">
                <span>{path.conversion_count} conversions</span>
                <span>${path.avg_value_per_conversion?.toFixed(2)} avg value</span>
                <span>{path.avg_duration_hours?.toFixed(1)}h avg duration</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Attribution Breakdown
 */
const AttributionBreakdown = ({ funnelData }) => {
  // This would be populated with attribution data from the funnel analysis
  const attributionData = {
    labels: ['Direct', 'Google', 'Facebook', 'Email', 'Referral'],
    datasets: [
      {
        data: [35, 25, 20, 12, 8],
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 99, 132, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' },
      title: { display: true, text: 'Traffic Attribution' },
    },
  };

  return (
    <div className="dashboard-card chart-card">
      <h3>Attribution Sources</h3>
      <div className="chart-container">
        <Doughnut data={attributionData} options={options} />
      </div>
    </div>
  );
};

// Export the main dashboard component
export default FunnelVisualizationDashboard;

// CSS Styles (to be added to your stylesheet)
export const dashboardStyles = `
.funnel-dashboard {
  padding: 24px;
  background: #f8f9fa;
  min-height: 100vh;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding: 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.header-title h1 {
  margin: 0 0 8px 0;
  color: #212529;
}

.live-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #28a745;
  font-size: 14px;
}

.live-dot {
  width: 8px;
  height: 8px;
  background: #28a745;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 24px;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.control-group label {
  font-size: 12px;
  color: #6c757d;
  font-weight: 500;
}

.control-group select {
  padding: 8px 12px;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  background: white;
}

.real-time-stats {
  display: flex;
  gap: 16px;
}

.stat {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 20px;
  font-weight: 700;
  color: #212529;
}

.stat-label {
  font-size: 12px;
  color: #6c757d;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

.dashboard-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.dashboard-card h3 {
  margin: 0 0 20px 0;
  color: #212529;
  font-size: 18px;
}

.overview-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.stat-item {
  text-align: center;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.stat-number {
  display: block;
  font-size: 24px;
  font-weight: 700;
  color: #212529;
}

.stat-label {
  font-size: 12px;
  color: #6c757d;
  margin-top: 4px;
}

.chart-container {
  height: 300px;
  position: relative;
}

.chart-placeholder {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6c757d;
  background: #f8f9fa;
  border-radius: 8px;
}

.journey-list, .bottleneck-list, .paths-list {
  space-y: 12px;
}

.journey-item, .bottleneck-item, .path-item {
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 12px;
}

.journey-sequence {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.platform-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.platform-badge.website { background: #e3f2fd; color: #1976d2; }
.platform-badge.mobile { background: #f3e5f5; color: #7b1fa2; }
.platform-badge.backend { background: #e8f5e8; color: #388e3c; }

.arrow {
  color: #6c757d;
  font-weight: bold;
}

.severity-badge {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

.severity-badge.high { background: #ffebee; color: #c62828; }
.severity-badge.medium { background: #fff3e0; color: #ef6c00; }
.severity-badge.low { background: #e8f5e8; color: #2e7d32; }

.no-bottlenecks {
  text-align: center;
  padding: 32px;
  color: #28a745;
}

.success-icon {
  display: block;
  font-size: 24px;
  margin-bottom: 8px;
}

.alerts-section {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #dee2e6;
}

.alert-item {
  padding: 8px 12px;
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 6px;
  margin-bottom: 8px;
}

.alert-item.severity-high {
  background: #ffebee;
  border-color: #ffcdd2;
}

.loading .skeleton-header,
.loading .skeleton-chart {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.skeleton-header { height: 60px; border-radius: 8px; margin-bottom: 20px; }
.skeleton-chart { height: 200px; border-radius: 8px; }
`;
