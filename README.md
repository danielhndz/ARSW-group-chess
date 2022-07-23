# :hammer_and_wrench: Group chess

## Arquitecturas de Software (ARSW)

### :pushpin: Daniel Felipe Hernández Mancipe

<br/>

[![Deployed to Heroku](https://www.herokucdn.com/deploy/button.png)](https://secure-brook-34164.herokuapp.com/)

<br/>

El proyecto es una implementación de un juego de ajedrez interactivo que permite a múltiples usuarios jugar en salas compartidas mediante el uso de web sockets. Aunque la idea es que la aplicación sea escalable teniendo múltiples instancias del servidor accediendo a una base de datos rápida (Redis), por el momento esta funcionalidad se encuentra implementada en memoria.

## Getting Started

### Prerequisites

- Java >= 11.x
- Maven >= 3.x
- Git >= 2.x
- JUnit 4.x

### Installing

Simplemente clone el repositorio:

```
git clone https://github.com/danielhndz/ARSW-group-chess.git
```

Luego compile el proyecto con maven:

```
mvn compile
```

Si salió bien, debería tener un **BUILD SUCCESS** verde.

### Using

```
mvn spring-boot:run
```

Puede conectarse a la aplicación desplegada en [Heroku](https://secure-brook-34164.herokuapp.com/)

Para ilustrar la aplicación se recrea una partida con dos instancias de un browser en modo incógnito, se puede notar que al pasar el mouse por encima de una ficha, se alumbran las posibles casillas para mover dicha ficha, al dar click en una ficha, se borde su casilla ilustrándo que la ficha se encuentra seleccionada y se puede mover dando click en una casilla libre.

![](../media/demo.gif?raw=true)

## Built With

- [Maven](https://maven.apache.org/) - Dependency Management
- [Git](https://git-scm.com/) - Version Management
- [Spring](https://spring.io/) - An application framework and inversion of control container for Java
- [JUnit4](https://junit.org/junit4/) - Unit testing framework for Java
- [React](https://reactjs.org/) - A JavaScript library for building user interfaces
- [chess.js](https://github.com/jhlywa/chess.js) - A Javascript chess library
- [webpack](https://webpack.js.org/) - A module bundler for JavaScript

## Design Metaphor

- Autor: Daniel Hernández
- Última modificación: 22/07/2022

### Backend Class Diagram

- [Paquete principal](/src/main/java/edu/escuelaing/arsw/finalproj/groupchess/)

![](../media/pkg_groupchess.png?raw=true)

Los nombres de los paquetes intentar ser representativos en términos de la funcionalidad de que está implementada en dicho paquete. La clase [App](/src/main/java/edu/escuelaing/arsw/finalproj/groupchess/App.java) arranca el proyecto.

- [Paquete cache](/src/main/java/edu/escuelaing/arsw/finalproj/groupchess/cache/)

![](../media/pkg_cache.png?raw=true)

Dado que la persistencia de datos se encuentra implementada en memoria, es la clase [RoomsCache](/src/main/java/edu/escuelaing/arsw/finalproj/groupchess/cache/RoomsCache.java) la que se encarga de almacenar las salas que son creadas por los usuarios.

- [Paquete configs](/src/main/java/edu/escuelaing/arsw/finalproj/groupchess/configs/)

![](../media/pkg_configs.png?raw=true)

La clase [WebSocketConfig](/src/main/java/edu/escuelaing/arsw/finalproj/groupchess/configs/WebSocketConfig.java) configura un `Bean` de tipo `ServerEndpointExporter`. La clase [ThymeleafConfig](/src/main/java/edu/escuelaing/arsw/finalproj/groupchess/configs/ThymeleafConfig.java) configura algunas propiedades del `Resolver`.

- [Paquete controller](/src/main/java/edu/escuelaing/arsw/finalproj/groupchess/controller/)

![](../media/pkg_controller.png?raw=true)

[RoomsController](/src/main/java/edu/escuelaing/arsw/finalproj/groupchess/controller/RoomsController.java) es simplemente el controlador principal de las salas.

- [Paquete endpoints](/src/main/java/edu/escuelaing/arsw/finalproj/groupchess/endpoints/)

![](../media/pkg_endpoints.png?raw=true)

[RoomListEndpoint](/src/main/java/edu/escuelaing/arsw/finalproj/groupchess/endpoints/RoomListEndpoint.java) es el `endpoint` que se encarga de adminitrar las salas para todos los usuarios. [RoomEndpoint](/src/main/java/edu/escuelaing/arsw/finalproj/groupchess/endpoints/RoomEndPoint.java) se encargar de la interacción de cada sala en particular, incluyendo el juego.

- [Paquete model](/src/main/java/edu/escuelaing/arsw/finalproj/groupchess/model/)

![](../media/pkg_model.png?raw=true)

La única clase de este paquete, [Room](/src/main/java/edu/escuelaing/arsw/finalproj/groupchess/model/Room.java) simplemente modela la sala, el atributo `fen` proviene de [Forsyth–Edwards Notation](https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation), el propósito de esta notación del ajedrez es proveer toda la información necesaria para restaurar un juego desde un estado particular.

- [Paquete utils](/src/main/java/edu/escuelaing/arsw/finalproj/groupchess/utils/)

![](../media/pkg_utils.png?raw=true)

[Utils](/src/main/java/edu/escuelaing/arsw/finalproj/groupchess/utils/Utils.java) está pensada para proveer funciones que usan a lo largo del proyecto en diferentes paquetes.

### Frontend Class Diagram

El frontend de la aplicación se resume en los siguientes archivos:

![](../media/frontend.png?raw=true)

En la carpeta build se encuentra el archivo `bundle.js` el cual es usado por `webpack` como punto de entrada. Esta carpeta no se encuentra rastreada por `git`.

- [app.js](/src/main/resources/static/js/app.js)

![](../media/frontend_app.png?raw=true)

Simplemente es el punto de partida del fronted de la aplicación.

- [utils.js](/src/main/resources/static/js/utils.js)

![](../media/frontend_utils.png?raw=true)

Define la clase `RoomWS` que es el websocket que gestiona una sala en particular, la clase `RoomListWS` que es el websocket que gestiona las salas, y una serie de funciones y constantes que usan a lo largo del fronted de la aplicación.

- [components](/src/main/resources/static/js/components/)

Dado que se usa React para construir la interfaz de la aplicación, y dado que la interfaz es bastante simple, basta con describir los componentes de React construídos para entender la arquitectura de la interfaz.

![](../media/pkg_components.png?raw=true)

[App.jsx](/src/main/resources/static/js/components/App.jsx) simplemente es componente `root` de la aplicación.

[RoomTable.jsx](/src/main/resources/static/js/components/RoomTable.jsx) es el componente encargado de la visualización de las salas.

[Room.jsx](/src/main/resources/static/js/components/Room.jsx) es el componente encargado de la visualización de una sala particular.

[Board.jsx](/src/main/resources/static/js/components/Board.jsx) es el componente encargado de la visualización del tablero.

[Tile.jsx](/src/main/resources/static/js/components/Board.jsx) es el componente encargado de la visualización de cada casilla del tablero.

## Authors

- **Daniel Hernández** - _Initial work_ - [danielhndz](https://github.com/danielhndz)

## License

This project is licensed under the GPLv3 License - see the [LICENSE.md](LICENSE.md) file for details

## Javadoc

Para generar Javadocs independientes para el proyecto en la carpeta `/target/site/apidocs` ejecute:

```
mvn javadoc:javadoc
```
