import React, {Component} from 'react';

const activitiesURL = "http://localhost:3000/activities";
const userActivitiesURL = "http://localhost:3000/user_activities";

export default class Acitities extends Component {
    state = {
        activities: [],
        currentUserId: this.props.currentUserId
    }

    componentDidMount() {
        fetch(activitiesURL)
          .then((response) => response.json())
          .then((activitiesData) => this.setState({ activities: activitiesData }))
    }

    handleActivityClick = (activity) => {
        // console.log(`${activity.activity_name} clicked`)
        fetch(userActivitiesURL, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: this.state.currentUserId,
                activity_id: activity.id
            })
        })
    }

    render () {
        return (
            <div style={{textAlign: 'center'}}>
                {/* <h4 className="text">Today Activities</h4> */}
                <div className="actvdiv" style={{textAlign: 'center', display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)'}}>
                    {this.state.activities.map((activity) => 
                        <div key={activity.id} style={{paddingTop: '7.5px'}}>
                            <img style={{width: '60px', height: 'auto', border: '2px solid black', borderRadius: '100px'}} src={activity.activity_url} onClick={() => this.handleActivityClick(activity)} />
                            <p className="text" style={{fontSize: '14px', paddingTop: '11px'}}>{activity.activity_name}</p>
                        </div>
                    )}
                </div>
            </div>
        )
    }
}