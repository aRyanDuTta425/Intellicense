#!/bin/bash

# Digital Rights Tool Deployment Script

echo "Digital Rights Tool Deployment Script"
echo "====================================="
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "Error: git is not installed. Please install git and try again."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "Error: npm is not installed. Please install npm and try again."
    exit 1
fi

# Function to deploy backend to Render
deploy_backend() {
    echo "Deploying backend to Render..."
    echo ""
    echo "1. Make sure you have a Render account at https://render.com/"
    echo "2. Create a new Web Service and connect your GitHub repository"
    echo "3. Configure the service with the following settings:"
    echo "   - Name: digital-rights-tool-backend"
    echo "   - Environment: Node"
    echo "   - Build Command: npm install && npm run build"
    echo "   - Start Command: npm start"
    echo "   - Add environment variables:"
    echo "     - DATABASE_URL: Your PostgreSQL connection string"
    echo "     - JWT_SECRET: A secure secret key for JWT"
    echo ""
    echo "4. Click 'Create Web Service' to deploy"
    echo ""
    read -p "Press Enter when you've completed these steps..."
    
    echo "Backend deployment instructions completed."
    echo "Your backend will be available at: https://digital-rights-tool-backend.onrender.com"
    echo ""
}

# Function to deploy frontend to Vercel
deploy_frontend() {
    echo "Deploying frontend to Vercel..."
    echo ""
    echo "1. Make sure you have a Vercel account at https://vercel.com/"
    echo "2. Create a new project and connect your GitHub repository"
    echo "3. Configure the project with the following settings:"
    echo "   - Framework Preset: Vite"
    echo "   - Build Command: npm run build"
    echo "   - Output Directory: dist"
    echo "   - Add environment variables:"
    echo "     - VITE_API_URL: https://digital-rights-tool-backend.onrender.com"
    echo ""
    echo "4. Click 'Deploy' to deploy"
    echo ""
    read -p "Press Enter when you've completed these steps..."
    
    echo "Frontend deployment instructions completed."
    echo "Your frontend will be available at: https://digital-rights-tool.vercel.app"
    echo ""
}

# Main menu
while true; do
    echo "What would you like to do?"
    echo "1. Deploy backend to Render"
    echo "2. Deploy frontend to Vercel"
    echo "3. Deploy both"
    echo "4. Exit"
    echo ""
    read -p "Enter your choice (1-4): " choice
    
    case $choice in
        1)
            deploy_backend
            ;;
        2)
            deploy_frontend
            ;;
        3)
            deploy_backend
            deploy_frontend
            ;;
        4)
            echo "Exiting..."
            exit 0
            ;;
        *)
            echo "Invalid choice. Please try again."
            ;;
    esac
    
    echo ""
    read -p "Press Enter to continue..."
done 