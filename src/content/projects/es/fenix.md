---
title: "Proyecto Fénix: Despliegue, IaC y Monitoreo de 300+ Microservicios en Azure"
description: "Arquitectura de infraestructura como código con Terraform, pipelines CI/CD automatizados en Azure DevOps y observabilidad en tiempo real para la Secretaría de Movilidad de Bogotá."
role: "Infrastructure Lead & DevOps Engineer"
clientOrEntity: "Secretaría de Movilidad de Bogotá"
stack: ["Azure", "Terraform", "Azure DevOps", "Docker / AKS", "Observability", "Bash / Python"]
metrics: ["300+ Microservicios Gestionados", "100% Infraestructura como Código", "Disponibilidad 24/7 de Movilidad Urbana"]
externalUrl: "https://webfenix.movilidadbogota.gov.co"
draft: false
---

## Contexto y Complejidad del Sistema

El **Proyecto Fénix** es la plataforma informática central que gobierna los trámites, inspecciones, comparendos y servicios de movilidad para el Distrito Capital de Bogotá (una metrópoli de más de 8 millones de habitantes).

La arquitectura del sistema está compuesta por un ecosistema distribuido de **más de 300 microservicios** ejecutándose sobre la nube de **Microsoft Azure**, interactuando con bases de datos relacionales, pasarelas de pago del sector público y registros vehiculares nacionales.

---

## Rol Técnico & Responsabilidades Principales

Fui el responsable integral de la arquitectura de despliegue, la infraestructura como código y la observabilidad de todo el ecosistema:

### 1. Infraestructura como Código (IaC) con Terraform
- Estandaricé la provisión de recursos en Azure (App Services, clústeres de contenedores, redes virtuales, firewalls y almacenamiento) utilizando módulos de **Terraform**.
- Eliminé la configuración manual de entornos, garantizando reproducibilidad total entre ambientes de Desarrollo, Pruebas y Producción.

### 2. Automatización de CI/CD en Azure DevOps
- Diseñé y mantuve los pipelines declarativos (YAML) en **Azure DevOps** para el ciclo de vida continuo de los 300+ microservicios.
- Implementé estrategias de despliegue automatizado con análisis estático de código, empaquetado de artefactos y verificación de dependencias de seguridad.

### 3. Observabilidad, Telemetría y Monitoreo Proactivo
- Implementé la estrategia de monitoreo unificado con **Azure Monitor**, **Application Insights** y tableros centralizados de alertas de latencia, saturación de CPU y tasa de errores HTTP 5xx.
- Configuré políticas de auto-escalamiento y alertas proactivas que permitieron detectar y contener degradaciones de servicio antes de que impactaran a los ciudadanos.

---

## Retos Técnicos Superados

- **Orquestación a Gran Escala**: Coordinar el ciclo de vida de más de trescientas aplicaciones con dependencias cruzadas sin generar cuellos de botella en los despliegues.
- **Cero Downtime en Trámites Críticos**: Reducción de ventanas de mantenimiento mediante despliegues blue-green y control de fallos en servicios de alta demanda ciudadana.
- **Seguridad y Cumplimiento del Sector Público**: Implementación de políticas de acceso de mínimo privilegio (RBAC) y cifrado de datos en reposo y en tránsito.

---

## Resultados Comprobados

- Reducción drástica del tiempo de entrega de nuevas versiones y parches críticos en producción.
- Trazabilidad y visibilidad del 100% de la infraestructura gubernamental a través de código versionado.
- Estabilidad comprobada en uno de los sistemas tecnológicos más demandados y escrutados del sector público en Colombia.
