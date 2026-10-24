---
title: "Fénix Project: Deploying and Monitoring 300+ Microservices on Azure with Terraform"
description: "Infrastructure as Code with Terraform, automated CI/CD pipelines in Azure DevOps, and full-stack observability for Bogota's Secretariat of Mobility."
role: "Infrastructure Lead & DevOps Engineer"
clientOrEntity: "Bogota Secretariat of Mobility"
stack: ["Azure", "Terraform", "Azure DevOps", "Docker / AKS", "Observability", "Bash / Python"]
metrics: ["300+ Microservices Orchestrated", "100% Infrastructure as Code", "24/7 Urban Transit Telemetry"]
externalUrl: "https://webfenix.movilidadbogota.gov.co"
draft: false
---

## Context & System Complexity

The **Fénix Project** serves as the central administrative and transit engine for Bogota's Secretariat of Mobility, governing traffic citations, vehicle registrations, and municipal citizen services for an urban metropolis of over 8 million people.

The underlying platform is a distributed architecture powered by **over 300 microservices** hosted on **Microsoft Azure**, interfacing with government payment gateways, relational databases, and national enforcement registries.

---

## Technical Role & Core Responsibilities

Held sole responsibility for deployment architecture, automated infrastructure provisioning, and continuous system monitoring:

### 1. Infrastructure as Code (IaC) with Terraform
- Standardized multi-environment Azure provisioning (App Services, container clusters, virtual networks, and storage accounts) via reusable, versioned **Terraform** modules.
- Completely eliminated configuration drift between Development, Staging, and Production environments.

### 2. CI/CD Orchestration via Azure DevOps
- Built and maintained standardized declarative YAML pipelines in **Azure DevOps** governing the continuous integration and delivery lifecycle for all 300+ services.
- Integrated automated security scanning, container builds, and canary validation gates.

### 3. Full-Stack Observability & Proactive SRE
- Engineered end-to-end telemetry utilizing **Azure Monitor** and **Application Insights**, with centralized dashboards tracking p95/p99 latency, error rates, and resource saturation.
- Established dynamic autoscaling thresholds and synthetic alerts to catch performance regressions before citizen workflows were impacted.

---

## Architectural Challenges Solved

- **High-Concurrency Inter-Service Dependencies**: Managed dependencies across 300+ microservices without causing cascade deployment blockers.
- **Zero-Downtime Releases for Critical Public Workflows**: Leveraged blue-green and rolling deployment strategies for high-traffic payment and citation modules.
- **Government Compliance & Hardened Governance**: Enforced Role-Based Access Control (RBAC), end-to-end encryption, and comprehensive audit logs.

---

## Engineering Impact

- Dramatically decreased release deployment lead times from days to automated minutes.
- Guaranteed 100% infrastructure auditability and disaster recovery readiness via Git-managed Terraform repositories.
- Supported stable public service delivery across Bogota's metropolitan transit infrastructure.
