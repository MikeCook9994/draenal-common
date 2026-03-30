export function registerActiveEffectAdditions(targetEffectRelativeUuid, sourceFeatureAbsoluteUuid, additionalChanges) {
    return Hooks.on("preUpdateActiveEffect", async (effect, changed, options, userId) => {
        if (!game.user.isGM) {
            return true;
        }

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