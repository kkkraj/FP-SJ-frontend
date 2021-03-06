import React, { Component } from 'react'
import {Bar} from 'react-chartjs-2';

const moodsURL = 'http://localhost:3000/moods';
const randoms = [...Array(8)].map(() => Math.floor(Math.random() * 30));

export default class MoodsChart extends Component {
    state = {
        labels: [],
        datasets: [
          {
            backgroundColor: '#d8f0f3',
            borderColor: 'none',
            borderWidth: 1,
            data: randoms
          }
        ],
        moodList: []
    }

    componentDidMount() {
        fetch(moodsURL)
            .then((response) => response.json())
            .then((moodsListData) => this.setState({ 
                moodList: moodsListData,
                labels: moodsListData.map((mood) => mood.mood_name)
            }));
    }

    render() {
        return (
            <div>
                <Bar
                    width={70}
                    height={40}
                    data={this.state}
                    options={{
                        legend:{
                            display:false
                        },
                        scales: {
                            yAxes: [{
                                stacked: true,
                                ticks: {
                                  min: 1,
                                  beginAtZero: false,
                                //   display: false
                                },
                                gridLines: {
                                    // display: false
                                  }
                            }],
                            xAxes: [{
                                stacked: true,
                                gridLines: {
                                  display: false
                                },
                                ticks: {
                                    display: false
                                  },
                            }]
                          }
                    }}                    
                />
                <div style={{textAlign: 'center', display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', width: '513px', marginLeft: '28px'}}>
                    { this.state.moodList.map((mood) => 
                        <div className="moods" key={mood.id}>
                            <img style={{width: '50px', height: 'auto', borderRadius: '100px'}} src={mood.mood_url}/>
                        </div>
                    )}
                </div>
            </div>
        )
    }
}
