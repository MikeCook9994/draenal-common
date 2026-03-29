export default class HexbladePatron {
    hookRegistrations = {};

    constructor() {
        this._hexbladesCurse();
    }

    _hexbladesCurse() {
        this.hookRegistrations.hexbladesCurse = {};

        this.hookRegistrations.hexbladesCurse.magicalCunning =
        Hooks.on("dnd5e.preUseActivity", (activity, usageConfig, dialogConfig, messageConfig) => {
            // ActivityUsageConfig._prepareContext() derives the activity state from its parent item
            // However, if "scaling" is in `usageConfig`, _prepareContext() clones the item from its
            // source (`item._source`), which causes any mutations on the activity to be lost
            // Thus, we have mutate the activity the `item._source` path to preserve the changes
            if (activity.item.flags.dnd5e.sourceId !== "Compendium.dnd5e.classes24.Item.phbwlkMagicalCun" || // Activity is "Magical Cunning" 
                !activity.actor.sourcedItems.has("Compendium.draenal-common.classes.Item.XUyIUOGMYIIXGWa6") // Actor has "Hexblade's Curse" feature
            ) {
                return true;
            }

            const sourceActivity = activity.item._source.system.activities[activity.id];
            const itemConsumption = new sourceActivity.consumption.targets[0].constructor({
                target: activity.actor.sourcedItems.get("Compendium.dnd5e.spells24.Item.phbsplHex0000000").first().id,
                type: "itemUses",
                value: -1
            }, { parent: sourceActivity })

            const length = sourceActivity.consumption.targets.push(itemConsumption);
            usageConfig.consume.resources.push(length - 1);
            return true;
        });

        Hooks.on("createItem", (document, options, userId) => {
            if (!options.parent.sourcedItems.has("Compendium.draenal-common.classes.Item.2lXC8zZ1MgCPKyIb") || // skip if the character is not a hexblade or
                (document.flags?.dnd5e?.sourceId !== "Compendium.dnd5e.spells24.Item.phbsplHex0000000" && // the item is not Hex and 
                document.flags?.dnd5e?.sourceId !== "Compendium.dnd5e.classes24.Item.phbwlkMagicalCun" && // the item is not Magical Cunning
                document.flags?.dnd5e?.sourceId !== "Compendium.draenal-common.classes.Item.XUyIUOGMYIIXGWa6") // the item is not hexblade's curse
            ) {
                return;
            }

            // some items can be created at the same time, so we pull the current actor state to confirm
            // everything that's needed is present.
            const actor = game.actors.get(options.parent.id);
            const hex = actor.sourcedItems.get("Compendium.dnd5e.spells24.Item.phbsplHex0000000")?.first();
            const magicalCunning = actor.sourcedItems.get("Compendium.dnd5e.classes24.Item.phbwlkMagicalCun")?.first();

            if (!hex || !magicalCunning) {
                return;
            }

            const sourceObject = magicalCunning.system.activities.get("EK3yOTVml5LbmpmQ").toObject();
            const consumptionUpdate = {
                flags: {
                    draenalCommon: {
                        hexId: hex.id
                    }
                },
                consumption: {
                    targets: [
                        ...sourceObject.consumption.targets
                            .filter(t => t.target !== hex.id && t.target !== sourceObject.flags.draenalCommon?.hexId),
                        {
                            target: hex.id,
                            type: "itemUses",
                            value: -1
                        }
                    ]
                }
            };

            magicalCunning.updateActivity(
                "EK3yOTVml5LbmpmQ",
                foundry.utils.mergeObject(sourceObject, consumptionUpdate));
        });

        Hooks.on("deleteItem", (document, options, userId) => {
            if ((document.flags?.dnd5e?.sourceId !== "Compendium.draenal-common.classes.Item.2lXC8zZ1MgCPKyIb" && // skip if the item is not Hexblade Patron
                document.flags?.dnd5e?.sourceId !== "Compendium.dnd5e.spells24.Item.phbsplHex0000000" && // the item is not Hex and
                document.flags?.dnd5e?.sourceId !== "Compendium.draenal-common.classes.Item.XUyIUOGMYIIXGWa6") // the item is not hexblade's curse
            ) {
                return;
            }

            // if magical cunning has already been removed we don't care
            const actor = game.actors.get(options.parent.id);
            const magicalCunning = actor.sourcedItems.get("Compendium.dnd5e.classes24.Item.phbwlkMagicalCun")?.first();

            if (!magicalCunning) {
                return;
            }

            const sourceObject = magicalCunning.system.activities.get("EK3yOTVml5LbmpmQ").toObject()
            const consumptionUpdate = {
                flags: {
                    "-=draenalCommon": null
                },
                consumption: {
                    targets: [
                        ...sourceObject.consumption.targets.filter(t => t.target !== sourceObject.flags.draenalCommon?.hexId),
                    ]
                }
            };

            magicalCunning.updateActivity(
                "EK3yOTVml5LbmpmQ",
                foundry.utils.mergeObject(sourceObject, consumptionUpdate));
        });
    }
}