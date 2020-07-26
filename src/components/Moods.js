import React, {Component} from 'react'

const moodsURL = `http://localhost:3000/moods`;
const userMoodURL = `http://localhost:3000/user_moods`;

export default class Moods extends Component {
    state = {
        moods: [],
        currentUserId: this.props.currentUserId
    }

    componentDidMount() {
        fetch(moodsURL)
          .then((response) => response.json())
          .then((moodsData) => this.setState({ moods: moodsData}))
    }

    handleMoodClick = (mood) => {
        // console.log(`${mood.mood_name} clicked`)
        fetch(userMoodURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: this.state.currentUserId,
                mood_id: mood.id
            })
        })
    }

    render () {
        return (
            <div>
                <h2>Moods Component</h2>
                {this.state.moods.map((mood) => <button key={mood.id} onClick={() => this.handleMoodClick(mood)}>{mood.mood_name}</button>)}
            </div>
        )
    }
}