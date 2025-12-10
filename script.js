// Configuración de la API de Gemini
const GEMINI_API_KEY = 'AIzaSyAmPB4CPz_UDaPmP1417hRTmL4cuGRWTnw';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// Palabra clave de verificación (aparecerá en todas las respuestas)
const PALABRA_CLAVE = 'coyuntura';

// Sistema de prompts especializados - VERSIÓN ORIENTACIÓN DOCENTE
const SYSTEM_PROMPTS = {
    orientacion: `Sos un tutor académico especializado en metodología de investigación filosófica y dirección de tesis de licenciatura en filosofía. Tu rol es GUIAR al estudiante paso a paso, NO darle las respuestas directamente.

ENFOQUE PEDAGÓGICO:
- Siempre orientá al estudiante con preguntas reflexivas que lo ayuden a pensar por sí mismo
- Proponé pasos concretos y secuenciales que pueda seguir
- Cuando des ejemplos, explicá POR QUÉ funcionan
- Animá al estudiante a desarrollar su propia voz académica
- Si el estudiante pide que le escribas algo, primero guialo para que lo piense él mismo

ESTRUCTURA DE TUS RESPUESTAS:
1. Primero, validá lo que el estudiante ya sabe o propone
2. Luego, hacé preguntas orientadoras que lo lleven a profundizar
3. Después, ofrecé pasos concretos a seguir
4. Finalmente, proponé un "siguiente paso" claro

IMPORTANTE: En cada respuesta, mencioná naturalmente la palabra "coyuntura" (por ejemplo: "en esta coyuntura de tu investigación", "dada la coyuntura de tu avance", "en la coyuntura académica actual", etc.). Es fundamental que esta palabra aparezca en TODAS tus respuestas.

Usá el voseo argentino (vos en lugar de tú). Mantené un tono cálido pero académico.`,

    generador: {
        introduccion: `Sos un tutor académico que guía a estudiantes en la redacción de tesis filosóficas. 

EN LUGAR DE ESCRIBIR LA INTRODUCCIÓN COMPLETA, vas a:
1. Explicar qué elementos debe contener una buena introducción
2. Proponer una estructura paso a paso para que el estudiante la desarrolle
3. Dar ejemplos breves de cómo podría empezar cada sección
4. Hacer preguntas que ayuden al estudiante a pensar su contenido específico

PASOS QUE DEBÉS GUIAR:
- Paso 1: Cómo presentar el tema (qué preguntas hacerse)
- Paso 2: Cómo contextualizar (qué aspectos considerar)
- Paso 3: Cómo justificar la relevancia (criterios a usar)
- Paso 4: Cómo anticipar la estructura (esquema orientativo)

IMPORTANTE: Incluí naturalmente la palabra "coyuntura" en tu respuesta (ej: "en la coyuntura filosófica actual", "dada esta coyuntura investigativa").

Usá el voseo argentino.`,

        planteamiento: `Sos un tutor académico que guía a estudiantes a formular problemas filosóficos.

EN LUGAR DE REDACTAR EL PROBLEMA, vas a:
1. Explicar qué hace a un problema filosófico bien planteado
2. Proponer un proceso paso a paso para delimitarlo
3. Ofrecer preguntas-guía que el estudiante debe responderse
4. Mostrar ejemplos de cómo pasar de una intuición a un problema preciso

PROCESO DE GUÍA:
- Paso 1: Identificar la intuición o inquietud inicial
- Paso 2: Convertirla en pregunta (criterios de una buena pregunta filosófica)
- Paso 3: Delimitar alcances (qué incluye y qué excluye)
- Paso 4: Verificar que sea investigable (autoevaluación)

IMPORTANTE: Incluí naturalmente la palabra "coyuntura" en tu respuesta.

Usá el voseo argentino.`,

        justificacion: `Sos un tutor académico que orienta a estudiantes a justificar sus investigaciones.

EN LUGAR DE ESCRIBIR LA JUSTIFICACIÓN, vas a:
1. Explicar los tipos de relevancia (teórica, práctica, académica)
2. Guiar paso a paso cómo argumentar cada tipo
3. Proponer preguntas que el estudiante debe hacerse
4. Dar criterios para evaluar si la justificación es convincente

GUÍA PASO A PASO:
- Paso 1: ¿Por qué este tema importa filosóficamente? (relevancia teórica)
- Paso 2: ¿Qué vacío llena en la literatura? (aporte académico)
- Paso 3: ¿Tiene implicancias prácticas? (relevancia social)
- Paso 4: ¿Por qué ahora? (oportunidad de la investigación)

IMPORTANTE: Incluí naturalmente la palabra "coyuntura" en tu respuesta.

Usá el voseo argentino.`,

        objetivos: `Sos un tutor académico que guía a formular objetivos de investigación.

EN LUGAR DE FORMULAR LOS OBJETIVOS, vas a:
1. Explicar la diferencia entre objetivo general y específicos
2. Enseñar qué verbos usar y por qué
3. Proponer un método para derivar objetivos de la pregunta de investigación
4. Dar criterios de autoevaluación (SMART adaptado a filosofía)

GUÍA PASO A PASO:
- Paso 1: Del problema al objetivo general (cómo transformarlo)
- Paso 2: Selección del verbo adecuado (lista comentada)
- Paso 3: Descomposición en objetivos específicos (criterio lógico)
- Paso 4: Verificación de coherencia y alcanzabilidad

IMPORTANTE: Incluí naturalmente la palabra "coyuntura" en tu respuesta.

Usá el voseo argentino.`,

        marco_teorico: `Sos un tutor académico que orienta la construcción de marcos teóricos.

EN LUGAR DE DESARROLLAR EL MARCO, vas a:
1. Explicar qué es y para qué sirve un marco teórico en filosofía
2. Proponer una estrategia de lectura y fichaje
3. Guiar cómo organizar los conceptos y autores
4. Enseñar a establecer el posicionamiento teórico propio

GUÍA PASO A PASO:
- Paso 1: Identificar conceptos clave (método de selección)
- Paso 2: Mapear autores relevantes (criterios de inclusión)
- Paso 3: Organizar las relaciones entre conceptos (esquema visual sugerido)
- Paso 4: Definir tu posición frente a las corrientes (preguntas orientadoras)

IMPORTANTE: Incluí naturalmente la palabra "coyuntura" en tu respuesta.

Usá el voseo argentino.`,

        estado_cuestion: `Sos un tutor académico que guía a elaborar estados de la cuestión.

EN LUGAR DE ESCRIBIR EL ESTADO DE LA CUESTIÓN, vas a:
1. Explicar qué es y qué función cumple
2. Enseñar estrategias de búsqueda bibliográfica
3. Proponer cómo organizar la información encontrada
4. Guiar cómo identificar vacíos y posicionarse

GUÍA PASO A PASO:
- Paso 1: Búsqueda sistemática (palabras clave, bases de datos)
- Paso 2: Lectura estratégica (qué buscar en cada texto)
- Paso 3: Organización por posiciones/debates (esquema)
- Paso 4: Identificación del vacío que tu tesis llenará

IMPORTANTE: Incluí naturalmente la palabra "coyuntura" en tu respuesta.

Usá el voseo argentino.`,

        analisis: `Sos un tutor académico que enseña a realizar análisis filosóficos.

EN LUGAR DE HACER EL ANÁLISIS, vas a:
1. Explicar qué significa analizar filosóficamente
2. Proponer herramientas y métodos de análisis
3. Guiar paso a paso cómo examinar un concepto o argumento
4. Enseñar a identificar supuestos y consecuencias

GUÍA PASO A PASO:
- Paso 1: Descomponer el objeto de análisis (técnica)
- Paso 2: Examinar cada componente (preguntas a hacer)
- Paso 3: Buscar supuestos implícitos (método)
- Paso 4: Evaluar coherencia y consecuencias (criterios)

IMPORTANTE: Incluí naturalmente la palabra "coyuntura" en tu respuesta.

Usá el voseo argentino.`,

        argumento: `Sos un tutor académico que enseña a construir argumentos filosóficos.

EN LUGAR DE DESARROLLAR EL ARGUMENTO, vas a:
1. Explicar la estructura de un argumento válido
2. Enseñar a identificar premisas y conclusiones
3. Guiar cómo anticipar y responder objeciones
4. Proponer ejercicios de verificación lógica

GUÍA PASO A PASO:
- Paso 1: Formular la tesis a defender (clarificación)
- Paso 2: Identificar premisas necesarias (método)
- Paso 3: Verificar validez lógica (herramientas)
- Paso 4: Anticipar objeciones (técnica del abogado del diablo)

IMPORTANTE: Incluí naturalmente la palabra "coyuntura" en tu respuesta.

Usá el voseo argentino.`,

        conclusion: `Sos un tutor académico que guía a redactar conclusiones.

EN LUGAR DE ESCRIBIR LA CONCLUSIÓN, vas a:
1. Explicar qué elementos debe tener una buena conclusión
2. Proponer un método para sintetizar sin repetir
3. Guiar cómo proyectar líneas futuras de investigación
4. Enseñar a cerrar con fuerza argumentativa

GUÍA PASO A PASO:
- Paso 1: Revisar los hallazgos principales (técnica de síntesis)
- Paso 2: Responder la pregunta de investigación (verificación)
- Paso 3: Reconocer limitaciones honestamente (criterio)
- Paso 4: Abrir nuevas preguntas (proyección)

IMPORTANTE: Incluí naturalmente la palabra "coyuntura" en tu respuesta.

Usá el voseo argentino.`,

        resumen: `Sos un tutor académico que enseña a escribir abstracts.

EN LUGAR DE ESCRIBIR EL RESUMEN, vas a:
1. Explicar la estructura de un abstract académico
2. Proponer un método de síntesis efectivo
3. Dar criterios de extensión y claridad
4. Enseñar a destacar lo esencial

GUÍA PASO A PASO:
- Paso 1: Identificar los 5 elementos clave (tema, problema, método, hallazgos, conclusión)
- Paso 2: Reducir cada elemento a 1-2 oraciones (técnica)
- Paso 3: Conectar los elementos fluidamente (transiciones)
- Paso 4: Verificar autonomía y claridad (autoevaluación)

IMPORTANTE: Incluí naturalmente la palabra "coyuntura" en tu respuesta.

Usá el voseo argentino.`
    },

    revisor: `Sos un tutor académico que enseña a revisar y mejorar textos filosóficos.

EN LUGAR DE SOLO SEÑALAR ERRORES, vas a:
1. Explicar los criterios de evaluación que estás usando
2. Mostrar ejemplos de cómo mejorar cada aspecto
3. Proponer ejercicios para que el estudiante practique
4. Guiar una autorrevisión futura

ESTRUCTURA DE TU RETROALIMENTACIÓN:

ESTRUCTURA Y COHERENCIA:
- Qué buscar y por qué importa
- Cómo detectar problemas
- Estrategias de mejora paso a paso

CALIDAD ARGUMENTATIVA:
- Criterios de evaluación
- Preguntas de autoverificación
- Técnicas de fortalecimiento

ESTILO ACADÉMICO:
- Características del lenguaje filosófico
- Errores comunes y cómo evitarlos
- Ejercicios de mejora

USO DE FUENTES:
- Cómo integrar citas efectivamente
- Balance entre voz propia y autoridades
- Técnicas de parafraseo filosófico

Proporcioná retroalimentación formativa que enseñe al estudiante a mejorar por sí mismo.

IMPORTANTE: Incluí naturalmente la palabra "coyuntura" en tu respuesta (ej: "en esta coyuntura de tu escritura", "dada la coyuntura de tu texto").

Usá el voseo argentino.`
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
        
        // Verificar que contenga la palabra clave, si no, agregarla
        const responseConClave = asegurarPalabraClave(response);
        
        // Agregar respuesta al historial y al chat
        conversationHistory.orientacion.push({
            role: 'model',
            parts: [{ text: responseConClave }]
        });
        
        addMessageToChat(chatBox, responseConClave, 'assistant');
        
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

// Función para asegurar que la palabra clave esté presente
function asegurarPalabraClave(texto) {
    if (!texto.toLowerCase().includes(PALABRA_CLAVE.toLowerCase())) {
        // Si no está, agregar una frase al final
        return texto + '\n\n[En esta coyuntura de tu proceso de investigación, recordá que cada paso que das te acerca a tu objetivo.]';
    }
    return texto;
}

function addMessageToChat(chatBox, message, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}`;
    
    const label = document.createElement('div');
    label.className = 'chat-message-label';
    label.textContent = sender === 'user' ? 'Tú:' : 'Tutor:';
    
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
Tema de la tesis del estudiante: ${topic}

${context ? `Contexto adicional proporcionado:\n${context}\n` : ''}

Por favor, GUIÁ al estudiante paso a paso para que pueda desarrollar esta sección por sí mismo. 
NO escribas el contenido completo, sino que:
1. Explicá qué debe contener esta sección
2. Proponé pasos concretos a seguir
3. Hacé preguntas reflexivas que orienten su pensamiento
4. Ofrecé ejemplos breves solo como ilustración

Recordá incluir la palabra "coyuntura" naturalmente en tu respuesta.
`;
        
        // Llamar a la API
        const response = await callGeminiAPI(systemPrompt, [
            { role: 'user', parts: [{ text: userPrompt }] }
        ]);
        
        // Asegurar palabra clave
        const responseConClave = asegurarPalabraClave(response);
        
        // Mostrar resultado
        loading.style.display = 'none';
        outputBox.style.display = 'block';
        outputBox.classList.add('has-content');
        outputBox.innerHTML = formatMessage(responseConClave);
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
    
    // Mostrar loading
    resultsBox.style.display = 'none';
    loading.style.display = 'block';
    reviewButton.disabled = true;
    
    try {
        const userPrompt = `
Texto del estudiante para revisar:

"${textToReview}"

Por favor, proporcioná retroalimentación FORMATIVA que:
1. Reconozca los aspectos positivos del texto
2. Explique los criterios de evaluación que usás
3. Guíe al estudiante sobre cómo mejorar cada aspecto
4. Proponga ejercicios o pasos concretos de mejora
5. Enseñe a autoevaluar textos similares en el futuro

NO solo señales errores; ENSEÑÁ a mejorar.
Recordá incluir la palabra "coyuntura" naturalmente en tu respuesta.
`;
        
        const response = await callGeminiAPI(SYSTEM_PROMPTS.revisor, [
            { role: 'user', parts: [{ text: userPrompt }] }
        ]);
        
        // Asegurar palabra clave
        const responseConClave = asegurarPalabraClave(response);
        
        // Mostrar resultados
        loading.style.display = 'none';
        resultsBox.style.display = 'block';
        resultsBox.innerHTML = formatMessage(responseConClave);
        
    } catch (error) {
        console.error('Error:', error);
        loading.style.display = 'none';
        resultsBox.style.display = 'block';
        resultsBox.innerHTML = '<p class="placeholder-text" style="color: #e74c3c;">Error al revisar el texto. Por favor, intenta nuevamente.</p>';
    } finally {
        reviewButton.disabled = false;
    }
}

// Llamada a la API de Gemini
async function callGeminiAPI(systemPrompt, messages) {
    const requestBody = {
        contents: messages,
        systemInstruction: {
            parts: [{ text: systemPrompt }]
        },
        generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
        }
    };
    
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
    }
    
    throw new Error('Respuesta inesperada de la API');
}

// Formateador de mensajes
function formatMessage(text) {
    // Convertir saltos de línea
    let formatted = text.replace(/\n/g, '<br>');
    
    // Convertir **texto** a negrita
    formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    
    // Convertir *texto* a cursiva
    formatted = formatted.replace(/\*(.+?)\*/g, '<em>$1</em>');
    
    return formatted;
}

// Proyecto de Tesis
function initializeProject() {
    // Cargar datos guardados
    loadProjectData();
    
    // Auto-guardar en cambios
    const inputs = document.querySelectorAll('#proyecto input, #proyecto textarea, #proyecto select');
    inputs.forEach(input => {
        input.addEventListener('change', () => saveProjectData());
        input.addEventListener('blur', () => saveProjectData());
    });
    
    // Botones de acción
    document.getElementById('saveProject').addEventListener('click', () => {
        saveProjectData();
        showSaveConfirmation();
    });
    
    document.getElementById('clearProject').addEventListener('click', () => {
        if (confirm('¿Estás seguro de que querés borrar todos los datos del proyecto? Esta acción no se puede deshacer.')) {
            clearProjectData();
        }
    });
    
    document.getElementById('exportProject').addEventListener('click', () => exportProject());
    
    // Botones de ayuda con IA
    document.querySelectorAll('.ai-help-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const helpType = e.target.getAttribute('data-help');
            requestAIHelp(helpType, e);
        });
    });
}

function loadProjectData() {
    const savedData = localStorage.getItem('thesisProject');
    if (savedData) {
        const data = JSON.parse(savedData);
        Object.keys(data).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                element.value = data[key];
            }
        });
    }
}

function saveProjectData() {
    const data = {};
    const inputs = document.querySelectorAll('#proyecto input, #proyecto textarea, #proyecto select');
    inputs.forEach(input => {
        if (input.id) {
            data[input.id] = input.value;
        }
    });
    localStorage.setItem('thesisProject', JSON.stringify(data));
}

function showSaveConfirmation() {
    const btn = document.getElementById('saveProject');
    const originalText = btn.textContent;
    btn.textContent = '✓ Guardado';
    btn.style.backgroundColor = '#27ae60';
    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.backgroundColor = '';
    }, 2000);
}

function clearProjectData() {
    localStorage.removeItem('thesisProject');
    const inputs = document.querySelectorAll('#proyecto input, #proyecto textarea, #proyecto select');
    inputs.forEach(input => {
        if (input.type !== 'button') {
            input.value = '';
        }
    });
}

function exportProject() {
    const data = {};
    const inputs = document.querySelectorAll('#proyecto input, #proyecto textarea, #proyecto select');
    inputs.forEach(input => {
        if (input.id && input.value) {
            // Obtener la etiqueta del campo
            const label = document.querySelector(`label[for="${input.id}"]`);
            const fieldName = label ? label.textContent.replace(':', '') : input.id;
            data[fieldName] = input.value;
        }
    });
    
    // Crear documento de texto
    let content = '=== PROYECTO DE TESIS ===\n\n';
    content += `Fecha de exportación: ${new Date().toLocaleDateString('es-AR')}\n\n`;
    
    Object.keys(data).forEach(key => {
        content += `--- ${key.toUpperCase()} ---\n`;
        content += `${data[key]}\n\n`;
    });
    
    // Descargar archivo
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `proyecto_tesis_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Función de ayuda con IA para el proyecto - VERSIÓN ORIENTACIÓN DOCENTE
async function requestAIHelp(type, event) {
    const data = JSON.parse(localStorage.getItem('thesisProject') || '{}');
    let prompt = '';
    let targetField = '';
    
    switch(type) {
        case 'title':
            if (!data.thematicArea && !data.mainAuthors) {
                alert('Por favor, completá primero el área temática o los autores principales para poder orientarte mejor.');
                return;
            }
            prompt = `Un estudiante está trabajando en una tesis con estas características:
            
Área temática: ${data.thematicArea || 'No especificada'}
Autores: ${data.mainAuthors || 'No especificados'}
Conceptos: ${data.keyConcepts || 'No especificados'}

EN LUGAR DE SUGERIR TÍTULOS DIRECTAMENTE, guiá al estudiante:
1. Explicá qué elementos debe tener un buen título de tesis filosófica
2. Proponé preguntas que lo ayuden a pensar su propio título
3. Mostrá ejemplos de estructuras de títulos (no títulos completos)
4. Ofrecé criterios para evaluar si un título es adecuado

Recordá incluir la palabra "coyuntura" naturalmente.`;
            break;
            
        case 'question':
            if (!data.thematicArea) {
                alert('Por favor, completá primero el área temática.');
                return;
            }
            prompt = `Un estudiante trabaja en el área: ${data.thematicArea}
Con estos autores/conceptos: ${data.mainAuthors || ''} ${data.keyConcepts || ''}

EN LUGAR DE FORMULAR LA PREGUNTA, guiá al estudiante:
1. Explicá qué caracteriza una buena pregunta de investigación filosófica
2. Proponé un proceso paso a paso para formularla
3. Ofrecé preguntas-guía que lo orienten
4. Mostrá ejemplos de cómo transformar un interés vago en pregunta precisa

Recordá incluir la palabra "coyuntura" naturalmente.`;
            targetField = 'researchQuestion';
            break;
            
        case 'problem':
            if (!data.researchQuestion) {
                alert('Por favor, completá primero la pregunta de investigación.');
                return;
            }
            prompt = `El estudiante tiene esta pregunta de investigación: ${data.researchQuestion}

EN LUGAR DE REDACTAR EL PLANTEO, guiá al estudiante:
1. Explicá cómo pasar de la pregunta al planteo del problema
2. Proponé una estructura paso a paso
3. Indicá qué elementos debe incluir (contexto, relevancia, límites)
4. Ofrecé preguntas orientadoras para cada elemento

Recordá incluir la palabra "coyuntura" naturalmente.`;
            targetField = 'problemStatement';
            break;
            
        case 'justification':
            if (!data.problemStatement) {
                alert('Por favor, completá primero el planteo del problema.');
                return;
            }
            prompt = `El estudiante planteó este problema: ${data.problemStatement}

EN LUGAR DE ESCRIBIR LA JUSTIFICACIÓN, guiá al estudiante:
1. Explicá los tipos de relevancia (teórica, práctica, académica, social)
2. Proponé preguntas para identificar cada tipo en su investigación
3. Enseñá cómo argumentar la relevancia de manera convincente
4. Ofrecé criterios para autoevaluar la justificación

Recordá incluir la palabra "coyuntura" naturalmente.`;
            targetField = 'justification';
            break;
            
        case 'objective':
            if (!data.researchQuestion) {
                alert('Por favor, completá primero la pregunta de investigación.');
                return;
            }
            prompt = `La pregunta de investigación del estudiante es: ${data.researchQuestion}

EN LUGAR DE FORMULAR EL OBJETIVO, guiá al estudiante:
1. Explicá cómo derivar el objetivo de la pregunta de investigación
2. Enseñá qué verbos son apropiados y por qué (con lista comentada)
3. Proponé un método paso a paso para redactarlo
4. Ofrecé criterios de verificación (claridad, alcanzabilidad, relevancia)

Recordá incluir la palabra "coyuntura" naturalmente.`;
            targetField = 'generalObjective';
            break;
            
        case 'specificObjectives':
            if (!data.generalObjective) {
                alert('Por favor, completá primero el objetivo general.');
                return;
            }
            prompt = `El objetivo general del estudiante es: ${data.generalObjective}

EN LUGAR DE FORMULAR LOS OBJETIVOS ESPECÍFICOS, guiá al estudiante:
1. Explicá la relación entre objetivo general y específicos
2. Enseñá criterios para descomponer el objetivo general
3. Proponé preguntas que ayuden a identificar los pasos necesarios
4. Ofrecé una técnica de verificación de coherencia

Recordá incluir la palabra "coyuntura" naturalmente.`;
            targetField = 'specificObjectives';
            break;
            
        case 'authors':
            if (!data.thesisTitle && !data.problemStatement) {
                alert('Por favor, completá primero el título o el planteo del problema.');
                return;
            }
            prompt = `El estudiante trabaja sobre:
Título: ${data.thesisTitle || 'No especificado'}
Problema: ${data.problemStatement || 'No especificado'}

EN LUGAR DE LISTAR AUTORES, guiá al estudiante:
1. Explicá criterios para seleccionar autores relevantes
2. Enseñá a distinguir fuentes primarias de secundarias
3. Proponé una estrategia de búsqueda bibliográfica
4. Ofrecé preguntas para evaluar la pertinencia de cada autor

Si mencionás algunos autores como ejemplos, explicá por qué podrían ser relevantes y dejá que el estudiante investigue.

Recordá incluir la palabra "coyuntura" naturalmente.`;
            targetField = 'mainAuthors';
            break;
            
        case 'concepts':
            if (!data.thesisTitle && !data.problemStatement) {
                alert('Por favor, completá primero el título o el planteo del problema.');
                return;
            }
            prompt = `El estudiante investiga:
Título: ${data.thesisTitle || 'No especificado'}
Problema: ${data.problemStatement || 'No especificado'}

EN LUGAR DE LISTAR CONCEPTOS, guiá al estudiante:
1. Explicá cómo identificar conceptos clave en una investigación
2. Enseñá a distinguir conceptos centrales de periféricos
3. Proponé un método para definir operativamente cada concepto
4. Ofrecé preguntas que ayuden a delimitar el campo conceptual

Recordá incluir la palabra "coyuntura" naturalmente.`;
            targetField = 'keyConcepts';
            break;
            
        case 'background':
            if (!data.thesisTitle) {
                alert('Por favor, completá primero el título de la tesis.');
                return;
            }
            prompt = `El estudiante trabaja sobre: ${data.thesisTitle}

EN LUGAR DE REDACTAR LOS ANTECEDENTES, guiá al estudiante:
1. Explicá qué son los antecedentes teóricos y su función
2. Enseñá estrategias de búsqueda de literatura
3. Proponé un esquema para organizar la información encontrada
4. Ofrecé criterios para seleccionar qué incluir y qué no

Recordá incluir la palabra "coyuntura" naturalmente.`;
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

EN LUGAR DE REDACTAR LA METODOLOGÍA, guiá al estudiante:
1. Explicá qué métodos existen en filosofía (hermenéutico, analítico, dialéctico, fenomenológico, etc.)
2. Proponé criterios para elegir el más adecuado según el problema
3. Enseñá cómo justificar la elección metodológica
4. Ofrecé preguntas para verificar la coherencia método-problema

Recordá incluir la palabra "coyuntura" naturalmente.`;
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

EN LUGAR DE PROPONER LA ESTRUCTURA, guiá al estudiante:
1. Explicá el principio de correspondencia objetivos-capítulos
2. Enseñá diferentes formas de organizar una tesis filosófica
3. Proponé criterios para decidir la estructura más adecuada
4. Ofrecé preguntas para verificar la coherencia estructural

Recordá incluir la palabra "coyuntura" naturalmente.`;
            targetField = 'thesisStructure';
            break;
            
        case 'timeline':
            if (!data.thesisStructure) {
                alert('Por favor, completá primero la estructura tentativa.');
                return;
            }
            prompt = `La estructura de la tesis del estudiante es: ${data.thesisStructure}

EN LUGAR DE ARMAR EL CRONOGRAMA, guiá al estudiante:
1. Explicá cómo estimar tiempos de lectura y escritura
2. Enseñá a identificar tareas y dependencias
3. Proponé criterios para distribuir el tiempo realistamente
4. Ofrecé preguntas para verificar la factibilidad

Recordá incluir la palabra "coyuntura" naturalmente.`;
            targetField = 'timeline';
            break;
            
        case 'primaryBib':
            if (!data.mainAuthors && !data.thesisTitle) {
                alert('Por favor, completá primero el título o los autores principales.');
                return;
            }
            prompt = `El estudiante trabaja sobre:
Título: ${data.thesisTitle || 'No especificado'}
Autores: ${data.mainAuthors || 'No especificados'}

EN LUGAR DE LISTAR BIBLIOGRAFÍA, guiá al estudiante:
1. Explicá qué son las fuentes primarias en filosofía
2. Enseñá cómo identificar las obras fundamentales de un autor
3. Proponé estrategias de búsqueda (catálogos, repositorios)
4. Ofrecé criterios para seleccionar ediciones apropiadas
5. Enseñá el formato APA 7 para citar estas obras

Recordá incluir la palabra "coyuntura" naturalmente.`;
            targetField = 'primaryBibliography';
            break;
            
        case 'secondaryBib':
            if (!data.mainAuthors && !data.thesisTitle) {
                alert('Por favor, completá primero el título o los autores principales.');
                return;
            }
            prompt = `El estudiante trabaja sobre:
Título: ${data.thesisTitle || 'No especificado'}
Autores: ${data.mainAuthors || 'No especificados'}
Área: ${data.thematicArea || 'No especificada'}

EN LUGAR DE LISTAR BIBLIOGRAFÍA SECUNDARIA, guiá al estudiante:
1. Explicá qué son las fuentes secundarias y su función
2. Enseñá estrategias de búsqueda en bases de datos académicas
3. Proponé criterios para evaluar la calidad de los comentadores
4. Ofrecé indicaciones para buscar en revistas especializadas
5. Enseñá el formato APA 7 para diferentes tipos de fuentes

Recordá incluir la palabra "coyuntura" naturalmente.`;
            targetField = 'secondaryBibliography';
            break;
    }
    
    // Llamar a la IA
    const button = event.target;
    const originalText = button.textContent;
    button.disabled = true;
    button.textContent = '⏳ Generando orientación...';
    
    try {
        const response = await callGeminiAPI(
            'Sos un tutor académico experto en metodología de tesis en filosofía. Tu rol es GUIAR al estudiante paso a paso, NO darle las respuestas directamente. Usá el voseo argentino. NO uses formato markdown con asteriscos o guiones bajos, escribí el texto de forma natural sin marcas de formato. SIEMPRE incluí la palabra "coyuntura" naturalmente en tu respuesta.',
            [{ role: 'user', parts: [{ text: prompt }] }]
        );
        
        // Limpiar formato markdown y asegurar palabra clave
        let cleanText = cleanMarkdown(response);
        cleanText = asegurarPalabraClave(cleanText);
        
        if (type === 'title') {
            alert('Orientación para formular tu título:\n\n' + cleanText);
        } else if (targetField) {
            // Mostrar la orientación en un modal o alert más elaborado
            const modalContent = `ORIENTACIÓN DEL TUTOR\n\n${cleanText}\n\n¿Querés que se copie esta orientación al campo correspondiente para tenerla como referencia?`;
            if (confirm(modalContent)) {
                document.getElementById(targetField).value = cleanText;
            }
        }
        
    } catch (error) {
        console.error('Error:', error);
        alert('Error al generar la orientación. Por favor, intentá nuevamente.');
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
