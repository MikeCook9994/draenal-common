export default class Timberwolf {
    hookRegistrations = {};

    constructor() {
        this._scentOfBlood();
    }

    _scentOfBlood() {
        const scentOfBloodBonusDamageHookId = Hooks.on("dnd5e.preRollDamage", (rollConfig, dialogConfig, messageConfig) => {
            const timberwolfItem = rollConfig.subject.actor.sourcedItems.get("Compendium.draenal-common.equipment.Item.lZQ9oZq5Olxo9L2f")?.first();
            if (rollConfig.subject.actor.isOwner &&
                timberwolfItem?.id === rollConfig.subject.item.id &&
                messageConfig.data.flags.dnd5e.targets.length === 1 &&
                fromUuidSync(messageConfig.data.flags.dnd5e.targets[0].uuid).system.attributes.hp.pct <= 50
            ) {
                rollConfig.rolls.push({
                    base: false,
                    parts: ["1d4"],
                    data: rollConfig.subject.actor,
                    options: {
                        properties: [ "mgc" ],
                        types: ["necrotic"],
                        type: "necrotic",
                    }
                });
            }

            return true;
        });

        this.hookRegistrations.scentOfBlood = {
            scentOfBloodBonusDamage: scentOfBloodBonusDamageHookId
        };
    }
}