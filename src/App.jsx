import { useState } from "react";

const lifecycle = [
  { id: "candidato", label: "Candidato", icon: "○" },
  { id: "estudiante", label: "Estudiante", icon: "◐" },
  { id: "egresado", label: "Egresado", icon: "◑" },
  { id: "trabajador", label: "Trabajador", icon: "●" },
];

const phaseColor = {
  candidato: "#00E5CC",
  estudiante: "#A78BFA",
  egresado: "#F97316",
  trabajador: "#FCD34D",
};

const agents = [
  {
    id: "prework",
    code: "AG-01",
    phase: "candidato",
    name: "Prework Agent",
    subtitle: "Diagnóstico técnico + fit profesional",
    icon: "◈",
    color: "#00E5CC",
    bg: "#00E5CC10",
    description:
      "Evalúa al candidato en dos dimensiones antes del bootcamp: nivel técnico real y fit actitudinal con la profesión a la que lleva la vertical. Detecta gaps, recomienda vertical y genera un plan de prework personalizado.",
    subagents: [],
    sections: [
      {
        title: "Test técnico por vertical",
        content: "Nivel de conocimiento previo en la tecnología de la vertical de interés. Adaptativo según las respuestas.",
      },
      {
        title: "Test de fit profesional por vertical",
        items: [
          "Cloud / DevOps → pensamiento sistémico, tolerancia a la ambigüedad, autonomía",
          "Appian → orientación a negocio, tolerancia a la frustración, atención al proceso",
          "Ciberseguridad → atención al detalle, pensamiento adversarial, gestión del riesgo",
          "Data → cálculo computacional, pensamiento analítico, tolerancia a la incertidumbre",
        ],
      },
      {
        title: "Diagnóstico integrado",
        items: [
          "Recomendación de vertical con justificación técnica y actitudinal",
          "Plan de prework personalizado por gap detectado",
          "Alerta si fit actitudinal bajo aunque técnico sea aceptable → revisión humana",
        ],
      },
    ],
    inputs: [
      "Formulario de inscripción (experiencia, motivación, disponibilidad)",
      "Test técnico adaptativo por vertical",
      "Test de competencias de fit profesional por vertical",
    ],
    outputs: [
      "Diagnóstico técnico + actitudinal en Airtable",
      "Email al candidato con plan de prework",
      "Slack al coach con resumen y alertas de fit",
    ],
    tools: ["Typeform", "n8n", "Claude API", "Airtable", "Slack", "Email"],
    flow: [
      "Candidato completa formulario + test técnico + test de fit",
      "n8n recibe webhook de Typeform",
      "Claude evalúa perfil técnico: nivel, gaps, vertical recomendada",
      "Claude evalúa perfil de fit: puntuación por dimensión actitudinal",
      "Cruza ambos perfiles y genera diagnóstico integrado",
      "Guarda en Airtable · Envía email al candidato · Notifica al coach por Slack",
    ],
    value:
      "Reduce el abandono en las primeras semanas al colocar al candidato en la vertical correcta desde el principio, con criterio técnico Y actitudinal. La alerta de fit bajo evita colocaciones que dañan la tasa de certificación.",
    stemdo:
      "Stemdo certifica al 100% de sus stemdoers. Un mal diagnóstico de entrada — especialmente de fit actitudinal — pone en riesgo esa certificación y la promesa de empleabilidad a los clientes.",
    kiro: "Kiro diseña los dos tests diferenciados en Typeform, construye el flujo n8n de dos llamadas a Claude (técnico + fit) y define la lógica de alerta cuando el fit actitudinal es bajo.",
  },
  {
    id: "triage",
    code: "AG-02",
    phase: "estudiante",
    name: "Triage Académico",
    subtitle: "3 capas: feedback alumno · briefing coach · riesgo diario",
    icon: "◉",
    color: "#FF6B6B",
    bg: "#FF6B6B10",
    description:
      "Tres capas de actuación independientes pero complementarias. Un subagente da feedback cualitativo al alumno tras cada entrega. Otro prepara al coach con un briefing de la review grupal. Un tercero monitoriza el riesgo individual cada noche.",
    subagents: [
      "Subagente 1 · Qualy-Review-Feedback → feedback al alumno por entrega",
      "Subagente 2 · Pre-Review Briefing → briefing al coach antes de cada review",
      "Subagente 3 · Daily Risk Monitor → semáforo de riesgo individual nocturno",
    ],
    sections: [
      {
        title: "Subagente 1 · Qualy-Review-Feedback",
        content:
          "Trigger: entrega de ejercicio (webhook). Claude analiza el ejercicio contra los criterios: enfoque utilizado, errores conceptuales, qué está bien y por qué, qué mejorar y cómo. Envía feedback cualitativo al alumno por Slack antes de la review.",
      },
      {
        title: "Subagente 2 · Pre-Review Briefing",
        content:
          "Trigger: noche anterior a cada sesión de review. Claude consolida todos los análisis individuales del grupo y genera para el coach: propuesta de guión para la review grupal, lista de intervenciones individuales imprescindibles (refuerzo o ampliación), materiales sugeridos.",
      },
      {
        title: "Subagente 3 · Daily Risk Monitor",
        content:
          "Trigger: cron job 22:00. Claude evalúa riesgo por alumno (verde / amarillo / rojo) basado en asistencia, entregas y actividad. Actualiza dashboard en Airtable. Si hay rojo: mensaje de apoyo automático al alumno.",
      },
    ],
    inputs: [
      "Ejercicio entregado (texto, código o documento)",
      "Enunciado y criterios de evaluación del ejercicio",
      "Asistencia, entregas completadas vs. pendientes, último acceso",
      "Historial de entregas previas del alumno",
    ],
    outputs: [
      "Feedback cualitativo al alumno tras cada entrega (Slack)",
      "Briefing pre-review para el coach: guión grupal + intervenciones individuales",
      "Dashboard de riesgo diario en Airtable",
      "Mensaje de apoyo automático al alumno en riesgo alto",
    ],
    tools: ["n8n", "Claude API", "Airtable", "LMS / Moodle", "Slack", "Email"],
    flow: [
      "Alumno entrega ejercicio → webhook activa Subagente 1",
      "Claude analiza entrega y envía feedback cualitativo al alumno",
      "Noche anterior a review → Subagente 2 consolida análisis del grupo",
      "Claude genera briefing con guión grupal e intervenciones individuales para el coach",
      "22:00 cada noche → Subagente 3 evalúa riesgo individual",
      "Actualiza dashboard · Alerta al alumno en riesgo si es necesario",
    ],
    value:
      "El alumno recibe feedback inmediato sin esperar a la review. El coach llega preparado con un guión concreto y sabe exactamente a quién reforzar, ampliar o apoyar. El riesgo de abandono se detecta en horas, no en días.",
    stemdo:
      "En un bootcamp intensivo de 8-12 semanas, cada sesión de review es un momento crítico. Si el coach llega sin contexto, pierde tiempo explicando errores que el alumno ya podría haber corregido. Este sistema convierte cada review en una sesión de alto impacto.",
    kiro: "Kiro define los tres triggers independientes en n8n (webhook de entrega, cron pre-review, cron nocturno), los tres prompts diferenciados para Claude y la estructura de datos en Airtable que comparten los tres subagentes.",
  },
  {
    id: "entrevista",
    code: "AG-04",
    phase: "egresado",
    name: "Interview Coach",
    subtitle: "Diagnóstico · entrenamiento por bloques · simulacro adaptativo",
    icon: "◇",
    color: "#F97316",
    bg: "#F9731610",
    description:
      "Prepara al egresado en tres fases: primero detecta sus gaps por bloques de competencia, luego entrena con preguntas de selección múltiple focalizadas, y solo cuando supera los umbrales lanza un simulacro completo personalizado.",
    subagents: [],
    sections: [
      {
        title: "Fase 1 · Diagnóstico de gaps",
        content:
          "Claude cruza el perfil del egresado con los requisitos del puesto e identifica bloques de competencia con gap: técnico por vertical, competencias transversales y conocimiento del sector.",
      },
      {
        title: "Fase 2 · Entrenamiento por bloques",
        content:
          "Banco de preguntas de selección múltiple por bloque con gap. El egresado responde por Typeform. Claude evalúa bloque a bloque, da feedback explicativo por pregunta fallida y recomienda recursos si < 60%. Itera hasta que todos los bloques superan el umbral mínimo.",
      },
      {
        title: "Fase 3 · Simulacro adaptativo",
        content:
          "Solo se desbloquea cuando todos los bloques superan el umbral. El simulacro pesa más las preguntas en los bloques con más dificultad previa. Claude evalúa cada respuesta con feedback detallado. Si ≥ 80%: notifica al recruiter. Si < 80%: nuevo ciclo de entrenamiento focalizado.",
      },
    ],
    inputs: [
      "Perfil del egresado (vertical, certificaciones, skills en Airtable)",
      "Descripción del puesto objetivo y empresa cliente",
      "Historial de simulaciones anteriores si existe",
    ],
    outputs: [
      "Banco de preguntas de entrenamiento por bloque con feedback",
      "Puntuación por bloque de competencia",
      "Simulacro completo personalizado con feedback por respuesta",
      "Indicador de preparación global (0-100%)",
      "Notificación al recruiter de Stemdo cuando ≥ 80%",
    ],
    tools: ["Typeform", "n8n", "Claude API", "Airtable", "Slack"],
    flow: [
      "Egresado indica puesto objetivo por formulario",
      "Fase 1: Claude detecta gaps por bloques de competencia",
      "Fase 2: genera banco de preguntas por bloque · egresado entrena",
      "Claude evalúa bloque a bloque e itera hasta superar umbrales",
      "Fase 3: simulacro adaptativo desbloqueado · Claude evalúa respuestas",
      "Si ≥ 80%: notifica al recruiter · Si < 80%: nuevo ciclo focalizado",
    ],
    value:
      "El egresado no llega al simulacro sin preparación — llega habiendo trabajado sus gaps específicos. El recruiter recibe una señal objetiva de cuándo el candidato está listo, sin tener que evaluarlo manualmente.",
    stemdo:
      "La tasa de colocación es la métrica más visible de Stemdo ante clientes y regiones. Un egresado que llega a la entrevista con sus gaps trabajados tiene una tasa de éxito significativamente mayor. El recruiter puede gestionar más candidatos sin perder calidad en la selección.",
    kiro: "Kiro define la lógica de desbloqueo por fases en n8n (Fase 2 → Fase 3 solo si todos los bloques ≥ 60%), los prompts diferenciados por tipo de pregunta y la estructura del banco de preguntas en Airtable por vertical y bloque de competencia.",
  },
  {
    id: "staffing",
    code: "AG-05",
    phase: "trabajador",
    name: "Staffing Monitor",
    subtitle: "Supervisión del stemdoer en cliente",
    icon: "⬡",
    color: "#FCD34D",
    bg: "#FCD34D10",
    description:
      "Una vez el stemdoer trabaja en remoto desde la oficina de Stemdo para un cliente, este agente da al supervisor de staffing visibilidad continua cruzando señales del stemdoer, del cliente y del sistema.",
    subagents: [],
    sections: [
      {
        title: "Check-in semanal al stemdoer",
        content:
          "Cada lunes n8n envía un formulario corto por Slack al stemdoer: carga de trabajo, bloqueos, estado general. Respuesta en menos de 2 minutos.",
      },
      {
        title: "Feedback mensual del cliente",
        content:
          "Formulario mensual por email al responsable del cliente: satisfacción con el stemdoer, áreas de mejora, valoración del proyecto. Claude extrae señales de riesgo.",
      },
      {
        title: "Cruce de señales y escalado",
        content:
          "Claude cruza las tres fuentes (stemdoer + cliente + actividad) y detecta desajustes. Si hay riesgo de conflicto, estancamiento o desmotivación: escala inmediatamente al supervisor de staffing.",
      },
    ],
    inputs: [
      "Check-in semanal del stemdoer (carga, bloqueos, estado emocional)",
      "Feedback mensual del cliente sobre el stemdoer",
      "Actividad y entregas registradas en Airtable",
      "Nuevas certificaciones o formaciones completadas",
    ],
    outputs: [
      "Dashboard de estado semanal por stemdoer para el supervisor",
      "Alerta inmediata si hay riesgo de conflicto con el cliente",
      "Alerta si el stemdoer está estancado en su progresión",
      "Reporte mensual de impacto para el cliente",
    ],
    tools: ["Slack", "Typeform", "n8n", "Claude API", "Airtable", "Email"],
    flow: [
      "Lunes 9:00 → n8n envía check-in al stemdoer por Slack",
      "Agente recopila respuestas del stemdoer + feedback del cliente + actividad",
      "Claude cruza las tres fuentes y detecta desajustes",
      "Genera dashboard de estado para el supervisor de staffing",
      "Si hay riesgo: escala por Slack al supervisor de forma inmediata",
      "Fin de mes: genera reporte de impacto para el cliente",
    ],
    value:
      "El supervisor de staffing gestiona más stemdoers sin perder visibilidad sobre ninguno. Los problemas con clientes se detectan antes de que se conviertan en bajas. El modelo de Stemdo escala sin añadir supervisores proporcionalmente.",
    stemdo:
      "Los stemdoers trabajan en remoto desde la oficina de Stemdo para clientes del IBEX y consultoras globales. Sin un sistema de supervisión que escale, el modelo no puede crecer sin añadir supervisores de forma proporcional.",
    kiro: "Kiro define los dos ciclos de recogida de datos (semanal stemdoer + mensual cliente), el prompt de cruce de señales y la lógica de escalado diferenciada por tipo de riesgo (conflicto vs. estancamiento vs. desmotivación).",
  },
];

export default function StemdoAgents() {
  const [active, setActive] = useState("prework");
  const [tab, setTab] = useState("overview");
  const agent = agents.find((a) => a.id === active);

  const tabList = [
    ["overview", "Qué hace"],
    ["flujo", "Flujo"],
    ["kiro", "Kiro vs Claude"],
    ["stemdo", "Por qué Stemdo"],
  ];

  return (
    <div style={{ fontFamily: "'DM Mono','Fira Code',monospace", background: "#080810", minHeight: "100vh", color: "#E2E8F0" }}>

      {/* Header */}
      <div style={{ background: "#0C0C18", borderBottom: "1px solid #1a1a2e", padding: "16px 22px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 30, height: 30, background: "#00E5CC12", border: "1px solid #00E5CC30", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", color: "#00E5CC", fontSize: 15 }}>⬡</div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#00E5CC", letterSpacing: "0.14em", textTransform: "uppercase" }}>Stemdo · Doers School</div>
            <div style={{ fontSize: 9, color: "#374151", letterSpacing: "0.07em" }}>Sistema de Agentes Académicos · v2.0</div>
          </div>
        </div>
        <div style={{ fontSize: 9, color: "#1f2937" }}>Kiro + Claude API + n8n</div>
      </div>

      {/* Lifecycle bar */}
      <div style={{ background: "#0A0A14", borderBottom: "1px solid #1a1a2e", padding: "10px 22px", display: "flex", alignItems: "center" }}>
        {lifecycle.map((lc, idx) => {
          const isActive = agent.phase === lc.id;
          const c = phaseColor[lc.id];
          return (
            <div key={lc.id} style={{ display: "flex", alignItems: "center", flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: isActive ? `${c}20` : "transparent", border: `1px solid ${isActive ? c : "#1a1a2e"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: isActive ? c : "#374151", transition: "all 0.2s" }}>{lc.icon}</div>
                <div style={{ fontSize: 9, color: isActive ? c : "#374151", letterSpacing: "0.1em", textTransform: "uppercase", transition: "all 0.2s" }}>{lc.label}</div>
              </div>
              {idx < lifecycle.length - 1 && <div style={{ flex: 1, height: 1, background: "#1a1a2e", margin: "0 8px" }} />}
            </div>
          );
        })}
      </div>

      {/* Agent selector */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", borderBottom: "1px solid #1a1a2e" }}>
        {agents.map((a) => (
          <button key={a.id} onClick={() => { setActive(a.id); setTab("overview"); }}
            style={{ background: active === a.id ? a.bg : "transparent", border: "none", borderBottom: `2px solid ${active === a.id ? a.color : "transparent"}`, borderRight: "1px solid #1a1a2e", padding: "10px 8px", cursor: "pointer", textAlign: "left", transition: "all 0.15s" }}>
            <div style={{ fontSize: 14, color: active === a.id ? a.color : "#374151", marginBottom: 2 }}>{a.icon}</div>
            <div style={{ fontSize: 8, color: active === a.id ? a.color : "#374151", letterSpacing: "0.1em", marginBottom: 2 }}>{a.code}</div>
            <div style={{ fontSize: 9, fontWeight: 700, color: active === a.id ? "#F1F5F9" : "#4B5563", lineHeight: 1.3 }}>{a.name}</div>
            <div style={{ fontSize: 8, color: active === a.id ? `${a.color}99` : "#374151", lineHeight: 1.3, marginTop: 2 }}>{a.subtitle}</div>
          </button>
        ))}
      </div>

      <div style={{ padding: "16px 20px" }}>

        {/* Agent header */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 18, color: agent.color }}>{agent.icon}</span>
            <span style={{ fontSize: 15, fontWeight: 700, color: "#F1F5F9" }}>{agent.name}</span>
            <span style={{ fontSize: 8, background: agent.bg, color: agent.color, border: `1px solid ${agent.color}30`, borderRadius: 4, padding: "2px 7px", letterSpacing: "0.1em", textTransform: "uppercase" }}>Fase: {agent.phase}</span>
          </div>
          <p style={{ fontSize: 11, color: "#94A3B8", lineHeight: 1.75, margin: 0 }}>{agent.description}</p>
          {agent.subagents.length > 0 && (
            <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 4 }}>
              {agent.subagents.map((s, i) => (
                <div key={i} style={{ fontSize: 9, color: agent.color, background: agent.bg, border: `1px solid ${agent.color}25`, borderRadius: 4, padding: "3px 8px", letterSpacing: "0.06em" }}>{s}</div>
              ))}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid #1a1a2e", marginBottom: 12 }}>
          {tabList.map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)}
              style={{ background: "none", border: "none", borderBottom: `1px solid ${tab === key ? agent.color : "transparent"}`, color: tab === key ? agent.color : "#4B5563", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", padding: "5px 11px 7px", cursor: "pointer", marginBottom: -1 }}>
              {label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === "overview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {agent.sections.map((s, idx) => (
              <div key={idx} style={{ background: "#0C0C18", border: "1px solid #1a1a2e", borderRadius: 8, padding: 14 }}>
                <div style={{ fontSize: 9, color: agent.color, letterSpacing: "0.1em", marginBottom: 8, textTransform: "uppercase" }}>{s.title}</div>
                {s.content && <div style={{ fontSize: 11, color: "#94A3B8", lineHeight: 1.7 }}>{s.content}</div>}
                {s.items && s.items.map((item, i) => (
                  <div key={i} style={{ fontSize: 10, color: "#94A3B8", padding: "3px 0", borderBottom: i < s.items.length - 1 ? "1px solid #13131f" : "none", lineHeight: 1.5 }}>· {item}</div>
                ))}
              </div>
            ))}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div style={{ background: "#0C0C18", border: "1px solid #1a1a2e", borderRadius: 8, padding: 12 }}>
                <div style={{ fontSize: 8, color: "#374151", letterSpacing: "0.12em", marginBottom: 8, textTransform: "uppercase" }}>→ Inputs</div>
                {agent.inputs.map((i, idx) => (
                  <div key={idx} style={{ fontSize: 10, color: "#94A3B8", padding: "3px 0", borderBottom: idx < agent.inputs.length - 1 ? "1px solid #13131f" : "none", lineHeight: 1.5 }}>{i}</div>
                ))}
              </div>
              <div style={{ background: "#0C0C18", border: "1px solid #1a1a2e", borderRadius: 8, padding: 12 }}>
                <div style={{ fontSize: 8, color: "#374151", letterSpacing: "0.12em", marginBottom: 8, textTransform: "uppercase" }}>← Outputs</div>
                {agent.outputs.map((o, idx) => (
                  <div key={idx} style={{ fontSize: 10, color: "#94A3B8", padding: "3px 0", borderBottom: idx < agent.outputs.length - 1 ? "1px solid #13131f" : "none", lineHeight: 1.5 }}>{o}</div>
                ))}
              </div>
            </div>
            <div style={{ background: agent.bg, border: `1px solid ${agent.color}25`, borderRadius: 8, padding: 12, display: "flex", gap: 10 }}>
              <span style={{ color: agent.color, fontSize: 13, marginTop: 1, flexShrink: 0 }}>◆</span>
              <div>
                <div style={{ fontSize: 8, color: agent.color, letterSpacing: "0.12em", marginBottom: 4, textTransform: "uppercase" }}>Valor que aporta</div>
                <div style={{ fontSize: 11, color: "#CBD5E1", lineHeight: 1.7 }}>{agent.value}</div>
              </div>
            </div>
          </div>
        )}

        {/* Flujo */}
        {tab === "flujo" && (
          <div style={{ background: "#0C0C18", border: "1px solid #1a1a2e", borderRadius: 8, padding: 14 }}>
            <div style={{ fontSize: 8, color: "#374151", letterSpacing: "0.12em", marginBottom: 14, textTransform: "uppercase" }}>Flujo de ejecución asíncrona</div>
            {agent.flow.map((step, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: agent.bg, border: `1px solid ${agent.color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: agent.color, fontWeight: 700 }}>{idx + 1}</div>
                  {idx < agent.flow.length - 1 && <div style={{ width: 1, height: 20, background: "#1a1a2e" }} />}
                </div>
                <div style={{ fontSize: 11, color: "#94A3B8", paddingTop: 4, lineHeight: 1.5 }}>{step}</div>
              </div>
            ))}
            <div style={{ marginTop: 14, display: "flex", gap: 6, flexWrap: "wrap" }}>
              {["Asíncrono", "Event-driven", "Sin intervención manual", "Escalable"].map(tag => (
                <span key={tag} style={{ fontSize: 9, background: agent.bg, color: agent.color, border: `1px solid ${agent.color}25`, borderRadius: 4, padding: "2px 8px", letterSpacing: "0.08em" }}>{tag}</span>
              ))}
            </div>
          </div>
        )}

        {/* Kiro vs Claude */}
        {tab === "kiro" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div style={{ background: "#00E5CC10", border: "1px solid #00E5CC25", borderRadius: 8, padding: 14 }}>
                <div style={{ fontSize: 8, color: "#00E5CC", letterSpacing: "0.12em", marginBottom: 8, textTransform: "uppercase" }}>Kiro · Para construir</div>
                <div style={{ fontSize: 10, color: "#94A3B8", lineHeight: 1.7 }}>{agent.kiro}</div>
              </div>
              <div style={{ background: "#A78BFA10", border: "1px solid #A78BFA25", borderRadius: 8, padding: 14 }}>
                <div style={{ fontSize: 8, color: "#A78BFA", letterSpacing: "0.12em", marginBottom: 8, textTransform: "uppercase" }}>Claude API · Para ejecutar</div>
                <div style={{ fontSize: 10, color: "#94A3B8", lineHeight: 1.7 }}>En producción, Claude razona sobre los datos del agente en tiempo real: analiza perfiles, clasifica riesgos, genera feedback personalizado y toma decisiones de escalado.</div>
              </div>
            </div>
            <div style={{ background: "#0C0C18", border: "1px solid #1a1a2e", borderRadius: 8, padding: 14 }}>
              <div style={{ fontSize: 8, color: "#374151", letterSpacing: "0.12em", marginBottom: 10, textTransform: "uppercase" }}>Stack del agente</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {agent.tools.map(t => (
                  <span key={t} style={{ fontSize: 10, background: "#13131f", color: "#CBD5E1", border: "1px solid #1a1a2e", borderRadius: 6, padding: "4px 10px" }}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Por qué Stemdo */}
        {tab === "stemdo" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ background: agent.bg, border: `1px solid ${agent.color}30`, borderRadius: 8, padding: 14 }}>
              <div style={{ fontSize: 8, color: agent.color, letterSpacing: "0.12em", marginBottom: 8, textTransform: "uppercase" }}>Conexión con el modelo Stemdo</div>
              <div style={{ fontSize: 12, color: "#CBD5E1", lineHeight: 1.8 }}>{agent.stemdo}</div>
            </div>
            <div style={{ background: "#0C0C18", border: "1px solid #1a1a2e", borderRadius: 8, padding: 14 }}>
              <div style={{ fontSize: 8, color: "#374151", letterSpacing: "0.12em", marginBottom: 10, textTransform: "uppercase" }}>Mapa del sistema · 4 agentes activos</div>
              {[
                ["Candidato", "AG-01 Prework · diagnóstico técnico + fit profesional", "#00E5CC"],
                ["Estudiante", "AG-02 Triage · 3 subagentes: feedback alumno + briefing coach + riesgo", "#A78BFA"],
                ["Egresado", "AG-04 Interview Coach · diagnóstico + entrenamiento + simulacro", "#F97316"],
                ["Trabajador", "AG-05 Staffing Monitor · supervisión en cliente", "#FCD34D"],
              ].map(([fase, desc, col], idx) => (
                <div key={idx} style={{ display: "flex", gap: 10, padding: "6px 0", borderBottom: "1px solid #13131f", alignItems: "flex-start" }}>
                  <div style={{ fontSize: 8, color: col, width: 70, flexShrink: 0, paddingTop: 1, letterSpacing: "0.08em" }}>{fase}</div>
                  <div style={{ fontSize: 10, color: "#94A3B8", lineHeight: 1.5 }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: "10px 20px", borderTop: "1px solid #1a1a2e", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 8, color: "#1f2937", letterSpacing: "0.07em" }}>candidato → estudiante → egresado → trabajador · AG-03 Skills Tracker en siguiente fase</div>
        <div style={{ display: "flex", gap: 5 }}>
          {agents.map(a => (
            <div key={a.id} onClick={() => setActive(a.id)} style={{ width: 5, height: 5, borderRadius: "50%", background: active === a.id ? a.color : "#1a1a2e", cursor: "pointer" }} />
          ))}
        </div>
      </div>
    </div>
  );
}
