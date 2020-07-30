import React, {Component} from 'react';

const activitiesURL = "http://localhost:3000/activities";
const userActivitiesURL = "http://localhost:3000/user_activities";

export default class Activities extends Component {
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
                <div className="actvdiv" style={{textAlign: 'center', display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)'}}>
                    {this.state.activities.map((activity) => 
                        <div className="actvs" key={activity.id} style={{paddingTop: '7.5px'}}>
                            <img style={{width: '50px', height: 'auto', border: '2px solid black', borderRadius: '100px'}} src={activity.activity_url} onClick={() => this.handleActivityClick(activity)} />
                            <p className="text" style={{fontSize: '12px', paddingTop: '11px', marginBottom: '0'}}>{activity.activity_name}</p>
                        </div>
                    )}
                </div>
            </div>
        )
    }
}