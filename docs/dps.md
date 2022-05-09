# dps

Calculates the DPS a given source will do to a given target per second. 

## Possible Args:

| Arg      | Aliases | Description                                    |
|----------|---------|------------------------------------------------|
| `-source`   | `-s`, `-src` | The source of the damage. |
| `-target` | `-t`, `-trg` | The target

## Possible Flags:

None.

## Example:

```
bb -src hgn_kineticautogun -t vgr_resourcecollector
```

The above will return the ideal, raw, DPS of a Hiigaran interceptor's gun ('hgn_kineticautogun') vs a Vaygr resource collector.

**⚠️ DISCLAIMER:** Nearly all weapons will deal much lower DPS than the returned value of this command; an interceptor will spend at least 50% of its engagement time flying away from the target after a firing pass, not to mention the various flight maneuvers. Most of all, the HW2 engine is less than perfect, and so are the various flight AIs - even capital ships can waste a lot of time not firing weapons. On top of all of this, weapons can miss and can also be blocked!