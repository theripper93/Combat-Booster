const COMBAT_BOOSTER_MODULE_NAME = "combatbooster";

/***************
 * TURN MARKER *
 ***************/

//icons permission jinker, brimcon Wassily hobolyra cefasheli
//no permissions Rin

function regenerateMarkers() {
  if (!game.combat?.started) return;
  if (!game.settings.get("combatbooster", "enableMarker")) return;
  if (!canvas.tokens.CBTurnMarker) new TurnMarker();
  if (
    !canvas.tokens.CBStartTurnMarker &&
    game.settings.get("combatbooster", "enableStartMarker")
  )
    new StartTurnMarker();
  if (
    !canvas.tokens.CBNextTurnMarker &&
    game.settings.get("combatbooster", "enableNextMarker")
  )
    new NextTurnMarker();
  canvas.tokens.CBTurnMarker?.MoveToCombatant();
  canvas.tokens.CBStartTurnMarker?.MoveToCombatant();
  canvas.tokens.CBNextTurnMarker?.MoveToCombatant();
}

Hooks.on("canvasReady", function () {
  if (game.settings.get("combatbooster", "enableMarker")) {
    new TurnMarker();

    if (game.settings.get("combatbooster", "enableStartMarker")) {
      new StartTurnMarker();
    }
    if (game.settings.get("combatbooster", "enableNextMarker")) {
      new NextTurnMarker();
    }
    Hooks.once("renderCombatTracker", function () {
      regenerateMarkers();
      if (canvas.tokens.CBTurnMarker && !canvas.tokens.CBTurnMarker.token)
        canvas.tokens.CBTurnMarker.MoveToCombatant();
      canvas.tokens.CBNextTurnMarker?.MoveToCombatant();
    });
  }
});

Hooks.once("ready", () => {
  if (game.user.isGM && game.settings.get("combatbooster", "enableMarker") && game.settings.get("core", "combatTrackerConfig")?.turnMarker?.enabled) {
    const sett = game.settings.get("core", "combatTrackerConfig");
    sett.turnMarker.enabled = false;
    game.settings.set("core", "combatTrackerConfig", sett);
    ui.notifications.warn(game.i18n.localize("combatbooster.coreMarker"), { permanent: true });
  }
});

Hooks.on("updateCombat", function () {
  regenerateMarkers();
});

Hooks.on("updateToken", function (token, updates) {
  if (token.id === canvas.tokens.CBTurnMarker?.token?.id) {
    if ("texture" in updates || "width" in updates || "height" in updates) {
      canvas.tokens.CBTurnMarker.Update();
      canvas.tokens.CBNextTurnMarker?.Update();
      canvas.tokens.CBStartTurnMarker?.Update();
    }
  }
});

Hooks.on("deleteToken", (token) => {
  regenerateMarkers();
});

Hooks.on("combatTurn", () => {
  Hooks.once("updateCombat", () => {
    canvas.tokens.CBStartTurnMarker?.MoveToCombatant();
    canvas.tokens.CBNextTurnMarker?.MoveToCombatant();
  });
});
Hooks.on("combatRound", () => {
  Hooks.once("updateCombat", () => {
    canvas.tokens.CBStartTurnMarker?.MoveToCombatant();
    canvas.tokens.CBNextTurnMarker?.MoveToCombatant();
  });
});

Hooks.on("getSwadeCombatTrackerEntryContext", function () {
  try {
    if (game.settings.get("combatbooster", "enableMarker")) {
      if (!canvas.tokens.CBTurnMarker) {
        new TurnMarker();
        if (game.settings.get("combatbooster", "enableNextMarker")) {
          new NextTurnMarker();
        }
        if (game.settings.get("combatbooster", "enableStartMarker")) {
          new StartTurnMarker();
        }
      } else {
        canvas.tokens.CBTurnMarker.MoveToCombatant();
        canvas.tokens.CBNextTurnMarker?.MoveToCombatant();
      }
    }
  } catch (error) {}
});
