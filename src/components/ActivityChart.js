import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import api from '../services/api';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Fallback mock data
const generateMockData = (count) => [...Array(count)].map(() => Math.floor(Math.random() * 30) + 1);

export default function ActivityChart({ currentUserId }) {
    const [activitiesList, setActivitiesList] = useState([]);
    const [userActivityData, setUserActivityData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch both activities list and user activity data
                const [activitiesData, userActivityData] = await Promise.all([
                    api.activities.getAll(),
                    currentUserId ? api.activities.getUserActivitiesForMonth(currentUserId) : Promise.resolve([])
                ]);
                
                setActivitiesList(activitiesData);
                setUserActivityData(userActivityData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching activity data:', error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchData();
    }, [currentUserId]);

    // Process user activity data to count occurrences of each activity
    const processActivityData = () => {
        if (!userActivityData || userActivityData.length === 0) {
            // Use mock data if no real data
            return generateMockData(activitiesList.length);
        }

        // Count occurrences of each activity
        const activityCounts = {};
        activitiesList.forEach(activity => {
            activityCounts[activity.id] = 0;
        });

        userActivityData.forEach(userActivity => {
            if (activityCounts.hasOwnProperty(userActivity.activity_id)) {
                activityCounts[userActivity.activity_id]++;
            }
        });

        // Convert to array in the same order as activitiesList
        return activitiesList.map(activity => activityCounts[activity.id] || 0);
    };

    const chartData = {
        labels: activitiesList.map((actv) => actv.activity_name),
        datasets: [
            {
                backgroundColor: 'rgba(255, 127, 80, 0.6)', // Using coral color
                borderColor: 'rgba(255, 127, 80, 1)',
                borderWidth: 1,
                data: processActivityData()
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const activityName = context.label;
                        const count = context.parsed.y;
                        return `${activityName}: ${count} time${count !== 1 ? 's' : ''}`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                    precision: 0
                },
                grid: {
                    display: false
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    display: false
                }
            }
        }
    };

    if (loading) {
        return <div>Loading activities chart...</div>;
    }

    if (error) {
        return <div>Error loading activities chart: {error}</div>;
    }

    return (
        <div>
            <Bar
                data={chartData}
                options={options}
                width={70}
                height={40}
            />
            <div style={{textAlign: 'center', display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', width: '513px', marginLeft: '29px'}}>
                {activitiesList.map((activity) => 
                    <div key={activity.id}>
                        <img 
                            style={{width: '50px', height: 'auto', borderRadius: '100px'}} 
                            src={activity.activity_url}
                            alt={activity.activity_name}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
