#!/bin/bash

echo "🔧 Setting up local Kubernetes deployment for EpiCheck"
echo "=================================================="
echo ""

echo "Step 1: Building Docker images locally..."
echo "Building main app image..."
docker build -t epicheck:latest . --quiet
echo "✅ Main app image built"

echo "Building proxy image..."
docker build -t epicheck-proxy:latest ./proxy-server --quiet
echo "✅ Proxy image built"

echo ""
echo "Step 2: Updating Kubernetes deployments to use local images..."
kubectl patch deployment epicheck-app -n epicheck -p '{"spec":{"template":{"spec":{"imagePullSecrets":null,"containers":[{"name":"epicheck","image":"epicheck:latest","imagePullPolicy":"Never"}]}}}}'
kubectl patch deployment epicheck-proxy -n epicheck -p '{"spec":{"template":{"spec":{"imagePullSecrets":null,"containers":[{"name":"proxy","image":"epicheck-proxy:latest","imagePullPolicy":"Never"}]}}}}'
echo "✅ Deployments updated"

echo ""
echo "Step 3: Waiting for rollout..."
kubectl rollout status deployment/epicheck-app -n epicheck --timeout=5m
kubectl rollout status deployment/epicheck-proxy -n epicheck --timeout=5m

echo ""
echo "✅ Local Kubernetes deployment complete!"
echo ""
echo "Check status with: kubectl get pods -n epicheck"
