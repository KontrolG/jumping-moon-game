import { Triplet } from "@react-three/cannon";

export const MOON_RADIUS = 1;
export const INITIAL_MOON_POSITION: [number, number, number] = [0, 20, 0];
export const POINTS_TO_WIN = 10;
export const GRAVITY: Triplet = [0, -60, 0];

// Projectile Configurations
export const PROJECTILE_SPEED = 20; // Units per second
export const PROJECTILE_MIN_INTERVAL = 2000; // Milliseconds
export const PROJECTILE_MAX_INTERVAL = 5000; // Milliseconds
export const PROJECTILE_SPAWN_RADIUS = 30; // Units away from player
export const PROJECTILE_SPAWN_HEIGHT_OFFSET = 5; // Units above player's y position
