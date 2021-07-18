class BloodSplatter {
  constructor() {
    this.blood = new PIXI.Container();
    this.blood.name = "blood";
    const colorData = this.ColorStringToHexAlpha(
      game.settings.get("combatbooster", "bloodColor")
    );
    this.color = colorData?.color;
    this.alpha = colorData?.alpha;
    this.bloodSheet = game.settings.get("combatbooster", "useBloodsheet");
    this.bloodSheetData = game.settings.get("combatbooster", "BloodSheetData");
    this.scaleMulti =
      (canvas.dimensions.size / 100) *
      game.settings.get("combatbooster", "bloodsplatterScale");
    canvas.background.addChild(this.blood);
    canvas.background.BloodSplatter = this;
  }

  Splat(position, scale, color, alpha) {
    let scaleRandom = 0.8 + Math.random() * 0.4;
    let sprite = new PIXI.Sprite.from(
      `modules/combatbooster/bloodsplats/blood${Math.floor(
        Math.random() * 26
      )}.svg`
    );
    sprite.anchor.set(0.5, 0.5);
    sprite.position.set(position.x, position.y);
    sprite.scale.set(
      scale * this.scaleMulti * scaleRandom,
      scale * this.scaleMulti * scaleRandom
    );
    sprite.alpha = alpha ?? this.alpha;
    sprite.tint = color || this.color;
    sprite.rotation = Math.random() * Math.PI * 2;
    this.blood.addChild(sprite);
  }

  SplatFromToken(token, extraScale = 1) {
    const colorFlag = token.data.flags.combatbooster?.bloodColor;
    let colorData = {};
    if (!colorFlag && this.bloodSheet) {
      const creatureType = this.creatureType(token);
      colorData = this.ColorStringToHexAlpha(this.bloodSheetData[creatureType]);
    }
    if (colorFlag) {
      colorData = this.ColorStringToHexAlpha(colorFlag);
    }
    this.Splat(
      token.center,
      token.data.scale *
        Math.max(token.data.width, token.data.height) *
        extraScale,
      colorData?.color,
      colorData?.alpha
    );
  }

  Destroy() {
    this.blood.destroy({ children: true, texture: true });
    canvas.background.BloodSplatter = null;
  }

  Update() {
    const colorData = this.ColorStringToHexAlpha(
      game.settings.get("combatbooster", "bloodColor")
    );
    this.color = colorData?.color;
    this.alpha = colorData?.alpha;
    this.bloodSheet = game.settings.get("combatbooster", "useBloodsheet");
    this.bloodSheetData = game.settings.get("combatbooster", "BloodSheetData");
    this.scaleMulti = game.settings.get("combatbooster", "bloodsplatterScale");
  }

  ColorStringToHexAlpha(colorString) {
    if (!colorString) return undefined;
    const color = "0x" + colorString.slice(1, 7);
    const alpha = parseInt(colorString.slice(7), 16) / 255;
    return { color: color, alpha: alpha };
  }

  creatureType(token) {
    return (
      CombatBooster.getCreatureTypeCustom(token.actor.data) ||
      CombatBooster.getCreatureType(token.actor.data)
    );
  }

  static socketSplatFn(tokenIds) {
    for (let tokenId of tokenIds) {
      let token = canvas.tokens.get(tokenId);
      if (!token) return;
      if (canvas.background.BloodSplatter) {
        canvas.background.BloodSplatter.SplatFromToken(token);
      } else {
        new BloodSplatter();
        canvas.background.BloodSplatter.SplatFromToken(token);
      }
    }
  }

  static socketSplat(tokens) {
    let tokenIds = tokens.map((token) => token.id);
    BloodSplatterSocket.executeForEveryone("Splat", tokenIds);
  }

  static bloodTrail(wrapped, ...args) {
    if (!this.bleeding) {
      this.bleeding = true;
      setTimeout(() => {
        if (canvas.background.BloodSplatter) {
          canvas.background.BloodSplatter.SplatFromToken(this,Math.random()*0.5);
        } else {
          new BloodSplatter();
          canvas.background.BloodSplatter.SplatFromToken(this,Math.random()*0.5);
        }
        this.bleeding = false;
      }, 100);
    }
    return wrapped(...args);
  }
}

let BloodSplatterSocket;

Hooks.once("socketlib.ready", () => {
  BloodSplatterSocket = socketlib.registerModule("combatbooster");
  BloodSplatterSocket.register("Splat", BloodSplatter.socketSplatFn);
});

Hooks.on("updateActor", async function (actor, updates) {
  if (!game.settings.get("combatbooster", "enableBloodsplatter")) return;
  let token = actor.parent
    ? canvas.tokens.get(actor.parent.id)
    : canvas.tokens.placeables.find((t) => t.actor.id == actor.id);
  const hpMax = CombatBooster.getHpMax(actor.data);
  const oldHpVal = CombatBooster.getHpVal(actor.data);
  const hpVal = CombatBooster.getHpVal(updates);
  if (
    hpVal != undefined &&
    hpVal <= oldHpVal &&
    (100 * hpVal) / hpMax <=
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
    .tools.push(
      {
        name: "splatToken",
        title: game.i18n.localize("combatbooster.controls.splatToken.name"),
        icon: "fas fa-tint",
        button: true,
        visible:
          game.user.isGM &&
          game.settings.get("combatbooster", "enableBloodsplatter"),
        onClick: () => {
          if (!canvas.tokens.controlled[0]) {
            ui.notifications.warn(
              game.i18n.localize("combatbooster.controls.splatToken.warn")
            );
          } else {
            BloodSplatter.socketSplat(canvas.tokens.controlled);
          }
        },
      },
      {
        name: "clearBlood",
        title: game.i18n.localize("combatbooster.controls.clearBlood.name"),
        icon: "fas fa-tint-slash",
        button: true,
        visible: game.settings.get("combatbooster", "enableBloodsplatter"),
        onClick: () => {
          if (canvas.background.BloodSplatter)
            canvas.background.BloodSplatter.Destroy();
        },
      }
    );
});

Hooks.on("canvasReady", function () {
  if (canvas.background.BloodSplatter)
    canvas.background.BloodSplatter.Destroy();
});
