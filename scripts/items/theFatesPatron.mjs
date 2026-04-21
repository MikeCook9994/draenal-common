export default class HexbladePatron {
    hookRegistrations = {};

    constructor() {
        this._hexbladesCurse();
    }

    _hexbladesCurse() {
        let killedTarget = null;

        const effortlessAgonyUpgradeHookId = Hooks.on("createItem", (document, options, userId) => {
            if (!game.user.isGM || // skip if user is not the GM or
                !options.parent.sourcedItems.has("Compendium.draenal-common.classes.Item.HP7SJUQSZx72wngA") || // if the character is not a hexblade or
                (document.flags?.dnd5e?.sourceId !== "Compendium.dnd5e.spells24.Item.phbsplHex0000000" && // the item is not Hex and 
                document.flags?.dnd5e?.sourceId !== "Compendium.dnd5e.classes24.Item.phbwlkMagicalCun" && // the item is not Magical Cunning and
                document.flags?.dnd5e?.sourceId !== "Compendium.draenal-common.classes.Item.JuoWB9ngJ4v9L63j") // the item is not hexblade's curse
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

        const effortlessAgonyDowngradeHookId = Hooks.on("deleteItem", (document, options, userId) => {
            if (!game.user.isGM || (document.flags?.dnd5e?.sourceId !== "Compendium.draenal-common.classes.Item.HP7SJUQSZx72wngA" && // skip if the user is not game || item is not Hexblade Patron and
                document.flags?.dnd5e?.sourceId !== "Compendium.dnd5e.spells24.Item.phbsplHex0000000" && // the item is not Hex and
                document.flags?.dnd5e?.sourceId !== "Compendium.draenal-common.classes.Item.JuoWB9ngJ4v9L63j") // the item is not hexblade's curse
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

        const improvedCriticalHookId = this._registerHexbladesCurseAttackModifierHook("dnd5e.preRollAttack", (rollConfig) => {
            rollConfig.rolls.forEach(roll => roll.options.criticalSuccess = 19);
        });

        const bonusDamageHookId = this._registerHexbladesCurseAttackModifierHook("dnd5e.preRollDamage", (rollConfig) => {
            rollConfig.rolls.filter(roll => roll.base)[0].parts.push("1d6");
        });

        const soulSiphonHealHookId = Hooks.on("dnd5e.preRollDamage", (rollConfig, dialogConfig, messageConfig) => {
            if (game.user.isGM && rollConfig.subject.name === "Soul Siphon") {
                dialogConfig.configure = false;
                rollConfig.rolls = [
                    {
                        parts: [
                            "min(@target.attributes.hp.max, (@source.abilities.cha.mod + @source.classes.warlock.levels))",
                        ],
                        data: {
                            source: {
                                ...rollConfig.subject.actor.getRollData()
                            },
                            target: {
                                ...killedTarget.getRollData(),
                            }
                        },
                        options: {
                            properties: [ "mgc" ],
                            type: "healing",
                        }
                    }
                ];
            }

            return true;
        });

        const soulSiphonDeathTriggerHookId = Hooks.on("createActiveEffect", (activeEffect, options, userId) => {
            if (game.user.isGM && activeEffect.id === "dnd5edead0000000") {
                const target = activeEffect.parent;

                const sourceHexblades = this._getCurseSourceHexblades(activeEffect.parent)
                if (sourceHexblades.length > 0) killedTarget = target;

                sourceHexblades.forEach(source => {
                    const hexbladesCurse = source.sourcedItems.get("Compendium.draenal-common.classes.Item.JuoWB9ngJ4v9L63j").first();
                    hexbladesCurse.system.activities.contents[0].use({}, { configure: false }, { create: false });
                });
            }

            return true;
        });

        this.hookRegistrations.hexbladesCurse = {
            effortlessAgonyUpgrade: effortlessAgonyUpgradeHookId,
            effortlessAgonyDowngrade: effortlessAgonyDowngradeHookId,
            improvedCritical: improvedCriticalHookId,
            bonusDamage: bonusDamageHookId,
            soulSiphonTrigger: soulSiphonDeathTriggerHookId,
            soulSiphonHeal: soulSiphonHealHookId
        };
    }

    _registerHexbladesCurseAttackModifierHook(hook, rollConfigMutationCallback) {
        return Hooks.on(hook, (rollConfig, dialogConfig, messageConfig) => {
            if (game.user.isGM &&
                rollConfig.subject.actor.subclasses.hasOwnProperty("hexblade") &&
                messageConfig.data.flags.dnd5e.targets.length === 1
            ) {
                const target = fromUuidSync(messageConfig.data.flags.dnd5e.targets[0].uuid);
                if (this._targetIsCursedBySourceHexblade(rollConfig.subject.actor, target)) {
                    rollConfigMutationCallback(rollConfig);
                }
            }

            return true;
        });
    }

    _targetIsCursedBySourceHexblade(source, target) {
        return target.effects.some(e => {
            if (e.statuses.has("cursed") && e.origin.startsWith("Actor")) {
                const effectSourceActor = game.actors.get(e.origin.split(".")[1]);
                return effectSourceActor.id === source.id;
            }

            return false;
        })
    }

    _getCurseSourceHexblades(actor) {
        return actor.effects
            .filter(e => e.active && e.origin?.startsWith("Actor") && e.statuses.has("cursed"))
            .map(e => game.actors.get(e.origin.split(".")[1]))
            .filter(s => s?.subclasses.hasOwnProperty("hexblade"));
    }
}