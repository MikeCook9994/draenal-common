import { VitalMagic } from "./vitalMagic.mjs";
import { PointSpellcasting } from "./pointSpellcasting.mjs";

export const DC_MODULE_NAME = 'draenal-common';

CONFIG.debug.hooks = true;

(() => {
    Hooks.once('init', async () => {
        console.log("[DC] Initializing Draenal Common Module");
        console.log(`[DC] Module Version: ${game.modules.get(DC_MODULE_NAME).version}`);

        // dnd5e.dataModels.spellcasting.SpellcastingModel.TYPES.point = PointSpellcasting;
    });

    Hooks.on('updateActiveEffect', async (effect, changes, options, userId) => {
        const actor = effect.target;
        const feature = actor.sourcedItems.get("Compendium.draenal-common.classes.Item.J9dHLyG43bYxmNC5");
        if (!effect.origin.endsWith(".ActiveEffect.G5XZTi4zYTFiHVll") && feature?.size) {
            return;
        }

        // Check for existing effect. Origin is the base cast and smash effect. That varies
        // Id varies, so you check against the origin which uses the source effect id
        const existingEffect = actor.effects.find(e => e.origin.endsWith(".ActiveEffect.iT5HADHVwWSvXjWv")); 
        if (!existingEffect) {
            const baseEffect = feature.first().effects.contents[0];
            const effectData = {
                ...baseEffect,
                origin: baseEffect.uuid,
            }

            await ActiveEffect.create(effectData, {
                parent: actor
            });
        }

        await existingEffect.update({
            disabled: changes.disabled
        });
    });

    // Hooks.once('init', PointSpellcasting.Init);
    // Hooks.once('init', VitalMagic.Init);
    // Hooks.on("dnd5e.prepareSpellSlots", VitalMagic.PrepareSpellSlots);
})();