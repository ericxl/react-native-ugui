# Project
This is a mono repo project for react unity: which is bringing react to Unity.

# Structure
/unity: This is the Unity project, that uses the react unity upm package. It references a local unity package (in Packages/manifest.json). Consider this folder as the sample project.
/react-unity-core-upm: This is the unity package that is in development
/react-unity-renderer: This is typescript/javascript package. This is the package that users would need to import to write reactive UIs using JS/TS for Unity.

- In unity/react: This is a node project root that uses the react unity package. It uses react-unity-renderer.

## Testing

