# Paystack Payment Integration - Setup Guide

This guide explains how to set up Paystack payments for the DeityMusic subscription system.

## Prerequisites

1. A Paystack account (sign up at https://dashboard.paystack.co/#/signup)
2. Your Paystack Public Key and Secret Key
3. A deployed version of your app (or use ngrok for local testing)

## Step 1: Get Your Paystack Keys

1. Log into your Paystack Dashboard
2. Go to Settings → API Keys → Webhooks
3. Copy your **Public Key** (starts with `pk_`)
4. Copy your **Secret Key** (starts with `sk_`)

## Step 2: Configure Environment Variables

Add these to your `.env.local` file:

```env
# Paystack Payment Gateway
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

For production:
```env
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_YOUR_PUBLIC_KEY_HERE
PAYSTACK_SECRET_KEY=sk_live_YOUR_SECRET_KEY_HERE
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## Step 3: Set Up Webhook

1. In your Paystack Dashboard, go to Settings → Webhooks
2. Add a new webhook URL: `https://your-domain.com/api/payments/webhook`
3. For local testing, use ngrok: `ngrok http 3000` and use the ngrok URL
4. Select the following events to listen for:
   - `charge.success` - When a payment is successful
   - `charge.failed` - When a payment fails (optional)

## Step 4: Test the Integration

### Test Mode (Sandbox)
Paystack provides test mode by default with test cards. Use these test cards:

**Successful Payment:**
- Card Number: `4084 0840 8400 8400`
- Expiry: `12/30` (any future date)
- CVV: `408`
- PIN: `1111` (if requested)

**Failed Payment:**
- Card Number: `4084 0840 0840 0841`
- Expiry: `12/30`
- CVV: `408`

### Testing the Flow

1. Go to `/subscription` (logged in)
2. Click "Get Started" on any plan
3. Click "Pay ₦XX,XXX" button
4. Complete payment with test card
5. You'll be redirected to `/subscription/verify`
6. Webhook will activate your subscription
7. Redirected to `/subscription/success`

## Step 5: Go Live

When ready for production:

1. Switch to live keys in your `.env.local`
2. Update `NEXT_PUBLIC_APP_URL` to production URL
3. Add production webhook URL in Paystack Dashboard
4. Test with real card (small amount first)

## Payment Flow Diagram

```
User clicks "Get Started"
        ↓
Checkout page loads
        ↓
User clicks "Pay"
        ↓
POST /api/payments/initialize
        ↓
Creates PENDING subscription
        ↓
Returns Paystack authorization URL
        ↓
Opens Paystack payment popup
        ↓
User enters payment details
        ↓
Payment successful → Paystack sends webhook
        ↓
POST /api/payments/webhook
        ↓
Verifies webhook signature
        ↓
Updates subscription to ACTIVE
        ↓
User redirected to success page
```

## API Endpoints

### POST `/api/payments/initialize`
Initializes a Paystack transaction.

**Request:**
```json
{
  "plan": "starter" | "pro" | "elite"
}
```

**Response:**
```json
{
  "success": true,
  "authorization_url": "https://checkout.paystack.com/...",
  "reference": "DEITY_xxx_xxx_timestamp",
  "access_code": "..."
}
```

### POST `/api/payments/webhook`
Receives payment confirmation from Paystack.

**Headers:**
- `x-paystack-signature`: HMAC SHA512 signature

**Event:** `charge.success`

**Response:** `{ received: true }`

### GET `/api/subscriptions/check`
Checks if user has active subscription.

**Response:**
```json
{
  "hasSubscription": true,
  "subscription": {
    "plan": "PRO",
    "endDate": "2025-12-29T10:00:00Z",
    "startDate": "2024-12-29T10:00:00Z"
  }
}
```

## Webhook Events

### `charge.success`
Triggered when a payment is successful. This webhook:
1. Verifies the signature
2. Finds the PENDING subscription
3. Updates status to ACTIVE
4. Sets payment method to "Paystack"

### `charge.failed` (Optional)
You can add handling for failed payments if needed.

## Security

- All webhooks are verified using HMAC SHA512 signature
- Secret key is never exposed to client
- Public key is safe to expose (used for popup initialization)
- All payment operations require authenticated user

## Troubleshooting

### Payment not activating subscription
1. Check server logs for webhook errors
2. Verify webhook URL is accessible (use webhook.site to test)
3. Check Paystack Dashboard → Transactions for payment status
4. Ensure signature verification is passing

### "Paystack payment handler not available"
1. Check if inline script loaded correctly
2. Verify `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` is set
3. Check browser console for errors

### Webhook signature verification failing
1. Ensure `PAYSTACK_SECRET_KEY` matches your dashboard
2. Check if using test/live keys consistently
3. Verify raw body is used for signature calculation

## Subscription Pricing

- **Starter**: ₦10,000/year - 1 artist
- **Pro**: ₦25,000/year - 2 artists + custom label
- **Elite**: ₦80,000/year - 5 artists + bulk uploads

All plans include unlimited uploads and distribution to 150+ platforms.

## Support

For Paystack-specific issues:
- Documentation: https://paystack.com/docs
- Support: support@paystack.co
- Twitter: @paystack

For DeityMusic platform issues, check your application logs.
