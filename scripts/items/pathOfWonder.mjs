import { registerActiveEffectAdditions } from "../utils.mjs";
import { PointSpellcasting } from "../vitalMagic.mjs";

export default class PathOfWonder {
    hookRegistrations = {};

    constructor() {
        this._wondrousVitality();
        this._castAndSmash()
        this._unnaturalRecovery();
    }

    _wondrousVitality() {
        CONFIG.DND5E.spellcasting["point"] = {
            label: "Spellpoints",
            type: "point",
            cantrips: true,
            prepares: true,
            order: 30,
            img: "systems/dnd5e/icons/spell-tiers/{id}.webp",
            table: [
                [1],
                [1],
                [1, 1],
                [1, 1],
                [1, 1, 1],
                [1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1]
            ],
            progression: {
                point_third: {
                    label: "Third",
                    divisor: 3
                }
            }
        };

        dnd5e.dataModels.spellcasting.SpellcastingModel.TYPES.point = PointSpellcasting;
    }

    _castAndSmash() {
        // Spell Fury
        this.hookRegistrations.castAndSmash = registerActiveEffectAdditions(
            ".ActiveEffect.G5XZTi4zYTFiHVll",
            "Compendium.draenal-common.classes.Item.J9dHLyG43bYxmNC5",
            [
                {
                    key: "system.bonuses.msak.damage",
                    value: "+@scale.barbarian.rage-damage",
                    mode: CONST.ACTIVE_EFFECT_CHANGE_TYPES.ADD
                },
                {
                    key: "system.bonuses.rsak.damage",
                    value: "+@scale.barbarian.rage-damage",
                    mode: CONST.ACTIVE_EFFECT_CHANGE_TYPES.ADD
                }
            ]
        );
    }

    _unnaturalRecovery() {
        const rageHealingHookId = Hooks.on("dnd5e.preRollDamage", (rollConfig, dialogConfig, messageConfig) => {
            const unnaturalRecoveryFeature = rollConfig.subject.actor.sourcedItems.get("Compendium.draenal-common.classes.Item.x6ApTszAvoIuj3zi")?.first();
            
            // configure the heal to disable the roll config
            if (rollConfig.subject.actor.isOwner && rollConfig.subject.id === "0ZNqlD7sAapd67Nq") {
                dialogConfig.configure = false;
            }
            // trigger the heal activity when rolling damage with the unnatural recovery feature
            // this is missing a bunch of checks, but I guess it's good enough
            else if (rollConfig.subject.actor.isOwner && unnaturalRecoveryFeature && true /* how the fuck do you determine if the attack is strength based? */) {
                unnaturalRecoveryFeature.system.activities.get("0ZNqlD7sAapd67Nq").use();
            }

            return true;
        });

        this.hookRegistrations.unnaturalRecovery = {
            rageHealing: rageHealingHookId
        }
    }
}