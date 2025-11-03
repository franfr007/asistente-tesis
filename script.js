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

// Función para formatear mensajes (convertir markdown básico a HTML)
function formatMessage(text) {
    // Convertir saltos de línea
    let formatted = text.replace(/\n\n/g, '</p><p>');
    formatted = '<p>' + formatted + '</p>';
    
    // Convertir negritas
    formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    
    // Convertir cursivas
    formatted = formatted.replace(/\*(.+?)\*/g, '<em>$1</em>');
    
    // Convertir listas
    formatted = formatted.replace(/<p>[-•]\s*(.+?)<\/p>/g, '<li>$1</li>');
    
    // Envolver listas en ul
    formatted = formatted.replace(/(<li>.*<\/li>)/s, function(match) {
        return '<ul>' + match + '</ul>';
    });
    
    // Convertir títulos (líneas que empiezan con #)
    formatted = formatted.replace(/<p>###\s*(.+?)<\/p>/g, '<h4>$1</h4>');
    formatted = formatted.replace(/<p>##\s*(.+?)<\/p>/g, '<h3>$1</h3>');
    formatted = formatted.replace(/<p>#\s*(.+?)<\/p>/g, '<h2>$1</h2>');
    
    // Limpiar párrafos vacíos
    formatted = formatted.replace(/<p>\s*<\/p>/g, '');
    
    return formatted;
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
