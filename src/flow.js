module.exports = {
  welcome: {
    messages: [
      'Hola. Soy el sistema de diagnóstico denominado *Mi Primera Versión*, una iniciativa de Gerencia Mujer.',
      'Esta conversación está pensada para mujeres que han funcionado bien cumpliendo expectativas — académicas, familiares, profesionales — y sienten que algo no termina de encajar en lo que están construyendo.\n\nSi lo que estás atravesando es una situación de salud mental que necesite acompañamiento profesional, este no es el espacio adecuado y al final te compartimos recursos.',
      'Todo lo que compartas aquí es confidencial. Tu nombre no se divulgará ni se asociará públicamente a ninguna respuesta.\n\nVas a recibir un reporte personalizado en las próximas 48 horas — preparado especialmente para ti, no por un sistema automático.',
      'Son 9 preguntas de diagnóstico más 6 datos rápidos al final. Algunas son de selección, otras son abiertas — responde desde lo que realmente sientes, no desde lo que crees que deberías sentir.\n\nTómate el tiempo que necesites. No hay reloj.',
      'Cuando estés lista, escribe *lista* y comenzamos. 🌱'
    ],
    type: 'any',
    question_id: null,
    next: 'p1'
  },

  p1: {
    messages: [
      'Para empezar — ¿cuál de estas frases describe mejor dónde estás ahora mismo?\n\n*A*  Sé lo que quiero pero no estoy avanzando hacia ello\n*B*  No tengo claro hacia dónde voy y eso me pesa\n*C*  Estoy avanzando pero siento que algo no encaja\n*D*  Estoy en piloto automático — el día me lleva más de lo que yo elijo'
    ],
    type: 'choice',
    question_id: 'P1',
    label: '¿Dónde estás ahora mismo?',
    options: {
      A: 'Sé lo que quiero pero no estoy avanzando hacia ello',
      B: 'No tengo claro hacia dónde voy y eso me pesa',
      C: 'Estoy avanzando pero siento que algo no encaja',
      D: 'Estoy en piloto automático — el día me lleva más de lo que yo elijo'
    },
    next: 'p2'
  },

  p2: {
    messages: [
      'Cuando piensas en lo que quieres lograr pero no estás logrando, ¿qué aparece primero?\n\n*A*  "Todavía no estoy lista"\n*B*  "No tengo tiempo ahora"\n*C*  "¿Y si no funciona?"\n*D*  "No sé exactamente qué quiero"'
    ],
    type: 'choice',
    question_id: 'P2',
    label: '¿Qué frena el avance?',
    options: {
      A: '"Todavía no estoy lista"',
      B: '"No tengo tiempo ahora"',
      C: '"¿Y si no funciona?"',
      D: '"No sé exactamente qué quiero"'
    },
    next: 'p3'
  },

  p3: {
    messages: [
      'Cuéntame en tus palabras: ¿en qué momento de tu vida estás ahora mismo?\n\nNo la versión que contarías en una entrevista — la que le contarías a alguien de confianza.'
    ],
    type: 'free',
    question_id: 'P3',
    label: 'Tu momento actual',
    next: 'p4'
  },

  p4: {
    messages: [
      'Imagina que es un martes normal dentro de un año. ¿Cómo te gustaría que fuera diferente al de hoy?\n\nSi tienes claridad, descríbelo con detalle. Si no la tienes todavía, también está bien — puedes decirlo así.'
    ],
    type: 'free',
    question_id: 'P4',
    label: 'Tu martes ideal',
    next: 'p5'
  },

  p5: {
    messages: [
      'Lo que estás construyendo profesionalmente ahora mismo — ¿lo elegiste tú?\n\n¿O sentiste que había alguien específico cuya aprobación pesaba en la decisión? Puede ser una mamá, un papá, un alguien.\n\nSi fue una mezcla, también sirve.'
    ],
    type: 'free',
    question_id: 'P5',
    label: 'Lo que construyes profesionalmente',
    next: 'p6'
  },

  p6: {
    messages: [
      'Cambiamos un poco el tema — pero está conectado con todo lo anterior.\n\n¿Con qué frecuencia haces actividades sola — ir a comer, al cine, a caminar, a explorar algo nuevo — sin necesitar que alguien te acompañe?\n\n*A*  Lo hago seguido, me siento cómoda sola\n*B*  A veces, pero prefiero compañía\n*C*  Casi nunca, me incomoda o me parece raro\n*D*  Nunca lo había pensado, pero casi siempre busco a alguien'
    ],
    type: 'choice',
    question_id: 'P6',
    label: 'Actividades sola',
    options: {
      A: 'Lo hago seguido, me siento cómoda sola',
      B: 'A veces, pero prefiero compañía',
      C: 'Casi nunca, me incomoda o me parece raro',
      D: 'Nunca lo había pensado, pero casi siempre busco a alguien'
    },
    next: 'p7'
  },

  p7: {
    messages: [
      'Cuando piensas en hacer algo sola que normalmente harías acompañada — por ejemplo ir a un café o al cine — ¿qué pesa más en tu cabeza?\n\n*A*  Me sentiría incómoda conmigo misma, no sé qué hacer estando sola\n*B*  Me preocupa lo que piensen las personas que me vean sola\n*C*  Las dos cosas se mezclan\n*D*  Ninguna, me sentiría bien sola'
    ],
    type: 'choice',
    question_id: 'P7',
    label: 'Lo que más pesa',
    options: {
      A: 'Me sentiría incómoda conmigo misma, no sé qué hacer estando sola',
      B: 'Me preocupa lo que piensen las personas que me vean sola',
      C: 'Las dos cosas se mezclan',
      D: 'Ninguna, me sentiría bien sola'
    },
    next: 'p8'
  },

  p8: {
    messages: [
      'Última pregunta antes del cierre.\n\n¿Cómo es un día típico tuyo? ¿Sientes que tú eliges lo que haces o que el día te arrastra?\n\nY dime: ¿qué es lo que más te frena para empezar a moverte hoy — no mañana, hoy?'
    ],
    type: 'free',
    question_id: 'P8',
    label: 'Tu día típico',
    next: 'p9'
  },

  p9: {
    messages: [
      'De todo lo que escribiste hoy, ¿hay alguna respuesta tuya que te haya sorprendido? ¿Algo que no sabías que pensabas hasta que lo escribiste?\n\nSi nada te sorprendió, también puedes decirlo.'
    ],
    type: 'free',
    question_id: 'P9',
    label: '¿Algo que te sorprendió?',
    next: 'preview'
  },

  preview: {
    messages: [],
    type: 'summary',
    question_id: null,
    next: null
  },

  edit_menu: {
    messages: [
      '¿Cuál pregunta deseas cambiar?\n\n1 · ¿Dónde estás ahora mismo?\n2 · ¿Qué frena el avance?\n3 · Tu momento actual\n4 · Tu martes ideal\n5 · Lo que construyes\n6 · Actividades sola\n7 · Lo que más pesa\n8 · Tu día típico\n9 · ¿Algo que te sorprendió?\n\nEscribe el número.'
    ],
    type: 'edit_menu',
    question_id: null,
    next: null
  },

  c1: {
    messages: [
      'Ya casi terminamos. Solo necesito seis datos rápidos.',
      '¿Cuántos años tienes?\n\n*A*  18 a 20\n*B*  21 a 23\n*C*  24 a 26\n*D*  27 a 30'
    ],
    type: 'choice',
    question_id: 'C1',
    next: 'c2'
  },

  c2: {
    messages: [
      '¿Cuál describe mejor tu momento actual?\n\n*A*  Estoy estudiando\n*B*  Estudio y trabajo al mismo tiempo\n*C*  Ya me gradué y estoy trabajando\n*D*  Ya me gradué y estoy buscando oportunidades'
    ],
    type: 'choice',
    question_id: 'C2',
    next: 'c3'
  },

  c3: {
    messages: [
      '¿En qué ciudad estás?'
    ],
    type: 'free',
    question_id: 'C3',
    next: 'c4'
  },

  c4: {
    messages: [
      '¿Cómo te llamas?'
    ],
    type: 'free',
    question_id: 'C4',
    next: 'c5'
  },

  c5: {
    messages: [
      '¿Cuál es tu correo electrónico?'
    ],
    type: 'free',
    question_id: 'C5',
    next: 'c6'
  },

  c6: {
    messages: [
      '¿Cómo es tu número de WhatsApp?'
    ],
    type: 'free',
    question_id: 'C6',
    next: 'closing'
  },

  closing: {
    messages: [
      'Eso es todo. 🌱',
      'Lo que acabas de hacer — detenerte a observarte honestamente — ya es diferente de lo que hace la mayoría. Creerse el cuento empieza por conocerse.',
      'Antes de tu reporte, te dejo una práctica que puedes hacer estos días mientras lo preparo.\n\nLas próximas mañanas, antes de abrir tu celular, hazte una sola pregunta: ¿qué quiero yo de hoy?\n\nNo tienes que responderla. Solo hacerla. Eso ya es un movimiento.',
      'Tu reporte personalizado llega directamente desde el número de Sylvia xxxxxxxxx en las próximas 48 horas. Incluye tu perfil en las cuatro dimensiones y la pregunta que más vale la pena que te hagas en este momento.\n\nTe recomendamos que guardes el contacto, recuerda que este es un chatbot automático para recolectar tus respuestas.',
      'Si en algún momento de esta conversación apareció algo que sentiste que vale la pena conversar con un profesional, aquí algunos recursos en Colombia:\n\n· Línea Nacional de Salud Mental: 192 (opción 4)\n· Línea Amiga de Bucaramanga: (607) 670 1290\n· Línea de la Vida MinSalud: lineadelavida.minsalud.gov.co\n\nEstos recursos son gratuitos y confidenciales.'
    ],
    done_reply: 'Tu reporte personalizado llega directamente desde el número de Sylvia xxxxxxxxx en las próximas 48 horas. Incluye tu perfil en las cuatro dimensiones y la pregunta que más vale la pena que te hagas en este momento.\n\nTe recomendamos que guardes el contacto, recuerda que este es un chatbot automático para recolectar tus respuestas.',
    type: 'none',
    question_id: null,
    next: null
  }
};
