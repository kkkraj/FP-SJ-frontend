import React, {Component} from 'react';
import 'materialize-css/dist/css/materialize.min.css';

export default class Signup extends Component {
    render () {
        return (
            <div>
                <form onChange={this.props.handleChange} onSubmit={this.props.handleSubmit}>
                    <div className="row">
                        <div className="input-field col s3">
                            <div>
                                <input type="text" name="name" value={this.props.user.name} />
                                <label className="active">Name</label>
                            </div>
                            <div>
                                <input type="email" name="email" value={this.props.user.email} />
                                <label className="active">Email</label>
                            </div>
                            <div>
                                <input type="text" name="username" value={this.props.user.username} />
                                <label className="active">Username</label>
                            </div>
                            <div>
                                <input type="password" name="password" value={this.props.user.password} />
                                <label className="active">Password</label>
                            </div>
                            <div>
                                <input type="password" name="password_confirmation" value={this.props.user.password_confirmation} />
                                <label className="active">Confirm Password</label>
                            </div>
                            <br/>
                            <div>
                                <button className="waves-effect waves-light btn" type="submit">Signup</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}