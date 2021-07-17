class BloodSplatter {
  constructor() {
    this.blood = new PIXI.Container();
    this.blood.name = "blood";
    const {color, alpha} = this.ColorStringToHexAlpha(game.settings.get("combatbooster", "bloodColor"))
    this.color = color
    this.alpha = alpha
    this.bloodSheet = game.settings.get("combatbooster", "useBloodsheet");
    this.scaleMulti = game.settings.get("combatbooster", "bloodsplatterScale");
    canvas.background.addChild(this.blood);
    canvas.background.BloodSplatter = this;
  }

  Splat(position, scale, color,alpha) {
    let scaleRandom = 0.8+Math.random()*0.4
    let sprite = new PIXI.Sprite.from(
      `modules/combatbooster/bloodsplats/blood${Math.floor(
        Math.random() * 27
      )}.svg`
    );
    sprite.anchor.set(0.5, 0.5);
    sprite.position.set(position.x, position.y);
    sprite.scale.set(scale * this.scaleMulti*scaleRandom, scale * this.scaleMulti*scaleRandom);
    sprite.alpha = alpha ?? this.alpha;
    sprite.tint = color || this.color;
    sprite.rotation = Math.random() * Math.PI * 2;
    this.blood.addChild(sprite);
  }

  SplatFromToken(token) {
    const colorFlag = token.data.flags.combatbooster?.bloodColor
    let colorData = {}
    if(!colorFlag && this.bloodSheet){
      const creatureType = token.actor?.data?.data?.details?.type?.custom || token.actor?.data?.data?.details?.type?.value
      colorData = this.ColorStringToHexAlpha(BloodSheet[creatureType])
    }
    if(colorFlag){
      colorData = this.ColorStringToHexAlpha(colorFlag)
    }
    this.Splat(
      token.center,
      token.data.scale * Math.max(token.data.width, token.data.height),
      colorData?.color,
      colorData?.alpha
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

  ColorStringToHexAlpha(colorString){
    if(!colorString) return undefined;
    const color = "0x"+colorString.slice(1,7);
    const alpha = parseInt(colorString.slice(7), 16)/255;
    return {color:color, alpha:alpha};
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

Hooks.on("getSceneControlButtons", (controls, b, c) => {
  controls
    .find((c) => c.name == "token")
    .tools.push({
      name: "clearBlood",
      title: game.i18n.localize("combatbooster.controls.clearBlood.name"),
      icon: "fas fa-tint-slash",
      button:true,
      visible: game.user.isGM,
      onClick: () => {
        if(canvas.background.BloodSplatter)canvas.background.BloodSplatter.Destroy();
      },
    });
});