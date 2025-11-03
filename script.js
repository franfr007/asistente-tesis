// Configuración de la API de Gemini
const GEMINI_API_KEY = 'AIzaSyBrNHSnzrf79ZTEY_kdjDcNMVMwVFI79fI';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

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

// Sistema de pestañas
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

// Sistema de acordeones
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

// Chat de Orientación
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
    const sendButton = document.getElementById('sendOrientation');
    
    const message = input.value.trim();
    
    if (!message) {
        alert('Por favor, escribí una pregunta o consulta.');
        return;
    }
    
    // Deshabilitar input mientras se procesa
    input.disabled = true;
    sendButton.disabled = true;
    sendButton.textContent = 'Procesando...';
    
    // Agregar mensaje del usuario al chat
    addMessageToChat(chatBox, message, 'user');
    
    // Limpiar input
    input.value = '';
    
    try {
        // Preparar contexto con historial
        conversationHistory.orientacion.push({
            role: 'user',
            parts: [{ text: message }]
        });
        
        // Llamar a la API de Gemini
        const response = await callGeminiAPI(
            SYSTEM_PROMPTS.orientacion,
            conversationHistory.orientacion
        );
        
        // Agregar respuesta al historial y al chat
        conversationHistory.orientacion.push({
            role: 'model',
            parts: [{ text: response }]
        });
        
        addMessageToChat(chatBox, response, 'assistant');
        
    } catch (error) {
        console.error('Error:', error);
        addMessageToChat(
            chatBox, 
            'Lo siento, ocurrió un error al procesar tu consulta. Por favor, intenta nuevamente.',
            'assistant'
        );
    } finally {
        // Rehabilitar input
        input.disabled = false;
        sendButton.disabled = false;
        sendButton.textContent = 'Enviar Consulta';
        input.focus();
    }
}

function addMessageToChat(chatBox, message, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}`;
    
    const label = document.createElement('div');
    label.className = 'chat-message-label';
    label.textContent = sender === 'user' ? 'Tú:' : 'Asistente:';
    
    const content = document.createElement('div');
    content.innerHTML = formatMessage(message);
    
    messageDiv.appendChild(label);
    messageDiv.appendChild(content);
    chatBox.appendChild(messageDiv);
    
    // Scroll al final
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Generador de Contenido
function initializeGenerator() {
    const generateButton = document.getElementById('generateContent');
    const copyButton = document.getElementById('copyContent');
    
    generateButton.addEventListener('click', () => generateContent());
    copyButton.addEventListener('click', () => copyGeneratedContent());
}

async function generateContent() {
    const contentType = document.getElementById('contentType').value;
    const topic = document.getElementById('thesisTopic').value.trim();
    const context = document.getElementById('specificContext').value.trim();
    
    const outputBox = document.getElementById('generatedContent');
    const loading = document.getElementById('loadingGenerator');
    const generateButton = document.getElementById('generateContent');
    const copyButton = document.getElementById('copyContent');
    
    // Validaciones
    if (!contentType) {
        alert('Por favor, seleccioná el tipo de contenido a generar.');
        return;
    }
    
    if (!topic) {
        alert('Por favor, indicá el tema de tu tesis.');
        return;
    }
    
    // Mostrar loading
    outputBox.style.display = 'none';
    loading.style.display = 'block';
    generateButton.disabled = true;
    copyButton.style.display = 'none';
    
    try {
        // Construir el prompt específico
        const systemPrompt = SYSTEM_PROMPTS.generador[contentType];
        
        const userPrompt = `
Tema de la tesis: ${topic}

${context ? `Contexto adicional:\n${context}\n` : ''}

Por favor, generá un texto académico de alta calidad para la sección solicitada. 
Debe ser riguroso, bien estructurado y apropiado para una tesis de licenciatura en filosofía.
`;
        
        // Llamar a la API
        const response = await callGeminiAPI(systemPrompt, [
            { role: 'user', parts: [{ text: userPrompt }] }
        ]);
        
        // Mostrar resultado
        loading.style.display = 'none';
        outputBox.style.display = 'block';
        outputBox.classList.add('has-content');
        outputBox.innerHTML = formatMessage(response);
        copyButton.style.display = 'inline-flex';
        
    } catch (error) {
        console.error('Error:', error);
        loading.style.display = 'none';
        outputBox.style.display = 'block';
        outputBox.innerHTML = '<p class="placeholder-text" style="color: #e74c3c;">Error al generar el contenido. Por favor, intenta nuevamente.</p>';
    } finally {
        generateButton.disabled = false;
    }
}

function copyGeneratedContent() {
    const outputBox = document.getElementById('generatedContent');
    const text = outputBox.innerText;
    
    navigator.clipboard.writeText(text).then(() => {
        const copyButton = document.getElementById('copyContent');
        const originalText = copyButton.textContent;
        copyButton.textContent = '✓ Copiado';
        setTimeout(() => {
            copyButton.textContent = originalText;
        }, 2000);
    }).catch(err => {
        console.error('Error al copiar:', err);
        alert('No se pudo copiar el contenido. Por favor, seleccioná y copiá manualmente.');
    });
}

// Revisor de Texto
function initializeReviewer() {
    const reviewButton = document.getElementById('reviewText');
    reviewButton.addEventListener('click', () => reviewText());
}

async function reviewText() {
    const textToReview = document.getElementById('textToReview').value.trim();
    const resultsBox = document.getElementById('reviewResults');
    const loading = document.getElementById('loadingReviewer');
    const reviewButton = document.getElementById('reviewText');
    
    // Validación
    if (!textToReview) {
        alert('Por favor, proporcioná un texto para revisar.');
        return;
    }
    
    if (textToReview.length < 100) {
        alert('El texto es muy corto. Por favor, proporcioná al menos 100 caracteres.');
        return;
    }
    
    // Obtener opciones seleccionadas
    const checkStructure = document.getElementById('checkStructure').checked;
    const checkArguments = document.getElementById('checkArguments').checked;
    const checkStyle = document.getElementById('checkStyle').checked;
    const checkCitations = document.getElementById('checkCitations').checked;
    
    // Construir instrucciones específicas
    let specificInstructions = '\n\nAspecto a analizar:\n';
    if (checkStructure) specificInstructions += '- Estructura y coherencia\n';
    if (checkArguments) specificInstructions += '- Calidad argumentativa\n';
    if (checkStyle) specificInstructions += '- Estilo académico\n';
    if (checkCitations) specificInstructions += '- Uso de citas y referencias\n';
    
    // Mostrar loading
    resultsBox.style.display = 'none';
    loading.style.display = 'block';
    reviewButton.disabled = true;
    
    try {
        const prompt = `${SYSTEM_PROMPTS.revisor}${specificInstructions}

TEXTO A REVISAR:
---
${textToReview}
---

Proporcioná un análisis detallado y constructivo, organizando tus observaciones por categorías. 
Incluí ejemplos específicos del texto cuando sea pertinente.
Finalizá con recomendaciones concretas de mejora.`;
        
        const response = await callGeminiAPI('', [
            { role: 'user', parts: [{ text: prompt }] }
        ]);
        
        // Mostrar resultados
        loading.style.display = 'none';
        resultsBox.style.display = 'block';
        resultsBox.classList.add('has-content');
        resultsBox.innerHTML = formatMessage(response);
        
    } catch (error) {
        console.error('Error:', error);
        loading.style.display = 'none';
        resultsBox.style.display = 'block';
        resultsBox.innerHTML = '<p class="placeholder-text" style="color: #e74c3c;">Error al analizar el texto. Por favor, intenta nuevamente.</p>';
    } finally {
        reviewButton.disabled = false;
    }
}

// Función para llamar a la API de Gemini
async function callGeminiAPI(systemPrompt, conversationHistory) {
    try {
        // Preparar el contenido con system prompt si existe
        let contents = [];
        
        if (systemPrompt) {
            contents.push({
                role: 'user',
                parts: [{ text: systemPrompt }]
            });
            contents.push({
                role: 'model',
                parts: [{ text: 'Entendido. Estoy listo para asistirte con expertise en filosofía y metodología de tesis. ¿En qué puedo ayudarte?' }]
            });
        }
        
        // Agregar el historial de conversación
        contents = contents.concat(conversationHistory);
        
        const requestBody = {
            contents: contents,
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 8192,
            },
            safetySettings: [
                {
                    category: "HARM_CATEGORY_HARASSMENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_HATE_SPEECH",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                }
            ]
        };
        
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('API Error:', errorData);
            throw new Error(`API Error: ${response.status} - ${JSON.stringify(errorData)}`);
        }
        
        const data = await response.json();
        
        // Extraer el texto de la respuesta
        if (data.candidates && data.candidates.length > 0) {
            const candidate = data.candidates[0];
            if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
                return candidate.content.parts[0].text;
            }
        }
        
        throw new Error('No se pudo obtener una respuesta válida de la API');
        
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        throw error;
    }
}

// Función para formatear mensajes (convertir markdown a HTML)
function formatMessage(text) {
    // Convertir negritas (debe ir antes que cursivas)
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/__(.+?)__/g, '<strong>$1</strong>');
    
    // Convertir cursivas
    text = text.replace(/\*([^*]+?)\*/g, '<em>$1</em>');
    text = text.replace(/_([^_]+?)_/g, '<em>$1</em>');
    
    // Convertir saltos de línea dobles en párrafos
    text = text.replace(/\n\n/g, '</p><p>');
    text = '<p>' + text + '</p>';
    
    // Convertir listas con guiones
    text = text.replace(/<p>[-•]\s*(.+?)<\/p>/g, '<li>$1</li>');
    
    // Envolver listas consecutivas en ul
    text = text.replace(/(<li>.*?<\/li>)+/gs, function(match) {
        return '<ul>' + match + '</ul>';
    });
    
    // Convertir listas numeradas
    text = text.replace(/<p>(\d+)\.\s+(.+?)<\/p>/g, '<li value="$1">$2</li>');
    
    // Envolver listas numeradas en ol
    text = text.replace(/(<li value="\d+">.*?<\/li>)+/gs, function(match) {
        return '<ol>' + match.replace(/value="\d+"/g, '') + '</ol>';
    });
    
    // Convertir títulos (líneas que empiezan con #)
    text = text.replace(/<p>###\s*(.+?)<\/p>/g, '<h4>$1</h4>');
    text = text.replace(/<p>##\s*(.+?)<\/p>/g, '<h3>$1</h3>');
    text = text.replace(/<p>#\s*(.+?)<\/p>/g, '<h2>$1</h2>');
    
    // Limpiar párrafos vacíos
    text = text.replace(/<p>\s*<\/p>/g, '');
    text = text.replace(/<p><\/p>/g, '');
    
    return text;
}

// Utilidad: Validar que el texto sea apropiado para procesamiento
function validateTextLength(text, minLength = 10, maxLength = 50000) {
    const length = text.trim().length;
    return length >= minLength && length <= maxLength;
}

// Exportar funciones si se necesitan en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        callGeminiAPI,
        formatMessage
    };
}

// ========== FUNCIONALIDAD DEL PROYECTO DE TESIS ==========

function initializeProject() {
    // Contadores de palabras
    setupWordCounters();
    
    // Botones de ayuda
    setupHelpButtons();
    
    // Botones de acciones
    setupProjectActions();
    
    // Botones de IA
    setupAIAssistButtons();
}

// Configurar contadores de palabras
function setupWordCounters() {
    const counters = [
        { textarea: 'problemStatement', counter: 'problemCount' },
        { textarea: 'justification', counter: 'justificationCount' },
        { textarea: 'theoreticalBackground', counter: 'backgroundCount' },
        { textarea: 'methodology', counter: 'methodologyCount' }
    ];
    
    counters.forEach(({ textarea, counter }) => {
        const element = document.getElementById(textarea);
        const counterElement = document.getElementById(counter);
        
        if (element && counterElement) {
            element.addEventListener('input', () => {
                const wordCount = countWords(element.value);
                counterElement.textContent = wordCount;
            });
        }
    });
    
    // Contadores de referencias bibliográficas
    setupBibliographyCounters();
}

function setupBibliographyCounters() {
    const primaryBib = document.getElementById('primaryBibliography');
    const secondaryBib = document.getElementById('secondaryBibliography');
    
    if (primaryBib && secondaryBib) {
        primaryBib.addEventListener('input', updateBibliographyCount);
        secondaryBib.addEventListener('input', updateBibliographyCount);
        
        // Botón de validación
        document.getElementById('validateBibliography').addEventListener('click', validateBibliography);
    }
}

function updateBibliographyCount() {
    const primaryText = document.getElementById('primaryBibliography').value;
    const secondaryText = document.getElementById('secondaryBibliography').value;
    
    const primaryCount = countReferences(primaryText);
    const secondaryCount = countReferences(secondaryText);
    const totalCount = primaryCount + secondaryCount;
    
    document.getElementById('primaryRefCount').textContent = primaryCount;
    document.getElementById('secondaryRefCount').textContent = secondaryCount;
    document.getElementById('totalRefs').textContent = totalCount;
    
    // Actualizar estilo si cumple el mínimo
    const minRefsBox = document.getElementById('minRefsBox');
    const statBoxes = document.querySelectorAll('.stat-box');
    
    if (totalCount >= 15) {
        statBoxes.forEach(box => box.classList.add('complete'));
    } else {
        statBoxes.forEach(box => box.classList.remove('complete'));
    }
}

function countReferences(text) {
    if (!text.trim()) return 0;
    
    // Contar líneas no vacías que parecen referencias
    const lines = text.split('\n').filter(line => {
        const trimmed = line.trim();
        // Una referencia típicamente tiene al menos un punto y paréntesis o tiene cierta longitud
        return trimmed.length > 20 && (trimmed.includes('.') || trimmed.includes('('));
    });
    
    return lines.length;
}

function countWords(text) {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

// Configurar botones de ayuda
function setupHelpButtons() {
    const helpButtons = document.querySelectorAll('.help-btn');
    const helpPanel = document.getElementById('helpPanel');
    const closeHelp = document.querySelector('.close-help');
    
    const helpContent = {
        titulo: {
            title: 'Título de la Tesis',
            text: `
                <p><strong>Características de un buen título:</strong></p>
                <ul>
                    <li>Claro y específico</li>
                    <li>Refleja el contenido real de tu investigación</li>
                    <li>Incluye conceptos clave</li>
                    <li>No demasiado largo (15-20 palabras máximo)</li>
                    <li>Puede incluir subtítulo para mayor precisión</li>
                </ul>
                <p><strong>Ejemplo:</strong> "La libertad radical en Sartre: Un análisis desde El ser y la nada"</p>
            `
        },
        area: {
            title: 'Área Temática',
            text: `
                <p>Seleccioná el área principal de la filosofía en la que se inscribe tu investigación.</p>
                <p><strong>Considerá:</strong></p>
                <ul>
                    <li>¿Cuál es el foco central de tu trabajo?</li>
                    <li>¿Con qué tradición filosófica dialogás principalmente?</li>
                    <li>Podés tener áreas secundarias, pero elegí la principal</li>
                </ul>
            `
        },
        problema: {
            title: 'Planteo del Problema',
            text: `
                <p>El planteo del problema debe responder:</p>
                <ul>
                    <li>¿Qué cuestión filosófica querés investigar?</li>
                    <li>¿Por qué es un problema relevante?</li>
                    <li>¿Qué aspectos específicos del problema vas a abordar?</li>
                    <li>¿Qué limitaciones tiene tu abordaje?</li>
                </ul>
                <p><strong>Tip:</strong> Sé específico. Evitá temas demasiado amplios.</p>
            `
        },
        justificacion: {
            title: 'Justificación',
            text: `
                <p>Explicá por qué vale la pena investigar tu tema:</p>
                <ul>
                    <li><strong>Relevancia teórica:</strong> ¿Qué aporta al debate filosófico?</li>
                    <li><strong>Relevancia práctica:</strong> ¿Tiene implicaciones para la vida humana?</li>
                    <li><strong>Originalidad:</strong> ¿Qué perspectiva nueva ofrecés?</li>
                    <li><strong>Viabilidad:</strong> ¿Por qué es posible realizarla?</li>
                </ul>
            `
        },
        objetivos: {
            title: 'Objetivos',
            text: `
                <p><strong>Objetivo General:</strong> Qué querés lograr con la investigación completa.</p>
                <p><strong>Objetivos Específicos:</strong> Pasos concretos para lograr el objetivo general.</p>
                <p><strong>Verbos útiles:</strong></p>
                <ul>
                    <li>Analizar, examinar, estudiar</li>
                    <li>Identificar, caracterizar, describir</li>
                    <li>Comparar, contrastar, relacionar</li>
                    <li>Evaluar, criticar, cuestionar</li>
                    <li>Interpretar, explicar, comprender</li>
                </ul>
            `
        },
        marco: {
            title: 'Marco Teórico',
            text: `
                <p>El marco teórico preliminar debe incluir:</p>
                <ul>
                    <li><strong>Autores principales:</strong> Quiénes vas a estudiar directamente</li>
                    <li><strong>Conceptos clave:</strong> Categorías filosóficas fundamentales</li>
                    <li><strong>Antecedentes:</strong> Qué se ha dicho sobre tu tema</li>
                </ul>
                <p><strong>Nota:</strong> Es preliminar, puede modificarse durante la investigación.</p>
            `
        },
        metodologia: {
            title: 'Metodología',
            text: `
                <p><strong>Métodos filosóficos comunes:</strong></p>
                <ul>
                    <li><strong>Análisis conceptual:</strong> Clarificación de conceptos</li>
                    <li><strong>Hermenéutica:</strong> Interpretación de textos</li>
                    <li><strong>Método histórico-crítico:</strong> Análisis histórico y contextual</li>
                    <li><strong>Análisis lógico:</strong> Evaluación de argumentos</li>
                    <li><strong>Fenomenología:</strong> Descripción de experiencias</li>
                </ul>
                <p>Explicá cómo vas a trabajar tus fuentes y desarrollar tus argumentos.</p>
            `
        },
        estructura: {
            title: 'Estructura Tentativa',
            text: `
                <p>Proponé una estructura lógica con:</p>
                <ul>
                    <li><strong>Introducción:</strong> Presentación del tema</li>
                    <li><strong>3-4 capítulos:</strong> Desarrollo argumentativo</li>
                    <li><strong>Conclusión:</strong> Síntesis y cierre</li>
                </ul>
                <p><strong>Tip:</strong> Cada capítulo debe responder a un objetivo específico.</p>
            `
        },
        cronograma: {
            title: 'Cronograma',
            text: `
                <p>Distribuí el tiempo de trabajo considerando:</p>
                <ul>
                    <li>Lectura y análisis de fuentes (30%)</li>
                    <li>Escritura de capítulos (50%)</li>
                    <li>Revisión y correcciones (20%)</li>
                </ul>
                <p><strong>Realista:</strong> Considerá tus otras obligaciones.</p>
            `
        },
        bibliografia: {
            title: 'Bibliografía',
            text: `
                <p><strong>Requisitos:</strong></p>
                <ul>
                    <li>Mínimo 15 referencias en total</li>
                    <li>Formato APA 7ª edición</li>
                    <li>Dividir entre primarias y secundarias</li>
                </ul>
                <p><strong>Fuentes Primarias:</strong> Obras originales de los autores que vas a estudiar.</p>
                <p><strong>Fuentes Secundarias:</strong> Comentarios, estudios críticos, análisis de otros académicos.</p>
                <p><strong>Orden alfabético:</strong> Por apellido del primer autor.</p>
                <p><strong>Tip:</strong> Usá gestores bibliográficos como Zotero para facilitar el formato.</p>
            `
        }
    };
    
    helpButtons.forEach(button => {
        button.addEventListener('click', () => {
            const helpKey = button.getAttribute('data-help');
            const content = helpContent[helpKey];
            
            if (content) {
                document.getElementById('helpTitle').textContent = content.title;
                document.getElementById('helpText').innerHTML = content.text;
                helpPanel.classList.add('active');
            }
        });
    });
    
    if (closeHelp) {
        closeHelp.addEventListener('click', () => {
            helpPanel.classList.remove('active');
        });
    }
}

// Configurar acciones del proyecto
function setupProjectActions() {
    document.getElementById('saveDraft').addEventListener('click', saveProjectDraft);
    document.getElementById('saveDraftBottom').addEventListener('click', saveProjectDraft);
    document.getElementById('loadDraft').addEventListener('click', loadProjectDraft);
    document.getElementById('clearProject').addEventListener('click', clearProject);
    document.getElementById('validateProject').addEventListener('click', validateProject);
    document.getElementById('generateDocument').addEventListener('click', generateProjectDocument);
    document.getElementById('generateDocumentBottom').addEventListener('click', generateProjectDocument);
}

// Guardar borrador
function saveProjectDraft() {
    const projectData = collectProjectData();
    localStorage.setItem('projectDraft', JSON.stringify(projectData));
    localStorage.setItem('projectDraftDate', new Date().toISOString());
    
    alert('✓ Borrador guardado exitosamente');
}

// Cargar borrador
function loadProjectDraft() {
    const savedData = localStorage.getItem('projectDraft');
    const savedDate = localStorage.getItem('projectDraftDate');
    
    if (!savedData) {
        alert('No hay ningún borrador guardado.');
        return;
    }
    
    if (confirm(`¿Querés cargar el borrador guardado el ${new Date(savedDate).toLocaleString('es-AR')}? Esto reemplazará el contenido actual.`)) {
        const projectData = JSON.parse(savedData);
        fillProjectForm(projectData);
        alert('✓ Borrador cargado exitosamente');
    }
}

// Limpiar proyecto
function clearProject() {
    if (confirm('¿Estás seguro de que querés limpiar todo el formulario? Esta acción no se puede deshacer.')) {
        document.querySelectorAll('.form-input, .form-textarea, .form-select').forEach(field => {
            field.value = '';
        });
        alert('✓ Formulario limpiado');
    }
}

// Recolectar datos del proyecto
function collectProjectData() {
    return {
        studentName: document.getElementById('studentName').value,
        studentEmail: document.getElementById('studentEmail').value,
        thesisTitle: document.getElementById('thesisTitle').value,
        thesisSubtitle: document.getElementById('thesisSubtitle').value,
        thematicArea: document.getElementById('thematicArea').value,
        philosophicalTradition: document.getElementById('philosophicalTradition').value,
        problemStatement: document.getElementById('problemStatement').value,
        researchQuestion: document.getElementById('researchQuestion').value,
        secondaryQuestions: document.getElementById('secondaryQuestions').value,
        justification: document.getElementById('justification').value,
        generalObjective: document.getElementById('generalObjective').value,
        specificObjectives: document.getElementById('specificObjectives').value,
        mainAuthors: document.getElementById('mainAuthors').value,
        keyConcepts: document.getElementById('keyConcepts').value,
        theoreticalBackground: document.getElementById('theoreticalBackground').value,
        methodology: document.getElementById('methodology').value,
        primarySources: document.getElementById('primarySources').value,
        secondarySources: document.getElementById('secondarySources').value,
        thesisStructure: document.getElementById('thesisStructure').value,
        timeline: document.getElementById('timeline').value,
        primaryBibliography: document.getElementById('primaryBibliography').value,
        secondaryBibliography: document.getElementById('secondaryBibliography').value
    };
}

// Llenar formulario con datos
function fillProjectForm(data) {
    Object.keys(data).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            element.value = data[key] || '';
        }
    });
}

// Validar proyecto
function validateProject() {
    const requiredFields = [
        { id: 'studentName', label: 'Nombre del estudiante' },
        { id: 'thesisTitle', label: 'Título de la tesis' },
        { id: 'thematicArea', label: 'Área temática' },
        { id: 'problemStatement', label: 'Planteo del problema' },
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
    
    const missing = [];
    const warnings = [];
    
    // Verificar campos obligatorios
    requiredFields.forEach(field => {
        const element = document.getElementById(field.id);
        if (!element.value.trim()) {
            missing.push(field.label);
        }
    });
    
    // Verificar longitud de textos
    const problemWords = countWords(document.getElementById('problemStatement').value);
    if (problemWords < 300) {
        warnings.push(`Planteo del problema muy corto (${problemWords} palabras, recomendado: 300-500)`);
    }
    
    const justificationWords = countWords(document.getElementById('justification').value);
    if (justificationWords < 200) {
        warnings.push(`Justificación muy corta (${justificationWords} palabras, recomendado: 200-400)`);
    }
    
    // Verificar bibliografía
    const primaryRefs = countReferences(document.getElementById('primaryBibliography').value);
    const secondaryRefs = countReferences(document.getElementById('secondaryBibliography').value);
    const totalRefs = primaryRefs + secondaryRefs;
    
    if (totalRefs < 15) {
        warnings.push(`Bibliografía insuficiente (${totalRefs} referencias, mínimo: 15)`);
    }
    
    // Mostrar resultados
    if (missing.length > 0) {
        alert('❌ Faltan completar los siguientes campos obligatorios:\n\n' + missing.join('\n'));
        return false;
    }
    
    if (warnings.length > 0) {
        alert('⚠️ Advertencias:\n\n' + warnings.join('\n') + '\n\nPodés continuar, pero considerá mejorar estos aspectos.');
    } else {
        alert('✓ ¡Proyecto validado exitosamente! Todos los campos están completos y cumplen los requisitos mínimos.');
    }
    
    return true;
}

// Validar bibliografía específicamente
function validateBibliography() {
    const primaryRefs = countReferences(document.getElementById('primaryBibliography').value);
    const secondaryRefs = countReferences(document.getElementById('secondaryBibliography').value);
    const totalRefs = primaryRefs + secondaryRefs;
    
    let message = `📚 Análisis de Bibliografía:\n\n`;
    message += `• Fuentes primarias: ${primaryRefs}\n`;
    message += `• Fuentes secundarias: ${secondaryRefs}\n`;
    message += `• Total: ${totalRefs} referencias\n\n`;
    
    if (totalRefs >= 15) {
        message += `✓ Cumple con el mínimo de 15 referencias.\n\n`;
        
        if (primaryRefs < 2) {
            message += `⚠️ Considerá agregar más fuentes primarias (obras originales).`;
        } else if (secondaryRefs < 5) {
            message += `⚠️ Considerá agregar más fuentes secundarias (comentadores, estudios).`;
        } else {
            message += `¡Excelente distribución entre fuentes primarias y secundarias!`;
        }
    } else {
        message += `❌ No cumple con el mínimo. Faltan ${15 - totalRefs} referencias.\n\n`;
        message += `Recomendación: Agregá más fuentes secundarias (comentadores, artículos de revista, estudios críticos).`;
    }
    
    alert(message);
}

// Generar documento del proyecto
async function generateProjectDocument() {
    // Validar primero
    const data = collectProjectData();
    
    if (!data.studentName || !data.thesisTitle) {
        alert('Por favor, completá al menos el nombre y el título antes de generar el documento.');
        return;
    }
    
    // Crear contenido del documento
    const documentContent = `
PROYECTO DE TESIS DE LICENCIATURA EN FILOSOFÍA

Universidad Católica de La Plata
Seminario: Tesis de Investigación
Prof. Francisco Fernández Ruiz

═══════════════════════════════════════════════════════════════

DATOS DEL ESTUDIANTE

Nombre: ${data.studentName}
Email: ${data.studentEmail || 'No especificado'}

═══════════════════════════════════════════════════════════════

TÍTULO DE LA TESIS

${data.thesisTitle}
${data.thesisSubtitle ? 'Subtítulo: ' + data.thesisSubtitle : ''}

═══════════════════════════════════════════════════════════════

ÁREA TEMÁTICA

Área de la filosofía: ${data.thematicArea || 'No especificado'}
Tradición filosófica: ${data.philosophicalTradition || 'No especificado'}

═══════════════════════════════════════════════════════════════

PLANTEO DEL PROBLEMA

${data.problemStatement || 'No especificado'}

Pregunta de investigación principal:
${data.researchQuestion || 'No especificado'}

${data.secondaryQuestions ? 'Preguntas secundarias:\n' + data.secondaryQuestions : ''}

═══════════════════════════════════════════════════════════════

JUSTIFICACIÓN

${data.justification || 'No especificado'}

═══════════════════════════════════════════════════════════════

OBJETIVOS

Objetivo General:
${data.generalObjective || 'No especificado'}

Objetivos Específicos:
${data.specificObjectives || 'No especificado'}

═══════════════════════════════════════════════════════════════

MARCO TEÓRICO PRELIMINAR

Autores principales:
${data.mainAuthors || 'No especificado'}

Conceptos filosóficos clave:
${data.keyConcepts || 'No especificado'}

Antecedentes teóricos:
${data.theoreticalBackground || 'No especificado'}

═══════════════════════════════════════════════════════════════

METODOLOGÍA

${data.methodology || 'No especificado'}

Fuentes primarias principales:
${data.primarySources || 'No especificado'}

Fuentes secundarias:
${data.secondarySources || 'No especificado'}

═══════════════════════════════════════════════════════════════

ESTRUCTURA TENTATIVA DE LA TESIS

${data.thesisStructure || 'No especificado'}

═══════════════════════════════════════════════════════════════

CRONOGRAMA DE TRABAJO

${data.timeline || 'No especificado'}

═══════════════════════════════════════════════════════════════

BIBLIOGRAFÍA PRELIMINAR

Fuentes Primarias:
${data.primaryBibliography || 'No especificado'}

Fuentes Secundarias:
${data.secondaryBibliography || 'No especificado'}

═══════════════════════════════════════════════════════════════

Fecha de generación: ${new Date().toLocaleDateString('es-AR', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
})}
    `.trim();
    
    // Crear y descargar archivo
    const blob = new Blob([documentContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Proyecto_Tesis_${data.studentName.replace(/\s+/g, '_')}_${new Date().getTime()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert('✓ Documento generado y descargado exitosamente');
}

// Configurar botones de asistencia IA
function setupAIAssistButtons() {
    document.getElementById('aiTitleSuggestion').addEventListener('click', () => aiAssist('title'));
    document.getElementById('aiProblemHelp').addEventListener('click', () => aiAssist('problem'));
    document.getElementById('aiJustificationHelp').addEventListener('click', () => aiAssist('justification'));
    document.getElementById('aiObjectiveHelp').addEventListener('click', () => aiAssist('objective'));
    document.getElementById('aiSpecificObjectivesHelp').addEventListener('click', () => aiAssist('specificObjectives'));
    document.getElementById('aiAuthorsHelp').addEventListener('click', () => aiAssist('authors'));
    document.getElementById('aiConceptsHelp').addEventListener('click', () => aiAssist('concepts'));
    document.getElementById('aiBackgroundHelp').addEventListener('click', () => aiAssist('background'));
    document.getElementById('aiMethodologyHelp').addEventListener('click', () => aiAssist('methodology'));
    document.getElementById('aiStructureHelp').addEventListener('click', () => aiAssist('structure'));
    document.getElementById('aiTimelineHelp').addEventListener('click', () => aiAssist('timeline'));
    document.getElementById('aiPrimaryBibHelp').addEventListener('click', () => aiAssist('primaryBib'));
    document.getElementById('aiSecondaryBibHelp').addEventListener('click', () => aiAssist('secondaryBib'));
}

// Asistencia IA para el proyecto
async function aiAssist(type) {
    const data = collectProjectData();
    let prompt = '';
    let targetField = '';
    
    switch(type) {
        case 'title':
            if (!data.problemStatement) {
                alert('Por favor, completá primero el planteo del problema para que pueda sugerir títulos relevantes.');
                return;
            }
            prompt = `Basándote en el siguiente planteo del problema filosófico, sugerí 3 posibles títulos para una tesis de licenciatura en filosofía. Los títulos deben ser claros, académicos y específicos.

Planteo del problema:
${data.problemStatement}

Proporcioná 3 opciones de títulos, cada uno en una línea nueva, precedido por un número.`;
            break;
            
        case 'problem':
            if (!data.thesisTitle && !data.researchQuestion) {
                alert('Por favor, completá primero el título o la pregunta de investigación.');
                return;
            }
            prompt = `Ayudame a desarrollar el planteo del problema para una tesis de filosofía con la siguiente información:

Título: ${data.thesisTitle || 'No especificado'}
Pregunta de investigación: ${data.researchQuestion || 'No especificado'}

Proporcioná un planteo del problema bien estructurado de 300-400 palabras que explique la cuestión filosófica, su relevancia y delimitación.`;
            targetField = 'problemStatement';
            break;
            
        case 'justification':
            if (!data.problemStatement) {
                alert('Por favor, completá primero el planteo del problema.');
                return;
            }
            prompt = `Basándote en el siguiente planteo del problema, ayudame a redactar una justificación académica (200-300 palabras) que explique la relevancia teórica y práctica de esta investigación:

${data.problemStatement}`;
            targetField = 'justification';
            break;
            
        case 'objective':
            if (!data.researchQuestion) {
                alert('Por favor, completá primero la pregunta de investigación.');
                return;
            }
            prompt = `Basándote en la siguiente pregunta de investigación, sugerí un objetivo general claro y alcanzable para una tesis de licenciatura:

${data.researchQuestion}

El objetivo debe comenzar con un verbo en infinitivo apropiado para investigación filosófica.`;
            targetField = 'generalObjective';
            break;
            
        case 'specificObjectives':
            if (!data.generalObjective) {
                alert('Por favor, completá primero el objetivo general.');
                return;
            }
            prompt = `Basándote en el siguiente objetivo general, sugerí 4 objetivos específicos que permitan alcanzarlo:

Objetivo general: ${data.generalObjective}

Cada objetivo específico debe ser claro, concreto y comenzar con un verbo en infinitivo.`;
            targetField = 'specificObjectives';
            break;
            
        case 'authors':
            if (!data.thesisTitle && !data.problemStatement) {
                alert('Por favor, completá primero el título o el planteo del problema.');
                return;
            }
            prompt = `Basándote en el siguiente tema de tesis, sugerí los 3-5 autores principales que sería relevante trabajar:

Título: ${data.thesisTitle || 'No especificado'}
Problema: ${data.problemStatement || 'No especificado'}

Para cada autor, explicá brevemente por qué es relevante para esta investigación.`;
            targetField = 'mainAuthors';
            break;
            
        case 'concepts':
            if (!data.thesisTitle && !data.problemStatement) {
                alert('Por favor, completá primero el título o el planteo del problema.');
                return;
            }
            prompt = `Basándote en el siguiente tema de tesis, identificá los 5-8 conceptos filosóficos clave que deberían trabajarse:

Título: ${data.thesisTitle || 'No especificado'}
Problema: ${data.problemStatement || 'No especificado'}

Listá los conceptos con una breve definición o explicación de su relevancia.`;
            targetField = 'keyConcepts';
            break;
            
        case 'background':
            if (!data.thesisTitle) {
                alert('Por favor, completá primero el título de la tesis.');
                return;
            }
            prompt = `Ayudame a redactar una descripción de los antecedentes teóricos (200-300 palabras) para una tesis sobre:

${data.thesisTitle}

Incluí el estado actual del debate, principales posiciones existentes y qué se ha dicho sobre el tema.`;
            targetField = 'theoreticalBackground';
            break;
            
        case 'methodology':
            if (!data.problemStatement && !data.thesisTitle) {
                alert('Por favor, completá primero el título o el planteo del problema.');
                return;
            }
            prompt = `Ayudame a redactar la metodología (200-300 palabras) para la siguiente investigación filosófica:

Título: ${data.thesisTitle || 'No especificado'}
Problema: ${data.problemStatement || 'No especificado'}

Explicá qué método filosófico es apropiado y cómo se abordará la investigación.`;
            targetField = 'methodology';
            break;
            
        case 'structure':
            if (!data.specificObjectives) {
                alert('Por favor, completá primero los objetivos específicos.');
                return;
            }
            prompt = `Basándote en los siguientes objetivos, sugerí una estructura tentativa (índice) para la tesis con introducción, 3 capítulos con subsecciones, y conclusión:

Objetivo general: ${data.generalObjective}

Objetivos específicos:
${data.specificObjectives}

Proporcioná un índice claro y lógico.`;
            targetField = 'thesisStructure';
            break;
            
        case 'timeline':
            if (!data.thesisStructure) {
                alert('Por favor, completá primero la estructura tentativa para sugerir un cronograma apropiado.');
                return;
            }
            prompt = `Basándote en la siguiente estructura de tesis, sugerí un cronograma de trabajo realista para 12 meses:

Estructura:
${data.thesisStructure}

Distribuí el tiempo considerando: lectura de fuentes, escritura de capítulos, revisiones y correcciones finales.`;
            targetField = 'timeline';
            break;
            
        case 'primaryBib':
            if (!data.mainAuthors && !data.thesisTitle) {
                alert('Por favor, completá primero el título o los autores principales.');
                return;
            }
            prompt = `Sugerí 5-8 fuentes primarias (obras originales) en formato APA para una tesis sobre:

Título: ${data.thesisTitle || 'No especificado'}
Autores principales: ${data.mainAuthors || 'No especificado'}

Incluí las obras más importantes y relevantes. Formato APA 7ª edición. NO uses asteriscos ni marcas de formato, solo texto limpio.`;
            targetField = 'primaryBibliography';
            break;
            
        case 'secondaryBib':
            if (!data.mainAuthors && !data.thesisTitle) {
                alert('Por favor, completá primero el título o los autores principales.');
                return;
            }
            prompt = `Sugerí 10-12 fuentes secundarias (comentadores, estudios críticos, artículos académicos) en formato APA para una tesis sobre:

Título: ${data.thesisTitle || 'No especificado'}
Autores principales: ${data.mainAuthors || 'No especificado'}
Área: ${data.thematicArea || 'No especificado'}

Incluí libros de comentadores reconocidos y artículos de revistas académicas. Formato APA 7ª edición. NO uses asteriscos ni marcas de formato, solo texto limpio.`;
            targetField = 'secondaryBibliography';
            break;
    }
    
    // Llamar a la IA
    const button = event.target;
    const originalText = button.textContent;
    button.disabled = true;
    button.textContent = '⏳ Generando...';
    
    try {
        const response = await callGeminiAPI(
            'Sos un experto en metodología de tesis en filosofía. Ayudás a estudiantes a desarrollar sus proyectos de tesis. Usá el voseo argentino. NO uses formato markdown con asteriscos o guiones bajos, escribí el texto de forma natural sin marcas de formato.',
            [{ role: 'user', parts: [{ text: prompt }] }]
        );
        
        // Limpiar formato markdown del texto
        const cleanText = cleanMarkdown(response);
        
        if (type === 'title') {
            alert('Sugerencias de títulos:\n\n' + cleanText);
        } else if (targetField) {
            if (confirm('¿Querés usar este contenido generado? Se copiará en el campo correspondiente.\n\nPodés revisarlo y modificarlo después.')) {
                document.getElementById(targetField).value = cleanText;
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

// Función para limpiar formato markdown
function cleanMarkdown(text) {
    // Remover marcas de negrita
    text = text.replace(/\*\*(.+?)\*\*/g, '$1');
    text = text.replace(/__(.+?)__/g, '$1');
    
    // Remover marcas de cursiva
    text = text.replace(/\*(.+?)\*/g, '$1');
    text = text.replace(/_(.+?)_/g, '$1');
    
    // Remover marcas de código
    text = text.replace(/`(.+?)`/g, '$1');
    
    // Remover encabezados markdown
    text = text.replace(/^#{1,6}\s+/gm, '');
    
    return text;
}
