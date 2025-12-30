# =============================================================================
# Variables - Customize these for each project
# =============================================================================

variable "project_id" {
  description = "Google Cloud Project ID"
  type        = string
}

variable "region" {
  description = "Google Cloud region"
  type        = string
  default     = "us-central1"
}

variable "service_name" {
  description = "Name for the Cloud Run service and Artifact Registry"
  type        = string
}

variable "github_owner" {
  description = "GitHub repository owner/organization"
  type        = string
}

variable "github_repo" {
  description = "GitHub repository name"
  type        = string
}

variable "cloudbuild_config_path" {
  description = "Path to cloudbuild.yaml in the repository"
  type        = string
  default     = "apps/api/cloudbuild.yaml"
}

variable "env_vars" {
  description = "Environment variables for the Cloud Run service"
  type        = list(object({
    name  = string
    value = string
  }))
  default   = []
  sensitive = true
}

# =============================================================================
# Vercel Variables
# =============================================================================

variable "vercel_api_token" {
  description = "Vercel API token (from https://vercel.com/account/tokens)"
  type        = string
  sensitive   = true
}

variable "vercel_team_id" {
  description = "Vercel team slug or ID (e.g., 'ayyaz-tech-hobby')"
  type        = string
}

variable "project_prefix" {
  description = "Prefix for Vercel project names (e.g., 'ayyaz-dev-v2' creates 'ayyaz-dev-v2-admin', 'ayyaz-dev-v2-web')"
  type        = string
}

variable "api_url" {
  description = "Backend API URL for frontend apps to connect to"
  type        = string
}
