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

    Hooks.on('preUpdateActiveEffect', async (effect, changed, options, userId) => {
        const actor = effect.target;
        const effectIsRage = effect.origin.endsWith(".ActiveEffect.G5XZTi4zYTFiHVll");
        const castAndSmashPresent = actor.sourcedItems.has("Compendium.draenal-common.classes.Item.J9dHLyG43bYxmNC5");
        if (!effectIsRage || !castAndSmashPresent) {
            return true;
        }

        var additionalChanges = [
            {
                key: "system.bonuses.msak.damage",
                value: "+@scale.barbarian.rage-damage",
                mode: CONST.ACTIVE_EFFECT_MODES.ADD
            },
            {
                key: "system.bonuses.rsak.damage",
                value: "+@scale.barbarian.rage-damage",
                mode: CONST.ACTIVE_EFFECT_MODES.ADD
            }
        ];

        // remove additional changes from changes
        const changes = effect.changes.filter(c =>
            !additionalChanges.some(ac => 
                ac.key === c.key &&
                ac.value === c.value &&
                ac.mode === c.mode));

        // put 'em back if it's being enabled
        if (!changed.disabled) {
            changes.push(...additionalChanges);
        }

        foundry.utils.mergeObject(changed, {
            changes: changes
        });

        return true;
    });

    // Hooks.once('init', PointSpellcasting.Init);
    // Hooks.once('init', VitalMagic.Init);
    // Hooks.on("dnd5e.prepareSpellSlots", VitalMagic.PrepareSpellSlots);
})();