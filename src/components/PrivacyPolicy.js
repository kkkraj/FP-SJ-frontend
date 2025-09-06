import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function PrivacyPolicy(props) {
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
                    <h1 className="terms-title">Privacy Policy</h1>
                    <p className="terms-last-updated">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                
                <div className="terms-section">
                    <p>
                        At Space Journal, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our service.
                    </p>
                    <p>
                        By using Space Journal, you agree to the collection and use of information in accordance with this policy.
                    </p>
                </div>

                <div className="terms-section">
                    <h2>1. Information We Collect</h2>
                    <p><strong>Personal Information:</strong> When you create an account, we collect your name and email address.</p>
                    <p><strong>Journal Content:</strong> We store the text, images, and other content you create in your journal entries.</p>
                    <p><strong>Usage Data:</strong> We may collect information about how you use our service, including pages visited and features used.</p>
                </div>

                <div className="terms-section">
                    <h2>2. How We Use Your Information</h2>
                    <p>We use the information we collect to:</p>
                    <ul>
                        <li>Provide and maintain our service</li>
                        <li>Process your journal entries and personal data</li>
                        <li>Communicate with you about your account</li>
                        <li>Improve our service and develop new features</li>
                        <li>Ensure the security and integrity of our platform</li>
                    </ul>
                </div>

                <div className="terms-section">
                    <h2>3. Data Storage and Security</h2>
                    <p>
                        We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                    </p>
                    <p>
                        Your journal entries are stored securely and are only accessible to you through your account. We do not share your personal journal content with third parties.
                    </p>
                </div>

                <div className="terms-section">
                    <h2>4. Data Sharing</h2>
                    <p>We do not sell, trade, or otherwise transfer your personal information to third parties, except:</p>
                    <ul>
                        <li>When required by law or legal process</li>
                        <li>To protect our rights, property, or safety</li>
                        <li>With your explicit consent</li>
                    </ul>
                </div>

                <div className="terms-section">
                    <h2>5. Your Rights</h2>
                    <p>You have the right to:</p>
                    <ul>
                        <li>Access your personal information</li>
                        <li>Correct inaccurate or incomplete data</li>
                        <li>Delete your account and associated data</li>
                        <li>Export your journal entries</li>
                        <li>Opt out of certain communications</li>
                    </ul>
                </div>

                <div className="terms-section">
                    <h2>6. Cookies and Tracking</h2>
                    <p>
                        We may use cookies and similar technologies to enhance your experience, remember your preferences, and analyze how you use our service.
                    </p>
                    <p>
                        You can control cookie settings through your browser, but disabling cookies may affect the functionality of our service.
                    </p>
                </div>

                <div className="terms-section">
                    <h2>7. Data Retention</h2>
                    <p>
                        We retain your personal information and journal content for as long as your account is active or as needed to provide our service.
                    </p>
                    <p>
                        When you delete your account, we will delete your personal information and journal content, though some data may be retained for legal or regulatory purposes.
                    </p>
                </div>

                <div className="terms-section">
                    <h2>8. Children's Privacy</h2>
                    <p>
                        Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
                    </p>
                </div>

                <div className="terms-section">
                    <h2>9. Changes to This Policy</h2>
                    <p>
                        We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                    </p>
                </div>

                <div className="terms-contact">
                    <h2>Contact Information</h2>
                    <p>
                        If you have any questions about this Privacy Policy, please contact us at:
                    </p>
                    <p>
                        Email: privacy@spacejournal.io<br />
                    </p>
                </div>
                </div>
            </div>
        </div>
    );
}
