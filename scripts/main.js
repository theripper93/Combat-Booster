const COMBAT_BOOSTER_MODULE_NAME = "combatbooster";

/***************
 * TURN MARKER *
 ***************/

Hooks.on("canvasReady", function () {
  if (game.settings.get("combatbooster", "enableMarker")) new TurnMarker();
});

Hooks.on("updateCombat", function () {
  if (game.settings.get("combatbooster", "enableMarker")) {
    if (!canvas.tokens.CBTurnMarker) {
      new TurnMarker();
    } else {
      canvas.tokens.CBTurnMarker.MoveToCombatant();
    }
  }
});

Hooks.on("updateToken", function (token, updates) {
  if (token.id === canvas.tokens.CBTurnMarker?.token?.id) {
    if ("scale" in updates) {
      canvas.tokens.CBTurnMarker.Update();
    }
  }
});
