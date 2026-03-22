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

    Hooks.on("preCreateItem", async (document, data, options, userId) => {
        console.log("preCreateItem", { document, data, options, userId });
    })

    // Hooks.once('init', PointSpellcasting.Init);
    // Hooks.once('init', VitalMagic.Init);
    // Hooks.on("dnd5e.prepareSpellSlots", VitalMagic.PrepareSpellSlots);
})();