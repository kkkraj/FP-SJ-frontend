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
                <h2>Activities List</h2>
                {this.state.activities.map((activity) => <button key={activity.id} onClick={() => this.handleActivityClick(activity)}>{activity.activity_name}</button>)}
            </div>
        )
    }
}