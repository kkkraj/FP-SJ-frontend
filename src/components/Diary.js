import React, {Component} from 'react';
import moment from 'moment';
import Moods from './Moods';
import Acitities from './Acitities';
import { Form, TextArea } from 'semantic-ui-react';
// import EmojiPicker from './EmojiPicker';

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
            <div id="diary">
                <div className="text" id="datetime">{moment().format('dddd LL, LT')}</div>
                <br/>
                {/* <h3 className="text">Today Journal</h3> */}
                <form className="ui form" onSubmit={this.handleSubmit}>
                    <textarea placeholder="Begin Today Journal Here!" name="content" onChange={this.handleChange} style={{height: 100, width: 500}} />
                    <br/>
                    <input type="submit" value="Submit" />
                </form>
                {/* <EmojiPicker /> */}
                <Moods currentUserId={this.state.diary_entry.user_id} />
                <Acitities currentUserId={this.state.diary_entry.user_id} />
            </div>
        )
    }
}
