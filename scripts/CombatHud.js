/**************
 * COMBAT HUD *
 **************/

Hooks.on("createChatMessage", function (msg) {
  if (!game.user.isGM || !msg.data.speaker.actor || !game.settings.get("combatbooster", "enableHud")) return;
  const actor = game.actors.get(msg.data.speaker.actor);
  const itemName = msg.data.flavor || msg.data.flags.betterrolls5e?.entries[0]?.title;
  const item = actor.items.find((i) => i.name === itemName);
  if (!item) return;
  let oldItemsIds =
    actor.getFlag(COMBAT_BOOSTER_MODULE_NAME, "recentItems") ?? [];
  let newItemsIds = [item.id];
  for (let itemId of oldItemsIds) {
    if (itemId !== item.id) {
      newItemsIds.push(itemId);
    }
  }
  actor.setFlag(COMBAT_BOOSTER_MODULE_NAME, "recentItems", newItemsIds);
});

Hooks.on("renderTokenHUD", function (HUD, html, data) {
  if(!game.settings.get("combatbooster", "enableHud")) return;
  const actor = game.actors.get(data.actorId);
  let recentItems =
    actor.getFlag(COMBAT_BOOSTER_MODULE_NAME, "recentItems") || [];
  const maxCol = game.settings.get("combatbooster", "hudMaxCol") || HUD.object.data.width*2;
  const maxEls = game.settings.get("combatbooster", "hudRecent");
  let cols = recentItems.length > maxCol ? maxCol : recentItems.length;
  let recentItemsHtml = `<div class="combatHUD" style="width:${cols * 50}px;">`; //
  if (!actor || recentItems.length === 0) return;
  for (let i = 0; i < Math.min(maxEls,recentItems.length); i++) {
    let itemId = recentItems[i];
    let item = actor.items.find((i) => i.id === itemId);
    recentItemsHtml += `<div class="control-icon" name="CBHUDbtn" id="${item.name}">
                  <img src="${item.data.img}" width="36" height="36" title='${item.name}'></i>
                                  </div>`;
  }
  recentItemsHtml += `</div>`;
  const controlIcons = html.find(`div[class="col left"]`);
  controlIcons.before(recentItemsHtml);
  const cHUDWidth = $(".combatHUD").outerWidth(true);
  const hudWidth = $(html).outerWidth(true);
  const diff = (hudWidth - cHUDWidth)/2;
  $(".combatHUD").css({ left: diff });
  $(html.find(`div[name="CBHUDbtn"]`)).on("click", test);
  function test() {
    game.dnd5e.rollItemMacro(this.id);
  }
});
