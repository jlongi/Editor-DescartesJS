/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var babel = (function(babel) {
  if (babel.loadLib) { return babel; }

  /**
   * Translate to save the configuration
   */
  babel.esp = 
  {
    "true": "sí",
    "false": "no",

    // params translate
    size: "tama\u00F1o",
    image_loader: "image_loader",
    expand: "expand",
    decimal_symbol: "decimal_symbol",
    antialias: "antialias",
    undo: "deshacer",
    name: "nombre",
    version: "Versión",
    language: "Idioma",
    buttons: "Botones",
    about: "créditos",
    config: "config", 
    init: "inicio", 
    clear: "limpiar",
    rowsNorth: "filas_norte", 
    rowsSouth: "filas_sur", 
    widthEast: "ancho_este", 
    widthWest: "ancho_oeste", 
    heightRows: "alto",

    // space translate
    type: "tipo",
    width: "ancho",
    height: "alto",
    drawif: "dibujar-si",
    fixed: "fijo",
    scale: "escala",
    bg_display: "despl_imagen",
    topleft: "arr-izq",
    stretch: "expand.",
    patch: "mosaico",
    imgcenter: "centrada",
    background: "fondo",
    net: "red",
    net10: "red10",
    axes: "ejes",
    numbers: "n\u00FAmeros",
    x_axis: "eje-x",
    y_axis: "eje-y",
    sensitive_to_mouse_movements: "sensible_a_los_movimientos_del_rat\u00F3n",
    render: "despliegue",
    sort: "orden",
    painter: "pintor",
    raytrace: "trazado de rayos",
    split: "cortar",

    // control translate
    Buttons: "Botones",
    numeric: "num\u00E9rico",
    graphic: "gr\u00E1fico",
    gui: "interfaz",
    spinner: "pulsador",
    textfield: "campo de texto",
    menu: "men\u00FA",
    scrollbar: "barra",
    button: "bot\u00F3n",
    region: "regi\u00F3n",
    north: "norte",
    south: "sur",
    east: "este",
    west: "oeste",
    interior: "interior",
    external: "exterior",
    scenario: "escenario",
    space: "espacio",
    expression: "expresión",
    value: "valor",
    discrete: "discreto",
    decimals: "decimales",
    visible: "visible",
    onlyText: "solo_texto",
    evaluate: "evaluar",
    answer: "respuesta",
    options: "opciones",
    min: "min",
    max: "max",
    color: "color",
    colorInt: "color-int",
    bold: "negrita",
    italics: "cursiva",
    underlined: "subrayada",
    font_size: "fuente puntos",
    activeif: "activo-si",
    exponentialif: "exponencial-si",
    constraint: "constricción",
    action: "acci\u00F3n",
    calculate: "calcular",
    init: "inicio",
    clear: "limpiar",
    animate: "animar",
    openURL: "abrir URL",
    openScene: "abrir Escena",
    play: "reproducir",
    initAnimation: "Reiniciar Animación",

    // definitions translate
    constant: "constante",
    variable: "variable",
    "function": "funci\u00F3n",
    algorithm: "algoritmo",
    array: "vector",
    matrix: "matriz",
    rows: "filas",
    columns: "columnas",
    onlyOnce: "una-sola-vez",
    always: "siempre",
    range: "dominio",
    doExpr: "hacer",
    whileExpr: "mientras",
    file: "archivo",

    // programs translate
    "event": "evento",
    execution: "ejecuci\u00F3n",
    condition: "condición",
    alternate: "alternar",
    msg_pos: "pos_mensajes",
    center: "centro",
    top_left: "arr_izq",
    top_center: "arriba",
    top_right: "arr_der",
    left: "izquierda",
    right: "derecha",
    bottom_left: "ab_izq",
    bottom: "abajo",
    bottom_right: "ab_der",

    // graphcs translate
    equation: "ecuaci\u00F3n",
    curve: "curva",
    sequence: "sucesi\u00F3n",
    point: "punto",
    segment: "segmento",
    arrow: "flecha",
    polygon: "pol\u00EDgono",
    rectangle: "rectángulo",
    arc: "arco",
    fill: "relleno",
    text: "texto",
    image: "imagen",
    macro: "macro",
    abs_coord: "coord_abs",
    trace: "rastro",
    family: "familia",
    editable: "editable",
    fillP: "relleno+",
    fillM: "relleno-",
    parameter: "par\u00E1metro",
    font: "fuente",
    spear: "punta",
    radius: "radio",
    end: "fin",
    vectors: "vectores",
    border: "color_borde_texto",
    opacity: "opacidad",
    inirot: "rotini",
    inipos: "posini",
    endrot: "rotfin",
    endpos: "posfin",

    interval: "intervalo",
    steps: "pasos",

    // graphcs3D translate
    backcolor: "color_reverso",
    edges: "aristas",
    model: "modelo",
    triangle: "tri\u00E1ngulo",
    face: "cara",
    polireg: "polireg",
    surface: "superficie",
    cube: "cubo",
    box: "paralelep\u00edpedo",
    cone: "cono",
    cylinder: "cilindro",
    sphere: "esfera",
    tetrahedron: "tetraedro",
    octahedron: "octaedro",
    dodecahedron: "dodecaedro",
    icosahedron: "icosaedro",
    ellipsoid: "elipsoide",
    torus: "toro",
    light: "luz",
    metal: "metal",
    wire: "alambre",
    length: "largo",

    // animation translate
    Animation: "Animación",
    delay: "pausa",
    controls: "controles",
    loop: "repetir",
  }

  /**
   * Translate of the param editor GUI
   */
  babel.GUIesp = 
  {
    configuration: "Configuración",
    buttons: "Escena",
    spaces: "Espacios",
    controls: "Controles",
    definitions: "Definiciones",
    programs: "Programa",
    graphics: "Gráficos",
    graphics3D: "Gráficos 3D",
    animation: "Animación",

    about_SCENE: "botón créditos",
    config_SCENE: "botón config", 
    init_SCENE: "botón inicio", 
    clear_SCENE: "botón limpiar",

    library: "biblioteca",

    color_BTN: "color texto",
    colorInt: "color interior",
    flat: "sin degradado",
    border: "borde texto",
    borderColor: "borde texto",
    text_align: "pos texto",
    image_align: "pos imagen",
    font_size: "tam fuente",
    font_family: "fuente",

    resizable: "redimensionable",
    fillP: "relleno positivo",
    fillM: "relleno negativo",
    width_TEXT: "ancho del texto",
    inirot_IMG: "rotación",
    inipos_MACRO: "posición",
    inirot_MACRO: "rotación",
    expression_MACRO: "archivo",
    
    align: "alineación del texto",
    a_center: "centro",
    a_left: "izquierda",
    a_right: "derecha",

    anchor: "punto de anclaje",
    a_top_left: "arriba-izquierda",
    a_top_center: "arriba-centro",
    a_top_right: "arriba-derecha",
    a_center_left: "centro-izquierda",
    a_center_center: "centro-centro",
    a_center_right: "centro-derecha",
    a_bottom_left: "abajo-izquierda",
    a_bottom_center: "abajo-centro",
    a_bottom_right: "abajo-derecha",

    checkbox: "casilla de verificación",
    border_radius: "radio del borde",
    radio_group: "grupo",

    cssClass: "clase CSS",

    ok_btn: "Aceptar",
    close_btn: "Cerrar",
    apply_btn: "Aplicar",
    cancel_btn: "Cancelar",
    copy_btn: "Copiar",
    paste_btn: "Pegar",

    rowsNorth: "filas al norte",
    rowsSouth: "filas al sur",
    widthWest: "ancho oeste",
    widthEast: "ancho este",
    heightRows: "alto filas",
    decimal_symbol: "signo decimal",
    language: "idioma",
    editable_buttons: "mostrar región exterior",
    expand: "expandir escena",
    cover: "cubrir",
    fit: "escalar",
    image_loader: "imagen del cargador",

    bg_display: "despliegue de imagen",
    sensitive_to_mouse_movements: "sensible a los movimientos del ratón",

    stretch: "expandir",
    openScene: "abrir escena",
    onlyText: "solo texto",

    onlyOnce: "una sola vez",
    initAnimation: "reiniciar animación",

    drawif: "dibujar si",
    activeif: "activo si",
    exponentialif: "exponencial si",
    family: "parámetro",
    useFamily: "familia",
    family_interval: "intervalo",
    family_steps: "pasos",
    parameter_interval: "intervalo",
    parameter_steps: "pasos",
    abs_coord: "coord abs",

    backcolor: "color reverso",

    useAnimation: "Animación",

    add_spaces: "Agregar espacio",
    add_controls: "Agregar control",
    add_definitions: "Agregar definición",
    add_programs: "Agregar programa",
    add_graphics: "Agregar gráfico",
    add_graphics3D: "Agregar gráfico 3D",
    add_element: "Agregar",
    remove_spaces: "Eliminar espacio",
    remove_controls: "Eliminar control",
    remove_definitions: "Eliminar definición",
    remove_programs: "Eliminar programa",
    remove_graphics: "Eliminar gráfico",
    remove_graphics3D: "Eliminar gráfico 3D",
    remove_element: "Eliminar",
    clone_spaces: "Clonar espacio",
    clone_controls: "Clonar control",
    clone_definitions: "Clonar definición",
    clone_programs: "Clonar programa",
    clone_graphics: "Clonar gráfico",
    clone_graphics3D: "Clonar gráfico 3D",
    clone_element: "Clonar",

    polireg: "polígono regular",

    lineDash: "estilo de l\u00EDnea",
    solid: "solida",
    dot: "· · · ·",
    dash: "− − − −",
    dash_dot: "− · − ·",

    offset_dist: "distancia",
    offset_angle: "ángulo",

    "000000": "negro",
    "ff00ff": "magenta",
    "0000ff": "azul",
    "00ffff": "turquesa",
    "00ff00": "verde",
    "ffff00": "amarillo",
    "ffc800": "naranja",
    "ff0000": "rojo",
    "ffafaf": "rosa",
    "404040": "grisObscuro",
    "808080": "gris",
    "c0c0c0": "grisClaro",
    "ffffff": "blanco",

    español: "español",
    english: "inglés",

    // general GUI
    "continue": "Continuar",
    "new": "Nuevo",
    new_window: "Nueva ventana",
    open: "Abrir",
    open_url: "Abrir URL",
    reload: "Recargar",
    save: "Guardar",
    save_as: "Guardar como",
    export_macro: "macro de Descartes",
    export_library: "biblioteca de Descartes",
    export_png: "png",
    export_jpg: "jpg",
    export_svg: "svg (⚠ experimental)",
    export_pdf: "pdf (⚠ experimental)",
    export_pstricks: "pstricks (⚠ experimental)",
    close_scene: "Cerrar escena",
    exit: "Salir",
    open_recent: "Abrir reciente",
    export: "Exportar a",
    internet: "en internet",
    portable: "portable",
    project: "de proyecto",
    custom: "personalizada",
    min_type_internet: "internet",
    min_type_portable: "portable",
    min_type_proyecto: "proyecto",
    min_type_personalizada: "personalizada",
    language_menu: "Lenguaje",
    language_Esp: "Español",
    language_Ing: "Inglés",
    theme: "Tema de color",
    theme_default: "Claro",
    theme_dark: "Obscuro",
    console: "Mostrar consola",
    title_console: "Consola Descartes",
    documentation: "Documentación",
    about_menu: "Acerca del editor Descartes",
    file_menu: "Archivo",
    option_menu: "Opciones",
    help_menu: "Ayuda",
    clear_open_recent: "Vaciar menú",

    // char blocks
    block_0: "Latino básico",
    block_1: "Latino 1",
    block_2: "Latino extendido A",
    block_3: "Latino extendido B",
    block_4: "Griego básico",
    block_5: "Cirílico",
    block_6: "Hebreo básico",
    block_7: "Árabe básico",
    block_8: "Puntuación general",
    block_9: "Símbolos de moneda",
    block_10: "Símbolos tipo carta",
    block_11: "Formatos de números",
    block_12: "Flechas",
    block_13: "Operadores matemáticos",
    block_14: "Bordes de cuadros",
    block_15: "Elementos de bloque",
    block_16: "Símbolos variados",

    // dialog
    descartes_location_question: "¿Cuál es la ubicación del archivo <i><b>descartes-min.js</b></i> que desea utilizar?",
    to_grayscale: "¿Convertir los colores a escala de grises?",
    white_background: "¿Cambiar el color de fondo (no transparente) de los espacios a blanco?",
    pstricks_title: "Opciones de exportación a PSTricks",
    reload_content: "Si continua se perderan los cambios<br>¿Desea continuar?",
    save_content: "¿Desea guardar los cambios?",

    "undefined": "---"
  }

  return babel;
})(babel || {});