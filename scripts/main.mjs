import HexbladePatron from "./items/hexbladePatron.mjs"
import PathOfWonder from "./items/pathOfWonder.mjs";
import CircleOfNightmares from "./items/circleOfNightmares.mjs";
import Timberwolf from "./items/timberwolf.mjs";

export const DC_MODULE_NAME = 'draenal-common';

CONFIG.debug.hooks = false;

(() => {
    var registeredItems = [];

    Hooks.once('init', () => {
        console.log("[DC] Initializing Draenal Common Module");
        console.log(`[DC] Module Version: ${game.modules.get(DC_MODULE_NAME).version}`);

        registeredItems.push(new PathOfWonder());
        registeredItems.push(new HexbladePatron());
        registeredItems.push(new CircleOfNightmares());
        registeredItems.push(new Timberwolf());
    });
})();