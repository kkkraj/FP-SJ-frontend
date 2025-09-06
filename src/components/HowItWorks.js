import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function HowItWorks(props) {
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
                <div className="how-it-works-content">
                    {/* Hero Section */}
                    <div className="hero-section">
                        <h1 className="hero-title">How Space Journal Works</h1>
                        <p className="hero-subtitle">Your journey to mindful journaling starts here</p>
                    </div>

                    {/* Steps Section - White Background */}
                    <div className="steps-section">
                        <h2 className="section-title">Your Recent Reflections</h2>
                        <p className="section-subtitle">Capture your thoughts, track your growth, and build a meaningful connection with yourself through daily writing.</p>
                        
                        <div className="steps-grid">
                            <div className="step-card">
                                <div className="step-header">
                                    <h3>Morning Reflections</h3>
                                    <span className="mood-tag grateful">Grateful</span>
                                </div>
                                <p>Start your day with intention and gratitude. Reflect on what you're thankful for and set positive intentions.</p>
                                <div className="step-meta">
                                    <span className="date">Dec 15, 2024</span>
                                    <span className="time">9:30 AM</span>
                                </div>
                                <div className="tags">
                                    <span className="tag">#morning</span>
                                    <span className="tag">#gratitude</span>
                                    <span className="tag">#mindfulness</span>
                                </div>
                            </div>

                            <div className="step-card">
                                <div className="step-header">
                                    <h3>Evening Reflection</h3>
                                    <span className="mood-tag content">Content</span>
                                </div>
                                <p>Wind down your day by reflecting on your experiences, lessons learned, and moments of growth.</p>
                                <div className="step-meta">
                                    <span className="date">Dec 14, 2024</span>
                                    <span className="time">8:45 PM</span>
                                </div>
                                <div className="tags">
                                    <span className="tag">#evening</span>
                                    <span className="tag">#reflection</span>
                                    <span className="tag">#growth</span>
                                </div>
                            </div>

                            <div className="step-card">
                                <div className="step-header">
                                    <h3>Weekly Review</h3>
                                    <span className="mood-tag peaceful">Peaceful</span>
                                </div>
                                <p>Take a step back to review your week, celebrate wins, and plan for the days ahead.</p>
                                <div className="step-meta">
                                    <span className="date">Dec 13, 2024</span>
                                    <span className="time">7:00 PM</span>
                                </div>
                                <div className="tags">
                                    <span className="tag">#weekly</span>
                                    <span className="tag">#review</span>
                                    <span className="tag">#planning</span>
                                </div>
                            </div>
                        </div>

                        <div className="view-all">
                            <button className="view-all-btn">View All Entries →</button>
                        </div>
                    </div>

                    {/* Writing Prompts Section - Light Grey Background */}
                    <div className="prompts-section">
                        <h2 className="section-title">Start Writing Today</h2>
                        <p className="section-subtitle">Choose from our guided prompts or start with a blank page. Every journey begins with a single word.</p>
                        
                        <div className="prompts-grid">
                            <div className="prompt-card">
                                <div className="prompt-icon">✍️</div>
                                <h3>Free Writing</h3>
                                <p>Let your thoughts flow freely without judgment or structure.</p>
                                <button className="prompt-btn">+ Start Writing</button>
                            </div>

                            <div className="prompt-card">
                                <div className="prompt-icon">💚</div>
                                <h3>Gratitude Entry</h3>
                                <p>Focus on the positive aspects of your day and life.</p>
                                <button className="prompt-btn">+ Start Writing</button>
                            </div>

                            <div className="prompt-card">
                                <div className="prompt-icon">🎯</div>
                                <h3>Goal Setting</h3>
                                <p>Reflect on your aspirations and plan your next steps.</p>
                                <button className="prompt-btn">+ Start Writing</button>
                            </div>

                            <div className="prompt-card">
                                <div className="prompt-icon">💡</div>
                                <h3>Ideas & Insights</h3>
                                <p>Capture your creative thoughts and breakthrough moments.</p>
                                <button className="prompt-btn">+ Start Writing</button>
                            </div>

                            <div className="prompt-card">
                                <div className="prompt-icon">☕</div>
                                <h3>Morning Pages</h3>
                                <p>Start your day with stream-of-consciousness writing.</p>
                                <button className="prompt-btn">+ Start Writing</button>
                            </div>

                            <div className="prompt-card">
                                <div className="prompt-icon">🌙</div>
                                <h3>Evening Reflection</h3>
                                <p>Process your day and prepare for restful sleep.</p>
                                <button className="prompt-btn">+ Start Writing</button>
                            </div>
                        </div>

                        <div className="cta-block">
                            <p>Ready to begin your journey? Join thousands of writers who have found clarity through daily reflection.</p>
                            <button className="cta-primary" onClick={() => navigate('/signup')}>Create Your First Entry</button>
                        </div>
                    </div>

                    {/* Features Section - White Background */}
                    <div className="features-section">
                        <h2 className="section-title">Everything you need for mindful writing</h2>
                        <p className="section-subtitle">Space Journal combines the simplicity of pen and paper with the power of modern technology. Focus on your thoughts, not the tools.</p>
                        
                        <div className="features-layout">
                            <div className="features-grid">
                                <div className="feature-item">
                                    <div className="feature-icon">🔒</div>
                                    <h3>Private & Secure</h3>
                                    <p>Your thoughts are yours alone. We use end-to-end encryption to protect your most personal reflections.</p>
                                </div>

                                <div className="feature-item">
                                    <div className="feature-icon">📊</div>
                                    <h3>Progress Tracking</h3>
                                    <p>See your writing patterns, mood trends, and personal growth over time with beautiful visualizations.</p>
                                </div>

                                <div className="feature-item">
                                    <div className="feature-icon">✨</div>
                                    <h3>Smart Insights</h3>
                                    <p>Discover patterns in your writing and receive gentle nudges to help you reflect more deeply.</p>
                                </div>

                                <div className="feature-item">
                                    <div className="feature-icon">🔄</div>
                                    <h3>Sync Everywhere</h3>
                                    <p>Access your journal from any device. Your thoughts are always with you, wherever you go.</p>
                                </div>

                                <div className="feature-item">
                                    <div className="feature-icon">🔍</div>
                                    <h3>Search & Discover</h3>
                                    <p>Find past entries instantly with powerful search. Rediscover forgotten insights and memories.</p>
                                </div>

                                <div className="feature-item">
                                    <div className="feature-icon">📅</div>
                                    <h3>Daily Reminders</h3>
                                    <p>Gentle notifications to help you build a consistent journaling habit that sticks.</p>
                                </div>
                            </div>

                            <div className="features-image">
                                <div className="image-placeholder">
                                    <div className="journal-mockup">
                                        <div className="journal-page">
                                            <div className="journal-lines"></div>
                                            <div className="journal-text">Today I realized...</div>
                                        </div>
                                        <div className="pen"></div>
                                        <div className="coffee"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="additional-features">
                            <div className="feature-card">
                                <div className="feature-icon">📤</div>
                                <h3>Export Freedom</h3>
                                <p>Your data belongs to you. Export your entries anytime in multiple formats.</p>
                            </div>

                            <div className="feature-card">
                                <div className="feature-icon">⚡</div>
                                <h3>Distraction-Free</h3>
                                <p>Clean, minimal interface designed to help you focus on what matters most - your thoughts.</p>
                            </div>
                        </div>
                    </div>

                    <div className="legal-links">
                        <a href="/terms" className="legal-link">Terms of Service</a>
                        <span className="divider">|</span>
                        <a href="/privacy" className="legal-link">Privacy Policy</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
