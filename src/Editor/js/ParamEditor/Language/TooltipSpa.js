/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var paramEditor = (function(paramEditor) {

// reemplazar &lt; por < y &gt; >

  /**
   *
   */
  paramEditor.Tooltip.esp = {
		/**
		 * Panel tabs
		 */
		Panels: {
			Buttons: 'Selecciona el panel de edición de configuración general de la escena y filas de controles numéricos.',
			Spaces: 'Selecciona el panel de edición de Espacios.',
			Controls: 'Selecciona el panel de edición de Controles.',
			Definitions: 'Selecciona el panel de edición de Definiciones.\n\nLas Definiciones son todos los vectores, matrices, funciones, variables y bibliotecas de una escena.',
			Programs: 'Selecciona el panel de edición de Programa.\n\nLos Programas son todos los algoritmos y eventos de una escena.',
			Graphics: 'Selecciona el panel de edición de Gráficos 2D.',
			Graphics3D: 'Selecciona el panel de edición de Gráficos 3D.',	
			Animation: 'Selecciona el panel de edición de la Animación.'
		},

		/**
		 * Panel list edit
		 */
		ListEditButtons: {
			add: 'Agrega un nuevo elemento a la lista.',
			clone: 'Agrega a la lista un nuevo elemento idéntico al que se encuentra seleccionado.',
			delete: 'Elimina de la lista el elemento seleccionado.',
			list: 'Abre una ventana de texto para editar manualmente todos los objetos de la lista.',
			up_down: 'Cambia el orden de la lista permutando el elemento seleccionado por su vecino.\n\nSi se mantiene presionado repite rápidamente la operación.'
		},

		/**
		 * Buttons
		 */
		Buttons: {
			width: 'El ancho de la escena en pixeles.',
			height: 'La altura de la escena en pixeles.',

			about: 'Determina si el botón "Créditos" aparece en la escena.\n\nEl botón "Créditos" abre una ventana con la información de los autores de Descartes.',
			config: 'Determina si el botón "Config" aparece en la escena.\n\nEl botón "Config" abre una ventana con la configuración de la escena.',
			init: 'Determina si el botón "Inicio" aparece en la escena.\n\nEl botón "Inicio" reinicia los valores de los controles y auxiliares, regresando la escena a su estado inicial.\n\nSi hay animación automática, ésta comienza de nuevo.',
			clear: 'Determina si el botón "Limpiar" aparece en la escena.\n\nEl botón "Limpiar" borra los rastros dejados por las gráficas que tienen la opción "rastro" activada.',
			
			rowsNorth: 'Número de filas que ocuparán los controles numéricos colocados en la región Norte.\n\nSi el valor es cero entonces habrá una fila si es necesaria, pero si no lo es, no habrá ninguna.\n\nEl valor por defecto es cero.',
			rowsSouth: 'Número de filas que ocuparán los controles numéricos colocados en la región Sur.\n\nSi el valor es cero entonces (de ser necesaria) habrá una fila, si no lo es, no habrá ninguna.\n\nEl valor por defecto es cero.',
			widthWest: 'Ancho, en pixeles, de la región Oeste para controles numéricos.\n\nEl valor por defecto es 150.\n\nSi columnas_oeste=0, pero existe al menos un control numérico en la región Este, entonces se adopta por defecto un valor de 125.',
			widthEast: 'Ancho, en pixeles, de la región Este para controles numéricos.\n\nEl valor por defecto es 150.\n\nSi columnas_este=0, pero existe al menos un control numérico en la región Este, entonces se adopta por defecto un valor de 125.',
			heightRows: 'Altura, en pixeles, de los controles numéricos en las regiones norte y sur. El valor por defecto es 40.',

			decimal_symbol: 'El signo decimal, es decir el símbolo que separa los enteros de los decimales en una expresión decimal.\n\nEn algunos países se usa la coma y en otros el punto.',
			language: 'Menú desplegable para elegir el lenguage del editor, de las explicaciones.',
			editable: 'Determina si se muestra el espacio exterior, por medio de un clic derecho del ratón sobre la escena.',
			expand: 'Menú desplegable con opciones para modificar las dimensiones de la escena.\n\nEl valor por defecto es vacío, lo que indica no realizar cambios en las dimensiones.\n\nCubir: cambia solo el ancho y el alto de las escenas que tengan un valor del 100%, para que tengan las dimensiones de su contenedor.\n\nEscalar: modifica la escala de los pixeles de la escena para cubrir las dimensiones de su contendor, dando un efecto de zoom en toda la escena.',
			image_loader: 'Campo de texto en el que puede escribirse el nombre de un archivo que contiene una imagen.\n\nEsta imagen se usará como la imagen de carga de la escena.\n\nEl valor por defecto es vacío, lo que indica que se muestre el logotipo de Descartes.'
		},

		/**
		 * Spaces
		 */
		Spaces: {
			type: 'Determina el tipo del espacio, el cual puede ser de dos o tres dimensiones, o de tipo HTMLIFrame.',
			id: 'El identificador del espacio.\n\nEs un campo de texto cuyo contenido es el nombre o identificador del espacio.',
			cID: '***.',
			x: 'Abscisa del extremo superior izquierdo de la ventana del espacio. Es decir, su distancia al margen izquierdo de la escena.\n\nSe puede especificar con un número de pixeles (por ejemplo 20) o con un porcentaje (por ejemplo 10%) del ancho total de la escena.',
			y: 'Ordenada del extremo superior izquierdo de la ventana del espacio. Es decir, su distancia al margen superior de la escena.\n\nSe puede especificar con un número de pixeles (por ejemplo 20) o con un porcentaje (por ejemplo 10%) del alto total de la escena.',
			width: 'Ancho del espacio.\n\nSe puede especificar con un número de pixeles (por ejemplo 240) o con un porcentaje (por ejemplo 50%) del ancho total de la escena.',
			height: 'Altura del espacio.\n\nSe puede especificar con un número de pixeles (por ejemplo 180) o con un porcentaje (por ejemplo 50%) del alto total de la escena.',
			drawif: 'Expresión matemática que determina si el espacio es visible o no.\n\nEl espacio es invisible, si y sólo si, el valor de la expresión es cero.\n\nSi se deja en blanco este espacio será siempre visible.',
			fixed: 'Selector que impide que el usuario modifique la escala y la localización del origen (en R2) o el punto de vista (en R3) arrastrando el espacio con el ratón.',
			scale: 'Valor de la escala, es decir, el tamaño en pixeles de un segmento unitario (o de longitud 1).\n\nPara modificar esta variable hay que referirse a ella como <id>.escala, donde <id> es el identificador del espacio.\n\nNota: Es importante que los identificadores no contengan espacios ni símbolos de operadores.',
			"O.x": 'Distancia, en pixeles (hacia la derecha), del centro del espacio al punto donde se dibujará el origen de coordenadas.\n\nPara modificar esta variable hay que referirse a ella como <id>.Ox, donde <id> es el identificador del espacio.\n\nNota: Es importante que los identificadores no contengan espacios ni símbolos de operadores.',
			"O.y": 'Distancia, en pixeles (hacia abajo), del centro del espacio al punto donde se dibujará el origen de coordenadas.\n\nPara modificar esta variable hay que referirse a ella como <id>.Oy, donde <id> es el identificador del espacio.\n\nNota: Es importante que los identificadores no contengan espacios ni símbolos de operadores.',
			image: 'Campo de texto en el que puede escribirse el nombre de un archivo que contiene una imagen.\n\nEsta imagen se usará como fondo del espacio. Sólo pueden utilizarse archivos jpg, gif y svg. Los archivos de imágenes deben colocarse en el mismo sitio donde se coloca el archivo html de la escena o en subdirectorios a partir de ahí. En el nombre del archivo hay que incluir los subdirectorios.',
			bg_display: 'Selector con las opciones: "arr-izq", "expandir", "mosaico" y "centrada", que indican cómo se desplegará la imagen del fondo del espacio.',
			background: 'Color con que se pinta el fondo del espacio.\n\nUn clic sobre el botón activa el editor de colores.\n\nEl valor por defecto es blanco (#ffffff).',
			axes: 'Color con que se pintan los ejes de coordenadas.\n\nEl selector sirve para decidir si los ejes se dibujan o no se dibujan.\n\nEl botón llama al editor de colores.\n\nLos valores por defecto son el selector activado y el color gris obscuro (#404040).',
			net: 'Color con que se pinta una red de rectas paralelas a los ejes de coordenadas que sirven como referencia.\n\nEl selector sirve para decidir si la red se dibuja o no.\n\nEl botón llama al editor de colores.\n\nLos valores por defecto son el selector activado y el color gris claro (#c0c0c0).',
			net10: 'Color con que se pinta una red cada 10 unidades de la red anterior. El selector sirve para decidir si la red10 se dibuja o no.\n\nEl botón llama al editor de colores.\n\nLos valores por defecto son el selector activado y el color gris (#808080).',
			text: 'Color con que se escriben las coordenadas al pulsar el botón izquierdo del ratón en el espacio.\n\nEl selector sirve para decidir si las coordenadas se escriben o no.\n\nEl botón llama al selector de colores.\n\nLos valores por defecto son el selector desactivado.',
			numbers: 'Selector para decidir si se escriben algunos valores de las coordenadas sobre los ejes. En caso de escribirse estas coordenadas aparecen en el mismo color que los ejes.\n\nSólo pueden escribirse las coordenadas si los ejes se dibujan.\n\nEl valor por defecto es desactivado.',
			x_axis: 'Etiqueta que se dibujará a la derecha de la escena, justo abajo del eje-x.\n\nEl color en que se escribe la etiqueta es el de los ejes.\n\nSi el contenido es "no" entonces el eje no se dibuja.',
			y_axis: 'Etiqueta que se dibujará arriba de la escena, justo a la izquierda del eje-y.\n\nEl color en que se escribe la etiqueta es el de los ejes.\n\nSi el contenido es "no" entonces el eje no se dibuja.',
			render: 'Menú desplegable con opciones: "orden", "pintor" y "trazado de rayos" que son tres diferentes métodos para desplegar los objetos en tres dimensiones.\n\nEl primero: "orden" dibuja los elementos tridimensionales de atrás hacia adelante. Es el más rápido, pero tiene fallos cuando los elementos de los objetos tridimensionales son grandes.\n\nEl segundo: "pintor" es algo más lento pero es mucho más fiable que el primero. Este método dibuja primero los elementos que son tapados por otros.\n\nEl despliegue "trazado de rayos" rellena, pixel a pixel, el espacio dibujando el color del objeto que se encuentra más cerca del observador. Es el método más fiable pero es extraordinariamente lento, por lo cual sólo puede usarse en ordenadores muy veloces o en espacios de dimensiones muy reducidas.',
			split: 'Selector que permite decidir si todos los cuerpos del espacio se cortan entre sí. El valor por defecto es no seleccionado. Si dos superficies se intersectan pero no se les permite cortarse su despliegue es "imposible" y el dibujo resulta incomprensible.\n\nCuando los objetos del espacio no se intersectan entre sí, no es necesario seleccionar cortar. Para más información ver Gráficos 3D.',
			sensitive_to_mouse_movements: 'Selector para decidir si el programa detectará los movimientos del ratón sobre este espacio.\n\nCuando la casilla está activada, cada vez que se mueve el ratón sobre el espacio el programa refresca la escena y verifica los eventos.',
			file: 'Es un campo de texto libre en el que debe escribirse el nombre del archivo al que hace referencia el espacio HTMLIFrame.',
			info: 'Campo de texto para poner comentarios.'
		},

		/**
		 * Controls
		 */
		Controls: {
			id: 'Campo de texto que contiene el identificador del control.\n\nSi el control es numérico, entonces <id>, es el nombre de la variable numérica que representa.\n\nSi es gráfico, entonces <id>.x e <id>.y, son las coordenadas del control.',
			type: 'Es un campo de texto desactivado que indica si el control es numérico o gráfico.',
			gui: 'Tipo de interfaz gráfica del control numérico. Las opciones son: pulsador, campo de texto, menú (desplegable), barra (de desplazamiento) y botón.',
			onlyText: 'Selector que, cuando está activado, hace que el campo de texto no interprete los números o variables que en él se escriben sino que solamente los tome como cadenas de texto.',
			region: 'Región a la que se asigna el control numérico. Las opciones son: norte, sur, este, oeste, exterior e interior.\n\nLa región norte es una o varias filas horizontales en la parte superior de la escena entre los botones de créditos y config.\n\nLa región sur es una o varias filas horizontales en la parte inferior de la escena entre los botones de inicio y limpiar.\n\nLas regiones oeste y este son columnas a la izquierda y a la derecha de la escena.\n\nLa región exterior es una ventana que aparece cuando se hace un clic derecho sobre la escena.\n\nLa región interior es la escena. Cuando un control numérico se asocia a la región interior, entonces se puede colocar en cualquiera de los espacios de la escena y su posición ahí está determinada por el parámetro "pos".\n\nEl valor por defecto es "sur".',
			space: 'Es un menú desplegable que permite elegir el espacio al que se desea asignar el control.\n\nEste parámetro sólo tiene sentido en controles numéricos asignados a la región interior y en controles gráficos.\n\nEl menú muestra los identificadores de todos los espacios definidos en la escena.',
			color_CTRGRAPHIC: 'Un control tiene dos colores, el primero (éste) se usa para dibujar la circunferencia del disco, y el segundo para el interior del círculo o interior del disco.\n\nEl color por defecto de la orilla es azul.',
			colorInt_CTRGRAPHIC: 'Un control tiene dos colores, el primero se usa para dibujar la circunferencia del disco y el segundo (éste) para el interior el círculo o interior del disco.\n\nEl color por defecto del interior es rojo.',
			image_CTRGRAPHIC: "Nombre del archivo de una imagen que se usará en lugar de un círculo para visualizar este control gráfico.",
			size: 'Radio del control gráfico (en pixeles).\n\nPuede ser cualquier número o expresión positiva.\n\nEl valor por defecto es 4.',
			name: 'Nombre externo de la variable <id>.\n\nAparece como etiqueta a la izquierda del control numérico y no tiene ninguna otra función dentro del programa.\n\nSu valor por defecto es igual al identificador del control.',
			expression: 'Es el punto inicial de un control gráfico o el extremo superior izquierdo de un control numérico interior.\n\nSe expresa con dos números entre paréntesis separados por una coma. Los números pueden ser constantes o expresiones en las que intervienen constantes o parámetros definidos en controles anteriores.\n\nEl valor por defecto es (0,0).\n\nEn el caso de un control numérico interior se puede usar una expresión de cuatro valores (x,y,w,h) donde los primeros dos son las coordenadas del vértice superior izquierdo del control y los dos últimos son el ancho y el alto.',
			value: 'Valor inicial de la variable <id>.\n\nPuede ser una expresión decimal o una fórmula en la que pueden intervenir constantes y otros parámetros definidos en controles anteriores.\n\nSu valor por defecto es 0.\n\nEn el caso de los controles con interfaz de botón es el valor que se asigna a la variable cuando se pulsa el botón.',
			constraint: 'Es una ecuación en x, y que las coordenadas del control deben satisfacer. Es decir, el control queda restringido a moverse sobre la gráfica de su constricción.\n\nPuede ser cualquier expresión o ser vacía. Si es vacía el control no está limitado en su movimiento.\n\nEl valor por defecto es vacío.',
			text: 'Es una etiqueta que acompaña al control.\n\nPuede ser cualquier texto que además puede incluir valores numéricos variables (ver Textos).\n\nEl valor por defecto es vacío.\n\nEn los controles de áreas de texto es el contenido inicial del área.',
			incr: 'Es la cantidad que aumenta o disminuye el valor de la variable <id> cuando se pulsan las flechas del control numérico.\n\nPuede ser una constante o una expresión.\n\nEl valor por defecto es 0.1.',
			min: 'Es el valor mínimo que puede tener el parámetro.\n\nPuede ser una constante, una expresión o estar vacío, en cuyo caso no hay valor mínimo y el parámetro no está limitado inferiormente.\n\nEl valor por defecto es vacío.',
			max: 'Es el valor máximo que puede tener el parámetro.\n\nPuede ser una constante, una expresión o estar vacío, en cuyo caso no hay valor máximo y el parámetro no está limitado superiormente.\n\nEl valor por defecto es vacío.',
			discrete: 'Obliga que los valores del control numérico difieran del valor inicial sólo en múltiplos exactos del incremento.\n\nEsto funciona correctamente sólo si el incremento es constante y además puede expresarse exactamente con el número de decimales elegido.\n\nEl valor por defecto es "no".',
			decimals: 'Número de decimales con los que se escribirán los valores de <id> o los números incluidos en el texto.\n\nPuede ser cualquier número o expresión. Al evaluarse se redondea para decidir el número de decimales.\n\nSu valor por defecto es 2.',
			fixed: 'Determina si el número de decimales es fijo o si, por el contrario, se usa la notación "ajustada" en la que se eliminan los ceros innecesarios y el punto decimal si también es innecesario.\n\nPor ejemplo: en lugar de 25.3400 se escribe 25.34 y en lugar de 13.0 se escribe 13 (sin punto decimal).\n\nSi se usa notación exponencial siempre se escriben los números en forma ajustada, es decir, el atributo fijo no interviene en ese caso.\n\nEl valor por defecto es fijo=si.',
			exponentialif: 'Es una expresión booleana que cuando se cumple hace que el valor del parámetro pueda escribirse en notación exponencial. Si la expresión es vacía, nunca se usa la notación exponencial. Es importante observar que esto no fuerza a que aparezca la notación exponencial, sólo la permite. Si la expresión no se cumple no habrá notación exponencial.\n\nEl valor por defecto es vacío.',
			visible: 'Es un selector que indica si el valor del parámetro debe exhibirse o no (el nombre y los pulsadores se exhiben siempre).\n\nEl valor por defecto es seleccionado, o sea que el valor del parámetro sí se exhibe.',
			trace: 'Selector que indica si al moverse el control debe dejar rastro de su recorrido. El rastro un control es el de su orilla solamente.\n\nPor defecto aparace desactivado.',
			color: 'Color del texto en la etiqueta del botón.',
			colorInt: 'Color del fondo en la etiqueta del botón.',
			bold: 'Selector que al activarse hace que el texto en la etiqueta del botón se escriba en negritas.',
			italics: 'Selector que al activarse hace que el texto en la etiqueta del botón se escriba en cursivas.',
			underlined: 'Selector que al activarse hace que el texto en la etiqueta del botón aparezca subrayado.',
			font_size: 'Tamaño en puntos de la fuente con la que se escribe el texto de la etiqueta del botón.\n\nEl tipo de letra siempre es SansSerif.',
			image: 'Nombre del archivo de una imagen que se usará como fondo del botón.\n\nSi en la misma carpeta donde está la imagen hay otra con el mismo nombre seguido de "_over" y con la misma extensión, entonces esta imagen aparecerá en el botón cuando el cursor del ratón se encuentra sobre éste.\n\nSi en la misma carpeta donde está la imagen hay otra con el mismo nombre seguido de "_down" y con la misma extensión, entonces esta imagen aparecerá en el botón cuando se pulsa el botón con el ratón.',
			options: 'Lista de opciones para un control numérico con interfaz de "menú".\n\nLas opciones deben ser palabras separadas por comas. Después de cada palabra puede venir entre corchetes [] el valor que debe asignarse al parámetro cuando se selecciona esta opción. Si el valor no se define entonces se asigna automáticamente un valor entero correspondiente al índice de la opción.',
			action: 'La acción que se realiza cuando el usuario manipula el control numérico. (pulsar el botón, seleccionar un elemento de un menú, mover la barra de desplazamiento, hacer clic en un pulsador, o dar <intro> en el campo de texto).\n\nHay las siguientes acciones posibles: "mensaje", "calcular", "abrir URL", "abrir Escena", "créditos", "config", "inicio", "limpiar", "animar" e  "iniciar_animación".\n\nSi la acción es "calcular", se realizan todas las asignaciones escritas en el campo parámetro y se actualizan inmediatamente todos los controles usando los nuevos valores.',
			parameter: 'El parámetro de la acción.\n\nSi la acción es "mensaje" entonces el parámetro es el contenido del mensaje.\n\nSi la acción es "calcular", entonces parámetro debe contener cero o varias asignaciones (separadas por ; o salto de línea) que el programa realizará cuando se ejecute la acción.\n\nSi la acción es "abrir URL", el parámetro puede ser cualquier URL.\n\nSi la acción es "abrir Escena" el parámetro debe ser una dirección relativa y lo que hace es abrir la (primera) escena de Descartes que encuentra en un archivo de texto con esa dirección.\n\nLas otras acciones no usan el parámetro.',
			drawif: 'Expresión booleana que determina cuándo el control es visible.\n\nEl valor por defecto es vacío y en ese caso el control es siempre visible.',
			activeif: 'Expresión booleana que determina cuándo el control está activo.\n\nEl valor por defecto es vacío y en ese caso el control está activo.',
			evaluate: 'Determina si el control lleva evaluación automática.\n\nSólo se aplica en los controles de las escenas que son ítems (o reactivos) para evaluaciones.\n\nAparece desactivado por defecto. Cuando se activa en un control de un ítem, el programa sabe que al evaluarse el ítem deberá considerar lo que el usuario haya escrito o seleccionado en el control, como una respuesta y compararlo con el patrón de respuestas asociado.',
			answer: 'Es un texto que contiene lo que el alumno debería escribir.\n\nSirve de guía al revisor.\n\nPatrón de respuesta con el que se compara lo que el usuario ha escrito o seleccionado para determinar si su respuesta es correcta.\n\nSólo se aplica en los controles de las escenas que son ítems (o reactivos) para evaluaciones.\n\nPuede consistir en uno o varios campos de texto separados por | cada uno de los cuales se compara con lo  escrito o seleccionado por el usuario. Si hay una coincidencia se considera que la respuesta es correcta. Si no hay ninguna coincidencia se considera que la respuesta es errónea.\n\nCuando la respuesta debe ser numérica hay que poner el rango de respuestas válidas como un intervalo, por ejemplo: [a,b], (a,b) , (a,b] o [a,b]. Cuando el control es un campo de texto del tipo "sólo texto", entonces la comparación se hace letra a letra. Si al final de una opción de respuesta se escribe un asterisco *, entonces sólo se busca si la respuesta de usuario comienza con la propuesta. Si hay un asterisco al principio entonces se busca si la respuesta propuesta aparece al final de la del usuario. Si hay un asterisco al principio y uno al final, por ejemplo *respuesta*, sólo se busca que la propuesta aparezca dentro de la del usuario. Si se quiere que el programa ignore las diferencias entre mayúsculas y minúsculas, hay que escribir la propuesta entre comillas simples, por ejemplo: \u0027respuesta\u0027. Si se quiere que el programa ignore los acentos y la diferencia entre n y ñ, entonces hay que escribir la respuesta entre un acento grave y uno agudo, por ejemplo `respuesta´. `\u0027respuesta\u0027´ ignoraría tanto mayúsculas y minúsculas como acentos. Si hay letras que se quieren ignorar, debe escribirse una interrogación ? en lugar de la letra.\n\nSi el control es un campo de texto y el usuario lo deja vacío, se considera que no contestó. Si se trata de un menú en el que una opción es vacía (por ejemplo un espacio en la primera opción) y el usuario selecciona esa opción, también se considera que no contestó. El sistema de evaluación definido por el administrador de las evaluaciones es quien decide cómo se interpretan las respuestas correctas, las incorrectas y las vacías.',
			weight: 'Peso (en el contexto de una media ponderada) que se da a la respuesta dada en la evaluación al calcular la nota.\n\nSólo se admiten valores enteros positivos y se recomienda usar sólo 0, 1 o 2.',
			tooltip: 'Texto que aparece cuando el ratón se detiene más de un segundo y medio sobre la etiqueta de un control numérico o dentro del círculo de un control gráfico.\n\nEl valor por defecto es vacío.',
			explication: 'Texto que aparece cuando el usuario hace un clic derecho sobre la etiqueta de un control numérico o dentro del círculo de un control gráfico.\n\nEl valor por defecto es el del "tooptip".',
			cID: 'Identificador para los controles que se encuentran en el escenario.\n\nEs útil solamente en escenas de Arquímedes o DescartesWeb2.0.\n\nEl valor del identificador lo calcula el programa de acuerdo con el momento preciso en que éste fue creado, por lo que todos los identificadores creados en un mismo ordenador son diferentes.\n\nNo se recomienda manipular manualmente este identificador.',
			file: '',
			info: 'Campo de texto para poner comentarios.',

			borderColor: 'Color con que se pinta el borde del texto del botón.\n\nEl selector sirve oara decidir si se dibuja o no el borde del texto.\n\nEl valor por defecto es desactivado.',
			flat: 'Selector que al activarse dibuja el botón sin degradado (estilo plano).\n\nEl valor por defecto es desactivado, es decir, que el botón se dibuja con degradado (estilo tradicional de Descartes).',
			text_align: 'Menú desplegable para elegir la alineación de la etiqueta del botón, respecto a la región rectangular que ocupa el control.',
			image_align: 'Menú desplegable para elegir la alineación de la imagen del botón, respecto a la región rectangular que ocupa el control.',
			cssClass: "Campo de texto en el que puede escribirse las clases de estilo CSS a las que pertenece el botón.\n\nEsto permite modificar el estilo del botón por medio de una hoja de estilo externa."
		},

		/**
		 * Definitions
		 */
		Definitions: {
			id: 'Es el identificador de la definición.\n\nEn el caso de una función debe incluir los parámetros de los que dependa escritos entre paréntesis y separados por comas. Por ejemplo: f(x,y,x).',
			expression: 'Es un campo de texto donde debe escribirse la expresión mediante la cual se define el valor de la constante, variable o función.',
			evaluate: 'Es un selector con dos posibles valores: siempre o una_sola_vez.\n\nPermite definir si la constante, la expresión del vector o el algoritmo deben evaluarse cada vez que el usuario modifica un control o sólamente una vez al iniciarse la escena.\n\n Es importante seleccionar una_sola_vez cuando sea factible para que el funcionamiento de la escena sea más rápido.',
			size: 'Es el número de elementos del vector.',
			rows: 'Es el número de filas de la matriz.',
			columns: 'Es el número de columnas de la matriz.',
			range: 'Es una expresión booleana que determina el dominio de la función.\n\nCualquier intento de evaluar la función fuera de su dominio lanzará una excepción, con lo cual, por ejemplo, su gráfica no se dibuja en los puntos que no están en el dominio.\n\nEl valor por defecto es vacío, lo cual se interpreta como que el dominio no está restringido.',
			algorithm: 'Selector que indica si la función, para evaluarse, debe usar un algoritmo; es decir, si necesita los cálculos indicados en "inicio", "hacer" y "mientras".',
			expression2: 'Es un campo de texto donde pueden escribirse asignaciones a los valores del vector, separadas por saltos de línea o por ;\n\nPor ejemplo, si el identificador del vector es v y tiene tamaño 3, entonces se puede escribir:\n\nv[0]=1\n\nv[1]=2.5\n\nv[2]=-3.1',
			local: 'Campo de texto para declarar las variables que el algoritmo debe proteger.\n\nPara proteger algunas variables hay que escribirlas en este campo de texto separadas por comas. Por ejemplo:\n\ni,k',
			init: 'En el campo "inicio" puede escribirse una serie de asignaciones y llamadas a algoritmos separadas por ;\n\nTodo lo que haya en este campo se ejecuta al inicio del cálculo.',
			doExpr: 'En el campo "hacer" puede escribirse una serie de asignaciones y llamadas a algoritmos separadas por saltos de línea.\n\nLo que hay en "hacer" se ejecuta repetidamente mientras la condición "mientras" sea válida.',
			whileExpr: 'En el campo "mientras" se debe escribir una expresión booleana.\n\nLo que hay en "hacer" se ejecuta repetidamente mientras la condición "mientras" sea válida.',
			file: 'Archivo de texto (se recomienda que lleve extensión .txt) en el que aparecen en orden los valores de los elementos del vector, separados por un salto de línea.\n\nLos valores pueden ser numéricos o de cadena, en cuyo caso deben aparecer entre comillas sencillas, por ejemplo \u0027valor\u0027.',
			info: 'Campo de texto para poner comentarios.'
		},

		/**
		 * Programs
		 */
		Programs: {
			id: 'Es el identificador del programa.',
			evaluate: 'Es un selector con dos posibles valores: siempre o una_sola_vez.\n\nPermite definir si la constante, la expresión del vector o el algoritmo deben evaluarse cada vez que el usuario modifica un control o sólamente una vez al iniciarse la escena.\n\n Es importante seleccionar una_sola_vez cuando sea factible para que el funcionamiento de la escena sea más rápido.',
			init: 'En el campo "inicio" puede escribirse una serie de asignaciones y llamadas a algoritmos separadas por ;\n\nTodo lo que haya en este campo se ejecuta al inicio del cálculo.',
			doExpr: 'En el campo "hacer" puede escribirse una serie de asignaciones y llamadas a algoritmos separadas por saltos de línea.\n\nLo que hay en "hacer" se ejecuta repetidamente mientras la condición "mientras" sea válida.',
			whileExpr: 'En el campo "mientras" se debe escribir una expresión booleana.\n\nLo que hay en "hacer" se ejecuta repetidamente mientras la condición "mientras" sea válida.',
			condition: 'Condición que, cuando se cumple, genera la acción.\n\nUna vez realizada la acción, ésta sólo vuelve a realizarse cuando la condición deja de cumplirse y luego vuelve a cumplirse.',
			action: 'Acción que se realizará si se pulsa el botón en un control numérico con interfaz botón.\n\nExisten las siguientes acciones: "mensaje", "calcular", "abrir URL", "abrir Escena", "créditos", "config", "inicio", "limpiar", "animar", "iniciar animación".',
			parameter: 'El parámetro de la acción.\n\nSi la acción es "mensaje" entonces el parámetro es el contenido del mensaje.\n\nSi la acción es "calcular", entonces parámetro debe contener cero o varias asignaciones (separadas por ; o salto de línea) que el programa realizará cuando se ejecute la acción.\n\nSi la acción es "abrir URL", el parámetro puede ser cualquier URL.\n\nSi la acción es "abrir Escena" el parámetro debe ser una dirección relativa y lo que hace es abrir la primera escena de Descartes que encuentra en esa dirección.\n\nLas otras acciones no usan el parámetro.',
			execution: 'Determina el modo de ejecución de la acción del evento.\n\nSi ejecución=una-sola-vez, sólo se ejecuta la primera vez que se cumple la condición.\n\nSi ejecución=alternar entonces se ejecuta la primera vez que la condición se cumple, pero si la condición deja de ser válida y vuelve a serlo luego, entonces vuelve a ejecutarse la acción.\n\nSi ejecución=siempre, la acción se ejecuta siempre que se cumpla la condición.\n\nEl valor por defecto es alternar.',
			info: 'Campo de texto para poner comentarios.'
		},

		/**
		 * Graphics
		 */
		Graphics: {
			space: 'Menú desplegable con la lista de los espacios de dos dimensiones que se hayan definido. Si sólo hay un espacio de dos dimensiones y éste no tiene nombre, la lista aparece vacía.\n\nSi hay más de un espacio, entonces debe seleccionarse el espacio al cual ha de pertenecer el gráfico.',
			type: 'Es un campo de texto (no editable) que muestra el tipo del gráfico.',
			background: 'Si se selecciona fondo, el gráfico se dibuja sólo en el "fondo" de la escena, y, por lo tanto, se actualiza únicamente cuando se pulsa inicio y cuando se modifica la escala o la posición del origen (Ox y Oy).\n\nCuando un gráfico está siempre fijo en la escena, es decir, no depende de los controles ni de los auxiliares, conviene definirlo como de fondo pues así se ahorra trabajo al procesador que no tendrá que dibujarlo cada vez que hay un cambio en la escena.',
			color: 'Botón muestra el color con que se dibujará el gráfico.\n\nHaciendo un clic sobre el botón aparece la ventana de configuración de colores (ver colores).\n\nPor defecto el color de todos los gráficos es #20303a.\n\nLos gráficos de tipo imagen y macro no tienen color.\n\nPara flechas: Es el color de la orilla o borde de la flecha, su interior se dibuja en el color flecha.',
			drawif: 'Es un campo de texto donde puede escribirse una expresión booleana.\n\nEl gráfico se dibuja si la expresión es vacía o si la expresión tiene valor verdadero (o mayor que cero).\n\nSi la expresión depende de x o y, y el gráfico es una ecuación, entonces sólo se dibujan los puntos de la gráfica que satisfacen la expresión.\n\nSi el valor de x o y no permiten que la expresión se cumpla en el momento en que va a dibujarse un objeto, entonces no se dibuja (es responsabilidad del autor controlar el valor de x e y fuera de las ecuaciones).',
			abs_coord: 'Hace que el gráfico se interprete en pixeles y en coordenadas absolutas, con el origen en el vértice superior izquierdo del rectángulo del espacio al que pertenece el gráfico y la escala igual a 1 pixel por unidad.\n\nLos gráficos definidos en coordenadas absolutas no se mueven al cambiar el origen del sistema o la escala.',
			expression: 'Es un campo de texto. Debe ser una expresión cuyo contenido varía según el tipo de gráfico. Por ejemplo en las curvas la expresión debe tener la forma (f(t),g(t)), donde f y g son funciones cualesquiera del parámetro t. El valor por defecto de la expresión también cambia según el tipo de gráfico.\n\nEn la documentación de cada tipo de gráfico se explica cuál debe ser el contenido de la expresión, y cuál el de sus valores por defecto en cada tipo.\n\nLos gráficos arco, texto e imagen no tienen expresión. En el caso del arco la expresión se sustituye por campos para radio, inicio y fin.',
			center: 'Debe ser una expresión del tipo (X,Y) que representará el centro del arco, donde X e Y pueden ser expresiones reales arbitrarias.',
			radius: 'Es el radio del arco. Puede ser una expresión real arbitraria.',
			init: 'Es el inicio del arco. Hay dos opciones: una Puede ser una expresión real arbitraria que se interpretará como el ángulo inicial en grados, otra puede ser una expresión de la forma (x1,y1) que se interpretará como un punto. En el segundo caso el arco comienza en el segmento que une al centro (X,Y) con el punto (x1,y1).',
			end: 'Es el final del arco. Hay dos opciones: Puede ser una expresión real arbitraria que se interpretará como el ángulo final en grados, o puede ser una expresión de la forma (x2,y2) que se interpretará como un punto. En el segundo caso el arco termina en el segmento que une al centro (X,Y) con el punto (x2,y2).',
			vectors: 'Determina que el lado inicial y final del arco se obtengan de dos vectores que parten del centro del arco y no de dos puntos del plano.',
			trace: 'Si se selecciona rastro el objeto gráfico deja un rastro en la escena del color seleccionado. Para elegir un color hay que pulsar el botón cuadrado que aparece junto al selector (ver colores).\n\nCuando un gráfico deja rastro se puede apreciar su trayectoria en la escena. Pulsando el botón de limpiar se borran los rastros de los gráficos.\n\nEl valor por defecto es no seleccionado y el color del rastro por defecto es gris.',
			useFamily: 'Este selector permite convertir un gráfico en toda una familia de gráficos dependiente de un parámetro.\n\nAl seleccionar familia se activan los otros campos de la última línea: parámetro, intervalo y pasos. y el autor puede así configurar la familia.\n\nEl valor por defecto es no seleccionado.',
			family: 'Debe ser una sola palabra, de preferencia corta. Por defecto es s. El nombre del parámetro se puede utilizar en la definición del objeto gráfico para definir la familia. El programa dibujará los gráficos, con los valores del parámetro, recorriendo el intervalo especificado en el número de pasos elegido.',
			family_interval: 'Debe contener dos expresiones reales entre corchetes y separadas por una coma. Por defecto es [0,1]. El parámetro recorre el intervalo definido entre el primero y el segundo valor en el número de pasos especificado.',
			family_steps: 'El parámetro recorre el intervalo definido entre el primero y el segundo valor en el número de pasos especificado y dibuja un gráfico al comenzar y después de cada paso, es decir, hace pasos+1 dibujos.\n\nEn otras palabras, pasos es el número de subintervalos iguales en que se divide el intervalo. y el parámetro pasa por los extremos de los subintervalos.\n\nEl valor por defecto es 8.',
			parameter: 'Debe ser una sola palabra, de preferencia corta. Por defecto es t. El programa dibujará el polígono con vértices:\n\n(f(t),g(t)) para t entre el primero y el último de los valores del intervalo, con incrementos iguales a la longitud del intervalo entre el número de pasos.',
			parameter_interval: 'Debe contener dos expresiones ti y tf reales entre corchetes y separadas por una coma, es decir, [ti,tf]. El intervalo por defecto es [0,1]. El parámetro recorre el intervalo definido entre ti y tf en el número de pasos especificado.',
			parameter_steps: 'El parámetro recorre el intervalo definido entre el primero y el segundo valor en el número de pasos especificado y dibuja la curva como un polígono con vértices (f(t),g(t)) con\n\nt = ti,\n\nt = ti+(tf-ti)/pasos,\n\nt = ti+2*(tf-ti)/pasos,\n\netc... hasta llegar a\n\nt = ti+pasos*(tf-ti)/pasos = tf.\n\nEn otras palabras, pasos, es el número de subintervalos iguales en que se divide el intervalo. Y el parámetro pasa por los extremos de los subintervalos.',
			text: 'Es una etiqueta que acompaña al objeto gráfico y se escribe cerca de su posición o algo que puede considerarse como su posición. Por ejemplo en un punto se escribe un poco arriba y a la derecha.\n\nLos textos se dibujan en el mismo color que el objeto gráfico.\n\nLos textos pueden tener varias líneas y además pueden incluir valores numéricos variables (ver Textos).\n\nEl valor por defecto es vacío.',
			decimals: 'Es el número de decimales con los que se escribirán los números incluidos en el texto.\n\nPuede ser cualquier número o expresión. Al evaluarse se redondea para decidir el número de decimales.\n\nSu valor por defecto es 2.',
			fixed: 'Determina si el número de decimales es fijo o si, por el contrario, se usa la notación "ajustada" en la que se eliminan los ceros innecesarios y el punto decimal si también es innecesario.\n\nPor ejemplo: en lugar de 25.3400 se escribe 25.34 y en lugar de 13.0 se escribe 13 (sin punto decimal).\n\nSi se usa notación exponencial siempre se escriben los números en forma ajustada, es decir, el atributo fijo no interviene en ese caso.\n\nEl valor por defecto es fijo=si.',
			border: 'El color del borde en el texto.',
			font: '***.',
			fill: 'Si el selector relleno está activado, el programa rellena el interior de la curva (considerada como un polígono). Si la curva no tiene un interior bien definido, el resultado puede ser algo extraño.',
			fillP: 'Si la ecuación es de la forma y=f(x) y el selector relleno+ está activado, el espacio entre el eje x y la gráfica, arriba del eje x,  se colorea  del color seleccionado.\n\nSi la ecuación es de la forma x=g(y) y el selector relleno+ está activado, el espacio entre el eje y y la gráfica, a la derecha  del eje y, se pinta del color seleccionado.',
			fillM: 'Si la ecuación es de la forma y=f(x) y el selector relleno- está activado, el espacio entre el eje x y la gráfica, abajo del eje x, se pinta del color seleccionado.\n\nSi la ecuación es de la forma x=g(y) y el selector relleno- está activado, el espacio entre el eje y y la gráfica, a la izquierda  del eje y, se pinta del color seleccionado.',
			size: 'Para puntos: es el radio del "punto". En realidad el program dibuja un disco de radio tamaño. Si tamaño=0 el punto no se dibuja. Esto último puede aprovecharse para dibujar textos asociados a puntos invisibles, usando las coordenadas del espacio.\n\nPara segementos: es el radio de los extremos del segmento, que se dibujan como dos discos.\n\nPara sucesiones: es el radio de los "puntos" de la sucesión. En realidad el programa dibuja discos de radio tamaño. Si tamaño=0 los puntos no se dibujan.',
			width: 'En segmentos, poligonales, arcos, curvas y ecuaciones: Es el ancho o grueso del trazo en pixeles. El valor por defecto es 1. Se recomienda utilizar poco los anchos diferentes de 1 pues ralentizan el dibujo.\n\nEn flechas: Es el ancho o grueso de la flecha en pixeles. El valor por defecto es 5.\n\nEn textos no enriquecidos: Especifica el ancho máximo de una línea de texto antes de agregar saltos de línea. Si se usa en textos enriquecidos o si el valor es menor que 20, entonces es ignorado.',
			spear: 'Es el ancho de la punta de la flecha. Su valor por defecto es 8.',
			arrow: 'Es el color del interior de la flecha.\n\nEl color flecha por defecto es rojo (#ee0022).',
			visible: 'Si está seleccionado, en la parte inferior de la escena aparecerá un campo de texto donde se ve la expresión de la ecuación en el mismo color de la gráfica y con el color de fondo de la escena.\n\nPor defecto este selector aparece activado.\n\nSi hay varias ecuaciones o curvas en una escena, abajo de ella aparecen los campos de texto de todas y cada una de las que son visibles. Si son muchas los campos pueden resultar demasiado pequeños, por lo que se recomienda no dejar visibles los campos de texto de más de tres o cuatro ecuaciones o curvas.',
			editable: 'Este campo puede utilizarse sólo si visible está selecionado. Cuando editable se activa, el contenido del campo de texto que aparece bajo la escena con la ecuación (o curva) puede ser modificado por el usuario. Esta opción es útil cuando se desea que el alumno practique la escritura de fórmulas.',
			range: 'Para sucesiones: Debe ser una expresión de la forma [n1,n2] donde n1 y n2 son dos enteros que se interpretan como el inicio y el final del intervalo de enteros que n recorrerá. El programa dibujará los puntos (X,Y) para cada valor de n entre n1 y n2.',
			file: 'Es un campo de texto libre en el que debe escribirse el nombre del archivo que contiene la imagen que se desea usar como objeto gráfico. Sólo pueden utilizarse archivos jpg, gif y svg. Los archivos de imágenes deben colocarse en el mismo sitio donde se coloca el archivo html de la escena o en subdirectorios a partir de ahí. En el nombre del archivo hay que incluir los subdirectorios.',
			inirot: 'Es un campo de texto cuyo contenido es una expresión o un número, que será el ángulo que girará (en sentido contrario a la agujas del reloj).',
			inipos: 'Es un campo de texto cuyo contenido debe ser del tipo (X,Y), donde X e Y son expresiones reales cualesquiera que representan las abscisa y ordenada el punto inicial del macro (Ver Macros.) con respecto al origen de coordenadas del espacio.',
			name: 'Es el nombre del gráfico. Se usa en los macros para poder acceder a sus parámetros al hacer cálculos, lo cual se hace escribiendo el nombre del macro, seguido en un punto y del nombre del parámetro.',
			opacity: 'Nivel de opacidad de la image, es decir, que tan opaca o traslúcida es.\n\nEl valor aceptado es un número entre 0 y 1, donde 0 es completamente transparente y 1 es completamente opaco.\n\nEl valor por omisión es 1.',
			align: 'Alineación del texto respecto a una caja, cuyo ancho esta determinado por el tamaño de la línea de texto más larga que conforman el texto y el alto esta determinado por la altura que ocupa el texto.\n\nEl texto puede alinearse pegado al borde izquierdo, centrado o pegado al borde derecho de la caja.\n\nSi el texto consta de una sola línea, las tres alineación dibujan el texto de la misma manera.',
			anchor: 'Punto de anclaje de la caja de texto, cuyo ancho esta determinado por el tamaño de la línea de texto más larga que conforman el texto y el alto esta determinado por la altura que ocupa el texto.\n\nLa posición del texto (dada por el parámetro expresión) y el punto de anclaje, determinan como se construye la caja de texto y por consecuencia la posición del texto dentro del espacio.',
			lineDash: 'Menú desplegable que determina el estilo de dibujo de la línea, el cual puede ser un estilo solido, rallado o punteado.',
			info: 'Campo de texto para poner comentarios.'
		},

		/**
		 * Graphics 3D
		 */
		Graphics3D: {
			name: 'Sólo se utiliza en el caso de los macros, sin embargo, a veces conviene dar nombre a otros gráficos para distinguirlos unos de otros.\n\nPara referirse a un parámetro p, de un macro cuyo nombre es nom, se utiliza el identificador nom.p.',
			space: 'Selector que tiene la lista de los espacios de tres dimensiones que se hayan definido en la escena. Si sólo hay un espacio de tres dimensiones y éste no tiene nombre, la lista aparece vacía.\n\nSi hay más de un espacio, entonces debe seleccionarse el espacio al cual ha de pertenecer el gráfico.',
			type: 'Campo de texto no editable que muestra el tipo del gráfico.',
			background: 'Si se selecciona fondo, el gráfico 3D se calcula sólo una vez y se actualiza únicamente cuando se pulsa inicio.\n\nCuando un gráfico 3D no depende de los controles ni de los auxiliares, conviene definirlo como de fondo, pues así se ahorra trabajo al procesador que no tendrá que calcularlo cada vez que haya un cambio en la escena.',
			color: 'Botón del color en el que se dibujará el gráfico. En el caso de las superficies es el color del anverso del gráfico.\n\nPor defecto el color  de todos los gráficos es #eeffaa. Haciendo un clic sobre el botón aparece la ventana de configuración de colores.',
			backcolor: 'Botón del color en el que se dibujará el reverso del gráfico, si se trata de un polígono, una superficie o un macro (los gráficos de otro tipo no tienen reverso).\n\nPor defecto el color del reverso  de todos los gráficos es #6090a0. Haciendo un clic sobre el botón aparece la ventana de configuración de colores (ver colores).',			
			drawif: 'Campo de texto que puede contener una expresión booleana.\n\nEl gráfico se dibuja si la expresión es vacía o si la expresión booleana tiene valor verdadero (o mayor que cero).\n\nSi la expresión depende de x o y, y el gráfico es una ecuación, entonces sólo se dibujan los puntos de la gráfica que satisfacen la expresión.\n\nSi el valor de x o y hace que la expresión no se cumpla en el momento en que va a dibujarse un objeto, entonces no se dibuja (es responsabilidad del autor controlar el valor de las variables x e y fuera de las ecuaciones).',
			expression: 'Una expresión cuyo contenido varía según el tipo de gráfico 3D. Por ejemplo, en las curvas, la expresión debe tener la forma "x=f(u) y=g(u) z=h(u)", donde f, g y h son funciones cualesquiera del parámetro u. El valor de la expresión por defecto también cambia según el tipo de gráfico.\n\nSi se pulsa el botón expresión se abre el editor de textos y puede escribirse el texto en varias líneas, lo cual suele ser conveniente al definir curvas y superficies.\n\nEn la documentación de cada tipo de gráfico se explica cuál debe ser el contenido de la expresión y cuál es el valor por defecto en cada tipo.\n\nEn puntos: es una expresión de la forma: (X,Y,Z) donde X,Y y Z son expresiones numéricas.\n\nEn segmentos: (X1,Y1,Z1)(X2,Y2,Z2) donde X1, Y1, Z1, X2, Y2, Z2 son expresiones numéricas.\n\nEn triángulos y polígonos es una expresión de la forma: (X1,Y1,Z1)(X2,Y2,Z2)...(Xn,Yn,Zn) donde X1, Y1, Z1, X2, Y2, Z2,..., Xn,Yn,Zn son expresiones numéricas (en triángulos n=3).\n\nEn curvas tiene es un campo o un área de texto. Su contenido debe tener la forma:\n\nx=X(u)\n\ny=Y(u)\n\nz=Z(u)\n\ndonde X, Y y Z son expresiones numéricas dependientes del parámetro u. La curva se dibuja como una poligonal con Nu lados cuyos Nu+1 vértices son los puntos:\n\n(X(i/Nu),Y(i/Nu),Z(i/Nu))\n\npara i=0,...,Nu+1. Antes de x, y, z, pueden definirse variables intermedias que sólo se usan para los cálculos realizados al dibujar la curva. En caras: su contenido deben ser las coordenadas de un polígono en el plano, es decir, una expresión de la forma:\n\n(X1,Y1)(X2,Y2)...(Xn,Yn)\n\ndonde Xi, Yi, para i=1,...,n, son expresiones numéricas.\n\nPara polígonos regulares: puede ser cualquier cosa, en realidad este texto sólo se usa como identificador durante la edición. El número de lados del polígono regular queda determinado por Nu y su radio es la mitad de ancho, siempre y cuando ancho=largo. Si ancho#largo entonces el polígono no es regular sino que es una deformación de uno regular.\n\nPara superficies: debe tener la forma:\n\nx=X(u,v)\n\ny=Y(u,v)\n\nz=Z(u,v)\n\ndonde X, Y y Z son expresiones numéricas dependientes de los parámetros u y v. La superficie consta de la red de cuadriláteros formada por los puntos:\n\n(X(i/Nu,j/Nv),Y(i/Nu,j/Nv),Z(i/Nu,j/Nv))\n\npara i=0,...,Nu+1 y j=0,...,Nv+1. Antes de x, y, z pueden definirse variables intermedias que sólo se usan para los cálculos que se realicen al dibujar la superficie.\n\nEn textos debe tener la forma:\n\n[X,Y]\n\ndonde X e Y son expresiones numéricas que determinan la posición del texto en pixeles medidos de izquierda a derecha y de arriba abajo con respecto al vértice superior izquierdo de la ventana del espacio.\n\nEn macros: su contenido debe ser el nombre de un macro.',
			useFamily: 'Selector que al activarse convierte al objeto gráfico en una familia de objetos parametrizada por la variable cuyo nombre aparece en el campo de texto a la derecha de este selector.',
			family: 'Nombre de la variable con la que está parametrizada la familia de objetos gráficos 3D.',
			family_interval: 'Intervalo de variación de la variable que parametriza la familia de objetos gráficos 3D.',
			family_steps: 'Número de subintervalos en los que se subdivide uniformemente el intervalo del parámetro para definir los elementos de la familia.',
			inirot: 'Rotación inicial.\n\nVector de tres componentes (A,B,C) cuyos elementos son rotaciones (en grados) alrededor del eje x, del eje y, y del eje z, respectivamente que se aplicarán sobre el objeto gráfico antes de dibujarse.\n\nSi se agrega la palabra "Euler" antes de la terna ordenada, es decir, se escribe Euler(A,B,C), entonces los ángulos A, B y C se interpretan como rotaciones de Euler, es decir, A es una rotación alrededor del eje z, B alrededor del nuevo eje x (el que se obtiene tras la primera rotación) y C alrededor del nuevo eje z (el que se obtiene después de las primeras dos rotaciones).\n\nNota: Se aplica antes que la translación inicial.',
			inipos: 'Traslación inicial.\n\nVector de tres componentes (A,B,C) que representa una translación que se aplicará al objeto gráfico antes de dibujarse.\n\nNota: Se aplica después de la rotación inicial y antes de la rotación final.',
			endrot: 'Rotación final.\n\nVector de tres componentes (A,B,C) cuyos elementos son rotaciones (en grados) alrededor del eje x, del eje y, y del eje z, respectivamente que se aplicarán sobre el objeto gráfico antes de dibujarse.\n\nSi se agrega la palabra "Euler" antes de la terna ordenada, es decir, se escribe Euler(A,B,C), entonces los ángulos A, B y C se interpretan como rotaciones de Euler, es decir, A es una rotación alrededor del eje z, B alrededor del nuevo eje x (el que se obtiene tras la primera rotación) y C alrededor del nuevo eje z (el que se obtiene después de las primeras dos rotaciones).\n\nNota: Se aplica después de la translación inicial y antes de la translación final.',
			endpos: 'Traslación final.\n\nVector de tres componentes (A,B,C) que representa una translación que se aplicará al objeto gráfico antes de dibujarse.\n\nNota: Se aplica después de la rotación final.',
			split: 'Selector que indica si la superficie debe ser cortada por los gráficos del mismo espacio que la preceden en la lista, en caso de intersección. Es recomendable mantener esta opción siempre activada, a menos que se estén utilizando muchos gráficos que no se intersectan y convenga hacer un poco más rápida la ejecución.',
			edges: 'Se aplica a caras, poliregs, superficies y algunos gráficos especiales. Es un selector que determina si las orillas de las caras que forman el objeto deben dibujarse o no. Las orillas se dibujan en color gris.',
			text: 'Etiqueta que acompaña al objeto gráfico y se escribe cerca de su posición (o algo que puede considerarse como su posición). Por ejemplo en un punto se escribe un poco arriba y a la derecha.\n\nLos textos se dibujan en el mismo color que el objeto gráfico.\n\nLos textos pueden tener varias líneas y además pueden incluir valores numéricos variables (ver Textos).\n\nEl valor por defecto es vacío.',
			font: '***.',
			decimals: 'Número de decimales con los que se escribirán los números incluidos en el texto.\n\nPuede ser cualquier número o expresión. Al evaluarse se redondea para decidir el número de decimales.\n\nSu valor por defecto es 2.',
			fixed: 'Determina si el número de decimales es fijo o si, por el contrario, se usa la notación "ajustada" en la que se eliminan los ceros innecesarios y el punto decimal si también es innecesario.\n\nPor ejemplo: en lugar de 25.3400 se escribe 25.34 y en lugar de 13.0 se escribe 13 (sin punto decimal).\n\nSi se usa notación exponencial siempre se escriben los números en forma ajustada, es decir, el atributo fijo no interviene en ese caso.\n\nEl valor por defecto es fijo=si.',
			model: 'Se aplica a caras, poliregs, superficies y algunos gráficos especiales. Es un menú desplegable con cuatro opciones: color, luz, metal y alambre. Son las cuatro formas de dibujar las caras del objeto gráfico.\n\nColor hace que se dibuje con colores fijos.\n\nLuz hace que el color sea más o menos brillante según la orientación, para dar sensación de iluminación.\n\nMetal es como luz, pero con brillos más contrastados para  dar la impresión de que la superficie es metálica.\n\nAlambre dibuja sólo las orillas en el color seleccionado.\n\nNota: Con modelo alambre las aristas se dibujan en el color seleccionado y no en gris como ocurre en los otros modelos.',
			width: 'En poliedros, elipsoides, paralelepípedos, cilindros y conos: es la dimensión a lo largo del eje x.\n\nEn la esfera es el diámetro.\n\nEn polígonos: es la mitad del radio del polígono regular si ancho=largo. Si ancho!=largo entonces el polígono no es regular sino que es una deformación de uno regular.',
			length: 'En poliedros, elipsoides,paralelepípedos, cilindros y conos: es la dimensión a lo largo del eje y.\n\nEn polígonos: es la mitad del radio del polígono regular si ancho=largo. Si ancho!=largo entonces el polígono no es regular sino que es una deformación de uno regular.',
			height: 'En poliedros, elipsoides,paralelepípedos, cilindros y conos: es la dimensión a lo largo del eje z.',
			Nu: 'Campo de texto para definir el número Nu.\n\nLas curvas se definen paramétricamente y en ellas se utiliza siempre u como parámetro. Nu es el número de intervalos en los que se parte el segmento unitario [0,1] para dibujar la curva.\n\nLas superficies se definen también en forma paramétrica y se utlilizan los parámetros u y v ambos recorriendo el intervalo unitario [0,1]. Nu es el número de intervalos en los que se parte el intervalo para el parámetro u.',
			Nv: 'Campo de texto para definir el número Nv.\n\nLas superficies se definen en forma paramétrica y se utlilizan los parámetros u y v ambos recorriendo el intervalo unitario [0,1]. Nv es el número de intervalos en los que se parte el intervalo para el parámetro v.',
			offset_dist: '***.',
			offset_angle: '***.',
			info: 'Campo de texto para poner comentarios.'
		},	

		Animation: {
			useAnimation: 'Activa o desactiva la animación.\n\nCuando el selector no está marcado los demás campos del panel están desactivados.\n\nCuando el selector está activado todos los campos del panel se activan y el autor puede escribir en ellos o elegir opciones.\n\nCuando la animación está activada, en la escena aparece un botón animar abajo a la derecha, con el que el usuario puede arrancar la animación, ordenar una pausa y continuar la animación. La etiqueta del botón alterna entre animar y pausa.',
			delay: 'El tiempo (en milisegundos) que el programa espera en cada paso de la animación.\n\nEl valor por defecto es 60.\n\nLos valores pequeños hacen que la animación sea más rápida y viceversa. En procesadores lentos los valores pequeños no necesariamente producen animaciones rápidas.',
			auto: 'Determina si la animación comienza automáticamente cuando la escena aparece en la pantalla y cada vez que se pulsa el botón de Inicio.\n\nSi el selector no está activado entonces la animación comienza cuando el usuario pulsa el "botón de inicio de animación", que aparece abajo, a la derecha, en las escenas que tienen la animación activada.',
			loop: 'Determina si la animación se repite indefinidamente o bien se detiene cuando la condición "mientras" deja de ser verdadera.',
			init: 'Cálculos que se realizan al comenzar la animación.\n\nPuede incluir varias asignaciones separadas por ";".',
			doExpr: 'Cálculos que se realizan en cada paso de la animación.\n\nPuede incluir varias asignaciones separadas por un salto de línea.',
			whileExpr: 'Condición para que la animación continúe.\n\nCuando esta condición deja de ser válida la animación se detiene o, si el selector "repetir" está activado, vuelve a comenzar.',
			info: 'Campo de texto para poner comentarios.'
		},

		Extra: {
			expand: 'Expande el contenido del campo de texto.',
			simple_text_editor: 'Editor de texto simple.',
			rich_text_editor: 'Editor de texto enriquecido.',
		}
	}

  return paramEditor;
})(paramEditor || {});
