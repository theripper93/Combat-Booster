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


/**************************
 * BLOODSPLATTER SETTINGS *
 **************************/

  game.settings.register("combatbooster", "enableBloodsplatter", {
    name: game.i18n.localize("combatbooster.settings.enableBloodsplatter.text"),
    hint: game.i18n.localize("combatbooster.settings.enableBloodsplatter.hint"),
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
    onChange: function (sett) {
      if (!sett && canvas.background.BloodSplatter) {
        canvas.background.BloodSplatter.Destroy();
      }
    }
  });

  game.settings.register("combatbooster", "enableBloodTrail", {
    name: game.i18n.localize("combatbooster.settings.enableBloodTrail.text"),
    hint: game.i18n.localize("combatbooster.settings.enableBloodTrail.hint"),
    scope: "world",
    config: true,
    type: Boolean,
    default: false,
    onChange: function (sett) {
      if(sett){
        libWrapper.register(
          "combatbooster",
          "Token.prototype._onMovementFrame",
          BloodSplatter.bloodTrail
        );
      }else{
        libWrapper.unregister("combatbooster", "Token.prototype._onMovementFrame", false)
      }
    }
  });

  if(game.settings.get("combatbooster", "enableBloodTrail")===true){
    libWrapper.register(
    "combatbooster",
    "Token.prototype._onMovementFrame",
    BloodSplatter.bloodTrail
  );
}

  game.settings.register("combatbooster", "useBloodsheet", {
    name: game.i18n.localize("combatbooster.settings.useBloodsheet.text"),
    hint: game.i18n.localize("combatbooster.settings.useBloodsheet.hint"),
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
    onChange: function () {
      if (canvas.background.BloodSplatter) {
        canvas.background.BloodSplatter.Update();
      }
    }
  });

  game.settings.register("combatbooster", "bloodsplatterThreshold", {
    name: game.i18n.localize("combatbooster.settings.bloodsplatterThreshold.text"),
    hint: game.i18n.localize("combatbooster.settings.bloodsplatterThreshold.hint"),
    scope: "world",
    config: true,
    type: Number,
    range: {
      min: 0,
      max: 100,
      step: 1,

    },
    default: 0,
    onChange: function () {
      if (canvas.background.BloodSplatter) {
        canvas.background.BloodSplatter.Update();
      }
    }
  });

  game.settings.register("combatbooster", "bloodsplatterScale", {
    name: game.i18n.localize("combatbooster.settings.bloodsplatterScale.text"),
    hint: game.i18n.localize("combatbooster.settings.bloodsplatterScale.hint"),
    scope: "world",
    config: true,
    type: Number,
    range: {
      min: 0.1,
      max: 2,
      step: 0.1,

    },
    default: 0.5,
    onChange: function () {
      if (canvas.background.BloodSplatter) {
        canvas.background.BloodSplatter.Update();
      }
    }
  });

  game.settings.register("combatbooster", "creatureType", {
    name: game.i18n.localize("combatbooster.settings.creatureType.text"),
    hint: game.i18n.localize("combatbooster.settings.creatureType.hint"),
    scope: "world",
    config: true,
    type: String,
    default: "data.details.type.value",
  });

  game.settings.register("combatbooster", "creatureTypeCustom", {
    name: game.i18n.localize("combatbooster.settings.creatureTypeCustom.text"),
    hint: game.i18n.localize("combatbooster.settings.creatureTypeCustom.hint"),
    scope: "world",
    config: true,
    type: String,
    default: "data.details.type.custom",
  });

  game.settings.register("combatbooster", "BloodSheetData", {
    name: "",
    hint: "",
    scope: "world",
    config: false,
    type: Object,
    default: BloodSheet,
    onChange: function () {
      if (canvas.background.BloodSplatter) {
        canvas.background.BloodSplatter.Update();
      }
    }
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
    filePicker: true,
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

Hooks.once("ready", function () {
  new window.Ardittristan.ColorSetting("combatbooster", "bloodColor", {
    name: game.i18n.localize("combatbooster.settings.bloodColor.text"),
    hint: game.i18n.localize("combatbooster.settings.bloodColor.hint"),
    label: game.i18n.localize("combatbooster.settings.bloodColor.label"),
    restricted: true,
    defaultColor: "#a51414d8",
    scope: "world",
    onChange: function () {
      if (canvas.background.Bloodsplatter) {
        canvas.background.Bloodsplatter.Update();
      }
    }
  });
  })

  Hooks.on("renderTokenConfig", (app, html, data) => {
    let bloodColor = app.object.getFlag("combatbooster", "bloodColor") || "";
    let newHtml = `<div class="form-group">
    <label>${game.i18n.localize("combatbooster.tokenconfig.bloodColor.name")}</label>
    <input type="text" name="flags.combatbooster.bloodColor" is="colorpicker-input" data-responsive-color value="${bloodColor}">
  </div> `;
    const tinthtml = html.find('input[name="tint"]');
    const formGroup = tinthtml.closest(".form-group");
    formGroup.after(newHtml);
    app.setPosition({ height: "auto" });
  });
