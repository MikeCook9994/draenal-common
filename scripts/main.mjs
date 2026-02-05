import { PointSpellcasting, VitalMagic } from "./vitalMagic.js";

export const DC_MODULE_NAME = 'draenal-common';

CONFIG.debug.hooks = false;

(() => {
    Hooks.once('init', async () => {
        console.log("[DC] Initializing Draenal Common Module");
        console.log(`[DC] Module Version: ${game.modules.get(DC_MODULE_NAME).version}`);

        dnd5e.dataModels.spellcasting.SpellcastingModel.TYPES.profane = PointSpellcasting;
    });

    Hooks.once('init', PointSpellcasting.Init);
    Hooks.once('init', VitalMagic.Init);
    Hooks.on("dnd5e.prepareSpellSlots", VitalMagic.PrepareSpellSlots);
})();