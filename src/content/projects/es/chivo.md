---
title: "Chivo Wallet: Arquitectura de Soporte Masivo y Core Bancario Transaccional"
description: "Cómo diseñamos el sistema de soporte para millones de usuarios y modificamos componentes del core transaccional durante la primera adopción nacional de Bitcoin como moneda de curso legal."
role: "Software Engineer & Systems Architect"
clientOrEntity: "Gobierno de El Salvador"
stack: ["Python", "Core Bancario", "Microservicios", "Bitcoin", "PostgreSQL", "Alta Disponibilidad"]
metrics: ["Escala País (El Salvador)", "Primera Adopción Legal de Bitcoin", "Mesa de Ayuda de Misión Crítica"]
externalUrl: "https://www.chivowallet.com"
draft: false
---

## Contexto y Desafío Soberano

En septiembre de 2021, El Salvador se convirtió en el primer país del mundo en adoptar Bitcoin como moneda de curso legal. La implementación de **Chivo Wallet** representó un desafío de ingeniería inédito: desplegar y estabilizar una infraestructura financiera gubernamental utilizada por más de 4 millones de ciudadanos desde el día cero.

La escala masiva generó dos frentes críticos de alta complejidad técnica:
1. **Atención masiva de incidencias operativas**: Millones de usuarios no bancarizados interactuando simultáneamente por primera vez con transacciones on-chain y Lightning Network.
2. **Consistencia en el Core Bancario**: Necesidad de procesamiento transaccional seguro y confiable, con conciliación estricta entre la banca tradicional y los balances de criptoactivos.

---

## Rol Técnico & Alcance de la Solución

Mi participación en el proyecto se concentró en dos pilares estratégicos de la plataforma:

### 1. Sistema de Mesa de Ayuda y Soporte Operativo
Diseñé e implementé la arquitectura del sistema interno de soporte para clientes y agentes operativos:
- **Gestión de colas y flujos de tickets concurrentes**: Orquestación de atención para miles de solicitudes por hora con asignación inteligente y auditoría de resolución.
- **Trazabilidad en tiempo real**: Integración de telemetría para permitir a los analistas rastrear el estado exacto de una transacción (iniciada, confirmada en mempool, acreditada o rechazada) sin exponer llaves privadas ni violar protocolos de seguridad.

### 2. Modificaciones y Refuerzo del Core Bancario
Intervención directa en los módulos transaccionales del core bancario:
- **Lógica de balance y ledger**: Aseguramiento de consistencia contable en operaciones de conversión instantánea dólar-bitcoin.
- **Validación de reglas de negocio y límites**: Implementación de restricciones de seguridad y prevención de doble gasto en la capa de liquidación.

---

## Decisiones de Arquitectura Clave

- **Desacoplamiento asíncrono**: Separación estricta entre la ingestión de solicitudes de soporte y la consulta al core transaccional mediante colas para prevenir picos de carga en la base de datos principal.
- **Idempotencia transaccional**: Todo evento de balance y ajuste contable se estructuró con llaves de idempotencia estrictas para evitar duplicidad ante timeouts de red o reintentos de clientes.
- **Auditoría inmutable**: Registro de cada acción de agentes de soporte con trazabilidad criptográfica y marcas de tiempo sincronizadas.

---

## Impacto y Aprendizajes de Ingeniería

- Operación con estabilidad durante el periodo de mayor adopción de billeteras digitales en la historia de Centroamérica.
- Procesamiento y resolución eficiente de incidencias para millones de salvadoreños en su transición a la bancarización digital.
- Comprensión profunda de la fricción entre la inmutabilidad de una red blockchain descentralizada y las exigencias regulatorias y contables de un sistema bancario centralizado.
