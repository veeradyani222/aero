'use client'
import signIn from "@/firebase/auth/signIn";
import googleSignIn from "@/firebase/auth/googleSignIn";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";

function Page(): React.ReactElement {
  const [ email, setEmail ] = useState( '' );
  const [ password, setPassword ] = useState( '' );
  const [ isLoading, setIsLoading ] = useState( false );
  const [ isGoogleLoading, setIsGoogleLoading ] = useState( false );
  const [ error, setError ] = useState( '' );
  const router = useRouter();
  const { user, loading } = useAuthContext();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [loading, user, router]);

  // Handle form submission
  const handleForm = async ( event: { preventDefault: () => void } ) => {
    event.preventDefault();
    
    setIsLoading( true );
    setError( '' ); // Clear any previous errors

    // Attempt to sign in with provided email and password
    const { result, error: signInError } = await signIn( email, password );

    if ( signInError ) {
      // Handle specific Firebase auth errors
      let errorMessage = 'An error occurred during sign in. Please try again.';
      
      const firebaseError = signInError as any;
      if ( firebaseError.code === 'auth/user-not-found' ) {
        errorMessage = 'No account found with this email. Please check your email or sign up.';
      } else if ( firebaseError.code === 'auth/wrong-password' ) {
        errorMessage = 'Incorrect password. Please try again.';
      } else if ( firebaseError.code === 'auth/invalid-email' ) {
        errorMessage = 'Please enter a valid email address.';
      } else if ( firebaseError.code === 'auth/user-disabled' ) {
        errorMessage = 'This account has been disabled. Please contact support.';
      } else if ( firebaseError.code === 'auth/too-many-requests' ) {
        errorMessage = 'Too many failed attempts. Please try again later.';
      }
      
      setError( errorMessage );
      setIsLoading( false );
      return;
    }

    // Sign in successful
    console.log( result );

    // Redirect to the dashboard page
    // Typically you would want to redirect them to a protected page an add a check to see if they are admin or 
    // create a new page for admin
    router.push( "/dashboard" );
  }

  // Handle Google sign-in
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading( true );
    setError( '' ); // Clear any previous errors

    const { result, error: googleError } = await googleSignIn();

    if ( googleError ) {
      let errorMessage = 'An error occurred with Google sign-in. Please try again.';
      
      const firebaseError = googleError as any;
      if ( firebaseError.code === 'auth/popup-closed-by-user' ) {
        errorMessage = 'Sign-in was cancelled. Please try again.';
      } else if ( firebaseError.code === 'auth/popup-blocked' ) {
        errorMessage = 'Pop-up was blocked by your browser. Please allow pop-ups and try again.';
      }
      
      setError( errorMessage );
      setIsGoogleLoading( false );
      return;
    }

    console.log( result );
    router.push( "/dashboard" );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black font-sans">
      <div className="w-full max-w-sm px-6">
        <div className="text-center mb-10">
          <a href="/" className="text-5xl font-bold tracking-tighter text-white hover:opacity-80 transition-opacity">
            AERO
          </a>
        </div>

        <form onSubmit={handleForm} className="bg-white/5 border border-white/10 p-8 ">
          <h1 className="text-2xl  font-bold mb-8 text-white">Sign In</h1>
          
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20">
              <p className="text-destructive text-xs flex items-center">
                {error}
              </p>
            </div>
          )}

          <div className="mb-6">
            <label htmlFor="email" className="block text-white/60 text-[10px] uppercase tracking-widest font-bold mb-2">
              Email Address
            </label>
            <input
              onChange={( e ) => {
                setEmail( e.target.value );
                if ( error ) setError( '' );
              }}
              required
              type="email"
              name="email"
              id="email"
              placeholder="name@company.com"
              className="w-full bg-black border border-white/10 py-3 px-4 text-white text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="mb-8">
            <label htmlFor="password" className="block text-white/60 text-[10px] uppercase tracking-widest font-bold mb-2">
              Password
            </label>
            <input
              onChange={( e ) => {
                setPassword( e.target.value );
                if ( error ) setError( '' );
              }}
              required
              type="password"
              name="password"
              id="password"
              placeholder="••••••••"
              className="w-full bg-black border border-white/10 py-3 px-4 text-white text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || isGoogleLoading}
            className={`w-full font-bold uppercase tracking-widest text-xs py-4 flex items-center justify-center transition-all ${
              isLoading 
                ? 'bg-white/10 text-black/40' 
                : 'bg-primary text-black hover:bg-primary/90'
            }`}
          >
            {isLoading ? (
              <div className="spinner h-4 w-4"></div>
            ) : (
              'Access Account'
            )}
          </button>
          
          <div className="flex items-center my-8">
            <div className="flex-1 border-t border-white/10"></div>
            <span className="px-4 text-white/20 text-[10px] uppercase tracking-widest">or</span>
            <div className="flex-1 border-t border-white/10"></div>
          </div>
          
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading || isGoogleLoading}
            className={`w-full font-bold uppercase tracking-widest text-xs py-4 px-4 flex items-center justify-center border transition-all ${
              isGoogleLoading 
                ? 'bg-white/5 border-white/10 text-white/20' 
                : 'bg-white/5 hover:bg-white/10 border-white/20 text-white'
            }`}
          >
            {isGoogleLoading ? (
              <div className="spinner h-4 w-4"></div>
            ) : (
              <>
                <svg className="w-4 h-4 mr-3" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" opacity="0.8" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" opacity="0.6" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" opacity="0.4" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-[10px] uppercase tracking-widest text-white/40">
          New to Aero?{' '}
          <a href="/signup" className="text-white hover:underline font-bold">Create Account</a>
        </div>
      </div>
    </div>
  );
}

export default Page;
