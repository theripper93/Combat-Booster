class BloodSplatter {
  constructor() {
    this.blood = new PIXI.Container();
    this.blood.name = "blood";
    this.color = "0x"+game.settings.get("combatbooster", "bloodColor").slice(1,7);
    this.alpha = parseInt(game.settings.get("combatbooster", "bloodColor").slice(7), 16)/255;
    this.scaleMulti = game.settings.get("combatbooster", "bloodsplatterScale");
    canvas.background.addChild(this.blood);
    canvas.background.BloodSplatter = this;
  }

  Splat(position, scale) {
    let sprite = new PIXI.Sprite.from(
      `modules/combatbooster/bloodsplats/blood${Math.floor(
        Math.random() * 27
      )}.svg`
    );
    sprite.anchor.set(0.5, 0.5);
    sprite.position.set(position.x, position.y);
    sprite.scale.set(scale * this.scaleMulti, scale * this.scaleMulti);
    sprite.alpha = this.alpha;
    sprite.tint = this.color;
    sprite.rotation = Math.random() * Math.PI * 2;
    this.blood.addChild(sprite);
  }

  SplatFromToken(token) {
    this.Splat(
      token.center,
      token.data.scale * Math.max(token.data.width, token.data.height)
    );
  }

  Destroy() {
    this.blood.destroy({ children: true, texture: true });
    canvas.background.BloodSplatter = null;
  }

  Update(){
    this.color = "0x"+game.settings.get("combatbooster", "bloodColor").slice(1,7);
    this.alpha = parseInt(game.settings.get("combatbooster", "bloodColor").slice(7), 16)/255;
    this.scaleMulti = game.settings.get("combatbooster", "bloodsplatterScale");
  }
}

Hooks.on("updateActor", async function (actor, updates) {
  if (!game.settings.get("combatbooster", "enableBloodsplatter")) return;
  let token = actor.parent
    ? canvas.tokens.get(actor.parent.id)
    : canvas.tokens.placeables.find((t) => t.actor.id == actor.id);
  if (
    updates.data?.attributes?.hp?.value != undefined &&
    updates.data?.attributes?.hp?.value <=
      actor.data.data?.attributes?.hp?.value &&
    (100 * updates.data?.attributes?.hp?.value) /
      actor.data.data?.attributes?.hp?.max <=
      game.settings.get("combatbooster", "bloodsplatterThreshold")
  ) {
    if (!canvas.background.BloodSplatter) {
      new BloodSplatter();
      canvas.background.BloodSplatter.SplatFromToken(token);
    } else {
      canvas.background.BloodSplatter.SplatFromToken(token);
    }
  }
});
