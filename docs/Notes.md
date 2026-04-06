## Open Questions

- How does multiclassed Pact Magic + Spellcasting work?
  - observe the consumption UX when casting
  - **A:** Pact Magic spells are a separate section from available leveled spells.
  - **A:** How are things like spellcasting method and source class updated?
    - When a spell is added to a sheet, the spellcasting method is determined by `SpellData.onDropCreate`
      1. The method of the spellbook section the item was dropped onto
      2. The actor's "first" spellcasting method
      3. The "spell" method (multi)
    - Deep down in the document creation logic, `SpellData._preCreate` method does sanity checks
      1. Automatically prepares the spell for NPCs && Cantrips
      2. Sets the spell's source class and spellcasting method
         1. Returns if class is set or method is innate/atwill.
         2. If the spell method is not "spell" (multi level spellcasting), find classes with that spellcasting type, if there is one set the source class as that and update the spellcasting method to match the source class
         3. If there's only one spellcasting class, set the source class as that class, spellcasting method is updated to match the class
         4. Find classes that spell is on the list for, set source class as the first of those, spellcasting method updated to match the class
    - There appears to be a bug in this logic: If you had two spellcasting classes that use a non-"spell" spellcasting method, you won't set the source class.
        - Just change altClasses.size === 1 to `>= 1`
  - **A:** The Spells "spellcasting type" determines what section is shows up under
  - **A:** When casting the spell, you can choose to consume a warlock slot or a spellcasting slot (and at which level)
- Understand which spellcasting model to extend
  - Map out the schemas for the models and see how they're used
  - Do we *need* to have slots for us to get the behavior we want for free?
- How do I modify an item when its added to the character sheet? (or as its on the character sheet)
  - We want to automatically set the spellcasting model (if possible)

## Code Analysis

- `ActivityUsageDialog` (`activity-usage-dialog.mjs`)
  - extended if the default activity usage dialog doesn't work
    - This only appears to be done for activities with profiles (enchantment, transformations)

- `ConsumptionTargetData` (`consumption-target-field.mjs`)
  - It feels like should be able to be extended to add new consumptionMethods, but maybe that isn't necessary
  - the individual consumption methods shouldb be resolved through the config `DND5E.activityConsumptionTypes`
  - This is instanced directly in `ActivitySheet` and used for building the activation config
- `ConsumptionTargetFields` (`consumption-target-field.mjs`)
  - This is class is directly instanced in the `BaseActivityData` schema
- Considering this, extending this class does not feel like the correct course of action.
  - It seems anything that needs to be accomplished could be done through the generic "attributes" consumption
  - I can actually extend `ConsumptionTargetData` via its prototype?
    - `consumeSpellPoints(config, updates)`
    - `consumptionLabelsSpellPoints(config, { consumed })`
    - `validSpellPointsTargets()`

- `ActivitySheet` (`activity-sheet.mjs`)
  - this defines the activity config form that is displayed when modifying the configuration for an item's activity.
  - `active/activation.hbs` --> `activity/parts/activity-consumption.hbs` defines the "Consume Spell Slot" option.
  - `_prepareActivationContext` builds the data handed to the template

- `CastSheet` (`cast-sheet.mjs`)
  - this defines the activity config form for a spell cast through an item.
  - The methods in `DEFAULT_OPTIONS.actions` refer to the actions tied to various buttons that can show up on the form.
    - `addEffect`/`addDamage` show up on the effect tab (damage doesn't always display)
    - `addConsumption`/`addRecovery` shows on the consumption tab

- `SpellcastingModel` (`spellcasting-model.mjs`)
  - `exclusive.slots` ensures that spell slots belonging to this method can only be used to cast spells that belong to the method
    - Exclusive spell slots cannot be used to cast spells that do not share the same spellcasting method.
  - `exclusive.spells` ensures that spells belonging to this method can only be cast using spell slots of this method
    - Exclusive spells can only be cast with spell slots that match that method
  - Most of the spellcasting interface comes from `SlotSpellcasting`
    - I don't think there would be any point in inheriting from it without just inheriting from `MultiLevelSpellcasting`
      - `calculateSlots` would need to be overridden
        - This would work with a modified spell slot table
      - `getAvailableLevels` doesn't work if we have 0 max spell slots for levels 1-5
      - `getSpellSlotKey` would need to return a different key for each spell level. In order to use the same sections as the multi level spellcasting it would need to be the same.
      - `getLabel` doesn't matter if you're using the same section as multi-level casting. Otherwise it doesn't really matter.
      - `prepareSlots` would work with a modified `calculateSlots` or a custom spell slot progression table

- `CONFIG.DND5E.spellcasting`
  - Here a new spellcasting type is defined

- `CONFIG.DND5E.spellLevels`
  - Defines the spell levels and translation keys

- `CONFIG.DND5E.restTypes`
  - `long.recoverSpellSlotTypes` would need the new method's key added to it

- `CONFIG.DND5E.consumableResources[]`
  - Adds the item to the list of "attributes" that can be consumed
  - For the given key path on the actor:
    - decrements the cost from the `.value` field or
    - increments the `.spent` field

- `CONFIG.DND5E.SPELL_SLOT_TABLE` has the full spellcasting table

- `CONFIG.DND5E.activityConsumptionTypes`
  - Configures the activity consumption configuration dialogue for the given consumption type
  - `consume(config: ActivityUseConfiguration, updates: ActivityUsageUpdates)`: function used to consume this type
    - the `updates` object is a mutable object of changes that should be performed to the actor, rather than directly mutating the actor
    - the `config` object is the consumption configuration.
      - I'm assuming you could hook into it to modify it; however, there's definitely a way to modify items as their added to the sheet
      - The second option is preferable
  - `consumptionLabels(config: ActivityUseConfiguration)`: provides label and hint for the consumption document
  - `scalingModes`: a custom scaling mode is the consumption type has variance within itself (e.g. spell slots)
  - `validTargets`: the valid options for the consumption target

- Foundry has the `preCreate{type}` and `create{Type}` hooks that can be used.
  - Can be focused to a particular document type
  - `document`: the document that is going to be created. This is what is mutated
  - `data`: the original data
  - `options`: unused (for me)
  - `userId`: unused (for me)

- Temporary spell slots are a thing. If value (current spell slots) > max spell slots, the spell slot shows up on the sheet at a purple pip that disppears after it's used.

- Hook `'init'`
  - First event fired on startup
  - sheet registrations, `CONFIG` setup, setting registration
- Hook `'i18nInit'`
  - After localization settings have been loaded
- Hook `'setup'`
  - Before UI applications or canvas have been initialized
  - Consumable and Trackable attributes are loaded here
    - Not sure why here instead of in `'init'`
- Hook `'ready'`
  - After UI and canvas have been loaded

## Implementation

- Hooks should be registered within one fo the core foundry hooks listed above
  - This doesn't necessarily seem like it matters? Unless an event can fire before you have setup something, but that shouldn't be possible with the 5e events

- If I want to leverage spell slots
  - `dnd5e.preUseActivity` can be used to exchange the spell slot consumption for hit dice or spell point consumption

- If I want to go the way of subverting spell slots entirely:
  - `preCreateItem` can be used to mutate the consumption fields on items as they're added to the character sheets.
    - find activities (`document.system.activities`) that have consumption with `spellSlot: true`
    - Disable spell slot consumption, add spell points/hit dice consumption
    - Set scaling
  - `CONFIG.DND5E.activityConsumptionTypes` would be assigned the new `SpellPoint` consumption type
  - We would want to modify the base activity configuration dialog, presumably via a hook (`renderActivitySheet`)
    - "Consume spellcasting resource" checkbox
  - We would want to modify the base activity usage dialog, presumably via a hook (`renderActivityUsageDialog`)
    - Scaling shows available levels regardless of box
    - On demand consumption toggle should read "Consume spellcasting resource".
      - Perhaps we can dynamically change this based on the scaling option?
    - Spellcasting resources should be able to be refunded regardless
      - Damage taken from vital magic is included in that.
  - We can extend `ConsumptionTarget...` via its prototype to natively add the `SpellPoints` option
  - `CONFIG.DND5E.consumableResources` might need to have the new resource added to it, might get it for free

- I need to look more into the implications of extending Slot or Multi models instead of the base model
  - if I want to use spell slots, I would use `MultiLevelSpellcastingModel`
  - If I don't wnat to use spell slots, I would use `SpellcastingModel`

- `CONFIG.DND5E.spellcasting` would be assigned the new spellcasting model

## User Interface Thoughts

- Configuration
  - If the spellcasting method is spell points/vital magic change the consumption label appropriately
    - The actual field remains the same

- On cast:
  - Present level options (w/ number spell points and/or hit dice)
  - If spell points/vital magic option, replace "consume spell slot" w/ appropriate consumption
    - The visibility of this is tied to the "consume spell slot" option in the activity's consumption config
    - Should probably just replace the text. The actual flag should be the same.
    - This should probably let the code work through the spellcasting and consumption model as normal

- Sheet:
  - Don't know how to represent once a days (6+)
    - This isn't something I need to figure out to get Path of Wonder working
  - Hit Dice don't need a special display
  - Spell Point bar can be injected displayed somewhere on the sheet
    - stealing hit dice bar format would be easiest I think

## Rambling

- Point spellcasting should use the same spellbook sections for its leveled spells as multi level spellcasting
- That requires the `getSpellSlotKey` method to return `spell{level}` for each spell slot level
  - this is indexed separately in the spellbook data; however that key is used in the actor's spell data for the following:
    - tracking available spell slots per level (`_trackedSpellAttributes`)
      - Doesn't matter, we're not using actual spell slots
    - You can favorite spell slots of a particular level by dragging the header to the favorites section. The section's key is used e.g. `spell{level}`
      - Doesn't matter because we'd want to track spell points instead
    - used to override the number of available spell slots
      - Doesn't matter
    - used to build the usage config and changes when casting a spell that requires a spell slot
      - Extending `ConsumptionTargetData` allows us to consume spell points properly
- Spellbook layout seems to be the only place where we specifically want the system to think we're the same as multi-level.

## Get Spell Slot Key

### Usages

1. `dnd5e.mjs:350`: For spellcasting methods that use slots (`method.slots`), for each valid spell level (0-9), the key `spells.{lvl_key}.value` is added to the list of attributes that can be consumed
  * You can append to this list directly, but you'd have to ensure the consumption config later uses the correct key and that key  exists in the actor data (`actor.system.spells.{lvl_key}.value`).
    * The first probably comes for free as the key would be configured on the activity.
2. `character-sheet.mjs:1149`: For spellcasting methods that use slots (`method.slots`), used as the id for dragData
  * I believe this this most notable for favorite data? If you favorite a particular number of spell slots
3. `base-actor-sheet.mjs:595:605`: for each available spell level, a section of the spellbook is registered under that key. This key also informs the max and currently available slots. It's also used to define the a `slot` property on the section that I can't see an obvious use of.
4. `actor-spellbook.hbs:35`: references this properly through the spellbook context. Changing the number of spell slots is bound to the `system.spells.{key}.value` on the actor.
5. `spell-slots.config.mjs:55`: uses the key to override the number of spell slots on an actor at a given level. Can only override if it uses spell slots.
  * This is fine. we don't care about this flow, though you may want to override the number of spell points
6. `mixin.mjs:463`: if an activity uses a spell and requires a spell slot, it gets the spell slot level from the actor data using the linked spell's method.
  * This feels weird as hell.
