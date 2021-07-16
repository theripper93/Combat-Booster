Hooks.once("init", function () {
  /*******************
   * MARKER SETTINGS *
   *******************/

  game.settings.register("combatbooster", "enableMarker", {
    name: game.i18n.localize("combatbooster.settings.enableMarker.text"),
    hint: game.i18n.localize("combatbooster.settings.enableMarker.hint"),
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
    onChange: function (sett) {
      if (canvas.tokens.CBTurnMarker) {
        canvas.tokens.CBTurnMarker.Destroy(!sett);
      }
      if(sett){
        new TurnMarker();
      }
    },
  });

  game.settings.register("combatbooster", "markerPath", {
    name: game.i18n.localize("combatbooster.settings.markerPath.name"),
    hint: game.i18n.localize("combatbooster.settings.markerPath.hint"),
    scope: "world",
    config: true,
    type: String,
    default: "modules/combatbooster/markers/believer.png",
    filePicker: true,
    onChange: function () {
      if (canvas.tokens.CBTurnMarker) {
        canvas.tokens.CBTurnMarker.Destroy();
      }
    },
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
      if (canvas.tokens.CBTurnMarker) {
        canvas.tokens.CBTurnMarker.Destroy();
      }
    },
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
      if (canvas.tokens.CBTurnMarker) {
        canvas.tokens.CBTurnMarker.Destroy();
      }
    },
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
      if (canvas.tokens.CBTurnMarker) {
        canvas.tokens.CBTurnMarker.Destroy();
      }
    },
  });

  /***********************
   * COMBAT HUD SETTINGS *
   ***********************/

  game.settings.register("combatbooster", "enableHud", {
    name: game.i18n.localize("combatbooster.settings.enableHud.text"),
    hint: game.i18n.localize("combatbooster.settings.enableHud.hint"),
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
  });

  game.settings.register("combatbooster", "hudRecent", {
    name: game.i18n.localize("combatbooster.settings.hudRecent.text"),
    hint: game.i18n.localize("combatbooster.settings.hudRecent.hint"),
    scope: "world",
    config: true,
    type: Number,
    range: {
      min: 1,
      max: 20,
      step: 1,
    },
    default: 4,
  });

  game.settings.register("combatbooster", "hudMaxCol", {
    name: game.i18n.localize("combatbooster.settings.hudMaxCol.text"),
    hint: game.i18n.localize("combatbooster.settings.hudMaxCol.hint"),
    scope: "world",
    config: true,
    type: Number,
    range: {
      min: 0,
      max: 20,
      step: 1,
    },
    default: 4,
  });

  /*****************
   * MISC SETTINGS *
   *****************/

  game.settings.register("combatbooster", "markDefeated", {
    name: game.i18n.localize("combatbooster.settings.markDefeated.text"),
    hint: game.i18n.localize("combatbooster.settings.markDefeated.hint"),
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
  });

  game.settings.register("combatbooster", "moveToPile", {
    name: game.i18n.localize("combatbooster.settings.moveToPile.text"),
    hint: game.i18n.localize("combatbooster.settings.moveToPile.hint"),
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
  });
});
