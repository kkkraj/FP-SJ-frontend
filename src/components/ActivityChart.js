import React, { Component } from 'react'
import {Bar} from 'react-chartjs-2';

const activitiesURL = 'http://localhost:3000/activities';

export default class ActivityChart extends Component {
    state = {
        labels: [],
        datasets: [
          {
            backgroundColor: 'lightgray',
            borderColor: 'none',
            borderWidth: 1,
            data: [20,28,2,30,5,10,7,10,5,2,18,4,21,30,12,8]
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
                <div style={{textAlign: 'center', display: 'grid', gridTemplateColumns: 'repeat(16, 1fr)', width: '415px', marginLeft: '28px'}}>
                    { this.state.activitiesList.map((activity) => 
                        <div key={activity.id}>
                            <img style={{width: '40px', height: 'auto', borderRadius: '100px'}} src={activity.activity_url}/>
                        </div>
                    )}
                </div>
            </div>
        )
    }
}
