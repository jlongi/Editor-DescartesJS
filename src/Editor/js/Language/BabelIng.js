/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var babel = (function(babel) {
  if (babel.loadLib) { return babel; }

  /**
   * Translate to save the configuration
   */
  babel.ing = 
  {
    "true": "yes",
    "false": "no",

    // params translate
    size: "size",
    image_loader: "image_loader",
    expand: "expand",
    decimal_symbol: "decimal_symbol",
    antialias: "antialias",
    undo: "undo",
    name: "name",
    version: "Version",
    language: "Language",
    buttons: "Buttons",
    about: "about",
    config: "config",
    init: "init", 
    clear: "clear",
    rowsNorth: "rows_north", 
    rowsSouth: "rows_south", 
    widthEast: "width_east", 
    widthWest: "width_west", 
    heightRows: "height",

    // space translate
    type: "type",
    width: "width",
    height: "height",
    drawif: "draw-if",
    fixed: "fixed",
    scale: "scale",
    bg_display: "bg_display",
    topleft: "topleft",
    stretch: "stretch",
    patch: "patch",
    imgcenter: "center",
    background: "background",
    net: "net",
    net10: "net10",
    axes: "axes",
    numbers: "numbers",
    x_axis: "x-axis",
    y_axis: "y-axis",
    sensitive_to_mouse_movements: "sensitive_to_mouse_movements",
    render: "render",
    sort: "sort",
    painter: "painter",
    raytrace: "ray trace",
    split: "split",

    // control translate
    Buttons: "Buttons",
    numeric: "numeric",
    graphic: "graphic",
    gui: "gui",
    spinner: "spinner",
    textfield: "textfield",
    menu: "menu",
    scrollbar: "scrollbar",
    button: "button",
    region: "region",
    north: "north",
    south: "south",
    east: "east",
    west: "west",
    interior: "interior",
    external: "external",
    scenario: "scenario",
    space: "space",
    expression: "expresion",
    value: "value",
    discrete: "discrete",
    decimals: "decimals",
    visible: "visible",
    onlyText: "only_text",
    evaluate: "evaluate",
    answer: "answer",
    options: "options",
    min: "min",
    max: "max",
    color: "colour",
    colorInt: "int-colour",
    bold: "bold",
    italics: "italics",
    underlined: "underlined",
    font_size: "font size",
    activeif: "active-if",
    exponentialif: "exponential-if",
    constraint: "constraint",
    action: "action",
    calculate: "calculate",
    init: "init",
    clear: "clear",
    animate: "animate",
    openURL: "open URL",
    openScene: "open Scene",
    play: "play",
    initAnimation: "Init Animation",

    // definitions translate
    constant: "constant",
    variable: "variable",
    "function": "function",
    algorithm: "algorithm",
    array: "array",
    matrix: "matrix",
    rows: "rows",
    columns: "columns",
    onlyOnce: "only-once",
    always: "always",
    range: "range",
    doExpr: "do",
    whileExpr: "while",
    file: "file",

    // programs translate
    "event": "event",
    execution: "execution",
    condition: "condition",
    alternate: "alternate",
    msg_pos: "msg_pos",
    center: "center",
    top_left: "top_left",
    top_center: "top_center",
    top_right: "top_right",
    left: "left",
    right: "right",
    bottom_left: "bottom_left",
    bottom: "bottom",
    bottom_right: "bottom_right",

    // graphcs translate
    equation: "equation",
    curve: "curve",
    sequence: "sequence",
    point: "point",
    segment: "segment",
    arrow: "arrow",
    polygon: "polygon",
    rectangle: "rectangle",
    arc: "arc",
    fill: "fill",
    text: "text",
    image: "image",
    macro: "macro",
    abs_coord: "abs_coord",
    trace: "trace",
    family: "family",
    editable: "editable",
    fillP: "fill+",
    fillM: "fill-",
    parameter: "parameter",
    font: "font",
    spear: "spear",
    radius: "radius",
    end: "end",
    vectors: "vectors",
    border: "color_text_border",
    opacity: "opacity",
    inirot: "inirot",
    inipos: "inipos",
    endrot: "endrot",
    endpos: "endpos",

    interval: "interval",
    steps: "steps",

    // graphcs3D translate
    backcolor: "backcolor",
    edges: "edges",
    model: "model",
    triangle: "triangle",
    face: "face",
    polireg: "regpoly",
    surface: "surface",
    cube: "cube",
    box: "box",
    cone: "cone",
    cylinder: "cylinder",
    sphere: "sphere",
    tetrahedron: "tetrahedron",
    octahedron: "octahedron",
    dodecahedron: "dodecahedron",
    icosahedron: "icosahedron",
    ellipsoid: "ellipsoid",
    torus: "torus",
    light: "light",
    metal: "metal",
    wire: "wire",
    length: "length",

    // animation translate
    Animation: "Animation",
    delay: "delay",
    controls: "controls",
    loop: "loop",
  }

  /**
   * Translate of the param editor GUI
   */
  babel.GUIing = 
  {
    configuration: "Configuration",
    buttons: "Scene",
    spaces: "Spaces",
    controls: "Controls",
    definitions: "Definitions",
    programs: "Programs",
    graphics: "Graphics",
    graphics3D: "3D Graphics",
    animation: "Animation",

    about_SCENE: "button about",
    config_SCENE: "button config",
    init_SCENE: "button init",
    clear_SCENE: "button clear",
    
    library: "library",

    color_BTN: "text color",
    colorInt: "interior color",
    flat: "flat",
    border: "text border",
    borderColor: "text border",
    text_align: "pos text",
    image_align: "pos image",
    font_size: "font size",
    font_family: "font",

    resizable: "resizable",
    fillP: "positive fill",
    fillM: "negative fill",
    width_TEXT: "text width",
    inirot_IMG: "rotation",
    inipos_MACRO: "position",
    inirot_MACRO: "rotation",
    expression_MACRO: "file",

    align: "text align",
    a_center: "center",
    a_left: "left",
    a_right: "right",

    anchor: "anchor",
    a_top_left: "top-left",
    a_top_center: "top-center",
    a_top_right: "top-right",
    a_center_left: "center-left",
    a_center_center: "center-center",
    a_center_right: "center-right",
    a_bottom_left: "bottom-left",
    a_bottom_center: "bottom-center",
    a_bottom_right: "bottom-right",

    checkbox: "checkbox",
    border_radius: "border radius",
    radio_group: "group",

    cssClass: "CSS class",

    ok_btn: "Ok",
    close_btn: "Close",
    apply_btn: "Apply",
    cancel_btn: "Cancel",
    copy_btn: "Copy",
    paste_btn: "Paste",

    rowsNorth: "rows north",
    rowsSouth: "rows south",
    widthWest: "width west",
    widthEast: "width east",
    heightRows: "height rows",
    decimal_symbol: "decimal symbol",
    language: "language",
    editable_buttons: "show external region",
    expand: "expand scene",
    cover: "cover",
    fit: "fit",
    image_loader: "image loader",

    bg_display: "background display",
    sensitive_to_mouse_movements: "sensitive to mouse movements",

    stretch: "stretch",
    openScene: "open scene",
    onlyText: "only text",

    onlyOnce: "only once",
    initAnimation: "init animation",

    drawif: "draw if",
    activeif: "active if",
    exponentialif: "exponential if",
    family: "parameter",
    useFamily: "family",
    family_interval: "interval",
    family_steps: "steps",
    parameter_interval: "interval",
    parameter_steps: "steps",
    abs_coord: "abs coord",

    backcolor: "back color",

    useAnimation: "Animation",

    add_spaces: "Add space",
    add_controls: "Add control",
    add_definitions: "Add definition",
    add_programs: "Add program",
    add_graphics: "Add graphic",
    add_graphics3D: "Add 3D graphics",
    add_element: "Add",
    remove_spaces: "Remove space",
    remove_controls: "Remove control",
    remove_definitions: "Remove definition",
    remove_programs: "Remove program",
    remove_graphics: "Remove graphic",
    remove_graphics3D: "Remove 3D graphic",
    remove_element: "Remove",
    clone_spaces: "Clone space",
    clone_controls: "Clone control",
    clone_definitions: "Clone definition",
    clone_programs: "Clone program",
    clone_graphics: "Clone graphic",
    clone_graphics3D: "Clone 3D graphic",
    clone_element: "Clone",

    polireg: "regular polygon",

    lineDash: "line style",
    solid: "solid",
    dot: "· · · ·",
    dash: "− − − −",
    dash_dot: "− · − ·",

    offset_dist: "offset",
    offset_angle: "angle",

    "000000": "black",
    "ff00ff": "magenta",
    "0000ff": "blue",
    "00ffff": "cyan",
    "00ff00": "green",
    "ffff00": "yellow",
    "ffc800": "orange",
    "ff0000": "red",
    "ffafaf": "pink",
    "404040": "darkGray",
    "808080": "gray",
    "c0c0c0": "lightGray",
    "ffffff": "white",

    español: "spanish",
    english: "english",

    // general GUI
    "continue": "continue",
    "new": "New",
    new_window: "New window",
    open: "Open",
    open_url: "Open URL",
    reload: "Reload",
    save: "Save",
    save_as: "Save as",
    export_macro: "Descartes macro",
    export_library: "Descartes library",
    export_png: "png",
    export_jpg: "jpg",
    export_svg: "svg (⚠ experimental)",
    export_pdf: "pdf (⚠ experimental)",
    export_pstricks: "pstricks (⚠ experimental)",
    close_scene: "Close scene",
    exit: "Exit",
    open_recent: "Recently opened",
    export: "Export",
    internet: "internet",
    portable: "portable",
    project: "proyect",
    custom: "custom",
    min_type_internet: "internet",
    min_type_portable: "portable",
    min_type_proyecto: "project",
    min_type_personalizada: "custom",
    language_menu: "Language",
    language_Esp: "Spanish",
    language_Ing: "English",
    theme: "Color theme",
    theme_default: "Bright",
    theme_dark: "Dark",
    console: "Show console",
    title_console: "Descartes console",   
    documentation: "Documentation",
    about_menu: "About Descartes editor",
    file_menu: "File",
    option_menu: "Options",
    help_menu: "Help",
    clear_open_recent: "Empty menu",

    // char blocks
    block_0: "Basic Latin",
    block_1: "Latin 1",
    block_2: "Latin Extended A",
    block_3: "Latin Extended B",
    block_4: "Basic Greek",
    block_5: "Cyrillic",
    block_6: "Basic Hebrew",
    block_7: "Basic Arab",
    block_8: "General Punctuation",
    block_9: "Currency Symbols",
    block_10: "Letterlike Symbols",
    block_11: "Number Forms",
    block_12: "Arrows",
    block_13: "Mathematical Operators",
    block_14: "Box Drawing",
    block_15: "Block Elements",
    block_16: "Miscelaneous Symbols",

    // dialog
    descartes_location_question: "Where is the file <i><b>descartes-min.js</b></i> located?",
    to_grayscale: "Convert colors to grayscale?",
    white_background: "Change the background color (non-transparent) of the spaces to white?",
    pstricks_title: "Export to PSTricks options",
    reload_content: "If you continue your changes will be lost<br>Do you want to continue?",
    save_content: "Do you want to save the changes?",

    "undefined": "---"
  }

  return babel;
})(babel || {});