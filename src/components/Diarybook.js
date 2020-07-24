import React, {Component} from 'react';

const DiariesUrl = "http://localhost:3000/diary_entries/";
const UserMoodURL = "http://localhost:3000/user_moods";

export default class Diarybook extends Component {
    state = {
        diaries: [],
        currentUserId: this.props.currentUser.id,
        userMoods: []
    }

    componentDidMount() {
        fetch(DiariesUrl)
          .then((response) => response.json())
          .then((dariesData) => this.setState({diaries: dariesData}))

        fetch(UserMoodURL)
          .then((response) => response.json())
          .then((moodsData) => this.setState({userMoods: moodsData}))
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
        console.log(this.state.diaries)
        return (
            <div>
                <h2>Diary Index</h2>
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
                <h3>Moods Index</h3>
                <p>+++ Display Mood's Name not Id ???</p>
                <p>+++ Extract date and Group Diary Entry and Moods Together</p>
                {this.state.userMoods.map((mood) => <ul><li>{mood.id}</li></ul>)}
            </div>
        )
    }
}