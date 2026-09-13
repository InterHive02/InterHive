# Cloudflare Provider Configuration
terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

# Zone Configuration
resource "cloudflare_zone" "main" {
  zone = var.domain
}

# DNS Records
resource "cloudflare_record" "main" {
  zone_id = cloudflare_zone.main.id
  name    = var.domain
  value   = var.origin_server_ip
  type    = "A"
  ttl     = 300
  proxied = true
}

resource "cloudflare_record" "www" {
  zone_id = cloudflare_zone.main.id
  name    = "www.${var.domain}"
  value   = var.origin_server_ip
  type    = "A"
  ttl     = 300
  proxied = true
}

resource "cloudflare_record" "api" {
  zone_id = cloudflare_zone.main.id
  name    = "api.${var.domain}"
  value   = var.origin_server_ip
  type    = "A"
  ttl     = 300
  proxied = true
}

# Pages Project
resource "cloudflare_pages_project" "frontend" {
  account_id = var.cloudflare_account_id
  name       = "interhive-frontend"
  production_branch = "main"

  source {
    type = "github"
    config {
      owner        = var.github_owner
      repo_name    = var.github_repo
      production_branch = "main"
      deployments_enabled = true
    }
  }

  build_config {
    build_command   = "yarn build"
    destination_dir = "dist"
    root_dir        = "packages/frontend"
  }
}

# Worker
resource "cloudflare_worker_script" "backend" {
  account_id = var.cloudflare_account_id
  name       = "interhive-backend"
  content    = file("${path.module}/../../worker/index.js")

  variables = {
    NODE_ENV     = var.environment
    DATABASE_URL = var.database_url
    REDIS_URL    = var.redis_url
  }

  secrets = {
    JWT_SECRET           = var.jwt_secret
    JWT_REFRESH_SECRET   = var.jwt_refresh_secret
    SMTP_PASSWORD        = var.smtp_password
    R2_ACCESS_KEY_ID     = var.r2_access_key_id
    R2_SECRET_ACCESS_KEY = var.r2_secret_access_key
  }

  compatibility_date = "2024-01-01"
}

# R2 Bucket
resource "cloudflare_r2_bucket" "storage" {
  account_id = var.cloudflare_account_id
  name       = "interhive-storage"
  location   = "enam"

  lifecycle_rules {
    expired_object_delete_marker = true
    abort_incomplete_multipart_upload_days = 7
  }
}

resource "cloudflare_r2_bucket_cors" "storage" {
  account_id = var.cloudflare_account_id
  bucket_id  = cloudflare_r2_bucket.storage.id

  rules {
    allowed_origins = ["https://${var.domain}", "https://www.${var.domain}"]
    allowed_methods = ["GET", "PUT", "POST", "DELETE"]
    allowed_headers = ["*"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3600
  }
}

# KV Namespace
resource "cloudflare_workers_kv_namespace" "cache" {
  account_id = var.cloudflare_account_id
  title      = "interhive-cache"
}

# Rate Limiting
resource "cloudflare_rate_limit" "api" {
  zone_id = cloudflare_zone.main.id

  threshold = 100
  period    = 60
  match {
    request {
      url_pattern = "api/*"
      schemes     = ["HTTP", "HTTPS"]
      methods     = ["GET", "POST", "PUT", "DELETE", "PATCH"]
    }
    response {
      status_codes = [429]
    }
  }
  action {
    mode = "block"
    response {
      content_type = "application/json"
      body = jsonencode({
        success = false
        message = "Rate limit exceeded. Please try again later."
      })
    }
  }
}

# Outputs
output "cloudflare_zone_id" {
  value = cloudflare_zone.main.id
}

output "pages_project_id" {
  value = cloudflare_pages_project.frontend.id
}

output "worker_script_id" {
  value = cloudflare_worker_script.backend.id
}

output "r2_bucket_id" {
  value = cloudflare_r2_bucket.storage.id
}

output "kv_namespace_id" {
  value = cloudflare_workers_kv_namespace.cache.id
}