export default class CircleOfNightmares {
    hookRegistrations = {};

    constructor() {
        this._fedByFear();
        this._wakingNightmare();
    }

    _fedByFear() {
// Fed By Fear
//  Fear Dice are part of the item
//    - Automatically trigger gain on attack hit
//    - Don't think I can do saving throws easily, would need to look at roll data
//    - Rest on Long Rest
//  Sudden Uncertainty
//    - Utility Activity, has limited uses
//  Painful Accessory
//    - Damage Activity
//  Nightmarish Torment
//    - Damage Activity, choose effect and save from options

    }

    _wakingNightmare() {
// Waking Nightmare
//   Utility Activity to apply effect
//   Aura of Fear
//     - Can't automate the fear until we have actor regions
//   Druidic Violence
//     - Simply part of the waking nightmare effect
//   Shrouded in Shadow
//     - Heal activity
//     - dnd5e.postRoll watches for any of the fed by fear activities, notes the amount rolled for the fear dice and triggers the heal activity
//     - dnd5e.preRollDamage watches for heal activity, replaces the roll with the static number
    }
}