import React, {Component} from 'react';
import Moods from './Moods';
import Activities from './Activities';
import Photo from './Photo';
import {Container, Row, Col} from 'react-bootstrap';

export default class Diary extends Component {
    state = {
        diary_entry: {
            title: "",
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

        this.setState({ diary_entry: {...this.state.diary_entry, title:"", content: ""} })
    }

    render () {
        return (
            <div id="diary">
                <Container>
                    <Row>
                        <Col xs={12} md={4}>
                            <h4 className="diaryheader">Today Moods</h4>
                        </Col>
                        <Col xs={12} md={1}></Col>
                        <Col xs={12} md={7}>
                            <h4 className="diaryheader">Today Activities</h4>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} md={4}>
                            <Moods currentUserId={this.state.diary_entry.user_id} />
                        </Col>
                        <Col xs={12} md={1}></Col>
                        <Col xs={12} md={7}>
                            <Activities currentUserId={this.state.diary_entry.user_id} />
                        </Col>
                    </Row>
                </Container>
                <br/>
                <Container>
                    <Row>
                        <Col xs={12} md={4}>
                            <h4 className="diaryheader">Today Photo</h4>
                        </Col>
                        <Col xs={12} md={1}></Col>
                        <Col xs={12} md={7}>
                            <h4 className="diaryheader">Today Journal</h4>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} md={4}>
                            <br/>
                            <a className="btn-floating btn-medium waves-effect waves-light deep-orange lighten-3">
                                <i className="material-icons">image</i>
                            </a>
                            <Photo />
                        </Col>
                        <Col xs={12} md={1}></Col>
                        <Col xs={12} md={7}>
                            <form id="entry" onSubmit={this.handleSubmit}>
                                <input 
                                    className="dtitle" 
                                    placeholder="title"
                                    value={this.state.diary_entry.title} 
                                    name="title" 
                                    onChange={this.handleChange} 
                                    style={{width: '60%', borderBottom: 'solid 2px salmon'}}
                                /><br/><br/>
                                <textarea 
                                   className="text" 
                                   placeholder="Begin Today Journal Here!" 
                                   value={this.state.diary_entry.content} 
                                   name="content" 
                                   onChange={this.handleChange} 
                                   style={{height: 180, width: 600, border: 'none' ,borderBottom: 'solid 2px salmon'}}
                                ></textarea>
                                <input 
                                    className="waves-effect waves-light btn-small" 
                                    type="submit" 
                                    value="Submit Journal" 
                                    style={{backgroundColor: 'LightSalmon', marginTop: '10px'}} 
                                />
                            </form>  
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}
