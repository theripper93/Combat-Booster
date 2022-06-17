/**************
 * COMBAT HUD *
 **************/
Hooks.once("init", function () {
  if (game.system.id == "dnd5e") {
    Hooks.on("createChatMessage", function (msg) {
      try{
        if (
          !game.user.isGM ||
          !msg.data.speaker.actor ||
          !game.settings.get("combatbooster", "enableHud")
        )
          return;
        const actor = game.actors.get(msg.data.speaker.actor);
        const messageContent = $(msg.data.content);
        if(!messageContent.length)return;
        const itemId = messageContent[0].dataset?.itemId;
        if (!itemId) return;
        let oldItemsIds =
          actor.getFlag(COMBAT_BOOSTER_MODULE_NAME, "recentItems") ?? [];
        let newItemsIds = [itemId];
        for (let itemIdo of oldItemsIds) {
          if (itemIdo !== itemId) {
            newItemsIds.push(itemIdo);
          }
        }
        actor.setFlag(COMBAT_BOOSTER_MODULE_NAME, "recentItems", newItemsIds);
      }catch(e){}
    });

    Hooks.on("renderTokenHUD", function (HUD, html, data) {
      if (!game.settings.get("combatbooster", "enableHud")) return;
      const actor = game.actors.get(data.actorId);
      let recentItems =
        actor.getFlag(COMBAT_BOOSTER_MODULE_NAME, "recentItems") || [];
      const maxCol =
        game.settings.get("combatbooster", "hudMaxCol") ||
        HUD.object.data.width * 2;
      const maxEls = game.settings.get("combatbooster", "hudRecent");
      let cols =
        Math.min(maxEls, recentItems.length) > maxCol
          ? maxCol
          : Math.min(maxEls, recentItems.length);
      let recentItemsHtml = `<div class="combatHUD" style="width:${
        cols * 50
      }px;">`; 
      if (!actor || recentItems.length === 0) return;
      for (let i = 0; i < Math.min(maxEls, recentItems.length); i++) {
        let itemId = recentItems[i];
        let item = actor.items.find((i) => i.id === itemId);
        if (item) {
          recentItemsHtml += `<div class="control-icon" name="CBHUDbtn" id="${item.name}">
                  <img src="${item.data.img}" width="36" height="36" title='${item.name}'></i>
                                  </div>`;
        }
      }
      recentItemsHtml += `</div>`;
      const controlIcons = html.find(`div[class="col left"]`);
      controlIcons.before(recentItemsHtml);
      const cHUDWidth = $(".combatHUD").outerWidth(true);
      const hudWidth = $(html).outerWidth(true);
      const diff = (hudWidth - cHUDWidth) / 2;
      $(".combatHUD").css({ left: diff });
      $(html.find(`div[name="CBHUDbtn"]`)).on("click", test);
      function test() {
        game.dnd5e.rollItemMacro(this.id);
      }
    });
  }
});
