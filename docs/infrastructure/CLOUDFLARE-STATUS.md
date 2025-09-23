# Cloudflare Domain Status Report
**Domain:** liteckyeditingservices.com
**Generated:** Tue Sep 23 09:49:00 AM AKDT 2025
**Zone ID:** a5e7c69768502d649a8f2c615f555eca

## 1. Zone Configuration
```
                 ID                |            ZONE            |     PLAN     | STATUS |          NAME SERVERS          | PAUSED | TYPE  
-----------------------------------+----------------------------+--------------+--------+--------------------------------+--------+-------
  a5e7c69768502d649a8f2c615f555eca | liteckyeditingservices.com | Free Website | active | carol.ns.cloudflare.com,       | false  | full  
                                   |                            |              |        | ignacio.ns.cloudflare.com      |        |       
```

## 2. DNS Records
```json
{
    "result": [
        {
            "id": "d5e447ccc7a5ad0ee1f1099c6e03dcd3",
            "name": "liteckyeditingservices.com",
            "type": "CNAME",
            "content": "www.liteckyeditingservices.com",
            "proxiable": true,
            "proxied": true,
            "ttl": 1,
            "settings": {
                "flatten_cname": false
            },
            "meta": {},
            "comment": null,
            "tags": [],
            "created_on": "2024-08-27T20:21:46.165019Z",
            "modified_on": "2024-08-27T20:21:46.165019Z"
        },
        {
            "id": "a8b747e6dffdb95e0bea543316e6d3cf",
            "name": "www.liteckyeditingservices.com",
            "type": "CNAME",
            "content": "ghs.googlehosted.com",
            "proxiable": true,
            "proxied": true,
            "ttl": 1,
            "settings": {
                "flatten_cname": false
            },
            "meta": {},
            "comment": null,
            "tags": [],
            "created_on": "2024-07-27T23:10:18.453641Z",
            "modified_on": "2024-07-27T23:10:18.453641Z"
        },
        {
            "id": "fde864185d17382945419d2869e3d26d",
            "name": "liteckyeditingservices.com",
            "type": "MX",
            "content": "alt4.aspmx.l.google.com",
            "priority": 10,
            "proxiable": false,
            "proxied": false,
            "ttl": 1,
            "settings": {},
            "meta": {},
            "comment": null,
            "tags": [],
            "created_on": "2024-07-27T23:10:18.469568Z",
            "modified_on": "2024-07-27T23:10:18.469568Z"
        },
        {
            "id": "69c9b0ef463d076dc2e8dfb34964a824",
            "name": "liteckyeditingservices.com",
            "type": "MX",
            "content": "alt3.aspmx.l.google.com",
            "priority": 10,
            "proxiable": false,
            "proxied": false,
            "ttl": 1,
            "settings": {},
            "meta": {},
            "comment": null,
            "tags": [],
            "created_on": "2024-07-27T23:10:18.466836Z",
            "modified_on": "2024-07-27T23:10:18.466836Z"
        },
        {
            "id": "2b53e933b33d74345efd359ad6295972",
            "name": "liteckyeditingservices.com",
            "type": "MX",
            "content": "alt2.aspmx.l.google.com",
            "priority": 5,
            "proxiable": false,
            "proxied": false,
            "ttl": 1,
            "settings": {},
            "meta": {},
            "comment": null,
            "tags": [],
            "created_on": "2024-07-27T23:10:18.464396Z",
            "modified_on": "2024-07-27T23:10:18.464396Z"
        },
        {
            "id": "07d4b03afe6783714869653fd7590c14",
            "name": "liteckyeditingservices.com",
            "type": "MX",
            "content": "alt1.aspmx.l.google.com",
            "priority": 5,
            "proxiable": false,
            "proxied": false,
            "ttl": 1,
            "settings": {},
            "meta": {},
            "comment": null,
            "tags": [],
            "created_on": "2024-07-27T23:10:18.461904Z",
            "modified_on": "2024-07-27T23:10:18.461904Z"
        },
        {
            "id": "426ad01bf6b4823e4c1ae87e68193648",
            "name": "liteckyeditingservices.com",
            "type": "MX",
            "content": "aspmx.l.google.com",
            "priority": 1,
            "proxiable": false,
            "proxied": false,
            "ttl": 1,
            "settings": {},
            "meta": {},
            "comment": null,
            "tags": [],
            "created_on": "2024-07-27T23:10:18.459315Z",
            "modified_on": "2024-07-27T23:10:18.459315Z"
        },
        {
            "id": "b5360b142a92defdec5e7cdfc87a7778",
            "name": "google._domainkey.liteckyeditingservices.com",
            "type": "TXT",
            "content": "\"v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAkkzNvRFUF4hQLANRmpDK250m1RnUMzADi1EN/jLkrYqbPL/GN3xVs3BVw5Fm2DOeFpODuR7t2b/kqY5Nsg4r9LYRdZ42p77oPaVV9YyDbdwYNQZe5L9bBWxQJJqB1Zh3oo/veNsCQLx\" \"c1cBCdyMAaEG4cZQLPIfgb5VFpoLxIizX0YXOhUgb1TSTtfVxeQaaZTR+Bns7GXCeDm0r1BUGNEWNKGNxUKoynYL/Bngm2NDPkPhTQmcFemN7AIsBz1E0ZqYQBbD1m6LS1zkNdY8xPIDflDxCYeb0779J+JOoEtRobabwcw5ldnF0PKWZnEP6A/tosMwJ8QMJf4uSU2oB\" \"DQIDAQAB\"",
            "proxiable": false,
            "proxied": false,
            "ttl": 1,
            "settings": {},
            "meta": {},
            "comment": null,
            "tags": [],
            "created_on": "2024-07-27T23:10:18.472558Z",
            "modified_on": "2024-07-27T23:10:18.472558Z"
        },
        {
            "id": "52fda4f23030d6e88d4a95402e33d570",
            "name": "liteckyeditingservices.com",
            "type": "TXT",
            "content": "\"v=spf1 include:_spf.google.com ~all\"",
            "proxiable": false,
            "proxied": false,
            "ttl": 1,
            "settings": {},
            "meta": {},
            "comment": null,
            "tags": [],
            "created_on": "2024-07-27T23:10:18.449849Z",
            "modified_on": "2024-07-27T23:10:18.449849Z"
        }
    ],
    "success": true,
    "errors": [],
    "messages": [],
    "result_info": {
        "page": 1,
        "per_page": 100,
        "count": 9,
        "total_count": 9,
        "total_pages": 1
    }
}
```

## 3. SSL/TLS Configuration
```json
{
    "result": {
        "id": "ssl",
        "value": "full",
        "modified_on": "2024-10-17T19:44:30.608432Z",
        "certificate_status": "active",
        "validation_errors": [],
        "editable": true
    },
    "success": true,
    "errors": [],
    "messages": []
}
```

## 4. Page Rules
```json
{
    "success": false,
    "errors": [
        {
            "code": 1011,
            "message": "Page Rules endpoint does not support account owned tokens."
        }
    ],
    "messages": [],
    "result": null
}
```

## 5. Cloudflare Pages Projects
```json
{
    "result": [
        {
            "id": "f0b841f2-a4c4-4d45-8665-b691698496de",
            "name": "jeffsthings-courses",
            "subdomain": "jeffsthings-courses.pages.dev",
            "domains": [
                "jeffsthings-courses.pages.dev"
            ],
            "build_config": {
                "web_analytics_tag": null,
                "web_analytics_token": null
            },
            "deployment_configs": {
                "preview": {
                    "env_vars": null,
                    "fail_open": true,
                    "always_use_latest_compatibility_date": false,
                    "compatibility_date": "2025-08-24",
                    "compatibility_flags": [],
                    "build_image_major_version": 3,
                    "usage_model": "standard"
                },
                "production": {
                    "env_vars": null,
                    "fail_open": true,
                    "always_use_latest_compatibility_date": false,
                    "compatibility_date": "2025-08-24",
                    "compatibility_flags": [],
                    "build_image_major_version": 3,
                    "usage_model": "standard"
                }
            },
            "latest_deployment": {
                "id": "8e27eb4f-870e-418e-b4f7-0317cd2000e4",
                "short_id": "8e27eb4f",
                "project_id": "f0b841f2-a4c4-4d45-8665-b691698496de",
                "project_name": "jeffsthings-courses",
                "environment": "preview",
                "url": "https://8e27eb4f.jeffsthings-courses.pages.dev",
                "created_on": "2025-09-05T22:06:18.403967Z",
                "modified_on": "2025-09-05T22:06:21.06963Z",
                "latest_stage": {
                    "name": "deploy",
                    "started_on": null,
                    "ended_on": "2025-09-05T22:06:21.06963Z",
                    "status": "success"
                },
                "deployment_trigger": {
                    "type": "ad_hoc",
                    "metadata": {
                        "branch": "production",
                        "commit_hash": "c84ea0ab5c7f7fa1c8f9afe9f370e821c57b070f",
                        "commit_message": "fix: Add pythonpath to pytest.ini to resolve CI import issues\r\n\r\nThis ensures that the dashboard module can be imported during tests\r\nin both local and CI environments.",
                        "commit_dirty": true
                    }
                },
                "stages": [
                    {
                        "name": "queued",
                        "started_on": "2025-09-05T22:06:18.403967Z",
                        "ended_on": null,
                        "status": "active"
                    },
                    {
                        "name": "initialize",
                        "started_on": null,
                        "ended_on": null,
                        "status": "idle"
                    },
                    {
                        "name": "clone_repo",
                        "started_on": null,
                        "ended_on": null,
                        "status": "idle"
                    },
                    {
                        "name": "build",
                        "started_on": null,
                        "ended_on": null,
                        "status": "idle"
                    },
                    {
                        "name": "deploy",
                        "started_on": null,
                        "ended_on": "2025-09-05T22:06:21.06963Z",
                        "status": "success"
                    }
                ],
                "build_config": {
                    "build_command": null,
                    "destination_dir": null,
                    "build_caching": null,
                    "root_dir": null,
                    "web_analytics_tag": null,
                    "web_analytics_token": null
                },
                "env_vars": {},
                "compatibility_date": "2025-08-24",
                "compatibility_flags": [],
                "build_image_major_version": 3,
                "usage_model": null,
                "aliases": [
                    "https://production.jeffsthings-courses.pages.dev"
                ],
                "is_skipped": false,
                "production_branch": "main",
                "uses_functions": false
            },
            "canonical_deployment": null,
            "created_on": "2025-08-24T01:31:56.965235Z",
            "production_branch": "main",
            "production_script_name": "pages-worker--7435187-production",
            "preview_script_name": "pages-worker--7435187-preview",
            "uses_functions": false,
            "framework": "",
            "framework_version": ""
        }
    ],
    "success": true,
    "errors": [],
    "messages": [],
    "result_info": {
        "page": 1,
        "per_page": 10,
        "count": 1,
        "total_count": 1,
        "total_pages": 1
    }
}
```

## 6. DNS Propagation Status
### A Records
```
104.21.94.110
172.67.222.187
```

### Name Servers
```
ignacio.ns.cloudflare.com.
carol.ns.cloudflare.com.
```

## 7. Website Status
### HTTPS Status (apex domain)
```
HTTP/2 301 
date: Tue, 23 Sep 2025 17:49:05 GMT
location: https://www.liteckyeditingservices.com/
report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=gv7mIqBxW73LUJG%2B8m5Rcse3DT4rfVtCY2oBmuEvrf2PuL8RPA20HR0i8FpPXsm%2BZjA0sHlTVsZ5sPQqI%2B%2FoJm8WamnGVnqaXjyOAhkFWRokCxPssMBwdRwj"}]}
nel: {"report_to":"cf-nel","success_fraction":0.0,"max_age":604800}
server: cloudflare
cf-ray: 983be06b3df48b7a-SEA
alt-svc: h3=":443"; ma=86400

```

### HTTPS Status (www subdomain)
```
HTTP/2 200 
date: Tue, 23 Sep 2025 17:49:05 GMT
content-type: text/html; charset=utf-8
x-frame-options: DENY
vary: Sec-Fetch-Dest, Sec-Fetch-Mode, Sec-Fetch-Site
cache-control: no-cache, no-store, max-age=0, must-revalidate
pragma: no-cache
expires: Mon, 01 Jan 1990 00:00:00 GMT
nel: {"report_to":"cf-nel","success_fraction":0.0,"max_age":604800}
content-security-policy: base-uri 'self';object-src 'none';report-uri /_/view/cspreport;script-src 'nonce-iWXxYokbQbgENMe3qnM8pQ' 'unsafe-inline' 'unsafe-eval';worker-src 'self';frame-ancestors https://google-admin.corp.google.com/
```

## 8. Firewall Rules
```json
{
    "result": [],
    "success": true,
    "errors": [],
    "messages": [],
    "result_info": {
        "page": 1,
        "per_page": 25,
        "count": 0,
        "total_count": 0,
        "total_pages": 0
    }
}
```

## 9. Workers Configuration
```json
{
    "result": [],
    "success": true,
    "errors": [],
    "messages": []
}
```


## Summary

### Key Information:
- **Zone ID:** a5e7c69768502d649a8f2c615f555eca
- **Plan:** Free Website
- **Status:** Active
- **Name Servers:** carol.ns.cloudflare.com, ignacio.ns.cloudflare.com
- **Proxy Status:** Full (Orange Cloud)

### Next Steps for Development:
1. Deploy Astro site to Cloudflare Pages
2. Configure custom domain in Pages settings
3. Set up environment variables for production
4. Configure email routing for contact forms
5. Set up Workers for backend functionality
