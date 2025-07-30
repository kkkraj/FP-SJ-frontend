import React from 'react';

export default function Signup(props) {
    return (
        <div>
            {props.error && <p style={{color: "Chocolate"}}>Unable to Sign Up</p>}
            <form onSubmit={props.handleSubmit}>
                <div className="sign-form">
                    <div>
                        <input 
                            type="text" 
                            name="name" 
                            value={props.user.name} 
                            onChange={props.handleChange}
                        />
                        <label className="active">Name</label>
                    </div>
                    <div>
                        <input 
                            type="email" 
                            name="email" 
                            value={props.user.email} 
                            onChange={props.handleChange}
                        />
                        <label className="active">Email</label>
                    </div>
                    <div>
                        <input 
                            type="text" 
                            name="username" 
                            value={props.user.username} 
                            onChange={props.handleChange}
                        />
                        <label className="active">Username</label>
                    </div>
                    <div>
                        <input 
                            type="password" 
                            name="password" 
                            value={props.user.password} 
                            onChange={props.handleChange}
                        />
                        <label className="active">Password</label>
                    </div>
                    <div>
                        <input 
                            type="password" 
                            name="password_confirmation" 
                            value={props.user.password_confirmation} 
                            onChange={props.handleChange}
                        />
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