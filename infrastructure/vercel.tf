# =============================================================================
# Vercel Configuration for Next.js Apps (Turborepo Monorepo)
# =============================================================================
# This file provisions Vercel projects for frontend apps in the monorepo.
#
# Key Pattern for Turborepo + Vercel:
# - Root Directory: Set to app folder (e.g., apps/admin)
# - Build Command: cd ../.. && bun run build --filter=@package-name
# - This ensures Turbo builds dependencies (database, api-client) first
#
# IMPORTANT: Orval-generated files must be committed to Git!
# Vercel build can't access localhost:4000 to generate them.
# =============================================================================

provider "vercel" {
  api_token = var.vercel_api_token
  team      = var.vercel_team_id  # ayyaz-tech-hobby
}

# =============================================================================
# Admin Dashboard
# =============================================================================
resource "vercel_project" "admin" {
  name      = "${var.project_prefix}-admin"
  framework = "nextjs"

  git_repository = {
    type = "github"
    repo = "${var.github_owner}/${var.github_repo}"
  }

  # Turborepo monorepo settings
  root_directory  = "apps/admin"
  build_command   = "cd ../.. && bun run build --filter=@ayyaz-dev/admin"
  install_command = "cd ../.. && bun install"
}

# Admin environment variables
resource "vercel_project_environment_variable" "admin_api_url" {
  project_id = vercel_project.admin.id
  key        = "NEXT_PUBLIC_API_URL"
  value      = var.api_url
  target     = ["production", "preview", "development"]
}

# =============================================================================
# Web (Public Frontend)
# =============================================================================
resource "vercel_project" "web" {
  name      = "${var.project_prefix}-web"
  framework = "nextjs"

  git_repository = {
    type = "github"
    repo = "${var.github_owner}/${var.github_repo}"
  }

  # Turborepo monorepo settings
  root_directory  = "apps/web"
  build_command   = "cd ../.. && bun run build --filter=@ayyaz-dev/web"
  install_command = "cd ../.. && bun install"
}

# Web environment variables
resource "vercel_project_environment_variable" "web_api_url" {
  project_id = vercel_project.web.id
  key        = "NEXT_PUBLIC_API_URL"
  value      = var.api_url
  target     = ["production", "preview", "development"]
}

# =============================================================================
# Custom Domains
# =============================================================================

# Admin Dashboard Domain
resource "vercel_project_domain" "admin" {
  project_id = vercel_project.admin.id
  domain     = "admin.ayyaz.dev"
}

# Web Domain (apex domain)
resource "vercel_project_domain" "web" {
  project_id = vercel_project.web.id
  domain     = "ayyaz.dev"
}

# Web Domain (www redirect to apex)
resource "vercel_project_domain" "web_www" {
  project_id = vercel_project.web.id
  domain     = "www.ayyaz.dev"
  # Vercel automatically redirects www to apex when both are configured
}

# =============================================================================
# Outputs
# =============================================================================
output "admin_url" {
  description = "Admin dashboard URL"
  value       = "https://admin.ayyaz.dev"
}

output "web_url" {
  description = "Public website URL"
  value       = "https://ayyaz.dev"
}
