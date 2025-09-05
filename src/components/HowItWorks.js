import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function HowItWorks() {
    const navigate = useNavigate();

    return (
        <div className="how-it-works-container">
            <div className="how-it-works-content">
                <h1 className="how-it-works-title">How Space Journal Works</h1>
                <p className="how-it-works-subtitle">Your journey to mindful journaling starts here</p>
                
                <div className="steps-container">
                    <div className="step">
                        <div className="step-number">1</div>
                        <div className="step-content">
                            <h3>Create Your Account</h3>
                            <p>Sign up with your email or use Google/Apple sign-in for quick access. Your data is secure and private.</p>
                        </div>
                    </div>

                    <div className="step">
                        <div className="step-number">2</div>
                        <div className="step-content">
                            <h3>Start Journaling</h3>
                            <p>Write about your day, thoughts, and experiences. Use our guided prompts to help you reflect and grow.</p>
                        </div>
                    </div>

                    <div className="step">
                        <div className="step-number">3</div>
                        <div className="step-content">
                            <h3>Track Your Moods</h3>
                            <p>Tag your entries with mood indicators to identify patterns and understand your emotional journey over time.</p>
                        </div>
                    </div>

                    <div className="step">
                        <div className="step-number">4</div>
                        <div className="step-content">
                            <h3>Discover Insights</h3>
                            <p>View your progress through beautiful charts and analytics that help you understand your growth and patterns.</p>
                        </div>
                    </div>

                    <div className="step">
                        <div className="step-number">5</div>
                        <div className="step-content">
                            <h3>Stay Mindful</h3>
                            <p>Receive daily affirmations and mindfulness exercises designed to support your mental well-being and personal growth.</p>
                        </div>
                    </div>
                </div>

                <div className="features-section">
                    <h2>Key Features</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">📝</div>
                            <h4>Daily Journaling</h4>
                            <p>Write freely about your thoughts, experiences, and reflections in a safe, private space.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">😊</div>
                            <h4>Mood Tracking</h4>
                            <p>Tag your entries with mood indicators to track your emotional patterns and growth.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">📊</div>
                            <h4>Progress Analytics</h4>
                            <p>Visualize your journey with beautiful charts and insights about your journaling habits.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🧘</div>
                            <h4>Mindfulness Tools</h4>
                            <p>Access guided exercises and daily affirmations to support your mental well-being.</p>
                        </div>
                    </div>
                </div>

                <div className="cta-section">
                    <h2>Ready to Start Your Journey?</h2>
                    <p>Join thousands of users who have found clarity and growth through mindful journaling.</p>
                    <div className="cta-buttons">
                        <button className="cta-primary" onClick={() => navigate('/signup')}>
                            Get Started
                        </button>
                        <button className="cta-secondary" onClick={() => navigate('/login')}>
                            Sign In
                        </button>
                    </div>
                </div>

                <div className="legal-links">
                    <a href="/terms" className="legal-link">Terms of Service</a>
                    <span className="divider">|</span>
                    <a href="/privacy" className="legal-link">Privacy Policy</a>
                </div>
            </div>
        </div>
    );
}
