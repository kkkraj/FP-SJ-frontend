import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function TermsOfService(props) {
    const navigate = useNavigate();
    const isLoggedIn = props.currentUser && props.currentUser.id;

    return (
        <div className="terms-container">
            {/* Navigation Bar */}
            <nav className="terms-navbar">
                <div className="terms-nav-content">
                    <div className="terms-nav-left">
                        <img src={require('../images/logo.png')} alt="Space Journal Logo" className="terms-nav-logo" />
                    </div>
                    <div className="terms-nav-right">
                        {!isLoggedIn && (
                            <>
                                <button 
                                    className="terms-nav-button" 
                                    onClick={() => navigate('/login')}
                                >
                                    Login
                                </button>
                                <button 
                                    className="terms-nav-button" 
                                    onClick={() => navigate('/signup')}
                                >
                                    Sign Up
                                </button>
                                <button 
                                    className="terms-nav-button" 
                                    onClick={() => navigate('/how-it-works')}
                                >
                                    How it works
                                </button>
                            </>
                        )}
                    </div>
                </div>
                <div className="terms-nav-divider"></div>
            </nav>

            <div className="terms-content-wrapper">
                <div className="terms-content">
                    <h1 className="terms-title">Terms of Service</h1>
                    <p className="terms-last-updated">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                
                <div className="terms-section">
                    <p>
                        Welcome to Space Journal. These Terms of Service ("Terms") govern your access to and use of our website, web app, and related services (collectively, the "Service"). Please read them carefully.
                    </p>
                    <p>
                        By creating an account or using the Service, you agree to these Terms. If you do not agree, please do not use Space Journal.
                    </p>
                </div>

                <div className="terms-section">
                    <h2>1. Acceptance of Terms</h2>
                    <p>
                        By accessing or using Space Journal, you accept and agree to be bound by these Terms.
                    </p>
                </div>

                <div className="terms-section">
                    <h2>2. License to Use</h2>
                    <p>
                        We grant you a personal, limited, non-exclusive, non-transferable license to use the Service for your own personal, non-commercial purposes in accordance with these Terms.
                    </p>
                    <p>You may not:</p>
                    <ul>
                        <li>Copy, modify, or distribute the Service or its content.</li>
                        <li>Use the Service for commercial purposes without permission.</li>
                        <li>Attempt to reverse engineer or disrupt the Service.</li>
                        <li>Remove or alter copyright or proprietary notices.</li>
                    </ul>
                </div>

                <div className="terms-section">
                    <h2>3. User Accounts</h2>
                    <ul>
                        <li>You must provide accurate and current information when creating an account.</li>
                        <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
                        <li>You are responsible for any activity that occurs under your account.</li>
                    </ul>
                </div>

                <div className="terms-section">
                    <h2>4. Your Content</h2>
                    <p><strong>Ownership:</strong> You retain ownership of the text, images, and other content you create ("Your Content").</p>
                    <p><strong>License to Us:</strong> By using the Service, you grant us a limited license to store and display Your Content solely as needed to operate the Service.</p>
                    <p><strong>Responsibility:</strong> You are responsible for Your Content and must ensure it does not violate laws or infringe the rights of others.</p>
                </div>

                <div className="terms-section">
                    <h2>5. Prohibited Uses</h2>
                    <p>You agree not to use the Service:</p>
                    <ul>
                        <li>For any unlawful purpose or to encourage unlawful activity.</li>
                        <li>To upload harmful, offensive, or misleading content.</li>
                        <li>To infringe intellectual property rights.</li>
                        <li>To harass, abuse, or harm others.</li>
                        <li>To attempt to interfere with or disrupt the Service.</li>
                    </ul>
                </div>

                <div className="terms-section">
                    <h2>6. Termination</h2>
                    <p>
                        We may suspend or terminate your account if you violate these Terms or misuse the Service. You may stop using Space Journal at any time by closing your account.
                    </p>
                </div>

                <div className="terms-section">
                    <h2>7. Disclaimers</h2>
                    <p>
                        Space Journal is provided on an "as is" and "as available" basis. We do not guarantee uninterrupted or error-free service.
                    </p>
                    <p>
                        Space Journal supports personal reflection and well-being, but it is not a substitute for medical, psychological, or professional advice. Always seek the guidance of a qualified professional if you have concerns about your health or safety.
                    </p>
                </div>

                <div className="terms-section">
                    <h2>8. Limitation of Liability</h2>
                    <p>
                        To the fullest extent permitted by law, Space Journal and its creators shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Service.
                    </p>
                </div>

                <div className="terms-section">
                    <h2>9. Governing Law</h2>
                    <p>
                        These Terms shall be governed by and interpreted under the laws of the jurisdiction in which our company operates, without regard to conflict of law principles.
                    </p>
                </div>

                <div className="terms-section">
                    <h2>10. Changes to Terms</h2>
                    <p>
                        We may update these Terms from time to time. If we make material changes, we will notify you (for example, by email or through the Service). Your continued use of the Service after changes take effect means you accept the revised Terms.
                    </p>
                </div>

                <div className="terms-contact">
                    <h2>Contact Information</h2>
                    <p>
                        If you have any questions about these Terms of Service, please contact us at:
                    </p>
                    <p>
                        Email: support@spacejournal.io<br />
                    </p>
                </div>
                </div>
            </div>
        </div>
    );
}