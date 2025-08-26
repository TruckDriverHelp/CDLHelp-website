# Server-Side Tagging Setup Guide

## Overview

Server-side tagging provides a more reliable and secure way to track conversions by processing tags on a server instead of in the user's browser. This approach is **resistant to ad blockers** and provides better data quality.

## Benefits

- **+30% more conversion data** captured (not blocked by ad blockers)
- **Better data quality** with server-side validation
- **Enhanced privacy** - PII never leaves your servers
- **Improved page speed** - fewer client-side scripts
- **Cross-domain tracking** without third-party cookies
- **Data enrichment** capabilities on the server

## Setup Instructions

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable billing (required for Cloud Run)
4. Note your Project ID

### Step 2: Deploy GTM Server Container

#### Option A: Use Google's Automatic Provisioning (Recommended)

1. Go to Google Tag Manager
2. Create a new **Server** container
3. Click "Automatically provision tagging server"
4. Select your Google Cloud project
5. Choose deployment type:
   - **Testing** (free tier, limited)
   - **Production** (scalable, ~$120/month)
6. Click "Create Server"
7. Wait for deployment (5-10 minutes)
8. Copy your Container Config URL

#### Option B: Manual Deployment on Cloud Run

1. Open Cloud Shell in Google Cloud Console
2. Run the deployment script:

```bash
# Set variables
PROJECT_ID="your-project-id"
CONTAINER_CONFIG="https://www.googletagmanager.com/server.js?id=GTM-XXXXXX"
REGION="us-central1"

# Deploy to Cloud Run
gcloud run deploy gtm-server \
  --image gcr.io/cloud-tagging-10302018/gtm-cloud-image:stable \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --set-env-vars CONTAINER_CONFIG=$CONTAINER_CONFIG \
  --min-instances 1 \
  --max-instances 10 \
  --memory 256Mi
```

3. Note the service URL provided

#### Option C: Self-Hosted on Your Infrastructure

1. Use Docker to run the GTM server container:

```bash
docker run -d \
  -p 8080:8080 \
  -e CONTAINER_CONFIG="https://www.googletagmanager.com/server.js?id=GTM-XXXXXX" \
  -e PORT=8080 \
  gcr.io/cloud-tagging-10302018/gtm-cloud-image:stable
```

2. Set up a reverse proxy (nginx/Apache) with SSL
3. Point a subdomain to your server (e.g., `tags.cdlhelp.com`)

### Step 3: Configure Custom Domain (Important!)

Using a custom domain improves tracking reliability:

1. In Cloud Run, go to "Manage Custom Domains"
2. Add domain: `tags.cdlhelp.com` or `gtm.cdlhelp.com`
3. Add the provided DNS records to your domain
4. Wait for SSL certificate provisioning

### Step 4: Update Website Configuration

1. Add environment variables to `.env.local`:

```env
NEXT_PUBLIC_GTM_SERVER_URL=https://tags.cdlhelp.com/gtm
NEXT_PUBLIC_GTM_SERVER_CONTAINER_ID=GTM-XXXXXX
```

2. The server-side tagging library will automatically use these values

### Step 5: Configure Server Container Tags

1. Go to your GTM Server Container
2. Add a **Client**:
   - Type: "GA4"
   - Trigger: All requests
   
3. Add Tags for each platform:

#### Google Analytics 4 Tag
```
Tag Type: Google Analytics: GA4
Configuration Tag: None (use settings)
Measurement ID: G-XXXXXXXXXX
Event Name: {{Event Name}}
Event Parameters: Use Data Layer
Trigger: All Events
```

#### Google Ads Conversion Tag
```
Tag Type: Google Ads Conversion Tracking
Conversion ID: AW-XXXXXXXXX
Conversion Label: {{Conversion Label}}
Conversion Value: {{Event Value}}
Transaction ID: {{Transaction ID}}
Trigger: Conversion Events
```

#### Facebook Conversions API Tag
```
Tag Type: Facebook Conversions API
Pixel ID: XXXXXXXXXXXXXXX
Access Token: {{Facebook Access Token}}
Event Name: {{Event Name}}
User Data: From Event Data
Trigger: All Events
```

### Step 6: Set Up Event Routing

Create triggers for different event types:

1. **Page View Trigger**
   - Trigger Type: Custom
   - Condition: Event Name equals "page_view"

2. **Conversion Trigger**
   - Trigger Type: Custom
   - Condition: Event Name equals "conversion"

3. **Ecommerce Trigger**
   - Trigger Type: Custom
   - Condition: Event Name starts with "ecommerce_"

### Step 7: Configure Variables

Set up server-side variables:

1. **Client ID**
   - Variable Type: Event Data
   - Key Path: client_id

2. **User IP Address**
   - Variable Type: HTTP Request
   - Component Type: Remote Address

3. **User Agent**
   - Variable Type: HTTP Request
   - Component Type: Header
   - Header Name: user-agent

### Step 8: Test Implementation

1. Use GTM Preview mode:
   - Open Server container
   - Click "Preview"
   - Send test events from website
   - Verify tags fire correctly

2. Check in platform dashboards:
   - Google Analytics Real-Time
   - Google Ads Conversions
   - Facebook Events Manager

3. Use debug mode:
   ```javascript
   // Enable debug logging
   serverSideTagging.debug = true;
   
   // Check configuration
   console.log(serverSideTagging.getDebugInfo());
   ```

## Configuration for CDLHelp

### Current Implementation

The website now includes `server-side-tagging.js` which:
- Sends events to your GTM server container
- Handles offline queuing
- Includes consent state
- Adds user and device context
- Supports multiple transport methods

### Events Tracked

1. **Page Views**
   - Automatically tracked on route change
   - Includes referrer and page title

2. **Conversions**
   - Purchase events
   - Trial starts
   - Sign-ups
   - Quiz completions

3. **Enhanced Ecommerce**
   - Add to cart
   - Begin checkout
   - Purchase
   - Refund

### Data Flow

```
User Action
    ↓
Client-Side JavaScript
    ↓
Server-Side GTM Container (tags.cdlhelp.com)
    ↓
Processing & Enrichment
    ↓
Distribution to Platforms:
    ├── Google Analytics 4
    ├── Google Ads
    ├── Facebook CAPI
    └── Other Marketing Tools
```

## Cost Estimation

### Google Cloud Run Costs

- **Basic Setup**: ~$50-100/month
  - 1-2 instances minimum
  - 256MB memory
  - 1M requests/month

- **Production Setup**: ~$120-200/month
  - 3-5 instances minimum
  - 512MB memory
  - 5M requests/month

- **High Traffic**: ~$300-500/month
  - 10+ instances
  - 1GB memory
  - 20M+ requests/month

### Cost Optimization Tips

1. Use Cloud Run minimum instances = 0 for testing
2. Set appropriate max instances to prevent runaway costs
3. Use Cloud CDN for static assets
4. Implement request batching
5. Filter unnecessary events server-side

## Monitoring & Maintenance

### Key Metrics to Monitor

1. **Cloud Run Metrics**
   - Request count
   - Error rate
   - Latency (p50, p95, p99)
   - Instance count

2. **Conversion Tracking**
   - Events received vs sent
   - Platform match rates
   - Error logs

3. **Cost Tracking**
   - Daily spend
   - Cost per conversion
   - Resource utilization

### Regular Maintenance Tasks

Weekly:
- [ ] Check error logs
- [ ] Verify conversion tracking
- [ ] Monitor costs

Monthly:
- [ ] Update GTM container
- [ ] Review tag configurations
- [ ] Optimize server resources
- [ ] Audit data quality

Quarterly:
- [ ] Security updates
- [ ] Performance optimization
- [ ] Cost review

## Troubleshooting

### Common Issues

1. **Events not reaching server**
   - Check CORS configuration
   - Verify SSL certificate
   - Check firewall rules

2. **High latency**
   - Increase instance memory
   - Add more regions
   - Enable Cloud CDN

3. **Missing conversions**
   - Check trigger conditions
   - Verify tag configuration
   - Review consent state

4. **High costs**
   - Reduce minimum instances
   - Filter events server-side
   - Use batching

## Security Best Practices

1. **Access Control**
   - Use IAM roles for Cloud Run
   - Restrict GTM container access
   - Enable audit logging

2. **Data Protection**
   - Hash PII before sending
   - Use HTTPS only
   - Implement rate limiting

3. **Compliance**
   - Honor consent choices
   - Implement data retention
   - Document data flows

## Next Steps

1. ✅ Deploy GTM Server Container
2. ✅ Configure custom domain
3. ✅ Update environment variables
4. ✅ Test with Preview mode
5. ✅ Monitor for 24 hours
6. ✅ Optimize based on data

## Support Resources

- [GTM Server-Side Documentation](https://developers.google.com/tag-platform/tag-manager/server-side)
- [Cloud Run Pricing](https://cloud.google.com/run/pricing)
- [Server Container Templates](https://www.simoahava.com/analytics/server-side-tagging-google-tag-manager/)
- [Facebook CAPI Setup](https://developers.facebook.com/docs/marketing-api/conversions-api)

## Implementation Status

- ✅ Client-side library created (`server-side-tagging.js`)
- ✅ Event queuing for offline support
- ✅ Consent state integration
- ✅ Multiple transport methods
- ⏳ Waiting for GTM server container deployment
- ⏳ Custom domain configuration needed
- ⏳ Server container tags configuration needed