#!/bin/bash

# Digital Ocean Deployment Script for The Independent Life CRM
# This script helps deploy the application to Digital Ocean

set -e

echo "🚀 The Independent Life CRM - Digital Ocean Deployment"
echo "======================================================="

# Check if required environment variables are set
check_env_var() {
    if [ -z "${!1}" ]; then
        echo "❌ Error: $1 is not set"
        exit 1
    fi
}

# Configuration
APP_NAME="independent-life-crm"
REGISTRY="registry.digitalocean.com"

# Check required variables
echo "📋 Checking configuration..."
check_env_var "DO_REGISTRY_NAME"
check_env_var "DO_API_TOKEN"

# Optional: Check if doctl is installed
if ! command -v doctl &> /dev/null; then
    echo "⚠️  Warning: doctl is not installed. Install it from: https://docs.digitalocean.com/reference/doctl/"
    echo "    For now, using Docker commands only..."
fi

# Login to Digital Ocean Container Registry
echo "🔐 Logging in to Digital Ocean Container Registry..."
echo "$DO_API_TOKEN" | docker login $REGISTRY -u $DO_API_TOKEN --password-stdin

# Build Docker image
echo "🏗️  Building Docker image..."
docker build -t $APP_NAME:latest .

# Tag image for registry
FULL_IMAGE_NAME="$REGISTRY/$DO_REGISTRY_NAME/$APP_NAME:latest"
echo "🏷️  Tagging image as $FULL_IMAGE_NAME..."
docker tag $APP_NAME:latest $FULL_IMAGE_NAME

# Push to registry
echo "📤 Pushing image to registry..."
docker push $FULL_IMAGE_NAME

echo "✅ Deployment complete!"
echo ""
echo "Next steps:"
echo "1. Create a new App in Digital Ocean App Platform"
echo "2. Use the container image: $FULL_IMAGE_NAME"
echo "3. Configure environment variables in the App Platform"
echo "4. Set up a managed MongoDB database"
echo "5. Configure the MONGODB_URI environment variable"
echo ""
echo "Or use Digital Ocean's doctl to deploy:"
echo "  doctl apps create --spec .do/app.yaml"
