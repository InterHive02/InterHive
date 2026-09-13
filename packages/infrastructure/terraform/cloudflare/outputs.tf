output "zone_id" {
  description = "Cloudflare Zone ID"
  value       = cloudflare_zone.main.id
}

output "pages_project_name" {
  description = "Cloudflare Pages Project Name"
  value       = cloudflare_pages_project.frontend.name
}

output "worker_name" {
  description = "Cloudflare Worker Name"
  value       = cloudflare_worker_script.backend.name
}

output "r2_bucket_name" {
  description = "R2 Bucket Name"
  value       = cloudflare_r2_bucket.storage.name
}

output "kv_namespace_name" {
  description = "KV Namespace Name"
  value       = cloudflare_workers_kv_namespace.cache.title
}