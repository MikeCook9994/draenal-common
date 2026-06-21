import TheFatesPatron from "./items/theFatesPatron.mjs"
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
        registeredItems.push(new TheFatesPatron());
        registeredItems.push(new CircleOfNightmares());
        registeredItems.push(new Timberwolf());
    });

    Hooks.once('ready', () => {
        CONFIG.DND5E.sourceBooks["Draenal Homebrew"] = "DHB";
        CONFIG.DND5E.sourceBooks["5.5E Player's Handbook"] = "5.5E PHB";
        CONFIG.DND5E.sourceBooks["5.5E Dungeon Master's Guide"] = "5.5E DMG";
        CONFIG.DND5E.sourceBooks["Xanathar's Guide to Everything"] = "XGtE";
        CONFIG.DND5E.sourceBooks["Tasha's Cauldron of Everything"] = "TCoE";
        CONFIG.DND5E.sourceBooks["Eberron: Forge of the Artificer"] = "E:FotA";
        CONFIG.DND5E.sourceBooks["Forgotten Realms: Heroes of Faerun"] = "FR:HoF";
        CONFIG.DND5E.sourceBooks["Ravenloft: The Horrors Within"] = "RL:THW";
    })
})();