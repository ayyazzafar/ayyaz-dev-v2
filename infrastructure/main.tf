# =============================================================================
# Terraform Configuration for NestJS API on Google Cloud Run
# =============================================================================
# This file provisions everything needed to run a NestJS API:
# - Artifact Registry (Docker image storage)
# - Cloud Run service (serverless container hosting)
# - Cloud Build trigger (auto-deploy on git push)
# =============================================================================

terraform {
  required_version = ">= 1.0"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
    vercel = {
      source  = "vercel/vercel"
      version = "~> 1.0"
    }
  }
}


# Configure the Google Cloud provider
provider "google" {
  project = var.project_id
  region  = var.region
}

# =============================================================================
# Enable Required APIs
# =============================================================================
resource "google_project_service" "apis" {
  for_each = toset([
    "run.googleapis.com",
    "cloudbuild.googleapis.com",
    "artifactregistry.googleapis.com",
  ])

  service            = each.value
  disable_on_destroy = false
}

# =============================================================================
# Artifact Registry - Docker Image Storage
# =============================================================================
resource "google_artifact_registry_repository" "api" {
  location      = var.region
  repository_id = var.service_name
  description   = "Docker images for ${var.service_name}"
  format        = "DOCKER"

  # Cleanup policy to prevent storage bloat (keeps last 3, deletes after 7 days)
  cleanup_policies {
    id     = "delete-old-images"
    action = "DELETE"
    condition {
      older_than = "604800s" # 7 days
    }
  }

  cleanup_policies {
    id     = "keep-recent"
    action = "KEEP"
    most_recent_versions {
      keep_count = 3
    }
  }

  depends_on = [google_project_service.apis]
}

# =============================================================================
# Cloud Run Service (using v1 API for better dynamic block support)
# =============================================================================
resource "google_cloud_run_service" "api" {
  name     = var.service_name
  location = var.region

  template {
    spec {
      containers {
        image = "${var.region}-docker.pkg.dev/${var.project_id}/${var.service_name}/api:latest"

        ports {
          container_port = 4000
        }

        resources {
          limits = {
            cpu    = "1000m"
            memory = "512Mi"
          }
        }

        # Environment variables
        dynamic "env" {
          for_each = nonsensitive(var.env_vars)
          content {
            name  = env.value.name
            value = env.value.value
          }
        }
      }
    }

    metadata {
      annotations = {
        "autoscaling.knative.dev/minScale" = "0"
        "autoscaling.knative.dev/maxScale" = "1"
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }

  depends_on = [google_artifact_registry_repository.api]

  lifecycle {
    ignore_changes = [
      template[0].spec[0].containers[0].image,
    ]
  }
}

# Make the service publicly accessible
resource "google_cloud_run_service_iam_member" "public" {
  location = google_cloud_run_service.api.location
  service  = google_cloud_run_service.api.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# =============================================================================
# Cloud Build Trigger - Auto-deploy on Git Push
# =============================================================================
# NOTE: GitHub connection must be set up first via Cloud Console:
# https://console.cloud.google.com/cloud-build/triggers;region=us-central1/connect

resource "google_cloudbuild_trigger" "deploy" {
  name     = "deploy-${var.service_name}"
  location = var.region

  github {
    owner = var.github_owner
    name  = var.github_repo
    push {
      branch = "^main$"
    }
  }

  filename = var.cloudbuild_config_path

  depends_on = [google_project_service.apis]
}
