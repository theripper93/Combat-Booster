class TurnMarker {
    constructor() {
        if (canvas.tokens[this.containerName] && !canvas.tokens[this.containerName].container.destroyed) canvas.tokens[this.containerName].Destroy(true);
        this.token;
        this.container = new PIXI.Container();
        if (this.filter) this.container.filters = [this.filter];
        this.markerAbove = game.settings.get("combatbooster", "markerAbove");
        this.targetAbove = false;
        this.img = this.markerImg;
        this.speed = game.settings.get("combatbooster", "markerSpeed") / 10;
        this.scale = game.settings.get("combatbooster", "markerScale");
        this.alpha = game.settings.get("combatbooster", "markerAlpha");
        this.ignoreScale = game.settings.get("combatbooster", "markerIgnoreScale");
        let video = this.img.endsWith("webm") ? document.createElement("video") : null;
        if (video) {
            video.muted = true;
            video.src = this.img;
            video.loop = true;
            video.muted = true;
        }
        this.sprite = PIXI.Sprite.from(video ?? this.img);
        this.sprite.alpha = this.alpha;
        this.sprite.width = 400;
        this.sprite.height = 400;
        this.baseScale = this.sprite.scale.x;
        this.sprite.anchor.set(0.5, 0.5);
        this.container.addChild(this.sprite);
        Object.defineProperty(this.container, "visible", {
            get() {
                return game.combat?.started;
            },
        });
        this.setGlobal();
        this.setAnimation();
        this.MoveToCombatant();
    }

    setAnimation() {
        let _this = this;
        function Animate(dt) {
            if (_this.sprite._destroyed || !_this.sprite) {
                canvas.app.ticker.remove(Animate);
                if (!_this.sprite.reallyDestroy) new _this.TM_Class();
            } else {
                if (_this.container.visible) {
                    _this.sprite.rotation += 0.01 * _this.speed * dt;
                }
            }
        }
        canvas.app.ticker.add(Animate);
    }

    get filter() {}

    get markerImg() {
        return game.settings.get("combatbooster", "markerPath");
    }

    get TM_Class() {
        return TurnMarker;
    }

    get containerName() {
        return "CBTurnMarker";
    }

    setGlobal() {
        this.container.name = this.containerName;
        canvas.tokens.CBTurnMarker = this;
    }

    Move(token) {
        this.token = token;
        if (!token) return;
        this.markerAbove ? token.addChild(this.container) : token.addChildAt(this.container, 0);
        this.Update();
    }

    Destroy(reallyDestroy) {
        if (this.token) {
            let child = this.token.children.find((c) => c.name === this.containerName);
            this.token.removeChild(child);
        }
        this.sprite.reallyDestroy = reallyDestroy;
        this.sprite.destroy();
        this.container.destroy();
        canvas.tokens[this.containerName] = null;
    }

    Update() {
        if (this.container._destroyed) return;
        this.container.x = this.token.w / 2;
        this.container.y = this.token.h / 2;
        this.sprite.width = canvas.dimensions.size * 1.4 * this.scale * this.tokenScale;
        this.sprite.height = canvas.dimensions.size * 1.4 * this.scale * this.tokenScale;
    }

    MoveToCombatant() {
        if (this.container.destroyed) return;
        const token = canvas.tokens.get(game.combat?.combatant?.token?.id);
        if (token && this.id !== token.id) {
            this.Move(token);
        } else if (!token) {
            this.Destroy(true);
        }
    }

    get tokenScale() {
        if (this.ignoreScale) {
            return Math.max(this.token.document.width, this.token.document.height);
        } else {
            return Math.max(this.token.document.width, this.token.document.height) * ((Math.abs(this.token.document.texture.scaleX) + Math.abs(this.token.document.texture.scaleY)) / 2);
        }
    }
    get tokenId() {
        return this.token?.id;
    }
}

class NextTurnMarker extends TurnMarker {
    constructor() {
        super();
        this.container.alpha = 0.5;
    }

    setGlobal() {
        this.container.name = this.containerName;
        canvas.tokens.CBNextTurnMarker = this;
    }

    get filter() {
        const colormatrix = new PIXI.filters.ColorMatrixFilter();
        colormatrix.sepia();
        return colormatrix;
    }

    get containerName() {
        return "CBNextTurnMarker";
    }

    get TM_Class() {
        return NextTurnMarker;
    }
    MoveToCombatant() {
        if (this.container.destroyed) return;
        const combat = game.combat;
        if (!combat) return this.Destroy(true);

        const skip = combat.settings.skipDefeated;
        let next = null;
        const turn = combat.turn ?? -1;
        const combatantsCount = combat.turns.length;
        const doubleCombatantsArray = [...combat.turns, ...combat.turns];
        if (skip) {
            for (let i = turn + 1; i < combatantsCount * 2; i++) {
                if (!doubleCombatantsArray[i].defeated) {
                    next = i;
                    break;
                }
            }
        } else {
            next = turn + 1;
        }

        next = next % combatantsCount;

        const token = combat.turns[next]?.token?.object;
        if (token && this.id !== token.id) {
            this.Move(token);
        } else if (!token) {
            this.Destroy(true);
        }
    }
}

class StartTurnMarker extends TurnMarker {
    constructor() {
        super();
        if (this.container.destroyed) return;
        this.container.alpha = 0.5;
        this._visible = false;
        const _this = this;
        this._currentPosition = { x: 0, y: 0 };
        Object.defineProperty(this.container, "visible", {
            get() {
                return game.combat?.started && (_this._visible || this.token?.isOwner);
            },
        });
    }

    get markerImg() {
        return game.settings.get("combatbooster", "startMarkerPath");
    }

    setGlobal() {
        this.container.name = this.containerName;
        canvas.tokens.CBStartTurnMarker = this;
    }

    setAnimation() {
        let _this = this;
        function Animate() {
            if (_this.sprite._destroyed || !_this.sprite) {
                canvas.app.ticker.remove(Animate);
                if (!_this.sprite.reallyDestroy) new _this.TM_Class();
            }
        }
        canvas.app.ticker.add(Animate);
    }

    Move(token) {
        this.token = token;
        if (!token) return;
        canvas.primary.addChild(this.container);
        this.Update();
        this.container.x = token.center.x;
        this.container.y = token.center.y;
        this._currentPosition = { x: token.center.x, y: token.center.y };
        this._visible = token.isVisible;
    }

    Update() {
        super.Update();
        canvas.primary.addChild(this.container);
        if (this._currentPosition) {
            this.container.x = this._currentPosition.x;
            this.container.y = this._currentPosition.y;
        }
    }

    get containerName() {
        return "CBStartTurnMarker";
    }

    get TM_Class() {
        return NextTurnMarker;
    }

    MoveToCombatant() {
        const token = canvas.tokens.get(game.combat?.combatant?.token?.id);
        if (token && this.id !== token.id) {
            this.Move(token);
        } else if (!token) {
            this.Destroy(true);
        }
    }
}
