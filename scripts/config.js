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
    default: "modules/combatbooster/markers/tolkien_marker.png",
    filePicker: "imagevideo",
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
      min: 0.1,
      max: 4,
      step: 0.1,
    },
    default: 1,
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

  game.settings.register("combatbooster", "markerAbove", {
    name: game.i18n.localize("combatbooster.settings.markerAbove.name"),
    hint: game.i18n.localize("combatbooster.settings.markerAbove.hint"),
    scope: "world",
    config: true,
    type: Boolean,
    default: false,
    onChange: function () {
      if (canvas.tokens.CBTurnMarker) {
        canvas.tokens.CBTurnMarker.Destroy();
      }
    },
  });

  game.settings.register("combatbooster", "targetAbove", {
    name: game.i18n.localize("combatbooster.settings.targetAbove.name"),
    hint: game.i18n.localize("combatbooster.settings.targetAbove.hint"),
    scope: "world",
    config: true,
    type: Boolean,
    default: false,
    onChange: function () {
      if (canvas.tokens.CBTurnMarker) {
        canvas.tokens.CBTurnMarker.Destroy();
      }
    },
  });

  /***********************
   * COMBAT HUD SETTINGS *
   ***********************/

  if(game.system.id == "dnd5e"){

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
  }

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
    default: false,
  });

  game.settings.register("combatbooster", "panCamera", {
    name: game.i18n.localize("combatbooster.settings.panCamera.text"),
    hint: game.i18n.localize("combatbooster.settings.panCamera.hint"),
    scope: "world",
    config: true,
    type: Boolean,
    default: false,
  });

  game.settings.register("combatbooster", "controlToken", {
    name: game.i18n.localize("combatbooster.settings.controlToken.text"),
    hint: game.i18n.localize("combatbooster.settings.controlToken.hint"),
    scope: "world",
    config: true,
    type: Boolean,
    default: false,
  });

  game.settings.register("combatbooster", "renderTokenHUD", {
    name: game.i18n.localize("combatbooster.settings.renderTokenHUD.text"),
    hint: game.i18n.localize("combatbooster.settings.renderTokenHUD.hint"),
    scope: "world",
    config: true,
    type: Boolean,
    default: false,
  });

  game.settings.register("combatbooster", "soundPath", {
    name: game.i18n.localize("combatbooster.settings.soundPath.name"),
    hint: game.i18n.localize("combatbooster.settings.soundPath.hint"),
    scope: "world",
    config: true,
    type: String,
    default: "",
    filePicker: "audio",
  });

  game.settings.register("combatbooster", "soundVolume", {
    name: game.i18n.localize("combatbooster.settings.soundVolume.text"),
    hint: game.i18n.localize("combatbooster.settings.soundVolume.hint"),
    scope: "world",
    config: true,
    type: Number,
    range: {
      min: 0,
      max: 1,
      step: 0.1,

    },
    default: 0.4,
  });

  game.settings.register("combatbooster", "displayNotification", {
    name: game.i18n.localize("combatbooster.settings.displayNotification.text"),
    hint: game.i18n.localize("combatbooster.settings.displayNotification.hint"),
    scope: "world",
    config: true,
    type: Boolean,
    default: false,
  });

  game.settings.register("combatbooster", "currentHp", {
    name: game.i18n.localize("combatbooster.settings.currentHp.text"),
    hint: game.i18n.localize("combatbooster.settings.currentHp.hint"),
    scope: "world",
    config: true,
    type: String,
    default: "data.attributes.hp.value",
  });

  game.settings.register("combatbooster", "maxHp", {
    name: game.i18n.localize("combatbooster.settings.maxHp.text"),
    hint: game.i18n.localize("combatbooster.settings.maxHp.hint"),
    scope: "world",
    config: true,
    type: String,
    default: "data.attributes.hp.max",
  });

});
