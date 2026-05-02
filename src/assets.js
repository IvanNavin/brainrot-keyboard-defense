export async function loadAssets() {
  const atlas = await fetch("./assets/brainrots/spritesheet-runtime.json").then((res) => res.json());
  const image = new Image();
  image.src = "./assets/brainrots/spritesheet-runtime.png";
  await image.decode();

  return {
    image,
    frames: Object.values(atlas.frames).map((entry) => entry.frame),
    ready: true,
  };
}
