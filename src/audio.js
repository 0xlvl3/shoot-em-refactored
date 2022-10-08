const audio = {
  shoot: new Howl({
    src: "../src/sounds/Basic_shoot_noise.wav",
    volume: 0.025,
  }),
  damageTaken: new Howl({
    src: "../src/sounds/Damage_taken.wav",
    volume: 0.05,
  }),
  explode: new Howl({
    src: "../src/sounds/Explode.wav",
    volume: 0.05,
  }),
  powerUp: new Howl({
    src: "../src/sounds/Powerup.wav",
    volume: 0.025,
  }),
  death: new Howl({
    src: "../src/sounds/Death.wav",
    volume: 0.05,
  }),
  select: new Howl({
    src: "../src/sounds/Select.wav",
    volume: 0.05,
  }),
  background: new Howl({
    src: "../src/sounds/Hyper.wav",
    volume: 0.1,
    loop: true,
  }),
};

export default audio;
