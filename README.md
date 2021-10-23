# Juego online

## Primera fase

1. Sistemas de salas.

2. Sistema de chat en vivo.

3. Sistema de emparejamiento según nivel o caracteristicas (país, etc).

## Camara

Las Camaras de perspectiva simular a la visión real del humano, con profundidad y demás.
Las Ortopedicas, por otro lado, no simulan la profundidad, y son utilices para visualizar UI.

## Juego

### Tecnología

- WebGL/Canvas API
- ReactJS + ElectronJS
- NodeJS + MongoDB

### Game Engine

| Nombre   | Fallback a canvas | 3D  | Tiene API en ReactJS | DX (out of ten) |
| -------- | ----------------- | --- | -------------------- | --------------- |
| Three.js | 1                 | 1   | react-three-fiber    | 10              |
| Three.js | 1                 | 1   | react-babylonjs      | 7               |
| PixiJS   | 1                 | 0   | @inlet/react-pixi    |
| Phaser   | 1                 | 0   | react-phaser-fiber   |

## Herramientas

### Librerías soporte

- drei.
- gltfjsx (GLTF to JSX).

### Extensiones de VSC

### Assets

- https://quaternius.com/
- https://www.artstation.com/
- https://www.mixamo.com/
- https://ambientcg.com/
- https://www.solarsystemscope.com/textures/
- https://sketchfab.com/
- https://modelviewer.dev/

## Componentes

## Preguntas

- ¿Como aplicar transformaciones correctamente?
- Determinar la velocidad con la que rota o se mueve un objeto.

## Notas

- npm install --save use-deep-compare-effect
- Accede a todas las funcionalidades disponibles de THREE usando sus elementos JSX con lowerCamelCase. Ejemplo <gridHelper />.
- Algunas clases requieren argumentos que están dentro del context, por lo cual hay que agregar logica adicional para obtener esos argumentos, por ejemplo, usar useThree().
- Se puede usar <Suspense> a nivel de componentes para mostrar skeletons mientras cargan texturas. ¿Es recomendable?. Al parecer igualmente se congela toda la aplicación mientras esta cargado. **Analizar**.
- Usar onPointerOver y onPointerOut para crear efecto de hover.
- Usar elemento Html de drei para generar UI rapidamente.
- Alternar movimiento de caracter con onKeyDown y onKeyUp, para evitar muchos re-renders.
