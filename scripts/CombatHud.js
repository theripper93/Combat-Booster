/**************
 * COMBAT HUD *
 **************/
Hooks.once("init", function () {
    if (game.system.id != "dnd5e") return;

    Hooks.on("dnd5e.postUseActivity", (activity) => {
        const item = activity.item;
        const actor = item.actor;
        const token = actor.token;
        const actorId = token?.actorId ?? actor.id;

        const protoActor = game.actors.get(actorId);
        const oldItemsIds = protoActor.getFlag(COMBAT_BOOSTER_MODULE_NAME, "recentItems") ?? [];
        const newItemsIds = [item.id, ...oldItemsIds.filter((id) => id !== item.id)];
        setTimeout(() => {
            protoActor.setFlag(COMBAT_BOOSTER_MODULE_NAME, "recentItems", newItemsIds);
        }, 2000);
    });

    Hooks.on("renderTokenHUD", function (HUD, html, data) {
        if (!game.settings.get("combatbooster", "enableHud")) return;
        const actor = game.actors.get(data.actorId);
        if (!actor) return;
    
        let recentItems = actor.getFlag(COMBAT_BOOSTER_MODULE_NAME, "recentItems") || [];
        if (recentItems.length === 0) return;
    
        const maxCol = game.settings.get("combatbooster", "hudMaxCol") || HUD.object.document.width * 2;
        const maxEls = game.settings.get("combatbooster", "hudRecent");
        let cols = Math.min(maxEls, recentItems.length) > maxCol ? maxCol : Math.min(maxEls, recentItems.length);
    
        const combatHUD = document.createElement("div");
        combatHUD.className = "combatHUD";
        combatHUD.style.width = `${cols * 50}px`;
    
        for (let i = 0; i < Math.min(maxEls, recentItems.length); i++) {
            let itemId = recentItems[i];
            let item = actor.items.find(i => i.id === itemId);
            if (item) {
                const iconDiv = document.createElement("div");
                iconDiv.className = "control-icon";
                iconDiv.setAttribute("name", "CBHUDbtn");
                iconDiv.id = item.name;
    
                const img = document.createElement("img");
                img.src = item.img;
                img.width = 36;
                img.height = 36;
                img.title = item.name;
    
                iconDiv.appendChild(img);
                combatHUD.appendChild(iconDiv);
            }
        }
    
        const controlIcons = html.querySelector('div.col.left');
        if (controlIcons && controlIcons.parentNode) {
            controlIcons.parentNode.insertBefore(combatHUD, controlIcons);
        }
    
        combatHUD.querySelectorAll('div[name="CBHUDbtn"]').forEach(btn => {
            btn.addEventListener("click", function () {
                dnd5e.documents.macro.rollItem(this.id);
            });
        });
    });
    
});
