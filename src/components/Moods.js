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
        console.log(`${mood.mood_name} clicked`)
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
            <div className="moodsdiv" style={{width: '100%', height: '100%'}}>
                <h3 className="text">How are you today?</h3>
                    <div>
                        { this.state.moods.map((mood) => 
                                <div key={mood.id} style={{float: 'left'}} className="imgcolumn">
                                    <img style={{width: '100px', height: 'auto'}} src={mood.mood_url} onClick={() => this.handleMoodClick(mood)} />
                                    <p className="text">{mood.mood_name}</p>
                                </div>
                        )}
                    </div>
            </div>
        )
    }
}