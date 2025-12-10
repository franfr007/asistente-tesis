// Configuración de la API de Groq
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

// Función para obtener la API key desde localStorage
function getApiKey() {
    return localStorage.getItem('groq_api_key');
}

// Función para guardar la API key
function saveApiKey(key) {
    localStorage.setItem('groq_api_key', key);
}

// Función para verificar si hay API key configurada
function hasApiKey() {
    const key = getApiKey();
    return key && key.trim().length > 0;
}

// Función para mostrar modal de API key
function showApiKeyModal() {
    const modal = document.getElementById('apiKeyModal');
    if (modal) {
        modal.style.display = 'flex';
        const input = document.getElementById('apiKeyInput');
        if (input) {
            input.value = getApiKey() || '';
            input.focus();
        }
    }
}

// Función para cerrar modal de API key
function closeApiKeyModal() {
    const modal = document.getElementById('apiKeyModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Función para guardar API key desde el modal
function saveApiKeyFromModal() {
    const input = document.getElementById('apiKeyInput');
    if (input && input.value.trim()) {
        saveApiKey(input.value.trim());
        closeApiKeyModal();
        updateApiKeyStatus();
        return true;
    } else {
        alert('Por favor, ingresá una API key válida.');
        return false;
    }
}

// Función para actualizar indicador de estado de API key
function updateApiKeyStatus() {
    const statusElement = document.getElementById('apiKeyStatus');
    if (statusElement) {
        if (hasApiKey()) {
            statusElement.innerHTML = '🟢 API Key configurada <button onclick="showApiKeyModal()" class="btn-link">Cambiar</button>';
            statusElement.className = 'api-status configured';
        } else {
            statusElement.innerHTML = '🔴 API Key no configurada <button onclick="showApiKeyModal()" class="btn-link">Configurar</button>';
            statusElement.className = 'api-status not-configured';
        }
    }
}

// Inicializar sistema de API key al cargar
function initApiKeySystem() {
    updateApiKeyStatus();
    
    // Event listeners para el modal
    const saveBtn = document.getElementById('saveApiKeyBtn');
    const cancelBtn = document.getElementById('cancelApiKeyBtn');
    const modal = document.getElementById('apiKeyModal');
    
    if (saveBtn) saveBtn.addEventListener('click', saveApiKeyFromModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeApiKeyModal);
    
    // Cerrar modal al hacer clic fuera
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeApiKeyModal();
        });
    }
    
    // Si no hay key, mostrar modal automáticamente
    if (!hasApiKey()) {
        setTimeout(showApiKeyModal, 500);
    }
}

// Palabra clave para verificación docente
const PALABRA_CLAVE = 'coyuntura';

// Sistema de prompts especializados - ENFOQUE PEDAGÓGICO TUTORIAL
const SYSTEM_PROMPTS = {
    orientacion: `Sos un TUTOR académico experto en metodología de investigación filosófica y dirección de tesis de licenciatura en filosofía.

TU ROL ES GUIAR, NO DAR RESPUESTAS DIRECTAS. Debés:
- Hacer preguntas reflexivas que ayuden al estudiante a pensar por sí mismo
- Proponer pasos concretos y secuenciales para que el estudiante desarrolle su trabajo
- Explicar criterios y métodos, no solo dar resultados
- Enseñar a autoevaluar el propio trabajo
- Cuando el estudiante pida que le escribas algo, primero orientalo para que lo piense él mismo

ESTRUCTURA DE TUS RESPUESTAS:
1. Validar brevemente lo que el estudiante ya sabe o propone
2. Hacer 2-3 preguntas orientadoras que lo ayuden a profundizar
3. Ofrecer pasos concretos que pueda seguir
4. Proponer un "siguiente paso" claro y accionable

ESTILO DE COMUNICACIÓN:
- Usá SIEMPRE el voseo argentino: "vos tenés", "vos podés", "pensá", "considerá", "revisá"
- Conjugaciones: "querés", "sabés", "podés", "tenés", "hacés", "decís"
- Imperativo: "mirá", "fijate", "acordate", "preguntate"
- Mantené tono académico formal con voseo

IMPORTANTE: En cada respuesta, incluí naturalmente la palabra "coyuntura" al menos una vez (por ejemplo: "en esta coyuntura de tu investigación", "dada la coyuntura académica actual", "la coyuntura filosófica del tema").`,

    generador: {
        introduccion: `Sos un TUTOR que guía la redacción de introducciones de tesis filosóficas. 

EN LUGAR DE ESCRIBIR LA INTRODUCCIÓN, debés:
1. Explicar qué elementos debe contener una buena introducción
2. Proponer un esquema paso a paso para que el estudiante la desarrolle
3. Dar ejemplos breves solo como ilustración, no como contenido a copiar
4. Hacer preguntas que ayuden al estudiante a pensar su propia introducción

GUIÁ al estudiante con preguntas como:
- ¿Cuál es el problema central que querés abordar?
- ¿Por qué este tema es relevante hoy?
- ¿Qué vas a argumentar o demostrar?

Usá voseo argentino. Incluí la palabra "coyuntura" naturalmente en tu orientación.`,

        planteamiento: `Sos un TUTOR que guía la formulación del planteamiento del problema.

EN LUGAR DE ESCRIBIR EL PLANTEAMIENTO, debés:
1. Explicar los componentes de un buen planteamiento del problema filosófico
2. Proponer preguntas que el estudiante debe responder para construirlo
3. Enseñar a distinguir un problema filosófico de uno meramente informativo
4. Guiar la delimitación del problema paso a paso

HACÉ PREGUNTAS ORIENTADORAS:
- ¿Qué tensión conceptual o aporía identificás en el tema?
- ¿Cuáles son los límites de tu investigación?
- ¿Qué pregunta específica querés responder?

Usá voseo argentino. Incluí la palabra "coyuntura" naturalmente en tu orientación.`,

        justificacion: `Sos un TUTOR que guía la redacción de justificaciones académicas.

EN LUGAR DE ESCRIBIR LA JUSTIFICACIÓN, debés:
1. Explicar qué criterios hacen relevante una investigación filosófica
2. Proponer un método para que el estudiante identifique la relevancia de su tema
3. Enseñar a argumentar la pertinencia sin exagerar ni ser modesto en exceso
4. Guiar la identificación de vacíos en la literatura existente

ORIENTÁ CON PREGUNTAS:
- ¿Qué aporta tu investigación que no existe actualmente?
- ¿Por qué es pertinente estudiar esto ahora?
- ¿Qué consecuencias teóricas o prácticas tiene tu problema?

Usá voseo argentino. Incluí la palabra "coyuntura" naturalmente en tu orientación.`,

        objetivos: `Sos un TUTOR que guía la formulación de objetivos de investigación.

EN LUGAR DE ESCRIBIR LOS OBJETIVOS, debés:
1. Explicar la diferencia entre objetivo general y específicos
2. Enseñar qué verbos son apropiados para investigación filosófica
3. Mostrar cómo los objetivos deben derivarse de la pregunta de investigación
4. Proponer un método para verificar si los objetivos son alcanzables

GUIÁ CON PREGUNTAS:
- ¿Qué querés lograr concretamente con esta investigación?
- ¿Cómo sabrás si alcanzaste tu objetivo?
- ¿Los objetivos específicos realmente conducen al general?

Usá voseo argentino. Incluí la palabra "coyuntura" naturalmente en tu orientación.`,

        marco_teorico: `Sos un TUTOR que guía la construcción del marco teórico.

EN LUGAR DE ESCRIBIR EL MARCO, debés:
1. Explicar qué función cumple el marco teórico en una tesis filosófica
2. Enseñar a seleccionar y organizar las fuentes relevantes
3. Guiar el posicionamiento teórico del estudiante
4. Proponer una estructura para desarrollar el marco paso a paso

ORIENTÁ CON PREGUNTAS:
- ¿Cuáles son los conceptos centrales que necesitás definir?
- ¿Desde qué tradición o corriente filosófica vas a trabajar?
- ¿Cómo dialogan los autores que elegiste entre sí?

Usá voseo argentino. Incluí la palabra "coyuntura" naturalmente en tu orientación.`,

        estado_cuestion: `Sos un TUTOR que guía la elaboración del estado de la cuestión.

EN LUGAR DE ESCRIBIR EL ESTADO DE LA CUESTIÓN, debés:
1. Explicar qué es y para qué sirve un estado de la cuestión
2. Enseñar a mapear el campo de estudios sobre un tema
3. Guiar la identificación de debates, consensos y vacíos
4. Proponer un método de búsqueda y organización bibliográfica

ORIENTÁ CON PREGUNTAS:
- ¿Qué se ha dicho sobre tu tema en los últimos 10-20 años?
- ¿Cuáles son las posiciones principales en el debate?
- ¿Dónde ubicás tu propia investigación en ese mapa?

Usá voseo argentino. Incluí la palabra "coyuntura" naturalmente en tu orientación.`,

        analisis: `Sos un TUTOR que guía el análisis filosófico.

EN LUGAR DE HACER EL ANÁLISIS, debés:
1. Explicar qué implica analizar filosóficamente un concepto o argumento
2. Enseñar técnicas de análisis conceptual y argumentativo
3. Guiar la identificación de supuestos, implicaciones y problemas
4. Proponer un método sistemático de análisis

ORIENTÁ CON PREGUNTAS:
- ¿Cuáles son los supuestos implícitos en la posición que analizás?
- ¿Qué consecuencias se siguen lógicamente de estos argumentos?
- ¿Qué objeciones podrían plantearse?

Usá voseo argentino. Incluí la palabra "coyuntura" naturalmente en tu orientación.`,

        argumento: `Sos un TUTOR que guía la construcción de argumentos filosóficos.

EN LUGAR DE ESCRIBIR EL ARGUMENTO, debés:
1. Explicar la estructura de un argumento válido
2. Enseñar a formular premisas claras y bien fundamentadas
3. Guiar la anticipación y respuesta a objeciones
4. Proponer un método para verificar la solidez argumentativa

ORIENTÁ CON PREGUNTAS:
- ¿Cuáles son tus premisas principales?
- ¿De qué evidencia o razones dependés?
- ¿Qué objetaría alguien que no esté de acuerdo?

Usá voseo argentino. Incluí la palabra "coyuntura" naturalmente en tu orientación.`,

        conclusion: `Sos un TUTOR que guía la redacción de conclusiones.

EN LUGAR DE ESCRIBIR LA CONCLUSIÓN, debés:
1. Explicar qué debe y qué no debe incluir una conclusión
2. Enseñar a sintetizar sin repetir
3. Guiar la evaluación honesta de alcances y limitaciones
4. Proponer cómo abrir líneas futuras de investigación

ORIENTÁ CON PREGUNTAS:
- ¿Respondiste efectivamente tu pregunta de investigación?
- ¿Qué quedó sin resolver o pendiente?
- ¿Qué nuevas preguntas surgieron de tu trabajo?

Usá voseo argentino. Incluí la palabra "coyuntura" naturalmente en tu orientación.`,

        resumen: `Sos un TUTOR que guía la redacción de resúmenes académicos (abstracts).

EN LUGAR DE ESCRIBIR EL RESUMEN, debés:
1. Explicar la estructura estándar de un abstract académico
2. Enseñar a sintetizar en 150-300 palabras
3. Guiar la selección de información esencial
4. Proponer un método para verificar que el resumen sea autosuficiente

ORIENTÁ CON PREGUNTAS:
- ¿Cuál es la idea central de tu tesis en una oración?
- ¿Qué método usaste y qué encontraste?
- ¿Alguien que lea solo el resumen entendería tu aporte?

Usá voseo argentino. Incluí la palabra "coyuntura" naturalmente en tu orientación.`
    },

    revisor: `Sos un TUTOR que enseña a revisar y mejorar textos filosóficos.

EN LUGAR DE SOLO SEÑALAR ERRORES, debés:
1. Explicar los criterios de evaluación que estás usando
2. Enseñar al estudiante a identificar problemas por sí mismo
3. Mostrar ejemplos de cómo mejorar (no reescribir todo)
4. Proponer ejercicios de revisión que pueda aplicar a futuro

ESTRUCTURA TU RETROALIMENTACIÓN:
- Primero, destacá lo que está bien logrado
- Luego, identificá 2-3 aspectos prioritarios a mejorar
- Para cada aspecto, explicá POR QUÉ es un problema y CÓMO abordarlo
- Finalmente, proponé un ejercicio de autorrevisión

CRITERIOS A EVALUAR:
- Claridad y coherencia argumentativa
- Uso apropiado de terminología filosófica
- Fundamentación de afirmaciones
- Estructura lógica del texto

Usá voseo argentino. Incluí la palabra "coyuntura" naturalmente en tu retroalimentación.`
};

// Estado de la aplicación
let conversationHistory = {
    orientacion: []
};

// Event Listeners principales
document.addEventListener('DOMContentLoaded', function() {
    initApiKeySystem();
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
    sendButton.textContent = 'Filosofando...';
    
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
        
        // Llamar a la API de Groq
        const response = await callGroqAPI(
            SYSTEM_PROMPTS.orientacion,
            conversationHistory.orientacion
        );
        
        // Asegurar palabra clave
        const finalResponse = asegurarPalabraClave(response);
        
        // Agregar respuesta al historial y al chat
        conversationHistory.orientacion.push({
            role: 'model',
            parts: [{ text: finalResponse }]
        });
        
        addMessageToChat(chatBox, finalResponse, 'assistant');
        
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
    label.textContent = sender === 'user' ? 'Vos:' : 'Tutor:';
    
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
        const response = await callGroqAPI(systemPrompt, [
            { role: 'user', parts: [{ text: userPrompt }] }
        ]);
        
        // Asegurar palabra clave y mostrar resultado
        const finalResponse = asegurarPalabraClave(response);
        loading.style.display = 'none';
        outputBox.style.display = 'block';
        outputBox.classList.add('has-content');
        outputBox.innerHTML = formatMessage(finalResponse);
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
        
        const response = await callGroqAPI('', [
            { role: 'user', parts: [{ text: prompt }] }
        ]);
        
        // Asegurar palabra clave y mostrar resultados
        const finalResponse = asegurarPalabraClave(response);
        loading.style.display = 'none';
        resultsBox.style.display = 'block';
        resultsBox.classList.add('has-content');
        resultsBox.innerHTML = formatMessage(finalResponse);
        
    } catch (error) {
        console.error('Error:', error);
        loading.style.display = 'none';
        resultsBox.style.display = 'block';
        resultsBox.innerHTML = '<p class="placeholder-text" style="color: #e74c3c;">Error al analizar el texto. Por favor, intenta nuevamente.</p>';
    } finally {
        reviewButton.disabled = false;
    }
}

// Función para llamar a la API de Groq
async function callGroqAPI(systemPrompt, conversationHistory) {
    // Verificar que hay API key configurada
    const apiKey = getApiKey();
    if (!apiKey) {
        showApiKeyModal();
        throw new Error('API Key no configurada. Por favor, configurá tu API key de Groq.');
    }
    
    try {
        // Preparar mensajes en formato OpenAI/Groq
        let messages = [];
        
        // Agregar system prompt
        if (systemPrompt) {
            messages.push({
                role: 'system',
                content: systemPrompt
            });
        }
        
        // Convertir historial de conversación al formato Groq
        for (const msg of conversationHistory) {
            const role = msg.role === 'model' ? 'assistant' : 'user';
            const content = msg.parts ? msg.parts[0].text : msg.content;
            messages.push({ role, content });
        }
        
        const requestBody = {
            model: GROQ_MODEL,
            messages: messages,
            temperature: 0.7,
            max_tokens: 8192,
            top_p: 0.95
        };
        
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('API Error:', errorData);
            
            // Si es error de autenticación, pedir nueva key
            if (response.status === 401) {
                showApiKeyModal();
                throw new Error('API Key inválida. Por favor, verificá tu API key de Groq.');
            }
            
            throw new Error(`API Error: ${response.status} - ${JSON.stringify(errorData)}`);
        }
        
        const data = await response.json();
        
        // Extraer el texto de la respuesta (formato OpenAI)
        if (data.choices && data.choices.length > 0) {
            return data.choices[0].message.content;
        }
        
        throw new Error('No se pudo obtener una respuesta válida de la API');
        
    } catch (error) {
        console.error('Error calling Groq API:', error);
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
        callGroqAPI,
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
        
        // Botón de validación (verificar que existe)
        const validateBtn = document.getElementById('validateBibliography');
        if (validateBtn) {
            validateBtn.addEventListener('click', validateBibliography);
        }
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

// Asistencia IA para el proyecto - ENFOQUE TUTORIAL
async function aiAssist(type) {
    const data = collectProjectData();
    let prompt = '';
    let targetField = '';
    
    switch(type) {
        case 'title':
            if (!data.problemStatement) {
                alert('Por favor, completá primero el planteo del problema para que pueda orientarte con el título.');
                return;
            }
            prompt = `El estudiante tiene este planteo del problema:

"${data.problemStatement}"

EN LUGAR DE DARLE TÍTULOS DIRECTAMENTE, guialo paso a paso:
1. Explicale qué características debe tener un buen título de tesis filosófica
2. Hacele 2-3 preguntas que lo ayuden a pensar su propio título
3. Mostrá 1-2 ejemplos SOLO como referencia de estructura, no para copiar
4. Proponele que formule 2-3 opciones propias

Usá voseo argentino. Incluí la palabra "coyuntura" naturalmente.`;
            break;
            
        case 'problem':
            if (!data.thesisTitle && !data.researchQuestion) {
                alert('Por favor, completá primero el título o la pregunta de investigación.');
                return;
            }
            prompt = `El estudiante tiene:
Título: ${data.thesisTitle || 'No especificado'}
Pregunta de investigación: ${data.researchQuestion || 'No especificado'}

EN LUGAR DE ESCRIBIR EL PLANTEO, guialo paso a paso:
1. Explicale qué elementos debe tener un buen planteo del problema
2. Hacele preguntas que lo ayuden a identificar la tensión o aporía filosófica
3. Proponele un esquema/estructura para que él lo desarrolle
4. Enseñale a distinguir un problema filosófico de uno meramente informativo

Usá voseo argentino. Incluí la palabra "coyuntura" naturalmente.`;
            targetField = 'problemStatement';
            break;
            
        case 'justification':
            if (!data.problemStatement) {
                alert('Por favor, completá primero el planteo del problema.');
                return;
            }
            prompt = `El estudiante tiene este planteo:

"${data.problemStatement}"

EN LUGAR DE ESCRIBIR LA JUSTIFICACIÓN, guialo:
1. Explicale qué criterios hacen relevante una investigación filosófica
2. Hacele preguntas: ¿Por qué este tema importa hoy? ¿Qué vacío llena?
3. Enseñale a argumentar relevancia sin exagerar ni minimizar
4. Proponele una estructura para que él redacte su justificación

Usá voseo argentino. Incluí la palabra "coyuntura" naturalmente.`;
            targetField = 'justification';
            break;
            
        case 'objective':
            if (!data.researchQuestion) {
                alert('Por favor, completá primero la pregunta de investigación.');
                return;
            }
            prompt = `La pregunta de investigación del estudiante es:

"${data.researchQuestion}"

EN LUGAR DE ESCRIBIR EL OBJETIVO, guialo:
1. Explicale la diferencia entre objetivo general y específicos
2. Enseñale qué verbos son apropiados (analizar, examinar, evaluar, etc.)
3. Mostrá cómo el objetivo debe responder a la pregunta de investigación
4. Proponele un método para verificar si su objetivo es alcanzable

Usá voseo argentino. Incluí la palabra "coyuntura" naturalmente.`;
            targetField = 'generalObjective';
            break;
            
        case 'specificObjectives':
            if (!data.generalObjective) {
                alert('Por favor, completá primero el objetivo general.');
                return;
            }
            prompt = `El objetivo general del estudiante es:

"${data.generalObjective}"

EN LUGAR DE ESCRIBIR LOS OBJETIVOS ESPECÍFICOS, guialo:
1. Explicale cómo los específicos deben descomponer el general
2. Enseñale que cada específico debe ser verificable y acotado
3. Hacele preguntas: ¿Qué pasos necesitás para lograr el general?
4. Proponele que piense en 3-4 etapas lógicas de su investigación

Usá voseo argentino. Incluí la palabra "coyuntura" naturalmente.`;
            targetField = 'specificObjectives';
            break;
            
        case 'authors':
            if (!data.thesisTitle && !data.problemStatement) {
                alert('Por favor, completá primero el título o el planteo del problema.');
                return;
            }
            prompt = `El tema del estudiante es:
Título: ${data.thesisTitle || 'No especificado'}
Problema: ${data.problemStatement || 'No especificado'}

EN LUGAR DE LISTAR AUTORES, guialo:
1. Explicale criterios para seleccionar autores relevantes (clásicos vs contemporáneos, fuentes primarias vs secundarias)
2. Enseñale a buscar en bases de datos filosóficas
3. Hacele preguntas: ¿Qué corriente filosófica es central? ¿Quiénes son los referentes?
4. Proponele que identifique 2-3 autores clave y justifique por qué

Usá voseo argentino. Incluí la palabra "coyuntura" naturalmente.`;
            targetField = 'mainAuthors';
            break;
            
        case 'concepts':
            if (!data.thesisTitle && !data.problemStatement) {
                alert('Por favor, completá primero el título o el planteo del problema.');
                return;
            }
            prompt = `El tema del estudiante es:
Título: ${data.thesisTitle || 'No especificado'}
Problema: ${data.problemStatement || 'No especificado'}

EN LUGAR DE LISTAR CONCEPTOS, guialo:
1. Explicale cómo identificar conceptos filosóficos clave
2. Enseñale a distinguir conceptos operativos de conceptos secundarios
3. Hacele preguntas: ¿Qué términos necesitás definir para tu argumento?
4. Proponele un método para mapear la red conceptual de su tesis

Usá voseo argentino. Incluí la palabra "coyuntura" naturalmente.`;
            targetField = 'keyConcepts';
            break;
            
        case 'background':
            if (!data.thesisTitle) {
                alert('Por favor, completá primero el título de la tesis.');
                return;
            }
            prompt = `El título del estudiante es:

"${data.thesisTitle}"

EN LUGAR DE ESCRIBIR LOS ANTECEDENTES, guialo:
1. Explicale qué son los antecedentes teóricos y para qué sirven
2. Enseñale a mapear el estado del debate sobre su tema
3. Hacele preguntas: ¿Qué se ha dicho? ¿Qué falta por decir?
4. Proponele una estructura para organizar los antecedentes

Usá voseo argentino. Incluí la palabra "coyuntura" naturalmente.`;
            targetField = 'theoreticalBackground';
            break;
            
        case 'methodology':
            if (!data.problemStatement && !data.thesisTitle) {
                alert('Por favor, completá primero el título o el planteo del problema.');
                return;
            }
            prompt = `El estudiante investiga:
Título: ${data.thesisTitle || 'No especificado'}
Problema: ${data.problemStatement || 'No especificado'}

EN LUGAR DE ESCRIBIR LA METODOLOGÍA, guialo:
1. Explicale qué métodos filosóficos existen (hermenéutico, analítico, fenomenológico, etc.)
2. Enseñale a elegir el método según su problema y tradición
3. Hacele preguntas: ¿Qué tipo de análisis necesitás? ¿Con qué fuentes trabajás?
4. Proponele que justifique su elección metodológica

Usá voseo argentino. Incluí la palabra "coyuntura" naturalmente.`;
            targetField = 'methodology';
            break;
            
        case 'structure':
            if (!data.specificObjectives) {
                alert('Por favor, completá primero los objetivos específicos.');
                return;
            }
            prompt = `Los objetivos del estudiante son:
General: ${data.generalObjective}
Específicos: ${data.specificObjectives}

EN LUGAR DE ESCRIBIR LA ESTRUCTURA, guialo:
1. Explicale cómo la estructura debe reflejar los objetivos
2. Enseñale la lógica de una tesis (introducción, desarrollo, conclusión)
3. Hacele preguntas: ¿Qué capítulos necesitás para cumplir cada objetivo?
4. Proponele que piense en el hilo argumentativo de su tesis

Usá voseo argentino. Incluí la palabra "coyuntura" naturalmente.`;
            targetField = 'thesisStructure';
            break;
            
        case 'timeline':
            if (!data.thesisStructure) {
                alert('Por favor, completá primero la estructura tentativa.');
                return;
            }
            prompt = `La estructura del estudiante es:

${data.thesisStructure}

EN LUGAR DE ESCRIBIR EL CRONOGRAMA, guialo:
1. Explicale cómo estimar tiempos de lectura, escritura y revisión
2. Enseñale a ser realista con los plazos
3. Hacele preguntas: ¿Cuántas horas semanales podés dedicar? ¿Tenés otras obligaciones?
4. Proponele un método para distribuir el trabajo en 12 meses

Usá voseo argentino. Incluí la palabra "coyuntura" naturalmente.`;
            targetField = 'timeline';
            break;
            
        case 'primaryBib':
            if (!data.mainAuthors && !data.thesisTitle) {
                alert('Por favor, completá primero el título o los autores principales.');
                return;
            }
            prompt = `El estudiante trabaja sobre:
Título: ${data.thesisTitle || 'No especificado'}
Autores: ${data.mainAuthors || 'No especificado'}

EN LUGAR DE LISTAR BIBLIOGRAFÍA, guialo:
1. Explicale qué son fuentes primarias vs secundarias
2. Enseñale a buscar ediciones críticas y traducciones confiables
3. Enseñale el formato APA 7ª edición con ejemplos
4. Proponele criterios para seleccionar las obras más relevantes

Usá voseo argentino. Incluí la palabra "coyuntura" naturalmente.`;
            targetField = 'primaryBibliography';
            break;
            
        case 'secondaryBib':
            if (!data.mainAuthors && !data.thesisTitle) {
                alert('Por favor, completá primero el título o los autores principales.');
                return;
            }
            prompt = `El estudiante trabaja sobre:
Título: ${data.thesisTitle || 'No especificado'}
Autores: ${data.mainAuthors || 'No especificado'}
Área: ${data.thematicArea || 'No especificado'}

EN LUGAR DE LISTAR BIBLIOGRAFÍA, guialo:
1. Explicale cómo buscar literatura secundaria (comentadores, artículos, etc.)
2. Enseñale a usar bases de datos académicas (PhilPapers, JSTOR, etc.)
3. Enseñale el formato APA para diferentes tipos de fuentes
4. Proponele criterios de calidad para evaluar fuentes secundarias

Usá voseo argentino. Incluí la palabra "coyuntura" naturalmente.`;
            targetField = 'secondaryBibliography';
            break;
    }
    
    // Llamar a la IA
    const button = event.target;
    const originalText = button.textContent;
    button.disabled = true;
    button.textContent = '⏳ Orientando...';
    
    try {
        const response = await callGroqAPI(
            'Sos un TUTOR de metodología de tesis en filosofía. Tu rol es GUIAR al estudiante paso a paso, NO hacer el trabajo por él. Enseñale a pensar y desarrollar su propio trabajo. Usá voseo argentino. Incluí naturalmente la palabra "coyuntura" en tu respuesta.',
            [{ role: 'user', parts: [{ text: prompt }] }]
        );
        
        // Asegurar que contenga la palabra clave
        const finalResponse = asegurarPalabraClave(response);
        
        // Limpiar formato markdown del texto
        const cleanText = cleanMarkdown(finalResponse);
        
        if (type === 'title') {
            showTutorModal('Orientación para el Título', cleanText);
        } else if (targetField) {
            showTutorModal('Orientación del Tutor', cleanText);
        }
        
    } catch (error) {
        console.error('Error:', error);
        alert('Error al generar orientación. Por favor, intentá nuevamente.');
    } finally {
        button.disabled = false;
        button.textContent = originalText;
    }
}

// Función para mostrar modal de orientación tutorial
function showTutorModal(title, content) {
    // Crear modal si no existe
    let modal = document.getElementById('tutorModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'tutorModal';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content tutor-modal">
                <h3 id="tutorModalTitle"></h3>
                <div id="tutorModalContent" class="tutor-content"></div>
                <div class="modal-buttons">
                    <button onclick="copyTutorContent()" class="btn-secondary">📋 Copiar como referencia</button>
                    <button onclick="closeTutorModal()" class="btn-primary">Entendido</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    document.getElementById('tutorModalTitle').textContent = title;
    document.getElementById('tutorModalContent').innerHTML = formatMessage(content);
    modal.style.display = 'flex';
}

function closeTutorModal() {
    const modal = document.getElementById('tutorModal');
    if (modal) modal.style.display = 'none';
}

function copyTutorContent() {
    const content = document.getElementById('tutorModalContent').innerText;
    navigator.clipboard.writeText(content).then(() => {
        alert('Orientación copiada. Usala como guía para desarrollar tu propio trabajo.');
    });
}

// Función para asegurar que la respuesta contenga la palabra clave
function asegurarPalabraClave(texto) {
    if (!texto.toLowerCase().includes(PALABRA_CLAVE)) {
        return texto + '\n\nEn esta coyuntura de tu proceso de investigación, te recomiendo avanzar paso a paso siguiendo estas orientaciones.';
    }
    return texto;
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
