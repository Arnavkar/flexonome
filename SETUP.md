# Supabase Authentication Setup Guide

This guide will help you set up Supabase authentication for your Flexonome application.

## Prerequisites

1. [Create a Supabase account](https://app.supabase.com/) if you don't already have one.
2. Create a new Supabase project.

## Steps

### 1. Set up environment variables

Create a `.env` file in the root of your project with the following variables:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-url.supabase.co
SUPABASE_KEY=your-supabase-anon-key
```

Replace the values with your actual Supabase project URL and anon key from the Supabase dashboard (Project Settings > API).

### 2. Configure Authentication Providers

#### Email OTP (Magic Link)

1. In your Supabase dashboard, go to Authentication > Providers.
2. Enable "Email" provider.
3. Set "Confirm email" to OFF if you want to use Magic Links without passwords.

#### Google OAuth

1. In your Supabase dashboard, go to Authentication > Providers.
2. Enable "Google" provider.
3. Create OAuth credentials at [Google Cloud Console](https://console.cloud.google.com/):
   - Create a new project
   - Go to APIs & Services > Credentials
   - Create OAuth 2.0 Client ID
   - Add authorized redirect URI: `https://your-project-url.supabase.co/auth/v1/callback`
4. Copy the Client ID and Client Secret to your Supabase provider settings.

#### Facebook OAuth

1. In your Supabase dashboard, go to Authentication > Providers.
2. Enable "Facebook" provider.
3. Create an app at [Facebook Developers](https://developers.facebook.com/):
   - Create a new app
   - Add Facebook Login
   - In Facebook Login settings, add the redirect URI: `https://your-project-url.supabase.co/auth/v1/callback`
4. Copy the App ID and App Secret to your Supabase provider settings.

### 3. Configure Redirect URLs

In your Supabase dashboard, go to Authentication > URL Configuration:

1. Site URL: Add your application's URL (e.g., `http://localhost:3000` for development)
2. Redirect URLs: Add all allowed redirect URLs (e.g., `http://localhost:3000/auth/confirm`)

### 4. Test Authentication

Once everything is set up, you should be able to:

1. Load the application
2. Click "Get Started" on the intro page
3. Sign in using any of the configured methods
4. Access protected routes like the metronome page

## Troubleshooting

- **CORS errors**: Make sure your site URL is correctly configured in Supabase.
- **Redirect issues**: Check that your redirect URLs are properly configured in Supabase.
- **Authentication errors**: Look at the browser console for specific error messages from Supabase. 