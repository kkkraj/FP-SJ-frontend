import React from 'react';

export default function Signup(props) {
    return (
        <div>
            {props.error && <p style={{color: "Chocolate"}}>Unable to Sign Up</p>}
            <form onChange={props.handleChange} onSubmit={props.handleSubmit}>
                <div className="sign-form">
                    <div>
                        <input type="text" name="name" value={props.user.name} />
                        <label className="active">Name</label>
                    </div>
                    <div>
                        <input type="email" name="email" value={props.user.email} />
                        <label className="active">Email</label>
                    </div>
                    <div>
                        <input type="text" name="username" value={props.user.username} />
                        <label className="active">Username</label>
                    </div>
                    <div>
                        <input type="password" name="password" value={props.user.password} />
                        <label className="active">Password</label>
                    </div>
                    <div>
                        <input type="password" name="password_confirmation" value={props.user.password_confirmation} />
                        <label className="active">Confirm Password</label>
                    </div>
                    <br/>
                    <div>
                        <button className="waves-effect waves-light btn" type="submit">Signup</button>
                    </div>
                </div>
            </form>
        </div>
    );
}