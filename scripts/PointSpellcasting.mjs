export class PointSpellcasting extends dnd5e.dataModels.spellcasting.MultiLevelSpellcasting {
    static SpellLevelCosts = [2, 3, 5, 6, 7, 9, 10, 11, 13];

    // Spellcasting

    // constructor(data={}, { key, ...options } = {})

    // SCHEMA
    // img: file path -- file path to some avatar iamge for this method
    // label: string -- human readable label for this method, related to the key
    // order: number -- order presented in a drop down relative to other spellcasting methods
    // type: string -- spellcasting type descriptor related to its behavior. Different than the key (e.g. Pact Magic - type: "single", key: "pact"; Spellcasting - type: "multi", key: "spell"). 
    //    I think the intent here is that multiple spellcasting methods can share the same type.

    // PROPERTIES

    // TYPES -- This is the literal object that the spellcasting models are added to
    // TYPE -- different than the key for this spellcasting model in the TYPES object, this is overridden by subtypes
    // KEY -- whatever the key that is used when assigning the spellcasting model into the config

    // PUBLIC API
    // fromConfig() -- just an initialization method
    // getLabel(options = {}) -- returns the label in the schema

    // Slot Spellcasting

    // SCHEMA
    // cantrips -- can has cantrips?
    // exclusive.slots -- ensures that spell slots belonging to this method can only be used to cast spells that belong to the method
    // exclusive.spells -- ensures that spells belonging to this method can only be cast using spell slots of this method
    // prepares -- does this method prepare spells?
    // progression.divisor -- How much each level of a spellcasting class with this progression contributes to the full spell slot progression.
    //  - A paladin level is worth half of a cleric level. An Eldritch Knight level is worth a third of a level.
    // divisor.label -- the progression label (.e.g. "Half Caster", "Third Caster")
    // divisor.roundUp -- third caster rounds down, half caster rounds up

    // PROPERTIES
    // isLR - recover spell slots on a long rest? Deriverd from recovery
    // isSR - recover spell slots on a short rest? Derived from recovery
    // recovery - Each rest type in DND5E.restTypes that list the spellcasting type's key in its `recoverySpellSlotTypes` array.
    // slots - does this spellcasting method use spell slots?

    // PUBLIC API
    // calculateSlots(level) -- [unimplemented] Calculates the spell slots available for each level for  given character level `level`
    // computeProgression(progression, actor, cls, spellcasting, count) -- determines the contribution of an actor's class levels towards the overall spellcasting progression.
    //  - Returns a number representing the number of full progression levels of the method.
    // getAvailableLevels(actor) -- determines the maximum number of spell levels available to this actor for each spell level
    // getSpellSlotKey(level) -- gets the key for spell slot data of a given level in the actor's data
    // prepareSlots(spells, actor, progression) -- [unimplemented] creates the spell slot data on the actor for each spell level including the label, level, max slots, and type of progression.

    // Multi-Level Spellcasting

    // SCHEMA
    // table: int[][] -- the spell slot progression table of a single-class full caster.

    // PROPERTIES
    // TYPE = "multi"

    // PUBLIC API
    // getLabel({ level } = {}) -- gets the spell slot level's label
}

function Init() {
    CONFIG.DND5E.restTypes.long.recoverSpellSlotTypes.add("point");
    CONFIG.DND5E.spellcasting.spellpoints = {
        label: "Spell Points",
        type: "points",
        cantrips: true,
        prepares: true,
        order: 5,
        progresion: CONFIG.DND5E.spellcasting.progression,
        table: {
            1: { max: 1 },
            3: { max: 2 },
            5: { max: 3 },
            7: { max: 4 },
            9: { max: 5 },
            11: { max: 6 },
            13: { max: 7 },
            15: { max: 8 },
            17: { max: 9 }
        }
    };

    CONFIG.DND5E.activityConsumptionTypes.spellPoints = {
        label: "Spell Points",
        consume: ConsumptionTargetData.consumeSpellSlots,
        consumptionLabels: ConsumptionTargetData.consumptionLabelsSpellSlots,
        scalingModes: [{ value: "level", label: "" }],
        validTargets: ConsumptionTargetData.validSpellSlotsTargets
    };
    
    Hooks.on("dnd5e.preActivityConsumption", (activity, usageConfig, messageConfig) => {
        console.log("Pre Activity Consumption Hook Triggered for Point Spellcasting");
        console.log({activity, usageConfig, messageConfig});
    });
}