export class VitalMagic {
    static Init() {
        console.log("[DC:VM] Initializing Vital Magic System SubModule");
        CONFIG.DND5E.spellcasting.vital = {
            label: "Vital Magic",
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
        }
    }

    static PrepareSpellSlots(spells, actor, _) {
        // Path of Wonder Barbarians create their spell slots via Vital Magic, so we need to zero out the default slots
        if (Object.values(actor.classes).some(cls => cls?.identifier === "barbarian" && cls.subclass?.identifier === "path-of-wonder")) {
            console.log(actor);
            for (let slotType in spells) {
                spells[slotType].max = 0;
            }
        }
    }
}