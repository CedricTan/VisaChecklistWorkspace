# Cloudflare Pages Deployment Guide

This branch is configured for deployment to **Cloudflare Pages**.

## Prerequisites
- A [Cloudflare account](https://dash.cloudflare.com/sign-up).
- This repository pushed to GitHub.

## Setup Instructions

1.  **Log in to Cloudflare Dashboard**
    - Go to [Cloudflare Dashboard](https://dash.cloudflare.com) > **Workers & Pages**.

2.  **Create Application**
    - Click **Create application** > **Pages** > **Connect to Git**.

3.  **Connect Repository**
    - Select your GitHub account and find the `VisaChecklistWorkspace` repository.
    - Click **Begin setup**.

4.  **Configure Build Settings**
    - **Project Name**: `visachecklistworkspace` (or your preference).
    - **Production Branch**: `feature/cloudflare-pages` (IMPORTANT).
    - **Framework Preset**: `None` (or React Static if available, but manual config is safer).
    - **Build command**: `npm run build`
    - **Build output directory**: `dist`

5.  **Environment Variables (Optional)**
    - If you strictly need to handle environment variables, add them in the dashboard under **Settings** > **Environment variables**.

6.  **Deploy**
    - Click **Save and Deploy**.

## Branching Strategy
- This project now uses a **Branch Deploy** model.
    - `main`/`master`: Configured for GitHub Pages (legacy).
    - `feature/cloudflare-pages`: Configured for Cloudflare Pages.
- Verify changes on this branch before merging or deciding to switch `main` entirely to Cloudflare.
