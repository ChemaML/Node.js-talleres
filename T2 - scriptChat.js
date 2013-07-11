	
var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

server.listen(8080);

app.get('/', function(req,res){

	res.sendfile(__dirname+'/indexChat.html');

});


//En todo chat se guardan los nombres de usuarios de todas las conexiones recibidas
//y para ello usaremos un array unidimensional llamado 'usuarios'
var usuarios = new Array();

// -------------------------------------------------------------
// MANEJO DE EVENTOS
// -------------------------------------------------------------



io.sockets.on('connection',function(socket){

	//EVENTOS AQUÍ

	console.log('Usuario conectado');

	//Siempre que se conecte un nuevo usuario, tendremos que agregarlo a la lista de 
	//usuarios conectados y transmitir a todas las conexiones de que deben actualizar
	//el area de texto donde aparecen los nombres de los usuarios
	socket.on('nuevoUsuario',function(cadena){

		//Añadimos el nuevo usuario a nuestro array
		var longitud = usuarios.length;
		usuarios[longitud]=cadena;

		console.log(cadena);

		//Para identificar a cada conexion, utilizamos el atributo username de la 
		//variable socket, y así saber con quien estamos tratando en cada momento
		socket.username=cadena;

		//Finalmente, enviamos el array de usuarios a todas las conexiones establecidas
		//para que se actualicen
		io.sockets.emit('actualizaUsuarios',usuarios);

	});


	//Necesitamos un handler/manejador... evento en definitiva, que procese las peticiones
	//recibidas de los clientes cuando quieran mandar un mensaje a los demás
	//En este caso, la función recibe una cadena de texto como mensaje recibido y lo que
	//consecuentemente tendrá que avisar a todas las conexiones establecidas de que alguien
	//ha actualizado el chat.
	socket.on('recibe',function(cadena){

		//Pedimos a todos los usuarios que actualicen su chat con la nueva información
		io.sockets.emit('actualizaChat',cadena);

	});

	
	//La función 'disconnect' es un nombre de función especial que se dispara al cerrarse
	//cualquier conexion, de modo que al perder el contacto con cualquier usuario, lo 
	//lógico es quitarlo del array de usuarios y volver a actualizar al resto de conexiones
	socket.on('disconnect',function(){

		//Definimos un array auxiliar
		var auxiliar = new Array();

		//Recorremos el array
		for(var i=0; i<usuarios.length; i++){

			//Si el término del array que estamos tratando no coincide con el nombre
			//que establecimos a nuestra variable socket (el nombre del cliente en 
			//este caso), añadimos el término actual al array auxiliar.
			//En caso contrario, no hacemos nada y así dejamos fuera el nombre de la
			//conexión actual que estamos tratando.
			if(usuarios[i]!=socket.username){
				auxiliar[auxiliar.length]=usuarios[i];
			}

		}
		
		//Finalmente, sobreescribimos el array de usuarios con nuestro array actualizado
		//y avisamos a las conexiones restantes de que tienen que actualizar su lista 
		//de usuarios enviándoles la el nuevo array
		usuarios=auxiliar;
		io.sockets.emit('actualizaUsuarios',usuarios);

	});



	//Este tutorial es una prueba de lo rápido y sencillo que se puede programar un
	//chat simple utilizando estos módulos de Node.js
	//Aun así, hay muchas cosas que se pueden mejorar, pero eso lo dejaremos como
	//ejercicio para los interesados:

	//1.- Con el chat en este estado, dos usuarios podrían establecer como nick un nombre
	//igual el uno al del otro. Este es un fallo que no se debe permitir, ya que llevaría
	//a mal entendidos. Programe alguna forma de evitar que esto ocurra.

	//2.- Generalmente, en los chats se pueden enviar mensajes de texto privados entre dos
	//usuarios sin tener en cuenta al resto de la sala. Implementar alguna forma de 
	//comunicación para conseguirlo.
	//Consejo: para no tocar mucho el documento html, una forma simple sería detectar una
	//cadena de texto que empezara de algún modo, seguido del nombre del destinatario y a
	//continuación el mensaje 
	//Ej: msj:Alberto mensaje de texto para Alberto

	








});

