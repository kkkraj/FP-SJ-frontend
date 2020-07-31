import React, { Component } from 'react'
import {Bar} from 'react-chartjs-2';

const activitiesURL = 'http://localhost:3000/activities';
const randoms = [...Array(16)].map(() => Math.floor(Math.random() * 30));

export default class ActivityChart extends Component {
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
        activitiesList: []
    }

    componentDidMount() {
        fetch(activitiesURL)
            .then((response) => response.json())
            .then((activitiesData) => this.setState({ 
                activitiesList: activitiesData,
                labels: activitiesData.map((actv) => actv.activity_name)
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
                <div style={{textAlign: 'center', display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', width: '513px', marginLeft: '29px'}}>
                    { this.state.activitiesList.map((activity) => 
                        <div key={activity.id}>
                            <img style={{width: '50px', height: 'auto', borderRadius: '100px'}} src={activity.activity_url}/>
                        </div>
                    )}
                </div>
            </div>
        )
    }
}
