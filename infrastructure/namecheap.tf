# =============================================================================
# Namecheap DNS Configuration
# =============================================================================
# Manages DNS records for ayyaz.dev domain via Namecheap API
#
# Requirements:
# - Namecheap API access enabled (requires $50+ balance or 20+ domains)
# - API credentials in terraform.tfvars.secret
# =============================================================================

provider "namecheap" {
  user_name   = var.namecheap_user_name
  api_user    = var.namecheap_api_user
  api_key     = var.namecheap_api_key
  use_sandbox = false
}

# =============================================================================
# DNS Records for ayyaz.dev
# =============================================================================
resource "namecheap_domain_records" "ayyaz_dev" {
  domain = "ayyaz.dev"
  mode   = "OVERWRITE"  # Replaces all existing records

  # API subdomain → Cloud Run
  record {
    hostname = "api"
    type     = "CNAME"
    address  = "ghs.googlehosted.com"
    ttl      = 1800
  }

  # Admin subdomain → Vercel
  record {
    hostname = "admin"
    type     = "CNAME"
    address  = "cname.vercel-dns.com"
    ttl      = 1800
  }

  # Root domain (apex) → Vercel
  # Using A record because CNAME not allowed at apex
  record {
    hostname = "@"
    type     = "A"
    address  = "76.76.21.21"
    ttl      = 1800
  }

  # WWW subdomain → Vercel (redirects to apex)
  record {
    hostname = "www"
    type     = "CNAME"
    address  = "cname.vercel-dns.com"
    ttl      = 1800
  }

  # Email records (MX) - preserve if you have email
  # Uncomment and adjust if using email services
  # record {
  #   hostname = "@"
  #   type     = "MX"
  #   address  = "mail.example.com"
  #   mx_pref  = 10
  #   ttl      = 1800
  # }
}
