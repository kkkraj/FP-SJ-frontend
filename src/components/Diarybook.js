import React, {Component} from 'react';

const DiariesUrl = 'http://localhost:3000/diary_entries/';
const moodsURL = 'http://localhost:3000/moods';
const UserMoodURL = 'http://localhost:3000/user_moods';
const activitiesURL = 'http://localhost:3000/activities';
const UserActivitiesURL = 'http://localhost:3000/user_activities';

export default class Diarybook extends Component {
    state = {
        diaries: [],
        currentUserId: this.props.currentUser.id,
        userMoods: [],
        moodsList: [],
        activitiesList: [],
        userActivities: []
    }

    componentDidMount() {
        fetch(DiariesUrl)
          .then((response) => response.json())
          .then((dariesData) => this.setState({diaries: dariesData}));

        fetch(UserMoodURL)
          .then((response) => response.json())
          .then((moodsData) => this.setState({userMoods: moodsData}));

        fetch(moodsURL)
          .then((response) => response.json())
          .then((moodsListData) => this.setState({ moodsList: moodsListData}));

        fetch(activitiesURL)
          .then((response) => response.json())
          .then((activitiesData) => this.setState({ activitiesList: activitiesData }));

        fetch(UserActivitiesURL)
          .then((response) => response.json())
          .then((userActivitiesData) => this.setState({ userActivities: userActivitiesData }));
    }

    handleDeleteDiary = (diary) => {
        fetch(`${DiariesUrl}${diary.id}`, {
            method: 'DELETE'
        });

        const entries = this.state.diaries.filter((entry) => (
            entry.id !== diary.id
        ));
        this.setState({ diaries: entries })
    }

    render () {
        return (
            <div>
                <h2>Diary Index</h2>
                <div>
                    {this.state.diaries.map((diary) => (
                        diary.user_id === this.state.currentUserId ? (
                            <div key={diary.id}>
                                <ul>
                                    <li>{diary.created_at}</li>
                                    <li>{diary.content}</li>
                                    <li>user id: {diary.user_id}</li>
                                    <button onClick={() => {this.handleDeleteDiary(diary)}}>Delete</button>
                                </ul>
                            </div>
                        ) : null
                    ))}
                </div>
                <h3>Moods Index</h3>
                    {this.state.userMoods.map((userMood) => 
                        this.state.moodsList.map((mood) => {
                            return userMood.mood_id === mood.id && userMood.user_id === this.state.currentUserId ? (<ul key={mood.id}><li>{mood.mood_name}</li>{userMood.created_at}</ul>) : null
                        })
                    )}
                <h3>Activities Index</h3>
                    {this.state.userActivities.map((userActivity) =>
                        this.state.activitiesList.map((activity) => {
                            return userActivity.activity_id === activity.id && userActivity.user_id === this.state.currentUserId ? (<ul key={activity.id}><li>{activity.activity_name}</li>{userActivity.created_at}</ul>) : null
                        })
                    )}
            </div>
        )
    }
}