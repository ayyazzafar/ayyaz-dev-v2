# =============================================================================
# Outputs - Displayed after terraform apply
# =============================================================================

output "api_url" {
  description = "The URL of the deployed Cloud Run service"
  value       = google_cloud_run_service.api.status[0].url
}

output "artifact_registry_url" {
  description = "The URL of the Artifact Registry"
  value       = "${var.region}-docker.pkg.dev/${var.project_id}/${var.service_name}"
}

output "cloud_build_trigger" {
  description = "Cloud Build trigger name"
  value       = google_cloudbuild_trigger.deploy.name
}

output "swagger_docs_url" {
  description = "Swagger API documentation URL"
  value       = "${google_cloud_run_service.api.status[0].url}/docs"
}
