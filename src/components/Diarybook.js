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
            <div className="text">
                <div className="detail-header">
                    <h4 className="booheaders">Journal</h4>
                    {this.state.diaries.map((diary) => {
                        const date1 = new Date(diary.created_at);
                        const date2 = date1.getDate();
                        const month = date1.getMonth();
                        const year = date1.getFullYear();
                        const formatted = year + '-' + month + '-' + date2;
                        return diary.user_id === this.state.currentUserId && formatted === this.props.selectedDate ? (
                            <div key={diary.id}>
                                <ul>
                                    <li id="diary-content">{diary.content}</li>
                                    <button 
                                        style={{width: '30px', height: '30px', marginTop: '10px'}} 
                                        className="btn-floating btn-small waves-effect waves-light grey lighten-5" 
                                        onClick={() => {this.handleDeleteDiary(diary)}}>
                                        <i className="material-icons" style={{color: 'LightSteelBlue'}}>clear</i>
                                    </button>
                                </ul>
                            </div>
                        ) : null
                    })}
                </div>
                <br/>
                <div className="detail-header">
                    <h4 className="booheaders">Moods</h4>
                    {this.state.userMoods.map((userMood) => 
                        this.state.moodsList.map((mood) => {
                            const date1 = new Date(userMood.created_at);
                            const date2 = date1.getDate();
                            const month = date1.getMonth();
                            const year = date1.getFullYear();
                            const formatted = year + '-' + month + '-' + date2;
                            return userMood.mood_id === mood.id && userMood.user_id === this.state.currentUserId && formatted === this.props.selectedDate ? (
                                <ul key={mood.id}>
                                    <li><img style={{width: '30px', height: 'auto'}} src={mood.mood_url}/> {mood.mood_name}</li>
                                </ul>
                            ) : null
                        })
                    )}
                </div>
                <br/>
                <div className="detail-header">
                    <h4 className="booheaders">Activities</h4>
                    {this.state.userActivities.map((userActivity) =>
                        this.state.activitiesList.map((activity) => {
                            const date1 = new Date(userActivity.created_at);
                            const date2 = date1.getDate();
                            const month = date1.getMonth();
                            const year = date1.getFullYear();
                            const formatted = year + '-' + month + '-' + date2;
                            return userActivity.activity_id === activity.id && userActivity.user_id === this.state.currentUserId && formatted === this.props.selectedDate ? (
                                <ul key={activity.id}>
                                    <li><img style={{width: '30px', height: 'auto'}} src={activity.activity_url}/> {activity.activity_name}</li>
                                </ul>
                            ) : null
                        })
                    )}
                </div>
            </div>
        )
    }
}