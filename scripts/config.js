Hooks.once("init", function () {
    game.settings.register("combatbooster", "markerPath", {
        name: game.i18n.localize("combatbooster.settings.markerPath.name"),
        hint: game.i18n.localize("combatbooster.settings.markerPath.hint"),
        scope: "world",
        config: true,
        type: String,
        default: "modules/combatbooster/markers/believer.png",
        filePicker: true,
        onChange: function () {
            if(canvas.tokens.CBTurnMarker){
                canvas.tokens.CBTurnMarker.Destroy();
            }
        }
      });

      game.settings.register("combatbooster", "markerSpeed", {
        name: game.i18n.localize("combatbooster.settings.markerSpeed.text"),
        hint: game.i18n.localize("combatbooster.settings.markerSpeed.hint"),
        scope: "world",
        config: true,
        type: Number,
        range: {
          min: 0,
          max: 20,
          step: 1,
        },
        default: 10,
        onChange: function () {
            if(canvas.tokens.CBTurnMarker){
                canvas.tokens.CBTurnMarker.Destroy();
            }
        }
      });

      game.settings.register("combatbooster", "markerScale", {
        name: game.i18n.localize("combatbooster.settings.markerScale.text"),
        hint: game.i18n.localize("combatbooster.settings.markerScale.hint"),
        scope: "world",
        config: true,
        type: Number,
        range: {
          min: 1,
          max: 20,
          step: 1,
        },
        default: 7,
        onChange: function () {
            if(canvas.tokens.CBTurnMarker){
                canvas.tokens.CBTurnMarker.Destroy();
            }
        }
      });

      game.settings.register("combatbooster", "markerAlpha", {
        name: game.i18n.localize("combatbooster.settings.markerAlpha.text"),
        hint: game.i18n.localize("combatbooster.settings.markerAlpha.hint"),
        scope: "world",
        config: true,
        type: Number,
        range: {
          min: 0.1,
          max: 1,
          step: 0.1,
        },
        default: 1,
        onChange: function () {
            if(canvas.tokens.CBTurnMarker){
                canvas.tokens.CBTurnMarker.Destroy();
            }
        }
      });



});

