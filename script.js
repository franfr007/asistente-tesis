// ========================================
// ASISTENTE DE TESIS FILOSÓFICA - UCALP
// Versión con API de Claude
// ========================================

// Sistema de prompts especializados
const SYSTEM_PROMPTS = {
    orientacion: `Sos un experto en metodología de investigación filosófica y dirección de tesis de licenciatura en filosofía. 
Ayudás a estudiantes a:
- Delimitar temas de investigación
- Desarrollar preguntas filosóficas rigurosas
- Estructurar marcos teóricos
- Aplicar metodologías filosóficas apropiadas
- Resolver dudas sobre el proceso de investigación

Proporcionás respuestas claras, académicas y orientadas a la práctica. Usás ejemplos cuando es apropiado y mantenés un tono profesional pero accesible. Usá el voseo argentino (vos en lugar de tú).`,

    generador: {
        introduccion: `Sos un experto en redacción de tesis filosóficas. Generá una introducción académica que incluya:
- Presentación clara del tema
- Contextualización de la problemática
- Justificación de la relevancia del estudio
- Objetivos preliminares
- Breve descripción de la estructura

Usá lenguaje académico formal, citas cuando sea pertinente, y mantené la coherencia argumentativa. Usá el voseo argentino.`,

        planteamiento: `Redactá un planteamiento del problema filosófico que:
- Identifique claramente la cuestión filosófica
- Muestre la relevancia teórica y/o práctica
- Establezca los límites del problema
- Formule la pregunta de investigación
- Indique posibles hipótesis o líneas de respuesta

Sé preciso, riguroso y usá terminología filosófica apropiada. Usá el voseo argentino.`,

        justificacion: `Elaborá una justificación académica que explique:
- La relevancia filosófica del tema
- La pertinencia actual del problema
- Las lagunas en la literatura existente
- El aporte potencial de la investigación
- La viabilidad del estudio

Argumentá de manera convincente pero equilibrada. Usá el voseo argentino.`,

        objetivos: `Formulá objetivos de investigación (general y específicos) que sean:
- Claros y precisos
- Alcanzables en el marco de una tesis de licenciatura
- Coherentes con el tema propuesto
- Verificables o evaluables
- Relevantes filosóficamente

Usá verbos de acción apropiados para investigación filosófica. Usá el voseo argentino.`,

        marco_teorico: `Desarrollá un marco teórico que:
- Presente los conceptos fundamentales
- Revise autores y corrientes relevantes
- Establezca el posicionamiento teórico
- Muestre el diálogo entre diferentes perspectivas
- Fundamente teóricamente la investigación

Incluí referencias a autores clásicos y contemporáneos pertinentes. Usá el voseo argentino.`,

        estado_cuestion: `Elaborá un estado de la cuestión que:
- Presente las principales posiciones sobre el tema
- Analice los debates actuales
- Identifique puntos de consenso y controversia
- Muestre la evolución del pensamiento sobre el tema
- Justifique la necesidad de tu investigación

Demostrá conocimiento profundo de la bibliografía especializada. Usá el voseo argentino.`,

        analisis: `Realizá un análisis filosófico que:
- Examine críticamente los conceptos o argumentos
- Identifique supuestos y consecuencias
- Evalúe la coherencia lógica
- Considere objeciones y contraargumentos
- Desarrolle una interpretación fundamentada

Mantené rigor analítico y claridad argumentativa. Usá el voseo argentino.`,

        argumento: `Desarrollá un argumento filosófico que:
- Presente premisas claras y explícitas
- Siga una estructura lógica coherente
- Anticipe y responda a objeciones
- Fundamente cada afirmación
- Llegue a conclusiones bien justificadas

Usá formato argumentativo riguroso y evitá falacias. Usá el voseo argentino.`,

        conclusion: `Redactá una conclusión que:
- Sintetice los principales hallazgos
- Responda a la pregunta de investigación
- Muestre las aportaciones del trabajo
- Reconozca limitaciones del estudio
- Sugiera líneas futuras de investigación

Cerrá el trabajo de manera coherente y satisfactoria. Usá el voseo argentino.`,

        resumen: `Elaborá un resumen académico (abstract) que:
- Presente el tema y problema en 1-2 frases
- Indique la metodología empleada
- Resuma los principales argumentos o hallazgos
- Mencione las conclusiones principales
- Se mantenga en 150-300 palabras
- Sea comprensible para lectores no especializados en el tema específico

Usá lenguaje claro, preciso y académico. Usá el voseo argentino.`
    },

    revisor: `Sos un revisor académico especializado en filosofía. Analizá el texto proporcionado considerando:

ESTRUCTURA Y COHERENCIA:
- Claridad en la exposición de ideas
- Organización lógica del texto
- Transiciones entre párrafos y secciones
- Coherencia argumentativa

CALIDAD ARGUMENTATIVA:
- Solidez de los argumentos
- Fundamentación de afirmaciones
- Tratamiento de objeciones
- Rigor lógico

ESTILO ACADÉMICO:
- Uso apropiado de terminología filosófica
- Claridad y precisión lingüística
- Tono académico formal
- Evitación de ambigüedades

USO DE CITAS Y REFERENCIAS:
- Incorporación apropiada de autores
- Balance entre voz propia y citas
- Diálogo con la literatura filosófica

Proporcioná un análisis constructivo con sugerencias específicas de mejora. Usá el voseo argentino.`
};

// Estado de la aplicación
let conversationHistory = {
    orientacion: []
};

// Event Listeners principales
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    initializeAccordions();
    initializeOrientationChat();
    initializeGenerator();
    initializeReviewer();
    initializeProject();
});

// ========================================
// FUNCIONALIDAD PRINCIPAL: API DE CLAUDE
// ========================================

/**
 * Función principal para llamar a la API de Claude
 * Esta función usa la API de Anthropic disponible en artifacts
 */
async function callClaudeAPI(systemPrompt, conversationHistory) {
    try {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "claude-sonnet-4-20250514",
                max_tokens: 4000,
                system: systemPrompt,
                messages: conversationHistory
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        return data.content[0].text;
    } catch (error) {
        console.error('Error calling Claude API:', error);
        throw error;
    }
}

// ========================================
// SISTEMA DE PESTAÑAS
// ========================================

function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            
            // Remover active de todos
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Activar el seleccionado
            button.classList.add('active');
            document.getElementById(tabName).classList.add('active');
        });
    });
}

// ========================================
// SISTEMA DE ACORDEONES
// ========================================

function initializeAccordions() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const isActive = header.classList.contains('active');
            
            // Cerrar todos los acordeones
            document.querySelectorAll('.accordion-header').forEach(h => {
                h.classList.remove('active');
                h.nextElementSibling.classList.remove('active');
            });
            
            // Si no estaba activo, abrirlo
            if (!isActive) {
                header.classList.add('active');
                content.classList.add('active');
            }
        });
    });
}

// ========================================
// CHAT DE ORIENTACIÓN
// ========================================

function initializeOrientationChat() {
    const sendButton = document.getElementById('sendOrientation');
    const input = document.getElementById('orientationInput');
    
    sendButton.addEventListener('click', () => sendOrientationMessage());
    
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendOrientationMessage();
        }
    });
}

async function sendOrientationMessage() {
    const input = document.getElementById('orientationInput');
    const chatBox = document.getElementById('chatOrientation');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Agregar mensaje del usuario
    appendMessage(chatBox, 'user', message);
    input.value = '';
    
    // Preparar historial de conversación
    conversationHistory.orientacion.push({
        role: 'user',
        content: message
    });
    
    // Mostrar indicador de carga
    const loadingId = 'loading-' + Date.now();
    appendMessage(chatBox, 'loading', 'Pensando...', loadingId);
    
    try {
        // Llamar a Claude API
        const response = await callClaudeAPI(
            SYSTEM_PROMPTS.orientacion,
            conversationHistory.orientacion
        );
        
        // Remover indicador de carga
        const loadingElement = document.getElementById(loadingId);
        if (loadingElement) loadingElement.remove();
        
        // Agregar respuesta del asistente
        appendMessage(chatBox, 'assistant', response);
        
        // Guardar respuesta en el historial
        conversationHistory.orientacion.push({
            role: 'assistant',
            content: response
        });
        
    } catch (error) {
        const loadingElement = document.getElementById(loadingId);
        if (loadingElement) loadingElement.remove();
        
        appendMessage(chatBox, 'error', 
            'Lo siento, hubo un error al procesar tu consulta. Por favor, intentá nuevamente.');
        console.error('Error:', error);
    }
}

function appendMessage(container, type, content, id = null) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${type}`;
    if (id) messageDiv.id = id;
    
    const label = document.createElement('div');
    label.className = 'chat-message-label';
    
    if (type === 'user') {
        label.textContent = 'Vos:';
    } else if (type === 'assistant') {
        label.textContent = 'Asistente:';
    } else if (type === 'loading') {
        label.textContent = 'Asistente:';
        messageDiv.classList.add('assistant');
    } else if (type === 'error') {
        label.textContent = 'Error:';
        messageDiv.classList.add('assistant');
    }
    
    const contentDiv = document.createElement('div');
    contentDiv.textContent = content;
    
    messageDiv.appendChild(label);
    messageDiv.appendChild(contentDiv);
    container.appendChild(messageDiv);
    
    // Scroll al final
    container.scrollTop = container.scrollHeight;
}

// ========================================
// GENERADOR DE CONTENIDO
// ========================================

function initializeGenerator() {
    const generateButton = document.getElementById('generateContent');
    const copyButton = document.getElementById('copyContent');
    
    if (generateButton) {
        generateButton.addEventListener('click', generateContent);
    }
    
    if (copyButton) {
        copyButton.addEventListener('click', copyGeneratedContent);
    }
}

async function generateContent() {
    const contentType = document.getElementById('contentType').value;
    const topic = document.getElementById('thesisTopic').value.trim();
    const context = document.getElementById('specificContext').value.trim();
    
    if (!contentType) {
        alert('Por favor, seleccioná el tipo de contenido a generar.');
        return;
    }
    
    if (!topic) {
        alert('Por favor, ingresá el tema de tu tesis.');
        return;
    }
    
    // Construir el prompt
    const systemPrompt = SYSTEM_PROMPTS.generador[contentType] || SYSTEM_PROMPTS.generador.introduccion;
    const userPrompt = `Tema de la tesis: ${topic}\n\n${context ? 'Contexto adicional: ' + context : ''}`;
    
    // Mostrar loading
    const outputBox = document.getElementById('generatedContent');
    const loadingDiv = document.getElementById('loadingGenerator');
    const copyButton = document.getElementById('copyContent');
    
    outputBox.innerHTML = '';
    loadingDiv.style.display = 'flex';
    copyButton.style.display = 'none';
    
    try {
        const response = await callClaudeAPI(systemPrompt, [
            {
                role: 'user',
                content: userPrompt
            }
        ]);
        
        loadingDiv.style.display = 'none';
        outputBox.innerHTML = `<pre style="white-space: pre-wrap; font-family: inherit;">${escapeHtml(response)}</pre>`;
        copyButton.style.display = 'inline-flex';
        
    } catch (error) {
        loadingDiv.style.display = 'none';
        outputBox.innerHTML = '<p class="error-text">Error al generar contenido. Por favor, intentá nuevamente.</p>';
        console.error('Error:', error);
    }
}

function copyGeneratedContent() {
    const outputBox = document.getElementById('generatedContent');
    const text = outputBox.textContent;
    
    navigator.clipboard.writeText(text).then(() => {
        const button = document.getElementById('copyContent');
        const originalText = button.textContent;
        button.textContent = '✓ Copiado';
        
        setTimeout(() => {
            button.textContent = originalText;
        }, 2000);
    }).catch(err => {
        console.error('Error al copiar:', err);
        alert('No se pudo copiar el texto. Por favor, copialo manualmente.');
    });
}

// ========================================
// REVISOR DE TEXTO
// ========================================

function initializeReviewer() {
    const reviewButton = document.getElementById('reviewText');
    
    if (reviewButton) {
        reviewButton.addEventListener('click', reviewText);
    }
}

async function reviewText() {
    const textToReview = document.getElementById('textToReview').value.trim();
    
    if (!textToReview) {
        alert('Por favor, ingresá el texto que deseas revisar.');
        return;
    }
    
    // Obtener opciones seleccionadas
    const checkStructure = document.getElementById('checkStructure').checked;
    const checkArguments = document.getElementById('checkArguments').checked;
    const checkStyle = document.getElementById('checkStyle').checked;
    const checkCitations = document.getElementById('checkCitations').checked;
    
    let reviewFocus = '';
    if (checkStructure) reviewFocus += '- Estructura y coherencia\n';
    if (checkArguments) reviewFocus += '- Calidad argumentativa\n';
    if (checkStyle) reviewFocus += '- Estilo académico\n';
    if (checkCitations) reviewFocus += '- Uso de citas y referencias\n';
    
    const prompt = `Por favor, revisá el siguiente texto filosófico enfocándote en:\n${reviewFocus}\n\nTexto a revisar:\n\n${textToReview}`;
    
    // Mostrar loading
    const resultsDiv = document.getElementById('reviewResults');
    const loadingDiv = document.getElementById('loadingReviewer');
    
    resultsDiv.innerHTML = '';
    loadingDiv.style.display = 'flex';
    
    try {
        const response = await callClaudeAPI(SYSTEM_PROMPTS.revisor, [
            {
                role: 'user',
                content: prompt
            }
        ]);
        
        loadingDiv.style.display = 'none';
        resultsDiv.innerHTML = `<div style="white-space: pre-wrap;">${escapeHtml(response)}</div>`;
        
    } catch (error) {
        loadingDiv.style.display = 'none';
        resultsDiv.innerHTML = '<p class="error-text">Error al revisar el texto. Por favor, intentá nuevamente.</p>';
        console.error('Error:', error);
    }
}

// ========================================
// PROYECTO DE TESIS
// ========================================

function initializeProject() {
    // Contadores de palabras
    setupWordCounters();
    
    // Contadores de referencias
    setupBibliographyCounters();
    
    // Botones de guardar y cargar
    document.getElementById('saveDraft')?.addEventListener('click', saveDraft);
    document.getElementById('saveDraftBottom')?.addEventListener('click', saveDraft);
    document.getElementById('loadDraft')?.addEventListener('click', loadDraft);
    document.getElementById('clearProject')?.addEventListener('click', clearProject);
    
    // Botones de generar documento
    document.getElementById('generateDocument')?.addEventListener('click', generateDocument);
    document.getElementById('generateDocumentBottom')?.addEventListener('click', generateDocument);
    
    // Validación
    document.getElementById('validateProject')?.addEventListener('click', validateProject);
    document.getElementById('validateBibliography')?.addEventListener('click', validateBibliography);
    
    // Botones de ayuda contextual
    initializeHelpButtons();
    
    // Botones de asistencia IA
    initializeAIAssistButtons();
}

function setupWordCounters() {
    const fields = [
        { id: 'problemStatement', counter: 'problemCount' },
        { id: 'justification', counter: 'justificationCount' },
        { id: 'theoreticalBackground', counter: 'backgroundCount' },
        { id: 'methodology', counter: 'methodologyCount' }
    ];
    
    fields.forEach(field => {
        const textarea = document.getElementById(field.id);
        const counter = document.getElementById(field.counter);
        
        if (textarea && counter) {
            textarea.addEventListener('input', () => {
                const wordCount = countWords(textarea.value);
                counter.textContent = wordCount;
            });
        }
    });
}

function setupBibliographyCounters() {
    const primaryBib = document.getElementById('primaryBibliography');
    const secondaryBib = document.getElementById('secondaryBibliography');
    
    if (primaryBib) {
        primaryBib.addEventListener('input', updateBibliographyStats);
    }
    
    if (secondaryBib) {
        secondaryBib.addEventListener('input', updateBibliographyStats);
    }
}

function updateBibliographyStats() {
    const primaryBib = document.getElementById('primaryBibliography').value;
    const secondaryBib = document.getElementById('secondaryBibliography').value;
    
    const primaryCount = countReferences(primaryBib);
    const secondaryCount = countReferences(secondaryBib);
    const totalCount = primaryCount + secondaryCount;
    
    document.getElementById('primaryRefCount').textContent = primaryCount;
    document.getElementById('secondaryRefCount').textContent = secondaryCount;
    document.getElementById('totalRefs').textContent = totalCount;
    
    // Actualizar color del stat box
    const minRefsBox = document.getElementById('minRefsBox');
    if (totalCount >= 15) {
        minRefsBox.classList.add('complete');
    } else {
        minRefsBox.classList.remove('complete');
    }
}

function countWords(text) {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

function countReferences(text) {
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    return lines.length;
}

function saveDraft() {
    const projectData = collectProjectData();
    localStorage.setItem('thesisProjectDraft', JSON.stringify(projectData));
    alert('✓ Borrador guardado exitosamente');
}

function loadDraft() {
    const savedData = localStorage.getItem('thesisProjectDraft');
    
    if (!savedData) {
        alert('No hay ningún borrador guardado.');
        return;
    }
    
    if (!confirm('¿Querés cargar el borrador guardado? Esto reemplazará el contenido actual.')) {
        return;
    }
    
    const projectData = JSON.parse(savedData);
    populateProjectForm(projectData);
    alert('✓ Borrador cargado exitosamente');
}

function clearProject() {
    if (!confirm('¿Estás seguro de que querés limpiar todo el formulario? Esta acción no se puede deshacer.')) {
        return;
    }
    
    document.querySelectorAll('#proyecto input, #proyecto textarea, #proyecto select').forEach(field => {
        field.value = '';
    });
    
    alert('✓ Formulario limpiado');
}

function collectProjectData() {
    const fields = [
        'studentName', 'studentEmail', 'thesisTitle', 'thesisSubtitle',
        'thematicArea', 'philosophicalTradition', 'problemStatement',
        'researchQuestion', 'secondaryQuestions', 'justification',
        'generalObjective', 'specificObjectives', 'mainAuthors',
        'keyConcepts', 'theoreticalBackground', 'methodology',
        'primarySources', 'secondarySources', 'thesisStructure',
        'timeline', 'primaryBibliography', 'secondaryBibliography'
    ];
    
    const data = {};
    fields.forEach(fieldId => {
        const element = document.getElementById(fieldId);
        if (element) {
            data[fieldId] = element.value;
        }
    });
    
    return data;
}

function populateProjectForm(data) {
    Object.keys(data).forEach(fieldId => {
        const element = document.getElementById(fieldId);
        if (element) {
            element.value = data[fieldId];
        }
    });
    
    // Actualizar contadores
    updateBibliographyStats();
}

function validateProject() {
    const requiredFields = [
        { id: 'studentName', label: 'Nombre del estudiante' },
        { id: 'thesisTitle', label: 'Título de la tesis' },
        { id: 'thematicArea', label: 'Área temática' },
        { id: 'problemStatement', label: 'Planteamiento del problema' },
        { id: 'researchQuestion', label: 'Pregunta de investigación' },
        { id: 'justification', label: 'Justificación' },
        { id: 'generalObjective', label: 'Objetivo general' },
        { id: 'specificObjectives', label: 'Objetivos específicos' },
        { id: 'mainAuthors', label: 'Autores principales' },
        { id: 'keyConcepts', label: 'Conceptos clave' },
        { id: 'methodology', label: 'Metodología' },
        { id: 'primarySources', label: 'Fuentes primarias' },
        { id: 'thesisStructure', label: 'Estructura tentativa' },
        { id: 'primaryBibliography', label: 'Bibliografía primaria' },
        { id: 'secondaryBibliography', label: 'Bibliografía secundaria' }
    ];
    
    const errors = [];
    
    requiredFields.forEach(field => {
        const element = document.getElementById(field.id);
        if (!element || !element.value.trim()) {
            errors.push(field.label);
        }
    });
    
    // Validar cantidad de referencias
    const primaryBib = document.getElementById('primaryBibliography').value;
    const secondaryBib = document.getElementById('secondaryBibliography').value;
    const totalRefs = countReferences(primaryBib) + countReferences(secondaryBib);
    
    if (totalRefs < 15) {
        errors.push('Bibliografía (mínimo 15 referencias)');
    }
    
    if (errors.length === 0) {
        alert('✓ Proyecto validado exitosamente. Todos los campos obligatorios están completos.');
    } else {
        alert('⚠ Faltan completar los siguientes campos:\n\n' + errors.map(e => '• ' + e).join('\n'));
    }
}

function validateBibliography() {
    validateProject();
}

function generateDocument() {
    // Esta función generaría un documento final en formato APA
    // Por ahora, solo recolecta y muestra los datos
    const data = collectProjectData();
    
    if (!data.studentName || !data.thesisTitle) {
        alert('Por favor, completá al menos el nombre y el título de la tesis antes de generar el documento.');
        return;
    }
    
    alert('Función de generación de documento en desarrollo.\n\nEsta funcionalidad generará un documento PDF formateado en APA con toda la información del proyecto de tesis.');
}

// ========================================
// SISTEMA DE AYUDA CONTEXTUAL
// ========================================

function initializeHelpButtons() {
    const helpButtons = document.querySelectorAll('.help-btn');
    const helpPanel = document.getElementById('helpPanel');
    const closeHelp = document.querySelector('.close-help');
    
    if (!helpPanel) return;
    
    helpButtons.forEach(button => {
        button.addEventListener('click', () => {
            const helpType = button.getAttribute('data-help');
            showHelp(helpType);
        });
    });
    
    if (closeHelp) {
        closeHelp.addEventListener('click', () => {
            helpPanel.style.display = 'none';
        });
    }
}

function showHelp(type) {
    const helpPanel = document.getElementById('helpPanel');
    const helpTitle = document.getElementById('helpTitle');
    const helpText = document.getElementById('helpText');
    
    const helpContent = {
        titulo: {
            title: 'Título de la Tesis',
            content: `
                <p><strong>Un buen título debe:</strong></p>
                <ul>
                    <li>Ser claro y específico</li>
                    <li>Indicar el tema principal</li>
                    <li>Mencionar el enfoque o perspectiva</li>
                    <li>No ser demasiado largo (máx. 15-20 palabras)</li>
                </ul>
                <p><strong>Ejemplo:</strong> "La noción de libertad en la filosofía existencialista de Jean-Paul Sartre"</p>
            `
        },
        area: {
            title: 'Área Temática',
            content: `
                <p>Elegí el área de la filosofía que mejor corresponda a tu tema de investigación.</p>
                <p>Si tu trabajo aborda múltiples áreas, elegí la predominante y mencioná las secundarias en el planteamiento del problema.</p>
            `
        },
        problema: {
            title: 'Planteamiento del Problema',
            content: `
                <p><strong>El planteamiento del problema debe incluir:</strong></p>
                <ul>
                    <li>¿Cuál es el problema filosófico específico?</li>
                    <li>¿Por qué es relevante este problema?</li>
                    <li>¿Qué vacíos o debates existen?</li>
                    <li>¿Qué pretendés aportar con tu investigación?</li>
                </ul>
            `
        },
        justificacion: {
            title: 'Justificación',
            content: `
                <p><strong>Respondé a estas preguntas:</strong></p>
                <ul>
                    <li>¿Por qué es importante investigar este tema?</li>
                    <li>¿Qué relevancia teórica tiene?</li>
                    <li>¿Tiene implicaciones prácticas?</li>
                    <li>¿Qué nuevo conocimiento se generará?</li>
                </ul>
            `
        },
        objetivos: {
            title: 'Objetivos de Investigación',
            content: `
                <p><strong>Objetivo General:</strong> Un solo objetivo amplio que exprese el propósito principal de la investigación.</p>
                <p><strong>Objetivos Específicos:</strong> 3-5 objetivos más concretos que permitan alcanzar el objetivo general.</p>
                <p><strong>Verbos útiles:</strong> Analizar, Examinar, Identificar, Evaluar, Comparar, Interpretar, Fundamentar</p>
            `
        },
        marco: {
            title: 'Marco Teórico',
            content: `
                <p>El marco teórico establece las bases conceptuales de tu investigación.</p>
                <p><strong>Debe incluir:</strong></p>
                <ul>
                    <li>Autores principales que trabajarás</li>
                    <li>Conceptos filosóficos fundamentales</li>
                    <li>Antecedentes teóricos y debates</li>
                    <li>Tu posicionamiento teórico</li>
                </ul>
            `
        },
        metodologia: {
            title: 'Metodología',
            content: `
                <p><strong>Explicá cómo realizarás tu investigación:</strong></p>
                <ul>
                    <li>Análisis conceptual</li>
                    <li>Hermenéutica</li>
                    <li>Método histórico-crítico</li>
                    <li>Análisis textual</li>
                    <li>Argumentación lógica</li>
                </ul>
            `
        },
        estructura: {
            title: 'Estructura de la Tesis',
            content: `
                <p>Proponé una organización lógica de tu trabajo:</p>
                <ul>
                    <li>Introducción</li>
                    <li>3-4 capítulos principales con subsecciones</li>
                    <li>Conclusiones</li>
                </ul>
                <p>Cada capítulo debe corresponder a objetivos específicos.</p>
            `
        },
        cronograma: {
            title: 'Cronograma de Trabajo',
            content: `
                <p>Distribuí el tiempo de trabajo de manera realista:</p>
                <ul>
                    <li>Lectura y análisis de fuentes</li>
                    <li>Escritura de cada capítulo</li>
                    <li>Revisión y correcciones</li>
                    <li>Considerá imprevistos</li>
                </ul>
            `
        },
        bibliografia: {
            title: 'Bibliografía',
            content: `
                <p><strong>Fuentes Primarias:</strong> Obras originales de los autores que analizarás.</p>
                <p><strong>Fuentes Secundarias:</strong> Comentadores, estudios críticos, artículos académicos.</p>
                <p><strong>Formato APA 7ª edición.</strong> Consultá la sección "Recursos" para ejemplos.</p>
            `
        }
    };
    
    const content = helpContent[type] || { title: 'Ayuda', content: '<p>Información no disponible.</p>' };
    
    helpTitle.textContent = content.title;
    helpText.innerHTML = content.content;
    helpPanel.style.display = 'block';
}

// ========================================
// BOTONES DE ASISTENCIA IA
// ========================================

function initializeAIAssistButtons() {
    const aiButtons = [
        { id: 'aiTitleSuggestion', type: 'title' },
        { id: 'aiProblemHelp', type: 'problem' },
        { id: 'aiJustificationHelp', type: 'justification' },
        { id: 'aiObjectiveHelp', type: 'objective' },
        { id: 'aiSpecificObjectivesHelp', type: 'specificObjectives' },
        { id: 'aiAuthorsHelp', type: 'authors' },
        { id: 'aiConceptsHelp', type: 'concepts' },
        { id: 'aiBackgroundHelp', type: 'background' },
        { id: 'aiMethodologyHelp', type: 'methodology' },
        { id: 'aiStructureHelp', type: 'structure' },
        { id: 'aiTimelineHelp', type: 'timeline' },
        { id: 'aiPrimaryBibHelp', type: 'primaryBib' },
        { id: 'aiSecondaryBibHelp', type: 'secondaryBib' }
    ];
    
    aiButtons.forEach(btn => {
        const button = document.getElementById(btn.id);
        if (button) {
            button.addEventListener('click', (e) => handleAIAssist(e, btn.type));
        }
    });
}

async function handleAIAssist(event, type) {
    const data = collectProjectData();
    let prompt = '';
    let targetField = null;
    
    switch(type) {
        case 'title':
            if (!data.thematicArea && !data.problemStatement) {
                alert('Por favor, completá primero el área temática o el planteamiento del problema.');
                return;
            }
            prompt = `Sugerí 3 títulos posibles para una tesis de filosofía sobre el siguiente tema:\n\nÁrea: ${data.thematicArea || 'No especificado'}\nProblema: ${data.problemStatement || 'No especificado'}`;
            break;
            
        case 'problem':
            if (!data.thesisTitle) {
                alert('Por favor, completá primero el título de la tesis.');
                return;
            }
            prompt = `Ayudame a desarrollar un planteamiento del problema (300-400 palabras) para una tesis filosófica titulada:\n\n"${data.thesisTitle}"\n\nÁrea: ${data.thematicArea || 'No especificado'}`;
            targetField = 'problemStatement';
            break;
            
        case 'justification':
            if (!data.problemStatement) {
                alert('Por favor, completá primero el planteo del problema.');
                return;
            }
            prompt = `Basándote en el siguiente planteo del problema, ayudame a redactar una justificación académica (200-300 palabras) que explique la relevancia teórica y práctica de esta investigación:\n\n${data.problemStatement}`;
            targetField = 'justification';
            break;
            
        case 'objective':
            if (!data.researchQuestion) {
                alert('Por favor, completá primero la pregunta de investigación.');
                return;
            }
            prompt = `Basándote en la siguiente pregunta de investigación, sugerí un objetivo general claro y alcanzable para una tesis de licenciatura:\n\n${data.researchQuestion}\n\nEl objetivo debe comenzar con un verbo en infinitivo apropiado para investigación filosófica.`;
            targetField = 'generalObjective';
            break;
            
        case 'specificObjectives':
            if (!data.generalObjective) {
                alert('Por favor, completá primero el objetivo general.');
                return;
            }
            prompt = `Basándote en el siguiente objetivo general, sugerí 4 objetivos específicos que permitan alcanzarlo:\n\nObjetivo general: ${data.generalObjective}\n\nCada objetivo específico debe ser claro, concreto y comenzar con un verbo en infinitivo.`;
            targetField = 'specificObjectives';
            break;
            
        case 'authors':
            if (!data.thesisTitle && !data.problemStatement) {
                alert('Por favor, completá primero el título o el planteo del problema.');
                return;
            }
            prompt = `Basándote en el siguiente tema de tesis, sugerí los 3-5 autores principales que sería relevante trabajar:\n\nTítulo: ${data.thesisTitle || 'No especificado'}\nProblema: ${data.problemStatement || 'No especificado'}\n\nPara cada autor, explicá brevemente por qué es relevante para esta investigación.`;
            targetField = 'mainAuthors';
            break;
            
        case 'concepts':
            if (!data.thesisTitle && !data.problemStatement) {
                alert('Por favor, completá primero el título o el planteo del problema.');
                return;
            }
            prompt = `Basándote en el siguiente tema de tesis, identificá los 5-8 conceptos filosóficos clave que deberían trabajarse:\n\nTítulo: ${data.thesisTitle || 'No especificado'}\nProblema: ${data.problemStatement || 'No especificado'}\n\nListá los conceptos con una breve definición o explicación de su relevancia.`;
            targetField = 'keyConcepts';
            break;
            
        case 'background':
            if (!data.thesisTitle) {
                alert('Por favor, completá primero el título de la tesis.');
                return;
            }
            prompt = `Ayudame a redactar una descripción de los antecedentes teóricos (200-300 palabras) para una tesis sobre:\n\n${data.thesisTitle}\n\nIncluí el estado actual del debate, principales posiciones existentes y qué se ha dicho sobre el tema.`;
            targetField = 'theoreticalBackground';
            break;
            
        case 'methodology':
            if (!data.problemStatement && !data.thesisTitle) {
                alert('Por favor, completá primero el título o el planteo del problema.');
                return;
            }
            prompt = `Ayudame a redactar la metodología (200-300 palabras) para la siguiente investigación filosófica:\n\nTítulo: ${data.thesisTitle || 'No especificado'}\nProblema: ${data.problemStatement || 'No especificado'}\n\nExplicá qué método filosófico es apropiado y cómo se abordará la investigación.`;
            targetField = 'methodology';
            break;
            
        case 'structure':
            if (!data.specificObjectives) {
                alert('Por favor, completá primero los objetivos específicos.');
                return;
            }
            prompt = `Basándote en los siguientes objetivos, sugerí una estructura tentativa (índice) para la tesis con introducción, 3 capítulos con subsecciones, y conclusión:\n\nObjetivo general: ${data.generalObjective}\n\nObjetivos específicos:\n${data.specificObjectives}\n\nProporcioná un índice claro y lógico.`;
            targetField = 'thesisStructure';
            break;
            
        case 'timeline':
            if (!data.thesisStructure) {
                alert('Por favor, completá primero la estructura tentativa para sugerir un cronograma apropiado.');
                return;
            }
            prompt = `Basándote en la siguiente estructura de tesis, sugerí un cronograma de trabajo realista para 12 meses:\n\nEstructura:\n${data.thesisStructure}\n\nDistribuí el tiempo considerando: lectura de fuentes, escritura de capítulos, revisiones y correcciones finales.`;
            targetField = 'timeline';
            break;
            
        case 'primaryBib':
            if (!data.mainAuthors && !data.thesisTitle) {
                alert('Por favor, completá primero el título o los autores principales.');
                return;
            }
            prompt = `Sugerí 5-8 fuentes primarias (obras originales) en formato APA para una tesis sobre:\n\nTítulo: ${data.thesisTitle || 'No especificado'}\nAutores principales: ${data.mainAuthors || 'No especificado'}\n\nIncluí las obras más importantes y relevantes. Formato APA 7ª edición.`;
            targetField = 'primaryBibliography';
            break;
            
        case 'secondaryBib':
            if (!data.mainAuthors && !data.thesisTitle) {
                alert('Por favor, completá primero el título o los autores principales.');
                return;
            }
            prompt = `Sugerí 10-12 fuentes secundarias (comentadores, estudios críticos, artículos académicos) en formato APA para una tesis sobre:\n\nTítulo: ${data.thesisTitle || 'No especificado'}\nAutores principales: ${data.mainAuthors || 'No especificado'}\nÁrea: ${data.thematicArea || 'No especificado'}\n\nIncluí libros de comentadores reconocidos y artículos de revistas académicas. Formato APA 7ª edición.`;
            targetField = 'secondaryBibliography';
            break;
    }
    
    // Llamar a la IA
    const button = event.target;
    const originalText = button.textContent;
    button.disabled = true;
    button.textContent = '⏳ Generando...';
    
    try {
        const response = await callClaudeAPI(
            'Sos un experto en metodología de tesis en filosofía. Ayudás a estudiantes a desarrollar sus proyectos de tesis. Usá el voseo argentino.',
            [{
                role: 'user',
                content: prompt
            }]
        );
        
        if (type === 'title') {
            alert('Sugerencias de títulos:\n\n' + response);
        } else if (targetField) {
            if (confirm('¿Querés usar este contenido generado? Se copiará en el campo correspondiente.\n\nPodés revisarlo y modificarlo después.')) {
                document.getElementById(targetField).value = response;
            }
        }
        
    } catch (error) {
        console.error('Error:', error);
        alert('Error al generar contenido con IA. Por favor, intentá nuevamente.');
    } finally {
        button.disabled = false;
        button.textContent = originalText;
    }
}

// ========================================
// UTILIDADES
// ========================================

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ========================================
// INICIALIZACIÓN FINAL
// ========================================

console.log('✓ Asistente de Tesis Filosófica cargado correctamente');
console.log('✓ Usando API de Claude');
