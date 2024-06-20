class CombatBooster {
    static getHpVal(actorData) {
        return Object.byString(actorData.system, game.settings.get("combatbooster", "currentHp"));
    }
}
Hooks.on("updateActor", async function (actor, updates) {
    try {
        if (!game.combat?.started || !game.user.isGM || actor.hasPlayerOwner) return;
        const token = actor.token;
        const combatant = token.combatant;
        if (!token || !combatant) return;
        const hp = CombatBooster.getHpVal(updates);
        if (hp === 0) {
            if (!combatant.defeated && game.settings.get("combatbooster", "markDefeated")) await combatant.toggleDefeated();
            if (game.settings.get("combatbooster", "moveToPile")) {
                token.release();
                const pileToken = canvas.tokens.placeables.find((t) => t.name.toLowerCase() === "pile");
                const { x, y } = pileToken ? pileToken.document : { x: 0, y: 0 };
                await token.update({ x, y }, { animate: false });
            }
        } else if (hp > 0 && game.settings.get("combatbooster", "markDefeated")) {
            if (combatant.defeated) await combatant.toggleDefeated();
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
    } catch (error) {}
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
