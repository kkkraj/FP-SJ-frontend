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

export default function MoodsChart({ currentUserId }) {
    const [moodList, setMoodList] = useState([]);
    const [userMoodData, setUserMoodData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch both moods list and user mood data
                const [moodsListData, userMoodData] = await Promise.all([
                    api.moods.getAll(),
                    currentUserId ? api.moods.getUserMoodsForMonth(currentUserId) : Promise.resolve([])
                ]);
                
                setMoodList(moodsListData);
                setUserMoodData(userMoodData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching mood data:', error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchData();
    }, [currentUserId]);

    // Process user mood data to count occurrences of each mood
    const processMoodData = () => {
        if (!userMoodData || userMoodData.length === 0) {
            // Use mock data if no real data
            return generateMockData(moodList.length);
        }

        // Count occurrences of each mood
        const moodCounts = {};
        moodList.forEach(mood => {
            moodCounts[mood.id] = 0;
        });

        userMoodData.forEach(userMood => {
            if (moodCounts.hasOwnProperty(userMood.mood_id)) {
                moodCounts[userMood.mood_id]++;
            }
        });

        // Convert to array in the same order as moodList
        return moodList.map(mood => moodCounts[mood.id] || 0);
    };

    const chartData = {
        labels: moodList.map((mood) => mood.mood_name),
        datasets: [
            {
                backgroundColor: 'rgba(87, 177, 172, 0.6)', // Using your teal theme color
                borderColor: 'rgba(87, 177, 172, 1)',
                borderWidth: 1,
                data: processMoodData()
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
                        const moodName = context.label;
                        const count = context.parsed.y;
                        return `${moodName}: ${count} time${count !== 1 ? 's' : ''}`;
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
        return <div>Loading moods chart...</div>;
    }

    if (error) {
        return <div>Error loading moods chart: {error}</div>;
    }

    return (
        <div>
            <Bar
                data={chartData}
                options={options}
                width={70}
                height={40}
            />
            <div style={{textAlign: 'center', display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', width: '513px', marginLeft: '28px'}}>
                {moodList.map((mood) => 
                    <div className="moods" key={mood.id}>
                        <img 
                            style={{width: '50px', height: 'auto', borderRadius: '100px'}} 
                            src={mood.mood_url}
                            alt={mood.mood_name}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
