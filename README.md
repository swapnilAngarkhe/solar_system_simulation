Solar System Simulation with Three.js
Overview

This project is a 3D interactive simulation of our solar system, created using Three.js. It visualizes the planets orbiting the Sun, complete with accurate relative distances, sizes, and orbital speeds. The simulation also includes a starfield for enhanced realism and uses CSS2D labels to display planet names.

Features

3D Visualization: Planets are rendered as spheres with realistic colors and emissive properties.

Accurate Orbits: Planets orbit the Sun at their correct relative distances and speeds.

Starfield: A starfield provides a realistic cosmic background.

Planet Labels: CSS2D labels display the names of the planets.

Interactive Controls: Orbit controls allow you to zoom in and out, pan, and rotate the view.

Moons: The Earth has a Moon, which orbits around it.

Rings: Saturn has rings.

Lighting: The Sun emits light, illuminating the planets.

How It Works

Scene Setup: A Three.js scene is created, along with a perspective camera and a WebGL renderer. A CSS2D renderer is used for the planet labels.

Lighting: Ambient and point lights are added to the scene.

Planet Data: Planet data (name, radius, color, distance, orbital speed, etc.) is defined in an array.

Object Creation:

The Sun is created as a large, emissive sphere.

For each planet in the planetsData array:

A sphere is created for the planet.

An orbit path is created using LineLoop.

A CSS2D label is created to display the planet's name.

If the planet has moons, they are created and added as children of the planet.

If the planet has rings (Saturn), a RingGeometry is used.

A starfield is created using Points and random vertex positions.

Animation: The animate() function is called using requestAnimationFrame(). It updates the positions of the planets and moons based on their orbital speeds, and rotates the planets. The camera controls are also updated.

Resizing: The window resize event listener updates the camera aspect ratio and renderer size.

Files

index.html: The HTML file that sets up the page structure, includes the Three.js library, and contains the CSS for the labels.

script.js: The JavaScript file that contains the Three.js code for creating the solar system simulation.

#css2d-container: The div element used to hold the CSS2D renderer.

Libraries

Three.js: A JavaScript library for creating 3D computer graphics in a web browser.
