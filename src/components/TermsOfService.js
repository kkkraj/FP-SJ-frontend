import React from 'react';

export default function TermsOfService() {
    return (
        <div className="terms-container">
            <div className="terms-content">
                <h1 className="terms-title">Terms of Service</h1>
                <p className="terms-last-updated">Last updated: {new Date().toLocaleDateString()}</p>
                
                <div className="terms-section">
                    <h2>1. Acceptance of Terms</h2>
                    <p>
                        By accessing and using Space Journal ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                    </p>
                </div>

                <div className="terms-section">
                    <h2>2. Use License</h2>
                    <p>
                        Permission is granted to temporarily download one copy of Space Journal per device for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                    </p>
                    <ul>
                        <li>modify or copy the materials</li>
                        <li>use the materials for any commercial purpose or for any public display</li>
                        <li>attempt to reverse engineer any software contained on the website</li>
                        <li>remove any copyright or other proprietary notations from the materials</li>
                    </ul>
                </div>

                <div className="terms-section">
                    <h2>3. Privacy Policy</h2>
                    <p>
                        Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information when you use our service. By using our service, you agree to the collection and use of information in accordance with this policy.
                    </p>
                </div>

                <div className="terms-section">
                    <h2>4. User Accounts</h2>
                    <p>
                        When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for safeguarding the password and for all activities that occur under your account.
                    </p>
                </div>

                <div className="terms-section">
                    <h2>5. Content</h2>
                    <p>
                        Our service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content"). You are responsible for the Content that you post to the service, including its legality, reliability, and appropriateness.
                    </p>
                </div>

                <div className="terms-section">
                    <h2>6. Prohibited Uses</h2>
                    <p>You may not use our service:</p>
                    <ul>
                        <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                        <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                        <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                        <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                        <li>To submit false or misleading information</li>
                    </ul>
                </div>

                <div className="terms-section">
                    <h2>7. Termination</h2>
                    <p>
                        We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
                    </p>
                </div>

                <div className="terms-section">
                    <h2>8. Disclaimer</h2>
                    <p>
                        The information on this service is provided on an "as is" basis. To the fullest extent permitted by law, this Company excludes all representations, warranties, conditions and terms relating to our service and the use of this service.
                    </p>
                </div>

                <div className="terms-section">
                    <h2>9. Governing Law</h2>
                    <p>
                        These Terms shall be interpreted and governed by the laws of the jurisdiction in which our company operates, without regard to its conflict of law provisions.
                    </p>
                </div>

                <div className="terms-section">
                    <h2>10. Changes to Terms</h2>
                    <p>
                        We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
                    </p>
                </div>

                <div className="terms-contact">
                    <h2>Contact Information</h2>
                    <p>
                        If you have any questions about these Terms of Service, please contact us at:
                    </p>
                    <p>
                        Email: support@spacejournal.com<br />
                        Address: [Your Company Address]
                    </p>
                </div>
            </div>
        </div>
    );
}
