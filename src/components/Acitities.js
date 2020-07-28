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
            <div>
                <h2 className="text">Activities you have done today</h2>
                {this.state.activities.map((activity) => 
                    <div key={activity.id}>
                        <img style={{width: '80px', height: 'auto', border: '2px solid black', borderRadius: '10px'}} src={activity.activity_url} onClick={() => this.handleActivityClick(activity)} />
                        <p>{activity.activity_name}</p>
                    </div>
                )}
            </div>
        )
    }
}