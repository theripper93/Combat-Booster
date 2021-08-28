class TurnMarker {
  constructor() {
    this.token;
    this.container = new PIXI.Container();
    this.container.name = "CBTurnMarker";
    this.container.zIndex = game.settings.get("combatbooster", "markerAbove") ? 1000:-1;
    this.img = game.settings.get("combatbooster", "markerPath");
    this.speed = game.settings.get("combatbooster", "markerSpeed") / 10;
    this.scale = game.settings.get("combatbooster", "markerScale");
    this.alpha = game.settings.get("combatbooster", "markerAlpha");
    let video = this.img.endsWith("webm")
      ? document.createElement("video")
      : null;
    if (video) {
      video.src = this.img;
      video.loop = true;
    }
    this.sprite = new PIXI.Sprite.from(video ?? this.img);
    this.sprite.alpha = this.alpha;
    this.sprite.width=400
    this.sprite.height=400
    this.baseScale = this.sprite.scale.x
    this.sprite.anchor.set(0.5, 0.5);
    this.container.addChild(this.sprite);
    Object.defineProperty(this.container, "visible", {
      get() {
        return game.combat?.started;
      },
    });
    let _this = this;
    function Animate() {
      if (_this.sprite._destroyed || !_this.sprite) {
        canvas.app.ticker.remove(Animate);
        if (!_this.sprite.reallyDestroy) new TurnMarker();
      } else {
        if (_this.container.visible)
          _this.sprite.rotation += 0.01 * _this.speed;
      }
    }
    canvas.tokens.CBTurnMarker = this;
    canvas.app.ticker.add(Animate);
    this.MoveToCombatant();
  }
  Move(token) {
    this.token = token;
    if (!token) return;
    token.addChild(this.container);
    this.Update();
  }

  Destroy(reallyDestroy) {
    if (this.token) {
      let child = this.token.children.find((c) => c.name === "CBTurnMarker");
      this.token.removeChild(child);
    }
    this.sprite.reallyDestroy = reallyDestroy;
    this.sprite.destroy();
    this.container.destroy();
    canvas.tokens.CBTurnMarker = null;
  }

  Update() {
    if (this.container._destroyed) return;
    this.container.x = this.token.w / 2;
    this.container.y = this.token.h / 2;
    this.token.sortableChildren = true;
    this.sprite.width = canvas.dimensions.size * 1.4 * this.scale * this.tokenScale
    this.sprite.height = canvas.dimensions.size * 1.4 * this.scale * this.tokenScale
  }

  MoveToCombatant() {
    const token = canvas.tokens.get(game.combat?.combatant?.token?.id);
    if (token && this.id !== token.id) {
      this.Move(token);
    } else if (!token) {
      this.Destroy(true);
    }
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
