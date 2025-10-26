import { useState } from 'react';
import { Link } from 'react-router-dom';
import { validateEmail, validatePassword, sanitizeInput } from '@/utils/validation';
import { SocialLoginButtons } from '@/components/auth/SocialLoginButtons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BarChart3, UserPlus, LogIn, AlertCircle, Trophy, Briefcase } from 'lucide-react';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Sign in form
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Sign up form
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  //const [fullName, setFullName] = useState('');
  //const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
const [lastName, setLastName] = useState('');

  const [role, setRole] = useState<'analyst' | 'bounty_creator'>('analyst');

  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');

  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL ||
    'https://starklytics-for-starknet-backend.onrender.com/api';

  // ------------------- SIGN IN -------------------
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (!validateEmail(signInEmail)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: sanitizeInput(signInEmail),
          password: sanitizeInput(signInPassword),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to sign in');

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      setMessage('Signed in successfully!');
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message || 'Something went wrong during sign in');
    } finally {
      setLoading(false);
    }
  };

 // ------------------- SIGN UP -------------------
const handleSignUp = async (e: React.FormEvent) => {
  e.preventDefault();
  console.log('🟢 Signup button clicked');
  setLoading(true);
  setError('');
  setMessage('');

  if (!validateEmail(signUpEmail)) {
    setError('Please enter a valid email address');
    setLoading(false);
    return;
  }

  const passwordValidation = validatePassword(signUpPassword);
  if (!passwordValidation.isValid) {
    setError(passwordValidation.message!);
    setLoading(false);
    return;
  }

  console.log('🔹 Signup data to send:', { firstName, lastName, email: signUpEmail, password: signUpPassword, role });

  try {
    const res = await fetch(`${BACKEND_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: sanitizeInput(firstName),
        lastName: sanitizeInput(lastName),
        email: sanitizeInput(signUpEmail),
        password: sanitizeInput(signUpPassword),
        role,
      }),
    });

    const data = await res.json();
    console.log('📥 Response received:', data);

    if (!res.ok) throw new Error(data.message || 'Signup failed');

    setMessage('Account created successfully! You can now sign in.');
    setError('');
    setActiveTab('signin'); // Switch to Sign In tab
  } catch (err: any) {
    console.error('❌ Signup error:', err);
    setError(err.message || 'Something went wrong during sign up');
  } finally {
    setLoading(false);
  }
};




  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo & Heading */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
              <BarChart3 className="w-7 h-7 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Starklytics
            </span>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Welcome to Starklytics</h1>
          <p className="text-muted-foreground mb-4">
            Join the premier analytics bounty platform for Starknet
          </p>
        </div>

        {/* Card */}
        <Card className="glass border-border">
          <CardHeader>
            <CardTitle className="text-center">Get Started</CardTitle>
            <CardDescription className="text-center">
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'signin' | 'signup')}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin">
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="signup">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Sign Up
                </TabsTrigger>
              </TabsList>

              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {message && (
                <Alert className="mb-4">
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}

              {/* SIGN IN */}
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="Enter your email"
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="Enter your password"
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full glow-primary" disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>

              {/* SIGN UP */}
            <TabsContent value="signup">
  <form onSubmit={handleSignUp} className="space-y-4">
    {/* First Name & Last Name */}
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="first-name">First Name</Label>
        <Input
          id="first-name"
          placeholder="John"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="last-name">Last Name</Label>
        <Input
          id="last-name"
          placeholder="Doe"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
      </div>
    </div>

    {/* Role selection */}
    <div className="space-y-2">
      <Label htmlFor="role">I want to</Label>
      <Select
        value={role}
        onValueChange={(value: 'analyst' | 'bounty_creator') => setRole(value)}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="analyst">
            <div className="flex items-center space-x-2">
              <Trophy className="w-4 h-4 text-chart-warning" />
              <div className="text-left">
                <div className="font-medium">Work on Bounties</div>
                <div className="text-xs text-muted-foreground">
                  Solve analytics challenges and earn rewards
                </div>
              </div>
            </div>
          </SelectItem>
          <SelectItem value="bounty_creator">
            <div className="flex items-center space-x-2">
              <Briefcase className="w-4 h-4 text-chart-primary" />
              <div className="text-left">
                <div className="font-medium">Create Bounties</div>
                <div className="text-xs text-muted-foreground">
                  Post analytics challenges for the community
                </div>
              </div>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>

    {/* Email */}
    <div className="space-y-2">
      <Label htmlFor="signup-email">Email</Label>
      <Input
        id="signup-email"
        type="email"
        placeholder="Enter your email"
        value={signUpEmail}
        onChange={(e) => setSignUpEmail(e.target.value)}
        required
      />
    </div>

    {/* Password */}
    <div className="space-y-2">
      <Label htmlFor="signup-password">Password</Label>
      <Input
        id="signup-password"
        type="password"
        placeholder="Create a password"
        value={signUpPassword}
        onChange={(e) => setSignUpPassword(e.target.value)}
        required
      />
    </div>

    {/* Submit button */}
    <Button type="submit" className="w-full glow-primary" disabled={loading}>
      {loading ? 'Creating account...' : 'Create Account'}
    </Button>
  </form>
</TabsContent>

            </Tabs>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
