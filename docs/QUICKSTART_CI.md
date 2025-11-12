# CI/CD Pipeline Quick Reference

## 🚀 Quick Start

### 1. Setup GitHub Secrets (Automated)

Run the helper script:

```bash
.github/workflows/setup-secrets.sh
```

This will interactively guide you through setting up all required secrets.

### 2. Setup GitHub Secrets (Manual)

If you prefer to set secrets manually:

```bash
# Install GitHub CLI if not already installed
brew install gh  # macOS
# or visit: https://cli.github.com/

# Login to GitHub
gh auth login

# Set each secret
gh secret set KUBE_CONFIG < <(cat ~/.kube/config | base64)
gh secret set EPITECH_USERNAME -b"your-username"
gh secret set EPITECH_PASSWORD -b"your-password"
# ... and so on for all secrets
```

### 3. Update Configuration

Edit `kubernetes/ingress.yaml` with your domain:

```yaml
hosts:
  - your-domain.com
```

### 4. Trigger Deployment

```bash
# Commit and push to main branch
git add .
git commit -m "Configure CI/CD pipeline"
git push origin main
```

## 📊 Pipeline Status

Add this badge to your README.md:

```markdown
[![Deploy](https://github.com/epitech-nice/EpiCheck/actions/workflows/deploy.yml/badge.svg)](https://github.com/epitech-nice/EpiCheck/actions/workflows/deploy.yml)
```

## 🔍 Monitoring

### View Deployment Status

```bash
# In GitHub UI
# Go to: Actions → Build and Deploy to Kubernetes → Latest run

# Or using CLI
gh run list --workflow=deploy.yml
gh run view <run-id>
```

### Check Kubernetes Deployment

```bash
# Quick status
kubectl get all -n epicheck

# Detailed pod info
kubectl get pods -n epicheck -o wide

# View logs
kubectl logs -f deployment/epicheck-app -n epicheck

# Check rollout status
kubectl rollout status deployment/epicheck-app -n epicheck
```

## 🔧 Common Commands

### Re-run Failed Deployment

```bash
# Using GitHub CLI
gh run rerun <run-id>

# Or in GitHub UI
# Actions → Failed run → Re-run failed jobs
```

### Rollback Deployment

```bash
# Rollback to previous version
kubectl rollout undo deployment/epicheck-app -n epicheck

# Rollback to specific revision
kubectl rollout history deployment/epicheck-app -n epicheck
kubectl rollout undo deployment/epicheck-app --to-revision=2 -n epicheck
```

### Manual Deploy (Bypass CI/CD)

```bash
# Build and push manually
docker build -t ghcr.io/epitech-nice/epicheck:manual .
docker push ghcr.io/epitech-nice/epicheck:manual

# Update Kubernetes
kubectl set image deployment/epicheck-app \
  epicheck=ghcr.io/epitech-nice/epicheck:manual \
  -n epicheck
```

## 🎯 Deployment Triggers

| Trigger | Action | Deploy? |
|---------|--------|---------|
| Push to `main` | Build + Deploy to Production | ✅ Yes |
| Push to `develop` | Build + Deploy to Staging | ✅ Yes |
| Push tag `v*` | Build + Deploy with version | ✅ Yes |
| Pull Request | Build only | ❌ No |
| Manual | Build + Deploy | ✅ Yes |

## 🐛 Troubleshooting

### Pipeline Fails at "Configure kubectl"

**Issue**: Cannot connect to Kubernetes cluster

**Solution**:
```bash
# Regenerate and update KUBE_CONFIG secret
cat ~/.kube/config | base64 | gh secret set KUBE_CONFIG
```

### Pipeline Fails at "Build and push"

**Issue**: Cannot push to container registry

**Solution**:
1. Check repository settings → Actions → General
2. Enable "Read and write permissions" for GITHUB_TOKEN
3. Re-run workflow

### Deployment Succeeds but App Not Accessible

**Issue**: Ingress or service misconfiguration

**Solution**:
```bash
# Check ingress
kubectl describe ingress epicheck-ingress -n epicheck

# Check service
kubectl get svc -n epicheck

# Check pods
kubectl get pods -n epicheck

# View events
kubectl get events -n epicheck --sort-by='.lastTimestamp'
```

## 📚 Documentation

- **Full Documentation**: [README.md](.github/workflows/README.md)
- **Kubernetes Guide**: [kubernetes/README.md](../../kubernetes/README.md)
- **Docker Guide**: [DOCKER_DEPLOYMENT.md](../../DOCKER_DEPLOYMENT.md)

## 🔐 Required Secrets

| Secret | Description |
|--------|-------------|
| `KUBE_CONFIG` | Base64-encoded Kubernetes config |
| `EPITECH_USERNAME` | Epitech Intra username |
| `EPITECH_PASSWORD` | Epitech Intra password |
| `OFFICE365_CLIENT_ID` | Office 365 OAuth Client ID |
| `OFFICE365_CLIENT_SECRET` | Office 365 OAuth Secret |
| `OFFICE365_TENANT_ID` | Office 365 Tenant ID |
| `AZURE_AD_CLIENT_ID` | Azure AD Client ID |
| `AZURE_AD_CLIENT_SECRET` | Azure AD Client Secret |
| `AZURE_AD_TENANT_ID` | Azure AD Tenant ID |
| `API_KEY` | General API key |
| `SESSION_SECRET` | Session encryption secret |

## 🆘 Support

For issues:
1. Check workflow logs in GitHub Actions
2. Check [README.md](.github/workflows/README.md) for detailed troubleshooting
3. Create an issue in the repository

---

**Pro Tip**: Use `.github/workflows/setup-secrets.sh` for easy secret configuration!
