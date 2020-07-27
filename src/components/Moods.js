import React, {Component} from 'react'
import sad from '../images/sad.png';
import happy from '../images/happy.png';
import calm from '../images/calm.png';
import cool from '../images/cool.png';
import good from '../images/good.png';
import angry from '../images/angry.png';
import stressed from '../images/stressed.png';
import ovw from '../images/ovw.png';

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
                <h3 className="text">How are you today?</h3>
                {this.state.moods.map((mood) => 
                    mood.mood_name === "happy" ? <img src={happy} alt={mood.mood_name} key={mood.id} onClick={() => this.handleMoodClick(mood)}/> : null
                )}
            </div>
        )
    }
}