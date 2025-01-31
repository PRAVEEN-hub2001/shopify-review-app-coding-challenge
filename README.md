
# 🛍️ Shopify Product Review App

## 🚀 Getting Started

### Step 1: Set Up the Project  
1. **Clone the repository and navigate to the directory:**
   ```bash
   git clone https://github.com/PRAVEEN-hub2001/shopify-review-app-coding-challenge.git
   cd shopify-review-app-coding-challenge
   ```
2. **Install the necessary dependencies with:**
   ```bash
   npm install
   ```

### Step 2: Run the Development Server  
1. **To start the development server, run:**
```bash
npm run dev
```  
- Press P to open the app URL in your browser. This will give you a local environment for development.  

### Step 3: Set Up Partners Dashboard for Proxy
1. **You need to set up the proxy by going to your Shopify Partner Dashboard and configuring the app:**
- Navigate to Apps Menu → All Apps.
- Click on the installed app.
- Go to the Configuration menu and copy the URLs.
- Set up the proxy by adding a subpath for the review form.
```bash
Subpath prefix: apps
Subpath: proxy
Proxy URL: {Your App Url}/app/review_form
```  

### Step 4: Add Extension in Storefront
1. **To add the review form to the storefront, you need to customize the theme:**
- Go to Online Store → Themes → Customize → Product Page.
- Add the Review Form Block and save the changes.


