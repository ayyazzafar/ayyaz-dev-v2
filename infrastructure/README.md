# Infrastructure as Code (Terraform)

This Terraform configuration provisions **everything** needed for a full-stack monorepo:
- **Backend (NestJS)** → Google Cloud Run
- **Frontends (Next.js)** → Vercel

## What Gets Provisioned

### Google Cloud (Backend)
- **Artifact Registry**: Docker image storage with automatic cleanup
- **Cloud Run Service**: Serverless container hosting
- **Cloud Build Trigger**: Auto-deploy on git push
- **IAM Policy**: Public API access

### Vercel (Frontends)
- **Admin Dashboard**: Next.js admin app
- **Public Website**: Next.js public-facing site
- **Environment Variables**: Managed in code

## Prerequisites

1. **Google Cloud CLI** installed and authenticated:
   ```bash
   gcloud auth login
   gcloud config set project YOUR_PROJECT_ID
   ```

2. **Terraform** installed (v1.0+):
   ```bash
   brew install terraform  # macOS
   ```

3. **Vercel API Token** from https://vercel.com/account/tokens

4. **Docker image** must exist before first `terraform apply` (see "First-Time Setup" below)

## File Structure

```
infrastructure/
├── main.tf                 # GCP resources (Cloud Run, Artifact Registry, Cloud Build)
├── vercel.tf               # Vercel resources (projects, env vars)
├── variables.tf            # Variable declarations
├── outputs.tf              # Output values after apply
├── terraform.tfvars        # Project-specific values (commit to git)
└── terraform.tfvars.secret # Sensitive values (DO NOT commit - gitignored)
```

## First-Time Setup for a New Project

### Step 1: Copy and Configure

```bash
# Copy infrastructure folder to new project
cp -r infrastructure/ /path/to/new-project/infrastructure/

# Edit terraform.tfvars with new project values
vim infrastructure/terraform.tfvars
```

Update `terraform.tfvars`:
```hcl
project_id   = "your-gcp-project-id"
region       = "us-central1"
service_name = "your-service-name"
github_owner = "your-github-username"
github_repo  = "your-repo-name"
cloudbuild_config_path = "path/to/cloudbuild.yaml"
```

### Step 2: Create Secrets File

Create `terraform.tfvars.secret` (this file is gitignored):
```hcl
env_vars = [
  { name = "NODE_ENV", value = "production" },
  { name = "DATABASE_URL", value = "your-database-url" },
  { name = "JWT_SECRET", value = "your-jwt-secret" },
  # Add all your environment variables here
]
```

**Important**: Do NOT include `PORT` - Cloud Run sets this automatically.

### Step 3: Build Initial Docker Image (Chicken-and-Egg Solution)

Terraform needs a Docker image to exist before it can create the Cloud Run service. Build and push your first image manually:

```bash
# From project root (where Dockerfile is accessible)
gcloud builds submit \
  --config=apps/api/cloudbuild.yaml \
  --substitutions=COMMIT_SHA=initial \
  .
```

This:
1. Builds your Docker image
2. Pushes it to Artifact Registry
3. Deploys to Cloud Run

### Step 4: Initialize and Apply Terraform

```bash
cd infrastructure

# Initialize Terraform (downloads providers)
terraform init

# Preview what will be created
terraform plan -var-file="terraform.tfvars.secret"

# Apply the configuration
terraform apply -var-file="terraform.tfvars.secret"
```

### Step 5: (Optional) Enable Auto-Deploy on Git Push

To enable automatic deployments when you push to main:

1. **Connect GitHub to Cloud Build** (one-time manual step):
   - Go to: https://console.cloud.google.com/cloud-build/triggers;region=us-central1/connect
   - Follow the OAuth flow to connect your GitHub account
   - Select the repository

2. **Uncomment the Cloud Build trigger** in `main.tf`:
   ```hcl
   resource "google_cloudbuild_trigger" "deploy" {
     # ... uncomment this block
   }
   ```

3. **Apply again**:
   ```bash
   terraform apply -var-file="terraform.tfvars.secret"
   ```

Now every push to `main` branch will automatically build and deploy!

## Common Commands

```bash
# Initialize (first time or after provider changes)
terraform init

# Preview changes
terraform plan -var-file="terraform.tfvars.secret"

# Apply changes
terraform apply -var-file="terraform.tfvars.secret"

# Destroy all resources (careful!)
terraform destroy -var-file="terraform.tfvars.secret"

# Show current state
terraform show

# List resources
terraform state list
```

## Updating Environment Variables

1. Edit `terraform.tfvars.secret`
2. Run `terraform apply -var-file="terraform.tfvars.secret"`

Terraform will update the Cloud Run service with new environment variables.

## Outputs

After `terraform apply`, you'll see:

```
api_url = "https://your-service-xxxxx-uc.a.run.app"
artifact_registry_url = "us-central1-docker.pkg.dev/project-id/service-name"
swagger_docs_url = "https://your-service-xxxxx-uc.a.run.app/docs"
```

## Customization

### Change Resources

Edit `main.tf` to adjust:
- Memory: `memory = "512Mi"` (default)
- CPU: `cpu = "1000m"` (default, 1 vCPU)
- Min instances: `minScale = "0"` (scales to zero when idle)
- Max instances: `maxScale = "1"` (default)

### Add More Services

Duplicate the `google_cloud_run_service` resource block with different names for multiple services.

## Troubleshooting

### "Image not found" error
The Docker image must exist in Artifact Registry before Terraform can create the Cloud Run service. Run the initial `gcloud builds submit` command first.

### "Repository mapping does not exist" error
GitHub needs to be connected to Cloud Build. Follow Step 5 above.

### "PORT is reserved" error
Remove `PORT` from your `env_vars` - Cloud Run sets this automatically.

### Environment variables not updating
Make sure to include `-var-file="terraform.tfvars.secret"` in your commands.

## Cost

With the default configuration (min instances = 0):
- **Artifact Registry**: ~$0.10/GB/month for storage
- **Cloud Run**: Pay only when handling requests (~$0 when idle)
- **Cloud Build**: 120 free build-minutes/day

Typical cost for a low-traffic API: **< $1/month**

## Security Notes

1. **Never commit `terraform.tfvars.secret`** - it's gitignored for a reason
2. **Use Terraform state backend** for team projects (e.g., GCS bucket)
3. **Rotate secrets** regularly and update via Terraform

---

## Turborepo + Vercel Pattern (IMPORTANT)

This section documents the specific configuration needed for deploying Turborepo monorepo apps to Vercel.

### The Key Pattern

For each Next.js app in a Turborepo monorepo:

| Setting | Value |
|---------|-------|
| Root Directory | `apps/{app-name}` (e.g., `apps/admin`) |
| Build Command | `cd ../.. && bun run build --filter=@scope/app-name` |
| Install Command | `cd ../.. && bun install` |

**Why this works:**
1. Root Directory tells Vercel where the Next.js app lives
2. `cd ../..` goes back to monorepo root where Turbo can see all packages
3. `--filter` tells Turbo which app to build
4. Turbo automatically builds dependencies first (database, shared packages)

### Critical: Orval-Generated Files Must Be Committed

If your frontend uses Orval to generate API clients:

```
apps/admin/lib/api/generated/  ← MUST be in Git, NOT gitignored
```

**Why:** Vercel builds can't access `localhost:4000` to generate these files at build time. Generate locally, commit, push.

### Troubleshooting Vercel + Turborepo

| Error | Cause | Fix |
|-------|-------|-----|
| "No Next.js version detected" | Root Directory wrong | Set to `apps/{app}`, not `.` |
| "Module not found: @/lib/api/generated/..." | Orval files not committed | Remove from .gitignore, run orval locally, commit |
| "Cannot find module '@scope/database'" | Turbo not running from root | Use `cd ../.. &&` in build command |
| Build succeeds but wrong app deploys | Wrong `--filter` flag | Check package.json `name` matches filter |

### Manual Vercel Setup (Without Terraform)

If not using Terraform, configure each project in Vercel Dashboard:

**Admin Project:**
- Root Directory: `apps/admin`
- Build Command: `cd ../.. && bun run build --filter=@ayyaz-dev/admin`
- Install Command: `cd ../.. && bun install`

**Web Project:**
- Root Directory: `apps/web`
- Build Command: `cd ../.. && bun run build --filter=@ayyaz-dev/web`
- Install Command: `cd ../.. && bun install`
