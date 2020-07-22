import React, {Component} from 'react';

const DiariesUrl = "http://localhost:3000/diary_entries/";

export default class Diarybook extends Component {
    state = {
        diaries: [],
        currentUserId: this.props.currentUser.id
    }

    componentDidMount() {
        fetch(DiariesUrl)
          .then((response) => response.json())
          .then((dariesData) => this.setState({diaries: dariesData}))
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
            </div>
        )
    }
}