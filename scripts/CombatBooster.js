Hooks.on("updateActor", async function (actor, updates) {
  if (
    game.combat?.started &&
    game.user.isGM &&
    actor.type == "npc" &&
    game.settings.get("combatbooster", "markDefeated")
  ) {
    let token = actor.parent
      ? canvas.tokens.get(actor.parent.id)
      : canvas.tokens.placeables.find((t) => t.actor.id == actor.id);
    if (!token) return;
    if (updates.data?.attributes?.hp?.value === 0) {
      for (let combatant of game.combat.combatants) {
        if (combatant.token?.id === token.id) {
          await combatant.update({ defeated: true });
          if (game.settings.get("combatbooster", "moveToPile")) {
            canvas.tokens.get(token.id).release();
            let x = 0;
            let y = 0;
            let pileToken = canvas.tokens.placeables.find(
              (t) => t.name.toLowerCase() === "pile"
            );
            if (pileToken) {
              x = pileToken.x;
              y = pileToken.y;
            }
            await token.update(
              { overlayEffect: "icons/svg/skull.svg", x: x, y: y },
              { animate: false }
            );
          } else {
            await token.update({ overlayEffect: "icons/svg/skull.svg" });
          }
        }
      }
    } else if (updates.data?.attributes?.hp?.value > 0) {
      for (let combatant of game.combat.combatants) {
        if (combatant.token?.id === token.id && combatant.data.defeated) {
          await combatant.update({ defeated: false });
          if (token.data.overlayEffect == "icons/svg/skull.svg")
            await token.update({ overlayEffect: "" });
        }
      }
    }
  }
});

Hooks.on("updateCombat", function (combat, updates) {
  if (game.user.isGM && "turn" in updates) {
    const token = canvas.tokens.get(combat.current.tokenId);
    if (game.settings.get("combatbooster", "panCamera")) {
      canvas.animatePan({
        x: token.center.x,
        y: token.center.y,
        duration: 300,
      });
    }
    if (game.settings.get("combatbooster", "controlToken")) {
      canvas.tokens.releaseAll();
      token.control();
    }
    if (game.settings.get("combatbooster", "renderTokenHUD")) {
      token.layer.hud.bind(token);
    }
  }
  if(!game.user.isGM && "turn" in updates) {
    const token = canvas.tokens.get(combat.current.tokenId);
    if (token.isOwner) {
      const soundPath = game.settings.get("combatbooster", "soundPath")
      if(soundPath){
        AudioHelper.play(
          {
            src: soundPath,
            volume: game.settings.get("combatbooster", "soundVolume"),
            loop: false,
          },
          false
        );
      }
      if(game.settings.get("combatbooster", "displayNotification")){
        ui.notifications.info(game.i18n.localize("combatbooster.yourTurn.text"))
      }
    }
  }
});
