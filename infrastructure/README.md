# GCP Cloud Run Infrastructure (Terraform)

This Terraform configuration provisions everything needed to deploy a NestJS/Node.js API to Google Cloud Run.

## What Gets Provisioned

- **Artifact Registry**: Docker image storage with automatic cleanup (keeps last 3 images, deletes after 7 days)
- **Cloud Run Service**: Serverless container hosting with configurable resources
- **IAM Policy**: Public access to the API
- **Cloud Build Trigger** (optional): Auto-deploy on git push (requires GitHub OAuth connection)

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

3. **Docker image** must exist before first `terraform apply` (see "First-Time Setup" below)

## File Structure

```
infrastructure/
├── main.tf                 # Main resource definitions
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
