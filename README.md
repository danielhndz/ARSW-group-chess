# :hammer_and_wrench: Group chess

## Arquitecturas de Software (ARSW)

### :pushpin: Daniel Felipe Hernández Mancipe

<br/>

[![Deployed to Heroku](https://www.herokucdn.com/deploy/button.png)](https://secure-brook-34164.herokuapp.com/)

<br/>

El proyecto es una implementación de un juego de ajedrez interactivo que permite a múltiples usuarios jugar en salas compartidas mediante el uso de web sockets.

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

## Built With

- [Maven](https://maven.apache.org/) - Dependency Management
- [Git](https://git-scm.com/) - Version Management
- [JUnit4](https://junit.org/junit4/) - Unit testing framework for Java

## Design Metaphor

- Autor: Daniel Hernández
- Última modificación: 22/07/2022

### Class Diagram

Diagrama del paquete principal del proyecto

![](../media/pkg_groupchess.png?raw=true)

Diagrama del paquete cache del proyecto

![](../media/pkg_cache.png?raw=true)

Diagrama del paquete configs del proyecto

![](../media/pkg_configs.png?raw=true)

Diagrama del paquete controller del proyecto

![](../media/pkg_controller.png?raw=true)

Diagrama del paquete endpoints del proyecto

![](../media/pkg_endpoints.png?raw=true)

Diagrama del paquete model del proyecto

![](../media/pkg_model.png?raw=true)

Diagrama del paquete utils del proyecto

![](../media/pkg_utils.png?raw=true)

## Authors

- **Daniel Hernández** - _Initial work_ - [danielhndz](https://github.com/danielhndz)

## License

This project is licensed under the GPLv3 License - see the [LICENSE.md](LICENSE.md) file for details

## Javadoc

Para generar Javadocs independientes para el proyecto en la carpeta `/target/site/apidocs` ejecute:

```
mvn javadoc:javadoc
```
