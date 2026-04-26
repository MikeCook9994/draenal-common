import HexbladePatron from "./items/hexbladePatron.mjs"
import PathOfWonder from "./items/pathOfWonder.mjs";
import CircleOfNightmares from "./items/circleOfNightmares.mjs";
import Timberwolf from "./items/timberwolf.mjs";
import Druid from "./items/druid.mjs";

export const DC_MODULE_NAME = 'draenal-common';

CONFIG.debug.hooks = false;

(() => {
    var registeredItems = [];
    var transformingDruid = undefined;

    Hooks.once('init', () => {
        console.log("[DC] Initializing Draenal Common Module");
        console.log(`[DC] Module Version: ${game.modules.get(DC_MODULE_NAME).version}`);

        registeredItems.push(new PathOfWonder());
        registeredItems.push(new HexbladePatron());
        registeredItems.push(new CircleOfNightmares());
        registeredItems.push(new Timberwolf());
        registeredItems.push(new Druid());
    });
})();