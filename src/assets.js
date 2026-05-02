export async function loadAssets() {
  const baseUrl = import.meta.env.BASE_URL;
  const atlas = await fetch(`${baseUrl}assets/brainrots/spritesheet-runtime.json`).then((res) => res.json());
  const image = new Image();
  image.src = `${baseUrl}assets/brainrots/spritesheet-runtime.png`;
  await image.decode();

  return {
    image,
    frames: Object.values(atlas.frames).map((entry) => entry.frame),
    ready: true,
  };
}
