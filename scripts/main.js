const COMBAT_BOOSTER_MODULE_NAME = "combatbooster";

/***************
 * TURN MARKER *
 ***************/

//icons permission jinker, brimcon Wassily hobolyra cefasheli 
//no permissions Rin 

Hooks.on("canvasReady", function () {
  if (game.settings.get("combatbooster", "enableMarker")) {
    new TurnMarker();
    Hooks.once("renderCombatTracker", function () {
      if(canvas.tokens.CBTurnMarker && !canvas.tokens.CBTurnMarker.token)
      canvas.tokens.CBTurnMarker.MoveToCombatant()
    })
  }
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

Hooks.on("getSwadeCombatTrackerEntryContext", function () {
  if (game.settings.get("combatbooster", "enableMarker")) {
    if (!canvas.tokens.CBTurnMarker) {
      new TurnMarker();
    } else {
      canvas.tokens.CBTurnMarker.MoveToCombatant();
    }
  }
});