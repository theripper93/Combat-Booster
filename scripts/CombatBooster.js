class CombatBooster{
  static getHpVal(actorData){
    return Object.byString(actorData.system, game.settings.get("combatbooster", "currentHp"))
  }
}
Hooks.on("updateActor", async function (actor, updates) {
  try {
    if (game.combat?.started && game.user.isGM && !actor.hasPlayerOwner) {
        let token = actor.parent ? canvas.tokens.get(actor.parent.id) : canvas.tokens.placeables.find((t) => t?.actor?.id == actor?.id);
        if (!token) return;
        if (CombatBooster.getHpVal(updates) === 0) {
            for (let combatant of game.combat.combatants) {
                if (combatant.token?.id === token.id) {
                    if (game.settings.get("combatbooster", "markDefeated") && !combatant.defeated) await CombatTracker.prototype._onToggleDefeatedStatus(combatant);
                    let x = token.document.x;
                    let y = token.document.y;
                    if (game.settings.get("combatbooster", "moveToPile")) {
                        canvas.tokens.get(token.id).release();
                        let pileToken = canvas.tokens.placeables.find((t) => t.name.toLowerCase() === "pile");
                        if (pileToken) {
                            x = pileToken.x;
                            y = pileToken.y;
                        } else {
                            x = 0;
                            y = 0;
                        }
                    }

                    await token.document.update(
                        {
                            x: x,
                            y: y,
                        },
                        { animate: false },
                    );
                }
            }
        } else if (CombatBooster.getHpVal(updates) > 0) {
            for (let combatant of game.combat.combatants) {
                if (combatant.token?.id === token.id && combatant.defeated) {
                    await CombatTracker.prototype._onToggleDefeatedStatus(combatant);
                }
            }
        }
    }
  } catch (error) {
    
  }
  
});

Hooks.on("updateCombat", function (combat, updates) {
  try {
    if (!game.combat?.started) return;
    if (game.user.isGM && "turn" in updates) {
        const token = canvas.tokens.get(combat.current.tokenId);
        const skip = token?.actor?.hasPlayerOwner && game.settings.get("combatbooster", "ignorePlayer");
        if (game.settings.get("combatbooster", "panCamera")) {
            canvas.animatePan({
                x: token?.center.x,
                y: token?.center.y,
                duration: 300,
            });
        }
        if (game.settings.get("combatbooster", "controlToken") && !skip) {
            canvas.tokens.releaseAll();
            token?.control();
        }
        if (game.settings.get("combatbooster", "renderTokenHUD")) {
            token?.layer.hud.bind(token);
        }
    }
    if (!game.user.isGM && "turn" in updates) {
        const token = canvas.tokens.get(combat.current.tokenId);
        if (game.settings.get("combatbooster", "panCamera") && token.isVisible) {
            canvas.animatePan({
                x: token?.center.x,
                y: token?.center.y,
                duration: 300,
            });
        }
        if (token?.isOwner) {
            if (game.settings.get("combatbooster", "displayNotification")) {
                ui.notifications.info(game.i18n.localize("combatbooster.yourTurn.text"));
            }
        }
    }
  } catch (error) {
    
  }
  
});


Object.byString = function (o, s) {
  s = s.replace(/\[(\w+)\]/g, ".$1"); // convert indexes to properties
  s = s.replace(/^\./, ""); // strip a leading dot
  var a = s.split(".");
  for (var i = 0, n = a.length; i < n; ++i) {
    var k = a[i];
    if (k in o) {
      o = o[k];
    } else {
      return;
    }
  }
  return o;
};
