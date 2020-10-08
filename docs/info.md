# info

Fetches entity information from Balcora. Information is summarized by default. If the `--all` flag is set, a [glot.io](https://glot.io/) paste is made with more verbose information in addition to summary and raw json data. A 2.3 version number is always included.

Possible args:

| Arg      | Aliases                      | Description                                                                                                              |
|----------|------------------------------|--------------------------------------------------------------------------------------------------------------------------|
| `-name` | `-n`                         | Name of the entity you're trying to find. It doesn't have to be the whole name; any partial matches are also returned.   |
| `-type` | `-t`, `-category`, `-cat`, `-c` | The entity type. Can be one of three values: `ship`, `wepn`, or `subs`, for Ships, Weapons, and Subsystems respectively. |

Possible flags:

| Flag  | Aliases | Description                                                                                                                                                                                        |
|-------|---------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `--all` | `--a`     | Instead of a summary, BB will fetch and format the whole entity data. This will be stored on [glot.io](https://glot.io/) where you can view the data in verbose, summarized, and raw json formats. |

Example:
```
bb info -n kus_ionc -t wepn
```
The above command asks for any weapons who's name _contains_ `'kus_ionc'`.

BB will return a summary of the entities's info, along with reference links to [balcora-gate](https://www.balcora-gate.com/#/data/reference). If the `--all` flag is specified, the info will be stored in three formats on [glot.io](https://glot.io/) and a link to the paste files is given.

Balcora data includes usage information for weapons and subsystems - you can see which ships use a certain weapon easily, for example.