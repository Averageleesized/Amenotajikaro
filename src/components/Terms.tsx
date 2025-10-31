import { ChevronLeft } from 'lucide-react';
import { Button } from './ui/button';

interface TermsProps {
  onBack: () => void;
}

export function Terms({ onBack }: TermsProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b-2 border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-2"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <h1 className="mb-4">Terms of Service & Privacy Policy</h1>
        <p className="opacity-60 mb-8">
          Effective Date: October 31, 2025 • Last Updated: October 31, 2025
        </p>

        {/* Table of Contents */}
        <nav className="mb-10 bg-card rounded-[var(--radius)] p-6 border-2 border-border shadow-[var(--elevation-sm)]">
          <h2 className="mb-3">Jump to:</h2>
          <ul className="space-y-2 ml-4">
            <li className="list-disc">
              <a href="#terms" className="text-primary hover:underline">
                Terms of Service
              </a>
            </li>
            <li className="list-disc">
              <a href="#privacy" className="text-primary hover:underline">
                Privacy Policy
              </a>
            </li>
          </ul>
        </nav>

        {/* ================= Terms of Service ================= */}
        <section id="terms" className="mb-14">
          <h2 className="mb-6">Terms of Service</h2>

          <p className="mb-6">
            Welcome to <strong>Fantasy Tennis</strong> ("we," "us," "our"). By accessing or using our website (the "Site") or participating in fantasy tennis competitions,
            you agree to these Terms of Service ("Terms"). Please read them carefully.
          </p>

          <h3 className="mt-8 mb-3">1. Acceptance of Terms</h3>
          <p className="mb-6">
            By accessing or using the Site, you agree to these Terms and our Privacy Policy. If you do not agree, please discontinue use of the Site.
          </p>

          <h3 className="mt-8 mb-3">2. Eligibility</h3>
          <p className="mb-6">
            You must be at least 18 years old (or the age of majority in your jurisdiction) to use this Site. If under 18, you may only use the Site with parental or guardian consent.
          </p>

          <h3 className="mt-8 mb-3">3. Description of Services</h3>
          <p className="mb-6">
            Fantasy Tennis provides a free-to-play fantasy sports platform where users can:
          </p>
          <ul className="space-y-2 ml-6 mb-6">
            <li className="list-disc">Create fantasy teams from real professional tennis players</li>
            <li className="list-disc">Compete in fantasy leagues based on real tournament results</li>
            <li className="list-disc">Make predictions on match outcomes</li>
            <li className="list-disc">Track performance on leaderboards</li>
            <li className="list-disc">Manage multiple teams across different tournaments</li>
          </ul>

          <h3 className="mt-8 mb-3">4. No Wagering or Gambling</h3>
          <p className="mb-6">
            Fantasy Tennis is a <strong>free-to-play platform</strong>. No real money is wagered, and no monetary prizes are awarded. 
            The platform is for entertainment and skill-based competition only.
          </p>

          <h3 className="mt-8 mb-3">5. User Accounts</h3>
          <p className="mb-4">When you create an account, you agree to:</p>
          <ul className="space-y-2 ml-6 mb-6">
            <li className="list-disc">Provide accurate and current information</li>
            <li className="list-disc">Maintain confidentiality of login credentials</li>
            <li className="list-disc">Take responsibility for all activity under your account</li>
            <li className="list-disc">Notify us immediately of any unauthorized access</li>
          </ul>

          <h3 className="mt-8 mb-3">6. Team Creation and Scoring</h3>
          <p className="mb-4">Fantasy teams are subject to the following rules:</p>
          <ul className="space-y-2 ml-6 mb-6">
            <li className="list-disc">Teams must be created before tournament deadlines</li>
            <li className="list-disc">Each team has a virtual budget of $100 for player selection</li>
            <li className="list-disc">Teams consist of 6 players selected from tournament draws</li>
            <li className="list-disc">Scoring is calculated based on real match results and performance metrics</li>
            <li className="list-disc">We reserve the right to adjust scoring rules with advance notice</li>
          </ul>

          <h3 className="mt-8 mb-3">7. Prohibited Activities</h3>
          <p className="mb-4">Users may not engage in:</p>
          <ul className="space-y-2 ml-6 mb-6">
            <li className="list-disc">Using the Site for illegal, harmful, or fraudulent activity</li>
            <li className="list-disc">Creating multiple accounts to gain unfair advantages</li>
            <li className="list-disc">Providing false or misleading information</li>
            <li className="list-disc">Attempting to interfere with or disrupt our services</li>
            <li className="list-disc">Using automated tools or bots to access the Site</li>
            <li className="list-disc">Sharing account credentials with others</li>
          </ul>

          <h3 className="mt-8 mb-3">8. Intellectual Property</h3>
          <p className="mb-6">
            All site content, including designs, logos, text, and graphics, is owned or licensed by Fantasy Tennis. 
            No material may be reused without written permission. Player names, tournament names, and related data 
            are property of their respective organizations.
          </p>

          <h3 className="mt-8 mb-3">9. Data Accuracy and Tournament Results</h3>
          <p className="mb-6">
            We strive to provide accurate, real-time tournament data and scoring. However, we are not responsible for 
            errors in data feeds, delayed updates, or discrepancies in official results. In case of disputes, 
            official tournament results will be considered final.
          </p>

          <h3 className="mt-8 mb-3">10. Limitation of Liability</h3>
          <p className="mb-6">
            We provide the Site "as is." To the maximum extent permitted by law, we are not liable for indirect, 
            incidental, or consequential damages resulting from use of our Site, including but not limited to 
            loss of data, service interruptions, or scoring discrepancies.
          </p>

          <h3 className="mt-8 mb-3">11. Termination</h3>
          <p className="mb-6">
            We may suspend or terminate access for conduct that violates these Terms, harms our business or users, 
            or involves fraudulent activity. Upon termination, your teams and account data may be deleted.
          </p>

          <h3 className="mt-8 mb-3">12. Updates</h3>
          <p className="mb-6">
            We may update these Terms periodically. Continued use of the Site indicates acceptance of new versions. 
            Significant changes will be communicated via email or site notification.
          </p>

          <h3 className="mt-8 mb-3">13. Contact</h3>
          <p className="mb-6">
            Questions? Email{' '}
            <a href="mailto:support@fantasytennis.com" className="text-primary hover:underline">
              support@fantasytennis.com
            </a>
            .
          </p>
        </section>

        {/* ================= Privacy Policy ================= */}
        <section id="privacy">
          <h2 className="mb-6">Privacy Policy</h2>

          <p className="mb-6">
            This Privacy Policy explains how <strong>Fantasy Tennis</strong> ("we," "us," "our") collects, uses, and shares information.
          </p>

          <h3 className="mt-8 mb-3">1. Information We Collect</h3>
          <p className="mb-4">We collect the following types of information:</p>
          <ul className="space-y-2 ml-6 mb-6">
            <li className="list-disc">
              <strong>Account Information:</strong> Name, email address, and password when you create an account
            </li>
            <li className="list-disc">
              <strong>Usage Data:</strong> Team selections, predictions, scores, and interaction with features
            </li>
            <li className="list-disc">
              <strong>Technical Data:</strong> IP address, device information, browser type, and access times
            </li>
            <li className="list-disc">
              <strong>Cookies and Analytics:</strong> Data collected through cookies and similar tracking technologies
            </li>
          </ul>

          <h3 className="mt-8 mb-3">2. How We Use Information</h3>
          <p className="mb-4">Your information is used to:</p>
          <ul className="space-y-2 ml-6 mb-6">
            <li className="list-disc">Provide and improve our fantasy tennis platform</li>
            <li className="list-disc">Create and manage your account</li>
            <li className="list-disc">Calculate scores and maintain leaderboards</li>
            <li className="list-disc">Send important updates about tournaments and features</li>
            <li className="list-disc">Analyze usage patterns to enhance user experience</li>
            <li className="list-disc">Detect and prevent fraudulent activity</li>
            <li className="list-disc">Comply with legal requirements</li>
          </ul>

          <h3 className="mt-8 mb-3">3. Sharing Information</h3>
          <p className="mb-4">We do not sell your personal information. We may share data with:</p>
          <ul className="space-y-2 ml-6 mb-6">
            <li className="list-disc">
              <strong>Service Providers:</strong> Third-party services for authentication (Supabase), hosting, and analytics
            </li>
            <li className="list-disc">
              <strong>Public Leaderboards:</strong> Your username and scores are publicly visible on leaderboards
            </li>
            <li className="list-disc">
              <strong>Legal Requirements:</strong> When required by law or to protect our rights and users
            </li>
          </ul>

          <h3 className="mt-8 mb-3">4. Your Rights</h3>
          <p className="mb-4">You have the right to:</p>
          <ul className="space-y-2 ml-6 mb-6">
            <li className="list-disc">Access your personal data</li>
            <li className="list-disc">Request correction of inaccurate data</li>
            <li className="list-disc">Request deletion of your account and data</li>
            <li className="list-disc">Opt out of marketing communications</li>
            <li className="list-disc">Export your team and prediction data</li>
          </ul>
          <p className="mb-6">
            To exercise these rights, email{' '}
            <a href="mailto:privacy@fantasytennis.com" className="text-primary hover:underline">
              privacy@fantasytennis.com
            </a>
            .
          </p>

          <h3 className="mt-8 mb-3">5. Cookies & Tracking</h3>
          <p className="mb-6">
            We use cookies for authentication, preferences, and analytics. You can manage cookie preferences 
            through your browser settings, though this may affect site functionality.
          </p>

          <h3 className="mt-8 mb-3">6. Data Security</h3>
          <p className="mb-6">
            We implement industry-standard security measures including HTTPS encryption, secure password hashing, 
            and role-based access controls. While we take reasonable precautions, no system is completely secure, 
            and you use the Site at your own risk.
          </p>

          <h3 className="mt-8 mb-3">7. Data Retention</h3>
          <p className="mb-6">
            We retain account and activity data for as long as your account is active or as needed to provide services. 
            Historical tournament data and leaderboards may be retained indefinitely for platform integrity. 
            Upon account deletion, personal identifiers are removed within 30 days.
          </p>

          <h3 className="mt-8 mb-3">8. Children's Privacy</h3>
          <p className="mb-6">
            Our Site is not intended for children under 13. We do not knowingly collect information from children under 13. 
            If we discover such data has been collected, it will be deleted promptly.
          </p>

          <h3 className="mt-8 mb-3">9. Third-Party Services</h3>
          <p className="mb-6">
            We use Supabase for authentication and database services. Your data is stored securely in accordance with 
            Supabase's privacy policy. We also use analytics services to improve our platform. These services have 
            their own privacy policies governing data use.
          </p>

          <h3 className="mt-8 mb-3">10. International Transfers</h3>
          <p className="mb-6">
            Data may be processed in the United States or other countries where our service providers operate. 
            By using the Site, you consent to the transfer of your data to these locations with appropriate safeguards in place.
          </p>

          <h3 className="mt-8 mb-3">11. California Privacy Rights (CCPA)</h3>
          <p className="mb-4">California residents have additional rights under the CCPA:</p>
          <ul className="space-y-2 ml-6 mb-6">
            <li className="list-disc">Right to know what personal data is collected and how it's used</li>
            <li className="list-disc">Right to delete personal data (subject to certain exceptions)</li>
            <li className="list-disc">Right to opt-out of data sales (we do not sell personal data)</li>
            <li className="list-disc">Right to non-discrimination for exercising privacy rights</li>
          </ul>
          <p className="mb-6">
            To submit a request, email{' '}
            <a href="mailto:privacy@fantasytennis.com" className="text-primary hover:underline">
              privacy@fantasytennis.com
            </a>{' '}
            with "CCPA Request" in the subject line.
          </p>

          <h3 className="mt-8 mb-3">12. Updates to Privacy Policy</h3>
          <p className="mb-6">
            We may modify this Privacy Policy periodically. Material changes will be communicated via email or 
            site notification. Continued use after changes constitutes acceptance of the updated policy.
          </p>

          <h3 className="mt-8 mb-3">13. Contact</h3>
          <p className="mb-6">
            For privacy questions or data requests, email{' '}
            <a href="mailto:privacy@fantasytennis.com" className="text-primary hover:underline">
              privacy@fantasytennis.com
            </a>
            .
          </p>
        </section>

        {/* Footer */}
        <footer className="mt-16 pt-6 border-t-2 border-border">
          <p className="opacity-60 mb-2">
            © {new Date().getFullYear()} Fantasy Tennis. All rights reserved.
          </p>
          <p className="opacity-60">
            This is a free-to-play fantasy sports platform. No real money wagering or prizes.
          </p>
        </footer>
      </div>
    </div>
  );
}
