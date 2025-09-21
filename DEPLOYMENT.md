# Mighty Agent Deployment Guide

## 🚀 Complete Deployment Instructions

This guide provides step-by-step instructions for deploying the complete Mighty Agent application to Cloudflare.

## 📋 Prerequisites

### Required Accounts and Tools
- **Cloudflare Account** with Workers AI enabled
- **GitHub Account** for repository management
- **Node.js 18+** and npm installed locally
- **Git** for version control
- **Wrangler CLI** for Cloudflare deployment

### Cloudflare Setup
1. **Enable Workers AI** in your Cloudflare dashboard
2. **Get Account ID** from the right sidebar in Cloudflare dashboard
3. **Generate API Token** with the following permissions:
   - Zone:Zone:Read
   - Zone:Zone Settings:Edit
   - Account:Cloudflare Workers:Edit
   - Account:Account Settings:Read

## 🔧 Environment Configuration

### 1. Cloudflare API Token Setup
```bash
# Set your Cloudflare API token
export CLOUDFLARE_API_TOKEN="your_api_token_here"

# Verify wrangler authentication
wrangler whoami
```

### 2. Update Configuration Files

#### Backend Configuration (`backend/wrangler.toml`)
```toml
name = "mighty-agent-api"
main = "src/index.js"
compatibility_date = "2024-01-15"
account_id = "your_account_id_here"

[ai]
binding = "AI"

[vars]
ENVIRONMENT = "production"
```

#### Frontend Configuration
Update the API endpoint in `src/App.jsx`:
```javascript
const API_BASE_URL = 'https://mighty-agent-api.your-subdomain.workers.dev';
```

## 🚀 Deployment Steps

### Step 1: Deploy Backend (Cloudflare Worker)

```bash
# Navigate to backend directory
cd backend

# Install dependencies (if any)
npm install

# Deploy to Cloudflare Workers
wrangler deploy

# Verify deployment
curl https://mighty-agent-api.your-subdomain.workers.dev/api/health
```

### Step 2: Deploy Frontend (Cloudflare Pages)

```bash
# Navigate to project root
cd ..

# Install frontend dependencies
npm install

# Build for production
npm run build

# Deploy to Cloudflare Pages
wrangler pages deploy dist --project-name mighty-agent-frontend

# Alternative: Connect GitHub repository for automatic deployments
```

### Step 3: Configure Zero Trust Authentication (Optional)

#### 3.1 Set up Cloudflare Access
1. Go to **Zero Trust** > **Access** > **Applications**
2. Click **Add an application** > **Self-hosted**
3. Configure application settings:
   - **Application name**: Mighty Agent
   - **Session duration**: 24 hours
   - **Application domain**: your-app-domain.pages.dev

#### 3.2 Configure Identity Providers
1. Go to **Zero Trust** > **Settings** > **Authentication**
2. Add identity providers (Google, GitHub, etc.)
3. Configure login methods

#### 3.3 Update Worker Configuration
Add Zero Trust domain to `backend/wrangler.toml`:
```toml
[vars]
ZERO_TRUST_DOMAIN = "your-team.cloudflareaccess.com"
```

## 🔍 Verification and Testing

### 1. Backend Health Check
```bash
# Test API health endpoint
curl https://mighty-agent-api.your-subdomain.workers.dev/api/health

# Expected response:
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "3.0.0",
  "features": ["zero_trust_auth", "multi_modal_ai", "image_generation", ...]
}
```

### 2. Frontend Functionality
1. **Access the application**: https://mighty-agent-frontend.pages.dev
2. **Test language selection**: Switch between English and Arabic
3. **Test authentication**: Login with configured identity provider
4. **Test AI interactions**:
   - Text generation: "Hello, how are you?"
   - Image generation: "Generate an image of a sunset"
   - Code generation: "Write a Python function to sort a list"

### 3. Model Integration Test
```bash
# Test model listing
curl https://mighty-agent-api.your-subdomain.workers.dev/api/models

# Test chat functionality
curl -X POST https://mighty-agent-api.your-subdomain.workers.dev/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello, test message",
    "language": "en",
    "type": "general_chat"
  }'
```

## 🔧 Troubleshooting

### Common Issues and Solutions

#### 1. Authentication Errors
**Problem**: `Authentication error (code: 10000)`
**Solution**: 
- Verify API token has correct permissions
- Check account ID in wrangler.toml
- Regenerate API token if necessary

#### 2. AI Model Unavailable
**Problem**: `All models unavailable`
**Solution**:
- Ensure Workers AI is enabled in your account
- Check AI binding in wrangler.toml
- Verify model names match Cloudflare Workers AI catalog

#### 3. CORS Issues
**Problem**: Frontend cannot connect to backend
**Solution**:
- Verify CORS headers in Worker
- Check API endpoint URL in frontend
- Ensure both frontend and backend are deployed

#### 4. Zero Trust Configuration
**Problem**: Authentication not working
**Solution**:
- Verify Zero Trust application configuration
- Check identity provider setup
- Ensure JWT validation in Worker

### Debug Commands
```bash
# View Worker logs
wrangler tail

# Check deployment status
wrangler deployments list

# Test local development
wrangler dev
```

## 📊 Performance Optimization

### 1. Caching Configuration
Add caching headers to improve performance:
```javascript
// In Worker response
headers: {
  'Cache-Control': 'public, max-age=300',
  'CDN-Cache-Control': 'public, max-age=3600'
}
```

### 2. Image Optimization
Configure image optimization in Pages:
```toml
# In wrangler.toml for Pages
[build]
command = "npm run build"
publish = "dist"

[build.environment_variables]
NODE_ENV = "production"
```

### 3. Analytics Setup
Enable analytics for monitoring:
```bash
# Enable Workers Analytics
wrangler analytics --help
```

## 🔄 Continuous Deployment

### GitHub Actions Setup
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy Mighty Agent

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm install
        
      - name: Build frontend
        run: npm run build
        
      - name: Deploy to Cloudflare
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
```

### Environment Secrets
Add to GitHub repository secrets:
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

## 📈 Monitoring and Maintenance

### 1. Performance Monitoring
- **Workers Analytics**: Monitor request volume and latency
- **Real User Monitoring**: Track frontend performance
- **Error Tracking**: Monitor and alert on errors

### 2. Cost Management
- **Usage Monitoring**: Track AI model usage and costs
- **Optimization**: Implement cost-effective model routing
- **Budgets**: Set up billing alerts

### 3. Security Monitoring
- **Access Logs**: Monitor authentication attempts
- **Rate Limiting**: Implement abuse prevention
- **Security Headers**: Ensure proper security configuration

## 🆘 Support and Resources

### Documentation
- [Cloudflare Workers AI Docs](https://developers.cloudflare.com/workers-ai/)
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Zero Trust Docs](https://developers.cloudflare.com/cloudflare-one/)

### Community
- [Cloudflare Discord](https://discord.cloudflare.com)
- [GitHub Issues](https://github.com/your-repo/mighty-agent/issues)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/cloudflare-workers)

### Professional Support
- Cloudflare Enterprise Support
- Professional Services
- Community Forums

---

**Success!** Your Mighty Agent application should now be fully deployed and operational on Cloudflare's global network.

