/**************
 * COMBAT HUD *
 **************/

 Hooks.on("createChatMessage", function (msg) {
   if(!game.user.isGM || !msg.data.speaker.actor) return;
    const actor = game.actors.get(msg.data.speaker.actor)
    const itemName = msg.data.flavor;
    const item = actor.items.find(i => i.name === itemName);
    if(!item) return;
    let oldItemsIds = actor.getFlag(COMBAT_BOOSTER_MODULE_NAME,"recentItems") ?? [];
    let newItemsIds = [item.id]
    for(let itemId of oldItemsIds){
      if(itemId !== item.id){
        newItemsIds.push(itemId)
      }
    }
    actor.setFlag(COMBAT_BOOSTER_MODULE_NAME,"recentItems",newItemsIds)
  
  });

  Hooks.on("renderTokenHUD", function (HUD,html,data) {
    const actor = game.actors.get(data.actorId);
      let recentItems = actor.getFlag(COMBAT_BOOSTER_MODULE_NAME,"recentItems") || [];
      let cols = recentItems.length > 5 ? 4 : recentItems.length;
      let recentItemsHtml = `<div class="combatHUD" styles="width:${cols*50}px;">`;
      if(!actor || recentItems.length === 0) return;
      for(let itemId of recentItems){
        let item = actor.items.find(i => i.id === itemId)
        recentItemsHtml += `<div class="control-icon" name="CBHUDbtn" id="${item.name}">
                  <img src="${item.data.img}" width="36" height="36" title='${item.name}'></i>
                                  </div>`;
      }
      recentItemsHtml += `</div>`;
      const controlIcons = html.find(`div[class="col middle"]`);
        controlIcons.before(recentItemsHtml);
        $(html.find(`div[name="CBHUDbtn"]`)).on("click", test);
      function test(){
        game.dnd5e.rollItemMacro(this.id);
      }
  })