import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

export default function HowItWorks(props) {
    const navigate = useNavigate();
    const isLoggedIn = props.currentUser && props.currentUser.id;
    const promptCardsRef = useRef([]);

    useEffect(() => {
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                console.log('Card intersecting:', entry.isIntersecting, entry.target);
                if (entry.isIntersecting) {
                    // Reset the animation by removing and re-adding the class
                    entry.target.classList.remove('animate-in');
                    // Force a reflow to ensure the class removal is processed
                    void entry.target.offsetHeight;
                    // Add the animation class
                    entry.target.classList.add('animate-in');
                    console.log('Added animate-in class to card');
                } else {
                    // Reset when out of view to ensure animation can trigger again
                    entry.target.classList.remove('animate-in');
                }
            });
        }, observerOptions);

        // Use setTimeout to ensure refs are populated after render
        const timeoutId = setTimeout(() => {
            console.log('Setting up observers for cards:', promptCardsRef.current);
            promptCardsRef.current.forEach((card, index) => {
                if (card) {
                    console.log(`Observing card ${index}:`, card);
                    observer.observe(card);
                }
            });
        }, 200);

        return () => {
            clearTimeout(timeoutId);
            promptCardsRef.current.forEach((card) => {
                if (card) {
                    observer.unobserve(card);
                }
            });
        };
    }, []);

    return (
        <div className="terms-container">
            {/* Navigation Bar */}
            {isLoggedIn ? (
                <Navbar currentUser={props.currentUser} handleLogout={props.handleLogout} />
            ) : (
                <nav className="terms-navbar">
                    <div className="terms-nav-content">
                        <div className="terms-nav-left">
                            <img src={require('../images/logo.png')} alt="Space Journal Logo" className="terms-nav-logo" />
                        </div>
                        <div className="terms-nav-right">
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
                        </div>
                    </div>
                    <div className="terms-nav-divider"></div>
                </nav>
            )}

            <div className="terms-content-wrapper">
            <div className="how-it-works-content">
                    {/* Steps Section - White Background */}
                    <div className="steps-section">
                        <h2 className="section-title">Your Recent Reflections</h2>
                        <div className="taglines-section">
                            <ul className="taglines-list">
                                <li className="tagline-item green">Capture your thoughts</li>
                                <li className="tagline-item yellow">Record your memories</li>
                                <li className="tagline-item purple">Log your feelings</li>
                                <li className="tagline-item pink">Track your habits</li>
                                <li className="tagline-item blue">Reflect on your day</li>
                            </ul>
                    </div>

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
                                    <span className="tag">Exercise</span>
                                    <span className="tag">Meditation</span>
                                    <span className="tag">Self-care</span>
                                    <span className="tag">Reading</span>
                                </div>
                            </div>

                            <div className="step-card">
                                <div className="step-header">
                                    <h3>Evening Reflection</h3>
                                    <span className="mood-tag content">Content</span>
                                </div>
                                <p>Wind down your day by reflecting on your experiences and moments of growth.</p>
                                <div className="step-meta">
                                    <span className="date">Dec 14, 2024</span>
                                    <span className="time">8:45 PM</span>
                                </div>
                                <div className="tags">
                                    <span className="tag">Reading</span>
                                    <span className="tag">Family</span>
                                    <span className="tag">Friends</span>
                                    <span className="tag">Cooking</span>
                        </div>
                    </div>

                            <div className="step-card">
                                <div className="step-header">
                                    <h3>Weekly Review</h3>
                                    <span className="mood-tag peaceful">Peaceful</span>
                                </div>
                                <p>Take a step back to review your week, celebrate wins, learn from challenges, and plan for the days ahead.</p>
                                <div className="step-meta">
                                    <span className="date">Dec 13, 2024</span>
                                    <span className="time">7:00 PM</span>
                                </div>
                                <div className="tags">
                                    <span className="tag">Cooking</span>
                                    <span className="tag">Travel</span>
                                    <span className="tag">Exercise</span>
                                    <span className="tag">Meditation</span>
                                </div>
                        </div>
                    </div>

                        <div className="view-all">
                            <button 
                                className="view-all-btn"
                                onClick={() => isLoggedIn ? navigate('/about') : navigate('/login')}
                            >
                                View All Entries →
                            </button>
                        </div>
                    </div>

                    {/* Writing Prompts Section - Light Grey Background */}
                    <div className="prompts-section">
                        <div className="prompts-content">
                            <h2 className="section-title">Start Journaling Today</h2>
                            <p className="section-subtitle">Choose from our guided prompts or start with a blank page. Every journey begins with a single word.</p>
                            
                            <div className="prompts-grid">
                            <div 
                                className="prompt-card" 
                                ref={(el) => promptCardsRef.current[0] = el}
                            >
                                <div className="prompt-icon">✍️</div>
                                <h3>Free Writing</h3>
                                <p>Let your thoughts flow freely without judgment or structure.</p>
                            </div>

                            <div 
                                className="prompt-card" 
                                ref={(el) => promptCardsRef.current[1] = el}
                            >
                                <div className="prompt-icon">💚</div>
                                <h3>Gratitude Entry</h3>
                                <p>Focus on the positive aspects of your day and life.</p>
                            </div>

                            <div 
                                className="prompt-card" 
                                ref={(el) => promptCardsRef.current[2] = el}
                            >
                                <div className="prompt-icon">🎯</div>
                                <h3>Goal Setting</h3>
                                <p>Reflect on your aspirations and plan your next steps.</p>
                            </div>

                            <div 
                                className="prompt-card" 
                                ref={(el) => promptCardsRef.current[3] = el}
                            >
                                <div className="prompt-icon">💡</div>
                                <h3>Ideas & Insights</h3>
                                <p>Capture your creative thoughts and breakthrough moments.</p>
                            </div>

                            <div 
                                className="prompt-card" 
                                ref={(el) => promptCardsRef.current[4] = el}
                            >
                                <div className="prompt-icon">☕</div>
                                <h3>Morning Pages</h3>
                                <p>Start your day with stream-of-consciousness writing.</p>
                            </div>

                            <div 
                                className="prompt-card" 
                                ref={(el) => promptCardsRef.current[5] = el}
                            >
                                <div className="prompt-icon">🌙</div>
                                <h3>Evening Reflection</h3>
                                <p>Process your day and prepare for restful sleep.</p>
                            </div>
                        </div>

                        <div className="prompts-action">
                            <button 
                                className="start-writing-btn"
                                onClick={() => isLoggedIn ? navigate('/about') : navigate('/login')}
                            >
                                Start Writing →
                            </button>
                        </div>

                        </div>
                    </div>

                    {/* Features Section - White Background */}
                    <div className="features-section">
                        <h2 className="section-title">Everything you need for mindful writing</h2>
                        <p className="section-subtitle">Space Journal combines the simplicity of pen and paper with the power of modern technology. <br />Connect with yourself and focus on your thoughts, not the tools.</p>
                        
                        <div className="features-layout">
                            <div className="features-grid">
                                <div className="feature-item">
                                    <div className="feature-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#1f1f1f">
                                            <path d="M80 0v-160h800V0H80Zm160-320h56l312-311-29-29-28-28-311 312v56Zm-80 80v-170l448-447q11-11 25.5-17t30.5-6q16 0 31 6t27 18l55 56q12 11 17.5 26t5.5 31q0 15-5.5 29.5T777-687L330-240H160Zm560-504-56-56 56 56ZM608-631l-29-29-28-28 57 57Z"/>
                                        </svg>
                                    </div>
                                    <h3>Open Journaling</h3>
                                    <p>A space for spontaneous writing. Express yourself freely with no rules or structure. Jot down your thoughts, record your emotions, and log the activities you do each day. This is your personal space.</p>
                                </div>

                                <div className="feature-item">
                                    <div className="feature-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#1f1f1f">
                                            <path d="M508-200h224q-7 26-24 42t-44 20L228-85q-33 5-59.5-15.5T138-154L85-591q-4-33 16-59t53-30l46-6v80l-36 5 54 437 290-36Zm-148-80q-33 0-56.5-23.5T280-360v-440q0-33 23.5-56.5T360-880h440q33 0 56.5 23.5T880-800v440q0 33-23.5 56.5T800-280H360Zm0-80h440v-440H360v440Zm220-220ZM218-164Zm363-236q68 0 115.5-47T749-560q-68 0-116.5 47T581-400Zm0 0q-3-66-51.5-113T413-560q5 66 52.5 113T581-400Zm0-120q17 0 28.5-11.5T621-560v-10l10 4q15 6 30.5 3t23.5-17q9-15 6-32t-20-24l-10-4 10-4q17-7 19.5-24.5T685-700q-9-15-24-17.5t-30 3.5l-10 4v-10q0-17-11.5-28.5T581-760q-17 0-28.5 11.5T541-720v10l-10-4q-15-6-30-3.5T477-700q-8 14-5.5 31.5T491-644l10 4-10 4q-17 7-20 24t6 32q8 14 23.5 17t30.5-3l10-4v10q0 17 11.5 28.5T581-520Zm0-80q-17 0-28.5-11.5T541-640q0-17 11.5-28.5T581-680q17 0 28.5 11.5T621-640q0 17-11.5 28.5T581-600Z"/>
                                        </svg>
                                    </div>
                                    <h3>Keep Memories</h3>
                                    <p>Save your favorite moments from each day by adding photos to your journal entries.</p>
                                </div>

                                <div className="feature-item">
                                    <div className="feature-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#1f1f1f">
                                            <path d="M480-800q134 0 227 93t93 227q0 134-93 227t-227 93q-134 0-227-93t-93-227q0-134 93-227t227-93Zm0 560q100 0 170-70t70-170q0-100-70-170t-170-70q-100 0-170 70t-70 170q0 100 70 170t170 70Zm0-100q48 0 86-27.5t54-72.5H340q16 45 54 72.5t86 27.5ZM340-560q0 17 11.5 28.5T380-520q17 0 28.5-11.5T420-560q0-17-11.5-28.5T380-600q-17 0-28.5 11.5T340-560Zm200 0q0 17 11.5 28.5T580-520q17 0 28.5-11.5T620-560q0-17-11.5-28.5T580-600q-17 0-28.5 11.5T540-560ZM40-720v-120q0-33 23.5-56.5T120-920h120v80H120v120H40ZM240-40H120q-33 0-56.5-23.5T40-120v-120h80v120h120v80Zm480 0v-80h120v-120h80v120q0 33-23.5 56.5T840-40H720Zm120-680v-120H720v-80h120q33 0 56.5 23.5T920-840v120h-80ZM480-480Z"/>
                                        </svg>
                                    </div>
                                    <h3>Mood Tracking</h3>
                                    <p>Visualize your emotional journey with beautiful charts and insights that help you understand yourself better.</p>
                                </div>

                                <div className="feature-item">
                                    <div className="feature-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#1f1f1f">
                                            <path d="M640-160v-280h160v280H640Zm-240 0v-640h160v640H400Zm-240 0v-440h160v440H160Z"/>
                                        </svg>
                                    </div>
                                    <h3>Activity Tracking</h3>
                                    <p>Track your routines by recording daily activities and building habits that last.</p>
                                </div>

                                <div className="feature-item">
                                    <div className="feature-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#1f1f1f">
                                            <path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm280 240q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z"/>
                                        </svg>
                                    </div>
                                    <h3>Look Back</h3>
                                    <p>Look up past entries in seconds with calendar search. Reflect on old insights and revisit meaningful memories anytime.</p>
                                </div>

                                <div className="feature-item">
                                    <div className="feature-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#1f1f1f">
                                            <path d="M480-340q63 0 112-39t63-101h-83q-12 27-37 43.5T480-420q-30 0-55-16.5T388-480h-83q14 62 63 101t112 39ZM370-540q21 0 35.5-14.5T420-590q0-21-14.5-35.5T370-640q-21 0-35.5 14.5T320-590q0 21 14.5 35.5T370-540Zm220 0q21 0 35.5-14.5T640-590q0-21-14.5-35.5T590-640q-21 0-35.5 14.5T540-590q0 21 14.5 35.5T590-540ZM480-120l-58-50q-101-88-167-152T150-437q-39-51-54.5-94T80-620q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 89T810-437q-39 51-105 115T538-170l-58 50Zm0-108q96-83 158-141t98-102.5q36-44.5 50-79t14-69.5q0-60-40-100t-100-40q-47 0-87 26.5T518-666h-76q-15-41-55-67.5T300-760q-60 0-100 40t-40 100q0 35 14 69.5t50 79Q260-427 322-369t158 141Zm0-266Z"/>
                                        </svg>
                                    </div>
                                    <h3>Daily Affirmation</h3>
                                    <p>Keep your thoughts aligned with positivity through daily affirmations and reminders. Stay grounded, build resilience, strengthen your self-esteem, and bring more calm and clarity to your day.</p>
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
                                <h3>Export Your Journal</h3>
                                <p>Your data stays yours. Download and back up entries in just a few clicks.</p>
                        </div>

                        <div className="feature-card">
                                <div className="feature-icon">💭</div>
                                <h3>Distraction-Free</h3>
                                <p>A clean, minimal interface that helps you focus fully on your thoughts.</p>
                        </div>
                    </div>
                </div>

                <div className="cta-block">
                    <p>Ready to begin your journey? Join thousands of users who have found clarity through daily reflection.</p>
                    <button className="cta-primary-howitworks" onClick={() => isLoggedIn ? navigate('/about') : navigate('/login')}>Create Your First Entry</button>
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
