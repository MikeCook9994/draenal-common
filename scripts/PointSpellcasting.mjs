export class PointSpellcasting extends dnd5e.dataModels.spellcasting.SpellcastingModel {
    static SpellLevelCosts = [2, 3, 5, 6, 7, 9, 10, 11, 13];

    static Init() {
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

        
        Hooks.on("dnd5e.preActivityConsumption", (activity, usageConfig, messageConfig) => {
            console.log("Pre Activity Consumption Hook Triggered for Point Spellcasting");
            console.log({activity, usageConfig, messageConfig});
        });
    }
    
    /** @override **/
    static get TYPE() {
        return "point";
    }
}