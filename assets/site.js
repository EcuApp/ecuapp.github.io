(() => {
  'use strict';

  const PRODUCTS = [
    {id:'hefesto',name:'Hefesto',icon:'▦',group:'business',categoryEs:'Gestión empresarial',categoryEn:'Business operations',summaryEs:'Inventario, compras, ventas, sucursales y operación comercial.',summaryEn:'Inventory, purchasing, sales, branches and commercial operations.',stageEs:'Desarrollo local · no desplegado',stageEn:'Local development · not deployed',stage:'dev',detailEs:'ERP modular con frontend React/Vite y API Spring Boot sobre PostgreSQL. La primera etapa contempla catálogo, inventario, compras, ventas, devoluciones, suscripciones, reportes, roles y auditoría. La emisión electrónica SRI, pagos y cuentas por cobrar/pagar siguen pendientes. No se presenta como servicio productivo.',detailEn:'Modular ERP with a React/Vite frontend and Spring Boot API on PostgreSQL. Its initial scope covers catalog, inventory, purchasing, sales, returns, subscriptions, reporting, roles and audit capabilities. SRI electronic invoicing, payments and accounts receivable/payable remain pending. It is not presented as a production service.',tags:['ERP','React','Spring Boot']},
    {id:'peitho',name:'Peitho',icon:'⌁',group:'business',categoryEs:'ERP · CRM · ventas',categoryEn:'ERP · CRM · Sales',summaryEs:'Gestión y análisis de flujos y datos comerciales.',summaryEn:'Management and analysis of sales and commercial data flows.',stageEs:'Alcance inicial documentado',stageEn:'Initial scope documented',stage:'concept',detailEs:'La descripción disponible identifica un sistema ERP + CRM para ventas, análisis y predicción de datos comerciales. La documentación de alcance, integraciones y disponibilidad aún es limitada; sus capacidades deben validarse antes de una evaluación comercial.',detailEn:'The available description identifies an ERP + CRM for sales, analysis and commercial data forecasting. Scope, integrations and availability documentation is still limited; capabilities must be validated before a commercial evaluation.',tags:['ERP','CRM','Analytics']},
    {id:'helios',name:'Helios',icon:'◎',group:'innovation',categoryEs:'Biometría · visión por computador',categoryEn:'Biometrics · computer vision',summaryEs:'Validación biométrica, prueba de vida y análisis de imágenes y vídeo.',summaryEn:'Biometric verification, liveness checks and image/video analysis.',stageEs:'Validación controlada · no producción',stageEn:'Controlled validation · not production',stage:'lab',detailEs:'Servicio FastAPI y consola Angular para pruebas biométricas y de visión por computador. La documentación describe validaciones con material sintético y pruebas internas consentidas. Continúan bloqueos legales, de calibración, procedencia de datos, seguridad y despliegue. No debe utilizarse para decisiones sobre personas reales ni presentarse como disponible para clientes.',detailEn:'FastAPI service and Angular console for biometric and computer-vision testing. Documentation describes validation with synthetic material and consented internal testing. Legal, calibration, data provenance, security and deployment blockers remain. It must not be used for decisions about real people or presented as available to customers.',tags:['Biometrics','FastAPI','Computer vision']},
    {id:'tyr',name:'TYR',icon:'◇',group:'platform',categoryEs:'Identidad · confianza digital',categoryEn:'Identity · digital trust',summaryEs:'Arquitectura para identidad, documentos, firmas y pruebas verificables.',summaryEn:'Architecture for identity, documents, signatures and verifiable proofs.',stageEs:'Arquitectura · validación local',stageEn:'Architecture · local validation',stage:'concept',detailEs:'La visión de TYR reúne identidad digital, documentos y firmas, pruebas verificables, integraciones e inteligencia en motores interoperables. Su estado actual corresponde a arquitectura y validación local; los objetivos de escala y las capacidades futuras no se consideran resultados demostrados.',detailEn:'TYR brings digital identity, documents and signatures, verifiable proofs, integrations and intelligence together in interoperable engines. Its current stage is architecture and local validation; scale targets and future capabilities are not presented as proven results.',tags:['Identity','Digital trust','APIs']},
    {id:'afrodita',name:'Afrodita',icon:'⌘',group:'platform',categoryEs:'Integración de canales · Meta',categoryEn:'Channel integration · Meta',summaryEs:'Base de integración para APIs oficiales de Meta y canales empresariales.',summaryEn:'Integration foundation for official Meta APIs and business channels.',stageEs:'Base técnica · integración pendiente',stageEn:'Technical foundation · integration pending',stage:'dev',detailEs:'La documentación contempla WhatsApp Business Platform, Messenger, Instagram, Threads, Lead Ads y Marketing API. El código disponible se describe como contratos y adaptadores; aún requiere conectar infraestructura, credenciales autorizadas, runtime y pruebas reales con activos Meta. No se declara una integración productiva.',detailEn:'Documentation covers WhatsApp Business Platform, Messenger, Instagram, Threads, Lead Ads and Marketing API. Available code is described as contracts and adapters; infrastructure, authorized credentials, runtime and real tests with Meta assets are still required. No production integration is claimed.',tags:['Meta APIs','WhatsApp','Integrations']},
    {id:'mercurio',name:'Mercurio',icon:'◈',group:'business',categoryEs:'Gestión tributaria · contable',categoryEn:'Tax · accounting operations',summaryEs:'Concepto de plataforma para procesos tributarios y contables.',summaryEn:'Platform concept for tax and accounting workflows.',stageEs:'Alcance por validar',stageEn:'Scope to validate',stage:'concept',detailEs:'El prototipo institucional identifica a Mercurio como una solución de gestión tributaria y contable. Aún no hay evidencia técnica suficiente para publicar funcionalidades, integraciones tributarias, cumplimiento normativo ni disponibilidad. El alcance se validará antes de anunciar capacidades.',detailEn:'The institutional prototype describes Mercurio as a tax and accounting solution. There is not enough technical evidence to publish features, tax integrations, regulatory compliance or availability. Scope will be validated before announcing capabilities.',tags:['Tax','Accounting','Business']},
    {id:'fitness',name:'Fitness',icon:'◉',group:'innovation',categoryEs:'Wellness · visualización 3D',categoryEn:'Wellness · 3D visualization',summaryEs:'Experiencia mobile-first para mediciones, evolución corporal y avatar 3D.',summaryEn:'Mobile-first experience for measurements, body evolution and a 3D avatar.',stageEs:'Implementación inicial',stageEn:'Initial implementation',stage:'dev',detailEs:'La base documentada separa frontend React/TypeScript y API FastAPI, con shell bilingüe y endpoints versionados de health/readiness. Cuentas, mediciones, avatar, predicciones, compartir, APIs B2B y MCP siguen en construcción. Las proyecciones no son un diagnóstico médico ni garantizan resultados.',detailEn:'The documented foundation separates a React/TypeScript frontend and FastAPI, with a bilingual shell and versioned health/readiness endpoints. Accounts, measurements, avatar, predictions, sharing, B2B APIs and MCP remain under development. Projections are not a medical diagnosis and do not guarantee outcomes.',tags:['3D','Wellness','FastAPI']},
    {id:'mnemosine',name:'Mnemosine',icon:'✳',group:'innovation',categoryEs:'Ingeniería de software · IA',categoryEn:'Software engineering · AI',summaryEs:'Project Memory OS para conservar contexto y coordinar agentes de desarrollo.',summaryEn:'Project Memory OS to preserve context and coordinate development agents.',stageEs:'V1 implementada · validación pendiente',stageEn:'V1 implemented · validation pending',stage:'dev',detailEs:'Plataforma para organizar memoria de proyectos, documentación, planes, tareas y colaboración de agentes de desarrollo. La validación integral en entornos reales y la preparación para producción continúan.',detailEn:'A platform for organizing project memory, documentation, plans, tasks and development-agent collaboration. End-to-end validation in real environments and production readiness are still in progress.',tags:['AI agents','Project memory','Engineering']},
    {id:'pdf-sign',name:'PDF Sign EC',icon:'✍',group:'platform',categoryEs:'Firma electrónica · Chrome',categoryEn:'Electronic signature · Chrome',summaryEs:'Extensión para documentos PDF y flujos de firma electrónica.',summaryEn:'Extension for PDF documents and electronic-signature workflows.',stageEs:'QA · preparación de release',stageEn:'QA · release preparation',stage:'dev',detailEs:'El perfil institucional sitúa el proyecto en QA y preparación de release; la validación final de flujos de firma reales continúa. No se afirma disponibilidad comercial ni certificación.',detailEn:'The organization profile places the project in QA and release preparation; final validation of real signature workflows remains. No commercial availability or certification is claimed.',tags:['PDF','Chrome','Electronic signature']},
    {id:'cuspide',name:'Cúspide',icon:'⌂',group:'business',categoryEs:'EdTech · gestión educativa',categoryEn:'EdTech · education management',summaryEs:'Plataforma multiinstitucional para la gestión de operaciones educativas.',summaryEn:'Multi-institution platform for education operations management.',stageEs:'En desarrollo',stageEn:'In development',stage:'dev',detailEs:'El perfil institucional describe una plataforma para administrar instituciones, clases, estudiantes, personal, actividades pagadas, productos e inventario con una estructura multiinstitución. El estado funcional y la disponibilidad comercial se comunicarán cuando se completen las validaciones internas.',detailEn:'The organization profile describes a platform for managing institutions, classes, students, staff, paid activities, products and inventory in a multi-institution structure. Functional status and commercial availability will be communicated after internal validation is complete.',tags:['Education','Multi-tenant','Operations']},
    {id:'clinica',name:'Clínica Estándar',icon:'✚',group:'business',categoryEs:'HealthTech · gestión clínica',categoryEn:'HealthTech · clinic management',summaryEs:'Portal y sistema de gestión para clínicas, agenda y citas.',summaryEn:'Clinic portal and management system for schedules and appointments.',stageEs:'Base funcional en evolución',stageEn:'Functional foundation evolving',stage:'dev',detailEs:'El perfil institucional describe un portal web y sistema operativo para clínicas: información pública, especialidades, profesionales, reservas de citas, agenda y administración por roles. Continúan tareas de calidad, accesibilidad, pruebas y preparación operativa.',detailEn:'The organization profile describes a clinic portal and operating system: public information, specialties, professionals, appointment bookings, schedules and role-based administration. Quality, accessibility, testing and operational-readiness work remains.',tags:['HealthTech','Scheduling','Role-based access']}
  ];

  const COPY = {
    es: {
      'nav.products':'Productos','nav.platforms':'Plataformas','nav.developers':'Desarrolladores','nav.docs':'Documentación','nav.pricing':'Precios',
      'nav.contact':'Contacto','nav.access':'Acceso','nav.cases':'Casos','nav.status':'Estado',
      'mega.eyebrow':'ECOSISTEMA ECUAPP','mega.title':'Una solución para cada reto.','mega.text':'Productos especializados que comparten una misma visión de ingeniería.','mega.link':'Explorar el ecosistema',
      'hero.kicker':'TECNOLOGÍA CONECTADA · CRECIMIENTO CONTINUO','hero.title':'La infraestructura digital para la evolución de tu empresa.','hero.subtitle':'Un ecosistema de productos, plataformas y servicios que conecta tus operaciones y abre nuevas posibilidades.','hero.primary':'Explorar productos','hero.secondary':'Solicitar una conversación','hero.meta1':'Ingeniería de producto','hero.meta2':'APIs e integraciones','hero.meta3':'Hecho en Ecuador',
      'hero.core':'ECUAPP','hero.coreSub':'Product engineering','hero.caption':'Selecciona cualquier producto del diagrama para conocer su propósito y etapa documentada.',
      'trust.title':'CÓMO TRABAJAMOS','trust.1':'Arquitectura con criterio','trust.2':'Seguridad desde el diseño','trust.3':'Evolución medible','trust.4':'Transparencia de alcance',
      'catalog.eyebrow':'PORTAFOLIO DE PRODUCTOS','catalog.title':'Tecnología con una misión clara.','catalog.text':'Cada iniciativa tiene su propio alcance y madurez. Mostramos lo que está documentado y diferenciamos el desarrollo de la disponibilidad productiva.','filter.all':'Todos','filter.business':'Negocio','filter.platform':'Plataformas','filter.innovation':'Innovación','catalog.note':'Las etiquetas indican la etapa de madurez actual; no representan disponibilidad comercial ni compromisos de entrega.','details':'Ver detalles','count':'iniciativas',
      'solutions.eyebrow':'CAPACIDADES','solutions.title':'Diseñamos alrededor de tu operación.','solutions.text':'No imponemos una plantilla. Entendemos el problema, definimos la arquitectura adecuada y construimos una solución que pueda evolucionar.','service.1':'Software a medida','service.1d':'Aplicaciones, sistemas internos y herramientas creadas para tus procesos y reglas de negocio.','service.2':'Plataformas web','service.2d':'Portales, paneles operativos, aplicaciones empresariales y productos digitales adaptables.','service.3':'APIs e integraciones','service.3d':'Contratos claros, interoperabilidad, automatización y comunicación entre servicios.','service.4':'Inteligencia artificial','service.4d':'Agentes, procesamiento de información y capacidades inteligentes con controles explícitos.','service.5':'Modernización','service.5d':'Evolución de sistemas existentes, arquitectura, rendimiento, seguridad y mantenibilidad.','service.6':'Ingeniería de producto','service.6d':'Descubrimiento, prototipos, validación técnica y construcción iterativa de productos propios.',
      'dev.eyebrow':'CENTRO PARA DESARROLLADORES','dev.title':'Integra con contexto. Construye con claridad.','dev.text':'Explora los contratos, solicita un entorno de evaluación y conoce los criterios de seguridad antes de conectar tus sistemas. La muestra de código es ilustrativa: no representa un endpoint activo.','dev.b1':'Versionado y contratos explícitos','dev.b2':'Permisos mínimos y separación de entornos','dev.b3':'Documentación y soporte por producto','dev.docs':'Explorar documentación','dev.copy':'Copiar ejemplo','dev.copied':'Ejemplo copiado','dev.sample':'Ejemplo ilustrativo · no es una API activa',
      'status.eyebrow':'TRANSPARENCIA OPERATIVA','status.title':'Estado conocido, sin promesas ficticias.','status.text':'Publicamos la etapa documentada de cada iniciativa. No mostramos indicadores simulados como si fueran telemetría real.','status.product':'Producto','status.stage':'Etapa documentada','status.note':'Nota','status.noSla':'SLA público aún no publicado','status.noSlaText':'EcuApp todavía no publica compromisos contractuales de disponibilidad (SLA), objetivos SLO, porcentaje de uptime ni un canal de incidentes para este catálogo. Se publicarán cuando existan servicios desplegados, mediciones verificables, ventanas de mantenimiento y procesos operativos aprobados.','status.review':'Revisión de información: 16 nov 2026','status.link':'Solicitar ficha técnica',
      'cases.eyebrow':'DISEÑO · INGENIERÍA · APRENDIZAJE','cases.title':'Decisiones de ingeniería detrás de cada producto.','cases.text':'Compartimos retos y decisiones técnicas verificables. Son casos de desarrollo internos, no testimonios ni resultados atribuidos a clientes.','case.1':'Hefesto · Operación comercial','case.1d':'Unificar inventario, compras, ventas y controles operativos sin perder trazabilidad ni permisos por contexto de negocio.','case.2':'Helios · Visión por computador','case.2d':'Organizar servicios biométricos versionados con límites de uso, protección de datos y validaciones especializadas pendientes.','case.3':'Afrodita · Canales empresariales','case.3d':'Preparar una arquitectura extensible para servicios oficiales de Meta, distinguiendo los adaptadores técnicos de una integración real.','case.4':'Fitness · Experiencia y privacidad','case.4d':'Separar mediciones, cálculos y proyecciones, con privacidad por defecto y procesamiento local como principios de diseño.','case.note':'No publicamos nombres de clientes, porcentajes de mejora, volúmenes ni ahorros sin evidencia autorizada y reproducible. Las pruebas internas no equivalen a resultados de producción.',
      'pricing.eyebrow':'MODALIDADES DE TRABAJO','pricing.title':'La inversión correcta empieza por entender el reto.','pricing.text':'Cada proyecto tiene requisitos distintos. Definimos una modalidad y una propuesta después de comprender alcance, entorno, riesgos y responsabilidades operativas.','pricing.1':'Exploración','pricing.1tag':'PRIMER PASO','pricing.1price':'A conversar','pricing.1d':'Para evaluar una idea, un producto o una integración antes de comprometer una implementación.','pricing.2':'Implementación','pricing.2tag':'PRODUCTO E INTEGRACIÓN','pricing.2price':'A cotizar','pricing.2d':'Para organizaciones que requieren software a medida, APIs, automatización o integración entre sistemas.','pricing.3':'Acompañamiento','pricing.3tag':'EVOLUCIÓN CONTINUA','pricing.3price':'Por acuerdo','pricing.3d':'Para productos que requieren mantenimiento, mejoras, observabilidad o evolución técnica.','pricing.note':'No publicamos precios ficticios ni afirmamos que todos los productos estén disponibles para contratación inmediata. Los precios, niveles de servicio, límites de uso y soporte se documentan en una propuesta o contrato aprobado.',
      'contact.eyebrow':'HABLEMOS DE TU PROYECTO','contact.title':'Convirtamos un reto real en una solución útil.','contact.text':'Cuéntanos qué quieres resolver. Revisaremos el contexto, el producto adecuado y los siguientes pasos posibles.','contact.email':'Correo directo','form.title':'Iniciar una conversación','form.name':'Nombre','form.email':'Correo corporativo','form.company':'Organización','form.product':'Producto o servicio','form.environment':'Entorno de interés','form.usecase':'Cuéntanos el caso de uso','form.consent':'Acepto que EcuApp utilice estos datos para responder a mi solicitud. No incluyas contraseñas, tokens ni claves privadas.','form.submit':'Preparar solicitud','form.note':'Se abrirá tu aplicación de correo con un borrador. No se crean cuentas ni se emiten credenciales automáticamente.','form.feedback':'Se preparará un correo para que lo revises y envíes.',
      'footer.tagline':'Infraestructura digital para avanzar con confianza.','footer.country':'Diseñado y desarrollado en Ecuador.','footer.company':'Empresa','footer.products':'Productos','footer.resources':'Recursos','footer.rights':'Todos los derechos reservados.',
      'search.title':'Buscar en EcuApp','search.placeholder':'Busca productos, tecnologías, documentación...','search.hint':'Escribe para buscar en el ecosistema.','search.empty':'No encontramos coincidencias. Prueba con otro término.','search.products':'Producto','search.section':'Sección','modal.stage':'Etapa','modal.contact':'Consultar sobre este producto','toast.copied':'Copiado al portapapeles','toast.copyError':'No se pudo copiar automáticamente. Selecciona el texto manualmente.','skip':'Saltar al contenido','backTop':'Volver arriba','mobileMenu':'Abrir menú','close':'Cerrar'
    },
    en: {
      'nav.products':'Products','nav.platforms':'Platforms','nav.developers':'Developers','nav.docs':'Documentation','nav.pricing':'Pricing',
      'nav.contact':'Contact','nav.access':'Access','nav.cases':'Cases','nav.status':'Status',
      'mega.eyebrow':'ECUAPP ECOSYSTEM','mega.title':'A solution for every challenge.','mega.text':'Specialized products sharing one engineering vision.','mega.link':'Explore the ecosystem',
      'hero.kicker':'CONNECTED TECHNOLOGY · CONTINUOUS GROWTH','hero.title':'Digital infrastructure for your company’s evolution.','hero.subtitle':'A connected ecosystem of products, platforms and services that brings operations together and opens new possibilities.','hero.primary':'Explore products','hero.secondary':'Start a conversation','hero.meta1':'Product engineering','hero.meta2':'APIs and integrations','hero.meta3':'Built in Ecuador',
      'hero.core':'ECUAPP','hero.coreSub':'Product engineering','hero.caption':'Select any product in the diagram to learn about its purpose and documented stage.',
      'trust.title':'HOW WE WORK','trust.1':'Thoughtful architecture','trust.2':'Security by design','trust.3':'Measurable evolution','trust.4':'Transparent scope',
      'catalog.eyebrow':'PRODUCT PORTFOLIO','catalog.title':'Technology with a clear purpose.','catalog.text':'Each initiative has its own scope and maturity. We show what is documented and distinguish development from production availability.','filter.all':'All','filter.business':'Business','filter.platform':'Platforms','filter.innovation':'Innovation','catalog.note':'Labels indicate the current maturity stage; they do not represent commercial availability or delivery commitments.','details':'View details','count':'initiatives',
      'solutions.eyebrow':'CAPABILITIES','solutions.title':'We design around your operations.','solutions.text':'We do not force a template. We understand the problem, define a suitable architecture and build a solution that can evolve.','service.1':'Custom software','service.1d':'Applications, internal systems and tools tailored to your processes and business rules.','service.2':'Web platforms','service.2d':'Portals, operations dashboards, business applications and adaptable digital products.','service.3':'APIs and integrations','service.3d':'Clear contracts, interoperability, automation and communication between services.','service.4':'Applied AI','service.4d':'Agents, information processing and intelligent capabilities with explicit controls.','service.5':'Modernization','service.5d':'Evolution of existing systems, architecture, performance, security and maintainability.','service.6':'Product engineering','service.6d':'Discovery, prototypes, technical validation and iterative development of digital products.',
      'dev.eyebrow':'DEVELOPER CENTER','dev.title':'Integrate with context. Build with clarity.','dev.text':'Explore contracts, request an evaluation environment and understand security requirements before connecting your systems. The code sample is illustrative and does not represent an active endpoint.','dev.b1':'Explicit versioning and contracts','dev.b2':'Least privilege and environment separation','dev.b3':'Product-specific documentation and support','dev.docs':'Explore documentation','dev.copy':'Copy example','dev.copied':'Example copied','dev.sample':'Illustrative example · not an active API',
      'status.eyebrow':'OPERATIONAL TRANSPARENCY','status.title':'Known status, no fictional promises.','status.text':'We publish each initiative’s documented stage. Simulated indicators are never presented as live telemetry.','status.product':'Product','status.stage':'Documented stage','status.note':'Note','status.noSla':'Public SLA not published yet','status.noSlaText':'EcuApp does not yet publish contractual availability commitments (SLA), service-level objectives (SLO), uptime percentages or an incident channel for this catalog. These will be published when deployed services, verifiable measurements, maintenance windows and approved operating processes exist.','status.review':'Information reviewed: Nov 16, 2026','status.link':'Request technical brief',
      'cases.eyebrow':'DESIGN · ENGINEERING · LEARNING','cases.title':'Engineering decisions behind every product.','cases.text':'We share verifiable challenges and technical decisions. These are internal development cases, not testimonials or client-attributed outcomes.','case.1':'Hefesto · Business operations','case.1d':'Bring inventory, purchasing, sales and operational controls together without losing traceability or contextual permissions.','case.2':'Helios · Computer vision','case.2d':'Organize versioned biometric services with usage boundaries, data protection and specialist validations still pending.','case.3':'Afrodita · Business channels','case.3d':'Prepare an extensible architecture for official Meta services while distinguishing technical adapters from a live integration.','case.4':'Fitness · Experience and privacy','case.4d':'Separate measurements, calculations and projections, with privacy by default and local processing as design principles.','case.note':'We do not publish client names, improvement percentages, volumes or savings without authorized, reproducible evidence. Internal tests are not production outcomes.',
      'pricing.eyebrow':'ENGAGEMENT MODELS','pricing.title':'The right investment starts with understanding the challenge.','pricing.text':'Every project has different requirements. We define an engagement model and proposal after understanding scope, environment, risks and operational responsibilities.','pricing.1':'Discovery','pricing.1tag':'FIRST STEP','pricing.1price':'Let’s discuss','pricing.1d':'For evaluating an idea, product or integration before committing to implementation.','pricing.2':'Implementation','pricing.2tag':'PRODUCT & INTEGRATION','pricing.2price':'Custom quote','pricing.2d':'For organizations requiring custom software, APIs, automation or systems integration.','pricing.3':'Ongoing partnership','pricing.3tag':'CONTINUOUS EVOLUTION','pricing.3price':'By agreement','pricing.3d':'For products requiring maintenance, improvements, observability or technical evolution.','pricing.note':'We do not publish fictional prices or claim every product is immediately available for purchase. Prices, service levels, usage limits and support are documented in an approved proposal or agreement.',
      'contact.eyebrow':'LET’S DISCUSS YOUR PROJECT','contact.title':'Turn a real challenge into a useful solution.','contact.text':'Tell us what you want to solve. We will review the context, suitable product and possible next steps.','contact.email':'Direct email','form.title':'Start a conversation','form.name':'Name','form.email':'Business email','form.company':'Organization','form.product':'Product or service','form.environment':'Environment of interest','form.usecase':'Tell us about your use case','form.consent':'I agree that EcuApp may use this information to respond to my request. Do not include passwords, tokens or private keys.','form.submit':'Prepare request','form.note':'Your email application will open with a draft. No account is created and no credentials are issued automatically.','form.feedback':'An email draft will be prepared for you to review and send.',
      'footer.tagline':'Digital infrastructure to move forward with confidence.','footer.country':'Designed and developed in Ecuador.','footer.company':'Company','footer.products':'Products','footer.resources':'Resources','footer.rights':'All rights reserved.',
      'search.title':'Search EcuApp','search.placeholder':'Search products, technologies, documentation...','search.hint':'Type to search the ecosystem.','search.empty':'No matches found. Try another term.','search.products':'Product','search.section':'Section','toast.copied':'Copied to clipboard','toast.copyError':'Automatic copy failed. Select the text manually.','skip':'Skip to content','backTop':'Back to top','mobileMenu':'Open menu','close':'Close','details':'View details','count':'initiatives','modal.stage':'Stage','modal.contact':'Ask about this product'
    }
  };


  Object.assign(COPY.es, {
    'hero.titlePrefix':'La infraestructura digital para la','hero.titleHighlight':'evolución de tu empresa.',
    'mega.hefestoLabel':'ERP · Operación comercial','mega.peithoLabel':'ERP · CRM · Analítica','mega.heliosLabel':'Biometría · Visión','mega.tyrLabel':'Identidad · Confianza digital','mega.afroditaLabel':'Integración de canales','mega.mercurioLabel':'Tributario · Contable',
    'mega.platformTitle':'Ingeniería para conectar procesos.','mega.platformText':'Servicios modulares para crear, integrar y evolucionar tecnología.','mega.custom':'Software a medida','mega.customDesc':'Aplicaciones y sistemas','mega.apis':'APIs e integraciones','mega.apisDesc':'Servicios y datos conectados','mega.ai':'IA aplicada','mega.aiDesc':'Automatización con controles','mega.modern':'Modernización','mega.modernDesc':'Arquitectura y evolución','mega.status':'Estado del ecosistema','mega.statusDesc':'Madurez y transparencia','mega.statusLink':'Consultar estado',
    'hero.title':'La infraestructura digital para la evolución de tu empresa.','hero.copy':'Copiar ejemplo',
    'status.hefestoStage':'Desarrollo local','status.hefestoNote':'Pruebas locales documentadas; no desplegado. Integraciones comerciales pendientes.',
    'status.peithoStage':'Alcance inicial','status.peithoNote':'Descripción funcional breve; alcance e integraciones por validar.',
    'status.heliosStage':'Validación controlada','status.heliosNote':'No apto para producción; bloqueos legales, calibración y seguridad abiertos.',
    'status.tyrStage':'Arquitectura','status.tyrNote':'Visión y arquitectura objetivo; escala no demostrada.',
    'status.afroditaStage':'Base técnica','status.afroditaNote':'Contratos y adaptadores; runtime e integración real pendientes.',
    'status.mercurioStage':'Por validar','status.mercurioNote':'Dirección definida en el prototipo; alcance técnico por confirmar.',
    'status.fitnessStage':'Implementación inicial','status.fitnessNote':'Base frontend/API; funciones principales siguen en construcción.',
    'status.mnemosineStage':'V1 implementada','status.mnemosineNote':'Validación integral y preparación para producción continúan.',
    'status.pdfStage':'QA / release','status.pdfNote':'Validación final de flujos reales de firma pendiente.',
    'status.cuspideStage':'En desarrollo','status.cuspideNote':'Madurez por confirmar con documentación actual del proyecto.',
    'status.clinicaStage':'Base funcional','status.clinicaNote':'Calidad, accesibilidad y preparación operativa en evolución.',
    'case.1a':'Frontend React/Vite y API Spring Boot sobre PostgreSQL.','case.1b':'Permisos por operación, negocio y sucursal.','case.1c':'Pruebas locales documentadas; no son mediciones de producción.',
    'case.2a':'FastAPI, worker de análisis y consola Angular.','case.2b':'Pruebas con material sintético y voluntarios internos con consentimiento.','case.2c':'No habilitado para producción ni decisiones sobre personas reales.',
    'case.3a':'Contratos y adaptadores intercambiables.','case.3b':'Aislamiento multi-tenant y resiliencia como criterios de diseño.','case.3c':'Runtime y pruebas reales aún pendientes.',
    'case.4a':'Frontend React/TypeScript y API FastAPI separados.','case.4b':'Contratos versionados y consentimiento.','case.4c':'Funciones principales todavía en implementación.',
    'pricing.1a':'Entendimiento del caso de uso','pricing.1b':'Revisión inicial de viabilidad','pricing.1c':'Recomendación de siguientes pasos',
    'pricing.2a':'Alcance y entregables acordados','pricing.2b':'Hitos, validación y documentación','pricing.2c':'Plan de soporte según contrato',
    'pricing.3a':'Backlog y prioridades compartidas','pricing.3b':'Mantenimiento y mejoras iterativas','pricing.3c':'Métricas acordadas según alcance',
    'form.namePlaceholder':'Nombre y apellido','form.emailPlaceholder':'nombre@empresa.com','form.companyPlaceholder':'Empresa (opcional)','form.usecasePlaceholder':'¿Qué proceso quieres resolver? ¿Qué sistemas participan?',
    'search.open':'Buscar en EcuApp','theme.change':'Cambiar tema','theme.light':'Cambiar a tema claro','theme.dark':'Cambiar a tema oscuro'
  });
  Object.assign(COPY.en, {
    'hero.titlePrefix':'Digital infrastructure for your company’s','hero.titleHighlight':'evolution.',
    'mega.hefestoLabel':'ERP · Business operations','mega.peithoLabel':'ERP · CRM · Analytics','mega.heliosLabel':'Biometrics · Vision','mega.tyrLabel':'Identity · Digital trust','mega.afroditaLabel':'Channel integration','mega.mercurioLabel':'Tax · Accounting',
    'mega.platformTitle':'Engineering to connect operations.','mega.platformText':'Modular services to build, integrate and evolve technology.','mega.custom':'Custom software','mega.customDesc':'Applications and systems','mega.apis':'APIs and integrations','mega.apisDesc':'Connected services and data','mega.ai':'Applied AI','mega.aiDesc':'Automation with controls','mega.modern':'Modernization','mega.modernDesc':'Architecture and evolution','mega.status':'Ecosystem status','mega.statusDesc':'Maturity and transparency','mega.statusLink':'Check status',
    'hero.title':'Digital infrastructure for your company’s evolution.','hero.copy':'Copy example',
    'status.hefestoStage':'Local development','status.hefestoNote':'Local tests documented; not deployed. Commercial integrations remain pending.',
    'status.peithoStage':'Initial scope','status.peithoNote':'Brief functional description; scope and integrations require validation.',
    'status.heliosStage':'Controlled validation','status.heliosNote':'Not production-ready; legal, calibration and security blockers remain.',
    'status.tyrStage':'Architecture','status.tyrNote':'Vision and target architecture; scale is not demonstrated.',
    'status.afroditaStage':'Technical foundation','status.afroditaNote':'Contracts and adapters; runtime and live integration remain pending.',
    'status.mercurioStage':'To be validated','status.mercurioNote':'Direction appears in the prototype; technical scope needs confirmation.',
    'status.fitnessStage':'Initial implementation','status.fitnessNote':'Frontend/API foundation; core features remain under development.',
    'status.mnemosineStage':'V1 implemented','status.mnemosineNote':'End-to-end validation and production readiness remain in progress.',
    'status.pdfStage':'QA / release','status.pdfNote':'Final validation of real signature workflows remains pending.',
    'status.cuspideStage':'In development','status.cuspideNote':'Maturity needs confirmation against current project documentation.',
    'status.clinicaStage':'Functional foundation','status.clinicaNote':'Quality, accessibility and operational readiness continue to evolve.',
    'case.1a':'React/Vite frontend and Spring Boot API on PostgreSQL.','case.1b':'Permissions by operation, business and branch.','case.1c':'Local tests are documented; they are not production measurements.',
    'case.2a':'FastAPI, analysis worker and Angular console.','case.2b':'Tests with synthetic material and consented internal volunteers.','case.2c':'Not production-ready and not for decisions about real people.',
    'case.3a':'Interchangeable contracts and adapters.','case.3b':'Multi-tenant isolation and resilience as design criteria.','case.3c':'Runtime and real integration tests remain pending.',
    'case.4a':'Separate React/TypeScript frontend and FastAPI API.','case.4b':'Versioned contracts and consent.','case.4c':'Core features remain under implementation.',
    'pricing.1a':'Use-case discovery','pricing.1b':'Initial feasibility review','pricing.1c':'Recommended next steps',
    'pricing.2a':'Agreed scope and deliverables','pricing.2b':'Milestones, validation and documentation','pricing.2c':'Support plan defined by contract',
    'pricing.3a':'Shared backlog and priorities','pricing.3b':'Maintenance and iterative improvements','pricing.3c':'Metrics agreed for each scope',
    'form.namePlaceholder':'First and last name','form.emailPlaceholder':'name@company.com','form.companyPlaceholder':'Company (optional)','form.usecasePlaceholder':'What process do you want to solve? Which systems are involved?',
    'search.open':'Search EcuApp','theme.change':'Toggle theme','theme.light':'Switch to light theme','theme.dark':'Switch to dark theme'
  });


  Object.assign(COPY.es, {
    'status.footnote':'Los estados de proyecto no son indicadores de disponibilidad. No se publica uptime, telemetría, SLA o SLO sin un servicio desplegado y datos operativos verificables.',
    'form.envDiscovery':'Exploración / asesoría','form.envSandbox':'Evaluación / sandbox','form.envImplementation':'Implementación','form.envSupport':'Soporte / evolución'
  });
  Object.assign(COPY.en, {
    'status.footnote':'Project stages are not availability indicators. Uptime, telemetry, SLA or SLO are not published without a deployed service and verifiable operational data.',
    'form.envDiscovery':'Discovery / consulting','form.envSandbox':'Evaluation / sandbox','form.envImplementation':'Implementation','form.envSupport':'Support / evolution'
  });


  Object.assign(COPY.es, {
    'credentials.eyebrow':'ACCESO CONTROLADO','credentials.title':'Solicita acceso a un producto EcuApp.',
    'credentials.description':'Los entornos privados se habilitan después de validar la organización, el caso de uso y los permisos necesarios. Nunca compartas contraseñas ni tokens por correo.',
    'credentials.email':'Correo corporativo','credentials.organization':'Organización','credentials.product':'Producto',
    'credentials.role':'Perfil de acceso solicitado','credentials.roleEvaluation':'Evaluación técnica',
    'credentials.roleDeveloper':'Desarrollador / integración','credentials.roleBusiness':'Usuario empresarial',
    'credentials.rolePartner':'Socio / proveedor','credentials.purpose':'Propósito y alcance',
    'credentials.purposePlaceholder':'Describe qué necesitas evaluar o integrar. No incluyas secretos.',
    'credentials.consent':'Autorizo que EcuApp use estos datos para revisar y responder mi solicitud.',
    'credentials.submit':'Preparar solicitud de acceso',
    'credentials.note':'Se abrirá un borrador de correo que podrás revisar. Este formulario no crea cuentas ni emite credenciales automáticamente.',
    'credentials.feedback':'Se preparará un correo para que lo revises y envíes.',
    'theme.light':'Cambiar a tema claro','theme.dark':'Cambiar a tema oscuro','menu.open':'Abrir menú','menu.close':'Cerrar menú'
  });
  Object.assign(COPY.en, {
    'credentials.eyebrow':'CONTROLLED ACCESS','credentials.title':'Request access to an EcuApp product.',
    'credentials.description':'Private environments are enabled after the organization, use case and required permissions are reviewed. Never share passwords or tokens by email.',
    'credentials.email':'Business email','credentials.organization':'Organization','credentials.product':'Product',
    'credentials.role':'Requested access profile','credentials.roleEvaluation':'Technical evaluation',
    'credentials.roleDeveloper':'Developer / integration','credentials.roleBusiness':'Business user',
    'credentials.rolePartner':'Partner / provider','credentials.purpose':'Purpose and scope',
    'credentials.purposePlaceholder':'Describe what you need to evaluate or integrate. Do not include secrets.',
    'credentials.consent':'I authorize EcuApp to use this information to review and respond to my request.',
    'credentials.submit':'Prepare access request',
    'credentials.note':'An email draft will open for your review. This form does not create accounts or issue credentials automatically.',
    'credentials.feedback':'An email draft will be prepared for you to review and send.',
    'theme.light':'Switch to light theme','theme.dark':'Switch to dark theme','menu.open':'Open menu','menu.close':'Close menu'
  });

  let language = 'es';
  let activeFilter = 'all';
  const $ = (selector, root=document) => root.querySelector(selector);
  const $$ = (selector, root=document) => Array.from(root.querySelectorAll(selector));
  const t = key => (COPY[language] && COPY[language][key]) || COPY.es[key] || key;
  const summary = product => language === 'en' ? product.summaryEn : product.summaryEs;
  const category = product => language === 'en' ? product.categoryEn : product.categoryEs;
  const stage = product => language === 'en' ? product.stageEn : product.stageEs;
  const detail = product => language === 'en' ? product.detailEn : product.detailEs;

  function safeStorageGet(key) {
    try { return window.localStorage.getItem(key); } catch (_) { return null; }
  }
  function safeStorageSet(key, value) {
    try { window.localStorage.setItem(key, value); } catch (_) { /* Storage can be blocked. */ }
  }
  function updateResponsiveTableLabels() {
    $$('.status-table').forEach(table => {
      const labels = $('thead th', table).map(header => header.textContent.trim());
      $$('tbody tr', table).forEach(row => {
        $('td', row).forEach((cell, index) => { cell.dataset.label = labels[index] || ''; });
      });
    });
  }

  function renderTranslations() {
    $$('[data-i18n]').forEach(node => {
      const key = node.dataset.i18n;
      if (COPY[language][key]) node.textContent = COPY[language][key];
    });
    $$('[data-i18n-placeholder]').forEach(node => {
      const key = node.dataset.i18nPlaceholder;
      if (COPY[language][key]) node.setAttribute('placeholder', COPY[language][key]);
    });
    $$('[data-i18n-aria]').forEach(node => {
      const key = node.dataset.i18nAria;
      if (COPY[language][key]) node.setAttribute('aria-label', COPY[language][key]);
    });
    document.documentElement.lang = language;
    const select = $('#language-select');
    if (select) select.value = language;
    const themeButton = $('.theme-toggle');
    if (themeButton) themeButton.setAttribute('aria-label', t(document.documentElement.dataset.theme === 'dark' ? 'theme.light' : 'theme.dark'));
    const menuButton = $('.mobile-menu-toggle');
    if (menuButton) menuButton.setAttribute('aria-label', t(menuButton.getAttribute('aria-expanded') === 'true' ? 'menu.close' : 'menu.open'));
    renderDiagram();
    renderProducts();
    fillProductSelect();
    updateResponsiveTableLabels();
    if ($('#product-dialog')?.open && $('#product-dialog').dataset.product) openProduct($('#product-dialog').dataset.product, false);
  }
  function setLanguage(next) {
    if (!COPY[next]) return;
    language = next;
    safeStorageSet('ecuapp-language', next);
    renderTranslations();
  }

  function productCard(product) {
    return '<article class="product-card reveal" data-category="' + product.group + '">' +
      '<div class="product-card-top"><span class="product-logo" aria-hidden="true">' + product.icon + '</span><span class="stage-pill stage-' + product.stage + '">' + stage(product) + '</span></div>' +
      '<span class="product-category">' + category(product) + '</span><h3>' + product.name + '</h3><p>' + summary(product) + '</p>' +
      '<div class="product-card-bottom"><small>' + product.tags.slice(0,3).join(' · ') + '</small><button class="product-detail-button" type="button" data-open-product="' + product.id + '">' + t('details') + ' ↗</button></div>' +
      '</article>';
  }

  function renderDiagram() {
    const target = $('#network-nodes');
    if (!target) return;
    target.innerHTML = PRODUCTS.slice(0, 7).map(product =>
      '<button class="network-node node-' + product.id + '" type="button" data-open-product="' + product.id + '" aria-label="' + product.name + ': ' + summary(product) + '">' +
      '<span class="node-icon" aria-hidden="true">' + product.icon + '</span><span><b>' + product.name + '</b><small>' + category(product) + '</small></span></button>'
    ).join('');
  }

  function renderProducts() {
    const target = $('#product-grid');
    if (!target) return;
    const filtered = PRODUCTS.filter(product => activeFilter === 'all' || product.group === activeFilter);
    target.innerHTML = filtered.map(productCard).join('');
    $$('.filter-chip').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === activeFilter)));
    const count = $('#catalog-count');
    if (count) count.textContent = filtered.length + ' ' + t('count');
    observeReveals();
  }

  function fillProductSelect() {
    const first = language === 'en' ? 'General inquiry' : 'Consulta general';
    ['#request-product', '#credentials-product'].forEach(selector => {
      const select = $(selector);
      if (!select) return;
      const current = select.value;
      select.innerHTML = '<option value="General">' + first + '</option>' + PRODUCTS.map(p => '<option value="' + p.name + '">' + p.name + '</option>').join('');
      if ([...select.options].some(option => option.value === current)) select.value = current;
    });
  }

  function openProduct(id, show=true) {
    const product = PRODUCTS.find(item => item.id === id);
    const dialog = $('#product-dialog');
    if (!product || !dialog) return;
    dialog.dataset.product = id;
    $('#product-dialog-content').innerHTML =
      '<span class="eyebrow">' + category(product) + '</span><h2 id="product-dialog-title">' + product.icon + ' ' + product.name + '</h2>' +
      '<p>' + detail(product) + '</p><div class="dialog-meta"><span>' + t('modal.stage') + ': ' + stage(product) + '</span>' +
      product.tags.map(tag => '<span>' + tag + '</span>').join('') + '</div><div class="dialog-actions">' +
      '<a class="button button-primary" href="#contacto" data-dialog-contact>' + t('modal.contact') + ' ↗</a></div>';
    $('[data-dialog-contact]', $('#product-dialog-content'))?.addEventListener('click', () => {
      dialog.close();
      document.querySelector('#contacto')?.scrollIntoView({behavior: motionOK ? 'smooth' : 'auto'});
    });
    if (show && !dialog.open) dialog.showModal();
  }

  function closeMegaMenus() {
    $$('.nav-item.is-open').forEach(item => {
      item.classList.remove('is-open');
      $('.nav-trigger', item)?.setAttribute('aria-expanded', 'false');
    });
  }
  function setupNavigation() {
    $$('.nav-trigger').forEach(trigger => trigger.addEventListener('click', event => {
      event.stopPropagation();
      const item = trigger.closest('.nav-item');
      const shouldOpen = !item.classList.contains('is-open');
      closeMegaMenus();
      if (shouldOpen) {
        item.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    }));
    document.addEventListener('click', event => {
      if (!event.target.closest('.nav-item')) closeMegaMenus();
    });
    $$('.mega-menu a').forEach(link => link.addEventListener('click', closeMegaMenus));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeMegaMenus();
    });
    const menuButton = $('.mobile-menu-toggle');
    const mobile = $('#mobile-nav');
    menuButton?.addEventListener('click', () => {
      const open = mobile.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', t(open ? 'menu.close' : 'menu.open'));
    });
    const closeMobileMenu = () => {
      mobile?.classList.remove('is-open');
      menuButton?.setAttribute('aria-expanded', 'false');
      menuButton?.setAttribute('aria-label', t('menu.open'));
    };
    $$('#mobile-nav a').forEach(link => link.addEventListener('click', closeMobileMenu));
    $('.mobile-access-button', mobile)?.addEventListener('click', closeMobileMenu);
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1150) {
        mobile?.classList.remove('is-open');
        menuButton?.setAttribute('aria-expanded', 'false');
      }
    });
  }

  function setupTheme() {
    const stored = safeStorageGet('ecuapp-theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = stored || (prefersDark ? 'dark' : 'light');
    document.documentElement.dataset.theme = initial;
    const button = $('.theme-toggle');
    const glyph = $('.theme-glyph');
    function sync() {
      const dark = document.documentElement.dataset.theme === 'dark';
      if (glyph) glyph.textContent = dark ? '☾' : '☼';
      button?.setAttribute('aria-label', t(dark ? 'theme.light' : 'theme.dark'));
      $('meta[name="theme-color"]')?.setAttribute('content', dark ? '#07111f' : '#f3f6fb');
    }
    sync();
    button?.addEventListener('click', () => {
      document.documentElement.dataset.theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      safeStorageSet('ecuapp-theme', document.documentElement.dataset.theme);
      sync();
    });
  }

  function setupFilters() {
    $$('.filter-chip').forEach(button => button.addEventListener('click', () => {
      activeFilter = button.dataset.filter || 'all';
      renderProducts();
    }));
  }

  function setupDialogs() {
    const productDialog = $('#product-dialog');
    $('.dialog-close')?.addEventListener('click', () => productDialog?.close());
    productDialog?.addEventListener('click', event => {
      if (event.target === productDialog) productDialog.close();
    });
    const searchDialog = $('#search-dialog');
    $('.search-close')?.addEventListener('click', () => searchDialog?.close());
    searchDialog?.addEventListener('click', event => {
      if (event.target === searchDialog) searchDialog.close();
    });
    const credentialsDialog = $('#credentials-dialog');
    $('.credentials-close')?.addEventListener('click', () => credentialsDialog?.close());
    credentialsDialog?.addEventListener('click', event => {
      if (event.target === credentialsDialog) credentialsDialog.close();
    });
    $$('[data-open-credentials]').forEach(button => button.addEventListener('click', () => {
      closeMegaMenus();
      $('#mobile-nav')?.classList.remove('is-open');
      $('.mobile-menu-toggle')?.setAttribute('aria-expanded', 'false');
      renderTranslations();
      if (credentialsDialog && !credentialsDialog.open) credentialsDialog.showModal();
    }));
  }

  const SEARCH_PAGES = [
    {titleEs:'Productos y ecosistema',titleEn:'Products and ecosystem',descriptionEs:'Catálogo, productos y etapas documentadas',descriptionEn:'Catalog, products and documented stages',href:'#ecosistema',keywords:'productos producto ERP CRM software'},
    {titleEs:'Plataformas y servicios',titleEn:'Platforms and services',descriptionEs:'Software a medida, APIs e inteligencia artificial',descriptionEn:'Custom software, APIs and applied AI',href:'#soluciones',keywords:'plataformas servicios APIs inteligencia artificial'},
    {titleEs:'Centro para desarrolladores',titleEn:'Developer center',descriptionEs:'Contratos, seguridad y solicitud de evaluación',descriptionEn:'Contracts, security and evaluation requests',href:'#desarrolladores',keywords:'developers docs documentación credenciales'},
    {titleEs:'Estado del ecosistema',titleEn:'Ecosystem status',descriptionEs:'Madurez, SLA y transparencia operativa',descriptionEn:'Maturity, SLA and operational transparency',href:'#estado',keywords:'estado SLA SLO uptime incidentes'},
    {titleEs:'Casos de ingeniería',titleEn:'Engineering cases',descriptionEs:'Decisiones técnicas y aprendizajes',descriptionEn:'Technical decisions and lessons learned',href:'#casos',keywords:'casos estudios arquitectura engineering'},
    {titleEs:'Modalidades y precios',titleEn:'Engagement and pricing',descriptionEs:'Exploración, implementación y acompañamiento',descriptionEn:'Discovery, implementation and ongoing support',href:'#precios',keywords:'precios pricing cotización'}
  ];
  function setupSearch() {
    const dialog = $('#search-dialog');
    const input = $('#global-search');
    const results = $('#search-results');
    if (!dialog || !input || !results) return;
    function search(query) {
      const q = query.trim().toLocaleLowerCase();
      if (!q) {
        results.innerHTML = '<p class="search-hint">' + t('search.hint') + '</p>';
        return;
      }
      const productItems = PRODUCTS.filter(product => [
        product.name, product.summaryEs, product.summaryEn, product.categoryEs, product.categoryEn, product.tags.join(' ')
      ].join(' ').toLocaleLowerCase().includes(q)).map(product => ({
        title: product.name, description: summary(product), icon: product.icon, id: product.id, type: t('search.products')
      }));
      const pageItems = SEARCH_PAGES.filter(page => [
        page.titleEs, page.titleEn, page.descriptionEs, page.descriptionEn, page.keywords
      ].join(' ').toLocaleLowerCase().includes(q)).map(page => ({
        title: language === 'en' ? page.titleEn : page.titleEs,
        description: language === 'en' ? page.descriptionEn : page.descriptionEs,
        icon: '↗', href: page.href, type: t('search.section')
      }));
      const items = productItems.concat(pageItems).slice(0, 14);
      if (!items.length) {
        results.innerHTML = '<p class="search-hint">' + t('search.empty') + '</p>';
        return;
      }
      results.innerHTML = items.map((item, index) =>
        '<button type="button" class="search-result" data-search-index="' + index + '"><span class="search-result-icon">' + item.icon + '</span>' +
        '<span class="search-result-copy"><b>' + item.title + '</b><small>' + item.description + '</small></span><em>' + item.type + '</em></button>'
      ).join('');
      $$('.search-result', results).forEach((button, index) => button.addEventListener('click', () => {
        const item = items[index];
        dialog.close();
        if (item.id) openProduct(item.id);
        else document.querySelector(item.href)?.scrollIntoView({behavior: motionOK ? 'smooth' : 'auto'});
      }));
    }
    function open() {
      dialog.showModal();
      input.value = '';
      search('');
      window.setTimeout(() => input.focus(), 30);
    }
    $('.search-open')?.addEventListener('click', open);
    input.addEventListener('input', () => search(input.value));
    document.addEventListener('keydown', event => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        if (!dialog.open) open();
      }
    });
  }

  const EXAMPLES = {
    request: 'curl -X GET \\\n  https://api.example.invalid/v1/resources \\\n  -H "Authorization: Bearer YOUR_TOKEN" \\\n  -H "Accept: application/json"',
    response: '{\n  "data": [],\n  "meta": {\n    "version": "v1",\n    "environment": "sandbox"\n  },\n  "pagination": {\n    "next_cursor": null\n  }\n}',
    policy: '{\n  "access": "least-privilege",\n  "secrets": "server-side-only",\n  "environment": "sandbox",\n  "webhook_signature": "required"\n}'
  };
  let activeExample = 'request';
  function setupCodeExamples() {
    const output = $('#code-sample');
    $$('.code-tab').forEach(button => button.addEventListener('click', () => {
      activeExample = button.dataset.example || 'request';
      $$('.code-tab').forEach(tab => tab.setAttribute('aria-selected', String(tab === button)));
      if (output) output.textContent = EXAMPLES[activeExample] || EXAMPLES.request;
    }));
    $('#copy-code')?.addEventListener('click', async () => {
      const text = EXAMPLES[activeExample] || EXAMPLES.request;
      try {
        await navigator.clipboard.writeText(text);
        showToast(t('toast.copied'));
      } catch (_) {
        showToast(t('toast.copyError'));
      }
    });
    $('[data-copy-hero]')?.addEventListener('click', async () => {
      const text = '{\n  "product": "Hefesto",\n  "environment": "sandbox",\n  "scope": ["inventory:read"]\n}';
      try { await navigator.clipboard.writeText(text); showToast(t('toast.copied')); }
      catch (_) { showToast(t('toast.copyError')); }
    });
  }

  let toastTimer = 0;
  function showToast(message) {
    const toast = $('#toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 2600);
  }

  function setupRequestForm() {
    const form = $('#request-form');
    if (!form) return;
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const subject = (language === 'en' ? 'EcuApp inquiry' : 'Consulta EcuApp') + ' — ' + data.get('product');
      const lines = [
        'Nombre / Name: ' + data.get('name'),
        'Email: ' + data.get('email'),
        'Organización / Organization: ' + (data.get('company') || '-'),
        'Producto / Product: ' + data.get('product'),
        'Entorno / Environment: ' + data.get('environment'),
        'Caso de uso / Use case:',
        data.get('usecase'),
        '',
        'Consentimiento registrado en el borrador / Consent indicated in draft: yes',
        'No incluir credenciales, contraseñas, tokens ni claves privadas / Do not include secrets.'
      ];
      $('#form-feedback').textContent = t('form.feedback');
      const mailto = 'mailto:ecuappmail@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(lines.join('\n'));
      window.location.href = mailto;
    });
  }

  const motionOK = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let revealObserver = null;
  const pointerEnhancedElements = new WeakSet();
  function setupPointerEnhancements(root = document) {
    if (!motionOK || !window.matchMedia('(pointer:fine)').matches) return;
    const cards = root.querySelectorAll('.product-card, .service-card, .case-card, .pricing-card, .status-card');
    cards.forEach(card => {
      if (pointerEnhancedElements.has(card)) return;
      pointerEnhancedElements.add(card);
      card.addEventListener('pointermove', event => {
        if (event.pointerType === 'touch') return;
        const rect = card.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const x = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
        const y = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));
        const tiltX = ((x - .5) * 3.2).toFixed(2);
        const tiltY = ((.5 - y) * 2.4).toFixed(2);
        card.style.setProperty('--spot-x', (x * 100).toFixed(1) + '%');
        card.style.setProperty('--spot-y', (y * 100).toFixed(1) + '%');
        card.style.setProperty('--tilt-x', tiltX + 'deg');
        card.style.setProperty('--tilt-y', tiltY + 'deg');
        card.classList.add('is-pointer-active');
      });
      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--tilt-x', '0deg');
        card.style.setProperty('--tilt-y', '0deg');
        card.classList.remove('is-pointer-active');
      });
      card.addEventListener('blur', () => {
        card.style.setProperty('--tilt-x', '0deg');
        card.style.setProperty('--tilt-y', '0deg');
      }, true);
    });
  }

  function observeReveals() {
    setupPointerEnhancements(document);
    const elements = $('.reveal:not([data-reveal-ready])');
    if (!elements.length) return;
    elements.forEach(element => element.dataset.revealReady = 'true');
    if (!('IntersectionObserver' in window) || !motionOK) {
      elements.forEach(element => element.classList.add('is-visible'));
      return;
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      }, {threshold: 0.12, rootMargin: '0px 0px -35px 0px'});
    }
    elements.forEach(element => revealObserver.observe(element));
  }

  function setupScrollEffects() {
    const header = $('.site-header');
    const progress = $('.scroll-progress');
    const backTop = $('.back-to-top');
    let scheduled = false;
    function update() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progress) progress.style.width = (max > 0 ? Math.min(100, scrollTop / max * 100) : 0) + '%';
      header?.classList.toggle('is-scrolled', scrollTop > 12);
      backTop?.classList.toggle('is-visible', scrollTop > 650);
      const heroVisual = $('.hero-visual');
      if (heroVisual && motionOK && scrollTop < 1000) heroVisual.style.setProperty('--hero-scroll', (-scrollTop * .035).toFixed(2) + 'px');
      scheduled = false;
    }
    window.addEventListener('scroll', () => {
      if (!scheduled) {
        scheduled = true;
        window.requestAnimationFrame(update);
      }
    }, {passive:true});
    update();
    backTop?.addEventListener('click', () => window.scrollTo({top:0, behavior:motionOK ? 'smooth' : 'auto'}));

    const navLinks = $$('.desktop-nav a[href^="#"], .mobile-nav a[href^="#"]');
    const sections = ['ecosistema','soluciones','desarrolladores','estado','casos','precios','contacto'].map(id => document.getElementById(id)).filter(Boolean);
    if ('IntersectionObserver' in window && sections.length) {
      const activeObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          navLinks.forEach(link => {
            const active = link.getAttribute('href') === '#' + entry.target.id;
            if (active) link.setAttribute('aria-current','location');
            else if (link.hasAttribute('aria-current')) link.removeAttribute('aria-current');
          });
        });
      }, {rootMargin:'-25% 0px -65% 0px',threshold:0});
      sections.forEach(section => activeObserver.observe(section));
    }
    if (motionOK && window.matchMedia('(pointer:fine)').matches) {
      const visual = $('.hero-visual');
      visual?.addEventListener('pointermove', event => {
        const rect = visual.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width - .5) * 2;
        const y = ((event.clientY - rect.top) / rect.height - .5) * 2;
        visual.style.setProperty('--pointer-x', (x * 4).toFixed(2) + 'px');
        visual.style.setProperty('--pointer-y', (y * 3).toFixed(2) + 'px');
      });
      visual?.addEventListener('pointerleave', () => {
        visual.style.setProperty('--pointer-x','0px');
        visual.style.setProperty('--pointer-y','0px');
      });
    }
  }


  function setupCredentialRequests() {
    const form = $('#credentials-form');
    if (!form) return;
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const subject = (language === 'en' ? 'Access request' : 'Solicitud de acceso') + ' — ' + data.get('product');
      const body = [
        'Email: ' + data.get('email'),
        'Organization: ' + data.get('organization'),
        'Product: ' + data.get('product'),
        'Requested profile: ' + data.get('role'),
        'Purpose and scope:',
        data.get('purpose'),
        '',
        'Consent: yes',
        'No passwords, API keys, private keys or access tokens are included.'
      ].join('\n');
      $('#credentials-feedback').textContent = t('credentials.feedback');
      const mailto = 'mailto:ecuappmail@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      window.location.href = mailto;
    });
  }

  function setupProductEvents() {
    document.addEventListener('click', event => {
      const button = event.target.closest('[data-open-product]');
      if (button) {
        if (button.tagName === 'A') event.preventDefault();
        openProduct(button.dataset.openProduct);
      }
    });
  }

  function init() {
    language = safeStorageGet('ecuapp-language') || 'es';
    if (!COPY[language]) language = 'es';
    setupTheme();
    setupNavigation();
    setupFilters();
    setupDialogs();
    setupSearch();
    setupCodeExamples();
    setupRequestForm();
    setupCredentialRequests();
    setupProductEvents();
    setupScrollEffects();
    $('#language-select')?.addEventListener('change', event => setLanguage(event.target.value));
    $('#year') && ($('#year').textContent = String(new Date().getFullYear()));
    renderTranslations();
    observeReveals();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();