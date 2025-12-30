# =============================================================================
# ayyaz-dev-v2 Configuration
# =============================================================================
# Change these values for each new project

# Google Cloud (API Backend)
project_id   = "ayyaz-232219"
region       = "us-central1"
service_name = "ayyaz-dev-api"
github_owner = "ayyazzafar"
github_repo  = "ayyaz-dev-v2"
cloudbuild_config_path = "apps/api/cloudbuild.yaml"

# Vercel (Frontend Apps)
vercel_team_id = "ayyaz-tech-hobby"
project_prefix = "ayyaz-dev-v2"
api_url        = "https://api.ayyaz.dev"  # Custom domain (update frontends after DNS propagates)

# Custom Domains
api_domain     = "api.ayyaz.dev"  # Cloud Run API custom domain

# Sensitive values (API tokens, env vars) are in terraform.tfvars.secret
