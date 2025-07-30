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

const randoms = [...Array(8)].map(() => Math.floor(Math.random() * 30));

export default function MoodsChart() {
    const [moodList, setMoodList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMoods = async () => {
            try {
                const moodsListData = await api.moods.getAll();
                setMoodList(moodsListData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching moods:', error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchMoods();
    }, []);

    const chartData = {
        labels: moodList.map((mood) => mood.mood_name),
        datasets: [
            {
                backgroundColor: '#d8f0f3',
                borderColor: 'transparent',
                borderWidth: 1,
                data: randoms
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            y: {
                stacked: true,
                ticks: {
                    min: 1,
                    beginAtZero: false,
                },
                grid: {
                    display: false
                }
            },
            x: {
                stacked: true,
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
