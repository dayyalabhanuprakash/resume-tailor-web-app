# Bhanu's Resume Tailor - Deployment Guide

## 🚀 Deploy to Render

This application is ready to deploy on [Render.com](https://render.com). Follow these steps:

### Prerequisites
- GitHub account
- Render account (free tier available)

### Step 1: Push to GitHub

1. **Create a new repository on GitHub:**
   - Go to https://github.com/dayyalabhanuprakash
   - Click "New repository"
   - Name it: `resume-tailor` or `bhanu-resume-app`
   - Keep it public or private
   - Don't initialize with README (we already have files)

2. **Push your code to GitHub:**
   ```bash
   cd resume-tailor-app
   git init
   git add .
   git commit -m "Initial commit - Bhanu's Resume Tailor App"
   git branch -M main
   git remote add origin https://github.com/dayyalabhanuprakash/resume-tailor.git
   git push -u origin main
   ```

### Step 2: Deploy on Render

1. **Go to Render Dashboard:**
   - Visit https://dashboard.render.com/
   - Sign in with your GitHub account

2. **Create New Web Service:**
   - Click "New +" button
   - Select "Web Service"
   - Connect your GitHub repository
   - Select the `resume-tailor` repository

3. **Configure the Service:**
   - **Name:** `bhanu-resume-tailor` (or your preferred name)
   - **Environment:** Python 3
   - **Build Command:** 
     ```
     pip install -r requirements.txt && python -m nltk.downloader punkt stopwords punkt_tab
     ```
   - **Start Command:** 
     ```
     gunicorn app:app
     ```
   - **Plan:** Free (or select your preferred plan)

4. **Deploy:**
   - Click "Create Web Service"
   - Render will automatically build and deploy your app
   - Wait for the deployment to complete (usually 2-5 minutes)

5. **Access Your App:**
   - Your app will be available at: `https://bhanu-resume-tailor.onrender.com`
   - Or the custom name you chose

### Step 3: Test Your Deployment

1. Visit your deployed URL
2. You should see the beautiful landing page
3. Try uploading a resume and job description
4. Test the download functionality

## 🎯 Features

- ✅ Beautiful, modern UI
- ✅ AI-powered resume analysis
- ✅ ATS score calculation
- ✅ Keyword optimization
- ✅ PDF and LaTeX output
- ✅ Mobile responsive
- ✅ Fast and secure

## 📱 Access from Any Device

Once deployed, you can access your app from:
- 🖥️ Desktop computers
- 📱 Mobile phones
- 💻 Tablets
- 🌐 Any device with internet connection

Just share the URL: `https://bhanu-resume-tailor.onrender.com`

## 🔧 Environment Variables (Optional)

If you need to add environment variables:
1. Go to your Render dashboard
2. Select your service
3. Go to "Environment" tab
4. Add variables as needed

## 🆓 Free Tier Notes

Render free tier includes:
- ✅ 750 hours/month (enough for continuous operation)
- ✅ Automatic HTTPS
- ✅ Custom domain support
- ⚠️ Apps sleep after 15 minutes of inactivity
- ⚠️ First request after sleep takes 30-60 seconds

## 🚨 Important Notes

### LaTeX Compilation
The current setup works for text analysis and keyword extraction. However, LaTeX PDF compilation requires Tectonic, which may not work on Render's free tier due to disk space limitations.

**Workaround:** The app will still:
- Analyze resumes
- Extract keywords
- Calculate ATS scores
- Generate LaTeX source files
- Provide suggestions

For PDF generation, you can:
1. Download the LaTeX source
2. Compile it locally with Tectonic or Overleaf
3. Or upgrade to Render's paid tier with more resources

### File Storage
Uploaded files and generated outputs are stored temporarily. On Render's free tier:
- Files are stored in ephemeral storage
- They persist during the session
- They may be cleared on app restart

## 🔄 Updates and Redeployment

To update your app:
1. Make changes to your code
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Updated features"
   git push
   ```
3. Render will automatically detect changes and redeploy

## 🆘 Troubleshooting

### App Not Loading
- Check Render dashboard for deployment logs
- Ensure all dependencies are in requirements.txt
- Verify build command completed successfully

### NLTK Errors
- Make sure punkt and stopwords are downloaded in build command
- Check logs for specific NLTK errors

### Static Files Not Serving
- Ensure files are in `static/` folder
- Check that Flask is configured with `static_folder='static'`

## 📞 Support

If you encounter issues:
1. Check Render logs in dashboard
2. Review deployment guide
3. Check GitHub issues
4. Contact Render support for platform issues

## 🎉 Success!

Once deployed, share your app:
- Portfolio: "Check out my resume tailor app at https://..."
- LinkedIn: Share the project
- GitHub: Add the live demo link to README

---

**Built with ❤️ by Bhanu Prakash Dayyala**

GitHub: https://github.com/dayyalabhanuprakash
