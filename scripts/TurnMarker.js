class TurnMarker {
  constructor() {
    this.token;
    this.container = new PIXI.Container();
    this.container.name = "CBTurnMarker";
    this.container.zIndex = -1;
    this.img = game.settings.get("combatbooster", "markerPath");
    this.speed = game.settings.get("combatbooster", "markerSpeed")/10;
    this.scale = game.settings.get("combatbooster", "markerScale")/10;
    this.alpha = game.settings.get("combatbooster", "markerAlpha");
    this.sprite = new PIXI.Sprite.from(this.img);
    this.sprite.alpha = this.alpha;
    this.sprite.anchor.set(0.5, 0.5);
    this.container.addChild(this.sprite);
    Object.defineProperty(this.container, "visible", {
      get() {
        return game.combat?.started;
      },
    });
    let _this = this;
    function Animate() {
      if (_this.sprite._destroyed) {
        canvas.app.ticker.remove(Animate);
        new TurnMarker(_this.token, _this.img, _this.speed, _this.scale);
      } else {
        if (_this.container.visible) _this.sprite.rotation += 0.01 * _this.speed;
      }
    }
    canvas.tokens.CBTurnMarker = this;
    canvas.app.ticker.add(Animate);
    if (game.combat?.combatant?._token?._id) {
      this.Move(canvas.tokens.get(game.combat.combatant._token._id));
    }
  }
  Move(token) {
    this.token = token;
    token.addChild(this.container);
    this.Update();
  }

  Destroy() {
    let child = this.token.children.find(c=> c.name === "CBTurnMarker")
    this.token.removeChild(child);
    this.sprite.destroy();
    this.container.destroy();
    canvas.tokens.CBTurnMarker = null;
  }

  Update() {
    this.container.x = this.token.w / 2;
    this.container.y = this.token.h / 2;
    this.token.sortableChildren = true;
    this.sprite.scale.set(
      0.2 * this.scale * this.tokenScale,
      0.2 * this.scale * this.tokenScale
    );
  }

  MoveToCombatant() {
    const combatant = canvas.tokens.get(game.combat?.combatant?._token?._id);
    if (combatant && this.id !== combatant.id) this.Move(combatant);
  }

  get tokenScale() {
    return (
      Math.max(this.token.data.width, this.token.data.height) *
      this.token.data.scale
    );
  }
  get tokenId() {
    return this.token?.id;
  }
}
