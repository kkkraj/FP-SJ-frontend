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

const randoms = [...Array(16)].map(() => Math.floor(Math.random() * 30));

export default function ActivityChart() {
    const [activitiesList, setActivitiesList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const activitiesData = await api.activities.getAll();
                setActivitiesList(activitiesData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching activities:', error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchActivities();
    }, []);

    const chartData = {
        labels: activitiesList.map((actv) => actv.activity_name),
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
