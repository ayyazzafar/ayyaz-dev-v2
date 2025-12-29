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
