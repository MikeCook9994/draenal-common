export function registerActiveEffectAdditions(targetEffectRelativeUuid, sourceFeatureAbsoluteUuid, additionalChanges) {
    return Hooks.on("preUpdateActiveEffect", async (effect, changed, options, userId) => {
        const actor = effect.target;
        const isTargetEffect = effect.origin.endsWith(targetEffectRelativeUuid);
        const targetActorHasFeature = actor.sourcedItems.has(sourceFeatureAbsoluteUuid);
        if (!isTargetEffect || !targetActorHasFeature) {
            return true;
        }

        // remove additional changes from changes
        const changes = effect.changes.filter(c =>
            !additionalChanges.some(ac => 
                ac.key === c.key &&
                ac.value === c.value &&
                ac.mode === c.mode));

        // put 'em back if it's being enabled
        if (!changed.disabled) {
            changes.push(...additionalChanges);
        }

        foundry.utils.mergeObject(changed, {
            changes: changes
        });

        return true;

    });
}

// this code adds a secondary active effect instead of amending an existing one.
// const existingEffect = actor.effects.find(e => e.origin.endsWith(".ActiveEffect.iT5HADHVwWSvXjWv")); 
// if (!existingEffect) {
//     const baseEffect = feature.first().effects.contents[0];
//     const effectData = {
//         ...baseEffect.toObject(),
//         transfer: false,
//         disabled: changes.disabled,
//         origin: baseEffect.uuid,
//     }

//     await ActiveEffect.create(effectData, {
//         parent: actor
//     });

//     return;
// }

// await existingEffect.update({
//     ...effect.constructor.getInitialDuration(),
//     disabled: changes.disabled
// });