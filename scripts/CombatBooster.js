Hooks.on("updateActor",async function (actor,updates){
    if(game.combat?.started && game.user.isGM && game.settings.get("combatbooster", "markDefeated")){
        let token = canvas.tokens.get(actor.parent.id)
        if(updates.data?.attributes?.hp?.value === 0){
            for(let combatant of game.combat.combatants){
                if(combatant.token.id === token.id){
                    await combatant.update({defeated:true})
                    if(game.settings.get("combatbooster", "moveToPile")){
                        canvas.tokens.get(token.id).release()
                        let x=0
                        let y=0
                        let pileToken = canvas.tokens.placeables.find(t=>t.name==="pile")
                        if(pileToken){
                            x=pileToken.x
                            y=pileToken.y
                        }
                        await token.update({overlayEffect: "icons/svg/skull.svg",x:x,y:y},{animate:false})
                    }else{
                        await token.update({overlayEffect: "icons/svg/skull.svg"})
                    }
                }
            }
        }else if(updates.data?.attributes?.hp?.value > 0){
            for(let combatant of game.combat.combatants){
                if(combatant.token.id === token.id && combatant.data.defeated){
                    await combatant.update({defeated:false})
                    if(token.data.overlayEffect == "icons/svg/skull.svg") await token.update({overlayEffect: ""})
                }
            }
        }
    }
});
