// =========================
// TÍTULO EN VERDE: ANIMACIÓN HERO
// =========================

document.addEventListener('DOMContentLoaded', () => {
  const hero = document.querySelector('.hero');
  
  // Agregamos la clase 'show' después de un pequeño retraso
  setTimeout(() => {
    hero.classList.add('show');
  }, 200); // 200ms de retraso para un efecto más suave
});

// =========================
// TÍTULO EN VERDE: LOADER INICIAL
// =========================

// =========================================
// TÍTULO EN VERDE: LOADER INICIAL (VERSIÓN 5: Máximo Rendimiento)
// =========================================

document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById("loader");
    const loaderVideo = document.getElementById('loader-video') || (loader ? loader.querySelector("video") : null);
    
    let isLoaderHidden = false;
    let videoPlayed = false; // Nueva bandera para controlar el inicio

    if (loader && loaderVideo) {
        
        // **IMPORTANTE**: Poner el 'overflow: hidden' en el body 
        // tan pronto como sea posible para evitar el flash de contenido.
        document.body.style.overflow = 'hidden';

        // --- FUNCIÓN PRINCIPAL DE OCULTAMIENTO ---
        function hideLoader() {
            if (isLoaderHidden) return; 
            isLoaderHidden = true;
            
            // 1. Iniciar la transición de desvanecimiento
            loader.classList.add("fade-out");

            // 2. Después de que la animación CSS (1s) termine
            setTimeout(() => {
                loader.style.display = "none";
                // 3. Restaurar el scroll del body
                document.body.style.overflow = ''; 
            }, 1000);
        }
        
        // --- EVENTO 1: Cuando el vídeo está listo para reproducirse sin interrupción ---
        // Este es el evento más fiable para garantizar la fluidez.
        loaderVideo.addEventListener('canplaythrough', () => {
            if (videoPlayed) return; // Ya se inició la secuencia

            // Intentamos iniciar la reproducción sin retraso
            loaderVideo.play().then(() => {
                videoPlayed = true;
                // Si la reproducción comienza con éxito, escuchamos el evento 'ended'
                // para la transición de cierre.
                loaderVideo.addEventListener('ended', hideLoader, { once: true });
            }).catch(error => {
                // Falla el Autoplay (típico en móviles por la política 'muted')
                console.error("Fallo al reproducir el video:", error);
                
                // Si falla la reproducción, forzamos un cierre rápido para no bloquear
                setTimeout(hideLoader, 500); // 500ms de gracia
            });
        }, { once: true }); // Usamos { once: true } para remover el listener automáticamente
        
        // --- EVENTO 2: Fallback de seguridad si algo va mal con la carga ---
        // Si han pasado 3 segundos (3000ms) y el vídeo no ha disparado 
        // 'canplaythrough' o 'ended', forzamos el cierre inmediato.
        setTimeout(() => {
             // Solo oculta si el vídeo aún no ha comenzado la secuencia de cierre
            if (!videoPlayed) {
                console.warn("Tiempo de espera agotado. Forzando el cierre del loader.");
                hideLoader();
            }
        }, 3000); // Reducimos a 3 segundos para una UX más rápida.

        
        // Si por alguna razón el vídeo no emite 'canplaythrough', pero termina de cargar 
        // (evento de seguridad si el archivo es muy corto)
        loaderVideo.addEventListener('ended', hideLoader, { once: true });
    }
});










const cards = document.querySelectorAll('.service-card');

cards.forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--x', `${x}px`);
    card.style.setProperty('--y', `${y}px`);
    card.classList.add('hover');
  });

  card.addEventListener('mouseleave', () => {
    card.classList.remove('hover');
  });
});

document.querySelectorAll('.service-text button').forEach(button => {
  button.addEventListener('click', () => {
    const card = button.closest('.service-card');
    card.classList.toggle('open');
    button.textContent = card.classList.contains('open') ? 'Ver menos' : 'Ver más';
  });
});

/**
 * =========================================
 * CARRUSEL INFINITO Y AUTOMÁTICO - CONFIGURACIÓN
 * =========================================
 */

// Selector para todos los contenedores de carrusel.
// Si añades más carruseles con esta estructura, se inicializarán automáticamente.
const carouselContainers = document.querySelectorAll('.carousel-container');


/**
 * Inicializa un carrusel.
 * Duplica los ítems para el efecto infinito y añade los listeners de hover.
 * @param {HTMLElement} container - El contenedor principal del carrusel.
 */
function initializeCarousel(container) {
    // 1. Obtiene la pista de los ítems
    const track = container.querySelector('.carousel-track');
    if (!track) return; // Salir si no se encuentra la pista

    // 2. Duplicación de ítems para el efecto de bucle infinito (imperceptible)
    // Se clonan todos los ítems hijos de la pista.
    const originalItems = Array.from(track.children);
    
    // Si hay menos de 3 ítems (o el número que consideres necesario),
    // la duplicación podría no verse bien, así que duplicamos al menos una vez.
    if (originalItems.length > 0) {
        // Clona y añade los ítems duplicados al final de la pista.
        // Esto hace que la animación CSS (transform: translateX(-50%)) 
        // pueda moverse a través de los ítems originales y luego a través 
        // de sus copias, volviendo al inicio de forma "infinita".
        originalItems.forEach(item => {
            const clonedItem = item.cloneNode(true);
            // Añade una clase para identificar las copias si fuera necesario
            clonedItem.classList.add('cloned'); 
            track.appendChild(clonedItem);
        });
    }

    // 3. Control de Pausa/Reanudación al hacer Hover
    // La pausa se maneja principalmente con el CSS, pero añadimos 
    // y quitamos una clase para mayor control si se requieren otros efectos JS.
    
    /**
     * Función para pausar el carrusel (al entrar el ratón).
     * El CSS detiene la animación con :hover, pero esta función también
     * es útil para detener cualquier lógica JS adicional.
     */
    const pauseScroll = () => {
        // Detiene la animación CSS a través de la regla :hover del CSS.
        // track.style.animationPlayState = 'paused'; // Alternativa solo JS
        // Puedes añadir aquí otros efectos si los necesitas.
    };

    /**
     * Función para reanudar el carrusel (al salir el ratón).
     */
    const resumeScroll = () => {
        // track.style.animationPlayState = 'running'; // Alternativa solo JS
    };

    // Aplica los event listeners al contenedor para capturar el hover
    container.addEventListener('mouseenter', pauseScroll);
    container.addEventListener('mouseleave', resumeScroll);
    
    // También pausa en el foco (para accesibilidad con teclado)
    container.addEventListener('focusin', pauseScroll);
    container.addEventListener('focusout', resumeScroll);
}

// =========================================
// INICIO DE LA APLICACIÓN
// =========================================
// Espera a que el DOM esté completamente cargado antes de ejecutar el script.
document.addEventListener('DOMContentLoaded', () => {
    // Itera sobre todos los contenedores de carrusel y los inicializa.
    carouselContainers.forEach(initializeCarousel);

    console.log('Carruseles automáticos inicializados.');
});


document.addEventListener('DOMContentLoaded', function() {
    // Selecciona todos los elementos que quieres que se animen al hacer scroll.
    // Usamos un atributo personalizado 'data-scroll-reveal'
    const elementsToAnimate = document.querySelectorAll('[data-scroll-reveal]');

    // Opciones para el Intersection Observer
    const observerOptions = {
        root: null, // Usa el viewport como root
        rootMargin: '0px 0px -10% 0px', // El 10% inferior del viewport
        threshold: 0.1 // El elemento es visible si el 10% está en pantalla
    };

    // Callback que se ejecuta cuando la visibilidad de los elementos cambia
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            // Si el elemento es visible (intersecting)
            if (entry.isIntersecting) {
                const target = entry.target;
                
                // Obtener el retraso de la animación desde el atributo 'data-scroll-delay'
                // Si no hay atributo, el retraso será '0s'
                const delay = target.getAttribute('data-scroll-delay') || '0s';
                
                // Aplicar el retraso a la transición del elemento
                target.style.transitionDelay = delay;
                
                // Añadir la clase que activa la animación CSS
                target.classList.add('is-visible');

                // Dejar de observar el elemento una vez que se ha animado
                observer.unobserve(target);
            }
        });
    };

    // Crea el Intersection Observer
    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observa cada elemento
    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const wordElement = document.getElementById('changingWord');
    const words = ["UXer.", "Marketer."];
    let wordIndex = 0;
    
    // Duraciones en milisegundos
    const FADE_DURATION = 400; // 0.4s
    const DISPLAY_DURATION = 1000; // 1s (tiempo visible, incluyendo el fade in/out)

    function changeWord() {
        // 1. Iniciar Fade Out (0.4s)
        wordElement.classList.add('fade-out');

        // Esperar la duración del Fade Out
        setTimeout(() => {
            // 2. Cambiar el texto mientras está invisible
            wordIndex = (wordIndex + 1) % words.length;
            wordElement.textContent = words[wordIndex];

            // 3. Iniciar Fade In (0.4s)
            // Removemos la clase 'fade-out' para que la transición CSS haga el Fade In
            wordElement.classList.remove('fade-out');
            
            // 4. Establecer el bucle: Esperar el tiempo de visualización completa
            setTimeout(changeWord, DISPLAY_DURATION);

        }, FADE_DURATION);
    }

    // Inicializar el bucle
    // El primer cambio ocurrirá después del primer DISPLAY_DURATION
    setTimeout(changeWord, DISPLAY_DURATION);
});











































/* =========================================
   NUEVO: LÓGICA DE PORTFOLIO (PARA portfolioagudiez.html)
   ========================================= */

// 1. DATA DE LOS PROYECTOS (para el panel expandido)
const projectData = [
    {
        id: '1',
        title: 'Campaña Publicitaria Mahou x LaLiga⚽​🍺',
        tech: '',
        role: '',
        p1: 'Diseñé la propuesta ganadora del concurso Mahou-LaLiga, "La Pachanguita" mantiene la emoción del fútbol incluso en el descanso. Problema: Durante el descanso, los aficionados se desconectan y pierden la emoción del partido. Solución: Creé La Pachanguita, un minijuego Fut-Draft integrado en LaLiga Fantasy. Desde su asiento, el aficionado escanea un QR, forma su 11 ideal respondiendo preguntas y compite en un ranking en directo.',
        p2: '1️⃣ Insight — “Durante el descanso, los aficionados se desconectan, por que sienten que ya no forman parte del juego.”',
        p3: 'En los estadios, el descanso se vive como un silencio emocional: los aficionados dejan de sentirse parte del juego. Pero el fútbol no se pausa, solo cambia de protagonista. Identifiqué una oportunidad: mantener viva la emoción del estadio también en el descanso, reforzando el ritual familiar que pasa de generación en generación.',
        p4: '2️⃣ Concepto — ¡Calienta que sales!',
        p5: 'Creé "La Pachanguita": un minijuego Fut-Draft inspirado en las pachangas de barrio donde el fútbol se comparte, no se presume. Una activación dentro de LaLiga Fantasy que convierte el descanso en un momento para “calentar y salir a jugar”, conectando a abuelo, padre e hijo. "El fútbol nos une. Mahou también."',
        p6: '3️⃣ Ejecución — Juega desde tu asiento',
        p7: 'En el descanso, cada aficionado escanea el QR colocado en su asiento y forma su 11 ideal respondiendo preguntas sobre LaLiga. Más aciertos, mejores jugadores. Ranking en directo y premios: camisetas firmadas, packs Mahou y ventajas Fantasy. El juego se vive desde la grada, creando un ritual que nace en las sillas del estadio.',
        p8: '4️⃣ Narrativa visual — Herencia futbolera',
        p9: 'El cartel muestra un gesto simbólico: el abuelo no firma una herencia, firma un clausulazo Fantasy para ceder sus jugadores al nieto. El flyer en los asientos convierte ese momento emocional en acción real. Una historia donde la pasión no se reparte en papeles… se hereda jugando juntos.',
        img1: 'portfolio/mahou3.jpg',
        img2: 'portfolio/mahouprimera.jpg',
        img3: 'portfolio/mahou1111111111111.jpg'
    },
    {
        id: '2',
        title: 'Web Animada para Netflix💻​🎥',
        tech:'' ,
        role:'' ,
        p1: 'Diseñé DISSOCIATED como una experiencia web inmersiva basada en un thriller psicológico para Netflix, que sigue al Dr. Jonathan Blackwell, un psiquiatra con trastorno de identidad disociativa involucrado en una serie de desapariciones. Mi objetivo fue transformar su conflicto interno y su mente fragmentada en una interfaz tensa, oscura y emocionalmente inquietante.',
        p2: '1️⃣ Narrativa & Concepto',
        p3: 'La historia marca el tono del proyecto: una mente fragmentada, una identidad en conflicto y una investigación que apunta hacia uno mismo. La web debía transmitir tensión, paranoia y ambigüedad desde su estructura narrativa hasta sus interacciones.',
        p4: '2️⃣ Investigación UX',
        p5: 'La investigación combinó datos cuantitativos (44 encuestas) y cualitativos (17 entrevistas). Los usuarios mostraron afinidad por thrillers psicológicos, narrativas fragmentadas y protagonistas moralmente ambiguos, permitiendo construir una experiencia alineada con sus expectativas y hábitos.',
        p6: '3️⃣ Insights & UX Persona',
        p7: 'Los hallazgos revelaron un público que busca profundidad emocional y una estética perturbadora. A partir de ello se creó Daniel Palacios, un UX Persona que refleja al espectador ideal: curioso, analítico y atraído por el true crime y las historias oscuras. Su perfil guió tono, estilo y estructura.',
        p8: '4️⃣ Diseño Web & Justificación',
        p9: 'La web se diseñó para emular la psique fracturada del protagonista: paleta oscura, efectos glitch, tipografía alterada y navegación no lineal. Todo orientado a que el usuario no solo vea la historia, sino que la experimente desde dentro. Además, incorporé nuevas secciones como una página de Noticias ficticias con mensajes ocultos que expanden el universo narrativo, y una Tienda de merch que refuerza la identidad transmedia del proyecto. <a href="https://short.do/7Yx-A4" target="_blank">VER WEB</a>',
        img1: 'portfolio/web1.jpg',
        img2: 'portfolio/web2.jpg',
        img3: 'portfolio/web3.jpg'
    },
    {
        id: '3',
        title: 'ReBranding e Identidad de marca para BIMBO🐻‍❄️​🍞​​',
       tech:'' ,
        role:'' ,
        p1: 'Realicé un rebranding completo para BIMBO con el objetivo de posicionar la marca como un referente moderno, saludable y transparente, manteniendo su esencia emocional y familiar pero elevando su presencia hacia un territorio más sofisticado y consciente.',
        p2: '1️⃣ Estrategia & Posicionamiento',
        p3: 'A través de un mapa de posicionamiento, redefiní el lugar estratégico que debe ocupar BIMBO: una marca que combina confianza histórica con innovación responsable. La propuesta de valor se centra en productos reales, procesos claros y un compromiso firme con el bienestar del consumidor.',
        p4: '2️⃣ Construcción del Logo',
        p5: 'El nuevo logotipo responde a una estética minimalista y futurista. Curvas suaves transmiten cercanía y elegancia; el icónico oso se mantiene como símbolo de ternura y confianza familiar; la tipografía redondeada refuerza la tradición moderna; y los tonos azul y rojo comunican calidad, energía y pasión, respetando el ADN histórico de la marca.',
        p6: '3️⃣ Sistema Visual',
        p7: 'El rebranding incluye una paleta sólida y profesional junto a tipografías que equilibran modernidad y calidez. Las variaciones del logo garantizan adaptabilidad en diferentes formatos, manteniendo siempre la coherencia visual y la esencia de marca.',
        p8: '4️⃣ Brand Wheel & ADN de Marca',
        p9: 'El brand wheel define el nuevo carácter de BIMBO, centrado en la calidad, la transparencia, la salud y una innovación más consciente. Los productos se presentan como opciones reales, naturales y responsables, capaces de transmitir bienestar y orgullo al consumidor. La personalidad resultante es elegante, sofisticada y cercana desde la excelencia, culminando en una esencia clara: “Nutrir cuerpo y alma con el sabor natural de lo bien hecho.”',
        img1: 'portfolio/bimbo1.jpg',
        img2: 'portfolio/bimbo3.jpg',
        img3: 'portfolio/bimbo2.jpg'
    },
    {
        id: '4',
        title: 'Más Sitios Web: Diseño, UX y Funcionalidad📱💻',
        tech: '',
        role: '',
        p1: 'Este proyecto reúne cuatro propuestas web creadas para explorar distintos estilos, narrativas visuales y experiencias de usuario. Cada una responde a una identidad única: desde el minimalismo más sereno hasta la animación más expresiva. El resultado es una colección versátil que demuestra dominio del diseño digital, dirección de arte y construcción de interfaces funcionales.',
        p2: '1️⃣ Arusa Home — Minimalismo que respira',
        p3: 'Una web para una marca ficticia de interiorismo contemporáneo, diseñada para transmitir calma, orden y sofisticación. Enfoque: estética clara en tonos arena, tipografías elegantes y microinteracciones suaves que acompañan el scroll. Contenido: inicio, colección, filosofía y contacto, todo presentado con una experiencia fluida y ligera. Resultado: una identidad digital limpia y reflexiva que eleva el diseño minimalista.',
        p4: '2️⃣ Flowly — Finanzas con claridad',
        p5: 'Interfaz web inspirada en dashboards profesionales para presentar un software de análisis financiero. Enfoque: colores fríos, jerarquía numérica clara y módulos ordenados como un panel real. Contenido: demo visual de gráficas, funciones clave y planes de uso. Resultado: una web sólida y confiable que permite visualizar el producto antes de usarlo.',
        p6: '3️⃣ DONUVERSE — Un universo dulce y animado',
        p7: 'Proyecto web inmersivo para una tienda de donuts gourmet, pensado como una experiencia visual en movimiento. Enfoque: colores vibrantes, estética cartoon y animaciones dinámicas que reaccionan al scroll. Contenido: donuts que se transforman, galerías interactivas y secciones que simulan “mundos dulces”. Resultado: una web divertida, energética y memorable donde el diseño es pura experiencia.',
        p8: '4️⃣ Dr. Alejandro Castillo — Profesional y accesible',
        p9: 'Landing page para un médico ficticio, enfocada en la confianza, la claridad y la accesibilidad. Enfoque: tonos médicos suaves, tipografía seria y estructura precisa. Contenido: presentación, servicios, valores, contacto, ubicación y horarios. Resultado: una web directa y fiable que ofrece información médica sin ruido y con total orden.',
        img1: 'portfolio/muebles.jpg',
        img2: 'portfolio/donuverse.jpg',
        img3: 'portfolio/doctor.jpg'
    },
    {
        id: '5',
        title: 'Campaña de Marketing y Comunicación para VICIO.🍔​🥤',
        tech: '',
        role: '',
        p1: 'VICIO – “Smash or Pass”. Una campaña que convierte el icónico formato “Smash or Pass” en una provocación directa al consumidor, reforzando la actitud hedonista y desinhibida de VICIO. El proyecto juega con el deseo, la decisión y el placer de forma divertida y visual.',
        p2: '1️⃣ Insight',
        p3: 'Partimos de la idea de que “nadie se puede resistir a nuestra smash burger”: un producto tan deseado que convierte cualquier elección en un reto casi imposible. Este insight nos permite construir una narrativa centrada en la tentación y el impulso.',
        p4: '2️⃣ Concepto Creativo',
        p5: 'El formato “Smash or Pass” se transforma en un juego entre marca y audiencia. No solo invita a elegir, sino que empuja al consumidor hacia el “Smash” como una respuesta instintiva. El tono es directo, divertido y con guiños a la cultura pop.',
        p6: '3️⃣ Target',
        p7: 'Nos dirigimos a amantes de las hamburguesas premium que buscan experiencias placenteras y sin remordimientos. Un público que disfruta presumir sus elecciones y que conecta con propuestas atrevidas, urbanas y con personalidad.',
        p8: '4️⃣ Ejecuciones',
        p9: 'La campaña se despliega mediante cartelería, folletos, packaging y colaboraciones con marcas como Durex, Heretics o Tinder. Cada pieza refuerza el espíritu provocador de VICIO y desemboca en la pregunta que guía toda la acción: ¿Entonces… Smash or Pass?',
        img1: 'portfolio/vicio1.png',
        img2: 'portfolio/vicio2.jpg',
        img3: 'portfolio/vicio3.png'
    },
    {
        id: '6',
        title: 'Exhibición y Campaña de Concienciación sobre la Depresión🎭​🏛️',
        tech: '',
        role: '',
        p1: '21 Grams of Death — Experiencia Transmedia sobre la Depresión. Una exposición interdisciplinar que transforma Oslo (Noruega) en un recorrido emocional por las tres fases de la depresión, combinando arte, narrativa y participación del público.',
        p2: '1️⃣ Concepto & Narrativa',
        p3: '“21 Grams of Death” es una experiencia transmedia que utiliza tres localizaciones reales de Oslo—Vigeland Park, Grünerlokka y el Museo Munch—para representar las tres fases del trastorno depresivo: inicio, agravamiento y colapso emocional. La propuesta integra arte, literatura y desplazamiento físico del visitante para generar una comprensión profunda y progresiva de la depresión.',
        p4: '2️⃣ Recorrido Expositivo',
        p5: 'Cada ubicación funciona como un capítulo emocional: esculturas simbólicas en Vigeland Park, arte urbano e ilustraciones en Grünerlokka, y obras de Munch junto a piezas originales en el Museo Munch. Este viaje espacial y sensorial sumerge al visitante en una narrativa que se vuelve cada vez más íntima y opresiva, reflejando el deterioro psicológico.',
        p6: '3️⃣ Estrategia Transmedia & Campaña “Beyond a Smile”',
        p7: 'La exposición se amplifica a través de una campaña centrada en la dualidad entre apariencia y salud mental. Incluye un spot narrativo, acciones en TikTok, Instagram y LinkedIn, y cartelería física en puntos clave de Oslo. El objetivo: generar conversación social, empatía y conciencia sobre lo que se esconde detrás de una sonrisa.',
        p8: '4️⃣ Identidad Visual & Web',
        p9: 'La identidad se basa en una estética oscura y emocional, con negro y rojo como colores principales. El diseño web replica el caos interno de la depresión: composiciones descentradas, ritmo visual inquietante y un recorrido que introduce gradualmente al usuario en la temática. Todo ello potencia el carácter inmersivo y reflexivo del proyecto.',
        img1: 'portfolio/21grams11.jpg',
        img2: 'portfolio/21grams1.jpg',
        img3: 'portfolio/21grams3.jpg'
    },
    {
        id: '7',
        title: 'Campaña Creativa de Publicidad Chivas Regal x Peaky Blinders🥃​🎩​',
        tech: '',
        role: '',
        p1: '"By Order of Chivas Regal". Una reinterpretación estética y conceptual que une el universo de Chivas Regal con la atmósfera icónica de Peaky Blinders. Más que una colaboración, la campaña revela un valor compartido: el poder silencioso. Todo el proyecto gira en torno a un liderazgo frío, elegante y ritualizado, donde el whisky se convierte en símbolo visual y narrativo.',
        p2: '1️⃣ Concepto & Estrategia',
        p3: 'Presencia que manda. Sabor de poder. Partiendo del insight “El verdadero liderazgo se bebe despacio.”, construí una narrativa que une el lujo sobrio de Chivas con la estética de Thomas Shelby. El resultado es un universo estratégico donde tradición, elegancia y poder contenido se entrelazan.',
        p4: '2️⃣ Activaciones de Marca',
        p5: 'La campaña se materializa en una serie de acciones premium diseñadas para expandir este universo estético. La edición limitada “The Shelby Company” presenta una botella negra con detalles dorados e identidad icónica. La colaboración con sastrerías de autor ofrece una experiencia exclusiva en la que, al encargar un traje a medida, el cliente recibe un cofre personalizado de Chivas. Las “Shelby Nights” completan el ecosistema con eventos privados ambientados en los años 20, reforzando la exclusividad y el respeto silencioso que definen a la marca.',
        p6: '3️⃣ Narrativa Audiovisual & Digital',
        p7: 'Un spot cinematográfico sin diálogos, centrado en la presencia. Iluminación dorada, silencios cargados de intención y el ritual del whisky como protagonista. En digital, una serie visual en Instagram y TikTok bajo el hashtag #SaborDePoder, exaltando gestos, texturas y estética masculina.',
        p8: '4️⃣ Buyer Persona & Motivación',
        p9: 'Víctor Alvear, abogado corporativo de 31 años, representa al consumidor ideal: disciplina, estética sobria, admiración por líderes silenciosos y rituales personales. Para él, Chivas no es un whisky: es una declaración de principios. Cada pieza de la campaña está diseñada para conectar con ese perfil elegante, serio y aspiracional.',
        img1: 'portfolio/chivas1.jpg',
        img2: 'portfolio/chivas2.jpg',
        img3: 'portfolio/chivas3.jpg'
    },
    {
        id: '8',
        title: 'Diseño de Marca, Revista y Cartelería para Festival​🕺​🎵',
        tech: '',
        role: '',
        p1: 'Momentum Festival es un proyecto de un festival de rap/hip-hop que diseñé por completo, desarrollando su concepto, identidad visual, logo, branding, revista y toda la gráfica que compone el festival.',
        p2: '1️⃣ Concepto & Visión del Festival',
        p3: 'Momentum surge como una propuesta de festival dedicado exclusivamente al hip-hop y al rap estadounidense, pensado para ofrecer una experiencia inmersiva en la Universidad Complutense de Madrid. El proyecto busca unir música, cultura urbana y comunidad en un entorno coherente y dinámico.',
        p4: '2️⃣ Investigación & Público Objetivo',
        p5: 'El análisis del mercado reveló la ausencia de un festival de estas características en España, tomando como referencia eventos como Rolling Loud o Wireless. El público principal está formado por jóvenes de 16 a 30 años interesados en el hip-hop, el streetwear, la tecnología y las experiencias culturales de alto impacto.',
        p6: '3️⃣ Identidad & Branding',
        p7: 'Desarrollé la identidad completa del festival mediante procesos de conceptualización como mapas mentales, brainstorming y análisis de tendencias. El resultado es una marca basada en energía, movimiento, autenticidad y conexión, con tipografías bold y una paleta neón que refuerza la estética urbana propia del proyecto.',
        p8: '4️⃣ Diseño Gráfico & Dirección Artística',
        p9: 'Diseñé toda la gráfica del festival: revista oficial, cartelería, escenografía, materiales digitales, moodboards e ilustraciones. La propuesta visual combina texturas urbanas, contrastes intensos y un enfoque dinámico que acompaña la identidad de Momentum y la cultura hip-hop.',
        img1: 'portfolio/momentum1.jpg',
        img2: 'portfolio/momentum2.jpg',
        img3: 'portfolio/momentum3.jpg'
    }
];

// 2. LÓGICA DE ANIMACIÓN AL SCROLL (Mantenido de tu JS original + actualizado)
document.addEventListener('DOMContentLoaded', () => {
    // ... [Tu código de Loader, Carruseles y Hamburguesa va aquí] ...

    // Función para la animación Fade-in Slide-up de proyectos
    const observeProjects = () => {
        const projectCards = document.querySelectorAll('.project-card');

        // Solo activa la animación de entrada si estamos en la página del portfolio
        if (projectCards.length === 0) return; 

        const observerOptions = {
            root: null, // viewport
            rootMargin: '0px',
            threshold: 0.1 // 10% del elemento visible
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // Deja el observador de proyectos activo solo para la primera vez
                    // observer.unobserve(entry.target); 
                }
            });
        }, observerOptions);

        projectCards.forEach(card => {
            observer.observe(card);
        });
    };

    // 3. LÓGICA DE INTERACCIÓN DE PROYECTOS (Abrir/Cerrar Panel)
    const setupProjectInteraction = () => {
        const detailPanel = document.getElementById('project-detail-panel');
        const detailTitle = document.getElementById('detail-title');
        
        const detailP1 = document.getElementById('detail-p1');
        const detailP2 = document.getElementById('detail-p2');
        const detailP3 = document.getElementById('detail-p3');
        const detailImg1 = document.getElementById('detail-img-1');
        const detailImg2 = document.getElementById('detail-img-2');
        const detailImg3 = document.getElementById('detail-img-3');
        const closeButtons = document.querySelectorAll('.project-detail-panel .close-btn, .project-detail-panel .close-btn-bottom');

        // Función para llenar el panel con la data
        const populatePanel = (project) => {
            detailTitle.textContent = project.title;
          
           // Selecciona el contenedor general donde meterás todos los párrafos
const detailTextContainer = document.getElementById('detail-text-container');

// Genera automáticamente todos los p1, p2, p3... p20 que existan
let paragraphs = "";

for (let i = 1; i <= 30; i++) {  
    if (project[`p${i}`]) {
        paragraphs += `<p>${project[`p${i}`]}</p>`;

    }
}

detailTextContainer.innerHTML = paragraphs;

            detailImg1.src = project.img1;
            detailImg2.src = project.img2;
            detailImg3.src = project.img3;
            detailImg1.alt = project.title + ' - Detalle 1';
            detailImg2.alt = project.title + ' - Detalle 2';
            detailImg3.alt = project.title + ' - Detalle 3';
        };

        // Abrir el panel
        document.querySelectorAll('.project-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const card = e.target.closest('.project-card');
                const projectId = card.dataset.projectId;
                const project = projectData.find(p => p.id === projectId);

                if (project) {
                    populatePanel(project);
                    detailPanel.classList.add('active');
                    document.body.style.overflow = 'hidden'; // Evita el scroll del body
                    detailPanel.scrollTop = 0; // Asegura que empiece arriba
                }
            });
        });

        // Cerrar el panel
        closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                detailPanel.classList.remove('active');
                document.body.style.overflow = ''; // Restaura el scroll del body
            });
        });

        // Cerrar con tecla ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && detailPanel.classList.contains('active')) {
                detailPanel.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    };

    // Ejecuta las funciones si la página de portfolio está cargada
    observeProjects();
    setupProjectInteraction();

    // ... [Tu código de Carousel Duplication y Scroll Reveal para el Footer va aquí] ...
});





































































document.addEventListener("DOMContentLoaded", () => {
  
  // =========================================
  // 1. LOADER LOGIC (Manteniendo tu lógica actual)
  // =========================================
  const loader = document.getElementById("loader");
  const loaderVideo = document.getElementById("loader-video");

  // Fallback de seguridad: quitar loader a los 4 segundos si el video falla
  setTimeout(() => {
    if (loader && !loader.classList.contains('fade-out')) {
      loader.classList.add("fade-out");
    }
  }, 4000);

  if (loaderVideo) {
    loaderVideo.onended = function() {
      loader.classList.add("fade-out");
    };
  }

  // =========================================
  // 2. MOBILE MENU LOGIC
  // =========================================
 const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu-overlay');
const mobileNavLinks = document.querySelectorAll('.mobile-nav a');

if (menuToggle && mobileMenu) {
  const toggleMenu = () => {
    const isOpen = menuToggle.classList.toggle('open'); // Cambia la clase del botón
    mobileMenu.classList.toggle('active', isOpen);      // Cambia la clase del overlay
    document.body.style.overflow = isOpen ? 'hidden' : 'auto'; // Evita scroll
    menuToggle.setAttribute("aria-expanded", isOpen);
  };

  menuToggle.addEventListener('click', toggleMenu);

  // Cerrar menú al hacer click en un enlace
  mobileNavLinks.forEach(link => link.addEventListener('click', () => {
    toggleMenu();
  }));
}

  // =========================================
  // 3. SCROLL ANIMATIONS (INTERSECTION OBSERVER)
  // =========================================
  
  const revealElements = document.querySelectorAll('.reveal-up');
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.getAttribute('data-delay');
      if (delay) entry.target.style.transitionDelay = `${delay}s`;
      entry.target.classList.add('active');
      observer.unobserve(entry.target);
    }
  });
}, {
  root: null,
  threshold: 0.05, // Antes estaba 0.15
  rootMargin: "0px 0px -100px 0px" // Margin negativo para disparar antes
});

  revealElements.forEach(el => revealObserver.observe(el));

  // =========================================
  // 4. HEADER ANIMATION ON SCROLL
  // =========================================
  let lastScrollY = window.scrollY;

  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;

    // Efecto de fondo borroso al bajar
    if (currentScrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

    lastScrollY = currentScrollY;
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const footer = document.querySelector('.main-footer');
  if (footer) footer.classList.add('active');
});


