/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var tooltip = (function(tooltip) {

// reemplazar &lt; por < y &gt; >

  /**
   *
   */
  tooltip.esp = {
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
			init: 'Determina si el botón "Inicio" aparece en la escena.\n\nEl botón "Inicio" reinicia los valores de los controles, definiciones y programas, regresando la escena a su estado inicial.\n\nSi hay animación automática, ésta comienza de nuevo.',
			clear: 'Determina si el botón "Limpiar" aparece en la escena.\n\nEl botón "Limpiar" borra los rastros dejados por los objetos gráficos que tienen la opción "rastro" activada.',
			
			rowsNorth: 'Número de filas que ocuparán los controles numéricos colocados en la región norte.\n\nSi el valor es cero entonces habrá una fila si es necesaria, pero si no lo es, no habrá ninguna.\n\nEl valor por defecto es cero.',
			rowsSouth: 'Número de filas que ocuparán los controles numéricos colocados en la región sur.\n\nSi el valor es cero entonces (de ser necesaria) habrá una fila, si no lo es, no habrá ninguna.\n\nEl valor por defecto es cero.',
			widthWest: 'Ancho en pixeles de la región oeste para controles numéricos.\n\nEl valor por defecto es 150.\n\nSi el valor es 0, pero existe al menos un control numérico en la región oeste, entonces se adopta por defecto un valor de 125.',
			widthEast: 'Ancho en pixeles de la región este para controles numéricos.\n\nEl valor por defecto es 150.\n\nSi el valor es 0, pero existe al menos un control numérico en la región este, entonces se adopta por defecto un valor de 125.',
			heightRows: 'Altura en pixeles de los controles numéricos en las regiones norte y sur. El valor por defecto es 40.',

			decimal_symbol: 'Símbolo que separa los enteros de los decimales en una expresión decimal.\n\nEn algunos países se usa la coma y en otros el punto.',
			language: 'Lenguaje en que se guarda la configuración de la escena.',
			editable: 'Determina si se muestra el espacio exterior, al realizar un clic derecho del ratón sobre la escena.',
			expand: 'Opciones para modificar las dimensiones de la escena.\n\n"Cubir": cambia solo el ancho y el alto de las escenas que tengan un valor del 100%, para que tengan las dimensiones de su contenedor.\n\n"Escalar": modifica la escala de los pixeles de la escena para cubrir las dimensiones de su contendor, dando un efecto de zoom general en toda la escena.\n\nEl valor por defecto es vacío, lo que indica no realizar cambios en las dimensiones.',
			image_loader: 'Imagen que se usará como la imagen de carga de la escena.\n\nEl valor por defecto es vacío, lo que indica que se mostrará el logotipo de Descartes.'
		},

		/**
		 * Spaces
		 */
		Spaces: {
			type: 'Determina el tipo del espacio, el cual puede ser de dos o tres dimensiones, o de tipo HTMLIFrame.',
			id: 'Nombre o identificador del espacio.',
			cID: '***.',
			x: 'Abscisa del extremo superior izquierdo de la ventana del espacio. Es decir, su distancia al margen izquierdo de la escena.\n\nSe puede especificar con un número de pixeles (por ejemplo 20) o con un porcentaje (por ejemplo 10%) del ancho total de la escena.',
			y: 'Ordenada del extremo superior izquierdo de la ventana del espacio. Es decir, su distancia al margen superior de la escena.\n\nSe puede especificar con un número de pixeles (por ejemplo 20) o con un porcentaje (por ejemplo 10%) del alto total de la escena.',
			width: 'Ancho del espacio.\n\nSe puede especificar con un número de pixeles (por ejemplo 240) o con un porcentaje (por ejemplo 50%) del ancho total de la escena.',
			height: 'Altura del espacio.\n\nSe puede especificar con un número de pixeles (por ejemplo 180) o con un porcentaje (por ejemplo 50%) del alto total de la escena.',
			drawif: 'Expresión booleana que determina si el espacio es visible o no.\n\nEl espacio es invisible, si y sólo si, el valor de la expresión es cero.\n\nSi se deja en blanco este espacio será siempre visible.',
			fixed: 'no_quitar',
			fixed_R2: 'Al estar activado impide que el usuario modifique la escala y la localización del origen arrastrando el espacio con el ratón.',
			fixed_R3: 'Al estar activado impide que el usuario modifique el punto de vista arrastrando el espacio con el ratón.',
			scale: 'Tamaño en pixeles de un segmento unitario (o de longitud 1).\n\nPara modificar esta variable hay que referirse a ella como <id>.escala, donde <id> es el identificador del espacio.\n\nNota: Es importante que los identificadores no contengan espacios ni símbolos de operadores.',

			"O.x": 'Distancia en pixeles hacia la derecha, del centro del espacio al punto donde se dibujará el origen de coordenadas.\n\nPara modificar esta variable hay que referirse a ella como <id>.Ox, donde <id> es el identificador del espacio.\n\nNota: Es importante que los identificadores no contengan espacios ni símbolos de operadores.',
			"O.y": 'Distancia en pixeles hacia abajo, del centro del espacio al punto donde se dibujará el origen de coordenadas.\n\nPara modificar esta variable hay que referirse a ella como <id>.Oy, donde <id> es el identificador del espacio.\n\nNota: Es importante que los identificadores no contengan espacios ni símbolos de operadores.',

			image: 'Imagen usada como fondo del espacio.\n\nLos archivos de imágenes deben colocarse en el mismo directorio donde se coloca el archivo html de la escena o en subdirectorios a partir de ahí, además en el nombre del archivo hay que incluir los subdirectorios.\n\nSe pueden utilizar archivos png, jpg, gif y svg.',
			bg_display: 'Opciones para modificar la manera en la que se desplegará la imagen de fondo del espacio.\n\n"arr-izq": la esquina superior izquierda de la imagen se alinea con la esquina superior izquierda del espacio.\n\n"expandir": la imagen se escala para cubrir el espacio.\n\n"mosaico": la imagen se repite tantas veces como sea necesario para cubrir el espacio.\n\n"centrada": la imagen se dibuja centrada en el espacio.',
			background: 'Color del fondo del espacio.\n\nEl botón llama al editor de colores.\n\nEl valor por defecto es blanco (#ffffff).',
			axes: 'Color de los ejes de coordenadas.\n\nEl selector sirve para decidir si los ejes se dibujan o no.\n\nEl botón llama al editor de colores.\n\nLos valores por defecto son el selector activado y el color gris obscuro (#404040).',
			net: 'Color de la red de rectas paralelas a los ejes de coordenadas que sirven como referencia.\n\nEl selector sirve para decidir si la red se dibuja o no.\n\nEl botón llama al editor de colores.\n\nLos valores por defecto son el selector activado y el color gris claro (#c0c0c0).',
			net10: 'Color de una red que se dibuja cada 10 unidades de la red anterior.\n\nEl selector sirve para decidir si la red10 se dibuja o no.\n\nEl botón llama al editor de colores.\n\nLos valores por defecto son el selector activado y el color gris (#808080).',
			text: 'Color de las coordenadas mostradas al hacer clic izquierdo en el espacio.\n\nEl selector sirve para decidir si las coordenadas se escriben o no.\n\nEl botón llama al editor de colores.\n\nEl valor por defecto es el selector desactivado.',
			numbers: 'Determina si se escriben algunos valores de las coordenadas sobre los ejes. En caso de escribirse estas coordenadas aparecen en el mismo color que los ejes.\n\nSólo pueden escribirse las coordenadas si los ejes se dibujan.\n\nEl valor por defecto es desactivado.',
			x_axis: 'Etiqueta que se dibujará a la derecha de la escena, justo abajo del eje-x.\n\nEl color de la etiqueta es el mismo de los ejes.\n\nSi el contenido es "no" entonces el eje no se dibuja.',
			y_axis: 'Etiqueta que se dibujará arriba de la escena, justo a la izquierda del eje-y.\n\nEl color de la etiqueta es el de los ejes.\n\nSi el contenido es "no" entonces el eje no se dibuja.',
			render: 'Método que se utiliza para desplegar los objetos en tres dimensiones.\n\n"orden": dibuja los objetos tridimensionales de atrás hacia adelante. Es el más rápido, pero tiene fallos cuando los objetos están compuestos por caras grandes.\n\n"pintor": es algo más lento pero es mucho más fiable que la opción "orden".\n\n"trazado de rayos": rellena pixel a pixel el espacio, dibujando el color del objeto que se encuentra más cerca del observador. Es el método más fiable pero también el más lento.',
			split: 'Al estar activado determina si todos los objetos del espacio se cortan entre sí.\n\nEl valor por defecto es desactivado.\n\nSi dos superficies se intersectan pero no se les permite cortarse su despliegue es "imposible" y el dibujo resulta incomprensible.\n\nCuando los objetos del espacio no se intersectan entre sí, no es necesario seleccionar esta opción.',
			sensitive_to_mouse_movements: 'Al estar activado determina si la escena detectará los movimientos del ratón sobre este espacio.\n\nEl valor por defecto es desactivado.',
			file: 'Nombre del archivo al que hace referencia el espacio HTMLIFrame.',
			info: 'Comentarios.'
		},

		/**
		 * Controls
		 */
		Controls: {
			id: 'Identificador del control.\n\nSi el control es numérico, entonces <id>, es el nombre de la variable numérica que representa.\n\nSi es gráfico, entonces <id>.x e <id>.y, son las coordenadas del control.',
			type: '',
			gui: 'Tipo de interfaz gráfica del control numérico. Las opciones son: "pulsador", "campo de texto", "menú" (desplegable), "barra" (de desplazamiento) y "botón".',
			onlyText: 'Al estar activado hace que el campo de texto no interprete los números o variables que en él se escriben, sino que solamente los tome como cadenas de texto.',
			region: 'Región de la escena donde se asigna el control numérico.\n\n"norte": es una o varias filas horizontales en la parte superior de la escena entre los botones de créditos y config.\n\n"sur": es una o varias filas horizontales en la parte inferior de la escena entre los botones de inicio y limpiar.\n\n"oeste" y "este": son columnas a la izquierda y a la derecha de la escena.\n\n"exterior" es una ventana que aparece cuando se hace un clic derecho sobre la escena.\n\n"interior": cuando un control numérico se asocia a la región interior, entonces se puede colocar en cualquiera de los espacios de la escena y su posición ahí está determinada por el parámetro "expresión".\n\nEl valor por defecto es "sur".',
			space: 'Lista con los identificadores de todos los espacios definidos en la escena.\n\nEste parámetro sólo tiene sentido en controles asignados a la región interior y en controles gráficos.',
			color_CTRGRAPHIC: 'Color de la circunferencia del disco que representa un control gráfico.\n\nEl color por defecto de la orilla es #222222.',
			colorInt_CTRGRAPHIC: 'Color del círculo o interior de la circunferencia del disco que representa un control gráfico.\n\nEl color por defecto del interior es #f0f8ff.',
			image_CTRGRAPHIC: "Nombre de archivo de una imagen que se utilizará en lugar del círculo que Descartes utiliza para mostrar este control gráfico.",
			size: 'Radio del control gráfico en pixeles.\n\nPuede ser cualquier número o expresión positiva.\n\nEl valor por defecto es 4.',
			name: 'Nombre externo del control que aparece como etiqueta a la izquierda del control numérico y no tiene ninguna otra función dentro del programa.\n\nSu valor por defecto es igual al identificador del control.',
			expression: 'Extremo superior izquierdo de un control numérico interior.\n\nSe expresa con dos números entre paréntesis separados por una coma. Los números pueden ser constantes o expresiones en las que intervienen constantes o parámetros definidos en controles anteriores.\n\nEn el caso de un control numérico interior se puede usar una expresión de cuatro valores (x,y,w,h) donde los primeros dos son las coordenadas del vértice superior izquierdo del control y los dos últimos son el ancho y el alto.\n\nEl valor por defecto es (0,0,150,40).',
			expression_CTRGRAPHIC: 'Punto inicial de un control gráfico.\n\nSe expresa con dos números entre paréntesis separados por una coma. Los números pueden ser constantes o expresiones en las que intervienen constantes o parámetros definidos en controles anteriores.\n\nEl valor por defecto es (0,0).',
			value: 'Valor inicial de la variable <id>.\n\nPuede ser una expresión decimal o una fórmula en la que pueden intervenir constantes y otros parámetros definidos en controles anteriores.\n\nSu valor por defecto es 0.\n\nEn el caso de los botones es el valor que se asigna a la variable cuando se pulsa el botón.',
			constraint: 'Ecuación en x o y que las coordenadas del control gráfico deben satisfacer. Es decir, el control queda restringido a moverse sobre la gráfica de su constricción.\n\nPuede ser cualquier expresión o ser vacía. Si es vacía el control no está limitado en su movimiento.\n\nEl valor por defecto es vacío.',
			text: 'Etiqueta que acompaña al control.\n\nPuede ser cualquier texto que además puede incluir valores numéricos variables.\n\nEl valor por defecto es vacío.',
			text_CTRTEXT: 'Contenido inicial del área de texto.\n\nEl valor por defecto es vacío.',
			incr: 'Cantidad que aumenta o disminuye el valor de la variable <id> cuando se pulsan las flechas del control numérico.\n\nPuede ser una constante o una expresión.\n\nEl valor por defecto es 0.1.',
			min: 'Valor mínimo que puede tener el control.\n\nPuede ser una constante, una expresión o estar vacío, en cuyo caso no hay valor mínimo y el control no está limitado inferiormente.\n\nEl valor por defecto es vacío.',
			max: 'Valor máximo que puede tener el control.\n\nPuede ser una constante, una expresión o estar vacío, en cuyo caso no hay valor máximo y el control no está limitado superiormente.\n\nEl valor por defecto es vacío.',
			discrete: 'Obliga que los valores del control numérico difieran del valor inicial sólo en múltiplos exactos del incremento.\n\nEsto funciona correctamente sólo si el incremento es constante y además puede expresarse exactamente con el número de decimales elegido.\n\nEl valor por defecto es desactivado.',
			decimals: 'Número de decimales con los que se escribirán los valores de <id>.\n\nPuede ser cualquier número o expresión.\n\nLa expresión se evalúa y se redondea al entero más próximo para especificar el número de decimales, p. 3.5 se redondea a 4.\n\nEl valor por defecto es 2.',
			fixed: 'Al estar activado, escribe números con el número especificado de decimales.\n\nSi no esta activado, se utiliza la notación ajustada. En este caso, se eliminan los ceros innecesarios y el punto decimal innecesario. Por ejemplo, en lugar de 25.3400, se escribe 25.34 y en lugar de 13.0, se escribe 13 (sin punto decimal).\n\nSi se utiliza la notación exponencial, los números siempre se escriben en notación ajustada, es decir, se ignora el atributo fijo.\n\nEl valor por defecto es activado.',
			exponentialif: 'Expresión booleana que cuando se cumple hace que el valor del parámetro pueda escribirse en notación exponencial. Si la expresión es vacía, nunca se usa la notación exponencial. Es importante observar que esto no fuerza a que aparezca la notación exponencial, sólo la permite. Si la expresión no se cumple no habrá notación exponencial.\n\nEl valor por defecto es vacío.',
			visible: 'Indica si el valor del parámetro debe exhibirse o no (el nombre y los pulsadores se exhiben siempre).\n\nEl valor por defecto es activado, o sea que el valor del parámetro sí se exhibe.',
			trace: 'Indica si al moverse el control gráfico, debe dejar rastro de su recorrido. El rastro del control corresponde al de su orilla unicamente.\n\nEl valor por defecto es desactivado.',
			color: 'Color del texto en la etiqueta del botón.',
			colorInt: 'Color del fondo en la etiqueta del botón.',
			bold: 'Al estar activado el texto en la etiqueta del botón se escribe en negritas.',
			italics: 'Al estar activado el texto en la etiqueta del botón se escribe en cursivas.',
			underlined: 'Al estar activado el texto en la etiqueta del botón aparece subrayado.',
			font_size: 'Tamaño en puntos de la fuente con la que se escribe el texto de la etiqueta del botón.\n\nEl tipo de letra siempre es SansSerif.',
			image: 'Nombre del archivo de una imagen que se usará como fondo del botón.\n\nSi en la misma carpeta donde está la imagen hay otra con el mismo nombre seguido de "_over" y con la misma extensión, entonces esta imagen aparecerá en el botón cuando el cursor del ratón se encuentra sobre éste.\n\nSi en la misma carpeta donde está la imagen hay otra con el mismo nombre seguido de "_down" y con la misma extensión, entonces esta imagen aparecerá en el botón cuando se pulsa el botón con el ratón.',
			options: 'Lista de opciones que muestra el "menú".\n\nLas opciones deben ser textos separadas por comas. Después de cada texto puede venir entre corchetes [] el valor que se asigna al control cuando se selecciona esta opción. Si el valor no se define entonces se asigna automáticamente un valor entero correspondiente al índice de la opción.',
			action: 'La acción que se realiza cuando el usuario manipula el control (pulsar el botón, seleccionar un elemento de un menú, mover la barra de desplazamiento, hacer clic en un pulsador, o dar <intro> en el campo de texto).\n\nHay las siguientes acciones posibles: "calcular", "inicio", "limpiar", "animar", "abrir URL", "abrir escena" y "reproducir".',
			parameter: 'El parámetro de la acción.\n\nSi la acción es "calcular", entonces debe contener cero o varias asignaciones separadas por punto y coma (;) o salto de línea (\\n), que el programa realizará cuando se ejecute la acción.\n\nSi la acción es "abrir URL", el parámetro tiene que ser una URL.\n\nSi la acción es "abrir escena" el parámetro debe ser una dirección relativa y lo que hace es abrir la escena de Descartes que se encuentra en un archivo de texto con esa dirección.\n\nLas otras acciones no usan el parámetro.',
			drawif: 'Expresión booleana que determina cuándo el control es visible.\n\nEl valor por defecto es vacío y en ese caso el control es siempre visible.',
			activeif: 'Expresión booleana que determina cuándo el control está activo.\n\nEl valor por defecto es vacío y en ese caso es posible interactuar con el control.',
		evaluate: 'Determina si el control lleva evaluación automática.\n\nSólo se aplica en los controles de las escenas que son ítems (o reactivos) para evaluaciones.\n\nAparece desactivado por defecto. Cuando se activa en un control de un ítem, el programa sabe que al evaluarse el ítem deberá considerar lo que el usuario haya escrito o seleccionado en el control, como una respuesta y compararlo con el patrón de respuestas asociado.',
		answer: 'Es un texto que contiene lo que el alumno debería escribir.\n\nSirve de guía al revisor.\n\nPatrón de respuesta con el que se compara lo que el usuario ha escrito o seleccionado para determinar si su respuesta es correcta.\n\nSólo se aplica en los controles de las escenas que son ítems (o reactivos) para evaluaciones.\n\nPuede consistir en uno o varios campos de texto separados por | cada uno de los cuales se compara con lo  escrito o seleccionado por el usuario. Si hay una coincidencia se considera que la respuesta es correcta. Si no hay ninguna coincidencia se considera que la respuesta es errónea.\n\nCuando la respuesta debe ser numérica hay que poner el rango de respuestas válidas como un intervalo, por ejemplo: [a,b], (a,b) , (a,b] o [a,b]. Cuando el control es un campo de texto del tipo "sólo texto", entonces la comparación se hace letra a letra. Si al final de una opción de respuesta se escribe un asterisco *, entonces sólo se busca si la respuesta de usuario comienza con la propuesta. Si hay un asterisco al principio entonces se busca si la respuesta propuesta aparece al final de la del usuario. Si hay un asterisco al principio y uno al final, por ejemplo *respuesta*, sólo se busca que la propuesta aparezca dentro de la del usuario. Si se quiere que el programa ignore las diferencias entre mayúsculas y minúsculas, hay que escribir la propuesta entre comillas simples, por ejemplo: \'respuesta\'. Si se quiere que el programa ignore los acentos y la diferencia entre n y ñ, entonces hay que escribir la respuesta entre un acento grave y uno agudo, por ejemplo `respuesta´. `\'respuesta\'´ ignoraría tanto mayúsculas y minúsculas como acentos. Si hay letras que se quieren ignorar, debe escribirse una interrogación ? en lugar de la letra.\n\nSi el control es un campo de texto y el usuario lo deja vacío, se considera que no contestó. Si se trata de un menú en el que una opción es vacía (por ejemplo un espacio en la primera opción) y el usuario selecciona esa opción, también se considera que no contestó. El sistema de evaluación definido por el administrador de las evaluaciones es quien decide cómo se interpretan las respuestas correctas, las incorrectas y las vacías.',
			weight: 'Peso (en el contexto de una media ponderada) que se da a la respuesta dada en la evaluación al calcular la nota.\n\nSólo se admiten valores enteros positivos y se recomienda usar sólo 0, 1 o 2.',
			tooltip: 'Texto que aparece cuando el ratón se detiene más de un segundo y medio sobre la etiqueta de un control numérico o dentro del círculo de un control gráfico.\n\nEl valor por defecto es vacío.',
			explication: 'Texto que aparece cuando el usuario hace un clic derecho sobre la etiqueta de un control numérico o dentro del círculo de un control gráfico.\n\nEl valor por defecto es el del "tooltip".',
			cID: 'Identificador para los controles que se encuentran en el escenario.\n\nEs útil solamente en escenas de Arquímedes o Discurso.\n\nEl valor del identificador lo calcula el programa de acuerdo con el momento preciso en que éste fue creado, por lo que todos los identificadores creados en un mismo ordenador son diferentes.\n\nNo se recomienda manipular manualmente este identificador.',
			file: 'Nombre del archivo multimedia (audio o video).',
			info: 'Comentarios.',

			borderColor: 'Color del borde del texto del botón.\n\nCuando esta activado el texto del botón se dibuja con un borde del color seleccionado.\n\nEl valor por defecto es desactivado.',
			flat: 'Al estar activado el botón se dibuja sin degradado (estilo plano).\n\nEl valor por defecto es desactivado, es decir, que el botón se dibuja con degradado (estilo tradicional de Descartes).',
			text_align: 'Opciones para elegir la alineación de la etiqueta del botón, respecto a la región rectangular que ocupa el control.',
			image_align: 'Opciones para elegir la alineación de la imagen del botón, respecto a la región rectangular que ocupa el control.',
			cssClass: 'Clases de estilo CSS a las que pertenece el botón.\n\nEsto permite modificar el estilo del botón por medio de hojas de estilo externas.',
			radio_group: 'Si el valor es vacío, el control se comporta como una casilla de verificación.\nSi por el contrario contiene un nombre, el control se comporta como un radio botón perteneciente al grupo con el nombre especificado. Cuando es un radio botón, solo uno de los controles con el mismo grupo puede estar seleccionado.'
		},

		/**
		 * Definitions
		 */
		Definitions: {
			id: 'Identificador de la definición.\n\nEn el caso de una función debe incluir los parámetros de los que dependa, escritos entre paréntesis y separados por comas. Por ejemplo: f(x,y,x).',
			expression: 'Valor de la constante, variable o función.',
			evaluate: 'Opciones que permiten definir si la constante, la expresión del vector o el algoritmo deben evaluarse cada vez que el usuario modifica un control o sólamente una vez al iniciarse la escena.\n\nEs importante seleccionar "una sola vez" cuando sea factible para que el funcionamiento de la escena sea más rápido.',
			size: 'Número de elementos del vector.',
			rows: 'Número de filas de la matriz.',
			columns: 'Número de columnas de la matriz.',
			range: 'Expresión booleana que determina el dominio de la función.\n\nCualquier intento de evaluar la función fuera de su dominio lanzará una excepción, con lo cual, por ejemplo, su gráfica no se dibuja en los puntos que no están en el dominio.\n\nEl valor por defecto es vacío, lo cual se interpreta como que el dominio no está restringido.',
			algorithm: 'Al estar activado indica que la función, para evaluarse, debe usar un algoritmo; es decir, utiliza los cálculos indicados en "inicio", "hacer" y "mientras".\n\nEl valor por defecto es no activado.',
			expression2: 'Asignaciones a los valores del vector, separadas por punto y coma (;) o salto de línea (\\n).\n\nPor ejemplo, si el identificador del vector es v y tiene tamaño 3, entonces se puede escribir:\n\nv[0]=1\n\nv[1]=2.5\n\nv[2]=-3.1',
			local: 'Declaración de las variables que se deben proteger durante la ejecución de la función.\n\nPara proteger las variables, hay que escribir los identificadores separados por comas (,) o punto y coma (;).\n\nPor ejemplo: i,j;k',
			init: 'Asignaciones y llamadas a funciones separadas por punto y coma (;), tal que, todo lo que haya en este campo se ejecuta al inicio del cálculo.',
			doExpr: 'Asignaciones y llamadas a funciones separadas por saltos de línea (\\n), tal que, todo lo que haya en este campo se ejecuta repetidamente mientras la condición del parámetro "mientras" sea válida.',
			whileExpr: 'Expresión booleana que determina la condición para repetir las instrucciónes del parametro "hacer".',
			file: 'Archivo de texto (se recomienda que lleve extensión .txt) en el que aparecen en orden los valores de los elementos del vector, separados por un salto de línea.\n\nLos valores pueden ser numéricos o de cadena, en cuyo caso deben aparecer entre comillas sencillas, por ejemplo \'valor\'.',
			info: 'Comentarios.'
		},

		/**
		 * Programs
		 */
		Programs: {
			id: 'Es el identificador del programa.',
			evaluate: 'Opciones que permiten definir si la constante, la expresión del vector o el algoritmo deben evaluarse cada vez que el usuario modifica un control o sólamente una vez al iniciarse la escena.\n\nEs importante seleccionar "una sola vez" cuando sea factible para que el funcionamiento de la escena sea más rápido.',
			init: 'Asignaciones y llamadas a funciones separadas por punto y coma (;), tal que, todo lo que haya en este campo se ejecuta al inicio del cálculo.',
			doExpr: 'Asignaciones y llamadas a funciones separadas por saltos de línea (\\n), tal que, todo lo que haya en este campo se ejecuta repetidamente mientras la condición del parámetro "mientras" sea válida.',
			whileExpr: 'Expresión booleana que determina la condición para repetir las instrucciónes del parametro "hacer".',
			condition: 'Expresión booleana que cuando se cumple, ejecuta la acción.\n\nLa repetición de la acción esta condicionada por el parámetro "ejecución".',
			action: 'Acción que se ejecuta al interactuar con la escena y cumplir la condición booleana del parámetro "condición".\n\nExisten las siguientes acciones: "calcular", "abrir URL", "abrir escena", "inicio", "limpiar", "animar", "reiniciar animación" y "reproducir".',
			parameter: 'Parámetro utilizado para la acción.\n\nSi la acción es "calcular", entonces debe contener cero o varias asignaciones que el programa realizará cuando se ejecute la acción.\n\nSi la acción es "abrir URL", entonces debe ser cualquier URL.\n\nSi la acción es "abrir escena" entonces debe ser una dirección absoluta o relativa a la escena de Descartes que se desea abrir.\n\nLas otras acciones no usan el parámetro.',
			execution: 'Determina el modo de ejecución de la acción del evento.\n\n"una sola vez": la acción sólo se ejecuta la primera vez que se cumple la condición.\n\n"alternar": la acción se ejecuta la primera vez que la condición se cumple, pero si la condición deja de ser válida y vuelve a serlo luego, entonces vuelve a ejecutarse la acción.\n\n"siempre": la acción se ejecuta siempre que se cumpla la condición.\n\nEl valor por defecto es "una sola vez".',
			info: 'Comentarios.'
		},

		/**
		 * Graphics
		 */
		Graphics: {
			space: 'Lista de los espacios de dos dimensiones que se hayan definido.\n\nSe utiliza para asignar el espacio al que pertenece el gráfico.',
			type: 'El tipo del gráfico.',
			background: 'Al estar activado indica que el gráfico se dibuja sólo en el fondo de la escena, y, por lo tanto, se actualiza únicamente cuando se pulsa "inicio" y cuando se modifica la escala o la posición del origen (O.x y O.y).\n\nCuando un gráfico está siempre fijo en la escena, es decir, no depende de los controles, definiciones o programas, conviene activar esta opción pues así se ahorra el trabajo de dibujar el gráfico cada vez que hay un cambio en la escena.',
			color: 'Color del gráfico.\n\nEl botón llama al editor de colores.\n\nEl valor por defecto es #20303a.',
			color_ARROW: 'Color de la orilla o borde de la flecha, su interior se dibuja en el color del parámetro "flecha".\n\nEl valor por defecto es #20303a.',
			drawif: 'Expresión booleana que determina si el gráfico se dibuja o no.\n\nEl gráfico se dibuja si la expresión es vacía o si tiene valor verdadero (o mayor que cero).\n\nEl valor por defecto es vacío, lo que indica que siempre se dibuja.',
			drawif_EQUATION: 'Expresión booleana que determina si el gráfico se dibuja o no.\n\nEl gráfico se dibuja si la expresión es vacía o si tiene valor verdadero (o mayor que cero).\n\nSi la expresión depende de x o y, y el gráfico es una ecuación, entonces sólo se dibujan los puntos de la gráfica que satisfacen la expresión.\n\nSi el valor de x o y, no permiten que la expresión se cumpla en el momento en que va a dibujarse un objeto, entonces no se dibuja (es responsabilidad del autor controlar el valor de x e y fuera de las ecuaciones).\n\nEl valor por defecto es vacío, lo que indica que siempre se dibuja.',
			abs_coord: 'Al estar activado hace que el gráfico se interprete en pixeles y en coordenadas absolutas, con el origen en el vértice superior izquierdo del área del espacio al que pertenece el gráfico y la escala igual a 1 pixel por unidad.\n\nLos gráficos definidos en coordenadas absolutas no se mueven al cambiar el origen del sistema o la escala.',
			expression_EQUATION: 'Debe ser una ecuación en x, y. El objeto gráfico asociado a una ecuación es el lugar geométrico de los puntos que la satisfacen.\n\nEl valor por defecto es y=x.',
			expression_CURVE: 'Expresión de la forma (f(t),g(t)), donde f y g son funciones cualesquiera del parámetro t (o el que se defina en el campo "parámetro").\n\nEl valor por defecto es (t,t).',
			expression_SEQUENCE: 'Expresión del tipo (X,Y), donde X e Y son expresiones reales dependientes de n, que representan las abscisa y ordenada de los puntos de la sucesión.\n\nEl valor por defecto es (n,1/n).',
			expression_POINT: 'Expresión del tipo (X,Y), donde X e Y son expresiones reales cualesquiera que representan las abscisa y ordenada del punto.\n\nEl valor por defecto es (0,0).',
			expression_SEGMENT: 'Expresión del tipo (X1,Y1)(X2,Y2), donde (X1,Y1) son las coordenadas del inicio del segmento y (X2,Y2) las del final del segmento.\n\nEl valor por defecto es (0,0)(1,1), o sea el segmento entre el origen y el punto (1,1).',
			expression_ARROW: 'Expresión del tipo (X1,Y1)(X2,Y2), donde (X1,Y1) son las coordenadas del inicio de la flecha y (X2,Y2) las de la punta.\n\nEl valor por defecto es (0,0)(1,1), o sea la flecha que va del origen al punto (1,1).',
			expression_POLYGON: 'Expresión del tipo\n\n(x1,y1)(x2,y2)...(xN,yN),\n\ndonde xn e yn son expresiones reales arbitrarias.\n\nEl gráfico es el polígono con vértices en los puntos (xn,yn).\n\nEl valor por defecto es (0,0)(1,1)(2,-1).',
			expression_FILL: 'Expresión del tipo (X,Y), donde X e Y son expresiones reales cualesquiera que representan las abscisa y ordenada del punto donde se inciará el proceso de relleno o coloreo de la región cerrada que tiene al punto (X,Y) en su interior.\n\nEl valor por defecto es (0,0).',
			expression_TEXT: 'Expresión del tipo [X,Y], donde X e Y son expresiones reales cualesquiera que representan las abscisa y ordenada del comienzo del texto, pero medidos en pixeles a partir del vértice superior izquierdo de la escena.\n\nEl valor por defecto es [20,20].', 
			expression_IMAGE: 'Expresión del tipo (X,Y), donde X e Y son expresiones reales cualesquiera que representan las abscisa y ordenada del extremo superior izquierdo de la imagen con respecto al origen de coordenadas del espacio.\n\nEl valor por defecto es (0,0).',
			expression_MACRO: 'Nombre del archivo que contiene los datos del macro. El archivo debe encontrarse en la carpeta donde está la página que contiene a la escena o en subcarpetas de ella.',
			expression: '---',
			center: 'Expresión del tipo (X,Y) que representa el centro del arco, donde X e Y pueden ser expresiones reales arbitrarias.\n\nEl valor por defecto es (0,0).',
			radius: 'Expresión real arbitraria, que representa el radio del arco.',
			init: 'Inicio del arco.\n\nHay dos opciones: una expresión real arbitraria que se interpretará como el ángulo inicial en grados, otra puede ser una expresión de la forma (x1,y1) que se interpretará como un punto. En el segundo caso el arco comienza en el segmento que une al centro (X,Y) con el punto (x1,y1).',
			end: 'Final del arco.\n\nHay dos opciones: una expresión real arbitraria que se interpretará como el ángulo final en grados, otra puede ser una expresión de la forma (x2,y2) que se interpretará como un punto. En el segundo caso el arco termina en el segmento que une al centro (X,Y) con el punto (x2,y2).',
			vectors: 'Al estar activado, determina que el lado inicial y final del arco se obtengan de dos vectores que parten del centro del arco y no de dos puntos del plano.',
			trace: 'Al estar activado el objeto gráfico deja un rastro en la escena del color seleccionado.\n\nEl botón llama al editor de colores.\n\nCuando un gráfico deja rastro se puede apreciar su trayectoria en la escena. Pulsando el botón de "limpiar" se borran los rastros de los gráficos.\n\nEl valor por defecto es no activado.',
			useFamily: 'Al estar activado permite convertir un gráfico en toda una familia de gráficos dependiente de un parámetro.\n\nAl seleccionar familia se activan los campos "parámetro", "intervalo" y "pasos".\n\nEl valor por defecto es no activado.',
			family: 'Nombre del parámetro que se utiliza en la definición del objeto gráfico para definir la familia.\n\nEl valor por defecto es "s".\n\nEl programa dibujará los gráficos, con los valores de "s", recorriendo el intervalo especificado en el número de pasos elegido.',
			family_interval: 'Intervalo sobre el cual el parámetro de la familia obtendrá los valores al recorrerlo en el número de pasos especificado.\n\nSon dos expresiones reales entre corchetes y separadas por una coma.\n\nEl valor por defecto es [0,1].',
			family_steps: 'Número de subintervalos iguales en que se divide el intervalo de la familia y el parámetro de la familia pasa por los extremos de los subintervalos.\n\nEl valor por defecto es 8.',
			parameter: 'Identificador del parámetro utilizda en la curva. Se recomienda utilizar una palabra corta. El valor por defecto es "t".\n\nEl programa dibujará el polígono con vértices:\n\n(f(t),g(t)) para "t" entre el primero y el último de los valores del intervalo, con incrementos iguales a la longitud del intervalo entre el número de pasos.',
			parameter_interval: 'Intervalo sobre el cual el parámetro de la curva obtendrá los valores al recorrerlo en el número de pasos especificado.\n\nSon dos expresiones ti y tf reales entre corchetes y separadas por una coma, es decir, [ti,tf].\n\nEl valor por defecto es [0,1].',
			parameter_steps: 'Número de subintervalos iguales en que se divide el intervalo de la curva y el parámetro de la curva pasa por los extremos de los subintervalos.\n\nEl valor por defecto es 8.',
			text: 'Etiqueta que acompaña al objeto gráfico y se escribe cerca de su posición o algo que puede considerarse como su posición.\n\nLos textos se dibujan en el mismo color que el objeto gráfico.\n\nLos textos pueden tener varias líneas y además pueden incluir valores numéricos variables.\n\nEl valor por defecto es vacío.',
			decimals: 'Número de decimales con los que se escriben los números incluidos en el texto.\n\nPuede ser un número fijo o una expresión. Al evaluarse los números se redondean para decidir el número de decimales.\n\nEl valor por defecto es 2.',
			fixed: 'Al estar activado determina si el número de decimales es fijo o si, por el contrario, se usa la notación ajustada, en la que se eliminan los ceros innecesarios y el punto decimal si también es innecesario.\n\nPor ejemplo: en lugar de 25.3400 se escribe 25.34 y en lugar de 13.0 se escribe 13 (sin punto decimal).\n\nSi se usa notación exponencial siempre se escriben los números en forma ajustada, es decir, el atributo fijo no interviene en ese caso.\n\nEl valor por defecto es desactivado.',
			border: 'Color del borde en el texto.',
			font: '***.',
			fill: 'Al estar activado, el programa rellena el interior de la curva (considerada como un polígono) con el color seleccionado. Si la curva no tiene un interior bien definido, el resultado puede ser algo extraño.',
			fillP: 'Al estar activado:\n\nSi la ecuación es de la forma y=f(x) el espacio entre el eje x y la gráfica (arriba del eje x) se rellena del color seleccionado.\n\nSi la ecuación es de la forma x=g(y) el espacio entre el eje y y la gráfica (a la derecha del eje y) se rellena del color seleccionado.\n\nEl valor por defecto es desactivado.',
			fillM: 'Al estar activado:\n\nSi la ecuación es de la forma y=f(x) el espacio entre el eje x y la gráfica (abajo del eje x) se rellena del color seleccionado.\n\nSi la ecuación es de la forma x=g(y) el espacio entre el eje y y la gráfica (a la izquierda del eje y) se rellena del color seleccionado.\n\nEl valor por defecto es desactivado.',
			size: '---',
			size_POINT: 'Radio del disco que se utiliza para representar el punto.\n\nSi el valor es 0 el punto no se dibuja. Esto último puede aprovecharse para dibujar textos asociados a puntos invisibles, usando las coordenadas del espacio.\n\nEl valor por defecto es 2.',
			size_SEQUENCE: 'Radio del disco que se utiliza para representar los puntos de la sucesión.\n\nSi el valor es 0 los puntos no se dibuja.\n\nEl valor por defecto es 2.',
			size_SEGMENT: 'Radio del disco que se utiliza para representar los extremos del segmento.\n\nSi el valor es 0 los extremos no se dibujan.\n\nEl valor por defecto es 2.',
			width: '---',
			width_EQUATION: 'Ancho o grueso del trazo en pixeles.\n\nEl valor por defecto es 1. Se recomienda utilizar poco los anchos diferentes de 1, pues ralentizan el dibujo.',
			width_CURVE: 'Ancho o grueso en pixeles, de los segmentos de la curva.\n\nEl valor por defecto es 1.',
			width_SEGMENT: 'Ancho o grueso en pixeles, del segmento.\n\nEl valor por defecto es 1.',
			width_POLYGON: 'Ancho o grueso en pixeles, de los segmentos del polígono.\n\nEl valor por defecto es 1.',
			width_ARC: 'Ancho o grueso en pixeles, del arco.\n\nEl valor por defecto es 1.',
			width_ARROW: 'Ancho o grueso en pixeles, de la flecha.\n\nEl valor por defecto es 5.',
			width_TEXT: 'En textos no enriquecidos, especifica el ancho máximo de una línea de texto antes de agregar saltos de línea.\n\nSi se usa en textos enriquecidos o si el valor es menor que 20, entonces es ignorado.\n\nEl valor por defecto es 1.',
			spear: 'Ancho de la punta de la flecha. El valor por defecto es 8.',
			arrow: 'Color del interior de la flecha.\n\nEl valor por defecto es #ee0022.',
			visible: 'Al estar activado, en la parte inferior de la escena aparecerá un campo de texto donde se ve la expresión de la ecuación en el mismo color de la gráfica y con el color de fondo de la escena.\n\nEl valor por defecto es no activado.\n\nSi hay varias ecuaciones o curvas en una escena, abajo de ella aparecen los campos de texto de todas y cada una de las que son visibles. Si son muchas los campos pueden resultar demasiado pequeños, por lo que se recomienda no dejar visibles los campos de texto de más de tres o cuatro ecuaciones o curvas.',
			editable: 'Al estar activado el contenido del campo de texto que aparece bajo la escena con la ecuación (o curva) puede ser modificado por el usuario.\n\nEsta opción es útil cuando se desea que el alumno practique la escritura de fórmulas.',
			range: 'Expresión de la forma [n1,n2] donde n1 y n2 son dos enteros que se interpretan como el inicio y el final del intervalo de enteros que "n" recorrerá. El programa dibuja los puntos (X,Y) para cada valor de "n" entre n1 y n2.',
			file: 'Nombre del archivo de la imagen que se desea usar como objeto gráfico. Sólo pueden utilizarse archivos png, jpg, gif y svg. Los archivos de imágenes deben colocarse en el mismo sitio donde se coloca el archivo html de la escena o en subdirectorios a partir de ahí. En el nombre del archivo hay que incluir los subdirectorios.',
			inirot: 'Ángulo de giro del objeto gráfico, en sentido contrario de las agujas del reloj.\n\nPuede ser una expresión o un número fijo.',
			inipos: 'Expresión del tipo (X,Y), donde X e Y son expresiones reales cualesquiera que representan las abscisa y ordenada el punto inicial del macro con respecto al origen de coordenadas del espacio.',
			name: 'Nombre del macro, que se utiliza para acceder a sus parámetros al hacer cálculos.\n\nLa sintaxis para acceder a los parámetros es <nombre_macro>.nombre_del_parametro.',

			opacity: 'Nivel de opacidad de la image, es decir, que tan opaca o traslúcida es.\n\nEl valor aceptado es un número entre 0 y 1, donde 0 es completamente transparente y 1 es completamente opaco.\n\nEl valor por defecto es 1.',
			align: 'Alineación del texto respecto a una caja, cuyo ancho esta determinado por el tamaño de la línea de texto más larga que conforman el texto y el alto esta determinado por la altura que ocupa el texto.\n\nEl texto puede alinearse pegado al borde izquierdo, centrado o pegado al borde derecho de la caja.\n\nSi el texto consta de una sola línea, las tres alineación dibujan el texto de la misma manera.',
			anchor: 'Punto de anclaje de la caja de texto, cuyo ancho esta determinado por el tamaño de la línea de texto más larga que conforman el texto y el alto esta determinado por la altura que ocupa el texto.\n\nLa posición del texto (dada por el parámetro expresión) y el punto de anclaje, determinan como se construye la caja de texto y por consecuencia la posición del texto dentro del espacio.',
			lineDash: 'Opciones que determinan el estilo de dibujo del trazo del gráfico, el cual puede ser un "solido", "rallado" o "punteado".',
			info: 'Comentarios.'
		},

		/**
		 * Graphics 3D
		 */
		Graphics3D: {
			name: 'Nombre del macro, que se utiliza para acceder a sus parámetros al hacer cálculos.\n\nLa sintaxis para acceder a los parámetros es <nombre_macro>.nombre_del_parametro.',
			space: 'Lista de los espacios de tres dimensiones que se hayan definido.\n\nSe utiliza para asignar el espacio al que pertenece el gráfico.',
			type: 'El tipo del gráfico.',
			background: 'Al estar activado el gráfico 3D se calcula sólo una vez y se actualiza únicamente cuando se pulsa inicio.\n\nCuando un gráfico 3D no depende de los controles ni de los auxiliares, conviene definirlo como de fondo, pues así se ahorra trabajo al procesador que no tendrá que calcularlo cada vez que haya un cambio en la escena.',
			color: 'Color del gráfico.\n\nEl botón llama al editor de colores.\n\nEl valor por defecto es #eeffaa.',
			backcolor: 'Color del reverso del gráfico.\n\nEl botón llama al editor de colores.\n\nEl valor por defecto es #6090a0.',
			drawif: 'Expresión booleana que determina si el gráfico se dibuja o no.\n\nEl gráfico se dibuja si la expresión es vacía o si tiene valor verdadero (o mayor que cero).\n\nEl valor por defecto es vacío, lo que indica que siempre se dibuja.',
			expression: '---',
			expression_POINT: 'Expresión de la forma:\n\n(X,Y,Z)\n\ndonde X, Y y Z son expresiones numéricas cualesquiera, que representan la posición espacial de un punto en tres dimensiones.\n\nEl valor por defecto es (0,0,0).',
			expression_SEGMENT: 'Expresión de la forma:\n\n(X1,Y1,Z1)(X2,Y2,Z2)\n\ndonde X1, Y1, Z1, X2, Y2, Z2 son expresiones numéricas, que representan la posición espacial de los extremos del segmento en tres dimensiones.\n\nEl valor por defecto es (0,0,0)(1,1,1).',
			expression_POLYGON: 'Expresión de la forma:\n\n(X1,Y1,Z1)(X2,Y2,Z2)...(Xn,Yn,Zn)\n\ndonde X1, Y1, Z1, X2, Y2, Z2, ..., Xn, Yn, Zn son expresiones numéricas, que representan varios segmentos representando un polígono (sin caras) en tres dimensiones.\n\nEl valor por defecto es (0,0,0)(1,0,0)(1,1,0)(1,1,1).',
			expression_CURVE: 'Expresión de la forma:\n\nx=X(u)\n\ny=Y(u)\n\nz=Z(u)\n\ndonde X, Y y Z son expresiones numéricas dependientes del parámetro u.\n\nLa curva se dibuja como una polígonal con Nu lados cuyos Nu+1 vértices son los puntos:\n\n(X(i/Nu),Y(i/Nu),Z(i/Nu)) para i=0,...,Nu+1.\n\nAntes de x, y, z se pueden definir variables intermedias que sólo se usan para los cálculos que se realizan al dibujar la curva.',
			expression_TRIANGLE: 'Coordenadas de tres puntos del espacio, es decir, una expresión de la forma:\n\n(X1,Y1,Z1)(X2,Y2,Z2)(X3,Y3,Z3)\n\ndonde Xi, Yi, para i=1,2,3 pueden ser expresiones numéricas.',
			expression_FACE: 'Cooredenadas de un polígono en el plano, es decir, una expresión de la forma:\n\n(X1,Y1)(X2,Y2)...(Xn,Yn)\n\ndonde Xi, Yi, para i=1,...,n son expresiones numéricas.',
			expression_SURFACE: 'Expresión de la forma:\n\nx=X(u,v)\n\ny=Y(u,v)\n\nz=Z(u,v)\n\ndonde X, Y y Z son expresiones numéricas dependientes de los parámetros u y v.\n\nLa superficie consta de la red de cuadriláteros formada por los puntos:\n\n(X(i/Nu,j/Nv),Y(i/Nu,j/Nv),Z(i/Nu,j/Nv))\n\npara i=0,...,Nu+1 y j=0,...,Nv+1.\n\nAntes de x, y, z se pueden definir variables intermedias que sólo se usan para los cálculos que se realizan al dibujar la superficie.',
			expression_TEXT: 'Expresión de la forma:\n\n[X,Y]\n\ndonde X e Y son expresiones numéricas que determinan la posición del texto en pixeles medidos de izquierda a derecha y de arriba abajo con respecto al vértice superior izquierdo del espacio.',
			expression_MACRO: 'Nombre del archivo que contiene los datos del macro. El archivo debe encontrarse en la carpeta donde está la página que contiene a la escena o en subcarpetas de ella.',
			useFamily: 'Al estar activado permite convertir un gráfico en toda una familia de gráficos dependiente de un parámetro.\n\nAl seleccionar familia se activan los campos "parámetro", "intervalo" y "pasos".\n\nEl valor por defecto es no activado.',
			family: 'Nombre del parámetro que se utiliza en la definición del objeto gráfico para definir la familia.\n\nEl valor por defecto es "s".\n\nEl programa dibujará los gráficos, con los valores de "s", recorriendo el intervalo especificado en el número de pasos elegido.',
			family_interval: 'Intervalo sobre el cual el parámetro de la familia obtendrá los valores al recorrerlo en el número de pasos especificado.\n\nSon dos expresiones reales entre corchetes y separadas por una coma.\n\nEl valor por defecto es [0,1].',
			family_steps: 'Número de subintervalos iguales en que se divide el intervalo de la familia y el parámetro de la familia pasa por los extremos de los subintervalos.\n\nEl valor por defecto es 8.',
			inirot: 'Vector de tres componentes (A,B,C) que representa una rotación incial, cuyos elementos son rotaciones (en grados) alrededor del eje x, del eje y, y del eje z, respectivamente, que se aplicarán sobre el objeto gráfico antes de dibujarse.\n\nSi se agrega la palabra "Euler" antes de la terna ordenada, es decir, se escribe Euler(A,B,C), entonces los ángulos A, B y C se interpretan como rotaciones de Euler, es decir, A es una rotación alrededor del eje z, B alrededor del nuevo eje x (el que se obtiene tras la primera rotación) y C alrededor del nuevo eje z (el que se obtiene después de las primeras dos rotaciones).\n\nNota: Se aplica antes que la translación inicial.',
			inipos: 'Vector de tres componentes (A,B,C) que representa una translación inicial, que se aplicará al objeto gráfico antes de dibujarse.\n\nNota: Se aplica después de la rotación inicial y antes de la rotación final.',
			endrot: 'Vector de tres componentes (A,B,C) que representa una rotación final, cuyos elementos son rotaciones (en grados) alrededor del eje x, del eje y, y del eje z, respectivamente, que se aplicarán sobre el objeto gráfico antes de dibujarse.\n\nSi se agrega la palabra "Euler" antes de la terna ordenada, es decir, se escribe Euler(A,B,C), entonces los ángulos A, B y C se interpretan como rotaciones de Euler, es decir, A es una rotación alrededor del eje z, B alrededor del nuevo eje x (el que se obtiene tras la primera rotación) y C alrededor del nuevo eje z (el que se obtiene después de las primeras dos rotaciones).\n\nNota: Se aplica después de la translación inicial y antes de la translación final.',
			endpos: 'Vector de tres componentes (A,B,C) que representa una translación final, que se aplicará al objeto gráfico antes de dibujarse.\n\nNota: Se aplica después de la rotación final.',
			split: 'Al estar activado, indica si la superficie debe ser cortada por los gráficos del mismo espacio que la preceden en la lista, en caso de intersección.\n\nEs recomendable mantener esta opción siempre activada, a menos que se estén utilizando muchos gráficos que no se intersectan y convenga hacer un poco más rápida la ejecución.',
			edges: 'Al estar activado determina si las orillas de las caras que forman el objeto deben dibujarse o no. Las orillas se dibujan en color gris.',
			text: 'Etiqueta que acompaña al objeto gráfico y se escribe cerca de su posición o algo que puede considerarse como su posición.\n\nLos textos se dibujan en el mismo color que el objeto gráfico.\n\nLos textos pueden tener varias líneas y además pueden incluir valores numéricos variables.\n\nEl valor por defecto es vacío.',
			font: '***.',
			decimals: 'Número de decimales con los que se escriben los números incluidos en el texto.\n\nPuede ser un número fijo o una expresión. Al evaluarse los números se redondean para decidir el número de decimales.\n\nEl valor por defecto es 2.',
			fixed: 'Al estar activado determina si el número de decimales es fijo o si, por el contrario, se usa la notación ajustada, en la que se eliminan los ceros innecesarios y el punto decimal si también es innecesario.\n\nPor ejemplo: en lugar de 25.3400 se escribe 25.34 y en lugar de 13.0 se escribe 13 (sin punto decimal).\n\nSi se usa notación exponencial siempre se escriben los números en forma ajustada, es decir, el atributo fijo no interviene en ese caso.\n\nEl valor por defecto es desactivado.',
			model: 'Opciones para dibujar las caras del objeto gráfico.\n\n"color": hace que se dibuje con colores sólidos.\n\n"luz": hace que el color sea más o menos brillante según la orientación, para dar una sensación de iluminación.\n\n"metal": es como luz, pero con brillos más contrastados para dar la impresión de que la superficie es metálica.\n\n"alambre": dibuja sólo las orillas en el color seleccionado.\n\nNota: Con modelo alambre las aristas se dibujan en el color seleccionado y no en gris como ocurre en los otros modelos.',
			width: '---',
			width_POINT: 'Tamaño del punto en pixels.\n\nEl valor por defecto es 1.',
			width_SEGMENT: 'Ancho o grueso en pixeles, del segmento.\n\nEl valor por defecto es 1.',
			width_POLYGON: 'Ancho o grueso en pixeles, de los segmentos del polígono.\n\nEl valor por defecto es 1.',
			width_CURVE: 'Ancho o grueso en pixeles, de los segmentos de la curva.\n\nEl valor por defecto es 1.',
			width_POLIREG: 'Mitad del radio del polígono regular si ancho=largo. Si ancho!=largo entonces el polígono no es regular sino que es una deformación de uno regular.',
			width_CUBE: 'Tamaño del lado del cubo en pixels.\n\nEl valor por defecto es 2.',
			width_BOX: 'Dimensión a lo largo del eje x.\n\nEl valor por defecto es 2.',
			width_TETRAHEDRON: 'Tamaño del lado del tetraedro en pixels.\n\nEl valor por defecto es 2.',
			width_OCTAHEDRON: 'Tamaño del lado del octaedro en pixels.\n\nEl valor por defecto es 2.',
			width_DODECAHEDRON: 'Tamaño del lado del dodecaedro en pixels.\n\nEl valor por defecto es 2.',
			width_ICOSAHEDRON: 'Tamaño del lado del icosaedro en pixels.\n\nEl valor por defecto es 2.',
			width_SPHERE: 'Tamaño del diametro de la esfera en pixels.\n\nEl valor por defecto es 2.',
			width_ELLIPSOID: 'Dimensión a lo largo del eje x.\n\nEl valor por defecto es 2.',
			width_CONE: 'Dimensión a lo largo del eje x.\n\nEl valor por defecto es 2.',
			width_CYLINDER: 'Dimensión a lo largo del eje x.\n\nEl valor por defecto es 2.',
			length: '---',
			length_POLIREG: 'Mitad del radio del polígono regular si ancho=largo. Si ancho!=largo entonces el polígono no es regular sino que es una deformación de uno regular.',
			length_ELLIPSOID: 'Dimensión a lo largo del eje y.\n\nEl valor por defecto es 2.',
			length_CONE: 'Dimensión a lo largo del eje y.\n\nEl valor por defecto es 2.',
			length_CYLINDER: 'Dimensión a lo largo del eje y.\n\nEl valor por defecto es 2.',
			height: 'Dimensión a lo largo del eje z.\n\nEl valor por defecto es 2.',
			Nu: 'Número de intervalos en los que se parte el intervalo unitario [0,1] para el parámetro "u".',
			Nv: 'Número de intervalos en los que se parte el intervalo unitario [0,1] para el parámetro "v".',
			offset_dist: 'Desplazamiento del texto respecto a la posición del punto.',
			offset_angle: 'Ángulo en el que se realiza el desplazamiento del texto respecto a la posición del punto.',
			info: 'Comentarios.'
		},	

		Animation: {
			useAnimation: 'Al estar activado todos los campos del panel de animación se activan y el autor puede escribir en ellos o elegir opciones para programar la animación.',
			delay: 'El tiempo en milisegundos que el programa espera en cada paso de la animación.\n\nEl valor por defecto es 40.\n\nLos valores pequeños hacen que la animación sea más rápida y viceversa. En procesadores lentos los valores pequeños no necesariamente producen animaciones rápidas.',
			auto: 'Al estar activado determina si la animación comienza automáticamente cuando la escena aparece en la pantalla y cada vez que se pulsa el botón de "inicio".\n\nCuando esta desactivado la animación comienza solo cuando el usuario ejecuta una acción que inicie la animación.',
			loop: 'Al estar activado determina si la animación se repite indefinidamente o bien se detiene cuando la condición "mientras" deja de ser verdadera.',
			init: 'Asignaciones y llamadas a funciones separadas por punto y coma (;), tal que, todo lo que haya en este campo se ejecuta al inicio del cálculo.',
			doExpr: 'Asignaciones y llamadas a funciones separadas por saltos de línea (\\n), tal que, todo lo que haya en este campo se ejecuta repetidamente mientras la condición del parámetro "mientras" sea válida.',
			whileExpr: 'Expresión booleana que determina la condición para repetir las instrucciónes del parametro "hacer".',
			info: 'Comentarios.'
		},

		Extra: {
			expand: 'Expande el contenido del campo de texto.',
			simple_text_editor: 'Editor de texto simple.',
			rich_text_editor: 'Editor de texto enriquecido.',
		}
	}

  return tooltip;
})(tooltip || {});