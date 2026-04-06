import { VitalMagic } from "./vitalMagic.mjs";
import { PointSpellcasting } from "./pointSpellcasting.mjs";
import HexbladePatron from "./items/hexbladePatron.mjs"
import PathOfWonder from "./items/pathOfWonder.mjs";

export const DC_MODULE_NAME = 'draenal-common';

CONFIG.debug.hooks = true;

(() => {
    var registeredItems = [];

    Hooks.once('init', () => {
        console.log("[DC] Initializing Draenal Common Module");
        console.log(`[DC] Module Version: ${game.modules.get(DC_MODULE_NAME).version}`);
        // dnd5e.dataModels.spellcasting.SpellcastingModel.TYPES.point = PointSpellcasting;

        registeredItems.push(new PathOfWonder());
        registeredItems.push(new HexbladePatron());
    });

    // Hooks.once('init', PointSpellcasting.Init);
    // Hooks.once('init', VitalMagic.Init);
    // Hooks.on("dnd5e.prepareSpellSlots", VitalMagic.PrepareSpellSlots);
})();