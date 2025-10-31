import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Mail, Phone, X } from 'lucide-react';
import { createClient } from '../utils/supabase/client';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface LoginProps {
  onLoginSuccess: (accessToken: string, user: any) => void;
  onClose?: () => void;
  initialMode?: 'login' | 'signup';
}

export function Login({ onLoginSuccess, onClose, initialMode = 'signup' }: LoginProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [authMethod, setAuthMethod] = useState<'email' | 'phone' | null>(null);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  const handleEmailAuth = async () => {
    setLoading(true);
    setError('');

    try {
      if (mode === 'signup') {
        // Call backend signup endpoint
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-a989b36a/signup`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${publicAnonKey}`,
            },
            body: JSON.stringify({ email, password, name }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Signup failed');
        }

        // After signup, sign in
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;
        
        if (signInData.session) {
          onLoginSuccess(signInData.session.access_token, signInData.user);
        }
      } else {
        // Sign in
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;
        
        if (data.session) {
          onLoginSuccess(data.session.access_token, data.user);
        }
      }
    } catch (err: any) {
      console.error('Email auth error:', err);
      
      // Provide helpful error messages
      if (err.message?.includes('Invalid login credentials')) {
        setError('Invalid email or password. Don\'t have an account? Sign up below.');
      } else if (err.message?.includes('Email not confirmed')) {
        setError('Please confirm your email address to continue.');
      } else {
        setError(err.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneAuth = async () => {
    setLoading(true);
    setError('');

    try {
      if (mode === 'signup') {
        // Call backend signup endpoint
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-a989b36a/signup`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${publicAnonKey}`,
            },
            body: JSON.stringify({ phone, password, name }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Signup failed');
        }

        // After signup, sign in
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          phone,
          password,
        });

        if (signInError) throw signInError;
        
        if (signInData.session) {
          onLoginSuccess(signInData.session.access_token, signInData.user);
        }
      } else {
        // Sign in
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          phone,
          password,
        });

        if (signInError) throw signInError;
        
        if (data.session) {
          onLoginSuccess(data.session.access_token, data.user);
        }
      }
    } catch (err: any) {
      console.error('Phone auth error:', err);
      
      // Provide helpful error messages
      if (err.message?.includes('Invalid login credentials')) {
        setError('Invalid phone or password. Don\'t have an account? Sign up below.');
      } else {
        setError(err.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError('');

    try {
      // Complete setup required: https://supabase.com/docs/guides/auth/social-login/auth-google
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });

      if (error) throw error;
    } catch (err: any) {
      console.error('Google auth error:', err);
      setError('Google authentication requires setup in Supabase dashboard. Please use Email login for now.');
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookAuth = async () => {
    setLoading(true);
    setError('');

    try {
      // Complete setup required: https://supabase.com/docs/guides/auth/social-login/auth-facebook
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
      });

      if (error) throw error;
    } catch (err: any) {
      console.error('Facebook auth error:', err);
      setError('Facebook authentication requires setup in Supabase dashboard. Please use Email login for now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-card border-border shadow-[var(--elevation-lg)] rounded-[var(--radius)] p-6 relative">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-accent rounded-[var(--radius)] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close login dialog"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="mb-6">
          <h2 className="mb-2">{mode === 'login' ? 'Welcome Back!' : 'Create Your Account'}</h2>
          <p className="text-card-foreground/60">
            {mode === 'login' ? 'Sign in to access your teams' : 'Sign up to start playing Fantasy Tennis'}
          </p>
        </div>

        {!authMethod ? (
          <div className="space-y-3">
            <Button
              onClick={() => setAuthMethod('email')}
              variant="outline"
              className="w-full min-h-[44px] rounded-[var(--radius)] shadow-[var(--elevation-sm)] hover:shadow-[var(--elevation-md)] transition-all"
            >
              <Mail className="w-5 h-5 mr-2" />
              Continue with Email
            </Button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-card px-4 text-card-foreground/60">Coming Soon</span>
              </div>
            </div>

            <Button
              onClick={handleGoogleAuth}
              disabled={loading}
              className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-border min-h-[44px] rounded-[var(--radius)] shadow-[var(--elevation-sm)] hover:shadow-[var(--elevation-md)] transition-all opacity-60"
              title="Requires Google OAuth setup in Supabase dashboard"
            >
              <Mail className="w-5 h-5 mr-2" />
              Continue with Google
            </Button>

            <Button
              onClick={handleFacebookAuth}
              disabled={loading}
              className="w-full bg-[#1877F2] hover:bg-[#166FE5] text-white border-0 min-h-[44px] rounded-[var(--radius)] shadow-[var(--elevation-sm)] hover:shadow-[var(--elevation-md)] transition-all opacity-60"
              title="Requires Facebook OAuth setup in Supabase dashboard"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Continue with Facebook
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Button
              onClick={() => setAuthMethod(null)}
              variant="ghost"
              className="mb-2 min-h-[44px]"
            >
              ← Back to options
            </Button>

            {mode === 'signup' && (
              <div>
                <label htmlFor="name" className="block mb-2">Name</label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full min-h-[44px] rounded-[var(--radius)] border-border bg-input-background placeholder:opacity-30"
                />
              </div>
            )}

            {authMethod === 'email' ? (
              <div>
                <label htmlFor="email" className="block mb-2">Email</label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full min-h-[44px] rounded-[var(--radius)] border-border bg-input-background placeholder:opacity-30"
                />
              </div>
            ) : (
              <div>
                <label htmlFor="phone" className="block mb-2">Phone Number</label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1234567890"
                  className="w-full min-h-[44px] rounded-[var(--radius)] border-border bg-input-background"
                />
              </div>
            )}

            <div>
              <label htmlFor="password" className="block mb-2">Password</label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full min-h-[44px] rounded-[var(--radius)] border-border bg-input-background placeholder:opacity-30"
              />
            </div>

            {error && (
              <p className="text-destructive bg-destructive/10 p-3 rounded-[var(--radius)]">
                {error}
              </p>
            )}

            <Button
              onClick={authMethod === 'email' ? handleEmailAuth : handlePhoneAuth}
              disabled={loading || (!email && !phone) || !password || (mode === 'signup' && !name)}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground min-h-[44px] rounded-[var(--radius)] shadow-[var(--elevation-md)] hover:shadow-[var(--elevation-hover)] transition-all"
            >
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Sign Up'}
            </Button>

            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-center text-card-foreground/60">
                {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                <button
                  onClick={() => {
                    setMode(mode === 'login' ? 'signup' : 'login');
                    setError('');
                  }}
                  className="text-primary hover:underline"
                >
                  {mode === 'login' ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
