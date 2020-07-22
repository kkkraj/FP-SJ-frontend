import React, {Component} from 'react';
import moment from 'moment';

export default class Diary extends Component {
    state = {
        diary_entry: {
            content: "",
            user_id: this.props.currentUser.id
        }
    }

    handleChange = (event) => {
        const newEntry = { ...this.state.diary_entry, [event.target.name]: event.target.value };
        this.setState({ diary_entry: newEntry });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        console.log({...this.state})
        const diaryEntry = {...this.state}
        this.createNewDiaryEntry(diaryEntry)
    }

    createNewDiaryEntry = (diaryEntry) => {
        fetch("http://localhost:3000/diary_entries", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(diaryEntry)
        })
    }

    render () {
        return (
            <div>
                {moment().format('dddd LL, LT')}
                <h2>Today Journal</h2>
                <form onSubmit={this.handleSubmit}>
                  <textarea name="content" placeholder="Begin Today Journal Here!" onChange={this.handleChange} style={{height: 500, width: 500}} />
                  <br/>
                  <input type="submit" value="Submit" />
                </form>
            </div>
        )
    }
}