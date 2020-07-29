import React, {Component} from 'react';
import UpdateAccount from './UpdateAccount';
import float from '../images/float.png';
import 'materialize-css/dist/css/materialize.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container, Row, Col, Image} from 'react-bootstrap'

export default class Profile extends Component {
    state = {
        updateClick: false,
    }

    handleUpdate = () => {
        this.setState({ updateClick: true })
    }

    render () {
        return (
            <Container className="profile">
                <Row>
                    <Col xs={12} md={1}></Col>
                    <Col id="one" xs={12} md={5}>
                        <Image id="float" src={float} alt="floating Astronauts" fluid />
                        <br/><br/>
                        <h3 className="text" style={{letterSpacing: '3px', fontWeight: 'bold', color: 'DimGrey'}}>{this.props.currentUser.name}</h3>
                        <br/>
                        <table style={{tableLayout: 'auto', width: 'auto', float: 'center', marginLeft: 'auto', marginRight: 'auto'}}>
                            <tbody>
                                <tr>
                                    <td className="text" style={{fontSize: '16px', fontWeight: 'bold'}}>Name</td>
                                    <td className="text" style={{fontSize: '16px'}}>{this.props.currentUser.name}</td>
                                </tr>
                                <tr>
                                    <td className="text" style={{fontSize: '16px', fontWeight: 'bold'}}>Email</td>
                                    <td className="text" style={{fontSize: '16px'}}>{this.props.currentUser.email}</td>
                                </tr>
                                <tr>
                                    <td className="text" style={{fontSize: '16px', fontWeight: 'bold'}}>Username</td>
                                    <td className="text" style={{fontSize: '16px'}}>{this.props.currentUser.username}</td>
                                </tr>
                            </tbody>
                        </table>
                        <br/><br/>
                        <button style={{backgroundColor: 'LightSalmon'}} className="waves-effect waves-light btn-small" onClick={() => {this.props.handleDeleteUser(this.props.currentUser)}}>Delete Account</button>
                    </Col>
                    <Col xs={12} md={1}></Col>
                    <Col xs={12} md={4}>
                        <a className="btn-floating btn-large waves-effect waves-light deep-orange lighten-3" onClick={this.handleUpdate}><i className="material-icons">settings</i></a>
                        {this.state.updateClick === true ? <UpdateAccount currentUser={this.props.currentUser} handleUpdate={this.handleUpdate} /> : null}
                    </Col>
                    <Col xs={12} md={1}></Col>
                </Row>
            </Container>
        )
    }
}