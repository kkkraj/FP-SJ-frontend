import React, { Component } from 'react';
import {Line} from 'react-chartjs-2';

const moodsURL = 'http://localhost:3000/moods';

export default class MoodChart extends Component {
    state = {
        labels: [],
        datasets: [
            {
                label: 'mt1',
                fill: false,
                lineTension: 0.4,
                backgroundColor: 'rgba(75,192,192,1)',
                borderColor: 'gray',
                borderWidth: 1,
                data: [1.6, 1.6, 1.2, 1.8, 1.3, 1.5, 1.2, 1.8],
            },
        ]
    }

    componentDidMount() {
        fetch(moodsURL)
          .then((response) => response.json())
          .then((moodsListData) => this.setState({ labels: moodsListData.map((mood) => mood.mood_name)}));
    }

    render() {
        return (
            <div>
                <Line
                    width={70}
                    height={40}
                    data={this.state}
                    options={{
                        legend: {
                            display: false
                        },
                        responsive: true,
                        scales: {
                            yAxes: [
                              {
                                stacked: true,
                                ticks: {
                                  autoSkip: true,
                                  maxTicksLimit: 10,
                                  min: 1,
                                  max: 30,
                                  beginAtZero: false
                                }
                              }
                            ],
                            xAxes: [
                              {
                                stacked: true,
                                gridLines: {
                                  display: false
                                }
                              }
                            ]
                          }
                    }}
                />
            </div>
        )
    }
}
