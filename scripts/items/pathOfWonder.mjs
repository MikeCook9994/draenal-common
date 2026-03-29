import { registerActiveEffectAdditions } from "../utils.mjs";

export default class PathOfWonder {
    hookRegistrations = {};

    constructor() {
        this._wondrousVitality();
        this._castAndSmash()
    }

    _wondrousVitality() {
        
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
                    mode: CONST.ACTIVE_EFFECT_MODES.ADD
                },
                {
                    key: "system.bonuses.rsak.damage",
                    value: "+@scale.barbarian.rage-damage",
                    mode: CONST.ACTIVE_EFFECT_MODES.ADD
                }
            ]
        );
    }
}