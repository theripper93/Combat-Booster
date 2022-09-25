const COMBAT_BOOSTER_MODULE_NAME = "combatbooster";

/***************
 * TURN MARKER *
 ***************/

//icons permission jinker, brimcon Wassily hobolyra cefasheli 
//no permissions Rin 

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
      if(canvas.tokens.CBTurnMarker && !canvas.tokens.CBTurnMarker.token)
      canvas.tokens.CBTurnMarker.MoveToCombatant()
      canvas.tokens.CBNextTurnMarker?.MoveToCombatant()
    })
  }
});

Hooks.on("updateCombat", function () {
  if (game.settings.get("combatbooster", "enableMarker")) {
    if (!canvas.tokens.CBTurnMarker) {
      new TurnMarker();
      if (game.settings.get("combatbooster", "enableNextMarker")) {
        new NextTurnMarker();
      }
    } else {
      canvas.tokens.CBTurnMarker.MoveToCombatant();
      canvas.tokens.CBNextTurnMarker?.MoveToCombatant()
    }
  }
});

Hooks.on("updateToken", function (token, updates) {
  if (token.id === canvas.tokens.CBTurnMarker?.token?.id) {
    if ("texture" in updates) {
      canvas.tokens.CBTurnMarker.Update();
      canvas.tokens.CBNextTurnMarker?.Update()
      canvas.tokens.CBStartTurnMarker?.Update()
    }
  }
});

Hooks.on("combatTurn", () => {
  Hooks.once("updateCombat", () => {
    canvas.tokens.CBStartTurnMarker?.MoveToCombatant()
  });
})
Hooks.on("combatRound", () => {
  Hooks.once("updateCombat", () => {
    canvas.tokens.CBStartTurnMarker?.MoveToCombatant()
  });
})
 
Hooks.on("getSwadeCombatTrackerEntryContext", function () {
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
      canvas.tokens.CBNextTurnMarker?.MoveToCombatant()
    }
  }
});