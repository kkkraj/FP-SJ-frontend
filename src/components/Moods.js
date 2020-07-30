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
            <div style={{textAlign: 'center'}}>
                <div className="moodsdiv" style={{textAlign: 'center', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)'}}>
                    { this.state.moods.map((mood) => 
                        <div className="moods" key={mood.id}>
                            <img style={{width: '80px', height: 'auto', borderRadius: '100px'}} src={mood.mood_url} onClick={() => this.handleMoodClick(mood)} />
                            <p className="text" style={{fontSize: '14px'}}>{mood.mood_name}</p>
                        </div>
                    )}
                </div>
            </div>
        )
    }
}