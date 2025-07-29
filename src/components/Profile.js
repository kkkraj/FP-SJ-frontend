import React, { useState } from 'react';
import UpdateAccount from './UpdateAccount';
import float from '../images/float.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container, Row, Col, Image} from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';

export default function Profile(props) {
    const [updateClick, setUpdateClick] = useState(false);

    const handleUpdate = () => {
        setUpdateClick(true);
    };

    return (
        <Container className="profile">
            <Row>
                <Col xs={12} md={1}></Col>
                <Col id="one" xs={12} md={5}>
                    <Image id="float" src={float} alt="floating Astronauts" fluid />
                    <br/><br/>
                    <h4 className="text" style={{letterSpacing: '3px', fontWeight: 'bold', color: 'DimGrey'}}>{props.currentUser.name}</h4>
                    <br/>
                    <table style={{tableLayout: 'auto', width: 'auto', float: 'center', marginLeft: 'auto', marginRight: 'auto'}}>
                        <tbody>
                            <tr>
                                <td className="text" style={{fontSize: '16px', fontWeight: 'bold'}}>Name</td>
                                <td className="text" style={{fontSize: '16px'}}>{props.currentUser.name}</td>
                            </tr>
                            <tr>
                                <td className="text" style={{fontSize: '16px', fontWeight: 'bold'}}>Email</td>
                                <td className="text" style={{fontSize: '16px'}}>{props.currentUser.email}</td>
                            </tr>
                            <tr>
                                <td className="text" style={{fontSize: '16px', fontWeight: 'bold'}}>Username</td>
                                <td className="text" style={{fontSize: '16px'}}>{props.currentUser.username}</td>
                            </tr>
                        </tbody>
                    </table>
                    <br/><br/>
                    <button style={{backgroundColor: 'LightSalmon'}} className="waves-effect waves-light btn-small" onClick={() => {props.handleDeleteUser(props.currentUser)}}>Delete Account</button>
                </Col>
                <Col xs={12} md={1}></Col>
                <Col xs={12} md={4}>
                    <a 
                        className="btn-floating btn-large waves-effect waves-light deep-orange lighten-3" 
                        onClick={handleUpdate}>
                        <i className="material-icons">settings</i>
                    </a>
                    {updateClick === true ? 
                        <UpdateAccount 
                            currentUser={props.currentUser} 
                            handleUpdate={handleUpdate}
                        /> : null
                    }
                </Col>
                <Col xs={12} md={1}></Col>
            </Row>
        </Container>
    );
}