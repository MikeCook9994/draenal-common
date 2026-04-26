export default class Druid {
    hookRegistrations = {};

    constructor() {
        this._wildShape();
    }

    _wildShape() {
        Hooks.on('dnd5e.postActivityConsumption', (activity) => {
            if (activity.item.flags.dnd5e.sourceId === "Compendium.dnd5e.classes24.Item.phbdrdWildShape0" && 
                activity.item.actor.isOwner
            ) {
                transformingDruid = activity.item.actor;
            }
        })

        Hooks.on('preRenderCompendiumBrowser', (application, context) => {
            if (transformingDruid) {
                let sourceKey = `${transformingDruid.name} Forms`;
                application.options.filters.locked.additional.source =
                context.filters.additional.source = {
                    [sourceKey.slugify({strict: true})]: 1
                };
                context.filterDefinitions.set("source", {
                    label: "DND5E.SOURCE.FIELDS.source.label",
                    type: "set",
                    config: {
                        keyPath: "system.source.slug",
                        choices: {
                            [sourceKey.slugify({strict: true})]: sourceKey
                        }
                    }
                })
                transformingDruid = undefined;
            }
        });
    }
}